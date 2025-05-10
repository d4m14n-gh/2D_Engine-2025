import { Component } from "./Component";
import { GameWorld } from "../Core/GameWorld";
import { EventArgs, ISubscriber } from "./GameEvent";
import { cli, CommandResult } from "../Helpers/Commands";


//WorldComponent = Plugin
export abstract class Plugin implements ISubscriber {
    protected gameWorld!: GameWorld;
    protected enabled: boolean = true;
    public readonly name: string = "Plugin";

    //overideable methods
    protected event(args: EventArgs, alias?: string): void {}
    protected start(): void { }
    protected update(delta: number): void { }
    
    public getPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): T{
        return this.gameWorld.getPlugin(plugin);
    }
    public hasPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): boolean{
        return this.gameWorld.hasPlugin(plugin);
    }

    public isEnabled(): boolean{
        return this.enabled;
    }
    public enable(value=true): void{
        this.enabled=value;
    }
    public disable(): void {
        this.enabled = false;
    }


    protected cliGetName(): string {
        return this.name;
    }
    @cli("help")
    protected help(): CommandResult {
        let message = `${this.cliGetName()} commands:\n`;
        for (const element of Object.values((this as any).constructor["syntaxes"])) {
            message += `/${this.cliGetName()}:${element}\n`;
        }
        return new CommandResult(true, message, undefined);
    }
    @cli("enable")
    private cliEnable(): CommandResult {
        this.enabled = true;
        return new CommandResult(true, `${this.name} enabled`, undefined);
    }
    @cli("disable")
    private cliDisable(): CommandResult {
        this.enabled = false;
        return new CommandResult(true, `${this.name} disabled`, undefined);
    }
}