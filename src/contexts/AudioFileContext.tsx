import { RecordingData } from "capacitor-voice-recorder";
import { createContext, useState } from "react";

export const AudioFileContext = createContext({} as any);

export const AudioFileProvider = ({ children }: any) => {

    const [audioFile, setAudioFile] = useState({} as RecordingData);

    return (
        <AudioFileContext.Provider value={{ audioFile, setAudioFile }}>
            {children}
        </AudioFileContext.Provider>
    );

}



