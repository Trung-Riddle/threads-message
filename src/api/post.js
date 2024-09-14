import instance from "../instance";

export const createPostRequest = (data) => instance({
    method: 'POST',
    url: `posts/create`,
    data
})
export const getPostsRequest = (username, page) => instance({
    method: 'GET',
    url: `posts/user/${username}?page=${page}`
})
export const getFeedUserPostRequest = (page) => instance({
    method: 'GET',
    url: `posts/feed/?page=${page}`
})
export const likeAndUnlikePostRequest = (id) => instance({
    method: 'PUT',
    url: `posts/like/${id}`
})
export const replyPostRequest = (id, text) => instance({
    method: 'PUT',
    url: `posts/reply/${id}`,
    data: { text: text }
})
export const getPostRequest = (id) => instance({
    method: 'GET',
    url: `posts/${id}`
})