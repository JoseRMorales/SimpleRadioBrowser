import { Loader2, Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/stores/usePlayerStore';

// Single global audio instance to prevent duplication
let audioInstance: HTMLAudioElement | null = null;

const Player = () => {
	const {
		currentStation,
		isPlaying,
		togglePlay,
		setIsPlaying,
		volume,
		setVolume,
		isMuted,
		toggleMute,
		setIsMuted,
		isLoading,
		setIsLoading,
	} = usePlayerStore();
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (!audioInstance) {
			audioInstance = new Audio();
		}
		audioRef.current = audioInstance;

		const audio = audioRef.current;

		const handleLoadStart = () => setIsLoading(true);
		const handleWaiting = () => setIsLoading(true);
		const handlePlaying = () => setIsLoading(false);
		const handleCanPlay = () => {
			if (isPlaying) setIsLoading(false);
		};
		const handlePause = () => setIsLoading(false);
		const handleError = () => {
			setIsLoading(false);
			setIsPlaying(false);
		};

		audio.addEventListener('loadstart', handleLoadStart);
		audio.addEventListener('waiting', handleWaiting);
		audio.addEventListener('playing', handlePlaying);
		audio.addEventListener('canplay', handleCanPlay);
		audio.addEventListener('pause', handlePause);
		audio.addEventListener('error', handleError);
		audio.addEventListener('stalled', handleWaiting);

		return () => {
			audio.removeEventListener('loadstart', handleLoadStart);
			audio.removeEventListener('waiting', handleWaiting);
			audio.removeEventListener('playing', handlePlaying);
			audio.removeEventListener('canplay', handleCanPlay);
			audio.removeEventListener('pause', handlePause);
			audio.removeEventListener('error', handleError);
			audio.removeEventListener('stalled', handleWaiting);
		};
	}, [setIsLoading, setIsPlaying, isPlaying]);

	// Sync Volume & Mute
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
			audioRef.current.muted = isMuted;
		}
	}, [volume, isMuted]);

	// Sync Playback
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (currentStation) {
			// Robust URL comparison to avoid reloading the same stream
			const currentSrc = audio.src ? audio.src.replace(/\/$/, '') : '';
			const newSrc = currentStation.urlResolved.replace(/\/$/, '');

			if (currentSrc !== newSrc) {
				audio.pause();
				audio.src = currentStation.urlResolved; // Use original to be safe
				audio.load();

				if (isPlaying) {
					audio.play().catch((err) => {
						console.error('Playback failed:', err);
						setIsPlaying(false);
						setIsLoading(false);
					});
				}
			} else {
				// Sync play/pause state without reloading
				if (isPlaying && audio.paused) {
					audio.play().catch((err) => {
						console.error('Playback sync failed:', err);
						setIsPlaying(false);
						setIsLoading(false);
					});
				} else if (!isPlaying && !audio.paused) {
					audio.pause();
				}
			}
		} else {
			if (!audio.paused) audio.pause();
		}
	}, [currentStation, isPlaying, setIsPlaying, setIsLoading]);

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = Number.parseFloat(e.target.value);
		setVolume(val);
		if (val > 0 && isMuted) {
			setIsMuted(false);
		}
	};

	if (!currentStation) {
		return (
			<div className="h-full flex items-center justify-between px-4 bg-zinc-950/50 border-t border-white/5 backdrop-blur-xl">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
						<Music className="text-zinc-600" size={20} />
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-medium text-zinc-500 italic">No station selected</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex items-center justify-between px-4 bg-zinc-950/50 border-t border-white/5 backdrop-blur-xl">
			<div className="flex items-center gap-4 min-w-[300px]">
				<img
					src={currentStation.favicon}
					alt={currentStation.name}
					className="w-12 h-12 rounded-lg object-cover bg-zinc-800"
					onError={(e) => {
						(e.target as HTMLImageElement).src =
							'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik05IDE4VjVsMTItM3YxMyIvPjxwYXRoIGQ9Ik02IDIyaDNWMTloLTN6Ii8+PHBhdGggZD0iTTE4IDE5aDNWMTZoLTN6Ii8+PC9zdmc+';
					}}
				/>
				<div className="flex flex-col overflow-hidden">
					<span className="text-sm font-bold truncate text-zinc-100">{currentStation.name}</span>
					<span className="text-xs text-zinc-500 truncate">
						{currentStation.country} {currentStation.state && `• ${currentStation.state}`}
					</span>
				</div>
			</div>

			<div className="flex flex-col items-center gap-2">
				<button
					type="button"
					onClick={togglePlay}
					disabled={isLoading && isPlaying}
					className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-lg disabled:opacity-80"
				>
					{isLoading && isPlaying ? (
						<Loader2 size={20} className="animate-spin" />
					) : isPlaying ? (
						<Pause size={20} fill="currentColor" />
					) : (
						<Play size={20} fill="currentColor" className="ml-1" />
					)}
				</button>
			</div>

			<div className="flex items-center gap-3 min-w-[200px] justify-end group">
				<button
					type="button"
					onClick={toggleMute}
					className="hover:scale-110 transition-transform active:scale-90"
				>
					{isMuted || volume === 0 ? (
						<VolumeX size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
					) : (
						<Volume2 size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
					)}
				</button>
				<div className="w-24 h-1 bg-zinc-800 rounded-full relative flex items-center">
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={volume}
						onChange={handleVolumeChange}
						className="absolute w-full h-full opacity-0 cursor-pointer z-10"
					/>
					<div
						className={`h-full rounded-full transition-colors pointer-events-none ${
							isMuted ? 'bg-zinc-600' : 'bg-white group-hover:bg-blue-400'
						}`}
						style={{ width: `${isMuted ? 0 : volume * 100}%` }}
					/>
				</div>
			</div>
		</div>
	);
};

export default Player;
