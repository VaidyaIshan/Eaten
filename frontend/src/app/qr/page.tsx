"use client"

import React, { useState, useEffect } from "react"
import QRCode from "react-qr-code";

export default function QrPage() {
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  const EVENT_NAME = "DeerHack"; 
  const MEAL_TYPE = "Lunch"; 

  useEffect(() => {
    const fetchQrData = async () => {
      const token = localStorage.getItem("token");
      

      if (!token) {
          console.warn("No token found! User is not logged in.");
          setLoading(false);
          return; 
      }

      try {
      
        const userReq = fetch(`${process.env.NEXT_PUBLIC_API_URL}/Eaten/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mealReq = fetch(`${process.env.NEXT_PUBLIC_API_URL}/Eaten/meal-session/get-all-mealsession`, {
             headers: { Authorization: `Bearer ${token}` },
        });

        
        const [userRes, mealRes] = await Promise.all([userReq, mealReq]);

    
        if (!userRes.ok) throw new Error(`User Auth Failed: ${userRes.statusText}`);
        if (!mealRes.ok) {
            if (mealRes.status === 404) throw new Error(`Meal '${MEAL_TYPE}' not found for event '${EVENT_NAME}'`);
            throw new Error(`Meal Fetch Failed: ${mealRes.statusText}`);
        }

 
        const userData = await userRes.json();
        const mealData = await mealRes.json();

    
        if (userData.id && mealData.meal_id) {
        
            const uniqueString = `${userData.id}+${mealData.meal_id}`;
            setQrValue(uniqueString);
        } else {
            setError("Data missing from response (User ID or Meal ID not found)");
        }

      } catch (err: any) {
        console.error(" Fetch failed:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchQrData();
  }, []); 

  if (loading) {
      return (
        <div>
            <p>Loading your Ticket...</p>
        </div>
      );
  }

  return (
    <div>
       {error ? (
           <div style={{ color: 'red', textAlign: 'center' }}>
               <h3>Error</h3>
               <p>{error}</p>
           </div>
       ) : qrValue ? (
           <>
            <h1 style={{ marginBottom: '20px' }}>Meal Ticket</h1>
            
            <div>
                <QRCode value={qrValue} size={200} />
            </div>

           </>
       ) : (
           <p>Please Log In to view your QR Code.</p>
       )}
    </div>
  )
}


