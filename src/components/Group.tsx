import { useContext, useEffect } from 'react';
import './Group.css';
import { ChatContext } from '../contexts/ChatContext';
import { IonCol, IonGrid, IonRow, IonSelect, IonSelectOption } from '@ionic/react';


const Group: React.FC = () => {


    let group: string;

    const { getGroup, setTheGroup } = useContext<any>(ChatContext);


    useEffect(() => {

        group = getGroup();

    }, []);

    const setEvent = ($event: any) => {
        setTheGroup($event.detail.value);
    }

    return (
        <IonGrid>
            <IonRow>
                <IonCol>
                    <IonSelect onIonChange={(e) => setEvent(e)} value={group}
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