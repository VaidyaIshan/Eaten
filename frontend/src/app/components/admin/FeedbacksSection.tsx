import { useState, useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { Feedback } from "../../interfaces/admin";

// Feedbacks Section
export default function FeedbacksSection() {
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
        <div className="text-black">
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
