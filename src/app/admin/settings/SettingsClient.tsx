"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Lock, 
  KeyRound, 
  Bell, 
  Volume2, 
  VolumeX, 
  Upload, 
  Play, 
  Check, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Loader2,
  FileAudio,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { 
  NOTIFICATION_PRESETS, 
  SoundPreset, 
  getActiveSoundId, 
  setActiveSoundId, 
  isSoundMuted, 
  setSoundMuted, 
  previewSound, 
  getCustomSound, 
  saveCustomSound, 
  deleteCustomSound,
  CustomSoundInfo
} from "@/lib/notificationSound";
import { 
  getAdminPinStatus, 
  updateAdminPin, 
  resetAdminPinToDefault 
} from "./actions";

export default function SettingsClient() {
  // Sound States
  const [activeSound, setActiveSound] = useState<string>("chime");
  const [soundMuted, setSoundMutedState] = useState<boolean>(false);
  const [customSound, setCustomSound] = useState<CustomSoundInfo | null>(null);
  const [playingSoundId, setPlayingSoundId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security / PIN States
  const [pinStatus, setPinStatus] = useState<{ isCustom: boolean; pinLength: number; maskedHint: string }>({
    isCustom: false,
    pinLength: 6,
    maskedHint: "••••02",
  });
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);
  const [pinMessage, setPinMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Reset PIN State
  const [isResettingPin, setIsResettingPin] = useState(false);
  const [resetCurrentPin, setResetCurrentPin] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    // Load initial sound preferences
    setActiveSound(getActiveSoundId());
    setSoundMutedState(isSoundMuted());
    setCustomSound(getCustomSound());

    // Load PIN status
    loadPinStatus();
  }, []);

  const loadPinStatus = async () => {
    try {
      const status = await getAdminPinStatus();
      setPinStatus(status);
    } catch (e) {
      console.warn("Could not load PIN status:", e);
    }
  };

  /* =========================================================================
     Audio Handlers
     ========================================================================= */

  const handleToggleMute = () => {
    const next = !soundMuted;
    setSoundMutedState(next);
    setSoundMuted(next);
  };

  const handleSelectSound = (id: string) => {
    setActiveSound(id);
    setActiveSoundId(id);
    handlePlayPreview(id);
  };

  const handlePlayPreview = (id: string, customUrl?: string) => {
    setPlayingSoundId(id);
    previewSound(id, customUrl);
    setTimeout(() => {
      setPlayingSoundId((curr) => (curr === id ? null : curr));
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (Max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      setUploadError("File is too large. Please upload an audio file under 3MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      saveCustomSound(file.name, dataUrl);
      const newCustom: CustomSoundInfo = { name: file.name, dataUrl, uploadedAt: new Date().toISOString() };
      setCustomSound(newCustom);
      setActiveSound("custom");
      setActiveSoundId("custom");
      handlePlayPreview("custom", dataUrl);
    };
    reader.onerror = () => {
      setUploadError("Failed to read audio file. Please try another format (MP3, WAV).");
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCustomSound = () => {
    deleteCustomSound();
    setCustomSound(null);
    setActiveSound("chime");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* =========================================================================
     PIN Handlers
     ========================================================================= */

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);

    if (!currentPin.trim()) {
      setPinMessage({ type: "error", text: "Please enter your current PIN code." });
      return;
    }

    if (!/^\d{4,8}$/.test(newPin.trim())) {
      setPinMessage({ type: "error", text: "New PIN must be between 4 and 8 digits (numbers only)." });
      return;
    }

    if (newPin !== confirmPin) {
      setPinMessage({ type: "error", text: "New PIN and confirmation PIN do not match." });
      return;
    }

    setIsUpdatingPin(true);
    try {
      const res = await updateAdminPin(currentPin, newPin);
      if (res.success) {
        setPinMessage({ type: "success", text: res.message });
        setCurrentPin("");
        setNewPin("");
        setConfirmPin("");
        await loadPinStatus();
      } else {
        setPinMessage({ type: "error", text: res.message });
      }
    } catch (err) {
      setPinMessage({ type: "error", text: "Failed to update PIN. Please try again." });
    } finally {
      setIsUpdatingPin(false);
    }
  };

  const handleResetPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResettingPin(true);
    try {
      const res = await resetAdminPinToDefault(resetCurrentPin);
      if (res.success) {
        setPinMessage({ type: "success", text: res.message });
        setShowResetModal(false);
        setResetCurrentPin("");
        await loadPinStatus();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Failed to reset PIN code.");
    } finally {
      setIsResettingPin(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* SECTION 1: ADMIN ACCESS PIN */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900">Admin Access PIN</h2>
              <p className="text-xs text-gray-500">Manage the security code used to unlock the AuraSkin admin dashboard.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              pinStatus.isCustom 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              <KeyRound className="w-3.5 h-3.5" />
              {pinStatus.isCustom ? "Custom PIN Active" : "Default PIN (271302)"}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {pinMessage && (
            <div className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium border ${
              pinMessage.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-red-50 text-red-700 border-red-200"
            }`}>
              {pinMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              )}
              <span>{pinMessage.text}</span>
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-4 max-w-xl">
            {/* Current PIN */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Current PIN Code
              </label>
              <div className="relative">
                <input
                  type={showCurrentPin ? "text" : "password"}
                  maxLength={8}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  placeholder="Enter current PIN"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPin(!showCurrentPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">If this is your first time, the default PIN is 271302.</p>
            </div>

            {/* New PIN & Confirm Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  New PIN Code
                </label>
                <div className="relative">
                  <input
                    type={showNewPin ? "text" : "password"}
                    maxLength={8}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="4 to 8 digits"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Confirm New PIN
                </label>
                <input
                  type={showNewPin ? "text" : "password"}
                  maxLength={8}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Re-enter new PIN"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                disabled={isUpdatingPin || !currentPin || !newPin || !confirmPin}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-xs"
              >
                {isUpdatingPin ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating PIN...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Save New PIN</span>
                  </>
                )}
              </button>

              {pinStatus.isCustom && (
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default (271302)</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* SECTION 2: NOTIFICATION SOUND PREFERENCES */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900">Notification Bell Audio</h2>
              <p className="text-xs text-gray-500">Customize the chime that sounds when new reservation requests or paid orders arrive.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                soundMuted
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {soundMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-red-600" />
                  <span>Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-primary" />
                  <span>Sound Active</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* 5 Preset Sounds Grid */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Preset Chimes (Web Audio Studio Synthesized)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {NOTIFICATION_PRESETS.map((preset) => {
                const isSelected = activeSound === preset.id;
                const isPlaying = playingSoundId === preset.id;

                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectSound(preset.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                      isSelected
                        ? "bg-primary/5 border-primary/40 shadow-xs ring-1 ring-primary/20"
                        : "bg-white border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-serif font-bold text-gray-900 text-sm">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono font-medium text-primary block mt-0.5">
                        {preset.toneInfo}
                      </span>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100/80 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPreview(preset.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isPlaying
                            ? "bg-primary text-white scale-105"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        <Play className={`w-3.5 h-3.5 ${isPlaying ? "fill-white animate-pulse" : ""}`} />
                        <span>{isPlaying ? "Playing..." : "Preview"}</span>
                      </button>

                      <span className={`text-[11px] font-semibold ${isSelected ? "text-primary" : "text-gray-400"}`}>
                        {isSelected ? "Active Sound" : "Click to select"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Sound from Device */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Custom Audio from Device
            </h3>

            {uploadError && (
              <div className="mb-3 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {customSound ? (
              <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
                activeSound === "custom"
                  ? "bg-primary/5 border-primary/40 shadow-xs ring-1 ring-primary/20"
                  : "bg-gray-50/70 border-gray-200"
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileAudio className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm truncate max-w-xs sm:max-w-md">
                        {customSound.name}
                      </p>
                      {activeSound === "custom" && (
                        <span className="text-[10px] bg-primary text-white font-bold px-2 py-0.5 rounded-full shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Uploaded from your device • Ready for instant notification playback
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handlePlayPreview("custom", customSound.dataUrl)}
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  {activeSound !== "custom" && (
                    <button
                      type="button"
                      onClick={() => handleSelectSound("custom")}
                      className="px-3.5 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Set Active
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleDeleteCustomSound}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove custom audio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-primary/40 transition-colors bg-gray-50/30">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">Upload your own notification chime</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  Choose a custom sound bite from your device (.mp3, .wav, .ogg, .m4a up to 3MB).
                </p>

                <div className="mt-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="custom-audio-upload"
                  />
                  <label
                    htmlFor="custom-audio-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs transition-colors"
                  >
                    <Upload className="w-4 h-4 text-primary" />
                    <span>Select Audio from Device</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RESET PIN MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-900">Reset PIN to Default</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              This will reset the dashboard access code back to the initial default: <strong className="font-mono text-gray-800">271302</strong>. Please enter your current PIN to confirm.
            </p>

            <form onSubmit={handleResetPinSubmit} className="mt-4 space-y-4">
              <input
                type="password"
                maxLength={8}
                value={resetCurrentPin}
                onChange={(e) => setResetCurrentPin(e.target.value)}
                placeholder="Enter current PIN"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                autoFocus
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResettingPin || !resetCurrentPin}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isResettingPin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Confirm Reset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

