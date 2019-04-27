
export type ResultStatus = "ok" | "error";

interface EndpointResult {
    status: ResultStatus;
}
export interface SourcesResult extends EndpointResult {
    sources: Source[];
}
export interface ArticlesEndpointResult extends EndpointResult {
    articles: Article[];
    totalResults: number;
}

export interface Article {
    source: ArticleSource;
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string | null;
    content: string | null;
}

export interface ArticleSource {
    id: string | null;
    name: string;
}

export interface Source {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}

export interface NewsApiQuery {
    apiKey: string;
    sortBy?: keyof Article;
    from?: string;
    q?: string;
    country?: string;
    [key: string]: string | undefined;
}
