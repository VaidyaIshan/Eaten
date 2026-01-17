"use client"
import React from "react"
import DonutSVG from "./assets/vectors/Donut"
import MoonSVG from "./assets/vectors/Moon"
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export default function MainPage(){
    
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
            <div className="min-h-screen flex flex-col justify-center left-5 fixed top-[-50px] ">
                <div className="fixed right-2 top-4 animate-entrance-x-moon" id="moon">
                    <MoonSVG/>
                </div>

                <p className="text-[92px] font-bold text-white animate-entrance " >Eaten</p>
                <p className="text-[28px] font-bold text-accent animate-entrance" >Where every bite feels unreal</p>

                <div className="fixed bottom-0 right-0 animate-entrance-x" id="donut">
                    <DonutSVG/>
                </div>
            </div>
        </>
    )
}