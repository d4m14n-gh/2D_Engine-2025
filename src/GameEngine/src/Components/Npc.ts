import { Component } from "../Component";
import { GameObject } from "../GameObject";
import { Vector } from "../Helpers/Vector";
import { PlayerPlugin } from "../Plugins/Player";
import { FollowerC } from "./Follower";
import { CanonC } from "./Canon";
import { HealthC, IDamage } from "./Health";
import { StandaloneComponent } from "./StandaloneComponent";


export enum NpcType{
    neutral,
    passive,
    aggresive
}
export class NpcC extends StandaloneComponent implements IDamage {
    public type: NpcType = NpcType.aggresive;
    public isAttacing: boolean = false;
    public target?: WeakRef<GameObject>;

    constructor(){
        super();
    }

    onDamage(other: GameObject): void {
        // this.attack(other);
        // throw new Error("Method not implemented.");
        let follower = this.gameObject.getComponent<FollowerC>(FollowerC.name);
        follower.isFollowing = true;
        this.isAttacing = true;
    }

    private attack(gameObject: GameObject): void{
        this.target = new WeakRef(gameObject);
    }

    override start(): void {
        this.attack(this.getGW().getPlugin<PlayerPlugin>(PlayerPlugin.name).player);
    }

    override update(delta: number, totalDelta: number): void {
        let follower = this.gameObject.getComponent<FollowerC>(FollowerC.name);
        let turret = this.gameObject.getComponent<CanonC>(CanonC.name);
        let health = this.gameObject.getComponent<HealthC>(HealthC.name);
        if(this.target&&this.target.deref()&&this.isAttacing){
            let target = this.target.deref()!;
            let direction = target.transform.position.sub(this.getT().position);
            turret.direction = direction; 
            let distance = direction.magnitude();
            if(distance<20)
                turret.shoot();
        }
    }
} 