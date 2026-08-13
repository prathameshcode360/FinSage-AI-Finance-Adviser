// src/components/ai/AIChat/AIChat.jsx
import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "../ChatMessage/ChatMessage";
import Button from "../../common/Button/Button";
import styles from "./AIChat.module.css";

const AIChat = ({
  messages,
  onSendMessage,
  loading,
  suggestedQuestions = [],
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleSuggestedQuestion = (question) => {
    if (!loading) {
      onSendMessage(question);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🧠</div>
            <h3 className={styles.emptyTitle}>Ask FinSage Anything</h3>
            <p className={styles.emptyDescription}>
              Get personalized financial advice based on your spending patterns
            </p>
            {suggestedQuestions.length > 0 && (
              <div className={styles.suggestedQuestions}>
                <p className={styles.suggestedLabel}>Try asking:</p>
                <div className={styles.suggestedGrid}>
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      className={styles.suggestedButton}
                      onClick={() => handleSuggestedQuestion(question)}
                      disabled={loading}>
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                type={message.type}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            {loading && (
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your finances..."
          className={styles.input}
          disabled={loading}
          autoFocus
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!input.trim() || loading}
          loading={loading}>
          Send
        </Button>
      </form>
    </div>
  );
};

export default AIChat;
