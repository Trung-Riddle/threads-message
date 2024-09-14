import instance from '../instance'


export const getConversationsRequest = () => instance({
    method: 'GET',
    url: 'messages/conversations'
})
export const getMessageRequest = (otherUserId) => instance({
    method: 'GET',
    url: `messages/${otherUserId}`
})
export const sendMessageRequest = (data) => instance({
    method: 'POST',
    url: 'messages',
    data
})