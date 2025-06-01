import { Component } from "./Component";
import { GameWorld } from "../Core/GameWorld";
import { EventArgs, ISubscriber } from "./GameEvent";
import { cli, CommandResult } from "../Helpers/Commands";


//WorldComponent = Plugin
export abstract class Plugin implements ISubscriber {
    public enabled: boolean = true;
    public readonly name: string = "Plugin";
    public readonly gameWorld!: GameWorld;

    //overideable methods
    protected event(args: EventArgs, alias?: string): void {}
    protected start(): void { }
    protected update(delta: number): void { }
    protected fixedUpdate(delta: number): void { }

    public getPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): T {
        return this.gameWorld.getPlugin(plugin);
    }
    public hasPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): boolean{
        return this.gameWorld.hasPlugin(plugin) ?? false;
    }

    protected cliGetName(): string {
        return this.name;
    }

    @cli("help")
    protected help(): CommandResult {
        const BLUE = "\x1b[36m";
        const RESET = "\x1b[0m";

        let message = `${BLUE}${this.cliGetName()}${RESET} commands:\n`;
        for (const element of Object.values((this as any).constructor["syntaxes"])) {
            message += `  /${this.cliGetName()}:${element}\n`;
        }
        return new CommandResult(true, message, undefined);
    }

    @cli("enable")
    private cliEnable(): CommandResult {
        const GREEN = "\x1b[32m";
        const RESET = "\x1b[0m";

        this.enabled = true;
        return new CommandResult(true, `${this.name} ${GREEN}enabled${RESET}`, undefined);
    }

    @cli("disable")
    private cliDisable(): CommandResult {
        const RED = "\x1b[31m";
        const RESET = "\x1b[0m";

        this.enabled = false;
        return new CommandResult(true, `${this.name} ${RED}disabled${RESET}`, undefined);
    }
}