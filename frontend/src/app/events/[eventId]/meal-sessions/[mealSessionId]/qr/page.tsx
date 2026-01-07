"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"
import QRCode from "react-qr-code"
import QrPage from "@/src/app/qr/page"

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

        // Generate QR code
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
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={() => router.push(`/events/${eventId}/meal-sessions`)}
          className="mb-6 text-blue-600 hover:underline"
        >
          ← Back to Meal Sessions
        </button>

        <h1 className="text-2xl font-bold mb-6 text-center">QR Code</h1>

        {qrCode ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <QRCode value={qrCode} size={256} />
            </div>
            {/* <p className="text-sm text-gray-600 text-center break-all">
              {qrCode}
            </p> */}
            <button
              onClick={() => {
                const svgElement = document.querySelector("svg")
                if (svgElement) {
                  const svgData = new XMLSerializer().serializeToString(svgElement)
                  const blob = new Blob([svgData], { type: "image/svg+xml" })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement("a")
                  link.href = url
                  link.download = `qr-code-${mealSessionId}.svg`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  URL.revokeObjectURL(url)
                }
              }}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Download QR Code
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No QR code available</p>
          </div>
        )}
      </div>
    </div>
  )
}
