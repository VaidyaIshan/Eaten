import { useState, useEffect } from "react"
import { useAuth } from "@/src/hooks/useAuth"
import { User } from "../../interfaces/admin"

// Users Section
export default function UsersSection({ isSuperAdmin }: { isSuperAdmin: boolean }) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">Users Management</h2>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <p className="text-gray-500">Loading...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {users.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p>No users found</p>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div key={user.id} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 overflow-hidden border border-gray-200 flex items-center justify-center flex-shrink-0">
                                        <div className="text-purple-600 font-bold text-base sm:text-lg">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-base sm:text-lg text-gray-800 truncate">{user.username}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email || "No email"}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                                {user.role_id === 0 ? "Superadmin" : user.role_id === 1 ? "Admin" : "User"}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full font-medium ${user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {user.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <hr className="mb-4 border-gray-100" />

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={() => handleToggleActive(user.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${user.is_active
                                            ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                            : "bg-green-500 text-white hover:bg-green-600"
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
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium w-full sm:w-auto"
                                            disabled={user.role_id === 0}
                                        >
                                            Make {user.role_id === 1 ? "User" : "Admin"}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(user.id)}
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