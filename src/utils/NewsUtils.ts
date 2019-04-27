import { Source, Article } from "../model/News";

export const extractCategories = (sources: Source[]) => {
    const categories = sources.map((s) => s.category);
    const categoriesMap = new Set<string>(categories);
    return Array.from(categoriesMap);
};

export const sourcesOfCategory = (sources: Source[], category: string) => {
    return sources.filter((s) => s.category === category);
};

export const getArticleAuthor = (article: Article) => {
    return (!article.author || article.author.startsWith("http")) ? null : article.author;
};
