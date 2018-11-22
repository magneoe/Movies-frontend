import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import MovieDB from './pages/home/MovieDB';
import {Header} from './components/header/Header';
import {logout} from './pages/login/actions';

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

  render() {
    const {user} = this.props;
    return (
      <div className="appStyle">
        <Header/>
        <div className="container">
        <div>{user && user.sessionId ? <Link onClick={this.props.actions.logout} to="">Logout</Link> :<Link to="/loginpage">Login</Link>}</div>
          <MovieDB />
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
      user: state.loginReducer.user,
  }),
  (dispatch) => ({
      actions: bindActionCreators(Object.assign({},
          { logout }), dispatch)
  })
)(App)
