import { navigate } from 'astro:transitions/client';
import { Globe, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import icon from '@/assets/icon.svg';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

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
		<header className="h-[64px] grid grid-cols-3 items-center px-6 bg-zinc-950/20 backdrop-blur-md border-b border-white/5">
			{/* Left side spacer */}
			<div className="flex items-center">
				<a href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
					<img src={icon.src} alt="RadioBrowser Logo" className="w-8 h-8" />
					<span className="hidden sm:inline">SimpleRadioBrowser</span>
				</a>
			</div>

			{/* Center: Search */}
			<div className="flex justify-center">
				<form onSubmit={handleSearch} className="w-full max-w-md relative group">
					<Search
						className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors"
						size={16}
					/>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search for radio stations..."
						className="w-full bg-zinc-800/30 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-white/20 focus:bg-zinc-800/60 transition-all shadow-sm"
					/>
				</form>
			</div>

			{/* Right: Country Selector */}
			<div className="flex justify-end">
				<Select value={initialCountry} onValueChange={handleCountryChange}>
					<SelectTrigger className="w-[180px] bg-zinc-800/30 border-white/10 rounded-full h-9 text-xs">
						<Globe className="size-3.5 mr-2 text-zinc-500" />
						<SelectValue placeholder="Select country" />
					</SelectTrigger>
					<SelectContent className="bg-zinc-900 border-white/10">
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
