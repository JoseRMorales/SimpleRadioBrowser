import { Loader2, Pause, Play } from 'lucide-react';
import type React from 'react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import type { Station } from '@/types/station';

interface CardPlayButtonProps {
	station: Station;
}

const CardPlayButton: React.FC<CardPlayButtonProps> = ({ station }) => {
	const { currentStation, isPlaying, isLoading, togglePlay, setCurrentStation } = usePlayerStore();

	const isCurrentStation = currentStation?.id === station.id;

	const handleToggle = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
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
			className={`absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl translate-y-12 group-hover:translate-y-0 disabled:opacity-80 ${
				isCurrentStation && isPlaying
					? 'bg-blue-500 text-white opacity-100 translate-y-0'
					: 'bg-white text-black opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95'
			}`}
		>
			{isCurrentStation && isPlaying ? (
				isLoading ? (
					<Loader2 size={18} className="animate-spin" />
				) : (
					<Pause size={18} fill="currentColor" />
				)
			) : (
				<Play size={18} fill="currentColor" className="ml-0.5" />
			)}
		</button>
	);
};

export default CardPlayButton;
