"use client";

import type { Attachment } from "ai";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";

export const Message = ({
  role,
  content,
  attachments,
}: {
  role: string;
  content: string | ReactNode;
  attachments?: Array<Attachment>;
}) => {
  // console.log("Message component rendered", {
  //   chatId,
  //   role,
  //   content,
  //   attachments,
  // });
  return (
    <motion.div
      className={`flex ${role === "assistant" ? "flex-row" : "flex-row-reverse"} gap-4 px-4 w-full md:w-[750px] md:px-0 first-of-type:pt-20 ${role === "assistant" ? "text-left" : "text-right"}`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {content && typeof content === "string" && (
          <div className={`flex flex-col gap-4 ${
            role === "assistant" 
              ? "bg-slate-800 dark:bg-slate-900 text-white rounded-2xl p-5 max-w-[85%] self-start shadow-lg border border-slate-700/50" 
              : "bg-primary text-primary-foreground rounded-2xl p-5 max-w-[85%] self-end shadow-lg"
          }`}>
            <Markdown>{content}</Markdown>
          </div>
        )}

        {attachments && (
          <div className="flex flex-row gap-2">
            {attachments.map((attachment) => (
              <PreviewAttachment key={attachment.url} attachment={attachment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};