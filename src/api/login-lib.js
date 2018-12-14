import axios from 'axios';

export const performLogin = (formData) => {
      return axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email: formData.get('email'),
        password: formData.get('password')
        },
        {
            headers: {
                'Content-Type': 'text/plain',
                'Accept': 'application/json'
            } 
    }).then(result => { return result }).catch(error => Promise.reject(error)); 
}
