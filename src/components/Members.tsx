import { useContext } from 'react';
import './Members.css';
import { ChatContext } from '../contexts/ChatContext';
import { IonList, IonListHeader, IonRow } from '@ionic/react';


const Members: React.FC = () => {

    const { connectedUsers } = useContext<any>(ChatContext);

    const getUsers = (): string[] => {
        return connectedUsers;
    }


    return (
        <IonList>
            <IonListHeader>Members</IonListHeader>
            {getUsers() && getUsers().map((user, idx) => {
                return <IonRow >
                    {user}
                </IonRow>;
            })}
        </IonList>
    );

};

export default Members;