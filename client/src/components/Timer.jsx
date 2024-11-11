import React from 'react'
import {useHistory} from 'react-router-dom'


import tic from '../assets/sound/Sound_tic.mp3'
import countDown from '../assets/sound/count_down_321.wav'
import {useSelector} from 'react-redux'
import {useHttp} from '../hooks/http.hook'


function Timer({isVisible, seconds}) {
  const history = useHistory()
  const {request} = useHttp()
  const userId = useSelector(({user}) => user.id)
  const {catId, exerciseId, name, activeLevel} = useSelector(({exercise}) => exercise)

  let timerInterval = null
  let [timeLeft, setTimeLeft] = React.useState(null)
  let [cls, setCls] = React.useState('timer-background hide')

  const FULL_DASH_ARRAY = 283
  const WARNING_THRESHOLD = seconds / 2
  const ALERT_THRESHOLD = seconds / 4

  const COLOR_CODES = {
    info: {
      color: 'green'
    },
    warning: {
      color: 'orange',
      threshold: WARNING_THRESHOLD
    },
    alert: {
      color: 'red',
      threshold: ALERT_THRESHOLD
    }
  }

  let remainingPathColor = COLOR_CODES.info.color

  function startTimer(sec) {
    soundClick()
    timerInterval = setInterval(() => {
      sec = sec - 1

      setCircleDasharray(sec)
      setRemainingPathColor(sec)

      if (sec % 10 === 0) {
        soundClick()
      }

      if (sec === 3) {
        soundCountDown()
      }


      if (sec === 0) {
        onTimesUp()
      }
      // Обновляем метку оставшегося времени
      setTimeLeft(sec)
    }, 1000)
  }

  function onTimesUp() {
    clearInterval(timerInterval)
    setCls('timer-background hide')
    userId && saveLog()
    history.push('/list')
  }

  function setCircleDasharray(sec) {
    const circleDasharray = `${(
      calculateTimeFraction(sec) * FULL_DASH_ARRAY
    ).toFixed(0)} 283`
    document
      .getElementById('base-timer-path-remaining')
      .setAttribute('stroke-dasharray', circleDasharray)
  }

  function setRemainingPathColor(sec) {
    const {alert, warning, info} = COLOR_CODES
    if (timeLeft <= alert.threshold) {
      document
        .getElementById('base-timer-path-remaining')
        .classList.remove(warning.color)
      document
        .getElementById('base-timer-path-remaining')
        .classList.add(alert.color)
    } else if (timeLeft <= warning.threshold) {
      document
        .getElementById('base-timer-path-remaining')
        .classList.remove(info.color)
      document
        .getElementById('base-timer-path-remaining')
        .classList.add(warning.color)
    }
  }

  function calculateTimeFraction(sec) {
    const rawTimeFraction = sec / seconds
    return rawTimeFraction - (1 / seconds) * (1 - rawTimeFraction)
  }

  function setRemainingPathColor(sec) {
    const {alert, warning, info} = COLOR_CODES
    if (sec <= alert.threshold) {
      document
        .getElementById('base-timer-path-remaining')
        .classList.remove(warning.color)
      document
        .getElementById('base-timer-path-remaining')
        .classList.add(alert.color)
    } else if (sec <= warning.threshold) {
      document
        .getElementById('base-timer-path-remaining')
        .classList.remove(info.color)
      document
        .getElementById('base-timer-path-remaining')
        .classList.add(warning.color)
    }
  }

  function soundClick() {
    var audio = new Audio() // Создаём новый элемент Audio
    audio.src = tic // Указываем путь к звуку "клика"
    audio.autoplay = true // Автоматически запускаем
  }

  function soundCountDown() {
    var audio = new Audio() // Создаём новый элемент Audio
    audio.src = countDown // Указываем путь к звуку "клика"
    audio.autoplay = true // Автоматически запускаем
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60)
    let seconds = time % 60

    if (seconds < 10) {
      seconds = `0${seconds}`
    }
    return `${minutes}:${seconds}`
  }

  React.useEffect(() => {
    setTimeLeft(seconds)
    if (isVisible) {
      setCls('timer-background')
      soundCountDown()
      setTimeout(() => {
        startTimer(seconds)
      }, 3000)
    }
  }, [isVisible])

  const saveLog = async () => {
    try {
      const data = await request('/api/journal/log', 'POST',
        {
          userId: userId,
          catId,
          exId: exerciseId,
          exercise: name,
          curLev: activeLevel,
          sets: 0
        })
      console.log('log', data)
    } catch (e) {
      console.log('error', e.message)
    }
  }

  return (
    <div className={cls}>
      <div className="base-timer">
        <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g className="base-timer__circle">
            <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"/>
            <path
              id="base-timer-path-remaining"
              strokeDasharray="283"
              className={`base-timer__path-remaining ${remainingPathColor}`}
              d="
                  M 50, 50
                  m -45, 0
                  a 45,45 0 1,0 90,0
                  a 45,45 0 1,0 -90,0
                "
            ></path>
          </g>
        </svg>
        <span id="base-timer-label" className="base-timer__label">
          {timeLeft && formatTime(timeLeft)}
        </span>
      </div>
    </div>

  )
}


export default Timer
