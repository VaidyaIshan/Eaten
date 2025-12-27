import { useState, useEffect } from "react"
import React from "react"

interface UserReview{
  id: UUID,
  response: string,
  user_id: UUID,
  created_at: Date
}

const GetAllFeedback = () => {

  const [feedbacks, setFeedbacks] = useState<UserReview[]>([]);

  const getAllFeedback = () => {

    useEffect(() => {
      const fetchFeedback = async () => {
        try{
          const res = await fetch("http://localhost:8000/Eaten/feedback/get-all-users");
          const holdFeedback: UserReview[] = await res.json(); 

          setFeedbacks(holdFeedback);
        }catch(error){
          alert("Failed to fetch feedbacks")
        } 
      }

      fetchFeedback();
    }, []);

  }

  getAllFeedback();

  return(
    <div className="p-md space-y-md max-w-md">
      <ul>
        {feedbacks.map((feedback)=> (
          <li key={feedback.id}>
            {feedback.response}
          </li>
        ))}
      </ul>
    </div>
  )

}

export default GetAllFeedback;
