import React, {useEffect, useRef, useState} from 'react';
import './ChatWindow.scss';
import { getOrCreateRoomID } from '../../api';


// const ChatWindow = ({roomID, userID, receiverID}) => {
//     const[messages, setMessage] = useState([]);
//     const[input, setInput] = useState('');
    
//     const socket = useMemo(() => {
//         const socketUrl = `ws://localhost:8000/ws?roomID=${roomID}&userID=${userID}&receiverID=${receiverID}`;
//         return new WebSocket(socketUrl);
//     }, [roomID, userID,receiverID])
    
//     useEffect(() => {
//         socket.onmessage = (event) => {
//             setMessage((prevMessages) => [...prevMessages, event.data]);
//         };

//         socket.onclose = () => {
//             console.log('Websocket connection closed');
//         };

//         return () => {
//             socket.close();
//         };
//     }, [socket]);

//     const sendMessage = () => {
//         if (input.trim()) {
//             socket.send(input);
//             setInput('');
//         }
//     };
    
//     return (
//         <div className='chat-window'>
//             <div>
//                 {messages.map((msg, index) => (
//                     <p key={index}>{msg}</p>
//                 ))}
//             </div>
//             <input
//                 type='text'
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder='Type a message'
//             />
//             <button onClick={sendMessage}>Send</button>
//         </div>
//     );
// };

const ChatWindow = ({userID, friendID}) => {
    const [roomID, setRoomID] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState('');
    const ws = useRef(null);

    useEffect(() => {
        const fetchRoomID = async () => {
            try {
                const response = await getOrCreateRoomID({user_id: userID, friend_id: friendID});
                setRoomID(response.data.chat_room_id);

                const socket = new WebSocket(`ws://localhost:8000/ws?roomID=${response.data.chat_room_id}&userID=${userID}&receiverID=${friendID}`);
                ws.current = socket;

                socket.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    console.log("Received message:", message);
                };

                socket.onclose = () => {
                    console.log("Websocket connection closed");
                }
            } catch (error) {
                console.error("Failed to fetch roomID:", error)
            }
        };

        if (userID && friendID) {
            fetchRoomID();
        }

        return() => {
            if(ws.current && typeof ws.current.close === 'function') {
                ws.current.close();
            }
        };
    }, [userID, friendID]);

    const handleSendMessage = () => {
        if (ws.current && message.trim() !== '') {
            const msg = {
                sender_id: userID,
                receiver_id: friendID,
                message_text: message,
            }

            ws.current.send(JSON.stringify(msg));
            setMessages((prevMessages) => [...prevMessages, msg]);
            setMessage('');
        }
    };
    
    return (
        <div className='chat-window'>
            {roomID ? (
                <div>
                    <h2>Chatting with {friendID}</h2>
                    <div className='messages-list'>
                        {messages.localeCompare((msg, index) => (
                            <div key={index} className={`message ${msg.sender_id === userID ? 'sent' : 'received'}`}>
                                {msg.message_text}
                            </div>
                        ))}
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