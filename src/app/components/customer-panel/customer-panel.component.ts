import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import * as go from 'gojs';
import { DataSyncService, DiagramComponent } from 'gojs-angular';
import { Subscription } from 'rxjs';
import { NodeData } from 'src/app/models/node-data';
import { PanelDevice } from 'src/app/models/PanelDevice';
import { currentScreen, PV800Screen } from 'src/app/models/Screen';
import { InteractionProxyService } from 'src/app/services/interaction-proxy.service';
import {SelectionServiceService} from 'src/app/services/selection-service.service';
import { PanelDeviceService } from 'src/app/services/panel-device.service';
import { ThisReceiver } from '@angular/compiler';
import { FreehandDrawingTool } from 'node_modules/gojs/extensionsTS/FreehandDrawingTool';
import { PolygonDrawingTool } from 'node_modules/gojs/extensionsTS/PolygonDrawingTool';
import { GojsToolService } from 'src/app/services/gojs-tool.service';
import { RightclickContextService } from 'src/app/services/rightclick-context.service';

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

  public polygonDrawingTool: go.Tool;
  public freehandDrawingTool: go.Tool;
  public pds:PanelDevice;

  public window: Window;

  public nodeIndex = 0;

  public locationStr: string;

  public diagramDivClassName: string = 'myDiagramDiv';

  public diagramModelData = { prop: 'value' };

  public skipsDiagramUpdate = false;

  public diagramNodeData: Array<go.ObjectData> = [];

  public subscription2: Subscription;
  public subscription3: Subscription;
  public subscription4: Subscription;
  public subscription5: Subscription;

  constructor(public service: InteractionProxyService, public selectionService: SelectionServiceService,
    public panelDeviceService: PanelDeviceService, public rightclickContextService: RightclickContextService, public gojsToolService: GojsToolService) { }

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

        if (data.constructor.name.localeCompare('Object') == 0){
          data = pd;
        }
      
        if ( src['propertyName'].localeCompare('x') == 0 || src['propertyName'].localeCompare('y') == 0)
          model.set(data, "location", go.Point.stringify(new go.Point(pd.x,pd.y)));
        else
          // Set position
            
             model.raiseDataChanged(data, src['propertyName'], src['old'], src['newValue']);
            }, 'update node');

    });

    this.subscription4 = this.rightclickContextService.OnRightClickContextSelect.subscribe( (selection:string) => 
    {
      this.diagramPanel.nodes.each((node:go.Node) =>{
        node.zOrder = 0;
      })

      if(selection.localeCompare('Bring to Front') == 0)
      {
        this.selectedNode.zOrder = 1;
      }
      else if (selection.localeCompare('Send to back') == 0)
      {
        this.selectedNode.zOrder = -1;
      }
    });

    this.subscription5 = this.gojsToolService.OnGoJsToolEnabled.subscribe ((pd: PanelDevice) => {
      //Enabled PolygonDrawingTool
      var polygonTool = this.diagramPanel.toolManager.findTool("PolygonDrawing") as PolygonDrawingTool;
      this.polygonDrawingTool = polygonTool;
      polygonTool.isEnabled = this.gojsToolService.isPolygonToolEnabled;
      polygonTool.isPolygon = true;
      polygonTool.archetypePartData.fill = "blue";
      this.pds = pd;
      
      if (this.gojsToolService.isPolylienToolEnabled){
        polygonTool.isPolygon = !this.gojsToolService.isPolylienToolEnabled;
        polygonTool.archetypePartData.fill = "transparent";
      }
      //Enabled FreenhandDrawingTool
      var freehandTool = this.diagramPanel.toolManager.findTool("FreehandDrawing");
      this.freehandDrawingTool = freehandTool;
      freehandTool.isEnabled = this.gojsToolService.isFreehandToolEnabled;
      //initialize 
      this.gojsToolService.isPolygonToolEnabled = false;
      this.gojsToolService.isPolylienToolEnabled = false;
      this.gojsToolService.isFreehandToolEnabled = false;
    })
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
        if (node.data.constructor.name.localeCompare('Object') == 0){
          this.pds.key = node.data.key;
          this.pds.location = node.data.location;
          node.data = this.pds;
        }
        this.service.diagramChanged(this.selectedNode);
        this.selectionService.selectPanelDevice = node.data as PanelDevice;
      }
      else {
        this.selectedNode = null;
      }
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

    this.myDiagramComponent.diagram.addDiagramListener('ObjectContextClicked', (event) => {
      //show node context menu
      var mousePt = this.diagramPanel.lastInput.viewPoint;
      this.rightclickContextService.OnRightClickMenuCall.next({x:mousePt.x, y:mousePt.y});
      //alert()
    });

    this.myDiagramComponent.diagram.addDiagramListener('BackgroundSingleClicked', (event) => {
      var contextMenuDiv = document.getElementById("context");
      contextMenuDiv.style.display = "none";
    });

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
        $(go.Shape, 
          //{ stroke: 'blue'},
          new go.Binding('fill', 'color'),
          new go.Binding('stroke', 'borderColor'),
          new go.Binding('figure', 'shape')
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
      )
      dia.nodeTemplateMap.add("tool",
      $(go.Node,
         { locationSpot: go.Spot.Center, isLayoutPositioned: false },
         {
          selectionAdorned: true, selectionObjectName: "SHAPE",
          selectionAdornmentTemplate:  // custom selection adornment: a blue rectangle
            $(go.Adornment, "Auto",
              $(go.Shape, { stroke: "dodgerblue", fill: null }),
              $(go.Placeholder, { margin: -1 }))
        },
        { resizable: true, resizeObjectName: "SHAPE" },
        { rotatable: true, rotateObjectName: "SHAPE" },
        { reshapable: true },  // GeometryReshapingTool assumes nonexistent Part.reshapeObjectName would be "SHAPE"
        $(go.Shape,
          { name: "SHAPE", fill: 'blue', stroke: 'blue', strokeWidth: 1 },
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
          new go.Binding("angle").makeTwoWay(),
          new go.Binding("geometryString", "geo").makeTwoWay(),
          new go.Binding("fill", "fill"),
          new go.Binding("stroke", "lineColor"),
          new go.Binding("strokeWidth", "lineWidth")),

          new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
          // new go.Binding("width", "width").makeTwoWay(),
          // new go.Binding("height", "height").makeTwoWay(),
      ));

      var polygonTool = new PolygonDrawingTool();
      polygonTool.archetypePartData =
        { fill: "blue", stroke: "red", strokeWidth: 1, category: "tool"},
        polygonTool.isEnabled = false;
      dia.toolManager.mouseDownTools.insertAt(0, polygonTool);

      var freehandTool = new FreehandDrawingTool();
      freehandTool.archetypePartData = 
          { fill:"transparent", stroke: "green", strokeWidth: 1, category: "tool"};
      freehandTool.isEnabled = false;
      freehandTool.isBackgroundOnly = false;
      dia.toolManager.mouseDownTools.insertAt(1, freehandTool);

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

  public doubleClickScreenField(event:any){
    //stop the polygon drawing tool when double click
    this.polygonDrawingTool.isEnabled = false;
    //stop the freen hand drawing when double click
    this.freehandDrawingTool.isEnabled = false;
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
