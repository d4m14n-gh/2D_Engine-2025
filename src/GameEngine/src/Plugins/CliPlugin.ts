import { Plugin } from "../Core/Plugin";
import { rgb } from "../Helpers/Color";
import { cli, cliPlugin, CommandResult } from "../Helpers/Commands";

@cliPlugin("cli")
export class CliPlugin extends Plugin {
    public name: string = "CliPlugin";
    
    @cli("echo", "<message: string>", "string")
    private echo(message: string): CommandResult {
        return new CommandResult(true, message, message);
    }
    @cli("loop", "<iterations: int> <command: string>", "string")
    private loop(iters: number, command: string): CommandResult {
        let ret = [];
        let message = "";
        for (let i = 0; i < iters; i++) {
            const result = this.parseAndExecuteCommands(command);
            if (!result.status) {
                return new CommandResult(false, `Error executing command: ${result.message}`, undefined);
            }
            ret.push(result.data);
            message += `${result.message}\n`;
        }
        return new CommandResult(true, message, ret);
    }
    @cli("true", undefined, "bool")
    private true(): CommandResult {
        const message = "This is a true command";
        return new CommandResult(true, message, true);
    }
    @cli("false", undefined, "bool")
    private false(): CommandResult {
        const message = "This is a false command";
        return new CommandResult(true, message, false);
    }
    @cli("int", "<value: string>", "number")
    private int(value: string): CommandResult{
        const message = `This is an int command with value ${value}`;
        return new CommandResult(true, message, parseInt(value));
    }
    @cli("float", "<value: string>", "number")
    private float(value: string): CommandResult{
        const message = `This is a float command with value ${value}`;
        return new CommandResult(true, message, parseFloat(value));
    }
    @cli("randomcolor",undefined, "rgb")
        private getrandomcolor(): CommandResult {
        const randomColor = rgb.randomColor2();
        return new CommandResult(true, `Random color is ${randomColor}`, randomColor);
    }
    @cli("help")
    protected override help(): CommandResult {
        let superResult = super.help();

        let message = `plugins:\n`;
        for (const plugin of this.gameWorld.getAllPlugins()) {
            message += `/${(plugin as any).cliGetName()}\n`;
        }
        message = superResult.message + "\n" + message;
        return new CommandResult(true, message, undefined);
    }

    public execute(command: string): CommandResult {
        try{
            return this.parseAndExecuteCommands(command);
        }
        catch {
            return new CommandResult(false, "Command execution failed", undefined);
        }
    }

    private parseAndExecuteCommands(input: string, depth: number = 0): CommandResult {
        console.log(("---".repeat(depth))+"Parsing: "+input);
        const args: any[] = [];
        let current = '';
        let inSingleQuote = false;
        let inDoubleQuote = false;
        let parenDepth = 0;
    
        input = input.trim();
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            
            if(parenDepth>0){
                if(char === "{"){
                    parenDepth++;
                    current+= char;
                    continue;
                }
                if(char === "}"){
                    parenDepth--;
                    if(parenDepth===0){
                        const result = this.parseAndExecuteCommands(current, depth+1);
                        // console.log("   ".repeat(depth)+result.message);
                        args.push(result.data);
                        current = '';
                    }
                    else
                        current+=char;
                    continue;
                }
                current += char;
                continue;
            }
            
            if (inDoubleQuote) {
                if (char === "\"") {
                    args.push(current);
                    current = '';
                    inDoubleQuote = false;
                    continue;
                }
                current += char;
                continue;
            }
            if (inSingleQuote) {
                if (char === "'") {
                    args.push(current);
                    current = '';
                    inSingleQuote = false;
                    continue;
                }
                current += char;
                continue;
            }
            if (char === "\"") {
                inDoubleQuote = true;
                continue;
            }
            if (char === "'") {
                inSingleQuote = true;
                continue;
            }
            if (char === "{") {
                parenDepth++;
                continue;
            }
            if (char === " ") {
                if (current.trim() !== ""){
                    args.push(current);
                    current = '';
                }
                continue;
            }
            current += char;
        }
        if (current.trim() !== "") {
            args.push(current);
        }
        console.log("---".repeat(depth)+"Parsing result: ",args);
        const fullCommand = args[0].split(':');
        if (fullCommand.length === 2) {
            const pluginName = fullCommand[0];
            const plugin = this.gameWorld.getAllPlugins().find(p => (p as any).cliGetName() === pluginName);
            if (!plugin)
                return new CommandResult(false, `Plugin ${pluginName} not found`, undefined);
            return this.executeParsedCommand(plugin, fullCommand[1], ...args.slice(1));
        }
        else if (fullCommand.length === 1) {
            return this.executeParsedCommand(this, fullCommand[0], ...args.slice(1));
        }
        else {
            return new CommandResult(false, "No command found", undefined);
        }
    }
    
    private executeParsedCommand(plugin: Plugin, command: string, ...args: any[]): CommandResult {
        if ((plugin as any).constructor["commands"][command] === undefined) {
            return new CommandResult(false, `Command ${command} not found`, undefined);
        }
        try {
            let commandToApply = (plugin as any).constructor["commands"][command];
            let result: CommandResult = commandToApply.apply(plugin, args);
            return result;
        } catch { }
        return new CommandResult(false, `Failed to execute command ${command} on ${(plugin as any).cliGetName()}`, undefined);
    }
}