import {GetAppState} from "../../../Creative1AppState";
import {CreativeSceneModelBase} from "../../CreativeSceneModelBase";
import {Color, DefaultMaterials, Vec2} from "../../../../anigraph";
import {ParticleSystem2DModel} from "./particles/ParticleSystem2DModel";
let appState = GetAppState();



export class ParticleSystemSceneModel extends CreativeSceneModelBase {
    particleSystem!:ParticleSystem2DModel;
    async PreloadAssets() {
        await super.PreloadAssets();
        await this.materials.loadShaderModel(DefaultMaterials.RGBA_SHADER)
        this.initCamera();
    }

    initScene() {
        const self = this;
        /**
         * Add AppState controls here
         */

        appState.addSliderControl(ParticleSystem2DModel.AppStateKeys.BigR, 15, 1, 50, 1);
        this.subscribeToAppState(ParticleSystem2DModel.AppStateKeys.BigR,(v:number)=>{
            self.particleSystem.R = v;
            self.particleSystem.signalParticleUpdate();
        })

        appState.addSliderControl(ParticleSystem2DModel.AppStateKeys.SmallR, 8, 1, 20, 1);
        this.subscribeToAppState(ParticleSystem2DModel.AppStateKeys.SmallR,(v:number)=>{
            self.particleSystem.r = v;
            self.particleSystem.signalParticleUpdate();
        })

        appState.addSliderControl(ParticleSystem2DModel.AppStateKeys.a, 3, 1, 20, 1);
        this.subscribeToAppState(ParticleSystem2DModel.AppStateKeys.a,(v:number)=>{
            self.particleSystem.a = v;
            self.particleSystem.signalParticleUpdate();
        })

        appState.addSliderControl(ParticleSystem2DModel.AppStateKeys.Smoothness, 10, 1, 20, 0.1);
        this.subscribeToAppState(ParticleSystem2DModel.AppStateKeys.Smoothness,(v:number)=>{
            self.particleSystem.smoothness = v;
            self.particleSystem.signalParticleUpdate();
        })

        appState.addColorControl(ParticleSystem2DModel.AppStateKeys.Color, Color.Random());
        this.subscribeToAppState(ParticleSystem2DModel.AppStateKeys.Color,(v:Color)=>{
            self.particleSystem.color = v;
            self.particleSystem.signalParticleUpdate();
        })

        appState.addSliderControl(ParticleSystem2DModel.AppStateKeys.HueShift, 0, 0, 1, 0.01);
        this.subscribeToAppState(ParticleSystem2DModel.AppStateKeys.HueShift,(v:number)=>{
            self.particleSystem.hueShift = v;
            self.particleSystem.signalParticleUpdate();
        })

        appState.addSliderControl(ParticleSystem2DModel.AppStateKeys.AlphaDecay, 1, 0, 1, 0.01);
        this.subscribeToAppState(ParticleSystem2DModel.AppStateKeys.AlphaDecay,(v:number)=>{
            self.particleSystem.alphaDecay = v;
            self.particleSystem.signalParticleUpdate();
        })

        appState.addSelectionControl(ParticleSystem2DModel.AppStateKeys.Mode, "Static", ["Static", "Dynamic"]);
        this.subscribeToAppState(ParticleSystem2DModel.AppStateKeys.Mode,(v:string)=>{
            self.particleSystem.mode = v;
            self.particleSystem.signalParticleUpdate();
        })

        this.particleSystem = new ParticleSystem2DModel();
        this.particleSystem.init();
        this.addChild(this.particleSystem);
    }

    timeUpdate(t: number) {
        this.particleSystem.timeUpdate(t);
        // for(let c of this.children){
        //     c.timeUpdate(t);
        // }
    }
}
