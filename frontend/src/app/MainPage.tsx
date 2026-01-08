import React from "react"
import DonutSVG from "./assets/vectors/Donut"
import MoonSVG from "./assets/vectors/Moon"
export default function MainPage(){
    return(
        <>
        <div className="min-h-screen flex flex-col justify-center left-5 fixed">
              <div className="fixed right-2 top-4">
                    <MoonSVG/>
                </div>

            <p className="text-[96px] font-bold text-white ">Eaten</p>
            <p className="text-[30px] font-bold text-[#F08181] ">Where every bite feels unreal</p>

             <div className="fixed bottom-0 right-0">
                    <DonutSVG/>
                 </div>
        </div>
        </>
    )
}