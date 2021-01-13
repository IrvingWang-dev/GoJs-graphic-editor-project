import { Component, Input, OnInit } from '@angular/core';
import { PanelDeviceService } from '../panel-device.service';

@Component({
  selector: 'app-editor-number',
  templateUrl: './editor-number.component.html',
  styleUrls: ['./editor-number.component.css']
})
export class EditorNumberComponent implements OnInit {

  @Input()
  item : Object;
  
  value: number;

  constructor(public panelDeviceService : PanelDeviceService) {
    //this.value = this.item["PD"][this.item["KEY"]];
   }

  ngOnInit(): void {
    console.log(this.item);
    this.value = this.item["PD"][this.item["KEY"]];
    console.log(this.value);
  }

  onKey(event: any) { // without type info
    
    this.item["PD"][this.item["KEY"]] = parseInt(event.target.value);
    console.log(this.item);

    this.panelDeviceService.OnPropertiesChanged.next({
      pd: this.item["PD"],
      propertyName:this.item['KEY'],
      old:this.value,
      newValue: parseInt(event.target.value)
    });
  }

}
