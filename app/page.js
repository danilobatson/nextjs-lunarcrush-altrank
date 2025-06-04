'use client';

/**
 * Crypto Sentiment Dashboard
 * =========================
 *
 * This is the main component for our Next.js application that displays
 * cryptocurrency sentiment data from the LunarCrush API. It shows sentiment
 * scores, price changes, and other metrics to help users understand market
 * sentiment around cryptocurrencies.
 *
 * Key Features:
 * - Displays cryptocurrency sentiment data in a grid or table view
 * - Allows sorting by sentiment score (ascending or descending)
 * - Shows detailed information when a cryptocurrency is selected
 * - Gracefully handles loading states and errors
 * - Falls back to mock data when the API is unavailable
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getSentimentData } from './services/lunarcrush';
import {
	DEFAULT_LIMIT,
	DEFAULT_SORT_DESCENDING,
	AVAILABLE_DISPLAY_LIMITS,
	SENTIMENT_THRESHOLDS,
	VIEW_MODES,
	METRIC_DESCRIPTIONS,
} from './constants/index';
import {
	formatTimeSince,
	formatNumber,
	formatPrice,
	formatPercentage,
} from './utils/formatters';
import Head from "next/head";

export default function Home() {
	// ===== STATE MANAGEMENT =====

	// Core data states
	const [data, setData] = useState([]); // The cryptocurrency data
	const [loading, setLoading] = useState(true); // Initial loading state
	const [error, setError] = useState(null); // Error message if fetch fails
	const [useMockData, setUseMockData] = useState(false); // Whether we're using mock data

	// UI states
	const [activeTab, setActiveTab] = useState(VIEW_MODES.GRID); // Current view (grid or table)
	const [selectedCoin, setSelectedCoin] = useState(null); // Selected coin for detail view
	const [isDescending, setIsDescending] = useState(DEFAULT_SORT_DESCENDING); // Sort direction
	const [displayLimit, setDisplayLimit] = useState(DEFAULT_LIMIT); // Number of coins to display

	// Additional states for UX
	const [isRefreshing, setIsRefreshing] = useState(false); // For manual refresh
	const [fetchStatus, setFetchStatus] = useState('idle'); // Status of data fetching

	// Reference to track if component is mounted
	const isMounted = useRef(true);

	// Reference to store the current filter params to avoid unnecessary fetches
	const currentParams = useRef({
		desc: isDescending ? 1 : 0,
		limit: displayLimit,
	});

	// Options for the limit dropdown (from constants)
	const limitOptions = AVAILABLE_DISPLAY_LIMITS;

	// ===== UTILITY FUNCTIONS =====

	// We've moved the formatTimeSince function to utils/formatters.js
	// It's now imported at the top of the file

	/**
	 * Fetches cryptocurrency data from the API
	 * @param {Object} params - Query parameters (desc, limit)
	 * @param {Object} options - Additional options
	 */
	const fetchCryptoData = useCallback(
		async (params = {}, options = {}) => {
			// Track whether this is a manual refresh or initial load
			const { forceRefresh = false } = options;

			// Update UI states based on whether this is a refresh or initial load
			if (forceRefresh) {
				setIsRefreshing(true);
				console.log('🔄 Refreshing data...');
			} else {
				setLoading(true);
				console.log('🔍 Loading initial data...');
			}

			// Reset error state and update fetch status
			setError(null);
			setFetchStatus('fetching');

			// Track performance
			const startTime = Date.now();

			try {
				// Step 1: Fetch data from our service
				const result = await getSentimentData(params);

				// Step 2: Check if we're using mock data (happens when API key is missing)
				if (result.usedMockData) {
					setUseMockData(true);
					console.log('⚠️ Using mock data (API key missing or error occurred)');
				}

				// Step 3: Process data to ensure all required fields have values
				const processedData = result.data.map((coin, index) => {
					return {
						...coin,
						// Ensure coins have a rank (use market cap rank, or alt rank, or index)
						rank: coin.market_cap_rank || coin.alt_rank || index + 1,

						// Ensure these values are never null/undefined to prevent UI errors
						sentiment: coin.sentiment ?? 0, // Sentiment score
						galaxy_score: coin.galaxy_score ?? 0, // Galaxy score
						percent_change_24h: coin.percent_change_24h ?? 0, // 24h price change
						percent_change_7d: coin.percent_change_7d ?? 0, // 7d price change
						volume_24h: coin.volume_24h ?? 0, // 24h volume
						market_cap: coin.market_cap ?? 0, // Market cap
						price: coin.price ?? 0, // Price
					};
				});

				// Step 4: Log performance and update state
				const endTime = Date.now();
				console.log(`✅ Data loaded in ${endTime - startTime}ms`);

				setData(processedData);
				setLoading(false);
				setIsRefreshing(false);
				setFetchStatus('complete');
			} catch (err) {
				// Step 5: Handle errors
				console.error('❌ Error loading data:', err);
				setError('Failed to load data. Check your API token in .env.local.');
				setLoading(false);
				setIsRefreshing(false);
				setFetchStatus('error');
			}
		},
		[] // No dependencies to prevent unnecessary re-creation
	);

	// Handle changes to filter parameters
	useEffect(() => {
		// Compare with previous params to avoid unnecessary fetches
		const newParams = {
			desc: isDescending ? 1 : 0,
			limit: displayLimit,
		};

		const paramsChanged =
			newParams.desc !== currentParams.current.desc ||
			newParams.limit !== currentParams.current.limit;

		if (paramsChanged && !loading && !isRefreshing) {
			// Update stored params
			currentParams.current = newParams;

			// Fetch with new parameters
			fetchCryptoData(newParams);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDescending, displayLimit, loading, isRefreshing]); // Don't include fetchCryptoData here

	// Initial data load and cleanup
	useEffect(() => {
		// Initial fetch on mount
		fetchCryptoData({
			desc: isDescending ? 1 : 0,
			limit: displayLimit,
		});

		// Cleanup function
		return () => {
			isMounted.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Empty dependency array means this runs only once on mount

	/**
	 * Gets the appropriate color for a sentiment score
	 * Uses the thresholds defined in our constants file for consistency
	 *
	 * @param {number} score - The sentiment score (0-100)
	 * @returns {string} Tailwind CSS color class
	 */
	const getSentimentColor = (score) => {
		if (score == null) return 'text-gray-400'; // No data
		if (score >= SENTIMENT_THRESHOLDS.HIGH) return 'text-green-500'; // High sentiment (good)
		if (score >= SENTIMENT_THRESHOLDS.MEDIUM) return 'text-blue-500'; // Medium-high sentiment
		if (score >= SENTIMENT_THRESHOLDS.LOW) return 'text-yellow-500'; // Medium sentiment
		return 'text-red-500'; // Low sentiment (bad)
	};

	// We've moved the formatNumber function to utils/formatters.js
	// It's now imported at the top of the file

	/**
	 * Loading state component - displayed while data is being fetched
	 * This gives users feedback that the application is working
	 */
	if (loading) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black'>
				{/* Spinning loader animation */}
				<div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>

				{/* Main loading message */}
				<p className='mt-4 text-lg font-medium text-blue-400'>
					Loading cryptocurrency data...
				</p>

				{/* Status messages to provide more context */}
				<div className='mt-2'>
					<p className='text-sm text-blue-300'>
						{/* Show different messages based on current status */}
						{fetchStatus === 'using-stale-data' &&
							'Using stored data while refreshing...'}
						{fetchStatus === 'processing' && 'Processing data...'}
						{fetchStatus === 'using-mock-data' && 'Using demo data...'}
					</p>
				</div>
			</div>
		);
	}

	/**
	 * Error state component - displayed when data fetching fails
	 * This provides useful information to help users fix the problem
	 */
	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black'>
				<div className='p-6 bg-gray-800 rounded-lg shadow-xl border border-red-500/20'>
					{/* Error header with icon */}
					<div className='flex items-center mb-4'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-8 w-8 text-red-500 mr-3'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
							/>
						</svg>
						<h2 className='text-xl font-bold text-red-400'>Error</h2>
					</div>

					{/* Error message */}
					<p className='text-gray-300'>{error}</p>

					{/* Help text */}
					<div className='mt-4 text-sm text-gray-400'>
						<p>Common solutions:</p>
						<ul className='list-disc ml-5 mt-2'>
							<li>Check if you&apos;ve added your API key to .env.local</li>
							<li>Verify your API key is valid and not expired</li>
							<li>Make sure your internet connection is working</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}

  return (
		<>
			<Head>
				<title>Crypto Sentiment Dashboard | Next.js + LunarCrush API</title>
				<meta
					name='description'
					content='Build a real-time crypto sentiment dashboard using Next.js and the LunarCrush API.'
				/>
				<meta
					property='og:title'
					content='Crypto Sentiment Dashboard | Next.js + LunarCrush API'
				/>
				<meta
					property='og:description'
					content='Build a real-time crypto sentiment dashboard using Next.js and the LunarCrush API.'
				/>
				<meta
					property='og:image'
					content='https://nextjs-lunarcrush-sentimentv2.vercel.app/appScreenPhoto.png'
				/>
				<meta
					property='og:url'
					content='https://nextjs-lunarcrush-sentimentv2.vercel.app/'
				/>
				<meta name='twitter:card' content='summary_large_image' />
			</Head>
			<div className='min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100'>
				{/* ===== APP HEADER ===== */}
				<header className='sticky top-0 z-10 backdrop-blur-md bg-black/50 border-b border-gray-800'>
					{/* Mock Data Warning Banner - shown only when using mock data */}
					{useMockData && (
						<div className='bg-amber-500/90 text-black py-2 px-4'>
							<div className='container mx-auto flex items-center justify-center'>
								{/* Warning icon */}
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5 mr-2'
									viewBox='0 0 20 20'
									fill='currentColor'>
									<path
										fillRule='evenodd'
										d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
										clipRule='evenodd'
									/>
								</svg>
								<p className='font-medium text-sm'>
									Using Demo Data - Please check your API key in .env.local file
								</p>
							</div>
						</div>
					)}

					{/* Main Header Content */}
					<div className='container mx-auto px-4 py-5'>
						{/* Title and View Toggle Buttons */}
						<div className='flex flex-col md:flex-row items-center justify-between mb-4'>
							{/* Dashboard Title */}
							<h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent'>
								Crypto Sentiment Dashboard
							</h1>

							{/* Grid/Table View Toggle */}
							<div className='flex items-center space-x-2 mt-4 md:mt-0'>
								<button
									onClick={() => setActiveTab('grid')}
									className={`px-4 py-2 rounded-md transition-all ${
										activeTab === 'grid'
											? 'bg-blue-600 text-white'
											: 'bg-gray-800 text-gray-300 hover:bg-gray-700'
									}`}>
									Grid View
								</button>
								<button
									onClick={() => setActiveTab('table')}
									className={`px-4 py-2 rounded-md transition-all ${
										activeTab === 'table'
											? 'bg-blue-600 text-white'
											: 'bg-gray-800 text-gray-300 hover:bg-gray-700'
									}`}>
									Table View
								</button>
							</div>
						</div>

						{/* Filter Controls */}
						<div className='flex flex-col sm:flex-row items-center justify-between gap-4 pb-2'>
							{/* Sort Order Toggle */}
							<div className='flex items-center bg-gray-800/70 rounded-lg p-1'>
								<button
									onClick={() => setIsDescending(false)}
									className={`px-3 py-1 rounded transition-all text-sm ${
										!isDescending
											? 'bg-blue-600 text-white'
											: 'text-gray-300 hover:bg-gray-700'
									}`}>
									Ascending
								</button>
								<button
									onClick={() => setIsDescending(true)}
									className={`px-3 py-1 rounded transition-all text-sm ${
										isDescending
											? 'bg-blue-600 text-white'
											: 'text-gray-300 hover:bg-gray-700'
									}`}>
									Descending
								</button>
							</div>

							{/* Limit Dropdown, Refresh Button and Loading Indicator */}
							<div className='flex flex-wrap items-center gap-2'>
								{/* "Show X coins" Dropdown */}
								<div className='flex items-center space-x-2'>
									<label
										htmlFor='limit-select'
										className='text-sm text-gray-300'>
										Show:
									</label>
									<select
										id='limit-select'
										value={displayLimit}
										onChange={(e) => setDisplayLimit(Number(e.target.value))}
										className='bg-gray-800/70 border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'>
										{limitOptions.map((limit) => (
											<option key={limit} value={limit}>
												{limit} coins
											</option>
										))}
									</select>
								</div>

								{/* Small loading spinner for refreshes */}
								{(loading || isRefreshing) && (
									<div className='flex items-center'>
										<div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
										<span className='ml-2 text-xs text-blue-400'>
											{isRefreshing ? 'Refreshing...' : 'Loading...'}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</header>

				{/* ===== MAIN CONTENT AREA ===== */}
				<main className='container mx-auto px-4 py-8'>
					{/* Grid View Layout */}
					{activeTab === 'grid' ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
							{/* Map through each coin and create a card */}
							{data.map((coin) => (
								<div
									key={coin.symbol + '_' + coin.id}
									onClick={() => setSelectedCoin(coin)} // Open details modal when clicked
									className='bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-900/20 transform hover:scale-[1.02] transition-all cursor-pointer group'>
									{/* Card Header */}
									<div className='p-5'>
										{/* Coin name and price */}
										<div className='flex justify-between items-start'>
											<div>
												<h2 className='text-xl font-bold'>
													{coin.name}
													<span className='ml-2 text-sm font-medium bg-gray-700 px-2 py-0.5 rounded'>
														{coin.symbol}
													</span>
												</h2>
												<p className='text-gray-400 text-sm mt-1'>
													Rank #{coin.rank}
												</p>
											</div>
											{/* Price with color based on sentiment */}
											<div
												className={`text-lg font-bold ${getSentimentColor(
													coin.sentiment
												)}`}>
												$
												{Number(coin.price).toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 6,
												})}
											</div>
										</div>

										{/* Sentiment Scores Section */}
										<div className='mt-4 grid grid-cols-2 gap-4'>
											{/* Sentiment Score */}
											<div className='bg-gray-700/30 p-3 rounded-lg'>
												<p className='text-xs text-gray-400'>Sentiment Score</p>
												<p
													className={`text-lg font-bold ${getSentimentColor(
														coin.sentiment
													)}`}>
													{coin.sentiment != null
														? coin.sentiment.toFixed(1)
														: 'N/A'}
												</p>
											</div>
											{/* Galaxy Score */}
											<div className='bg-gray-700/30 p-3 rounded-lg'>
												<p className='text-xs text-gray-400'>Galaxy Score</p>
												<p
													className={`text-lg font-bold ${getSentimentColor(
														coin.galaxy_score
													)}`}>
													{coin.galaxy_score != null
														? coin.galaxy_score.toFixed(1)
														: 'N/A'}
												</p>
											</div>
										</div>

										{/* Volume and Price Change */}
										<div className='mt-4 pt-4 border-t border-gray-700/50'>
											<div className='flex justify-between'>
												{/* 24h Volume */}
												<div>
													<p className='text-xs text-gray-400'>24h Volume</p>
													<p className='font-medium'>
														${formatNumber(coin.volume_24h)}
													</p>
												</div>
												{/* 24h Price Change */}
												<div>
													<p className='text-xs text-gray-400'>24h Change</p>
													<p
														className={
															coin.percent_change_24h >= 0
																? 'text-green-500' // Green for positive
																: 'text-red-500' // Red for negative
														}>
														{coin.percent_change_24h != null ? (
															<>
																{coin.percent_change_24h > 0 ? '+' : ''}
																{coin.percent_change_24h.toFixed(2)}%
															</>
														) : (
															'N/A'
														)}
													</p>
												</div>
											</div>
										</div>
									</div>

									{/* Card Footer */}
									<div className='bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-3 group-hover:bg-gradient-to-r group-hover:from-blue-800/30 group-hover:to-purple-800/30 transition-all'>
										<p className='text-xs text-center text-gray-300'>
											Click for more details
										</p>
									</div>
								</div>
							))}
						</div>
					) : (
						/* Table View Layout */
						<div className='overflow-x-auto bg-gray-800/30 rounded-xl border border-gray-700/50 shadow-lg'>
							<table className='min-w-full divide-y divide-gray-700'>
								{/* Table Header */}
								<thead className='bg-gray-800/80'>
									<tr>
										<th
											scope='col'
											className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
											Rank
										</th>
										<th
											scope='col'
											className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
											Coin
										</th>
										<th
											scope='col'
											className='px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider'>
											Price
										</th>
										<th
											scope='col'
											className='px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider'>
											24h %
										</th>
										<th
											scope='col'
											className='px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider'>
											Volume
										</th>
										<th
											scope='col'
											className='px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider'>
											Sentiment
										</th>
										<th
											scope='col'
											className='px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider'>
											Galaxy Score
										</th>
									</tr>
								</thead>
								{/* Table Body */}
								<tbody className='bg-gray-800/20 backdrop-blur-sm divide-y divide-gray-700'>
									{data.map((coin) => (
										<tr
											key={coin.symbol}
											onClick={() => setSelectedCoin(coin)} // Open details modal when clicked
											className='hover:bg-gray-700/30 cursor-pointer transition-colors'>
											{/* Rank */}
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
												{coin.rank}
											</td>
											{/* Coin Name and Symbol */}
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='flex items-center'>
													<div>
														<div className='text-sm font-medium text-gray-100'>
															{coin.name}
														</div>
														<div className='text-xs text-gray-400'>
															{coin.symbol}
														</div>
													</div>
												</div>
											</td>
											{/* Price */}
											<td className='px-6 py-4 whitespace-nowrap text-sm text-right'>
												$
												{Number(coin.price).toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 6,
												})}
											</td>
											{/* 24h Price Change */}
											<td
												className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
													coin.percent_change_24h >= 0
														? 'text-green-500' // Green for positive
														: 'text-red-500' // Red for negative
												}`}>
												{coin.percent_change_24h != null ? (
													<>
														{coin.percent_change_24h > 0 ? '+' : ''}
														{coin.percent_change_24h.toFixed(2)}%
													</>
												) : (
													'N/A'
												)}
											</td>
											{/* Volume */}
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right'>
												${formatNumber(coin.volume_24h)}
											</td>
											{/* Sentiment Score */}
											<td className='px-6 py-4 whitespace-nowrap text-right'>
												<div
													className={`text-sm font-medium ${getSentimentColor(
														coin.sentiment
													)}`}>
													{coin.sentiment != null
														? coin.sentiment.toFixed(1)
														: 'N/A'}
												</div>
											</td>
											{/* Galaxy Score */}
											<td className='px-6 py-4 whitespace-nowrap text-right'>
												<div
													className={`text-sm font-medium ${getSentimentColor(
														coin.galaxy_score
													)}`}>
													{coin.galaxy_score != null
														? coin.galaxy_score.toFixed(1)
														: 'N/A'}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{/* ===== COIN DETAIL MODAL ===== */}
					{selectedCoin && (
						<div
							className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'
							onClick={() => setSelectedCoin(null)}>
							{/* Modal Content Box */}
							<div
								className='bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden'
								onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
							>
								{/* Modal Header */}
								<div className='flex justify-between items-center p-5 border-b border-gray-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20'>
									<h3 className='text-xl font-bold'>
										{selectedCoin.name} ({selectedCoin.symbol}) Details
									</h3>
									{/* Close Button */}
									<button
										onClick={() => setSelectedCoin(null)}
										className='bg-gray-700 hover:bg-gray-600 rounded-full p-1'
										aria-label='Close details'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-5 w-5'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M6 18L18 6M6 6l12 12'
											/>
										</svg>
									</button>
								</div>

								{/* Modal Content */}
								<div className='p-5'>
									{/* Price and Market Cap */}
									<div className='grid grid-cols-2 gap-4 mb-5'>
										<div className='bg-gray-700/30 p-4 rounded-lg'>
											<p className='text-gray-400 text-sm'>Current Price</p>
											<p className='text-xl font-bold'>
												$
												{Number(selectedCoin.price).toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 8,
												})}
											</p>
										</div>
										<div className='bg-gray-700/30 p-4 rounded-lg'>
											<p className='text-gray-400 text-sm'>Market Cap</p>
											<p className='text-xl font-bold'>
												${formatNumber(selectedCoin.market_cap)}
											</p>
										</div>
									</div>

									{/* Sentiment and Galaxy Scores */}
									<div className='grid grid-cols-2 gap-4 mb-5'>
										<div className='bg-gray-700/30 p-4 rounded-lg'>
											<p className='text-gray-400 text-sm'>Sentiment Score</p>
											<p
												className={`text-xl font-bold ${getSentimentColor(
													selectedCoin.sentiment
												)}`}>
												{selectedCoin.sentiment != null
													? selectedCoin.sentiment.toFixed(1)
													: 'N/A'}
											</p>
											{/* Added explanation */}
											<p className='text-xs text-gray-400 mt-1'>
												Social media sentiment indicator (0-100)
											</p>
										</div>
										<div className='bg-gray-700/30 p-4 rounded-lg'>
											<p className='text-gray-400 text-sm'>Galaxy Score</p>
											<p
												className={`text-xl font-bold ${getSentimentColor(
													selectedCoin.galaxy_score
												)}`}>
												{selectedCoin.galaxy_score != null
													? selectedCoin.galaxy_score.toFixed(1)
													: 'N/A'}
											</p>
											{/* Added explanation */}
											<p className='text-xs text-gray-400 mt-1'>
												Combined rating of multiple metrics (0-100)
											</p>
										</div>
									</div>

									{/* Price Changes */}
									<div className='grid grid-cols-2 gap-4 mb-5'>
										<div className='bg-gray-700/30 p-4 rounded-lg'>
											<p className='text-gray-400 text-sm'>24h Change</p>
											<p
												className={`text-xl font-bold ${
													selectedCoin.percent_change_24h >= 0
														? 'text-green-500' // Positive change
														: 'text-red-500' // Negative change
												}`}>
												{selectedCoin.percent_change_24h != null ? (
													<>
														{selectedCoin.percent_change_24h > 0 ? '+' : ''}
														{selectedCoin.percent_change_24h.toFixed(2)}%
													</>
												) : (
													'N/A'
												)}
											</p>
										</div>
										<div className='bg-gray-700/30 p-4 rounded-lg'>
											<p className='text-gray-400 text-sm'>7d Change</p>
											<p
												className={`text-xl font-bold ${
													selectedCoin.percent_change_7d >= 0
														? 'text-green-500' // Positive change
														: 'text-red-500' // Negative change
												}`}>
												{selectedCoin.percent_change_7d != null ? (
													<>
														{selectedCoin.percent_change_7d > 0 ? '+' : ''}
														{selectedCoin.percent_change_7d.toFixed(2)}%
													</>
												) : (
													'N/A'
												)}
											</p>
										</div>
									</div>

									{/* Raw JSON Data (for developers) */}
									<div className='bg-gray-700/30 p-4 rounded-lg mb-5'>
										<div className='flex justify-between items-center'>
											<p className='text-gray-400 text-sm'>JSON Data</p>
											<p className='text-xs text-gray-400'>For developers</p>
										</div>
										<div className='mt-2 max-h-60 overflow-y-auto'>
											<SyntaxHighlighter
												language='json'
												style={dracula}
												className='rounded text-xs'>
												{JSON.stringify(selectedCoin, null, 2)}
											</SyntaxHighlighter>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</main>

				{/* ===== FOOTER ===== */}
				<footer className='py-6 border-t border-gray-800 bg-black/30'>
					<div className='container mx-auto px-4'>
						<div className='flex flex-col items-center justify-center gap-2'>
							<p className='text-center text-gray-400 text-sm'>
								Crypto Sentiment Dashboard • Powered by LunarCrush API •{' '}
								{new Date().getFullYear()}
							</p>
							{/* Added helpful information for beginners */}
							<p className='text-xs text-gray-500 text-center max-w-md'>
								This dashboard displays cryptocurrency sentiment data from
								social media. Higher sentiment scores (green) generally indicate
								positive market sentiment.
							</p>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
}
