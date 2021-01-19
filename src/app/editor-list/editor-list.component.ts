import { Component, Input, OnInit } from '@angular/core';
import { PanelDeviceService } from '../panel-device.service';

@Component({
  selector: 'app-editor-list',
  templateUrl: './editor-list.component.html',
  styleUrls: ['./editor-list.component.css']
})
export class EditorListComponent implements OnInit {

  @Input()
  item : Object;
  value: string;

  constructor(public panelDeviceService : PanelDeviceService) { }
  public optionList = [];

  ngOnInit(): void {
    this.optionList = ["Rectangle", "Square", "RoundedRectangle", "Border", "Ellipse", "Circle", "TriangleRight", "TriangleDown", "TriangleLeft", "TriangleUp", "Triangle", "Diamond", "LineH", "LineV", "None", "BarH", "BarV", "MinusLine", "PlusLine", "XLine"];
    this.value = this.item["PD"][this.item["KEY"]];
  }

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
