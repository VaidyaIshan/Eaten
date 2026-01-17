"use client"
import React, { useState } from "react";
import Navbar from "../components/Navbar/navbar";

export default function Home() {
  return (
    <>
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content - Add padding-top on mobile to account for hamburger button */}
      <div className="min-h-screen bg-[#170024] flex justify-center items-center pt-16 lg:pt-0">
        <div className="w-full max-w-2xl px-4">
          <div className="flex flex-col justify-center items-center gap-6 p-8 bg-purple-900/30 rounded-2xl backdrop-blur-sm border border-purple-500/20">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome</h1>
            
            <button className="w-full max-w-xs px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50 hover:scale-105">
              Home
            </button>
            
            <button className="w-full max-w-xs px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50 hover:scale-105">
              Ongoing Events
            </button>
            
            <button className="w-full max-w-xs px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50 hover:scale-105">
              Feedback
            </button>
          </div>
        </div>
      </div>
    </>
  );
}