import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
} from 'react-router-dom';
import styled from 'styled-components';
import {
  View,
} from './components/Primitives';
import ApplicationListPage from './ApplicationListPage';
import ApplicationMainPage from './ApplicationMainPage';

const App = () => (
  <Router>
    <Container>
      <NavBar>
        <Link to="/apps">My Apps</Link>
      </NavBar>

      <Switch>
        <Redirect exact from="/" to="/apps" />
        <Route path="/apps/:appId" component={ApplicationMainPage} />
        <Route path="/apps" component={ApplicationListPage} />
      </Switch>
    </Container>
  </Router>
);

export default App;

const Container = styled(View)`
  flex: 1;
`;

const NavBar = styled(View)`
  border-bottom: 1px solid #ccc;
  flex: 0 0 40px;
`;
