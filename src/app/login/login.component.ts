import { Component, OnInit } from '@angular/core';
import { ChatService } from '../providers/chat.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  userObj : User = null;

  constructor(private chatService: ChatService) {
    this.chatService.getUser().subscribe(user => {
      this.userObj = user;
      console.log(user);
    });
   }

  ngOnInit() {
  }

  login() {
    this.chatService.login(this.username).subscribe(data => {
      this.username = '';      
    });
  }

  logout() {
    this.chatService.logout();
  }



}
