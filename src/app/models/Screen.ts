import { Subject } from "rxjs";
import { PanelDevice } from "./PanelDevice";


export class PV800Screen
{
    public _panelDevices : PanelDevice[] = new Array<PanelDevice>();
    public pdNumber: number;

    public AddPanelDevice(pd : PanelDevice)
    {
        this._panelDevices.push(pd);
        this.OnPanelDeviceChanged.next(pd);
    }

    public GetAllPanelDevices() : PanelDevice[]
    {
        return this._panelDevices;
    }

    public  OnPanelDeviceChanged : Subject<PanelDevice> = new Subject<PanelDevice>();
}

export var currentScreen : PV800Screen = new PV800Screen();



