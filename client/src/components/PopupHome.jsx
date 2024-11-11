import React from 'react'
import {useDispatch} from 'react-redux'
import classNames from 'classnames'


import {useHttp} from '../hooks/http.hook'
import {setUser} from '../redux/actions/user'
import {AuthContext} from '../context/AuthContext'
import Button from './Button'


function PopupHome({onClosePopup, popupVisibility, popupType}) {
  const auth = React.useContext(AuthContext)
  const dispatch = useDispatch()

  const {loading, error, request} = useHttp()

  const [form, setForm] = React.useState({name: '', email: ''})
  const [message, setMessage] = React.useState('')

  const type = popupType === 'reg' ? 'Регистрация' : 'Вход'

  React.useEffect(() => {
    setMessage(error)
  }, [error, message])

  const changeHandler = evt => {
    setForm({...form, [evt.target.name]: evt.target.value})
  }

  const pressKeyHandler = evt => {
    if (evt.key === 'Enter') {
      popupType === 'reg' ? registerHandler() : loginHandler()
    }
  }

  const registerHandler = async () => {
    try {
      console.log('reg form', form)
      const data = await request('/api/auth/register', 'POST', {...form})
      console.log(data)
      dispatch(setUser({name: form.name, email: form.email, id: data.userId}))
      auth.login(data.userId, data.name, form.email)
      onClosePopup()
    } catch (e) {
      setMessage('error', e.message)
    }
  }
  const loginHandler = async () => {

    try {
      console.log('login form', form)
      const data = await request('/api/auth/login', 'POST', {...form})
      console.log(data.user_id, form.name, form.email)
      auth.login(data.user_id, form.name, form.email)
      dispatch(setUser({name: form.name, email: form.email, id: data.user_id}))
      onClosePopup()
    } catch (e) {
      setMessage('error', e.message)
    }
  }

  return (
    <div
      className={classNames(
        'popup-home',
        'pu',
        {'hide': !popupVisibility}
      )}
    >
      <h2 className="popup-title">{type}</h2>
      <div className='inputs'>
        <input
          placeholder="Введи своё имя"
          id="name"
          type="text"
          name="name"
          className="user-name pu"
          maxLength="30"
          autoComplete="off"
          onChange={changeHandler}
          onKeyPress={pressKeyHandler}
        />
        <input
          placeholder="Введи E-mail"
          id="email"
          type="email"
          name="email"
          className="email pu"
          maxLength="30"
          autoComplete="off"
          onChange={changeHandler}
          onKeyPress={pressKeyHandler}
        />
      </div>

      <p className="popup-notification pu">{message}</p>
      <div className="popup-buttons pu">
        <Button
          className="pu"
          height="48"
        >
          <span>Отмена</span>
        </Button>
        <Button
          className="pu"
          height="48"
          onClick={popupType === 'reg' ? registerHandler : loginHandler}
          loading={loading}
        >
          <span className="pu">Готово</span>
        </Button>
      </div>
    </div>
  )
}

export default PopupHome


