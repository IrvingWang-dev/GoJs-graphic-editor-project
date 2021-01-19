import { Component, OnInit } from '@angular/core';
import { ToolBox } from './toolbox';
import { currentScreen } from '../../models/Screen';
import { NumericEntry } from '../../models/PanelDevices/NumericEntry';
import { NumericDisplay } from '../../models/PanelDevices/NumericDisplay';
import toolBoxList  from './toolbox.json';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CursorToolService } from '../../services/cursor-tool.service';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.css']
})
export class ToolboxComponent implements OnInit {

  toolBoxItems = toolBoxList.items;

  constructor(public cursorTool: CursorToolService) { }

  ngOnInit(): void {
    
  }

  onSelect(toolBox: ToolBox): void {

    if (toolBox.class == 'NumericEntry')
    {
      let pd = new NumericEntry();

      currentScreen.AddPanelDevice(pd);
           
    }

    if (toolBox.class == 'NumericDisplay')
    {
      let pd = new NumericDisplay();

      currentScreen.AddPanelDevice(pd);
           
    }
    console.log(toolBox.name);
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
