'use server'

import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const serverGetAgencyIconUrl = async (agencyName: string): Promise<string | null> => { 
    // For now, we don't have a backend source for agency icons
    // In the future, this could be a database lookup or an external API call

    console.log("Looking for agency icon for:", agencyName);

    const filename = path.join(
    process.cwd(),
    "data",
    '/logos/transport/' + agencyName.toLowerCase() + '.png'
  ); 

    const file = await stat(filename).catch(() => null);

    if (!file || !file.isFile()) {
        return null;
    }

    const data = await readFile(filename, 'base64')

    return "data:image/png;base64," + data
}