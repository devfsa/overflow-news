import React from 'react'
import './App.css'
import Posts from './containers/Posts'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => (
  <Router>
      <Switch>
        <Route exact path="/" component={Posts} />
        <Route exact path="/posts/:page" component={Posts} />
      </Switch>
  </Router>
);
export default App
