import { navigate } from 'astro:transitions/client';
import { ChevronRight, Hash, Home } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface Tag {
	name: string;
	stationcount: number;
}

interface SideMenuProps {
	tags: Tag[];
	activeTag?: string;
}

export default function SideMenu({ tags, activeTag }: SideMenuProps) {
	const [isOpen, setIsOpen] = useState(true);

	const handleTagClick = (tag: string) => {
		const params = new URLSearchParams(window.location.search);
		if (activeTag === tag) {
			params.delete('tag');
		} else {
			params.set('tag', tag);
			params.delete('q'); // Clear search when clicking a tag
		}
		navigate(`/?${params.toString()}`);
	};

	const handleHomeClick = () => {
		navigate('/');
	};

	return (
		<div className="flex flex-col gap-2 p-2 h-full overflow-hidden">
			<button
				type="button"
				onClick={handleHomeClick}
				className="flex items-center gap-4 px-4 py-3 text-zinc-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/5 active:scale-[0.98] group shrink-0"
			>
				<Home size={20} className="group-hover:scale-110 transition-transform" />
				<span className="font-semibold">Home</span>
			</button>

			<Collapsible
				open={isOpen}
				onOpenChange={setIsOpen}
				className="flex flex-col gap-1 w-full min-h-0 flex-1"
			>
				<CollapsibleTrigger asChild>
					<button
						type="button"
						className="flex items-center justify-between px-4 py-3 text-zinc-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/5 active:scale-[0.98] group w-full shrink-0"
					>
						<div className="flex items-center gap-4">
							<Hash size={20} className="group-hover:scale-110 transition-transform" />
							<span className="font-semibold">Tags</span>
						</div>
						<ChevronRight
							size={16}
							className={cn('transition-transform duration-200', isOpen && 'rotate-90')}
						/>
					</button>
				</CollapsibleTrigger>
				<CollapsibleContent className="flex-1 flex flex-col gap-0.5 mt-1 min-h-0">
					<div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar min-h-0 pb-4">
						{tags.map((tag) => (
							<button
								key={tag.name}
								type="button"
								onClick={() => handleTagClick(tag.name)}
								className={cn(
									'flex items-center justify-between w-full px-3 py-1.5 text-sm rounded-lg transition-all duration-300 active:scale-[0.98]',
									tag.name === activeTag
										? 'bg-white/10 text-white font-medium'
										: 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5',
								)}
							>
								<span className="truncate">#{tag.name}</span>
								<span className="text-[10px] opacity-60 ml-2 font-mono">{tag.stationcount}</span>
							</button>
						))}
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
