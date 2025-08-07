import { Navbar } from "@/components/jobworkflow/navbar";
import { generateUUID } from "@/lib/utils";
import { Chat } from "../components/jobworkflow/chat";
import { useSearchParams } from "react-router-dom";

export default function EmployeeJobWorkflowChatScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  let chatId = searchParams.get("chatId");
  let newChat = false;

  if (!chatId) {
    newChat = true;
    chatId = generateUUID();
  }

  if (!jobId) {
    return <div>Job ID is required</div>;
  }

  if (newChat)
  setSearchParams({ jobId: jobId, chatId: chatId });
  
  return <div>
    <Navbar jobId={jobId} />
    <Chat key={chatId} id={chatId} jobId={jobId} newChat={newChat}/>
  </div>;
}