import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const seed = [
  { from: "reviewer", name: "Priya Sharma", text: "Hi, thanks for submitting the Cloud Security assessment. Could you attach the latest SOC 2 report for question 3.2?", time: "10:24" },
  { from: "vendor", name: "You", text: "Sure — uploading it now. Should have it in a few minutes.", time: "10:31" },
  { from: "reviewer", name: "Priya Sharma", text: "Received, thank you. I'll validate and get back to you shortly.", time: "10:45" },
];

export function VendorMessagesPage() {
  const [msgs, setMsgs] = useState(seed);
  const [text, setText] = useState("");
  return (
    <>
      <PageHeader title="Messages" description="Communicate with your assigned reviewer." />
      <Card className="flex h-[calc(100vh-260px)] flex-col">
        <CardContent className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-5">
          {msgs.map((m, i) => (
            <div key={i} className={cn("flex gap-3", m.from === "vendor" && "flex-row-reverse")}>
              <Avatar name={m.name} className="h-8 w-8 shrink-0" />
              <div className={cn("max-w-md rounded-lg p-3", m.from === "vendor" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                <p className="text-sm">{m.text}</p>
                <p className={cn("mt-1 text-[10px]", m.from === "vendor" ? "text-primary-foreground/70" : "text-muted-foreground")}>{m.name} · {m.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
        <div className="flex gap-2 border-t p-3">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) { setMsgs([...msgs, { from: "vendor", name: "You", text, time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) }]); setText(""); } }} />
          <Button onClick={() => { if (text.trim()) { setMsgs([...msgs, { from: "vendor", name: "You", text, time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) }]); setText(""); } }}><Send className="h-4 w-4" /></Button>
        </div>
      </Card>
    </>
  );
}
