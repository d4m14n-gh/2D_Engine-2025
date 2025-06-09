import { EventArgs } from "../Core/GameEvent";
import { Plugin } from "../Core/Plugin";
import { PluginOrder } from "../Core/PluginOrder";

export class TemplatePlugin extends Plugin {
    public readonly order: PluginOrder = PluginOrder.Update;
    protected override start(): void {
        
    }

    protected override update(delta: number): void {
    
    }
    
    protected override event(args: EventArgs, alias?: string): void {
        
    }
}