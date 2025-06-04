import { mockData } from '../data/mockData';

/**
 * LunarCrush API Service
 * ======================
 *
 * This service handles all communication with the LunarCrush API through
 * our backend API route. It provides methods for fetching cryptocurrency
 * sentiment data and includes error handling and fallback mechanisms.
 *
 * Key concepts:
 *
 * 1. API Endpoint: We don't call the LunarCrush API directly from the frontend.
 *    Instead, we call our own backend API route (/api/sentiment) which then
 *    securely forwards the request to LunarCrush with proper authentication.
 *
 * 2. Mock Data: For development or when API access fails, we provide mock
 *    data that mimics the structure of real API responses.
 *
 * 3. Error Handling: All API calls are wrapped in try/catch blocks to
 *    ensure the application doesn't crash if the API is unavailable.
 */

/**
 * Fetches cryptocurrency sentiment data from our API endpoint
 *
 * This function tries to get real data from the LunarCrush API via our
 * backend endpoint. If the request fails (e.g., no API key), it falls
 * back to using mock data for demonstration purposes.
 *
 * @param {Object} params - Query parameters
 * @param {boolean} params.desc - Sort in descending order if true (1 = descending, 0 = ascending)
 * @param {number} params.limit - Number of results to return (e.g., 10, 30, 100)
 * @returns {Promise<Object>} The cryptocurrency data with structure matching the LunarCrush API
 * @example
 * // Fetch the top 20 cryptocurrencies sorted by sentiment (highest first)
 * const data = await getSentimentData({ desc: 1, limit: 20 });
 */
export async function getSentimentData(params = {}) {
	try {
		// Step 1: Build the query string from parameters
		const queryParams = new URLSearchParams();

		// Add sorting parameter (1 = descending, 0 = ascending)
		if (params.desc !== undefined) {
			queryParams.append('desc', params.desc ? '1' : '0');
		}

		// Add limit parameter if provided
		if (params.limit !== undefined) {
			queryParams.append('limit', params.limit.toString());
		}

		// Step 2: Construct the full URL with query parameters
		const url = `/api/sentiment${
			queryParams.toString() ? `?${queryParams.toString()}` : ''
		}`;

		// Step 3: Make the API request to our backend
		console.log('Fetching data from:', url);
		const response = await fetch(url);

		// Step 4: Check if the response is successful
		if (!response.ok) {
			throw new Error(`API Error: ${response.status}`);
		}

		// Step 5: Parse and return JSON data
		return await response.json();
	} catch (error) {
		// Error handling - use mock data as fallback
		console.error('Failed to fetch sentiment data:', error);
		console.warn(
			'Using mock data as fallback - this helps during development or when API access is unavailable'
		);

		// Step 1: Create a copy of mock data with a flag indicating it's mock data
		let result = {
			...mockData,
			usedMockData: true, // This flag helps the UI show a notification
		};

		// Step 2: Sort the mock data if descending parameter was provided
		if (params.desc) {
			result = {
				...result,
				// Create a new sorted array without modifying the original
				data: [...result.data].reverse(),
			};
		}

		// Step 3: Apply limit to the mock data if requested
		if (params.limit) {
			result = {
				...result,
				data: result.data.slice(0, params.limit),
			};
		}

		return result;
	}
}
