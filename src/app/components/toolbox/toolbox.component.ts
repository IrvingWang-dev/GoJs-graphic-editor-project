import { Component, OnInit } from '@angular/core';
import { ToolBox } from './toolbox';
import { currentScreen } from '../../models/Screen';
import { NumericEntry } from '../../models/PanelDevices/NumericEntry';
import { NumericDisplay } from '../../models/PanelDevices/NumericDisplay';
import toolBoxList  from './toolbox.json';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CursorToolService } from '../../services/cursor-tool.service';
import { GojsToolService } from '../../services/gojs-tool.service';
import { Polygon } from 'src/app/models/PanelDevices/Polygon';
import { Polyline } from 'src/app/models/PanelDevices/Polyline';
import { FreeForm } from 'src/app/models/PanelDevices/FreeForm';
import { Trend } from 'src/app/models/PanelDevices/Trend';
import { Gauges } from 'src/app/models/PanelDevices/Gauges';
import { PanelDevice, CreatePVObject } from 'src/app/models/PanelDevice';



@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.css']
})
export class ToolboxComponent implements OnInit {

  toolBoxItems = toolBoxList.items;

  constructor(public cursorTool: CursorToolService, public gojsToolService: GojsToolService) { }

  ngOnInit(): void {
    
  }

  onSelect(toolBox: ToolBox): void {

    switch (toolBox.class) {
      case 'NumericEntry': {
        //let pd = new NumericEntry();
        let pd = CreatePVObject(NumericEntry);
        currentScreen.AddPanelDevice(pd);
        break;
      }
      case 'NumericDisplay': {
        //let pd = new NumericDisplay();
        let pd = CreatePVObject(NumericDisplay);
        currentScreen.AddPanelDevice(pd);
         break;
      }
      case 'Polygon': {
        let pd = CreatePVObject(Polygon);
        this.gojsToolService.isPolygonToolEnabled = true;
        this.gojsToolService.OnGoJsToolEnabled.next(pd);
        break;
      }
      case 'Polyline': {
        let pd = CreatePVObject(Polyline);
        this.gojsToolService.isPolygonToolEnabled = true;
        this.gojsToolService.isPolylienToolEnabled = true;
        this.gojsToolService.OnGoJsToolEnabled.next(pd);
        break;
      }
      case 'FreeForm': {
        let pd = CreatePVObject(FreeForm);
        this.gojsToolService.isFreehandToolEnabled = true;
        this.gojsToolService.OnGoJsToolEnabled.next(pd);
        break;
      }
      case 'Trend': {
        let pd = new Trend();
        currentScreen.AddTrendNode(pd);
        break;
      }
      case 'Gauges1': {
        let pd = new Gauges();
        currentScreen.AddPanelDevice(pd);
        break;
      }
      case 'Gauges2': {
        let pd = new Gauges();
        pd.category = "circularMeterTemplate"
        currentScreen.AddPanelDevice(pd);
        break;
      }
      default: {
        console.log(toolBox.name);
        break;
      }
    }
  }

  dragStart(toolBox: ToolBox) {
    console.log(toolBox.name);
    //this.servece.OnDragPanelDevice(name);
    this.cursorTool.isCreationTool = true;
  }

  dragEnd() {
    console.log("drop");
  }

  drop(event: CdkDragDrop<{title: string, poster: string}[]>) {
    console.log(event)
  }

}
