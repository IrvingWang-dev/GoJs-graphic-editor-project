import { Component, OnInit } from '@angular/core';
import { startAnimation, stopAnimation } from 'src/app/models/PanelDevice';
import { InitializeSystemTags } from 'src/app/models/SystemTags';
import { currentScreen } from '../../models/Screen';
import { PanelDeviceService } from 'src/app/services/panel-device.service';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.css']
})
export class AnimationComponent implements OnInit {

  public panelDevices = [];

  constructor(public panelDeviceService: PanelDeviceService) { }

  ngOnInit(): void {
    InitializeSystemTags();   
  }

  StartAnimation(event: any) {
    let pds = currentScreen.GetAllPanelDevices();
    this.panelDevices = pds;
    pds.forEach((pd)=> {
      startAnimation(pd, this.panelDeviceService);        //start animation to start all the panel device who binding a read tag
    } )

    // setTimeout(() => {
    //   console.log( 'go stop after 10 seconds');
    //   stopAnimation(t);
    // }, 10000);
  }

  StopAnimation(event: any) {

    this.panelDevices.forEach((pd) => {
      stopAnimation(pd);
    })
  }

}
