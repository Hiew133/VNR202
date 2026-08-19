import { create } from 'zustand';
import { ARTIFACTS, ROOMS } from '@/data/museumData';
import type { ArtifactData, RoomData } from '@/data/museumData';

interface AppState {
  activeRoomId: string;
  activeArtifactId: string | null;
  visitedArtifactIds: string[];
  isMuted: boolean;
  isNightMode: boolean;
  zoomPercentage: number;
  isTourMode: boolean;

  // ----- Chế độ Nghiệp vụ (minigame xếp hiện vật) -----
  /**
   * Bệ nào đã đặt được hiện vật. Mỗi hiện vật có đúng một bệ của nó, nên khoá
   * của map chính là id hiện vật đúng cho bệ đó: placedIds chứa id đã xếp xong.
   */
  placedIds: string[];
  /** Bệ đang mở bảng chọn để đặt đồ. null = không mở. */
  openSlotId: string | null;
  /** Lượt đặt sai gần nhất, để OverlayUI hiện phản hồi rồi tự xoá. */
  lastWrongId: string | null;
  /** Số lần đặt sai, hiện ở bảng tổng kết. */
  wrongAttempts: number;

  // Computed getters
  getCurrentRoom: () => RoomData;
  getActiveArtifact: () => ArtifactData | null;
  /** Hiện vật chưa được xếp - nội dung túi đồ. */
  getInventory: () => ArtifactData[];
  /** Đã xếp đủ chưa. Chế độ Tham quan chỉ mở khi giá trị này đúng. */
  isAllPlaced: () => boolean;

  // Actions
  setActiveRoom: (roomId: string) => void;
  setActiveArtifact: (artifactId: string | null) => void;
  markArtifactVisited: (artifactId: string) => void;
  toggleMute: () => void;
  toggleNightMode: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setTourMode: (isTour: boolean) => void;
  openSlot: (slotId: string | null) => void;
  /** Thử đặt hiện vật vào bệ đang mở. Trả về true nếu đúng bệ. */
  tryPlace: (artifactId: string) => boolean;
  clearWrong: () => void;
  resetGame: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  activeRoomId: 'main-hall',
  activeArtifactId: null,
  visitedArtifactIds: [],
  isMuted: false,
  isNightMode: false,
  zoomPercentage: 100,
  isTourMode: false,

  placedIds: [],
  openSlotId: null,
  lastWrongId: null,
  wrongAttempts: 0,

  getInventory: () => {
    const { placedIds } = get();
    return ARTIFACTS.filter((a) => !placedIds.includes(a.id));
  },

  isAllPlaced: () => get().placedIds.length === ARTIFACTS.length,

  openSlot: (slotId) => {
    set({ openSlotId: slotId, lastWrongId: null });
  },

  tryPlace: (artifactId) => {
    const { openSlotId, placedIds, wrongAttempts } = get();
    if (!openSlotId) return false;

    // Mỗi hiện vật chỉ khớp đúng bệ mang id của chính nó.
    if (artifactId !== openSlotId) {
      set({ lastWrongId: artifactId, wrongAttempts: wrongAttempts + 1 });
      return false;
    }

    set({
      placedIds: [...placedIds, artifactId],
      openSlotId: null,
      lastWrongId: null,
    });
    return true;
  },

  clearWrong: () => set({ lastWrongId: null }),

  resetGame: () => {
    set({
      placedIds: [],
      openSlotId: null,
      lastWrongId: null,
      wrongAttempts: 0,
      visitedArtifactIds: [],
      activeArtifactId: null,
      isTourMode: false,
    });
  },

  getCurrentRoom: () => {
    const { activeRoomId } = get();
    return ROOMS.find((r) => r.id === activeRoomId) || ROOMS[0];
  },

  getActiveArtifact: () => {
    const { activeArtifactId } = get();
    if (!activeArtifactId) return null;
    return ARTIFACTS.find((a) => a.id === activeArtifactId) || null;
  },

  setActiveRoom: (roomId) => {
    set({ activeRoomId: roomId, activeArtifactId: null });
  },

  setActiveArtifact: (artifactId) => {
    if (artifactId) {
      const { visitedArtifactIds } = get();
      if (!visitedArtifactIds.includes(artifactId)) {
        set({
          activeArtifactId: artifactId,
          visitedArtifactIds: [...visitedArtifactIds, artifactId],
        });
        return;
      }
    }
    set({ activeArtifactId: artifactId });
  },

  markArtifactVisited: (artifactId) => {
    const { visitedArtifactIds } = get();
    if (!visitedArtifactIds.includes(artifactId)) {
      set({ visitedArtifactIds: [...visitedArtifactIds, artifactId] });
    }
  },

  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }));
  },

  toggleNightMode: () => {
    set((state) => ({ isNightMode: !state.isNightMode }));
  },

  zoomIn: () => {
    set((state) => ({ zoomPercentage: Math.min(state.zoomPercentage + 15, 160) }));
  },

  zoomOut: () => {
    set((state) => ({ zoomPercentage: Math.max(state.zoomPercentage - 15, 60) }));
  },

  setTourMode: (isTour: boolean) => {
    set({ isTourMode: isTour });
  },
}));
