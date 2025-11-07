"use client";
export default function DateWidget({ date }: { date: string }) {
  return <span>{new Date(date).toLocaleDateString()}</span>;
}
