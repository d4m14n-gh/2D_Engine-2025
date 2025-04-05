import { EventArgs, GameEvent } from "../Core/GameEvent";
import { Plugin } from "../Core/Plugin";
import { CommandResult, gameCommand } from "../Helpers/Commands";
import { Vector } from "../Helpers/Vector";
import { KeyboardEventArgs, KeyboardPlugin } from "./Keyboard";
import { PlayerPlugin } from "./Player";

export class ChatEventArgs extends EventArgs {
    public message: string;
    constructor(message: string) {
        super();
        this.message = message;
    }
}

export class ChatPlugin extends Plugin {
    
    public name: string = "ChatPlugin";
    private chatMessages: string[] = [];
    private chatHistory: string[] = [];
    private chatHistoryIndex: number = 0;
    private isListening: boolean = false;
    public chatMessageEvent: GameEvent = new GameEvent();
    private textField: HTMLInputElement;
    private textArea: HTMLDivElement;
    
    constructor(textField: HTMLInputElement, textArea: HTMLDivElement) {
        super();
        this.textField = textField;
        this.textArea = textArea;
        // this.textField.addEventListener("input", (event) => this.message = (event.target as HTMLInputElement).value);
        this.textField.addEventListener("blur", () => this.isListening = false);
        this.textField.addEventListener("focus", () => this.isListening = true);
    }

    protected override start(): void {
        this.getPlugin(KeyboardPlugin)?.KeyDownEvent.subscribe(this, "KeyDownEvent");
        this.chatMessageEvent.register(this.gameWorld);
    }

    protected override event(args: EventArgs, alias?: string): void {
        const keyboardArgs = args as KeyboardEventArgs;
        if (keyboardArgs.key === "enter") {
            if(this.textField.value != "") {
                this.sendChatMessage(this.textField.value);
                this.textField.value = "";
            }
            this.chatHistoryIndex = -1;
            this.isListening = !this.isListening;
        } else if (keyboardArgs.key === "escape") {
            this.isListening = false;
            this.textField.value = "";
        } 
        else if (this.isListening && keyboardArgs.key === "arrowup") {
            if (this.chatHistory.length > 0) {
                this.chatHistoryIndex = Math.min(this.chatHistoryIndex + 1, this.chatHistory.length - 1);
                this.textField.value = this.chatHistory[this.chatHistory.length - 1 - this.chatHistoryIndex];
            }
        } 
        else if (this.isListening && keyboardArgs.key === "arrowdown") {
            if (this.chatHistory.length > 0) {
                this.chatHistoryIndex = Math.max(this.chatHistoryIndex - 1, 0);
                this.textField.value = this.chatHistory[this.chatHistory.length - 1 - this.chatHistoryIndex] || "";
            }
        }
        if(this.isListening)
            this.textField.focus();
        else
            this.textField.blur();
        this.getPlugin(PlayerPlugin).enable(!this.isListening);
    }

    offset: Vector = new Vector(60, 900);
   
    private drawChatMessages(): void 
    {
        this.textArea.innerHTML = "";
        while (this.chatMessages.length > 8)
            this.chatMessages.shift();
        let len = this.chatMessages.length;
        for(let i = 0; i < this.chatMessages.length; i++)
        {
            let message = document.createElement("div");
            message.innerText = this.chatMessages[len-1-i];
            this.textArea.appendChild(message);
        }
    }

    public sendChatMessage(message: string, self: boolean=true): void {
        if(self){
            this.chatMessageEvent.emit(new ChatEventArgs(message));
            if (message.startsWith("/")){
                const result = this.parseArgumentsWithCommands(message.slice(1));
                this.sendChatMessage(result.message, false);
            }
            this.chatHistory.push(message);
            return;
        }
        console.log(message);
        this.chatMessages.push(message);
        this.drawChatMessages();
    }


    override cliGetName(): string {
        return "chat";
    }

    @gameCommand//("echo <message>")
    public echo(message: string): CommandResult {
        return new CommandResult(true, message, message);
    }

    private parseArgumentsWithCommands(input: string, depth: number = 0): CommandResult {
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
                if(char === "("){
                    parenDepth++;
                    current+= char;
                    continue;
                }
                if(char === ")"){
                    parenDepth--;
                    if(parenDepth===0){
                        const result = this.parseArgumentsWithCommands(current, depth+1);
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
            if (char === "(") {
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
            const plugin = this.gameWorld.getAllPlugins().find(p => p.cliGetName() === pluginName);
            if (!plugin)
                return new CommandResult(false, `Plugin ${pluginName} not found`, undefined);
            return this.executeCommand(plugin, fullCommand[1], ...args.slice(1));
        }
        else {
            return new CommandResult(false, "No command found", undefined);
        }
    }
    
    ///player setname "d 4 m 1 4 n" "(player setname d4 '(player setname d)')"
    // private executeCommandRaw(message: string): CommandResult {
    //     console.log(message);

    //     const commandw = message.match(/"([^"]*)"|'([^']*)'|[^\s]+/g) || [];
    //     const commandt = commandw.map((part) => part.trim());
    //     const commands = commandt.map(arg => {
    //         if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'")))
    //           return arg.slice(1, -1); 
    //         return arg;
    //     });
    //     //to do namespaces
    //     const pluginName = commands[0];
    //     const command = commands[1];
    //     const args = commands.slice(2); 

    //     const plugin = this.gameWorld.getAllPlugins().find(p => p.cliGetName() === pluginName);
    //     if (!plugin)
    //         return new CommandResult(false, `Plugin ${pluginName} not found`, undefined);
    //     const argsParsed = args.map(arg => {
    //         if (arg.startsWith('(') && arg.endsWith(')')){
    //             const content = arg.slice(1, -1);
    //             const result = this.executeCommandRaw(content);
    //             console.log(result.message);
    //             return result.data;
    //         }
    //         return arg;
    //     });
    //     return this.executeCommand(plugin, command, ...argsParsed);
    // }

    private executeCommand(plugin: Plugin, command: string, ...args: any[]): CommandResult {
        // console.log(command, args);
        try {
            let commandToApply = (plugin as any).constructor["commands"][command];
            let result: CommandResult = commandToApply.apply(plugin, args);
            return result;
        } catch { }
        return new CommandResult(false, `Failed to execute command ${command} on ${plugin.cliGetName()}`, undefined);
    }
}