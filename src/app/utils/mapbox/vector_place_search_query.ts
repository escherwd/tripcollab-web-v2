export const vectorPlaceSearchQuery = (properties: Record<string, any>) => {

    const name = properties.name_en ?? properties.name

    if (properties.type == 'country') {
        return name
    }

    const countriesThatRequireStates = ['US', 'CA', 'AU', 'NZ']

    if (properties.iso_3166_2 && countriesThatRequireStates.includes(properties.iso_3166_2.slice(0, 2))) {
        return `${name}, ${properties.iso_3166_2.slice(3)}, ${properties.iso_3166_2.slice(0, 2)}`
    } else if (properties.iso_3166_1) {
        return `${name}, ${properties.iso_3166_1}`
    } else {
        return name
    }
}