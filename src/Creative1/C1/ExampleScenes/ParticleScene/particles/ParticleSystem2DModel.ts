import {
    AInteraction,
    AParticle,
    ASerializable,
    BasicInteractionModes,
    BasicParticleSystem2DModel,
    Color,
    Mat3,
    V2,
    Vec2,
    VertexArray2D
} from "../../../../../anigraph";
import {Particle} from "./Particle";

enum AppStateKeys{
    BigR = "R",
    SmallR = "r",
    a ='a',
    Smoothness="Smoothness",
    Color="Color",
    Mode="Mode",
    HueShift="Hue Shift",
    AlphaDecay="Alpha Decay"
}

@ASerializable("ParticleSystem2DModel")
export class ParticleSystem2DModel extends BasicParticleSystem2DModel{
    static AppStateKeys = AppStateKeys;

    R:number=15
    r:number=8
    a:number=3

    mode:string="Static"

    hueShift:number=0
    alphaDecay:number=1

    smoothness:number=1
    

    nParticles:number = 1000;
    get particles(): Particle[] {
        return this._particles as Particle[];
    };

    getTransformForParticle(p: Particle): Mat3 {
        return Mat3.Translation2D(p.position).times(Mat3.Scale2D(p.radius));
    }

    init(): void {
        for(let i=0;i<this.nParticles;i++){
            let p = i/this.nParticles;
            let c = this.color; // Color.FromHSVA(p, 1, 1, 1)
            this.particles.push(new Particle(i, Vec2.Random([-0.5,0.5]), 1, c))
        }
    }


    getColorForParticle(p: Particle): Color {
        return p.color;
    }


    timeUpdate(t:number){
        for(let p of this.particles){
            // p.position = V2(Math.cos(t+p.id), Math.sin(t+p.id)).times(this.exampleParticleParam);
            let newt = t + p.id / this.smoothness;
            p.position = V2((this.R-this.r)*Math.cos(this.r/this.R*newt)+this.a*Math.cos((1-this.r/this.R)*newt),
                            (this.R-this.r)*Math.sin(this.r/this.R*newt)-this.a*Math.sin((1-this.r/this.R)*newt));
            // Normalization
            p.position = p.position.times(10/(Math.abs(this.R - this.r) + this.a));
            
            if (this.mode == "Dynamic"){
                p.position = p.position.timesElementWise(V2(Math.cos(t + p.id), Math.sin(t - p.id)));
            }

            let alpha = 1;
            if (p.id/this.nParticles < this.alphaDecay)
                alpha = p.id/this.nParticles/this.alphaDecay;

            p.color = new Color(this.color.r, this.color.g, this.color.b, alpha)
                               .Spun(this.hueShift * (this.nParticles - p.id)/75);
        }
        this.signalParticleUpdate();
    }

}

