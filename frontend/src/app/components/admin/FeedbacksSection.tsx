import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";
import { Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Feedback {
    id: string;
    response: string;
    user_id: string;
    username?: string;
    created_at: string;
}

export function FeedbacksSection() {
    const { getToken } = useAuth();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFeedbacks = async () => {
        const token = getToken();
        if (!token) return;

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/Eaten/feedback/get-all-feedbacks", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setFeedbacks(data);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch feedbacks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this feedback?")) return;
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:8000/Eaten/feedback/delete?feedback_id=${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                fetchFeedbacks();
                toast.success("Feedback deleted successfully");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete feedback");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-100 to-pink-100 p-6 shadow-lg">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-white/50 flex items-center justify-center">
                        <MessageSquare className="h-8 w-8 text-pink-500" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mt-4">
                    See what others are saying below!
                </h2>
            </div>

            {loading ? (
                <LoadingSpinner text="Loading feedbacks..." />
            ) : feedbacks.length === 0 ? (
                <EmptyState
                    icon={MessageSquare}
                    title="No feedbacks yet"
                    description="User feedback will appear here"
                />
            ) : (
                <div className="space-y-4">
                    {feedbacks.map((feedback, index) => {
                        const username = feedback.username || `User ${feedback.user_id.slice(0, 4)}`;
                        return (
                            <div
                                key={feedback.id}
                                className="bg-white rounded-2xl shadow-md p-5 animate-slide-up hover:shadow-lg transition-shadow duration-200"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {/* User Info */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-200 to-pink-200 flex items-center justify-center shadow-sm">
                                        <span className="text-lg font-bold text-gray-700">
                                            {username[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        @{username}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-auto">
                                        {new Date(feedback.created_at).toLocaleDateString([], {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>

                                {/* Feedback Content */}
                                <div className="pl-13 ml-12">
                                    <p className="text-gray-700 italic leading-relaxed">
                                        <span className="text-pink-400 font-bold mr-2">&gt;</span>
                                        {feedback.response}
                                    </p>
                                </div>

                                {/* Delete Button */}
                                <div className="flex justify-end mt-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(feedback.id)}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Footer Section */}
            {!loading && feedbacks.length > 0 && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-100 to-yellow-100 p-6 shadow-lg">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-white/50 flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-yellow-500" />
                        </div>
                    </div>
                    <p className="text-lg font-medium text-center text-gray-700 mt-3">
                        That's all for now...
                    </p>
                </div>
            )}
        </div>
    );
}