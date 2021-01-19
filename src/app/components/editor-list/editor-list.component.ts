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
  public optionList = [];

  ngOnInit(): void {
    this.value = this.item["PD"][this.item["KEY"]];
    this.optionList = ["Rectangle", "RoundedRectangle", "Circle", "Ellipse"];

    // this.selectItems.forEach(listObject => {
    //  console.log(listObject.name)
      
    // });
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
