import React from "react";
import Helmet from "react-helmet";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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
    this.props.fetchWelcomeMessage();
  }

  render() {
    const { message } = this.props;

    return (
      <div id="welcome">
        <Helmet>
          <title>DRW - Welcome!</title>
        </Helmet>

        <h1>Welcome to our app!</h1>
        <p>
          Now, you may edit the routes on the `routes.js` file and/or edit this
          file to start developing your app :]
        </p>
        {message ? <p>{message}</p> : null}
      </div>
    );
  }
}

const mapStateToProps = ({ welcome }) => ({ message: welcome.message });

const mapDispatchToProps = dispatch => ({
  fetchWelcomeMessage: () => dispatch(fetchWelcomeMessage())
});

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
