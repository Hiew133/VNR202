"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { ROOMS, ARTIFACTS } from "@/data/museumData";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Square, BookOpen, Volume2, VolumeX, Minus, Plus, HelpCircle, CheckCircle2, Moon, Sun, Award, Sparkles } from "lucide-react";
import { soundFx } from "@/utils/soundEffects";

export default function OverlayUI() {
  const [isListOpen, setIsListOpen] = useState(false);
  const [activeHintId, setActiveHintId] = useState<string | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const activeRoomId = useStore((state) => state.activeRoomId);
  const setActiveRoom = useStore((state) => state.setActiveRoom);
  const activeArtifactId = useStore((state) => state.activeArtifactId);
  const setActiveArtifact = useStore((state) => state.setActiveArtifact);
  const visitedArtifactIds = useStore((state) => state.visitedArtifactIds);
  const isMuted = useStore((state) => state.isMuted);
  const toggleMute = useStore((state) => state.toggleMute);
  const isNightMode = useStore((state) => state.isNightMode);
  const toggleNightMode = useStore((state) => state.toggleNightMode);
  const zoomPercentage = useStore((state) => state.zoomPercentage);
  const zoomIn = useStore((state) => state.zoomIn);
  const zoomOut = useStore((state) => state.zoomOut);
  const isTourMode = useStore((state) => state.isTourMode);
  const setTourMode = useStore((state) => state.setTourMode);

  const activeArtifact = activeArtifactId ? ARTIFACTS.find((a) => a.id === activeArtifactId) : null;
  const currentRoom = ROOMS.find((r) => r.id === activeRoomId) || ROOMS[0];

  const allVisited = visitedArtifactIds.length === ARTIFACTS.length;
  const formattedCounter = `${String(visitedArtifactIds.length).padStart(2, "0")}/${String(ARTIFACTS.length).padStart(2, "0")}`;

  const [hasTriggeredAchievement, setHasTriggeredAchievement] = useState(false);
  useEffect(() => {
    if (allVisited && !hasTriggeredAchievement) {
      setHasTriggeredAchievement(true);
      setShowBadgeModal(true);
      if (!isMuted) {
        soundFx.playFireworks();
      }
    }
  }, [allVisited, hasTriggeredAchievement, isMuted]);

  const handleHintClick = (artifactId: string, roomId: string) => {
    if (!isMuted) soundFx.playWoodClick();
    setActiveHintId(activeHintId === artifactId ? null : artifactId);
    setActiveRoom(roomId);
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
                Đây là không gian triển lãm <strong className="text-yellow-400">{currentRoom.name}</strong>. Hãy tìm đủ {ARTIFACTS.length} báu vật để khám phá nhé!
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
                {ARTIFACTS.map((artifact) => {
                  const isVisited = visitedArtifactIds.includes(artifact.id);
                  const room = ROOMS.find((r) => r.id === artifact.roomId);
                  const showHint = activeHintId === artifact.id;

                  return (
                    <div key={artifact.id} className="flex flex-col px-4 py-2.5 hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div
                          onClick={() => {
                            if (isVisited) {
                              handleArtifactSelect(artifact.id, artifact.roomId);
                            }
                          }}
                          className={`flex items-center gap-2 cursor-pointer ${
                            isVisited ? "line-through text-gray-400 opacity-65" : "text-white font-medium"
                          }`}
                        >
                          {isVisited ? (
                            <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                          ) : (
                            <span className="font-mono text-gray-400 font-bold">???</span>
                          )}
                          <span>{isVisited ? artifact.title : "???"}</span>
                        </div>

                        {!isVisited && (
                          <button
                            onClick={() => handleHintClick(artifact.id, artifact.roomId)}
                            className="flex items-center gap-1 text-[11px] text-yellow-400 hover:text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20 px-2 py-1 rounded transition-colors"
                          >
                            <HelpCircle size={11} />
                            <span>Gợi ý</span>
                          </button>
                        )}
                      </div>

                      {showHint && !isVisited && (
                        <div className="mt-1.5 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-[11px] text-yellow-200">
                          💡 <strong>Gợi ý:</strong> Nằm tại <strong className="underline">{room?.name}</strong>. Hãy di chuyển sang phòng này để tìm kiếm!
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* All items unlocked congrats banner inside checklist */}
                {allVisited && (
                  <div
                    onClick={() => {
                      if (!isMuted) soundFx.playBrassChime();
                      setShowBadgeModal(true);
                    }}
                    className="p-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 text-center font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-yellow-500/30 transition-colors"
                  >
                    <Award size={16} />
                    <span>Xem Bằng Chứng Nhận Sưu Tập Báu Vật (15/15)!</span>
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

          {/* Tour Mode Toggle */}
          <button
            onClick={() => {
              if (!isMuted) soundFx.playWoodClick();
              setTourMode(!isTourMode);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 text-xs font-semibold text-white transition-colors shadow-xl ${
              isTourMode ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {isTourMode ? <Square size={14} /> : <Play size={14} />}
            <span>{isTourMode ? "Dừng Tour" : "Bắt đầu Tour"}</span>
          </button>

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

      {/* Artifact Details Side Modal */}
      <AnimatePresence>
        {activeArtifact && (
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
                BẮNG CHỨNG NHẬN HOÀN THÀNH
              </h2>
              <p className="text-xs text-yellow-400/80 font-mono uppercase tracking-widest mb-4">
                Bảo Tàng Lịch Sử Đảng Cộng Sản Việt Nam
              </p>

              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Chúc mừng bạn đã xuất sắc tìm thấy và khám phá trọn vẹn <strong className="text-yellow-400">15/15 Báu Vật Lịch Sử</strong> quý giá!
              </p>

              <button
                onClick={() => setShowBadgeModal(false)}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold rounded-xl text-sm transition-all shadow-lg"
              >
                Tiếp Tục Tham Quan
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
