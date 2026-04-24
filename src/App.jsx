import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🌦 Weather icon mapping
  const getWeatherIcon = (code) => {
    if (code === 0) return "☀️";
    if ([1, 2, 3].includes(code)) return "⛅";
    if ([45, 48].includes(code)) return "🌫";
    if ([51, 53, 55].includes(code)) return "🌦";
    if ([61, 63, 65].includes(code)) return "🌧";
    if ([71, 73, 75].includes(code)) return "❄️";
    if ([95, 96, 99].includes(code)) return "⛈";
    return "🌍";
  };

  // 🔍 Fetch weather (No API key)
  const getWeather = async () => {
    if (!city) return;
    setLoading(true);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results) {
        setError("City not found ❌");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        name,
        temp: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
        code: weatherData.current_weather.weathercode,
      });

      setError("");
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
    setCity("");
  };

  // 📍 Auto location
  const getLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const data = await res.json();

      setWeather({
        name: "Your Location",
        temp: data.current_weather.temperature,
        wind: data.current_weather.windspeed,
        code: data.current_weather.weathercode,
      });
    });
  };

  // 🌈 Background change
  useEffect(() => {
    if (!weather) return;

    if (weather.code === 0) {
      document.body.style.background =
        "linear-gradient(135deg,#fceabb,#f8b500)";
    } else if ([61, 63, 65].includes(weather.code)) {
      document.body.style.background =
        "linear-gradient(135deg,#4e54c8,#8f94fb)";
    } else {
      document.body.style.background =
        "linear-gradient(135deg,#4facfe,#00f2fe)";
    }
  }, [weather]);

  return (
    <div className="app">
      <div className="card">

        <div className="top">
          <h2 className="title">🌤 Weather</h2>
        </div>

        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button onClick={getWeather}>Search</button>

        <button className="location-btn" onClick={getLocationWeather}>
          📍 My Location
        </button>

        {loading && <div className="loader"></div>}

        {weather && (
          <div className="result">
            <div className="icon">
              {getWeatherIcon(weather.code)}
            </div>

            <h3>{weather.name}</h3>
            <h1>{weather.temp}°</h1>
            <p>Wind {weather.wind} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;