"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 

interface MealSession {
  id: string;
  meal_type: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export default function EventSessionsPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [sessions, setSessions] = useState<MealSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const res = await fetch(`http://127.0.0.1:8000/Eaten/meal-session/get-all-mealsession/`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        // 1. Check if the request was successful
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }

        // 2. Await the JSON parsing
        const data = await res.json();
        
        // 3. Set the actual data
        setSessions(data);

      } catch (error) {
        console.error("Failed to load sessions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [eventId]);

  if (loading) return <p>Loading sessions...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Meal Sessions</h1>
      
      {sessions.length === 0 ? (
        <p>No sessions found for this event.</p>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="border p-4 rounded shadow hover:bg-gray-50">
              <h2 className="text-xl font-semibold">{session.meal_type}</h2>
              <p className="text-gray-600">
                Time: {new Date(session.start_time).toLocaleTimeString()} - {new Date(session.end_time).toLocaleTimeString()}
              </p>
              <span className={`px-2 py-1 text-xs rounded ${session.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {session.is_active ? "Active" : "Closed"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}