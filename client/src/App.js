import {Route, Switch, Redirect} from 'react-router-dom'
import React from 'react'


import {AuthContext} from './context/AuthContext'
import Home from './pages/Home'
import ExerciseList from './pages/ExerciseList'
import Workout from './pages/Workout'
import {useAuth} from './hooks/auth.hook'
import AccountPage from './pages/AccountPage'


function App() {
  const {login, logout, userId} = useAuth()
  return (
    <AuthContext.Provider value={{
      login, logout, userId
    }}>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/list" component={ExerciseList}/>
          <Route path="/workout" component={Workout}/>
          <Route path="/account" component={AccountPage}/>
          <Redirect to="/"/>
        </Switch>
      </div>
    </AuthContext.Provider>
  )
}

export default App
