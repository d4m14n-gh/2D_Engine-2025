import { StandaloneComponent } from "../Components/StandaloneComponent";
import { Plugin } from "../Plugin";

export class StandaloneComponentPlugin extends Plugin {
    
    override update(delta: number): void {
        this.gameWorld.getAllComponents()
        .filter(component => component instanceof StandaloneComponent)
        .map(component => component as StandaloneComponent)
        .forEach(component => component.update(delta));
    }
    
    override fixedUpdate(delta: number): void {
        this.gameWorld.getAllComponents()
        .filter(component => component instanceof StandaloneComponent)
        .map(component => component as StandaloneComponent)
        .forEach(component => component.fixedUpdate(delta));
    }
}