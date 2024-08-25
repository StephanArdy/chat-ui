import React, {useEffect, useState} from "react";
import './FriendRequests.scss';
import { getFriendRequests, updateFriendRequestStatus } from "../../api";

const FriendRequests = ({userID, fetchFriends}) => {
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getFriendRequests(userID);
                setFriendRequests(response.data || []);
            } catch (error) {
                console.error('Failed to fetch friend requests: ', error);
            }
        };
        
        fetchRequests();
    }, [userID]);

    const handleResponse = async (requestID, senderID, acceptance) => {
        try {
            await updateFriendRequestStatus(requestID, senderID, userID, acceptance);
            setFriendRequests(prevRequests =>
                prevRequests.filter(request => request._id !== requestID)
            );
            fetchFriends();
        } catch (error) {
            console.error('Failed to update friend request status: ', error);
        }
    };

    return (
        <div className="friend-requests">
            <h3>Friend Requests</h3>
            {friendRequests.length === 0 ? (
                <p>No new friend requests.</p>
            ) : (
                <ul>
                    {friendRequests.map((request) => (
                        <li key={request._id}>
                            <span>{request.sender_id}</span>
                            <button onClick={() => handleResponse(request._id, request.sender_id, true)}>
                                Accept
                            </button>
                            <button onClick={() => handleResponse(request._id, request.sender_id, false)}>
                                Deny
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FriendRequests;