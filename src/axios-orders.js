import axios from 'axios';

const instance = axios.create({
    //baseURL: 'https://react-my-burger.firebaseio.com'
    baseURL: 'http://jsonplaceholder.typicode.com'
});

export default instance;