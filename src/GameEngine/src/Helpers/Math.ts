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
    public static deltaAngle(a:number, b:number): number{
        a = a%(2*Math.PI)+2*Math.PI
        a = a%(2*Math.PI);
        b = b%(2*Math.PI)+2*Math.PI
        b = b%(2*Math.PI)+2*Math.PI;


        return (b-a+Math.PI)%(2*Math.PI)-Math.PI;
    }
    public static elasticCollision1D(m1: number, v1: number, m2: number, v2: number): [number, number] {
        const v1Final = ((v1 * (m1 - m2)) + (2 * m2 * v2)) / (m1 + m2);
        const v2Final = ((v2 * (m2 - m1)) + (2 * m1 * v1)) / (m1 + m2);
    
        return [v1Final, v2Final];
    }
    public static minmax(value: number, min: number, max: number): number {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
}