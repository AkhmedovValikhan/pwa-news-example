import * as React from 'react';
import './Header.scss';
import { CSSTransition } from 'react-transition-group';
import { Button } from './Button';
import classNames from 'classnames';

export interface HeaderProps {
    title: string;
    onBack?: () => void;
}

export class Header extends React.PureComponent<HeaderProps> {
    private renderBackLink() {
        return <CSSTransition unmountOnExit in={!!this.props.onBack} timeout={350}>
            <Button theme='secondary' className='header__button' onClick={this.props.onBack}>Back</Button>
        </CSSTransition>
    }

    public render() {
        const className = classNames({
            'header': true,
            'header--with-back': this.props.onBack
        })
        return <header className={className}>
            <div className="container header__container">
                {this.renderBackLink()}
                <h2 className="header__title">{this.props.title}</h2>
            </div>
        </header>
    }
}
