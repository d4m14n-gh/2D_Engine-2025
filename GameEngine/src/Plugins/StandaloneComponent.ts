import { StandaloneComponent } from "../Components/StandaloneComponent";
import { Plugin } from "../Core/Plugin";

export class StandaloneComponentPlugin extends Plugin {
    
    override update(delta: number): void {
        this.gameWorld.getAllComponents()
        .filter(component => component instanceof StandaloneComponent)
        .map(component => component as StandaloneComponent)
        .forEach(component => (component as any).tick(delta));
    }
}