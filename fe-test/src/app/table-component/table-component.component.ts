import { TitleCasePipe } from '@angular/common';
import { Component, QueryList, ViewChildren, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../models/user';
import { UserService } from '../services/users.service';
import { NgbdSortableHeader, SortEvent } from '../directives/sortable.directive';

@Component({
  selector: 'ngbd-table-complete',
  templateUrl: './table-component.component.html',
  styleUrls: ['./table-component.component.css'],
  providers: [UserService, TitleCasePipe]
})

export class NgbdTableComplete implements OnInit {
  users$: Observable<User[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: UserService) {
    this.users$ = service.users$;
    this.total$ = service.total$;
  }

  ngOnInit() {
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}