import { Vector } from "../../Helpers/Vector";
import { Plugin } from "../../Core/Plugin";
import { RendererPlugin } from "../Renderer";
import { get } from "http";
import { KeyboardEventArgs, KeyboardPlugin } from "../Keyboard";
import { EventArgs } from "../../Core/GameEvent";



export class ProfilerPlugin extends Plugin {
    public name: string = "ProfilerPlugin";
    public size: number = 250;
    private isVisible: boolean = true;
    private profilerWrapper: HTMLDivElement = document.createElement("div");
    private readonly usage = new Map<string, Array<number>>();


    constructor() {
        super();
    }

    override start(): void {
        this.getPlugin(KeyboardPlugin).KeyDownEvent.subscribe(this, "keydown");
        document.body.appendChild(this.profilerWrapper);
        this.addRecord("Fps", 0);
    }

    lastTime = performance.now();
    frames = 0;
    fpsHistory: number[] = [];
    override update(delta: number): void {
        const fps = 1 / delta;
        this.addRecord("Fps", fps);
``        
       
        
        this.frames++;
        const now = performance.now();
        if (now - this.lastTime >= 250) {
            this.fpsHistory.push(this.frames*4);
            if (this.fpsHistory.length > 100)
                this.fpsHistory.shift();
            this.frames = 0;
            this.lastTime = now;

            let i = 0;
            let values: string[] = [];
            for (const element of this.usage) {
                let key = element[0];
                let len = element[1].length;
                let mean = 0;
                for (const v of element[1])
                    mean += v;
                mean/=len;    
                i++;
                values.push(`${key}: `+(mean).toFixed(2).toString());
            }
            this.profilerWrapper.innerHTML = this.getInnerHtml(values);
        }

    }
    
    protected override event(args: EventArgs, alias?: string): void {
        if (alias == "keydown"){
            const kargs = args as KeyboardEventArgs;
            if (kargs.key == "p")
                this.isVisible = !this.isVisible;
        }
    }

    public addRecord(key: string, value: number){
        if(!this.usage.has(key)){
            this.usage.set(key, [value]);
        }
        else {
            let usage = this.usage.get(key)!; 
            let len = usage.length;
            if (len >= this.size){
                usage.shift();
                usage.push(value);
            }
            else{
                usage.push(value);
            }
        }
    }

    private getChartHtml(values: number[]): string {
        values = values.slice(Math.max(0, values.length-100), values.length);
        const max = 200; //Math.max(...values);
        let html = `<div class="profiler-chart">`;
        for (let i = 0; i < values.length; i++) {
            html += `<div class="profiler-chart-item" style="height: ${values[i]/max*100}px"></div>`;
        }
        html += `</div>`;
        return html;
    }

    private getElementsHtml(values: string[]): string {
        let html="";
        for (let i = 0; i < values.length; i++) {
            if (i > 0)
                html += `<hr class="profiler-item-separator">`;
            html += 
            `<div class="profiler-item">
                <span class="profiler-item-key">${values[i].split(": ")[0]}:</span>
                <span class="profiler-item-value">${values[i].split(": ")[1]}</span>
            </div>`;
        }
        return html;
    }

    private getInnerHtml(values: string[]): string {
        const profiler = `
            <style>
                .profiler{
                    ${this.isVisible ? "" : "display: none;"}
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    
                    width: 400px;
                    padding: 20px;
                    border-radius: 20px;
                    background-color: rgba(42, 43, 46, 0.382);
                    color: white;
                    pointer-events: none;
                }
                .profiler-header{
                    font-size: 20px;
                    font-weight: bold;
                    color: white;
                    margin-bottom: 10px;
                }
                .profiler-item{
                    // display: flex;
                    // justify-content: space-between;
                    padding: 5px 0;
                    color:rgba(240, 240, 240, 0.85)
                }
                .profiler-item-key{
                    margin-right: 10px;
                }
                .profiler-item-value{
                    color: #f0f0f0;
                }
                .profiler-item-separator{
                    border: none;
                    border-top: 1px dashed gray;
                    opacity: 0.75;
                    margin: 2px 0;
                }
                .profiler-chart{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: flex-end;
                    height: 100px;
                    width: 100%;
                    margin-bottom: 10px;
                    border-radius: 10px;
                    overflow: hidden;
                    opacity: 0.25;
                }
                .profiler-chart-item{
                    background-color: rgb(240, 240, 240);
                    width: 100%;
                    margin: 0;
                }
            </style>

            <div class="profiler">
                <div class="profiler-header">
                    <h2 style="margin: 0">Profiler <span style="opacity: 0.5">[P]</span></h2>
                </div>
                ${this.getChartHtml(this.fpsHistory)}
                ${this.getElementsHtml(values)}
            </div>
            `
        return profiler;
    }
}