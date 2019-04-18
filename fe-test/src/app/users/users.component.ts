import { TitleCasePipe, NgTemplateOutlet } from '@angular/common';
import { Component, QueryList, ViewChildren, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user';
import { UserService } from '../services/users.service';
import { SelectionModelService } from '../services/selectionmodel.service';
import { NgbdSortableHeader, SortEvent } from '../directives/sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService, HttpClient, TitleCasePipe, SelectionModelService]
})

export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  total$: Observable<number>;
  showuser: any;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: UserService, public selection: SelectionModelService, private modalService: NgbModal, ) {
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

  open(content: NgTemplateOutlet, user: any) {
    let age = this._getAge(new Date(user.dateOfBirth))
    this.showuser = {
      ...user,
      age
    };
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  _getAge(dateOfBirth: Date) {
    let today = new Date();
    let year = today.getFullYear() - dateOfBirth.getFullYear();
    let age_month = today.getMonth() - dateOfBirth.getMonth();
    let age_day = today.getDate() - dateOfBirth.getDate();
    if (age_month < 0 || (age_month == 0 && age_day < 0)) {
      year = (year - 1);
    }
    return year;
  }

  isAllSelected() {
    const numSelected = this.selection.selectedRecords();
    const numRows = this.service.pageSize;
    return numSelected == numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.users$.subscribe((users) => {
        users.forEach(row => this.selection.select(row))
      });
  }

  deleteRow(user: User) {
    this.selection.deselect(user);
    this.service.deleteUser(user);
  }

  deleteSelections() {
    this.service.multiDelete(this.selection.aSelection);
    this.selection.clear();
  }

  downloadSelectionsAsCSVFile() {
    let csvContent = this.convertSelectionToCSV(this.selection.aSelection);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, "records.csv");
  }

  convertSelectionToCSV(aSelection) {
    let csvContent = '';
    for (let i = 0; i < aSelection.length; i++) {
      let line = '';
      for (let index in aSelection[i]) {
        if (line != '') line += ';'
        line += aSelection[i][index];
      }
      csvContent += line + '\r\n';
    }
    return csvContent;
  }
}
