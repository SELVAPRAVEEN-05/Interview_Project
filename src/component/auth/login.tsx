"use client";

// library imports
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export function SignIn() {
   
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            signIn("credentials", {
                username,
                password,
                redirectTo:"/"
            })
                .then((result:any) => {
                    if (result?.error) {
                        setError(result.error)
                    } else {
                        window.location.href = "/"
                    }
                })
                .catch(err => {
                    console.error("Error during sign in:", err)
                    setError("Failed to sign in")
                })
        } catch (error) {
            // handle error state here
            console.error("Error during sign-in", error);
            setError("Internal server error");
        }
    };

    return (
        <div className="mx-auto  w-[200px]  h-full bg-red-900  bg-primary-foreground">
            <div>
                <p className="text-xl w-full flex justify-center mt-3 mb-5">Sign In</p>
                <form onSubmit={handleSubmit}>
                    <label>
                        email:
                        <input
                            type="text"
                            className="w-full rounded-sm"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            className="w-full rounded-sm"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <button
                        className="w-full flex justify-center bg-teal-500 text-white mt-3 rounded-md"
                        type="submit"
                    >
                        Sign In
                    </button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </div>
            
           
        </div>
    );
}