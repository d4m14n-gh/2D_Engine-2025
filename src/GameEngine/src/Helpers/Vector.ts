import { GMath } from "./Math";
import * as rp from "@dimforge/rapier2d";

export class Vector extends rp.Vector2{
    constructor(x: number, y: number) {
        super(x, y);
    }

    //standard operators
    add(a: Vector) : Vector{
        return new Vector(this.x+a.x, this.y+a.y);
    }
    sub(a: Vector) : Vector{
        return new Vector(this.x-a.x, this.y-a.y);
    }
    mul(a: number) : Vector{
        return new Vector(this.x*a, this.y*a);
    }
    timesV(other: Vector) : Vector{
        return new Vector(this.x*other.x, this.y*other.y);
    }

    //other operators 
    length(): number{
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }
    distance(other: Vector){
      return Math.sqrt(Math.pow(this.x-other.x, 2) + Math.pow(this.y-other.y, 2));
    }
    static distance(a: Vector, b: Vector){
      return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
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
        return this.sub(n.cross().mul((n.scalarProduct(this))/(n.length()*n.length())));
    }
    toUnit(): Vector{
      if(this.length()!=0)
        return new Vector(this.x, this.y).mul(1/this.length());
      else return new Vector(1, 0);
    }
    setLength(length: number): Vector{
        return this.toUnit().mul(length);
    }
    toString(): string{
        return "{"+this.x+":"+this.y+"}";
    }
    toRad(): number{
        return Math.atan2(this.y, this.x); // Kąt w radianach
    }
    reverse(): Vector{
        let sx=1e32;
        let sy=1e32;
        if(this.x!=0)
            sx=1/this.x;
        if(this.y!=0)
            sy=1/this.y;
        return new Vector(sx, sy);
    }
    interpolate(target: Vector, k: number): Vector{
        const mx = target.sub(this);
        const mv = mx.sub(mx.mul( Math.min(1, Math.max(0, k)) ));
        return this.add(mv);
    }
    static fromRad(rad: number){
        return new Vector(
            Math.cos(rad), 
            Math.sin(rad)
        );
    }
    static fromVec2(vec: rp.Vector2){
        return new Vector(vec.x, vec.y);
    }
    static randomPos(range: number): Vector{
      return new Vector(GMath.symRand(range), GMath.symRand(range));
    }
    static randomPos2(range: number): Vector{
        let angle = GMath.symRand(Math.PI);
        let distance = Math.random()*range;
        return Vector.fromRad(angle).mul(distance);
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
