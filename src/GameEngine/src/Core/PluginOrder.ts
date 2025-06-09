// Input → Update → Physics → Collision → Events → Render
export enum PluginOrder {
    None = -1, // no update
    Input = 0,
    Update = 1,
    Physics = 2,
    Collision = 3,
    Render = 4,
}