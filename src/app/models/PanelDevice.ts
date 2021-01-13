import "reflect-metadata"
import {Editor} from "./Editor"
import { currentScreen } from "./Screen";

export class PanelDevice
{
    @Reflect.metadata(Editor, "number")
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

    public color: string = 'red';

    public key : string | number  = 0;

    public location : string = "";
    
    constructor()
    {
        this.name = "DefaultName";
    }
}


