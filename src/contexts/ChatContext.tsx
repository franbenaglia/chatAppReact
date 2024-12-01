import { createContext, useState } from "react";
import { useCookies } from "react-cookie";

export const ChatContext = createContext({});

export const ChatProvider = ({ children }: any) => {

    const [user, setUser] = useState('');

    const [cookies] = useCookies(['token', 'username']);

    if (cookies.username) { //useeffect?
        setUser(cookies.username);
    }

    const [messages, setMessages] = useState([] as any[]);

    const [group, setGroup] = useState('');

    const [connectedUsers, setConnectedUsers] = useState([] as string[]);

    const clearMessages = () => {
        setMessages([]);
    }

    const getGroup = () => group;

    const setTheGroup = (gr: string) => {
        setGroup(gr);
    }

    const addConnectedUsers = (user: string) => {
        if (!connectedUsers.includes(user)) {
            connectedUsers.push(user);
            setConnectedUsers(connectedUsers);
        }
    }

    return (
        <ChatContext.Provider value={{ messages, clearMessages, getGroup, setTheGroup, addConnectedUsers, connectedUsers, user }}>
            {children}
        </ChatContext.Provider>
    );

}



