"use client"
import { signOut } from "next-auth/react"
import { MdLogout } from "react-icons/md"



export function SignOut() {
    return (
       
        <button onClick={()=>signOut()} className="bg-gray-200 rounded-lg p-1 pr-2 pl-2 flex justify-center items-center gap-1">    <MdLogout className="h-4 w-4" /> Sign Out</button>
     
    )
}