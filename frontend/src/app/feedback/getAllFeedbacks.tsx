"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"

interface Feedback{
  id: string
  response: string
  created_at: string
  username: string
}

const GetAllFeedback = () => {

  const router = useRouter()
  const { user, loading, getToken } = useAuth()

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

  const fetchFeedbacks = async() =>{
    const token = getToken()

    if(!token){
      router.push("/LoginPage")
      return 
    }

    try{

      const res = await fetch(
        "http://localhost:8000/Eaten/feedback/get-all-feedbacks",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if(!res.ok){
        throw new Error("Failed to fetch feedbacks")
      }

      const data: Feedback[] = await res.json()
      setFeedbacks(data)

    }catch(err){
      console.error(err)
      alert("Failed to fetch feedbacks")
    }
  }

  // logic for redirection
  useEffect(() =>{
    if(!user && !loading){
      router.push("/LoginPage")
    }
  },[user,router,loading])

//check if user has loaded
  useEffect(() =>{
    if(user){
      fetchFeedbacks()
    }
  },[user])

  return(
    <div className = "flex flex-grow flex-col w-full gap-[1rem]">

      <div className = "w-full flex flex-col">
        <p className = "text-[#000000] text-[10px]">See what others are saying below!</p>
        <div className = "w-full h-[2px] bg-[#7466C9] flex justify-end items-center rounded-sm">
          <div className = "relative w-[3.75rem] h-[5px] bg-[#7466C9] rounded-[9px] right-[10px]">
            <div className = "hidden">
              {/* <p>placeholder</p> */}
            </div>
          </div>
        </div>
      </div>


      <div className = "w-full flex flex-col w-full gap-[10px]">

      {feedbacks.map((f) => (
      <div className = "w-full flex-col w-full">

        <div className = "w-full flex flex-row items-center justify-start gap-[5px] pb-[5px]">
          <div className = "w-[1.125rem] h-[1.125rem] rounded-full bg-[#7466C9] flex text-center items-center justify-center">
            <p className = "text-[10px]" key={f.id}>{f.username[0]}</p>
          </div>

          <p className = "text-[#000000] text-[10px]">@{f.username}</p>
        </div>

        <div className = "bg-[#F3F3F3] flex text-center items-center justify-start h-[1.125rem] p-[3px]">
          <p className = "text-[#000000] text-[10px]">
            &gt; {f.response}
          </p>
        </div>

      </div>
      ))}
      </div>

      <div className = "w-full flex flex-col items-center">
        <div className = "w-full h-[1px] bg-[#EFECEC] flex justify-end">
          <div className = "hidden">
              <p>placeholder</p>
          </div>
        </div>
          <p className = "text-[#CCCCCC] text-[10px] italic">That's all for now...</p>
      </div>
    </div>
  )

}

export default GetAllFeedback;
