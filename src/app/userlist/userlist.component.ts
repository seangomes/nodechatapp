import { Component, OnInit } from '@angular/core';
import { ChatService } from '../providers/chat.service';
import { User } from '../models/user';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  users = [];

  //Dummy data
  // users = [
  //   {username: "segomes", oid: "haaaa", admin: true},
  //   {username: "blah", oid: "haaaa", admin: false},
  //   {username: "hes", oid: "haaaa", admin: false},
  //   {username: "jensjensen", oid: "haaaa", admin: false},
  //   {username: "tommygun", oid: "haaaa", admin: false}
  // ]

  currentUser;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.getConnectedUsers().subscribe(data => this.users = data);

    this.chatService.getUser().subscribe(data => this.currentUser = data);
  }

  kickUser(user: User) {
    this.chatService.kickUser(user);
  }

}
