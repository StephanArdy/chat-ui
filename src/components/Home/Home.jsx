import React, {useCallback, useEffect, useState} from 'react';
import './Home.scss';
import ChatWindow from '../ChatWindow';
import FriendRequests from '../FriendRequests';
import FriendLists from '../FriendLists/FriendLists';
import { getFriendLists } from '../../api';

const Home = ({userID, username}) => {
    const [selectedFriend, setSelectedFriend] = useState(null);

    const handleFriendSelect = (friend) => {
        setSelectedFriend(friend);
    };

    const fetchFriends = useCallback( async () => {
        try {
            await getFriendLists(userID);
            
        } catch(error){
            console.error('Failed to fetch friend lists: ', error)
        }
    }, [userID]);

    useEffect(() => {
        fetchFriends();
    }, [ userID])

    return (
        <div className='home-container'>
            <div className='left-panel'>
                <h2>Welcome, {username}</h2>
                <div className='friends-section'>
                    <FriendRequests userID={userID} fetchFriends={fetchFriends}/>
                    <FriendLists userID={userID} onselectedFriend={handleFriendSelect}/>
                </div>
            </div>

            <div className='right-panel'>
                {selectedFriend ? (
                    <ChatWindow userID={userID} friendID={selectedFriend} />
                ) : (
                    <p>Select a friend to start chatting</p>
                )}
            </div>
        </div>
    );
};

export default Home;
