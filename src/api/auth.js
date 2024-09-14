import instance from '../instance'


export const loginRequest = (data) => instance({
    method: 'POST',
    url: 'users/login',
    data
})
export const signupRequest = (data) => instance({
    method: 'POST',
    url: 'users/signup',
    data
})
export const logoutRequest = () => instance({
    method: 'POST',
    url: 'users/logout'
})