import { Vector } from "../Helpers/Vector";
import { StandaloneComponent } from "../Components/StandaloneComponent";
import { WorldComponent } from "../WorldComponent";
import { PlayerPlugin } from "./Player";
import { Component } from "../Component";
import { FollowerC } from "../Components/Follower";

export class StandaloneComponentPlugin extends WorldComponent {
    
    override update(delta: number, totalDelta: number): void {
        this.gameWorld.getAllComponents()
        .filter(component => component instanceof StandaloneComponent)
        .map(component => component as StandaloneComponent)
        .forEach(component => component.update(delta, totalDelta));
    }
    
    override fixedUpdate(delta: number, totalDelta: number): void {
        this.gameWorld.getAllComponents()
        .filter(component => component instanceof StandaloneComponent)
        .map(component => component as StandaloneComponent)
        .forEach(component => component.fixedUpdate(delta, totalDelta));
    }
}