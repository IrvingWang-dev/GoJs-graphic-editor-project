import { Component, Input, OnInit } from '@angular/core';
import { PanelDeviceService } from '../../services/panel-device.service';
import listOption from './optionList.json';

@Component({
  selector: 'app-editor-list',
  templateUrl: './editor-list.component.html',
  styleUrls: ['./editor-list.component.css']
})
export class EditorListComponent implements OnInit {

  @Input()
  item : Object;
  value: string;

  selectItems = listOption;
  
  constructor(public panelDeviceService : PanelDeviceService) { }
  // public List = new Map<string, string[]>();
  public shapeList = [];
  public category = [];
  public groupMemberNames = [];

  ngOnInit(): void {
    this.value = this.item["PD"][this.item["KEY"]];

    if (this.item["KEY"].localeCompare("customize") == 0)
    {
      this.groupMemberNames = this.item["PD"][this.item["KEY"]];
    }

    this.shapeList =  [
    "Rectangle", 
    "Square", 
    "RoundedRectangle",
    "Ellipse", 
    "Circle", 
    "TriangleRight", 
    "TriangleDown", 
    "TriangleLeft",
    "TriangleUp", 
    "Triangle", "Diamond"];

    this.category = [
      "gaugesTemplate",
      "circularMeterTemplate",
    ]
  };

  onSelect(event: any) {
    this.item["PD"][this.item["KEY"]] = event.target.value;
    console.log(this.item);

    this.panelDeviceService.OnPropertiesChanged.next({
      pd: this.item["PD"],
      propertyName:this.item['KEY'],
      old:this.value,
      newValue: event.target.value
    });
  }

}
