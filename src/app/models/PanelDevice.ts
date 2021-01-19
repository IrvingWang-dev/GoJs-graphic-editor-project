import "reflect-metadata"
import {Editor} from "./Editor"
import { currentScreen } from "./Screen";

export class PanelDevice
{
    @Reflect.metadata(Editor, "number")
    //@Reflect.metadata(max, 100)
    public x: number = 0;

    @Reflect.metadata(Editor, "number")
    public y: number = 0;

    @Reflect.metadata(Editor, "string")
    public name: string = "";

    @Reflect.metadata(Editor, "string")
    public caption: string = "text";

    @Reflect.metadata(Editor, "number")
    public width: number = 100;

    @Reflect.metadata(Editor, "number")
    public height: number = 40;    

    @Reflect.metadata(Editor, "color")
    public color: string = '#0000FF';

    public key : string | number  = 0;

    public location : string = "";

    public posstyle = "";
    public selected:string = "hide";
    
    constructor()
    {
        this.name = "DefaultName";
    }
}


