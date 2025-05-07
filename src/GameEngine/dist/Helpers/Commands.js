export class CommandResult {
    status;
    message;
    data;
    constructor(status, message, data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
export function gameCommand(target, propertyKey, descriptor) {
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
