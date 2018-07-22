import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Admin from './pages/admin'
import Login from './pages/login'
import Home from './pages/home'
import Profile from './pages/profile'
import './App.css'

class App extends Component {
  render() {
    return (
      <div>
        <img src={require('./pages/_shared/img/vibesBg.png')} className="bg" alt="background vibes"/>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/profile" component={Profile} />
        </Switch>
      </div>
    )
  }
}

export default App
