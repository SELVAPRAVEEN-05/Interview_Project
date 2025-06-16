"use client";
import React, { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { ButtonComponent } from "../button";
import { Button, Image, Input } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="text-white border-3 w-[30%] h-[80%] rounded-xl p-8 bg-transparent blure-md backdrop-blur-[3px] border-[#0348d3]">
      
      <div className="flex flex-col gap-7">
      <div className="flex items-center gap-1">
          <p className="text-4xl ">CRIME</p>
          <p
            style={{
              textShadow:
                "-1px -2px 3px black, 1px -1px 3px black, -1px 1px 3px black, 1px 1px 3px black",
            }}
            className="text-6xl text-red-700 font-bold drop-shadow-2xl"
          >
            X
          </p>
        </div>
        {/* <p className="text-4xl font-bold font-mono ">Login</p> */}
        <div className="flex flex-col justify-start pt-6 h-full  ">
          <div className="py-4 flex flex-col    gap-10">
            <Input
              value={email}
              onValueChange={(val) => setEmail(val)}
              isRequired
              placeholder="Enter Email"
              size="lg"
            />
            <Input
              value={password}
              onValueChange={(val) => setPassword(val)}
              isRequired
              placeholder="Enter Password"
              type="Password"
              size="lg"
            />
            <div className="flex justify-center"> 
            <Button className="bg-[#0348d3] text-lg font-bold px-20">Login</Button>
            </div>
            {/* <ButtonComponent
              isIcon={false}
            /> */}
            {/* <ButtonComponent
            isIcon={false}
            buttonText="Done"
            ButtonVariant="bordered"
            bgColor="bg-primary"
            baseClassName="bg-primary border-none"
            textClassName="text-background font-semibold text-[16px]"
            
          /> */}
          </div>
          <div className=" flex flex-col items-center">
            <p className="text-xl pb-7 pt-2 text-black font-bold">OR</p>
            <ButtonComponent
              buttonIcon={<FcGoogle size={24} />}
              handleOnClick={() => signIn("google", { redirectTo: "/" })}
              buttonText="Signin with google"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
