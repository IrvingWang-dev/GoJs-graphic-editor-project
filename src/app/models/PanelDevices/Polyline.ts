import { Editor } from "../Editor";
import { PanelDevice } from "../PanelDevice";

export class Polyline extends PanelDevice 
{
    // @Reflect.metadata(Editor, "color")
    // public fill : string = "transparent";

    @Reflect.metadata(Editor, "color")
    public lineColor : string = "#0000FF";

    @Reflect.metadata(Editor, "number")
    public lineWidth : number = 1;

    @Reflect.metadata(Editor, "tag")
    public HeightTag : string = "";

    @Reflect.metadata(Editor, "tag")
    public HoriPosTag : string = "";

    @Reflect.metadata(Editor, "tag")
    public VertiPosTag : string = "";

    @Reflect.metadata(Editor, "tag")
    public VisibTag : string = "";

    @Reflect.metadata(Editor, "tag")
    public WidthTag : string = "";
}