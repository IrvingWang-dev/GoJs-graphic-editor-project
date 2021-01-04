import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import * as go from 'gojs';
import { DataSyncService, DiagramComponent } from 'gojs-angular';
import { Subscription } from 'rxjs';
import { NodeData } from 'src/app/models/node-data';
import { InteractionProxyService } from 'src/app/services/interaction-proxy.service';

@Component({
  selector: 'app-customer-panel',
  templateUrl: './customer-panel.component.html',
  styleUrls: ['./customer-panel.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CustomerPanelComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('myDiagram', { static: true }) public myDiagramComponent: DiagramComponent;
  
  public diagramPanel: go.Diagram;

  public selectedNode: go.Node | null = null;

  public nodeIndex = 0;

  public locationStr: string;

  public diagramDivClassName: string = 'myDiagramDiv';

  public diagramModelData = { prop: 'value' };

  public skipsDiagramUpdate = false;

  public diagramNodeData: Array<go.ObjectData> = [
    // { key: 'Alpha', text: 'Alpha', color: 'lightblue', loc: '', width: 100, height: 30},
    // { key: 'Beta', text: 'Beta', color: 'orange', loc: '', width: 100, height: 30},
    // { key: 'Gamma', text: 'Gamma', color: 'lightgreen', loc: '', width: 100, height: 30},
    // { key: 'Delta', text: 'Delta', color: 'pink', loc: '', width: 100, height: 30}
  ];

  public subscription: Subscription;

  constructor(public service: InteractionProxyService) { }

  ngOnInit(): void {
    this.subscription = this.service.propertiesChangedSubject.subscribe((nodeData: NodeData) => {

      let matchedIndex = -1;

      const matchedData = this.diagramNodeData.find((oldNodedata, index, array) => {
        if(oldNodedata.key === nodeData.key) {
          matchedIndex = index;
          return true;
        } else {
          return false;
        }
      });

      if(matchedData) {
        this.updateNode(nodeData, matchedIndex);
      } else {
        this.addNewNode(nodeData);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe() : null;
  }

  public ngAfterViewInit() {

    this.diagramPanel = this.myDiagramComponent ? this.myDiagramComponent.diagram : null;

    // Selection was changed in diagram.
    this.diagramPanel.addDiagramListener('ChangedSelection', (event) => {
      
      if (event.diagram.selection.count === 0 || event.diagram.selection.count > 1) {
        this.selectedNode = null;
        return;
      } 
      // Only handle one node for properties panel.
      const node = event.diagram.selection.first();
      if (node instanceof go.Node) {
        this.selectedNode = node;
        this.service.diagramChanged(this.selectedNode);
      } else {
        this.selectedNode = null;
      }

      // return false;
    });

    // Size of node was changed.
    this.diagramPanel.addDiagramListener('PartResized', (event) => {
      this.service.diagramChanged(this.selectedNode);
    });

    // Node was moved.
    this.myDiagramComponent.diagram.addDiagramListener('SelectionMoved', (event) => {
      this.service.diagramChanged(this.selectedNode);
    });

    // Text was changed
    this.myDiagramComponent.diagram.addDiagramListener('TextEdited', (event) => {
      this.service.diagramChanged(this.selectedNode);
    });

    // this.diagramPanel.addDiagramListener('ObjectSingleClicked', (event) => {
    //   alert()
    // });
  } 

  /**
   * Passed to gojs-diagram component to initialize diagram.
   */
  public initDiagram(): go.Diagram {

    const $ = go.GraphObject.make;
    const dia = $(go.Diagram, {
      'undoManager.isEnabled': true,
      model: $(go.GraphLinksModel,
        {
          // Must set below property or there will be error after dragging item.
          linkKeyProperty: 'key' // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        }
      )
    });

    // define the Node template
    dia.nodeTemplate =
      $(go.Node, 'Auto',
        {
          resizable: true,
        },
        $(go.Shape, 'Rectangle', 
          { stroke: 'blue'},
          new go.Binding('fill', 'color')
        ),
        $(go.TextBlock, 
          { margin: 0, editable: true},
          // UI-Data two way binding.
          // Two way binding makes label be changed when editing.
          new go.Binding('text', "label").makeTwoWay(),
        ),
        // Node is derived from Part, so location is in Node. Need to bind location here.
        // Two way binding makes location data be changed when moving node.
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)
      );

    return dia;
  }

  /**
   * When the diagram model changes (diagram's node data array changed), this method is triggered.
   * When drag node, this method is triggered.
   * 
   * This method is useless in current logic.
   * 
   * @param changes 
   */
  public diagramModelChange = function(changes: go.IncrementalData) {
    // when setting state here, be sure to set skipsDiagramUpdate: true since GoJS already has this update
    // (since this is a GoJS model changed listener event function)
    // this way, we don't log an unneeded transaction in the Diagram's undoManager history
    this.skipsDiagramUpdate = true;

    this.diagramNodeData = DataSyncService.syncNodeData(changes, this.diagramNodeData);
    this.diagramLinkData = DataSyncService.syncLinkData(changes, this.diagramLinkData);
    this.diagramModelData = DataSyncService.syncModelData(changes, this.diagramModelData);

    console.log('diagramModelChange: ', changes);
  };

  /**
   * Add new node to diagram.
   * @param nodeData 
   */
  public addNewNode(nodeData: NodeData) {
    // Use diagram's commit to add new node.
    this.diagramPanel.commit((diagram) => {

      diagram.model.addNodeData(nodeData);
    }, 'add new node');
  }

  /**
   * Update existing node.
   * @param nodeData 
   * @param index 
   */
  public updateNode(nodeData: NodeData, index: number) {

    // Use model's commit to update node.
    this.diagramPanel.model.commit((model) => {

      const data = model.nodeDataArray[index];
      // Set size
      model.set(this.selectedNode, 'desiredSize', new go.Size(Number(nodeData.width), Number(nodeData.height)));
      // Set position
      model.set(data, "loc", nodeData.loc);
      model.set(data, 'label', nodeData.label);
      model.set(data, 'color', nodeData.color);
    }, 'update node');
  }

  public OpenScreen(screen: Screen) 
  {
    // load all panel device and show it
  }
}
