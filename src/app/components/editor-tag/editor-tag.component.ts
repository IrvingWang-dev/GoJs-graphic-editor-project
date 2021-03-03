import { Component, Input, OnInit } from '@angular/core';
import { PanelDeviceService } from '../../services/panel-device.service';
import { ModifySource } from 'src/app/models/PanelDevice';
import { SelectionServiceService } from 'src/app/services/selection-service.service'

@Component({
  selector: 'app-editor-tag',
  templateUrl: './editor-tag.component.html',
  styleUrls: ['./editor-tag.component.css']
})
export class EditorTagComponent implements OnInit {

  @Input()
  item : Object;
  value: string;

  constructor(public panelDeviceService : PanelDeviceService, public selectionService: SelectionServiceService) { }
  public Tags = [];

  ngOnInit(): void {
    this.value = this.item["PD"][this.item["KEY"]];
    this.Tags = ["", "$SysClockSecond"]
    // this.Tags = ["", "$SysClockData", "$SysClockDay", "$SysClockDataofWeek", "$SysClockHour", "$SysClockData", "$SysClockMinute", "$SysClockMonth", "$SysClockSecond", "$SysClockYear"];

  }

  onSelect(event: any) {
    this.item["PD"][this.item["KEY"]] = event.target.value;
    console.log(this.item);

    switch(this.item["KEY"].toString()) {
      case ("HeightTag") :{
        ModifySource(this.selectionService.selectPanelDevice, 'height', event.target.value);
        break;
      }
      case ("HoriPosTag"): {
        ModifySource(this.selectionService.selectPanelDevice, 'x', event.target.value);
        break;
      }
      case ("VertiPosTag"): {
        ModifySource(this.selectionService.selectPanelDevice, 'y', event.target.value);
        break;
      }
      case ("WidthTag") : {
        ModifySource(this.selectionService.selectPanelDevice, 'width', event.target.value);
        break;
      }
    }

    this.panelDeviceService.OnPropertiesChanged.next({
      pd: this.item["PD"],
      propertyName:this.item['KEY'],
      old:this.value,
      newValue: event.target.value
    });
  }


}
