import React from "react"
import { ButtonComponent } from "../button";
import { cn } from "@heroui/react";

interface ComonPopupProp{
    icon?:React.ReactNode;
    bodyContent?:React.ReactNode;
    button1Text?:string;
    button2Text?:string;
    Button1Variant?:"flat" | "solid" | "bordered" | "light" | "faded" | "shadow" | "ghost" | undefined;
    Button2Variant?:"flat" | "solid" | "bordered" | "light" | "faded" | "shadow" | "ghost" | undefined;
    Button1BaseClassName?:string;
    Button2BaseClassName?:string;
    Button1textClassName?:string;
    Button2textClassName?:string;
    button1Bgcolor?:string;
    button2Bgcolor?:string;
    onButton1Click?:()=>void;
    onButton2Click?:()=>void;

}

export const ComonPopup = ({
    icon,
    bodyContent,
    button1Text,
    button2Text,
    Button1Variant ="solid",
    Button2Variant ="solid",
    Button1BaseClassName,
    Button2BaseClassName,
    Button1textClassName,
    Button2textClassName,
    button1Bgcolor="bg-primary",
    button2Bgcolor="bg-primary" ,
    onButton1Click=()=>false,
    onButton2Click=()=>false,
}:ComonPopupProp) => {
  return (
    <div className="flex flex-col gap-4 p-6">
        {icon}
        {bodyContent}
        <div className="flex justify-between pt-4">
            <ButtonComponent
                isIcon={false}
                buttonText={button1Text}
                ButtonVariant={Button1Variant}
                bgColor={button1Bgcolor}
                baseClassName={cn("bg-primary",Button1BaseClassName)}
                textClassName={cn("text-background font-semibold text-[16px]",Button1textClassName)}
                handleOnClick={onButton1Click}
            />
            <ButtonComponent
                isIcon={false}
                buttonText={button2Text}
                ButtonVariant={Button2Variant}
                bgColor={button2Bgcolor}
                baseClassName={cn("bg-primary border-none",Button2BaseClassName)}
                textClassName={cn("text-background font-semibold text-[16px]",Button2textClassName)}
                handleOnClick={onButton2Click}
            />
        </div>
    </div>
  )
}