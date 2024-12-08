import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg } from '@ionic/react';
import { Message } from '../model/message';
import './MessageContainer.css';
import Audio from './Audio';

interface ContainerProps {
  messag: Message;
  color: string;
}

const MessageContainer: React.FC<ContainerProps> = ({ messag, color }) => {


  const cdate: Date = new Date();
  const date: String = cdate.toLocaleDateString() + ' ' + cdate.toLocaleTimeString();
  const mess = messag.message;
  const username = messag.user;
  const recordData = messag.record;
  const imageSource = messag.image;
  const audioPlayVisible = messag.record.value ? true : false;


  return (
    <IonCard color={color}>
      <IonCardHeader>
        <IonCardTitle>{username}</IonCardTitle>
        <IonCardSubtitle>{date}</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        {mess}
        <IonImg src={imageSource} />
        {audioPlayVisible ? <Audio audioFile={recordData} /> : ''}
      </IonCardContent>
    </IonCard>
  );
};

export default MessageContainer;