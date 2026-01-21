"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"
import { Scanner } from "@yudiel/react-qr-scanner"

export default function AdminScannerPage() {
  const router = useRouter()
  const { user, loading, getToken } = useAuth()

  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)

  const lastScannedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || (user.role_id !== 1 && user.role_id !== 0))) {
      router.push("/events")
    }
  }, [loading, user, router])

  const handleScan = async (detectedCodes: { rawValue: string }[]) => {
    if (paused || !detectedCodes || detectedCodes.length === 0) return

    const decodedText = detectedCodes[0].rawValue

    // extra safety against duplicate scans
    if (lastScannedRef.current === decodedText) return

    setPaused(true)
    setLastScanned(decodedText)
    lastScannedRef.current = decodedText

    try {
      const token = await getToken()

      // First verify the QR code
      const verifyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Eaten/qr/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ qr_string: decodedText }),
        }
      )

      const verifyRes = await verifyResponse.json()
      const verifyData = verifyRes.data

      if (verifyResponse.ok && verifyData) {
        console.log("Verification Data:", verifyData)

        alert(`✅ QR Code verified! User: ${verifyData.username || verifyData.email || "Unknown"}`)

        // Auto-create food claim using the meal session info from QR
        try {
          const claimResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/Eaten/food-claim/scan?user_id=${verifyData.user_id}&meal_session_id=${verifyData.meal_id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              }
            }
          )

          if (claimResponse.ok) {
            alert(`✅ Food claim created successfully for ${verifyData.username}!`)
          } else {
            const claimData = await claimResponse.json()
            alert(`⚠️ QR verified but claim failed: ${claimData.detail || "Could not create food claim"}`)
          }
        } catch (claimError) {
          console.error("Error creating food claim:", claimError)
          alert(`⚠️ QR verified but claim creation failed`)
        }
      } else {
        alert(`❌ QR Verification failed: ${verifyRes.detail || "Invalid QR code"}`)
      }
    } catch (error) {
      console.error("Error verifying QR code:", error)
      alert("❌ Network error. Please try again.")
    }

    // resume scanner after 3 seconds
    setTimeout(() => {
      setPaused(false)
      setLastScanned(null)
      lastScannedRef.current = null
    }, 3000)
  }

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

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">QR Code Scanner</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Admin
            </button>
            <button
              onClick={() => router.push("/events")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Events
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-4 text-center">
            Scan a QR code to create a food claim
          </p>

          <div className="flex justify-center">
            <Scanner
              onScan={handleScan}
              paused={paused}
              components={{ finder: true }}
              styles={{
                container: { width: 300, height: 300 },
                video: { width: 300, height: 300 },
              }}
            />
          </div>
        </div>

        {lastScanned && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Last scanned: {lastScanned.substring(0, 50)}...
          </div>
        )}
      </div>
    </div>
  )
}
