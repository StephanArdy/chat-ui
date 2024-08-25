import React, {useEffect, useState} from "react";
import './FriendLists.scss';
import {getFriendLists, addFriend} from '../../api';

const FriendLists = ({userID, onselectedFriend}) => {
    const [friends, setFriends] = useState([]);
    const [friendID, setFriendID] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await getFriendLists(userID);

                if (response && response.data && Array.isArray(response.data.friends)){
                    setFriends(response.data.friends);
                } else {
                    console.error('Unexpected response format:', response)
                }
            } catch(error){
                console.error('Failed to fetch friend lists: ', error)
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [userID]);

    const handleAddFriend = async () => {
        if (!friendID) {
            setError('Friend identifier is required!')
            return;
        }
        
        try {
            await addFriend({user_id: userID, friend_id: friendID});
            setFriendID('');
            setError('');
            alert('Friend request sent!')
        } catch (error) {
            setError('User might not exists');
            console.error("Failed to Add Friend: ", error)
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div className="friend-lists">
            <div className="add-friend">
                <input
                 type="text"
                 placeholder="Enter friend ID"
                 value={friendID} 
                 onChange={(e) => setFriendID(e.target.value)}
                 />
                 <button onClick={handleAddFriend}>Add</button>
            </div>
            <div className="list">
                <h3>Your Friends</h3>
                {friends.length === 0?(
                    <p>You don't have any friends</p>
                ) : (
                    <ul>
                        {friends.map((friend, index) => (
                            <li key={index} onClick={() => onselectedFriend(friend)}>{friend}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FriendLists;