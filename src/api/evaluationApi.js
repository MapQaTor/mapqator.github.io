import Api from "./base";

class EvaluationApi extends Api {
	insertNewResult = async (list) => {
		return await this.post("/evaluation/new", list);
	};
}

const evaluationApi = new EvaluationApi();
export default evaluationApi;
