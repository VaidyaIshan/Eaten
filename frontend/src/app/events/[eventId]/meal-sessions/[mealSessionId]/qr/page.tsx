"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"
import QRCode from "react-qr-code"
import StarsAndMoon from "@/src/app/assets/vectors/starsandmoon"
import { ArrowLeft } from "lucide-react"

interface MealSession {
  id: string
  event_id: string
  meal_type: string
  start_time: string
  end_time: string
  is_active: boolean
  total_capacity: number
}

interface Event {
  id: string
  name: string
  description: string
  start_date: string
  end_date: string
  is_active: boolean
}

export default function QRCodePage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.eventId as string
  const mealSessionId = params.mealSessionId as string
  const { user, loading, getToken } = useAuth()

  const [qrCode, setQrCode] = useState<string>("")
  const [mealSession, setMealSession] = useState<MealSession | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [checking, setChecking] = useState(true)
  const hasCheckedRef = useRef(false)

  // Redirect if user is null
  useEffect(() => {
    if (!loading && !user) {
      router.push("/LoginPage")
    }
  }, [loading, user, router])

  // Check event and meal session status
  useEffect(() => {
    if (!user || !mealSessionId || !eventId || hasCheckedRef.current) return

    const checkStatus = async () => {
      const token = getToken()
      if (!token) {
        router.push("/LoginPage")
        return
      }

      hasCheckedRef.current = true
      setChecking(true)
      try {
        // Check event status
        const eventRes = await fetch(`http://localhost:8000/Eaten/event/${eventId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!eventRes.ok) {
          throw new Error("Failed to fetch event")
        }

        const eventData: Event = await eventRes.json()
        if (!eventData.is_active) {
          alert("This event is inactive and cannot be viewed")
          router.push("/events")
          return
        }
        setEvent(eventData)

        // Check meal session status
        const mealRes = await fetch(`http://localhost:8000/Eaten/meal-session/${mealSessionId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!mealRes.ok) {
          throw new Error("Failed to fetch meal session")
        }

        const mealData: MealSession = await mealRes.json()
        if (!mealData.is_active) {
          alert("This meal session is inactive and QR code cannot be viewed")
          router.push(`/events/${eventId}/meal-sessions`)
          return
        }
        setMealSession(mealData)

        const qrString = `${user.id}+${mealSessionId}`
        setQrCode(qrString)
      } catch (err) {
        console.error(err)
        alert("Failed to verify status")
        router.push("/events")
      } finally {
        setChecking(false)
      }
    }

    checkStatus()
  }, [user, mealSessionId, eventId, router])

  if (loading || checking)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        Loading...
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full bg-white min-h-screen relative">
        <div className="bg-[#5B4DBC] w-full h-60 text-white p-6 relative overflow-hidden">
          <div className="flex justify-between items-center z-10 relative mb-2">
            <button
              onClick={() => router.push(`/events/${eventId}/meal-sessions`)}
              className="p-2 -ml-2 hover:bg-white/10 rounded-full transition text-white flex items-center gap-2"
            >
              <ArrowLeft size={24} />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
          <div className="absolute top-0 right-0 z-0 opacity-100 pointer-events-none">
            <StarsAndMoon />
          </div>
          <div className="relative z-10 mt-2">
            <h6 className="text-xs font-medium text-purple-200 tracking-widest mb-1 uppercase">
              HAVE YOU
            </h6>
            <h1 className="text-5xl font-bold">
              Eaten?
            </h1>
          </div>
        </div>

        <div className="w-full h-3 bg-[#FFC55A]"></div>

        <div className="p-8 flex flex-col items-center">

          <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-center">

            <h1 className="text-2xl text-[#5B4DBC] font-bold mb-8 text-center tracking-tight">
              SCAN TO GET A MEAL
            </h1>

            {qrCode ? (
              <div className="flex flex-col items-center space-y-6 w-full">
                <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-inner">
                  <div style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>
                    <QRCode
                      size={256}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      value={qrCode}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg w-full">
                <p className="text-gray-500 font-medium">No QR code available</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
