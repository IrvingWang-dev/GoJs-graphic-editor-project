
export class PanelDevice
{
    public x: number;
    public y: number;
    public name: string;
    public width: number;
    public height: number;

    public getMetaData():PanelDeviceMetadata
    {
        return new PanelDeviceMetadata();
    }
    
}

export class PanelDeviceMetadata
{
    public properties: PanelDeviceProperites[];

    constructor()
    {
        this.properties.push(new PanelDeviceProperites("x", "number" ));
        this.properties.push(new PanelDeviceProperites("y", "number" ));
        this.properties.push(new PanelDeviceProperites("name", "string" ));
        this.properties.push(new PanelDeviceProperites("width", "number" ));
        this.properties.push(new PanelDeviceProperites("height", "number" ));

    }
}

export class PanelDeviceProperites
{
    public name:string;
    public type:string;

    constructor(name:string, type:string)
    {
        this.name = name;
        this.type = type;
    }
}