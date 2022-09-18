import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  message = 'Tab 1';
  messages = [];
  alert = false;

  constructor(
    private dataService: DataService
  ) {
    this.dataService.message.subscribe(e => {
      this.message = e;
      this.messages.push(this.message)
      this.alert = true;

      setTimeout(() => {
        this.alert = false;
      }, 10000);
    })
  }


}
