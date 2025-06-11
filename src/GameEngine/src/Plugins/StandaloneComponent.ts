import { StandaloneComponent } from "../Components/StandaloneComponent";
import { Plugin } from "../Core/Plugin";
import { PluginOrder } from "../Core/PluginOrder";

export class StandaloneComponentPlugin extends Plugin {
    public readonly order: PluginOrder = PluginOrder.Update;
    public name: string = "StandaloneComponentPlugin";
    private components: WeakRef<StandaloneComponent>[] = [];

    public addComponent(component: StandaloneComponent): void {
        if (this.components.some(c => c.deref() === component))
            return;
        this.components.push(new WeakRef(component));
    }

    override update(delta: number): void {
        this.components.forEach(weakRef => {
            const component = weakRef.deref();
            if (component) 
                (component as any).tick(delta);
        });
        this.components = this.components.filter(weakRef => weakRef.deref());
    }
}