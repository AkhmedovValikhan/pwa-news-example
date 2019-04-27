import * as React from "react";
import { Article } from "../../model/News";
import { times } from "../../utils/ArrayUtils";
import { isPromiseLike } from "../../utils/DomUtils";
import { ArticleListItem } from "./ArticleListItem";

const SKELETON_COUNT = 9;

export interface ArticleListProps {
    articles?: Article[] | Promise<Article[]>;
}

interface ArticleListState {
    articles: Article[];
    loading: boolean;
    expandedArticle: string | null;
}

export class ArticleList extends React.PureComponent<ArticleListProps, ArticleListState> {
    constructor(props: ArticleListProps) {
        super(props);
        let articles: Article[] = [];
        if (this.props.articles && !isPromiseLike(this.props.articles)) {
            articles = this.props.articles;
        }

        this.state = {
            articles,
            loading: !articles,
            expandedArticle: null,
        };
    }

    public componentWillMount() {
        this.initializeItems();
    }

    public componentDidUpdate(prevProps: ArticleListProps) {
        if (this.props.articles !== prevProps.articles) {
            this.initializeItems();
        }
    }

    public render() {
        return <React.Fragment>
            {this.renderArticles()}
        </React.Fragment>;
    }

    private async initializeItems() {
        if (!this.props.articles) {
            return;
        }
        if (isPromiseLike(this.props.articles)) {
            this.setState({ loading: true });
            const articles = await this.props.articles;
            this.setState({ articles, loading: false });
        } else {
            this.setState({ articles: this.props.articles, loading: false });
        }
    }

    private onExpanded = (article: Article) => {
        const expandedArticle = article.url === this.state.expandedArticle ? null : article.url;
        this.setState({ expandedArticle });
    }

    private renderArticles(): JSX.Element[] {
        if (this.state.loading) {
            return times(SKELETON_COUNT).map((_n, ind) => {
                return <ArticleListItem key={ind} loading={true} />;
            });
        }
        return this.state.articles.map((article) => {
            return <ArticleListItem
                expanded={article.url === this.state.expandedArticle}
                onClick={this.onExpanded}
                key={article.url}
                article={article}
            />;
        });
    }
}
