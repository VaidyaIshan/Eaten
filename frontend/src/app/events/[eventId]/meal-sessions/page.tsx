"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"
import StarsAndMoon from "@/src/app/assets/vectors/starsandmoon"
import Navbar from "@/src/app/components/Navbar/navbar"

interface MealSession {
  id: string
  event_id: string
  meal_type: string
  start_time: string
  end_time: string
  is_active: boolean
  total_capacity: number
  created_at: string
  updated_at: string
}

interface Event {
  id: string
  name: string
  description: string
  start_date: string
  end_date: string
  is_active: boolean
}

export default function MealSessionsPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.eventId as string
  const { user, loading, getToken } = useAuth()

  const [mealSessions, setMealSessions] = useState<MealSession[]>([])
  const [event, setEvent] = useState<Event | null>(null)
  const [fetching, setFetching] = useState(false)

  // Redirect if user is null
  useEffect(() => {
    if (!loading && !user) {
      router.push("/LoginPage")
    }
  }, [loading, user, router])

  // Fetch event details
  const fetchEvent = async () => {
    const token = getToken()
    if (!token) {
      router.push("/LoginPage")
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Eaten/event/${eventId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch event")

      const data: Event = await res.json()
      if (!data.is_active) {
        alert("This event is inactive and cannot be viewed")
        router.push("/events")
        return
      }
      setEvent(data)
    } catch (err) {
      console.error(err)
      alert("Failed to fetch event")
      router.push("/events")
    }
  }

  // Fetch meal sessions
  const fetchMealSessions = async () => {
    const token = getToken()
    if (!token) {
      router.push("/LoginPage")
      return
    }

    setFetching(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Eaten/meal-session/event/${eventId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) throw new Error("Failed to fetch meal sessions")

      const data: MealSession[] = await res.json()
      setMealSessions(data)
    } catch (err) {
      console.error(err)
      alert("Failed to fetch meal sessions")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    if (user && eventId) {
      fetchEvent()
      fetchMealSessions()
    }
  }, [user, eventId])

  const handleMealSessionClick = (mealSession: MealSession) => {
    if (!mealSession.is_active) {
      alert("This meal session is inactive and QR code cannot be viewed")
      return
    }
    router.push(`/events/${eventId}/meal-sessions/${mealSession.id}/qr`)
  }

  if (loading || fetching)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold text-purple-700">
        Loading...
      </div>
    )

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
          <Navbar/> 
      <div className="w-full bg-white min-h-screen relative">
        <div className="bg-primary text-white p-6 h-60 relative overflow-hidden">
          <div className="absolute top-0 right-0 z-0 opacity-100 pointer-events-none">
            <StarsAndMoon />
          </div>
          <div className="relative z-10 mt-28">
            <h6 className="text-xs font-medium text-purple-200 tracking-widest mb-2">
              HAVE YOU
            </h6>
            <h1 className="text-5xl font-bold">
              Eaten?
            </h1>
          </div>
        </div>
        <div className="w-full h-3 bg-[#FFC55A]"></div>


        <div className="p-6">


          {event && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">{event.name}</h2>
              <p className="text-black leading-relaxed text-sm">{event.description}</p>
            </div>
          )}


          <h3 className="text-lg font-bold text-black mb-4 border-b pb-2 border-gray-100">
            Available Sessions
          </h3>

          {mealSessions.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p>No meal sessions available for this event</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mealSessions.map((session) => (
                <div
                  key={session.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all ${!session.is_active ? "opacity-70 bg-gray-50" : "hover:shadow-md"
                    }`}
                >

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {session.meal_type}
                      </h3>
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-medium border ${session.is_active
                          ? "bg-white text-green-600 border-green-500"
                          : "bg-white text-red-500 border-red-500"
                          }`}
                      >
                        {session.is_active ? "Ongoing" : "Ended"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 text-sm text-black">
                    <div className="grid grid-cols-[80px_1fr]">
                      <span className="font-medium text-black">Start Time:</span>
                      <span>{new Date(session.start_time).toLocaleString().split(",")[1]}</span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr]">
                      <span className="font-medium text-black">End Time:</span>
                      <span>{new Date(session.end_time).toLocaleString().split(",")[1]}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleMealSessionClick(session)}
                      disabled={!session.is_active}
                      className={`px-6 py-2.5 rounded-md font-medium text-white shadow-sm transition-all text-sm ${session.is_active
                        ? "bg-primary hover:bg-[#4a3ea3] active:scale-[0.98]"
                        : "bg-[#8b82c9] cursor-not-allowed"
                        }`}
                    >
                      Get Your QR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}