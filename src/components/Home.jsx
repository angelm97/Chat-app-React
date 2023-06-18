import React, { useRef } from 'react';
import { useState } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db, dbr } from './firebase-config';
import { useEffect } from 'react';
import { data } from 'autoprefixer';
import { onDisconnect, onValue, ref, set } from 'firebase/database';
import mainImg from '../assets/img/mainroom.jpg'


const cookies = new Cookies();

const Home = () => {
    const [auth, setauth] = useState(getAuth())
    const [search, setsearch] = useState('')
    const [phoneView, setPhoneView] = useState(false)
    const navigate = useNavigate();
    const [sendBtn, setSendBtn] = useState('hidden');
    const [secBtn, setSecBtn] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [allMessages, setAllMessages] = useState([]);
    const messagesRef = collection(db, "messages");
    const roomsRef = collection(db, "rooms");
    const [data, setData] = useState();
    const [userImg, setUserImg] = useState();
    const [userName, setUserName] = useState();
    const [userId, setuserId] = useState();
    const messagesEndRef = useRef(null)
    const [rooms, setRooms] = useState([])
    const [roomsOriginal, setRoomsOriginal] = useState([])
    const [room, setRoom] = useState('K5NLB7Bf1VHYcXZAjRD5')
    const [showModal, setShowModal] = React.useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [messages])

    useEffect(() => {
        const res = roomsOriginal.filter((searchedUser) => {
            return searchedUser ? searchedUser.name.toLowerCase().indexOf(search.toLowerCase()) > -1 : null
        })
        setRooms(res)
    }, [search])

    useEffect(() => {
        const queryMessages = query(messagesRef, orderBy('createdAt'));
        const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
            const items = snapshot.docs.map((doc) => doc.data())
            const newItems = items.filter(res => res?.roomId == room);
            setAllMessages(items);
            setMessages(newItems);
            setUserImg(auth.currentUser.photoURL)
            setUserName(auth.currentUser.displayName)
            setuserId(auth.currentUser.uid)

        })



        return () => unsuscribe();
    }, [])



    useEffect(() => {
        const query = ref(dbr, "users");
        return onValue(query, (snapshot) => {
            const data = snapshot.val();
            setRooms([])
            setRoomsOriginal([])
            if (snapshot.exists()) {
                Object.values(data).map((project) => {
                    setRooms((room) => [...room, project]);
                    setRoomsOriginal((room) => [...room, project]);
                });
            }
        });
    }, []);


    useEffect(() => {
        if (userId) {
            const userRef = ref(dbr, `users/${userId}`);
            set(userRef, {
                name: userName,
                img: userImg
            })
            onDisconnect(userRef).remove();

        }
    }, [userId])




    const LogOutBtn = () => {
        signOut(auth).then(async () => {
            await cookies.remove("auth-token");
            await navigate("/login");
        }).catch((error) => {
            console.log(error);
        });

    }

    const showSendBtn = ({ target }) => {
        setMessage(target.value);

        if (target.value == '') {
            setSendBtn('hidden');
            setSecBtn('');
        } else {
            setSendBtn('');
            setSecBtn('hidden');
        }
    }

    const sendMessage = async () => {
        await addDoc(messagesRef, {
            text: message,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            email: auth.currentUser.email,
            userid: auth.currentUser.uid,
            userImg: auth.currentUser.photoURL,
            roomId: room
        })
        setMessage('');
        setSendBtn('hidden');
        setSecBtn('');

    }
    const handleKeyDown = (event) => {
        if (event.key == 'Enter') {
            sendMessage();
        }
    }

    const img = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    return (
        <div className={`flex flex-row bg-slate-600 max-h-screen min-h-screen`}>

            <div className={` bg-white w-1/3 min-h-full max-h-full br-c max-md:hidden z-10 ${phoneView ? 'show-phone' : 'joan'}`}>
                <div className='flex flex-row p-2 justify-between'>
                    <div className='flex flex-row items-center'>
                        <img className='bg-red-900 h-14 w-14 rounded-full ' src={userImg} alt="" />
                        <p className='ml-4 max-sm:text-2xl'>{userName}</p>
                    </div>
                    <div onClick={LogOutBtn} className='flex  items-center'>

                        <svg className="h-8 w-8 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>

                    </div>
                    <div className='flex  items-center md:hidden'>


                        <svg onClick={() => setPhoneView(!phoneView)} className="h-8 w-8 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>

                    </div>
                </div>
                <div className='bg-white p-4'>
                    <input type="text" onChange={(e) => setsearch(e.target.value)} id="first_name" className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8 max-sm:h-16 max-sm:text-3xl " placeholder="Chats" />
                </div>
                <h2 className='tex text-center text-lg font-bold  max-sm:text-2xl'>Users online</h2>
                <div className="flex flex-col bg-gray-200">
                    {
                        rooms.map((room, index) =>

                            <div key={index} onClick={() => openChat(room.id)} className='flex flex-row items-center p-2 border-b-slate-950 border-b hover:bg-gray-400 cursor-pointer'>
                                <img className='bg-red-900 h-14 w-14 rounded-full' src={room.img} alt="" />
                                <p className='ml-4  max-sm:text-2xl'>{room.name}</p>

                            </div>

                        )
                    }


                </div>
            </div>
            <div className={`w-screen min-h-full flex flex-col  ${phoneView ? 'hidden-phone' : ''}`}>
                <div className='flex flex-row p-2 justify-between bg-c'>
                    <div className='flex flex-row items-center'>
                        <img className='bg-red-900 h-14 w-14 rounded-full ' src={mainImg} alt="" />
                        <p className='ml-4 text-lg font-bold max-sm:text-4xl'>Main Room</p>
                    </div>
                    <div className='flex  items-center'>


                        <svg onClick={() => setPhoneView(!phoneView)} className="h-8 w-8 cursor-pointer md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>

                    </div>
                </div>
                <div className="text-chat-body relative overflow-y-scroll h-full max-h-full  bg-[url('https://e1.pxfuel.com/desktop-wallpaper/721/613/desktop-wallpaper-abstract-login-page.jpg')] bg-no-repeat bg-cover">

                    <div>
                        <div className="messages  w-full pb-20">

                            {
                                messages.map((msn, index) =>

                                    <div key={index}>
                                        {msn.userid != auth.currentUser.uid ? (
                                            <div className="flex items-center m-4">

                                                <div className="flex-none flex flex-col items-center space-y-1 mr-4">
                                                    <img className="rounded-full w-10 h-10"
                                                        src={msn.userImg} />
                                                    <p href="#" className="block text-xs  text-slate-50">{msn.user}</p>
                                                    <p href="#" className="block text-xs  text-slate-50">Using React</p>
                                                </div>
                                                <div className="flex flex-wrap bg-indigo-400 text-white p-2 rounded-lg mb-2 relative max-chat-c">
                                                    <div className='max-chat-cc'>{msn.text}<p className='text-sm'></p> </div>


                                                    {/* <div className="absolute left-0 top-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-indigo-400"></div> */}

                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex items-center m-4 flex-row-reverse ">
                                                    <div className="flex-none flex flex-col items-center space-y-1 ml-4">
                                                        <img className="rounded-full w-10 h-10"
                                                            src={auth.currentUser.photoURL} />
                                                        <p href="#" className="block text-xs  text-slate-50">{msn.user}</p>
                                                        <p href="#" className="block text-xs  text-slate-50">Using React</p>
                                                    </div>
                                                    <div className="flex bg-indigo-400 text-white p-2 rounded-lg mb-2 relative max-chat-c ">
                                                        <div className='max-chat-cc'>
                                                            {msn.text}
                                                            <p className='text-sm'></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                    </div>


                                )
                            }

                            <div ref={messagesEndRef}></div>




                        </div>
                    </div>










                    <div className='flex fixed inset-x-0 bottom-0'>
                        <div className='w-1/3 min-h-full max-h-full max-md:hidden'>

                        </div>
                        <div className='flex   p-4 bg-c w-screen min-h-full br-c2'>
                            <div className="inputandlogo flex w-11/12">
                                <div className='flex items-center mr-3 text-white'>
                                    React
                                </div>
                                <div className="relative  bg-white rounded-lg w-full" >
                                    <input
                                        onChange={showSendBtn}
                                        onKeyDown={handleKeyDown}
                                        value={message}
                                        type="text"
                                        className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                        placeholder="Form control lg" />

                                </div>

                            </div>
                            <div className="btns flex w-1/12">
                                <div className={`flex items-center m-3 max-h-6 min-h-6 text-white  ${secBtn}`}>
                                    <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <polyline points="4 7 4 4 20 4 20 7" />  <line x1="9" y1="20" x2="15" y2="20" />  <line x1="12" y1="4" x2="12" y2="20" /></svg>
                                </div>
                                <div onClick={sendMessage} className={`flex items-center m-3  cursor-pointer max-h-6 min-h-6  ${sendBtn}`}>
                                    <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <polyline points="12 16 16 12 12 8" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

        </div>
    )
}



export default Home
