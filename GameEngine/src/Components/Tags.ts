import { Component } from "../Core/Component";

export class TagsC extends Component {
    private tags: Set<string> = new Set<string>();
    
    constructor(...tags: string[]) {
        super();
        tags.forEach(tag => this.addTag(tag));
    }

    public addTag(tag: string): void {
        this.tags.add(tag);
    }

    public removeTag(tag: string): void {
        this.tags.delete(tag);
    }

    public hasTag(tag: string): boolean {
        return this.tags.has(tag);
    }

    public getTags(): string[] {
        return Array.from(this.tags);
    }
} 