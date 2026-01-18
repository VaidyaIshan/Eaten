"use client"
import React from "react"
import UpperSection from './UpperSection'
import LowerSection from './LowerSection'
import Navbar from "../components/Navbar/navbar";
import { useState } from "react"

export default function FeedbackPage() {

  const [submitted, setSubmitted] = useState(false)
  return (
    <>
      <div className = "flex flex-col gap-0 m-0 overflow-x-hidden w-full">
        <Navbar/>
        <UpperSection/>
        <LowerSection/>
      </div>

    </>
  )
}
