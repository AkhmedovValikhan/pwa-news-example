import * as React from "react";
import { NewsService } from "../../services/NewsService";
import { NewsEntry, Source } from "../../model/News";
import './HomePage.scss';
import { extractCategories, sourcesOfCategory } from "../../utils/NewsUtils";
import { RouteComponentProps } from "react-router";
import { CSSTransition } from 'react-transition-group';
import { Button } from "../common/Button";
import { inject } from "propin";
import { ArticleList } from "../artiecles/ArticleList";

export type HomeProps = Pick<RouteComponentProps, 'history'> & {
    selectedCategory: string | undefined;
}

export interface HomeState {
    articles?: Promise<NewsEntry[]>;
    sources: Source[];
}

export class HomePage extends React.PureComponent<HomeProps, HomeState> {
    @inject() private _newsService: NewsService;

    constructor(props: HomeProps) {
        super(props);

        this.state = {
            sources: [],
        }
    }

    public async componentDidMount() {
        // If category is selected we need to add all sources to query, so we await it.
        if (this.props.selectedCategory) {
            await this.fetchSources();
        } else {
            this.fetchSources();
        }
        this.fetchArticles();
    }

    public componentDidUpdate(prevProps: HomeProps) {
        if (prevProps.selectedCategory !== this.props.selectedCategory) {
            this.fetchArticles();
        }
    }

    private async fetchArticles() {
        let articles: Promise<NewsEntry[]>;
        if (this.props.selectedCategory) {
            const sources = sourcesOfCategory(this.state.sources, this.props.selectedCategory);
            articles = this._newsService.getArticles(sources.map(s => s.id));
        } else {
            articles = this._newsService.getHeadlines();
        }
        this.setState({ articles });
    }

    private async fetchSources() {
        const sources = await this._newsService.getSources();
        this.setState({ sources: sources });
    }

    private onCategoryClick(category: string) {
        this.props.history.push('/' + category);
    }

    private renderCategories(): JSX.Element {
        const categories = extractCategories(this.state.sources);
        const cateogriesEls = categories.map(cat => {
            return <Button key={cat} onClick={() => this.onCategoryClick(cat)}>
                {cat}
            </Button>;
        });
        const shouldShow = !this.props.selectedCategory && !!categories.length;
        return <CSSTransition appear unmountOnExit mountOnEnter in={shouldShow} timeout={350}>
            <div className='categories module'>
                <h3>Categories</h3>
                <div className="categories__container">{cateogriesEls}</div>
            </div>
        </CSSTransition>;
    }

    render() {
        const title = this.props.selectedCategory ? 'Articles' : 'Top Headlines';

        return (
            <div className="container">
                {this.renderCategories()}
                <div className="module">
                    <h3>{title}</h3>
                    <div className="headlines__container">
                        <ArticleList articles={this.state.articles} />
                    </div>
                </div>
            </div >
        );
    }
}
