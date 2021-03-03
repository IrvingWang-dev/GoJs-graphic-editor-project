import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RightclickContextService } from '../../services/rightclick-context.service';

@Component({
  selector: 'app-rightclick-context',
  templateUrl: './rightclick-context.component.html',
  styleUrls: ['./rightclick-context.component.css']
})
export class RightclickContextComponent implements OnInit {

  public value:string;
  public subscription: Subscription;

  contextItems = ["Bring to Front", "Send to back"];

  constructor(public rightClickContextService : RightclickContextService) { }

  ngOnInit(): void {

    this.subscription = this.rightClickContextService.OnRightClickMenuCall.subscribe((src) => {
      var contextMenuDiv = document.getElementById("context");
      contextMenuDiv.style.position = "absolute";
      contextMenuDiv.style.left = src['x'] + 420 + "px";
      contextMenuDiv.style.top = src['y'] + 70 + "px";
      contextMenuDiv.style.display = "block";
    });
  }

  onSelect(item:string) {
    this.value = item;

    this.rightClickContextService.OnRightClickContextSelect.next(this.value);
    this.HideContextMenu();

  }

  public HideContextMenu(){
    var contextMenuDiv = document.getElementById("context");
    if (contextMenuDiv.style.display == "block"){
      contextMenuDiv.style.display = "none";
    }
  }

}
