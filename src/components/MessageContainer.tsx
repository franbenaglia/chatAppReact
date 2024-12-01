import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg } from '@ionic/react';
import { Message } from '../model/message';
import './MessageContainer.css';
import Audio from './Audio';

interface ContainerProps {
  message: Message;
  color: string;
}

const MessageContainer: React.FC<ContainerProps> = ({ message, color }) => {


  const cdate: Date = new Date();
  const date: String = cdate.toLocaleDateString() + ' ' + cdate.toLocaleTimeString();
  const mess = message.message;
  const username = message.user;
  const recordData = message.record;
  const imageSource = message.image;
  const audioPlayVisible = message.record.value ? true : false;


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