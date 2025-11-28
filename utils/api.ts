const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

export interface YouTubeThumbnail {
	url: string;
	width: number;
	height: number;
}

export interface YouTubeSnippet {
	publishedAt: string;
	channelId: string;
	title: string;
	description: string;
	thumbnails: {
		default: YouTubeThumbnail;
		medium: YouTubeThumbnail;
		high: YouTubeThumbnail;
		standard?: YouTubeThumbnail;
		maxres?: YouTubeThumbnail;
	};
	channelTitle: string;
	liveBroadcastContent: string;
	publishTime: string;
}

export interface YouTubeVideoId {
	kind: string;
	videoId: string;
}

// Pojedynczy element wideo
export interface YouTubeSearchResult {
	kind: string;
	etag: string;
	id: YouTubeVideoId;
	snippet: YouTubeSnippet;
}

export interface YouTubeAPIResponse {
	kind: string;
	etag: string;
	nextPageToken?: string;
	items: YouTubeSearchResult[];
}

const fetchVideos = async (query: string): Promise<YouTubeSearchResult[]> => {
	if (!apiKey) {
		console.error("Brak klucza API! Upewnij się, że masz EXPO_PUBLIC_GOOGLE_API_KEY w .env");
		return [];
	}

	try {
		const params = new URLSearchParams({
			part: 'snippet',
			type: 'video',
			maxResults: '6',
			q: query,
			key: apiKey,
		});

		const response = await fetch(`${BASE_URL}?${params.toString()}`);

		if (!response.ok) {
			throw new Error(`YouTube API Error: ${response.status}`);
		}

		const data: YouTubeAPIResponse = await response.json();
		return data.items;
	} catch (error) {
		console.error("Fetch error:", error);
		return [];
	}
};


export interface YouTubeStatistics {
	viewCount: string;
	likeCount: string;
	favoriteCount: string;
	commentCount: string;
}

export interface YouTubeVideoDetail {
	kind: string;
	etag: string;
	id: string;
	snippet: YouTubeSnippet;
	statistics: YouTubeStatistics;
}

export interface YouTubeVideoDetailsResponse {
	items: YouTubeVideoDetail[];
}


export interface YouTubeChannelSnippet {
	title: string;
	description: string;
	thumbnails: {
		default: YouTubeThumbnail;
		medium: YouTubeThumbnail;
		high: YouTubeThumbnail;
	};
}

export interface YouTubeChannelDetail {
	kind: string;
	etag: string;
	id: string;
	snippet: YouTubeChannelSnippet;
}

export interface YouTubeChannelResponse {
	items: YouTubeChannelDetail[];
}

export const fetchChannelDetails = async (channelId: string): Promise<YouTubeChannelDetail | null> => {
	if (!apiKey) return null;

	try {
		const params = new URLSearchParams({
			part: 'snippet',
			id: channelId,
			key: apiKey,
		});

		const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params.toString()}`);

		if (!response.ok) {
			throw new Error(`YouTube Channel API Error: ${response.status}`);
		}

		const data: YouTubeChannelResponse = await response.json();
		return data.items.length > 0 ? data.items[0] : null;
	} catch (error) {
		console.error("Fetch channel error:", error);
		return null;
	}
};

export const fetchVideoDetails = async (videoId: string): Promise<YouTubeVideoDetail | null> => {
	if (!apiKey) return null;

	try {
		const params = new URLSearchParams({
			part: 'snippet,statistics',
			id: videoId,
			key: apiKey,
		});

		const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params.toString()}`);

		if (!response.ok) {
			throw new Error(`YouTube API Error: ${response.status}`);
		}

		const data: YouTubeVideoDetailsResponse = await response.json();

		return data.items.length > 0 ? data.items[0] : null;
	} catch (error) {
		console.error("Fetch details error:", error);
		return null;
	}
};

export type SortOrder = 'date' | 'viewCount' | 'relevance';

export const fetchJsVideos = () => fetchVideos("javascript news tutorial");
export const fetchReactVideos = () => fetchVideos("reactjs tutorial course");
export const fetchRnVideos = () => fetchVideos("react native tutorial project");
export const fetchTsVideos = () => fetchVideos("typescript tutorial crash course");

export const searchVideos = async (query: string, order: SortOrder = 'relevance'): Promise<YouTubeSearchResult[]> => {
	const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
	if (!apiKey) return [];

	try {
		const params = new URLSearchParams({
			part: 'snippet',
			type: 'video',
			maxResults: '10',
			q: query,
			order: order, // <--- Dodajemy parametr order
			key: apiKey,
		});

		const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);

		if (!response.ok) {
			throw new Error(`YouTube API Error: ${response.status}`);
		}

		const data = await response.json();
		return data.items || [];
	} catch (error) {
		console.error("Fetch error:", error);
		return [];
	}
};
