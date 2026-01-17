import { useState, useEffect } from "react"
import { useAuth } from "@/src/hooks/useAuth"
import { Calendar } from "lucide-react"

interface Event {
    id: string
    name: string
    description: string
    start_date: string
    end_date: string
    is_active: boolean
    picture: string | null
}

export default function EventsSection() {
    const { getToken } = useAuth()
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        picture: "",
    })

    const fetchEvents = async () => {
        const token = getToken()
        if (!token) return

        setLoading(true)
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
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = getToken()
        if (!token) return

        try {
            const res = await fetch("http://localhost:8000/Eaten/event/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                setShowForm(false)
                setFormData({ name: "", description: "", start_date: "", end_date: "", picture: "" })
                fetchEvents()
                alert("Event created successfully")
            } else {
                const data = await res.json()
                alert(data.detail || "Failed to create event")
            }
        } catch (err) {
            console.error(err)
            alert("Failed to create event")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return
        const token = getToken()
        if (!token) return

        try {
            const res = await fetch(`http://localhost:8000/Eaten/event/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.ok) {
                fetchEvents()
                alert("Event deleted successfully")
            }
        } catch (err) {
            console.error(err)
            alert("Failed to delete event")
        }
    }

    const handleActivate = async (id: string) => {
        const token = getToken()
        if (!token) return

        try {
            const res = await fetch(`http://localhost:8000/Eaten/event/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.ok) {
                fetchEvents()
                alert("Event status updated")
            }
        } catch (err) {
            console.error(err)
            alert("Failed to update event")
        }
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Events Management</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#4a3ea3] transition-colors shadow-sm text-sm font-medium w-full sm:w-auto"
                >
                    {showForm ? "Cancel" : "Create Event"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="mb-6 p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                    <input
                        type="text"
                        placeholder="Event Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 text-black"
                        style={{ color: '#000000' }}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 text-black"
                        style={{ color: '#000000' }}
                        required
                        rows={3}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5 pointer-events-none z-10" style={{ zIndex: 10 }} />
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => {
                                    const startValue = e.target.value

                                    // Auto-set end date to 3 days after start date
                                    if (startValue) {
                                        const startDate = new Date(startValue)
                                        const endDate = new Date(startDate)
                                        endDate.setDate(endDate.getDate() + 3)

                                        // Format to date format (YYYY-MM-DD)
                                        const endValue = endDate.toISOString().slice(0, 10)
                                        setFormData(prev => ({ ...prev, start_date: startValue, end_date: endValue }))
                                    } else {
                                        setFormData(prev => ({ ...prev, start_date: startValue }))
                                    }
                                }}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                                style={{ color: '#000000' }}
                                required
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5 pointer-events-none z-10" style={{ zIndex: 10 }} />
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                                style={{ color: '#000000' }}
                                required
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="Picture URL"
                        value={formData.picture}
                        onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 text-black"
                        style={{ color: '#000000' }}
                        required
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#4a3ea3] transition-colors shadow-sm text-sm font-medium"
                    >
                        Create Event
                    </button>
                </form>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <p className="text-gray-500">Loading...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p>No events found</p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 overflow-hidden border border-gray-200 flex-shrink-0">
                                        {event.picture ? (
                                            <img
                                                src={event.picture}
                                                alt={event.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-primary font-bold text-base sm:text-lg">
                                                {event.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-base sm:text-lg text-gray-800 truncate">{event.name}</h3>
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${event.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {event.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                <hr className="mb-4 border-gray-100" />

                                <div className="mb-4 text-sm space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                        <span className="font-medium text-gray-900">Start Date:</span>
                                        <span className="text-gray-900">{new Date(event.start_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                        <span className="font-medium text-gray-900">End Date:</span>
                                        <span className="text-gray-900">{new Date(event.end_date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <p className="mb-6 text-gray-600 text-sm leading-relaxed">
                                    {event.description}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={() => handleActivate(event.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${event.is_active
                                            ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                            : "bg-green-500 text-white hover:bg-green-600"
                                            }`}
                                    >
                                        {event.is_active ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
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