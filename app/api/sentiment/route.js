import { NextResponse } from 'next/server';

/**
 * API configuration
 * - API_TOKEN: The authentication token from your .env.local file
 * - BASE_URL: The base URL for the LunarCrush API
 * - DEFAULT_LIMIT: Default number of coins to fetch if not specified
 */
import { DEFAULT_LIMIT, API_TOKEN, BASE_URL } from '@/app/constants';

/**
 * GET handler for the sentiment endpoint
 *
 * This function fetches cryptocurrency sentiment data from the LunarCrush API.
 * It accepts query parameters for sorting order and limiting results.
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Response} JSON response with cryptocurrency data or error message
 */
export async function GET(request) {
	try {
		// Step 1: Check if API token is available
		if (!API_TOKEN) {
			throw new Error(
				'API_TOKEN is missing. Please set LUNARCRUSH_API_TOKEN in .env.local'
			);
		}

		// Step 2: Extract query parameters from the URL
		const { searchParams } = new URL(request.url);

		// 'desc=1' means sort in descending order
		const desc = searchParams.get('desc') === '1' ? 1 : 0;

		// Get the limit or use default
		const limit = searchParams.get('limit')
			? parseInt(searchParams.get('limit'))
			: DEFAULT_LIMIT;

		// Step 3: Construct the API URL with query parameters
		const apiUrl = `${BASE_URL}coins/list/v1?sort=sentiment&limit=${limit}${
			desc ? '&desc=1' : ''
		}`;

		// Step 4: Make the API request
		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${API_TOKEN}`,
				'Content-Type': 'application/json',
			},
		});

		// Step 5: Check for successful response
		if (!response.ok) {
			throw new Error(`API Error: ${response.status}`);
		}

		// Step 6: Parse and return the JSON data
		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		// Error handling
		console.error('Failed to fetch sentiment data:', error);
		let errorMessage = 'Failed to fetch data';

		// Provide a more helpful error message for missing API token
		if (error.message.includes('API_TOKEN is missing')) {
			errorMessage =
				'Missing API key. Please set LUNARCRUSH_API_TOKEN in .env.local';
		}

		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
