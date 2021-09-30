import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./Header";
import NoMatch404 from "./NoMatch404";

const WelcomePage = React.lazy(() => import("./WelcomePage"));
const SampleNestedPage = React.lazy(() => import("./SampleNestedPage"));

export default function Routes() {
  return (
    <Router>
      <Header />
      <React.Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/sample-nested-page/" component={SampleNestedPage} />
          <Route exact path="/" component={WelcomePage} />
          <Route component={NoMatch404} />
        </Switch>
      </React.Suspense>
    </Router>
  );
}
