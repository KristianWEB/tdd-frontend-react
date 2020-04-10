import React from 'react';
import {render} from '@testing-library/react';
import {RestaurantList} from '../RestaurantList';

const restaurants = [
  {id: 1, name: 'Sushi Place'},
  {id: 2, name: 'Pizza Place'},
];
let loadRestaurants;
let context;

const renderWithProps = (propOverrides = {}) => {
  const props = {
    loadRestaurants: jest.fn().mockName('loadRestaurants'),
    loading: false,
    restaurants,
    ...propOverrides,
  };
  loadRestaurants = props.loadRestaurants;

  context = render(<RestaurantList {...props} />);
};

describe('RestaurantList', () => {
  it('loads restaurants on first render', () => {
    renderWithProps();
    expect(loadRestaurants).toHaveBeenCalled();
  });
});

describe('while loading', () => {
  it('displays the loading indicator while loading', () => {
    renderWithProps({loading: true});
    const {queryByTestId} = context;
    expect(queryByTestId('loading-indicator')).not.toBeNull();
  });
});

describe('when loading succeeds', () => {
  beforeEach(() => {
    renderWithProps();
  });

  it('does not display the loading indicator while not loading', () => {
    const {queryByTestId} = context;
    expect(queryByTestId('loading-indicator')).toBeNull();
  });

  it('displays the restaurants', () => {
    const {queryByText} = context;

    expect(queryByText('Sushi Place')).not.toBeNull();
    expect(queryByText('Pizza Place')).not.toBeNull();
  });

  it('does not display the error message', () => {
    const {queryByText} = context;
    expect(queryByText('Restaurants could not be loaded.')).toBeNull();
  });
});

describe('when loading fails', () => {
  beforeEach(() => {
    renderWithProps({loadError: true});
  });

  it('displays the error message', () => {
    const {queryByText} = context;
    expect(queryByText('Restaurants could not be loaded.')).not.toBeNull();
  });
});
