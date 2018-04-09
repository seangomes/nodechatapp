import { Component, OnInit } from '@angular/core';
import { ChatService } from '../providers/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';

  constructor(private chatService: ChatService) {
    //Check if logged in
    


   }

  ngOnInit() {
  }

  login(username: string) {
    this.chatService.login(username).subscribe(data => {
      this.username = data;
      this.username = '';
    });
  }



}
