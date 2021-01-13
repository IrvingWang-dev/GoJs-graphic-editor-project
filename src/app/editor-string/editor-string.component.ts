import { Input, Component, OnInit } from '@angular/core';
import { PanelDeviceService } from '../panel-device.service';

@Component({
  selector: 'app-editor-string',
  templateUrl: './editor-string.component.html',
  styleUrls: ['./editor-string.component.css']
})
export class EditorStringComponent implements OnInit {

  @Input()
  item : Object;

  value:string;

  constructor(public panelDeviceService : PanelDeviceService) { }

  ngOnInit(): void {
    console.log(this.item);
    this.value = this.item["PD"][this.item["KEY"]];
    console.log(this.value);
  }

  onKey(event: any) { // without type info
    
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
