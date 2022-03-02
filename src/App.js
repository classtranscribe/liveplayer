import React from 'react';
import { withRouter, Route, Switch } from 'dva/router';
import { LiveHLSPlayer } from 'screens/Watch/live_test'
import { NotFound404, TTSExample } from './screens';

import './App.css';

class App extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
      <Switch>
        <Route path="/404" component={NotFound404} />
        <Route path="/liveplayer" component={LiveHLSPlayer} />
        <Route path="/tts" component={TTSExample} />
        
        <Route component={LiveHLSPlayer} />
      </Switch>
    );
  }
}

export default withRouter(App);
