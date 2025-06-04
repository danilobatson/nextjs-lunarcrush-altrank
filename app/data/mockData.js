/**
 * MOCK DATA FOR DEVELOPMENT AND TESTING
 *
 * This file contains sample cryptocurrency data that mimics the structure of
 * data returned from the LunarCrush API. It's used as a fallback when:
 *
 * 1. The API key is missing or invalid
 * 2. The API is unavailable or returns an error
 * 3. You're developing without an internet connection
 *
 * The data structure follows the LunarCrush API format with fields like:
 * - id: Unique identifier for the cryptocurrency
 * - symbol: Trading symbol (e.g., BTC, ETH)
 * - name: Full name of the cryptocurrency
 * - price: Current price in USD
 * - volume_24h: Trading volume in the last 24 hours
 * - market_cap: Total market capitalization
 * - sentiment: Social media sentiment score (0-100)
 * - galaxy_score: Combined score from various metrics (0-100)
 */
export const mockData = {
	config: {
		generated: 1749002977,
	},
	data: [
		{
			id: 97,
			symbol: 'ETP',
			name: 'Metaverse ETP',
			price: 0.0052705359118452475,
			price_btc: 4.984733257227768e-8,
			volume_24h: 56189.41,
			volatility: 0,
			circulating_supply: 83662952.18862058,
			max_supply: 100000000,
			percent_change_1h: -0.040837050411,
			percent_change_24h: 0.0649104500000177,
			percent_change_7d: 0.49231392,
			market_cap: 376842,
			market_cap_rank: 3251,
			interactions_24h: 15,
			social_volume_24h: 8,
			social_dominance: 0.0014768649111665756,
			market_dominance: 0.000011336233421155681,
			market_dominance_prev: 0.00001124945040608375,
			galaxy_score: 47.5,
			galaxy_score_previous: 47,
			alt_rank: 3857,
			alt_rank_previous: 4514,
			sentiment: 100,
			categories: 'pow',
			blockchains: [
				{
					type: 'layer1',
					network: 'metaverse etp',
					address: null,
					decimals: null,
				},
			],
			topic: 'etp metaverse etp',
			logo: 'https://cdn.lunarcrush.com/metaverse-etp.png',
			rank: 1, // Added rank field
		},
		{
			id: 98,
			symbol: 'XMX',
			name: 'XMAX',
			price: 0.000006302243993381724,
			price_btc: 5.960495432422777e-11,
			volume_24h: 52556.93,
			volatility: 1.2032,
			circulating_supply: 29659000998.08,
			max_supply: null,
			percent_change_1h: -0.09502078,
			percent_change_24h: -0.02844175,
			percent_change_7d: -0.0242053,
			market_cap: 156649.56,
			market_cap_rank: 3720,
			interactions_24h: 508,
			social_volume_24h: 12,
			social_dominance: 0.0022152973667498633,
			market_dominance: 0.000004712362150400784,
			market_dominance_prev: 0.000004676287293759297,
			galaxy_score: 30.5,
			galaxy_score_previous: 51,
			alt_rank: 3231,
			alt_rank_previous: 1534,
			sentiment: 100,
			blockchains: [
				{
					network: 'ethereum',
					address: '0x0f8c45b896784a1e408526b9300519ef8660209c',
					decimals: 8,
				},
			],
			topic: 'xmx xmax',
			logo: 'https://cdn.lunarcrush.com/xmax.png',
			rank: 2, // Added rank field
		},
		{
			id: 184,
			symbol: 'META',
			name: 'Metadium',
			price: 0.02227433475925753,
			price_btc: 2.1047376327543203e-7,
			volume_24h: 199107.09,
			volatility: 0.0077,
			circulating_supply: 1713108720,
			max_supply: null,
			percent_change_1h: 0.301151352783,
			percent_change_24h: -0.476776598631,
			percent_change_7d: -1.828764431219,
			market_cap: 38158357.11,
			market_cap_rank: 809,
			interactions_24h: 836,
			social_volume_24h: 8,
			social_dominance: 0.0014768649111665756,
			market_dominance: 0.0011478870273663115,
			market_dominance_prev: 0.0011390995321290576,
			galaxy_score: 16.6,
			galaxy_score_previous: 52,
			alt_rank: 2678,
			alt_rank_previous: 1929,
			sentiment: 100,
			blockchains: [
				{
					type: 'layer1',
					network: 'metadium',
					address: null,
					decimals: null,
				},
				{
					network: 'ethereum',
					address: '0xde2f7766c8bf14ca67193128535e5c7454f8387c',
					decimals: 18,
				},
			],
			topic: 'meta metadium',
			logo: 'https://cdn.lunarcrush.com/metadium.png',
			rank: 3, // Added rank field
		},
		{
			id: 1,
			symbol: 'BTC',
			name: 'Bitcoin',
			price: 106859.23,
			price_btc: 1,
			volume_24h: 25803489654,
			volatility: 0.0142,
			circulating_supply: 19760212,
			max_supply: 21000000,
			percent_change_1h: 0.301151352783,
			percent_change_24h: 1.47476598631,
			percent_change_7d: 5.828764431219,
			market_cap: 2111578923418,
			market_cap_rank: 1,
			interactions_24h: 154836,
			social_volume_24h: 19832,
			social_dominance: 35.2768649111665756,
			market_dominance: 53.724278870273663115,
			market_dominance_prev: 52.9890995321290576,
			galaxy_score: 75.6,
			galaxy_score_previous: 74.8,
			alt_rank: 1,
			alt_rank_previous: 1,
			sentiment: 65.7,
			blockchains: [
				{
					type: 'layer1',
					network: 'bitcoin',
					address: null,
					decimals: null,
				},
			],
			topic: 'btc bitcoin',
			logo: 'https://cdn.lunarcrush.com/bitcoin.png',
			rank: 4, // Added rank field
		},
		{
			id: 2,
			symbol: 'ETH',
			name: 'Ethereum',
			price: 3582.76,
			price_btc: 0.033529,
			volume_24h: 19452748903,
			volatility: 0.0187,
			circulating_supply: 119987965,
			max_supply: null,
			percent_change_1h: 0.15233,
			percent_change_24h: 1.23565,
			percent_change_7d: 3.74651,
			market_cap: 429923728547,
			market_cap_rank: 2,
			interactions_24h: 94253,
			social_volume_24h: 12954,
			social_dominance: 22.7368649111665756,
			market_dominance: 19.235470273663115,
			market_dominance_prev: 18.9761234321290576,
			galaxy_score: 72.3,
			galaxy_score_previous: 71.9,
			alt_rank: 2,
			alt_rank_previous: 2,
			sentiment: 62.4,
			blockchains: [
				{
					type: 'layer1',
					network: 'ethereum',
					address: null,
					decimals: null,
				},
			],
			topic: 'eth ethereum',
			logo: 'https://cdn.lunarcrush.com/ethereum.png',
			rank: 5, // Added rank field
		},
	],
};
