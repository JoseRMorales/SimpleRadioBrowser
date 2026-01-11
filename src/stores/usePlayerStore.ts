import toast from 'react-hot-toast';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Station {
	id: string;
	name: string;
	favicon: string;
	urlResolved: string;
	tags: string[];
	country: string;
	state: string;
	votes: number;
	homepage?: string;
}

interface PlayerState {
	currentStation: Station | null;
	isPlaying: boolean;
	isLoading: boolean;
	volume: number;
	setCurrentStation: (station: Station | null) => void;
	togglePlay: () => void;
	setIsPlaying: (isPlaying: boolean) => void;
	setIsLoading: (isLoading: boolean) => void;
	setVolume: (volume: number) => void;
}

export function cleanStation(s: Record<string, unknown>): Station {
	return {
		id: (s.stationuuid as string) || (s.id as string),
		name: s.name as string,
		favicon: s.favicon as string,
		urlResolved: (s.url_resolved as string) || (s.urlResolved as string),
		tags: Array.isArray(s.tags) ? (s.tags as string[]) : (s.tags as string)?.split(',') || [],
		country: s.country as string,
		state: s.state as string,
		votes: (s.votes as number) || 0,
		homepage: s.homepage as string,
	};
}

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
