import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Welcome from "./welcome";

export default class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Welcome} />
      </Router>
    );
  }
}
