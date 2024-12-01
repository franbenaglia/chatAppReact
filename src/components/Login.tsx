import { IonButton, IonInput, IonItem, IonList, IonIcon, IonLabel, IonListHeader } from '@ionic/react';
import { googleOauth2Login, githubOauth2Login} from '../helpers/AuthHelper';

const Login: React.FC = () => {


    const googleOauth2 = () => {
        googleOauth2Login();
    }

    const githubOauth2 = () => {
        githubOauth2Login();
    }



    return (
        <IonList lines="inset">

            <IonListHeader>
                <IonLabel>Complete:</IonLabel>
            </IonListHeader>

            <IonItem>
                <IonButton type="button" onClick={() => googleOauth2()} shape="round" color="medium"
                    size="default">Google&nbsp;<IonIcon name="logo-google"></IonIcon></IonButton>
                <IonButton type="button" onClick={() => githubOauth2()} shape="round" color="light"
                    size="default">Github&nbsp;<IonIcon name="logo-github"></IonIcon></IonButton>
            </IonItem>
        </IonList >
    );


}

export default Login;