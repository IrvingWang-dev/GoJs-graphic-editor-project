import { Editor } from "../Editor";
import { PanelDevice } from "../PanelDevice";

export class NumericEntry extends PanelDevice 
{

    // @Reflect.metadata(Editor, "string")
    // public writeTag : string = "";

    @Reflect.metadata(Editor, "color")
    public color: string = '#0000FF';

    @Reflect.metadata(Editor, "color")
    public borderColor: string = '#0000FF';

    @Reflect.metadata(Editor, "color")
    public textColor: string = '#FFFFFF';

    @Reflect.metadata(Editor, "list")
    public shape : string = "Rectangle";

    @Reflect.metadata(Editor, "tag")
    public HeightTag : string = "";

    @Reflect.metadata(Editor, "tag")
    public HoriPosTag : string = "";

    @Reflect.metadata(Editor, "tag")
    public VertiPosTag : string = "";

    // @Reflect.metadata(Editor, "tag")
    // public VisibTag : string = "";

    @Reflect.metadata(Editor, "tag")
    public WidthTag : string = "";


}