import { StandaloneComponent } from "../Components/StandaloneComponent";
import { Plugin } from "../Core/Plugin";
import { PluginOrder } from "../Core/PluginOrder";

export class StandaloneComponentPlugin extends Plugin {
    public readonly order: PluginOrder = PluginOrder.Update;
    public name: string = "StandaloneComponentPlugin";
    override update(delta: number): void {
        this.gameWorld.getAllComponents()
        .filter(component => component instanceof StandaloneComponent)
        .map(component => component as StandaloneComponent)
        .forEach(component => (component as any).tick(delta));
    }
}