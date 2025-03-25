import { main } from "..";
import { ColliderC } from "../Components/Collider";
import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Plugin";
import { PlayerPlugin } from "./Player";

export interface ICollision {
    onCollisionEnter(other: ColliderC): void;
    onCollisionExit(other: ColliderC): void;
}

export class CollisionDetectionPlugin extends Plugin {
    
    override update(): void {
        this.checkCollisions();
    }

    private cellSize: number = 5;
    
    public getCellKey(position: Vector): Vector {
        const cellX = Math.floor(position.x / this.cellSize);
        const cellY = Math.floor(position.y / this.cellSize);
        return new Vector(cellX, cellY);
    }
  
    getNearbyCircles(key: Vector, cells: Map<string, ColliderC[]>): ColliderC[] {
        const neighbors: ColliderC[] = [];
        for (let dx = -1; dx <= 1; dx++)
            for (let dy = -1; dy <= 1; dy++) {
                const offset: Vector = new Vector(dx, dy);
                const newKey: string = key.add(offset).toString();

                if (cells.has(newKey)) 
                    neighbors.push(...cells.get(newKey)!);
            }
        return neighbors;
    }
    
    checkCollisions(): void {
        let AllColliders = this.gameWorld.getComponents(ColliderC)
        
        let cells: Map<string, ColliderC[]> = new Map();
        for (const c of AllColliders){
            c.isActive = false;
            let key = this.getCellKey(c.getCenter()).toString();
            if (cells.has(key))
                cells.get(key)!.push(c);
            else
                cells.set(key, [c]);
        }

        for (const cellCircles of cells.values())
            for (const mainC of cellCircles){
                if (mainC.isStatic)
                    continue;
                let newCollisions = new Set<ColliderC>();

                let neighbors = this.getNearbyCircles(this.getCellKey(mainC.getCenter()), cells);
                for (const otherC of neighbors) {
                    if (mainC===otherC)
                        continue;
                    if (mainC.collides(otherC)) {
                        mainC.isActive = true;
                        newCollisions.add(otherC);
                        otherC.isActive = true;
                    }
                }

                for(let newC of newCollisions)
                    if(!mainC.collisions.has(newC))  
                        mainC.getAllComponents().filter(c => "onCollisionEnter" in c)
                        .forEach(c=> {try{(c as unknown as ICollision).onCollisionEnter(newC)}catch{}});
                
                for(let oldC of mainC.collisions)
                    if(!newCollisions.has(oldC))  
                        mainC.getAllComponents().filter(c => "onCollisionExit" in c)
                        .forEach(c=> {try{(c as unknown as ICollision).onCollisionExit(oldC)}catch{}});

                mainC.collisions.clear();
                mainC.collisions = newCollisions;
            }
    }
}