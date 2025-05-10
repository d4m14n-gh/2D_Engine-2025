export class rgb{
    public readonly r: number = 0;
    public readonly g: number = 0;
    public readonly b: number = 0;
    public a: number = 1;
  
    public static readonly stroke: rgb = new rgb(43,43,44);
    // public static readonly background: rgb = new rgb(91, 93, 98);
    public static readonly background: rgb = new rgb(93, 97, 95);
    constructor(r: number, g:number, b: number, a: number=1) {
      this.r = Math.min(255, Math.max(0, r));
      this.g = Math.min(255, Math.max(0, g));
      this.b = Math.min(255, Math.max(0, b));
      this.a = Math.min(1, Math.max(0, a));
    }
    public toString(): string{
      return `rgba(${this.r},${this.g},${this.b},${Math.max(0, Math.min(this.a, 1))})`;
    }
    public toRgb(): rgb{
      return new rgb(this.r, this.g, this.b);
    }
    public toArgb(alpha: number){
      return new rgb(this.r, this.g, this.b, alpha);
    }
    public blend(color: rgb, alpha: number): rgb{
      return new rgb(this.r*(1-alpha)+color.r*alpha, this.g*(1-alpha)+color.g*alpha, this.b*(1-alpha)+color.b*alpha, this.a*(1-alpha)+color.a*alpha);
    }
    public static randomColor(): rgb{
      return new rgb(Math.random()*255, Math.random()*255, Math.random()*255);
    }
    public static hslToRgb(h: number, s: number, l: number): rgb {
      s /= 100;
      l /= 100;
      const k = (n: number) => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      const r = Math.round(f(0) * 255);
      const g = Math.round(f(8) * 255);
      const b = Math.round(f(4) * 255);
      
      return new rgb(r, g, b);
    }
    public static randomColor2(): rgb {
      const hue = Math.floor(Math.random() * 360);
      const saturation = Math.floor(Math.random() * 35) + 15;
      const lightness = Math.floor(Math.random() * 25) + 30;
    
      return rgb.hslToRgb(hue, saturation, lightness);
    }
    public static getHeatmapColor(value: number): rgb {
        value = Math.max(0, Math.min(1, value));
        let g = Math.min(255, Math.max(0, Math.floor(255 * value * 2)));
        let r = Math.min(255, Math.max(0, Math.floor(255 * (2 - value * 2))));
        return new rgb(r/1.5, g/1.5, 0, 255);
    }
    
    public static tryParseCssColor(color: string): rgb | undefined{
      let tempElem = document.body;
      let lastColor = tempElem.style.color;
      tempElem.style.color = color;
      let computedColor = getComputedStyle(tempElem).color;
      tempElem.style.color = lastColor;
      return this.getRgbFromComputedStyle(computedColor);
    }
  
    private static getRgbFromComputedStyle(style: string): rgb | undefined {
      let match = style.match(/^rgb(a?)\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
      if (!match) return undefined;
      return new rgb(
          parseInt(match[2]), 
          parseInt(match[3]),
          parseInt(match[4]),
          parseFloat(match[5] ?? 1)
      );
    }
    public clone(): rgb{
      return new rgb(this.r, this.g, this.b, this.a);
    }
  }
  