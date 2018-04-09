import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { HttpClient } from'@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';




@Injectable()
export class ChatService {

  private url: string = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  getMessages() : Observable<any> {
    return this.http.get(this.url+'messages');
  }

}
