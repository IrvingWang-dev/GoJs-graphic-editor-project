import { Editor } from "../Editor";
import { PanelDevice } from "../PanelDevice";

export class Gauges extends PanelDevice 
{
    public key: number = 3;
    public value: number = 56;
    public text: string = "Gauges";
    public category: string = "gaugesTemplate";
    public loc: string = "0 0";
    public editable:boolean = true;
    //color: "lightsalmon" };

    @Reflect.metadata(Editor, "color")
    public color: string =  '#e99666';

    // @Reflect.metadata(Editor, "list")
    // public category : string = "circularMeterTemplate";

    private static number: number = 0;

    constructor()
    {
        super();
        Gauges.number += 1;
        this.name = "Gauges" + Gauges.number;
    }
}