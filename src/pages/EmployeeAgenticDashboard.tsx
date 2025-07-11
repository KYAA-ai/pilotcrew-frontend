import botIcon from '@/assets/bot.png';
import reviewIcon from '@/assets/review-icon.png';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from 'react';

function ChatBubble({ text, sender }: { text: string; sender: 'user' | 'bot' }) {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'items-start'} mt-4`}>
      {sender === 'bot' && (
        <img src={botIcon} alt="Bot" className="w-10 h-10 rounded-full mr-2 p-1" />
      )}
      <div
        className={`px-4 py-2 max-w-md whitespace-pre-line shadow-md ${
          sender === 'bot' 
            ? 'bg-white text-black rounded-lg rounded-tl-none' 
            : 'bg-blue-900 text-white rounded-lg rounded-tr-none'
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
      <img src={botIcon} alt="Bot" className="w-10 h-10 rounded-full mr-2 p-1" />
      <div className="px-4 py-2 bg-white text-black rounded-lg animate-pulse shadow-md">
        Bot is typing...
      </div>
    </div>
  );
}

function ChatInterface() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How may I help you today?'}
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

    // Simulate 5-second typing delay
    setTimeout(() => {
      setIsTyping(false);
      
      // Default bot response
      const botResponse = "That sounds great! What else do you want to know?";
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 5000);

    // TODO: Future API integration 
    /*
    try {
      // API CALL: Send user message and receive bot response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          conversationHistory: messages 
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsTyping(false);
        setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('API Error:', error);
      setIsTyping(false);
      // Fallback to default response
      setMessages(prev => [...prev, { sender: 'bot', text: "That sounds great! What else do you want to know?" }]);
    }
    */
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-md overflow-hidden">
      {/* Chat display */}
      <div className="flex-1 px-4 pt-4 overflow-y-auto space-y-2" style={{ minHeight: 0 }}>
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} text={msg.text} sender={msg.sender as 'user' | 'bot'} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Message input */}
      <div className="flex items-center px-4 py-3 bg-slate-800">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isTyping && input.trim()) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 px-4 py-2 rounded bg-gray-200 outline-none text-black"
          disabled={isTyping}
        />
        <button
          onClick={handleSend}
          disabled={isTyping}
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

// Number of questions for the review form
const reviewNumberOfQuestions = 5;

// Collapsible Sidebar for Agentic Dashboard
import { EmployeeProfileModal } from '@/components/EmployeeProfileModal';
import {
  Bookmark,
  Briefcase,
  DotsVertical,
  InnerShadowTop,
  Logout,
  Search,
  Settings,
  User,
  UserCircle
} from "@/components/SimpleIcons";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProfile } from '@/contexts/ProfileContext';
import { useLogout } from '@/hooks/useLogout';
import { X } from 'lucide-react';
import { useLocation } from "react-router-dom";

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  headline: string;
  linkedinId?: string;
  linkedinName?: string;
  linkedinEmailVerified?: boolean;
  linkedinPicture?: string;
  linkedinProfileUrl?: string;
  isEmailVerified?: boolean;
}

const employeeNavItems = [
  {
    title: "Recommended Jobs",
    url: "/employee/recommended-jobs",
    icon: Search,
  },
  {
    title: "My Applications",
    url: "/employee/applications",
    icon: Briefcase,
  },
  {
    title: "Saved Jobs",
    url: "/employee/saved",
    icon: Bookmark,
  },
];

const employeeSecondaryItems = [
  {
    title: "Profile",
    url: "/employee/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/employee/settings",
    icon: Settings,
  },
];

function AgenticSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();
  const { profile } = useProfile<EmployeeProfile>();
  const { logout } = useLogout();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const location = useLocation();
  const { toggleSidebar, state } = useSidebar();
  const showCloseButton = state === 'expanded';

  const isActive = (url: string) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(url);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAccountClick = () => {
    setIsProfileModalOpen(true);
  };

  // Review modal state
  // const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  // const [reviewAnswers, setReviewAnswers] = useState<string[]>(new Array(reviewNumberOfQuestions).fill(''));

  // const handleReviewAnswerChange = (index: number, value: string) => {
  //   const newAnswers = [...reviewAnswers];
  //   newAnswers[index] = value;
  //   setReviewAnswers(newAnswers);
  // };

  // const handleReviewSubmit = () => {
  //   // TODO: handle review submission logic
  //   setIsReviewModalOpen(false);
  //   setReviewAnswers(new Array(reviewNumberOfQuestions).fill(''));
  // };

  if (!profile) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="/">
                  <InnerShadowTop className="!size-5" />
                  <div className="text-lg font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent drop-shadow-sm select-none">
                    KYAA.ai
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" disabled>
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">...</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Loading...</span>
                  <span className="text-muted-foreground truncate text-xs">
                    Loading profile...
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    );
  }
  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="data-[slot=sidebar-menu-button]:!p-1.5"
                >
                  <a href="/">
                    <img src={reviewIcon} alt="Review Icon" style={{ width: 24, height: 24, marginRight: 8 }} />
                    <div className="text-lg font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent drop-shadow-sm select-none">
                      KYAA.ai
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            {showCloseButton && (
              <button
                aria-label="Close sidebar"
                onClick={toggleSidebar}
                style={{ marginLeft: 8 }}
                className="p-1 rounded hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent
          onClick={
            state === 'collapsed'
              ? (e) => {
                  if (e.target === e.currentTarget) {
                    toggleSidebar();
                  }
                }
              : undefined
          }
          style={
            state === 'collapsed'
              ? { cursor: 'pointer' }
              : undefined
          }
        >
          <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                {employeeNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      className={isActive(item.url) ? "bg-primary text-primary-foreground" : ""}
                    >
                      <a href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2 mt-auto">
              <SidebarMenu>
                {employeeSecondaryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      className={isActive(item.url) ? "bg-primary text-primary-foreground" : ""}
                    >
                      <a href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg grayscale">
                      <AvatarFallback className="rounded-lg">
                        {getInitials((profile?.linkedinName || profile?.name || 'User'))}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {profile?.linkedinName || profile?.name || 'User'}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {profile?.headline || profile?.email || 'User'}
                      </span>
                    </div>
                    <DotsVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                          {getInitials((profile?.linkedinName || profile?.name || 'User'))}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {profile?.linkedinName || profile?.name || 'User'}
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                          {profile?.headline || profile?.email || 'User'}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleAccountClick}>
                      <UserCircle />
                      Account
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <Logout />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <EmployeeProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </>
  );
}

const AgenticDashboard: React.FC = () => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState<string[]>(new Array(reviewNumberOfQuestions).fill(''));

  const handleReviewAnswerChange = (index: number, value: string) => {
    const newAnswers = [...reviewAnswers];
    newAnswers[index] = value;
    setReviewAnswers(newAnswers);
  };

  const handleReviewSubmit = () => {
    // TODO: handle review submission logic
    setIsReviewModalOpen(false);
    setReviewAnswers(new Array(reviewNumberOfQuestions).fill(''));
  };

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)"
      } as React.CSSProperties}
    >
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
          overflow: 'auto',
        }}
      >
        <AgenticSidebar />
        <div
          className="agentic-dashboard-main"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            minHeight: 0,
            overflow: 'auto',
          }}
        >
          <div
            className="agentic-dashboard-left"
            style={{
              flex: '1 1 0%',
              maxWidth: '50%',
              minWidth: 0,
              height: '100%',
              borderRight: '1px solid #23272f',
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
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  Ready to submit a review?
                </Button>
              </div>
              {/* Review Questionnaire Modal */}
              <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-2xl border-0">
                  <DialogHeader className="pb-6 border-b border-gray-200">
                    <DialogTitle className="text-3xl font-bold text-center text-gray-800 bg-gradient-to-r from-blue-600 to-gray-700 bg-clip-text text-transparent">
                      Submit Your Review
                    </DialogTitle>
                    <p className="text-center text-gray-600 mt-2">
                      Please provide your feedback
                    </p>
                  </DialogHeader>
                  <div className="space-y-8 py-6">
                    {Array.from({ length: reviewNumberOfQuestions }, (_, index) => (
                      <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center mb-4">
                          <div className="bg-gradient-to-r from-blue-500 to-gray-600 text-white font-bold text-lg px-4 py-2 rounded-full mr-4">
                            Q{index + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Question {index + 1}
                          </h3>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700 block">
                            Your Answer:
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter your detailed response here..."
                            value={reviewAnswers[index]}
                            onChange={(e) => handleReviewAnswerChange(index, e.target.value)}
                            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                    <div className="text-sm text-gray-600">
                      {reviewAnswers.filter(answer => answer.trim() !== '').length} of {reviewNumberOfQuestions} questions answered
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => {
                          setIsReviewModalOpen(false);
                          setReviewAnswers(new Array(reviewNumberOfQuestions).fill(''));
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-red-300 to-green-300 hover:from-red-400 hover:to-green-400 text-gray-800 px-6 py-2 font-semibold shadow-lg transition-all duration-200"
                        onClick={handleReviewSubmit}
                      >
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
              overflowY: 'auto',
            }}
          >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <ChatInterface />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: auto;
        }
        .agentic-dashboard-container {
          height: 100vh !important;
          min-height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: auto !important;
        }
        .agentic-dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 100%;
          min-height: 0;
          overflow: auto;
        }
        .agentic-dashboard-left, .agentic-dashboard-right {
          height: 100% !important;
          min-height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow-y: auto !important;
        }
        @media (max-width: 1024px) {
          .agentic-dashboard-container {
            flex-direction: column !important;
            height: auto !important;
            min-height: 100vh !important;
          }
          .agentic-dashboard-main {
            flex-direction: column !important;
            height: auto !important;
            min-height: 100vh !important;
          }
          .agentic-dashboard-left {
            border-right: none;
            border-bottom: 1px solid #eee;
            max-width: 100% !important;
            height: auto !important;
            min-height: 300px !important;
          }
          .agentic-dashboard-right {
            max-width: 100% !important;
            height: auto !important;
            min-height: 300px !important;
          }
        }
        @media (max-width: 768px) {
          .agentic-dashboard-container {
            flex-direction: column !important;
            height: auto !important;
            min-height: 100vh !important;
          }
          .agentic-dashboard-main {
            flex-direction: column !important;
            height: auto !important;
            min-height: 100vh !important;
          }
          .agentic-dashboard-left {
            border-right: none;
            border-bottom: 1px solid #eee;
            max-width: 100% !important;
            height: auto !important;
            min-height: 200px !important;
          }
          .agentic-dashboard-right {
            max-width: 100% !important;
            height: auto !important;
            min-height: 200px !important;
          }
        }
      `}</style>
    </SidebarProvider>
  );
};

export default AgenticDashboard; 