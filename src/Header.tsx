"use client";
import { APPLICATION_NAME } from "./main";


export function Header() {
  return (
    <div className="flex gap-2 justify-center items-center">
      <img src="/beer_logo.svg" className="w-16 h-16" alt="Logo" />
      <h1 className="text-6xl font-bold">{APPLICATION_NAME}</h1>
    </div>
  )
}