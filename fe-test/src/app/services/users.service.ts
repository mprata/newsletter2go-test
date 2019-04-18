import { Injectable, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { User } from '../models/user';
import { TitleCasePipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortDirection } from '../directives/sortable.directive';

interface SearchResult {
  users: User[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(users: User[], column: string, direction: string): User[] {
  if (direction === '') {
    return users;
  } else {
    return [...users].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(User: User, term: string, pipe: PipeTransform) {
  return User.firstName.toLowerCase().includes(term)
    || pipe.transform(User.country).includes(term)
    || pipe.transform(User.lastName).includes(term);
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _users$ = new BehaviorSubject<User[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  public USERS: any;

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(public _http: HttpClient, private pipe: TitleCasePipe) {
    //Here we can replace the url later when we are loading user data from backend
    this.getUsers()
      .subscribe((data) => {
        this.USERS = data;
        this.load();
      },
        (error: any) => {
          console.error(error);
          return 'Server error';
        })
  }

  private load() {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._users$.next(result.users);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get users$() { return this._users$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    let users = sort(this.USERS, sortColumn, sortDirection);

    // 2. filter
    users = users.filter(User => matches(User, searchTerm, this.pipe));
    const total = users.length;

    // 3. paginate
    users = users.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ users, total });
  }

  getUsers(): Observable<any> {
    return this._http.get("../../assets/data/users.json");
  }

  getUser(id: number){
    if(this.USERS){
      let user = this.USERS.find(i => i.id === id);
      return user;
    }
  }

  deleteUser(user: User) {
    this.USERS = this.USERS.filter(i => i.id !== user.id);
    this.load();
  }

  multiDelete(aUsers: Array<User>) {
    aUsers.forEach(value => {
      this.USERS = this.USERS.filter(i => i.id !== value.id);
    })
    this.load();
  }
}
