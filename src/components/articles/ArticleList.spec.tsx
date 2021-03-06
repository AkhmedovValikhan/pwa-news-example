import { shallow } from "enzyme";
import * as React from "react";
jest.mock("react-transition-group", () => {
    return {
        CSSTransition: jest.fn((props) => (props.in ? props.children : null)),
    };
});

import { MOCK_NEWS } from "../../__fixtures__/newsItems";
import { Article } from "../../model/News";
import { tickMarcroTask } from "../../utils/DomUtils";
import { ArticleList } from "./ArticleList";
import { ArticleListItem } from "./ArticleListItem";

describe("ArticleList", () => {
    it("renders articles", async () => {
        const wrapper = shallow(<ArticleList articles={MOCK_NEWS} />);
        const articles = wrapper.find(ArticleListItem);
        expect(articles.length).toBe(MOCK_NEWS.length);
    });

    it("renders no articles", async () => {
        const wrapper = shallow(<ArticleList articles={[]} />);
        const articles = wrapper.find(ArticleListItem);
        expect(articles.length).toBe(0);
    });

    it("renders pending articles", async () => {
        let resolve: (result: Article[]) => void;
        const mockAritclesPromise = new Promise<Article[]>((res) => resolve = res);
        const wrapper = shallow(<ArticleList articles={mockAritclesPromise} />);

        let articles = wrapper.find(ArticleListItem);
        // Check all loading items are in loading state
        expect(articles.length).toBe(9);
        expect(articles.everyWhere((ar) => !!ar.prop("loading"))).toBe(true);

        // Emulate api result finished
        resolve!(MOCK_NEWS);
        // give enzyme to apply changes
        await tickMarcroTask();
        wrapper.update();

        articles = wrapper.find(ArticleListItem);
        expect(articles.length).toBe(MOCK_NEWS.length);
        expect(articles.everyWhere((ar) => !!ar.prop("loading"))).toBe(false);
    });
});
