"use client"
import { signIn } from "next-auth/react";

export function GoogleSign() {
    return (
        <button onClick={() => signIn("google")} className="font-poppins ">Login with Google</button>
    );
}

