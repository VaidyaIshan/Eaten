import { useState, useEffect } from "react"
import { useAuth } from "@/src/hooks/useAuth"
import { FoodClaim, User, Event } from "../../interfaces/admin"
import { X } from "lucide-react"

// Food Claims Section
export default function FoodClaimsSection() {
    const { getToken } = useAuth()
    const [foodClaims, setFoodClaims] = useState<FoodClaim[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedClaim, setSelectedClaim] = useState<FoodClaim | null>(null)

    const fetchUsers = async () => {
        const token = getToken()
        if (!token) return

        try {
            const res = await fetch("http://localhost:8000/Eaten/auth/users", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.ok) {
                const data = await res.json()
                setUsers(data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const fetchEvents = async () => {
        const token = getToken()
        if (!token) return

        try {
            const res = await fetch("http://localhost:8000/Eaten/event/", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.ok) {
                const data = await res.json()
                setEvents(data)
            }
        } catch (err) {
            console.error(err)
        }
    }

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
        fetchUsers()
        fetchEvents()
        fetchFoodClaims()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getUsername = (userId: string) => {
        const user = users.find((u) => u.id === userId)
        return user?.username || userId
    }

    const getEventName = (eventId: string) => {
        const event = events.find((e) => e.id === eventId)
        return event?.name || eventId
    }

    // Group food claims by event
    const groupedClaims = foodClaims.reduce((acc, claim) => {
        const eventId = claim.event_id
        if (!acc[eventId]) {
            acc[eventId] = []
        }
        acc[eventId].push(claim)
        return acc
    }, {} as Record<string, FoodClaim[]>)

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

    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">Food Claims Management</h2>
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <p className="text-gray-500">Loading...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {foodClaims.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p>No food claims found</p>
                        </div>
                    ) : (
                        Object.entries(groupedClaims).map(([eventId, claims]) => (
                            <div key={eventId} className="space-y-4">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                                    {getEventName(eventId)}
                                </h3>
                                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.N.</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim Name</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {claims.map((claim, index) => (
                                                    <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <button
                                                                onClick={() => setSelectedClaim(claim)}
                                                                className="text-primary hover:text-[#4a3ea3] font-medium transition-colors cursor-pointer"
                                                            >
                                                                {getUsername(claim.user_id)}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal/Popup for claim details */}
            {selectedClaim && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <button
                        className="absolute inset-0"
                        onClick={() => setSelectedClaim(null)}
                        aria-label="Close modal"
                    />
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Food Claim Details</h3>
                            <button
                                onClick={() => setSelectedClaim(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-900">User ID:</span>
                                    <p className="text-gray-600 mt-1 break-all">{selectedClaim.user_id}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-900">Username:</span>
                                    <p className="text-gray-600 mt-1">{getUsername(selectedClaim.user_id)}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-900">Meal Session ID:</span>
                                    <p className="text-gray-600 mt-1 break-all">{selectedClaim.meal_session_id}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-900">Event:</span>
                                    <p className="text-gray-600 mt-1">{getEventName(selectedClaim.event_id)}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <span className="font-medium text-gray-900">Claimed at:</span>
                                    <p className="text-gray-600 mt-1">{new Date(selectedClaim.claimed_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-200 flex gap-2">
                                <button
                                    onClick={() => handleDelete(selectedClaim.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                >
                                    Delete Claim
                                </button>
                                <button
                                    onClick={() => setSelectedClaim(null)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

