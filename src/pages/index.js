// import Image from 'next/image'
import { Inter } from 'next/font/google';
// import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Typewriter, { TypewriterClass } from 'typewriter-effect';


const inter = Inter({ subsets: ['latin'] });

function Home() {
    const [input, setInput] = useState(''); //input data to BE
    // const [chatLog,setChatLog] = useState([{
    //   role : "assistant",
    //   content : "How can i help you darling?"
    // }]);

    //   const router = useRouter();
    //   const [chatLogs, setChatLogs] = useState(fetchChatLogs(router.query.id));

    // //chatLogs store chatlogs each chat history
    //   const [chatLogs, setChatLogs] = useState([
    //     { id: 0, username: 'Chat Room 1',
    //     chatmessages: [{
    //       role : "assistant",
    //       content : "How can i help you darling?"
    //     }] },
    //   ]);

    const [currentSessionId, setCurrentSessionId] = useState('');
    const [allSessions, setAllSessions] = useState([]);
    const [allChats, setAllChats] = useState([]);
    //chtlogs idActive
    // const [activeChatLogId, setActiveChatLogId] = useState(chatLogs[0].id);
    //store last id has crated in chatlogs
    // const [totalChatLogId, setTotalChatLogId] = useState(1);
    //algorithmChoice
    const [algorithmChoice, setAlgorithmChoice] = useState('KMP');

    const refreshData = async () => {
        const response = await fetch('http://localhost:3080/all-sessions', {
            method: 'GET',
        });
        const data = await response.json();
        setAllSessions(data.sessions.map(({ id, name }) => ({ id, name })));

        if (currentSessionId === '') {
            setAllChats([]);
        } else {
            const response = await fetch(
                'http://localhost:3080/session?' +
                    new URLSearchParams({ id: currentSessionId }),
                {
                    method: 'GET',
                }
            );
            const data = await response.json();
            const chats = [];

            data.chatLog.forEach((chat) => {
                chats.push(                    {
                    role: 'user',
                    content: chat.question,
                })
                setTimeout(() => {})
                chats.push(
                    {
                        role: 'assistant',
                        content: chat.answer,
                    }
                );
            });
            
            console.log(chats);
            setAllChats(chats);
        }
    };

    useEffect(() => {
        refreshData();
    }, [currentSessionId]);

    //handle click chat history
    const handleTabClick = (id) => {
        setCurrentSessionId(id);
    };

    //clear chats
    async function clearChat() {
        if (currentSessionId !== '') {
            await fetch(
                'http://localhost:3080/clear-session?' +
                    new URLSearchParams({ id: currentSessionId }),
                {
                    method: 'GET',
                }
            );
            setCurrentSessionId('');
        }
    }

    async function clearAllChats() {
        await fetch('http://localhost:3080/clear-all-sessions', {
            method: 'GET',
        });
        if (currentSessionId === '') {
            refreshData();
        } else {
            setCurrentSessionId('');
        }
    }

    //handle click add chat history
    const handleAddChatLog = () => {
        if (currentSessionId !== '') {
            setCurrentSessionId('');
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        let session_id;

        if (currentSessionId === '') {
            const sess_res = await fetch('http://localhost:3080/new-session', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const session_data = await sess_res.json();
            session_id = session_data.id;
        } else {
            session_id = currentSessionId;
        }

        const message = { question: input };
        await fetch('http://localhost:3080/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'session-id': session_id,
                message,
            }),
        });

        setInput('');
        setCurrentSessionId(session_id);
        await refreshData();
    };

    //handle algorithm choice
    const handleOptionClick = async (event) => {
        setAlgorithmChoice(event.target.value);
        try {
            await fetch('http://localhost:3080/algotype', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: event.target.value,
                }),
            });
        } catch (error) {
            console.log(error);
        }
    };

    const ChatLog_List = ({ content }) => {
        return (
            <div
                className={
                    content.id === currentSessionId
                        ? 'listChat-button-active'
                        : 'listChat-button'
                }
                onClick={() => handleTabClick(content.id)}
            >
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 16 16'
                    width='16'
                    height='16'
                >
                    <path
                        fill='none'
                        stroke='#ffffff'
                        d='M3 3.503h10c.277 0 .5.223.5.5v6c0 .277-.223.5-.5.5H9v2.5l-4-2.5H3a.499.499 0 0 1-.5-.5v-6c0-.277.223-.5.5-.5z'
                        className='colorStroke000 svgStroke'
                    ></path>
                </svg>
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg> */}
                <h2 className='clearChat'>{content.name}</h2>
            </div>
        );
    };

    const Algorithm = () => {
        return (
            <div className='select-container'>
                <div className='select'>
                    <select
                        name='format'
                        id='format'
                        value={algorithmChoice}
                        onChange={handleOptionClick}
                    >
                        <option value='KMP'>KMP</option>
                        <option value='BM'>BM</option>
                    </select>
                </div>
            </div>
        );
    };

    return (
        <div className='App' scroll='no'>
            <div className='sidemenu'>
                <h2 className='CRDGPT'>CRDGPT</h2>
                <Algorithm></Algorithm>
                <div className='NewChat-button' onClick={handleAddChatLog}>
                    <svg
                        fill='#FFFFFF'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 50 50'
                        width='16px'
                        height='16px'
                    >
                        <path d='M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z' />
                    </svg>
                    <h2 className='clearChat'>New chat</h2>
                </div>

                <div className='chatList-outer'>
                    {allSessions.map((session, idx) => {
                        return <ChatLog_List key={idx} content={session} />;
                    })}
                </div>

                <div className='footer'>
                    <div className='clearChat-button' onClick={clearChat}>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            fill='currentColor'
                            className='bi bi-trash'
                            viewBox='0 0 16 16'
                        >
                            {' '}
                            <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />{' '}
                            <path
                                fillRule='evenodd'
                                d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'
                            />{' '}
                        </svg>
                        <h2 className='clearChat'>Clear Chat</h2>
                    </div>
                    <div className='clearChat-button' onClick={clearAllChats}>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            fill='currentColor'
                            className='bi bi-trash'
                            viewBox='0 0 16 16'
                        >
                            {' '}
                            <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />{' '}
                            <path
                                fillRule='evenodd'
                                d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'
                            />{' '}
                        </svg>
                        <h2 className='clearChat'>Reset All</h2>
                    </div>

                    <h4 className='TB3'>Tugas Besar 3</h4>

                    <p className='TB3Footer'>IF2211 Strategi Algoritma</p>
                </div>
            </div>
            <div className='chatbox'>
                <div className='chat-log-outer' scroll='no'>
                    <ChatLog allChats={allChats} />
                </div>
                <div className='chat-input-holder-outer1'>
                  <div className='chat-input-holder'>
                      <form onSubmit={handleSubmit}>
                          <input
                              placeholder='Type something'
                              rows='1'
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              className='chat-input-textarea'
                              ></input>
                      </form>
                  </div>
                </div>
                <div className='chat-input-holder-outer'>
                </div>
            </div>
        </div>
    );
}

