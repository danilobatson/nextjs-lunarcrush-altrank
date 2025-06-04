# Crypto Sentiment Dashboard

A beginner-friendly Next.js application that displays cryptocurrency sentiment data from the LunarCrush API. This dashboard helps users visualize and understand market sentiment around different cryptocurrencies.

![Dashboard Preview](/public/appScreenPhoto.png)

## 📚 What is Crypto Sentiment?

Crypto sentiment refers to the overall attitude or feeling that investors and the public have toward a specific cryptocurrency. This dashboard displays two key sentiment metrics:

- **Sentiment Score**: A value (0-100) that represents social media sentiment about a cryptocurrency. Higher scores indicate more positive public sentiment.
- **Galaxy Score**: A combined rating (0-100) that considers multiple factors including price volatility, social media activity, and market trends.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- A free LunarCrush API key (instructions below)

## Sign Up For A LunarCrush Account

To access the LunarCrush API, you'll need to sign up for a paid plan (otherwise you'll use mock data):

1. Visit [LunarCrush Signup](https://lunarcrush.com/signup)
2. Enter your email address and click "Continue"
3. Check your email for a verification code and enter it
4. Complete the onboarding steps:
   - Select your favorite categories (or keep the defaults)
   - Create your profile (add a photo and nickname if desired)
   - **Important:** Select a subscription plan (you'll need at least an Individual plan to generate an API key)
5. Once you've subscribed, navigate to [https://www.lunarcrush.com/developers/api/authentication](https://www.lunarcrush.com/developers/api/authentication) and generate an API key.
6. Create a `.env.local` file in the root directory of this project
7. Add your API key:

   ```bash
   LUNARCRUSH_API_TOKEN=your_api_key_here
   ```

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/danilobatson/nextjs-lunarcrush-sentiment.git
   cd nextjs-lunarcrush-sentiment
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to see the dashboard!

## 🧩 Project Structure

- `app/page.js` - Main dashboard component
- `app/services/lunarcrush.js` - Service for making API calls
- `app/api/sentiment/route.js` - API route handler
- `app/data/mockData.js` - Fallback data for development
- `app/constants/index.js` - Global constants defined
- `utils/formatters.js` - Data formatters for FE rendering

## 🔍 Features

- **Grid and Table Views**: Toggle between different ways to view crypto data
- **Sorting Controls**: Sort cryptocurrencies by sentiment score
- **Detail View**: Click on any cryptocurrency to see detailed information
- **Responsive Design**: Works on desktop and mobile devices
- **Automatic Fallback**: Uses mock data if API access fails

## 📘 Understanding the Code

### Main Components

1. **API Route Handler** (`route.js`):
   - Handles requests to the LunarCrush API
   - Manages authentication and error handling

2. **LunarCrush Service** (`lunarcrush.js`):
   - Makes API calls to fetch sentiment data
   - Provides fallback to mock data when needed

3. **Main Dashboard** (`page.js`):
   - Displays cryptocurrency data in grid or table format
   - Manages state, filtering, and sorting

## 🛠 Customization

- Modify `displayLimit` in `page.js` to change the default number of cryptocurrencies shown
- Adjust color themes by editing the Tailwind classes
- Add additional metrics by updating the card and table components

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [LunarCrush](https://lunarcrush.com) for providing the API
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

### Connect With Me on LinkedIn

If you found this tutorial helpful, I'd love to connect with you on LinkedIn! Feel free to reach out with questions, feedback, or just to share what you've built with this project.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/danilo-batson)
