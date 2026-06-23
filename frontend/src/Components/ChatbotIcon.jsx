import React, { useState, useRef, useEffect } from "react";
import { Bot, SendHorizontal, X, User } from "lucide-react";
import { useSelector } from "react-redux";

export default function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);


  useEffect(() => {
    setMessages([
      {
        sender: "assistant",
        text: currentUser
          ? "Hello! How can I help your farm today?"
          : "Please log in to use AgriBot.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, loading]);


  const formatAssistantMessage = (text) => {
    return text.split('\n').map((line, index) => {
      let trimmedLine = line.trim();
      if (!trimmedLine) return <div key={index} className="h-1.5" />;


      const isBullet = trimmedLine.startsWith('-') || trimmedLine.startsWith('*');
      const isNumbered = /^\d+\.\s/.test(trimmedLine);

      if (isBullet) {
        trimmedLine = trimmedLine.replace(/^[-\*]\s*/, '');
      } else if (isNumbered) {
        trimmedLine = trimmedLine.replace(/^\d+\.\s*/, '');
      }


      const textParts = trimmedLine.split(/(\*\*.*?\*\*)/g);
      const styledContent = textParts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={index} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-emerald-500 mt-1.5 shrink-0 text-[8px]">●</span>
            <p className="text-slate-600 leading-relaxed text-sm flex-1">{styledContent}</p>
          </div>
        );
      }

      if (isNumbered) {
        const itemNumber = line.match(/^\d+/)?.[0] || "";
        return (
          <div key={index} className="flex items-start gap-1.5 my-1 pl-1">
            <span className="text-emerald-600 font-bold shrink-0 text-xs mt-0.5">{itemNumber}.</span>
            <p className="text-slate-600 leading-relaxed text-sm flex-1">{styledContent}</p>
          </div>
        );
      }

      return (
        <p key={index} className="text-slate-600 leading-relaxed text-sm mb-1 last:mb-0">
          {styledContent}
        </p>
      );
    });
  };

  const handleSend = async () => {
    if (!currentUser || input.trim() === "" || loading) return;

    setLoading(true);
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userInput = input;
    
    setMessages((prev) => [...prev, { sender: "user", text: userInput, time: userTimestamp }]);
    setInput("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/ai/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { 
          sender: "assistant", 
          text: data.reply, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        },
      ]);
    } catch (err) {
      console.error("Error fetching AI response:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Error fetching response. Please try again.", time: userTimestamp },
      ]);
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="fixed bottom-6 right-6 z-50 font-sans antialiased">

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 text-white p-4 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center border border-emerald-500/20"
        >
          <Bot size={26} />
        </button>
      )}


      {isOpen && (
        <div className="w-[360px] h-[520px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-zinc-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
          <div className="bg-emerald-600 dark:bg-emerald-700 px-4 py-3.5 flex justify-between items-center text-white shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-1 bg-white/10 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">AgriBot</h4>
                <p className="text-[10px] text-emerald-100 font-medium">AI Farming Assistant</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 p-1.5 rounded-lg transition-colors text-emerald-100 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 dark:bg-zinc-950">
            {messages.map((msg, i) => {
              const isUser = msg.sender === "user";
              return (
                <div key={i} className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
                  
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5 shadow-sm">
                      <Bot size={14} />
                    </div>
                  )}

                  <div className="flex flex-col max-w-[78%] gap-1">
                    <div className={`px-3.5 py-2 shadow-sm border border-transparent ${
                      isUser 
                        ? "bg-emerald-600 text-white rounded-2xl rounded-tr-none" 
                        : "bg-white dark:bg-zinc-950 border-slate-200/70 dark:border-zinc-700 text-slate-700 dark:text-white rounded-2xl rounded-tl-none"
                    }`}>
                      {isUser ? (
                        <p className="text-sm font-medium leading-relaxed break-words">{msg.text}</p>
                      ) : (
                        <div className="font-medium break-words space-y-0.5">
                          {formatAssistantMessage(msg.text)}
                        </div>
                      )}
                    </div>
                    <span className={`text-[9px] font-bold text-slate-400 dark:text-zinc-500 tracking-wide px-1 ${isUser ? "text-right" : "text-left"}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400 shadow-sm">
                  <Bot size={14} />
                </div>
                <div className="bg-white dark:bg-zinc-800 border border-slate-200/70 dark:border-zinc-700 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center shadow-sm h-[36px]">
                  <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce [animation-duration:1s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-slate-100 dark:border-zinc-800 flex gap-2 bg-white dark:bg-zinc-900">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={currentUser ? "Ask your farming question..." : "Login required to chat"}
              className="flex-1 text-sm px-3.5 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all font-medium placeholder-slate-400 dark:placeholder-zinc-600 text-slate-700 dark:text-zinc-200"
              disabled={loading || !currentUser}
            />
            <button
              onClick={handleSend}
              disabled={loading || !currentUser || input.trim() === ""}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-150 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/10"
            >
              <SendHorizontal size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}