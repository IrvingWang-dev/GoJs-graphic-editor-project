import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NodeData } from '../models/node-data';

@Injectable({
  providedIn: 'root'
})
export class InteractionProxyService {

  /**
   * Subscribed by diagram panel.
   */
  public propertiesChangedSubject = new Subject<NodeData>();

  /**
   * Subscribed by properties panel.
   */
  public diagramChangedSubject = new Subject<NodeData>();

  constructor() { }

  /**
   * User adds new node from properties panel.
   * @param nodeData NodeData
   */
  public addNewNode(nodeData: NodeData) {
    this.propertiesChangedSubject.next(nodeData);
  }

  /**
   * User updates existing node in properties panel.
   * @param nodeData NodeData
   */
  public updateNode(nodeData: NodeData) {
    this.propertiesChangedSubject.next(nodeData);
  }

  /**
   * When user operates diagram, this method is triggered.
   * @param node go.Node
   */
  public diagramChanged(node: go.Node) {
    
    //const data = this.extractDataFromNode(node);
    //this.diagramChangedSubject.next(data);
  }

  /**
   * Get data from go.Node object.
   * @param node go.Node
   */
  public extractDataFromNode(node: go.Node): NodeData {

    const data = new NodeData();

    if(node) {
      let {width, height} = node.desiredSize;
      if(isNaN(width)) {
        width = node.actualBounds.width;
      }
      if(isNaN(height)) {
        height = node.actualBounds.height;
      }
      data.key = node.data.key;
      data.width = Number(width.toFixed());
      data.height = Number(height.toFixed(0));
      data.left = node.data.loc.split(' ')[0];
      data.top = node.data.loc.split(' ')[1];
      data.label = node.data.label;
      data.color = node.data.color;
    }

    return data;
  }
}
