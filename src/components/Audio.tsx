import { useEffect, useState } from 'react';
import './Audio.css';
import { Capacitor } from '@capacitor/core';
import { RecordingData } from 'capacitor-voice-recorder';
import { NativeAudio } from '@capacitor-community/native-audio';
import { IonCard, IonCardContent, IonGrid, IonProgressBar, IonButton, IonTitle, IonIcon, IonCol, IonRow } from '@ionic/react';
import { micCircleOutline, pauseOutline, playOutline, playSkipForwardOutline, stopOutline, volumeHighOutline, volumeLowOutline } from 'ionicons/icons';

interface ContainerProps {
    audioFile: RecordingData;
}

const Audio: React.FC<ContainerProps> = ({ audioFile }) => {

    let web: boolean = false;

    const [volumePercent, setVolumePercent] = useState(50);
    const [volume, setVolume] = useState(0.5);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {

        if (!Capacitor.isNativePlatform()) {
            web = true;
        }
        if (audioFile.value) {
            const audioBase64Url = "data:" + audioFile.value.mimeType + ";base64," + audioFile.value.recordDataBase64;
            preload(audioBase64Url);
        }
        /*
                return () => {
                   unload();
                };
                */

    }, []);

    const preload = async (audioBase64Url: string) => {

        await NativeAudio.preload({
            assetId: "fire",
            assetPath: audioBase64Url,
            audioChannelNum: 1,
            isUrl: true
        });

        console.log('preload');

        //do not work
        try {
            await NativeAudio.getDuration({
                assetId: 'fire'
            })
                .then(result => {

                    const dur = result.duration;

                    setDuration(dur);

                    console.log('Duration: ' + dur + ' seg');
                });
        } catch (error) {
            setDuration(10);
        }

    }


    const play = async () => {

        await NativeAudio.play({
            assetId: 'fire',
        });

        //10% percent repetion rate, progrees 0.1 max progress 1, guessing duration in segs
        const rep = ((duration / 100) * 10) * 1000;

        let inter = setInterval(() => {
            setProgress(prevprogress => {
                if (prevprogress > 0.9) {
                    clearInterval(inter);
                    setProgress(0);
                }
                return prevprogress + 0.1
            }
            );
        }, rep);

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

        setProgress(0);

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

        const vol = volume + 0.1;
        vol > 1 ? setVolume(1) : setVolume(vol);
        setVolumePercent(percent());

        NativeAudio.setVolume({
            assetId: 'fire',
            volume: volume,
        });

        console.log('volup ' + volume);

    }

    const voldown = () => {

        const vol = volume - 0.1;
        vol < 0 ? setVolume(0) : setVolume(vol);
        setVolumePercent(percent());

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
                setDuration(result.duration);
            });
    }

    const getCTime = () => {
        NativeAudio.getCurrentTime({
            assetId: 'fire'
        })
            .then(result => {
                console.log(result.currentTime);
                setCurrentTime(result.currentTime);
            })
    }

    const isPlaying = () => {

        return NativeAudio.isPlaying({
            assetId: 'fire'
        });

    }

    const percent = () => {
        const vf: number = volume * 100;
        const vfor: string = vf.toLocaleString(undefined, { maximumFractionDigits: 2 });
        return Number(vfor);
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
                                <IonIcon ios={playOutline} md={playOutline} />
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton onClick={() => pause()} color="light">
                                <IonIcon ios={pauseOutline} md={pauseOutline} />
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton onClick={() => resume()} color="light">
                                <IonIcon ios={playSkipForwardOutline} md={playSkipForwardOutline} />
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton onClick={() => stop()} color="light">
                                <IonIcon ios={stopOutline} md={stopOutline} />
                            </IonButton>
                        </IonCol>

                        <IonButton onClick={() => unload()}>Unload</IonButton>

                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton onClick={() => voldown()}>
                                <IonIcon ios={volumeLowOutline} md={volumeLowOutline} />
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonTitle>{volumePercent} %</IonTitle>
                        </IonCol>
                        <IonCol>
                            <IonButton onClick={() => volup()}>
                                <IonIcon ios={volumeHighOutline} md={volumeHighOutline} />
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


