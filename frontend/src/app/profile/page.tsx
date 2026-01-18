"use client";

import { useState, useEffect } from "react";
import DonutSVG from "../assets/vectors/Donut";
import { useAuth } from "@/src/hooks/useAuth"
import { useRouter } from "next/navigation"
import Navbar from "../components/Navbar/navbar";


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
 
  <div className="min-h-screen bg-primary-gradient">
    <Navbar />

    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl p-8 relative mt-5">

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-8 text-white">
          My Profile
        </h1>

        {/* Profile Avatar */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full w-36 h-36 flex items-center justify-center shadow-md bg-profile-picture-gradient">
            <p className="text-white text-5xl font-bold">
              {getInitials(userData?.username)}
            </p>
          </div>
        </div>

       
        <div className="space-y-4 text-white">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Username</span>
            <span>{userData?.username}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Email</span>
            <span className="truncate max-w-[180px] text-right">
              {userData?.email}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Status</span>
            <span
              className={`font-semibold ${
                userData?.is_active ? "text-green-600" : "text-red-500"
              }`}
            >
              {userData?.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

     
        <button
          onClick={logout}
          className="mt-8 w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>

   
    <div className="fixed bottom-0 right-0 opacity-80 pointer-events-none">
      <DonutSVG />
    </div>
  </div>

  );
}