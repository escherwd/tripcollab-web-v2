'use client'

import Colorizr from "colorizr"

export const contrastingWhiteOrBlack = (cssColor: string, threshold: number = 154): string => {
    const color = new Colorizr(cssColor);
    // Use YIQ formula to determine if white or black is more contrasting
    const yiq = (color.red * 299 + color.green * 587 + color.blue * 114) / 1000;
    return yiq >= threshold ? "#000000" : "#FFFFFF";
}