import React, { useState } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Clock,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import type { SessionInfo } from "../../../types/profile";
import { KEYS, load, save, genId } from "../../../utils/storage";

interface Props {
  userId: string;
}

const DEFAULT_SESSIONS = (): SessionInfo[] => [
  {
    id: "current",
    device: navigator.userAgent.includes("Mobile") ? "موبایل" : "دسکتاپ",
    browser: navigator.userAgent.includes("Chrome")
      ? "Chrome"
      : navigator.userAgent.includes("Firefox")
      ? "Firefox"
      : "مرورگر",
    ip: "فعلی",
    location: "ایران",
    lastActive: new Date().toISOString(),
    current: true,
  },
];

const PasswordInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
}> = ({ value, onChange, show, onToggle, placeholder }) => (
  <div className="relative">
    <input
      type={show ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pr-4 pl-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>
);

const SecurityTab: React.FC<Props> = ({ userId }) => {
  const [sessions, setSessions] = useState<SessionInfo[]>(
    () => load<SessionInfo[]>(KEYS.sessions(userId), DEFAULT_SESSIONS())
  );
  const [twoFA, setTwoFA] = useState(false);
  const [lastPassChange, setLastPassChange] = useState<string | null>(null);

  const [showPassForm, setShowPassForm] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const persistSessions = (updated: SessionInfo[]) => {
    setSessions(updated);
    save(KEYS.sessions(userId), updated);
  };

  const handleChangePassword = () => {
    if (!currentPass || !newPass || !confirmPass) {
      setPassMsg({ type: "err", text: "همه فیلدها رو پر کن" });
      return;
    }
    if (newPass.length < 6) {
      setPassMsg({ type: "err", text: "رمز جدید باید حداقل ۶ کاراکتر باشه" });
      return;
    }
    if (newPass !== confirmPass) {
      setPassMsg({ type: "err", text: "تکرار رمز مطابقت نداره" });
      return;
    }

    setLastPassChange(new Date().toISOString());
    setShowPassForm(false);
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    setPassMsg({ type: "ok", text: "رمز عبور با موفقیت تغییر کرد" });
    setTimeout(() => setPassMsg(null), 3000);
  };

  const toggle2FA = () => setTwoFA((p) => !p);

  const revokeSession = (id: string) => {
    persistSessions(sessions.filter((s) => s.id !== id));
  };

  const revokeAllOthers = () => {
    persistSessions(sessions.filter((s) => s.current));
  };

  const getPasswordStrength = (pass: string) => {
    if (pass.length >= 12 && /[A-Z]/.test(pass) && /\d/.test(pass) && /[^A-Za-z0-9]/.test(pass))
      return 4;
    if (pass.length >= 8 && /\d/.test(pass)) return 3;
    if (pass.length >= 6) return 2;
    return 1;
  };

  const strengthLabel = (pass: string) => {
    const s = getPasswordStrength(pass);
    if (s <= 1) return "خیلی ضعیف";
    if (s === 2) return "ضعیف";
    if (s === 3) return "متوسط";
    return "قوی";
  };

  const strengthColor = (level: number, current: number) => {
    if (level > current) return "bg-white/10";
    if (current <= 1) return "bg-red-500";
    if (current === 2) return "bg-yellow-500";
    if (current === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const formatSessionTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("fa-IR") + " " + d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* هدر */}
      <h2 className="text-white font-semibold flex items-center gap-2">
        <Shield className="w-5 h-5 text-red-400" />
        امنیت
      </h2>

      {/* پیام */}
      {passMsg && (
        <div
          className={`p-3 rounded-xl text-sm ${
            passMsg.type === "ok"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {passMsg.text}
        </div>
      )}

      {/* تغییر رمز */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm text-white font-medium">رمز عبور</h3>
          </div>
          {lastPassChange && (
            <span className="text-[10px] text-gray-500">
              آخرین تغییر: {formatSessionTime(lastPassChange)}
            </span>
          )}
        </div>

        {!showPassForm ? (
          <button
            onClick={() => setShowPassForm(true)}
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-gray-300 transition-colors"
          >
            تغییر رمز عبور
          </button>
        ) : (
          <div className="space-y-3">
            <PasswordInput
              value={currentPass}
              onChange={setCurrentPass}
              show={showCurrent}
              onToggle={() => setShowCurrent(!showCurrent)}
              placeholder="رمز فعلی"
            />
            <PasswordInput
              value={newPass}
              onChange={setNewPass}
              show={showNew}
              onToggle={() => setShowNew(!showNew)}
              placeholder="رمز جدید (حداقل ۶ کاراکتر)"
            />
            <PasswordInput
              value={confirmPass}
              onChange={setConfirmPass}
              show={showNew}
              onToggle={() => setShowNew(!showNew)}
              placeholder="تکرار رمز جدید"
            />

            {/* قدرت رمز */}
            {newPass.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${strengthColor(
                        i,
                        getPasswordStrength(newPass)
                      )}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-gray-500">{strengthLabel(newPass)}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleChangePassword}
                className="flex-1 py-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-xl text-sm transition-colors"
              >
                ذخیره رمز جدید
              </button>
              <button
                onClick={() => {
                  setShowPassForm(false);
                  setCurrentPass("");
                  setNewPass("");
                  setConfirmPass("");
                }}
                className="px-4 py-2 bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl text-sm transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        )}
      </div>

      {/* احراز هویت دو مرحله‌ای */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h3 className="text-sm text-white font-medium">احراز هویت دو مرحله‌ای</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">
                امنیت بیشتر با تأیید دو مرحله‌ای
              </p>
            </div>
          </div>
          <button
            onClick={toggle2FA}
            className={`w-10 h-[22px] rounded-full transition-colors relative ${
              twoFA ? "bg-green-500" : "bg-white/10"
            }`}
          >
            <span
              className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white transition-all ${
                twoFA ? "right-[2px]" : "left-[2px]"
              }`}
            />
          </button>
        </div>
        {twoFA && (
          <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-xs text-green-400">
              ✓ احراز هویت دو مرحله‌ای فعال است
            </p>
          </div>
        )}
      </div>

      {/* نشست‌های فعال */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm text-white font-medium">نشست‌های فعال</h3>
            <span className="text-[10px] text-gray-500">({sessions.length})</span>
          </div>
          {sessions.filter((s) => !s.current).length > 0 && (
            <button
              onClick={revokeAllOthers}
              className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <AlertTriangle className="w-3 h-3" />
              لغو همه نشست‌های دیگر
            </button>
          )}
        </div>

        {sessions.length > 0 ? (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  session.current
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-white/[0.02] border-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      session.current ? "bg-green-500/10" : "bg-white/5"
                    }`}
                  >
                    {session.device === "موبایل" ? (
                      <Smartphone className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Shield className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white">
                        {session.device} — {session.browser}
                      </p>
                      {session.current && (
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
                          فعلی
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-500">{session.location}</span>
                      <span className="text-[10px] text-gray-600">•</span>
                      <span className="text-[10px] text-gray-500">
                        IP: {session.ip}
                      </span>
                      <span className="text-[10px] text-gray-600">•</span>
                      <span className="text-[10px] text-gray-500">
                        {formatSessionTime(session.lastActive)}
                      </span>
                    </div>
                  </div>
                </div>

                {!session.current && (
                  <button
                    onClick={() => revokeSession(session.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                    title="لغو نشست"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500 py-4">نشست فعالی وجود نداره</p>
        )}
      </div>
    </div>
  );
};

export default SecurityTab;
