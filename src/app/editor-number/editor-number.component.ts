import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor-number',
  templateUrl: './editor-number.component.html',
  styleUrls: ['./editor-number.component.css']
})
export class EditorNumberComponent implements OnInit {

  @Input()
  item : Object;
  
  //value: number;

  constructor() {
    //this.value = this.item["PD"][this.item["KEY"]];
   }

  ngOnInit(): void {
    console.log(this.item);
  }

  onKey(event: any) { // without type info
    
    this.item["PD"][this.item["KEY"]] = parseInt(event.target.value);
    console.log(this.item);
  }

}
