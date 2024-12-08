import { createContext, useState } from "react";
import { Message } from "../model/message";

export interface ChatContextI {

    //messages: Message[],
    //clearMessages: () => void,
    getGroup: () => string,
    setTheGroup: (gr: string) => void,
    addConnectedUsers: (user: string) => void,
    connectedUsers: string[],
    user: string,
    setUser: (user: string) => void
    //setMessages: any

}

export const ChatContext = createContext<ChatContextI>({} as ChatContextI);

export const ChatProvider = ({ children }: any) => {

    const [user, setUser] = useState('');

    const [group, setGroup] = useState('general');

    const [connectedUsers, setConnectedUsers] = useState([] as string[]);

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
        <ChatContext.Provider value={{
            getGroup, setTheGroup,
            addConnectedUsers, connectedUsers, user, setUser
        }}>
            {children}
        </ChatContext.Provider>
    );

}



