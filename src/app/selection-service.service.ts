import { Injectable } from '@angular/core';
import { PanelDevice } from './models/PanelDevice';

@Injectable({
  providedIn: 'root'
})
export class SelectionServiceService {

  constructor() {

    this._selectedPanelDevice = new PanelDevice();

   }

  private _selectedPanelDevice : PanelDevice;

  public get selectPanelDevice()
  {
    return this._selectedPanelDevice;
  }

  public set selectPanelDevice(pd:PanelDevice)
  {
    this._selectedPanelDevice = pd;
  }
}
