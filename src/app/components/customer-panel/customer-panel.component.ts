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
import { Groups } from 'src/app/models/PanelDevices/Groups';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-customer-panel',
  templateUrl: './customer-panel.component.html',
  styleUrls: ['./customer-panel.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CustomerPanelComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('myDiagram', { static: true }) public myDiagramComponent: DiagramComponent;

  public animation : any;
  public nodeTemplate : go.Node;
  
  public diagramPanel: go.Diagram;
  public Group: go.Group;

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

        else if (pd.constructor.name.localeCompare('Trend') == 0){
          Object.keys(src.pd['datasets'][0]).forEach((key) => {
            if (key.localeCompare(src['propertyName']) == 0){
              src.pd['datasets'][0][src['propertyName']] = src['newValue'];  
              model.set(data, 'datasets', src.pd['datasets']);
              model.raiseDataChanged(data, 'datasets', src.pd['datasets'], src.pd['datasets']);
            }
          })
        }
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
      else if (selection.localeCompare('Group') == 0)
      {
        this.diagramPanel.commandHandler.groupSelection();
      }
      else if (selection.localeCompare('UnGroup') == 0)
      {
        this.diagramPanel.commandHandler.ungroupSelection();
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

      //currentScreen._panelDevices.push(pd);
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
        var nodeKeys = [];
        
        event.diagram.selection.each((node: go.Node)=> {
          selectNodesData.push(node.data);
          nodeKeys.push(node.data.key);
        })

        this.selectionService.selectPanelDevice = FilterCommonProerties(selectNodesData, nodeKeys);
        return;
      }
      // Only handle one node for properties panel.
      const selectinoNode = event.diagram.selection.first();
      if (selectinoNode instanceof go.Node) {  
        if (selectinoNode.data.isGroup){
          selectinoNode.data.width = selectinoNode.actualBounds.width;
          selectinoNode.data.height = Math.round(selectinoNode.actualBounds.height);
        }   

        if (selectinoNode.data.group){
          var groupNode = this.diagramPanel.findNodeForKey(selectinoNode.data.group);
          if(!groupNode.isHighlighted){
            this.diagramPanel.select(groupNode);
          }
        }

        this.selectedNode = selectinoNode;
        this.service.diagramChanged(this.selectedNode);
        this.selectionService.selectPanelDevice = selectinoNode.data as PanelDevice;
      }
      else {
        this.selectedNode = null;
      }
    });

    function FilterCommonProerties(selectNodesData: any, nodeKeys: any) {
      var commonObject = new PanelDevice();
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

      commonObject = JSON.parse(JSON.stringify(firstSelectNodeData));
      Object.keys(commonObject).forEach((key) => {
        if (commonProt.indexOf(key) === -1){
          delete commonObject[key];
        }
        else if (key.localeCompare('key') == 0){
          commonObject[key] = nodeKeys;
        }
        else {
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
      return commonObject;
    }

    // Size of node was changed.
    this.diagramPanel.addDiagramListener('PartResized', (event) => {
      let pd = this.selectionService.selectPanelDevice;

      var detaWidth = this.selectedNode.actualBounds.width - pd.width;
      var detaheight = Math.round(this.selectedNode.actualBounds.height - pd.height);
      pd.width = this.selectedNode.actualBounds.width;
      pd.height = Math.round(this.selectedNode.actualBounds.height);

      // if (pd.constructor.name.localeCompare("Groups") == 0){  
      //   ModifyGroupsMembersSize("width", detaWidth, pd as Groups, this.diagramPanel, this.panelDeviceService)
      //   ModifyGroupsMembersSize("height", detaheight, pd as Groups, this.diagramPanel, this.panelDeviceService)
      // }
      // this is only a update to tell others update the properties, this may not very good!
      this.selectionService.OnSelectionChanged.next(1);
    });

    // function ModifyGroupsMembersSize(direction:string, width: any, groupObject: Groups, diagramPanel: go.Diagram, service: PanelDeviceService) {
    //   if (groupObject.memberKeys){
    //     groupObject.memberKeys.forEach((key) => {
    //       var nodeData = diagramPanel.model.findNodeDataForKey(key);
    //       service.OnPropertiesChanged.next({ 
    //       pd: nodeData, 
    //       propertyName: direction,
    //       old: nodeData.width,
    //       newValue: nodeData.width + width})
    //     })
    //   }
    // }

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
    });

    this.myDiagramComponent.diagram.addDiagramListener('BackgroundSingleClicked', (event) => {
      var contextMenuDiv = document.getElementById("context");
      contextMenuDiv.style.display = "none";
    });

    this.myDiagramComponent.diagram.addDiagramListener('SelectionGrouped', (event) => {
      //Set the Group prototype to the Group node data
      var groupNodeData = this.diagramPanel.model.nodeDataArray[this.diagramPanel.model.nodeDataArray.length - 1];
      var groupObject = new Groups();
      Object.setPrototypeOf(groupNodeData, Object.getPrototypeOf(groupObject));

      //Find Group member parts
      var groupNode = this.diagramPanel.findNodeForKey(groupNodeData.key) as go.Group
      var memberKeys = [];
      groupNode.memberParts.each( (part) => {
        memberKeys.push(part.data.key);
      }) 
      groupNodeData["memberKeys"] = memberKeys;
      groupNodeData["width"] = 0;
      groupNodeData["height"] = 0;
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
    go.Diagram.licenseKey = "73f14fe1b60537c702d90776423d6af919a17564ce8149a30c0411f3ed0d6a06329de17150d08fc9d4aa1cfc4a7e9789ddc26b7a9f4a5139b232d4d944e2d2f1b23024e71209468bf05626949efd2ba8ae6a61f497e571a288288de0fbabc29f5df7f6cb48cd";
    const dia = $(go.Diagram, {
      'undoManager.isEnabled': true,
      "panningTool.isEnabled": false,
      "commandHandler.archetypeGroupData": { text: "", isGroup: true, color: "transparent" },
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

    var trendTemplate =
     $(go.Node, "Auoto",{
        resizable:true,
      },
      $(go.Panel, "Auto",
        $(go.Shape, { fill: "transparent" },
          new go.Binding("stroke", "color")),
        $(go.Picture,
          { width: 300, height: 150, portId: "" },
          new go.Binding("element", "datasets", makeLineChart))
      ),
      $(go.TextBlock,
        { margin: 8 },
        new go.Binding("text")),
    );

    dia.nodeTemplateMap.add("trendTemplate", trendTemplate);

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

    function sliderActions(alwaysVisible) {
      return [
        {
          isActionable: true,
          actionDown: function(e, obj) {
            obj._dragging = true;
            obj._original = obj.part.data.value;
          },
          actionMove: function(e, obj) {
            if (!obj._dragging) return;
            var scale = obj.part.findObject("SCALE");
            var pt = e.diagram.lastInput.documentPoint;
            var loc = scale.getLocalPoint(pt);
            var val = Math.round(scale.graduatedValueForPoint(loc));
            // just set the data.value temporarily, not recorded in UndoManager
            e.diagram.model.commit(function(m) {
              m.set(obj.part.data, "value", val);
            }, null);  // null means skipsUndoManager
          },
          actionUp: function(e, obj) {
            if (!obj._dragging) return;
            obj._dragging = false;
            var scale = obj.part.findObject("SCALE");
            var pt = e.diagram.lastInput.documentPoint;
            var loc = scale.getLocalPoint(pt);
            var val = Math.round(scale.graduatedValueForPoint(loc));
            e.diagram.model.commit(function(m) {
              m.set(obj.part.data, "value", obj._original);
            }, null);  // null means skipsUndoManager
            // now set the data.value for real
            e.diagram.model.commit(function(m) {
              m.set(obj.part.data, "value", val);
            }, "dragged slider");
          },
          actionCancel: function(e, obj) {
            obj._dragging = false;
            e.diagram.model.commit(function(m) {
              m.set(obj.part.data, "value", obj._original);
            }, null);  // null means skipsUndoManager
          }
        },
        (alwaysVisible ? {} : new go.Binding("visible", "isEnabled").ofObject("SCALE")),
        new go.Binding("cursor", "isEnabled", function(e) { return e ? "pointer" : ""; }).ofObject("SCALE")
      ];
    }

    // These helper functions simplify the node templates

    function commonScaleBindings() {
      return [
        new go.Binding("graduatedMin", "min"),
        new go.Binding("graduatedMax", "max"),
        new go.Binding("graduatedTickUnit", "unit"),
        new go.Binding("isEnabled", "editable")
      ];
    }

    function commonSlider(vert) {
      return $(go.Shape, "RoundedRectangle",
        {
          name: "SLIDER",
          fill: "white",
          desiredSize: (vert ? new go.Size(20, 6) : new go.Size(6, 20)),
          alignment: (vert ? go.Spot.Top : go.Spot.Right)
        },
        sliderActions(false)
      );
    }

    function commonNodeStyle() {
      return [
        { locationSpot: go.Spot.Center },
        { fromSpot: go.Spot.BottomRightSides, toSpot: go.Spot.TopLeftSides },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      ];
    }

    var gaugesTemplate =
        $(go.Node, "Auto", 
        {resizable: true},
        commonNodeStyle(),
          $(go.Shape, { fill: "darkslategray" }),
          $(go.Panel, "Spot",
            $(go.Panel, "Position",
              $(go.Panel, "Graduated",
                { name: "SCALE", margin: 10 },
                commonScaleBindings(),
                $(go.Shape, { name: "PATH", geometryString: "M0 0 A120 120 0 0 1 200 0", stroke: "white" }),
                $(go.Shape, { geometryString: "M0 0 V10", stroke: "white" }),
                $(go.TextBlock,
                  { segmentOffset: new go.Point(0, 12), segmentOrientation: go.Link.OrientAlong, stroke: "white" })
              ),
              $(go.Shape,
                { stroke: "red", strokeWidth: 4, isGeometryPositioned: true },
                new go.Binding("geometry", "value", function(v, shp) {
                  var scale = shp.part.findObject("SCALE");
                  var pt = scale.graduatedPointForValue(v);
                  var geo = new go.Geometry(go.Geometry.Line);
                  geo.startX = 100 + scale.margin.left;
                  geo.startY = 90 + scale.margin.top;
                  geo.endX = pt.x + scale.margin.left;
                  geo.endY = pt.y + scale.margin.top;
                  return geo;
                }),
                sliderActions(true))
            ),
            $(go.TextBlock,
              { alignment: new go.Spot(0.5, 0.5, 0, 20), stroke: "white", font: "bold 10pt sans-serif" },
              new go.Binding("text"),
              new go.Binding("stroke", "color")),
            $(go.TextBlock,
              { alignment: go.Spot.Top, margin: new go.Margin(4, 0, 0, 0) },
              { stroke: "white", font: "bold italic 13pt sans-serif", isMultiline: false, editable: true },
              new go.Binding("text", "value", function(v) { return v.toString(); }).makeTwoWay(function(s) { return parseFloat(s); }),
              new go.Binding("stroke", "color"))
          )
        );
      
      dia.nodeTemplateMap.add("gaugesTemplate", gaugesTemplate);

      var circularMeterTemplate = 
        $(go.Node, "Table", 
          {resizable: true},
          commonNodeStyle(),
          $(go.Panel, "Auto",
            { row: 0 },
            $(go.Shape, "Circle",
              { stroke: "orange", strokeWidth: 5, spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight },
              new go.Binding("stroke", "color")),
            $(go.Panel, "Spot",
              $(go.Panel, "Graduated",
                {
                  name: "SCALE", margin: 14,
                  graduatedTickUnit: 2.5,  // tick marks at each multiple of 2.5
                  stretch: go.GraphObject.None  // needed to avoid unnecessary re-measuring!!!
                },
                commonScaleBindings(),
                // the main path of the graduated panel, an arc starting at 135 degrees and sweeping for 270 degrees
                $(go.Shape, { name: "PATH", geometryString: "M-70.7 70.7 B135 270 0 0 100 100 M0 100", stroke: "white", strokeWidth: 4 }),
                // three differently sized tick marks
                $(go.Shape, { geometryString: "M0 0 V10", stroke: "white", strokeWidth: 1 }),
                $(go.Shape, { geometryString: "M0 0 V12", stroke: "white", strokeWidth: 2, interval: 2 }),
                $(go.Shape, { geometryString: "M0 0 V15", stroke: "white", strokeWidth: 3, interval: 4 }),
                $(go.TextBlock,
                  { // each tick label
                    interval: 4,
                    alignmentFocus: go.Spot.Center,
                    font: "bold italic 14pt sans-serif", stroke: "white",
                    segmentOffset: new go.Point(0, 30)
                  })
              ),
              $(go.TextBlock,
                { alignment: new go.Spot(0.5, 0.9), stroke: "white", font: "bold italic 14pt sans-serif", editable: true },
                new go.Binding("text", "value", function(v) { return v.toString(); }).makeTwoWay(function(s) { return parseFloat(s); }),
                new go.Binding("stroke", "color")),
              $(go.Shape, { fill: "red", strokeWidth: 0, geometryString: "F1 M-6 0 L0 -6 100 0 0 6z x M-100 0" },
                new go.Binding("angle", "value", function(v, shp) {
                  // this determines the angle of the needle, based on the data.value argument
                  var scale = shp.part.findObject("SCALE");
                  var p = scale.graduatedPointForValue(v);
                  var path = shp.part.findObject("PATH");
                  var c = path.actualBounds.center;
                  return c.directionPoint(p);
                }),
                sliderActions(true)),
              $(go.Shape, "Circle", { width: 2, height: 2, fill: "#444" })
            )
          ),
          $(go.TextBlock,
            { row: 1, font: "bold 11pt sans-serif" },
            new go.Binding("text"))
        );
      
      dia.nodeTemplateMap.add("circularMeterTemplate", circularMeterTemplate);

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

      //Group defination
      dia.groupTemplate =
      $(go.Group, "Vertical",
        {
          name:"Group",
          selectionObjectName: "GroupShape",       // selection handle goes around shape, not label
          ungroupable: true,                   // enable Ctrl-Shift-G to ungroup a selected Group
          resizable: true,
          resizeObjectName: "GroupShape",
          locationObjectName: "GroupShape"
        },         
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),                       
        $(go.TextBlock,
          {
            font: "bold 19px sans-serif",
            isMultiline: false,               // don't allow newlines in text
            editable: true                    // allow in-place editing by user
          },
          new go.Binding("text", "text").makeTwoWay(),
          new go.Binding("stroke", "color")),
        $(go.Panel, "Auto",
          { name: "PANEL"},
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
          $(go.Shape, "Rectangle",            // the rectangular shape around the members
          { name: "GroupShape", fill: "transparent", stroke: "transparent", strokeWidth: 1, }),
          $(go.Placeholder, { margin: 5, background: "transparent" })  // represents where the members are
          
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

    // var color = go.Brush.darken(go.Brush.randomColor());
    // var data = {
    //   text: "Trend",
    //   //color: color,
    //   category: "trendTemplate",
    //   datasets: [{
    //     label: "Trend",
    //     fill: false,
    //     backgroundColor: color,
    //     borderColor: color,
    //     data: [5,6,3,8]
    //   }]
    // };

    this.diagramPanel.model.commit((diagram) =>{
      diagram.addNodeData(pd);
    }, "added new node");
  }

  public SelectToolCreateNode(tool:go.Tool){
    if (tool && tool.isEnabled){
      tool.isEnabled = false;
      var nodeData = this.diagramPanel.model.nodeDataArray[this.diagramPanel.model.nodeDataArray.length - 1];
      this.pds.key = nodeData.key;
      this.pds.location = nodeData.location;
      this.pds.width = this.diagramPanel.findNodeForKey(nodeData.key).actualBounds.width;
      this.pds.height = this.diagramPanel.findNodeForKey(nodeData.key).actualBounds.height;
      this.pds.x = go.Point.parse(nodeData.location).x;
      this.pds.y = go.Point.parse(nodeData.location).y;
      Object.keys(this.pds).forEach((prop) => {
        this.diagramPanel.model.setDataProperty(this.diagramPanel.findNodeForKey(nodeData.key).data, prop, this.pds[prop]);
      });
      Object.setPrototypeOf(this.diagramPanel.findNodeForKey(nodeData.key).data, Object.getPrototypeOf(this.pds));
      this.diagramPanel.select(this.diagramPanel.findNodeForData(nodeData));

      currentScreen._panelDevices.push(nodeData as PanelDevice);
    }
  }
}