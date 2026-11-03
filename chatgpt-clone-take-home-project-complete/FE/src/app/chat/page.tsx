"use client";

import { useState, useEffect, useRef, useReducer } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import Message from "@/components/chat/Message";
import LoadingIndicator from "@/components/chat/LoadingIndicator";
import MessageInput from "@/components/chat/MessageInput";
import { messageReducer } from "@/reducers/messageReducer";

export default function Chat() {
  const [messages, dispatch] = useReducer(messageReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081/api/v1/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        console.error("WebSocket error:", data.error);
        addMessage("Error: " + data.error, "ai");
        setIsLoading(false);
      } else if (data.type === "streaming_start") {
        addStreamingMessage();
        setIsLoading(false);
      } else if (data.type === "streaming_chunk") {
        updateStreamingMessage(data.content);
      } else if (data.type === "streaming_end") {
        completeStreamingMessage(data.response, data.metrics);
      } else if (data.response) {
        addMessage(data.response, "ai", data.metrics);
        setIsLoading(false);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const addMessage = (text: string, sender: "user" | "ai", metrics?: any) => {
    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        id: Math.random().toString(),
        text,
        sender,
        timestamp: new Date(),
        metrics,
        feedback: null,
      },
    });
  };

  const addStreamingMessage = () => {
    dispatch({ type: "ADD_STREAMING_MESSAGE" });
  };

  const updateStreamingMessage = (content: string) => {
    dispatch({ type: "UPDATE_STREAMING_MESSAGE", payload: content });
  };

  const completeStreamingMessage = (fullResponse: string, metrics: any) => {
    dispatch({
      type: "COMPLETE_STREAMING_MESSAGE",
      payload: { text: fullResponse, metrics },
    });
  };

  const sendMessage = () => {
    const trimmed = inputMessage.trim();
    if (!trimmed || !isConnected || isLoading || isImageUploading) return;

    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        id: Math.random().toString(),
        text: trimmed,
        sender: "user",
        timestamp: new Date(),
        feedback: null,
      },
    });

    setInputMessage("");
    setIsLoading(true);

    wsRef.current?.send(
      JSON.stringify({
        message: trimmed,
        streaming: true,
      })
    );
  };

  const handleImageUpload = async (file: File, message: string) => {
    if (!file || !isConnected || isLoading) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      return;
    }

    setIsImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (message.trim()) {
      formData.append("message", message.trim());
    }

    try {
      const response = await fetch(
        "http://localhost:8081/api/v1/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();

      const userMessage = message.trim()
        ? `${message.trim()}`
        : "[Image uploaded]";
      addMessage(userMessage, "user");

      addMessage(result.analysis, "ai");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleFeedback = (
    messageId: string,
    feedback: "thumbs_up" | "thumbs_down"
  ) => {
    dispatch({
      type: "SET_FEEDBACK",
      payload: { messageId, feedback },
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <ChatHeader isConnected={isConnected} />

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
          {messages.map((message) => {
            return (
              <Message
                key={message.id}
                message={message}
                onFeedback={handleFeedback}
              />
            );
          })}

          {isLoading ? <LoadingIndicator /> : null}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={sendMessage}
        isConnected={isConnected}
        isLoading={isLoading || isImageUploading}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
}
