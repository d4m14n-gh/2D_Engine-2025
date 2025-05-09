// import { EventArgs, GameEvent } from "../Core/GameEvent";
// import { Plugin } from "../Core/Plugin";
// import { cli, CommandResult } from "../Helpers/Commands";
// import { Vector } from "../Helpers/Vector";
// import { CliPlugin } from "./CliPlugin";
// import { KeyboardEventArgs, KeyboardPlugin } from "./Keyboard";
// // import { PlayerPlugin } from "./Player";

// export class ChatEventArgs extends EventArgs {
//     public message: string;
//     constructor(message: string) {
//         super();
//         this.message = message;
//     }
// }

// export class ChatPlugin extends Plugin {
//     public name: string = "ChatPlugin";
//     private chatMessages: string[] = [];
//     private chatHistory: string[] = [];
//     private chatHistoryIndex: number = 0;
//     private isListening: boolean = false;
//     public chatMessageEvent: GameEvent = new GameEvent();
//     public chatFocused: GameEvent = new GameEvent();
//     public chatBlured: GameEvent = new GameEvent();
//     // private textField: HTMLInputElement;
//     // private textArea: HTMLDivElement;
    
//     constructor(textField: HTMLInputElement, textArea: HTMLDivElement) {
//         super();
//         // this.textField = textField;
//         // this.textArea = textArea;
//         // this.textField.addEventListener("blur", () => {this.isListening = false, this.chatBlured.emit(new EventArgs())});
//         // this.textField.addEventListener("focus", () => {this.isListening = true; this.chatFocused.emit(new EventArgs());});
//     }

//     protected override start(): void {
//         this.getPlugin(KeyboardPlugin)?.KeyDownEvent.subscribe(this, "KeyDownEvent");
//         this.chatMessageEvent.register(this.gameWorld);
//         this.chatFocused.register(this.gameWorld);
//         this.chatBlured.register(this.gameWorld);
//     }

//     protected override event(args: EventArgs, alias?: string): void {
//         const keyboardArgs = args as KeyboardEventArgs;
//         if (keyboardArgs.key === "enter") {
//             // if(this.textField.value != "") {
//             //     this.sendChatMessage(this.textField.value);
//             //     this.textField.value = "";
//             // }
//             this.chatHistoryIndex = -1;
//             this.isListening = !this.isListening;
//         } else if (keyboardArgs.key === "escape") {
//             this.isListening = false;
//             // this.textField.value = "";
//         } 
//         else if (this.isListening && keyboardArgs.key === "arrowup") {
//             if (this.chatHistory.length > 0) {
//                 this.chatHistoryIndex = Math.min(this.chatHistoryIndex + 1, this.chatHistory.length - 1);
//                 // this.textField.value = this.chatHistory[this.chatHistory.length - 1 - this.chatHistoryIndex];
//             }
//         } 
//         else if (this.isListening && keyboardArgs.key === "arrowdown") {
//             if (this.chatHistory.length > 0) {
//                 this.chatHistoryIndex = Math.max(this.chatHistoryIndex - 1, 0);
//                 // this.textField.value = this.chatHistory[this.chatHistory.length - 1 - this.chatHistoryIndex] || "";
//             }
//         }
//         if(this.isListening){
//             // this.textField.focus();
//             this.chatFocused.emit(new EventArgs());
//         }
//         else{
//             // this.textField.blur();
//             this.chatBlured.emit(new EventArgs());
//         }
//     }

//     offset: Vector = new Vector(60, 900);
   
//     private drawChatMessages(): void 
//     {
//         // this.textArea.innerHTML = "";
//         while (this.chatMessages.length > 8)
//             this.chatMessages.shift();
//         let len = this.chatMessages.length;
//         for(let i = 0; i < this.chatMessages.length; i++)
//         {
//             let message = document.createElement("div");
//             message.innerText = this.chatMessages[len-1-i];
//             // this.textArea.appendChild(message);
//         }
//     }


//     public sendChatMessage(message: string, self: boolean=true): void {
//         if(self){
//             this.chatMessageEvent.emit(new ChatEventArgs(message));
//             if (message.startsWith("/")){
//                 const result = this.getPlugin(CliPlugin).execute(message.slice(1));
//                 this.sendChatMessage(result.message, false);
//             }
//             this.chatHistory.push(message);
//             return;
//         }
//         console.log(message);
//         this.chatMessages.push(message);
//         this.drawChatMessages();
//     }

//     public isFocused(): boolean{
//         return this.isListening;
//     }

//     override cliGetName(): string {
//         return "chat";
//     }
    
//     @cli("clear")
//     public clearChat(): CommandResult {
//         this.chatMessages = [];
//         this.drawChatMessages();
//         return new CommandResult(true, "Chat cleared", undefined);
//     }
// }