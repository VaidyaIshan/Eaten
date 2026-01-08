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

    const getToken = () => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYXRlbkBzb2Z0d2FyZWNsdWIuY29tIn0.xyXNiSu-7bM9w9uHIyISXzMOTGuKd5225jmaxV2m05k"

    useEffect(() => {
        const token = getToken()

        if (!token) {
            setLoading(false)
            return
        }

        setUser({
            id: "1",
            username: "Eaten",
            email: "eaten@gmail.com",
            role_id: 0,
        })

        setLoading(false)
    }, [])

    return { user, loading, getToken }
}