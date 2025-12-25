"use client"

import { useState } from "react"

export default function FeedbackPage() {
  const [username, setUsername] = useState("")
  const [review, setReview] = useState("")

  async function submitFeedback() {
    const res = await fetch(
      `http://localhost:8000/feedback/response?username=${username}&review=${review}`,
      {
        method: "POST",
      }
    )

    if (!res.ok) {
      alert("Failed to submit feedback")
      return
    }

    const data = await res.json()
    console.log(data)
    alert("Feedback submitted")
  }

  return (
    <div className="p-md space-y-md max-w-md">
      <input
        className="border p-sm w-full"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <textarea
        className="border p-sm w-full"
        placeholder="Review"
        value={review}
        onChange={e => setReview(e.target.value)}
      />

      <button
        onClick={submitFeedback}
        className="bg-primary text-white px-md py-sm rounded-md"
      >
        Submit
      </button>
    </div>
  )
}