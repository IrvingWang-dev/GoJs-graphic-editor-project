import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GojsAngularModule } from 'gojs-angular';
import { AppComponent } from './app.component';

import { CustomerPanelComponent } from './components/customer-panel/customer-panel.component';
import { PropertyPanelComponent } from './components/property-panel/property-panel.component';
import { ToolboxComponent } from './components/toolbox/toolbox.component';
import { EditorNumberComponent } from './components/editor-number/editor-number.component';
import { EditorStringComponent } from './components/editor-string/editor-string.component';
import { EditorColorComponent } from './components/editor-color/editor-color.component';
import { ScreenEditorComponent } from './components/screen-editor/screen-editor.component';
import { SelectedViewComponent } from './components/selected-view/selected-view.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditorListComponent } from './components/editor-list/editor-list.component';

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
    SelectedViewComponent,
    EditorListComponent
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
