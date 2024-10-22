import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private isConnecting = false;
  private messageQueue: any[] = [];

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://taxi.acta.com.eg:4444/tripHub', {
        accessTokenFactory: () => localStorage.getItem('token') || '', // Attach token from localStorage
      })
      .withAutomaticReconnect() // Automatic reconnection if connection is lost
      .build();

    this.startConnection();
  }

  private startConnection(): void {
    if (!this.isConnecting) {
      this.isConnecting = true;
      this.hubConnection
        .start()
        .then(() => {
          console.log('SignalR Connected');
          this.isConnecting = false;
          // Send queued messages after connection is established
          this.sendQueuedMessages();
        })
        .catch((err) => {
          console.error('Error while starting SignalR connection: ', err);
          this.isConnecting = false;
          // Retry connection after a delay
          setTimeout(() => this.startConnection(), 5000);
        });
    }
  }

  private sendQueuedMessages() {
    debugger;
    while (this.messageQueue.length > 0) {
      const formData = this.messageQueue.shift();
      this.hubConnection
        .invoke('CreateTripByAdmin', formData)
        .then(() => console.log('Queued data sent successfully'))
        .catch((err) =>
          console.error('Error while sending queued data: ', err)
        );
    }
  }

  sendTripData(formData: any): Promise<string> {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      return this.hubConnection
        .invoke<string>('CreateTripByAdmin', formData) // Expecting a string message response
        .then((responseMessage) => {
          console.log('Data sent successfully, response:', responseMessage);
          return responseMessage; // Return the server message
        })
        .catch((err) => {
          console.error('Error while sending data:', err);
          throw err; // Propagate the error back
        });
    } else {
      // Queue the message if the connection isn't established yet
      console.log('Connection not established, queuing data');
      this.messageQueue.push(formData);
      if (
        this.hubConnection.state === signalR.HubConnectionState.Disconnected &&
        !this.isConnecting
      ) {
        this.startConnection();
      }
      return Promise.reject('Connection not established, data is queued.');
    }
  }
}
