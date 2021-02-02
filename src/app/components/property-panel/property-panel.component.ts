import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { SelectionServiceService } from 'src/app/services/selection-service.service'
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

  public subscription: Subscription;

  constructor(public selectionService: SelectionServiceService) { }

  ngOnInit(): void {
    this.subscription = this.selectionService.OnSelectionChanged.subscribe((data: number) => {

      this.OnUpdate();
    });

    this.OnUpdate();
  }

  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe : null;
  }

  /**
   * Update existing node.
   */
  public editors = [];
  public pdProeprty: string = '';

  public OnUpdate() {
    let pd = this.selectionService.selectPanelDevice;

    this.pdProeprty = pd.constructor.name;
    if (this.pdProeprty.localeCompare('PanelDevice') == 0) {
      this.pdProeprty = ''; 
    }
    else if (Array.isArray(pd.key)){
      this.pdProeprty = 'PanelDevice';
    }

    let keys = Object.keys(pd);

    this.editors = [];
    keys.forEach(key => {
      if (Reflect.hasMetadata(Editor, pd, key)) {
        let metadata = Reflect.getMetadata(Editor, pd, key);
        
        this.editors.push({ "PD": pd, "KEY": key, "type": metadata });
      }
    });


  }
}
