import config from "@/config/config";

const mapServices = {
	googleMaps: {
		name: "Google Maps",
		// icon: "🌎",
		image: config.baseUrl+"/images/google-maps.png",
	},
	openStreetMap: {
		name: "OpenStreetMap",
		// icon: "🗺️",
		image: config.baseUrl+"/images/openstreetmap.logo.png",
	},
	mapbox: {
		name: "Mapbox",
		// icon: "🗺️"
		image: config.baseUrl+"/images/mapbox.png",
	},
	tomtom: {
		name: "TomTom",
		// icon: "🚗",
		image: config.baseUrl+"/images/tomtom.png",
	},
	here: {
		name: "HERE",
		// icon: "📍"
		image: config.baseUrl+"/images/here.png",
	},
	azureMaps: {
		name: "Azure Maps",
		// icon: "☁️",
		image: config.baseUrl+"/images/azure-maps.png",
	},
};

export default mapServices;
