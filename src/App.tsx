import { createBrowserHistory } from "history";
import * as React from "react";
import { Route, RouteComponentProps, Router } from "react-router-dom";
import "./App.scss";
import { Header } from "./components/common/Header";
import { HomePage } from "./components/home/HomePage";
interface NewsMatch {
  category: string;
}

class App extends React.Component {
  private _history = createBrowserHistory({});

  public render() {
    return (<div className="App">
      <Router history={this._history}>
        <Route
          path="/:category?"
          render={((props: RouteComponentProps<NewsMatch>) => {
            const { category } = props.match.params;
            return <React.Fragment>
              {this.renderHeader(props.match.params.category)}
              <HomePage history={props.history} selectedCategory={category} />
            </React.Fragment>;
          })}
        />
      </Router >
    </div>);
  }

  private redirectToMain = () => {
    this._history.push("/");
  }

  private renderHeader(cateogry: string) {
    const title = cateogry ? cateogry : "News Application";
    return <Header onBack={cateogry ? this.redirectToMain : undefined} title={title} />;
  }
}

export default App;
