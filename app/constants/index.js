/**
 * Application Constants
 * ====================
 *
 * This file contains application-wide constants used throughout the codebase.
 * Centralizing these values makes it easier to maintain and adjust
 * configuration settings.
 */

export const API_TOKEN = process.env.LUNARCRUSH_API_TOKEN;
export const BASE_URL = 'https://lunarcrush.com/api4/public/';

// Default display settings
export const DEFAULT_LIMIT = 30;
export const DEFAULT_SORT_DESCENDING = false;
export const AVAILABLE_DISPLAY_LIMITS = [10, 20, 30, 50, 100];

// Sentiment score thresholds for color coding
export const SENTIMENT_THRESHOLDS = {
	HIGH: 70, // High (Green)
	MEDIUM: 50, // Medium-high (Blue)
	LOW: 30, // Medium (Yellow)
	// Below 30 is considered poor (Red)
};

// API-related constants
export const API_ENDPOINTS = {
	SENTIMENT: '/api/sentiment',
};

// UI-related constants
export const VIEW_MODES = {
	GRID: 'grid',
	TABLE: 'table',
};

// Data refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
	AUTO: 60000, // 1 minute auto-refresh
};

// Helpful descriptions for metrics (for tooltips or explanations)
export const METRIC_DESCRIPTIONS = {
	SENTIMENT:
		'Sentiment score represents the overall attitude from social media posts. Higher scores (0-100) indicate more positive sentiment.',
	GALAXY_SCORE:
		'Galaxy score is a proprietary rating that combines social activity, market activity, and price performance into a single score (0-100).',
	MARKET_CAP:
		'The total value of all coins currently in circulation (price × circulating supply).',
	VOLUME: 'The total amount of coins traded in the last 24 hours.',
	PRICE_CHANGE:
		'Percentage change in coin price over the specified time period.',
};
