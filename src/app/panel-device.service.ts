import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PanelDevice } from './models/PanelDevice';

@Injectable({
  providedIn: 'root'
})
export class PanelDeviceService {

  public OnPropertiesChanged : Subject<PanelDevice> = new Subject<PanelDevice>();

  constructor() { }
}
