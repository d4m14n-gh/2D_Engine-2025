import { ColliderC, RBushItem } from "../Components/Collider";
import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import RBush from "rbush";

export class CollisionDetectionPlugin extends Plugin {
    public name: string = "CollisionDetectionPlugin";
    private tree: RBush<RBushItem> = new RBush();

    override update(): void {
        this.checkCollisions();
    }

    
    public overlapPoint(point: Vector): ColliderC[] { 
        // let colliders = this.getNearbyCircles(this.getCellKey(point));
        const potentials = this.tree.search({minX: point.x, minY: point.y, maxX: point.x, maxY: point.y});
        const colliders = potentials.map(c => this.gameWorld.getGameObject(c.colliderId)?.getComponent(ColliderC)!).filter(c => c.getCenter().sub(point).magnitude() < c.radius);
        return colliders;
    }

    checkCollisions(): void {
        let AllColliders = this.gameWorld.getComponents(ColliderC)
        
        this.tree.clear();
        this.tree.load(AllColliders.map(c => c.getAABB()));

        for (const mainCollider of AllColliders)
            mainCollider.isActive = false;
        for (const mainCollider of AllColliders) {
            if (mainCollider.isStatic)
                continue; 
            let newCollisions = new Set<ColliderC>();
            
            const potential = this.tree.search(mainCollider.getAABB());
            for (const item of potential) {
                const otherCollider = this.gameWorld.getGameObject(item.colliderId)?.getComponent(ColliderC);
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