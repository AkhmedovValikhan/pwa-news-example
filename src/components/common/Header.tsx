import * as React from 'react';
import './Header.scss';
import { CSSTransition } from 'react-transition-group';
import { withRouter, RouteComponentProps } from 'react-router';
import { Button } from './Button';
import classNames from 'classnames';

export interface HeaderProps extends RouteComponentProps {
    title: string;
    isCategory: boolean;
}

class HeaderComponent extends React.PureComponent<HeaderProps> {
    private onBackClick = () => {
        this.props.history.push('/');
    }

    private renderBackLink() {
        return <CSSTransition unmountOnExit in={this.props.isCategory} timeout={350}>
            <Button theme='secondary' className='header__button' onClick={this.onBackClick}>Back</Button>
        </CSSTransition>
    }

    public render() {
        const className = classNames({
            'header': true,
            'header--category': this.props.isCategory
        })
        return <header className={className}>
            <div className="container header__container">
                {this.renderBackLink()}
                <h2 className="header__title">{this.props.title}</h2>
            </div>
        </header>
    }
}

const Header = withRouter(HeaderComponent);
export { Header }