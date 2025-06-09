import N from "http";
import { Server as D } from "socket.io";
class m {
  status;
  message;
  data;
  constructor(t, e, s) {
    this.status = t, this.message = e, this.data = s;
  }
}
function g(i, t, e) {
  return function(s, n, r) {
    const a = r.value;
    if (a) {
      i = i ?? n, e = e ?? "void", t = t ?? "", t && (t = " " + t), e && (e = ": " + e), t = i + t + e;
      const o = s.constructor;
      Object.prototype.hasOwnProperty.call(o, "commands") || (o.commands = Object.assign({}, o.commands || {})), o.commands[i] = a, Object.prototype.hasOwnProperty.call(o, "syntaxes") || (o.syntaxes = Object.assign({}, o.syntaxes || {})), o.syntaxes[i] = t;
    }
  };
}
function U(i) {
  return function(t) {
    t.prototype.cliGetName = function() {
      return i;
    };
  };
}
var z = Object.defineProperty, Y = Object.getOwnPropertyDescriptor, _ = (i, t, e, s) => {
  for (var n = Y(t, e), r = i.length - 1, a; r >= 0; r--)
    (a = i[r]) && (n = a(t, e, n) || n);
  return n && z(t, e, n), n;
};
class w {
  gameWorld;
  enabled = !0;
  name = "Plugin";
  //overideable methods
  event(t, e) {
  }
  start() {
  }
  update(t) {
  }
  getPlugin(t) {
    return this.gameWorld.getPlugin(t);
  }
  hasPlugin(t) {
    return this.gameWorld.hasPlugin(t);
  }
  isEnabled() {
    return this.enabled;
  }
  enable(t = !0) {
    this.enabled = t;
  }
  disable() {
    this.enabled = !1;
  }
  cliGetName() {
    return this.name;
  }
  help() {
    let s = `\x1B[36m${this.cliGetName()}\x1B[0m commands:
`;
    for (const n of Object.values(this.constructor.syntaxes))
      s += `  /${this.cliGetName()}:${n}
`;
    return new m(!0, s, void 0);
  }
  cliEnable() {
    const t = "\x1B[32m", e = "\x1B[0m";
    return this.enabled = !0, new m(!0, `${this.name} ${t}enabled${e}`, void 0);
  }
  cliDisable() {
    const t = "\x1B[31m", e = "\x1B[0m";
    return this.enabled = !1, new m(!0, `${this.name} ${t}disabled${e}`, void 0);
  }
}
_([
  g("help")
], w.prototype, "help");
_([
  g("enable")
], w.prototype, "cliEnable");
_([
  g("disable")
], w.prototype, "cliDisable");
class O {
  constructor() {
  }
}
class E {
  subs = /* @__PURE__ */ new Map();
  args = [];
  subscribe(t, e) {
    this.subs.set(new WeakRef(t), e);
  }
  unsubscribe(t) {
    this.subs.delete(new WeakRef(t));
  }
  emit(t) {
    this.args.push(t);
  }
  register(t) {
    t.registerEvent(this);
  }
  invoke() {
    if (this.args.length != 0) {
      for (const [t, e] of this.subs) {
        const s = t.deref();
        if (!s) {
          this.subs.delete(t);
          continue;
        }
        for (const n of this.args)
          s.event(n, e);
      }
      this.args = [];
    }
  }
}
var b = /* @__PURE__ */ ((i) => (i[i.None = -1] = "None", i[i.Input = 0] = "Input", i[i.Update = 1] = "Update", i[i.Physics = 2] = "Physics", i[i.Collision = 3] = "Collision", i[i.Render = 4] = "Render", i))(b || {});
class F extends O {
  key;
  constructor(t) {
    super(), this.key = t;
  }
}
class K extends w {
  order = b.Input;
  name = "KeyboardPlugin";
  KeyDownEvent = new E();
  BlockedKeyDownEvent = new E();
  block = !1;
  NowPressedKeys = /* @__PURE__ */ new Set();
  pressedKeys = /* @__PURE__ */ new Set();
  constructor() {
    super(), this.pressedKeys = /* @__PURE__ */ new Set(), document.onkeydown = (t) => {
      const e = t.key.toLowerCase();
      this.pressedKeys.add(e), this.NowPressedKeys.add(e);
    }, document.onkeyup = (t) => {
      const e = t.key.toLowerCase();
      this.pressedKeys.delete(e);
    };
  }
  isPressed(t) {
    return this.isEnabled() && !this.block && this.pressedKeys.has(t);
  }
  start() {
    this.KeyDownEvent.register(this.gameWorld), this.BlockedKeyDownEvent.register(this.gameWorld);
  }
  update(t) {
    this.NowPressedKeys.forEach((e) => {
      this.block ? this.BlockedKeyDownEvent.emit(new F(e)) : this.KeyDownEvent.emit(new F(e));
    }), this.NowPressedKeys.clear();
  }
}
class S extends w {
  order = b.Render;
  name = "ProfilerPlugin";
  size = 250;
  isVisible = !0;
  profilerWrapper = document.createElement("div");
  usage = /* @__PURE__ */ new Map();
  constructor() {
    super();
  }
  start() {
    this.getPlugin(K).KeyDownEvent.subscribe(this, "keydown"), document.body.appendChild(this.profilerWrapper), this.addRecord("Fps", 0);
  }
  lastTime = performance.now();
  frames = 0;
  fpsHistory = [];
  update(t) {
    const e = 1 / t;
    this.addRecord("Fps", e), this.frames++;
    const s = performance.now();
    if (s - this.lastTime >= 250) {
      this.fpsHistory.push(this.frames * 4), this.fpsHistory.length > 100 && this.fpsHistory.shift(), this.frames = 0, this.lastTime = s;
      let n = [];
      for (const r of this.usage) {
        let a = r[0], o = r[1].length, h = 0;
        for (const l of r[1])
          h += l;
        h /= o, n.push(`${a}: ` + h.toFixed(2).toString());
      }
      this.profilerWrapper.innerHTML = this.getInnerHtml(n);
    }
  }
  event(t, e) {
    e == "keydown" && t.key == "p" && (this.isVisible = !this.isVisible);
  }
  addRecord(t, e) {
    if (!this.usage.has(t))
      this.usage.set(t, [e]);
    else {
      let s = this.usage.get(t);
      s.length >= this.size && s.shift(), s.push(e);
    }
  }
  getChartHtml(t) {
    t = t.slice(Math.max(0, t.length - 100), t.length);
    const e = 200;
    let s = '<div class="profiler-chart">';
    for (let n = 0; n < t.length; n++)
      s += `<div class="profiler-chart-item" style="height: ${t[n] / e * 100}px"></div>`;
    return s += "</div>", s;
  }
  getElementsHtml(t) {
    let e = "";
    for (let s = 0; s < t.length; s++)
      s > 0 && (e += '<hr class="profiler-item-separator">'), e += `<div class="profiler-item">
                <span class="profiler-item-key">${t[s].split(": ")[0]}:</span>
                <span class="profiler-item-value">${t[s].split(": ")[1]}</span>
            </div>`;
    return e;
  }
  getInnerHtml(t) {
    return `
            <style>
                .profiler{
                    ${this.isVisible ? "" : "display: none;"}
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    
                    width: 400px;
                    padding: 20px;
                    border-radius: 20px;
                    background-color: rgba(42, 43, 46, 0.382);
                    color: white;
                    pointer-events: none;
                }
                .profiler-header{
                    font-size: 20px;
                    font-weight: bold;
                    color: white;
                    margin-bottom: 10px;
                }
                .profiler-item{
                    // display: flex;
                    // justify-content: space-between;
                    padding: 5px 0;
                    color:rgba(240, 240, 240, 0.85)
                }
                .profiler-item-key{
                    margin-right: 10px;
                }
                .profiler-item-value{
                    color: #f0f0f0;
                }
                .profiler-item-separator{
                    border: none;
                    border-top: 1px dashed gray;
                    opacity: 0.75;
                    margin: 2px 0;
                }
                .profiler-chart{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: flex-end;
                    height: 100px;
                    width: 100%;
                    margin-bottom: 10px;
                    border-radius: 10px;
                    overflow: hidden;
                    opacity: 0.25;
                }
                .profiler-chart-item{
                    background-color: rgb(240, 240, 240);
                    width: 100%;
                    margin: 0;
                }
            </style>

            <div class="profiler">
                <div class="profiler-header">
                    <h2 style="margin: 0">Profiler <span style="opacity: 0.5">[P]</span></h2>
                </div>
                ${this.getChartHtml(this.fpsHistory)}
                ${this.getElementsHtml(t)}
            </div>
            `;
  }
}
class X {
  startTime = 0;
  prevWorldTime = 0;
  worldTime = 0;
  tickCount = 0;
  gameObjects = /* @__PURE__ */ new Map();
  plugins = /* @__PURE__ */ new Map();
  events = /* @__PURE__ */ new Set();
  componentsToStart = [];
  constructor(...t) {
    t.sort((e, s) => e.order - s.order);
    for (let e of t) {
      let s = e.constructor.name;
      if (this.plugins.has(s))
        throw new Error(`Plugin ${s} already exists in the game object`);
      e.gameWorld = this, this.plugins.set(s, e);
    }
  }
  //plugins
  tryGetPlugin(t) {
    const e = t.name;
    if (this.plugins.has(e))
      return this.plugins.get(e);
  }
  getPlugin(t) {
    const e = t.name;
    if (!this.plugins.has(e))
      throw new Error(`Plugin ${e} does not exist in the game world`);
    return this.plugins.get(e);
  }
  getPluginByName(t) {
    if (!this.plugins.has(t))
      throw new Error(`Plugin ${t} does not exist in the game world`);
    return this.plugins.get(t);
  }
  getAllPlugins() {
    return Array.from(this.plugins.values());
  }
  hasPlugin(t) {
    const e = t.name;
    return this.plugins.has(e);
  }
  //game objects
  isSpawned(t) {
    return this.gameObjects.has(t.getId());
  }
  spawn(t) {
    if (this.gameObjects.has(t.getId()))
      throw new Error(`GameObject ${t.name} already exists in the game world`);
    return t.gameWorld = this, this.gameObjects.set(t.getId(), t), t.getAllComponents().forEach((e) => this.componentsToStart.push(new WeakRef(e))), t;
  }
  destroy(t) {
    if (!this.gameObjects.has(t.getId()))
      throw new Error(`GameObject ${t.name} does'not exist in the game world`);
    t.enabled = !1, this.gameObjects.delete(t.getId());
  }
  getGameObject(t) {
    return this.gameObjects.get(t);
  }
  getAllGameObjects(t = !0) {
    return Array.from(this.gameObjects.values()).filter((e) => e.enabled || !t);
  }
  //components
  getComponents(t, e = !0) {
    return this.getAllGameObjects().filter((s) => s.hasComponent(t) && (s.getComponent(t).isEnabled() || !e)).map((s) => s.getComponent(t));
  }
  getAllComponents(t = !0) {
    return Array.from(this.getAllGameObjects(t)).flatMap((e) => e.getAllComponents());
  }
  //events
  registerEvent(t) {
    this.events.add(new WeakRef(t));
  }
  //time
  getWorldTime() {
    return this.worldTime / 1e3;
  }
  //flow control
  tick() {
    this.tickCount++, this.tickCount == 1 ? this.startWorld() : this.updateWorld(), this.startComponents(), this.invokeEvents();
  }
  startComponents() {
    for (let t of this.componentsToStart) {
      const e = t.deref();
      e && e.start();
    }
    this.componentsToStart = [];
  }
  startWorld() {
    this.startTime = performance.now(), this.Start(), this.plugins.forEach((t) => t.start());
  }
  updateWorld() {
    this.worldTime = performance.now() - this.startTime;
    const t = this.worldTime - this.prevWorldTime;
    this.prevWorldTime = this.worldTime, this.Update(t / 1e3), this.plugins.forEach((e) => {
      if (!e.isEnabled())
        return;
      let s = performance.now();
      e.update(t / 1e3), this.tryGetPlugin(S)?.addRecord(e.name, performance.now() - s);
    });
  }
  invokeEvents() {
    let t = performance.now();
    for (const e of this.events) {
      const s = e.deref();
      s ? s.invoke() : this.events.delete(e);
    }
    this.tryGetPlugin(S)?.addRecord("Events", performance.now() - t);
  }
  //overridable methods
  Start() {
  }
  Update(t) {
  }
}
class p {
  r = 0;
  g = 0;
  b = 0;
  a = 1;
  static stroke = new p(43, 43, 44);
  // public static readonly background: rgb = new rgb(91, 93, 98);
  static background = new p(93, 97, 95);
  constructor(t, e, s, n = 1) {
    this.r = Math.min(255, Math.max(0, t)), this.g = Math.min(255, Math.max(0, e)), this.b = Math.min(255, Math.max(0, s)), this.a = Math.min(1, Math.max(0, n));
  }
  toString() {
    return `rgba(${this.r},${this.g},${this.b},${Math.max(0, Math.min(this.a, 1))})`;
  }
  toRgb() {
    return new p(this.r, this.g, this.b);
  }
  toArgb(t) {
    return new p(this.r, this.g, this.b, t);
  }
  blend(t, e) {
    return new p(this.r * (1 - e) + t.r * e, this.g * (1 - e) + t.g * e, this.b * (1 - e) + t.b * e, this.a * (1 - e) + t.a * e);
  }
  static randomColor() {
    return new p(Math.random() * 255, Math.random() * 255, Math.random() * 255);
  }
  static hslToRgb(t, e, s) {
    e /= 100, s /= 100;
    const n = (c) => (c + t / 30) % 12, r = e * Math.min(s, 1 - s), a = (c) => s - r * Math.max(-1, Math.min(n(c) - 3, Math.min(9 - n(c), 1))), o = Math.round(a(0) * 255), h = Math.round(a(8) * 255), l = Math.round(a(4) * 255);
    return new p(o, h, l);
  }
  static randomColor2() {
    const t = Math.floor(Math.random() * 360), e = Math.floor(Math.random() * 30) + 15, s = Math.floor(Math.random() * 20) + 30;
    return p.hslToRgb(t, e, s);
  }
  static getHeatmapColor(t) {
    t = Math.max(0, Math.min(1, t));
    let e = Math.min(255, Math.max(0, Math.floor(255 * t * 2))), s = Math.min(255, Math.max(0, Math.floor(255 * (2 - t * 2))));
    return new p(s / 1.5, e / 1.5, 0, 255);
  }
  static tryParseCssColor(t) {
    let e = document.body, s = e.style.color;
    e.style.color = t;
    let n = getComputedStyle(e).color;
    return e.style.color = s, this.getRgbFromComputedStyle(n);
  }
  static getRgbFromComputedStyle(t) {
    let e = t.match(/^rgb(a?)\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    if (e)
      return new p(
        parseInt(e[2]),
        parseInt(e[3]),
        parseInt(e[4]),
        parseFloat(e[5] ?? 1)
      );
  }
  clone() {
    return new p(this.r, this.g, this.b, this.a);
  }
}
var H = Object.defineProperty, L = Object.getOwnPropertyDescriptor, x = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? L(t, e) : t, r = i.length - 1, a; r >= 0; r--)
    (a = i[r]) && (n = (s ? a(t, e, n) : a(n)) || n);
  return s && n && H(t, e, n), n;
};
let f = class extends w {
  order = b.None;
  name = "CliPlugin";
  globalCommands = /* @__PURE__ */ new Map();
  echo(i) {
    return new m(!0, i, i);
  }
  loop(i, t) {
    let e = [], s = "";
    for (let n = 0; n < i; n++) {
      const r = this.parseAndExecuteCommands(t);
      if (!r.status)
        return new m(!1, `Error executing command: ${r.message}`, void 0);
      e.push(r.data), s += `${r.message}
`;
    }
    return new m(!0, s, e);
  }
  true() {
    const i = "This is a true command";
    return new m(!0, i, !0);
  }
  false() {
    const i = "This is a false command";
    return new m(!0, i, !1);
  }
  int(i) {
    const t = `This is an int command with value ${i}`;
    return new m(!0, t, parseInt(i));
  }
  float(i) {
    const t = `This is a float command with value ${i}`;
    return new m(!0, t, parseFloat(i));
  }
  refresh() {
    const i = "This is a refresh command";
    return location.reload(), new m(!0, i, void 0);
  }
  getrandomcolor() {
    const i = p.randomColor2();
    return new m(!0, `Random color is ${i}`, i);
  }
  help() {
    let i = super.help(), t = `plugins:
`;
    for (const e of this.gameWorld.getAllPlugins())
      t += `/${e.cliGetName()}
`;
    return t = i.message + `
` + t, new m(!0, t, void 0);
  }
  art() {
    const i = `
\x1B[38;5;160m         ██████         \x1B[0m
\x1B[38;5;160m       ██████████       \x1B[0m
\x1B[38;5;160m      ████    ████      \x1B[0m
\x1B[38;5;82m    ████        ████    \x1B[0m
\x1B[38;5;82m   ████          ████   \x1B[0m
\x1B[38;5;82m  ████            ████  \x1B[0m
\x1B[38;5;82m  ████    ████    ████  \x1B[0m
\x1B[38;5;82m  ████████████████████  \x1B[0m
\x1B[38;5;226m   ██████████████████   \x1B[0m
\x1B[38;5;226m     ████████████████     \x1B[0m
\x1B[38;5;226m      ████    ██████      \x1B[0m
\x1B[38;5;196m      ████    ██████      \x1B[0m
\x1B[38;5;196m     ██████████████████     \x1B[0m
\x1B[38;5;196m    ████████████████████    \x1B[0m
\x1B[38;5;196m   ██████████████████████   \x1B[0m
\x1B[38;5;196m  ████████████████████████  \x1B[0m
\x1B[38;5;160m      ██████████████      \x1B[0m
\x1B[38;5;160m       ████████████       \x1B[0m
        `;
    return console.log(i), new m(!0, i, void 0);
  }
  execute(i) {
    try {
      return this.parseAndExecuteCommands(i);
    } catch {
      return new m(!1, "Command execution failed", void 0);
    }
  }
  start() {
    this.gameWorld.getAllPlugins().forEach((i) => {
      const t = i.constructor.name;
      try {
        for (let e of Object.keys(i.constructor.commands))
          this.globalCommands.has(e) ? this.globalCommands.set(e, void 0) : this.globalCommands.set(e, t);
      } catch {
      }
    });
  }
  parseAndExecuteCommands(i, t = 0) {
    console.log("---".repeat(t) + "Parsing: " + i);
    const e = [];
    let s = "", n = !1, r = !1, a = 0;
    i = i.trim();
    for (let h = 0; h < i.length; h++) {
      const l = i[h];
      if (a > 0) {
        if (l === "{") {
          a++, s += l;
          continue;
        }
        if (l === "}") {
          if (a--, a === 0) {
            const c = this.parseAndExecuteCommands(s, t + 1);
            e.push(c.data), s = "";
          } else
            s += l;
          continue;
        }
        s += l;
        continue;
      }
      if (r) {
        if (l === '"') {
          e.push(s), s = "", r = !1;
          continue;
        }
        s += l;
        continue;
      }
      if (n) {
        if (l === "'") {
          e.push(s), s = "", n = !1;
          continue;
        }
        s += l;
        continue;
      }
      if (l === '"') {
        r = !0;
        continue;
      }
      if (l === "'") {
        n = !0;
        continue;
      }
      if (l === "{") {
        a++;
        continue;
      }
      if (l === " ") {
        s.trim() !== "" && (e.push(s), s = "");
        continue;
      }
      s += l;
    }
    s.trim() !== "" && e.push(s), console.log("---".repeat(t) + "Parsing result: ", e);
    const o = e[0].split(":");
    if (o.length === 2) {
      const h = o[0], l = this.gameWorld.getAllPlugins().find((c) => c.cliGetName() === h);
      return l ? this.executeParsedCommand(l, o[1], ...e.slice(1)) : new m(!1, `Plugin ${h} not found`, void 0);
    } else if (o.length === 1)
      try {
        if (!this.globalCommands.has(o[0]))
          return new m(!1, `Command ${o[0]} not found`, void 0);
        const h = this.globalCommands.get(o[0]);
        if (!h)
          return new m(!1, 'More than one command found, use "/<plugin>:<command>" (fe /cli:help) instead.', void 0);
        const l = this.gameWorld.getPluginByName(h);
        return this.executeParsedCommand(l, o[0], ...e.slice(1));
      } catch {
        return new m(!1, "Command not found or wrong syntax", void 0);
      }
    else
      return new m(!1, "No command found", void 0);
  }
  executeParsedCommand(i, t, ...e) {
    if (i.constructor.commands[t] === void 0)
      return new m(!1, `Command ${t} not found`, void 0);
    try {
      return i.constructor.commands[t].apply(i, e);
    } catch {
    }
    return new m(!1, `Failed to execute command ${t} on ${i.cliGetName()}`, void 0);
  }
};
x([
  g("echo", "<message: string>", "string")
], f.prototype, "echo", 1);
x([
  g("loop", "<iterations: int> <command: string>", "string")
], f.prototype, "loop", 1);
x([
  g("true", void 0, "bool")
], f.prototype, "true", 1);
x([
  g("false", void 0, "bool")
], f.prototype, "false", 1);
x([
  g("int", "<value: string>", "number")
], f.prototype, "int", 1);
x([
  g("float", "<value: string>", "number")
], f.prototype, "float", 1);
x([
  g("refresh")
], f.prototype, "refresh", 1);
x([
  g("randomcolor", void 0, "rgb")
], f.prototype, "getrandomcolor", 1);
x([
  g("help")
], f.prototype, "help", 1);
x([
  g("art")
], f.prototype, "art", 1);
f = x([
  U("cli")
], f);
class $ {
  enabled = !0;
  gameObject;
  // private gameObjectId: string = "";
  //overideable methods
  start() {
  }
  event(t, e) {
  }
  getGameWorld() {
    return this.getGameObject(), this.gameObject.deref().getGameWorld();
  }
  hasComponent(t) {
    return this.gameObject.deref().hasComponent(t);
  }
  getComponent(t) {
    return this.gameObject.deref().getComponent(t);
  }
  getAllComponents() {
    return this.gameObject.deref().getAllComponents();
  }
  getTransform() {
    return this.gameObject.deref().getTransform();
  }
  getGameObject() {
    return this.gameObject.deref();
  }
  getPlugin(t) {
    return this.getGameWorld().getPlugin(t);
  }
  isEnabled() {
    return this.gameObject.deref().enabled && this.enabled;
  }
  enable(t = !0) {
    this.enabled = t;
  }
}
class B {
  static symRand(t) {
    return (2 * Math.random() - 1) * t;
  }
  static getColliderRadius(t, e) {
    if (t >= 10)
      return e;
    const s = Math.PI / t;
    return (2 * (Math.cos(s) * e) + e) / 3;
  }
  static deltaAngle(t, e) {
    return t = t % (2 * Math.PI) + 2 * Math.PI, t = t % (2 * Math.PI), e = e % (2 * Math.PI) + 2 * Math.PI, e = e % (2 * Math.PI) + 2 * Math.PI, (e - t + Math.PI) % (2 * Math.PI) - Math.PI;
  }
  static elasticCollision1D(t, e, s, n) {
    const r = (e * (t - s) + 2 * s * n) / (t + s), a = (n * (s - t) + 2 * t * e) / (t + s);
    return [r, a];
  }
}
class u {
  x = 0;
  y = 0;
  constructor(t, e) {
    this.x = t, this.y = e;
  }
  //standard operators
  add(t) {
    return new u(this.x + t.x, this.y + t.y);
  }
  sub(t) {
    return new u(this.x - t.x, this.y - t.y);
  }
  times(t) {
    return new u(this.x * t, this.y * t);
  }
  timesV(t) {
    return new u(this.x * t.x, this.y * t.y);
  }
  //other operators 
  distance(t) {
    return Math.sqrt(Math.pow(this.x - t.x, 2) + Math.pow(this.y - t.y, 2));
  }
  static distance(t, e) {
    return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
  }
  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  cross() {
    return new u(this.y, -this.x).toUnit();
  }
  scalarProduct(t) {
    return this.x * t.x + this.y * t.y;
  }
  vectorProduct(t) {
    return this.x * t.y - this.y * t.x;
  }
  perpendicular(t) {
    return this.sub(t.cross().times(t.scalarProduct(this) / (t.magnitude() * t.magnitude())));
  }
  toUnit() {
    return this.magnitude() != 0 ? new u(this.x, this.y).times(1 / this.magnitude()) : new u(1, 0);
  }
  setLength(t) {
    return this.toUnit().times(t);
  }
  toString() {
    return "{" + this.x + ":" + this.y + "}";
  }
  toRad() {
    return Math.atan2(this.y, this.x);
  }
  reverse() {
    let t = 1e32, e = 1e32;
    return this.x != 0 && (t = 1 / this.x), this.y != 0 && (e = 1 / this.y), new u(t, e);
  }
  interpolate(t, e) {
    const s = t.sub(this), n = s.sub(s.times(Math.min(1, Math.max(0, e))));
    return this.add(n);
  }
  static fromRad(t) {
    return new u(
      Math.cos(t),
      Math.sin(t)
    );
  }
  static randomPos(t) {
    return new u(B.symRand(t), B.symRand(t));
  }
  static randomPos2(t) {
    let e = B.symRand(Math.PI), s = Math.random() * t;
    return u.fromRad(e).times(s);
  }
  clone() {
    return new u(this.x, this.y);
  }
  //consts
  static zero() {
    return new u(0, 0);
  }
  static one() {
    return new u(1, 1);
  }
  static up() {
    return new u(0, 1);
  }
  static down() {
    return new u(0, -1);
  }
  static left() {
    return new u(-1, 0);
  }
  static right() {
    return new u(1, 0);
  }
}
class k extends O {
  collider;
  constructor(t) {
    super(), this.collider = t;
  }
}
class M extends $ {
  offset = u.zero();
  radius;
  isActive = !1;
  isStatic;
  // public layer: number;
  avoidObjectes;
  collisions = /* @__PURE__ */ new Set();
  onCollisionEnterEvent = new E();
  onCollisionExitEvent = new E();
  constructor(t = 1, e = !0, ...s) {
    super(), this.radius = t, this.isStatic = e, this.avoidObjectes = /* @__PURE__ */ new Set(), s.forEach((n) => this.avoidObjectes.add(n));
  }
  start() {
    this.onCollisionEnterEvent.register(this.getGameWorld()), this.onCollisionExitEvent.register(this.getGameWorld());
  }
  getCenter() {
    return this.getTransform().position.add(this.offset);
  }
  getAABB() {
    const t = this.getCenter();
    return {
      colliderId: this.getGameObject().getId(),
      minX: t.x - this.radius,
      minY: t.y - this.radius,
      maxX: t.x + this.radius,
      maxY: t.y + this.radius
    };
  }
  collides(t) {
    return this.getCenter().sub(t.getCenter()).magnitude() <= this.radius + t.radius && !this.avoidObjectes.has(t.getGameObject()) && !t.avoidObjectes.has(this.getGameObject());
  }
  onCollisionEnter(t) {
    this.onCollisionEnterEvent.emit(new k(t));
  }
  onCollisionExit(t) {
    this.onCollisionExitEvent.emit(new k(t));
  }
}
class q {
  constructor() {
    this.ids = [], this.values = [], this.length = 0;
  }
  clear() {
    this.length = 0;
  }
  push(t, e) {
    let s = this.length++;
    for (; s > 0; ) {
      const n = s - 1 >> 1, r = this.values[n];
      if (e >= r) break;
      this.ids[s] = this.ids[n], this.values[s] = r, s = n;
    }
    this.ids[s] = t, this.values[s] = e;
  }
  pop() {
    if (this.length === 0) return;
    const t = this.ids[0];
    if (this.length--, this.length > 0) {
      const e = this.ids[0] = this.ids[this.length], s = this.values[0] = this.values[this.length], n = this.length >> 1;
      let r = 0;
      for (; r < n; ) {
        let a = (r << 1) + 1;
        const o = a + 1;
        let h = this.ids[a], l = this.values[a];
        const c = this.values[o];
        if (o < this.length && c < l && (a = o, h = this.ids[o], l = c), l >= s) break;
        this.ids[r] = h, this.values[r] = l, r = a;
      }
      this.ids[r] = e, this.values[r] = s;
    }
    return t;
  }
  peek() {
    if (this.length !== 0)
      return this.ids[0];
  }
  peekValue() {
    if (this.length !== 0)
      return this.values[0];
  }
  shrink() {
    this.ids.length = this.values.length = this.length;
  }
}
const R = [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], T = 3;
class P {
  /**
   * Recreate a Flatbush index from raw `ArrayBuffer` or `SharedArrayBuffer` data.
   * @param {ArrayBuffer | SharedArrayBuffer} data
   * @param {number} [byteOffset=0] byte offset to the start of the Flatbush buffer in the referenced ArrayBuffer.
   * @returns {Flatbush} index
   */
  static from(t, e = 0) {
    if (e % 8 !== 0)
      throw new Error("byteOffset must be 8-byte aligned.");
    if (!t || t.byteLength === void 0 || t.buffer)
      throw new Error("Data must be an instance of ArrayBuffer or SharedArrayBuffer.");
    const [s, n] = new Uint8Array(t, e + 0, 2);
    if (s !== 251)
      throw new Error("Data does not appear to be in a Flatbush format.");
    const r = n >> 4;
    if (r !== T)
      throw new Error(`Got v${r} data when expected v${T}.`);
    const a = R[n & 15];
    if (!a)
      throw new Error("Unrecognized array type.");
    const [o] = new Uint16Array(t, e + 2, 1), [h] = new Uint32Array(t, e + 4, 1);
    return new P(h, o, a, void 0, t, e);
  }
  /**
   * Create a Flatbush index that will hold a given number of items.
   * @param {number} numItems
   * @param {number} [nodeSize=16] Size of the tree node (16 by default).
   * @param {TypedArrayConstructor} [ArrayType=Float64Array] The array type used for coordinates storage (`Float64Array` by default).
   * @param {ArrayBufferConstructor | SharedArrayBufferConstructor} [ArrayBufferType=ArrayBuffer] The array buffer type used to store data (`ArrayBuffer` by default).
   * @param {ArrayBuffer | SharedArrayBuffer} [data] (Only used internally)
   * @param {number} [byteOffset=0] (Only used internally)
   */
  constructor(t, e = 16, s = Float64Array, n = ArrayBuffer, r, a = 0) {
    if (t === void 0) throw new Error("Missing required argument: numItems.");
    if (isNaN(t) || t <= 0) throw new Error(`Unexpected numItems value: ${t}.`);
    this.numItems = +t, this.nodeSize = Math.min(Math.max(+e, 2), 65535), this.byteOffset = a;
    let o = t, h = o;
    this._levelBounds = [o * 4];
    do
      o = Math.ceil(o / this.nodeSize), h += o, this._levelBounds.push(h * 4);
    while (o !== 1);
    this.ArrayType = s, this.IndexArrayType = h < 16384 ? Uint16Array : Uint32Array;
    const l = R.indexOf(this.ArrayType), c = h * 4 * this.ArrayType.BYTES_PER_ELEMENT;
    if (l < 0)
      throw new Error(`Unexpected typed array class: ${s}.`);
    r && r.byteLength !== void 0 && !r.buffer ? (this.data = r, this._boxes = new this.ArrayType(this.data, a + 8, h * 4), this._indices = new this.IndexArrayType(this.data, a + 8 + c, h), this._pos = h * 4, this.minX = this._boxes[this._pos - 4], this.minY = this._boxes[this._pos - 3], this.maxX = this._boxes[this._pos - 2], this.maxY = this._boxes[this._pos - 1]) : (this.data = new n(8 + c + h * this.IndexArrayType.BYTES_PER_ELEMENT), this._boxes = new this.ArrayType(this.data, 8, h * 4), this._indices = new this.IndexArrayType(this.data, 8 + c, h), this._pos = 0, this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, new Uint8Array(this.data, 0, 2).set([251, (T << 4) + l]), new Uint16Array(this.data, 2, 1)[0] = e, new Uint32Array(this.data, 4, 1)[0] = t), this._queue = new q();
  }
  /**
   * Add a given rectangle to the index.
   * @param {number} minX
   * @param {number} minY
   * @param {number} maxX
   * @param {number} maxY
   * @returns {number} A zero-based, incremental number that represents the newly added rectangle.
   */
  add(t, e, s = t, n = e) {
    const r = this._pos >> 2, a = this._boxes;
    return this._indices[r] = r, a[this._pos++] = t, a[this._pos++] = e, a[this._pos++] = s, a[this._pos++] = n, t < this.minX && (this.minX = t), e < this.minY && (this.minY = e), s > this.maxX && (this.maxX = s), n > this.maxY && (this.maxY = n), r;
  }
  /** Perform indexing of the added rectangles. */
  finish() {
    if (this._pos >> 2 !== this.numItems)
      throw new Error(`Added ${this._pos >> 2} items when expected ${this.numItems}.`);
    const t = this._boxes;
    if (this.numItems <= this.nodeSize) {
      t[this._pos++] = this.minX, t[this._pos++] = this.minY, t[this._pos++] = this.maxX, t[this._pos++] = this.maxY;
      return;
    }
    const e = this.maxX - this.minX || 1, s = this.maxY - this.minY || 1, n = new Uint32Array(this.numItems), r = 65535;
    for (let a = 0, o = 0; a < this.numItems; a++) {
      const h = t[o++], l = t[o++], c = t[o++], d = t[o++], y = Math.floor(r * ((h + c) / 2 - this.minX) / e), v = Math.floor(r * ((l + d) / 2 - this.minY) / s);
      n[a] = V(y, v);
    }
    I(n, t, this._indices, 0, this.numItems - 1, this.nodeSize);
    for (let a = 0, o = 0; a < this._levelBounds.length - 1; a++) {
      const h = this._levelBounds[a];
      for (; o < h; ) {
        const l = o;
        let c = t[o++], d = t[o++], y = t[o++], v = t[o++];
        for (let C = 1; C < this.nodeSize && o < h; C++)
          c = Math.min(c, t[o++]), d = Math.min(d, t[o++]), y = Math.max(y, t[o++]), v = Math.max(v, t[o++]);
        this._indices[this._pos >> 2] = l, t[this._pos++] = c, t[this._pos++] = d, t[this._pos++] = y, t[this._pos++] = v;
      }
    }
  }
  /**
   * Search the index by a bounding box.
   * @param {number} minX
   * @param {number} minY
   * @param {number} maxX
   * @param {number} maxY
   * @param {(index: number) => boolean} [filterFn] An optional function for filtering the results.
   * @returns {number[]} An array of indices of items intersecting or touching the given bounding box.
   */
  search(t, e, s, n, r) {
    if (this._pos !== this._boxes.length)
      throw new Error("Data not yet indexed - call index.finish().");
    let a = this._boxes.length - 4;
    const o = [], h = [];
    for (; a !== void 0; ) {
      const l = Math.min(a + this.nodeSize * 4, j(a, this._levelBounds));
      for (let c = a; c < l; c += 4) {
        if (s < this._boxes[c] || n < this._boxes[c + 1] || t > this._boxes[c + 2] || e > this._boxes[c + 3]) continue;
        const d = this._indices[c >> 2] | 0;
        a >= this.numItems * 4 ? o.push(d) : (r === void 0 || r(d)) && h.push(d);
      }
      a = o.pop();
    }
    return h;
  }
  /**
   * Search items in order of distance from the given point.
   * @param {number} x
   * @param {number} y
   * @param {number} [maxResults=Infinity]
   * @param {number} [maxDistance=Infinity]
   * @param {(index: number) => boolean} [filterFn] An optional function for filtering the results.
   * @returns {number[]} An array of indices of items found.
   */
  neighbors(t, e, s = 1 / 0, n = 1 / 0, r) {
    if (this._pos !== this._boxes.length)
      throw new Error("Data not yet indexed - call index.finish().");
    let a = this._boxes.length - 4;
    const o = this._queue, h = [], l = n * n;
    t: for (; a !== void 0; ) {
      const c = Math.min(a + this.nodeSize * 4, j(a, this._levelBounds));
      for (let d = a; d < c; d += 4) {
        const y = this._indices[d >> 2] | 0, v = W(t, this._boxes[d], this._boxes[d + 2]), C = W(e, this._boxes[d + 1], this._boxes[d + 3]), A = v * v + C * C;
        A > l || (a >= this.numItems * 4 ? o.push(y << 1, A) : (r === void 0 || r(y)) && o.push((y << 1) + 1, A));
      }
      for (; o.length && o.peek() & 1; )
        if (o.peekValue() > l || (h.push(o.pop() >> 1), h.length === s)) break t;
      a = o.length ? o.pop() >> 1 : void 0;
    }
    return o.clear(), h;
  }
}
function W(i, t, e) {
  return i < t ? t - i : i <= e ? 0 : i - e;
}
function j(i, t) {
  let e = 0, s = t.length - 1;
  for (; e < s; ) {
    const n = e + s >> 1;
    t[n] > i ? s = n : e = n + 1;
  }
  return t[e];
}
function I(i, t, e, s, n, r) {
  if (Math.floor(s / r) >= Math.floor(n / r)) return;
  const a = i[s + n >> 1];
  let o = s - 1, h = n + 1;
  for (; ; ) {
    do
      o++;
    while (i[o] < a);
    do
      h--;
    while (i[h] > a);
    if (o >= h) break;
    Q(i, t, e, o, h);
  }
  I(i, t, e, s, h, r), I(i, t, e, h + 1, n, r);
}
function Q(i, t, e, s, n) {
  const r = i[s];
  i[s] = i[n], i[n] = r;
  const a = 4 * s, o = 4 * n, h = t[a], l = t[a + 1], c = t[a + 2], d = t[a + 3];
  t[a] = t[o], t[a + 1] = t[o + 1], t[a + 2] = t[o + 2], t[a + 3] = t[o + 3], t[o] = h, t[o + 1] = l, t[o + 2] = c, t[o + 3] = d;
  const y = e[s];
  e[s] = e[n], e[n] = y;
}
function V(i, t) {
  let e = i ^ t, s = 65535 ^ e, n = 65535 ^ (i | t), r = i & (t ^ 65535), a = e | s >> 1, o = e >> 1 ^ e, h = n >> 1 ^ s & r >> 1 ^ n, l = e & n >> 1 ^ r >> 1 ^ r;
  e = a, s = o, n = h, r = l, a = e & e >> 2 ^ s & s >> 2, o = e & s >> 2 ^ s & (e ^ s) >> 2, h ^= e & n >> 2 ^ s & r >> 2, l ^= s & n >> 2 ^ (e ^ s) & r >> 2, e = a, s = o, n = h, r = l, a = e & e >> 4 ^ s & s >> 4, o = e & s >> 4 ^ s & (e ^ s) >> 4, h ^= e & n >> 4 ^ s & r >> 4, l ^= s & n >> 4 ^ (e ^ s) & r >> 4, e = a, s = o, n = h, r = l, h ^= e & n >> 8 ^ s & r >> 8, l ^= s & n >> 8 ^ (e ^ s) & r >> 8, e = h ^ h >> 1, s = l ^ l >> 1;
  let c = i ^ t, d = s | 65535 ^ (c | e);
  return c = (c | c << 8) & 16711935, c = (c | c << 4) & 252645135, c = (c | c << 2) & 858993459, c = (c | c << 1) & 1431655765, d = (d | d << 8) & 16711935, d = (d | d << 4) & 252645135, d = (d | d << 2) & 858993459, d = (d | d << 1) & 1431655765, (d << 1 | c) >>> 0;
}
class J extends w {
  order = b.Collision;
  name = "CollisionDetectionPlugin";
  data = [];
  tree;
  update() {
    this.checkCollisions();
  }
  overlapPoint(t) {
    return this.tree.search(t.x, t.y, t.x, t.y).map((n) => this.gameWorld.getGameObject(this.data[n].colliderId)?.getComponent(M)).filter((n) => n.getCenter().sub(t).magnitude() < n.radius);
  }
  checkCollisions() {
    let t = this.gameWorld.getComponents(M);
    const e = t.length;
    if (e === 0) {
      this.tree = new P(1);
      return;
    }
    this.tree = new P(e), this.data = t.map((s) => s.getAABB());
    for (const s of t)
      s.isActive = !1;
    for (const s of this.data)
      this.tree.add(s.minX, s.minY, s.maxX, s.maxY);
    this.tree.finish();
    for (const s of t) {
      if (s.isStatic)
        continue;
      let n = /* @__PURE__ */ new Set();
      const r = s.getAABB(), a = this.tree.search(r.minX, r.minY, r.maxX, r.maxY);
      for (const o of a) {
        const h = this.gameWorld.getGameObject(this.data[o].colliderId)?.getComponent(M);
        if (!(!h || s === h)) {
          s.collides(h) && (s.isActive = !0, h.isActive = !0, n.add(h));
          for (let l of n)
            s.collisions.has(l) || s.getComponent(M).onCollisionEnter(l);
          s.collisions.clear(), s.collisions = n;
        }
      }
    }
  }
}
class Z extends w {
  order = b.Input;
  name = "ConfigPlugin";
  config = /* @__PURE__ */ new Map(
    [
      ["bulletSize", 0.75],
      // ["displayColliders", true as any],
      ["playerSize", 2.5],
      ["bulletColor", new p(56, 57, 60)],
      // ["playerColor", new Color(145, 125, 39) as any],
      ["playerColor", new p(122, 111, 62)],
      ["playerColor", new p(80, 37, 36)],
      ["playerColor", new p(59, 94, 76)],
      ["playerColor", new p(129, 49, 54)],
      ["playerColor", new p(130, 111, 51)]
    ]
  );
  get(t) {
    if (this.config.has(t))
      return this.config.get(t);
  }
  set(t, e) {
    this.config.set(t, e);
  }
}
class tt extends $ {
  velocity;
  acceleration = u.zero();
  mass = 1;
  dampingFactor;
  angularVelocity = 0;
  angularAcceleration = 0;
  angularDrag = 0.25;
  constructor(t, e = 0.45) {
    super();
    const s = 15;
    this.velocity = new u(Math.random() * s * 2 - s, Math.random() * s * 2 - s), this.dampingFactor = e, this.mass = t;
  }
  update(t) {
    this.velocity = this.velocity.add(this.acceleration.times(t)), this.velocity = this.velocity.times(Math.pow(this.dampingFactor, t)), this.getTransform().position = this.getTransform().position.add(this.velocity.times(t)), this.getTransform().position = this.getTransform().position.add(this.acceleration.times(t * t / 2)), this.angularVelocity = this.angularVelocity + this.angularAcceleration * t, this.angularVelocity = this.angularVelocity * Math.pow(this.angularDrag, t), this.getTransform().rotation += this.angularVelocity * t;
  }
}
class et extends w {
  order = b.Physics;
  name = "PhysicsPlugin";
  update(t) {
    this.gameWorld.getWorldTime(), this.gameWorld.getComponents(tt).forEach((e) => e.update(t));
  }
}
class st extends w {
  order = b.Input;
  name = "SchedulerPlugin";
  schedule = [];
  addInvoke(t, e, s) {
    let n = new WeakRef(t);
    this.schedule.push({ totalTime: e, subscriber: n, topic: s }), this.schedule.sort((r, a) => a.totalTime - r.totalTime);
  }
  update(t) {
    const e = this.gameWorld.getWorldTime();
    if (this.schedule.length != 0)
      for (; this.schedule.length != 0 && this.schedule[this.schedule.length - 1].totalTime <= e; ) {
        let s = this.schedule.pop();
        s.subscriber.deref()?.onInvoke(s.topic);
      }
  }
}
class it extends w {
  order = b.Input;
  io;
  server;
  names = /* @__PURE__ */ new Map();
  mocks = /* @__PURE__ */ new Map();
  constructor() {
    super(), this.server = N.createServer((t, e) => {
      e.writeHead(200, { "Content-Type": "text/plain" }), e.end(`Socket.IO server is running
`);
    }), this.io = new D(
      this.server,
      {
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
        }
      }
    );
  }
  onChatMessage(t, e, s) {
    console.log("Otrzymano wiadomość od ", e, ": ", s), t.broadcast.emit("chat_message", this.getName(t), s), t.emit("response", `Odebrano wiadomość o tresci: ${s}`);
  }
  start() {
    console.log("Uruchamianie serwera Socket.IO..."), this.server.listen(8001, () => console.log("Serwer działa na porcie 8001")), this.io.on("connection", (t) => this.onConnection(t));
  }
  onConnection(t) {
    t.on("chat_message", (e, s) => this.onChatMessage(t, e, s)), t.on("disconnect", () => console.log("Połączenie zostało zakończone")), t.on("set_name", (e) => this.setName(t, e)), t.on("synchronize_go", (e, s) => this.synchronize(t, e, s));
  }
  setName(t, e) {
    this.names.set(t.id, e);
  }
  getName(t) {
    return this.names.get(t.id) ?? t.id;
  }
  synchronize(t, e, s) {
    console.log(`Synchronizing ${e} with data:`, s), t.broadcast.emit("synchronize_go", e, s);
  }
}
class nt extends $ {
  tickCount = 0;
  tick(t) {
    this.tickCount == 0 ? this.start() : this.update(t), this.tickCount++;
  }
  start() {
  }
  update(t) {
  }
}
class ot extends w {
  order = b.Update;
  name = "StandaloneComponentPlugin";
  update(t) {
    this.gameWorld.getAllComponents().filter((e) => e instanceof nt).map((e) => e).forEach((e) => e.tick(t));
  }
}
let G = 0;
async function rt(i, t) {
  for (; performance.now() - t < i; )
    ;
}
async function at() {
  const i = new X(
    new Z(),
    new f(),
    new st(),
    new et(),
    new J(),
    new ot(),
    new it()
  );
  for (let t = 0; ; t++)
    G = performance.now(), t % 500 == 0 && console.log("Tick: " + t + " at " + performance.now().toFixed(2) + "ms"), await new Promise((e) => setTimeout(e, 0)), i.tick(), await rt(20, G);
}
at();
export {
  at as main
};
//# sourceMappingURL=bundle.server.es.js.map
