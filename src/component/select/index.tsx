import { Select, SelectItem } from "@heroui/react";

interface SelectItem {
    key: string;
    label: string;
}
interface SelectComponentProps{
    contents: SelectItem[];
    value: string;
    setValue:(val:string)=>void,
    label?:string
}
export function SelectComponent({ contents, setValue, value, label = "Select crime type" }: SelectComponentProps) {
    return (
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Select
            onChange={(e)=>{
                    setValue(e.target.value)
            }}
                value={value}
            
            classNames={{
                base:"h-10",
                trigger: "min-h-10 py-0 h-10 pt-1",
            }} label={label}>
                {contents.map((content) => (
                    <SelectItem key={content.key}>{content.label}</SelectItem>
                ))}
            </Select>
        </div>
    );
}
