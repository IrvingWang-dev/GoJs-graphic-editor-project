import { Editor } from "../Editor";
import { PanelDevice } from "../PanelDevice";

export class NumericEntry extends PanelDevice 
{
    @Reflect.metadata(Editor, "string")
    public writeTag : string = "";

    @Reflect.metadata(Editor, "list")
    public shape : string = "Rectangle";
}