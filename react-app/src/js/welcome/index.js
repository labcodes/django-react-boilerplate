import React from "react";
import Helmet from "react-helmet";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { fetchWelcomeMessage } from "./actions";

export class Welcome extends React.Component {
  static propTypes = {
    message: PropTypes.string,
    fetchWelcomeMessage: PropTypes.func
  };

  static defaultProps = {
    message: null,
    fetchWelcomeMessage: () => {}
  };

  componentDidMount() {
    const { fetchWelcomeMessage } = this.props;
    fetchWelcomeMessage();
  }

  render() {
    const { message } = this.props;

    return (
      <main className="welcome">
        <Helmet>
          <title>DRW - Welcome!</title>
        </Helmet>

        <h1 className="welcome__title">Welcome to our app!</h1>
        <p>
          Now, you may edit the routes on the `routes.js` file and/or edit this
          file to start developing your app :]
        </p>
        {message ? <p className="welcome__message">{message}</p> : null}
        <p>
          To understand a bit better about routing, take a look at our
          <Link to="/sample-nested-page/"> sample nested page</Link>.
        </p>
      </main>
    );
  }
}

const mapStateToProps = ({ welcome }) => ({ message: welcome.message });

const mapDispatchToProps = dispatch => ({
  fetchWelcomeMessage: () => dispatch(fetchWelcomeMessage())
});

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
