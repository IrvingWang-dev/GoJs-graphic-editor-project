import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import * as go from 'gojs';
import { DataSyncService, DiagramComponent } from 'gojs-angular';
import { Subscription } from 'rxjs';
import { NodeData } from 'src/app/models/node-data';
import { PanelDevice } from 'src/app/models/PanelDevice';
import { currentScreen, PV800Screen } from 'src/app/models/Screen';
import { InteractionProxyService } from 'src/app/services/interaction-proxy.service';
import {SelectionServiceService} from 'src/app/selection-service.service';
import { PanelDeviceService } from 'src/app/panel-device.service';
import { ThisReceiver } from '@angular/compiler';

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


  public subscription2: Subscription;

  public subscription3: Subscription;

  constructor(public service: InteractionProxyService, public selectionService: SelectionServiceService,
    public panelDeviceService: PanelDeviceService) { }

  ngOnInit(): void {

    this.subscription2 = currentScreen.OnPanelDeviceChanged.subscribe( (pd :PanelDevice) =>
      {
        this.AddPanelDevice(pd);
      });

      this.subscription3 = this.panelDeviceService.OnPropertiesChanged.subscribe( (src) =>
       {
             // Use model's commit to update node.
            this.diagramPanel.model.commit((model) => {

        let linkModal = model as go.GraphLinksModel;
        let pd = src['pd'] as PanelDevice;
        let data = linkModal.findNodeDataForKey(pd.key);
      
        if ( src['propertyName'].localeCompare('x') == 0 || src['propertyName'].localeCompare('y') == 0)
          model.set(data, "location", go.Point.stringify(new go.Point(pd.x,pd.y)));
        else
          // Set position
            
             model.raiseDataChanged(data, src['propertyName'], src['old'], src['newValue']);
            }, 'update node');

        });

  }

  ngOnDestroy(): void {
    this.subscription2 ? this.subscription2.unsubscribe() : null;
  }

  public ngAfterViewInit() {

    this.diagramPanel = this.myDiagramComponent ? this.myDiagramComponent.diagram : null;

    // Selection was changed in diagram.
    this.diagramPanel.addDiagramListener('ChangedSelection', (event) => 
    {
      
      if (event.diagram.selection.count === 0 || event.diagram.selection.count > 1) {
        this.selectedNode = null;
        return;
      } 
      // Only handle one node for properties panel.
      const node = event.diagram.selection.first();
      if (node instanceof go.Node) {
        this.selectedNode = node;
        this.service.diagramChanged(this.selectedNode);
        this.selectionService.selectPanelDevice = node.data as PanelDevice;
      } else {
        this.selectedNode = null;
      }

      // return false;
    });

    // Size of node was changed.
    this.diagramPanel.addDiagramListener('PartResized', (event) => {
      let pd = this.selectionService.selectPanelDevice;


      // this is only a update to tell others update the properties, this may not very good!
      this.selectionService.OnSelectionChanged.next(1);
    });

    // Node was moved.
    this.myDiagramComponent.diagram.addDiagramListener('SelectionMoved', (event) => {
      let pd = this.selectionService.selectPanelDevice;
      pd.x = go.Point.parse(pd.location).x;
      pd.y = go.Point.parse(pd.location).y;

      // this is only a update to tell others update the properties, this may not very good!
      this.selectionService.OnSelectionChanged.next(1);
    });

    // Text was changed
    this.myDiagramComponent.diagram.addDiagramListener('TextEdited', (event) => {
      let pd = this.selectionService.selectPanelDevice;


      // this is only a update to tell others update the properties, this may not very good!
      this.selectionService.OnSelectionChanged.next(1);
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
          //{ stroke: 'blue'},
          new go.Binding('fill', 'color'),
          new go.Binding('stroke', 'borderColor')
        ),
        $(go.TextBlock, 
          { margin: 0, editable: true},
          // UI-Data two way binding.
          // Two way binding makes label be changed when editing.
          new go.Binding('text', "caption").makeTwoWay(),
          new go.Binding('stroke', 'textColor').makeTwoWay()
        ),
        // Node is derived from Part, so location is in Node. Need to bind location here.
        // Two way binding makes location data be changed when moving node.
        new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),

        new go.Binding("width", "width").makeTwoWay(),
        new go.Binding("height", "height").makeTwoWay(),
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
  public updateNodeByPD(pd: PanelDevice) {

    // Use model's commit to update node.
    this.diagramPanel.model.commit((model) => {

      let linkModal = model as go.GraphLinksModel;
      let data = linkModal.findNodeDataForKey(pd.key);
      
      model.set(data, "width", pd.width);
      model.set(data, "height", pd.height);
      // Set position
      model.set(data, "location", go.Point.stringify(new go.Point(pd.x,pd.y)));
      model.set(data, "caption", pd.caption);
      model.set(data, 'color', 'red');
    }, 'update node');
  }

  public OpenScreen(screen: PV800Screen) 
  {
    // load all panel device and show it
    screen.GetAllPanelDevices().forEach(pd => {
      this.AddPanelDevice(pd);
    });
  }

  public AddPanelDevice(pd: PanelDevice)
  {
    this.diagramPanel.commit((diagram) => {

      diagram.model.addNodeData(pd);

      
    }, 'add new node');

    this.diagramPanel.commit((diagram) => {
      let linkModal = diagram.model as go.GraphLinksModel;
      let key = linkModal.getKeyForNodeData(pd);
      pd.key = key;
      diagram.select(diagram.findNodeForKey(key));
    }, 'set key');

  }


}
