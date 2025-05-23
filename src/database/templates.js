const { convertFromSnake } = require("@/services/utils");

const priceMap = {
	PRICE_LEVEL_INEXPENSIVE: "Inexpensive",
	PRICE_LEVEL_MODERATE: "Moderate",
	PRICE_LEVEL_EXPENSIVE: "Expensive",
	PRICE_LEVEL_VERY_EXPENSIVE: "Very Expensive",
};

const businessMap = {
	OPERATIONAL: "Operational",
	CLOSED_TEMPORARILY: "Closed Temporarily",
	CLOSED_PERMANENTLY: "Closed Permanently",
};

export const template = {
	location: (value) => `${value.latitude}, ${value.longitude}`,
	displayName: (value) => value.text,
	shortFormattedAddress: (value) => (value ? value : "N/A"),
	accessibilityOptions: (value) => {
		if (!value) return "N/A";
		const options = [];
		if (value.wheelchairAccessibleEntrance)
			options.push("Wheelchair Accessible Entrance");
		if (value.wheelchairAccessibleParking)
			options.push("Wheelchair Accessible Parking");
		if (value.wheelchairAccessibleRestroom)
			options.push("Wheelchair Accessible Restroom");
		if (value.wheelchairAccessibleSeating)
			options.push("Wheelchair Accessible Seating");
		return options.join(", ") || "N/A";
	},
	businessStatus: (value) => businessMap[value] || "Unspecified",
	googleMapsUri: (value) => (value ? value : "N/A"),
	primaryType: (value) => (value ? convertFromSnake(value) : "Unspecified"),
	internationalPhoneNumber: (value) => value || "N/A",
	nationalPhoneNumber: (value) => value || "N/A",
	priceLevel: (value) => priceMap[value] || "Unspecified",
	rating: (value) => `${value} ratings`,
	regularOpeningHours: (value) => {
		if (!value) return "N/A";
		return Array.isArray(value?.weekdayDescriptions)
			? `${value.weekdayDescriptions.join(", ")}`
			: value.weekdayDescriptions;
	},
	userRatingCount: (value) => `${value}`,
	websiteUri: (value) => (value ? value : "N/A"),
	allowsDogs: (value) => (value ? "Allows Dogs" : "Does not allow Dogs"),
	curbsidePickup: (value) =>
		value ? "Supports Curbside Pickup" : "No Curbside Pickup",
	delivery: (value) => (value ? "Supports Delivery" : "No Delivery"),
	dineIn: (value) => (value ? "Dine In Available" : "Dine In Not Available"),
	// "editorialSummary",
	// "evChargeOptions",
	// "fuelOptions",
	goodForChildren: (value) =>
		value ? "Good for Children" : "Not good for Children",
	goodForGroups: (value) =>
		value ? "Good for Groups" : "Not good for Groups",
	goodForWatchingSports: (value) =>
		value ? "Good for Watching Sports" : "Not good for Watching Sports",
	liveMusic: (value) => (value ? "Live Music" : "No Live Music"),
	menuForChildren: (value) =>
		value ? "Menu for Children Available" : "No Menu for Children",
	// "parkingOptions",
	// "paymentOptions",
	outdoorSeating: (value) =>
		value ? "Outdoor Seating" : "No Outdoor Seating",
	reservable: (value) => (value ? "Reservable" : "Not Reservable"),
	restroom: (value) => (value ? "Restroom available" : "No Restroom"),
	servesBeer: (value) => (value ? "Serves Beer" : "Does not serve Beer"),
	servesBreakfast: (value) =>
		value ? "Serves Breakfast" : "Does not serve Breakfast",
	servesBrunch: (value) =>
		value ? "Serves Brunch" : "Does not serve Brunch",
	servesCocktails: (value) =>
		value ? "Serves Cocktails" : "Does not serve Cocktails",
	servesCoffee: (value) =>
		value ? "Serves Coffee" : "Does not serve Coffee",
	servesDessert: (value) =>
		value ? "Serves Dessert" : "Does not serve Dessert",
	servesDinner: (value) =>
		value ? "Serves Dinner" : "Does not serve Dinner",
	servesLunch: (value) => (value ? "Serves Lunch" : "Does not serve Lunch"),
	servesVegetarianFood: (value) =>
		value ? "Serves Vegetarian Food" : "Does not serve Vegetarian Food",
	servesWine: (value) => (value ? "Serves Wine" : "Does not serve Wine"),
	takeout: (value) => (value ? "Takeout available" : "No Takeout"),
	// "generativeSummary",
	// "areaSummary"
};
