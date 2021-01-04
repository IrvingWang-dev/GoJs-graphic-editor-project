import { Input, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor-string',
  templateUrl: './editor-string.component.html',
  styleUrls: ['./editor-string.component.css']
})
export class EditorStringComponent implements OnInit {

  @Input()
  item : Object;

  constructor() { }

  ngOnInit(): void {
    console.log(this.item);
  }

  onKey(event: any) { // without type info
    
    this.item["PD"][this.item["KEY"]] = event.target.value;
    console.log(this.item);
  }


}
