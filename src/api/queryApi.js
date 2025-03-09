import Api from "./base";

class QueryApi extends Api {
	getQueries = async () => {
		return await this.get("/queries");
	};
	getNewQueries = async () => {
		console.log("getNewQueries");
		return await this.get("/queries/new");
	};
	getQuery = async (id) => {
		return await this.get(`/queries/${id}`);
	};
	getNewQuery = async (id) => {
		return await this.get(`/queries/new/${id}`);
	};
	createQuery = async (body) => {
		return await this.post("/queries", body);
	};
	createNewQuery = async (body) => {
		return await this.post("/queries/new", body);
	};
	createQueryWithEvaluation = async (body) => {
		return await this.post("/queries/evaluate", body);
	};
	updateCategory = async (id, category) => {
		return await this.put(`/queries/${id}/category`, { category });
	};
	updateQuery = async (id, body) => {
		return await this.put(`/queries/${id}`, body);
	};
	updateNewQuery = async (id, body) => {
		return await this.put(`/queries/new/${id}`, body);
	};
	updateQueryWithEvaluation = async (id, body) => {
		return await this.put(`/queries/${id}/evaluate`, body);
	};
	deleteQuery = async (id) => {
		return await this.delete(`/queries/${id}`);
	};
	deleteNewQuery = async (id) => {
		return await this.delete(`/queries/new/${id}`);
	};
	getGPTContext = async (context) => {
		console.log(context);
		return await this.post("/queries/gpt/context", { content: context });
	};
	annotate = async (query_id, human) => {
		return await this.post("/queries/annotate/" + query_id, human);
	};
	submitForEvaluation = async (query_id, context) => {
		return await this.post("/queries/" + query_id + "/evaluation", {
			context,
		});
	};
	getModels = async () => {
		return await this.get("/queries/models");
	};
}

const queryApi = new QueryApi();
export default queryApi;
