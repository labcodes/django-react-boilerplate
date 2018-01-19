import React from 'react';

import Title from '../../components/Title';


class App extends React.Component {
  render () {
    const text = 'Django + React + Webpack + Babel = Awesome App';
    return (
      <Title text={text} />
    )
  }
}

export default App;
