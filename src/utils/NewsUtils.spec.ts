import { extractCategories } from "./NewsUtils";
import { MOCK_SOURCES } from "../__fixtures__/newsItems";

describe('NewsUtils', () => {
    describe('extractCategories', () => {
        it('should get unique categories from sources', () => {
            const cats = extractCategories(MOCK_SOURCES);
            expect(cats).toHaveLength(3);
            const expectedCategories = ['general', 'business', 'technology'];
            expect(cats.every((cat, ind) => expectedCategories[ind] === cat )).toBeTruthy();
        })
        it('should handle empty input', () => {
            let cats = extractCategories([]);
            expect(cats).toHaveLength(0);
        })
    });
})