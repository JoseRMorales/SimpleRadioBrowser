import type { Station } from '@/types/station';

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
