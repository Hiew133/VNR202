"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { ROOMS, ARTIFACTS } from "@/data/museumData";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Square, Volume2, VolumeX, Minus, Plus, CheckCircle2, Moon, Sun, Award } from "lucide-react";
import { soundFx } from "@/utils/soundEffects";

export default function OverlayUI() {
  const [isListOpen, setIsListOpen] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const activeRoomId = useStore((state) => state.activeRoomId);
  const setActiveRoom = useStore((state) => state.setActiveRoom);
  const activeArtifactId = useStore((state) => state.activeArtifactId);
  const setActiveArtifact = useStore((state) => state.setActiveArtifact);
  const isMuted = useStore((state) => state.isMuted);
  const toggleMute = useStore((state) => state.toggleMute);
  const isNightMode = useStore((state) => state.isNightMode);
  const toggleNightMode = useStore((state) => state.toggleNightMode);
  const zoomPercentage = useStore((state) => state.zoomPercentage);
  const zoomIn = useStore((state) => state.zoomIn);
  const zoomOut = useStore((state) => state.zoomOut);
  const isTourMode = useStore((state) => state.isTourMode);
  const setTourMode = useStore((state) => state.setTourMode);

  const placedIds = useStore((state) => state.placedIds);
  const openSlotId = useStore((state) => state.openSlotId);
  const openSlot = useStore((state) => state.openSlot);
  const tryPlace = useStore((state) => state.tryPlace);
  const lastWrongId = useStore((state) => state.lastWrongId);
  const clearWrong = useStore((state) => state.clearWrong);
  const wrongAttempts = useStore((state) => state.wrongAttempts);

  const activeArtifact = activeArtifactId ? ARTIFACTS.find((a) => a.id === activeArtifactId) : null;
  const currentRoom = ROOMS.find((r) => r.id === activeRoomId) || ROOMS[0];

  const allPlaced = placedIds.length === ARTIFACTS.length;
  const formattedCounter = `${String(placedIds.length).padStart(2, "0")}/${String(ARTIFACTS.length).padStart(2, "0")}`;

  // Bệ đang mở túi đồ, và danh sách hiện vật còn lại trong túi.
  const openSlotArtifact = openSlotId ? ARTIFACTS.find((a) => a.id === openSlotId) : null;
  const inventory = ARTIFACTS.filter((a) => !placedIds.includes(a.id));
  const wrongArtifact = lastWrongId ? ARTIFACTS.find((a) => a.id === lastWrongId) : null;

  const [hasTriggeredAchievement, setHasTriggeredAchievement] = useState(false);
  useEffect(() => {
    if (allPlaced && !hasTriggeredAchievement) {
      setHasTriggeredAchievement(true);
      setShowBadgeModal(true);
      if (!isMuted) {
        soundFx.playFireworks();
      }
    }
  }, [allPlaced, hasTriggeredAchievement, isMuted]);

  // Thông báo đặt sai tự tắt sau 3 giây để không che mất danh sách.
  useEffect(() => {
    if (!lastWrongId) return;
    const t = setTimeout(clearWrong, 3000);
    return () => clearTimeout(t);
  }, [lastWrongId, clearWrong]);

  const handlePlace = (artifactId: string) => {
    const ok = tryPlace(artifactId);
    if (isMuted) return;
    if (ok) soundFx.playBrassChime();
    else soundFx.playWoodClick();
  };


  const handleRoomClick = (roomId: string) => {
    if (!isMuted) soundFx.playWhoosh();
    setActiveRoom(roomId);
  };

  const handleArtifactSelect = (artifactId: string, roomId?: string) => {
    if (!isMuted) soundFx.playBrassChime();
    if (roomId) setActiveRoom(roomId);
    setActiveArtifact(artifactId);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 p-4 md:p-6 flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Top-Left Pill / Expandable Checklist Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto flex flex-col bg-black/90 md:backdrop-blur-xl rounded-2xl border border-white/10 text-white shadow-2xl w-full md:w-[420px] overflow-hidden"
        >
          {/* Header Bar inside Pill */}
          <div className="flex items-center justify-between gap-3 p-3.5 border-b border-white/10">
            <div className="flex-1 text-xs md:text-sm font-medium leading-snug">
              <span>
                {allPlaced ? (
                  <>
                    <strong className="text-yellow-400">{currentRoom.name}</strong> đã trưng bày xong. Mời bạn tham quan!
                  </>
                ) : (
                  <>
                    Bạn là nhân viên sắp xếp của <strong className="text-yellow-400">{currentRoom.name}</strong>. Bấm vào bệ trống, đọc gợi ý rồi chọn đúng hiện vật trong túi đồ.
                  </>
                )}
              </span>
            </div>
            <button
              onClick={() => {
                if (!isMuted) soundFx.playWoodClick();
                setIsListOpen(!isListOpen);
              }}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-widest text-yellow-400 border border-white/10 shrink-0"
              title={isListOpen ? "Thu gọn danh sách" : "Mở danh sách hiện vật"}
            >
              <span>{formattedCounter}</span>
              <span className="text-gray-300 font-bold">{isListOpen ? "—" : "+"}</span>
            </button>
          </div>

          {/* Expandable Artifact Checklist */}
          <AnimatePresence>
            {isListOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="max-h-72 overflow-y-auto divide-y divide-white/10 text-xs bg-black/40"
              >
                {/* Danh sách này chỉ để theo dõi tiến độ. Không được tiết lộ hiện
                    vật thuộc phòng nào - tìm ra phòng đúng chính là phần chơi. */}
                {ARTIFACTS.map((artifact) => {
                  const isPlaced = placedIds.includes(artifact.id);

                  return (
                    <div key={artifact.id} className="flex flex-col px-4 py-2.5 hover:bg-white/5 transition-colors">
                      <div
                        onClick={() => {
                          if (isPlaced) {
                            handleArtifactSelect(artifact.id, artifact.roomId);
                          }
                        }}
                        className={`flex items-center justify-between gap-2 ${
                          isPlaced ? "cursor-pointer text-gray-300" : "text-white font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isPlaced ? (
                            <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                          ) : (
                            <span className="font-mono text-gray-500 font-bold shrink-0">○</span>
                          )}
                          <span>{artifact.title}</span>
                        </div>
                        <span className="font-mono text-[11px] text-gray-500 shrink-0">
                          {isPlaced ? "đã xếp" : "chưa xếp"}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* All items unlocked congrats banner inside checklist */}
                {allPlaced && (
                  <div
                    onClick={() => {
                      if (!isMuted) soundFx.playBrassChime();
                      setShowBadgeModal(true);
                    }}
                    className="p-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 text-center font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-yellow-500/30 transition-colors"
                  >
                    <Award size={16} />
                    <span>Xem Bằng Chứng Nhận Hoàn Thành ({ARTIFACTS.length}/{ARTIFACTS.length})!</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Top-Right: Night Mode Toggle, Sound Toggle & Room Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto flex items-center gap-2 flex-wrap"
        >
          {/* Room Navigation Pill */}
          <div className="flex items-center gap-1 bg-black/80 md:backdrop-blur-lg p-1.5 rounded-2xl md:rounded-full border border-white/10 shadow-xl overflow-x-auto max-w-[calc(100vw-2rem)] md:max-w-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {ROOMS.map((room) => {
              const isActive = activeRoomId === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => handleRoomClick(room.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-300 ${
                    isActive
                      ? "bg-red-700 text-white shadow-md scale-105"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {room.name.split(":")[0]}
                </button>
              );
            })}
          </div>

          {/* Chế độ Tham quan chỉ mở sau khi đã xếp đủ hiện vật */}
          {allPlaced && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => {
                if (!isMuted) soundFx.playWoodClick();
                setTourMode(!isTourMode);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 text-xs font-semibold text-white transition-colors shadow-xl ${
                isTourMode ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {isTourMode ? <Square size={14} /> : <Play size={14} />}
              <span>{isTourMode ? "Dừng Tham Quan" : "Tham Quan"}</span>
            </motion.button>
          )}

          {/* Night Mode Toggle */}
          <button
            onClick={() => {
              if (!isMuted) soundFx.playWoodClick();
              toggleNightMode();
            }}
            className="flex items-center gap-1.5 bg-black/80 md:backdrop-blur-lg px-3.5 py-2 rounded-full border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors shadow-xl"
            title="Chuyển đổi Chế độ Ban Ngày / Ban Đêm"
          >
            {isNightMode ? <Moon size={14} className="text-indigo-400" /> : <Sun size={14} className="text-amber-400" />}
            <span>{isNightMode ? "Đêm" : "Ngày"}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              toggleMute();
            }}
            className="flex items-center gap-2 bg-black/80 md:backdrop-blur-lg px-3.5 py-2 rounded-full border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors shadow-xl"
          >
            {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-green-400" />}
            <span>Âm thanh {isMuted ? "TẮT" : "BẬT"}</span>
          </button>
        </motion.div>
      </div>

      {/* Túi đồ - mở khi bấm vào một bệ còn trống */}
      <AnimatePresence>
        {openSlotArtifact && (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="pointer-events-auto absolute inset-x-4 md:inset-x-auto md:right-6 top-32 md:top-24 bottom-20 md:bottom-24 md:w-96 bg-black/85 md:backdrop-blur-xl border border-yellow-500/30 rounded-2xl text-white shadow-2xl flex flex-col z-40 overflow-hidden"
          >
            {/* Gợi ý của bệ đang chọn */}
            <div className="p-5 border-b border-white/10 shrink-0">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider">
                  Bệ trưng bày trống
                </span>
                <button
                  onClick={() => {
                    if (!isMuted) soundFx.playWoodClick();
                    openSlot(null);
                  }}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-yellow-100 leading-relaxed font-serif">
                💡 {openSlotArtifact.hint}
              </p>
            </div>

            {/* Phản hồi khi đặt sai */}
            <AnimatePresence>
              {wrongArtifact && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-900/40 border-b border-red-500/40 shrink-0"
                >
                  <p className="px-5 py-2.5 text-xs text-red-200 leading-relaxed">
                    <strong>{wrongArtifact.title}</strong> ({wrongArtifact.year}) không khớp gợi ý này. Đọc lại mốc thời gian và thử món khác nhé.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Danh sách hiện vật còn trong túi */}
            <div className="px-5 pt-3 pb-1 text-[11px] uppercase tracking-widest text-gray-400 font-bold shrink-0">
              Túi đồ · còn {inventory.length} hiện vật
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
              {inventory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePlace(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${
                    lastWrongId === item.id
                      ? "bg-red-500/20 border-red-500/50"
                      : "bg-white/5 border-white/10 hover:bg-yellow-500/15 hover:border-yellow-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium leading-snug">{item.title}</span>
                    <span className="font-mono text-[11px] text-yellow-400/80 shrink-0">{item.year}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Artifact Details Side Modal */}
      <AnimatePresence>
        {activeArtifact && !openSlotArtifact && (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="pointer-events-auto absolute inset-x-4 md:inset-x-auto md:right-6 top-32 md:top-24 bottom-20 md:bottom-24 md:w-96 bg-black/85 md:backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 text-white shadow-2xl flex flex-col justify-between overflow-y-auto z-40"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded-full font-mono text-xs font-bold uppercase">
                  Năm {activeArtifact.year}
                </span>
                <button
                  onClick={() => {
                    if (!isMuted) soundFx.playWoodClick();
                    setActiveArtifact(null);
                  }}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <h2 className="text-xl font-bold font-serif leading-snug mb-3 text-yellow-100">
                {activeArtifact.title}
              </h2>
              <div className="w-16 h-1 bg-red-600 mb-4 rounded-full" />

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {activeArtifact.description}
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Badge Modal when finding 15/15 Artifacts */}
      <AnimatePresence>
        {showBadgeModal && (
          <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 md:backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-gray-900 via-black to-red-950 border-2 border-yellow-500/50 rounded-3xl p-8 max-w-md w-full text-center text-white shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setShowBadgeModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <X size={18} />
              </button>

              <div className="mx-auto w-20 h-20 bg-yellow-500/20 border-2 border-yellow-400 rounded-full flex items-center justify-center mb-4 text-yellow-400 animate-pulse">
                <Award size={44} />
              </div>

              <h2 className="text-2xl font-bold font-serif text-yellow-300 mb-2">
                BẰNG CHỨNG NHẬN HOÀN THÀNH
              </h2>
              <p className="text-xs text-yellow-400/80 font-mono uppercase tracking-widest mb-4">
                Kháng Chiến Chống Pháp 1946 - 1954
              </p>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                Bạn đã sắp xếp đúng trọn vẹn <strong className="text-yellow-400">{ARTIFACTS.length}/{ARTIFACTS.length} hiện vật</strong> vào đúng vị trí trưng bày của chúng!
              </p>

              <div className="flex items-center justify-center gap-6 mb-6 text-xs">
                <div>
                  <div className="font-mono text-xl font-bold text-green-400">{ARTIFACTS.length}</div>
                  <div className="text-gray-400 uppercase tracking-wider">Xếp đúng</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <div className={`font-mono text-xl font-bold ${wrongAttempts === 0 ? "text-green-400" : "text-orange-400"}`}>
                    {wrongAttempts}
                  </div>
                  <div className="text-gray-400 uppercase tracking-wider">Lần nhầm</div>
                </div>
              </div>

              {wrongAttempts === 0 && (
                <p className="text-xs text-yellow-300 mb-4 font-semibold">
                  ⭐ Xuất sắc - không sai lần nào!
                </p>
              )}

              <button
                onClick={() => setShowBadgeModal(false)}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold rounded-xl text-sm transition-all shadow-lg"
              >
                Bắt Đầu Tham Quan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Center Zoom Pill Bar */}
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto flex items-center gap-3 bg-black/80 md:backdrop-blur-lg px-4 py-1.5 rounded-full border border-white/10 text-white text-xs shadow-xl"
        >
          <button
            onClick={() => {
              if (!isMuted) soundFx.playWoodClick();
              zoomOut();
            }}
            className="p-1 hover:text-yellow-400 transition-colors text-gray-300"
            title="Thu nhỏ"
          >
            <Minus size={14} />
          </button>
          <span className="font-mono text-xs font-semibold text-gray-200 min-w-[42px] text-center">
            {zoomPercentage}%
          </span>
          <button
            onClick={() => {
              if (!isMuted) soundFx.playWoodClick();
              zoomIn();
            }}
            className="p-1 hover:text-yellow-400 transition-colors text-gray-300"
            title="Phóng to"
          >
            <Plus size={14} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
