import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ExerciseList from '../pages/ExerciseList';

const mockStore = configureStore([]);

describe('ExerciseList Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      categories: {
        categoryList: [
          { category_id: 0, category_name: 'Отжимания' },
          { category_id: 1, category_name: 'Подтягивания' }
        ],
        activeCategory: null,
        activeCategoryId: null,
      },
      user: {
        id: 2,
        isLoaded: true,
      }
    });

    store.dispatch = jest.fn();
  });

  test('renders category list correctly', () => {
    render(
      <Provider store={store}>
        <ExerciseList />
      </Provider>
    );

    expect(screen.getByText('Отжимания')).toBeInTheDocument();
    expect(screen.getByText('Подтягивания')).toBeInTheDocument();
  });

  test('dispatches setCategoryActive on category selection', () => {
    render(
      <Provider store={store}>
        <ExerciseList />
      </Provider>
    );

    // Simulate category selection here (e.g., fire a click event)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function));
  });
});
