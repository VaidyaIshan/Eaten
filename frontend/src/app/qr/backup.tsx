// "use client"

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Link from 'next/link'; // <--- Import Link for navigation

// interface Event {
//   id: string;
//   name: string;
//   description?: string;
//   start_date?: string;
//   // add other fields your backend returns
// }

// export default function AllEventsPage() {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         // Replace with your actual events endpoint
//         const res = await axios.get("http://127.0.0.1:8000/Eaten/events/", {
//            headers: { Authorization: `Bearer ${token}` }
//         });
//         setEvents(res.data);
//       } catch (err) {
//         console.error("Failed to fetch events", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   if (loading) return <div className="p-8 text-center">Loading Events...</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
//         Upcoming Events
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
//         {events.map((event) => (
//           <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            
//             {/* Event Header */}
//             <div className="p-6 flex-grow">
//               <h2 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h2>
//               <p className="text-gray-600 text-sm line-clamp-3">
//                 {event.description || "No description available."}
//               </p>
//             </div>

//             {/* BUTTON CONFIGURATION */}
//             <div className="p-6 bg-gray-50 border-t border-gray-100">
//               {/* We wrap the button in a Link.
//                  href={`/events/${event.id}`} constructs the URL dynamically.
//                  Example: /events/550e8400-e29b...
//               */}
//               <Link href={`/events/${event.id}`} className="block w-full">
//                 <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
//                   View Meal Sessions &rarr;
//                 </button>
//               </Link>
//             </div>

//           </div>
//         ))}
//       </div>
      
//       {events.length === 0 && (
//           <p className="text-center text-gray-500 mt-10">No active events found.</p>
//       )}
//     </div>
//   );
// }