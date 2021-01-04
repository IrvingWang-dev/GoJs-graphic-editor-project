import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GojsAngularModule } from 'gojs-angular';
import { AppComponent } from './app.component';

import { CustomerPanelComponent } from './components/customer-panel/customer-panel.component';
import { PropertyPanelComponent } from './components/property-panel/property-panel.component';
import { ToolboxComponent } from './toolbox/toolbox.component';
import { EditorNumberComponent } from './editor-number/editor-number.component';
import { EditorStringComponent } from './editor-string/editor-string.component';


@NgModule({
  declarations: [
    AppComponent,
    CustomerPanelComponent,
    PropertyPanelComponent,
    ToolboxComponent,
    EditorNumberComponent,
    EditorStringComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    GojsAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
