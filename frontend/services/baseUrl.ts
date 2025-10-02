import axios from 'axios';
    const client = axios.create({
        baseURL: 'https://thegt.my.id', 
        timeout: 10000,
    });
export default client;