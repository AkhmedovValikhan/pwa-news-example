import * as React from 'react';
import './App.scss';
import { HomePage } from './components/home/HomePage';
import { Header } from './components/common/Header';
import { Route, RouteComponentProps, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
interface NewsMatch {
  category: string;
}

class App extends React.Component {
  private _history = createBrowserHistory({});

  private redirectToMain = () => {
    this._history.push('/');
  }

  private renderHeader(cateogry: string) {
    const title = cateogry ? cateogry : 'News Application';
    return <Header onBack={cateogry ? this.redirectToMain : undefined} title={title} />;
  }

  render() {
    return (
      <Router history={this._history}>
        <Route path='/:category?' render={((props: RouteComponentProps<NewsMatch>) => {
          const { category } = props.match.params;
          return <React.Fragment>
            <div className="App">
              {this.renderHeader(props.match.params.category)}
              <HomePage history={props.history} selectedCategory={category} />
            </div>
          </React.Fragment>
        })}>
        </Route>
      </Router >
    );
  }
}

export default App;
