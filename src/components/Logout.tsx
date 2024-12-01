import { IonButton } from '@ionic/react';
import './Logout.css';
import { logout } from '../helpers/AuthHelper';

const Logout: React.FC = () => {
    return (

        <IonButton type="button" onClick={() => logout()} shape="round" color="light"
            size="default">Logout</IonButton>

    );
};

export default Logout;