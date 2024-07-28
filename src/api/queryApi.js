import Api from "./base";

class QueryApi extends Api {
	getQueries = async (query) => {
		return await this.get("/queries", query);
	};
	getQuery = async (id) => {
		return await this.get(`/queries/${id}`);
	};
	createQuery = async (body) => {
		return await this.post("/queries", body);
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
	updateQueryWithEvaluation = async (id, body) => {
		return await this.put(`/queries/${id}/evaluate`, body);
	};
	deleteQuery = async (id) => {
		return await this.delete(`/queries/${id}`);
	};
	getGPTContext = async (context) => {
		console.log(context);
		return await this.post("/queries/gpt/context", { content: context });
	};
	annotate = async (query_id, human) => {
		return await this.post("/queries/annotate/" + query_id, human);
	};
}

const queryApi = new QueryApi();
export default queryApi;
