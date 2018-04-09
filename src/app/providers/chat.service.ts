import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { HttpClient } from'@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as io from 'socket.io-client';



@Injectable()
export class ChatService {

  private url: string = 'http://localhost:3000/api/';
  private socket;
  private userSubject : BehaviorSubject<string> = new BehaviorSubject<string>('');


  private users = [

  ];


  constructor(private http: HttpClient) {

    this.socket = io(this.url);

   }

  getUsers(): Observable<any> {
    return this.http.get(this.url+'users');
  }

  getMessages() : Observable<any> {
    return this.http.get(this.url+'messages');
  }

  login(username: string) {
    if(username !== '') {
      this.userSubject.next(username);
      return this.userSubject.asObservable();
    }
  }

  isLoggedIn() {
    return this.userSubject.asObservable();
  }

  public sendMessage(message) {
    if(message) {
      this.socket.emit('new-message', message);
    }
  }

}
