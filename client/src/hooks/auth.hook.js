import React, {useState, useCallback, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {setUser} from '../redux/actions/user'

const storageName = 'userData'


export const useAuth = () => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null)
  const [ready, setReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login  = useCallback((id, name, email) => {

    localStorage.setItem(storageName, JSON.stringify({
      userId: id,
      userName: name,
      email: email
    }))
    dispatch(setUser({name: name, id: id, email: email}))

  }, [])

  const logout  = useCallback(() => {
    setUserId(null)
    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data) {
      login(data.userId, data.userName, data.email)
      setIsAuthenticated(true)
    }
    setReady(true)
  }, [login])

  return {login, logout, userId, ready, isAuthenticated}
}