
import { SiteHeader } from "@/components/employer-header";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AutoEvalSidebar } from "./AutoEvalSidebar";

export default function AutoEvalPage() {
  return (
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AutoEvalSidebar collapsible="offcanvas" />
      <SidebarInset>
        <SiteHeader />
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
          {/* 5 parallel containers with equal width */}
          <div className="flex w-full h-screen items-center">
        {/* First container - Dataset Upload */}
        <div className="w-1/5 h-full p-4 flex items-center">
          <Card className="h-[30vh] w-full">
            <CardHeader className="text-center">
              <CardTitle>Dataset Upload</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Button className="w-full">
                Upload Dataset
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Second container - Model Selection */}
        <div className="w-1/5 h-full p-4 flex items-center">
          <Card className="h-[50vh] w-full">
            <CardHeader className="text-center">
              <CardTitle>Model Selection</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3">Claude-3</SelectItem>
                  <SelectItem value="llama-2">Llama-2</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
        
        {/* Third container - Pass@k metrics */}
        <div className="w-1/5 h-full p-4 flex items-center">
          <Card className="h-[50vh] w-full">
            <CardHeader className="text-center">
              <CardTitle>Pass@k metrics</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Pass@k value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pass@1">Pass@1</SelectItem>
                  <SelectItem value="pass@5">Pass@5</SelectItem>
                  <SelectItem value="pass@10">Pass@10</SelectItem>
                  <SelectItem value="pass@20">Pass@20</SelectItem>
                  <SelectItem value="pass@50">Pass@50</SelectItem>
                  <SelectItem value="pass@100">Pass@100</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
        
        {/* Fourth container - Temperature */}
        <div className="w-1/5 h-full p-4 flex items-center">
          <Card className="h-[50vh] w-full">
            <CardHeader className="text-center">
              <CardTitle>Temperature</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Input 
                type="number" 
                placeholder="Enter temperature value"
                min="0"
                max="2"
                step="0.1"
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Fifth container - Text eval metrics */}
        <div className="w-1/5 h-full p-4 flex items-center">
          <Card className="h-[50vh] w-full">
            <CardHeader className="text-center">
              <CardTitle>Text eval metrics</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bleu">BLEU</SelectItem>
                  <SelectItem value="rouge">ROUGE</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
