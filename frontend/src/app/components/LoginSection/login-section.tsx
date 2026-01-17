"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"

export default function LoginSection() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) router.push("/dashboard")
  }, [user, router])

  useEffect(() => {
    setUsername("")
    setPassword("")
    setError("")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError("Username and password are required.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8000/Eaten/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Authentication Failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.access_token)
      router.push("/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#FFC75F] w-full max-4xl rounded-t-[5.875rem] pt-3.75 pl-3.25 pr-3.25 m-0">
      <div className="flex flex-col items-center justify-center bg-[#FBF7FF] bottom-0 h-[35rem] w-full rounded-t-[5.875rem] gap-4">

        <p className="absolute top-[85px] font-bold text-[32px] text-primary">Welcome back</p>

        <input
          type="text"
          name="username"
          placeholder={username === "" ? "Enter username" : ""}
          className="absolute top-[12rem] w-[16.813rem] px-4 py-2 border rounded-md text-black outline-none font-bold"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          name="password"
          placeholder={password === "" ? "Enter password" : ""}
          className="absolute top-[16rem] w-[16.813rem] px-4 py-2 border rounded-md text-black outline-none font-bold"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="absolute bottom-[15rem] text-red-500 font-bold text-sm">
            {error}
          </p>
        )}

        <button
          className="absolute bottom-[10rem] bg-primary border-8 border-solid border-accent h-[47px] w-[276px] rounded-xl flex justify-center items-center font-extrabold"
          onClick={handleSubmit}
          disabled={loading}
        >
          Sign In
        </button>


      </div>
    </div>
  )
}
