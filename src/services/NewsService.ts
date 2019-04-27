import { stringify } from "querystring";
import { ArticlesEndpointResult, NewsApiQuery, SourcesResult } from "../model/News";

const HARDCODED_COUNTRY = "gb";

export class NewsService {

    constructor(
        private readonly _apiUrl: string,
        private readonly _apiKey: string) {

    }

    public async getArticles(sources: string[]) {
        const query: NewsApiQuery = {
            apiKey: this._apiKey,
            sources: sources.join(","),
        };
        const result = await fetch(`${this._apiUrl}/everything?${stringify(query)}`, {});
        const parsedRes: ArticlesEndpointResult = await result.json();
        return parsedRes.articles;
    }

    public async getHeadlines() {
        const query: NewsApiQuery = {
            apiKey: this._apiKey,
            country: HARDCODED_COUNTRY,
        };
        const result = await fetch(`${this._apiUrl}/top-headlines?${stringify(query)}`);
        const parsedRes: ArticlesEndpointResult = await result.json();
        return parsedRes.articles;
    }

    public async getSources() {
        const query: NewsApiQuery = {
            apiKey: this._apiKey,
        };
        const result = await fetch(`${this._apiUrl}/sources?${stringify(query)}`, {});
        const parsedRes: SourcesResult = await result.json();
        return parsedRes.sources;
    }
}
