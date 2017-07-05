import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { AppConfig } from '../app.config';
import { User } from '../_models/index';

@Injectable()
export class InputDataService {
  private subject = new Subject<any>();
  inputData: any = {};
  gameData: any = {};

  constructor() {

  }

  setInputData (message: any) {
    this.inputData = message;
    console.log("this.inputData", this.inputData);
    //this.subject.next({ type: 'success', text: message });
  }

  getInputData () {
    console.log("this.inputData", this.inputData);
    //this.subject.next({ type: 'success', text: message });
    return this.inputData;
  }

  setGameData (data: any) {
    this.gameData = data;
  }

  getGameData () {
    return this.gameData;
  }
}
