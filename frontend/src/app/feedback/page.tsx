"use client"

import React from "react"
import PostFeedback from './postFeedback.tsx'
import GetAllFeedback from './getAllFeedbacks.tsx'

export default function FeedbackPage() {

  return (
    <>
      <PostFeedback />
      <GetAllFeedback />
    </>
  )
}
