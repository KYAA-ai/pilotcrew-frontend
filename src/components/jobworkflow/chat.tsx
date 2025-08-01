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
import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";
import apiClient from "@/lib/api";

interface AgenticsEvaluationForm {
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
}

const agenticsEvaluationQuestions = [
  {
    id: "question1",
    question: "How effectively did the AI agent understand and respond to your queries?",
    placeholder: "Describe the agent's understanding and response quality..."
  },
  {
    id: "question2", 
    question: "How would you rate the agent's problem-solving capabilities?",
    placeholder: "Evaluate the agent's analytical and problem-solving skills..."
  },
  {
    id: "question3",
    question: "How well did the agent maintain context throughout the conversation?",
    placeholder: "Assess the agent's ability to maintain conversation context..."
  },
  {
    id: "question4",
    question: "How would you rate the agent's communication clarity and helpfulness?",
    placeholder: "Evaluate the clarity and helpfulness of the agent's responses..."
  },
  {
    id: "question5",
    question: "Overall, how satisfied are you with the AI agent's performance?",
    placeholder: "Provide your overall assessment and satisfaction level..."
  }
];

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const navigate = useNavigate();
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { register, handleSubmit: handleFormSubmit, formState: { errors } } = useForm<AgenticsEvaluationForm>();

  const updateChatHistoryWithLatestMessages = async (chat: Chat): Promise<void> => {
    try {
      const res = await apiClient.post("/v1/employee/updateChatHistory", chat);
      console.log("Chat history update response:", res);
      if (!res.status.toString().startsWith("2")) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      } else {
        console.log("Chat history updated successfully.");
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
    const [logStream, forwardStream] = res.body.tee();
    const reader = logStream.getReader();
    const decoder = new TextDecoder();

    // async‐log loop (no need to await this)
    (async () => {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        console.log("SSE chunk:", decoder.decode(value, { stream: true }));
      }
    })();

    // hand the second stream back to the SDK
    return new Response(forwardStream, {
      status: res.status,
      headers: res.headers,
    });
  };

  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      id,
      api: `${import.meta.env.VITE_API_BASE_URL}/api/v1/employee/streamChat`,
      fetch: fetchWithLogging,
      body: { id },
      initialMessages,
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
            // decode and accumulate
            accumulated += decoder.decode(value, { stream: true });
          }
        })();
      }
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }
    const latestMessage = messages[messages.length - 1];
    const chat: Chat = {
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [latestMessage],
      userId: "123",
    };
    updateChatHistoryWithLatestMessages(chat);
  }, [id, messages]);

  const onSubmitForm = (data: AgenticsEvaluationForm) => {
    console.log('Form submitted:', data);
    // Handle form submission here
    // Show success modal
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/employee/recommended-jobs");
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
              chatId={id}
              role={message.role}
              content={message.content}
              attachments={message.experimental_attachments}
              toolInvocations={message.toolInvocations}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        <form className={`flex flex-row gap-2 relative items-end transition-all duration-500 ease-in-out ${isSplitScreen ? 'w-full max-w-none px-4' : 'w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0'}`}>
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
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
                <h2 className="text-2xl font-eudoxus-bold text-white mb-3">Agentics Evaluation</h2>
                <p className="text-gray-300 text-base">Please evaluate the AI agent's performance</p>
              </div>

              {/* Dynamic Questions */}
              {agenticsEvaluationQuestions.map((questionData, index) => (
                <div key={questionData.id} className="space-y-3">
                  <label className="block text-base font-eudoxus-medium text-white">
                    {index + 1}. {questionData.question}
                  </label>
                                      <textarea
                      {...register(questionData.id as keyof AgenticsEvaluationForm, { required: "This field is required" })}
                      className="w-full p-4 font-eudoxus-medium bg-gray-700 border border-gray-600 rounded-3xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder={questionData.placeholder}
                    />
                  {errors[questionData.id as keyof AgenticsEvaluationForm] && (
                    <p className="text-red-400 text-sm">
                      {errors[questionData.id as keyof AgenticsEvaluationForm]?.message}
                    </p>
                  )}
                </div>
              ))}

              {/* Submit Button */}
              <div className="pt-6 flex justify-center">
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
          {/* Go back to jobs page button */}
          <Button
            onClick={() => navigate("/employee/recommended-jobs")}
            className="absolute bottom-8 left-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
          >
            Go back to Jobs
          </Button>

          {/* Submit a Response button */}
          <Button
            onClick={() => setIsSplitScreen(true)}
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
              Continue to Jobs
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}