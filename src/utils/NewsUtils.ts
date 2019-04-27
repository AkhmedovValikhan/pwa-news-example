import { Source } from "../model/News";

export const extractCategories = (sources: Source[]) => {
    const categories = sources.map((s) => s.category);
    const categoriesMap = new Set<string>(categories);
    return Array.from(categoriesMap);
};

export const sourcesOfCategory = (sources: Source[], category: string) => {
    return sources.filter((s) => s.category === category);
};
