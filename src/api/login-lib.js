import axios from 'axios';

export const performLogin = (formData) => {
    return axios.post('/login', {
        email: formData.get('email'),
        password: formData.get('password')
    }).then(result => {
        return result;
    }).catch(error => Promise.reject(error));
}