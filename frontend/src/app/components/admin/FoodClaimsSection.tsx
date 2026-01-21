import { useState, useEffect } from "react"
import { useAuth } from "@/src/hooks/useAuth"
import { FoodClaim, User, Event, MealSession } from "../../interfaces/admin"
import { X } from "lucide-react"

// Food Claims Section
export default function FoodClaimsSection() {
    const { getToken } = useAuth()
    const [foodClaims, setFoodClaims] = useState<FoodClaim[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [events, setEvents] = useState<Event[]>([])
    const [mealSessions, setMealSessions] = useState<MealSession[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedClaim, setSelectedClaim] = useState<FoodClaim | null>(null)

    const fetchUsers = async () => {
        const token = getToken()
        if (!token) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Eaten/auth/users`, {
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Eaten/event/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.ok) {
                const data = await res.json()
                setEvents(data)
                return data // Return for chaining if needed
            }
        } catch (err) {
            console.error(err)
        }
        return []
    }

    const fetchMealSessions = async (eventsList?: Event[]) => {
        const token = getToken()
        if (!token) return

        // Use provided events list or current state (though state might be stale if called immediately after setEvents)
        // Better to rely on the passed list if this is part of values initialization
        const targetEvents = eventsList || events

        if (targetEvents.length === 0) return

        try {
             const allMealSessions: MealSession[] = []
             for (const event of targetEvents) {
                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Eaten/meal-session/event/${event.id}`, {
                     headers: {
                         "Content-Type": "application/json",
                         Authorization: `Bearer ${token}`,
                     },
                 })
                 if (res.ok) {
                     const data = await res.json()
                     allMealSessions.push(...data)
                 }
             }
             setMealSessions(allMealSessions)
        } catch (err) {
            console.error(err)
        }
    }

    const fetchFoodClaims = async () => {
        const token = getToken()
        if (!token) return

        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Eaten/food-claim/`, {
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

    const initData = async () => {
        setLoading(true)
        await fetchUsers()
        const eventsData = await fetchEvents()
        await fetchMealSessions(eventsData)
        await fetchFoodClaims()
        setLoading(false)
    }

    useEffect(() => {
        initData()
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

    const getMealSessionDetails = (mealSessionId: string) => {
        const session = mealSessions.find(ms => ms.id === mealSessionId)
        if (!session) return "Unknown Session"
        const time = new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        return `${session.meal_type} (${time})`
    }

    // Group food claims by event, then by meal session
    type ClaimsBySession = Record<string, FoodClaim[]>
    type ClaimsByEvent = Record<string, ClaimsBySession>

    const groupedClaims: ClaimsByEvent = foodClaims.reduce((acc, claim) => {
        const eventId = claim.event_id
        const sessionId = claim.meal_session_id

        if (!acc[eventId]) {
            acc[eventId] = {}
        }
        
        if (!acc[eventId][sessionId]) {
            acc[eventId][sessionId] = []
        }

        acc[eventId][sessionId].push(claim)
        return acc
    }, {} as ClaimsByEvent)

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this food claim?")) return
        const token = getToken()
        if (!token) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Eaten/food-claim/${id}`, {
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
                <div className="space-y-8">
                    {foodClaims.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p>No food claims found</p>
                        </div>
                    ) : (
                        Object.entries(groupedClaims).map(([eventId, sessions]) => (
                            <div key={eventId} className="space-y-4">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 border-b-2 border-primary pb-2">
                                    {getEventName(eventId)}
                                </h3>
                                <div className="space-y-6">
                                    {Object.entries(sessions).map(([sessionId, claims]) => (
                                        <div key={sessionId} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                                                <h4 className="font-semibold text-gray-800">
                                                    {getMealSessionDetails(sessionId)}
                                                </h4>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead className="bg-white">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">S.N.</th>
                                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Claimant</th>
                                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                                                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {claims.map((claim, index) => (
                                                            <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {index + 1}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm font-medium">
                                                                    <button
                                                                        onClick={() => setSelectedClaim(claim)}
                                                                        className="text-primary hover:text-purple-700 transition-colors cursor-pointer"
                                                                    >
                                                                        {getUsername(claim.user_id)}
                                                                    </button>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                                    {new Date(claim.claimed_at).toLocaleTimeString()}
                                                                </td>
                                                                <td className="px-6 py-4 text-right text-sm font-medium">
                                                                     <button
                                                                        onClick={() => setSelectedClaim(claim)}
                                                                        className="text-gray-400 hover:text-primary transition-colors mr-3"
                                                                    >
                                                                        View
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal/Popup for claim details */}
            {selectedClaim && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedClaim(null)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                                    <span className="font-medium text-gray-900">Meal Session:</span>
                                    <p className="text-gray-600 mt-1">{getMealSessionDetails(selectedClaim.meal_session_id)}</p>
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

