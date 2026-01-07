import React from "react"
import UpperSection from './UpperSection.tsx'
import LowerSection from './LowerSection.tsx'

export default function FeedbackPage() {

  return (
    <>
      <div className = "flex flex-col gap-0 m-0 overflow-x-hidden w-full">
        <UpperSection/>
        <LowerSection/>
      </div>

    </>
  )
}
