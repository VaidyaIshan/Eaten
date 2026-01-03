import React from "react"
export default function Button({text="Default", className=""}){
    return(
        <>
        <div className={`${className}`} >{text}</div>

        </>
    )
}
