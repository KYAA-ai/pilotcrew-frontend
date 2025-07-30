import { Navbar } from "@/components/jobworkflow/navbar";
import { Chat } from "../components/jobworkflow/chat";
import { generateUUID } from "@/lib/utils";

export default function Page() {
  const id = generateUUID();
  
  return <div>
    <Navbar />
    <Chat key={id} id={id} initialMessages={[]} />
  </div>;
}