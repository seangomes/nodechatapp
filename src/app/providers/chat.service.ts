import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as io from 'socket.io-client';
import { User } from "../models/user";
import { Message } from "../models/message";


var httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class ChatService {

  private url: string = 'http://localhost:3000/api/';
  private socket: SocketIOClient.Socket;
  private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private messageSubject: BehaviorSubject<Message> = new BehaviorSubject<Message>(null);

  private connectedUsersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  public connectedUsers$ : Observable<User[]> = this.connectedUsersSubject.asObservable();
  public messages$: Observable<Message> = this.messageSubject.asObservable();

  constructor(private http: HttpClient) {
    this.socket = io();

    this.socket.on('new-message', (messageObj) => {
      this.messageSubject.next(messageObj);
    });

    this.socket.on('update-onlinelist', (userlist) => {
      console.log(userlist);
      this.connectedUsersSubject.next(userlist);
      console.log(this.connectedUsersSubject.getValue());
    });
  }

  getConnectedUsers(): Observable<any> {
    return this.connectedUsers$;
  }

  getUser(): Observable<User> {
    return this.userSubject.asObservable();
  }

  public getAllMessages() {
    return this.messages$;
  }

  isUserLoggedIn(): Observable<any> {
    return this.isLoggedInSubject.asObservable();
  }

  sendMessage(message: string) {
    if (message) {
      let user = this.userSubject.getValue();

      let messageObj : Message = {
        username: user.username, 
        message: message,
        timestamp: this.genereateTimeStamp()}

      this.socket.emit('new-message', messageObj);
    }
  }

  updateUserList(user: User) {
    let userList = this.connectedUsersSubject.getValue();
    userList.push(user);
  }

  removeUserFromList(user: User) {
    let userList = this.connectedUsersSubject.getValue();
    //userList.splice(user,1);
  }

  //LOGIN SECTION
  login(username: string) {
    if (username !== '') {
      let userObj: User = { "username": username };
      this.http.post(this.url + 'login', userObj, httpOptions).subscribe(data => {
        if (data !== 'Brugernavnet er allerede taget. Find et andet!') {
          let user = data as User;
          this.userSubject.next(user);
          this.isLoggedInSubject.next(true);
          localStorage.setItem('user', username);
          //Send emit to socket that we logged in
          console.log(user);
          this.socket.emit('user-connected', username);
        }
      })
      return this.userSubject.asObservable();
    }
  }

  logout() {
    let loggedInUser = this.userSubject.getValue();
    if (loggedInUser !== null) {

      //logout on server
      this.http.post(this.url + 'logout', loggedInUser).subscribe(data => {
        let user: User = null;
        this.isLoggedInSubject.next(false);
        this.userSubject.next(user);
        localStorage.removeItem('user');
        console.log(loggedInUser.username);
        this.socket.emit('left-chat', loggedInUser.username);
      });
    }
  }

  //Sætter tiden på message sent
  genereateTimeStamp() : string {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();

    let timestamp = h + ":" + m + ":" + s;
    return timestamp;
  }

}
