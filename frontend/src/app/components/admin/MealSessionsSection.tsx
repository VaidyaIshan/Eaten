import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/src/hooks/useAuth"
import { MealSession, Event } from "../../interfaces/admin"
import { Calendar, Clock } from "lucide-react"

export default function MealSessionsSection() {
    const { getToken } = useAuth()
    const [mealSessions, setMealSessions] = useState<MealSession[]>([])
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const startTimeRef = useRef<HTMLInputElement>(null)
    const endTimeRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState({
        event_name: "",
        meal_type: "",
        meal_date: "",
        start_time: "",
        end_time: "",
        total_capacity: "",
    })

    const fetchMealSessions = async () => {
        const token = getToken()
        if (!token) return

        setLoading(true)
        try {
            // Fetch all events first
            const eventsRes = await fetch("http://localhost:8000/Eaten/event/", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            if (eventsRes.ok) {
                const eventsData = await eventsRes.json()
                setEvents(eventsData)

                // Fetch meal sessions for all events
                const allMealSessions: MealSession[] = []
                for (const event of eventsData) {
                    const res = await fetch(`http://localhost:8000/Eaten/meal-session/event/${event.id}`, {
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
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMealSessions()
    }, [])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = getToken()
        if (!token) return

        const selectedEvent = events.find(e => e.name === formData.event_name)
        if (!selectedEvent) {
            alert("Please select an event")
            return
        }

        if (!formData.meal_date) {
            alert("Please select a date for the meal session")
            return
        }

        // Combine selected date with the time inputs
        const selectedDate = new Date(formData.meal_date)
        const [startHours, startMinutes] = formData.start_time.split(':')
        const [endHours, endMinutes] = formData.end_time.split(':')

        const startDateTime = new Date(selectedDate)
        startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0)

        const endDateTime = new Date(selectedDate)
        endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0)

        // Format to ISO string for backend
        const startTimeISO = startDateTime.toISOString()
        const endTimeISO = endDateTime.toISOString()

        try {
            const res = await fetch(
                `http://localhost:8000/Eaten/meal-session/?event_name=${encodeURIComponent(formData.event_name)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        meal_type: formData.meal_type,
                        start_time: startTimeISO,
                        end_time: endTimeISO,
                        total_capacity: parseInt(formData.total_capacity),
                    }),
                }
            )
            if (res.ok) {
                setShowForm(false)
                setFormData({ event_name: "", meal_type: "", meal_date: "", start_time: "", end_time: "", total_capacity: "" })
                fetchMealSessions()
                alert("Meal session created successfully")
            } else {
                const data = await res.json()
                alert(data.detail || "Failed to create meal session")
            }
        } catch (err) {
            console.error(err)
            alert("Failed to create meal session")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this meal session?")) return
        const token = getToken()
        if (!token) return

        try {
            const res = await fetch(`http://localhost:8000/Eaten/meal-session/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.ok) {
                fetchMealSessions()
                alert("Meal session deleted successfully")
            }
        } catch (err) {
            console.error(err)
            alert("Failed to delete meal session")
        }
    }

    const handleActivate = async (id: string) => {
        const token = getToken()
        if (!token) return

        try {
            const res = await fetch(`http://localhost:8000/Eaten/meal-session/activate/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.ok) {
                fetchMealSessions()
                alert("Meal session status updated")
            }
        } catch (err) {
            console.error(err)
            alert("Failed to update meal session")
        }
    }

    const getEventName = (eventId: string) => {
        const event = events.find((e) => e.id === eventId)
        return event?.name || eventId
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Meal Sessions Management</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#4a3ea3] transition-colors shadow-sm text-sm font-medium w-full sm:w-auto"
                >
                    {showForm ? "Cancel" : "Create Meal Session"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="mb-6 p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                    <select
                        value={formData.event_name}
                        onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                        style={{ color: '#000000' }}
                        required
                    >
                        <option value="">Select Event</option>
                        {events.map((event) => (
                            <option key={event.id} value={event.name}>
                                {event.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Meal Type (e.g., Breakfast, Lunch, Dinner)"
                        value={formData.meal_type}
                        onChange={(e) => setFormData({ ...formData, meal_type: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 text-black"
                        style={{ color: '#000000' }}
                        required
                    />
                    {formData.event_name && (() => {
                        const selectedEvent = events.find(e => e.name === formData.event_name)
                        if (!selectedEvent) return null

                        const minDate = selectedEvent.start_date.split('T')[0]
                        const maxDate = selectedEvent.end_date.split('T')[0]

                        return (
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5 pointer-events-none" style={{ zIndex: 10 }} />
                                <input
                                    type="date"
                                    value={formData.meal_date}
                                    onChange={(e) => setFormData({ ...formData, meal_date: e.target.value })}
                                    min={minDate}
                                    max={maxDate}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                                    style={{ color: '#000000' }}
                                    required
                                />
                            </div>
                        )
                    })()}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <Clock
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer hover:text-primary transition-colors"
                                style={{ zIndex: 10, color: '#1f2937' }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (startTimeRef.current) {
                                        // Focus first
                                        startTimeRef.current.focus()
                                        // Use setTimeout to ensure focus happens before showPicker
                                        setTimeout(() => {
                                            if (startTimeRef.current) {
                                                // Try showPicker() if available (modern browsers)
                                                if (startTimeRef.current.showPicker && typeof startTimeRef.current.showPicker === 'function') {
                                                    try {
                                                        const pickerResult = startTimeRef.current.showPicker()
                                                        // showPicker returns void, so just handle the fallback
                                                        startTimeRef.current?.click()
                                                    } catch (err) {
                                                        // Fallback: click the input to trigger native picker
                                                        startTimeRef.current.click()
                                                    }
                                                } else {
                                                    // Fallback: click the input to trigger native picker
                                                    startTimeRef.current.click()
                                                }
                                            }
                                        }, 10)
                                    }
                                }}
                            />
                            <input
                                ref={startTimeRef}
                                type="time"
                                value={formData.start_time}
                                onChange={(e) => {
                                    const startValue = e.target.value
                                    setFormData(prev => ({ ...prev, start_time: startValue }))
                                }}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                                style={{ color: '#000000' }}
                                required
                            />
                        </div>
                        <div className="relative">
                            <Clock
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer hover:text-primary transition-colors"
                                style={{ zIndex: 10, color: '#1f2937' }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (endTimeRef.current) {
                                        // Focus first
                                        endTimeRef.current.focus()
                                        // Use setTimeout to ensure focus happens before showPicker
                                        setTimeout(() => {
                                            if (endTimeRef.current) {
                                                // Try showPicker() if available (modern browsers)
                                                if (endTimeRef.current.showPicker && typeof endTimeRef.current.showPicker === 'function') {
                                                    try {
                                                        const pickerResult = endTimeRef.current.showPicker()
                                                        // showPicker returns void, so just handle the fallback
                                                        endTimeRef.current?.click()
                                                    } catch (err) {
                                                        endTimeRef.current.click()
                                                    }
                                                } else {
                                                    endTimeRef.current.click()
                                                }
                                            }
                                        }, 10)
                                    }
                                }}
                            />
                            <input
                                ref={endTimeRef}
                                type="time"
                                value={formData.end_time}
                                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                                style={{ color: '#000000' }}
                                required
                            />
                        </div>
                    </div>
                    <input
                        type="number"
                        placeholder="Total Capacity"
                        value={formData.total_capacity}
                        onChange={(e) => setFormData({ ...formData, total_capacity: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 text-black"
                        style={{ color: '#000000' }}
                        required
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#4a3ea3] transition-colors shadow-sm text-sm font-medium"
                    >
                        Create Meal Session
                    </button>
                </form>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <p className="text-gray-500">Loading...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {mealSessions.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p>No meal sessions found</p>
                        </div>
                    ) : (
                        mealSessions.map((session) => (
                            <div key={session.id} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 overflow-hidden border border-gray-200 flex items-center justify-center flex-shrink-0">
                                        <div className="text-primary font-bold text-base sm:text-lg">
                                            {session.meal_type.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-base sm:text-lg text-gray-800">{session.meal_type}</h3>
                                        <p className="text-xs sm:text-sm text-gray-700 mt-1">Event: <span className="font-medium">{getEventName(session.event_id)}</span></p>
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${session.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {session.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                <hr className="mb-4 border-gray-100" />

                                <div className="mb-4 text-sm space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                        <span className="font-medium text-gray-900">Start Time:</span>
                                        <span className="text-gray-900">{new Date(session.start_time).toLocaleString()}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                        <span className="font-medium text-gray-900">End Time:</span>
                                        <span className="text-gray-900">{new Date(session.end_time).toLocaleString()}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                        <span className="font-medium text-gray-900">Capacity:</span>
                                        <span className="text-gray-900">{session.total_capacity}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={() => handleActivate(session.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${session.is_active
                                            ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                            : "bg-green-500 text-white hover:bg-green-600"
                                            }`}
                                    >
                                        {session.is_active ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(session.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium w-full sm:w-auto"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
