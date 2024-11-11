import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import logoPng from '../assets/img/logo.png';
import spinner from '../assets/img/spinner.gif';
import Item from '../components/Item';
import Bullets from '../components/Bullets';
import { useHttp } from '../hooks/http.hook';
import { setCategoryActive, setCategoryList } from '../redux/actions/categories';
import { setExercise } from '../redux/actions/exercise';

function ExerciseList() {
  const { request } = useHttp();
  const dispatch = useDispatch();
  const userId = useSelector(({ user }) => user.id);
  const isUserLoaded = useSelector(({ user }) => user.isLoaded);
  const categoryList = useSelector(({ categories }) => categories.categoryList);
  const activeCategory = useSelector(({ categories }) => categories.activeCategory);
  const activeCategoryId = useSelector(({ categories }) => categories.activeCategoryId);
  
  const [containerHeight, setContainerHeight] = React.useState('100vh');
  const [exerList, setExerList] = React.useState([]);
  const [levels, setLevels] = React.useState([]);

  const onActiveCategory = async (id) => {
    if (typeof id === 'undefined' || id === null) {
      console.error("Error: category id is not defined");
      return;
    }
    dispatch(setCategoryActive(id));
    setExerList(new Array(10).fill(''));
    const data = await getCategoryExercises(id);
    setExerList(data);
    document.getElementById('exercises').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onActiveExercise = (id) => {
    dispatch(setExercise(id, activeCategoryId));
  };

  const getCategoryExercises = async (categoryId) => {
    if (typeof categoryId === 'undefined' || categoryId === null) {
      console.error("Error: categoryId is not defined");
      return [];
    }
    if (typeof userId === 'undefined' || userId === null) {
      console.error("Error: userId is not defined");
      return [];
    }
    await getCategoryLog(categoryId, userId);
    try {
      const data = await request(`/api/exercises/category/${categoryId}/`);
      const sortedExercises = data.exercises.sort((a, b) => a.exercise_id - b.exercise_id);
      return sortedExercises.map((item) => item.name);
    } catch (e) {
      console.error('Error fetching category exercises:', e.message);
      return [];
    }
  };

  const getCategoryLog = async (catId, userId) => {
    try {
      const data = await request(`/api/journal/${catId}/${userId}`);
      if (!data.levels) {
        setLevels([]);
        console.warn('Нет данных для этой категории. Начните тренировку!');
      } else {
        setLevels(data.levels);
      }
    } catch (e) {
      if (e.message === 'Пока нет данных для этой категории. Начните тренировку!' || e.status === 404) {
        setLevels([]);
      } else {
        console.error('Ошибка:', e.message);
      }
    }
  };

  const getAllCategories = async () => {
    try {
      const data = await request('/api/exercises/categories/');
      const sortedCategories = data.categories.sort((a, b) => a.category_id - b.category_id);
      const catList = sortedCategories.map((item) => item.category_name);
      dispatch(setCategoryList(catList));
    } catch (e) {
      console.error('Error fetching categories:', e.message);
    }
  };

  React.useEffect(() => {
    async function load() {
      if (!categoryList.length) {
        await getAllCategories();
      }

      if (categoryList.length > 0) {
        setExerList(await getCategoryExercises(activeCategoryId));
        setContainerHeight('auto');
      }
    }

    if (isUserLoaded && userId) {
      load();
    }
  }, [isUserLoaded, userId, activeCategoryId, categoryList]);

  const bulletsBuilder = (lvl) => {
    if (lvl === -1) {
      return [false, false, false];
    }
    switch (lvl) {
      case 0:
        return [true, false, false];
      case 1:
        return [true, true, false];
      case 2:
        return [true, true, true];
      default:
        return [false, false, false];
    }
  };

  return (
    <div className="background">
      <div className="container" style={{ height: containerHeight }}>
        <div className="listpage-header">
          <Link to="/">
            <div className="logo center">
              <img src={logoPng} alt="logo" />
            </div>
          </Link>
        </div>
        <div className="listpage-content">
          <div className="listpage-categories">
            <span className="label">список категорий</span>
            {categoryList.map((category, id) => (
              <Item
                onClick={() => onActiveCategory(id)}
                key={id}
                id={id}
                height="57"
                big
                active={activeCategory[id]}
              >
                <span>{category}</span>
              </Item>
            ))}
          </div>
          <div className="listpage-exercises" id="exercises">
            <span className="label">упражнения выбранной категории</span>
            {exerList &&
              exerList.map((exercise, id) => {
                const currentLevel = levels[id] !== undefined ? levels[id] : -1;
                return (
                  <Link to="/workout" key={id}>
                    <Item key={id} id={id} height="43" onClick={() => onActiveExercise(id)}>
                      <Bullets levelList={bulletsBuilder(currentLevel)} />
                      {exercise === '' ? <img src={spinner} width="20" alt="logo" /> : <span>{exercise}</span>}
                    </Item>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExerciseList;
