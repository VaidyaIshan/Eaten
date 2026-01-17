"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"
import StarsAndMoon from "../assets/vectors/starsandmoon"

import EventsSection from "../components/admin/EventsSection"
import MealSessionsSection from "../components/admin/MealSessionsSection"
import FoodClaimsSection from "../components/admin/FoodClaimsSection"
import UsersSection from "../components/admin/UsersSections"
import FeedbacksSection from "../components/admin/FeedbacksSection"
import Navbar from "../components/Navbar/navbar"


type TabType = "events" | "mealsessions" | "users" | "feedbacks" | "foodclaims"

export default function AdminPage() {
  const router = useRouter()
  const { user, loading, getToken } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("events")


  useEffect(() => {
    if (!loading && (!user || (user.role_id !== 1 && user.role_id !== 0))) {
      router.push("/events")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold text-purple-700">
        Loading...
      </div>
    )
  }

  if (!user || (user.role_id !== 1 && user.role_id !== 0)) {
    return null
  }

  const isSuperAdmin = user.role_id === 0

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Navbar />
      <div className="w-full bg-white min-h-screen relative">
        <div className="bg-primary w-full h-60 text-white p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 z-0 opacity-100 pointer-events-none">
            <StarsAndMoon />
          </div>
          <div className="flex justify-end relative z-10 min-h-8">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => router.push("/admin/scanner")}
                className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition backdrop-blur-sm border border-white/10 whitespace-nowrap"
              >
                QR Scanner
              </button>
              <button
                onClick={() => router.push("/events")}
                className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition backdrop-blur-sm border border-white/10 whitespace-nowrap"
              >
                Back to Events
              </button>
            </div>
          </div>
          <div className="relative z-10 mt-2">
            <h6 className="text-xs font-medium text-purple-200 tracking-widest mb-1">
              ADMIN
            </h6>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Panel
            </h1>
          </div>
        </div>
        <div className="w-full h-3 bg-[#FFC55A]"></div>

        <div className="p-4 sm:p-6">
          {/* Tabs */}
          <div className="flex space-x-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
            {[
              { id: "events" as TabType, label: "Events" },
              { id: "mealsessions" as TabType, label: "Meal Sessions" },
              { id: "users" as TabType, label: "Users" },
              { id: "feedbacks" as TabType, label: "Feedbacks" },
              { id: "foodclaims" as TabType, label: "Food Claims" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
            {activeTab === "events" && <EventsSection />}
            {activeTab === "mealsessions" && <MealSessionsSection />}
            {activeTab === "users" && <UsersSection isSuperAdmin={isSuperAdmin} />}
            {activeTab === "feedbacks" && <FeedbacksSection />}
            {activeTab === "foodclaims" && <FoodClaimsSection />}
          </div>
        </div>
      </div>
    </div>
  )
}

