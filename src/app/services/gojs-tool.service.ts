import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PanelDevice } from '../models/PanelDevice'

@Injectable({
  providedIn: 'root'
})
export class GojsToolService {

  constructor() { }

  public isPolygonToolEnabled: boolean = false;
  public isPolylienToolEnabled: boolean = false;
  public isFreehandToolEnabled: boolean = false;
  

  public OnGoJsToolEnabled : Subject<PanelDevice> = new Subject<PanelDevice>();

}
