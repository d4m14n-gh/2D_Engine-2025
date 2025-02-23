export class Color{
    public readonly r: number = 0;
    public readonly g: number = 0;
    public readonly b: number = 0;
    public a: number = 1;
  
    public static readonly stroke: Color = new Color(43,43,44);
    public static readonly background: Color = new Color(88,90,93);
    //a = "rgb(88,90,93)";
    constructor(r: number, g:number, b: number, a: number=1) {
      this.r = Math.min(255, Math.max(0, r));
      this.g = Math.min(255, Math.max(0, g));
      this.b = Math.min(255, Math.max(0, b));
      this.a = Math.min(1, Math.max(0, a));
    }
    public toString(): string{
      return `rgba(${this.r},${this.g},${this.b},${Math.max(0, Math.min(this.a, 1))})`;
    }
    public toRgb(): Color{
      return new Color(this.r, this.g, this.b);
    }
    public toArgb(alpha: number){
      return new Color(this.r, this.g, this.b, alpha);
    }
    public static randomColor(): Color{
      return new Color(Math.random()*255, Math.random()*255, Math.random()*255);
    }
    public static hslToRgb(h: number, s: number, l: number): Color {
      s /= 100;
      l /= 100;
      const k = (n: number) => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      const r = Math.round(f(0) * 255);
      const g = Math.round(f(8) * 255);
      const b = Math.round(f(4) * 255);
      
      return new Color(r, g, b);
    }
    public static randomColor2(): Color {
      const hue = Math.floor(Math.random() * 360);
      const saturation = Math.floor(Math.random() * 50) + 30;
      const lightness = Math.floor(Math.random() * 45) + 15;
    
      return Color.hslToRgb(hue, saturation, lightness);
    }
    public static getHeatmapColor(value: number): Color {
        value = Math.max(0, Math.min(1, value));
        let g = Math.min(255, Math.max(0, Math.floor(255 * value * 2)));
        let r = Math.min(255, Math.max(0, Math.floor(255 * (2 - value * 2))));
        return new Color(r/2, g/2, 0, 255);
    }
    public clone(): Color{
      return new Color(this.r, this.g, this.b, this.a);
    }
  }
  