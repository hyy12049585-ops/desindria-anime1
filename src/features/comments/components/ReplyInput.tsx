// src/components/comments/ReplyInput.tsx
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface ReplyInputProps {
  avatar: string;
  onSubmit: (text: string) => void;
}

const ReplyInput: React.FC<ReplyInputProps> = ({ avatar, onSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const val = inputRef.current?.value.trim();
    if (!val) return;
    onSubmit(val);
    inputRef.current!.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 flex items-center gap-2"
    >
      <img src={avatar} alt="user" className="w-8 h-8 rounded-full shrink-0" />
      <div
        className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2 border border-white/10"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="پاسخ دهید..."
          dir="rtl"
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button onClick={handleSubmit}>
          <Send
            size={15}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          />
        </button>
      </div>
    </motion.div>
  );
};

export default ReplyInput;
