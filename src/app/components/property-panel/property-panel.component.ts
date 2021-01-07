import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodeData } from 'src/app/models/node-data';
import { InteractionProxyService } from 'src/app/services/interaction-proxy.service';
import { Injectable } from '@angular/core';
import { PanelDevice } from 'src/app/models/PanelDevice';
import { SelectionServiceService } from 'src/app/selection-service.service'
import "reflect-metadata"
import { Editor } from 'src/app/models/Editor';

@Component({
  selector: 'app-property-panel',
  templateUrl: './property-panel.component.html',
  styleUrls: ['./property-panel.component.css']
})


@Injectable({
  providedIn: 'root',
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

  constructor(public service: InteractionProxyService, public selectionService: SelectionServiceService) { }

  ngOnInit(): void {
    this.subscription = this.service.diagramChangedSubject.subscribe((data: NodeData) => {

      this.nodeProperties = data;
    });
    this.subscription = this.selectionService.OnSelectionChanged.subscribe((data: number) => {

      this.OnUpdate();
    });

    this.OnUpdate();
  }

  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe : null;
  }

  /**
   * Create new node data.
   */
  public addNewNode() {

    document.getElementById('generalPropertyPanel').style.display = 'block';
    document.getElementById('numericEntryProperty').style.display = 'none';

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
  public updateNewNode() {

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

  public onTopEnter(value: string) {
    this.updateNewNode();
  }

  public numericEntry() {
    document.getElementById('generalPropertyPanel').style.display = 'none';
    document.getElementById('numericEntryProperty').style.display = 'block';

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

  public editors = [];

  public OnUpdate() {
    let pd = this.selectionService.selectPanelDevice;

    let keys = Object.keys(pd);


    keys.forEach(key => {
      if (Reflect.hasMetadata(Editor, pd, key)) {
        let metadata = Reflect.getMetadata(Editor, pd, key);

        this.editors.push({ "PD": pd, "KEY": key, "type": metadata });

      }
    });


  }
}
