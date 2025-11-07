"use client";
import { useEffect, useState } from "react";

export default function ClockWidget() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>;
}
