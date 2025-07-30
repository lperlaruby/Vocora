"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X, Send } from "lucide-react"
import { useLanguage } from "@/lang/LanguageContext"
import Image from "next/image";
import Translations from "@/lang/chatbox"
import ReactMarkdown from "react-markdown";
import { useUserPreferences } from "@/hooks/account/useUserPreferences";

export function SupportChat() {
  const [practiceLang, setPracticeLang] = useState<"en" | "es" | "zh">("en");
  const { fetchUserData } = useUserPreferences(setPracticeLang);
  
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput]= useState("")
  const [messages, setMessages]= useState<{ role: "user" | "ai"; content: string }[]>([])
  const { language } = useLanguage()
  const translated = Translations[language]

  const messagesEndRef= useRef<HTMLDivElement> (null)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth"})
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage = { role: "user" as  const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      const response = await fetch("/api/chat-box", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, language, practiceLang, history: messages }),
      })
      const data = await response.json()
      const aiReply = { role: "ai" as const, content: data.reply }
      setMessages((prev) => [...prev, aiReply])
      } catch (error) {
        console.error("Chat error: ", error)
      }
    }

    return (
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="h-20 w-20 rounded-full overflow-hidden border-4 border-purple-600 bg-white shadow-lg transition-transform duration-200 hover:scale-110"
            aria-label="Open support chat"
          >
            <Image
              src="/chatbox_closed.svg"
              alt="Open Chat"
              width={80}
              height={80}
              className="object-contain"
            />
          </button>
        ) : (
          <Card className="w-80 shadow-xl border-purple-100 dark:border-purple-800 dark:bg-slate-800">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Image
                    src="/chatbox_open.svg"
                    alt="Support"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                  {translated.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="h-64 overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                      {translated.empty}
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        } items-end gap-2`}
                      >
                        {msg.role === "ai" && (
                          <Image
                            src="/chatbox_open.svg"
                            alt="AI"
                            width={50}
                            height={50}
                            className="rounded-full border border-2 border-purple-600"
                          />
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === "user"
                              ? "bg-purple-600 text-white"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                          }`}
                        >
                          {msg.role === "ai" ? (
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                            ) : (
                            msg.content
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {/* scrolling to latest message */}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend()
                    }}
                    placeholder={`${translated.prompt} ${practiceLang}...`}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }