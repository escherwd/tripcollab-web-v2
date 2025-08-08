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
import {
  MdAttractions,
  MdBakeryDining,
  MdBeachAccess,
  MdChurch,
  MdCommute,
  MdDownhillSkiing,
  MdEmojiTransportation,
  MdGolfCourse,
  MdHealthAndSafety,
  MdLandscape,
  MdLocationCity,
  MdMedicalServices,
  MdMosque,
  MdMuseum,
  MdNightlife,
  MdSchool,
  MdStadium,
  MdSubway,
  MdTheaterComedy,
  MdTrain,
  MdTram,
  MdWater,
} from "react-icons/md";
import { PiBridgeFill } from "react-icons/pi";

export default function MapPlaceIcon({
  categoryId,
  type,
}: {
  categoryId?: string;
  type: string;
}) {
  // First, check by categoryId

   if (categoryId?.startsWith("travel_and_leisure.travel_accommodation.hotel.resort.ski_resort")) {
    return (
      <div className="tc-map-place-icon bg-green-600">
        <MdDownhillSkiing className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("travel_and_leisure.travel_accommodation")) {
    return (
      <div className="tc-map-place-icon bg-purple-500">
        <RiHotelBedFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("travel_and_leisure.park")) {
    return (
      <div className="tc-map-place-icon bg-green-600">
        <RiTreeFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("travel_and_leisure.beach")) {
    return (
      <div className="tc-map-place-icon bg-green-600">
        <MdBeachAccess className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("association_or_organization.religious_organization.church")) {
    return (
      <div className="tc-map-place-icon bg-pink-500">
        <MdChurch className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("association_or_organization.religious_organization.mosque")) {
    return (
      <div className="tc-map-place-icon bg-pink-500">
        <MdMosque className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("travel_and_leisure.museum")) {
    return (
      <div className="tc-map-place-icon bg-pink-500">
        <MdMuseum size={16} className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("shopping.food_mart.grocery_store")) {
    return (
      <div className="tc-map-place-icon bg-yellow-500">
        <RiShoppingBasket2Fill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("shopping.store.drugstore")) {
    return (
      <div className="tc-map-place-icon bg-red-500">
        <RiCapsuleFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("transportation.parking_lot")) {
    return (
      <div className="tc-map-place-icon bg-blue-500">
        <RiParkingFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("travel_and_leisure.amusement_park")) {
    return (
      <div className="tc-map-place-icon bg-pink-500">
        <MdAttractions size={16} className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("travel_and_leisure.nightclub")) {
    return (
      <div className="tc-map-place-icon bg-pink-500">
        <MdNightlife className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("travel_and_leisure.stadium")) {
    return (
      <div className="tc-map-place-icon bg-green-600">
        <MdStadium size={16} className="text-white" />
      </div>
    );
  } else if (
    categoryId?.startsWith(
      "transportation.transportation_service.train_station"
    )
  ) {
    return (
      <div className="tc-map-place-icon bg-blue-500">
        <MdTrain size={16} className="text-white" />
      </div>
    );
  } else if (
    categoryId?.startsWith(
      "transportation.transportation_service.light_rail_station"
    )
  ) {
    return (
      <div className="tc-map-place-icon bg-blue-500">
        <MdTram size={16} className="text-white" />
      </div>
    );
  } else if (
    categoryId?.startsWith("transportation.transportation_service.bus_service")
  ) {
    return (
      <div className="tc-map-place-icon bg-blue-500">
        <RiBusFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("transportation.bridge")) {
    return (
      <div className="tc-map-place-icon bg-gray-500">
        <PiBridgeFill className="text-white !size-4.5" />
      </div>
    );
  } else if (
    categoryId?.startsWith(
      "transportation.transportation_service.public_transit"
    )
  ) {
    return (
      <div className="tc-map-place-icon bg-blue-500">
        <MdCommute size={16} className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("transportation.airport")) {
    return (
      <div className="tc-map-place-icon bg-blue-500">
        <RiPlaneFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("dining.cafe.bubble_tea_shop")) {
    return (
      <div className="tc-map-place-icon bg-orange-500">
        <RiDrinks2Fill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("dining.cafe")) {
    return (
      <div className="tc-map-place-icon bg-orange-500">
        <RiCupFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("dining.bakery")) {
    return (
      <div className="tc-map-place-icon bg-orange-500">
        <MdBakeryDining className="text-white !size-5" />
      </div>
    );
  } else if (
    categoryId?.startsWith("dining.bar.lounge") ||
    categoryId?.startsWith("dining.bar.wine_bar")
  ) {
    return (
      <div className="tc-map-place-icon bg-orange-500">
        <RiGobletFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("dining.bar")) {
    return (
      <div className="tc-map-place-icon bg-orange-500">
        <RiBeerFill className="text-white" />
      </div>
    );
  } else if (
    categoryId?.startsWith("civil_service.educational_institution.school")
  ) {
    return (
      <div className="tc-map-place-icon bg-amber-700">
        <RiSchoolFill className="text-white" />
      </div>
    );
  } else if (
    categoryId?.startsWith(
      "transportation.transportation_service.ferry_service"
    )
  ) {
    return (
      <div className="tc-map-place-icon bg-blue-500">
        <RiShipFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("shopping.store.bookstore")) {
    return (
      <div className="tc-map-place-icon bg-purple-500">
        <BookOpenIcon className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("travel_and_leisure.movie_theater")) {
    return (
      <div className="tc-map-place-icon bg-purple-500">
        <RiMovie2Fill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("travel_and_leisure.arts.art_center")) {
    return (
      <div className="tc-map-place-icon bg-purple-500">
        <MdTheaterComedy className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("civil_service.educational_institution")) {
    return (
      <div className="tc-map-place-icon bg-amber-700">
        <MdSchool size={16} className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("civil_service.government_office")) {
    return (
      <div className="tc-map-place-icon bg-gray-500">
        <RiGovernmentFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("territories.territory.cities")) {
    return (
      <div className="tc-map-place-icon bg-gray-500">
        <MdLocationCity className="text-white" />
      </div>
    );
  } else if (
    categoryId?.startsWith("territories.territory.countries") ||
    categoryId?.startsWith("territories.territory.states")
  ) {
    return (
      <div className="tc-map-place-icon bg-gray-500">
        <RiFlagFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("territories.territory.neighborhoods")) {
    return (
      <div className="tc-map-place-icon bg-gray-500">
        <RiCommunityFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("natural_features.water_feature")) {
    return (
      <div className="tc-map-place-icon bg-blue-500">
        <MdWater className="text-white !size-4.5" />
      </div>
    );
  } else if (
    categoryId?.startsWith("natural_features.physical_feature.hill") ||
    categoryId?.startsWith("natural_features.physical_feature.mountain") ||
    categoryId?.startsWith("natural_features.physical_feature.volcano")
  ) {
    return (
      <div className="tc-map-place-icon bg-gray-500">
        <MdLandscape className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("travel_and_leisure.golf_club")) {
    return (
      <div className="tc-map-place-icon bg-green-600">
        <MdGolfCourse className="text-white" />
      </div>
    );
  }

  // Most basic categoryIds
  if (categoryId?.startsWith("travel_and_leisure")) {
    return (
      <div className="tc-map-place-icon bg-indigo-500">
        <RiStarFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("shopping")) {
    return (
      <div className="tc-map-place-icon bg-purple-500">
        <RiShoppingBagFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("health_care")) {
    return (
      <div className="tc-map-place-icon bg-red-500">
        <RiHospitalFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("dining")) {
    return (
      <div className="tc-map-place-icon bg-orange-500">
        <RiRestaurantFill className="text-white" />
      </div>
    );
  } else if (categoryId?.startsWith("territories")) {
    return (
      <div className="tc-map-place-icon bg-gray-500">
        <MapPinIcon className="text-white" />
      </div>
    );
  }

  // Fallbacks for general types

  if (type === "BUSINESS") {
    return (
      <div className="tc-map-place-icon bg-purple-500">
        <BuildingOffice2Icon className="text-white" />
      </div>
    );
  } else if (type === "ADDRESS") {
    return (
      <div className="tc-map-place-icon bg-red-500">
        <MapPinIcon className="text-white" />
      </div>
    );
  } else if (type === "QUERY") {
    return (
      <div className="tc-map-place-icon bg-gray-100">
        <MagnifyingGlassIcon className="text-gray-400" />
      </div>
    );
  } else {
    return (
      <div className="tc-map-place-icon bg-gray-100">
        <QuestionMarkCircleIcon className="text-gray-400" />
      </div>
    );
  }
}
