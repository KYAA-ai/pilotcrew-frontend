import reviewIcon from '@/assets/review-icon.png';
import { EmployeeLayout } from "@/components/layout/EmployeeLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useRef, useState } from 'react';

function ChatBubble({ text, sender }: { text: string; sender: 'user' | 'bot' }) {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'items-start'} mt-4`}>
      {sender === 'bot' && (
        <img src={reviewIcon} alt="Bot" className="w-8 h-8 rounded-full mr-2" />
      )}
      <div
        className={`rounded-lg px-4 py-2 max-w-md whitespace-pre-line shadow-md ${
          sender === 'bot' ? 'bg-white text-black' : 'bg-blue-900 text-white'
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start mt-4">
      <img src={reviewIcon} alt="Bot" className="w-8 h-8 rounded-full mr-2" />
      <div className="px-4 py-2 bg-white text-black rounded-lg animate-pulse shadow-md">
        Bot is typing...
      </div>
    </div>
  );
}

function ChatInterface() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! What is the problem?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [conversationData, setConversationData] = useState({ initial: '', answers: [] as string[] });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    if (conversationData.initial === '') {
      const updatedConversation = { ...conversationData, initial: input };
      setConversationData(updatedConversation);

      // API CALL 1: Send initial symptoms, receive 5 questions
      const response = await fetch('/api/askQuestions', {
        method: 'POST',
        body: JSON.stringify({ symptoms: input }),
      });
      const data = await response.json();
      setIsTyping(false);

      const questionsArray = data.questions; // assume array of 5 questions
      // setQuestions(questionsArray); // Remove this line

      const questionMessages = questionsArray.map((q: string) => ({ sender: 'bot', text: q }));
      setMessages(prev => [...prev, ...questionMessages]);
    } else {
      // storing answers to each question
      const updatedAnswers = [...conversationData.answers, input];
      setConversationData({ ...conversationData, answers: updatedAnswers });

      // if done answering all questions
      if (currentQuestionIndex === 4) {
        setIsTyping(true);

        // API CALL 2: Send full json for final diagnosis
        const finalResponse = await fetch('/api/finalDiagnosis', {
          method: 'POST',
          body: JSON.stringify({
            initial: conversationData.initial,
            answers: updatedAnswers
          }),
        });
        const result = await finalResponse.json();

        setMessages(prev => [...prev, { sender: 'bot', text: result.finalDiagnosis }]);
        setIsTyping(false);
        setCurrentQuestionIndex(5); // trigger feedback state
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }
  };

  const handleLike = () => {
    // TODO: Trigger like API or feedback logic
  };

  const handleDislike = () => {
    // TODO: Trigger dislike API or feedback logic
  };

  return (
    <div className="flex flex-col h-full font-mono bg-slate-50 rounded-lg shadow-md overflow-hidden">
      {/* Chat display */}
      <div className="flex-1 px-4 pt-4 overflow-y-auto space-y-2" style={{ minHeight: 0 }}>
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} text={msg.text} sender={msg.sender as 'user' | 'bot'} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Feedback buttons */}
      {currentQuestionIndex === 5 && (
        <div className="flex justify-center my-4">
          <div className="bg-white p-4 rounded shadow-md flex gap-4 items-center">
            <span className="text-black">Rate this diagnosis:</span>
            <button onClick={handleLike} className="bg-green-300 hover:bg-green-400 text-black px-4 py-1 rounded">Like</button>
            <button onClick={handleDislike} className="bg-red-300 hover:bg-red-400 text-black px-4 py-1 rounded">Dislike</button>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="flex items-center px-4 py-3 bg-slate-800">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-gray-200 outline-none text-black"
          disabled={isTyping || currentQuestionIndex > 5}
        />
        <button
          onClick={handleSend}
          disabled={isTyping || currentQuestionIndex > 5}
          className="ml-4 px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded transition disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// Placeholder data for agents
const agents = [
  { id: 1, name: "Agent 1", description: "Agent 1 description" },
  { id: 2, name: "Agent 2", description: "Agent 2 description" },
  { id: 3, name: "Agent 3", description: "Agent 3 description" },
  { id: 4, name: "Agent 4", description: "Agent 4 description" },
  { id: 5, name: "Agent 5", description: "Agent 5 description" },
  { id: 6, name: "Agent 6", description: "Agent 6 description" },
  { id: 7, name: "Agent 7", description: "Agent 7 description" },
  { id: 8, name: "Agent 8", description: "Agent 8 description" },
  { id: 9, name: "Agent 9", description: "Agent 9 description" },
];

const EmployeeAgenticDashboard: React.FC = () => {
  return (
    <EmployeeLayout sidebarCollapsible="icon">
      <div
        className="agentic-dashboard-container"
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '100vh',
          minHeight: 0,
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        }}
      >
        <div
          className="agentic-dashboard-left"
          style={{
            flex: '1 1 0%',
            maxWidth: '50%',
            minWidth: 0,
            height: '100%',
            borderRight: '1px solid #eee',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            boxSizing: 'border-box',
            margin: 0,
            overflowY: 'auto',
            background: '#23272f',
          }}
        >
          <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '2rem 2rem 0 2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                Agentic Dashboard
              </h1>
              <p style={{ fontSize: '1.125rem', color: '#cbd5e1' }}>
                Explore agents and ask questions
              </p>
            </div>
            {/* 3x3 Grid of Agent Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {agents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-black shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-black">
                      {agent.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-black leading-relaxed">
                      {agent.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Submit Review Button */}
            <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: '2rem' }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 hover:from-green-500 hover:via-yellow-500 hover:to-red-500 text-white px-8 py-3 text-lg font-semibold shadow-lg transition-all duration-300"
                // onClick={() => setIsModalOpen(true)}
                disabled
              >
                Ready to submit a review?
              </Button>
            </div>
          </div>
        </div>
        <div
          className="agentic-dashboard-right"
          style={{
            flex: '1 1 0%',
            maxWidth: '50%',
            minWidth: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            boxSizing: 'border-box',
            margin: 0,
          }}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ChatInterface />
          </div>
        </div>
      </div>
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        .agentic-dashboard-container {
          height: 100vh !important;
          min-height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        .agentic-dashboard-left, .agentic-dashboard-right {
          height: 100% !important;
          min-height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        @media (max-width: 768px) {
          .agentic-dashboard-container {
            flex-direction: column !important;
            height: auto !important;
          }
          .agentic-dashboard-left {
            border-right: none;
            border-bottom: 1px solid #eee;
            max-width: 100% !important;
            height: auto !important;
          }
          .agentic-dashboard-right {
            max-width: 100% !important;
            height: auto !important;
          }
        }
      `}</style>
    </EmployeeLayout>
  );
};

export default EmployeeAgenticDashboard; 