import { Subject } from "rxjs";
import { PanelDevice } from "./PanelDevice";


export class PV800Screen
{
    public _panelDevices : PanelDevice[] = new Array<PanelDevice>();
    public pdNumber: number;

    public AddPanelDevice(pd : PanelDevice)
    {
        this._panelDevices.push(pd);
        this.OnPanelDeviceChanged.next(1);
    }

    public GetAllPanelDevices() : PanelDevice[]
    {
        return this._panelDevices;
    }

    public  OnPanelDeviceChanged : Subject<number> = new Subject<number>();
}

export var currentScreen : PV800Screen = new PV800Screen();



