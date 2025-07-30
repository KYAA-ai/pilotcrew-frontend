import { useChat } from "@ai-sdk/react";
import type { Attachment, Message } from "ai";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Message as PreviewMessage } from "./message";
import { useScrollToBottom } from "./use-scroll-to-bottom";

import { Button } from "@/components/ui/button";
import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const navigate = useNavigate();
  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      id,
      body: { id },
      initialMessages,
      maxSteps: 10,
      onFinish: () => {
        window.history.replaceState({}, "", `/chat/${id}`);
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [stream, setStream] = useState<EventSource | null>(null);

  const eventSource = useCallback(() => {
    return new EventSource(`http://localhost:3000/api/v1/employee/streamChat?userInput=${input}`);
  }, [input]);

  if (stream) {
    console.log("Stream is active")
  }

  useEffect(() => {
    const source = eventSource();
    setStream(source);

    source.onmessage = (event: { data: string; }) => {
      const message = JSON.parse(event.data);
      append(message);
    };

    return () => {
      source.close();
    };
  }, [eventSource]);

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background relative">
      <div className="flex flex-col justify-between items-center gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 h-full w-dvw items-center overflow-y-scroll"
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

        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0">
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
      
      {/* Go back to jobs page button */}
      <Button
        onClick={() => navigate("/employee/recommended-jobs")}
        className="absolute bottom-8 left-6 bg-primary hover:bg-primary/90 text-primary-foreground"
        size="sm"
      >
        Go back to Jobs
      </Button>
    </div>
  );
}