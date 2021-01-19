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
<<<<<<< HEAD
import { ScreenEditorComponent } from './screen-editor/screen-editor.component';
import { SelectedViewComponent } from './selected-view/selected-view.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
=======
import { EditorListComponent } from './editor-list/editor-list.component';
>>>>>>> b32c444dc58f12e5819769169ecd8449268683f3

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
