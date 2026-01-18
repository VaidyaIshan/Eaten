"use client"
import React from "react"
import DonutSVG from "../assets/vectors/Donut"
import MoonSVG from "../assets/vectors/Moon"
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Navbar from "../components/Navbar/navbar";
import Link from "next/link";

export default function Dashboard(){
    
useGSAP(() => {
  gsap.from('.animate-entrance',{
    opacity: 0,
    y: 30,
    duration: 1.5,
    ease: "power2.out",
    delay: 0.3
  })
}, []);
useGSAP(() => {
  gsap.from('.animate-entrance-x',{
    opacity: 0,
    x: 40,
    duration: 1.5,
    ease: "power2.out",
    delay: 0.7
  })
}, []);
useGSAP(() => {
  gsap.from(".animate-login", {
    opacity: 0,
    y: 20,
    duration: 1.2,
    ease: "power3.out",
    delay: 1.2
  });
}, []);
useGSAP(() => {
  gsap.to(".login-arrow", {
    x: 8,
    duration: 0.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    delay: 1.6
  });
}, []);
useGSAP(() => {
  gsap.from('.animate-entrance-x-moon',{
    opacity: 0,
    x: -40,
    duration: 1.5,
    ease: "power2.out",
    delay:0.7
    
  })
}, []);

    return (
        <>
        <Navbar/>
            <div className="min-h-screen flex flex-col justify-center left-5 fixed top-[-50px] lg:left-20">
                <div className="fixed right-2 top-4 animate-entrance-x-moon" id="moon">
                    <MoonSVG className=" lg:w-56 lg:h-56"/>
                </div>

                <p className="text-[92px] font-bold text-white animate-entrance " >Eaten</p>
                <p className="text-[28px] font-bold text-accent animate-entrance" >Where every bite feels unreal</p>
               <Link href="/events">
  <button
    className="
      animate-login flex items-center gap-2 mt-[25px] font-bold text-white text-[20px] cursor-pointer border border-white px-10 py-2 rounded-full
    "
  >
    Events
    <span className="login-arrow inline-flex">
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
  <path d="M5 11h12.17l-4.88-4.88c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l6.59 6.59c.39.39.39 1.02 0 1.41l-6.59 6.59c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41L17.17 13H5c-.55 0-1-.45-1-1s.45-1 1-1z" />
</svg>
    </span>
  </button>
</Link>
                <div className="fixed bottom-0 right-0 animate-entrance-x" id="donut">
                    <DonutSVG/>
                </div>
            </div>
        </>
    )
}