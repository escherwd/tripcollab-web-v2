import { contrastingWhiteOrBlack } from "@/app/utils/ui/contrastingWhiteOrBlack";
import {
  BookOpenIcon,
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  MapPinIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/16/solid";
import {
  RiBeerFill,
  RiBusFill,
  RiCapsuleFill,
  RiCommunityFill,
  RiCupFill,
  RiDrinks2Fill,
  RiFlagFill,
  RiGobletFill,
  RiGovernmentFill,
  RiHospitalFill,
  RiHotelBedFill,
  RiMovie2Fill,
  RiParkingFill,
  RiPlaneFill,
  RiRestaurantFill,
  RiSchoolFill,
  RiShipFill,
  RiShoppingBagFill,
  RiShoppingBasket2Fill,
  RiStarFill,
  RiTreeFill,
} from "@remixicon/react";
import { getContrastColor } from "a11y-contrast-color";
import Colorizr from "colorizr";
import {
  MdAccountBalance,
  MdAttractions,
  MdBakeryDining,
  MdBeachAccess,
  MdBook,
  MdBusAlert,
  MdChurch,
  MdCommute,
  MdDirectionsBoat,
  MdDirectionsBus,
  MdDownhillSkiing,
  MdEmojiTransportation,
  MdFlag,
  MdGolfCourse,
  MdHealthAndSafety,
  MdHolidayVillage,
  MdHotel,
  MdLandscape,
  MdLibraryBooks,
  MdLocalAirport,
  MdLocalBar,
  MdLocalCafe,
  MdLocalHospital,
  MdLocalLibrary,
  MdLocalParking,
  MdLocationCity,
  MdLocationOn,
  MdMedicalServices,
  MdMosque,
  MdMovie,
  MdMuseum,
  MdNightlife,
  MdOtherHouses,
  MdPark,
  MdPin,
  MdPinDrop,
  MdRestaurant,
  MdSchool,
  MdShop,
  MdShop2,
  MdShoppingBag,
  MdShoppingBasket,
  MdShopTwo,
  MdSportsBar,
  MdStadium,
  MdStar,
  MdStore,
  MdSubway,
  MdTheaterComedy,
  MdTheaters,
  MdTrain,
  MdTram,
  MdWater,
  MdWineBar,
} from "react-icons/md";
import { PiBridgeFill } from "react-icons/pi";
import { TbBuildingBridge } from "react-icons/tb";
import colors from "tailwindcss/colors";

export class MapIcon {
  categoryId: string;
  icon: React.ReactNode;
  color: string;

  constructor(categoryId: string, icon: React.ReactNode, color: string) {
    this.categoryId = categoryId;
    this.icon = icon;
    this.color = color;
  }
}

export const mapIcons: Record<string, MapIcon> = {
  skiing: new MapIcon("skiing", <MdDownhillSkiing />, colors["green"][600]),
  hotel: new MapIcon("hotel", <MdHotel />, colors["purple"][500]),
  park: new MapIcon("park", <MdPark />, colors["green"][600]),
  beach: new MapIcon("beach", <MdBeachAccess />, colors["green"][600]),
  church: new MapIcon("church", <MdChurch />, colors["pink"][500]),
  mosque: new MapIcon("mosque", <MdMosque />, colors["pink"][500]),
  museum: new MapIcon("museum", <MdMuseum />, colors["pink"][500]),
  grocery_store: new MapIcon(
    "grocery_store",
    <MdShoppingBasket />,
    colors["yellow"][500]
  ),
  drugstore: new MapIcon("drugstore", <RiCapsuleFill />, colors["red"][500]),
  parking_lot: new MapIcon(
    "parking_lot",
    <MdLocalParking />,
    colors["blue"][500]
  ),
  amusement_park: new MapIcon(
    "amusement_park",
    <MdAttractions />,
    colors["pink"][500]
  ),
  nightclub: new MapIcon("nightclub", <MdNightlife />, colors["pink"][500]),
  stadium: new MapIcon("stadium", <MdStadium />, colors["green"][600]),
  train_station: new MapIcon("train_station", <MdTrain />, colors["blue"][500]),
  light_rail_station: new MapIcon(
    "light_rail_station",
    <MdTram />,
    colors["blue"][500]
  ),
  bus_service: new MapIcon(
    "bus_service",
    <MdDirectionsBus />,
    colors["blue"][500]
  ),
  bridge: new MapIcon("bridge", <TbBuildingBridge />, colors["pink"][500]),
  public_transit: new MapIcon(
    "public_transit",
    <MdCommute />,
    colors["blue"][500]
  ),
  airport: new MapIcon("airport", <MdLocalAirport />, colors["blue"][500]),
  bubble_tea_shop: new MapIcon(
    "bubble_tea_shop",
    <RiDrinks2Fill />,
    colors["orange"][500]
  ),
  cafe: new MapIcon("cafe", <MdLocalCafe />, colors["orange"][500]),
  bakery: new MapIcon(
    "bakery",
    <MdBakeryDining className="scale-130" />,
    colors["orange"][500]
  ),
  bar_lounge: new MapIcon("bar_lounge", <MdLocalBar />, colors["orange"][500]),
  bar: new MapIcon("bar", <MdSportsBar />, colors["orange"][500]),
  ferry_service: new MapIcon(
    "ferry_service",
    <MdDirectionsBoat />,
    colors["blue"][500]
  ),
  bookstore: new MapIcon(
    "bookstore",
    <MdLocalLibrary />,
    colors["purple"][500]
  ),
  movie_theater: new MapIcon(
    "movie_theater",
    <MdTheaters />,
    colors["purple"][500]
  ),
  art_center: new MapIcon(
    "art_center",
    <MdTheaterComedy />,
    colors["purple"][500]
  ),
  school: new MapIcon("school", <MdSchool />, colors["amber"][700]),
  government_office: new MapIcon(
    "government_office",
    <MdAccountBalance />,
    colors["gray"][500]
  ),
  cities: new MapIcon("cities", <MdLocationCity />, colors["gray"][500]),
  countries: new MapIcon("countries", <MdFlag />, colors["gray"][500]),
  states: new MapIcon("states", <MdFlag />, colors["gray"][500]),
  neighborhoods: new MapIcon(
    "neighborhoods",
    <MdHolidayVillage />,
    colors["gray"][500]
  ),
  water_feature: new MapIcon("water_feature", <MdWater />, colors["blue"][500]),
  hill: new MapIcon("hill", <MdLandscape />, colors["gray"][500]),
  golf_club: new MapIcon("golf_club", <MdGolfCourse />, colors["green"][600]),
  travel_and_leisure: new MapIcon(
    "travel_and_leisure",
    <MdStar />,
    colors["indigo"][500]
  ),
  shopping: new MapIcon("shopping", <MdShoppingBag />, colors["purple"][500]),
  health_care: new MapIcon(
    "health_care",
    <MdLocalHospital />,
    colors["red"][500]
  ),
  dining: new MapIcon("dining", <MdRestaurant />, colors["orange"][500]),
  territories: new MapIcon("territories", <MdPinDrop />, colors["gray"][500]),
  business: new MapIcon("business", <MdStore />, colors["purple"][500]),
  address: new MapIcon("address", <MdLocationOn />, colors["red"][500]),
  query: new MapIcon(
    "query",
    <MagnifyingGlassIcon className="text-gray-600" />,
    colors["gray"][100]
  ),
};

export const getMapIconFromAppleMapsCategoryId = (categoryId: string) => {
  const appleMapsIconMatches: Record<string, MapIcon> = {
    "travel_and_leisure.travel_accommodation.hotel.resort.ski_resort":
      mapIcons.skiing,
    "travel_and_leisure.travel_accommodation": mapIcons.hotel,
    "travel_and_leisure.park": mapIcons.park,
    "travel_and_leisure.beach": mapIcons.beach,
    "association_or_organization.religious_organization.church":
      mapIcons.church,
    "association_or_organization.religious_organization.mosque":
      mapIcons.mosque,
    "travel_and_leisure.museum": mapIcons.museum,
    "shopping.food_mart.grocery_store": mapIcons.grocery_store,
    "shopping.store.drugstore": mapIcons.drugstore,
    "transportation.parking_lot": mapIcons.parking_lot,
    "travel_and_leisure.amusement_park": mapIcons.amusement_park,
    "travel_and_leisure.nightclub": mapIcons.nightclub,
    "travel_and_leisure.stadium": mapIcons.stadium,
    "transportation.transportation_service.train_station":
      mapIcons.train_station,
    "transportation.transportation_service.light_rail_station":
      mapIcons.light_rail_station,
    "transportation.transportation_service.bus_service": mapIcons.bus_service,
    "transportation.bridge": mapIcons.bridge,
    "transportation.transportation_service.public_transit":
      mapIcons.public_transit,
    "transportation.airport": mapIcons.airport,
    "dining.cafe.bubble_tea_shop": mapIcons.bubble_tea_shop,
    "dining.cafe": mapIcons.cafe,
    "dining.bakery": mapIcons.bakery,
    "dining.bar.lounge": mapIcons.bar_lounge,
    "dining.bar": mapIcons.bar,
    "civil_service.educational_institution.school": mapIcons.school,
    "transportation.transportation_service.ferry_service":
      mapIcons.ferry_service,
    "shopping.store.bookstore": mapIcons.bookstore,
    "travel_and_leisure.movie_theater": mapIcons.movie_theater,
    "travel_and_leisure.arts.art_center": mapIcons.art_center,
    "civil_service.educational_institution": mapIcons.school,
    "civil_service.government_office": mapIcons.government_office,
    "territories.territory.cities": mapIcons.cities,
    "territories.territory.countries": mapIcons.countries,
    "territories.territory.states": mapIcons.states,
    "territories.territory.neighborhoods": mapIcons.neighborhoods,
    "natural_features.water_feature": mapIcons.water_feature,
    "natural_features.physical_feature.hill": mapIcons.hill,
    "natural_features.physical_feature.mountain": mapIcons.hill,
    "natural_features.physical_feature.volcano": mapIcons.hill,
    "travel_and_leisure.golf_club": mapIcons.golf_club,
    travel_and_leisure: mapIcons.travel_and_leisure,
    region: mapIcons.cities, // only returned in apple maps autocomplete
    country: mapIcons.countries, // only returned in apple maps autocomplete
    sub_locality: mapIcons.neighborhoods, // only returned in apple maps autocomplete
    administrative_area: mapIcons.states, // only returned in apple maps autocomplete
    locality: mapIcons.cities,
    shopping: mapIcons.shopping,
    health_care: mapIcons.health_care,
    dining: mapIcons.dining,
    territories: mapIcons.territories,
    business: mapIcons.business,
    address: mapIcons.address,
    transportation: mapIcons.public_transit,
    query: mapIcons.query,
  };
  for (const categoryKey in appleMapsIconMatches) {
    if (categoryId.toLowerCase().startsWith(categoryKey)) {
      return appleMapsIconMatches[categoryKey];
    }
  }
  return mapIcons.address;
};

export default function MapPlaceIcon({
  appleMapsCategoryId,
  tcCategoryId,
  customColor,
  border = false,
}: {
  appleMapsCategoryId?: string;
  tcCategoryId?: string;
  customColor?: string;
  border?: boolean;
}) {
  // First, check by categoryId

  let mapIcon = mapIcons.address;

  if (tcCategoryId) {
    mapIcon = mapIcons[tcCategoryId as keyof typeof mapIcons] ?? mapIcon;
  }

  if (appleMapsCategoryId) {
    mapIcon = getMapIconFromAppleMapsCategoryId(
      appleMapsCategoryId ?? "address"
    );
  }

  const color = new Colorizr(customColor ?? mapIcon.color);

  // Use YIQ formula to determine if icon should be light or dark
  const iconColor = contrastingWhiteOrBlack(color.css);

  // const iconColor = color.luminance > 0.5 ? "#000000" : "#FFFFFF";
  // const contrastingTextColor = getContrastColor()

  return (
    <div
      className={`tc-map-place-icon rounded-full transition-colors duration-300 bg-linear-to-b from-white/25 to-black/5 ${
        border ? "border-2 border-white" : ""
      }`}
      style={{
        backgroundColor: color.css,
        color: iconColor,
        borderColor: `color-mix(in oklab, ${color.css}, 85% white)`,
        ['--tw-gradient-from' as string]: `color-mix(in oklab, ${color.css}, 20% white)`,
        ['--tw-gradient-to' as string]: `color-mix(in oklab, ${color.css}, 5% black)`,
      }}
    >
      {mapIcon.icon}
    </div>
  );
}
