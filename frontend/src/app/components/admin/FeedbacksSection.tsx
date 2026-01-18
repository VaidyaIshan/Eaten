import { useState, useEffect } from "react"
import { useAuth } from "@/src/hooks/useAuth"
import { Feedback } from "../../interfaces/admin"

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">Feedbacks Management</h2>
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <p className="text-gray-500">Loading...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {feedbacks.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p>No feedbacks found</p>
                        </div>
                    ) : (
                        feedbacks.map((feedback) => (
                            <div key={feedback.id} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="flex-1 w-full">
                                        <p className="text-gray-800 mb-3 leading-relaxed break-words">{feedback.response}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(feedback.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(feedback.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex-shrink-0 w-full sm:w-auto"
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