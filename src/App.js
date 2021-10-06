import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'dva/router';
import dynamic from "dva/dynamic";
import {LiveHLSPlayer} from 'screens/Watch/live_test'
import {
  // General
  NotFound404,
  // Maintenance,
  SignIn,
  Watch,
} from './screens';

import './App.css';
import { env } from './utils';

class App extends React.Component {
  componentDidMount() {
    
  }

  render() {    
    // return <Maintenance />
    return (
      // <AppInsightsProvider>
      <Switch>
        <Route path="/404" component={NotFound404} />
        <Route path="/liveplayer" component={LiveHLSPlayer} />
        <Route component={NotFound404} />
        {/* <Route exact path="/docs/component-api/:type" component={ComponentAPI} /> */}
      </Switch>
      // </AppInsightsProvider>
    );
  }
}

export default withRouter(App);
