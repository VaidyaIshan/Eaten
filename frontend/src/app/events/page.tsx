"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"
import StarsAndMoon from "../assets/vectors/starsandmoon"
import { Menu, ChevronDown, ChevronUp } from "lucide-react"
import Navbar from "../components/Navbar/navbar";

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


  useEffect(() => {
    if (!loading && !user) {
      router.push("/LoginPage")
    }
  }, [loading, user, router])


  const fetchEvents = async () => {
    const token = getToken()
    if (!token) {
      router.push("/LoginPage")
      return
    }

    setFetching(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Eaten/event/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch events")

      const data: Event[] = await res.json()
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
      <div className="flex justify-center items-center h-screen text-xl font-bold text-purple-700">
        Loading...
      </div>
    )

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Navbar />
      <div className="w-full bg-white min-h-screen relative">

        <div className="bg-primary w-full h-60 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 z-0 opacity-100 pointer-events-none">
            <StarsAndMoon />
          </div>

          <div className="flex justify-end relative z-10 min-h-8">
            {(user?.role_id === 1 || user?.role_id === 0) && (
              <button
                onClick={() => router.push("/admin")}
                className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition backdrop-blur-sm border border-white/10"
              >
                Admin Panel
              </button>
            )}
          </div>

          <div className="relative z-10 mt-20">
            <h6 className="text-xs font-medium text-purple-200 tracking-widest mb-2">
              HAVE YOU
            </h6>
            <h1 className="text-5xl font-bold">Eaten?</h1>
          </div>
        </div>


        <div className="w-full h-3 bg-[#FFC55A]"></div>


        <div className="p-6">
          <h3 className="text-lg font-bold text-black mb-4 border-b pb-2 border-gray-100">
            Available Events
          </h3>

          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p>No events available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl border border-gray-100 p-5 transition-all hover:shadow-md"
                >

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 overflow-hidden border border-gray-200">
                      {event.picture ? (
                        <img
                          src={event.picture}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-purple-500 font-bold text-lg">
                          {event.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {event.name}
                    </h3>
                  </div>

                  <hr className="mb-4 border-gray-100" />


                  <div className="mb-4 text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        Start Date:
                      </span>
                      <span>
                        {new Date(event.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        End Date:
                      </span>
                      <span>
                        {new Date(event.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>


                  <p className="mb-6 text-gray-600 text-sm leading-relaxed">
                    {event.description}
                  </p>


                  <button
                    onClick={() =>
                      router.push(`/events/${event.id}/meal-sessions`)
                    }
                    className="px-6 py-2.5 rounded-md font-medium text-white shadow-sm transition-all text-sm bg-primary hover:bg-[#4a3ea3] active:scale-[0.98]">
                    Meal Sessions
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}