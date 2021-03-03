import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CursorToolService {

  constructor() { }

  public isCreationTool:boolean = false;
}

