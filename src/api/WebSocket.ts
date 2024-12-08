import { webSocket } from 'rxjs/webSocket';

const URL = 'ws://localhost:3010';

const webSocketSubject = webSocket<any>(URL);

export const webSocket$ = webSocketSubject.asObservable();

export const sendMessage = (message: any) => {
  console.log('sending message');
  webSocketSubject.next(message);
}

