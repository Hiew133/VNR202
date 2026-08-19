import { create } from 'zustand';
import { ARTIFACTS, ROOMS, ArtifactData, RoomData } from '@/data/museumData';

interface AppState {
  activeRoomId: string;
  activeArtifactId: string | null;
  visitedArtifactIds: string[];
  isMuted: boolean;
  isNightMode: boolean;
  zoomPercentage: number;
  isTourMode: boolean;
  
  // Computed getters
  getCurrentRoom: () => RoomData;
  getActiveArtifact: () => ArtifactData | null;
  
  // Actions
  setActiveRoom: (roomId: string) => void;
  setActiveArtifact: (artifactId: string | null) => void;
  markArtifactVisited: (artifactId: string) => void;
  toggleMute: () => void;
  toggleNightMode: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setTourMode: (isTour: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  activeRoomId: 'main-hall',
  activeArtifactId: null,
  visitedArtifactIds: [],
  isMuted: false,
  isNightMode: false,
  zoomPercentage: 100,
  isTourMode: false,

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
