import React from 'react'
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'

import logoPng from '../assets/img/logo.png'
import spinner from '../assets/img/spinner.gif'
import empty from '../assets/img/empty.png'
import Item from '../components/Item'
import Button from '../components/Button'
import Timer from '../components/Timer'
import { Link } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { setExerciseData, setLevel } from '../redux/actions/exercise'

function Workout() {
  const history = useHistory()
  const { request } = useHttp()
  const dispatch = useDispatch()

  // Получаем данные из Redux
  const userId = useSelector(({ user }) => user.id)
  const { catId, exerciseId, activeLevel, isLoaded } = useSelector(({ exercise }) => exercise)
  const { name, category, level1, level2, level3, description, animUri } = useSelector(({ exercise }) => exercise)
  
  // Локальные состояния
  const [containerHeight, setContainerHeight] = React.useState('100vh')
  const [levels, setLevels] = React.useState([
    { name: 'Начальный уровень', sets: [] },
    { name: 'Продвинутый уровень', sets: [] },
    { name: 'Мастер', sets: [] }
  ]);
  const [curReps, setCurReps] = React.useState(null)
  const [curSet, setCurSet] = React.useState(0)
  const [isTimerVis, setTimerVis] = React.useState(false)
  const [areLevelsLoaded, setAreLevelsLoaded] = React.useState(false);

  // Дополнительные данные из состояния
  const isExerciseLoaded = useSelector(({ exercise }) => exercise.isLoaded)
  const isUserLoaded = useSelector(({ user }) => user.isLoaded)


  // Установка уровней на основе новых данных level1, level2, level3
  React.useEffect(() => {
    // Проверяем, что данные уровня действительно загружены и не пустые
    if ((level1 && level1.length > 0) || (level2 && level2.length > 0) || (level3 && level3.length > 0)) {
      setLevels([
        { name: 'Начальный уровень', sets: level1.length ? level1 : [] },
        { name: 'Продвинутый уровень', sets: level2.length ? level2 : [] },
        { name: 'Мастер', sets: level3.length ? level3 : [] }
      ]);
      setAreLevelsLoaded(true); // Устанавливаем, что уровни загружены
    } else {
      setAreLevelsLoaded(false);
    }
  }, [level1, level2, level3]);

  // Вызов функции getLastLog после того, как уровни были загружены
  React.useEffect(() => {
    if (areLevelsLoaded && levels.every(level => level.sets.length > 0) && userId && catId !== null && exerciseId !== null) {
      getLastLog(catId, exerciseId, userId);
    }
  }, [levels, areLevelsLoaded, catId, exerciseId, userId]);

  React.useEffect(() => {
  }, [levels]);

  // Установка начального значения curReps
  React.useEffect(() => {
    if (areLevelsLoaded && levels[activeLevel] && Array.isArray(levels[activeLevel].sets) && levels[activeLevel].sets.length > 0) {
      setCurReps(levels[activeLevel].sets[0]);
    }
  }, [activeLevel, isLoaded, levels, areLevelsLoaded])

  // Функция для уменьшения количества повторений
  const minusRep = () => {
    setCurReps(prevState => {
      const newReps = prevState - 1 < 0 ? 0 : prevState - 1
      return newReps
    })
  }

  // Функция для увеличения количества повторений
  const plusRep = () => {
    setCurReps(prevState => {
      const newReps = prevState + 1
      return newReps
    })
  }

  // Загрузка данных упражнения
  const getExercise = async (catId, id) => {
    try {
      const data = await request(`/api/exercises/exercise/${catId}/${id}`);
      if (data && data.exercise) {
        dispatch(setExerciseData(data.exercise));
      } else {
        console.warn('No valid exercise data received.');
      }
    } catch (e) {
      console.error('Error fetching exercise:', e.message);
    }
  };

  React.useEffect(() => {
  }, [isLoaded, name, category, level1, level2, level3])

  // Проверка уровня с логированием и безопасным доступом к свойствам
  function checkLevel(log) {
    const arrLog = log.sets;
    
    // Проверяем наличие целевого уровня в levels
    if (!levels[log.cur_lev] || !Array.isArray(levels[log.cur_lev].sets) || levels[log.cur_lev].sets.length === 0) {
      console.error(`Ошибка: Уровень ${log.cur_lev} отсутствует или не содержит данных в массиве levels.`);
      return log.cur_lev;
    }
    
    const arrTarget = levels[log.cur_lev].sets;

    // Проверяем, что целевые значения существуют
    if (!arrTarget || !Array.isArray(arrTarget)) {
      console.error(`Ошибка: Целевые значения для уровня ${log.cur_lev} не найдены или не являются массивом.`);
      return log.cur_lev;
    }

    // Проходим по каждому значению и проверяем выполнение
    for (let i = 0; i < arrLog.length; i++) {
      if (arrLog[i] < arrTarget[i]) {
        return log.cur_lev;
      }
    }

    // Если все выполнено успешно, проверяем достижение максимального уровня
    const nextLevel = log.cur_lev === 2 ? log.cur_lev : log.cur_lev + 1;
    return nextLevel;
  }

  // Получение последнего лога пользователя
  const getLastLog = async (catId, exId, userId) => {
    try {
      const data = await request(`/api/journal/${catId}/${exId}/${userId}`)
      if (data && data.log) {
        // Добавляем проверку на наличие значений уровня
        if (!areLevelsLoaded || !levels || levels.length === 0) {
          console.error('Ошибка: Массив уровней (levels) пуст или не определен, или уровни еще не загружены.');
          return;
        }
  
        const lvl = checkLevel(data.log);
        dispatch(setLevel(lvl));
      } else {
        dispatch(setLevel(0));
      }
    } catch (e) {
      console.warn('Ошибка при получении последнего лога:', e.message)
    }
  }
  
  // Загрузка данных при инициализации
  React.useEffect(() => {
    async function load() { 
      await getExercise(catId, exerciseId)
      setContainerHeight('auto')
      if (areLevelsLoaded) {
        await getLastLog(catId, exerciseId, userId)  
      }    
    }
    load()
  }, [areLevelsLoaded])

  // Обработка выбора уровня
  const onActiveLevel = (id) => {
    dispatch(setLevel(id))
    setCurSet(0)
  }

  // Запуск таймера
  const onTimer = () => {
    window.scrollTo(0, 0)
    setTimerVis(true)
  }

  // Завершение текущего сета
  const doneCurSet = () => {
    
    // Клонируем уровни и обновляем текущий сет
    const newLevels = [...levels];
    newLevels[activeLevel].sets[curSet] = curReps;
    
    // Устанавливаем обновленные уровни
    setLevels(newLevels);
    
    // Проверяем количество сетов на активном уровне
    const setsNum = levels[activeLevel].sets.length;
    
    if (setsNum - (curSet + 1) > 0) {
      // Переход к следующему сету
      setCurSet(prevState => {
        const nextSet = prevState + 1;
        return nextSet;
      });
    } else {
      // Завершение всех сетов, сохранение лога и переход
      if (userId) {
        saveLog();
      } else {
        console.warn('No userId available for saving the log.');
      }
      history.push('/list');
    }
  };
  

  const levsBuilder = (lev) => {
    if (lev.sets[0] === 0) {
      return `1 сет, держать позицию ${lev.sets[1]} секунд`
    } else {
      return `${lev.sets.length} ${lev.sets.length === 1 ? 'сет' : 'сета'} по ${lev.sets[0]} повторений`
    }
  }

  const repsBuilder = (lev, idLev, idSet) => {
    if (lev.sets[0] === 0) {
      return activeLevel === idLev ? 'exercise-reps active' : 'exercise-reps'
    }
    if (activeLevel === idLev) {
      return idSet === curSet ? 'exercise-reps active'
        : idSet < curSet ? 'exercise-reps done' : 'exercise-reps'
    }
    return 'exercise-reps'
  }

  // Сохранение лога
  const saveLog = async () => {
    try {
      // Отправка запроса на сохранение лога
      const data = await request('/api/journal/log', 'POST', {
        userId: userId,
        catId,
        exId: exerciseId,
        exercise: name,
        curLev: activeLevel,
        sets: levels[activeLevel]?.sets
      });
  
      // Логируем ответ от сервера  
    } catch (e) {
      // Логируем ошибку, если она возникает
      console.error('Ошибка при сохранении лога:', e.message);
    }
  };
  

  if (!isLoaded) {
    return (
      <div className="background">
        <div className="container" style={{ height: containerHeight }}>
          <div className="workout-row">
            <div className="workout-left">
              <Link to="/">
                <div className="logo center">
                  <img src={logoPng} alt="logo" />
                </div>
              </Link>
              <div className="animation center">
                <img src={spinner} alt="loading spinner" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="background">
      <div className="container" style={{height: containerHeight}}>
        <div className="workout-row">
          <div className="workout-left">
            <Link to="/">
              <div className="logo center">
                <img src={logoPng} alt="logo"/>
              </div>
            </Link>
            <div className="animation">
              <img src={process.env.PUBLIC_URL + animUri} alt="anim"/>
            </div>
          </div>
          <div className="workout-right">
            <div className="exercise-title">
              <div className="exercise-title--category">
                <span className="label">категория</span>
                <span>{category}</span>
              </div>
              <div className="exercise-title--name">
                <span className="label">упражнение</span>
                <span>{name}</span>
              </div>
            </div>
            <div className="exercise-row">

              <div className="exercise-levels">
                <span className="label label-levels">выбери уровень</span>

                {levels.map((level, idLev) => (
                  <Item
                    key={idLev}
                    height="49"
                    level
                    active={activeLevel === idLev}
                    onClick={onActiveLevel}
                    id={idLev}
                  >
                    <div className="level-description">
                      <span>{level.name}</span>
                      <span className="label">
                        {levsBuilder(level)}
                      </span>
                    </div>

                    <ul className="level-reps">
                      {level.sets.map((set, idSet) => (
                        set === 0 ? '' :
                          <li
                            key={idSet}
                            className={repsBuilder(level, idLev, idSet)}
                          >
                            {set}
                          </li>
                      ))}
                    </ul>
                  </Item>
                ))}
              </div>

              {curReps === 0 ? (
                  <div className="exercise-amount timer">
                    <Button
                      className={isTimerVis ? 'hide' : ''}
                      height={50}
                      orange
                      onClick={onTimer}
                    >
                      <span>начать отсчёт времени</span>
                    </Button>
                  </div>
                ) :
                (
                  <div className="exercise-amount">
                    <span className="label">сделай упражнение и введи количество сделанных повторений</span>
                    <div className="reps-setup">
                      <button
                        className="button--circle minus"
                        onClick={minusRep}
                      >
                        <span className="minus">-</span>
                      </button>
                      <div className="reps-current"><span>{curReps}</span></div>
                      <button
                        className="button--circle"
                        onClick={plusRep}
                      >
                        <span>+</span>
                      </button>
                    </div>
                    <Button
                      orange
                      onClick={doneCurSet}
                    >
                      <span>сделал</span>
                    </Button>
                  </div>
                )}
            </div>

          </div>
        </div>
        <div className="workout-descript">
          {description.map((item, id) => (
            <p key={id}>{item}</p>
          ))}
        </div>
      </div>
      <Timer
        seconds={levels[activeLevel]?.sets[1]}
        isVisible={isTimerVis}/>
    </div>
  )
}

export default Workout
