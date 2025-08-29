import FloatingNavbar from "@/components/new-ui/FloatingNavbar";
import Footer from "@/components/new-ui/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/lib/api";
import {
  ArrowRight,
  Cloud,
  Database,
  FileUp,
  GitCompare,
  Mail,
  MessageSquare,
  Send,
  Target,
  TrendingUp,
  User,
  Zap
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../assets/logo.png";


interface FormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
  company?: string;
}

export default function AutoEvalAboutPage() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    phone: "NA",
    company: "NA"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post('/v1/autoeval/contact', formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "", phone: "NA", company: "NA" });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      title: "Smart Model Testing",
      points: [
        { icon: <FileUp className="h-7 w-7 text-[#e9a855]" />, text: "Upload your large datasets quickly within minutes using our multi-part upload technology" },
        { icon: <GitCompare className="h-7 w-7 text-[#e9a855]" />, text: "Get access to over 20+ publicly deployed models at the tip of your fingers" }
      ]
    },
    {
      title: "Flexible Parameter Tuning",
      points: [
        { icon: <Zap className="h-7 w-7 text-[#e9a855]" />, text: "Have the ability to tune over 20+ parameters for each model" },
        { icon: <TrendingUp className="h-7 w-7 text-[#e9a855]" />, text: "Get comprehensive scoring with 10+ built-in metrics like bleu, rougel, meteor, perplexity, etc" },
      ]
    },
    {
      title: "Real-Time Monitoring",
      points: [
        { icon: <TrendingUp className="h-7 w-7 text-[#e9a855]" />, text: "Get real-time progress of execution and compare models specific to your use case" },
        { icon: <Target className="h-7 w-7 text-[#e9a855]" />, text: "Observe usage and accurate execution times of different models with token usage" }
      ]
    },
    {
      title: "Enterprise-Ready Security",
      points: [
        { icon: <Database className="h-7 w-7 text-[#e9a855]" />, text: "Your data stays secure with bank-level encryption and SOC 2 compliance" },
        { icon: <Cloud className="h-7 w-7 text-[#e9a855]" />, text: "Deploy on-premises or in the cloud with full control over your sensitive information" }
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black">
      {/* Navigation */}
      <FloatingNavbar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        desktopWrapperClassName="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-6"
        mobileWrapperClassName="block md:hidden"
      />

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Why Choose AutoEval Section */}
        <div className="flex items-center justify-center mx-10 mt-8 sm:mt-16 md:mt-24 lg:mt-32 xl:mt-40 2xl:mt-48 mb-4 sm:mb-6 md:mb-8 lg:mb-12 xl:mb-16 2xl:mb-20">
          <div className="w-full max-w-8xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 pt-4 md:pt-6 lg:pt-8 pb-10 md:pb-102 lg:pb-14">
            <div className="grid grid-cols-4 gap-0">
              <div className="col-span-4 px-8 mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white text-left">
                  Why choose AutoEval
                </h2>
              </div>
              {features.map((feature, index) => (
                <div key={index} className={`text-left px-8 ${index < features.length - 1 ? 'border-r border-gray-600' : ''}`}>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-4 h-12 flex items-center">{feature.title}</h3>
                    <div className="space-y-6">
                      {feature.points.map((point, pointIndex) => (
                        <div key={pointIndex} className="flex items-center gap-3 min-h-[70px]">
                          <div className="flex-shrink-0">
                            {point.icon}
                          </div>
                          <p className="text-slate-300 leading-relaxed text-sm flex-1">
                            {point.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Login and Contact Form */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Already a Member - Login Section */}
            <div className="flex flex-col justify-center max-w-lg mx-auto">
              <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-blue-500/30 p-4">
                <CardContent className="p-4 text-center">
                  <div className="relative flex justify-center mb-4 pt-4">
                    {/* Golden blur sphere behind logo */}
                    <div
                      className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-[#e9a855] blur-md opacity-60 transform -translate-x-1/2 -translate-y-1/2"
                      style={{ zIndex: -1 }}
                    />
                    <img src={logo} alt="Pilotcrew Logo" className="w-12 h-12 object-contain relative z-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Already a member? Login!
                  </h3>
                  <p className="text-slate-300 mb-4 text-sm">
                    Access your AutoEval dashboard and continue evaluating your AI models.
                    Track your progress and optimize your model performance.
                  </p>

                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate('/auth/autoeval')}
                      size="sm"
                      className="w-full max-w-xs mx-auto mt-8 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-transparent hover:border-2 hover:border-blue-500 hover:text-white transition-all duration-100 text-sm font-eudoxus-bold"
                    >
                      Access AutoEval Platform
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>

                    <p className="text-xs text-slate-400 pb-4">
                      New to AutoEval? Get in touch with us to explore our features.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="bg-slate-800/30 backdrop-blur-md border-slate-600 shadow-[0_10px_60px_rgba(0,46,103,0.4)]">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-blue-400" />
                  Get in Touch
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Have questions about AutoEval? Send us a message and we'll get back to you soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your use case, questions, or how we can help..."
                      rows={5}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full max-w-xs bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-transparent hover:border-2 hover:border-blue-500 hover:text-white transition-all duration-100 font-eudoxus-bold"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-40">
        <Footer />
      </div>
    </div>
  );
}
