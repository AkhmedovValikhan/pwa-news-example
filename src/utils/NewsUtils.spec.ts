import { MOCK_SOURCES } from "../__fixtures__/newsItems";
import { extractCategories } from "./NewsUtils";

describe("NewsUtils", () => {
    describe("extractCategories", () => {
        it("should get unique categories from sources", () => {
            const cats = extractCategories(MOCK_SOURCES);
            expect(cats).toHaveLength(3);
            const expectedCategories = ["general", "business", "technology"];
            expect(cats.every((cat, ind) => expectedCategories[ind] === cat)).toBeTruthy();
        });
        it("should handle empty input", () => {
            const cats = extractCategories([]);
            expect(cats).toHaveLength(0);
        });
    });
});
