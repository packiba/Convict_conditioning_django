import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Workout from '../pages/Workout';

const mockStore = configureStore([]);

describe('Workout Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      exercise: {
        catId: 0,
        exerciseId: 1,
        name: 'Отжимания от стены',
        category: 'Отжимания',
        isLoaded: true,
        level1: [10],
        level2: [25, 25],
        level3: [50, 50, 50],
        description: ['Описание упражнения'],
        animUri: '../assets/gif/anim2.gif',
      },
      user: {
        id: 2,
        isLoaded: true,
      }
    });

    store.dispatch = jest.fn();
  });

  test('renders workout data when loaded', () => {
    render(
      <Provider store={store}>
        <Workout />
      </Provider>
    );

    expect(screen.getByText('Отжимания от стены')).toBeInTheDocument();
    expect(screen.getByText('Описание упражнения')).toBeInTheDocument();
  });

  test('dispatches setExerciseData action on mount', () => {
    render(
      <Provider store={store}>
        <Workout />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  test('checks if data is loaded and renders loading state', () => {
    store = mockStore({
      exercise: {
        catId: 0,
        exerciseId: 1,
        isLoaded: false,
      },
      user: {
        id: 2,
        isLoaded: true,
      }
    });

    render(
      <Provider store={store}>
        <Workout />
      </Provider>
    );

    expect(screen.getByText(/Загрузка.../i)).toBeInTheDocument();
  });
});
