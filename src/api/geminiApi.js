import Api from "./base";

class GeminiApi extends Api {
	askGeminiLive = async (prompt) => {
		return await this.post("/gemini/ask", { prompt });
	};
}

const geminiApi = new GeminiApi();
export default geminiApi;
