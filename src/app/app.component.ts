import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import * as go from 'gojs';
import { DataSyncService, DiagramComponent, PaletteComponent } from 'gojs-angular';
import * as _ from 'lodash';
import { NodeData } from './models/node-data';
import { EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PanelDevice } from './models/PanelDevice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent{

  newNodeData: NodeData;
  
  nodeData: NodeData;

  public newNodeCreated(newNodeData: NodeData) {
    this.nodeData = newNodeData;
  }

  ngOnInit()
  {
    
  }
}

