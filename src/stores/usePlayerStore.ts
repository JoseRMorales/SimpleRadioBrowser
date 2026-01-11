import toast from 'react-hot-toast';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayerState } from '@/types/station';

export const usePlayerStore = create<PlayerState>()(
	persist(
		(set) => ({
			currentStation: null,
			isPlaying: false,
			isLoading: false,
			volume: 0.7,
			setCurrentStation: (station) => {
				if (station && !station.urlResolved) {
					toast.error(`Station "${station.name}" has no valid stream URL.`);
					return;
				}
				set({ currentStation: station, isPlaying: !!station, isLoading: !!station });
			},
			togglePlay: () =>
				set((state) => {
					if (!state.currentStation?.urlResolved && !state.isPlaying) {
						return state;
					}
					return { isPlaying: !state.isPlaying };
				}),
			setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
			setIsLoading: (isLoading: boolean) => set({ isLoading }),
			setVolume: (volume: number) => set({ volume }),
		}),
		{
			name: 'radio-player-storage',
			partialize: (state) => ({ volume: state.volume }), // Only persist volume
		},
	),
);
