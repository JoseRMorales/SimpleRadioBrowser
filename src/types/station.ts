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

export interface PlayerState {
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
