class q {
  enabled = !0;
  gameObject;
  //overideable methods
  start() {
  }
  event(t, e) {
  }
  getGameObject() {
    return this.gameObject;
  }
  getGameWorld() {
    return this.gameObject?.getGameWorld();
  }
  getPlugin(t) {
    return this.gameObject?.getGameWorld()?.getPlugin(t);
  }
  hasComponent(t) {
    return this.gameObject?.hasComponent(t) ?? !1;
  }
  getComponent(t) {
    return this.gameObject?.getComponent(t);
  }
  getAllComponents() {
    return this.gameObject?.getAllComponents() ?? [];
  }
  isEnabled() {
    return (this.gameObject?.enabled ?? !0) && this.enabled;
  }
  enable(t = !0) {
    this.enabled = t;
  }
  getTransform() {
    return this.gameObject?.getTransform();
  }
}
class T {
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
    const r = (e * (t - s) + 2 * s * n) / (t + s), o = (n * (s - t) + 2 * t * e) / (t + s);
    return [r, o];
  }
  static minmax(t, e, s) {
    return t < e ? e : t > s ? s : t;
  }
}
class f {
  x = 0;
  y = 0;
  constructor(t, e) {
    this.x = t, this.y = e;
  }
  //standard operators
  add(t) {
    return new f(this.x + t.x, this.y + t.y);
  }
  sub(t) {
    return new f(this.x - t.x, this.y - t.y);
  }
  times(t) {
    return new f(this.x * t, this.y * t);
  }
  timesV(t) {
    return new f(this.x * t.x, this.y * t.y);
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
    return new f(this.y, -this.x).toUnit();
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
    return this.magnitude() != 0 ? new f(this.x, this.y).times(1 / this.magnitude()) : new f(1, 0);
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
    return this.x != 0 && (t = 1 / this.x), this.y != 0 && (e = 1 / this.y), new f(t, e);
  }
  interpolate(t, e) {
    const s = t.sub(this), n = s.sub(s.times(Math.min(1, Math.max(0, e))));
    return this.add(n);
  }
  static fromRad(t) {
    return new f(
      Math.cos(t),
      Math.sin(t)
    );
  }
  static randomPos(t) {
    return new f(T.symRand(t), T.symRand(t));
  }
  static randomPos2(t) {
    let e = T.symRand(Math.PI), s = Math.random() * t;
    return f.fromRad(e).times(s);
  }
  clone() {
    return new f(this.x, this.y);
  }
  //consts
  static zero() {
    return new f(0, 0);
  }
  static one() {
    return new f(1, 1);
  }
  static up() {
    return new f(0, 1);
  }
  static down() {
    return new f(0, -1);
  }
  static left() {
    return new f(-1, 0);
  }
  static right() {
    return new f(1, 0);
  }
}
class C extends q {
  velocity;
  acceleration = f.zero();
  mass = 1;
  dampingFactor;
  angularVelocity = 0;
  angularAcceleration = 0;
  angularDrag = 0.25;
  constructor(t, e = 0.45) {
    super();
    const s = 15;
    this.velocity = new f(Math.random() * s * 2 - s, Math.random() * s * 2 - s), this.dampingFactor = e, this.mass = t;
  }
  update(t) {
    this.velocity = this.velocity.add(this.acceleration.times(t)), this.velocity = this.velocity.times(Math.pow(this.dampingFactor, t)), this.getTransform().position = this.getTransform().position.add(this.velocity.times(t)), this.getTransform().position = this.getTransform().position.add(this.acceleration.times(t * t / 2)), this.angularVelocity = this.angularVelocity + this.angularAcceleration * t, this.angularVelocity = this.angularVelocity * Math.pow(this.angularDrag, t), this.getTransform().rotation += this.angularVelocity * t;
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
    const n = (c) => (c + t / 30) % 12, r = e * Math.min(s, 1 - s), o = (c) => s - r * Math.max(-1, Math.min(n(c) - 3, Math.min(9 - n(c), 1))), a = Math.round(o(0) * 255), h = Math.round(o(8) * 255), l = Math.round(o(4) * 255);
    return new p(a, h, l);
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
class ct {
  position;
  rotation;
  scale;
  constructor(t = new f(0, 0), e = 0, s = f.one()) {
    this.position = t, this.rotation = e, this.scale = s;
  }
  static fromPosition(t) {
    let e = new ct();
    return e.position = t, e;
  }
  clone() {
    let t = new ct();
    return t.position = this.position.clone(), t.scale = this.scale.clone(), t.rotation = this.rotation, t;
  }
}
const P = [];
for (let i = 0; i < 256; ++i)
  P.push((i + 256).toString(16).slice(1));
function _e(i, t = 0) {
  return (P[i[t + 0]] + P[i[t + 1]] + P[i[t + 2]] + P[i[t + 3]] + "-" + P[i[t + 4]] + P[i[t + 5]] + "-" + P[i[t + 6]] + P[i[t + 7]] + "-" + P[i[t + 8]] + P[i[t + 9]] + "-" + P[i[t + 10]] + P[i[t + 11]] + P[i[t + 12]] + P[i[t + 13]] + P[i[t + 14]] + P[i[t + 15]]).toLowerCase();
}
let _t;
const Ce = new Uint8Array(16);
function Pe() {
  if (!_t) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    _t = crypto.getRandomValues.bind(crypto);
  }
  return _t(Ce);
}
const Ee = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), zt = { randomUUID: Ee };
function xe(i, t, e) {
  if (zt.randomUUID && !i)
    return zt.randomUUID();
  i = i || {};
  const s = i.random ?? i.rng?.() ?? Pe();
  if (s.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return s[6] = s[6] & 15 | 64, s[8] = s[8] & 63 | 128, _e(s);
}
class J {
  enabled = !0;
  name = "UnnamedGameObject";
  id = xe();
  transform = new ct();
  components = {};
  gameWorld;
  constructor(...t) {
    for (let e of t) {
      let s = e.constructor.name;
      if (Object.prototype.hasOwnProperty.call(this.components, s))
        throw new Error(`Component ${s} already exists in the game object`);
      e.gameObject = new WeakRef(this), this.components[s] = e;
    }
  }
  hasComponent(t) {
    return Object.prototype.hasOwnProperty.call(this.components, t.name);
  }
  getComponent(t) {
    const e = t.name;
    return this.components[e];
  }
  getAllComponents(t = !1) {
    return Object.values(this.components).filter((e) => t ? e.isEnabled() : !0);
  }
  getId() {
    return this.id;
  }
  getTransform() {
    return this.transform;
  }
  getGameWorld() {
    return this.gameWorld?.hasGameObject(this.id) || (this.gameWorld = void 0), this.gameWorld;
  }
}
class g {
  status;
  message;
  data;
  constructor(t, e, s) {
    this.status = t, this.message = e, this.data = s;
  }
}
function b(i, t, e) {
  return function(s, n, r) {
    const o = r.value;
    if (o) {
      i = i ?? n, e = e ?? "void", t = t ?? "", t && (t = " " + t), e && (e = ": " + e), t = i + t + e;
      const a = s.constructor;
      Object.prototype.hasOwnProperty.call(a, "commands") || (a.commands = Object.assign({}, a.commands || {})), a.commands[i] = o, Object.prototype.hasOwnProperty.call(a, "syntaxes") || (a.syntaxes = Object.assign({}, a.syntaxes || {})), a.syntaxes[i] = t;
    }
  };
}
function Wt(i) {
  return function(t) {
    t.prototype.cliGetName = function() {
      return i;
    };
  };
}
var Te = Object.defineProperty, ke = Object.getOwnPropertyDescriptor, Dt = (i, t, e, s) => {
  for (var n = ke(t, e), r = i.length - 1, o; r >= 0; r--)
    (o = i[r]) && (n = o(t, e, n) || n);
  return n && Te(t, e, n), n;
};
class E {
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
    return new g(!0, s, void 0);
  }
  cliEnable() {
    const t = "\x1B[32m", e = "\x1B[0m";
    return this.enabled = !0, new g(!0, `${this.name} ${t}enabled${e}`, void 0);
  }
  cliDisable() {
    const t = "\x1B[31m", e = "\x1B[0m";
    return this.enabled = !1, new g(!0, `${this.name} ${t}disabled${e}`, void 0);
  }
}
Dt([
  b("help")
], E.prototype, "help");
Dt([
  b("enable")
], E.prototype, "cliEnable");
Dt([
  b("disable")
], E.prototype, "cliDisable");
class Y {
  constructor() {
  }
}
class L {
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
var x = /* @__PURE__ */ ((i) => (i[i.None = -1] = "None", i[i.Input = 0] = "Input", i[i.Update = 1] = "Update", i[i.Physics = 2] = "Physics", i[i.Collision = 3] = "Collision", i[i.Render = 4] = "Render", i))(x || {});
class Se extends Y {
  delta;
  constructor(t) {
    super(), this.delta = t;
  }
}
class Vt extends Y {
  button;
  constructor(t) {
    super(), this.button = t;
  }
}
class j extends E {
  order = x.Input;
  name = "MousePlugin";
  mouseScrollYEvent = new L();
  mouseDownEvent = new L();
  mouseUpEvent = new L();
  pressedKeys = /* @__PURE__ */ new Set();
  canvas;
  position = f.zero();
  constructor(t) {
    super(), this.canvas = t, this.trackMouse(t);
  }
  start() {
    this.mouseScrollYEvent.register(this.gameWorld), this.mouseDownEvent.register(this.gameWorld), this.mouseUpEvent.register(this.gameWorld);
  }
  isKeyDown(t = 0) {
    return this.pressedKeys.has(t);
  }
  getMouseScreenPosition() {
    const t = window.devicePixelRatio || 1;
    return new f(this.position.x * t, this.position.y * t);
  }
  trackMouse(t) {
    t.addEventListener("mousemove", (e) => {
      const s = t.getBoundingClientRect();
      let n = e.clientX - s.left, r = e.clientY - s.top;
      this.position = new f(n, r);
    }), t.addEventListener("mousedown", (e) => {
      this.pressedKeys.add(e.button), this.mouseDownEvent.emit(new Vt(e.button));
    }), t.addEventListener("mouseup", (e) => {
      this.pressedKeys.delete(e.button), this.mouseUpEvent.emit(new Vt(e.button));
    }), t.addEventListener("wheel", (e) => {
      this.mouseScrollYEvent.emit(new Se(e.deltaY));
    });
  }
}
class Ht extends Y {
  collider;
  constructor(t) {
    super(), this.collider = t;
  }
}
class A extends q {
  offset = f.zero();
  radius;
  isActive = !1;
  isStatic;
  // public layer: number;
  avoidObjectes;
  collisions = /* @__PURE__ */ new Set();
  onCollisionEnterEvent = new L();
  onCollisionExitEvent = new L();
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
    this.onCollisionEnterEvent.emit(new Ht(t));
  }
  onCollisionExit(t) {
    this.onCollisionExitEvent.emit(new Ht(t));
  }
}
class Ae {
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
        let o = (r << 1) + 1;
        const a = o + 1;
        let h = this.ids[o], l = this.values[o];
        const c = this.values[a];
        if (a < this.length && c < l && (o = a, h = this.ids[a], l = c), l >= s) break;
        this.ids[r] = h, this.values[r] = l, r = o;
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
const Kt = [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], Ct = 3;
class ut {
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
    if (r !== Ct)
      throw new Error(`Got v${r} data when expected v${Ct}.`);
    const o = Kt[n & 15];
    if (!o)
      throw new Error("Unrecognized array type.");
    const [a] = new Uint16Array(t, e + 2, 1), [h] = new Uint32Array(t, e + 4, 1);
    return new ut(h, a, o, void 0, t, e);
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
  constructor(t, e = 16, s = Float64Array, n = ArrayBuffer, r, o = 0) {
    if (t === void 0) throw new Error("Missing required argument: numItems.");
    if (isNaN(t) || t <= 0) throw new Error(`Unexpected numItems value: ${t}.`);
    this.numItems = +t, this.nodeSize = Math.min(Math.max(+e, 2), 65535), this.byteOffset = o;
    let a = t, h = a;
    this._levelBounds = [a * 4];
    do
      a = Math.ceil(a / this.nodeSize), h += a, this._levelBounds.push(h * 4);
    while (a !== 1);
    this.ArrayType = s, this.IndexArrayType = h < 16384 ? Uint16Array : Uint32Array;
    const l = Kt.indexOf(this.ArrayType), c = h * 4 * this.ArrayType.BYTES_PER_ELEMENT;
    if (l < 0)
      throw new Error(`Unexpected typed array class: ${s}.`);
    r && r.byteLength !== void 0 && !r.buffer ? (this.data = r, this._boxes = new this.ArrayType(this.data, o + 8, h * 4), this._indices = new this.IndexArrayType(this.data, o + 8 + c, h), this._pos = h * 4, this.minX = this._boxes[this._pos - 4], this.minY = this._boxes[this._pos - 3], this.maxX = this._boxes[this._pos - 2], this.maxY = this._boxes[this._pos - 1]) : (this.data = new n(8 + c + h * this.IndexArrayType.BYTES_PER_ELEMENT), this._boxes = new this.ArrayType(this.data, 8, h * 4), this._indices = new this.IndexArrayType(this.data, 8 + c, h), this._pos = 0, this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, new Uint8Array(this.data, 0, 2).set([251, (Ct << 4) + l]), new Uint16Array(this.data, 2, 1)[0] = e, new Uint32Array(this.data, 4, 1)[0] = t), this._queue = new Ae();
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
    const r = this._pos >> 2, o = this._boxes;
    return this._indices[r] = r, o[this._pos++] = t, o[this._pos++] = e, o[this._pos++] = s, o[this._pos++] = n, t < this.minX && (this.minX = t), e < this.minY && (this.minY = e), s > this.maxX && (this.maxX = s), n > this.maxY && (this.maxY = n), r;
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
    for (let o = 0, a = 0; o < this.numItems; o++) {
      const h = t[a++], l = t[a++], c = t[a++], u = t[a++], d = Math.floor(r * ((h + c) / 2 - this.minX) / e), w = Math.floor(r * ((l + u) / 2 - this.minY) / s);
      n[o] = Re(d, w);
    }
    Tt(n, t, this._indices, 0, this.numItems - 1, this.nodeSize);
    for (let o = 0, a = 0; o < this._levelBounds.length - 1; o++) {
      const h = this._levelBounds[o];
      for (; a < h; ) {
        const l = a;
        let c = t[a++], u = t[a++], d = t[a++], w = t[a++];
        for (let R = 1; R < this.nodeSize && a < h; R++)
          c = Math.min(c, t[a++]), u = Math.min(u, t[a++]), d = Math.max(d, t[a++]), w = Math.max(w, t[a++]);
        this._indices[this._pos >> 2] = l, t[this._pos++] = c, t[this._pos++] = u, t[this._pos++] = d, t[this._pos++] = w;
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
    let o = this._boxes.length - 4;
    const a = [], h = [];
    for (; o !== void 0; ) {
      const l = Math.min(o + this.nodeSize * 4, Xt(o, this._levelBounds));
      for (let c = o; c < l; c += 4) {
        if (s < this._boxes[c] || n < this._boxes[c + 1] || t > this._boxes[c + 2] || e > this._boxes[c + 3]) continue;
        const u = this._indices[c >> 2] | 0;
        o >= this.numItems * 4 ? a.push(u) : (r === void 0 || r(u)) && h.push(u);
      }
      o = a.pop();
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
    let o = this._boxes.length - 4;
    const a = this._queue, h = [], l = n * n;
    t: for (; o !== void 0; ) {
      const c = Math.min(o + this.nodeSize * 4, Xt(o, this._levelBounds));
      for (let u = o; u < c; u += 4) {
        const d = this._indices[u >> 2] | 0, w = Yt(t, this._boxes[u], this._boxes[u + 2]), R = Yt(e, this._boxes[u + 1], this._boxes[u + 3]), S = w * w + R * R;
        S > l || (o >= this.numItems * 4 ? a.push(d << 1, S) : (r === void 0 || r(d)) && a.push((d << 1) + 1, S));
      }
      for (; a.length && a.peek() & 1; )
        if (a.peekValue() > l || (h.push(a.pop() >> 1), h.length === s)) break t;
      o = a.length ? a.pop() >> 1 : void 0;
    }
    return a.clear(), h;
  }
}
function Yt(i, t, e) {
  return i < t ? t - i : i <= e ? 0 : i - e;
}
function Xt(i, t) {
  let e = 0, s = t.length - 1;
  for (; e < s; ) {
    const n = e + s >> 1;
    t[n] > i ? s = n : e = n + 1;
  }
  return t[e];
}
function Tt(i, t, e, s, n, r) {
  if (Math.floor(s / r) >= Math.floor(n / r)) return;
  const o = i[s + n >> 1];
  let a = s - 1, h = n + 1;
  for (; ; ) {
    do
      a++;
    while (i[a] < o);
    do
      h--;
    while (i[h] > o);
    if (a >= h) break;
    Be(i, t, e, a, h);
  }
  Tt(i, t, e, s, h, r), Tt(i, t, e, h + 1, n, r);
}
function Be(i, t, e, s, n) {
  const r = i[s];
  i[s] = i[n], i[n] = r;
  const o = 4 * s, a = 4 * n, h = t[o], l = t[o + 1], c = t[o + 2], u = t[o + 3];
  t[o] = t[a], t[o + 1] = t[a + 1], t[o + 2] = t[a + 2], t[o + 3] = t[a + 3], t[a] = h, t[a + 1] = l, t[a + 2] = c, t[a + 3] = u;
  const d = e[s];
  e[s] = e[n], e[n] = d;
}
function Re(i, t) {
  let e = i ^ t, s = 65535 ^ e, n = 65535 ^ (i | t), r = i & (t ^ 65535), o = e | s >> 1, a = e >> 1 ^ e, h = n >> 1 ^ s & r >> 1 ^ n, l = e & n >> 1 ^ r >> 1 ^ r;
  e = o, s = a, n = h, r = l, o = e & e >> 2 ^ s & s >> 2, a = e & s >> 2 ^ s & (e ^ s) >> 2, h ^= e & n >> 2 ^ s & r >> 2, l ^= s & n >> 2 ^ (e ^ s) & r >> 2, e = o, s = a, n = h, r = l, o = e & e >> 4 ^ s & s >> 4, a = e & s >> 4 ^ s & (e ^ s) >> 4, h ^= e & n >> 4 ^ s & r >> 4, l ^= s & n >> 4 ^ (e ^ s) & r >> 4, e = o, s = a, n = h, r = l, h ^= e & n >> 8 ^ s & r >> 8, l ^= s & n >> 8 ^ (e ^ s) & r >> 8, e = h ^ h >> 1, s = l ^ l >> 1;
  let c = i ^ t, u = s | 65535 ^ (c | e);
  return c = (c | c << 8) & 16711935, c = (c | c << 4) & 252645135, c = (c | c << 2) & 858993459, c = (c | c << 1) & 1431655765, u = (u | u << 8) & 16711935, u = (u | u << 4) & 252645135, u = (u | u << 2) & 858993459, u = (u | u << 1) & 1431655765, (u << 1 | c) >>> 0;
}
class ie extends E {
  order = x.Collision;
  name = "CollisionDetectionPlugin";
  data = [];
  tree;
  update() {
    this.checkCollisions();
  }
  overlapPoint(t) {
    return this.tree.search(t.x, t.y, t.x, t.y).map((n) => this.gameWorld.getGameObject(this.data[n].colliderId)?.getComponent(A)).filter((n) => n.getCenter().sub(t).magnitude() < n.radius);
  }
  checkCollisions() {
    let t = this.gameWorld.getComponents(A);
    const e = t.length;
    if (e === 0) {
      this.tree = new ut(1);
      return;
    }
    this.tree = new ut(e), this.data = t.map((s) => s.getAABB());
    for (const s of t)
      s.isActive = !1;
    for (const s of this.data)
      this.tree.add(s.minX, s.minY, s.maxX, s.maxY);
    this.tree.finish();
    for (const s of t) {
      if (s.isStatic)
        continue;
      let n = /* @__PURE__ */ new Set();
      const r = s.getAABB(), o = this.tree.search(r.minX, r.minY, r.maxX, r.maxY);
      for (const a of o) {
        const h = this.gameWorld.getGameObject(this.data[a].colliderId)?.getComponent(A);
        if (!(!h || s === h)) {
          s.collides(h) && (s.isActive = !0, h.isActive = !0, n.add(h));
          for (let l of n)
            s.collisions.has(l) || s.onCollisionEnter(l);
          s.collisions.clear(), s.collisions = n;
        }
      }
    }
  }
}
class Zt extends Y {
  key;
  constructor(t) {
    super(), this.key = t;
  }
}
class G extends E {
  order = x.Input;
  name = "KeyboardPlugin";
  KeyDownEvent = new L();
  BlockedKeyDownEvent = new L();
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
      this.block ? this.BlockedKeyDownEvent.emit(new Zt(e)) : this.KeyDownEvent.emit(new Zt(e));
    }), this.NowPressedKeys.clear();
  }
}
var Oe = Object.defineProperty, Me = Object.getOwnPropertyDescriptor, pt = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Me(t, e) : t, r = i.length - 1, o; r >= 0; r--)
    (o = i[r]) && (n = (s ? o(t, e, n) : o(n)) || n);
  return s && n && Oe(t, e, n), n;
};
let y = class extends E {
  order = x.Physics;
  cameraPosition = new f(4, 0);
  targetCameraPositon = new f(4, 0);
  cameraScreenOffset = new f(100, 100);
  followingSpeed = 0.02;
  isFollowing = !0;
  zoomV = new f(20, -20);
  zoom = 20;
  targetId = "None";
  //todo: delete this
  targetZoom = 40;
  name = "CameraPlugin";
  transformMatrix = new DOMMatrix();
  start() {
    this.getPlugin(j).mouseScrollYEvent.subscribe(this, "scroll"), this.getPlugin(j).mouseDownEvent.subscribe(this, "down"), this.getPlugin(j).mouseUpEvent.subscribe(this, "up");
  }
  event(i, t) {
    if (t == "scroll") {
      const e = i;
      this.updateZoom(e.delta);
    } else if (t == "down") {
      if (i.button != 1)
        return;
      if (this.gameWorld.getGameObject(this.targetId)) {
        this.targetId = "None";
        return;
      }
      const n = this.getPlugin(j).getMouseScreenPosition(), r = this.getWorldPosition(n);
      let o = this.getPlugin(ie).overlapPoint(r)[0]?.getGameObject();
      o && (this.targetId = o.getId());
    }
  }
  updateZoom(i) {
    i = Math.sign(i), i > 0 && this.targetZoom * 0.9 > 10 && (this.targetZoom = 0.9 * this.targetZoom), i < 0 && this.targetZoom * 1.1 < 100 && (this.targetZoom = 1.1 * this.targetZoom);
  }
  getWorldPosition(i) {
    let t = this.getPlugin(y).zoomV, e = this.getPlugin(y).cameraPosition;
    return new f((i.x - this.cameraScreenOffset.x) / t.x, (i.y - this.cameraScreenOffset.y) / t.y).add(e);
  }
  updateCameraTransform() {
    this.transformMatrix = new DOMMatrix().translate(this.cameraScreenOffset.x, this.cameraScreenOffset.y).scale(this.zoomV.x, this.zoomV.y).translate(this.cameraPosition.x, this.cameraPosition.y);
  }
  getCameraTransform() {
    return this.transformMatrix;
  }
  update(i) {
    this.isFollowing && (this.cameraPosition = this.cameraPosition.interpolate(this.targetCameraPositon, Math.pow(this.followingSpeed, i))), this.zoom += (this.targetZoom - this.zoom) * (1 - Math.pow(2e-3, i)), this.zoomV = new f(this.zoom, -this.zoom);
    const t = this.gameWorld.getGameObject(this.targetId);
    if (t) {
      const e = this.getPlugin(j).getMouseScreenPosition(), s = this.getWorldPosition(e);
      t.getTransform().position = t.getTransform().position.interpolate(s, Math.pow(1e-3, i)), this.getPlugin(G).isPressed("2") && (t.getTransform().rotation += 0.5 * 3.14 * i), this.getPlugin(G).isPressed("1") && (t.getTransform().rotation -= 0.5 * 3.14 * i);
    }
    this.updateCameraTransform();
  }
  getscale() {
    return new g(!0, this.zoomV.toString(), this.zoomV);
  }
  follow(i) {
    return this.isFollowing = i, new g(!0, `Camera is ${i ? "following" : "not following"}`, void 0);
  }
  setzoom(i) {
    return this.targetZoom = i, new g(!0, `Camera zoom set to ${i}`, void 0);
  }
};
pt([
  b("getscale", void 0, "number")
], y.prototype, "getscale", 1);
pt([
  b("follow", "<following: boolean>")
], y.prototype, "follow", 1);
pt([
  b("zoom", "<zoom: number>")
], y.prototype, "setzoom", 1);
y = pt([
  Wt("camera")
], y);
class W extends q {
  zindex;
  constructor(t = 0) {
    super(), this.zindex = t;
  }
}
class kt extends W {
  color = new p(42, 42, 55);
  text;
  displayName;
  constructor(t, e = !1, s = 1) {
    super(), this.text = t, this.zindex = s, this.displayName = e;
  }
  render(t) {
    const e = this.getGameWorld(), s = this.getTransform(), n = this.getPlugin(y);
    if (!e || !s || !n) return;
    const r = s.position.x, o = s.position.y;
    s.rotation;
    const a = s.scale, h = this.color.toString(), l = this.displayName ? this.getGameObject()?.name ?? this.text : this.text;
    t.setTransform(n.getCameraTransform()), t.translate(r, o), t.scale(a.x, a.y), t.fillStyle = h;
    const c = 1;
    t.font = "bold " + c + "px Arial", t.fillStyle = "azure", t.shadowBlur = 10;
    const u = t.measureText(l).width / 2;
    t.strokeText(l, -u, c / 4), t.fillText(l, -u, c / 4), t.shadowBlur = 0, t.resetTransform();
  }
}
class tt extends E {
  order = x.Input;
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
class V extends W {
  activeColor = new p(172, 42, 55, 0.125);
  staticColor = new p(95, 64, 36, 0.125);
  dynamicColor = new p(57, 127, 31, 0.125);
  disabledColor = new p(36, 24, 36, 0.125);
  constructor(t = -1) {
    super(), this.zindex = t;
  }
  getColor() {
    let t = this.dynamicColor, e = this.getComponent(A);
    return e ? e.isEnabled() ? e.isActive ? t = this.activeColor : e.isStatic && (t = this.staticColor) : t = this.disabledColor : t = this.disabledColor, t;
  }
  render(t) {
    if (!(this.getPlugin(tt)?.get("displayColliders") ?? !1))
      return;
    const s = this.getGameWorld(), n = this.getTransform(), r = this.getPlugin(y), o = this.getComponent(A);
    if (!s || !n || !r || !o) return;
    const a = n.position.x, h = n.position.y, l = n.rotation, c = n.scale, u = this.getColor();
    o.offset;
    const d = o.radius, w = o.radius + 0.25;
    t.save(), t.setTransform(r.getCameraTransform()), t.translate(a, h), t.rotate(l), t.scale(c.x, c.y), t.strokeStyle = u.toRgb().toString(), t.fillStyle = u.toString(), t.shadowBlur = 30, t.beginPath(), t.arc(0, 0, w, 0, 2 * Math.PI), t.closePath(), t.fill(), t.stroke(), t.beginPath(), t.arc(0, 0, d, 0, 2 * Math.PI), t.closePath(), t.lineWidth = 0.1, t.stroke(), t.restore();
  }
}
class it {
  progress = -1;
  duration = 0.25;
  startAnimation = () => {
  };
  endAnimation = () => {
  };
  updateAnimation = () => {
  };
  constructor(t = () => {
  }, e = () => {
  }, s = () => {
  }) {
    this.updateAnimation = t, this.startAnimation = e, this.endAnimation = s;
  }
  update(t) {
    if (this.progress > 0) {
      let e = (this.duration - this.progress) / this.duration;
      this.progress -= t, this.updateAnimation(e);
    } else this.progress != -1 && (this.endAnimation(), this.progress = -1);
  }
  start() {
    this.progress == -1 ? (this.startAnimation(), this.progress = this.duration) : this.progress = (this.duration + this.progress) / 2;
  }
}
class mt extends q {
  tickCount = 0;
  tick(t) {
    this.tickCount == 0 ? this.start() : this.update(t), this.tickCount++;
  }
  start() {
  }
  update(t) {
  }
}
class F extends mt {
  shrinkAnimation = new it();
  zoomAnimation = new it();
  defaultZoom = new f(1, 1);
  constructor() {
    super(), this.shrinkAnimation = new it(
      (t) => this.getTransform().scale = this.defaultZoom.times(1 - t),
      () => this.getComponent(et)?.enable(!1),
      () => this.getGameWorld().destroy(this.getGameObject())
    ), this.zoomAnimation = new it(
      (t) => this.getTransform().scale = this.defaultZoom.times(1 + Math.sin(Math.PI * t) / 5),
      () => this.defaultZoom = this.getTransform().scale.clone(),
      () => this.getTransform().scale = this.defaultZoom
    );
  }
  update(t) {
    this.shrinkAnimation.update(t), this.zoomAnimation.update(t);
  }
  startZoom() {
    this.zoomAnimation.start();
  }
  startShrink() {
    this.shrinkAnimation.start();
  }
}
class v extends W {
  color;
  radius;
  n;
  constructor(t, e = 4, s = 0, n = p.randomColor2()) {
    super(), this.radius = t, this.n = e, this.zindex = s, this.color = n;
  }
  render(t) {
    const e = this.getGameWorld(), s = this.getTransform(), n = this.getPlugin(y);
    if (!e || !s || !n) return;
    const r = s.position.x, o = s.position.y, a = s.rotation, h = s.scale, l = this.color.toString(), c = this.radius;
    if (t.setTransform(n.getCameraTransform()), t.translate(r, o), t.rotate(a), t.scale(h.x, h.y), this.n < 10) {
      t.beginPath(), t.moveTo(0, c);
      const u = 2 * Math.PI / this.n;
      for (let d = 1; d < this.n; d++)
        t.lineTo(Math.sin(d * u) * c, Math.cos(d * u) * c);
      t.closePath();
    } else
      t.beginPath(), t.arc(0, 0, c, 0, 2 * Math.PI), t.closePath();
    t.fillStyle = l, t.shadowBlur = 0, t.fill(), t.shadowBlur = 50, t.stroke(), t.shadowBlur = 0, t.resetTransform();
  }
}
class Ie extends Y {
  damage;
  participant;
  constructor(t, e) {
    super(), this.damage = t, this.participant = e;
  }
}
class D extends q {
  health;
  maxHealth;
  damageEvent;
  constructor(t, e = t) {
    super(), this.health = e, this.maxHealth = t, this.damageEvent = new L();
  }
  start() {
    this.damageEvent.register(this.getGameWorld()), this.getComponent(A).onCollisionEnterEvent.subscribe(this, "onCollisionEnter");
  }
  event(t) {
    let e = t;
    this.onCollisionEnter(e.collider);
  }
  onCollisionEnter(t) {
    let e = t.getGameObject(), s = e.getComponent(C), n = this.getComponent(C), r = n.mass / (s.mass + n.mass);
    n.mass < s.mass && (s.velocity = s.velocity.add(n.velocity.times(r)).times(0.5), n.velocity = n.velocity.add(s.velocity.times(1 - r).times(0.5))), s.angularVelocity += this.getTransform().position.sub(e.getTransform().position).vectorProduct(n.velocity) * (r / 15);
    try {
      const o = e.getComponent(D), a = Math.min(o.health, this.health);
      if (a == 0)
        return;
      this.onDamage(a, o), o.onDamage(a, this);
    } catch {
    }
  }
  getHealth() {
    return this.health / this.maxHealth;
  }
  heal(t) {
    this.health = Math.min(this.maxHealth, this.health + t);
  }
  onDamage(t, e) {
    if (this.health -= t, this.damageEvent.emit(new Ie(t, e)), this.health == 0) {
      if (this.getComponent(A)?.enable(!1), this.getComponent(C).dampingFactor = 0.6, this.getComponent(F)?.startShrink(), e.hasComponent(v)) {
        let n = this.getComponent(v).color.blend(
          e.getComponent(v).color.toRgb(),
          0.5
        ).toRgb();
        this.getComponent(v).color = n, e.getComponent(v).color = n;
      }
    } else
      this.getComponent(F)?.startZoom();
  }
}
class et extends W {
  offset = new f(0, 4);
  fill = 0.5;
  width = 5;
  height = 0.5;
  constructor(t = 0) {
    super(t);
  }
  render(t) {
    const e = this.getGameWorld(), s = this.getTransform(), n = this.getComponent(D), r = this.getPlugin(y);
    if (!e || !s || !n || !r) return;
    const o = s.position.x, a = s.position.y, h = s.rotation, l = s.scale, c = n.getHealth(), u = T.minmax(2 + n.maxHealth / 250, 0, 1), d = p.getHeatmapColor(u).toString(), w = 0.25;
    t.setTransform(r.getCameraTransform()), t.translate(o, a), t.rotate(h), t.scale(l.x, l.y), t.translate(this.offset.x, this.offset.y), t.fillStyle = d, t.shadowBlur = 0, t.beginPath(), t.roundRect(-c / 2, -this.height / 2, c, this.height, w), t.closePath(), t.fillStyle = p.background.toString(), t.fill(), t.beginPath(), t.roundRect(-c / 2, -this.height / 2, c * u, this.height, w), t.closePath(), t.fillStyle = d, t.fill(), t.beginPath(), t.roundRect(-c / 2, -this.height / 2, c, this.height, w), t.closePath(), t.shadowBlur = 30, t.stroke(), t.beginPath(), t.roundRect(-c / 2, -this.height / 2, c * u, this.height, w), t.closePath(), t.shadowBlur = 0, t.stroke(), t.resetTransform();
  }
}
class ne extends E {
  order = x.Input;
  name = "SchedulerPlugin";
  schedule = [];
  addInvoke(t, e, s) {
    let n = new WeakRef(t);
    this.schedule.push({ totalTime: e, subscriber: n, topic: s }), this.schedule.sort((r, o) => o.totalTime - r.totalTime);
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
class re extends q {
  constructor(t = 1) {
    super(), this.lifeTime = t;
  }
  onInvoke(t) {
    this.getComponent(F)?.startShrink();
  }
  start() {
    let t = this.getGameWorld().getWorldTime() + this.lifeTime;
    this.getGameWorld().getPlugin(ne).addInvoke(this, t, "destroy");
  }
}
class Lt extends W {
  color;
  radius;
  constructor(t, e = 0, s = p.randomColor2()) {
    super(), this.radius = t, this.zindex = e, this.color = s;
  }
  render(t) {
    const e = this.getGameWorld(), s = this.getTransform(), n = this.getPlugin(y);
    if (!e || !s || !n) return;
    const r = s.position.x, o = s.position.y, a = s.rotation, h = s.scale, l = this.color.toString(), c = this.radius, u = 4;
    t.setTransform(n.getCameraTransform()), t.translate(r, o), t.rotate(a), t.scale(h.x, h.y), t.beginPath(), t.rect(-3 * c - u, -c, u, 2 * c), t.closePath();
    const d = t.createLinearGradient(-3 * c - u, 0, u, 0);
    d.addColorStop(0, this.color.blend(new p(255, 255, 255), 0.5).toArgb(0).toString()), d.addColorStop(1, this.color.toArgb(0.75).toString()), t.fillStyle = d, t.shadowBlur = 0, t.fill(), t.beginPath(), t.arc(0, 0, c, 0, 2 * Math.PI), t.closePath(), t.fillStyle = l, t.shadowBlur = 0, t.fill(), t.shadowBlur = 50, t.stroke(), t.beginPath(), t.roundRect(-3 * c, -c, 3 * c, 2 * c, c / 2), t.closePath(), t.fillStyle = this.color.blend(p.background, 1).toString(), t.shadowBlur = 0, t.fill(), t.shadowBlur = 50, t.stroke(), t.resetTransform();
  }
}
class H extends q {
  ownerId;
  constructor(t) {
    super(), this.ownerId = t.getId();
  }
  getOwner() {
    return this.getGameWorld()?.getGameObject(this.ownerId);
  }
  static bulletGO(t, e = 30, s = 0.65, n = 1, r = -1, ...o) {
    let a = new J(
      new C(0.05, 1),
      new Lt(s, r, new p(173, 87, 87)),
      new v(s, 10, r, new p(173, 87, 87)),
      new A(s, !1),
      new V(),
      new D(e),
      new F(),
      new re(n),
      new H(t),
      ...o
    );
    return a.getTransform().rotation = 0, a.name = "Bullet", a.getComponent(v)?.enable(!1), a;
  }
}
class gt extends W {
  color;
  constructor(t = 0, e = p.background.clone()) {
    super(), this.zindex = t, this.color = e;
  }
  render(t) {
    const e = this.getGameWorld(), s = this.getTransform(), n = this.getPlugin(y), r = this.getComponent(K);
    if (!e || !s || !n || !r) return;
    const o = s.position.x, a = s.position.y, h = s.rotation, l = s.scale, c = this.color.toString();
    t.setTransform(n.getCameraTransform()), t.translate(o, a), t.rotate(h), t.scale(l.x, l.y);
    const u = r.length, d = r.width, w = Math.min(1, r.getShotDelta() / r.cooldown), R = Math.sin(w * Math.PI), S = 1;
    r.range / 5;
    const jt = r.direction.times(r.bulletSpeed).times(r.getBulletLifetime()).add(r.getGlobalOffset());
    t.setTransform(n.getCameraTransform()), t.translate(o, a), t.scale(l.x, l.y), t.save(), t.globalCompositeOperation = "lighter", t.rotate(r.direction.toRad()), t.translate((1 - R / 3) * u, 0);
    const vt = t.createRadialGradient(0, 0, 0, 0, 0, 5 * (1 - w));
    vt.addColorStop(0, "rgba(219, 144, 31, 0.25)"), vt.addColorStop(1, "rgba(58, 40, 12, 0)"), t.fillStyle = vt, t.shadowBlur = 0, t.beginPath(), t.arc(0, 0, 20, 0, 2 * Math.PI), t.closePath(), t.fill(), t.restore(), t.translate(jt.x, jt.y), t.beginPath(), t.arc(0, 0, S, 0, 2 * Math.PI), t.closePath(), t.shadowBlur = 0, t.stroke(), t.strokeRect(-S / 2, -S / 2, S, S), t.resetTransform(), t.setTransform(n.getCameraTransform()), t.translate(o, a), t.scale(l.x, l.y), t.rotate(r.direction.toRad()), t.beginPath(), t.roundRect(0, -d / 2, (1 - R / 3) * u, d, 0.1), t.closePath(), t.fillStyle = c, t.shadowBlur = 0, t.fill(), t.shadowBlur = 30, t.stroke(), t.shadowBlur = 0, t.resetTransform();
  }
}
class Ne {
  x;
  y;
  dx;
  dy;
  radius;
  targetRadius;
  color;
  alpha;
  constructor(t, e, s, n, r) {
    this.x = t, this.y = e, this.dx = 0, this.dy = 0, this.radius = 0, this.targetRadius = s, this.color = n, this.alpha = r;
  }
}
class dt extends W {
  color;
  radius;
  n;
  particles = [];
  constructor(t, e = 4, s = 0, n = p.randomColor2()) {
    super(), this.radius = t, this.n = e, this.zindex = s, this.color = n;
  }
  start() {
  }
  emitParticles(t = 1, e = new f(0, 0), s = new f(0, 0)) {
    for (let r = 0; r < t; r++) {
      const o = Math.random() * 2 * Math.PI, a = 1 * (Math.random() * 0.5 + 0.5), h = a * Math.cos(o) + this.getTransform().position.x + e.x, l = a * Math.sin(o) + this.getTransform().position.y + e.y, c = this.radius * 0.25 + 0.15 * this.radius * T.symRand(1), u = Math.random() * 0.5 + 0.5, d = new Ne(h, l, c, this.color, u);
      d.dx = this.getComponent(C)?.velocity.x ?? 0, d.dy = this.getComponent(C)?.velocity.y ?? 0, d.dx += s.x, d.dy += s.y, this.particles.push(d);
    }
  }
  updateParticles(t) {
    for (const s of this.particles)
      s.x += s.dx * t, s.y += s.dy * t, s.dx += (Math.random() - 0.5) * t * 50, s.dy += (Math.random() - 0.5) * t * 50, s.dx *= Math.pow(0.1, t), s.dy *= Math.pow(0.1, t), s.alpha -= t / 1, s.radius += (s.targetRadius - s.radius) * (1 - Math.pow(0.025, t)), s.alpha <= 0 && this.particles.splice(this.particles.indexOf(s), 1);
  }
  render(t, e) {
    this.updateParticles(e);
    const s = 0, n = 0, r = this.getGameWorld().getPlugin(y).cameraScreenOffset, o = this.getGameWorld().getPlugin(y).zoomV, a = this.getGameWorld().getPlugin(y).cameraPosition.x, h = this.getGameWorld().getPlugin(y).cameraPosition.y, l = s - a, c = n - h;
    t.translate(r.x, r.y), t.scale(o.x, o.y), t.translate(l, c);
    for (const u of this.particles)
      t.beginPath(), t.arc(u.x, u.y, u.radius, 0, 2 * Math.PI), t.closePath(), t.fillStyle = u.color.toString(), t.globalAlpha = u.alpha, t.shadowColor = u.color.toString(), t.shadowBlur = 10, t.fill(), t.globalAlpha = 1;
    t.shadowBlur = 0, t.shadowColor = p.stroke.toString(), t.setTransform(1, 0, 0, 1, 0, 0);
  }
}
class K extends mt {
  // private lastShootTime: number = performance.now();
  constructor(t = 4, e = 2, s = 10) {
    super(), this.damage = s, this.length = t, this.width = e, this.offset = new f(t - this.width, 0);
  }
  cooldown = 0.25;
  bulletSpeed = 40;
  length;
  width;
  range = 250;
  bulletSpraed = 0.05;
  offset;
  direction = f.right();
  targetDirection = f.right();
  shotDelta = 0;
  getShotDelta() {
    return this.shotDelta;
  }
  update(t) {
    let e = this.direction.toRad(), s = this.targetDirection.toRad();
    e += 9 * t * T.deltaAngle(e, s), this.direction = f.fromRad(e), this.shotDelta += t;
  }
  getBulletLifetime() {
    return this.range / this.bulletSpeed;
  }
  getGlobalOffset() {
    return this.direction.toUnit().times(this.offset.x).add(this.direction.cross().times(this.offset.y));
  }
  shoot() {
    const t = this.getGameWorld(), e = this.getTransform(), s = this.getGameObject();
    if (!(!t || !e || !s) && !(!this.isEnabled || !s.enabled) && this.getShotDelta() >= this.cooldown) {
      const r = this.getComponent(gt).zindex - 0.01, o = this.direction.cross().times(Math.random() * 2 * this.bulletSpraed - this.bulletSpraed), a = this.direction.toUnit().add(o).toUnit(), h = this.getGlobalOffset();
      let l = H.bulletGO(
        s,
        this.damage,
        this.width / 2 + T.symRand(0.125) - this.width / 6,
        this.getBulletLifetime(),
        r
      );
      const c = l.getComponent(C), u = l.getComponent(A);
      l.getComponent(v).color = this.getComponent(v).color.clone(), l.getComponent(Lt).color = this.getComponent(v).color.clone(), u.avoidObjectes.add(this.getGameObject()), c.velocity = a.times(this.bulletSpeed), l.getTransform().position = this.getTransform().position.add(h), this.getComponent(dt)?.emitParticles(23, h, this.direction.cross().times(this.bulletSpeed / 7).add(this.direction.times(this.bulletSpeed / 3))), this.getComponent(dt)?.emitParticles(23, h, this.direction.cross().times(-this.bulletSpeed / 7).add(this.direction.times(this.bulletSpeed / 3))), l.getTransform().rotation = a.toRad(), t.spawn(l), this.shotDelta = 0;
    }
  }
}
class St extends W {
  color;
  constructor(t = 0, e = new p(22, 24, 25)) {
    super(), this.zindex = t, this.color = e;
  }
  render(t) {
    const e = this.getGameWorld(), s = this.getTransform(), n = this.getPlugin(y);
    if (!e || !s || !n) return;
    const r = s.position.x, o = s.position.y, a = s.rotation, h = s.scale;
    this.color.toString();
    const l = this.getComponent(v)?.color.toString() ?? p.stroke.toString();
    t.setTransform(n.getCameraTransform()), t.translate(r, o), t.rotate(a), t.scale(h.x, h.y), t.beginPath(), t.fillStyle = l, t.shadowBlur = 0, t.roundRect(-4, -2, 8, 4, 1), t.fill(), t.shadowBlur = 50, t.stroke(), t.closePath(), t.beginPath(), t.fillStyle = p.background.toString(), t.shadowBlur = 0, t.roundRect(-4.5, -3.25, 10, 2, 0.5), t.fill(), t.shadowBlur = 50, t.stroke(), t.closePath(), t.beginPath(), t.shadowBlur = 0, t.roundRect(-4.5, 1.25, 10, 2, 0.5), t.fill(), t.shadowBlur = 50, t.stroke(), t.closePath(), t.beginPath(), t.fillStyle = p.background.toString(), t.shadowBlur = 0, t.roundRect(-3, -2, 6, 4, 1.5), t.fill(), t.shadowBlur = 50, t.stroke(), t.closePath(), t.shadowBlur = 0, t.resetTransform();
  }
}
class oe extends W {
  color;
  tracesSpace = 0.5;
  traces = [];
  lastPosition = void 0;
  transparency = 2;
  duration = 1;
  length = 2;
  constructor(t = 0, e = new p(66, 83, 68)) {
    super(), e = e.blend(p.stroke, 0.3), this.zindex = t, this.color = e;
  }
  render(t) {
    const e = this.getGameWorld().getPlugin(y).cameraScreenOffset, s = this.getGameWorld().getPlugin(y).zoomV, n = this.getGameWorld().getPlugin(y).cameraPosition.x, r = this.getGameWorld().getPlugin(y).cameraPosition.y, o = this.getTransform().position.clone(), a = this.getTransform().rotation;
    this.lastPosition == null && (this.lastPosition = o.clone());
    let h = o.sub(this.lastPosition);
    for (; h.magnitude() > this.tracesSpace; )
      this.traces.push(
        {
          position: this.lastPosition,
          rotation: a,
          startTime: this.getGameWorld().getWorldTime()
        }
      ), this.lastPosition = this.lastPosition.add(h.toUnit().times(this.tracesSpace)), h = o.sub(this.lastPosition);
    for (; this.traces.length > 0 && this.traces[0].startTime + this.duration < this.getGameWorld().getWorldTime(); )
      this.traces.shift();
    for (const l of this.traces) {
      const c = l.position.x - n, u = l.position.y - r, d = 1 - (this.getGameWorld().getWorldTime() - l.startTime) / this.duration;
      t.translate(e.x, e.y), t.scale(s.x, s.y), t.translate(c, u), t.rotate(l.rotation), t.beginPath(), t.fillStyle = this.color.toArgb(this.color.a * this.transparency * d).toString(), t.shadowBlur = 0, t.roundRect(-4.5, -3.25, this.length, 2, 0.75), t.fill(), t.closePath(), t.beginPath(), t.roundRect(-4.5, 1.25, this.length, 2, 0.75), t.fill(), t.closePath(), t.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
}
class We extends q {
  tags = /* @__PURE__ */ new Set();
  constructor(...t) {
    super(), t.forEach((e) => this.addTag(e));
  }
  addTag(t) {
    this.tags.add(t);
  }
  removeTag(t) {
    this.tags.delete(t);
  }
  hasTag(t) {
    return this.tags.has(t);
  }
  getTags() {
    return Array.from(this.tags);
  }
}
class z {
  static polygonGO(t = 2, e = 3, ...s) {
    let n = new J(
      new C(0.1),
      new v(t, e, 0, p.randomColor2().toArgb(0.75)),
      new et(0.1),
      new A(T.getColliderRadius(e, t)),
      new V(),
      new D(25 * e),
      new F(),
      new We("Dragable"),
      ...s
    );
    return n.getTransform().rotation = Math.random() * 2 * Math.PI, n.name = "Polygon", n;
  }
  static enemyGO(t = 2.5, e = "", s = 4, ...n) {
    let r = new J(
      new kt(e, void 0, s + 0.1),
      new v(t, 8, s),
      new et(s + 0.1),
      new St(s - 0.2),
      new C(30),
      new A(t, !1),
      new V(s - 0.15),
      new D(1500),
      new F(),
      new oe(-21.37),
      ...n
    );
    return r.getTransform().rotation = T.symRand(Math.PI), r.getComponent(K).targetDirection = f.fromRad(T.symRand(Math.PI)), r.name = "Enemy", r;
  }
  static bulletGO(t, e = 30, s = 0.65, n = 1, r = -1, ...o) {
    let a = new J(
      new C(0.05, 1),
      new v(s, 10, r, new p(173, 87, 87)),
      new A(s, !1),
      new V(),
      new D(e),
      new F(),
      new re(n),
      new H(t),
      ...o
    );
    return a.getTransform().rotation = 0, a.name = "Bullet", a;
  }
  static playerGO(t = 2.5, e = 5, ...s) {
    let n = new J(
      // new ImageRendererC(undefined, new Vector(1.3, 0.3), "GameEngine/src/Assets/vectorpaint2.svg" , zindex-0.2),
      new St(e - 0.2),
      new v(t, 10, e, new p(50, 99, 52)),
      new kt("Player", !0, e + 0.1),
      new V(e - 0.15),
      new et(e + 0.1),
      new gt(e - 0.1),
      new C(30, 0.025),
      new A(t, !1),
      new D(1e3),
      new F(),
      new K(7, 1.35, 44),
      // new TracesRendererC(-21.37),
      new dt(2, 20, e - 0.11, new p(122, 122, 122)),
      ...s
    );
    return n.getTransform().rotation = 0, n.name = "Player", n;
  }
}
class At extends E {
  order = x.Render;
  name = "ProfilerPlugin";
  size = 250;
  isVisible = !0;
  profilerWrapper = document.createElement("div");
  usage = /* @__PURE__ */ new Map();
  constructor() {
    super();
  }
  start() {
    this.getPlugin(G).KeyDownEvent.subscribe(this, "keydown"), document.body.appendChild(this.profilerWrapper), this.addRecord("Fps", 0);
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
        let o = r[0], a = r[1].length, h = 0;
        for (const l of r[1])
          h += l;
        h /= a, n.push(`${o}: ` + h.toFixed(2).toString());
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
class De {
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
    if (t) {
      if (!this.gameObjects.has(t.getId()))
        throw new Error(`GameObject ${t.name} does'not exist in the game world`);
      t.enabled = !1, this.gameObjects.delete(t.getId());
    }
  }
  hasGameObject(t) {
    return this.gameObjects.has(t);
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
      e.update(t / 1e3), this.tryGetPlugin(At)?.addRecord(e.name, performance.now() - s);
    });
  }
  invokeEvents() {
    let t = performance.now();
    for (const e of this.events) {
      const s = e.deref();
      s ? s.invoke() : this.events.delete(e);
    }
    this.tryGetPlugin(At)?.addRecord("Events", performance.now() - t);
  }
  //overridable methods
  Start() {
  }
  Update(t) {
  }
}
class Le extends mt {
  type = 2;
  isAttacing = !1;
  targetId = "None";
  isFollowing = !1;
  minDistance = 35;
  maxDistance = 1e3;
  maxSpeed = 10;
  start() {
    this.getComponent(D).damageEvent.subscribe(this);
  }
  event(t) {
    const s = t.participant;
    s.getComponent(H)?.getOwner() && this.attack(s.getComponent(H).getOwner());
  }
  attack(t) {
    this.isAttacing = !0, this.targetId = t.getId(), this.isFollowing = !0;
  }
  update(t) {
    let e = this.getGameWorld().getGameObject(this.targetId);
    if (!e) {
      this.isAttacing = !1;
      return;
    }
    if (this.isAttacing) {
      let s = this.getComponent(K), n = e.getTransform().position.sub(this.getTransform().position);
      s.targetDirection = n;
      let r = n.magnitude();
      if (r > this.maxDistance && (this.isAttacing = !1), s.shoot(), r >= this.minDistance) {
        let o = this.getTransform().rotation, a = n.toRad();
        o += 5 * t * T.deltaAngle(o, a), this.getTransform().rotation = o;
        let h = this.getComponent(C);
        h.velocity = f.fromRad(o).times(this.maxSpeed);
      }
    }
  }
}
class Ge extends De {
  Start() {
    console.log("Hello, MyWorld!");
    const t = 350;
    for (let e = 0; e < 350; e++) {
      const s = 3 + T.symRand(0.25);
      let n = z.polygonGO(s / 2, 4);
      n.getTransform().position = f.randomPos(t), n.getComponent(C).angularVelocity = Math.random() * 2 - 1, this.spawn(n);
    }
    for (let e = 0; e < 150; e++) {
      const s = 3.5 + T.symRand(0.25);
      let n = z.polygonGO(s / 2, 3);
      n.getTransform().position = f.randomPos(t), n.getComponent(C).angularVelocity = Math.random() * 2 - 1, this.spawn(n);
    }
    for (let e = 0; e < 250; e++) {
      const s = 4 + T.symRand(0.25);
      let n = z.polygonGO(s / 2, Math.round(Math.random() * 3) + 5);
      n.getTransform().position = f.randomPos(t), n.getComponent(C).angularVelocity = Math.random() * 2 - 1, this.spawn(n);
    }
    for (let e = 0; e < 25; e++) {
      let s = z.enemyGO(
        2.5,
        "Enemy nr." + e,
        4,
        new K(void 0, void 0, 10 + Math.random() * 5),
        new gt(3.9),
        new Le()
      );
      s.getTransform().position = f.randomPos(t), this.spawn(s);
    }
  }
  Update(t) {
  }
}
class Fe extends W {
  image = new Image();
  side;
  offset;
  constructor(t = f.zero(), e = f.zero(), s = "GameEngine/src/Assets/vectorpaint3.svg", n = 0) {
    super(), this.zindex = n, this.side = t, this.offset = e, this.image.src = s;
  }
  render(t) {
    const e = this.getGameWorld(), s = this.getTransform(), n = this.getPlugin(y);
    if (!e || !s || !n) return;
    const r = s.position.x, o = s.position.y, a = s.rotation, h = s.scale;
    t.setTransform(n.getCameraTransform()), t.translate(r, o), t.rotate(a), t.scale(h.x, h.y);
    let l = this.side;
    l.x == 0 && (l.x = this.image.width), l.y == 0 && (l.y = this.image.height), t.shadowBlur = 15, t.drawImage(this.image, -l.x / 2, -l.y / 2, l.x, l.y), t.shadowBlur = 0, t.resetTransform();
  }
}
class Ue extends E {
  order = x.Render;
  name = "RendererPlugin";
  context;
  renderDistance = 150;
  constructor(t) {
    super(), this.context = t;
  }
  addVignetteEffect(t, e) {
    const s = t.canvas.width / 2, n = t.canvas.height / 2, r = Math.sqrt(s * s + n * n), o = t.createRadialGradient(s, n, 0, s, n, r);
    o.addColorStop(0.025, "rgba(0, 0, 0, 0)"), o.addColorStop(1, e), t.fillStyle = o, t.fillRect(0, 0, t.canvas.width, t.canvas.height);
  }
  gridCanvas = [];
  start() {
    this.context.imageSmoothingEnabled = !0, this.context.strokeStyle = "rgb(43,43,44)", this.context.lineWidth = 0.175, this.context.lineJoin = "round", this.context.shadowColor = "rgba(0, 0, 0, 0.75)", this.context.fillStyle = "#716f6b", this.context.fillStyle = "rgb(85, 106, 86)", this.context.fillStyle = "rgb(66, 85, 68)";
    const t = new Worker(new URL(
      /* @vite-ignore */
      "/assets/BackgroundRenderer-Dyo13YMg.js",
      import.meta.url
    ), { type: "module" });
    t.onerror = (e) => {
      console.error("Worker error:", e);
    };
    for (let e = 0; e < 10; e++) {
      this.gridCanvas[e] = document.createElement("canvas"), this.gridCanvas[e].width = 3440, this.gridCanvas[e].height = 1440, document.createElement("canvas");
      const s = this.gridCanvas[e].transferControlToOffscreen();
      t.postMessage({ canvas: s, args: [new f(2, 2), 0.175, p.stroke.toString(), new f(e * 5 + 5, e * 5 + 5)] }, [s]);
    }
  }
  clip(t) {
    if (!t) return !0;
    const e = this.context.canvas.width, s = this.context.canvas.height, n = this.getPlugin(y).zoomV, r = this.getPlugin(y).cameraPosition, o = Math.abs(e / 2 / n.x), a = Math.abs(s / 2 / n.y);
    return Math.abs(t.x - r.x) > o || Math.abs(t.y - r.y) > a;
  }
  update(t) {
    const e = this.context.canvas.width, s = this.context.canvas.height;
    this.context.fillStyle = "rgba(80, 100, 81, 1)", this.context.fillRect(0, 0, e, s), this.getPlugin(y).cameraScreenOffset = new f(this.context.canvas.width / 2, this.context.canvas.height / 2);
    let n = 2, r = 2;
    const o = this.getPlugin(y).cameraScreenOffset, a = this.getPlugin(y).zoomV, h = this.getPlugin(y).cameraPosition;
    let l = Math.max(0, Math.min(9, Math.round(a.x / 10))), c = l * 5 + 5;
    this.context.translate(o.x, o.y), this.context.scale(a.x, a.y), this.context.translate(-h.x % n, -h.y % r), this.context.scale(1 / c, 1 / c), this.context.drawImage(this.gridCanvas[l], -this.gridCanvas[l].width / 2, -this.gridCanvas[l].height / 2, this.gridCanvas[l].width, this.gridCanvas[l].height), this.context.setTransform(1, 0, 0, 1, 0, 0), this.gameWorld.getComponents(kt).concat(this.gameWorld.getComponents(V)).concat(this.gameWorld.getComponents(et)).concat(this.gameWorld.getComponents(v)).concat(this.gameWorld.getComponents(Fe)).filter((u) => !this.clip(u.getTransform()?.position)).concat(this.gameWorld.getComponents(gt)).concat(this.gameWorld.getComponents(Lt)).concat(this.gameWorld.getComponents(oe)).filter((u) => !this.clip(u.getTransform()?.position)).concat(this.gameWorld.getComponents(St)).concat(this.gameWorld.getComponents(dt)).filter((u) => !this.clip(u.getTransform()?.position)).sort((u, d) => u.zindex - d.zindex).forEach((u) => u.render(this.context, t)), this.addVignetteEffect(this.context, "rgba(0, 0, 0, 0.35)");
  }
}
class $e extends E {
  order = x.Physics;
  name = "PhysicsPlugin";
  update(t) {
    this.gameWorld.getWorldTime(), this.gameWorld.getComponents(C).forEach((e) => e.update(t));
  }
}
const N = /* @__PURE__ */ Object.create(null);
N.open = "0";
N.close = "1";
N.ping = "2";
N.pong = "3";
N.message = "4";
N.upgrade = "5";
N.noop = "6";
const ot = /* @__PURE__ */ Object.create(null);
Object.keys(N).forEach((i) => {
  ot[N[i]] = i;
});
const Bt = { type: "error", data: "parser error" }, ae = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", he = typeof ArrayBuffer == "function", le = (i) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(i) : i && i.buffer instanceof ArrayBuffer, Gt = ({ type: i, data: t }, e, s) => ae && t instanceof Blob ? e ? s(t) : Jt(t, s) : he && (t instanceof ArrayBuffer || le(t)) ? e ? s(t) : Jt(new Blob([t]), s) : s(N[i] + (t || "")), Jt = (i, t) => {
  const e = new FileReader();
  return e.onload = function() {
    const s = e.result.split(",")[1];
    t("b" + (s || ""));
  }, e.readAsDataURL(i);
};
function Qt(i) {
  return i instanceof Uint8Array ? i : i instanceof ArrayBuffer ? new Uint8Array(i) : new Uint8Array(i.buffer, i.byteOffset, i.byteLength);
}
let Pt;
function qe(i, t) {
  if (ae && i.data instanceof Blob)
    return i.data.arrayBuffer().then(Qt).then(t);
  if (he && (i.data instanceof ArrayBuffer || le(i.data)))
    return t(Qt(i.data));
  Gt(i, !1, (e) => {
    Pt || (Pt = new TextEncoder()), t(Pt.encode(e));
  });
}
const te = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Q = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let i = 0; i < te.length; i++)
  Q[te.charCodeAt(i)] = i;
const je = (i) => {
  let t = i.length * 0.75, e = i.length, s, n = 0, r, o, a, h;
  i[i.length - 1] === "=" && (t--, i[i.length - 2] === "=" && t--);
  const l = new ArrayBuffer(t), c = new Uint8Array(l);
  for (s = 0; s < e; s += 4)
    r = Q[i.charCodeAt(s)], o = Q[i.charCodeAt(s + 1)], a = Q[i.charCodeAt(s + 2)], h = Q[i.charCodeAt(s + 3)], c[n++] = r << 2 | o >> 4, c[n++] = (o & 15) << 4 | a >> 2, c[n++] = (a & 3) << 6 | h & 63;
  return l;
}, ze = typeof ArrayBuffer == "function", Ft = (i, t) => {
  if (typeof i != "string")
    return {
      type: "message",
      data: ce(i, t)
    };
  const e = i.charAt(0);
  return e === "b" ? {
    type: "message",
    data: Ve(i.substring(1), t)
  } : ot[e] ? i.length > 1 ? {
    type: ot[e],
    data: i.substring(1)
  } : {
    type: ot[e]
  } : Bt;
}, Ve = (i, t) => {
  if (ze) {
    const e = je(i);
    return ce(e, t);
  } else
    return { base64: !0, data: i };
}, ce = (i, t) => {
  switch (t) {
    case "blob":
      return i instanceof Blob ? i : new Blob([i]);
    case "arraybuffer":
    default:
      return i instanceof ArrayBuffer ? i : i.buffer;
  }
}, ue = "", He = (i, t) => {
  const e = i.length, s = new Array(e);
  let n = 0;
  i.forEach((r, o) => {
    Gt(r, !1, (a) => {
      s[o] = a, ++n === e && t(s.join(ue));
    });
  });
}, Ke = (i, t) => {
  const e = i.split(ue), s = [];
  for (let n = 0; n < e.length; n++) {
    const r = Ft(e[n], t);
    if (s.push(r), r.type === "error")
      break;
  }
  return s;
};
function Ye() {
  return new TransformStream({
    transform(i, t) {
      qe(i, (e) => {
        const s = e.length;
        let n;
        if (s < 126)
          n = new Uint8Array(1), new DataView(n.buffer).setUint8(0, s);
        else if (s < 65536) {
          n = new Uint8Array(3);
          const r = new DataView(n.buffer);
          r.setUint8(0, 126), r.setUint16(1, s);
        } else {
          n = new Uint8Array(9);
          const r = new DataView(n.buffer);
          r.setUint8(0, 127), r.setBigUint64(1, BigInt(s));
        }
        i.data && typeof i.data != "string" && (n[0] |= 128), t.enqueue(n), t.enqueue(e);
      });
    }
  });
}
let Et;
function nt(i) {
  return i.reduce((t, e) => t + e.length, 0);
}
function rt(i, t) {
  if (i[0].length === t)
    return i.shift();
  const e = new Uint8Array(t);
  let s = 0;
  for (let n = 0; n < t; n++)
    e[n] = i[0][s++], s === i[0].length && (i.shift(), s = 0);
  return i.length && s < i[0].length && (i[0] = i[0].slice(s)), e;
}
function Xe(i, t) {
  Et || (Et = new TextDecoder());
  const e = [];
  let s = 0, n = -1, r = !1;
  return new TransformStream({
    transform(o, a) {
      for (e.push(o); ; ) {
        if (s === 0) {
          if (nt(e) < 1)
            break;
          const h = rt(e, 1);
          r = (h[0] & 128) === 128, n = h[0] & 127, n < 126 ? s = 3 : n === 126 ? s = 1 : s = 2;
        } else if (s === 1) {
          if (nt(e) < 2)
            break;
          const h = rt(e, 2);
          n = new DataView(h.buffer, h.byteOffset, h.length).getUint16(0), s = 3;
        } else if (s === 2) {
          if (nt(e) < 8)
            break;
          const h = rt(e, 8), l = new DataView(h.buffer, h.byteOffset, h.length), c = l.getUint32(0);
          if (c > Math.pow(2, 21) - 1) {
            a.enqueue(Bt);
            break;
          }
          n = c * Math.pow(2, 32) + l.getUint32(4), s = 3;
        } else {
          if (nt(e) < n)
            break;
          const h = rt(e, n);
          a.enqueue(Ft(r ? h : Et.decode(h), t)), s = 0;
        }
        if (n === 0 || n > i) {
          a.enqueue(Bt);
          break;
        }
      }
    }
  });
}
const de = 4;
function _(i) {
  if (i) return Ze(i);
}
function Ze(i) {
  for (var t in _.prototype)
    i[t] = _.prototype[t];
  return i;
}
_.prototype.on = _.prototype.addEventListener = function(i, t) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + i] = this._callbacks["$" + i] || []).push(t), this;
};
_.prototype.once = function(i, t) {
  function e() {
    this.off(i, e), t.apply(this, arguments);
  }
  return e.fn = t, this.on(i, e), this;
};
_.prototype.off = _.prototype.removeListener = _.prototype.removeAllListeners = _.prototype.removeEventListener = function(i, t) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var e = this._callbacks["$" + i];
  if (!e) return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + i], this;
  for (var s, n = 0; n < e.length; n++)
    if (s = e[n], s === t || s.fn === t) {
      e.splice(n, 1);
      break;
    }
  return e.length === 0 && delete this._callbacks["$" + i], this;
};
_.prototype.emit = function(i) {
  this._callbacks = this._callbacks || {};
  for (var t = new Array(arguments.length - 1), e = this._callbacks["$" + i], s = 1; s < arguments.length; s++)
    t[s - 1] = arguments[s];
  if (e) {
    e = e.slice(0);
    for (var s = 0, n = e.length; s < n; ++s)
      e[s].apply(this, t);
  }
  return this;
};
_.prototype.emitReserved = _.prototype.emit;
_.prototype.listeners = function(i) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + i] || [];
};
_.prototype.hasListeners = function(i) {
  return !!this.listeners(i).length;
};
const yt = typeof Promise == "function" && typeof Promise.resolve == "function" ? (t) => Promise.resolve().then(t) : (t, e) => e(t, 0), B = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), Je = "arraybuffer";
function fe(i, ...t) {
  return t.reduce((e, s) => (i.hasOwnProperty(s) && (e[s] = i[s]), e), {});
}
const Qe = B.setTimeout, ts = B.clearTimeout;
function wt(i, t) {
  t.useNativeTimers ? (i.setTimeoutFn = Qe.bind(B), i.clearTimeoutFn = ts.bind(B)) : (i.setTimeoutFn = B.setTimeout.bind(B), i.clearTimeoutFn = B.clearTimeout.bind(B));
}
const es = 1.33;
function ss(i) {
  return typeof i == "string" ? is(i) : Math.ceil((i.byteLength || i.size) * es);
}
function is(i) {
  let t = 0, e = 0;
  for (let s = 0, n = i.length; s < n; s++)
    t = i.charCodeAt(s), t < 128 ? e += 1 : t < 2048 ? e += 2 : t < 55296 || t >= 57344 ? e += 3 : (s++, e += 4);
  return e;
}
function pe() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function ns(i) {
  let t = "";
  for (let e in i)
    i.hasOwnProperty(e) && (t.length && (t += "&"), t += encodeURIComponent(e) + "=" + encodeURIComponent(i[e]));
  return t;
}
function rs(i) {
  let t = {}, e = i.split("&");
  for (let s = 0, n = e.length; s < n; s++) {
    let r = e[s].split("=");
    t[decodeURIComponent(r[0])] = decodeURIComponent(r[1]);
  }
  return t;
}
class os extends Error {
  constructor(t, e, s) {
    super(t), this.description = e, this.context = s, this.type = "TransportError";
  }
}
class Ut extends _ {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(t) {
    super(), this.writable = !1, wt(this, t), this.opts = t, this.query = t.query, this.socket = t.socket, this.supportsBinary = !t.forceBase64;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(t, e, s) {
    return super.emitReserved("error", new os(t, e, s)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(t) {
    this.readyState === "open" && this.write(t);
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(t) {
    const e = Ft(t, this.socket.binaryType);
    this.onPacket(e);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(t) {
    super.emitReserved("packet", t);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(t) {
    this.readyState = "closed", super.emitReserved("close", t);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(t) {
  }
  createUri(t, e = {}) {
    return t + "://" + this._hostname() + this._port() + this.opts.path + this._query(e);
  }
  _hostname() {
    const t = this.opts.hostname;
    return t.indexOf(":") === -1 ? t : "[" + t + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(t) {
    const e = ns(t);
    return e.length ? "?" + e : "";
  }
}
class as extends Ut {
  constructor() {
    super(...arguments), this._polling = !1;
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this._poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(t) {
    this.readyState = "pausing";
    const e = () => {
      this.readyState = "paused", t();
    };
    if (this._polling || !this.writable) {
      let s = 0;
      this._polling && (s++, this.once("pollComplete", function() {
        --s || e();
      })), this.writable || (s++, this.once("drain", function() {
        --s || e();
      }));
    } else
      e();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  _poll() {
    this._polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(t) {
    const e = (s) => {
      if (this.readyState === "opening" && s.type === "open" && this.onOpen(), s.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(s);
    };
    Ke(t, this.socket.binaryType).forEach(e), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const t = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? t() : this.once("open", t);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(t) {
    this.writable = !1, He(t, (e) => {
      this.doWrite(e, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const t = this.opts.secure ? "https" : "http", e = this.query || {};
    return this.opts.timestampRequests !== !1 && (e[this.opts.timestampParam] = pe()), !this.supportsBinary && !e.sid && (e.b64 = 1), this.createUri(t, e);
  }
}
let me = !1;
try {
  me = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const hs = me;
function ls() {
}
class cs extends as {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(t) {
    if (super(t), typeof location < "u") {
      const e = location.protocol === "https:";
      let s = location.port;
      s || (s = e ? "443" : "80"), this.xd = typeof location < "u" && t.hostname !== location.hostname || s !== t.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(t, e) {
    const s = this.request({
      method: "POST",
      data: t
    });
    s.on("success", e), s.on("error", (n, r) => {
      this.onError("xhr post error", n, r);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const t = this.request();
    t.on("data", this.onData.bind(this)), t.on("error", (e, s) => {
      this.onError("xhr poll error", e, s);
    }), this.pollXhr = t;
  }
}
class I extends _ {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(t, e, s) {
    super(), this.createRequest = t, wt(this, s), this._opts = s, this._method = s.method || "GET", this._uri = e, this._data = s.data !== void 0 ? s.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var t;
    const e = fe(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    e.xdomain = !!this._opts.xd;
    const s = this._xhr = this.createRequest(e);
    try {
      s.open(this._method, this._uri, !0);
      try {
        if (this._opts.extraHeaders) {
          s.setDisableHeaderCheck && s.setDisableHeaderCheck(!0);
          for (let n in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(n) && s.setRequestHeader(n, this._opts.extraHeaders[n]);
        }
      } catch {
      }
      if (this._method === "POST")
        try {
          s.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        s.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (t = this._opts.cookieJar) === null || t === void 0 || t.addCookies(s), "withCredentials" in s && (s.withCredentials = this._opts.withCredentials), this._opts.requestTimeout && (s.timeout = this._opts.requestTimeout), s.onreadystatechange = () => {
        var n;
        s.readyState === 3 && ((n = this._opts.cookieJar) === null || n === void 0 || n.parseCookies(
          // @ts-ignore
          s.getResponseHeader("set-cookie")
        )), s.readyState === 4 && (s.status === 200 || s.status === 1223 ? this._onLoad() : this.setTimeoutFn(() => {
          this._onError(typeof s.status == "number" ? s.status : 0);
        }, 0));
      }, s.send(this._data);
    } catch (n) {
      this.setTimeoutFn(() => {
        this._onError(n);
      }, 0);
      return;
    }
    typeof document < "u" && (this._index = I.requestsCount++, I.requests[this._index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(t) {
    this.emitReserved("error", t, this._xhr), this._cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(t) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (this._xhr.onreadystatechange = ls, t)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete I.requests[this._index], this._xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const t = this._xhr.responseText;
    t !== null && (this.emitReserved("data", t), this.emitReserved("success"), this._cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this._cleanup();
  }
}
I.requestsCount = 0;
I.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", ee);
  else if (typeof addEventListener == "function") {
    const i = "onpagehide" in B ? "pagehide" : "unload";
    addEventListener(i, ee, !1);
  }
}
function ee() {
  for (let i in I.requests)
    I.requests.hasOwnProperty(i) && I.requests[i].abort();
}
const us = function() {
  const i = ge({
    xdomain: !1
  });
  return i && i.responseType !== null;
}();
class ds extends cs {
  constructor(t) {
    super(t);
    const e = t && t.forceBase64;
    this.supportsBinary = us && !e;
  }
  request(t = {}) {
    return Object.assign(t, { xd: this.xd }, this.opts), new I(ge, this.uri(), t);
  }
}
function ge(i) {
  const t = i.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!t || hs))
      return new XMLHttpRequest();
  } catch {
  }
  if (!t)
    try {
      return new B[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const ye = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class fs extends Ut {
  get name() {
    return "websocket";
  }
  doOpen() {
    const t = this.uri(), e = this.opts.protocols, s = ye ? {} : fe(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (s.headers = this.opts.extraHeaders);
    try {
      this.ws = this.createSocket(t, e, s);
    } catch (n) {
      return this.emitReserved("error", n);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (t) => this.onClose({
      description: "websocket connection closed",
      context: t
    }), this.ws.onmessage = (t) => this.onData(t.data), this.ws.onerror = (t) => this.onError("websocket error", t);
  }
  write(t) {
    this.writable = !1;
    for (let e = 0; e < t.length; e++) {
      const s = t[e], n = e === t.length - 1;
      Gt(s, this.supportsBinary, (r) => {
        try {
          this.doWrite(s, r);
        } catch {
        }
        n && yt(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.onerror = () => {
    }, this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const t = this.opts.secure ? "wss" : "ws", e = this.query || {};
    return this.opts.timestampRequests && (e[this.opts.timestampParam] = pe()), this.supportsBinary || (e.b64 = 1), this.createUri(t, e);
  }
}
const xt = B.WebSocket || B.MozWebSocket;
class ps extends fs {
  createSocket(t, e, s) {
    return ye ? new xt(t, e, s) : e ? new xt(t, e) : new xt(t);
  }
  doWrite(t, e) {
    this.ws.send(e);
  }
}
class ms extends Ut {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (t) {
      return this.emitReserved("error", t);
    }
    this._transport.closed.then(() => {
      this.onClose();
    }).catch((t) => {
      this.onError("webtransport error", t);
    }), this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((t) => {
        const e = Xe(Number.MAX_SAFE_INTEGER, this.socket.binaryType), s = t.readable.pipeThrough(e).getReader(), n = Ye();
        n.readable.pipeTo(t.writable), this._writer = n.writable.getWriter();
        const r = () => {
          s.read().then(({ done: a, value: h }) => {
            a || (this.onPacket(h), r());
          }).catch((a) => {
          });
        };
        r();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this._writer.write(o).then(() => this.onOpen());
      });
    });
  }
  write(t) {
    this.writable = !1;
    for (let e = 0; e < t.length; e++) {
      const s = t[e], n = e === t.length - 1;
      this._writer.write(s).then(() => {
        n && yt(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var t;
    (t = this._transport) === null || t === void 0 || t.close();
  }
}
const gs = {
  websocket: ps,
  webtransport: ms,
  polling: ds
}, ys = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, ws = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function Rt(i) {
  if (i.length > 8e3)
    throw "URI too long";
  const t = i, e = i.indexOf("["), s = i.indexOf("]");
  e != -1 && s != -1 && (i = i.substring(0, e) + i.substring(e, s).replace(/:/g, ";") + i.substring(s, i.length));
  let n = ys.exec(i || ""), r = {}, o = 14;
  for (; o--; )
    r[ws[o]] = n[o] || "";
  return e != -1 && s != -1 && (r.source = t, r.host = r.host.substring(1, r.host.length - 1).replace(/;/g, ":"), r.authority = r.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), r.ipv6uri = !0), r.pathNames = bs(r, r.path), r.queryKey = vs(r, r.query), r;
}
function bs(i, t) {
  const e = /\/{2,9}/g, s = t.replace(e, "/").split("/");
  return (t.slice(0, 1) == "/" || t.length === 0) && s.splice(0, 1), t.slice(-1) == "/" && s.splice(s.length - 1, 1), s;
}
function vs(i, t) {
  const e = {};
  return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(s, n, r) {
    n && (e[n] = r);
  }), e;
}
const Ot = typeof addEventListener == "function" && typeof removeEventListener == "function", at = [];
Ot && addEventListener("offline", () => {
  at.forEach((i) => i());
}, !1);
class $ extends _ {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(t, e) {
    if (super(), this.binaryType = Je, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, t && typeof t == "object" && (e = t, t = null), t) {
      const s = Rt(t);
      e.hostname = s.host, e.secure = s.protocol === "https" || s.protocol === "wss", e.port = s.port, s.query && (e.query = s.query);
    } else e.host && (e.hostname = Rt(e.host).host);
    wt(this, e), this.secure = e.secure != null ? e.secure : typeof location < "u" && location.protocol === "https:", e.hostname && !e.port && (e.port = this.secure ? "443" : "80"), this.hostname = e.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = e.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, e.transports.forEach((s) => {
      const n = s.prototype.name;
      this.transports.push(n), this._transportsByName[n] = s;
    }), this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, e), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = rs(this.opts.query)), Ot && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, at.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(t) {
    const e = Object.assign({}, this.opts.query);
    e.EIO = de, e.transport = t, this.id && (e.sid = this.id);
    const s = Object.assign({}, this.opts, {
      query: e,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[t]);
    return new this._transportsByName[t](s);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const t = this.opts.rememberUpgrade && $.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const e = this.createTransport(t);
    e.open(), this.setTransport(e);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(t) {
    this.transport && this.transport.removeAllListeners(), this.transport = t, t.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (e) => this._onClose("transport close", e));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    this.readyState = "open", $.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(t) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", t), this.emitReserved("heartbeat"), t.type) {
        case "open":
          this.onHandshake(JSON.parse(t.data));
          break;
        case "ping":
          this._sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong"), this._resetPingTimeout();
          break;
        case "error":
          const e = new Error("server error");
          e.code = t.data, this._onError(e);
          break;
        case "message":
          this.emitReserved("data", t.data), this.emitReserved("message", t.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(t) {
    this.emitReserved("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this._pingInterval = t.pingInterval, this._pingTimeout = t.pingTimeout, this._maxPayload = t.maxPayload, this.onOpen(), this.readyState !== "closed" && this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const t = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + t, this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, t), this.opts.autoUnref && this._pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen), this._prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const t = this._getWritablePackets();
      this.transport.send(t), this._prevBufferLen = t.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  _getWritablePackets() {
    if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let e = 1;
    for (let s = 0; s < this.writeBuffer.length; s++) {
      const n = this.writeBuffer[s].data;
      if (n && (e += ss(n)), s > 0 && e > this._maxPayload)
        return this.writeBuffer.slice(0, s);
      e += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
   *
   * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
   * `write()` method then the message would not be buffered by the Socket.IO client.
   *
   * @return {boolean}
   * @private
   */
  /* private */
  _hasPingExpired() {
    if (!this._pingTimeoutTime)
      return !0;
    const t = Date.now() > this._pingTimeoutTime;
    return t && (this._pingTimeoutTime = 0, yt(() => {
      this._onClose("ping timeout");
    }, this.setTimeoutFn)), t;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(t, e, s) {
    return this._sendPacket("message", t, e, s), this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(t, e, s) {
    return this._sendPacket("message", t, e, s), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  _sendPacket(t, e, s, n) {
    if (typeof e == "function" && (n = e, e = void 0), typeof s == "function" && (n = s, s = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    s = s || {}, s.compress = s.compress !== !1;
    const r = {
      type: t,
      data: e,
      options: s
    };
    this.emitReserved("packetCreate", r), this.writeBuffer.push(r), n && this.once("flush", n), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const t = () => {
      this._onClose("forced close"), this.transport.close();
    }, e = () => {
      this.off("upgrade", e), this.off("upgradeError", e), t();
    }, s = () => {
      this.once("upgrade", e), this.once("upgradeError", e);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? s() : t();
    }) : this.upgrading ? s() : t()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(t) {
    if ($.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
      return this.transports.shift(), this._open();
    this.emitReserved("error", t), this._onClose("transport error", t);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(t, e) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), Ot && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const s = at.indexOf(this._offlineEventListener);
        s !== -1 && at.splice(s, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", t, e), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
$.protocol = de;
class _s extends $ {
  constructor() {
    super(...arguments), this._upgrades = [];
  }
  onOpen() {
    if (super.onOpen(), this.readyState === "open" && this.opts.upgrade)
      for (let t = 0; t < this._upgrades.length; t++)
        this._probe(this._upgrades[t]);
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(t) {
    let e = this.createTransport(t), s = !1;
    $.priorWebsocketSuccess = !1;
    const n = () => {
      s || (e.send([{ type: "ping", data: "probe" }]), e.once("packet", (u) => {
        if (!s)
          if (u.type === "pong" && u.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", e), !e)
              return;
            $.priorWebsocketSuccess = e.name === "websocket", this.transport.pause(() => {
              s || this.readyState !== "closed" && (c(), this.setTransport(e), e.send([{ type: "upgrade" }]), this.emitReserved("upgrade", e), e = null, this.upgrading = !1, this.flush());
            });
          } else {
            const d = new Error("probe error");
            d.transport = e.name, this.emitReserved("upgradeError", d);
          }
      }));
    };
    function r() {
      s || (s = !0, c(), e.close(), e = null);
    }
    const o = (u) => {
      const d = new Error("probe error: " + u);
      d.transport = e.name, r(), this.emitReserved("upgradeError", d);
    };
    function a() {
      o("transport closed");
    }
    function h() {
      o("socket closed");
    }
    function l(u) {
      e && u.name !== e.name && r();
    }
    const c = () => {
      e.removeListener("open", n), e.removeListener("error", o), e.removeListener("close", a), this.off("close", h), this.off("upgrading", l);
    };
    e.once("open", n), e.once("error", o), e.once("close", a), this.once("close", h), this.once("upgrading", l), this._upgrades.indexOf("webtransport") !== -1 && t !== "webtransport" ? this.setTimeoutFn(() => {
      s || e.open();
    }, 200) : e.open();
  }
  onHandshake(t) {
    this._upgrades = this._filterUpgrades(t.upgrades), super.onHandshake(t);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(t) {
    const e = [];
    for (let s = 0; s < t.length; s++)
      ~this.transports.indexOf(t[s]) && e.push(t[s]);
    return e;
  }
}
let Cs = class extends _s {
  constructor(t, e = {}) {
    const s = typeof t == "object" ? t : e;
    (!s.transports || s.transports && typeof s.transports[0] == "string") && (s.transports = (s.transports || ["polling", "websocket", "webtransport"]).map((n) => gs[n]).filter((n) => !!n)), super(t, s);
  }
};
function Ps(i, t = "", e) {
  let s = i;
  e = e || typeof location < "u" && location, i == null && (i = e.protocol + "//" + e.host), typeof i == "string" && (i.charAt(0) === "/" && (i.charAt(1) === "/" ? i = e.protocol + i : i = e.host + i), /^(https?|wss?):\/\//.test(i) || (typeof e < "u" ? i = e.protocol + "//" + i : i = "https://" + i), s = Rt(i)), s.port || (/^(http|ws)$/.test(s.protocol) ? s.port = "80" : /^(http|ws)s$/.test(s.protocol) && (s.port = "443")), s.path = s.path || "/";
  const r = s.host.indexOf(":") !== -1 ? "[" + s.host + "]" : s.host;
  return s.id = s.protocol + "://" + r + ":" + s.port + t, s.href = s.protocol + "://" + r + (e && e.port === s.port ? "" : ":" + s.port), s;
}
const Es = typeof ArrayBuffer == "function", xs = (i) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(i) : i.buffer instanceof ArrayBuffer, we = Object.prototype.toString, Ts = typeof Blob == "function" || typeof Blob < "u" && we.call(Blob) === "[object BlobConstructor]", ks = typeof File == "function" || typeof File < "u" && we.call(File) === "[object FileConstructor]";
function $t(i) {
  return Es && (i instanceof ArrayBuffer || xs(i)) || Ts && i instanceof Blob || ks && i instanceof File;
}
function ht(i, t) {
  if (!i || typeof i != "object")
    return !1;
  if (Array.isArray(i)) {
    for (let e = 0, s = i.length; e < s; e++)
      if (ht(i[e]))
        return !0;
    return !1;
  }
  if ($t(i))
    return !0;
  if (i.toJSON && typeof i.toJSON == "function" && arguments.length === 1)
    return ht(i.toJSON(), !0);
  for (const e in i)
    if (Object.prototype.hasOwnProperty.call(i, e) && ht(i[e]))
      return !0;
  return !1;
}
function Ss(i) {
  const t = [], e = i.data, s = i;
  return s.data = Mt(e, t), s.attachments = t.length, { packet: s, buffers: t };
}
function Mt(i, t) {
  if (!i)
    return i;
  if ($t(i)) {
    const e = { _placeholder: !0, num: t.length };
    return t.push(i), e;
  } else if (Array.isArray(i)) {
    const e = new Array(i.length);
    for (let s = 0; s < i.length; s++)
      e[s] = Mt(i[s], t);
    return e;
  } else if (typeof i == "object" && !(i instanceof Date)) {
    const e = {};
    for (const s in i)
      Object.prototype.hasOwnProperty.call(i, s) && (e[s] = Mt(i[s], t));
    return e;
  }
  return i;
}
function As(i, t) {
  return i.data = It(i.data, t), delete i.attachments, i;
}
function It(i, t) {
  if (!i)
    return i;
  if (i && i._placeholder === !0) {
    if (typeof i.num == "number" && i.num >= 0 && i.num < t.length)
      return t[i.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(i))
    for (let e = 0; e < i.length; e++)
      i[e] = It(i[e], t);
  else if (typeof i == "object")
    for (const e in i)
      Object.prototype.hasOwnProperty.call(i, e) && (i[e] = It(i[e], t));
  return i;
}
const Bs = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], Rs = 5;
var m;
(function(i) {
  i[i.CONNECT = 0] = "CONNECT", i[i.DISCONNECT = 1] = "DISCONNECT", i[i.EVENT = 2] = "EVENT", i[i.ACK = 3] = "ACK", i[i.CONNECT_ERROR = 4] = "CONNECT_ERROR", i[i.BINARY_EVENT = 5] = "BINARY_EVENT", i[i.BINARY_ACK = 6] = "BINARY_ACK";
})(m || (m = {}));
class Os {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(t) {
    this.replacer = t;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(t) {
    return (t.type === m.EVENT || t.type === m.ACK) && ht(t) ? this.encodeAsBinary({
      type: t.type === m.EVENT ? m.BINARY_EVENT : m.BINARY_ACK,
      nsp: t.nsp,
      data: t.data,
      id: t.id
    }) : [this.encodeAsString(t)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(t) {
    let e = "" + t.type;
    return (t.type === m.BINARY_EVENT || t.type === m.BINARY_ACK) && (e += t.attachments + "-"), t.nsp && t.nsp !== "/" && (e += t.nsp + ","), t.id != null && (e += t.id), t.data != null && (e += JSON.stringify(t.data, this.replacer)), e;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(t) {
    const e = Ss(t), s = this.encodeAsString(e.packet), n = e.buffers;
    return n.unshift(s), n;
  }
}
function se(i) {
  return Object.prototype.toString.call(i) === "[object Object]";
}
class qt extends _ {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(t) {
    super(), this.reviver = t;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(t) {
    let e;
    if (typeof t == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      e = this.decodeString(t);
      const s = e.type === m.BINARY_EVENT;
      s || e.type === m.BINARY_ACK ? (e.type = s ? m.EVENT : m.ACK, this.reconstructor = new Ms(e), e.attachments === 0 && super.emitReserved("decoded", e)) : super.emitReserved("decoded", e);
    } else if ($t(t) || t.base64)
      if (this.reconstructor)
        e = this.reconstructor.takeBinaryData(t), e && (this.reconstructor = null, super.emitReserved("decoded", e));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + t);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(t) {
    let e = 0;
    const s = {
      type: Number(t.charAt(0))
    };
    if (m[s.type] === void 0)
      throw new Error("unknown packet type " + s.type);
    if (s.type === m.BINARY_EVENT || s.type === m.BINARY_ACK) {
      const r = e + 1;
      for (; t.charAt(++e) !== "-" && e != t.length; )
        ;
      const o = t.substring(r, e);
      if (o != Number(o) || t.charAt(e) !== "-")
        throw new Error("Illegal attachments");
      s.attachments = Number(o);
    }
    if (t.charAt(e + 1) === "/") {
      const r = e + 1;
      for (; ++e && !(t.charAt(e) === "," || e === t.length); )
        ;
      s.nsp = t.substring(r, e);
    } else
      s.nsp = "/";
    const n = t.charAt(e + 1);
    if (n !== "" && Number(n) == n) {
      const r = e + 1;
      for (; ++e; ) {
        const o = t.charAt(e);
        if (o == null || Number(o) != o) {
          --e;
          break;
        }
        if (e === t.length)
          break;
      }
      s.id = Number(t.substring(r, e + 1));
    }
    if (t.charAt(++e)) {
      const r = this.tryParse(t.substr(e));
      if (qt.isPayloadValid(s.type, r))
        s.data = r;
      else
        throw new Error("invalid payload");
    }
    return s;
  }
  tryParse(t) {
    try {
      return JSON.parse(t, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(t, e) {
    switch (t) {
      case m.CONNECT:
        return se(e);
      case m.DISCONNECT:
        return e === void 0;
      case m.CONNECT_ERROR:
        return typeof e == "string" || se(e);
      case m.EVENT:
      case m.BINARY_EVENT:
        return Array.isArray(e) && (typeof e[0] == "number" || typeof e[0] == "string" && Bs.indexOf(e[0]) === -1);
      case m.ACK:
      case m.BINARY_ACK:
        return Array.isArray(e);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class Ms {
  constructor(t) {
    this.packet = t, this.buffers = [], this.reconPack = t;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(t) {
    if (this.buffers.push(t), this.buffers.length === this.reconPack.attachments) {
      const e = As(this.reconPack, this.buffers);
      return this.finishedReconstruction(), e;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const Is = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: qt,
  Encoder: Os,
  get PacketType() {
    return m;
  },
  protocol: Rs
}, Symbol.toStringTag, { value: "Module" }));
function O(i, t, e) {
  return i.on(t, e), function() {
    i.off(t, e);
  };
}
const Ns = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class be extends _ {
  /**
   * `Socket` constructor.
   */
  constructor(t, e, s) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = t, this.nsp = e, s && s.auth && (this.auth = s.auth), this._opts = Object.assign({}, s), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const t = this.io;
    this.subs = [
      O(t, "open", this.onopen.bind(this)),
      O(t, "packet", this.onpacket.bind(this)),
      O(t, "error", this.onerror.bind(this)),
      O(t, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...t) {
    return t.unshift("message"), this.emit.apply(this, t), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(t, ...e) {
    var s, n, r;
    if (Ns.hasOwnProperty(t))
      throw new Error('"' + t.toString() + '" is a reserved event name');
    if (e.unshift(t), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(e), this;
    const o = {
      type: m.EVENT,
      data: e
    };
    if (o.options = {}, o.options.compress = this.flags.compress !== !1, typeof e[e.length - 1] == "function") {
      const c = this.ids++, u = e.pop();
      this._registerAckCallback(c, u), o.id = c;
    }
    const a = (n = (s = this.io.engine) === null || s === void 0 ? void 0 : s.transport) === null || n === void 0 ? void 0 : n.writable, h = this.connected && !(!((r = this.io.engine) === null || r === void 0) && r._hasPingExpired());
    return this.flags.volatile && !a || (h ? (this.notifyOutgoingListeners(o), this.packet(o)) : this.sendBuffer.push(o)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(t, e) {
    var s;
    const n = (s = this.flags.timeout) !== null && s !== void 0 ? s : this._opts.ackTimeout;
    if (n === void 0) {
      this.acks[t] = e;
      return;
    }
    const r = this.io.setTimeoutFn(() => {
      delete this.acks[t];
      for (let a = 0; a < this.sendBuffer.length; a++)
        this.sendBuffer[a].id === t && this.sendBuffer.splice(a, 1);
      e.call(this, new Error("operation has timed out"));
    }, n), o = (...a) => {
      this.io.clearTimeoutFn(r), e.apply(this, a);
    };
    o.withError = !0, this.acks[t] = o;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(t, ...e) {
    return new Promise((s, n) => {
      const r = (o, a) => o ? n(o) : s(a);
      r.withError = !0, e.push(r), this.emit(t, ...e);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(t) {
    let e;
    typeof t[t.length - 1] == "function" && (e = t.pop());
    const s = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: t,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    t.push((n, ...r) => s !== this._queue[0] ? void 0 : (n !== null ? s.tryCount > this._opts.retries && (this._queue.shift(), e && e(n)) : (this._queue.shift(), e && e(null, ...r)), s.pending = !1, this._drainQueue())), this._queue.push(s), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(t = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const e = this._queue[0];
    e.pending && !t || (e.pending = !0, e.tryCount++, this.flags = e.flags, this.emit.apply(this, e.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(t) {
    t.nsp = this.nsp, this.io._packet(t);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((t) => {
      this._sendConnectPacket(t);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(t) {
    this.packet({
      type: m.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, t) : t
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(t) {
    this.connected || this.emitReserved("connect_error", t);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(t, e) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", t, e), this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((t) => {
      if (!this.sendBuffer.some((s) => String(s.id) === t)) {
        const s = this.acks[t];
        delete this.acks[t], s.withError && s.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(t) {
    if (t.nsp === this.nsp)
      switch (t.type) {
        case m.CONNECT:
          t.data && t.data.sid ? this.onconnect(t.data.sid, t.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case m.EVENT:
        case m.BINARY_EVENT:
          this.onevent(t);
          break;
        case m.ACK:
        case m.BINARY_ACK:
          this.onack(t);
          break;
        case m.DISCONNECT:
          this.ondisconnect();
          break;
        case m.CONNECT_ERROR:
          this.destroy();
          const s = new Error(t.data.message);
          s.data = t.data.data, this.emitReserved("connect_error", s);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(t) {
    const e = t.data || [];
    t.id != null && e.push(this.ack(t.id)), this.connected ? this.emitEvent(e) : this.receiveBuffer.push(Object.freeze(e));
  }
  emitEvent(t) {
    if (this._anyListeners && this._anyListeners.length) {
      const e = this._anyListeners.slice();
      for (const s of e)
        s.apply(this, t);
    }
    super.emit.apply(this, t), this._pid && t.length && typeof t[t.length - 1] == "string" && (this._lastOffset = t[t.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(t) {
    const e = this;
    let s = !1;
    return function(...n) {
      s || (s = !0, e.packet({
        type: m.ACK,
        id: t,
        data: n
      }));
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(t) {
    const e = this.acks[t.id];
    typeof e == "function" && (delete this.acks[t.id], e.withError && t.data.unshift(null), e.apply(this, t.data));
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(t, e) {
    this.id = t, this.recovered = e && this._pid === e, this._pid = e, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((t) => this.emitEvent(t)), this.receiveBuffer = [], this.sendBuffer.forEach((t) => {
      this.notifyOutgoingListeners(t), this.packet(t);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((t) => t()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && this.packet({ type: m.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(t) {
    return this.flags.compress = t, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(t) {
    return this.flags.timeout = t, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(t) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(t), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(t) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(t), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(t) {
    if (!this._anyListeners)
      return this;
    if (t) {
      const e = this._anyListeners;
      for (let s = 0; s < e.length; s++)
        if (t === e[s])
          return e.splice(s, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(t) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(t), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(t) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(t), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(t) {
    if (!this._anyOutgoingListeners)
      return this;
    if (t) {
      const e = this._anyOutgoingListeners;
      for (let s = 0; s < e.length; s++)
        if (t === e[s])
          return e.splice(s, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(t) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const e = this._anyOutgoingListeners.slice();
      for (const s of e)
        s.apply(this, t.data);
    }
  }
}
function X(i) {
  i = i || {}, this.ms = i.min || 100, this.max = i.max || 1e4, this.factor = i.factor || 2, this.jitter = i.jitter > 0 && i.jitter <= 1 ? i.jitter : 0, this.attempts = 0;
}
X.prototype.duration = function() {
  var i = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var t = Math.random(), e = Math.floor(t * this.jitter * i);
    i = (Math.floor(t * 10) & 1) == 0 ? i - e : i + e;
  }
  return Math.min(i, this.max) | 0;
};
X.prototype.reset = function() {
  this.attempts = 0;
};
X.prototype.setMin = function(i) {
  this.ms = i;
};
X.prototype.setMax = function(i) {
  this.max = i;
};
X.prototype.setJitter = function(i) {
  this.jitter = i;
};
class Nt extends _ {
  constructor(t, e) {
    var s;
    super(), this.nsps = {}, this.subs = [], t && typeof t == "object" && (e = t, t = void 0), e = e || {}, e.path = e.path || "/socket.io", this.opts = e, wt(this, e), this.reconnection(e.reconnection !== !1), this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), this.reconnectionDelay(e.reconnectionDelay || 1e3), this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), this.randomizationFactor((s = e.randomizationFactor) !== null && s !== void 0 ? s : 0.5), this.backoff = new X({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(e.timeout == null ? 2e4 : e.timeout), this._readyState = "closed", this.uri = t;
    const n = e.parser || Is;
    this.encoder = new n.Encoder(), this.decoder = new n.Decoder(), this._autoConnect = e.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(t) {
    return arguments.length ? (this._reconnection = !!t, t || (this.skipReconnect = !0), this) : this._reconnection;
  }
  reconnectionAttempts(t) {
    return t === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = t, this);
  }
  reconnectionDelay(t) {
    var e;
    return t === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = t, (e = this.backoff) === null || e === void 0 || e.setMin(t), this);
  }
  randomizationFactor(t) {
    var e;
    return t === void 0 ? this._randomizationFactor : (this._randomizationFactor = t, (e = this.backoff) === null || e === void 0 || e.setJitter(t), this);
  }
  reconnectionDelayMax(t) {
    var e;
    return t === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = t, (e = this.backoff) === null || e === void 0 || e.setMax(t), this);
  }
  timeout(t) {
    return arguments.length ? (this._timeout = t, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(t) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new Cs(this.uri, this.opts);
    const e = this.engine, s = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const n = O(e, "open", function() {
      s.onopen(), t && t();
    }), r = (a) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", a), t ? t(a) : this.maybeReconnectOnOpen();
    }, o = O(e, "error", r);
    if (this._timeout !== !1) {
      const a = this._timeout, h = this.setTimeoutFn(() => {
        n(), r(new Error("timeout")), e.close();
      }, a);
      this.opts.autoUnref && h.unref(), this.subs.push(() => {
        this.clearTimeoutFn(h);
      });
    }
    return this.subs.push(n), this.subs.push(o), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(t) {
    return this.open(t);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const t = this.engine;
    this.subs.push(
      O(t, "ping", this.onping.bind(this)),
      O(t, "data", this.ondata.bind(this)),
      O(t, "error", this.onerror.bind(this)),
      O(t, "close", this.onclose.bind(this)),
      // @ts-ignore
      O(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(t) {
    try {
      this.decoder.add(t);
    } catch (e) {
      this.onclose("parse error", e);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(t) {
    yt(() => {
      this.emitReserved("packet", t);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(t) {
    this.emitReserved("error", t);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(t, e) {
    let s = this.nsps[t];
    return s ? this._autoConnect && !s.active && s.connect() : (s = new be(this, t, e), this.nsps[t] = s), s;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(t) {
    const e = Object.keys(this.nsps);
    for (const s of e)
      if (this.nsps[s].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(t) {
    const e = this.encoder.encode(t);
    for (let s = 0; s < e.length; s++)
      this.engine.write(e[s], t.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((t) => t()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close");
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called when:
   *
   * - the low-level engine is closed
   * - the parser encountered a badly formatted packet
   * - all sockets are disconnected
   *
   * @private
   */
  onclose(t, e) {
    var s;
    this.cleanup(), (s = this.engine) === null || s === void 0 || s.close(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", t, e), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const t = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const e = this.backoff.duration();
      this._reconnecting = !0;
      const s = this.setTimeoutFn(() => {
        t.skipReconnect || (this.emitReserved("reconnect_attempt", t.backoff.attempts), !t.skipReconnect && t.open((n) => {
          n ? (t._reconnecting = !1, t.reconnect(), this.emitReserved("reconnect_error", n)) : t.onreconnect();
        }));
      }, e);
      this.opts.autoUnref && s.unref(), this.subs.push(() => {
        this.clearTimeoutFn(s);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const t = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", t);
  }
}
const Z = {};
function lt(i, t) {
  typeof i == "object" && (t = i, i = void 0), t = t || {};
  const e = Ps(i, t.path || "/socket.io"), s = e.source, n = e.id, r = e.path, o = Z[n] && r in Z[n].nsps, a = t.forceNew || t["force new connection"] || t.multiplex === !1 || o;
  let h;
  return a ? h = new Nt(s, t) : (Z[n] || (Z[n] = new Nt(s, t)), h = Z[n]), e.query && !t.query && (t.query = e.queryKey), h.socket(e.path, t);
}
Object.assign(lt, {
  Manager: Nt,
  Socket: be,
  io: lt,
  connect: lt
});
var Ws = Object.defineProperty, Ds = Object.getOwnPropertyDescriptor, M = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Ds(t, e) : t, r = i.length - 1, o; r >= 0; r--)
    (o = i[r]) && (n = (s ? o(t, e, n) : o(n)) || n);
  return s && n && Ws(t, e, n), n;
};
let k = class extends E {
  order = x.None;
  name = "CliPlugin";
  globalCommands = /* @__PURE__ */ new Map();
  echo(i) {
    return new g(!0, i, i);
  }
  loop(i, t) {
    let e = [], s = "";
    for (let n = 0; n < i; n++) {
      const r = this.parseAndExecuteCommands(t);
      if (!r.status)
        return new g(!1, `Error executing command: ${r.message}`, void 0);
      e.push(r.data), s += `${r.message}
`;
    }
    return new g(!0, s, e);
  }
  true() {
    const i = "This is a true command";
    return new g(!0, i, !0);
  }
  false() {
    const i = "This is a false command";
    return new g(!0, i, !1);
  }
  int(i) {
    const t = `This is an int command with value ${i}`;
    return new g(!0, t, parseInt(i));
  }
  float(i) {
    const t = `This is a float command with value ${i}`;
    return new g(!0, t, parseFloat(i));
  }
  refresh() {
    const i = "This is a refresh command";
    return location.reload(), new g(!0, i, void 0);
  }
  getrandomcolor() {
    const i = p.randomColor2();
    return new g(!0, `Random color is ${i}`, i);
  }
  help() {
    let i = super.help(), t = `plugins:
`;
    for (const e of this.gameWorld.getAllPlugins())
      t += `/${e.cliGetName()}
`;
    return t = i.message + `
` + t, new g(!0, t, void 0);
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
    return console.log(i), new g(!0, i, void 0);
  }
  execute(i) {
    try {
      return this.parseAndExecuteCommands(i);
    } catch {
      return new g(!1, "Command execution failed", void 0);
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
    let s = "", n = !1, r = !1, o = 0;
    i = i.trim();
    for (let h = 0; h < i.length; h++) {
      const l = i[h];
      if (o > 0) {
        if (l === "{") {
          o++, s += l;
          continue;
        }
        if (l === "}") {
          if (o--, o === 0) {
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
        o++;
        continue;
      }
      if (l === " ") {
        s.trim() !== "" && (e.push(s), s = "");
        continue;
      }
      s += l;
    }
    s.trim() !== "" && e.push(s), console.log("---".repeat(t) + "Parsing result: ", e);
    const a = e[0].split(":");
    if (a.length === 2) {
      const h = a[0], l = this.gameWorld.getAllPlugins().find((c) => c.cliGetName() === h);
      return l ? this.executeParsedCommand(l, a[1], ...e.slice(1)) : new g(!1, `Plugin ${h} not found`, void 0);
    } else if (a.length === 1)
      try {
        if (!this.globalCommands.has(a[0]))
          return new g(!1, `Command ${a[0]} not found`, void 0);
        const h = this.globalCommands.get(a[0]);
        if (!h)
          return new g(!1, 'More than one command found, use "/<plugin>:<command>" (fe /cli:help) instead.', void 0);
        const l = this.gameWorld.getPluginByName(h);
        return this.executeParsedCommand(l, a[0], ...e.slice(1));
      } catch {
        return new g(!1, "Command not found or wrong syntax", void 0);
      }
    else
      return new g(!1, "No command found", void 0);
  }
  executeParsedCommand(i, t, ...e) {
    if (i.constructor.commands[t] === void 0)
      return new g(!1, `Command ${t} not found`, void 0);
    try {
      return i.constructor.commands[t].apply(i, e);
    } catch {
    }
    return new g(!1, `Failed to execute command ${t} on ${i.cliGetName()}`, void 0);
  }
};
M([
  b("echo", "<message: string>", "string")
], k.prototype, "echo", 1);
M([
  b("loop", "<iterations: int> <command: string>", "string")
], k.prototype, "loop", 1);
M([
  b("true", void 0, "bool")
], k.prototype, "true", 1);
M([
  b("false", void 0, "bool")
], k.prototype, "false", 1);
M([
  b("int", "<value: string>", "number")
], k.prototype, "int", 1);
M([
  b("float", "<value: string>", "number")
], k.prototype, "float", 1);
M([
  b("refresh")
], k.prototype, "refresh", 1);
M([
  b("randomcolor", void 0, "rgb")
], k.prototype, "getrandomcolor", 1);
M([
  b("help")
], k.prototype, "help", 1);
M([
  b("art")
], k.prototype, "art", 1);
k = M([
  Wt("cli")
], k);
var Ls = function() {
  function i() {
    this.ansi_colors = [
      // Normal colors
      [
        { rgb: [0, 0, 0], class_name: "ansi-black" },
        { rgb: [187, 0, 0], class_name: "ansi-red" },
        { rgb: [0, 187, 0], class_name: "ansi-green" },
        { rgb: [187, 187, 0], class_name: "ansi-yellow" },
        { rgb: [0, 0, 187], class_name: "ansi-blue" },
        { rgb: [187, 0, 187], class_name: "ansi-magenta" },
        { rgb: [0, 187, 187], class_name: "ansi-cyan" },
        { rgb: [255, 255, 255], class_name: "ansi-white" }
      ],
      // Bright colors
      [
        { rgb: [85, 85, 85], class_name: "ansi-bright-black" },
        { rgb: [255, 85, 85], class_name: "ansi-bright-red" },
        { rgb: [0, 255, 0], class_name: "ansi-bright-green" },
        { rgb: [255, 255, 85], class_name: "ansi-bright-yellow" },
        { rgb: [85, 85, 255], class_name: "ansi-bright-blue" },
        { rgb: [255, 85, 255], class_name: "ansi-bright-magenta" },
        { rgb: [85, 255, 255], class_name: "ansi-bright-cyan" },
        { rgb: [255, 255, 255], class_name: "ansi-bright-white" }
      ]
    ], this.setup_256_palette(), this.useClasses = !1, this.escapeForHtml = !0, this.bright = !1, this.fg = this.bg = null, this._buffer = "";
  }
  return Object.defineProperty(i.prototype, "useClasses", {
    get: function() {
      return this._useClasses;
    },
    set: function(t) {
      this._useClasses = t;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(i.prototype, "escapeForHtml", {
    get: function() {
      return this._escapeForHtml;
    },
    set: function(t) {
      this._escapeForHtml = t;
    },
    enumerable: !0,
    configurable: !0
  }), i.prototype.setup_256_palette = function() {
    var t = this;
    this.palette_256 = [], this.ansi_colors.forEach(function(l) {
      l.forEach(function(c) {
        t.palette_256.push(c);
      });
    });
    for (var e = [0, 95, 135, 175, 215, 255], s = 0; s < 6; ++s)
      for (var n = 0; n < 6; ++n)
        for (var r = 0; r < 6; ++r) {
          var o = { rgb: [e[s], e[n], e[r]], class_name: "truecolor" };
          this.palette_256.push(o);
        }
    for (var a = 8, h = 0; h < 24; ++h, a += 10) {
      var o = { rgb: [a, a, a], class_name: "truecolor" };
      this.palette_256.push(o);
    }
  }, i.prototype.doEscape = function(t) {
    return t.replace(/[&<>]/gm, function(e) {
      if (e === "&")
        return "&amp;";
      if (e === "<")
        return "&lt;";
      if (e === ">")
        return "&gt;";
    });
  }, i.prototype.old_linkify = function(t) {
    return t.replace(/(https?:\/\/[^\s]+)/gm, function(e) {
      return '<a href="' + e + '">' + e + "</a>";
    });
  }, i.prototype.detect_incomplete_ansi = function(t) {
    return !/.*?[\x40-\x7e]/.test(t);
  }, i.prototype.detect_incomplete_link = function(t) {
    for (var e = !1, s = t.length - 1; s > 0; s--)
      if (/\s|\x1B/.test(t[s])) {
        e = !0;
        break;
      }
    if (!e)
      return /(https?:\/\/[^\s]+)/.test(t) ? 0 : -1;
    var n = t.substr(s + 1, 4);
    if (n.length === 0)
      return -1;
    if ("http".indexOf(n) === 0)
      return s + 1;
  }, i.prototype.ansi_to_html = function(t) {
    var e = this, s = this._buffer + t;
    this._buffer = "";
    var n = s.split(/\x1B\[/);
    n.length === 1 && n.push("");
    var r = n[n.length - 1];
    r.length > 0 && this.detect_incomplete_ansi(r) ? (this._buffer = "\x1B[" + r, n.pop(), n.push("")) : (r.slice(-1) === "\x1B" && (this._buffer = "\x1B", console.log("raw", n), n.pop(), n.push(r.substr(0, r.length - 1)), console.log(n), console.log(r)), n.length === 2 && n[1] == "" && n[0].slice(-1) == "\x1B" && (this._buffer = "\x1B", r = n.shift(), n.unshift(r.substr(0, r.length - 1))));
    var o = this.wrap_text(n.shift()), a = n.map(function(h) {
      return e.wrap_text(e.process_ansi(h));
    });
    return o.length > 0 && a.unshift(o), a.join("");
  }, i.prototype.ansi_to_text = function(t) {
    var e = this, s = t.split(/\x1B\[/), n = s.shift(), r = s.map(function(o) {
      return e.process_ansi(o);
    });
    return n.length > 0 && r.unshift(n), r.join("");
  }, i.prototype.wrap_text = function(t) {
    if (t.length === 0 || (this._escapeForHtml && (t = this.doEscape(t)), !this.bright && this.fg === null && this.bg === null))
      return t;
    var e = [], s = [], n = this.fg, r = this.bg;
    n === null && this.bright && (n = this.ansi_colors[1][7]), this._useClasses ? (n && (n.class_name !== "truecolor" ? s.push(n.class_name + "-fg") : e.push("color:rgb(" + n.rgb.join(",") + ")")), r && (r.class_name !== "truecolor" ? s.push(r.class_name + "-bg") : e.push("background-color:rgb(" + r.rgb.join(",") + ")"))) : (n && e.push("color:rgb(" + n.rgb.join(",") + ")"), r && e.push("background-color:rgb(" + r.rgb + ")"));
    var o = "", a = "";
    return s.length && (o = ' class="' + s.join(" ") + '"'), e.length && (a = ' style="' + e.join(";") + '"'), "<span" + o + a + ">" + t + "</span>";
  }, i.prototype.process_ansi = function(t) {
    this._sgr_regex || (this._sgr_regex = (S = [`
              ^                           # beginning of line
              ([!<-?]?)             # a private-mode char (!, <, =, >, ?)
              ([d;]*)                    # any digits or semicolons
              ([ -/]?               # an intermediate modifier
               [@-~])               # the command
              ([sS]*)                   # any text following this CSI sequence
              `], S.raw = [`
              ^                           # beginning of line
              ([!\\x3c-\\x3f]?)             # a private-mode char (!, <, =, >, ?)
              ([\\d;]*)                    # any digits or semicolons
              ([\\x20-\\x2f]?               # an intermediate modifier
               [\\x40-\\x7e])               # the command
              ([\\s\\S]*)                   # any text following this CSI sequence
              `], this.rgx(S)));
    var e = t.match(this._sgr_regex);
    if (!e)
      return t;
    var s = e[4];
    if (e[1] !== "" || e[3] !== "m")
      return s;
    for (var n = e[2].split(";"); n.length > 0; ) {
      var r = n.shift(), o = parseInt(r, 10);
      if (isNaN(o) || o === 0)
        this.fg = this.bg = null, this.bright = !1;
      else if (o === 1)
        this.bright = !0;
      else if (o === 22)
        this.bright = !1;
      else if (o === 39)
        this.fg = null;
      else if (o === 49)
        this.bg = null;
      else if (o >= 30 && o < 38) {
        var a = this.bright ? 1 : 0;
        this.fg = this.ansi_colors[a][o - 30];
      } else if (o >= 90 && o < 98)
        this.fg = this.ansi_colors[1][o - 90];
      else if (o >= 40 && o < 48)
        this.bg = this.ansi_colors[0][o - 40];
      else if (o >= 100 && o < 108)
        this.bg = this.ansi_colors[1][o - 100];
      else if ((o === 38 || o === 48) && n.length > 0) {
        var h = o === 38, l = n.shift();
        if (l === "5" && n.length > 0) {
          var c = parseInt(n.shift(), 10);
          c >= 0 && c <= 255 && (h ? this.fg = this.palette_256[c] : this.bg = this.palette_256[c]);
        }
        if (l === "2" && n.length > 2) {
          var u = parseInt(n.shift(), 10), d = parseInt(n.shift(), 10), w = parseInt(n.shift(), 10);
          if (u >= 0 && u <= 255 && d >= 0 && d <= 255 && w >= 0 && w <= 255) {
            var R = { rgb: [u, d, w], class_name: "truecolor" };
            h ? this.fg = R : this.bg = R;
          }
        }
      }
    }
    return s;
    var S;
  }, i.prototype.rgx = function(t) {
    var e = t.raw[0], s = /^\s+|\s+\n|\s+#[\s\S]+?\n/gm, n = e.replace(s, "");
    return new RegExp(n, "m");
  }, i;
}(), Gs = Object.defineProperty, Fs = Object.getOwnPropertyDescriptor, ve = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Fs(t, e) : t, r = i.length - 1, o; r >= 0; r--)
    (o = i[r]) && (n = (s ? o(t, e, n) : o(n)) || n);
  return s && n && Gs(t, e, n), n;
};
class Us extends Y {
  message;
  constructor(t) {
    super(), this.message = t;
  }
}
let U = class extends E {
  order = x.Render;
  name = "ConsolePlugin";
  messageEnteredEvent = new L();
  isVisible = !0;
  consoleWrapper = document.createElement("div");
  buffer = "";
  history = [""];
  historyIndex = 0;
  constructor() {
    super(), document.body.appendChild(this.consoleWrapper), this.consoleWrapper.innerHTML = this.getInnerHtml();
  }
  start() {
    this.getPlugin(G).KeyDownEvent.subscribe(this, "keydown"), this.getPlugin(G).BlockedKeyDownEvent.subscribe(this, "keydown"), this.messageEnteredEvent.register(this.gameWorld);
  }
  event(i, t) {
    const e = i.key;
    let s;
    try {
      s = this.consoleWrapper.querySelector(".console-input");
    } catch {
    }
    if (s) {
      if (this.isFocused()) {
        if (e == "arrowup" && this.historyIndex < this.history.length - 1 && (this.historyIndex++, s.value = this.history[this.historyIndex]), e == "arrowdown" && this.historyIndex > 0 && (this.historyIndex--, console.log(this.historyIndex), console.log(this.history), s.value = this.history[this.historyIndex]), e == "escape" && (s.blur(), s.value = ""), e == "enter") {
          const n = s.value.trim();
          n !== "" && (s.value = "", console.log("Sending:", n), this.messageEntered(n)), s.blur();
        }
      } else if (e == "enter" && this.isVisible && s.focus(), e == "t")
        try {
          this.isVisible ? (document.body.removeChild(this.consoleWrapper), s.blur()) : document.body.appendChild(this.consoleWrapper), this.isVisible = !this.isVisible;
        } catch (n) {
          console.log("Error: ", n);
        }
      this.getPlugin(G).block = this.isFocused();
    }
  }
  isFocused() {
    try {
      const i = this.consoleWrapper.querySelector(".console-input");
      return i == null ? !1 : document.activeElement === i;
    } catch {
      return !1;
    }
  }
  writeLine(i) {
    this.buffer += i + `\r
`, this.setStatus("white"), this.updateConsole();
  }
  messageEntered(i) {
    if (i.startsWith("/")) {
      this.buffer += i + `
`;
      const t = this.getPlugin(k).execute(i.slice(1));
      t.message != "" && (this.buffer += t.message + `\r
`), t.status ? this.setStatus("#485b49") : this.setStatus("#813136");
    } else
      this.buffer += i + `\r
`, this.setStatus("white"), this.messageEnteredEvent.emit(new Us(i));
    this.history[0] = i, this.history.unshift(""), this.historyIndex = 0, this.updateConsole();
  }
  setStatus(i) {
    try {
      const t = this.consoleWrapper.querySelector(".console-status");
      if (t == null)
        return;
      t.style.backgroundColor = i.toString();
    } catch {
    }
  }
  updateConsole() {
    this.setElementsHtml(this.buffer);
  }
  setElementsHtml(i) {
    try {
      const t = this.consoleWrapper.querySelector(".console-content");
      if (t == null)
        return;
      t.innerHTML = "";
      const e = i.split(`
`);
      for (let s = 0; s < e.length - 1; s++) {
        const n = e[s], o = new Ls().ansi_to_html(n);
        let a = document.createElement("span");
        a.innerHTML = o, t.appendChild(a);
        const h = document.createElement("hr");
        h.className = "console-item-separator", n.endsWith("\r") ? t.appendChild(h) : t.appendChild(document.createElement("br"));
      }
    } catch {
    }
  }
  getInnerHtml() {
    return `
            <style>
                .console{
                    ${this.isVisible ? "" : "display: none;"}
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    
                    width: 400px;
                    padding: 20px;
                    border-radius: 20px;
                    background-color: rgba(42, 43, 46, 0.382);
                    color: white;
                    font-family: "IBM Plex Mono", monospace;
                    pointer-events: none;
                    overflow: hidden;
                }
                .console-status{
                    margin: 7px 0;
                    height: 6px;
                    background-color: white;
                    opacity: 1;
                    border-radius: 999px;
                }
                .console-header{
                    font-size: 20px;
                    font-weight: bold;
                    height: 40px;
                    color: white;
                    margin-bottom: 10px;
                    user-select: none;
                }
                .console-input{
                    width: 100%; 
                    padding: 5px 0;
                    margin: 0;
                    border-radius: 0; 
                    border: none; 
                    border-bottom: 1px solid rgba(240, 240, 240, 0.5);
                    background-color: transparent; 
                    color: white;
                    font-size: 20px;   
                }
                .console *::selection {
                    background-color: #546855;
                    color: white;
                }
                .console-input:focus{
                    outline: none; 
                    border-bottom: 1px solid rgba(240, 240, 240, 0.85);
                }
                .console-content-wrapper{
                    position: relative;
                    height: 600px;
                    width: 100%;
                    overflow: hidden;
                }
                .console-content{
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    position: absolute;
                    width: 100%;
                    line-height: 20px;
                    font-size: 20px;
                    margin: 0;
                    bottom: 0;
                }
                .console-item-separator{
                    border: none;
                    border-top: 1px dashed gray;
                    opacity: 0.75;
                    margin: 9.5px 0;
                }t
            </style>

            <div class="console">
                <div class="console-header">
                    <h2 style="margin: 0">Console <span style="opacity: 0.5">[T]</span></h2>
                </div>
                <div class="console-status"></div>
                <div class="console-content-wrapper">
                    <pre class="console-content"></pre>
                </div>
                    <input class="console-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" type="text" tabindex="-1" placeholder="Type your command here..." />
            </div>
            `;
  }
  clearConsole() {
    return this.buffer = "", this.updateConsole(), new g(!0, "", void 0);
  }
};
ve([
  b("clear")
], U.prototype, "clearConsole", 1);
U = ve([
  Wt("console")
], U);
var $s = Object.defineProperty, qs = Object.getOwnPropertyDescriptor, js = (i, t, e, s) => {
  for (var n = qs(t, e), r = i.length - 1, o; r >= 0; r--)
    (o = i[r]) && (n = o(t, e, n) || n);
  return n && $s(t, e, n), n;
};
class ft extends E {
  order = x.Input;
  name = "ClientPlugin";
  socket;
  start() {
    this.getPlugin(U)?.messageEnteredEvent.subscribe(this, "chatMessageEvent"), this.socket = lt("http://localhost:8001", {
      transports: ["websocket"],
      reconnection: !0,
      reconnectionDelay: 100
    }), this.socket.on("connect", () => this.onConnection()), this.socket.on("disconnect", (t) => this.onDisconnection(t)), this.socket.on("chat_message", (t, e) => this.onChatMessage(t, e)), this.socket.on("synchronize_go", (t, e) => this.onSynchronize(t, e));
  }
  event(t, e) {
    let s = t;
    this.sendChatMessage(s.message);
  }
  sendChatMessage(t) {
    this.socket.emit("chat_message", this.socket.id, t);
  }
  onConnection() {
    this.getPlugin(U).writeLine("connected!"), this.setServerName("unnamed");
  }
  onDisconnection(t) {
    this.getPlugin(U).writeLine(`\x1B[31mDisconnected from server: ${t}\x1B[0m`);
  }
  onChatMessage(t, e) {
    this.getPlugin(U).writeLine(`\x1B[32m${t}\x1B[0m: ${e}`);
  }
  setServerName(t) {
    return this.socket.emit("set_name", t), new g(!0, `Server name set to: ${t}`, t);
  }
  //synchronizer
  mocks = /* @__PURE__ */ new Set();
  synchronize(t, e) {
    this.mocks.add(t), this.socket.emit("synchronize_go", t, e);
  }
  onSynchronize(t, e) {
    const s = this.gameWorld.getGameObject(t);
    if (s)
      this.deepMerge(s, e);
    else {
      const n = z.playerGO();
      this.deepMerge(n, e), this.gameWorld.spawn(n), n.getComponent(C).velocity = f.zero();
    }
  }
  deepMerge(t, e) {
    for (const s of Object.keys(e))
      e[s] instanceof Object && s in t && t[s] instanceof Object ? this.deepMerge(t[s], e[s]) : t[s] = e[s];
    return t;
  }
}
js([
  b("setServerName", "<name: string>")
], ft.prototype, "setServerName");
var zs = Object.defineProperty, Vs = Object.getOwnPropertyDescriptor, bt = (i, t, e, s) => {
  for (var n = Vs(t, e), r = i.length - 1, o; r >= 0; r--)
    (o = i[r]) && (n = o(t, e, n) || n);
  return n && zs(t, e, n), n;
};
class st extends E {
  order = x.Update;
  name = "PlayerPlugin";
  playerName = "player";
  player = z.playerGO();
  getPlayerPosition() {
    return this.player.getTransform().position.clone();
  }
  getPlayerColor() {
    return this.player.getComponent(v).color.clone();
  }
  start() {
    this.respawn(), this.player.getComponent(v).color = this.getPlugin(tt)?.get("playerColor") ?? new p(53, 110, 58), this.getPlugin(G)?.KeyDownEvent.subscribe(this, "KeyDownEvent");
  }
  event(t, e) {
    if (e === "KeyDownEvent") {
      let s = t;
      if (s.key === "r")
        this.respawn();
      else if (s.key === "c") {
        let n = this.getPlugin(tt)?.get("displayColliders") ?? !1;
        n !== void 0 && this.getPlugin(tt)?.set("displayColliders", !n);
      }
    }
  }
  // color: rgb = new rgb(53, 110, 58);
  // target: rgb = new rgb(53, 110, 58);
  synchronize() {
    const t = this.getPlugin(ft), e = JSON.parse(JSON.stringify(this.player));
    delete e.gameWorld, t.synchronize(this.player.getId(), e);
  }
  update(t) {
    let e = this.getPlugin(y);
    if (e.targetCameraPositon = this.player.getTransform().position.clone(), !this.player.enabled) return;
    let s = this.getPlugin(j), n = this.getPlugin(G), r = this.player.getComponent(K);
    if (!r)
      return;
    r.targetDirection = e.getWorldPosition(s.getMouseScreenPosition()).sub(this.player.getTransform().position), r.range = e.getWorldPosition(s.getMouseScreenPosition()).sub(this.player.getTransform().position.add(r.getGlobalOffset())).magnitude(), (n.isPressed("e") || s.isKeyDown(0)) && r.shoot();
    const o = -25, a = n.isPressed("shift") ? 120 : 60, h = 50, l = this.player.getTransform().rotation, c = f.fromRad(l), u = 2.5;
    let d = this.player.getComponent(C), w = d.velocity;
    n.isPressed("w") ? (d.acceleration = c.toUnit().times(a), n.isPressed("s") && (d.acceleration = c.toUnit().times(-o))) : n.isPressed("s") ? d.acceleration = c.toUnit().times(o) : d.acceleration = f.zero(), w = w.sub(w.perpendicular(c)), w.magnitude() > h && w.setLength(h), n.isPressed("a") ? d.angularVelocity = u : n.isPressed("d") ? d.angularVelocity = -u : d.angularVelocity = 0;
  }
  cliGetName() {
    return "player";
  }
  setname(t) {
    this.playerName = t, this.player.name = t;
    try {
      this.getPlugin(ft).setServerName(t);
    } catch (e) {
      console.error("Error setting server name:", e);
    }
    return new g(!0, `Player name set to ${t}`, void 0);
  }
  setcolor(t) {
    try {
      let e = p.tryParseCssColor(t.toString());
      e && (this.player.getComponent(v).color = e);
    } catch {
    }
    return new g(!0, "Player color set", void 0);
  }
  respawn() {
    return this.player && this.gameWorld.isSpawned(this.player) && this.gameWorld.destroy(this.player), this.player = z.playerGO(), this.player.name = this.playerName, this.gameWorld.spawn(this.player), new g(!0, "Player respawned", void 0);
  }
  getcolor() {
    return new g(!0, `Player color is ${this.player.getComponent(v).color}`, this.player.getComponent(v).color);
  }
}
bt([
  b("setname", "<name: string>")
], st.prototype, "setname");
bt([
  b("setcolor", "<color: string | rgb>")
], st.prototype, "setcolor");
bt([
  b("respawn")
], st.prototype, "respawn");
bt([
  b("getcolor", void 0, "rgb")
], st.prototype, "getcolor");
class Hs extends E {
  order = x.Update;
  name = "StandaloneComponentPlugin";
  update(t) {
    this.gameWorld.getAllComponents().filter((e) => e instanceof mt).map((e) => e).forEach((e) => e.tick(t));
  }
}
async function Ks(i) {
  const t = new Ge(
    new tt(),
    new ft(),
    new k(),
    new G(),
    new j(i),
    new ne(),
    new st(),
    new $e(),
    new y(),
    new U(),
    new At(),
    new ie(),
    new Hs(),
    new Ue(i.getContext("2d"))
  );
  async function e() {
    t.tick(), requestAnimationFrame(e), await new Promise((s) => setTimeout(s, 0));
  }
  e();
}
Ks(document.getElementById("gameCanvas"));
export {
  Ks as main
};
//# sourceMappingURL=bundle.es.js.map
