import React from 'react';
import ReactDOM from 'react-dom';
import MapExample from './components/HeatMap';
const App = () => {

  console.log('app');
  return (
    <div>
      <MapExample state="Bihar" dataselected="Rice" />
    </div>
  );
}

ReactDOM.render(<App/>,document.getElementById('mapper'));