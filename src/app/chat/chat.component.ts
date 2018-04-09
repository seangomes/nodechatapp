import { Component, OnInit } from '@angular/core';

import { ChatService } from "../providers/chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private messages = [];

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.getAllMessages();
  }

  getAllMessages() {
    this.chatService.getMessages().subscribe(data => this.messages = data);
  }

}
