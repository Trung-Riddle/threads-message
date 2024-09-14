import instance from "../instance";

export const updateProfileRequest = (data, id) => instance({
    method: 'PUT',
    url: `users/update/${id}`,
    data
})
export const getUserRequest = (query) => instance({
    method: 'GET',
    url: `users/profile/${query}`
})
export const searchUsersRequest = (query) => instance({
    method: 'GET',
    url: `users/search/?user=${query}`
})
export const followUnFollowRequest = (id) => instance({
    method: 'POST',
    url: `users/follow/${id}`
})
export const suggestedUsersRequest = () => instance({
    method: 'GET',
    url: `users/suggested`
})