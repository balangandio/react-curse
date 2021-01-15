import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://jsonplaceholder.typicode.com'
});
instance.interceptors.request.use(req => {
    console.log(`<-> request to [ ${req.method.toUpperCase()} ${req.url} ]`);
    return req;
});

export default instance;