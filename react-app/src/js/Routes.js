import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Welcome from "./welcome";
import SampleNestedPage from "./sample-nested-page";

export default class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/sample-nested-page/" component={SampleNestedPage} />
        <Route exact path="/" component={Welcome} />
      </Router>
    );
  }
}
