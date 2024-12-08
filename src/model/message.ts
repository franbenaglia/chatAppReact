import { RecordingData } from "capacitor-voice-recorder";

export class Message {

    constructor() { }

    public id: string;
    public user: string;
    public message: string;
    public group: string;
    public image: string;
    public record: RecordingData;
}