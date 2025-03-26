(()=>{"use strict";class t{enabled=!0;gameObject;start(){}event(t,e){}getGameWorld(){return this.gameObject.getGameWorld()}hasComponent(t){return this.gameObject.hasComponent(t)}getComponent(t){return this.gameObject.getComponent(t)}getAllComponents(){return this.gameObject.getAllComponents()}getTransform(){return this.gameObject.getTransform()}getGameObject(){return this.gameObject}getPlugin(t){return this.getGameWorld().getPlugin(t)}isEnabled(){return this.gameObject.enabled&&this.enabled}enable(t=!0){this.enabled=t}}class e{static symRand(t){return(2*Math.random()-1)*t}static getColliderRadius(t,e){if(t>=10)return e;const s=Math.PI/t;return(Math.cos(s)*e*2+e)/3}static deltaAngle(t,e){return t=t%(2*Math.PI)+2*Math.PI,t%=2*Math.PI,((e=(e=e%(2*Math.PI)+2*Math.PI)%(2*Math.PI)+2*Math.PI)-t+Math.PI)%(2*Math.PI)-Math.PI}static elasticCollision1D(t,e,s,i){return[(e*(t-s)+2*s*i)/(t+s),(i*(s-t)+2*t*e)/(t+s)]}}class s{x=0;y=0;constructor(t,e){this.x=t,this.y=e}add(t){return new s(this.x+t.x,this.y+t.y)}sub(t){return new s(this.x-t.x,this.y-t.y)}times(t){return new s(this.x*t,this.y*t)}distance(t){return Math.sqrt(Math.pow(this.x-t.x,2)+Math.pow(this.y-t.y,2))}static distance(t,e){return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))}magnitude(){return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))}cross(){return new s(this.y,-this.x).toUnit()}scalarProduct(t){return this.x*t.x+this.y*t.y}vectorProduct(t){return this.x*t.y-this.y*t.x}perpendicular(t){return this.sub(t.cross().times(t.scalarProduct(this)/(t.magnitude()*t.magnitude())))}toUnit(){return 0!=this.magnitude()?new s(this.x,this.y).times(1/this.magnitude()):new s(1,0)}setLength(t){return this.toUnit().times(t)}toString(){return"{"+this.x+":"+this.y+"}"}toRad(){return Math.atan2(this.y,this.x)}reverse(){let t=1e32,e=1e32;return 0!=this.x&&(t=1/this.x),0!=this.y&&(e=1/this.y),new s(t,e)}static fromRad(t){return new s(Math.cos(t),Math.sin(t))}static randomPos(t){return new s(e.symRand(t),e.symRand(t))}static randomPos2(t){let i=e.symRand(Math.PI),n=Math.random()*t;return s.fromRad(i).times(n)}clone(){return new s(this.x,this.y)}static zero(){return new s(0,0)}static one(){return new s(1,1)}static up(){return new s(0,1)}static down(){return new s(0,-1)}static left(){return new s(-1,0)}static right(){return new s(1,0)}}class i extends t{velocity;acceleration=s.zero();mass=1;drag;angularVelocity=0;angularAcceleration=0;angularDrag=.01;constructor(t,e=.01){super(),this.velocity=new s(15*Math.random()*2-15,15*Math.random()*2-15),this.drag=e,this.mass=t}update(t){}fixedUpdate(t){this.getTransform().position=this.getTransform().position.add(this.velocity.times(t)),this.getTransform().rotation+=this.angularVelocity*t,this.velocity=this.velocity.add(this.acceleration.times(t)).times(1-this.drag),this.angularVelocity=(this.angularVelocity+this.angularAcceleration*t)*(1-this.angularDrag)}}class n{r=0;g=0;b=0;a=1;static stroke=new n(43,43,44);static background=new n(93,97,95);constructor(t,e,s,i=1){this.r=Math.min(255,Math.max(0,t)),this.g=Math.min(255,Math.max(0,e)),this.b=Math.min(255,Math.max(0,s)),this.a=Math.min(1,Math.max(0,i))}toString(){return`rgba(${this.r},${this.g},${this.b},${Math.max(0,Math.min(this.a,1))})`}toRgb(){return new n(this.r,this.g,this.b)}toArgb(t){return new n(this.r,this.g,this.b,t)}blend(t,e){return new n(this.r*(1-e)+t.r*e,this.g*(1-e)+t.g*e,this.b*(1-e)+t.b*e)}static randomColor(){return new n(255*Math.random(),255*Math.random(),255*Math.random())}static hslToRgb(t,e,s){s/=100;const i=e=>(e+t/30)%12,o=(e/=100)*Math.min(s,1-s),a=t=>s-o*Math.max(-1,Math.min(i(t)-3,Math.min(9-i(t),1))),r=Math.round(255*a(0)),l=Math.round(255*a(8)),h=Math.round(255*a(4));return new n(r,l,h)}static randomColor2(){const t=Math.floor(360*Math.random()),e=Math.floor(30*Math.random())+15,s=Math.floor(15*Math.random())+30;return n.hslToRgb(t,e,s)}static getHeatmapColor(t){t=Math.max(0,Math.min(1,t));let e=Math.min(255,Math.max(0,Math.floor(255*t*2))),s=Math.min(255,Math.max(0,Math.floor(255*(2-2*t))));return new n(s/1.5,e/1.5,0,255)}clone(){return new n(this.r,this.g,this.b,this.a)}}class o{position;rotation;scale;constructor(t=new s(0,0),e=0,i=s.one()){this.position=t,this.rotation=e,this.scale=i}static fromPosition(t){let e=new o;return e.position=t,e}clone(){let t=new o;return t.position=this.position.clone(),t.scale=this.scale.clone(),t.rotation=this.rotation,t}}class a{transform=new o;components=new Map;enabled=!0;name="UnnamedGameObject";gameWorld;constructor(...t){for(let e of t){let t=e.constructor.name;if(this.components.has(t))throw new Error(`Component ${t} already exists in the game object`);e.gameObject=this,this.components.set(t,e)}}hasComponent(t){return this.components.has(t.name)}getComponent(t){const e=t.name;return this.components.get(e)}getAllComponents(){return Array.from(this.components.values()).filter((t=>t.isEnabled()))}destroy(){this.gameWorld.destroy(this)}spawn(t){return t.spawn(this)}getTransform(){return this.transform}getGameWorld(){return this.gameWorld}}class r{gameWorld;enabled=!0;name="Plugin";event(t,e){}start(){}update(t){}fixedUpdate(t){}getPlugin(t){return this.gameWorld.getPlugin(t)}hasPlugin(t){return this.gameWorld.hasPlugin(t)}}class l{constructor(){}}class h{subs=new Map;args=[];subscribe(t,e){this.subs.set(new WeakRef(t),e)}unsubscribe(t){this.subs.delete(new WeakRef(t))}emit(t){this.args.push(t)}register(t){t.registerEvent(this)}invoke(){if(0!=this.args.length){for(const[t,e]of this.subs){const s=t.deref();if(s)for(const t of this.args)s.event(t,e);else this.subs.delete(t)}this.args=[]}}}class c extends l{collider;constructor(t){super(),this.collider=t}}class g extends t{offset=s.zero();radius;isActive=!1;isStatic;avoidObjectes;collisions=new Set;onCollisionEnterEvent=new h;onCollisionExitEvent=new h;constructor(t=1,e=!0,...s){super(),this.radius=t,this.isStatic=e,this.avoidObjectes=new Set,s.forEach((t=>this.avoidObjectes.add(t)))}start(){this.onCollisionEnterEvent.register(this.getGameWorld()),this.onCollisionExitEvent.register(this.getGameWorld())}getCenter(){return this.getTransform().position.add(this.offset)}collides(t){return this.getCenter().sub(t.getCenter()).magnitude()<=this.radius+t.radius&&!this.avoidObjectes.has(t.getGameObject())&&!t.avoidObjectes.has(this.getGameObject())}onCollisionEnter(t){this.onCollisionEnterEvent.emit(new c(t))}onCollisionExit(t){this.onCollisionExitEvent.emit(new c(t))}}class d extends t{zindex;constructor(t=0){super(),this.zindex=t}}class m extends d{color;radius;n;constructor(t,e=4,s=0,i=n.randomColor2()){super(),this.radius=t,this.n=e,this.zindex=s,this.color=i}render(t){const e=[t.canvas.width,t.canvas.height],s=this.getTransform().position.x,i=this.getTransform().position.y,n=this.getTransform().rotation,o=this.getTransform().scale,a=this.getGameWorld().getPlugin(C).scale,r=this.getGameWorld().getPlugin(C).cameraPositon.x,l=this.getGameWorld().getPlugin(C).cameraPositon.y,h=this.color.toString(),c=s-r,g=-(i-l);t.save(),t.translate(e[0]/2,e[1]/2),t.scale(a,a),t.translate(c,g),t.rotate(n),t.scale(o.x,o.y);const d=this.radius;if(this.n<10){t.beginPath(),t.moveTo(0,d);const e=2*Math.PI/this.n;for(let s=1;s<this.n;s++)t.lineTo(Math.sin(s*e)*d,Math.cos(s*e)*d);t.closePath()}else t.beginPath(),t.arc(0,0,d,0,2*Math.PI),t.closePath();t.fillStyle=h,t.shadowBlur=0,t.fill(),t.shadowBlur=50,t.stroke(),t.restore()}}class u extends d{color;constructor(t=0,e=n.background.clone()){super(),this.zindex=t,this.color=e}render(t){const e=this.getComponent(f).length,s=this.getComponent(f).width,i=[t.canvas.width,t.canvas.height],o=this.getTransform().position.x,a=this.getTransform().position.y,r=this.getTransform().scale,l=this.getGameWorld().getPlugin(C).scale,h=this.getGameWorld().getPlugin(C).cameraPositon.x,c=this.getGameWorld().getPlugin(C).cameraPositon.y,g=this.color.toString(),d=(this.getComponent(m).color.toString(),o-h),u=a-c,p=this.getComponent(f),w=Math.sin(Math.min(1,p.getShotDelta()/p.cooldown)*Math.PI),y=(p.range,p.direction.times(p.bulletSpeed).times(p.getBulletLifetime()).add(p.getGlobalOffset()));t.save(),t.translate(i[0]/2,i[1]/2),t.scale(l,-l),t.translate(d,u),t.translate(y.x,y.y),t.beginPath(),t.arc(0,0,1,0,2*Math.PI),t.closePath(),t.shadowBlur=0,t.strokeStyle=n.stroke.toString(),t.stroke(),t.strokeRect(-.5,-.5,1,1),t.restore(),t.save(),t.translate(i[0]/2,i[1]/2),t.scale(l,-l),t.translate(d,u),t.scale(r.x,r.y),t.rotate(p.direction.toRad()),t.beginPath(),t.roundRect(0,-s/2,(1-w/3)*e,s,.1),t.closePath(),t.fillStyle=g,t.shadowBlur=0,t.fill(),t.shadowBlur=30,t.stroke(),t.restore()}}class p extends t{tickCount=0;tick(t){0==this.tickCount?this.start():this.update(t),this.tickCount++}start(){}update(t){}}class f extends p{damage;cooldown=.15;bulletSpeed=40;length;width;range=250;bulletSpraed=.1;offset;direction=s.right();targetDirection=s.right();lastShootTime=-10;constructor(t=4,e=2,i=10){super(),this.damage=i,this.length=t,this.width=e,this.offset=new s(t-e/2,0)}getShotDelta(){return this.getGameWorld().getWorldTime()-this.lastShootTime}update(t){let i=this.direction.toRad(),n=this.targetDirection.toRad();i+=9*t*e.deltaAngle(i,n),this.direction=s.fromRad(i)}getBulletLifetime(){return this.range/this.bulletSpeed}getGlobalOffset(){return this.direction.toUnit().times(this.offset.x).add(this.direction.cross().times(this.offset.y))}shoot(){if(this.isEnabled&&this.getGameObject().enabled&&this.getShotDelta()>=this.cooldown){const t=.125,s=this.getComponent(u).zindex-.01;let n=z.bulletGO(this.getGameObject(),this.damage,this.width/2+e.symRand(t),this.getBulletLifetime(),s),o=n.getComponent(i),a=n.getComponent(g);n.getComponent(m).color=this.getComponent(m).color.clone(),a.avoidObjectes.add(this.getGameObject()),n.getTransform().position=this.getTransform().position.add(this.getGlobalOffset());let r=this.direction.cross().times(2*Math.random()*this.bulletSpraed-this.bulletSpraed);o.velocity=this.direction.toUnit().add(r).times(this.bulletSpeed),n.spawn(this.getGameWorld()),this.lastShootTime=this.getGameWorld().getWorldTime()}}}class w extends l{key;constructor(t){super(),this.key=t}}class y extends r{name="CameraPlugin";prevPressedKeys=new Set;pressedKeys=new Set;KeyDownEvent=new h;constructor(t){super(),this.pressedKeys=t}isPressed(t){return this.pressedKeys.has(t)}start(){this.KeyDownEvent.register(this.gameWorld)}update(t){this.pressedKeys.difference(this.prevPressedKeys).forEach((t=>this.KeyDownEvent.emit(new w(t)))),this.prevPressedKeys.clear(),this.pressedKeys.forEach((t=>this.prevPressedKeys.add(t)))}}class P extends r{name="MousePlugin";pressedKeys=new Set;canvas;position=s.zero();constructor(t){super(),this.canvas=t,this.trackMouse(t)}scroll(t){let e=this.getPlugin(C);(t=Math.sign(t))>0&&.9*e.targetScale>5&&(e.targetScale=.9*e.targetScale),t<0&&1.1*e.targetScale<100&&(e.targetScale=1.1*e.targetScale)}isKeyDown(t=0){return this.pressedKeys.has(t)}getWorldPosition(){let t=this.getPlugin(C).scale,e=this.getPlugin(C).cameraPositon;const i=new s(this.canvas.width,this.canvas.height);return new s((this.position.x-i.x/2)/t,(-this.position.y+i.y/2)/t).add(e)}trackMouse(t){t.addEventListener("mousemove",(e=>{const i=t.getBoundingClientRect();let n=e.clientX-i.left,o=e.clientY-i.top;this.position=new s(n,o)})),t.addEventListener("mousedown",(t=>{this.pressedKeys.add(t.button)})),t.addEventListener("mouseup",(t=>{this.pressedKeys.delete(t.button)})),t.addEventListener("wheel",(t=>{this.scroll(t.deltaY)}))}}class x extends r{name="ConfigPlugin";config=new Map([["bulletSize",.75],["playerSize",2.5],["bulletColor",new n(56,57,60)],["playerColor",new n(122,111,62)],["playerColor",new n(130,111,51)],["playerColor",new n(80,37,36)],["playerColor",new n(59,94,76)],["playerColor",new n(129,49,54)]]);get(t){if(this.config.has(t))return this.config.get(t)}set(t,e){this.config.set(t,e)}}class b extends r{name="PlayerPlugin";player=z.playerGO();getPlayerPosition(){return this.player.getTransform().position.clone()}getPlayerColor(){return this.player.getComponent(m).color.clone()}start(){this.player.spawn(this.gameWorld),this.player.name="player",this.getPlugin(y).KeyDownEvent.subscribe(this,"KeyDownEvent")}event(t,e){let s=t;if("r"===s.key)this.player&&this.gameWorld.isSpawned(this.player)&&this.gameWorld.destroy(this.player),this.player=z.playerGO(),this.player.spawn(this.gameWorld);else if("c"===s.key){let t=this.getPlugin(x)?.get("displayColliders")??!1;void 0!==t&&this.getPlugin(x)?.set("displayColliders",!t)}}update(t){if(!this.player.enabled)return;let e=this.getPlugin(P),s=this.getPlugin(y),i=this.player.getComponent(f);i.targetDirection=e.getWorldPosition().sub(this.player.getTransform().position),i.range=e.getWorldPosition().sub(this.player.getTransform().position.add(i.getGlobalOffset())).magnitude(),(s.isPressed("e")||e.isKeyDown(0))&&i.shoot()}fixedUpdate(t){if(!this.player.enabled)return;let e=150;const n=this.getPlugin(y),o=this.player.getTransform().rotation,a=s.fromRad(o);let r=this.player.getComponent(i),l=r.velocity;n.isPressed("shift")&&(e=250),n.isPressed("w")?(r.acceleration=a.toUnit().times(e),n.isPressed("s")&&(r.acceleration=a.toUnit().times(55))):n.isPressed("s")?r.acceleration=a.toUnit().times(-55):r.acceleration=s.zero(),l=l.sub(l.perpendicular(a)),l.magnitude()>50&&l.setLength(50),n.isPressed("a")?r.angularVelocity=2.5:n.isPressed("d")?r.angularVelocity=-2.5:r.angularVelocity=0}}class C extends r{cameraPositon=new s(4,0);scale=20;targetScale=40;name="CameraPlugin";start(){let t=this.getPlugin(b).getPlayerPosition();this.cameraPositon=t.clone()}fixedUpdate(t){let e=this.getPlugin(b).getPlayerPosition();this.scale+=(this.targetScale-this.scale)*(2.5*t),this.cameraPositon=this.cameraPositon.add(e.sub(this.cameraPositon).times(.02))}}class v extends d{color=new n(42,42,55);text;displayName;constructor(t,e=!1,s=1){super(),this.text=t,this.zindex=s,this.displayName=e}render(t){const e=[t.canvas.width,t.canvas.height],s=this.getTransform().position.x,i=this.getTransform().position.y,n=(this.getTransform().rotation,this.getTransform().scale),o=this.getGameWorld().getPlugin(C).scale,a=this.getGameWorld().getPlugin(C).cameraPositon.x,r=this.getGameWorld().getPlugin(C).cameraPositon.y,l=this.color.toString(),h=s-a,c=-(i-r);t.save(),t.fillStyle=l,t.translate(e[0]/2,e[1]/2),t.scale(o,o),t.translate(h,c),t.scale(n.x,n.y);const g=this.displayName?this.getGameObject().name:this.text;t.font="bold 1px Arial",t.fillStyle="azure";const d=t.measureText(g).width/2;t.strokeText(g,-d,1/4),t.fillText(g,-d,1/4),t.restore()}}class T extends d{activeColor=new n(172,42,55,.125);staticColor=new n(95,64,36,.125);dynamicColor=new n(57,127,31,.125);disabledColor=new n(36,24,36,.125);constructor(t=-1){super(),this.zindex=t}getColor(){let t=this.dynamicColor,e=this.getComponent(g);return e.isEnabled()?e.isActive?t=this.activeColor:e.isStatic&&(t=this.staticColor):t=this.disabledColor,t}render(t){if(!this.getPlugin(x)?.get("displayColliders"))return;const e=this.getComponent(g),s=e.offset,i=e.radius+.25,n=this.getColor(),o=[t.canvas.width,t.canvas.height],a=this.getTransform().position.x+s.x,r=this.getTransform().position.y+s.y,l=this.getTransform().rotation,h=this.getGameWorld().getPlugin(C).scale,c=i,d=a-this.getGameWorld().getPlugin(C).cameraPositon.x,m=-(r-this.getGameWorld().getPlugin(C).cameraPositon.y);t.save(),t.translate(o[0]/2,o[1]/2),t.scale(h,h),t.translate(d,m),t.rotate(l),t.strokeStyle=n.toRgb().toString(),t.fillStyle=n.toString(),t.shadowBlur=30,t.beginPath(),t.arc(0,0,c,0,2*Math.PI),t.closePath(),t.fill(),t.stroke(),t.restore()}}class M{progress=-1;duration=.25;startAnimation=()=>{};endAnimation=()=>{};updateAnimation=()=>{};constructor(t=()=>{},e=()=>{},s=()=>{}){this.updateAnimation=t,this.startAnimation=e,this.endAnimation=s}update(t){if(this.progress>0){let e=(this.duration-this.progress)/this.duration;this.progress-=t,this.updateAnimation(e)}else-1!=this.progress&&(this.endAnimation(),this.progress=-1)}start(){-1==this.progress?(this.startAnimation(),this.progress=this.duration):this.progress=(this.duration+this.progress)/2}}class S extends p{shrinkAnimation=new M;zoomAnimation=new M;defaultZoom=new s(1,1);constructor(){super(),this.shrinkAnimation=new M((t=>this.getTransform().scale=this.defaultZoom.times(1-t)),(()=>this.getComponent(k)?.enable(!1)),(()=>this.getGameObject().destroy())),this.zoomAnimation=new M((t=>this.getTransform().scale=this.defaultZoom.times(1+Math.sin(Math.PI*t)/5)),(()=>this.defaultZoom=this.getTransform().scale.clone()),(()=>this.getTransform().scale=this.defaultZoom))}update(t){this.shrinkAnimation.update(t),this.zoomAnimation.update(t)}startZoom(){this.zoomAnimation.start()}startShrink(){this.shrinkAnimation.start()}}class W extends l{damage;participant;constructor(t,e){super(),this.damage=t,this.participant=e}}class G extends t{health;maxHealth;damageEvent;constructor(t,e=t){super(),this.health=e,this.maxHealth=t,this.damageEvent=new h}start(){this.damageEvent.register(this.getGameWorld()),this.getComponent(g).onCollisionEnterEvent.subscribe(this,"onCollisionEnter")}event(t){let e=t;this.onCollisionEnter(e.collider)}onCollisionEnter(t){let e=t.getGameObject(),s=e.getComponent(i),n=this.getComponent(i),o=n.mass/(s.mass+n.mass);n.mass<s.mass&&(s.velocity=s.velocity.add(n.velocity.times(o)).times(.5),n.velocity=n.velocity.add(s.velocity.times(1-o).times(.5))),s.angularVelocity-=this.getTransform().position.sub(e.getTransform().position).vectorProduct(n.velocity)*(o/15);try{const t=e.getComponent(G),s=Math.min(t.health,this.health);if(0==s)return;this.onDamage(s,t),t.onDamage(s,this)}catch{}}getHealth(){return this.health/this.maxHealth}heal(t){this.health=Math.min(this.maxHealth,this.health+t)}onDamage(t,e){if(this.health-=t,this.damageEvent.emit(new W(t,e)),0==this.health){if(this.getComponent(g)?.enable(!1),this.getComponent(i).drag=.025,this.getComponent(S)?.startShrink(),e.hasComponent(m)){let t=this.getComponent(m).color.blend(e.getComponent(m).color.toRgb(),.5);this.getComponent(m).color=t,e.getComponent(m).color=t}}else this.getComponent(S)?.startZoom()}}class k extends d{offset=new s(0,4);fill=.5;width=5;height=.5;constructor(t=0){super(t)}render(t){let e=this.width,s=this.fill;try{s=this.getComponent(G).getHealth(),e=2+this.getComponent(G).maxHealth/250}catch{}if(s>=1||s<=0)return;const i=[t.canvas.width,t.canvas.height],o=this.getTransform().position.x,a=this.getTransform().position.y,r=this.getTransform().scale,l=this.getGameWorld().getPlugin(C).scale,h=this.getGameWorld().getPlugin(C).cameraPositon.x,c=this.getGameWorld().getPlugin(C).cameraPositon.y,g=n.getHeatmapColor(s).toString(),d=o-h,m=-(a-c),u=.25;t.save(),t.translate(i[0]/2,i[1]/2),t.scale(l,l),t.translate(d,m),t.scale(r.x,r.y),t.translate(this.offset.x,-this.offset.y),t.fillStyle=g,t.shadowBlur=0,t.beginPath(),t.roundRect(-e/2,-this.height/2,e,this.height,u),t.closePath(),t.fillStyle=n.background.toString(),t.fill(),t.beginPath(),t.roundRect(-e/2,-this.height/2,e*s,this.height,u),t.closePath(),t.fillStyle=g,t.fill(),t.beginPath(),t.roundRect(-e/2,-this.height/2,e,this.height,u),t.closePath(),t.shadowBlur=30,t.stroke(),t.beginPath(),t.roundRect(-e/2,-this.height/2,e*s,this.height,u),t.closePath(),t.shadowBlur=0,t.stroke(),t.restore()}}class E extends r{name="SchedulerPlugin";schedule=[];addInvoke(t,e,s){let i=new WeakRef(t);this.schedule.push({totalTime:e,subscriber:i,topic:s}),this.schedule.sort(((t,e)=>e.totalTime-t.totalTime))}update(t){const e=this.gameWorld.getWorldTime();if(0!=this.schedule.length)for(;0!=this.schedule.length&&this.schedule[this.schedule.length-1].totalTime<=e;){let t=this.schedule.pop();t.subscriber.deref()?.onInvoke(t.topic)}}}class O extends t{lifeTime;constructor(t=1){super(),this.lifeTime=t}onInvoke(t){this.getComponent(S)?.startShrink()}start(){let t=this.getGameWorld().getWorldTime()+this.lifeTime;this.getGameWorld().getPlugin(E).addInvoke(this,t,"destroy")}}class R extends t{owner;constructor(t){super(),this.owner=new WeakRef(t)}getOwner(){return this.owner.deref()}}class A extends d{color;constructor(t=0,e=new n(22,24,25)){super(),this.zindex=t,this.color=e}render(t){const e=[t.canvas.width,t.canvas.height],s=this.getTransform().position.x,i=this.getTransform().position.y,o=this.getTransform().rotation,a=this.getTransform().scale,r=this.getGameWorld().getPlugin(C).scale,l=this.getGameWorld().getPlugin(C).cameraPositon.x,h=this.getGameWorld().getPlugin(C).cameraPositon.y,c=(this.color.toString(),s-l),g=i-h;t.save(),t.translate(e[0]/2,e[1]/2),t.scale(r,-r),t.translate(c,g),t.rotate(o),t.scale(a.x,a.y),t.beginPath(),t.fillStyle=this.getComponent(m).color.toString(),t.shadowBlur=0,t.roundRect(-4,-2,8,4,1),t.fill(),t.shadowBlur=50,t.stroke(),t.closePath(),t.beginPath(),t.fillStyle=n.background.toString(),t.shadowBlur=0,t.roundRect(-4.5,-3.25,10,2,.5),t.fill(),t.shadowBlur=50,t.stroke(),t.closePath(),t.beginPath(),t.shadowBlur=0,t.roundRect(-4.5,1.25,10,2,.5),t.fill(),t.shadowBlur=50,t.stroke(),t.closePath(),t.beginPath(),t.fillStyle=n.background.toString(),t.shadowBlur=0,t.roundRect(-3,-2,6,4,1.5),t.fill(),t.shadowBlur=50,t.stroke(),t.closePath(),t.restore()}}class j extends d{color;traces=[];lastPosition=s.zero();transparency=2;duration=1;length=2;constructor(t=0,e=new n(66,83,68)){super(),this.zindex=t,this.color=e}render(t){const e=[t.canvas.width,t.canvas.height],s=this.getGameWorld().getPlugin(C).scale,i=this.getGameWorld().getPlugin(C).cameraPositon.x,n=this.getGameWorld().getPlugin(C).cameraPositon.y,o=this.getTransform().position.clone(),a=this.getTransform().rotation;for(this.lastPosition.distance(o)>.75&&(this.traces.push({position:o,rotation:a,startTime:this.getGameWorld().getWorldTime()}),this.lastPosition=this.getTransform().position.clone());this.traces.length>0&&this.traces[0].startTime+this.duration<this.getGameWorld().getWorldTime();)this.traces.shift();for(const o of this.traces){const a=o.position.x-i,r=o.position.y-n,l=1-(this.getGameWorld().getWorldTime()-o.startTime)/this.duration;t.save(),t.translate(e[0]/2,e[1]/2),t.scale(s,-s),t.translate(a,r),t.rotate(o.rotation),t.beginPath(),t.fillStyle=this.color.toArgb(this.transparency*l).toString(),t.shadowBlur=0,t.roundRect(-4.5,-3.25,this.length,2,.75),t.fill(),t.closePath(),t.beginPath(),t.roundRect(-4.5,1.25,this.length,2,.75),t.fill(),t.closePath(),t.restore()}}}class z{static polygonGO(t=2,s=3,...o){let r=new a(new i(.1,.01),new m(t,s,0,n.randomColor2().toArgb(.75)),new k(.1),new g(e.getColliderRadius(s,t)),new T,new G(25*s),new S,...o);return r.getTransform().rotation=2*Math.random()*Math.PI,r.name="Polygon",r}static enemyGO(t=2.5,n="",o=4,...r){let l=new a(new v(n,void 0,o+.1),new m(t,8,o),new k(o+.1),new A(o-.2),new i(30,.01),new g(t,!1),new T(o-.15),new G(1500),new S,new j(-21.37),...r);return l.getTransform().rotation=e.symRand(Math.PI),l.getComponent(i).angularDrag=1,l.getComponent(f).targetDirection=s.fromRad(e.symRand(Math.PI)),l.name="Enemy",l}static bulletGO(t,e=30,s=.65,o=1,r=-1,...l){let h=new a(new i(.05,0),new m(s,10,r,new n(173,87,87)),new g(s,!1),new T,new G(e),new S,new O(o),new R(t),...l);return h.getTransform().rotation=0,h.name="Bullet",h}static playerGO(t=2.5,e=5,...s){let o=new a(new A(e-.2),new m(t,10,e,new n(80,37,36)),new v("Player",!0,e+.1),new T(e-.15),new k(e+.1),new u(e-.1),new i(30,.05),new g(t,!1),new G(1e3),new S,new f(6,1.55,44),new j(-21.37),...s);return o.getTransform().rotation=0,o.name="Player",o}}class D extends d{image=new Image;side;offset;constructor(t=s.zero(),e=s.zero(),i="GameEngine/src/Assets/vectorpaint3.svg",n=0){super(),this.zindex=n,this.side=t,this.offset=e,this.image.src=i}render(t){const e=[t.canvas.width,t.canvas.height],s=this.getTransform().position.x,i=this.getTransform().position.y,n=this.getTransform().rotation,o=this.getTransform().scale,a=this.getGameWorld().getPlugin(C).scale,r=s-this.getGameWorld().getPlugin(C).cameraPositon.x,l=-(i-this.getGameWorld().getPlugin(C).cameraPositon.y);let h=this.side;0==h.x&&(h.x=this.image.width),0==h.y&&(h.y=this.image.height),t.save(),t.translate(e[0]/2,e[1]/2),t.scale(a,a),t.translate(r,l),t.rotate(n),t.scale(o.x,o.y),t.translate(this.offset.x,this.offset.y),t.shadowBlur=15,t.drawImage(this.image,-h.x/2,-h.y/2,h.x,h.y),t.restore()}}class I extends r{name="RendererPlugin";context;hud=new B;renderDistance=150;constructor(t){super(),this.context=t}addVignetteEffect(t,e){const s=t.canvas.width/2,i=t.canvas.height/2,n=Math.sqrt(s*s+i*i),o=t.createRadialGradient(s,i,0,s,i,n);o.addColorStop(.25,"rgba(0, 0, 0, 0)"),o.addColorStop(1,e),t.fillStyle=o,t.fillRect(0,0,t.canvas.width,t.canvas.height)}drawDotGrid(t,e,s,i){const n=t.canvas.width,o=t.canvas.height,a=this.getPlugin(C).scale,r=this.getPlugin(C).cameraPositon;e*=a,s*=a,t.fillStyle=i;for(let i=(n/2-r.x*a)%e;i<=n;i+=e)for(let n=(o/2+r.y*a)%e;n<=o;n+=e)t.beginPath(),t.arc(i,n,s/2,0,2*Math.PI),t.fill()}drawGrid(t,e,s){const i=t.canvas.width,n=t.canvas.height,o=this.getPlugin(C).scale,a=this.getPlugin(C).cameraPositon;t.save(),e*=o,t.strokeStyle=s,t.lineWidth=.1*o,t.beginPath();for(let s=(i/2-a.x*o)%e;s<=i;s+=e)t.moveTo(s,0),t.lineTo(s,n);for(let s=(n/2+a.y*o)%e;s<=n;s+=e)t.moveTo(0,s),t.lineTo(i,s);t.stroke(),t.restore()}start(){this.context.imageSmoothingEnabled=!0,this.context.strokeStyle="rgb(43,43,44)",this.context.lineWidth=.175,this.context.lineJoin="round",this.context.shadowColor="rgba(0, 0, 0, 0.75)"}update(t){const e=this.context.canvas.width,s=this.context.canvas.height;this.context.fillStyle="#716f6b",this.context.fillStyle="rgb(85, 106, 86)",this.context.fillRect(0,0,e,s),this.drawGrid(this.context,10,"rgb(43,43,44)"),this.gameWorld.getComponents(v).concat(this.gameWorld.getComponents(T)).concat(this.gameWorld.getComponents(k)).concat(this.gameWorld.getComponents(m)).concat(this.gameWorld.getComponents(D)).concat(this.gameWorld.getComponents(u)).concat(this.gameWorld.getComponents(j)).concat(this.gameWorld.getComponents(A)).filter((t=>t.getTransform().position.distance(this.getPlugin(C).cameraPositon)<this.renderDistance)).sort(((t,e)=>t.zindex-e.zindex)).forEach((t=>t.render(this.context))),this.hud.draw(this.context),this.addVignetteEffect(this.context,"rgba(0, 0, 0, 0.3)")}}class B{texts=new Map;setLabel(t,e,s){this.texts.set(t,{pos:e,text:s})}removeLabel(t){this.texts.delete(t)}draw(t){for(const e of this.texts.values())this.drawText(e.text,e.pos,t)}drawText(t,e,s){s.save(),s.translate(e.x,e.y),s.font="bold 30px Arial",s.fillStyle="azure",s.lineWidth=5.25,s.strokeText(t,-0,7.5),s.fillText(t,-0,7.5),s.restore()}}class K extends r{name="ProfilerPlugin";size=200;usage=new Map;constructor(){super()}addRecord(t,e){if(this.usage.has(t)){let s=this.usage.get(t);s.length>=this.size?(s.shift(),s.push(e)):s.push(e)}else this.usage.set(t,[e])}update(t){let e=0;for(const t of this.usage){let i=t[0],n=t[1].length,o=0;for(const e of t[1])o+=e;o/=n,e++,this.getPlugin(I).hud.setLabel(i,new s(40,40*e),`${i}: `+o.toFixed(2).toString()+"ms")}}}class U{startTime=0;prevWorldTime=0;worldTime=0;tickCount=0;gameObjects=new Set;plugins=new Map;events=[];componentsToStart=[];constructor(...t){for(let e of t){let t=e.constructor.name;if(this.plugins.has(t))throw new Error(`Plugin ${t} already exists in the game object`);e.gameWorld=this,this.plugins.set(t,e)}}getPlugin(t){const e=t.name;return this.plugins.get(e)}hasPlugin(t){const e=t.name;return this.plugins.has(e)}isSpawned(t){return this.gameObjects.has(t)}spawn(t){if(this.gameObjects.has(t))throw new Error(`GameObject ${t.name} already exists in the game world`);return t.gameWorld=this,this.gameObjects.add(t),t.getAllComponents().forEach((t=>this.componentsToStart.push(new WeakRef(t)))),t}destroy(t){if(!this.gameObjects.has(t))throw new Error(`GameObject ${t.name} does'not exist in the game world`);t.enabled=!1,this.gameObjects.delete(t)}getAllGameObjects(t=!0){return Array.from(this.gameObjects).filter((e=>e.enabled||!t))}getComponents(t,e=!0){return this.getAllGameObjects().filter((s=>s.hasComponent(t)&&(s.getComponent(t).isEnabled()||!e))).map((e=>e.getComponent(t)))}getAllComponents(t=!0){return Array.from(this.getAllGameObjects(t)).flatMap((t=>t.getAllComponents()))}registerEvent(t){this.events.push(new WeakRef(t))}getWorldTime(){return this.worldTime/1e3}tick(){this.tickCount++,1==this.tickCount?this.startWorld():this.updateWorld(),this.startComponents(),this.invokeEvents()}startComponents(){for(let t of this.componentsToStart){const e=t.deref();e&&e.start()}this.componentsToStart=[]}startWorld(){this.startTime=performance.now(),this.Start(),this.plugins.forEach((t=>t.start())),setInterval((()=>{this.FixedUpdate(.01),this.plugins.forEach((t=>t.fixedUpdate(.01)))}),10)}updateWorld(){this.worldTime=performance.now()-this.startTime;let t=this.worldTime-this.prevWorldTime;this.prevWorldTime=this.worldTime,this.Update(t/1e3),this.plugins.forEach((e=>{let s=performance.now();e.update(t/1e3),this.getPlugin(K).addRecord(e.name,performance.now()-s)}))}invokeEvents(){let t=performance.now();for(const t of this.events){const e=t.deref();e&&e.invoke()}this.getPlugin(K).addRecord("Events",performance.now()-t)}Start(){}Update(t){}FixedUpdate(t){}}var L;!function(t){t[t.neutral=0]="neutral",t[t.passive=1]="passive",t[t.aggresive=2]="aggresive"}(L||(L={}));class V extends p{type=L.aggresive;isAttacing=!1;target;isFollowing=!1;minDistance=100;maxDistance=1e3;maxSpeed=10;start(){this.getComponent(G).damageEvent.subscribe(this)}event(t){const e=t.participant;e.hasComponent(R)&&e.getComponent(R).getOwner()&&this.attack(e.getComponent(R).getOwner())}attack(t){this.isAttacing=!0,this.target=new WeakRef(t),this.isFollowing=!0}update(t){if(this.target&&this.target.deref()){if(this.isAttacing){let n=this.getComponent(f),o=this.target.deref().getTransform().position.sub(this.getTransform().position);n.targetDirection=o;let a=o.magnitude();if(a>this.maxDistance&&(this.isAttacing=!1),n.shoot(),a>=this.minDistance){let n=this.getTransform().rotation,a=o.toRad();n+=5*t*e.deltaAngle(n,a),this.getTransform().rotation=n,this.getComponent(i).velocity=s.fromRad(n).times(this.maxSpeed)}}}else this.isAttacing=!1}}class H extends U{Start(){console.log("Hello, MyWorld!");const t=300;for(let n=0;n<350;n++){const n=3+e.symRand(.25);let o=z.polygonGO(n/2,4);o.getTransform().position=s.randomPos(t),o.getComponent(i).angularVelocity=2*Math.random()-1,this.spawn(o)}for(let n=0;n<150;n++){const n=3.5+e.symRand(.25);let o=z.polygonGO(n/2,3);o.getTransform().position=s.randomPos(t),o.getComponent(i).angularVelocity=2*Math.random()-1,this.spawn(o)}for(let n=0;n<150;n++){const n=4+e.symRand(.25);let o=z.polygonGO(n/2,Math.round(3*Math.random())+5);o.getTransform().position=s.randomPos(t),o.getComponent(i).angularVelocity=2*Math.random()-1,this.spawn(o)}for(let n=0;n<25;n++){const n=3+e.symRand(.25);let o=z.polygonGO(n/2,Math.round(3*Math.random())+5,new D(s.zero(),void 0,void 0,12));o.getTransform().position=new s(2*Math.random()*t-t,2*Math.random()*t-t),o.getComponent(i).angularVelocity=2*Math.random()-1,o.getComponent(m).enable(!1),this.spawn(o)}for(let e=0;e<25;e++){let i=z.enemyGO(2.5,"Enemy nr."+e,4,new f(void 0,void 0,10+5*Math.random()),new u(3.9),new V);i.getTransform().position=s.randomPos(t),i.spawn(this)}}Update(t){}}class $ extends r{name="PhysicsPlugin";update(t){this.gameWorld.getWorldTime(),this.gameWorld.getComponents(i).forEach((e=>e.update(t)))}fixedUpdate(t){this.gameWorld.getWorldTime(),this.gameWorld.getComponents(i).forEach((e=>e.fixedUpdate(t)))}}class Z extends r{name="CollisionDetectionPlugin";cellSize=5;update(){this.checkCollisions()}getCellKey(t){const e=Math.floor(t.x/this.cellSize),i=Math.floor(t.y/this.cellSize);return new s(e,i)}getNearbyCircles(t,e){const i=[];for(let n=-1;n<=1;n++)for(let o=-1;o<=1;o++){const a=new s(n,o),r=t.add(a).toString();e.has(r)&&i.push(...e.get(r))}return i}checkCollisions(){let t=this.gameWorld.getComponents(g),e=new Map;for(const s of t){s.isActive=!1;let t=this.getCellKey(s.getCenter()).toString();e.has(t)?e.get(t).push(s):e.set(t,[s])}for(const t of e.values())for(const s of t){if(s.isStatic)continue;let t=new Set,i=this.getNearbyCircles(this.getCellKey(s.getCenter()),e);for(const e of i)s!==e&&s.collides(e)&&(s.isActive=!0,t.add(e),e.isActive=!0);for(let e of t)s.collisions.has(e)||s.getComponent(g).onCollisionEnter(e);s.collisions.clear(),s.collisions=t}}}class F extends r{name="StandaloneComponentPlugin";update(t){this.gameWorld.getAllComponents().filter((t=>t instanceof p)).map((t=>t)).forEach((e=>e.tick(t)))}}class q extends r{name="SlientPlugin";update(t){}fixedUpdate(t){}createServer(){}startup(){}}const N=new Set;document.addEventListener("keydown",(t=>{N.add(t.key.toLowerCase())})),document.addEventListener("keyup",(t=>{N.delete(t.key.toLowerCase())})),async function(t){let e=[];e.push(new x),e.push(new q),e.push(new y(N)),e.push(new P(t)),e.push(new E),e.push(new b),e.push(new $),e.push(new C),e.push(new K),e.push(new Z),e.push(new F),e.push(new I(t.getContext("2d")));let s=new H(...e);!function t(){requestAnimationFrame(t),s.tick()}()}(document.getElementById("gameCanvas"))})();