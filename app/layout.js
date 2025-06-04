import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata = {
	title: 'Crypto Sentiment Dashboard | Next.js + LunarCrush API',
	description:
		'Build a real-time crypto sentiment dashboard using Next.js and the LunarCrush API. Live demo, open source code, and setup guide.',
	openGraph: {
		title: 'Crypto Sentiment Dashboard | Next.js + LunarCrush API',
		description:
			'Build a real-time crypto sentiment dashboard using Next.js and the LunarCrush API. Live demo, open source code, and setup guide.',
		url: 'https://nextjs-lunarcrush-sentimentv2.vercel.app/',
		images: [
			{
				url: 'https://nextjs-lunarcrush-sentimentv2.vercel.app/appScreenPhoto.png', 
				width: 1200,
				height: 630,
				alt: 'Crypto Sentiment Dashboard Screenshot',
			},
		],
		siteName: 'Crypto Sentiment Dashboard',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Crypto Sentiment Dashboard | Next.js + LunarCrush API',
		description:
			'Live dashboard showing crypto sentiment using LunarCrush API and Next.js.',
		images: [
			'https://nextjs-lunarcrush-sentimentv2.vercel.app/appScreenPhoto.png',
		],
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}
