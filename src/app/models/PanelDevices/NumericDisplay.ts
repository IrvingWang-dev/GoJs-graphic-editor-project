import { Editor } from "../Editor";
import { PanelDevice } from "../PanelDevice";

export class NumericDisplay extends PanelDevice 
{
    @Reflect.metadata(Editor, "string")
    public readTag : string = "";


    @Reflect.metadata(Editor, "color")
    public backcolor : string;


    @Reflect.metadata(Editor, "color")
    public frontcolor : string = "";
    
    @Reflect.metadata(Editor, "list")
    public shape : string = "Rectangle";
}