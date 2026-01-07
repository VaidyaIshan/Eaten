"use client"

import { useEffect, useState } from "react"

export interface User {
    id: string
    username: string
    email: string
    role_id: number
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const getToken = () =>
        typeof window !== "undefined" ? localStorage.getItem("token") : null

    useEffect(() => {
        const token = getToken()
        if (!token) {
            setLoading(false)
            return
        }

        const fetchMe = async () => {
            try {
                const res = await fetch("http://localhost:8000/Eaten/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                })

                if (!res.ok) {
                    localStorage.removeItem("token")
                    setUser(null)
                    return
                }

                const data = await res.json()
                setUser(data)
            } catch {
                localStorage.removeItem("token")
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        fetchMe()
    }, [])

    return { user, loading, getToken }
}
