import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PanelDevice } from '../models/PanelDevice';

@Injectable({
  providedIn: 'root'
})
export class PanelDeviceService {

  public OnPropertiesChanged : Subject<any> = new Subject<any>();

  key : number;

  constructor() {
    this.key = key + 1;
    key = this.key;
    console.log("PanelDeviceService" + this.key);
    this.OnPropertiesChanged.next("Hello");
   }
}

export var panelDeviceService : PanelDeviceService = new PanelDeviceService();

let key = 1;
