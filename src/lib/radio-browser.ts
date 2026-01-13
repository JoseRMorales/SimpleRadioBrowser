import { resolveSrv } from 'node:dns/promises';
import { RadioBrowserApi } from 'radio-browser-api';

const FALLBACK_SERVERS = ['fi1.api.radio-browser.info'];

let cachedApi: RadioBrowserApi | null = null;

async function getRadiobrowserBaseUrls() {
	const hosts = await resolveSrv('_api._tcp.radio-browser.info');
	console.log('Resolved radio-browser servers:', hosts);
	hosts.sort();
	return hosts.map((host) => host.name);
}

/**
 * Gets a list of available servers from DNS.
 */
async function getDiscoveryServers(): Promise<string[]> {
	try {
		console.log('Resolving radio-browser servers...');
		const servers = await getRadiobrowserBaseUrls();

		if (!servers || servers.length === 0) {
			return FALLBACK_SERVERS;
		}

		servers.forEach((server) => {
			if (!FALLBACK_SERVERS.includes(server)) {
				FALLBACK_SERVERS.push(server);
			}
		});
		return FALLBACK_SERVERS;
	} catch (error) {
		console.error('DNS Discovery failed, using fallbacks:', error);
		return FALLBACK_SERVERS;
	}
}

/**
 * Returns a healthy RadioBrowserApi instance.
 * Implements simple health check and caching.
 */
export async function getRadioBrowserApi(): Promise<RadioBrowserApi> {
	if (cachedApi) {
		return cachedApi;
	}

	const servers = await getDiscoveryServers();
	let selectedServer: string | null = null;

	for (const server of servers) {
		try {
			console.log(`Checking health for: ${server}`);
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000);

			const url = `https://${server}/json/codecs`;

			const response = await fetch(url, { signal: controller.signal });
			clearTimeout(timeoutId);

			if (response.ok) {
				selectedServer = server;
				console.log(`Successfully connected to ${server}`);
				break;
			}
		} catch (e) {
			console.warn(`Server ${server} failed health check:`, e instanceof Error ? e.message : e);
		}
	}

	if (!selectedServer) {
		selectedServer = servers[0] || 'fi1.api.radio-browser.info';
	}

	const api = new RadioBrowserApi('Simple Radio Browser App', true);
	api.setBaseUrl(`https://${selectedServer}`);
	cachedApi = api;

	return api;
}

/**
 * Helper to wrap API calls with a simple retry logic
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
	let lastError: unknown;
	for (let i = 0; i <= retries; i++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;
			console.warn(`API call failed (attempt ${i + 1}/${retries + 1}), retrying...`, error);
			await new Promise((r) => setTimeout(r, 500 * (i + 1)));
		}
	}
	throw lastError;
}
