import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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

// Number of questions for the form
const numberOfQuestions = 5;

export default function AgenticDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answers, setAnswers] = useState<string[]>(new Array(numberOfQuestions).fill(''));

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    console.log("Form submitted with answers:", answers);
    setIsModalOpen(false);
    // Reset answers
    setAnswers(new Array(numberOfQuestions).fill(''));
  };

  return (
    <div className="flex h-screen bg-gray-800">
      {/* Left Section - Agent Cards */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Agentic Dashboard
            </h1>
            <p className="text-lg text-gray-300">
              Explore agents and ask questions
            </p>
          </div>

          {/* 3x3 Grid of Agent Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
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
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 hover:from-green-500 hover:via-yellow-500 hover:to-red-500 text-white px-8 py-3 text-lg font-semibold shadow-lg transition-all duration-300"
              onClick={() => setIsModalOpen(true)}
            >
              Ready to submit a review?
            </Button>
          </div>
        </div>
      </div>

      {/* Right Section - Empty for now */}
      <div className="w-1/2 bg-white border-l border-gray-200">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-xl font-medium">Right Section</p>
            <p className="text-sm mt-2">Chat Section</p>
          </div>
        </div>
      </div>

      {/* Modal with Agent 1 Questions and Answers */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-2xl border-0">
          <DialogHeader className="pb-6 border-b border-gray-200">
            <DialogTitle className="text-3xl font-bold text-center text-gray-800 bg-gradient-to-r from-blue-600 to-gray-700 bg-clip-text text-transparent">
              Agent 1 Review Form
            </DialogTitle>
            <p className="text-center text-gray-600 mt-2">
              Please provide your feedback for Agent 1
            </p>
          </DialogHeader>
          
          <div className="space-y-8 py-6">
            {Array.from({ length: numberOfQuestions }, (_, index) => (
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
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-500"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
            <div className="text-sm text-gray-600">
              {answers.filter(answer => answer.trim() !== '').length} of {numberOfQuestions} questions answered
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => {
                  setIsModalOpen(false);
                  setAnswers(new Array(numberOfQuestions).fill(''));
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-red-300 to-green-300 hover:from-red-400 hover:to-green-400 text-gray-800 px-6 py-2 font-semibold shadow-lg transition-all duration-200"
                onClick={handleSubmit}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 