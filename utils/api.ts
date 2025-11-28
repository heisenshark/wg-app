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

export const fetchJsVideos = () => fetchVideos("javascript news tutorial");
export const fetchReactVideos = () => fetchVideos("reactjs tutorial course");
export const fetchRnVideos = () => fetchVideos("react native tutorial project");
export const fetchTsVideos = () => fetchVideos("typescript tutorial crash course");
