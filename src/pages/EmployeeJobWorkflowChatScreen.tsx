import { Navbar } from "@/components/jobworkflow/navbar";
import { generateUUID } from "@/lib/utils";
import { Chat } from "../components/jobworkflow/chat";

export default function Page() {
  const id = generateUUID();
  
  return <div>
    <Navbar />
    <Chat key={id} id={id} initialMessages={[]} />
  </div>;
}