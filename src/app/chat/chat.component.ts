import { Component, OnInit } from '@angular/core';

import { ChatService } from "../providers/chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private messages = [];
  private currentUser;

  constructor(private chatService: ChatService) {
   }

  ngOnInit() {
    this.chatService.getAllMessages().subscribe((message : any) => {
      this.messages.push(message);
    });

    this.chatService.getUser().subscribe(data => {
      this.currentUser = data;
      console.log(this.currentUser);
    });
  }

  

}
