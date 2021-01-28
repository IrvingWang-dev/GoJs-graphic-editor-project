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

    // if (toolBox.class == 'NumericEntry')
    // {
    //   let pd = new NumericEntry();
    //   currentScreen.AddPanelDevice(pd);
    // }

    switch (toolBox.class) {
      case 'NumericEntry': {
        let pd = new NumericEntry();
        currentScreen.AddPanelDevice(pd);
        break;
      }
      case 'NumericDisplay': {
        let pd = new NumericDisplay();
        currentScreen.AddPanelDevice(pd);
         break;
      }
      case 'Polygon': {
        let pd = new Polygon();
        this.gojsToolService.isPolygonToolEnabled = true;
        this.gojsToolService.OnGoJsToolEnabled.next(pd);
        break;
      }
      case 'Polyline': {
        let pd = new Polyline();
        this.gojsToolService.isPolygonToolEnabled = true;
        this.gojsToolService.isPolylienToolEnabled = true;
        this.gojsToolService.OnGoJsToolEnabled.next(pd);
        break;
      }
      case 'FreeForm': {
        let pd = new FreeForm();
        this.gojsToolService.isFreehandToolEnabled = true;
        this.gojsToolService.OnGoJsToolEnabled.next(pd);
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
