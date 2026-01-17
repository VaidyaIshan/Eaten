import React from "react"
import Button from "./components/Button/button"
import DonutSVG from "./assets/vectors/Donut"
import MoonSVG from "./assets/vectors/Moon"
import Navbar from "./components/Navbar/navbar"
export default function NotFound(){
    return(
        <>
        <Navbar/>

                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="fixed right-2 top-4">
                    <MoonSVG/>
                </div>
                <p className="font-bold text-[96px] leading-none">404</p>
                 <p className="font-bold text-[24px] text-accent "> Nothing seems to be here</p>
                
                 <Button 
                 text="Go back to Home"
                 className="bg-secondary border-8 border-solid border-accent h-[47px] w-[276px] rounded-xl   flex justify-center items-center font-extrabold"
                 />
                 <div className="fixed bottom-0 right-0">
                    <DonutSVG/>
                 </div>
                  
                </div>
        </>
    )

}