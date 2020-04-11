import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.outsidein.dev/1yYYeABohYtAE0oXkH8NAmwD61DkIahI',
});

const api = {
  loadRestaurants() {
    return client.get('/restaurants').then(response => response.data);
  },
  createRestaurant(name) {
    return client.post('/restaurants', {name}).then(response => response.data);
  },
};

export default api;
