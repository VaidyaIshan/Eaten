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
        <div className="text-black">
            <h2 className="text-2xl font-bold mb-4">Users Management</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="space-y-4">
                    {users.map((user) => (
                        <div key={user.id} className="p-4 border rounded-lg flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">{user.username}</h3>
                                <p className="text-black">{user.email || "No email"}</p>
                                <p className="text-sm text-gray-500">
                                    Role: {user.role_id === 0 ? "Superadmin" : user.role_id === 1 ? "Admin" : "User"}
                                </p>
                                <span
                                    className={`inline-block px-2 py-1 rounded text-sm ${user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {user.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleToggleActive(user.id)}
                                    className={`px-4 py-2 rounded-md ${user.is_active
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