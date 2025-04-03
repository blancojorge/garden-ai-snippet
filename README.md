# AI Garden Machinery Advisor

An intelligent garden machinery advisor for Spanish eCommerce websites that provides personalized product recommendations based on location, weather, and seasonal conditions.

## Features

- Location-aware greetings and recommendations
- Real-time weather integration
- Seasonal gardening advice specific to Spanish regions
- Conversational interface for product recommendations
- Mobile-responsive design
- Spanish language support

## Technical Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React Icons
- OpenWeatherMap API (for weather data)
- OpenAI API (for natural language processing)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your API keys:
   ```
   OPENWEATHER_API_KEY=your_api_key
   OPENAI_API_KEY=your_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key
- `OPENAI_API_KEY`: Your OpenAI API key

## Project Structure

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── WeatherDisplay.tsx
│   ├── ChatInterface.tsx
│   └── ProductRecommendation.tsx
├── lib/
│   ├── weather.ts
│   ├── location.ts
│   └── ai.ts
└── types/
    └── index.ts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 