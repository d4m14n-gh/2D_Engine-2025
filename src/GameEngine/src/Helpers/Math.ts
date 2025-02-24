export class GMath{
    public static symRand(value: number): number{
        return (2*Math.random()-1)*value;
    }
    public static getColliderRadius(n: number, radius: number): number{
        if(n>=10)
            return radius;
        const angle = Math.PI/n;
        const h = Math.cos(angle)*radius;
        return (2*h+radius)/3;
    }
}