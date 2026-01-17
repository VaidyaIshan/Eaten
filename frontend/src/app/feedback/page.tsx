import React from "react"
import UpperSection from './UpperSection'
import LowerSection from './LowerSection'
import Navbar from "../components/Navbar/navbar";

export default function FeedbackPage() {

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
