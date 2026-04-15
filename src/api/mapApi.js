import Api from "./base";

class MapApi extends Api {
	getDetails = async (place_id) => {
		return await this.get("/map/details/" + place_id);
	};
	getDetailsNew = async (place_id) => {
		return await this.get("/map/details/new/" + place_id);
	};
	getNearby = async (params) => {
		return await this.get(
			"/map/nearby?lat=" +
				params.lat +
				"&lng=" +
				params.lng +
				(params.rankPreference !== "distance"
					? "&radius=" + params.radius
					: "") +
				(params.type !== "" ? "&type=" + params.type : "") +
				(params.keyword !== "" ? "&keyword=" + params.keyword : "") +
				"&rankby=" +
				params.rankPreference +
				"&location=" +
				params.location
		);
	};
	searchAlongRoute = async (params) => {
		return await this.post("/map/search/along-route", params);
	};
	getNearbyNew = async (params) => {
		return await this.post("/map/nearby/new", params);
	};
	getInside = async (params) => {
		if (params.type === "") return;
		return await this.get(
			"/map/inside?" +
				"type=" +
				params.type +
				"&location=" +
				params.location
		);
	};
	search = async (query) => {
		return await this.get("/map/search?query=" + query);
	};
	searchNew = async (query) => {
		return await this.post("/map/search/new", { query });
	};
	getDistance = async (origin, destination, mode) => {
		return await this.get(
			"/map/distance?origin=" +
				origin +
				"&destination=" +
				destination +
				"&mode=" +
				mode
		);
	};
	getDistanceNew = async (params) => {
		console.log(params);
		return await this.post("/map/distance/new", params);
	};
	getDirections = async (origin, destination, mode) => {
		return await this.get(
			"/map/directions?origin=" +
				origin +
				"&destination=" +
				destination +
				"&mode=" +
				mode
		);
	};
	getDirectionsNew = async (params) => {
		console.log(">", params);
		const response = await this.post("/map/directions/new", params);
		console.log("<", response);
		return response;
	};
}
const mapApi = new MapApi();
export default mapApi;
