import { Component, OnInit } from '@angular/core';
import { ToolBox } from './toolbox';
import { ToolBoxItems } from './mock-toolbox'; 

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.css']
})
export class ToolboxComponent implements OnInit {

  toolBoxItems = ToolBoxItems;
  selectedToolBox: ToolBox;

  constructor() { }

  ngOnInit(): void {
    
  }

  onSelect(toolBox: ToolBox): void {
    this.selectedToolBox = toolBox;
  }

}
