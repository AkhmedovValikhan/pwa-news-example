import * as React from 'react';
import './App.scss';
import { HomePage } from './components/home/HomePage';
import { Header } from './components/common/Header';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';

interface NewsMatch {
  category: string;
}

class App extends React.Component {

  private renderHeader(cateogry: string) {
    const title = cateogry ? cateogry : 'News Application';
    return <Header isCategory={!!cateogry} title={title} />;
  }

  render() {
    return (
      <BrowserRouter>
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
      </BrowserRouter >
    );
  }
}

export default App;
