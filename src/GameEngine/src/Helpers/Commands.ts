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

export function gameCommand(
    target: any, 
    propertyKey: string, 
    descriptor: TypedPropertyDescriptor<(...args: any[]) => CommandResult>,
): void {
    // console.log(target);


    const originalMethod = descriptor.value;
    if (originalMethod) {
        const ctor = target.constructor;
        if (!Object.prototype.hasOwnProperty.call(ctor, "commands")) {
            ctor.commands = Object.assign({}, ctor.commands || {});
        }
        ctor.commands[propertyKey] = descriptor.value;
    }
}