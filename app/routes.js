import React, {Component} from 'react'
import {Router, Route, browserHistory} from 'react-router'

import App from './components/App'
import Home from './components/Home'
import About from './components/About'
import NotFound from './components/NotFound'
import Edit from './components/Edit'
import NewTerm from './components/NewTerm'
import TranslatorPage from './components/TranslatorPage'

import AdminPage from './components/admin'

const Routes = props => {

  function unauthorizedAccess (replace) {
    replace('/not_authorized')
    browserHistory.replace('/not_authorized')
  }

  function checkAuth (nextState, replace, callback) {
    let {auth} = props
    if(auth.loggedIn) {
      callback()
      return
    }
    if(auth.userInfo.promise) {
      auth.userInfo.promise.then(() => {
        if (!auth.loggedIn) {
          unauthorizedAccess(replace)
        }
        callback()
      })
    }
    else {
      unauthorizedAccess(replace)
    }
  }

  return (
    <Router history={browserHistory}>
      <Route component={App}>
        <Route exactly path='/' component={Home} />
        <Route exactly path='/admin' component={AdminPage} />
        <Route exactly path='/about' component={About} />
        <Route exactly path='/edit' component={Edit} onEnter={checkAuth} />
        <Route exactly path='/newTerm' component={NewTerm} onEnter={checkAuth} />
        <Route exactly path='/translator' component={TranslatorPage} />
        <Route exactly path='/not_authorized' component={NotFound} />
        <Route path='*' component={NotFound} />
      </Route>
    </Router>
  )
}

export default Routes
