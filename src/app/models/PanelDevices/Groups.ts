import { Editor } from "../Editor";
import { PanelDevice } from "../PanelDevice";

export class Groups extends PanelDevice 
{
  @Reflect.metadata(Editor, "color")
  public color: string = '#0000FF';

  @Reflect.metadata(Editor, "color")
  public borderColor: string = '#0000FF';

  @Reflect.metadata(Editor, "color")
  public textColor: string = '#FFFFFF';

  @Reflect.metadata(Editor, "color")
  public lineColor : string = "#0000FF";

  @Reflect.metadata(Editor, "number")
  public lineWidth : number = 1;

  @Reflect.metadata(Editor, "list")
  public shape : string = "Rectangle";

  @Reflect.metadata(Editor, "tag")
  public HeightTag : string = "";

  @Reflect.metadata(Editor, "tag")
  public HoriPosTag : string = "";

  @Reflect.metadata(Editor, "tag")
  public VertiPosTag : string = "";

  @Reflect.metadata(Editor, "tag")
  public WidthTag : string = "";

  public memberKeys = [];




}