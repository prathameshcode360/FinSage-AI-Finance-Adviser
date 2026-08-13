// src/pages/AIAssistant/AIAssistant.jsx
import React, { useState } from "react";
import AIChat from "../../components/ai/AIChat/AIChat";
import aiService from "../../services/ai.service";
import styles from "./AIAssistant.module.css";

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Where did I spend the most this month?",
    "Analyze my spending",
    "How can I save more?",
    "Give me a monthly summary",
    "Am I staying within my budget?",
    "How much did I spend on food?",
  ];

  const handleSendMessage = async (message) => {
    // Add user message
    const userMessage = {
      type: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await aiService.chat(message);

      const aiMessage = {
        type: "ai",
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        type: "ai",
        content:
          "I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.aiAssistant}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Assistant</h1>
        <p className={styles.subtitle}>
          Get personalized financial advice based on your data
        </p>
      </div>

      <div className={styles.chatContainer}>
        <AIChat
          messages={messages}
          onSendMessage={handleSendMessage}
          loading={loading}
          suggestedQuestions={suggestedQuestions}
        />
      </div>

      <div className={styles.disclaimer}>
        <p>
          <strong>Disclaimer:</strong> FinSage provides general financial
          guidance and insights based on your data. For personalized financial
          planning, especially for significant investment or major financial
          decisions, please consult a licensed financial professional.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
