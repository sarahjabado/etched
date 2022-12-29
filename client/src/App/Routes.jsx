import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import history from 'browserHistory';
import Project from 'Project';
import LoginForm from 'Project/Authentication/Login';
import Logout from 'Project/Authentication/Logout';
import PageError from 'shared/components/PageError';

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Redirect exact from="/" to="/project" />
      <Route path="/authenticate" component={LoginForm} />
      <Route path="/logout" component={Logout} />
      <Route path="/project" component={Project} />
      <Route component={PageError} />
    </Switch>
  </Router>
);

export default Routes;
