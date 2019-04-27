import * as React from 'react';
import './Button.scss';

export interface ButtonProps {
    onClick: () => void | Promise<void>;
    className?: string;
    theme?: 'primary' | 'secondary' | 'secondary-hollow' | 'default';
}

export class Button extends React.PureComponent<ButtonProps> {
    static defaultProps: Partial<ButtonProps> = {
        theme: 'primary',
    }

    public render() {
        const className = `button button--${this.props.theme} ${this.props.className ? this.props.className : ''}`
        return <div className={className} onClick={this.props.onClick}>
            {this.props.children}
        </div>
    }
}