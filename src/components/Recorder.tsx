import { CurrentRecordingStatus, GenericResponse, RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import './ExploreContainer.css';
import { useContext, useEffect, useState } from 'react';
import { AudioFileContext } from '../contexts/AudioFileContext';
import { IonButton, IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonRow, IonTitle } from '@ionic/react';
import { micCircleOutline, pauseOutline, playOutline, playSkipForwardOutline, stopOutline } from 'ionicons/icons';
import { Toast } from '@capacitor/toast';

const showToast = async (message: string) => {
    await Toast.show({
        text: message,
        position: 'top'
    });
};

const Recorder: React.FC = () => {

    const { setAudioFile } = useContext(AudioFileContext);

    const [status, setStatus] = useState('');
    const [recordingAvailable, setRecordingAvailable] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [counter, setCounter] = useState(0);
    const [secs, setSecs] = useState(0);
    const [inter, setInter] = useState(null);

    useEffect(() => {

        recorderAvailable();
        recordPermissionRequest();

    }, []);

    const recorderAvailable = () => {
        VoiceRecorder.canDeviceVoiceRecord().then((result: GenericResponse) => {
            console.log('Media recording available :' + result.value);
            setRecordingAvailable(result.value);
        });
    }

    const recordPermissionRequest = () => {
        VoiceRecorder.requestAudioRecordingPermission().then((result: GenericResponse) => {
            console.log('User permission: ' + result.value);
            setPermissionGranted(result.value);
        }
        )
    }

    const recordPermissionGranted = () => {
        VoiceRecorder.hasAudioRecordingPermission().then((result: GenericResponse) => {
            console.log(result.value);
            setPermissionGranted(result.value);
        })
    }

    const start = () => {
        VoiceRecorder.startRecording()
            .then((result: GenericResponse) => {
                const isRecording = result.value;
                if (isRecording) {
                    setCounter(0);
                    timer();
                }
                currentStatus();
                console.log(result.value)
            })
            .catch(error => {

                console.log(error)

                let messageError: string = '';

                switch (error) {
                    case 'MISSING_PERMISSION': {
                        messageError = 'Required permission is missing.';
                        break;
                    }
                    case 'DEVICE_CANNOT_VOICE_RECORD': {
                        messageError = 'Device/browser cannot record audio';
                        break;
                    }
                    case 'ALREADY_RECORDING': {
                        messageError = 'A recording is already in progress';
                        break;
                    }
                    case 'MICROPHONE_BEING_USED': {
                        messageError = 'Microphone is being used by another app.';
                        break;
                    }
                    case 'FAILED_TO_RECORD': {
                        messageError = 'Unknown error occurred during recording.';
                        break;
                    }
                    default: {

                        break;
                    }
                }

                showToast(messageError);

            });
    }



    const seconds = () => {
        const vfor: string = counter.toLocaleString(undefined, { maximumFractionDigits: 2 });
        setSecs(Number(vfor));
        console.log('secs: ' + secs);
    }



    const timer = () => {

        const int = setInterval(() => {
            setCounter(counter => counter + 0.5);
            //console.log('counter: ' + counter);
            //seconds();
        }, 500);

        setInter(int);

    }

    const stop = () => {

        VoiceRecorder.stopRecording()
            .then((result: RecordingData) => {
                const recordingData: RecordingData = result;
                currentStatus();
                clearInterval(inter);
                setAudioFile(recordingData);
            })
            .catch(error => {
                console.log(error);

                let messageError: string = '';

                switch (error) {
                    case 'RECORDING_HAS_NOT_STARTED': {
                        messageError = 'No recording in progress..';
                        break;
                    }
                    case 'EMPTY_RECORDING': {
                        messageError = 'Recording stopped immediately after starting.';
                        break;
                    }
                    case 'FAILED_TO_FETCH_RECORDING': {
                        messageError = 'Unknown error occurred while fetching the recording.';
                        break;
                    }
                    default: {

                        break;
                    }
                }
                showToast(messageError);
            });

    }

    const pause = () => {

        VoiceRecorder.pauseRecording()
            .then((result: GenericResponse) => {
                currentStatus();
                //console.log(result.value);
            })
            .catch(error => console.log(error));

    }

    const resume = () => {

        VoiceRecorder.resumeRecording()
            .then((result: GenericResponse) => {
                currentStatus();
                //console.log(result.value);
            })
            .catch(error => console.log(error));
    }

    const currentStatus = () => {

        VoiceRecorder.getCurrentStatus()
            .then((result: CurrentRecordingStatus) => {

                console.log(result.status);
                setStatus(result.status);

            })
            .catch(error => console.log(error));
    }

    return (


        <IonCard color="red">
            <IonCardContent>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonButton onClick={() => start()} color="light">
                                <IonIcon ios={micCircleOutline} md={micCircleOutline}></IonIcon>
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton onClick={() => stop()} color="light">
                                <IonIcon ios={stopOutline} md={stopOutline} />

                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton onClick={() => pause()} color="light" >
                                <IonIcon ios={playSkipForwardOutline} md={playSkipForwardOutline} />
                            </IonButton>
                        </IonCol >
                        <IonCol>
                            <IonButton onClick={() => resume()} color="light">
                                <IonIcon ios={pauseOutline} md={pauseOutline} />
                            </IonButton>
                        </IonCol >
                    </IonRow >
                    <IonRow>
                        <IonCol>
                            <IonTitle>Status: {status}</IonTitle>
                        </IonCol>
                        <IonCol>
                            <IonTitle>Segs: {counter}</IonTitle>
                        </IonCol>
                    </IonRow >
                </IonGrid >
            </IonCardContent>
        </IonCard>
    );
}

export default Recorder;
