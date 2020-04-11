import React from 'react';
import {render, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import flushPromises from 'flush-promises';
import {NewRestaurantForm} from '../NewRestaurantForm';

describe('NewRestaurantForm', () => {
  const restaurantName = 'Sushi Place';
  const requiredError = 'Name is required';
  const serverError = 'The restaurant could not be saved. Please try again.';

  let createRestaurant;
  let context;

  beforeEach(() => {
    createRestaurant = jest.fn().mockName('createRestaurant');
    context = render(<NewRestaurantForm createRestaurant={createRestaurant} />);
  });

  describe('when filled in', () => {
    beforeEach(async () => {
      const {getByPlaceholderText, getByTestId} = context;
      createRestaurant.mockResolvedValue();

      await userEvent.type(
        getByPlaceholderText('Add Restaurant'),
        restaurantName,
      );
      userEvent.click(getByTestId('new-restaurant-submit-button'));
      return act(flushPromises);
    });

    it('calls createRestaurant with the name', () => {
      expect(createRestaurant).toHaveBeenCalledWith(restaurantName);
    });
    it('clears the name', () => {
      const {getByPlaceholderText} = context;
      expect(getByPlaceholderText('Add Restaurant').value).toEqual('');
    });
    it('does not display a validation error', () => {
      const {queryByText} = context;
      expect(queryByText(requiredError)).toBeNull();
    });
    it('does not display a server error', () => {
      const {queryByText} = context;
      expect(queryByText(serverError)).toBeNull();
    });
  });
  describe('when empty', () => {
    beforeEach(async () => {
      createRestaurant.mockResolvedValue();

      const {getByPlaceholderText, getByTestId} = context;
      await userEvent.type(getByPlaceholderText('Add Restaurant'), '');
      userEvent.click(getByTestId('new-restaurant-submit-button'));

      return act(flushPromises);
    });

    it('displays a validation error', () => {
      const {queryByText} = context;
      expect(queryByText(requiredError)).not.toBeNull();
    });
    it('does not call createRestaurant', () => {
      expect(createRestaurant).not.toHaveBeenCalled();
    });
  });
  describe('initially', () => {
    it('does not display a validation error', () => {
      const {queryByText} = context;
      expect(queryByText(requiredError)).toBeNull();
    });
    it('does not display a server error', () => {
      const {queryByText} = context;
      expect(queryByText(serverError)).toBeNull();
    });
  });
  describe('when correcting a validation error', () => {
    beforeEach(async () => {
      createRestaurant.mockResolvedValue();

      const {getByPlaceholderText, getByTestId} = context;

      await userEvent.type(getByPlaceholderText('Add Restaurant'), '');
      userEvent.click(getByTestId('new-restaurant-submit-button'));
      await act(flushPromises);

      await userEvent.type(
        getByPlaceholderText('Add Restaurant'),
        restaurantName,
      );
      userEvent.click(getByTestId('new-restaurant-submit-button'));

      return act(flushPromises);
    });

    it('clears the validation error', () => {
      const {queryByText} = context;
      expect(queryByText(requiredError)).toBeNull();
    });
  });
  describe('when the store action rejects', () => {
    beforeEach(async () => {
      createRestaurant.mockRejectedValue();

      const {getByPlaceholderText, getByTestId} = context;

      await userEvent.type(
        getByPlaceholderText('Add Restaurant'),
        restaurantName,
      );
      userEvent.click(getByTestId('new-restaurant-submit-button'));

      return act(flushPromises);
    });

    it('displays a server error', () => {
      const {queryByText} = context;
      expect(queryByText(serverError)).not.toBeNull();
    });
    it('does not clear the name', () => {
      const {getByPlaceholderText} = context;
      expect(getByPlaceholderText('Add Restaurant').value).toEqual(
        restaurantName,
      );
    });
  });
  describe('when retrying after a server error', () => {
    beforeEach(async () => {
      createRestaurant.mockRejectedValueOnce().mockResolvedValueOnce();

      const {getByPlaceholderText, getByTestId} = context;
      await userEvent.type(
        getByPlaceholderText('Add Restaurant'),
        restaurantName,
      );
      userEvent.click(getByTestId('new-restaurant-submit-button'));
      await act(flushPromises);

      userEvent.click(getByTestId('new-restaurant-submit-button'));
      return act(flushPromises);
    });

    it('clears the server error', () => {
      const {queryByText} = context;
      expect(queryByText(serverError)).toBeNull();
    });
  });
});
