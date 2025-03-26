export class GameAnimation{
    private progress: number = -1;
    public duration: number = 0.25;
    public startAnimation: () => void = ()=>{};    
    public endAnimation: () => void = ()=>{};    
    public updateAnimation: (fill: number) => void = ()=>{};    
    
    constructor(update: (fill: number) => void = ()=>{}, start: () => void = ()=>{}, end: () => void = ()=>{}){
        this.updateAnimation = update;
        this.startAnimation = start;
        this.endAnimation = end;
    }

    public update(delta: number): void {
        if(this.progress>0){
            let fill = (this.duration-this.progress)/this.duration;
            this.progress-=delta;
            this.updateAnimation(fill);
        }
        else if(this.progress!=-1){
            this.endAnimation();
            this.progress=-1;
        }
    }
    
    public start(): void{
        if(this.progress==-1){
            this.startAnimation();
            this.progress=this.duration;
        }
        else
            this.progress=(this.duration+this.progress)/2;
    }
}