import { EllipsisHorizontalIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";
import PanelIconButton from "./panel_icon_button";
import { contrastingWhiteOrBlack } from "@/app/utils/ui/contrastingWhiteOrBlack";
import _ from "lodash";
import twcolors from 'tailwindcss/colors'

export default function ColorInput({ initialColor, onColorChange }: { initialColor?: string, onColorChange?: (color: string | null) => void }) {


    
    // red, green, blue, yellow, orange
    // TODO: convert to tailwind colors
    const colors = [twcolors.red[500], twcolors.green[500], twcolors.blue[500], twcolors.yellow[400], twcolors.pink[500]];
    
    const [color, setColor] = useState<string | null>(initialColor ?? null);

    const initialOtherColor = initialColor && !colors.includes(initialColor) ? initialColor : '#7c3aed';

    const [contrastingOtherColor, setContrastingOtherColor] = useState<string>("#fff");


    const isOtherColorSelected = color && !colors.includes(color);

    const onColorSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    }

    const debouncedOtherColorUpdate = _.debounce((newColor: string) => {
        setContrastingOtherColor(contrastingWhiteOrBlack(newColor));
        if (onColorChange) {
            onColorChange(newColor);
        }
    }, 100);


    // let hasMounted = false;

    useEffect(() => {
        if (isOtherColorSelected && color) {
            debouncedOtherColorUpdate(color);
        }
    }, [color, onColorChange, debouncedOtherColorUpdate, isOtherColorSelected]);

    const updateColor = (color: string | null) => {
        setColor(color);
        if (onColorChange) {
            onColorChange(color);
        }
    };

    useEffect(() => {
        console.log("initialColor changed", initialColor);
    }, [initialColor])

    return (
        <div className="flex gap-1 justify-start items-center">
            {/* <div className={`size-8 cursor-pointer rounded-full border-2 border-gray-100 overflow-clip ${!color ? 'ring-2 ring-black' : ''}`}
                onClick={() => setColor(null)}
            >
                <div className="bg-gradient-to-bl from-gray-50  to-gray-400 size-full">

                </div>
            </div> */}
            {colors.map(c => (
                <div
                    key={c}
                    className={`size-8 cursor-pointer rounded-full border-2 border-gray-100 ${c === color ? 'ring-2 ring-black' : ''}`}
                    style={{ backgroundColor: c.toLowerCase() }}
                    onClick={() => updateColor(c)}
                />
            ))}
            <div className={`relative cursor-pointer border-2 border-gray-100 rounded-full size-8 overflow-hidden ${isOtherColorSelected ? 'ring-2 ring-black' : ''}`}>
                <input type="color" defaultValue={initialOtherColor}  className="size-12 absolute -inset-2 cursor-pointer" onChange={onColorSelect} />
                <EllipsisHorizontalIcon className="size-4 absolute inset-1.5 pointer-events-none cursor-pointer transition-colors" style={{ color: contrastingOtherColor }} />
            </div>
            <div className="flex-grow" />
            <PanelIconButton icon={<XMarkIcon />} onClick={() => updateColor(null)} />
        </div>
    );
}