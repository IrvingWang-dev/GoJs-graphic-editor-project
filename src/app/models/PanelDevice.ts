import "reflect-metadata"
import {Editor} from "./Editor"
import { ISource, ISourceRead } from "./Source";
import {  } from "typescript";
import { tagSystem } from "./TagSystem";

export class PanelDevice
{
    @Reflect.metadata(Editor, "number")
    @Reflect.metadata("binding", "read")
    public x: number = 0;

    @Reflect.metadata(Editor, "number")
    @Reflect.metadata("binding", "read")
    public y: number = 0;

    @Reflect.metadata(Editor, "string")
    public name: string = "";

    @Reflect.metadata(Editor, "string")
    public caption: string = "text";

    @Reflect.metadata(Editor, "number")
    @Reflect.metadata("binding", "read")
    public width: number = 100;

    @Reflect.metadata(Editor, "number")
    @Reflect.metadata("binding", "read")
    public height: number = 100;    

    public _mode: string = 'design';
    public isGroupMember: boolean = false;
    public groupKey: number;

    // magic begin

    public sources = new Map<string, ISource>();

    public key : string | number  = 0;

    public location : string = "";

    public posstyle = "";
    public selected:string = "hide";
    
    constructor()
    {
        this.name = "DefaultName";
    }
}

export function CreatePVObject<T extends PanelDevice>(TCreator: new() => T) : T
{
    let obj : T = new TCreator();
    let keys = Object.keys(obj);
    keys.forEach( key => {
        let binding = Reflect.getMetadata("binding", obj, key);
        if (binding == 'read')
        {
            let s = new ISourceRead();
            s.OnSourceDataChanged = (v : any, service: any, panelDeviceObj: any) : void => 
            {
                // we know we have the key!!!
                //(obj as any)[key] = v;
                console.log(panelDeviceObj);

                var value = (panelDeviceObj as any)[key];
                value += 1;
                (panelDeviceObj as any)[key] = value;
                service.OnPropertiesChanged.next({pd: panelDeviceObj, propertyName: key, old: value, newValue: value});
                console.log(key + " changed!");
            };
            obj.sources.set(key, s);
        }
    });
    return obj;
}

export function ModifySource(obj: PanelDevice, attributeName:string, sourceName:string) : boolean
{
    // check attribute exist and bindable before change

    let source = obj.sources.get(attributeName);
    if (source == undefined)
    {
        return false;
    }

    source.ReourceName = sourceName;

    return true;
}

export function startAnimation(obj :PanelDevice, service: any) : any
{
    obj.sources.forEach( source =>
    {
        let readSource =  source as ISourceRead;
        if (readSource.ReourceName)
        {
            var tag = tagSystem.GetTag(readSource.ReourceName);
            readSource.subscritpion = tag?.onValueChanged.subscribe( (v : any) => {
                if (readSource.OnSourceDataChanged)
                    readSource.OnSourceDataChanged(v, service, obj);
            });
        }
    });
}

export function stopAnimation(obj :PanelDevice) : any
{
    obj.sources.forEach( source =>
    {
        let readSource =  source as ISourceRead;
        if (readSource.ReourceName)
        {
            if (readSource.subscritpion)
                readSource.subscritpion.unsubscribe();
        }
    });
}


