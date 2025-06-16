"use client";
import { useChat } from "@ai-sdk/react";
import { Button, Input } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";  // Code style

export const Chatbot = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id: "creation",
    api: "/api/chatbox",
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col justify-between p-4 pr-0 h-full bg-black">
      <div className="flex flex-col gap-4 overflow-y-scroll scrollbar-custom">
        {messages.map((message: any) => (
          <div
            key={message.id}
            className={`px-3 ${
              message.role === "user" ? "flex justify-end" : "flex justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-lg leading-relaxed ${
                message.role === "user"
                  ? "bg-[#39393f] text-white"
                  : "bg-[#1e1e24] text-gray-300"
              }`}
            >
              {message.parts.map((part: any) => {
                if (part.type === "text") {
                  return (
                    <ReactMarkdown
                      key={message.id}
                      components={{
                        code({ node, inline, className, children, ...props }:any) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={tomorrow}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {part.text}
                    </ReactMarkdown>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 items-center mt-3 pr-4">
        <Input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full"
        />
        <Button onPress={() => handleSubmit()} className="px-6 py-2">
          Send
        </Button>
      </div>
    </div>
  );
};