function ChatLog({ allChats }) {
    return (
        <div className='chat-log'>
            <ChatLogMessages messages={allChats} />
        </div>
    );
}

function ChatLogMessages({ messages }) {
    return (
        <div className='chat-log-messages'>
            {messages.map((message, idx) => (
                <ChatMessage key={idx} message={message} />
            ))}
        </div>
    );
}

const ChatMessage = ({ message }) => {
    let stringMessage = message.content;
    return (
        <div
            className={`chat-message ${
                message.role === 'assistant' && 'chatgpt'
            }`}
        >
            <div className='chat-message-center'>
                <div
                    className={`avatar ${
                        message.role === 'assistant' && 'chatgpt'
                    }`}
                >
                    {message.role === 'assistant' && (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width={40}
                            height={40}
                            fill='none'
                            strokeWidth={1.5}
                            className='h-6 w-6'
                            viewBox='0 0 40 40'
                        >
                            <path
                                fill='currentColor'
                                d='M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18Z'
                            />
                        </svg>
                    )}

                </div>
                <div className='message'>
                    {message.role === 'assistant' && <Typewriter
                        options={{
                            autoStart: true,
                            loop: false,
                            delay: 50,
                            strings: stringMessage,
                            cursor: '',
                        }}
                    />}
                    {message.role === 'user' && <text>
                        {stringMessage}
                        </text>}
                </div>
            </div>
        </div>
    );
};

export default Home;
