import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PanelDevice } from './models/PanelDevice';

@Injectable({
  providedIn: 'root'
})
export class SelectionServiceService {

  constructor() {

    this._selectedPanelDevice = new PanelDevice();

   }

   public OnSelectionChanged : Subject<number>;

  private _selectedPanelDevice : PanelDevice;

  public get selectPanelDevice()
  {
    return this._selectedPanelDevice;
  }

  public set selectPanelDevice(pd:PanelDevice)
  {
    this._selectedPanelDevice = pd;
    this.OnSelectionChanged.next(1);
  }
}
