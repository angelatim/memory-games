import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { About } from './components/About';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { Game } from './components/Game';

class AppImpl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: false
    };
  }
  public render() {
    return (
      <BrowserRouter>
        <Grid container>
          <Header />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/game' component={() => <Game/>} />
            <Route path='/about' component={About} />
          </Switch>
        </Grid>
    </BrowserRouter>
    );
  }
}

export const App = hot(module)(AppImpl);
