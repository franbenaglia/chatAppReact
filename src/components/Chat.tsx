import { IonFab, IonCol, IonFabButton, IonFabList, IonGrid, IonIcon, IonInput, IonRow, IonButton } from '@ionic/react';
import './Chat.css';
import { RecordingData } from 'capacitor-voice-recorder';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ChatContext, ChatContextI } from '../contexts/ChatContext';
import { Message } from '../model/message';
import { webSocket$, sendMessage } from '../api/WebSocket';
import { catchError, debounceTime, retry, take, throwError } from 'rxjs';
import Recorder from './Recorder';
import { AudioFileContext } from '../contexts/AudioFileContext';
import MessageContainer from './MessageContainer';
import { sendOutline, chevronDownCircle, attachOutline, callOutline, trashOutline } from 'ionicons/icons';
import { v4 as uuidv4 } from 'uuid';
import { NativeAudio } from '@capacitor-community/native-audio';

const Chat: React.FC = () => {

  const [message, setMessage] = useState('');

  const [attachVisible, setAttachVisible] = useState(false);

  const [recordVisible, setRecordVisible] = useState(false);

  const [selectedFile, setSelectedFile] = useState({} as ImageSnippet);

  const [messages, setMessages] = useState([] as Message[]);

  const { addConnectedUsers, user, getGroup } = useContext<ChatContextI>(ChatContext);

  const { audioFile } = useContext(AudioFileContext);

  useEffect(() => {

    webSocket$
      .pipe(
        catchError((error) => {
          return throwError(() => new Error(error));
        }),
        retry({ delay: 5_000 }),
        //TODO see that
        //takeUntilDestroyed()
      )
      .subscribe((value: any) => {
        if (value.message) {
          const enc = new TextDecoder("utf-8");
          const text = enc.decode(new Uint8Array(value.message.data).buffer);
          const jsonobj: any = JSON.parse(text);
          setMessages(prevmessage => ([...prevmessage, ...[jsonobj]]));
          addConnectedUsers(jsonobj.user);
        }
      });

  }, []);

  const setAttachOn = () => {
    setAttachVisible(!attachVisible);
  }

  const _clearMessages = () => {
    //clearMessages();
    setMessages([]);
  }

  const getMessages = () => {
    return messages.filter(function ({ id }) {
      return !this.has(id) && this.add(id);
    }, new Set)
  }

  const setAudioOn = () => {
    setRecordVisible(!recordVisible);
  }

  /*
  const setAudioFile = () => {
      recordingData = audioFile;
  }
      */

  const send = () => {

    let mes: Message = new Message();
    mes.user = user;
    mes.message = message;
    mes.group = getGroup().length === 0 ? 'general' : getGroup();
    mes.image = selectedFile?.src;
    mes.record = audioFile;
    mes.id = uuidv4();

    sendMessage(mes);

    clear();
  }

  const clear = () => {
    setMessage('');
    //recordingData = {} as RecordingData;
    setSelectedFile(null);

  }

  const processFile = (imageInput: any) => {

    const file: File = imageInput.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      setSelectedFile(new ImageSnippet(event.target.result, file));

    });

    reader.readAsDataURL(file);
  }

  const onChangeHandler = event => {
    setMessage(event.target.value);
  }

  const clearMessages = () => {
    setMessages([]);
    NativeAudio.stop({
      assetId: 'fire',
    });
    NativeAudio.unload({
      assetId: 'fire',
    });
  }


  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonInput onKeyUp={(event) => onChangeHandler(event)} value={message} placeholder="Enter message"></IonInput>
          </IonCol>
        </IonRow>
        {attachVisible &&

          <IonRow>
            <IonCol>
              <input placeholder="Enter image" type="file" accept="image/*"
                onChange={($event) => processFile($event)} />
            </IonCol>
          </IonRow >

        }

        {recordVisible &&
          <IonRow color='red'>
            <Recorder />
          </IonRow>
        }

        <IonRow>
          <IonCol>
            <IonButton onClick={() => send()}>
              <IonIcon aria-hidden="true" slot="start" ios={sendOutline} md={sendOutline} />
            </IonButton>
          </IonCol>
        </IonRow >
        {getMessages().map((mess, idx) => {
          return <IonRow>
            <MessageContainer messag={mess} key={idx} color={(idx % 2 == 0) ? 'primary' : 'success'} />
          </IonRow>;
        })}

      </IonGrid >


      <IonFab slot="fixed" vertical="top" horizontal="end">
        <IonFabButton>
          <IonIcon name="chevron-down-circle"></IonIcon>
          <IonIcon ios={chevronDownCircle} md={chevronDownCircle} />
        </IonFabButton>
        <IonFabList side="bottom">
          <IonFabButton onClick={() => setAttachOn()}>
            <IonIcon ios={attachOutline} md={attachOutline} />
          </IonFabButton>
          <IonFabButton onClick={() => setAudioOn()}>
            <IonIcon ios={callOutline} md={callOutline} />
          </IonFabButton>
          <IonFabButton onClick={() => clearMessages()}>
            <IonIcon ios={trashOutline} md={trashOutline} />
          </IonFabButton >
        </IonFabList >
      </IonFab >
    </>


  );
};


export default Chat;

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}