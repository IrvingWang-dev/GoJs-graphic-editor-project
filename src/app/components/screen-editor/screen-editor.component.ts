import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CursorToolService } from '../../services/cursor-tool.service';
import { PanelDevice } from '../../models/PanelDevice';
import { currentScreen } from '../../models/Screen';
import { PanelDeviceService } from '../../services/panel-device.service';
import { SelectionServiceService } from '../../services/selection-service.service';

@Component({
  selector: 'app-screen-editor',
  templateUrl: './screen-editor.component.html',
  styleUrls: ['./screen-editor.component.css']
})
export class ScreenEditorComponent implements OnInit {

  @Input() PanelDevices: Array<PanelDevice> = new Array<PanelDevice>();


  public propertiesChangedsubscription: Subscription;

  constructor(public cursorTool: CursorToolService, public selectionService: SelectionServiceService,
    public panelDeviceService: PanelDeviceService) {
   }

  ngOnInit(): void {
    this.propertiesChangedsubscription = this.panelDeviceService.OnPropertiesChanged.subscribe ( (src) => 
    {
      let pd = src['pd'] as PanelDevice;
      pd.posstyle = "position: absolute;left:" + (pd.x) + "px;top:" + (pd.y) + "px;background-color:" + ";" ;//+ pd.color+";";
    });
  }

  onfocus(event: any) {
    event.selected = "show";
    console.log(event);
    this.selectionService.selectPanelDevice = event;
  }

  onlost() {
    console.log('lost');
    for (var i = 0; i < this.PanelDevices.length; i++) {
      this.PanelDevices[i].selected = "hide";
    }
  }

  addPanelDevice(pd: PanelDevice): void {

    this.PanelDevices.push(pd);
  }

  onDragStart(event: any) {
    console.log(event);
  }

  onDropEnd(event: any): void {
    if (this.cursorTool.isCreationTool)
    {
      let pd : PanelDevice = new PanelDevice();
      pd.caption = "test";
      pd.posstyle = "position: absolute;left:" + (event.offsetX - 50) + "px;top:" + (event.offsetY - 25) + "px";
      pd.selected = "show";
      this.addPanelDevice(pd);  
      this.cursorTool.isCreationTool = false;    
    }

  }

}
