import { ColliderC } from "../Components/Collider";
import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";

export class CollisionDetectionPlugin extends Plugin {
    public name: string = "CollisionDetectionPlugin";
    
    private cellSize: number = 5;
    private cells: Map<string, WeakRef<ColliderC>[]> = new Map();

    override update(): void {
        this.checkCollisions();
    }

    
    public getCellKey(position: Vector): Vector {
        const cellX = Math.floor(position.x / this.cellSize);
        const cellY = Math.floor(position.y / this.cellSize);
        return new Vector(cellX, cellY);
    }
  
    getNearbyCircles(key: Vector): ColliderC[] {
        const neighbors: ColliderC[] = [];
        for (let dx = -1; dx <= 1; dx++)
            for (let dy = -1; dy <= 1; dy++) {
                const offset: Vector = new Vector(dx, dy);
                const newKey: string = key.add(offset).toString();

                if (this.cells.has(newKey)) 
                    neighbors.push(...this.cells.get(newKey)?.map(c => c.deref()).filter(c => c != undefined)??[]);
            }
        return neighbors;
    }
    
    public overlapPoint(point: Vector): ColliderC[] { 
        let colliders = this.getNearbyCircles(this.getCellKey(point));
        colliders = colliders.filter(c => c.getCenter().sub(point).magnitude() < c.radius);
        return colliders;
    }

    checkCollisions(): void {
        this.cells.clear();
        let AllColliders = this.gameWorld.getComponents(ColliderC)
        
        for (const c of AllColliders){
            c.isActive = false;
            let key = this.getCellKey(c.getCenter()).toString();
            if (this.cells.has(key))
                this.cells.get(key)!.push(new WeakRef(c));
            else
                this.cells.set(key, [new WeakRef(c)]);
        }

        for (const cellCircles of this.cells.values()){
            for (const mainCRef of cellCircles){
                const mainC = mainCRef.deref();
                if (mainC === undefined) 
                    continue;
                if (mainC.isStatic)
                    continue;
                let newCollisions = new Set<ColliderC>();
                
                let neighbors = this.getNearbyCircles(this.getCellKey(mainC.getCenter()));
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
                        mainC.getComponent(ColliderC).onCollisionEnter(newC); 
                    
                    
                    // for(let newC of newCollisions)
                    //     if(!mainC.collisions.has(newC))  
                    //         mainC.getAllComponents().filter(c => "onCollisionEnter" in c)
                //         .forEach(c=> {try{(c as unknown as ICollision).onCollisionEnter(newC)}catch{}});
                
                // for(let oldC of mainC.collisions)
                //     if(!newCollisions.has(oldC))  
                //         mainC.getAllComponents().filter(c => "onCollisionExit" in c)
                //         .forEach(c=> {try{(c as unknown as ICollision).onCollisionExit(oldC)}catch{}});
                
                mainC.collisions.clear();
                mainC.collisions = newCollisions;
            }
        }
    }
}