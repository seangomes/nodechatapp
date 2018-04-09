import { Component, OnInit } from '@angular/core';
import { ChatService } from '../providers/chat.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  users = [];

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.getUsers().subscribe(data => this.users = data);
  }

}
