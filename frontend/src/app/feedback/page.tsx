"use client"

import React from "react"
import { useState } from "react"
import PostFeedback from './postFeedback.tsx'
import GetAllFeedback from './getAllFeedbacks.tsx'

export default function FeedbackPage() {

  const [newPost, setNewPost] = useState(0);

  return (
    <>
      <PostFeedback onSuccess = {() => setNewPost((count) => count + 1)}/>
      <GetAllFeedback newPost={newPost}/>
    </>
  )
}
