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

interface GetAllFeedbackProps {
  RefreshTrigger: boolean
}

const GetAllFeedback = ({ RefreshTrigger }: GetAllFeedbackProps) => {

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
        `${process.env.NEXT_PUBLIC_API_URL}/Eaten/feedback/get-all-feedbacks`,
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
      // alert("Failed to fetch feedbacks")
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
  },[user, RefreshTrigger])
  return(
    <div className = "flex flex-grow flex-col w-full gap-[1rem]">

      <div className = "w-full flex flex-col">
        <p className = "text-[#000000] lg:text-[23px] text-[12px]">See what others are saying below!</p>
        <div className = "w-full h-[2px] bg-[#7466C9] flex justify-end">
          <div className = "relative w-[3.75rem] h-[5px] bg-[#7466C9] rounded-[9px] bottom-[1px] right-[10px]">
            <div className = "hidden">
              {/* <p>placeholder</p> */}
            </div>
          </div>
        </div>
      </div>


      <div className = "w-full flex flex-col w-full gap-[20px]">

      {feedbacks.map((f) => (
      <div className = "w-full flex-col w-full" key={f.id}>

        <div className = "w-full flex flex-row items-center justify-start gap-[5px] pb-[5px]">
          <div className = "lg:w-[2.125rem] lg:h-[2.125rem] w-[1.125rem] h-[1.125rem] rounded-full bg-[#7466C9] flex text-center items-center justify-center">
            <p className = "lg:text-[20px] text-[10px]" >{f.username[0]}</p>
          </div>

          <p className = "text-[#000000] lg:text-[20px] text-[10px]">@{f.username}</p>
        </div>

        <div className = "bg-[#F3F3F3] flex text-center items-center justify-start lg:h-[2.35rem] h-[1.125rem] p-[3px]">
          <p className = "text-[#000000] lg:text-[15px] text-[10px]">
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
          <p className = "text-[#CCCCCC] lg:text-[15px] text-[10px] italic">That's all for now...</p>
      </div>
    </div>
  )

}

export default GetAllFeedback;
