"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"

interface Event {
  id: string
  name: string
  description: string
  start_date: string
  end_date: string
  is_active: boolean
  picture: string | null
}

interface MealSession {
  id: string
  event_id: string
  meal_type: string
  start_time: string
  end_time: string
  is_active: boolean
  total_capacity: number
}

interface User {
  id: string
  username: string
  email: string | null
  role_id: number
  is_active: boolean
}

interface Feedback {
  id: string
  response: string
  user_id: string
  created_at: string
}

interface FoodClaim {
  id: string
  user_id: string
  meal_session_id: string
  event_id: string
  claimed_at: string
  is_claimed: boolean
}

type TabType = "events" | "mealsessions" | "users" | "feedbacks" | "foodclaims"

export default function AdminPage() {
  const router = useRouter()
  const { user, loading, getToken } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("events")

  // Redirect if not admin or superadmin
  useEffect(() => {
    if (!loading && (!user || (user.role_id !== 1 && user.role_id !== 0))) {
      router.push("/events")
    }
  }, [loading, user, router])

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
  
  const isSuperAdmin = user.role_id === 0

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/admin/scanner")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              QR Scanner
            </button>
            <button
              onClick={() => router.push("/events")}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Events
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b">
          {[
            { id: "events" as TabType, label: "Events" },
            { id: "mealsessions" as TabType, label: "Meal Sessions" },
            { id: "users" as TabType, label: "Users" },
            { id: "feedbacks" as TabType, label: "Feedbacks" },
            { id: "foodclaims" as TabType, label: "Food Claims" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === "events" && <EventsSection />}
        {activeTab === "mealsessions" && <MealSessionsSection />}
        {activeTab === "users" && <UsersSection isSuperAdmin={isSuperAdmin} />}
        {activeTab === "feedbacks" && <FeedbacksSection />}
        {activeTab === "foodclaims" && <FoodClaimsSection />}
        </div>
      </div>
    </div>
  )
}

// Events Section
function EventsSection() {
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Events Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Create Event"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 p-4 border rounded-lg space-y-4">
          <input
            type="text"
            placeholder="Event Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Picture URL"
            value={formData.picture}
            onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Create Event
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{event.name}</h3>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(event.start_date).toLocaleDateString()} -{" "}
                  {new Date(event.end_date).toLocaleDateString()}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded text-sm ${
                    event.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {event.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleActivate(event.id)}
                  className={`px-4 py-2 rounded-md ${
                    event.is_active
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {event.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
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

// Meal Sessions Section
function MealSessionsSection() {
  const { getToken } = useAuth()
  const [mealSessions, setMealSessions] = useState<MealSession[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    event_name: "",
    meal_type: "",
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
            start_time: formData.start_time,
            end_time: formData.end_time,
            total_capacity: parseInt(formData.total_capacity),
          }),
        }
      )
      if (res.ok) {
        setShowForm(false)
        setFormData({ event_name: "", meal_type: "", start_time: "", end_time: "", total_capacity: "" })
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Meal Sessions Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Create Meal Session"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 p-4 border rounded-lg space-y-4">
          <select
            value={formData.event_name}
            onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
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
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="datetime-local"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="datetime-local"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Total Capacity"
            value={formData.total_capacity}
            onChange={(e) => setFormData({ ...formData, total_capacity: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Create Meal Session
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {mealSessions.map((session) => (
            <div key={session.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{session.meal_type}</h3>
                <p className="text-sm text-gray-500">Event: {getEventName(session.event_id)}</p>
                <p className="text-sm text-gray-600">
                  {new Date(session.start_time).toLocaleString()} -{" "}
                  {new Date(session.end_time).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Capacity: {session.total_capacity}</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-sm ${
                    session.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {session.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleActivate(session.id)}
                  className={`px-4 py-2 rounded-md ${
                    session.is_active
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {session.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(session.id)}
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

// Users Section
function UsersSection({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const { getToken, user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    const token = getToken()
    if (!token) return

    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    const token = getToken()
    if (!token) return

    try {
      const res = await fetch(`http://localhost:8000/Eaten/auth/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        fetchUsers()
        alert("User deleted successfully")
      } else {
        const errorData = await res.json()
        alert(errorData.detail || "Failed to delete user")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to delete user")
    }
  }

  const handleToggleActive = async (id: string) => {
    const token = getToken()
    if (!token) return

    try {
      const res = await fetch(`http://localhost:8000/Eaten/auth/users/isActive/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        fetchUsers()
        alert("User status updated")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to update user")
    }
  }

  const handleChangeRole = async (id: string, newRoleId: number) => {
    if (!isSuperAdmin) {
      alert("Only superadmin can change user roles")
      return
    }
    
    // Prevent users from changing their own role
    if (currentUser && currentUser.id === id) {
      alert("Cannot change your own role")
      return
    }
    
    const token = getToken()
    if (!token) return

    try {
      const res = await fetch(`http://localhost:8000/Eaten/auth/users/${id}?new_role_id=${newRoleId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        fetchUsers()
        alert("User role updated")
      } else {
        const errorData = await res.json()
        alert(errorData.detail || "Failed to update user role")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to update user role")
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{user.username}</h3>
                <p className="text-gray-600">{user.email || "No email"}</p>
                <p className="text-sm text-gray-500">
                  Role: {user.role_id === 0 ? "Superadmin" : user.role_id === 1 ? "Admin" : "User"}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded text-sm ${
                    user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleActive(user.id)}
                  className={`px-4 py-2 rounded-md ${
                    user.is_active
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {user.is_active ? "Deactivate" : "Activate"}
                </button>
                {isSuperAdmin && (
                  <button
                    onClick={() => {
                      if (user.role_id === 0) {
                        alert("Cannot change superadmin role")
                        return
                      }
                      handleChangeRole(user.id, user.role_id === 1 ? 2 : 1)
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    disabled={user.role_id === 0}
                  >
                    Make {user.role_id === 1 ? "User" : "Admin"}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(user.id)}
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

// Feedbacks Section
function FeedbacksSection() {
  const { getToken } = useAuth()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFeedbacks = async () => {
    const token = getToken()
    if (!token) return

    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/Eaten/feedback/get-all-feedbacks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setFeedbacks(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return
    const token = getToken()
    if (!token) return

    try {
      const res = await fetch(`http://localhost:8000/Eaten/feedback/delete?feedback_id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        fetchFeedbacks()
        alert("Feedback deleted successfully")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to delete feedback")
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Feedbacks Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div className="flex-1">
                <p className="text-gray-800">{feedback.response}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(feedback.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(feedback.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ml-4"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Food Claims Section
function FoodClaimsSection() {
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
    <div>
      <h2 className="text-2xl font-bold mb-4">Food Claims Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {foodClaims.map((claim) => (
            <div key={claim.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="text-gray-800">User ID: {claim.user_id}</p>
                <p className="text-sm text-gray-600">Meal Session: {claim.meal_session_id}</p>
                <p className="text-sm text-gray-600">Event: {claim.event_id}</p>
                <p className="text-sm text-gray-500">
                  Claimed at: {new Date(claim.claimed_at).toLocaleString()}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded text-sm ${
                    claim.is_claimed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {claim.is_claimed ? "Claimed" : "Not Claimed"}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleActivate(claim.id)}
                  className={`px-4 py-2 rounded-md ${
                    claim.is_claimed
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

