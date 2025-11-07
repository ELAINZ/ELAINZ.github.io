"use client";
import { useEffect, useState } from "react";

export default function WeatherWidget({ city }: { city: string }) {
  const [weather, setWeather] = useState<string>("");

  useEffect(() => {
    async function getWeather() {
      try {
        const res = await fetch(
          `https://wttr.in/${encodeURIComponent(city)}?format=%C+%t`
        );
        const text = await res.text();
        setWeather(text.trim());
      } catch {
        setWeather("Weather N/A");
      }
    }
    getWeather();
  }, [city]);

  return <span>{weather}</span>;
}
