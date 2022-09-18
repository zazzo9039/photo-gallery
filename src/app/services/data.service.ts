import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, forkJoin, of, throwError, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  message = new Subject<any>();

  constructor() { }
}
