export const mapboxPlaceClassToAppleType = (placeType: string) => {
    switch (placeType) {
        case "country":
            return "territories.territory.countries";
        case "city":
            return "territories.territory.cities";
        case "state":
            return "territories.territory.states";
        case "village":
            return "territories.territory.cities";
        case "town":
            return "territories.territory.cities";
        case "quarter":
            return "territories.territory.neighborhoods";
        case "suburb":
            return "territories.territory.neighborhoods";
        case "neighbourhood":
            return "territories.territory.neighborhoods";
        case "civil":
            return "transportation.airport";
    }

}