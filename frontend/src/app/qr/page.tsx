"use client"

import React, { useState, useEffect } from "react"
import QRCode from "react-qr-code";

export default function Useridpage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("token");
      console.log("1. Token from storage:", token);

      if (!token) {
          console.warn("No token found! User is not logged in.");
          setLoading(false);
          return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/Eaten/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });


        if (res.ok) {
          const userData = await res.json();
          
          if (userData.id) {
              setUserId(userData.id);
          } else {
              console.error("Missing 'id' in response. Check the object structure above.");
          }
        } else {
            console.error("API Error:", res.statusText);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ marginTop: '350px', marginLeft:'600px' }}>
       {userId ? (<QRCode value={userId} /> ) : (
           <div>
               <p>No User ID found.</p>
               <p>Check the Console (F12) for details.</p>
           </div>
       )}
    </div>
  )
}