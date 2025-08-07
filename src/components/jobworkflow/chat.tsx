import { useChat } from "@ai-sdk/react";
import type { Attachment, Message } from "ai";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Message as PreviewMessage } from "./message";
import { useScrollToBottom } from "./use-scroll-to-bottom";
import type { Chat } from "../../lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";
import apiClient from "@/lib/api";
import { BotIcon } from "./icons";
import { Markdown } from "./markdown";

interface EvaluationForm {
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
}

type EvaluationQuestion = {
  id: string;
  question: string;
  placeholder: string;
};

const getEvaluationQuestions = (jobId: string) => {
  const res = apiClient.get(`/v1/employee/workflow/${jobId}/getEvaluationQuestions`);
  return res.then((response) => {
    console.log("Evaluation questions fetched:", response.data);
    return response.data['evaluationQuestions'];
  });
}

export function Chat({
  id,
  jobId,
  newChat
}: {
  id: string;
  jobId: string;
  newChat: boolean;
}) {
  const navigate = useNavigate();
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [lastSavedMessageIdx, setLastSavedMessageIdx] = useState(0);
  const [evaluationQuestions, setEvaluationQuestions] = useState<EvaluationQuestion[]>([]);
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const { register, handleSubmit: handleFormSubmit, formState: { errors }, getValues, setValue } = useForm<EvaluationForm>();

  const getChatHistoryByChatId = async (chatId: string) => {
    try {
      const res = apiClient.get(`/v1/employee/getChatHistoryByChatId/${chatId}`);
      const response = await res;
      return response.data;
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  }

  useEffect(() => {
    const chatId = id;
    if (!newChat) {
      getChatHistoryByChatId(chatId).then((msgs) => {
        if (!msgs || !msgs.messages) {
          return;
        }
        setInitialMessages(msgs.messages);
        setLastSavedMessageIdx(msgs.messages.length - 1);
      });
    }
  }, [id, newChat]);

  useEffect(() => {
    if (jobId) {
      getEvaluationQuestions(jobId)
        .then((questions) => {

          if (questions && Array.isArray(questions) && questions.length > 0) {
            setEvaluationQuestions(questions);
          }
        })
        .catch(() => {
          setEvaluationQuestions([]); // fallback to empty if API fails
        });
    }
  }, [jobId]);

  const updateChatHistoryWithLatestMessages = async (chat: Chat): Promise<void> => {
    try {
      const res = await apiClient.post("/v1/employee/updateChatHistory", chat);
      if (!res.status.toString().startsWith("2")) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  };

  const fetchWithLogging = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const res = await fetch(input, init);
    if (!res.body) return res;

    // tee the body so we can log *and* forward it
    const forwardStream = res.body;
    // const reader = logStream.getReader();
    // const decoder = new TextDecoder();

    // // async‐log loop (no need to await this)
    // (async () => {
    //   while (true) {
    //     const { value, done } = await reader.read();
    //     if (done) break;
    //     console.log("SSE chunk:", decoder.decode(value, { stream: true }));
    //   }
    // })();

    // hand the second stream back to the SDK
    return new Response(forwardStream, {
      status: res.status,
      headers: res.headers,
    });
  };

  const { messages, handleSubmit, input, setInput, append, status, stop } =
    useChat({
      id,
      api: `${import.meta.env.VITE_API_URL}/v1/employee/streamChat/${jobId}`,
      fetch: fetchWithLogging,
      body: { id },
      initialMessages: initialMessages,
      maxSteps: 10,
      onResponse: (res) => {
        const clone = res.clone();
        const reader = clone.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let accumulated = "";

        (async () => {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              if (accumulated.length > 0) {
                append({ role: "assistant", content: accumulated });
              }
              break;
            }
            accumulated += decoder.decode(value, { stream: true });
          }
        })();
      }
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  useEffect(() => {
    if (messages.length === 0 || (initialMessages && messages.length === initialMessages.length) || lastSavedMessageIdx === messages.length - 1) {
      return;
    }
    const latestMessage = messages[messages.length - 1];
    setLastSavedMessageIdx(messages.length - 1);
    const chat: Chat = {
      id: id,
      title: '', // Default placeholder. Not updated in backend
      createdAt: new Date(), // Default placeholder. Not updated in backend
      updatedAt: new Date(),
      messages: [latestMessage],
      userId: '', // Default placeholder. Not updated in backend
      jobId: jobId
    };
    updateChatHistoryWithLatestMessages(chat);
  }, [messages.length]);

  const onSubmitForm = async (data: EvaluationForm) => {
    const submission = evaluationQuestions.map((question) => {
      return {
        questionId: question.id,
        question: question.question,
        answer: data[question.id as keyof EvaluationForm],
      };
    });
    try {
      const res = await apiClient.post(`/v1/employee/workflow/submitJobWorkflow`, { 
        submission: submission,
        jobId: jobId
      });
      if (!res.status.toString().startsWith("2")) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to submit job:", error);
    }
  };

  const onSaveProgress = async (data: EvaluationForm) => {
    const submission = evaluationQuestions
      .map((question: EvaluationQuestion) => {
        const answer = data[question.id as keyof EvaluationForm];
        return {
          questionId: question.id,
          question: question.question,
          answer: answer,
        };
      })
      .filter((item: { answer: string }) => item.answer && item.answer.trim() !== '');

    try {
      const res = await apiClient.post(`/v1/employee/workflow/saveJobWorkflowProgress`, { 
        submission: submission,
        jobId: jobId
      });
      if (!res.status.toString().startsWith("2")) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      setIsSplitScreen(false);
      toast.success("Progress saved successfully");
    } catch (error) {
      console.error("Failed to save progress:", error);
      toast.error("Failed to save progress");
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/employee/completed-jobs");
  };

  const handleRenameChat = async () => {
    try {
      // TODO: Implement rename API call
      console.log("Renaming chat to:", newChatName);
      setShowRenameDialog(false);
      setNewChatName("");
    } catch (error) {
      console.error("Failed to rename chat:", error);
    }
  };

  const loadSavedFormData = async () => {
    try {
      const response = await apiClient.get(`/v1/employee/workflow/${jobId}/getSavedFormData`);
      if (response.data.hasSavedData && response.data.formData) {
        // Populate form fields with saved data
        Object.entries(response.data.formData).forEach(([questionId, answer]) => {
          setValue(questionId as keyof EvaluationForm, answer as string);
        });
      }
    } catch (error) {
      // Only show error toast for actual errors, not for "no saved data"
      console.error("Error loading saved form data:", error);
      toast.error("Failed to load saved form data");
    }
  };



  return (
    <div className={`flex h-dvh bg-background transition-all duration-500 ease-in-out ${isSplitScreen ? 'flex-row' : 'flex-row justify-center pb-4 md:pb-8 relative'}`}>
      {/* Chat Section */}
      <div className={`flex flex-col justify-between items-center gap-4 transition-all duration-500 ease-in-out ${isSplitScreen ? 'w-1/2' : 'w-full'}`}>
        <div
          ref={messagesContainerRef}
          className={`flex flex-col gap-4 h-full items-center overflow-y-scroll transition-all duration-500 ease-in-out ${isSplitScreen ? 'w-full' : 'w-dvw'}`}
        >
          {messages.length === 0 && <Overview />}

          {messages.map((message) => (
            <PreviewMessage
              key={message.id}
              role={message.role}
              content={message.content}
              attachments={message.experimental_attachments}
            />
          ))}

          {status !== "ready" && (
            <div className="gap-4 px-4 w-full md:w-[750px] md:px-0 first-of-type:pt-20 flex flex-row">
              <div className="size-[24px] border rounded-sm p-1 flex flex-row items-center shrink-0 text-zinc-500">
                <BotIcon />
              </div>
              <div className="gap-2 w-full text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
                <Markdown>Typing...</Markdown>
              </div>
            </div>
          )}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        <form className={`flex flex-row gap-2 relative items-end transition-all duration-500 ease-in-out ${isSplitScreen ? 'w-full max-w-none px-4' : 'w-full md:max-w-[750px] max-w-[calc(100dvw-32px) px-4 md:px-0'}`}>
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={status !== "ready"}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            append={append}
          />
        </form>
      </div>

      {/* Split Screen Right Panel */}
      <div className={`transition-all duration-500 ease-in-out ${isSplitScreen ? 'w-1/2 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
        <div className="w-full h-full bg-[#040713] flex flex-col relative">
          {/* Close Button - Part of submission area, attached to left edge */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
            <Button
              onClick={() => setIsSplitScreen(false)}
              variant="ghost"
              size="sm"
              className="bg-[#040713] hover:bg-[#0a0f1f] text-white rounded-l-none rounded-r-md p-2"
              title="Close submission area"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Agentics Evaluation Form */}
          <div className="flex-1 overflow-y-auto p-12 mx-8 mt-4 mb-8">
            <form onSubmit={handleFormSubmit(onSubmitForm)} className="space-y-8 font-sans">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-eudoxus-bold text-white mb-3">Product Evaluation</h2>
                <p className="text-gray-300 text-base">Please evaluate the product's performance</p>
              </div>

              {/* Dynamic Questions */}
              {evaluationQuestions.map((questionData, index) => (
                <div key={questionData.id} className="space-y-3">
                  <label className="block text-base font-eudoxus-medium text-white">
                    {index + 1}. {questionData.question}
                  </label>
                                      <textarea
                      {...register(questionData.id as keyof EvaluationForm, { required: "This field is required" })}
                      className="w-full p-4 font-eudoxus-medium bg-gray-700 border border-gray-600 rounded-3xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder={questionData.placeholder}
                    />
                  {errors[questionData.id as keyof EvaluationForm] && (
                    <p className="text-red-400 text-sm">
                      {errors[questionData.id as keyof EvaluationForm]?.message}
                    </p>
                  )}
                </div>
              ))}

              <div className="pt-6 flex justify-center gap-4">
                <Button
                  type="button"
                  onClick={() => onSaveProgress(getValues())}
                  variant="outline"
                  className="w-1/3 bg-gray-700 hover:bg-gray-600 text-white font-eudoxus-medium py-6 px-6 rounded-xl transition-colors text-base border-gray-600"
                >
                  Save Progress
                </Button>
                <Button
                  type="submit"
                  className="w-1/3 bg-primary hover:bg-primary/90 text-white font-eudoxus-medium py-6 px-6 rounded-xl transition-colors text-base"
                >
                  Submit Evaluation
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Navigation Buttons - Only show when not in split screen */}
      {!isSplitScreen && (
        <>
          {/* Go back button */}
          <Button
            onClick={() => navigate(-2)}
            className="absolute bottom-8 left-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
          >
            Go back to Jobs
          </Button>

          {/* Submit a Response button */}
          <Button
            onClick={async () => {
              setIsSplitScreen(true);
              // Load saved form data when opening the split screen
              setTimeout(() => loadSavedFormData(), 100);
            }}
            className="absolute bottom-8 right-6 bg-blue-400 hover:bg-blue-500 text-white"
            size="sm"
          >
            Submit a Response
          </Button>
        </>
      )}

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader className="text-center space-y-6 pt-6">
            <DialogTitle className="text-xl font-semibold mx-auto">
              Evaluation submitted successfully!
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-6 py-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Thank you for your feedback. Your evaluation has been recorded.
              </p>
            </div>
            
            <Button 
              onClick={handleCloseModal}
              className="w-full sm:w-auto px-8"
            >
              Continue to Completed Jobs
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Chat Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              placeholder="Enter new chat name"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameChat();
                }
              }}
            />
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRenameChat}>
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}