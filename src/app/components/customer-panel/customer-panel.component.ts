import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Type, ViewChild, ViewEncapsulation } from '@angular/core';
import * as go from 'gojs';
import { DataSyncService, DiagramComponent } from 'gojs-angular';
import { Subscription } from 'rxjs';
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
import { PRIMARY_OUTLET } from '@angular/router';
import { Editor } from 'src/app/models/Editor';
import Chart from 'chart.js';

@Component({
  selector: 'app-customer-panel',
  templateUrl: './customer-panel.component.html',
  styleUrls: ['./customer-panel.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CustomerPanelComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('myDiagram', { static: true }) public myDiagramComponent: DiagramComponent;

  public animation : any;
  
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
  public subscription6: Subscription;

  constructor(public service: InteractionProxyService, public selectionService: SelectionServiceService,
    public panelDeviceService: PanelDeviceService, public rightclickContextService: RightclickContextService, public gojsToolService: GojsToolService) { }

  ngOnInit(): void {
    

    this.subscription2 = currentScreen.OnPanelDeviceChanged.subscribe( (pd :PanelDevice) =>
    {
        this.AddPanelDevice(pd);
    });

    this.subscription2 = currentScreen.OnTrendChanged.subscribe((pd: PanelDevice) => 
    {
      this.AddTrend(pd);
      //console.log("hello");
    });

    this.subscription3 = this.panelDeviceService.OnPropertiesChanged.subscribe( (src) =>
    {
        // Use model's commit to update node.
        this.diagramPanel.model.commit((model) => {

        let linkModal = model as go.GraphLinksModel;
        let pd = src['pd'] as PanelDevice;
        var nodeKeys = pd.key;

        if (Array.isArray(nodeKeys)){
          nodeKeys.forEach((key) => {
            model.nodeDataArray.forEach((nodeData => {
              if (nodeData.key === key){
                if ( src['propertyName'].localeCompare('x') == 0){
                  nodeData.x = pd.x;
                  nodeData.location = go.Point.stringify(new go.Point(pd.x,nodeData.y));
                  model.raiseDataChanged(nodeData, 'location', nodeData.location, nodeData.location);
                }
                else if (src['propertyName'].localeCompare('y') == 0){
                  nodeData.y = pd.y;
                  nodeData.location = go.Point.stringify(new go.Point(nodeData.x,pd.y));
                  model.raiseDataChanged(nodeData, 'location', nodeData.location, nodeData.location);
                }     
                else{
                  nodeData[src['propertyName']] = src['newValue'];
                  model.raiseDataChanged(nodeData, src['propertyName'], src['old'], src['newValue']);
                }
              }
            }))
          });
          return;
        }

        let data = linkModal.findNodeDataForKey(pd.key);     
        if ( src['propertyName'].localeCompare('x') == 0 || src['propertyName'].localeCompare('y') == 0)
          model.set(data, "location", go.Point.stringify(new go.Point(pd.x,pd.y)));
        else
          // Set position     
          model.set(data, src['propertyName'], src['newValue']);     
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

    this.subscription5 = this.gojsToolService.OnGoJsToolEnabled.subscribe ((pd: PanelDevice) => 
    {
      //Enabled PolygonDrawingTool
      var polygonTool = this.diagramPanel.toolManager.findTool("PolygonDrawing") as PolygonDrawingTool;
      this.polygonDrawingTool = polygonTool;
      polygonTool.isEnabled = this.gojsToolService.isPolygonToolEnabled;
      polygonTool.isPolygon = true;
      this.pds = pd;

      if (this.gojsToolService.isPolylienToolEnabled){
        polygonTool.isPolygon = !this.gojsToolService.isPolylienToolEnabled;
        polygonTool.archetypePartData.color = "transparent";
      }
      //Enabled FreenhandDrawingTool
      var freehandTool = this.diagramPanel.toolManager.findTool("FreehandDrawing") as FreehandDrawingTool;
      freehandTool.archetypePartData.color = "transparent";
      this.freehandDrawingTool = freehandTool;
      freehandTool.isEnabled = this.gojsToolService.isFreehandToolEnabled;
      
      //initialize 
      this.gojsToolService.isPolygonToolEnabled = false;
      this.gojsToolService.isPolylienToolEnabled = false;
      this.gojsToolService.isFreehandToolEnabled = false;

      currentScreen._panelDevices.push(pd);
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
      if (event.diagram.selection.count === 0) {
        this.selectedNode = null;
        return;
      } 
      else if (event.diagram.selection.count > 1){
        var selectNodesData = [];
        var commonObject = new PanelDevice();
        var nodeKeys = [];
        
        event.diagram.selection.each((node: go.Node)=> {
          selectNodesData.push(node.data);
          nodeKeys.push(node.data.key);
        })

        var commonProtAndType = {};
        var firstSelectNodeData = selectNodesData.shift();
        var commonProt = (Object.keys(firstSelectNodeData)).filter(function(key) {
            if (Reflect.hasMetadata(Editor, firstSelectNodeData, key)){
              return selectNodesData.every(function(selectData){
                if (Reflect.hasMetadata(Editor, selectData, key)){
                  return Object.keys(selectData).indexOf(key) !== -1;
                }             
              })
            }
          });  

        commonProt.push('key');
        commonProt.forEach((key) => {
          if (Reflect.hasMetadata(Editor, firstSelectNodeData, key)){
            commonProtAndType[key] = Reflect.getMetadata(Editor, firstSelectNodeData, key);
          }});

        commonObject = commonObject = JSON.parse(JSON.stringify(firstSelectNodeData));
        Object.keys(commonObject).forEach((key) => {
          if (commonProt.indexOf(key) === -1){
            delete commonObject[key];
          }
          else if (key.localeCompare('key') == 0){
            commonObject[key] = nodeKeys;
          }
          else{
            if (commonProtAndType[key] === 'string'){
              commonObject[key] = '';
            } 
            else if (commonProtAndType[key] === 'number'){
              commonObject[key] = 0;
            }
            else if (commonProtAndType[key] === 'color') {
              commonObject[key] = '#0000FF';
            }
          }
        })
          
        Object.setPrototypeOf(commonObject, Object.getPrototypeOf(firstSelectNodeData));   
        this.selectionService.selectPanelDevice = commonObject;
        return;
      }
      // Only handle one node for properties panel.
      const node = event.diagram.selection.first();
      if (node instanceof go.Node) {
        
        this.selectedNode = node;
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
      pd.width = this.selectedNode.actualBounds.width;
      pd.height = this.selectedNode.actualBounds.height;
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

    window.addEventListener("mouseup", (event)=>{
      this.SelectToolCreateNode(this.freehandDrawingTool);
    });

  } 

  /**
   * Passed to gojs-diagram component to initialize diagram.
   */
  public initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;
    const dia = $(go.Diagram, {
      'undoManager.isEnabled': true,
      "panningTool.isEnabled": false,
      model: $(go.GraphLinksModel,
        {
          // Must set below property or there will be error after dragging item.
          linkKeyProperty: 'key' // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        }
      )
    });

    //define the Node template
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
        $(go.Picture, 
          {width: 300, height: 200, portId: ""},
          new go.Binding("element", "datasets", makeLineChart)),
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

    // dia.nodeTemplate =
    // $(go.Node, "Auoto",{
    //   resizable:true,
    // },

    //   $(go.Panel, "Auto",
    //     $(go.Shape, { fill: "transparent" },
    //       new go.Binding("stroke", "color")),
    //     $(go.Picture,
    //       { width: 300, height: 150, portId: "" },
    //       new go.Binding("element", "datasets", makeLineChart))
    //   ),
    //   $(go.TextBlock,
    //     { margin: 8 },
    //     new go.Binding("text")),
    // );

    function makeLineChart(datasets, picture) {
      var canvases = document.getElementById("myCanvases");
      var canv = document.createElement("canvas");
      canv.style.width = "600px";
      canv.style.height = "300px";

      var div = document.createElement("div");
      div.style.position = "absolute";
      div.appendChild(canv);
      canvases.appendChild(div);

      var config = {  // Chart.js configuration, including the DATASETS data from the model data
        type: "line",
        data: {
          labels: ["1:47:12PM", "1:47:42PM", "1:48:12PM", "1:48:42PM"],
          datasets: datasets
        },
        options: {
          animation: {
            onProgress: function() { picture.redraw(); },
            onComplete: function() {
              var canvases = document.getElementById("myCanvases");
              if (canvases) {  // remove the Canvas that was in the DOM for rendering
                canvases.removeChild(div);
              }
              picture.redraw();
            }
          }
        }
      };

      new Chart(canv, config);
      return canv;
    }

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
          new go.Binding("fill", "color"),
          new go.Binding("stroke", "lineColor"),
          new go.Binding("strokeWidth", "lineWidth"),
          new go.Binding("width", "width").makeTwoWay(),
          new go.Binding("height", "height").makeTwoWay()),

          new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify)
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

      dia.groupTemplate =
      $(go.Group, "Vertical",
        {
          selectionObjectName: "PANEL",       // selection handle goes around shape, not label
        },                                    // enable Ctrl-Shift-G to ungroup a selected Group
        $(go.TextBlock,
          {
            font: "bold 19px sans-serif",
            isMultiline: false,               // don't allow newlines in text
            editable: true                    // allow in-place editing by user
          },
          new go.Binding("text", "text").makeTwoWay(),
          new go.Binding("stroke", "color")),
        $(go.Panel, "Auto",
          { name: "PANEL" },
          $(go.Shape, "Rectangle",            // the rectangular shape around the members
            { fill: "color", stroke: "gray", strokeWidth: 3 }),
          $(go.Placeholder, { padding: 10 })  // represents where the members are
        )
      );

    return dia;
  }

  public doubleClickScreenField(event:any){
    //stop the polygon drawing tool and select the when double click
    this.SelectToolCreateNode(this.polygonDrawingTool);

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

  public AddTrend(pd: PanelDevice)
  {
    var color = "transparent";
    var data = {
      text: "Node ",
      color: color,
      location: "1 1",
      datasets: [{
        label: "Trend",
        fill: false,
        backgroundColor: color,
        borderColor: color,
        data: [3,1,2,4],
      }]
    };
      this.diagramPanel.model.commit((diagram) =>{
      diagram.addNodeData(data);
    }, "added chart node");
  }

  public SelectToolCreateNode(tool:go.Tool){
    if (tool.isEnabled){
      tool.isEnabled = false;
      var nodeData = this.diagramPanel.model.nodeDataArray[this.diagramPanel.model.nodeDataArray.length - 1];
      this.pds.key = nodeData.key;
      this.pds.location = nodeData.location;
      this.pds.width = this.diagramPanel.findNodeForKey(nodeData.key).actualBounds.width;
      this.pds.height = this.diagramPanel.findNodeForKey(nodeData.key).actualBounds.height;
      Object.keys(this.pds).forEach((prop) => {
        this.diagramPanel.model.setDataProperty(this.diagramPanel.findNodeForKey(nodeData.key).data, prop, this.pds[prop]);
      });
      Object.setPrototypeOf(this.diagramPanel.findNodeForKey(nodeData.key).data, Object.getPrototypeOf(this.pds));
      this.diagramPanel.select(this.diagramPanel.findNodeForData(nodeData));
    }
  }



  TrendClick(event:any){
    this.animation = setInterval( () => { 
      var pd = this.selectedNode.data;
      pd.x += 10;
      this.diagramPanel.model.set(this.selectedNode.data, "location", go.Point.stringify(new go.Point(pd.x,pd.y)));

      console.log(pd.x)
      
  }, 1000);




    // this.diagramPanel.model.commit(function(m) {
    //   //var firstnode = this.diagramPanel.nodes.first();
    //   var color = go.Brush.darken(go.Brush.randomColor());
    //   var data = {
    //     text: "Node ",
    //     color: color,
    //     datasets: [{
    //       label: "some data",
    //       fill: false,
    //       backgroundColor: color,
    //       borderColor: color,
    //       data: [1,2,3,4]
    //     }]
    //   };
    //   m.addNodeData(data);
    //   // if (firstnode) {
    //   //   m.addLinkData({ from: firstnode.key, to: m.getKeyForNodeData(data) });
    //   //   // new node starts off at same location as the parent node
    //   //   var newnode = myDiagram.findNodeForData(data);
    //   //   if (newnode) newnode.location = firstnode.location;
    //   // }
    // }, "added chart node");
  }


}
