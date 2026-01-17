import { useState, useEffect } from "react"
import { useAuth } from "@/src/hooks/useAuth"
import { FoodClaim } from "../../interfaces/admin"

// Food Claims Section
export default function FoodClaimsSection() {
    const { getToken } = useAuth()
    const [foodClaims, setFoodClaims] = useState<FoodClaim[]>([])
    const [loading, setLoading] = useState(false)

    const fetchFoodClaims = async () => {
        const token = getToken()
        if (!token) return

        setLoading(true)
        try {
            const res = await fetch("http://localhost:8000/Eaten/food-claim/", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.ok) {
                const data = await res.json()
                setFoodClaims(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFoodClaims()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this food claim?")) return
        const token = getToken()
        if (!token) return

        try {
            const res = await fetch(`http://localhost:8000/Eaten/food-claim/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.ok) {
                fetchFoodClaims()
                alert("Food claim deleted successfully")
            }
        } catch (err) {
            console.error(err)
            alert("Failed to delete food claim")
        }
    }

    const handleActivate = async (id: string) => {
        const token = getToken()
        if (!token) return

        try {
            const res = await fetch(`http://localhost:8000/Eaten/food-claim/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.ok) {
                fetchFoodClaims()
                alert("Food claim status updated")
            }
        } catch (err) {
            console.error(err)
            alert("Failed to update food claim")
        }
    }

    return (
        <div className="text-black">
            <h2 className="text-2xl font-bold mb-4">Food Claims Management</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="space-y-4">
                    {foodClaims.map((claim) => (
                        <div key={claim.id} className="p-4 border rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-gray-800">User ID: {claim.user_id}</p>
                                <p className="text-sm text-black">Meal Session: {claim.meal_session_id}</p>
                                <p className="text-sm text-black">Event: {claim.event_id}</p>
                                <p className="text-sm text-gray-500">
                                    Claimed at: {new Date(claim.claimed_at).toLocaleString()}
                                </p>
                                <span
                                    className={`inline-block px-2 py-1 rounded text-sm ${claim.is_claimed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {claim.is_claimed ? "Claimed" : "Not Claimed"}
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleActivate(claim.id)}
                                    className={`px-4 py-2 rounded-md ${claim.is_claimed
                                        ? "bg-yellow-600 text-white hover:bg-yellow-700"
                                        : "bg-green-600 text-white hover:bg-green-700"
                                        }`}
                                >
                                    {claim.is_claimed ? "Unclaim" : "Claim"}
                                </button>
                                <button
                                    onClick={() => handleDelete(claim.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

