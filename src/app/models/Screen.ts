import { Subject } from "rxjs";
import { PanelDevice } from "./PanelDevice";


export class PV800Screen
{
    public _panelDevices : PanelDevice[] = new Array<PanelDevice>();


    public AddPanelDevice(pd : PanelDevice)
    {
        this._panelDevices.push(pd);
        this.OnPanelDeviceChanged.next(pd);
    }

    public GetAllPanelDevices() : PanelDevice[]
    {
        return this._panelDevices;
    }

    public AddTrendNode(pd: PanelDevice){
        this._panelDevices.push(pd);
        this.OnTrendChanged.next(pd);
    }

    public  OnPanelDeviceChanged : Subject<PanelDevice> = new Subject<PanelDevice>();
    public  OnTrendChanged : Subject<PanelDevice> = new Subject<PanelDevice>();
}

export var currentScreen : PV800Screen = new PV800Screen();



