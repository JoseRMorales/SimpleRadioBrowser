import { navigate } from 'astro:transitions/client';
import { Globe, Menu, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import icon from '@/assets/icon.svg';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useUIStore } from '@/stores/useUIStore';

interface Country {
	name: string;
	code: string;
	stationCount: number;
}

interface HeaderProps {
	countries: Country[];
	initialSearch?: string;
	initialCountry?: string;
}

export default function Header({
	countries,
	initialSearch = '',
	initialCountry = 'ES',
}: HeaderProps) {
	const [search, setSearch] = useState(initialSearch);
	const { toggleMobileMenu, isMobileMenuOpen } = useUIStore();

	// Debounced search
	useEffect(() => {
		// Don't trigger search if it's the initial value
		if (search === initialSearch) return;

		const timer = setTimeout(() => {
			const params = new URLSearchParams(window.location.search);
			if (search) {
				params.set('q', search);
			} else {
				params.delete('q');
			}
			params.set('country', initialCountry);
			navigate(`/?${params.toString()}`, { history: 'replace' });
		}, 200);

		return () => clearTimeout(timer);
	}, [search, initialSearch, initialCountry]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(window.location.search);
		if (search) {
			params.set('q', search);
		} else {
			params.delete('q');
		}
		params.set('country', initialCountry);
		navigate(`/?${params.toString()}`);
	};

	const handleCountryChange = (newCountry: string) => {
		const params = new URLSearchParams(window.location.search);
		params.set('country', newCountry);
		if (search) {
			params.set('q', search);
		}
		navigate(`/?${params.toString()}`);
	};

	return (
		<header className="h-[64px] flex items-center justify-between px-4 md:px-6 bg-zinc-950/20 backdrop-blur-md border-b border-white/5 gap-4">
			{/* Left: Menu & Logo */}
			<div className="flex items-center gap-2 md:gap-4 shrink-0">
				<button
					type="button"
					onClick={toggleMobileMenu}
					className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
					aria-label="Toggle menu"
				>
					{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
				<a href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
					<img src={icon.src} alt="RadioBrowser Logo" className="w-8 h-8" />
					<span className="hidden lg:inline">SimpleRadioBrowser</span>
				</a>
			</div>

			{/* Center: Search */}
			<div className="flex-1 max-w-xl">
				<form onSubmit={handleSearch} className="relative group">
					<Search
						className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors"
						size={16}
					/>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search stations..."
						className="w-full bg-zinc-800/30 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs md:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-white/20 focus:bg-zinc-800/60 transition-all shadow-sm"
					/>
				</form>
			</div>

			{/* Right: Country Selector */}
			<div className="shrink-0">
				<Select value={initialCountry} onValueChange={handleCountryChange}>
					<SelectTrigger className="w-[45px] md:w-[150px] bg-zinc-800/30 border-white/10 rounded-full h-8 md:h-9 text-[10px] md:text-xs px-2 md:px-3">
						<Globe className="size-3.5 md:mr-2 text-zinc-500" />
						<div className="hidden md:block">
							<SelectValue placeholder="Country" />
						</div>
					</SelectTrigger>
					<SelectContent className="bg-zinc-900 border-white/10 max-h-[50vh]">
						{countries.map((c) => (
							<SelectItem key={c.code} value={c.code} className="text-xs">
								{c.name} <span className="text-zinc-500 ml-1">({c.stationCount})</span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</header>
	);
}
