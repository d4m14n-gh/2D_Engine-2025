var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CommandResult, gameCommand } from "../Helpers/Commands";
//WorldComponent = Plugin
export class Plugin {
    gameWorld;
    enabled = true;
    name = "Plugin";
    //overideable methods
    event(args, alias) { }
    start() { }
    update(delta) { }
    fixedUpdate(delta) { }
    getPlugin(plugin) {
        return this.gameWorld.getPlugin(plugin);
    }
    hasPlugin(plugin) {
        return this.gameWorld.hasPlugin(plugin);
    }
    isEnabled() {
        return this.enabled;
    }
    enable(value = true) {
        this.enabled = value;
    }
    disable() {
        this.enabled = false;
    }
    cliGetName() {
        return this.name;
    }
    help() {
        let message = `Plugin ${this.cliGetName()} commands:\n`;
        for (const element of Object.keys(this.constructor["commands"])) {
            message += `/plugin ${this.cliGetName()} ${element}\n`;
        }
        return new CommandResult(true, message, undefined);
    }
    cliEnable() {
        this.enabled = true;
        return new CommandResult(true, `${this.name} enabled`, undefined);
    }
    cliDisable() {
        this.enabled = false;
        return new CommandResult(true, `${this.name} disabled`, undefined);
    }
}
__decorate([
    gameCommand,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", CommandResult)
], Plugin.prototype, "help", null);
__decorate([
    gameCommand,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", CommandResult)
], Plugin.prototype, "cliEnable", null);
__decorate([
    gameCommand,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", CommandResult)
], Plugin.prototype, "cliDisable", null);
