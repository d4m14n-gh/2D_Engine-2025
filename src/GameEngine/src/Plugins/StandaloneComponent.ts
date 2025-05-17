import { StandaloneComponent } from "../Components/StandaloneComponent";
import { Plugin } from "../Core/Plugin";
import { GOManagerPlugin } from "./GOManager";

export class StandaloneComponentPlugin extends Plugin {
    public name: string = "StandaloneComponentPlugin";
    // override update(delta: number): void {
    //     this.getPlugin(GameWorldPlugin).getAllComponents()
    //     .filter(component => component instanceof StandaloneComponent)
    //     .map(component => component as StandaloneComponent)
    //     .forEach(component => (component as any).tick(delta));
    // }
}