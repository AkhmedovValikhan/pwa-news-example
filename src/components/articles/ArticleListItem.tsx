import classNames from "classnames";
import { format } from "date-fns";
import * as React from "react";
import { CSSTransition } from "react-transition-group";
import { Article } from "../../model/News";
import { getWindow } from "../../utils/DomUtils";
import { getArticleAuthor } from "../../utils/NewsUtils";
import { Button } from "../common/Button";
import "./ArticleListItem.scss";
export interface ArticleListItemProps {
    loading?: boolean;
    onClick: (article: Article) => void;
    article: Article;
    expanded?: boolean;
}

export class ArticleListItem extends React.PureComponent<ArticleListItemProps> {
    public static defaultProps: Partial<ArticleListItemProps> = {
        loading: false,
        expanded: false,
    };

    public render() {
        const classes = classNames({
            "article-card": true,
            "article-card--expanded": this.props.expanded,
        });
        return (
            <div className={classes} onClick={this.onClick}>
                {this.props.loading ? this.renderSkeleton() : this.renderCardContent()}
            </div>
        );
    }

    private openLink = () => {
        getWindow().open(this.props.article.url, "__blank");
    }

    private renderCardHeader(article: Article) {
        const { urlToImage } = article;
        const styles: React.CSSProperties = {
            backgroundImage: urlToImage ? `url(${urlToImage}` : "",
        };
        return <div className="article-card__header" style={styles} />;
    }

    private renderExpandedContent(article: Article): JSX.Element {
        const author = getArticleAuthor(article);

        return <CSSTransition mountOnEnter={true} unmountOnExit={true} in={this.props.expanded} timeout={300}>
            <div className="article-card__extended-content">
                <p className="article-card__description">{this.props.article.description}</p>
                <div className="article-card__extended-content-footer">
                    <p className="article-card__authort">{author}</p>
                    <Button theme="primary" onClick={this.openLink}>Read Article</Button>
                </div>
            </div>
        </CSSTransition>;
    }

    private renderCardContent() {
        const { article } = this.props;
        const date = article.publishedAt ? format(article.publishedAt, "MMMM Do") : null;
        return <React.Fragment>
            {this.renderCardHeader(article)}
            <div className="article-card__body">
                <div className="article-card__body-header">
                    <div className="article-card__meta-info">
                        {date && <p className="article-card__date">{date}</p>}
                        <p className="article-card__source">{article.source.name}</p>
                    </div>
                    <h4 className="article-card__title">{article.title}</h4>
                </div>
                {this.renderExpandedContent(article)}
            </div>
        </React.Fragment>;
    }

    private renderSkeleton() {
        return <React.Fragment>
            <div className="article-card__header-skeleton" />
            <div className="article-card__body">
                <div className="article-card__body-skeleton" />
            </div>
        </React.Fragment>;
    }

    private onClick = () => this.props.onClick && this.props.onClick(this.props.article);
}
