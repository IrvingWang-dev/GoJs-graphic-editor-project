import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodeData } from 'src/app/models/node-data';
import { InteractionProxyService } from 'src/app/services/interaction-proxy.service';

@Component({
  selector: 'app-property-panel',
  templateUrl: './property-panel.component.html',
  styleUrls: ['./property-panel.component.css']
})
export class PropertyPanelComponent implements OnInit, OnDestroy {

  private defaultProperties: NodeData = {
    key: '',
    left: 0,
    top: 0,
    width: 100,
    height: 50,
    label: 'New Node',
    color: 'White'
  }

  public nodeProperties: NodeData = JSON.parse(JSON.stringify(this.defaultProperties));

  public subscription: Subscription;

  constructor(public service: InteractionProxyService) { }

  ngOnInit(): void {
    this.subscription = this.service.diagramChangedSubject.subscribe((data: NodeData) => {
      
      this.nodeProperties = data;
    });
  }

  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe : null;
  }

  /**
   * Create new node data.
   */
  public addNewNode() {

    document.getElementById('generalPropertyPanel').style.display='block'; 
    document.getElementById('numericEntryProperty').style.display='none';

    const left = this.nodeProperties.left;
    const top = this.nodeProperties.top;
    const newNodeData = {
      key: (new Date()).getTime(),
      loc: left + ' ' + top,
      width: this.nodeProperties.width,
      height: this.nodeProperties.height,
      label: this.nodeProperties.label,
      color: this.nodeProperties.color
    }

    this.service.addNewNode(newNodeData);
  }

  /**
   * Update existing node.
   */
  public updateNewNode(){

    const newNodeData = {
      key: this.nodeProperties.key,
      loc: this.nodeProperties.left + ' ' + this.nodeProperties.top,
      width: this.nodeProperties.width,
      height: this.nodeProperties.height,
      label: this.nodeProperties.label,
      color: this.nodeProperties.color
    }

    this.service.updateNode(newNodeData);
  }

<<<<<<< HEAD
  public onTopEnter(value: string){
    this.updateNewNode();
  }

  public numericEntry(){
    document.getElementById('generalPropertyPanel').style.display='none'; 
    document.getElementById('numericEntryProperty').style.display='block'; 

    const left = this.nodeProperties.left;
    const top = this.nodeProperties.top;
    const newNodeData = {
      key: (new Date()).getTime(),
      loc: left + ' ' + top,
      width: this.nodeProperties.width,
      height: this.nodeProperties.height,
      label: this.nodeProperties.label,
      color: this.nodeProperties.color
    }
    this.service.addNewNode(newNodeData);
  }
=======
  public onTopEnter(value: string) {
     this.updateNewNode(); 
   }
>>>>>>> d2fa684c7ae656c3557c909050732212f37b9e3c
}
