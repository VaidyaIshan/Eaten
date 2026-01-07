"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"

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
      const res = await fetch(`http://localhost:8000/Eaten/event/${eventId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Failed to fetch event")
      }

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
        `http://localhost:8000/Eaten/meal-session/event/${eventId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error("Failed to fetch meal sessions")
      }

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
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        Loading...
      </div>
    )

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/events")}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Events
        </button>

        {event && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
            <p className="text-gray-600">{event.description}</p>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Meal Sessions</h2>

        {mealSessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl">No meal sessions available for this event</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mealSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleMealSessionClick(session)}
                className={`bg-white rounded-lg shadow-md p-6 transition-shadow ${session.is_active
                    ? "cursor-pointer hover:shadow-lg"
                    : "cursor-not-allowed opacity-60"
                  }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{session.meal_type}</h3>
                  <span
                    className={`px-2 py-1 rounded text-sm ${session.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {session.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(session.start_time).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {new Date(session.end_time).toLocaleString()}
                  </p>
                  <p>
                    <strong>Capacity:</strong> {session.total_capacity}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  {session.is_active ? (
                    <p className="text-blue-600 font-medium">Click to view QR code</p>
                  ) : (
                    <p className="text-gray-500 font-medium">QR code unavailable (inactive)</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
