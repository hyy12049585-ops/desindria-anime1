import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CommentInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  avatar?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  placeholder = 'نظر خود را بنویسید...',
  autoFocus = false,
  avatar = 'https://i.pravatar.cc/150?img=68',
}) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[20px] p-[1.5px]"
      style={{
        background: isFocused
          ? 'linear-gradient(135deg,#3b82f6,#14b8a6,#8b5cf6)'
          : 'rgba(255,255,255,.08)',
        boxShadow: isFocused ? '0 0 24px rgba(59,130,246,.25)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        className="rounded-[19px] p-4"
        style={{
          background: 'linear-gradient(160deg,#0a0f1e,#070b18)',
        }}
      >
        <div className="flex gap-3" dir="rtl">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2"
            style={{
              borderColor: isFocused ? '#3b82f6' : 'rgba(255,255,255,.1)',
              boxShadow: isFocused ? '0 0 12px rgba(59,130,246,.3)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
          </div>

          {/* Input Area */}
          <div className="flex-1 space-y-3">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-gray-500"
              style={{
                minHeight: '24px',
                maxHeight: '200px',
              }}
            />

            {/* Actions */}
            {(isFocused || text) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between gap-3"
              >
                {/* Emoji Button */}
                <button
                  type="button"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-xl"
                  title="افزودن ایموجی"
                >
                  😊
                </button>

                {/* Submit Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={!text.trim()}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all duration-200"
                  style={{
                    background: text.trim()
                      ? 'linear-gradient(90deg,#3b82f6,#14b8a6)'
                      : 'rgba(255,255,255,.05)',
                    color: text.trim() ? 'white' : 'rgba(255,255,255,.3)',
                    boxShadow: text.trim() ? '0 0 16px rgba(59,130,246,.3)' : 'none',
                    cursor: text.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  ارسال
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Hint */}
        {isFocused && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-gray-600 mt-2 mr-[52px]"
          >
            Ctrl + Enter برای ارسال سریع
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default CommentInput;
