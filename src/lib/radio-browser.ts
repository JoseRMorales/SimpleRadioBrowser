import { resolve, reverse } from 'node:dns/promises';
import { RadioBrowserApi } from 'radio-browser-api';

const FALLBACK_SERVERS = ['fi1.api.radio-browser.info'];

let cachedApi: RadioBrowserApi | null = null;

async function getDiscoveryServers(): Promise<string[]> {
	try {
		console.log('Resolving radio-browser servers...');
		const result = await resolve('all.api.radio-browser.info', 'A');

		let ips: string[] = [];

		if (Array.isArray(result)) {
			ips = result.map((r: string | { address: string }) =>
				typeof r === 'string' ? r : r.address,
			);
		}

		if (ips.length === 0) {
			console.warn('No IPs found via DNS, using fallbacks');
			return FALLBACK_SERVERS;
		}

		const hostnames: string[] = [];

		for (const ip of ips) {
			try {
				const names = await reverse(ip);
				console.log(names);
				if (names && names.length > 0) {
					hostnames.push(names[0]);
				}
			} catch (e) {
				console.warn(`Failed to reverse lookup ${ip}`, e);
			}
		}

		return hostnames.length > 0 ? hostnames : FALLBACK_SERVERS;
	} catch (error) {
		console.error('Server discovery failed:', error);
		return FALLBACK_SERVERS;
	}
}

export async function getRadioBrowserApi(): Promise<RadioBrowserApi> {
	if (cachedApi) return cachedApi;

	const discoveredServers = await getDiscoveryServers();

	let selectedServer: string | null = null;

	for (const server of discoveredServers) {
		try {
			console.log(`Checking health for server: ${server}`);
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout

			const response = await fetch(`https://${server}/json/codecs`, {
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (response.ok) {
				selectedServer = server;
				console.log(`Server ${server} is healthy`);
				break;
			}
		} catch (error) {
			console.warn(`Server ${server} health check failed`, error);
		}
	}

	if (!selectedServer) {
		throw new Error('All discovered Radio Browser servers failed health check');
	}

	const baseUrl = `https://${selectedServer}`;

	console.log(`Connecting to Radio Browser Server: ${baseUrl}`);

	cachedApi = new RadioBrowserApi('Simple Radio Browser App', true);
	cachedApi.setBaseUrl(baseUrl);

	return cachedApi;
}
