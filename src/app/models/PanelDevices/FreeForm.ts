import { Editor } from "../Editor";
import { PanelDevice } from "../PanelDevice";

export class FreeForm extends PanelDevice 
{ 
    @Reflect.metadata(Editor, "color")
    public fill : string = "transparent";

    @Reflect.metadata(Editor, "color")
    public line : string = "Blue";

    @Reflect.metadata(Editor, "number")
    public lineWidth : number = 1;
}