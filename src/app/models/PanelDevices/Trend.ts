import { Editor } from "../Editor";
import { PanelDevice } from "../PanelDevice";

export class Trend extends PanelDevice 
{
    public text: string = "Trend";
    public category: string = "trendTemplate";

    @Reflect.metadata(Editor, "color")
    public color: string = '#0000FF';

    @Reflect.metadata(Editor, "color")
    public borderColor: string = '#0000FF';

    public datasets = [{
        label: "Trend",
        fill: false,
        backgroundColor: this.borderColor,
        borderColor: this.borderColor,
        data: [5,6,3,8]
      }];



}