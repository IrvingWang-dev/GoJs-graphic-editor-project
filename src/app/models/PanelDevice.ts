import "reflect-metadata"
import {Editor} from "./Editor"
import { currentScreen } from "./Screen";

export class PanelDevice
{
    @Reflect.metadata(Editor, "number")
    public x: number = 0;

    @Reflect.metadata(Editor, "color")
    public y: number = 0;

    @Reflect.metadata(Editor, "string")
    public name: string = "";

    @Reflect.metadata(Editor, "number")
    public width: number = 0;

    @Reflect.metadata(Editor, "number")
    public height: number = 0;    
    
    constructor()
    {
        this.name = "DefaultName" + currentScreen.pdNumber++;
    }
}


