import { CurrentRecordingStatus, GenericResponse, RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import './ExploreContainer.css';
import { useContext, useEffect } from 'react';
import { AudioFileContext } from '../contexts/AudioFileContext';
import { IonButton, IonCol, IonGrid, IonRow, IonTitle } from '@ionic/react';

const Recorder: React.FC = () => {

    let isRecording: Boolean = false;
    let messageError: String = "";
    let status: string = "";
    let recordingAvailable = false;
    let permissionGranted = false;
    let recordingData: RecordingData = {} as RecordingData;
    let counter: number = 0;
    let inter: any;

    const { setAudioFile } = useContext(AudioFileContext);

    useEffect(() => {

        recorderAvailable();
        recordPermissionRequest();

    }, []);

    const recorderAvailable = () => {
        VoiceRecorder.canDeviceVoiceRecord().then((result: GenericResponse) => {
            console.log('Media recording available :' + result.value);
            recordingAvailable = result.value;
        });
    }

    const recordPermissionRequest = () => {
        VoiceRecorder.requestAudioRecordingPermission().then((result: GenericResponse) => {
            console.log('User permission: ' + result.value);
            permissionGranted = result.value;
        }
        )
    }


    const recordPermissionGranted = () => {
        VoiceRecorder.hasAudioRecordingPermission().then((result: GenericResponse) => {
            console.log(result.value);
            permissionGranted = result.value;
        })
    }

    const start = () => {
        VoiceRecorder.startRecording()
            .then((result: GenericResponse) => {
                isRecording = result.value;
                if (isRecording) {
                    counter = 0;
                    timer();
                }
                currentStatus();
                console.log(result.value)
            })
            .catch(error => {

                console.log(error)

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

            });
    }

    const timer = () => {
        inter = setInterval(() => {
            counter += 0.1;
        }, 100);
    }

    const stop = () => {

        VoiceRecorder.stopRecording()
            .then((result: RecordingData) => {
                recordingData = result;
                currentStatus();
                clearInterval(inter);
                //this.counter=0;
                setAudioFile(recordingData);
            })
            .catch(error => {
                console.log(error);

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
                status = result.status;

            })
            .catch(error => console.log(error));
    }

    return (
        <IonGrid>
            <IonRow>
                <IonCol>
                    <IonButton onClick={() => recorderAvailable()}>Record Available</IonButton>
                </IonCol>
                <IonCol>
                    <IonTitle>
                        Recording available: {recordingAvailable}
                    </IonTitle>
                </IonCol>
                <IonCol>
                    <IonButton onClick={() => recordPermissionRequest()}>Permission</IonButton>
                </IonCol>
                <IonCol>
                    <IonTitle>
                        Permission: {permissionGranted}
                    </IonTitle>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonButton onClick={() => start()} >Start</IonButton>
                </IonCol>
                <IonCol>
                    <IonButton onClick={() => stop()}   >Stop</IonButton>
                </IonCol>
                <IonCol>
                    <IonButton onClick={() => pause()}    >Pause</IonButton>
                </IonCol >
                <IonCol>
                    <IonButton onClick={() => resume()} >Resume</IonButton>
                </IonCol >
            </IonRow >
            <IonRow>
                <IonCol>
                    <IonButton onClick={() => currentStatus()}>Current status</IonButton>
                </IonCol>
                <IonCol>
                    <IonTitle>Status: {status}</IonTitle>
                </IonCol>
            </IonRow >
        </IonGrid >
    );
}

export default Recorder;
