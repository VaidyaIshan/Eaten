"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"
import { Scanner } from "@yudiel/react-qr-scanner"

export default function AdminScannerPage() {
  const router = useRouter()
  const { user, loading, getToken } = useAuth()
  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const scannerRef = useRef<any>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (!loading && (!user || (user.role_id !== 1 && user.role_id !== 0))) {
      router.push("/events")
    }
  }, [loading, user, router])

  const lastScannedRef = useRef<string | null>(null)

  const handleScan = async (detectedCodes: any[]) => {
    if (!detectedCodes || detectedCodes.length === 0) return

    const decodedText = detectedCodes[0].rawValue

    // Prevent multiple scans of the same QR code
    if (lastScannedRef.current === decodedText) {
      return
    }

    lastScannedRef.current = decodedText
    setLastScanned(decodedText)

    try {
      const token = await getToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Eaten/qr/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qr_data: decodedText }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ QR Code verified! User: ${data.username || data.email || 'Unknown'}`)
      } else {
        const errorData = await response.json()
        alert(`❌ Verification failed: ${errorData.detail || 'Invalid QR code'}`)
      }
    } catch (error) {
      console.error("Error verifying QR code:", error)
      alert("❌ Network error. Please try again.")
    }

    // Clear the scanned code after 3 seconds
    setTimeout(() => {
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
              components={{
                finder: true,
              }}
              styles={{
                container: {
                  width: 300,
                  height: 300,
                },
                video: {
                  width: 300,
                  height: 300,
                },
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
