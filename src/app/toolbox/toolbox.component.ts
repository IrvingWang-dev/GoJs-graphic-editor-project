import { Component, OnInit } from '@angular/core';
import { ToolBox } from './toolbox';
import { ToolBoxItems } from './mock-toolbox'; 
import { currentScreen } from '../models/Screen';
import { NumericEntry } from '../models/PanelDevices/NumericEntry';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.css']
})
export class ToolboxComponent implements OnInit {

  toolBoxItems = ToolBoxItems;

  constructor() { }

  ngOnInit(): void {
    
  }

  onSelect(toolBox: ToolBox): void {

    if (toolBox.class == 'NumericEntry')
    {
      let pd = new NumericEntry();
      currentScreen.AddPanelDevice(pd);
           
    }
    console.log(toolBox.name);
  }

}
