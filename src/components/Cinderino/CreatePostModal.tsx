// src/components/Cinderino/CreatePostModal.tsx

import React, { useState, useRef } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  X,
  Image as ImageIcon,
  Hash,
  Download,
  Sparkles,
  Type,
  MapPin,
  Camera,
  Plus,
  Trash2,
  Eye,
  Lock,
  Users,
  Globe,
} from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    images: File[];
    caption: string;
    tags: string[];
    downloadable: boolean;
    visibility: "public" | "followers" | "private";
    location?: string;
  }) => void;
}

type Step = "media" | "details" | "settings";

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // States
  const [step, setStep] = useState<Step>("media");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [downloadable, setDownloadable] = useState(true);
  const [visibility, setVisibility] = useState<"public" | "followers" | "private">("public");
  const [location, setLocation] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [activePreview, setActivePreview] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const quickEmojis = ["😍", "🔥", "✨", "💯", "🎨", "📸", "🌟", "💜", "🎬", "🖼️", "👑", "⚡"];

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (images.length + fileArray.length > 10) {
      alert("حداکثر ۱۰ تصویر مجاز است");
      return;
    }
    setImages((prev) => [...prev, ...fileArray]);
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (activePreview >= previews.length - 1) {
      setActivePreview(Math.max(0, previews.length - 2));
    }
  };

  const handleTagAdd = () => {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed) && tags.length < 15) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleAnimatedClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      resetForm();
      onClose();
    }, 250);
  };

  const resetForm = () => {
    setStep("media");
    setImages([]);
    setPreviews([]);
    setCaption("");
    setTags([]);
    setTagInput("");
    setDownloadable(true);
    setVisibility("public");
    setLocation("");
    setActivePreview(0);
  };

  const handleSubmit = () => {
    if (images.length === 0) return;
    onSubmit({ images, caption, tags, downloadable, visibility, location });
    handleAnimatedClose();
  };

  const canProceed = () => {
    if (step === "media") return images.length > 0;
    return true;
  };

  const nextStep = () => {
    if (step === "media") setStep("details");
    else if (step === "details") setStep("settings");
  };

  const prevStep = () => {
    if (step === "settings") setStep("details");
    else if (step === "details") setStep("media");
  };

  const stepIndex = step === "media" ? 0 : step === "details" ? 1 : 2;

  const visibilityOptions = [
    { value: "public" as const, label: "عمومی", icon: Globe, desc: "همه می‌بینن" },
    { value: "followers" as const, label: "فالوورها", icon: Users, desc: "فقط فالوورها" },
    { value: "private" as const, label: "خصوصی", icon: Lock, desc: "فقط خودت" },
  ];

  // Theme-aware colors
  const colors = {
    overlay: isDark ? "rgba(0,0,0,0.88)" : "rgba(0,0,0,0.6)",
    modalBg: isDark ? "linear-gradient(180deg, #1a1a1a 0%, #111 100%)" : "linear-gradient(180deg, #fff 0%, #f8f8f8 100%)",
    border: isDark ? "#2a2a2a" : "#e0e0e0",
    headerBorder: isDark ? "#1f1f1f" : "#e8e8e8",
    iconBtnBg: isDark ? "#222" : "#f0f0f0",
    iconBtnColor: isDark ? "#999" : "#666",
    text: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#888" : "#666",
    textTertiary: isDark ? "#555" : "#999",
    progressInactive: isDark ? "#2a2a2a" : "#e0e0e0",
    uploadBorder: isDark ? "#333" : "#ccc",
    uploadBg: isDark ? "radial-gradient(circle, #1f1f1f, #141414)" : "radial-gradient(circle, #fafafa, #f0f0f0)",
    uploadBgDrag: isDark ? "radial-gradient(circle, rgba(255,107,107,0.1), #1a1a1a)" : "radial-gradient(circle, rgba(255,107,107,0.1), #fff)",
    uploadIconBg: "rgba(255,107,107,0.1)",
    formatsBg: isDark ? "#1a1a1a" : "#f0f0f0",
    formatsText: isDark ? "#555" : "#999",
    fieldBg: isDark ? "#151515" : "#f8f8f8",
    fieldBorder: isDark ? "#1f1f1f" : "#e8e8e8",
    inputBg: isDark ? "#0d0d0d" : "#fff",
    inputBorder: isDark ? "#222" : "#ddd",
    tagChipBg: isDark ? "#1f1f1f" : "#f0f0f0",
    tagChipBorder: isDark ? "#2a2a2a" : "#ddd",
    tagSuggestionBg: isDark ? "#101010" : "#fafafa",
    summaryBg: isDark ? "#151515" : "#f8f8f8",
    visibilityBg: isDark ? "#111" : "#fff",
    toggleBg: isDark ? "#111" : "#f8f8f8",
    backBtnBg: isDark ? "#1a1a1a" : "#f0f0f0",
    backBtnBorder: isDark ? "#2a2a2a" : "#ddd",
    backBtnText: isDark ? "#aaa" : "#666",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: colors.overlay,
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
        animation: isClosing ? "cpmFadeOut 0.25s ease forwards" : "cpmFadeIn 0.25s ease",
      }}
      onClick={handleAnimatedClose}
    >
      <div
        style={{
          background: colors.modalBg,
          borderRadius: 20,
          width: "100%",
          maxWidth: 520,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${colors.border}`,
          overflow: "hidden",
          animation: isClosing ? "cpmSlideDown 0.25s ease forwards" : "cpmSlideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "14px 16px",
          borderBottom: `1px solid ${colors.headerBorder}`,
        }}>
          <button onClick={handleAnimatedClose} style={{
            background: colors.iconBtnBg,
            border: "none",
            color: colors.iconBtnColor,
            cursor: "pointer",
            padding: 6,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <X size={20} />
          </button>
          <div style={{ textAlign: "center", flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: colors.text }}>پست جدید</h3>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: colors.textSecondary }}>
              {step === "media" ? "انتخاب تصویر" : step === "details" ? "جزئیات پست" : "تنظیمات"}
            </p>
          </div>
          <div style={{ width: 32 }} />
        </div>

        {/* Progress Bar */}
        <div style={{ display: "flex", gap: 4, padding: "0 16px", marginTop: 4, marginBottom: 4 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: i <= stepIndex ? "linear-gradient(90deg, #ff6b6b, #ee5a24)" : colors.progressInactive,
                transition: "background 0.4s ease",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: 16, overflowY: "auto", flex: 1 }}>

          {/* Step 1: Media */}
          {step === "media" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {previews.length > 0 ? (
                <>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: 14, overflow: "hidden", background: "#000" }}>
                    <img src={previews[activePreview]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "10px 12px",
                      background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                      <span style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "rgba(0,0,0,0.6)",
                        borderRadius: 20,
                        padding: "4px 10px",
                        fontSize: 12,
                        color: "#fff",
                      }}>
                        <Camera size={14} />
                        {activePreview + 1}/{previews.length}
                      </span>
                      <button onClick={() => removeImage(activePreview)} style={{
                        background: "rgba(255,59,48,0.8)",
                        border: "none",
                        borderRadius: 10,
                        padding: 6,
                        color: "#fff",
                        cursor: "pointer",
                        display: "flex",
                      }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                    {previews.map((src, i) => (
                      <div
                        key={i}
                        onClick={() => setActivePreview(i)}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 10,
                          overflow: "hidden",
                          cursor: "pointer",
                          flexShrink: 0,
                          border: i === activePreview ? "2px solid #ff6b6b" : "2px solid transparent",
                          opacity: i === activePreview ? 1 : 0.6,
                          transition: "all 0.2s",
                        }}
                      >
                        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                      </div>
                    ))}
                    {previews.length < 10 && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 10,
                          border: `2px dashed ${colors.uploadBorder}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        <Plus size={20} color={colors.textSecondary} />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div
                  style={{
                    border: `2px dashed ${isDragging ? "#ff6b6b" : colors.uploadBorder}`,
                    borderRadius: 16,
                    padding: "48px 24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    background: isDragging ? colors.uploadBgDrag : colors.uploadBg,
                    transition: "all 0.3s",
                  }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: colors.uploadIconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}>
                    <ImageIcon size={32} color="#ff6b6b" />
                  </div>
                  <p style={{ margin: "12px 0 4px", color: colors.text, fontSize: 15, fontWeight: 600 }}>
                    تصاویرت رو اینجا بنداز
                  </p>
                  <p style={{ margin: 0, color: colors.textSecondary, fontSize: 12 }}>
                    یا کلیک کن برای انتخاب · حداکثر ۱۰ عکس
                  </p>
                  <div style={{
                    marginTop: 16,
                    padding: "6px 16px",
                    background: colors.formatsBg,
                    borderRadius: 20,
                    fontSize: 11,
                    color: colors.formatsText,
                    letterSpacing: 1,
                  }}>
                    JPG · PNG · WEBP · GIF
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>
          )}

          {/* Step 2: Details */}
          {step === "details" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {previews.length > 0 && (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {previews.slice(0, 4).map((src, i) => (
                    <img key={i} src={src} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
                  ))}
                  {previews.length > 4 && (
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: colors.fieldBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      color: colors.textSecondary,
                    }}>
                      +{previews.length - 4}
                    </div>
                  )}
                </div>
              )}

              {/* Caption */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                background: colors.fieldBg,
                borderRadius: 14,
                padding: 14,
                border: `1px solid ${colors.fieldBorder}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <Type size={16} color="#ff6b6b" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, flex: 1 }}>کپشن</span>
                  <span style={{ fontSize: 11, color: colors.textTertiary }}>{caption.length}/500</span>
                </div>
                <textarea
                  placeholder="درباره پستت بنویس..."
                  value={caption}
                  onChange={(e) => e.target.value.length <= 500 && setCaption(e.target.value)}
                  style={{
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: 10,
                    padding: 12,
                    color: colors.text,
                    fontSize: 14,
                    resize: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.7,
                    outline: "none",
                  }}
                  rows={4}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {quickEmojis.map((em, i) => (
                    <button
                      key={i}
                      onClick={() => setCaption((prev) => prev + em)}
                      style={{
                        background: colors.tagSuggestionBg,
                        border: `1px solid ${colors.inputBorder}`,
                        borderRadius: 8,
                        padding: "4px 8px",
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                background: colors.fieldBg,
                borderRadius: 14,
                padding: 14,
                border: `1px solid ${colors.fieldBorder}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <Hash size={16} color="#ff6b6b" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, flex: 1 }}>تگ‌ها</span>
                  <span style={{ fontSize: 11, color: colors.textTertiary }}>{tags.length}/15</span>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: colors.inputBg,
                  border: `1px solid ${colors.inputBorder}`,
                  borderRadius: 10,
                  padding: "6px 10px",
                }}>
                  <input
                    placeholder="تگ بنویس و Enter بزن"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleTagAdd(); }
                    }}
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      color: colors.text,
                      fontSize: 13,
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                  <button
                    onClick={handleTagAdd}
                    style={{
                      background: "#ff6b6b",
                      border: "none",
                      borderRadius: 8,
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      cursor: "pointer",
                      opacity: tagInput.trim() ? 1 : 0.4,
                    }}
                    disabled={!tagInput.trim()}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {tags.map((tag, i) => (
                      <span key={i} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: colors.tagChipBg,
                        border: `1px solid ${colors.tagChipBorder}`,
                        borderRadius: 20,
                        padding: "4px 10px",
                        fontSize: 12,
                        color: colors.text,
                      }}>
                        <span style={{ color: "#ff6b6b" }}>#</span>{tag}
                        <button
                          onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                          style={{
                            background: "none",
                            border: "none",
                            color: colors.textSecondary,
                            cursor: "pointer",
                            display: "flex",
                          }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                  {["هنر", "عکاسی", "طبیعت", "پرتره", "مینیمال", "شهری"].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        if (!tags.includes(s) && tags.length < 15) setTags([...tags, s]);
                      }}
                      style={{
                        background: colors.tagSuggestionBg,
                        border: `1px solid ${colors.tagChipBorder}`,
                        borderRadius: 16,
                        padding: "4px 10px",
                        fontSize: 11,
                        color: colors.textSecondary,
                        cursor: "pointer",
                        opacity: tags.includes(s) ? 0.3 : 1,
                      }}
                    >
                      #{s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                background: colors.fieldBg,
                borderRadius: 14,
                padding: 14,
                border: `1px solid ${colors.fieldBorder}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <MapPin size={16} color="#ff6b6b" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>موقعیت مکانی</span>
                </div>
                <input
                  placeholder="مثلاً: تهران، ایران"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: 10,
                    padding: "10px 12px",
                    color: colors.text,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {step === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{
                background: colors.summaryBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 14,
                padding: 12,
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {previews[0] && (
                    <img src={previews[0]} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover" }} />
                  )}
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: colors.text }}>
                      {previews.length} تصویر
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: colors.textSecondary }}>
                      {caption ? caption.substring(0, 40) + (caption.length > 40 ? "..." : "") : "بدون کپشن"}
                    </p>
                    {tags.length > 0 && (
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#ff6b6b" }}>
                        {tags.length} تگ
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Visibility */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                background: colors.fieldBg,
                borderRadius: 14,
                padding: 14,
                border: `1px solid ${colors.fieldBorder}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <Eye size={16} color="#ff6b6b" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>حریم خصوصی</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {visibilityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setVisibility(opt.value)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: `1px solid ${visibility === opt.value ? "#ff6b6b" : colors.border}`,
                        background: visibility === opt.value ? "rgba(255,107,107,0.08)" : colors.visibilityBg,
                        cursor: "pointer",
                      }}
                    >
                      <opt.icon size={18} color={visibility === opt.value ? "#ff6b6b" : colors.textSecondary} />
                      <div style={{ flex: 1, textAlign: "right" }}>
                        <p style={{
                          margin: 0,
                          fontSize: 14,
                          fontWeight: 600,
                          color: visibility === opt.value ? "#ff6b6b" : colors.text,
                        }}>
                          {opt.label}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: colors.textSecondary }}>{opt.desc}</p>
                      </div>
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: `2px solid ${visibility === opt.value ? "#ff6b6b" : colors.textTertiary}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        {visibility === opt.value && (
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff6b6b" }} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Downloadable */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                                gap: 8,
                background: colors.fieldBg,
                borderRadius: 14,
                padding: 14,
                border: `1px solid ${colors.fieldBorder}`,
              }}>
                <button
                  onClick={() => setDownloadable(!downloadable)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    background: colors.toggleBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    padding: "10px 12px",
                    cursor: "pointer",
                  }}
                >
                  <Download size={18} color={downloadable ? "#ff6b6b" : colors.textSecondary} />
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: colors.text }}>
                      قابل دانلود
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: colors.textSecondary }}>
                      بقیه بتونن تصاویرت رو دانلود کنن
                    </p>
                  </div>
                  <div style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: downloadable ? "#ff6b6b" : colors.uploadBorder,
                    transition: "background 0.3s",
                    position: "relative",
                  }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: 2,
                      right: downloadable ? 2 : 22,
                      transition: "right 0.3s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    }} />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          padding: "14px 16px",
          borderTop: `1px solid ${colors.headerBorder}`,
        }}>
          {step !== "media" ? (
            <button onClick={prevStep} style={{
              background: colors.backBtnBg,
              border: `1px solid ${colors.backBtnBorder}`,
              borderRadius: 10,
              padding: "8px 16px",
              color: colors.backBtnText,
              fontSize: 13,
              cursor: "pointer",
            }}>
              مرحله قبل
            </button>
          ) : (
            <button onClick={handleAnimatedClose} style={{
              background: colors.backBtnBg,
              border: `1px solid ${colors.backBtnBorder}`,
              borderRadius: 10,
              padding: "8px 16px",
              color: colors.backBtnText,
              fontSize: 13,
              cursor: "pointer",
            }}>
              لغو
            </button>
          )}

          {step !== "settings" ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "linear-gradient(90deg,#ff6b6b,#ee5a24)",
                border: "none",
                borderRadius: 10,
                padding: "8px 16px",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: canProceed() ? "pointer" : "not-allowed",
                opacity: canProceed() ? 1 : 0.4,
              }}
            >
              مرحله بعد
              <Sparkles size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "linear-gradient(90deg,#ff6b6b,#ee5a24)",
                border: "none",
                borderRadius: 10,
                padding: "8px 18px",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Sparkles size={16} />
              انتشار پست
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cpmFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes cpmFadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes cpmSlideUp {
          from { transform: translateY(60px) scale(0.95); opacity: 0 }
          to { transform: translateY(0) scale(1); opacity: 1 }
        }
        @keyframes cpmSlideDown {
          from { transform: translateY(0) scale(1); opacity: 1 }
          to { transform: translateY(60px) scale(0.95); opacity: 0 }
        }
      `}</style>
    </div>
  );
};

export default CreatePostModal;
