"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"

interface AddFeedbackProps {
  setRefreshTrigger: React.Dispatch<React.SetStateAction<boolean>>
}

const PostFeedback = ({ setRefreshTrigger }: AddFeedbackProps) => {

  const router = useRouter()
  const { user, loading, getToken } = useAuth()

  const [review, setReview] = useState("")
  const [submitting, setSubmitting] = useState(false)


  //feedback submission function
  const submitFeedback = async () => {

    if (!review) {
      return alert("Please write a review")
    }

    if (!user) {
      console.log("no user going to login")
      router.push("/LoginPage")
      return
    }

    setSubmitting(true)

    const token = getToken()

    if (!token) {
      console.log("no token going to login")
      router.push("/LoginPage")
      setSubmitting(false)
      return
    }

    try {

      const res = await fetch(
        "http://localhost:8000/Eaten/feedback/response",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: user.username,
            review,
          }),
        }
      )

      if (!res.ok) {
        throw new Error("Failed to submit feedback")
      }

      setReview("")
      // await fetchFeedbacks()
      alert("Feedback submitted")
      setRefreshTrigger(prev => !prev)
    } catch (err) {
      console.error(err)
      alert("Failed to submit Feedback")
    } finally {
      setSubmitting(false)
    }

  }


  return (

    <div className="flex flex-col p-0 m-0 gap-5 w-full justify-end items-end">

      <div className="flex flex-col gap-[4px] w-full m-0 p-0">
        <textarea
          className="placeholder-gray-500 border border-gray-500 w-full h-[15.25rem] text-black text-[15px] rounded-[1px] p-[3px]"
          placeholder="Enter your thoughts..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div className="flex justify-end">
          <p className="italic text-[#ACACAC] text-[8px]">
          /*Your feedback will be monitored*/
          </p>
        </div>
      </div>

      <button
        className="bg-primary text-white text-[12px] rounded-[4px] w-[12.813rem] h-[1.813rem]"
        onClick={submitFeedback}
        disabled={submitting || !review}
      >
        Submit Feedback
      </button>
    </div>

  )
}

export default PostFeedback;
