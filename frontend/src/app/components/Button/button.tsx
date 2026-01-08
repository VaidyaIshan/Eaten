import React from "react"
export default function Button({text="Default", className=""}){
    return(
        <>
        <button className={`${className}`} >{text}</button>

        </>
    )
}
