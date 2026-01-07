import React from "react"
import UpperSection from './UpperSection'
import LowerSection from './LowerSection'

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
