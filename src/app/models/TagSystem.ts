import {Subject} from 'rxjs'

export class Tag
{
    public name:string = "";
    public onValueChanged : Subject<any> = new Subject<any>();
}

export class TagSystem
{
    public GetTag(name:string) : Tag | undefined
    {
        return this.tags.get(name);
    }

    public AddTag(tag:Tag) : boolean
    {
        this.tags.set(tag.name, tag);
        return true;
    }

    private tags : Map<string, Tag> = new Map<string, Tag>();
}

let tagSystem = new TagSystem();

export { tagSystem };