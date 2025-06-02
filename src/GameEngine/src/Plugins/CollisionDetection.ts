import { ColliderC, RBushItem } from "../Components/Collider";
import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import Flatbush from "flatbush";
import { main } from "..";

export class CollisionDetectionPlugin extends Plugin {
    public name: string = "CollisionDetectionPlugin";
    private data: RBushItem[] = [];
    private tree!: Flatbush;

    override update(): void {
        this.checkCollisions();
    }

    
    public overlapPoint(point: Vector): ColliderC[] { 
        // let colliders = this.getNearbyCircles(this.getCellKey(point));
        const potentials = this.tree.search(point.x, point.y, point.x, point.y);
        const colliders = potentials.map(c => this.gameWorld.getGameObject(this.data[c].colliderId)?.getComponent(ColliderC)!).filter(c => c.getCenter().sub(point).magnitude() < c.radius);
        return colliders;
    }

    checkCollisions(): void {
        let AllColliders = this.gameWorld.getComponents(ColliderC)
        
        this.tree = new Flatbush(AllColliders.length);
        this.data = AllColliders.map(collider => collider.getAABB());

        for (const mainCollider of AllColliders)
            mainCollider.isActive = false;

        for (const item of this.data) 
            this.tree.add(item.minX, item.minY, item.maxX, item.maxY);
        this.tree.finish();

        for (const mainCollider of AllColliders) {
            if (mainCollider.isStatic)
                continue; 
            let newCollisions = new Set<ColliderC>();
            
            const mainAABB = mainCollider.getAABB();
            const potential = this.tree.search(mainAABB.minX, mainAABB.minY, mainAABB.maxX, mainAABB.maxY);

            for (const item of potential) {
                const otherCollider = this.gameWorld.getGameObject(this.data[item].colliderId)?.getComponent(ColliderC);
                if (!otherCollider || mainCollider === otherCollider) 
                    continue;
                
                if (mainCollider.collides(otherCollider)) {
                    mainCollider.isActive = true;
                    otherCollider.isActive = true;
                    newCollisions.add(otherCollider);
                }
                
                for(let newC of newCollisions)
                    if(!mainCollider.collisions.has(newC)) 
                        mainCollider.getComponent(ColliderC).onCollisionEnter(newC); 
                    
                
                mainCollider.collisions.clear();
                mainCollider.collisions = newCollisions;
            } 
        }
    }
}