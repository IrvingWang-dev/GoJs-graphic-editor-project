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
import { EditorColorComponent } from './editor-color/editor-color.component';
import { ScreenEditorComponent } from './screen-editor/screen-editor.component';
import { SelectedViewComponent } from './selected-view/selected-view.component';

import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    CustomerPanelComponent,
    PropertyPanelComponent,
    ToolboxComponent,
    EditorNumberComponent,
    EditorStringComponent,
    EditorColorComponent,
    ScreenEditorComponent,
    SelectedViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    GojsAngularModule,
    DragDropModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
