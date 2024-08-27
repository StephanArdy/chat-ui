import React, {useEffect, useRef, useState} from 'react';
import './ChatWindow.scss';
import { getOrCreateRoomID } from '../../api';

const ChatWindow = ({userID, friendID}) => {
    const [roomID, setRoomID] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchRoomID = async () => {
            try {
                const response = await getOrCreateRoomID({user_id: userID, friend_id: friendID});
                setRoomID(response.data.chat_room_id);
            } catch (error) {
                console.error("Failed to fetch roomID: ", error)
            }
        };

        if (userID && friendID) {
            fetchRoomID();
        }

        return() => {
            if(ws.current) {
                ws.current.close();
            }
        };
    }, [userID, friendID]);

    useEffect(() => {
        if (roomID) {
            const socket = new WebSocket(`ws://localhost:8000/ws?roomID=${roomID}&userID=${userID}&receiverID=${friendID}`);
            ws.current = socket;

            socket.onopen = () => {
                console.log("Successfully Connected");

                const messageRequest = {
                    action: "get_messages",
                    room_id: roomID,
                    limit: 20,
                    offset: 0
                }
                socket.send(JSON.stringify(messageRequest));
            }
                
            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("Received message:", message);

                if (message.action === 'messages') {
                    if (Array.isArray(message.data)){
                        const newMessages = message.data.map(msg => ({
                            sender_id: msg.SenderID,
                            message_text: msg.MessageText
                        }));
                        newMessages.reverse();
                        console.log("New Messages: ", newMessages)
                   
                        setMessages((prevMessages) => [...newMessages, ...prevMessages]);      
                    } else {
                        console.log("No new messages received");
                    }
                } else {
                    console.log("Single Message: ", message)
                    setMessages((prevMessages) => [...prevMessages, message]);
                }
            };

            socket.onclose = (event) => {
                console.log("Websocket Closed Connection: ", event);
            };

            socket.onerror = (error) => {
                console.error("Websocket error: ", error)
            };

            return () => {
                socket.close();
            };
        }
    }, [roomID, userID, friendID])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);
    const handleSendMessage = () => {
        if (ws.current && message.trim() !== '') {
            const msg = {
                action: "send_message",
                sender_id: userID,
                receiver_id: friendID,
                message_text: message,
            }

            ws.current.send(JSON.stringify(msg));
            setMessage('');
        }
    };

    const handleScroll = (event) => {
        const {scrollTop} = event.target;

        if (scrollTop === 0) {
            const offset = messages.length;
            const messageRequest = {
                action: "get_messages",
                roomID: roomID,
                limit: 20,
                offset: offset,
            }

            ws.current.send(JSON.stringify(messageRequest));
        }
    };
    
    return (
        <div className='chat-window'>
            {roomID ? (
                <div>
                    <h2>Chatting with {friendID}</h2>
                    <div className='messages-list' onScroll={handleScroll}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender_id === userID ? 'sent' : 'received'}`}>
                                {msg.message_text}
                            </div>
                        ))}
                        <div ref={messagesEndRef}></div>
                    </div>
                    <div className='message-input'>
                        <input
                         type="text" 
                         placeholder='Type your message...'
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            ) : (
                <p>Loading chat...</p>
            )}
        </div>
    );
};

export default ChatWindow;