import { rgb } from "../../Helpers/Color";
import { GMath } from "../../Helpers/Math";
import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { RigidBodyC } from "../RigidBody";
import { RendererC } from "./Renderer";

class Particle {
    public x: number;
    public y: number;
    public dx: number;
    public dy: number;
    public radius: number;
    public targetRadius: number;
    public color: rgb;
    public alpha: number;

    constructor(x: number, y: number, targetRadius: number, color: rgb, alpha: number) {
        this.x = x;
        this.y = y;
        this.dx = 0; 
        this.dy = 0;
        this.radius = 0;
        this.targetRadius = targetRadius
        this.color = color;
        this.alpha = alpha;
    }
}

export class SmokeRendererC extends RendererC {
    public color: rgb;
    public radius: number;
    public n: number;
    private particles: Particle[] = [];

    constructor(side: number, n: number=4, zindex=0, color=rgb.randomColor2()){
        super();
        this.radius = side;
        this.n = n;
        this.zindex = zindex;
        this.color = color;
    }

    public start(): void {
      
    }

    public emitParticles(n: number = 1, offset: Vector = new Vector(0, 0), dv: Vector = new Vector(0, 0)): void {
        const radiusRange: number = 1;

        for (let i = 0; i < n; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = radiusRange * (Math.random() * 0.5 + 0.5);
            const x = radius * Math.cos(angle) + this.getTransform().position.x + offset.x;
            const y = radius * Math.sin(angle) + this.getTransform().position.y + offset.y;

            const particleRadius = this.radius * 0.25 + 0.15 * this.radius * GMath.symRand(1);
            const alpha = Math.random() * 0.5 + 0.5;

            const particle = new Particle(x, y, particleRadius, this.color, alpha);
            particle.dx = this.getComponent(RigidBodyC)?.velocity.x ?? 0;
            particle.dy = this.getComponent(RigidBodyC)?.velocity.y ?? 0;
            particle.dx += dv.x;
            particle.dy += dv.y;
            this.particles.push(particle);
        }
    }

    private updateParticles(delta: number): void {
        const blinkPeriod: number = 1;
        const popupPeriod: number = 1;

        for (const particle of this.particles) {
            particle.x += particle.dx * delta;
            particle.y += particle.dy * delta;

            // lekka fluktuacja kierunku (ruch szumowy)
            particle.dx += (Math.random() - 0.5) * delta*50;
            particle.dy += (Math.random() - 0.5) * delta*50;

            // ogranicz ruch (damping)
            particle.dx *= Math.pow(0.1, delta);
            particle.dy *= Math.pow(0.1, delta);

            particle.alpha -= delta / blinkPeriod; 
            // particle.radius += delta / popupPeriod; //(particle.targetRadius-particle.radius)*(1-Math.pow(0.025, delta));
            particle.radius += (particle.targetRadius-particle.radius)*(1-Math.pow(0.025, delta));

            if (particle.alpha <= 0.) {
                this.particles.splice(this.particles.indexOf(particle), 1); // Remove dead particles
            }
        }
    }

    public render(context: CanvasRenderingContext2D, delta: number): void {
        this.updateParticles(delta);

        const x = 0;
        const y = 0;
        const r = 0;
        const transformScale = Vector.one(); // Assuming no scaling for simplicity
        
        const offset = this.getGameWorld().getPlugin(CameraPlugin).cameraScreenOffset;
        const scale = this.getGameWorld().getPlugin(CameraPlugin).scaleV;
        const cmx = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.y;

        const cx: number = (x-cmx);
        const cy: number = (y-cmy);

        context.translate(offset.x, offset.y);
        context.scale(scale.x, scale.y);
        context.translate(cx, cy);
        // context.rotate(r);
        // context.scale(transformScale.x, transformScale.y);
        
       
        for (const particles of this.particles) {
            context.beginPath();
            context.arc(particles.x, particles.y, particles.radius, 0, 2 * Math.PI);
            context.closePath();
    
            context.fillStyle = particles.color.toString();
            context.globalAlpha = particles.alpha;
            context.shadowColor = particles.color.toString();
            context.shadowBlur = 10; 
            context.fill();
            // context.globalCompositeOperation = "lighter"; 
            // context.stroke();
            context.globalAlpha = 1;
        }
        context.shadowBlur = 0;
        context.shadowColor = rgb.stroke.toString();
        // context.globalCompositeOperation = "source-over"; 



        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}