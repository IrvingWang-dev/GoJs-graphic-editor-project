import { Subscription } from "rxjs";

export class ISource
{
    public ReourceName?:string;
}

export class ISourceRead extends ISource
{
    public OnSourceDataChanged?(v : any, service: any) : void;
    public subscritpion? : Subscription;
}