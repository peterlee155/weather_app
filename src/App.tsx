import React, { useState, useEffect } from 'react';
import { Search, Cloud, Droplets, Wind, Thermometer, Sun } from 'lucide-react';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
}

function App() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = 'd1a2e9ccbc00899121a8cb5526ad9149'; // Note: In production, use environment variables
  
  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather();
  };

  const getWeatherBackground = () => {
    if (!weather) return 'bg-gradient-to-br from-blue-400 to-blue-600';
    const condition = weather.weather[0].main.toLowerCase();
    const backgrounds = {
      clear: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      clouds: 'bg-gradient-to-br from-gray-400 to-gray-600',
      rain: 'bg-gradient-to-br from-blue-600 to-blue-800',
      snow: 'bg-gradient-to-br from-blue-100 to-blue-300',
      default: 'bg-gradient-to-br from-blue-400 to-blue-600'
    };
    return backgrounds[condition as keyof typeof backgrounds] || backgrounds.default;
  };

  return (
    <div className={`min-h-screen ${getWeatherBackground()} transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white hover:text-white/70 transition-colors"
              >
                <Search size={24} />
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-md text-white p-4 rounded-lg mb-8">
              {error}
            </div>
          )}

          {/* Weather Card */}
          {loading ? (
            <div className="text-center text-white">Loading...</div>
          ) : (
            weather && (
              <div className="bg-white/20 backdrop-blur-md rounded-lg p-8 text-white">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold mb-2">{weather.name}</h1>
                  <p className="text-6xl font-bold mb-4">
                    {Math.round(weather.main.temp)}°C
                  </p>
                  <p className="text-xl capitalize">{weather.weather[0].description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-6 h-6" />
                    <div>
                      <p className="text-sm">Feels Like</p>
                      <p className="font-bold">{Math.round(weather.main.feels_like)}°C</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Droplets className="w-6 h-6" />
                    <div>
                      <p className="text-sm">Humidity</p>
                      <p className="font-bold">{weather.main.humidity}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wind className="w-6 h-6" />
                    <div>
                      <p className="text-sm">Wind Speed</p>
                      <p className="font-bold">{weather.wind.speed} m/s</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;