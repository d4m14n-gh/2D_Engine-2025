import { StandaloneComponent } from "../Components/StandaloneComponent";
import { Plugin } from "../Core/Plugin";
export class StandaloneComponentPlugin extends Plugin {
    name = "StandaloneComponentPlugin";
    update(delta) {
        this.gameWorld.getAllComponents()
            .filter(component => component instanceof StandaloneComponent)
            .map(component => component)
            .forEach(component => component.tick(delta));
    }
}
