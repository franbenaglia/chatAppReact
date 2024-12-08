import { useContext, useEffect } from 'react';
import './Group.css';
import { ChatContext, ChatContextI } from '../contexts/ChatContext';
import { IonCol, IonGrid, IonRow, IonSelect, IonSelectOption } from '@ionic/react';


const Group: React.FC = () => {

    const { getGroup, setTheGroup } = useContext<ChatContextI>(ChatContext);

    useEffect(() => {


    }, []);

    const setEvent = ($event: any) => {
        setTheGroup($event.detail.value);
    }

    return (
        <IonGrid>
            <IonRow>
                <IonCol>
                    <IonSelect onIonChange={(e) => setEvent(e)} value={getGroup()}
                        label="Select group" placeholder="Select group">
                        <IonSelectOption value="general">General</IonSelectOption>
                        <IonSelectOption value="opinionable">Opinionable</IonSelectOption>
                        <IonSelectOption value="fruit">Fruit</IonSelectOption>
                    </IonSelect>
                </IonCol>
                <IonCol></IonCol>
            </IonRow>
        </IonGrid >
    );
};

export default Group;