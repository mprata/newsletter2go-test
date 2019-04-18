import { Injectable, PipeTransform } from '@angular/core';

import { User } from '../models/user';


@Injectable({ providedIn: 'root' })
export class SelectionModelService {
    aSelection: Array<User>;
    constructor() {
        this.aSelection = [];
    }
    hasValue() {
        if (this.aSelection.length > 0) {
            return true;
        }
    }
    toggle(user: User) {
        let checkUser = this.aSelection.find(i => i.id === user.id);
        if (checkUser) {
            this.aSelection = this.aSelection.filter(i => i.id !== user.id)
        } else {
            this.select(user);
        }
    }
    isSelected(user: User) {
        if(!this.aSelection.length){
            return false;
        }
        let checkUser = this.aSelection.find(i => i.id === user.id)
        if (checkUser) {
            return true;
        } else {
            return false;
        }
    }
    selectedRecords() {
        return this.aSelection.length;
    }
    clear() {
        this.aSelection = [];
    }
    select(user: User) {
        let checkUser = this.aSelection.find(i => i.id === user.id);
        if(!checkUser){
            this.aSelection.push(user);
        }
    }
    deselect(user: User){
        let checkUser = this.aSelection.find(i => i.id === user.id);
        if (checkUser) {
            this.aSelection = this.aSelection.filter(i => i.id !== user.id)
        }
    }
}
