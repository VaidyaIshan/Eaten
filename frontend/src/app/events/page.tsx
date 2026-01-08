"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/hooks/tempuseAuth"

interface Event {
  id: string
  name: string
  description: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
  picture: string | null
}

export default function EventsPage() {
  const router = useRouter()
  const { user, loading, getToken } = useAuth()

  const [events, setEvents] = useState<Event[]>([])
  const [fetching, setFetching] = useState(false)

  // Redirect if user is null
  useEffect(() => {
    if (!loading && !user) {
      router.push("/LoginPage")
    }
  }, [loading, user, router])

  // Fetch events
  const fetchEvents = async () => {
    const token = getToken()
    if (!token) {
      router.push("/LoginPage")
      return
    }

    setFetching(true)
    try {
      const res = await fetch("http://localhost:8000/Eaten/event/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Failed to fetch events")
      }

      const data: Event[] = await res.json()
      // Only show active events
      setEvents(data.filter((event) => event.is_active))
    } catch (err) {
      console.error(err)
      alert("Failed to fetch events")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    if (user) fetchEvents()
  }, [user])

  if (loading || fetching)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        Loading...
      </div>
    )

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Events</h1>
          {(user?.role_id === 1 || user?.role_id === 0) && (
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Admin Panel
            </button>
          )}
        </div>
        
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl">No events available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => router.push(`/events/${event.id}/meal-sessions`)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                {event.picture && (
                  <img
                    src={event.picture}
                    alt={event.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h2 className="text-xl font-bold mb-2">{event.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {new Date(event.start_date).toLocaleDateString()} -{" "}
                    {new Date(event.end_date).toLocaleDateString()}
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      event.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {event.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
