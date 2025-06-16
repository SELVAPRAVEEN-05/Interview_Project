
"use client"
import { GoogleSign, Login, SignIn, SignOut } from "@/component";
export default function LoginPage() {
    return <div className={` flex items-center justify-center bg-[url("https://c0.wallpaperflare.com/preview/198/135/731/cyber-attack-abstract-access.jpg")] bg-cover bg-no-repeat  h-screen`}>
        {/* <SignIn/><GoogleSign /><SignOut/> */}
        <Login/>
    </div>;
}
