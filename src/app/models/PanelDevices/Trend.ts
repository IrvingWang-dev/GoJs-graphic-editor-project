import { Editor } from "../Editor";
import { PanelDevice } from "../PanelDevice";

export class Trend extends PanelDevice 
{

    @Reflect.metadata(Editor, "color")
    public color: string = '#0000FF';

    @Reflect.metadata(Editor, "color")
    public borderColor: string = '#0000FF';

}