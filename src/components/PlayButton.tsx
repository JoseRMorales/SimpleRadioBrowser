import { Loader2, Pause, Play } from 'lucide-react';
import type React from 'react';
import { type Station, usePlayerStore } from '@/lib/usePlayerStore';

interface PlayButtonProps {
	station: Station;
}

const PlayButton: React.FC<PlayButtonProps> = ({ station }) => {
	const { currentStation, isPlaying, isLoading, togglePlay, setCurrentStation } = usePlayerStore();

	const isCurrentStation = currentStation?.id === station.id;

	const handleToggle = () => {
		if (isCurrentStation) {
			togglePlay();
		} else {
			setCurrentStation(station);
		}
	};

	return (
		<button
			type="button"
			onClick={handleToggle}
			disabled={isCurrentStation && isPlaying && isLoading}
			className={`group relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 disabled:opacity-80 ${
				isCurrentStation && isPlaying
					? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]'
					: 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95'
			}`}
		>
			{isCurrentStation && isPlaying ? (
				isLoading ? (
					<Loader2 size={32} className="animate-spin" />
				) : (
					<Pause size={32} fill="currentColor" />
				)
			) : (
				<Play size={32} fill="currentColor" className="ml-1" />
			)}
		</button>
	);
};

export default PlayButton;
