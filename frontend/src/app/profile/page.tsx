"use client";

import { useState, useEffect } from "react";
import DonutSVG from "../assets/vectors/Donut";
import { useAuth } from "@/src/hooks/useAuth"
import { useRouter } from "next/navigation"


interface UserData {
  username: string;
  email: string;
  is_active: boolean;
}


export default function Profile() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [load, setLoad] = useState<boolean>(true);
  const { user, loading, getToken } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/LoginPage")
    }
  }, [loading, user, router])

  useEffect(() => {
     const fetchUserData = async () => {
      try {
        const token = getToken();

        if (!token) {


          throw new Error("Not authenticated");
        }

        const response = await fetch("http://localhost:8000/Eaten/auth/me", {
          method: "GET",
          
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data: UserData = await response.json();
        setUserData(data);
      } catch (err) {
        if (err instanceof Error) {
         
            setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoad(false);
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (name?: string): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

const logout=()=>{
    localStorage.removeItem("token")
    router.push("/LoginPage")

}


  

  if (load) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-gradient">
        <p className="text-xl font-semibold text-white">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-primary-gradient min-h-screen">
        <div className="text-2xl font-semibold text-white">
          Error: {error}
        </div>
      </div>
    );
  }

  

  return (
    <div className="flex flex-col items-center p-10 bg-primary-gradient min-h-screen">
      <div className="flex flex-col items-center  justify-center w-[300px]">
        <h1 className="font-bold text-2xl mb-6">My Profile</h1>

    
        <div className="rounded-full w-[159px] h-[159px] flex items-center justify-center shadow-lg mb-6 bg-gradient text-[100px] bg-profile-picture-gradient">
          <p className="text-white text-[80px] font-bold">
            {getInitials(userData?.username)}
          </p>
        </div>

     
        <p className=" text-xl mb-2  border-b-2 border-gray-400 ">
          Username: {userData?.username}
        </p>
        <p className="text-xl mb-2 border-b-2 border-gray-400">Email: {userData?.email}</p>
        <p className="text-xl border-b-2 border-gray-400">
          Status: {userData?.is_active ? "Active" : "Inactive"}
        </p>
      </div>

      <button onClick={logout}>Logout</button>

      
      <div className="bottom-0 right-0 fixed">
        <DonutSVG />
      </div>
    </div>
  );
}