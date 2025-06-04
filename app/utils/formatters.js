/**
 * Utility Functions
 * ================
 *
 * This file contains reusable utility functions used throughout the application.
 * Centralizing these functions avoids code duplication and improves maintainability.
 */

/**
 * Formats a timestamp into a human-readable "time ago" string
 * @param {number} timestamp - The timestamp to format (milliseconds since epoch)
 * @returns {string} A human-readable time string (e.g., "5 minutes ago")
 */
export const formatTimeSince = (timestamp) => {
	if (!timestamp) return 'N/A';

	const seconds = Math.floor((Date.now() - timestamp) / 1000);

	if (seconds < 60) return `${seconds} seconds ago`;
	if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
	if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
	return `${Math.floor(seconds / 86400)} days ago`;
};

/**
 * Formats large numbers to be more readable (e.g., 1000000 -> 1.0M)
 * @param {number} num - The number to format
 * @returns {string} Formatted number with K (thousands) or M (millions) suffix
 */
export const formatNumber = (num) => {
	if (!num && num !== 0) return 'N/A';

	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M'; // Millions
	} else if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'K'; // Thousands
	}
	return num.toString(); // Small numbers unchanged
};

/**
 * Formats a price value with appropriate decimal places
 * @param {number} price - The price to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, options = {}) => {
	if (price == null) return 'N/A';

	const defaultOptions = {
		minimumFractionDigits: 2,
		maximumFractionDigits: 6,
		...options,
	};

	return Number(price).toLocaleString(undefined, defaultOptions);
};

/**
 * Formats a percentage value with a + or - sign and fixed decimal places
 * @param {number} percent - The percentage value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string with sign
 */
export const formatPercentage = (percent, decimals = 2) => {
	if (percent == null) return 'N/A';

	const sign = percent >= 0 ? '+' : '';
	return `${sign}${percent.toFixed(decimals)}%`;
};
