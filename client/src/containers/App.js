import React, { Component } from 'react';
// Containers
import Router from './Router';
// Components
import Navbar from '../components/layouts/Navbar';
// Style
import '../assets/App.css';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <Router />
      </React.Fragment>
    );
  }
}

export default App;