"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"
import EventsSection from "../components/admin/EventsSection"
import FoodClaimsSection from "../components/admin/FoodClaimsSection"
import FeedbacksSection from "../components/admin/FeedbacksSection"
import MealSessionsSection from "../components/admin/MealSessionsSection"
import UsersSection from "../components/admin/UsersSections"

type TabType = "events" | "mealsessions" | "users" | "feedbacks" | "foodclaims"

export default function AdminPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("events")

  // Redirect if not admin or superadmin
  useEffect(() => {
    if (!loading && (!user || (user.role_id !== 1 && user.role_id !== 0))) {
      router.push("/events")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        Loading...
      </div>
    )
  }

  if (!user || (user.role_id !== 1 && user.role_id !== 0)) {
    return null
  }

  const isSuperAdmin = user.role_id === 0

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Admin Panel</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/admin/scanner")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              QR Scanner
            </button>
            <button
              onClick={() => router.push("/events")}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Events
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b">
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
              className={`px-4 py-2 font-medium ${activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-black hover:text-black"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === "events" && <EventsSection />}
          {activeTab === "mealsessions" && <MealSessionsSection />}
          {activeTab === "users" && <UsersSection isSuperAdmin={isSuperAdmin} />}
          {activeTab === "feedbacks" && <FeedbacksSection />}
          {activeTab === "foodclaims" && <FoodClaimsSection />}
        </div>
      </div>
    </div>
  )
}
