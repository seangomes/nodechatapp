import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { UserlistComponent } from './userlist/userlist.component';
import { SendmessageComponent } from './sendmessage/sendmessage.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';


@NgModule({
  declarations: [
    AppComponent,
    UserlistComponent,
    SendmessageComponent,
    LoginComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
