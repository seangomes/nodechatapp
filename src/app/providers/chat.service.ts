import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as io from 'socket.io-client';
import { User } from "../models/user";


var httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class ChatService {

  private url: string = 'http://localhost:3000/api/';
  private socket : SocketIOClient.Socket;
  private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private connectedUsersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);


  constructor(private http: HttpClient) {
    this.socket = io();
  }

  getUsers(): Observable<any> {
    return this.http.get(this.url + 'users');
  }

  getUser(): Observable<User> {
    return this.userSubject.asObservable();
  }

  getMessages(): Observable<any> {
    return this.http.get(this.url + 'messages');
  }

  isUserLoggedIn(): Observable<any> {
    return this.isLoggedInSubject.asObservable();
  }

  sendMessage(message) {
    if (message) {
      this.socket.emit('new-message', message);
    }
  }

  updateUserList(user : User) {
    let userList = this.connectedUsersSubject.getValue();
    userList.push(user);
  }

  removeUserFromList(user : User) {
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

}
