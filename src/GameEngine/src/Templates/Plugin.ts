import { RigidBodyC } from "../Components/RigidBody";
import { SquareRendererC } from "../Components/Renderers/SquareRenderer";
import { WorldComponent } from "../WorldComponent";

export class TemplatePlugin extends WorldComponent {
    override start(): void {
        
    }

    override update(delta: number, totalDelta: number): void {
    }
   
    override fixedUpdate(delta: number, totalDelta: number): void {
    }
}