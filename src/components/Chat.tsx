import { IonFab, IonCol, IonFabButton, IonFabList, IonGrid, IonIcon, IonInput, IonRow, IonButton } from '@ionic/react';
import './Chat.css';
import { RecordingData } from 'capacitor-voice-recorder';
import { useContext, useEffect } from 'react';
import { ChatContext } from '../contexts/ChatContext';
import { Message } from '../model/message';
import { webSocket$, sendMessage } from '../api/WebSocket';
import { catchError, retry, throwError } from 'rxjs';
import Recorder from './Recorder';
import { AudioFileContext } from '../contexts/AudioFileContext';
import MessageContainer from './MessageContainer';

const Chat: React.FC = () => {


  let message: string;
  let group: string = 'general';
  let selectedFile: ImageSnippet;
  let selectedAudioFile: any;
  let recordingData: RecordingData = {} as RecordingData;
  let recordVisible: boolean = false;
  let attachVisible: boolean = false;

  const { clearMessages, messages, addConnectedUsers, user } = useContext<any>(ChatContext);

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
          messages.push(jsonobj);
          addConnectedUsers(jsonobj.user);
        }
      });

  }, []);

  const setAttachOn = () => {
    attachVisible = !attachVisible;
  }

  const _clearMessages = () => {
    clearMessages();
  }

  const getMessages = () => {
    return messages;
  }

  const setAudioOn = () => {
    recordVisible = !recordVisible;
  }

  /*
  const setAudioFile = () => {
      recordingData = audioFile;
  }
      */

  const send = () => {

    let mes: Message = new Message();
    //TODO load user from service
    mes.user = user;
    mes.message = message;
    mes.group = group;
    mes.image = selectedFile?.src;
    mes.record = audioFile;

    sendMessage(mes);

    clear();
  }

  const clear = () => {
    message = '';
    recordingData = {} as RecordingData;
    selectedFile = {} as ImageSnippet;
  }

  const processFile = (imageInput: any) => {

    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      selectedFile = new ImageSnippet(event.target.result, file);

    });

    reader.readAsDataURL(file);
  }


  return (

    <IonGrid>
      <IonRow>
        <IonCol>
          <IonInput value={message} placeholder="Enter message"></IonInput>
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
        <IonRow>
          <Recorder />
        </IonRow>
      }

      <IonRow>
        <IonCol>
          <IonButton onClick={() => send()}>
            <IonIcon name="send-outline"></IonIcon>
          </IonButton>
        </IonCol>
      </IonRow >
      {getMessages().map((message, idx) => {
        <IonRow>
          <MessageContainer message={message} color={(idx % 2 == 0) ? 'primary' : 'success'} />
        </IonRow >
      })}

      <IonFab slot="fixed" vertical="top" horizontal="end">
        <IonFabButton>
          <IonIcon name="chevron-down-circle"></IonIcon>
        </IonFabButton>
        <IonFabList side="bottom">
          <IonFabButton onClick={() => setAttachOn()}>
            <IonIcon name="attach-outline"></IonIcon>
          </IonFabButton>
          <IonFabButton onClick={() => setAudioOn()}>
            <IonIcon name="call-outline"></IonIcon>
          </IonFabButton>
          <IonFabButton onClick={() => clearMessages()}>
            <IonIcon name="trash-outline" />
          </IonFabButton >
        </IonFabList >
      </IonFab >

    </IonGrid >
  );
};


export default Chat;

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}