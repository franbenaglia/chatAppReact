import { useEffect } from 'react';
import './Audio.css';
import { Capacitor } from '@capacitor/core';
import { RecordingData } from 'capacitor-voice-recorder';
import { NativeAudio } from '@capacitor-community/native-audio';
import { IonCard, IonCardContent, IonGrid, IonProgressBar, IonButton, IonTitle, IonIcon, IonCol, IonRow } from '@ionic/react';

interface ContainerProps {
    audioFile: RecordingData;
}

const Audio: React.FC<ContainerProps> = ({ audioFile }) => {

    let web: boolean = false;
    let volume: number = 0.5;
    let volumePercent: number = 50;
    let duration: number = 0;
    let currentTime: number = 0;
    let audioBase64Url: string;
    let progress: number = 0;

    useEffect(() => {

        if (!Capacitor.isNativePlatform()) {
            web = true;
        }
        if (audioFile.value) {
            audioBase64Url = "data:" + audioFile.value.mimeType + ";base64," + audioFile.value.recordDataBase64;
            preload();
        }

    }, []);

    const preload = () => {

        NativeAudio.preload({
            assetId: "fire",
            assetPath: audioBase64Url,
            audioChannelNum: 1,
            isUrl: true
        });

        console.log('preload');

    }

    const play = () => {

        NativeAudio.getDuration({
            assetId: 'fire'
        })
            .then(result => {

                let duration = result.duration * 1000;

                console.log('Duration: ' + duration + ' ms');

                NativeAudio.play({
                    assetId: 'fire',
                });

                let inter = setInterval(() => {
                    progress += 0.05;
                    if (progress > 0.99) {
                        clearInterval(inter);
                        setTimeout(() => {
                            progress = 0;
                            unload();
                        }, 500);
                    }
                }, duration * 0.1);

            });

        console.log('play');
    }

    const getPercentage = () => {
        return progress * 100;
    }

    const loop = () => {

        NativeAudio.loop({
            assetId: 'fire',
        });

        console.log('loop');

    }

    const stop = () => {

        NativeAudio.stop({
            assetId: 'fire',
        });

        console.log('stop');

    }

    const pause = () => {

        NativeAudio.pause({
            assetId: 'fire',
        });

        console.log('pause');

    }

    const resume = () => {

        NativeAudio.resume({
            assetId: 'fire',
        });

        console.log('resume');

    }

    const unload = () => {

        NativeAudio.unload({
            assetId: 'fire',
        });

        console.log('unload');

    }

    const volup = () => {

        volume = volume + 0.1;
        volume > 1 ? volume = 1 : volume = volume;
        volumePercent = volume * 100;

        NativeAudio.setVolume({
            assetId: 'fire',
            volume: volume,
        });

        console.log('volup ' + volume);

    }

    const voldown = () => {

        volume = volume - 0.1;
        volume < 0 ? volume = 0 : volume = volume;
        volumePercent = volume * 100;

        NativeAudio.setVolume({
            assetId: 'fire',
            volume: volume,
        });

        console.log('voldown ' + volume);

    }

    const getDuration = () => {

        NativeAudio.getDuration({
            assetId: 'fire'
        })
            .then(result => {
                console.log('Segs: ' + result.duration);
                duration = result.duration;
            });
    }

    const getCTime = () => {
        NativeAudio.getCurrentTime({
            assetId: 'fire'
        })
            .then(result => {
                console.log(result.currentTime);
                currentTime = result.currentTime;
            })
    }

    const isPlaying = () => {

        return NativeAudio.isPlaying({
            assetId: 'fire'
        });

    }


    return (
        <IonCard color="red">
            <IonCardContent>
                <IonGrid>
                    <IonRow>
                        <IonProgressBar color="light" value={progress}></IonProgressBar>
                        {getPercentage()}
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton onClick={() => play()} color="light">
                                <IonIcon name="play-outline"></IonIcon>
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton onClick={() => pause()} color="light">
                                <IonIcon name="pause-outline"></IonIcon>
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton onClick={() => resume()} color="light">
                                <IonIcon name="play-skip-forward-outline"></IonIcon>
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton onClick={() => stop()} color="light">
                                <IonIcon name="stop-outline"></IonIcon>
                            </IonButton>
                        </IonCol>

                        <IonButton onClick={() => unload()}>Unload</IonButton>

                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton onClick={() => voldown()}>
                                <IonIcon name="volume-low-outline"></IonIcon>
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonTitle>{volumePercent} %</IonTitle>
                        </IonCol>
                        <IonCol>
                            <IonButton onClick={() => volup()}>
                                <IonIcon name="volume-high-outline"></IonIcon>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    <IonCol>
                        <IonButton onClick={() => getDuration()}>Duration</IonButton>
                    </IonCol>
                    <IonCol>
                        <IonTitle>Duration : {duration}</IonTitle>
                        <IonButton onClick={() => getCTime()}>Current time</IonButton>
                    </IonCol>
                    <IonCol>
                        <IonTitle>Duration : {currentTime}</IonTitle>
                    </IonCol>
                </IonGrid>
            </IonCardContent>
        </IonCard>
    );
};

export default Audio;


