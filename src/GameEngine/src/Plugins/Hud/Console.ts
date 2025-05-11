import { Plugin } from "../../Core/Plugin";
import { KeyboardEventArgs, KeyboardPlugin } from "../Keyboard";
import { EventArgs } from "../../Core/GameEvent";
import { CliPlugin } from "../CliPlugin";
import { cli, cliPlugin, CommandResult } from "../../Helpers/Commands";
import { rgb } from "../../Helpers/Color";
import { AnsiUp }  from 'ansi-up';

export class ConsoleEventArgs extends EventArgs {
    public message: string;
    constructor(message: string) {
        super();
        this.message = message;
    }
}

@cliPlugin("console")
export class ConsolePlugin extends Plugin {
    public name: string = "ConsolePlugin";
    private isVisible: boolean = true;
    private consoleWrapper: HTMLDivElement = document.createElement("div");
    private buffer: string = "";
    private history: string[] = [""];
    private historyIndex: number = 0;

    constructor() {
        super();
        document.body.appendChild(this.consoleWrapper);
        this.consoleWrapper.innerHTML = this.getInnerHtml();
    }

    override start(): void {
        this.getPlugin(KeyboardPlugin).KeyDownEvent.subscribe(this, "keydown");
        this.getPlugin(KeyboardPlugin).BlockedKeyDownEvent.subscribe(this, "keydown");
    }

    protected override event(args: EventArgs, alias?: string): void {
        const key = (args as KeyboardEventArgs).key;
        let input
        try {
            input = this.consoleWrapper.querySelector(".console-input") as HTMLInputElement;
        } catch {}
        if (!input) return;
        
        if(this.isFocused()){
            if (key == "arrowup") {
                if (this.historyIndex < this.history.length-1) {
                    this.historyIndex++;
                    input.value = this.history[this.historyIndex];
                }
            }
            if (key == "arrowdown") {
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    console.log(this.historyIndex);
                    console.log(this.history);
                    input.value = this.history[this.historyIndex];
                }
            }
            if (key == "escape") {
                input.blur();
                input.value = "";
            }
            if (key == "enter") {
                const value = input.value.trim();
                if (value !== "") {
                    input.value = "";
                    console.log("Sending:", value);
                    this.messageEntered(value);
                }
                input.blur();
            }
        }
        else { 
            if (key == "enter"&&this.isVisible) {
                input.focus();
            }
            if (key == "t") {
                try{
                    if (this.isVisible){
                        document.body.removeChild(this.consoleWrapper);
                        input.blur();
                    }
                    else
                    document.body.appendChild(this.consoleWrapper);
                    this.isVisible = !this.isVisible;
                }
                catch (error) {
                    console.log("Error: ", error);
                }
            }
        }
        this.getPlugin(KeyboardPlugin).block = this.isFocused();
    }

    public isFocused(): boolean {
        try {
            const input = this.consoleWrapper.querySelector(".console-input") as HTMLInputElement;
            if (input == null) 
                return false;
            return document.activeElement === input;
        } catch { 
            return false; 
        }     
    }

    public writeLine(message: string): void {
        this.buffer += message + "\r\n";
        this.setStatus("white");
        this.updateConsole();
    }

    private messageEntered(message: string): void {
        // this.chatMessageEvent.emit(new ChatEventArgs(message));
        if (message.startsWith("/")){
            this.buffer += message + "\n";
            const result = this.getPlugin(CliPlugin).execute(message.slice(1));
            if (result.message != "")
                this.buffer += result.message + "\r\n";
            if (result.status)
                this.setStatus("#485b49");
            else
                this.setStatus("#813136");
        }
        else{
            this.buffer += message + "\r\n";
            this.setStatus("white");
        }
        this.history[0] = message;
        this.history.unshift("");
        this.historyIndex = 0;
        // this.buffer += "<hr class='console-item-separator'/>";
        this.updateConsole();
    }

    private setStatus(status: rgb | string): void {
        try {
            const statusBar = this.consoleWrapper.querySelector(".console-status") as HTMLInputElement;
            if (statusBar == null) 
                return;
            statusBar.style.backgroundColor = status.toString();
        } catch {}
    }

    private updateConsole(): void {
        this.setElementsHtml(this.buffer);
    }

    private setElementsHtml(buffer: string): void {
        try {
            const content = this.consoleWrapper.querySelector(".console-content") as HTMLInputElement;
            if (content == null) 
                return;
            content.innerHTML = "";
            const lines = buffer.split("\n");
            for (let i = 0; i < lines.length-1; i++) {
                const line = lines[i];

                const convert = new AnsiUp();
                const html = convert.ansi_to_html(line);

                let span = document.createElement("span");
                // span.textContent = line;
                span.innerHTML = html;
                content.appendChild(span);
                const separator = document.createElement("hr");
                separator.className = "console-item-separator"
                if (line.endsWith("\r"))
                    content.appendChild(separator);
                else
                    content.appendChild(document.createElement("br"));
            }
        } catch {}
    }
        
    private getInnerHtml(): string {
        const profiler = `
            <style>
                .console{
                    ${this.isVisible ? "" : "display: none;"}
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    
                    width: 400px;
                    padding: 20px;
                    border-radius: 20px;
                    background-color: rgba(42, 43, 46, 0.382);
                    color: white;
                    font-family: "IBM Plex Mono", monospace;
                    pointer-events: none;
                    overflow: hidden;
                }
                .console-status{
                    margin: 7px 0;
                    height: 6px;
                    background-color: white;
                    opacity: 1;
                    border-radius: 999px;
                }
                .console-header{
                    font-size: 20px;
                    font-weight: bold;
                    height: 40px;
                    color: white;
                    margin-bottom: 10px;
                    user-select: none;
                }
                .console-input{
                    width: 100%; 
                    padding: 5px 0;
                    margin: 0;
                    border-radius: 0; 
                    border: none; 
                    border-bottom: 1px solid rgba(240, 240, 240, 0.5);
                    background-color: transparent; 
                    color: white;
                    font-size: 20px;   
                }
                .console *::selection {
                    background-color: #546855;
                    color: white;
                }
                .console-input:focus{
                    outline: none; 
                    border-bottom: 1px solid rgba(240, 240, 240, 0.85);
                }
                .console-content-wrapper{
                    position: relative;
                    height: 600px;
                    width: 100%;
                    overflow: hidden;
                }
                .console-content{
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    position: absolute;
                    width: 100%;
                    line-height: 20px;
                    font-size: 20px;
                    margin: 0;
                    bottom: 0;
                }
                .console-item-separator{
                    border: none;
                    border-top: 1px dashed gray;
                    opacity: 0.75;
                    margin: 9.5px 0;
                }t
            </style>

            <div class="console">
                <div class="console-header">
                    <h2 style="margin: 0">Console <span style="opacity: 0.5">[T]</span></h2>
                </div>
                <div class="console-status"></div>
                <div class="console-content-wrapper">
                    <pre class="console-content"></pre>
                </div>
                    <input class="console-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" type="text" tabindex="-1" placeholder="Type your command here..." />
            </div>
            `
        // <div class="console-header">
        //         <h2 style="margin: 0">Console <span style="opacity: 0.5">[T]</span></h2>
        //     </div>
        return profiler;
    }

    @cli("clear")
    public clearConsole(): CommandResult {
        this.buffer = "";
        this.updateConsole();
        return new CommandResult(true, "", undefined);
    }
}