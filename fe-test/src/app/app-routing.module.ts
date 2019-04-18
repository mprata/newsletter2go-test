import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './users/users.component'
import { UserDetailsComponent } from './user-details/user-details.component';


@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'userdetails/:id', component: UserDetailsComponent },
      { path: 'home', component: UsersComponent },
      { path: '**', redirectTo: 'home' }
    ])
  ],
  exports: [
    RouterModule,
  ],
  providers: [],

})
export class AppRoutingModule {}