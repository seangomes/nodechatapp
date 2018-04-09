import { Component, OnInit } from '@angular/core';
import { ChatService } from "../providers/chat.service";

@Component({
  selector: 'app-sendmessage',
  templateUrl: './sendmessage.component.html',
  styleUrls: ['./sendmessage.component.css']
})
export class SendmessageComponent implements OnInit {

  message: string = '';
  user = '';

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.isLoggedIn().subscribe(user => this.user = user);
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }


}
