import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, DatePipe, TitleCasePipe} from '@angular/common';

import { User } from '../models/user';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  providers: [UserService, TitleCasePipe]
})
export class UserDetailsComponent implements OnInit {
  private user: User;

  constructor(private route: ActivatedRoute, private service: UserService, private location: Location) {
  }

  ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.user = this.service.getUser(id);
    if (!this.user) {
      this.service.getUsers()
        .subscribe(users => {
          this.user = this.service.getUser(id)
        })
    }

  }

}
