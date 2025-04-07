export class CommandResult {
    public status: boolean;
    public message: string;
    public data: any;
    constructor(status: boolean, message: string, data: any) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

export function cli(name?: string, argsSyntax?: string, returnType?: string): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => CommandResult>) => void {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => CommandResult>): void {
        const originalMethod = descriptor.value;
        if (originalMethod) {
            name = name??propertyKey;
            returnType = returnType??"void";
            argsSyntax = argsSyntax??"";
            if (argsSyntax)
                argsSyntax = " " + argsSyntax;
            if (returnType)
                returnType = ": " + returnType;

            argsSyntax = name+argsSyntax+returnType; 
            const ctor = target.constructor;
            if (!Object.prototype.hasOwnProperty.call(ctor, "commands")) {
                ctor.commands = Object.assign({}, ctor.commands || {});
            }
            ctor.commands[name] = originalMethod;
            
            if (!Object.prototype.hasOwnProperty.call(ctor, "syntaxes")) {
                ctor.syntaxes = Object.assign({}, ctor.syntaxes || {});
            }
            console.log("Adding syntax: ", name, argsSyntax);
            ctor.syntaxes[name] = argsSyntax;
        }
    };
}

// export function gameCommand(
//     target: any, 
//     propertyKey: string, 
//     descriptor: TypedPropertyDescriptor<(...args: any[]) => CommandResult>,
// ): void {
//     // console.log(target);


//     const originalMethod = descriptor.value;
//     if (originalMethod) {
//         const ctor = target.constructor;
//         if (!Object.prototype.hasOwnProperty.call(ctor, "commands")) {
//             ctor.commands = Object.assign({}, ctor.commands || {});
//         }
//         ctor.commands[propertyKey] = descriptor.value;
//     }
// }

export function cliPlugin(name: string): (target: any) => void {
    return function (target: any): void {
        target.prototype.cliGetName = function (): string { return name; };
    };
}