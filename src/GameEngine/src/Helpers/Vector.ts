export class Vector {
    x : number = 0;
    y : number = 0;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    //standard operators
    add(a: Vector) : Vector{
        return new Vector(this.x+a.x, this.y+a.y);
    }
    sub(a: Vector) : Vector{
        return new Vector(this.x-a.x, this.y-a.y);
    }
    times(a: number) : Vector{
        return new Vector(this.x*a, this.y*a);
    }

    //other operators 
    distance(other: Vector){
      return Math.sqrt(Math.pow(this.x-other.x, 2) + Math.pow(this.y-other.y, 2));
    }
    static distance(a: Vector, b: Vector){
      return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
    }
    magnitude(){
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    cross(): Vector{
        return  new Vector(this.y, -this.x).toUnit();
    }
    scalarProduct(v: Vector): number{
        return this.x*v.x+this.y*v.y;
    }
    vectorProduct(v: Vector): number{
        return this.x*v.y-this.y*v.x;
    }
    perpendicular(n: Vector){
        return this.sub(n.cross().times((n.scalarProduct(this))/(n.magnitude()*n.magnitude())));
    }
    toUnit(){
      if(this.magnitude()!=0)
        return new Vector(this.x, this.y).times(1/this.magnitude());
      else return new Vector(1, 0);
    }
    public toString(): string{
        return "{"+this.x+":"+this.y+"}";
    }
    public toRad(): number{
        return Math.atan2(this.y, this.x); // Kąt w radianach
    }
    clone(){
        return new Vector(this.x, this.y);
    }

    //consts
    public static zero(): Vector { return new Vector(0, 0) }
    public static one(): Vector { return new Vector(1, 1) }
    public static up(): Vector { return new Vector(0, 1) }
    public static down(): Vector { return new Vector(0, -1) }
    public static left(): Vector { return new Vector(-1, 0) }
    public static right(): Vector { return new Vector(1, 0) }
}   
