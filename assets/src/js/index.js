import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render () {
    return (
      <h1>Django + React + Webpack + Babel = Awesome App</h1>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-app'));
