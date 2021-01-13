import { Component, Input, OnInit } from '@angular/core';
import { PanelDeviceService } from '../panel-device.service';

@Component({
  selector: 'app-editor-color',
  templateUrl: './editor-color.component.html',
  styleUrls: ['./editor-color.component.css']
})
export class EditorColorComponent implements OnInit {

  @Input()
  item : Object;
  value: number;

  constructor(public panelDeviceService : PanelDeviceService) {
   }

  ngOnInit(): void {
    console.log(this.item);
    this.value = this.item["PD"][this.item["KEY"]];
    console.log(this.value);
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
