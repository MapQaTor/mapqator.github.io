import Api from "./base";

class MapsApi extends Api {
	constructor() {
		if (new.target === MapsApi) {
			throw new TypeError("Cannot construct MapsApi instances directly");
		}
		super();
	}
	// Abstract methods
	textSearch() {
		throw new Error("Method 'textSearch()' must be implemented.");
	}

	placeDetails() {
		throw new Error("Method 'placeDetails()' must be implemented.");
	}

	nearbySearch() {
		throw new Error("Method 'nearbySearch()' must be implemented.");
	}

	computeRoutes() {
		throw new Error("Method 'computeRoutes()' must be implemented.");
	}

	searchAlongRoute() {
		throw new Error("Method 'searchAlongRoute()' must be implemented.");
	}
}

export default MapsApi;
