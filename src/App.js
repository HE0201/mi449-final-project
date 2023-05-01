import { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(false);
  const apikey = 'be07b6f90d4a53f96095fc7422822b6d';

  const fetchWeather = async () => {
    if (!query) return;

    setLoading(true);

    try {
      // fetch weather data
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apikey}`
      );
      setWeather(weatherResponse.data);

      // fetch AQI data
      const aqiResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherResponse.data.coord.lat}&lon=${weatherResponse.data.coord.lon}&appid=${apikey}`
      );
      setAqi(aqiResponse.data.list[0].main.aqi);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div className="w-2/5 mx-auto text-center py-12 px-1">
      <div className="container px-8 py-8 bg-white rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="mb-4">
          <label htmlFor="query" className="sr-only">
            City
          </label>
          <input
            type="text"
            id="query"
            placeholder="Enter City Name"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full border rounded-md py-2 px-3 text-gray-700 mb-2"
          />
          <button
            type="submit"
            className="bg-gray-300 hover:bg-grey text-white font-bold py-2 px-4 rounded"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </form>
        {weather ? (
          <div className="container">
            <h1 className="text-3xl font-semibold mb-4">
              Current Weather in {weather.name}, {weather.sys.country}:
            </h1>
            <p>Temperature: {Math.round(weather.main.temp * 9/5 + 32)}°F</p>
            <p>Conditions: {weather.weather[0].description}</p>
            <p>AQI: {aqi}</p>
          </div>
        ) : (
          <p>Please enter a city name to see the weather there.</p>
        )}
      </div>
    </div>
  );
}

export default App;
