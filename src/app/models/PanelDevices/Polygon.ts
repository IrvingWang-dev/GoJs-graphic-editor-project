import { Editor } from "../Editor";
import { PanelDevice } from "../PanelDevice";

export class Polygon extends PanelDevice 
{

    @Reflect.metadata(Editor, "color")
    public fill : string = "#0000FF";

    @Reflect.metadata(Editor, "color")
    public lineColor : string = "#0000FF";

    @Reflect.metadata(Editor, "number")
    public lineWidth : number = 1;
}