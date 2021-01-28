import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RightclickContextService {

  constructor() { 
    this.OnRightClickContextSelect = new Subject<string>();
    this.OnRightClickMenuCall = new Subject<any>();
  }

  public OnRightClickContextSelect : Subject<string> = new Subject<string>();
  public OnRightClickMenuCall : Subject<any> = new Subject<any>();
}
