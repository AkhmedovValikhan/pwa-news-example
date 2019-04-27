import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
jest.mock("react-transition-group", () => {
    return {
        CSSTransition: jest.fn((props) => (props.in ? props.children : null)),
    };
});

import { injector } from "propin";
import { MOCK_NEWS, MOCK_SOURCES } from "../../__fixtures__/newsItems";
import { NewsService } from "../../services/NewsService";
import { Button } from "../common/Button";
import { HomePage, HomeProps } from "./HomePage";

const mockHistory: HomeProps["history"] = {
    // tslint:disable-next-line:no-empty
    push: () => { },
} as any;

describe("HomePage", () => {
    let headlinesCalled = 0;
    let articlesCalled = 0;
    let sourcesCalled = 0;

    beforeEach(() => {
        headlinesCalled = 0;
        articlesCalled = 0;
        sourcesCalled = 0;
        injector.clean();
        injector.bind(NewsService).toInstance({
            getHeadlines: () => { ++headlinesCalled; return Promise.resolve(MOCK_NEWS); },
            getArticles: () => { ++articlesCalled; return Promise.resolve(MOCK_NEWS); },

            getSources: () => { ++sourcesCalled; return Promise.resolve(MOCK_SOURCES); },
        } as Partial<NewsService> as NewsService);
    });

    it("renders headlines", async () => {
        const wrapper = mount(<HomePage history={mockHistory} selectedCategory={undefined} />);
        expect(wrapper.exists());
        await Promise.resolve();
        wrapper.update();

        await Promise.resolve();
        wrapper.update();

        ensureCategories(wrapper, 3);
        expect(headlinesCalled).toBe(1);
        expect(sourcesCalled).toBe(1);
    });

    it("renders articles if category selected", async () => {
        const wrapper = mount(<HomePage history={mockHistory} selectedCategory={"general"} />);
        expect(wrapper.exists());
        await new Promise((res) => setTimeout(() => res(), 100));
        wrapper.update();

        ensureCategories(wrapper.find(".categories"), 0);
        expect(articlesCalled).toBe(1);
        expect(sourcesCalled).toBe(1);
        expect(headlinesCalled).toBe(0);
    });

    /**
     * TODO: Test negative cases, 0 results, api error.
     */
});

const ensureCategories = (wrapper: ReactWrapper, count: number) => {
    expect(wrapper.find(Button).length).toBe(count);
};
