export abstract class Sub<T extends object>{
    private subs: Set<WeakRef<[T, func: (...args: any[]) => void]>> = new Set();
    public subscribe(sub: T, func: (...args: any[]) => void){
        this.subs.add(new WeakRef([sub, func]));
    }
    public invoke(...args: any[]): void{
        for (const sub of this.subs){
            if(sub.deref())
                sub.deref()![1].apply(sub.deref()![0], args);
            else {
                this.subs.delete(sub);
            }
        } 
    }
}