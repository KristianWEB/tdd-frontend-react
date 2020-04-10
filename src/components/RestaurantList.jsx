import React, {useEffect} from 'react';
import {Alert} from '@material-ui/lab';
import {connect} from 'react-redux';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {loadRestaurants} from '../store/restaurants/actions';

export const RestaurantList = ({
  loadRestaurants,
  restaurants,
  loading,
  loadError,
}) => {
  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  return (
    <>
      {loading && <CircularProgress data-testid="loading-indicator" />}
      {loadError && (
        <Alert severity="error">Restaurants could not be loaded.</Alert>
      )}
      <List>
        {restaurants.map(restaurant => (
          <ListItem key={restaurant.id}>
            <ListItemText>{restaurant.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  );
};

const mapDispatchToProps = {loadRestaurants};

const mapStateToProps = state => ({
  restaurants: state.restaurants.records,
  loading: state.restaurants.loading,
  loadError: state.restaurants.loadError,
});

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantList);
