import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const addFriend = async ({user_id, friend_id}) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/friends/add`, {
            user_id: user_id,
            friend_id: friend_id
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to add friend: ', error);
        throw error;
    }
}

export const getFriendRequests = async (userID) => {
    try  {
        const response = await axios.get(`${API_BASE_URL}/friend-request/${userID}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch friend requests: ', error);
        throw error;
    }
}

export const updateFriendRequestStatus = async (requestID, senderID, receiverID, acceptance) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/friend-request/respond`, {
            request_id: requestID,
            sender_id: senderID,
            receiver_id: receiverID,
            acceptance: acceptance,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update friend request: ', error);
        throw error;
    }
}

export const getFriendLists = async (userID) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/friends/list/${userID}`);
        return response.data;
    } catch(error){
        console.error('Failed to fetch friend lists: ', error);
        throw error;
    }
}

export const login = async (data) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/users/login`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch(error){
        console.error('Failed to request login: ', error);
        throw error;
    }
}

export const register = async (data) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/users/register`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data;
    } catch (error) {
        console.error('Failed to create new account: ', error);
        throw error;
    } 
}

export const getOrCreateRoomID = async ({user_id, friend_id}) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/messages/chatRoom?user_id=${user_id}&friend_id=${friend_id}`,
            null, {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data
    } catch (error) {
        console.error('Failed to get or create chat room: ', error)
        throw error;
    }
}