var Mira={
    bindid:1,
    classmap:{},
    ifacemap:{},
    prop_un:{writable: true,enumerable: false,configurable: true},
    pre_substr:String.prototype.substr,
    pre_match:String.prototype.match,
    pre_arrsort:Array.prototype.sort,
    substr:function(ofs,sz){return arguments.length==1?Mira.pre_substr.call(this,ofs):Mira.pre_substr.call(this,ofs,sz>=0?sz:(this.length+sz));},
    match:function(pattern){var ret=Mira.pre_match.call(this,pattern);return ret ? ret : (pattern instanceof RegExp && pattern.global) ? [] : null;},
    extend:function(d,b){
        function __() {
            Mira.un(this,'constructor',d);
        }
        __.prototype=b.prototype;
        d.prototype=new __();
        Mira.un(d.prototype,'__imps',Mira.__copy({},b.prototype.__imps));
    },
    __copy:function(dec,src){
        if (!src)
            return null;
        dec=dec || {};
        for (var i in src)
            dec[i]=src[i];
        return dec;
    },
    __hasOwnProperty:function(name,o){
        o=o ||this;
        function classHas(name,o){
            if (Object.hasOwnProperty.call(o.prototype,name))
                return true;
            var s=o.prototype.__super;
            return s==null ? null : classHas(name,s);
        }
        return (Object.hasOwnProperty.call(o,name)) || classHas(name,o.__class);
    },
    __toString:function(){
        var s=this.__className;
        var x=s.lastIndexOf('.');
        if (x!=-1)
            s=s.substring(x+1);
        return '[object '+s+']';
    },
    _class:function(o,fullName,_super){
        _super && Mira.extend(o,_super);
        if (fullName)
            Mira.classmap[fullName]=o;
        var un=Mira.un,p=o.prototype;
        _super || un(p,'toString',Mira.__toString);
        un(p,'hasOwnProperty',Mira.__hasOwnProperty);
        un(p,'__class',o);
        un(p,'__super',_super);
        un(p,'__className',fullName);
        un(o,'__super',_super);
        un(o,'__className',fullName);
        un(o,'__isclass',true);
    },
    imps:function(dec,src){
        if (!src)
            return null;
        var d=dec.__imps || Mira.un(dec,'__imps',{});
        for (var i in src) {
            d[i]=src[i];
            var c=i;
            while ((c=this.ifacemap[c]) && (c=c.extend)) {
                c=c.self;
                d[c]=true;
            }
        }
    },
    getset:function(isStatic,o,name,getfn,setfn){
        if (!isStatic) {
            getfn && Mira.un(o,'_$get_'+name,getfn);
            setfn && Mira.un(o,'_$set_'+name,setfn);
        } else {
            getfn && (o['_$GET_'+name]=getfn);
            setfn && (o['_$SET_'+name]=setfn);
        }
        if (getfn && setfn) {
            Object.defineProperty(o,name,{get:getfn,set:setfn,enumerable:false});
        } else {
            if (o.hasOwnProperty(name)) {
                var d,o2=o;
                while (!d && o2) {
                    d=Object.getOwnPropertyDescriptor(o2,name);
                    o2=Object.getPrototypeOf(o2);
                }
                if (d) {
                    getfn || (getfn=d.get);
                    setfn || (setfn=d.set);
                    Object.defineProperty(o,name,{get:getfn,set:setfn,enumerable:false});
                } else {
                    getfn && Object.defineProperty(o,name,{get:getfn,enumerable:false});
                    setfn && Object.defineProperty(o,name,{set:setfn,enumerable:false});
                }
            } else {
                getfn && Object.defineProperty(o,name,{get:getfn,enumerable:false});
                setfn && Object.defineProperty(o,name,{set:setfn,enumerable:false});
            }
        }
    },
    _static:function(_class,def){
        for (var i=0,sz=def.length;i<sz;i+=2) {
            if (def[i]=='length')
                _class.length=def[i+1].call(_class);
            else {
                function tmp() {
                    var name=def[i];
                    var getfn=def[i+1];
                    Object.defineProperty(_class,name,{
                        get:function(){delete this[name];return this[name]=getfn.call(this);},
                        set:function(v){delete this[name];this[name]=v;},enumerable: true,configurable: true});
                }
                tmp();
            }
        }
    },
    un:function(obj,name,value){
        arguments.length<3 &&(value=obj[name]);
        Mira.prop_un.value=value;
        Object.defineProperty(obj,name,Mira.prop_un);
        return value;
    },
    uns:function(obj,names){
        names.forEach(function(o){Mira.un(obj,o)});
    },
    un_proto:function(cls){
        for (var i in cls.prototype) {
            Mira.un(cls.prototype,i);
        }
    },
    init:function(){
    },
    sortonNameArray:function(array,name,options){
        (options===void 0)&& (options=0);
        var name0=name[0],type=1;
        (options==(16 | 2)) && (type=-1);
        return array.sort(function(a,b){
            if (b[name0]==a[name0]){
                for (var i=1,sz=name.length;i < sz;i++){
                    var tmp=name[i];
                    if (b[tmp]!=a[tmp])return type *(a[tmp]-b[tmp]);
                }
                return 0;
            }
            else return type *(a[name0]-b[name0]);
        });
    },
    sortonNameArray2:function(array,name,options){
        (options===void 0)&& (options=0);
        var name0=name[0],name1=name[1],type=1;
        if (options==(16 | 2))type=-1;
        return array.sort(function(a,b){
            if (b[name0]==a[name0]){
                return type *(a[name1]-b[name1]);
            }else return type *(a[name0]-b[name0]);
        });
    }
};

window.console=window.console || ({log:function(){},error:function(){}});
Error.prototype.throwError=function(){throw arguments;};
String.prototype.substr=Mira.substr;
String.prototype.match=Mira.match;
Function.prototype.BIND$ = function(o) {
    this.__$BiD___ || (this.__$BiD___ = Mira.bindid++);
    o.BIND$__ || (o.BIND$__={});
    var fn=o.BIND$__[this.__$BiD___];
    if(fn) return fn;
    return o.BIND$__[this.__$BiD___]=this.bind(o);
};
(function(defs){
    var p=Date.prototype;
    Object.defineProperty(p,'time',{get:p.getTime,set:p.setTime,enumerable:false});
    Object.defineProperty(p,'timezoneOffset',{get:p.getTimezoneOffset,enumerable:false});
    Object.defineProperty(p,'day',{get:p.getDay,enumerable:false});
    Object.defineProperty(p,'dayUTC',{get:p.getUTCDay,enumerable:false});
    for(var i=0;i<defs.length;i++){
        Object.defineProperty(p,defs[i],{get:p['get'+defs[i].charAt(0).toUpperCase()+defs[i].substr(1)],set:p['set'+defs[i].charAt(0).toUpperCase()+defs[i].substr(1)],enumerable:false})
        Object.defineProperty(p,defs[i]+"UTC",{get:p['getUTC'+defs[i].charAt(0).toUpperCase()+defs[i].substr(1)],set:p['setUTC'+defs[i].charAt(0).toUpperCase()+defs[i].substr(1)],enumerable:false})
    }
})(['date','fullYear','hours','milliseconds','minutes','month','seconds']);
Array.CASEINSENSITIVE = 1;
Array.DESCENDING = 2;
Array.NUMERIC = 16;
Array.RETURNINDEXEDARRAY = 8;
Array.UNIQUESORT = 4;
Object.defineProperty(Array.prototype,'fixed',{enumerable: false});
Mira.un(Array.prototype,'sortOn',function(name,options){
    if(name instanceof Function) return this.sort(name);
    if((name instanceof Array)){
        if(name.length==0)return this;
        if(name.length==2)return Mira.sortonNameArray2(this,name,options);
        if(name.length>2)return Mira.sortonNameArray(this,name,options);name=name[0];
    }
    if (options==16)return this.sort(function(a,b){return a[name]-b[name];});
    if (options==2)return this.sort(function(a,b){return b[name]-a[name];});
    if (options==(16 | 2))return this.sort(function(a,b){return b[name]-a[name];});
    if (options==(1 | 2)) return this.sort(function(a,b){return b[name].toString().toLowerCase()>a[name].toString().toLowerCase()?1:-1;});
    if (options==1) return this.sort(function(a,b){return a[name].toString().toLowerCase()>b[name].toString().toLowerCase()?1:-1;});
    return this.sort(function(a,b){return a[name]-b[name];});
});
Mira.un(Array.prototype,'sort',function(value){
    if(value==16) return Mira.pre_arrsort.call(this,function (a, b) {return a - b;});
    if(value==(16|2)) return Mira.pre_arrsort.call(this,function (a, b) {return b - a;});
    if(value==1) return Mira.pre_arrsort.call(this);
    return Mira.pre_arrsort.call(this,value);
});
Mira.un(Array.prototype,'insertAt',function(index,element){
    return this.splice(index,0,element);
});
Mira.un(Array.prototype,'removeAt',function(index){
    return this.splice(index,1);
});

var __un=Mira.un,__uns=Mira.uns,__static=Mira._static,__class=Mira._class,__getset=Mira.getset;

(function(cls){
    Array.name='Array';
    Boolean.name='Boolean';
    Date.name='Date';
    Error.name='Error';
    Function.name='Function';
    JSON.name='JSON';
    Math.name='Math';
    Number.name='Number';
    Object.name='Object';
    RegExp.name='RegExp';
    String.name='String';

    for(var i=0;i<cls.length;i++) {
        var c=cls[i];
        c.__isclass=true;
        Mira.classmap[c.name]=c;
    }
})([Array,Boolean,Date,Error,Function,JSON,Math,Number,Object,RegExp,String]);

function __newvec(sz,value)
{
    var d=[];
    d.length=sz;
    for(var i=0;i<sz;i++) d[i]=value;
    return d;
}

function __bind(fn,obj)
{
    return obj==null || fn==null ? null : fn.BIND$(obj);
}

function __trybind(fn,obj)
{
    return obj==null || fn==null ? null : fn.BIND$(obj);
}

function __isClass(o)
{
    return Boolean(o && o.__isclass);
}

function __isFunction(v)
{
    return typeof v=='function' && !__isClass(v);
}

function __isInt(v)
{
    return typeof v=='number' && (v|0)==v;
}

function __isUint(v)
{
    return typeof v=='number' && ((v-2147483648)|0)==v-2147483648;
}

var Class={};

function __is(o,value)
{
    if(value==int) return __isInt(o);
    if(value==uint) return __isUint(o);
    if(value==Boolean) return (typeof o=='boolean');
    if(value==String) return (typeof o=='string');
    if(value==Number) return (typeof o=='number');
    if(value==Object) return (o!=null);
    if(value==Class) return __isClass(o);
    if(!o || !value) return false;
    if(value.__interface__) value=value.__interface__;
    else if(typeof value!='string')  return (o instanceof value);
    return (o.__imps && o.__imps[value]) || (o.__class==value);
}

function __as(value,type)
{
    return __is(value,type) ? value : null;
}

function __string(value)
{
    if (value==null)
        return null;
    return String(value); 
}

function __interface(name,_super)
{
    var ins=Mira.ifacemap;
    var a=ins[name]=ins[name] || {};
    a.self=name;
    if(_super)a.extend=ins[_super]=ins[_super] || {};
    var dot=name.lastIndexOf('.')+1;
    window[name.substring(dot)]={__interface__:name};
}

function trace()
{
    var s='';
    for (var i=0;i<arguments.length;i++) {
        if (i)
            s+=' ';
        s+=arguments[i];
    }
    console.log(s);
}

var int=(function(){
    function int(n){
        return Number(n)|0;
    }

    __class(int,'int');

    int.MIN_VALUE=-2147483648;
    int.MAX_VALUE=2147483647;

    return int;
})();

var uint=(function(){
    function uint(n){
        n=Number(n)|0;
        return n>=0 ? n : n+4294967296;
    }

    __class(uint,'uint');

    uint.MIN_VALUE=0;
    uint.MAX_VALUE=4294967295;

    return uint;
})();

function getDefinitionByName(param1)
{
    param1=param1.replace("::",".");
    return Mira.classmap[param1];
}

function getQualifiedClassName(value)
{
    if (value===null)
        return 'null';
    if (value===undefined)
        return 'void';
    var cls;
    if (typeof(value)=="function") {
        if (__isClass(value)) {
            if (value.__className) {
                cls=value.__className;
            } else {
                cls=value.name;
            }
        } else {
            return 'Function';
        }
    } else if (value.__interface__) {
        cls=value.__interface__;
    } else {
        cls=value.__className ? value.__className : value.constructor.name;
    }
    var id=cls.lastIndexOf(".");
    return id>0 ? cls.substr(0,id)+"::"+cls.substr(id+1) : cls;
}

__interface('mirage.core.system.IObject');

__interface('flash.events.IEventDispatcher');

__interface('mirage.sound.IAudioPlayer','flash.events.IEventDispatcher');

__interface('flash.display.IBitmapDrawable');

__interface('flash.display.IGraphicsData');

__interface('flash.display.IGraphicsFill');

__interface('flash.display.IGraphicsPath');

__interface('flash.display.IGraphicsStroke');

__interface('flash.net.IDynamicPropertyOutput');

__interface('flash.net.IDynamicPropertyWriter');

__interface('flash.utils.IDataInput');

__interface('flash.utils.IDataOutput');

__interface('flash.utils.IExternalizable');

var Browser=(function() {
    function Browser()
    {
    }

    __class(Browser,'mirage.Browser');

    __getset(1,Browser,'frameRate',
        function()
        {
            return MainWin.instance.getFrameRate();
        },
        function(num)
        {
            MainWin.instance.setFrameRate(num);
        }
    );

    Browser.__init__=function(sprite)
    {
        window.Browser=Browser;
        Browser._driver_=new Driver(sprite);
    }

    Browser.__start__=function()
    {
        Browser._driver_.start();
        Browser._driver_.regEvent();
    }

    Browser.eval=function(str,target)
    {
        (target===void 0) && (target=null);
        target=target || window;
        return target.eval(str);
    }

    Browser._createRootCanvas_=function()
    {
        var canvas=document.createElement("canvas");
        canvas["id"]="canvas";
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
        document.body.appendChild(canvas);
        canvas.style.position='absolute';
        canvas.style.left=canvas.style.top=0;
        return canvas;
    }

    Browser.addToBody=function(htmlElement)
    {
        document.body.appendChild(htmlElement);
    }

    Browser.removeFromBody=function(htmlElement)
    {
        if (htmlElement && htmlElement.parentNode) {
            htmlElement.parentNode.removeChild(htmlElement);
        }
    }

    Browser.createHttpRequest=function()
    {
        return Browser._driver_.createHttpRequest();
    }

    Browser.setCursor=function(cursor)
    {
        Browser._driver_.cursor(cursor);
        Browser._cursors_.push(cursor);
    }

    Browser.restoreCursor=function()
    {
        if (Browser._cursors_.length==0)
            return;
        Browser._cursors_.pop();
        Browser._driver_.cursor(__string(Browser._cursors_.length>0 ? Browser._cursors_[Browser._cursors_.length-1] : "default"));
    }

    Browser._driver_=null;

    __static(Browser,[
        '_cursors_',function(){return this._cursors_=[];}
    ]);

    Browser.toString=function(){return "[class Browser]";};
    return Browser;
})();

var MainWin=(function() {
    function MainWin(mainClass)
    {
        var _$this=this;
        this._rate=60;
        this._time=0;
        this.lt=0;
        this.ft=1000/60;
        Timer.__STARTTIME__=Date.now();
        MainWin.instance=this;
        Browser.__init__(null);
        MainWin.window_as=new Window();
        Browser.__start__();
        MainWin.start();
        var rate=24;
        if (window["flashVars"]) {
            var config=window["flashVars"];
            if (config.showFps) {
                MainWin.SHOW_FPS=true;
            }
            if (config.stageWidth && config.stageHeight) {
                MainWin.setSize(config.stageWidth|0,config.stageHeight|0);
            }
            if (config.frameRate) {
                rate=config.frameRate;
            }
            if (config.embedUrl) {
                this.setFrameRate(rate);
                MainWin.loadEmbed(__string(config.embedUrl),startRun);
                return;
            }
        }
        this.setFrameRate(rate);
        startRun();
        function startRun(mmc)
        {
            (mmc===void 0) && (mmc=null);
            MainWin.mc=mmc;
            if (!MainWin.mc) {
                var Game=__as(getDefinitionByName(mainClass),Class);
                MainWin.mc=new Game();
            } else {
                Stage.stage._$loaderInfo=MainWin.mc._$loaderInfo;
            }
            MainWin.mc.name="root1";
            MainWin.run(MainWin.mc, -1, -1);
            _$this.initFrame();
            _$this.onFrame();
        }
    }

    __class(MainWin,'mirage.MainWin');
    var __proto=MainWin.prototype;

    __proto.getFrameRate=function()
    {
        return this._rate;
    }

    __proto.setFrameRate=function(rate)
    {
        this._rate=rate;
        this.ft=1000/rate;
    }

    __proto.initFrame=function()
    {
        var _$this=this;
        MainWin.requestAnimationFrame=window["requestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["oRequestAnimationFrame"] || window["msRequestAnimationFrame"];
        MainWin.cancelAnimationFrame=window["cancelAnimationFrame"] || window["msCancelAnimationFrame"] || window["mozCancelAnimationFrame"] || window["webkitCancelAnimationFrame"] || window["oCancelAnimationFrame"] || window["cancelRequestAnimationFrame"] || window["msCancelRequestAnimationFrame"] || window["mozCancelRequestAnimationFrame"] || window["oCancelRequestAnimationFrame"] || window["webkitCancelRequestAnimationFrame"];
        if (MainWin.requestAnimationFrame==null) {
            MainWin.requestAnimationFrame=function (callback) {
                return window.setTimeout(callback,1000/60);
            };
        }
        if (MainWin.cancelAnimationFrame==null) {
            MainWin.cancelAnimationFrame=function (id) {
                return window.clearTimeout(id);
            };
        }
    }

    __proto.onFrame=function()
    {
        EventManager.mgr.dispatchSystemEvent();
        var thisTime=getTimer();
        var mw=MainWin.instance;
        var advancedTime=thisTime-mw._time;
        MainWin.requestAnimationFrame.call(window,MainWin.prototype.onFrame);
        if (advancedTime+mw.lt<mw.ft)
            return;
        mw.lt=advancedTime+mw.lt-mw.ft;
        if (mw.lt>mw.ft)
            mw.lt=mw.ft;
        if (MainWin.window_as) {
            MainWin.window_as.resizeTo(window.innerWidth|0,window.innerHeight|0);
            MainWin.window_as.enterFrame();
            MainWin.doc2.render();
            MovieClip._$doFrame0();
        }
        mw._time=thisTime;
    }

    MainWin.loadEmbed=function(url,callFn)
    {
        var _$this=this;
        var ld=new Loader();
        ld.contentLoaderInfo._$isFirstSwf=true;
        ld.contentLoaderInfo.addEventListener("_$firstSwf_loaded",function (e) {
            callFn(ld.contentLoaderInfo.content);
        });
        ld.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR,function (e) {
            callFn();
        });
        ld.load(new URLRequest(url),new LoaderContext(false,ApplicationDomain.currentDomain));
    }

    MainWin.start=function()
    {
        MainWin.doc2.body=new Body();
        MainWin.window_as.resizeTo(window.innerWidth|0,window.innerHeight|0);
        EventManager.stage=Stage.stage;
    }

    MainWin.run=function(sprite,w,h)
    {
        if (MainWin.stageWidth<=0) {
            MainWin.stageWidth=w;
        }
        if (MainWin.stageHeight<=0) {
            MainWin.stageHeight=h;
        }
        if (MainWin.stageWidth>0 && MainWin.stageHeight>0)
            MainWin.doc2.size(MainWin.stageWidth,MainWin.stageHeight);
        MainWin.window_as.addEventListener(Event.RESIZE,MainWin.onResize);
        Stage.stage.setOrientationEx(MainWin.orientation);
        sprite=sprite || (new Sprite());
        if (sprite) {
            Stage.stage.addChild(sprite);
        }
    }

    MainWin.setSize=function(width,height)
    {
        MainWin.stageWidth=width;
        MainWin.stageHeight=height;
        Stage.stage.width=MainWin.stageWidth;
        Stage.stage.height=MainWin.stageHeight;
        if (MainWin.doc2.body) {
            MainWin.doc2.body.width=MainWin.stageWidth;
            MainWin.doc2.body.height=MainWin.stageHeight;
        }
    }

    MainWin.onResize=function(e)
    {
        e._$setTarget(Stage.stage);
        Stage.stage.dispatchEvent(e);
    }

    MainWin.setOrientationEx=function(value)
    {
        MainWin.orientation=value;
        Stage.stage.setOrientationEx(value);
    }

    MainWin.setAutoOrients=function(autoOrients)
    {
        (autoOrients===void 0) && (autoOrients=true);
        Stage.stage.autoOrients=autoOrients;
    }

    MainWin.instance=null;
    MainWin.window_as=null;
    MainWin.doc2=null;
    MainWin.mc=null;
    MainWin.SHOW_FPS=false;
    MainWin.orientation=1;
    MainWin.stageWidth= -1;
    MainWin.stageHeight= -1;
    MainWin.requestAnimationFrame=null;
    MainWin.cancelAnimationFrame=null;

    MainWin.toString=function(){return "[class MainWin]";};
    Mira.un_proto(MainWin);
    return MainWin;
})();

var EventDispatcher=(function() {
    function EventDispatcher(target)
    {
        this._type_=0;
        this._id_=( ++EventDispatcher.__LASTID__);
        this._private_={};
        (target===void 0) && (target=null);
    }

    __class(EventDispatcher,'flash.events.EventDispatcher');
    var __proto=EventDispatcher.prototype;
    Mira.imps(__proto,{"flash.events.IEventDispatcher":true,"mirage.core.system.IObject":true});

    __proto._$addEventListener=function(type,listener,useCapture,priority,useWeakReference)
    {
        (useCapture===void 0) && (useCapture=false);
        (priority===void 0) && (priority=0);
        (useWeakReference===void 0) && (useWeakReference=false);
        if (listener==null) {
            return null;
        }
        if (type==Event.ADDED)
            EventDispatcher._useCountADDED++;
        if (this._eventListener_==null)
            this._eventListener_=[];
        var thisType=this._eventListener_[type];
        if (!thisType)
            thisType=this._eventListener_[type]=[];
        else {
            if (thisType.length>0) {
                for (var i=0,sz=thisType.length;i<sz;i++) {
                    if (thisType[i] && thisType[i].listener==listener)
                        return thisType[i];
                }
            }
        }
        var e=EventListener.__create__(listener,useCapture,priority,useWeakReference,this);
        thisType.push(e);
        if (this!=MainWin.window_as && type==Event.ENTER_FRAME) {
            e._target_=this;
            MainWin.window_as.addEnterFrameListener(e);
        }
        return e;
    }

    __proto.addEventListener=function(type,listener,useCapture,priority,useWeakReference)
    {
        (useCapture===void 0) && (useCapture=false);
        (priority===void 0) && (priority=0);
        (useWeakReference===void 0) && (useWeakReference=false);
        this._$addEventListener(type,listener,useCapture,priority,useWeakReference);
    }

    __proto.dispatchEvent=function(event)
    {
        if (event.bubbles) {
            event._$target=this;
            var target=this;
            var ret=false;
            while (target) {
                if (target._$dispatchEvent(event)) {
                    ret=true;
                }
                target=target.parent;
            }
            return ret;
        } else {
            return this._$dispatchEvent2(event);
        }
    }

    __proto.addOneEventListener=function(type,listener)
    {
        if (this._eventListener_==null)
            this._eventListener_=[];
        var thisType=this._eventListener_[type];
        if (!thisType)
            thisType=this._eventListener_[type]=[];
        thisType.push(listener);
    }

    __proto._$dispatchEvent=function(event)
    {
        if (this._eventListener_==null)
            return false;
        var thisType;
        if (typeof event=='string') {
            thisType=this._eventListener_[__as(event,String)];
            if (!thisType)
                return false;
            event=new Event(__as(event,String));
        } else {
            thisType=this._eventListener_[event.type];
            if (!thisType)
                return false;
        }
        (thisType[ -1]==null) && (thisType[ -1]=0);
        thisType[ -1]++;
        var sz=thisType.length+0;
        var bremove=false;
        event._$target=event._$target ? event._$target : this;
        event._currentTarget_=this;
        var tmepType=sz==1 ? thisType : thisType.concat();
        for (var i=0;i<sz;i++) {
            if (!tmepType[i] || tmepType[i].run(this,event)==false)
                bremove=true;
        }
        if (bremove && thisType[ -1]==1) {
            var tsz=0;
            for (i=0,sz=thisType.length;i<sz;i++) {
                var oe=thisType[i];
                if (oe==null || oe._deleted_)
                    continue;
                thisType[tsz]=thisType[i];
                tsz++;
            }
            thisType.length=tsz;
            if (thisType.length==0)
                this._eventListener_[event.type]=null;
        }
        thisType[ -1]--;
        return true;
    }

    __proto._$dispatchEvent2=function(event)
    {
        if (this._eventListener_==null)
            return false;
        var thisType;
        if (typeof event=='string') {
            thisType=this._eventListener_[__as(event,String)];
            if (!thisType)
                return false;
            event=new Event(__as(event,String));
        } else {
            thisType=this._eventListener_[event.type];
            if (!thisType)
                return false;
        }
        (thisType[ -1]==null) && (thisType[ -1]=0);
        thisType[ -1]++;
        var sz=thisType.length+0;
        var bremove=false;
        event._$target=this;
        event._currentTarget_=this;
        var tmepType=sz==1 ? thisType : thisType.concat();
        for (var i=0;i<sz;i++) {
            if (event._type_==8) {
                event._type_=0;
                break;
            } else {
                if (!tmepType[i] || tmepType[i].run(this,event)==false)
                    bremove=true;
            }
        }
        if (bremove && thisType[ -1]==1) {
            var tsz=0;
            for (i=0,sz=thisType.length;i<sz;i++) {
                var oe=thisType[i];
                if (oe==null || oe._deleted_)
                    continue;
                thisType[tsz]=thisType[i];
                tsz++;
            }
            thisType.length=tsz;
            if (thisType.length==0)
                this._eventListener_[event.type]=null;
        }
        thisType[ -1]--;
        return true;
    }

    __proto.hasEventListener=function(type)
    {
        var b=this._eventListener_ && this._eventListener_[type]!=null && this._eventListener_[type].length>0;
        if (b) {
            var arr=this._eventListener_[type];
            var len=arr.length;
            for (var i=0;i<len;i++) {
                b=arr[i]!=null;
                if (b) {
                    break;
                }
            }
            if (!b)
                arr.length=0;
        }
        return b;
    }

    __proto.removeEventListener=function(type,listener,useCapture)
    {
        (useCapture===void 0) && (useCapture=false);
        var thisType;
        if (!this._eventListener_)
            return;
        thisType=this._eventListener_[type];
        if (thisType) {
            var len=thisType.length-1;
            for (var i=len;i> -1;i--) {
                var oe=thisType[i];
                if (oe && (oe.listener==listener)) {
                    oe.destroy();
                    thisType.splice(i,1);
                    if (type==Event.ENTER_FRAME && this!=MainWin.window_as) {
                        MainWin.window_as.removeEnterFrameListener(oe);
                    }
                }
            }
        } else {
            if (type==Event.ADDED)
                EventDispatcher._useCountADDED--;
        }
    }

    __proto.willTrigger=function(type)
    {
        return false;
    }

    __proto.evalEvent=function(event)
    {
        var listeners=this._eventListener_ ? this._eventListener_[event.type] : null;
        var numListeners=listeners==null ? 0 : listeners.length;
        if (numListeners) {
            var tmp=numListeners==1 ? listeners : listeners.concat();
            for (var i=0;i<numListeners; ++i) {
                var listener=tmp[i];
                if (!listener)
                    continue;
                event._currentTarget_=this;
                listener.run(this,event);
                if (event.stopsImmediatePropagation)
                    return true;
            }
            return event.stopsPropagation;
        } else {
            return false;
        }
    }

    __proto._removeEvents_=function()
    {
        this._eventListener_=null;
    }

    __getset(0,__proto,'deleted',
        function()
        {
            return (this._type_&EventDispatcher.TYPE_DELETED)!=0;
        },
        function(b)
        {
            if ((this._type_&EventDispatcher.TYPE_DELETED)==0) {
                this._type_|=EventDispatcher.TYPE_DELETED;
                this._eventListener_=null;
            }
        }
    );

    __getset(1,EventDispatcher,'_isOpenTypeAdded',
        function()
        {
            return EventDispatcher._useCountADDED!=0;
        }
    );

    EventDispatcher._useCountADDED=0;
    EventDispatcher.TYPE_DELETED=0x1;
    EventDispatcher.doc2=null;
    EventDispatcher.window_as=null;
    EventDispatcher.__LASTID__=0;

    __static(EventDispatcher,[
        '__NULLARRAY__',function(){return this.__NULLARRAY__=[];}
    ]);

    EventDispatcher.toString=function(){return "[class EventDispatcher]";};
    Mira.un_proto(EventDispatcher);
    return EventDispatcher;
})();

var DisplayObject=(function(_super) {
    function DisplayObject()
    {
        this._left_=0;
        this._top_=0;
        this._width_=0;
        this._height_=0;
        this._$cid=0;
        this._$depth=0;
        this._$maskDepth=0;
        this._$alpha=1;
        this._$cacheNum=0;
        this._$cacheLastNum=0;
        this._$effectFrame=0;
        this._$blendMode=BlendMode.NORMAL;
        this._transform_=Transform.__DEFAULT__;
        this._$bounds=new Rectangle();
        this._$filters=[];
        this._$globalInvMatrix=new Matrix();
        this._$globalMatrix=new Matrix();
        DisplayObject.__super.call(this);
        this._type_|=DisplayObject.TYPE_IS_VISIBLE|DisplayObject.TYPE_MOUSE_ENABLE|DisplayObject.TYPE_CACHE_DIRTY;
        this._propagateFlagsDown_(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
    }

    __class(DisplayObject,'flash.display.DisplayObject',_super);
    var __proto=DisplayObject.prototype;

    __proto.getBounds=function(targetSpace,resultRect)
    {
        (resultRect===void 0) && (resultRect=null);
        if ((targetSpace==Stage.stage) && (this._type_&DisplayObject.TYPE_BOUNDS_CHG)==0) {
            if (resultRect) {
                resultRect.copyFrom(this._$bounds);
                return resultRect;
            } else {
                return this._$bounds;
            }
        }
        if (resultRect==null)
            resultRect=new Rectangle();
        this._getBounds_(targetSpace,resultRect);
        if (targetSpace!=this) {
            if (targetSpace==this._parent_) {
                DisplayObject.HELPER_MATRIX.copyFrom(this._$getMatrixR());
            } else {
                Matrix._$mul(DisplayObject.HELPER_MATRIX,targetSpace._getInvertedConcatenatedMatrix(),this._getConcatenatedMatrix());
            }
            DisplayObject.HELPER_MATRIX._$transformBounds(resultRect);
        }
        if (targetSpace==Stage.stage) {
            this._$bounds.copyFrom(resultRect);
            this._type_&=~DisplayObject.TYPE_BOUNDS_CHG;
        }
        return resultRect;
    }

    __proto.getRect=function(value)
    {
        return this.getBounds(value);
    }

    __proto.globalToLocal=function(globalPoint,goalPoint)
    {
        (goalPoint===void 0) && (goalPoint=null);
        if (!goalPoint)
            goalPoint=new Point();
        return this._getInvertedConcatenatedMatrix()._$transformPointInPlace(globalPoint,goalPoint);
    }

    __proto.hitTestObject=function(value)
    {
        if (this.parent!=null && value!=null && value.parent!=null) {
            var currentBounds=this.getBounds(Stage.stage);
            var targetBounds=value.getBounds(Stage.stage);
            return currentBounds.intersects(targetBounds);
        }
        return false;
    }

    __proto.hitTestPoint=function(globalX,globalY,shapeFlag)
    {
        (shapeFlag===void 0) && (shapeFlag=false);
        var b=false;
        if (shapeFlag) {
            this.globalToLocal(DisplayObject.HELPER_POINT.setTo(globalX,globalY),DisplayObject.HELPER_POINT_ALT);
            b=this._hitTest_(DisplayObject.HELPER_POINT_ALT.x,DisplayObject.HELPER_POINT_ALT.y,false)!=null;
        } else {
            DisplayObject.HELPER_POINT_ALT=this.root.localToGlobal(DisplayObject.HELPER_POINT.setTo(globalX,globalY),DisplayObject.HELPER_POINT_ALT);
            b=this.getBounds(Stage.stage)._$containsHit(DisplayObject.HELPER_POINT_ALT.x,DisplayObject.HELPER_POINT_ALT.y);
        }
        return b;
    }

    __proto.localToGlobal=function(localPoint,goalPoint)
    {
        (goalPoint===void 0) && (goalPoint=null);
        if (!goalPoint)
            goalPoint=new Point();
        return this._getConcatenatedMatrix()._$transformPointInPlace(localPoint,goalPoint);
    }

    __proto._$getMatrixR=function()
    {
        if (this._transform_==Transform.__DEFAULT__) {
            (this._transform_=new Transform())._setNode_(this);
        }
        return this._transform_._$getMatrix();
    }

    __proto._$changePos=function(x,y)
    {
        if (this._left_!=x || this._top_!=y) {
            this._$doDirty();
            this._left_=x;
            this._top_=y;
            this._type_|=DisplayObject.TYPE_MATRIX_CHG;
            this._propagateFlagsDown_(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        }
    }

    __proto._$changeSize=function(w,h)
    {
        if (w!=this._width_ || h!=this._height_) {
            this._$doDirty();
            this._width_=(w>0) ? w :  -1;
            this._height_=(h>0) ? h :  -1;
            this._propagateFlagsDown_(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        }
    }

    __proto._hitTest_=function(_x,_y,checkV)
    {
        (checkV===void 0) && (checkV=true);
        if (!this.visible && checkV)
            return null;
        if (!this._checkHitMask(_x,_y)) {
            return null;
        }
        if (!this._checkHitScrollRect(_x,_y)) {
            return null;
        }
        if (this._private_._scrollRect_) {
            _x+=this._private_._scrollRect_.x;
            _y+=this._private_._scrollRect_.y;
        }
        if (this._getBounds_(this,DisplayObject.HELPER_RECTANGLET)._$containsHit(_x,_y)) {
            return this;
        } else {
            return null;
        }
    }

    __proto._checkHitMask=function(_x,_y)
    {
        if (this._mask_) {
            this._mask_.getBounds(Stage.stage,DisplayObject.HELPER_RECTANGLET);
            this._getInvertedConcatenatedMatrix()._$transformBounds(DisplayObject.HELPER_RECTANGLET);
            return DisplayObject.HELPER_RECTANGLET.containsPoint(DisplayObject.HELPER_POINT.setTo(_x,_y));
        }
        return true;
    }

    __proto._checkHitScrollRect=function(_x,_y)
    {
        if (this._private_._scrollRect_ && this._private_._scrollRect_.width!=0 && this._private_._scrollRect_.height!=0) {
            var rect=this._private_._scrollRect_.clone();
            rect.x=0;
            rect.y=0;
            return rect.containsPoint(DisplayObject.HELPER_POINT.setTo(_x,_y));
        }
        return true;
    }

    __proto._$getColorTransform=function()
    {
        if (this._transform_==Transform.__DEFAULT__ || !this._transform_._$ct || this._transform_._$ct._$noEffect)
            return null;
        var ct=this._transform_._$ct;
        return ct;
    }

    __proto._$haveEffect=function()
    {
        if ((this._$filters && this._$filters.length) || this._$getColorTransform()) {
            return true;
        }
        return false;
    }

    __proto._getBounds_=function(targetSpace,resultRect)
    {
        (resultRect===void 0) && (resultRect=null);
        if (!resultRect)
            resultRect=DisplayObject.HELPER_RECTANGLET;
        DisplayObject.HELPER_POINT.identity();
        resultRect.setTo(0,0,this._width_,this._height_);
        return resultRect;
    }

    __proto.getTransformMatrix=function(targetSpace,resultMatrix)
    {
        (resultMatrix===void 0) && (resultMatrix=null);
        var commonParent;
        var currentObject;
        if (resultMatrix)
            resultMatrix.identity();
        else
            resultMatrix=new Matrix();
        if (targetSpace==this) {
            return resultMatrix;
        } else if (targetSpace==this.parent || (targetSpace==null && this.parent==null)) {
            resultMatrix.copyFrom(this._$getMatrixR());
            return resultMatrix;
        } else if (targetSpace==null || targetSpace==this._root_) {
            resultMatrix.copyFrom(this._getConcatenatedMatrix());
            return resultMatrix;
        } else if (targetSpace.parent==this) {
            targetSpace.getTransformMatrix(this,resultMatrix);
            resultMatrix.invert();
            return resultMatrix;
        }
        Matrix._$mul(resultMatrix,targetSpace._getInvertedConcatenatedMatrix(),this._getConcatenatedMatrix());
        return resultMatrix;
    }

    __proto._getConcatenatedMatrix=function(CalculateInvertedmt)
    {
        (CalculateInvertedmt===void 0) && (CalculateInvertedmt=true);
        if (this._type_&DisplayObject.TYPE_CONCATENATEDMATRIX_CHG) {
            if (this._parent_) {
                this._parent_._getConcatenatedMatrix()._$preMultiplyInto(this._$getMatrixR(),this._$globalMatrix);
            } else {
                return this._$getMatrixR();
            }
            if (CalculateInvertedmt==true) {
                this._$globalInvMatrix=this._$globalMatrix.clone();
                this._$globalInvMatrix.invert();
            }
            this._type_&=~DisplayObject.TYPE_CONCATENATEDMATRIX_CHG;
        }
        return this._$globalMatrix;
    }

    __proto._getInvertedConcatenatedMatrix=function()
    {
        if ((this._type_&DisplayObject.TYPE_CONCATENATEDMATRIX_CHG)) {
            this._$globalInvMatrix=this._getConcatenatedMatrix(false).clone();
            this._$globalInvMatrix.invert();
            this._type_&=~DisplayObject.TYPE_CONCATENATEDMATRIX_CHG;
        }
        return this._$globalInvMatrix.clone();
    }

    __proto._propagateFlagsDown_=function(flags)
    {
        this._type_|=flags;
    }

    __proto._$stageAdd=function()
    {
        this.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
    }

    __proto._dispatchAddedEvent=function(target)
    {
        var event=new Event(Event.ADDED);
        event._$target=target;
        event.bubbles=true;
        this.dispatchEvent(event);
    }

    __proto._$stageRemove=function()
    {
        this.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE));
    }

    __proto.removeFromBody=function()
    {
        this._parent_=null;
    }

    __proto._dispatchRemovedEvent=function()
    {
        this.dispatchEvent(new Event(Event.REMOVED,true));
    }

    __proto._$destroy=function()
    {
        this._$globalMatrix=null;
        this._$globalInvMatrix=null;
        this._$bounds=null;
    }

    __proto._$miraPaint=function(ctx)
    {
        if (this._$alpha<0.01 || this._$paintBlank()) {
            return;
        }
        var preComposite=null;
        var preAlpha=2;
        this._$ctxSave=false;
        if (this._blend_) {
            preComposite=ctx.globalCompositeOperation;
            ctx.globalCompositeOperation=this._blend_;
        }
        if (this._$alpha<0.99) {
            preAlpha=ctx.globalAlpha;
            ctx.globalAlpha=this._$alpha;
        }
        if (this._mask_ && this._mask_.parent) {
            this._$doCtxSave(ctx);
            var mat=this._mask_.parent._getConcatenatedMatrix();
            var bmat=MainWin.window_as.doc2.body._$getMatrixR();
            ctx.beginPath();
            ctx.save();
            ctx.setTransform(bmat.a,bmat.b,bmat.c,bmat.d,bmat.tx,bmat.ty);
            ctx.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
            this._mask_._$paintMask(ctx);
            ctx.restore();
            ctx.clip();
        }
        var tx=this._left_;
        var ty=this._top_;
        var rect=this._private_._scrollRect_;
        if (rect) {
            tx-=rect.x;
            ty-=rect.y;
        }
        var m=this._$getMatrixR();
        if (m && m._$isTransform()) {
            this._$doCtxSave(ctx);
            ctx.transform(m.a,m.b,m.c,m.d,tx,ty);
        } else if (tx || ty) {
            this._$doCtxSave(ctx);
            ctx.translate(tx,ty);
        }
        if (rect) {
            this._$doCtxSave(ctx);
            ctx.beginPath();
            ctx.rect(rect.x,rect.y,rect.width,rect.height);
            ctx.clip();
        }
        if (DisplayObject.bRenderTrue)
            this._$doCache();
        if (this._$haveEffect()) {
            this._$paintEffect(ctx);
        } else {
            if (this._$bmpCache && !this._$bmpCache.dirty && DisplayObject.bRenderTrue) {
                if (!this._$bmpCache.draw(ctx,this)) {
                    this._type_|=DisplayObject.TYPE_CACHE_DIRTY;
                    this._$cacheNum= -1;
                    var bk=DisplayObject.bRender;
                    DisplayObject.bRender=false;
                    this._$paintThis(ctx);
                    DisplayObject.bRender=bk;
                }
            } else {
                if (BmpCache.isStaticShape(this)) {
                    if (!BmpCache.drawStaticShape(ctx,this))
                        this._$paintThis(ctx);
                } else {
                    this._$paintThis(ctx);
                }
            }
        }
        if (this._$ctxSave)
            ctx.restore();
        if (preComposite)
            ctx.globalCompositeOperation=preComposite;
        if (preAlpha!=2)
            ctx.globalAlpha=preAlpha;
    }

    __proto._$paintEffect=function(ctx)
    {
        if (this._$bmpCache && !this._$bmpCache.dirty && this._$bmpCache.needRedraw(this)) {
            this._$bmpCache.dirty=true;
        }
        this._$drawCache();
        if (this._$bmpCache.dirty) {
            this._$paintThis(ctx);
        } else {
            if (this._type_&DisplayObject.TYPE_FILTER_DIRTY) {
                if (this._$bmpCache.needUpdateEffect(this)) {
                    this._type_&=~DisplayObject.TYPE_FILTER_DIRTY;
                    this._$bmpCache.doFilter(this._$filters,this._$getColorTransform());
                    this._$bmpCache.drawFilter(ctx,this);
                } else {
                    if (this._$bmpCache.filterDirty)
                        this._$bmpCache.draw(ctx,this);
                    else
                        this._$bmpCache.drawFilter(ctx,this);
                    this._$doDirty();
                }
            } else {
                this._$bmpCache.drawFilter(ctx,this);
            }
        }
    }

    __proto._$paintBlank=function()
    {
        return false;
    }

    __proto._$paintThis=function(ctx)
    {
    }

    __proto._$paintMask=function(ctx)
    {
        this._$ctxSave=false;
        var tx=this._left_;
        var ty=this._top_;
        var m=this._$getMatrixR();
        if (m && m._$isTransform()) {
            this._$doCtxSave(ctx);
            ctx.transform(m.a,m.b,m.c,m.d,tx,ty);
        } else if (tx || ty) {
            this._$doCtxSave(ctx);
            ctx.translate(tx,ty);
        }
        var rct=this.getBounds(this);
        ctx.rect(rct.x,rct.y,rct.width,rct.height);
        if (this._$ctxSave)
            ctx.restore();
    }

    __proto._$doCtxSave=function(context)
    {
        if (!this._$ctxSave) {
            this._$ctxSave=true;
            context.save();
        }
    }

    __proto._$doDirty=function(doThis)
    {
        (doThis===void 0) && (doThis=false);
        var p=this._parent_;
        while (p) {
            p._type_|=DisplayObject.TYPE_CACHE_DIRTY;
            p=p._parent_;
        }
        if (doThis)
            this._type_|=DisplayObject.TYPE_CACHE_DIRTY;
    }

    __proto._$clearDirty=function()
    {
        this._type_&=~DisplayObject.TYPE_CACHE_DIRTY;
    }

    __proto._$doCache=function()
    {
        if (this._type_&DisplayObject.TYPE_CACHE_DIRTY) {
            this._$effectFrame=EventDispatcher.window_as.updatecount;
            if (this._$cacheNum<=0)
                 --this._$cacheNum;
            else {
                this._$cacheLastNum=this._$cacheNum;
                this._$cacheNum= -1;
            }
            this._$bmpCache && (this._$bmpCache.dirty=true);
        } else {
            if (this._$cacheNum<0)
                this._$cacheNum=1;
            else
                 ++this._$cacheNum;
        }
        this._type_&=~DisplayObject.TYPE_CACHE_DIRTY;
        if (this._$cacheNum>=3 || (this._$cacheNum>=1 && this._$cacheLastNum==0)) {
            this._$drawCache();
        }
    }

    __proto._$drawCache=function()
    {
        if (!this._$bmpCache) {
            this._$bmpCache=new BmpCache();
        }
        this._$bmpCache.cache(this);
    }

    __getset(0,__proto,'alpha',
        function()
        {
            return this._$alpha;
        },
        function(value)
        {
            if (this._$alpha!=value) {
                this._$alpha=value;
                this._$doDirty();
            }
        }
    );

    __getset(0,__proto,'blendMode',
        function()
        {
            return this._$blendMode;
        },
        function(value)
        {
            if (this._$blendMode==value)
                return;
            this._$blendMode=value;
            this._$doDirty();
            switch (value) {
            case BlendMode.ADD:
                value="lighter";
                break;
            case BlendMode.SCREEN:
                value="lighter";
                break;
            default:
                value=null;
                this._$blendMode=BlendMode.NORMAL;
                break;
            }
            this._blend_=value;
        }
    );

    __getset(0,__proto,'cacheAsBitmap',
        function()
        {
            return (this._type_&DisplayObject.TYPE_CACHE_AS_BITMAP)!=0;
        },
        function(value)
        {
            if (value)
                this._type_|=DisplayObject.TYPE_CACHE_AS_BITMAP;
            else
                this._type_&=~DisplayObject.TYPE_CACHE_AS_BITMAP;
        }
    );

    __getset(0,__proto,'filters',
        function()
        {
            if (!this._$filters)
                this._$filters=[];
            var ret=[];
            for (var i=0;i<this._$filters.length;i++) {
                ret[i]=this._$filters[i].clone();
            }
            return ret;
        },
        function(value)
        {
            this._$effectFrame=EventDispatcher.window_as.updatecount;
            if (!this._$filters)
                this._$filters=[];
            if (value) {
                this._$filters.length=value.length;
                for (var i=0;i<value.length;i++) {
                    this._$filters[i]=value[i].clone();
                }
            } else {
                this._$filters.length=0;
            }
            this._$doDirty(false);
            this._type_|=DisplayObject.TYPE_FILTER_DIRTY;
        }
    );

    __getset(0,__proto,'height',
        function()
        {
            return this._$getMatrixR()._$transformBounds(this._getBounds_(this)).height;
        },
        function(h)
        {
            if (this._height_==h)
                return;
            this.scaleY=1.0;
            var oldH=this.height;
            oldH && (this.scaleY=h/oldH);
            (this._height_!=h) && this._$changeSize(this._width_,h);
        }
    );

    __getset(0,__proto,'loaderInfo',
        function()
        {
            return this._$loaderInfo ? this._$loaderInfo : Stage.stage._$loaderInfo;
        }
    );

    __getset(0,__proto,'mask',
        function()
        {
            return this._mask_;
        },
        function(value)
        {
            if (!value) {
                if (this._mask_) {
                    this._mask_.visible=true;
                    this._mask_=null;
                }
                return;
            }
            this._mask_=value;
            this._mask_.visible=false;
            this._mask_._$maskDepth=0;
        }
    );

    __getset(0,__proto,'mouseX',
        function()
        {
            DisplayObject.HELPER_POINT.setTo(MainWin.doc2.mouseX,MainWin.doc2.mouseY);
            this.globalToLocal(DisplayObject.HELPER_POINT,DisplayObject.HELPER_POINT_ALT);
            return DisplayObject.HELPER_POINT_ALT.x;
        }
    );

    __getset(0,__proto,'mouseY',
        function()
        {
            DisplayObject.HELPER_POINT.setTo(MainWin.doc2.mouseX,MainWin.doc2.mouseY);
            this.globalToLocal(DisplayObject.HELPER_POINT,DisplayObject.HELPER_POINT_ALT);
            return DisplayObject.HELPER_POINT_ALT.y;
        }
    );

    __getset(0,__proto,'name',
        function()
        {
            return __string(this._private_._name_ || (this._private_._name_="instance"+this._id_));
        },
        function(_name)
        {
            this._private_._name_=_name;
        }
    );

    __getset(0,__proto,'parent',
        function()
        {
            return this._parent_;
        }
    );

    __getset(0,__proto,'root',
        function()
        {
            var currentObject=this;
            while (currentObject && currentObject.parent) {
                if (currentObject==MainWin.mc) {
                    return currentObject;
                }
                currentObject=currentObject.parent;
            }
            return currentObject;
        }
    );

    __getset(0,__proto,'rotation',
        function()
        {
            return this._transform_._$rotate;
        },
        function(value)
        {
            if (value!=this._transform_._$rotate) {
                this._$doDirty();
                if (this._transform_==Transform.__DEFAULT__) {
                    if (value==0)
                        return;
                    this._transform_=new Transform()._setNode_(this);
                }
                value=value%360;
                if (value>180) {
                    value=value-360;
                } else if (value< -180) {
                    value=value+360;
                }
                this._transform_._setRotation_(value);
            }
        }
    );

    __getset(0,__proto,'rotationX',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'rotationY',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'rotationZ',
        function()
        {
            return this.rotation;
        },
        function(value)
        {
            this.rotation=value;
        }
    );

    __getset(0,__proto,'scale9Grid',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'scaleX',
        function()
        {
            return this._transform_._scale_.x;
        },
        function(value)
        {
            if (value!=this._transform_._scale_.x) {
                this._$doDirty();
                if (this._transform_==Transform.__DEFAULT__) {
                    if (value==1)
                        return;
                    this._transform_=new Transform()._setNode_(this);
                }
                this._transform_._setScaleX_(value);
            }
        }
    );

    __getset(0,__proto,'scaleY',
        function()
        {
            return this._transform_._scale_.y;
        },
        function(value)
        {
            if (value!=this._transform_._scale_.y) {
                this._$doDirty();
                if (this._transform_==Transform.__DEFAULT__) {
                    if (value==1)
                        return;
                    this._transform_=new Transform()._setNode_(this);
                }
                this._transform_._setScaleY_(value);
            }
        }
    );

    __getset(0,__proto,'scaleZ',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'scrollRect',
        function()
        {
            return this._private_._scrollRect_;
        },
        function(value)
        {
            this._$doDirty();
            if (!value) {
                this._private_._scrollRect_=null;
                return;
            }
            this._private_._scrollRect_=this._private_._scrollRect_ || new Rectangle();
            this._private_._scrollRect_.setTo(value.x,value.y,value.width,value.height);
        }
    );

    __getset(0,__proto,'stage',
        function()
        {
            if (this._root_==Stage.stage)
                return Stage.stage;
            return null;
        }
    );

    __getset(0,__proto,'transform',
        function()
        {
            return this._transform_==Transform.__DEFAULT__ ? (this._transform_=new Transform()._setNode_(this)) : this._transform_;
        },
        function(value)
        {
            this._$doDirty();
            (this._transform_=value)._setNode_(this);
        }
    );

    __getset(0,__proto,'visible',
        function()
        {
            return (this._type_&DisplayObject.TYPE_IS_VISIBLE)!=0;
        },
        function(value)
        {
            if (value!=this.visible) {
                this._$doDirty();
                if (value)
                    this._type_|=DisplayObject.TYPE_IS_VISIBLE;
                else
                    this._type_&=~DisplayObject.TYPE_IS_VISIBLE;
            }
        }
    );

    __getset(0,__proto,'width',
        function()
        {
            return this._$getMatrixR()._$transformBounds(this._getBounds_(this)).width;
        },
        function(w)
        {
            if (this._width_==w)
                return;
            this.scaleX=1.0;
            var oldW=this.width;
            oldW && (this.scaleX=w/oldW);
            (this._width_!=w) && this._$changeSize(w,this._height_);
        }
    );

    __getset(0,__proto,'x',
        function()
        {
            return this._left_;
        },
        function(value)
        {
            this._$changePos(value,this._top_);
        }
    );

    __getset(0,__proto,'y',
        function()
        {
            return this._top_;
        },
        function(value)
        {
            this._$changePos(this._left_,value);
        }
    );

    __getset(0,__proto,'z',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'matrix',null,
        function(value)
        {
            if (this._transform_==Transform.__DEFAULT__) {
                if (!value._$isTransform()) {
                    this._$changePos(value.tx,value.ty);
                    return;
                }
                this._transform_=new Transform()._setNode_(this);
            }
            this._transform_.matrix=value;
        }
    );

    __getset(0,__proto,'_root_',
        function()
        {
            var currentObject=this;
            while (currentObject && currentObject.parent)
                currentObject=currentObject.parent;
            return currentObject;
        }
    );

    __getset(0,__proto,'_$ctxSave',
        function()
        {
            return (this._type_&DisplayObject.TYPE_SAVE)!=0;
        },
        function(v)
        {
            if (v)
                this._type_|=DisplayObject.TYPE_SAVE;
            else
                this._type_&=~DisplayObject.TYPE_SAVE;
        }
    );

    DisplayObject.TYPE_CREATE_FROM_TAG=0x10;
    DisplayObject.TYPE_MOUSE_CHILDREN=0x20;
    DisplayObject.TYPE_MOUSE_ENABLE=0x40;
    DisplayObject.TYPE_USEHANDCURSOR=0x80;
    DisplayObject.TYPE_MOUSE_DBCLICK_ENABLE=0x100;
    DisplayObject.TYPE_IS_VISIBLE=0x200;
    DisplayObject.TYPE_MATRIX_CHG=0x800;
    DisplayObject.TYPE_CONCATENATEDMATRIX_CHG=0x1000;
    DisplayObject.TYPE_BOUNDS_CHG=0x2000;
    DisplayObject.TYPE_SAVE=0x4000;
    DisplayObject.TYPE_CACHE_AS_BITMAP=0x8000;
    DisplayObject.TYPE_CACHE_DIRTY=0x10000;
    DisplayObject.TYPE_FILTER_DIRTY=0x20000;
    DisplayObject.bRender=false;
    DisplayObject.bRenderTrue=false;

    __static(DisplayObject,[
        'HELPER_MATRIX',function(){return this.HELPER_MATRIX=new Matrix();},
        'HELPER_POINT',function(){return this.HELPER_POINT=new Point();},
        'HELPER_POINT_ALT',function(){return this.HELPER_POINT_ALT=new Point();},
        'HELPER_RECTANGLET',function(){return this.HELPER_RECTANGLET=new Rectangle();},
        'HELPER_RECTANGLET_ALT',function(){return this.HELPER_RECTANGLET_ALT=new Rectangle();}
    ]);

    DisplayObject.toString=function(){return "[class DisplayObject]";};
    Mira.un_proto(DisplayObject);
    return DisplayObject;
})(EventDispatcher);

var Body=(function(_super) {
    function Body()
    {
        Body.__super.call(this);
    }

    __class(Body,'mirage.core.Body',_super);
    var __proto=Body.prototype;

    __proto._$miraPaint=function(context)
    {
        context.save();
        var m=this._$getMatrixR();
        if (!m || !m._$isTransform()) {
            if (Stage.stage.scaleMode!=StageScaleMode.NO_SCALE) {
                context.translate(this._left_,this._top_);
            }
        } else {
            context.transform(m.a,m.b,m.c,m.d,m.tx,m.ty);
        }
        context.beginPath();
        context.rect(0,0,Stage.stage.stageWidth,Stage.stage.stageHeight);
        context.clip();
        Stage.stage._$miraPaint(context);
        context.restore();
    }

    Body.toString=function(){return "[class Body]";};
    Mira.un_proto(Body);
    return Body;
})(DisplayObject);

var Driver=(function() {
    function Driver(sprite)
    {
        Browser.navigator=navigator;
        this._init_();
    }

    __class(Driver,'mirage.core.Driver');
    var __proto=Driver.prototype;

    __proto._init_=function()
    {
        var _$this=this;
        if (Driver._input)
            return;
        Browser.input=Driver._input=window.document.createElement("input");
        Driver._textarea=window.document.createElement("textArea");
        Driver._input.setPos=Driver._textarea.setPos=function (x,y) {
            Browser.input.style.left=x+"px";
            Browser.input.style.top=y+"px";
        };
        Driver._input.setSize=Driver._textarea.setSize=function (w,h) {
            Browser.input.style.width=w+"px";
            Browser.input.style.height=h+"px";
        };
        Driver._input.setStyle=Driver._textarea.setStyle=function (style) {
            Browser.input.style.cssText=style;
        };
        Driver._input.setFont=Driver._textarea.setFont=function (fontInfo) {
            Browser.input.style.fontFamily=fontInfo;
        };
        Driver._input.setColor=Driver._textarea.setColor=function (color) {
            Browser.input.style.color=color;
        };
        Driver._input.setOpacity=Driver._textarea.setOpacity=function (opacity) {
            Browser.input.style.opacity=opacity;
        };
        Driver._input.setFontSize=Driver._textarea.setFontSize=function (sz) {
            Browser.input.style.fontSize=sz+"px";
        };
        Driver._input.setScale=Driver._textarea.setScale=function (scalex,scaley) {
            Browser.input.style.webkitTransform="scale("+scalex+','+scaley+')';
            Browser.input.style.mozTransform="scale("+scalex+','+scaley+')';
            Browser.input.style.oTransform="scale("+scalex+','+scaley+')';
            Browser.input.style.msTransform="scale("+scalex+','+scaley+')';
        };
        Driver._input.setRotate=Driver._textarea.setRotate=function (s) {
            Browser.input.style.webkitTransform+="rotate("+s+'deg)';
            Browser.input.style.mozTransform+="rotate("+s+'deg)';
            Browser.input.style.oTransform+="rotate("+s+'deg)';
            Driver._textarea.style.msTransform+="rotate("+s+'deg)';
        };
        Driver._input.setType=Driver._textarea.setType=function (type,multiline) {
            (multiline===void 0) && (multiline=false);
            if (Driver.enableTouch()) {
                if (!multiline || type=="password") {
                    Driver._input.type=type;
                    Browser.input=Driver._input;
                } else
                    Browser.input=Driver._textarea;
            } else {
                Browser.input=(type=="password") ? Driver._input : Driver._textarea;
            }
        };
        Driver._input.setRegular=Driver._textarea.setRegular=function (value) {
            Driver._textarea.onkeyup=value;
        };
        Driver._input.setAlign=Driver._textarea.setAlign=function (align) {
            Browser.input.style.textAlign=align;
        };
        Driver._input.clear=Driver._textarea.clear=function () {
            Driver._input.value="";
            Driver._textarea.value="";
        };
        var style="-webkit-transform-origin:left top;"+"-moz-transform-origin:left top;"+"transform-origin:left top;"+"-ms-transform-origin:left top;"+"position:absolute;"+"top:-2000;"+"border:none;"+"z-index:9999;";
        if (!Driver.enableTouch()) {
            style+="background:transparent;"+"outline:none;"+"overflow:hidden;";
        }
        Browser.input.setStyle(style);
        Driver._textarea.style.cssText=style;
        Driver._textarea.style.resize="none";
        !Driver.enableTouch() && (Driver._input.type="password");
    }

    __proto.start=function()
    {
        document.body.style.cssText+='overflow:hidden;margin:0;padding:0';
    }

    __proto.attachBrowserMouseEvent=function(name,fn,type)
    {
        (type===void 0) && (type=null);
        name=name.toLowerCase();
        MainWin.doc2.canvas.addEventListener(name.substring(2,name.length),fn,false);
    }

    __proto.attachBrowserKeyEvent=function(name,fn)
    {
        var _$this=this;
        var fnnew=function (event) {
            var keyboaderEvent=new KeyboardEvent(name.substring(2));
            keyboaderEvent.keyCode=event.keyCode|0;
            if (event.keyCode>=0x41 && event.keyCode<=0x5a) {
                keyboaderEvent.charCode=uint(event.keyCode+32);
            } else {
                keyboaderEvent.charCode=event.keyCode|0;
            }
            keyboaderEvent.shiftKey=event.shiftKey;
            keyboaderEvent.ctrlKey=event.ctrlKey;
            fn(keyboaderEvent);
        };
        document[name.toLowerCase()]=fnnew;
    }

    __proto.createHttpRequest=function()
    {
        return new HttpRequest();
    }

    __proto.regEvent=function()
    {
        var _$this=this;
        var esys=EventManager.mgr;
        if (Driver.enableTouch()) {
            Driver.activateTouchEvent();
            esys.dealAccepInput=__bind(esys.dealAcceptTouchInput,esys);
            esys.enableTouch=true;
        } else {
            this.attachBrowserMouseEvent("onmouseDown",function (e) {
                esys.acceptSystemMouseEvent(e);
            });
            this.attachBrowserMouseEvent("onmouseMove",function (e) {
                esys.acceptSystemMouseEvent(e);
            });
            this.attachBrowserMouseEvent("onmouseUp",function (e) {
                esys.acceptSystemMouseEvent(e);
            });
            window.onmousewheel=document.onmousewheel=function (e) {
                esys.acceptSystemMouseEvent(e);
            };
        }
        this.attachBrowserKeyEvent("onkeyDown",function (e) {
            esys.acceptSystemKeyEvent(e);
        });
        this.attachBrowserKeyEvent("onkeyUp",function (e) {
            esys.acceptSystemKeyEvent(e);
        });
    }

    __proto.cursor=function(cursor)
    {
        document.body.style.cursor=cursor;
    }

    Driver.enableTouch=function()
    {
        return ('ontouchstart' in window);
    }

    Driver.activateTouchEvent=function()
    {
        Driver.touchActive=true;
        var target=MainWin.doc2.canvas;
        target.addEventListener("touchstart",Driver.touchstartHandler);
        target.addEventListener("touchmove",Driver.touchmoveHandler);
        target.addEventListener("touchend",Driver.touchendHandler);
        target.addEventListener("touchcancel",Driver.touchcancelHandler);
    }

    Driver.deactivateTouchEvent=function()
    {
        Driver.touchActive=false;
        var target=MainWin.doc2.canvas;
        target.removeEventListener("touchstart",Driver.touchstartHandler);
        target.removeEventListener("touchend",Driver.touchendHandler);
        target.removeEventListener("touchmove",Driver.touchmoveHandler);
        target.removeEventListener("touchcancel",Driver.touchcancelHandler);
    }

    Driver.touchstartHandler=function(e)
    {
        EventManager.mgr.acceptSystemMouseEvent(e);
    }

    Driver.touchmoveHandler=function(e)
    {
        e.type="touchmove";
        EventManager.mgr.acceptSystemMouseEvent(e);
    }

    Driver.touchendHandler=function(e)
    {
        e.type="touchend";
        EventManager.mgr.acceptSystemMouseEvent(e);
    }

    Driver.touchcancelHandler=function(e)
    {
        e.type="touchcancel";
        EventManager.mgr.acceptSystemMouseEvent(e);
    }

    Driver.touchActive=false;

    Driver.toString=function(){return "[class Driver]";};
    Mira.un_proto(Driver);
    return Driver;
})();

var MiraDocument=(function(_super) {
    function MiraDocument()
    {
        var _$this=this;
        this.drawCount=0;
        this.drawObjectCount=0;
        this._strDebugMsg_="";
        MiraDocument.__super.call(this);
        this.mouseY=this.mouseX=0;
        MainWin.doc2=MainWin.window_as.doc2=EventDispatcher.doc2=this;
        this.canvas=Browser._createRootCanvas_();
        this.baseURI=new URI(location.href);
        EventDispatcher.window_as._$addEventListener(Event.RESIZE,function () {
            var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
            if (_$this.canvas) {
                if (EventDispatcher.doc2.adapter.screenRotate==90) {
                    _$this.canvas.width=EventDispatcher.window_as.innerHeight;
                    _$this.canvas.height=EventDispatcher.window_as.innerWidth;
                } else {
                    _$this.canvas.width=EventDispatcher.window_as.innerWidth;
                    _$this.canvas.height=EventDispatcher.window_as.innerHeight;
                }
            }
        });
    }

    __class(MiraDocument,'mirage.core.MiraDocument',_super);
    var __proto=MiraDocument.prototype;

    __proto.render=function()
    {
        if (!this.canvas)
            return;
        var ctx=this.canvas.getContext("2d");
        this.drawCount=this.drawObjectCount=0;
        ctx.textBaseline="top";
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        ctx.save();
        if (this.adapter.screenRotate!=0) {
            ctx.translate(EventDispatcher.window_as.innerHeight,0);
            ctx.rotate(this.adapter.screenRotate*Math.PI/180);
        }
        DisplayObject.bRender=true;
        DisplayObject.bRenderTrue=true;
        this.body._$miraPaint(ctx);
        DisplayObject.bRender=false;
        DisplayObject.bRenderTrue=false;
        if (EventDispatcher.window_as.updatecount%30==0) {
            EventDispatcher.window_as.fps=parseInt(30000/EventDispatcher.window_as.timeAdd*10+"")/10;
            EventDispatcher.window_as.timeAdd=0;
        }
        if (!MainWin.SHOW_FPS) {
            ctx.restore();
            return;
        }
        ctx.font="normal 100 14px Arial";
        if (EventDispatcher.window_as.updatecount%1==0) {
            this._strDebugMsg_="FPS:"+EventDispatcher.window_as.fps+"/"+Browser.frameRate+" draw:"+this.drawObjectCount+"/"+this.drawCount+" "+EventDispatcher.window_as.updatecount+" "+window.innerWidth+"/"+window.innerHeight;
        }
        var dy=this.canvas.height-50;
        ctx.lineWidth=4;
        ctx.strokeStyle="#000000";
        ctx.fillStyle="#FFFF00";
        ctx.strokeText(this._strDebugMsg_,this.body._left_+10,dy+18);
        ctx.fillText(this._strDebugMsg_,this.body._left_+10,dy+18);
        ctx.restore();
    }

    __proto.setOrientationEx=function(type)
    {
        if (__isInt(type)) {
            type=type==0 ? 'portrait' : 'rotator';
        }
        if (this.adapter.autorotate!=type) {
            this.adapter.autorotate=__string(type);
            EventDispatcher.window_as.resizeTo(EventDispatcher.window_as.innerWidth,EventDispatcher.window_as.innerHeight,true);
        }
    }

    __proto.init=function()
    {
        this.adapter=new DocumentAdapter();
    }

    __proto.size=function(w,h)
    {
        Stage.stage.width=w;
        Stage.stage.height=h;
        EventDispatcher.window_as._$dispatchEvent(Event.RESIZE);
    }

    __getset(0,__proto,'baseURI',
        function()
        {
            return this._baseURI;
        },
        function(uri)
        {
            this._baseURI=uri;
        }
    );

    MiraDocument.toString=function(){return "[class MiraDocument]";};
    Mira.un_proto(MiraDocument);
    return MiraDocument;
})(EventDispatcher);

var Window=(function(_super) {
    function Window()
    {
        this.updateTime=0;
        this._width=0;
        this._height=0;
        this.mouseX=0;
        this.mouseY=0;
        this.left=0;
        this.top=0;
        this.disableMouse=false;
        this.fps=0;
        this.delay=0;
        this.timeAdd=0;
        this.updatecount=0;
        this.preUpdateTime=0;
        this._no3d_=true;
        this.preOrientation=StageOrientation.DEFAULT;
        Window.__super.call(this);
        this.scale=new Point(1,1);
        MainWin.window_as=EventDispatcher.window_as=this;
        this.doc2=MainWin.doc2=new MiraDocument();
        this.init();
        this.resizeTo(window.innerWidth|0,window.innerHeight|0);
        this.updatecount=0;
        this.updateTime=this.preUpdateTime=getTimer();
    }

    __class(Window,'mirage.core.Window',_super);
    var __proto=Window.prototype;

    __proto.init=function()
    {
        this.doc2.init();
        this._no3d_=!getDefinitionByName("flash.display3D.Context3D");
    }

    __proto.enterFrame=function()
    {
        Stage.stage.sendRender();
        this.updateTime=getTimer();
        this.delay=this.updateTime-this.preUpdateTime;
        this.timeAdd+=this.delay;
        this.preUpdateTime=this.updateTime;
        EventManager.mgr.dispatchPendingEvent();
        this._$dispatchEvent(Event.ENTER_FRAME);
        TimerCtrl.__DEFAULT__._update_(this.updateTime);
        TextField.renderTexts();
        this.updatecount++;
    }

    __proto.resizeTo=function(w,h,forceUpdate)
    {
        (forceUpdate===void 0) && (forceUpdate=false);
        if (!forceUpdate) {
            if ((this.doc2.adapter._screenRotate_==0 && this._width==w && this._height==h) || (this.doc2.adapter._screenRotate_==90 && this._height==w && this._width==h))
                return;
        }
        this.doc2.adapter._screenRotate_=0;
        this._width=w;
        this._height=h;
        this.nowOrientation=StageOrientation.DEFAULT;
        if (this._no3d_) {
            if (Stage.stage && Stage.stage.autoOrients) {
                if (this.doc2.adapter.autorotate=="rotator" && this._width<this._height) {
                    this.doc2.adapter._screenRotate_=90;
                    this._width=h;
                    this._height=w;
                    this.nowOrientation=StageOrientation.ROTATED_RIGHT;
                } else if (this.doc2.adapter.autorotate=="portrait" && this._width>this._height) {
                    this.doc2.adapter._screenRotate_=90;
                    this._width=h;
                    this._height=w;
                    this.nowOrientation=StageOrientation.ROTATED_RIGHT;
                } else {
                    this.doc2.adapter._screenRotate_=0;
                    this._width=w;
                    this._height=h;
                    this.nowOrientation=StageOrientation.DEFAULT;
                }
            } else {
                if (this.doc2.adapter.autorotate=="portrait") {
                    this.doc2.adapter._screenRotate_=90;
                    this._width=h;
                    this._height=w;
                    this.nowOrientation=StageOrientation.ROTATED_RIGHT;
                } else {
                    this.doc2.adapter._screenRotate_=0;
                    this._width=w;
                    this._height=h;
                    this.nowOrientation=StageOrientation.DEFAULT;
                }
            }
        }
        this._$dispatchEvent(Event.RESIZE);
        if (this.nowOrientation!=this.preOrientation) {
            Stage.stage.dispatchEvent(new StageOrientationEvent(StageOrientationEvent.ORIENTATION_CHANGE,true,true,this.preOrientation,this.nowOrientation));
            this.preOrientation=this.nowOrientation;
        }
    }

    __proto.addEnterFrameListener=function(e)
    {
        if (this._eventListener_==null)
            this._eventListener_=[];
        var thisType=this._eventListener_[Event.ENTER_FRAME];
        if (!thisType)
            thisType=this._eventListener_[Event.ENTER_FRAME]=[];
        thisType.push(e);
    }

    __proto.removeEnterFrameListener=function(e)
    {
        if (this._eventListener_==null || !this._eventListener_[Event.ENTER_FRAME])
            return;
        var i=this._eventListener_[Event.ENTER_FRAME].indexOf(e)|0;
        if (i!= -1) {
            this._eventListener_[Event.ENTER_FRAME].splice(i,1);
        }
    }

    __getset(0,__proto,'innerWidth',
        function()
        {
            return this._width;
        },
        function(w)
        {
            this.resizeTo(w,this._height);
        }
    );

    __getset(0,__proto,'innerHeight',
        function()
        {
            return this._height;
        },
        function(h)
        {
            this.resizeTo(this._width,h);
        }
    );

    __getset(0,__proto,'fullScreenWidth',
        function()
        {
            return window.screen.width|0;
        }
    );

    __getset(0,__proto,'fullScreenHeight',
        function()
        {
            return window.screen.height|0;
        }
    );

    Window.toString=function(){return "[class Window]";};
    Mira.un_proto(Window);
    return Window;
})(EventDispatcher);

var BmpCache=(function() {
    function BmpCache()
    {
        this.sx=1;
        this.sy=1;
        this.expandSize=0;
        this.bDirty=true;
        this.bFilterDirty=true;
        this.effectFirst= -1;
        this.rect=new Rectangle();
    }

    __class(BmpCache,'mirage.core.display.BmpCache');
    var __proto=BmpCache.prototype;

    __proto.cache=function(d)
    {
        if (this.bDirty) {
            if (!this.doCache(d))
                return;
            this.bDirty=false;
            if (d._$haveEffect() && this.needUpdateEffect(d)) {
                this.doFilter(d._$filters,d._$getColorTransform());
                d._type_&=~DisplayObject.TYPE_FILTER_DIRTY;
            } else {
                this.bFilterDirty=true;
                if (d._$haveEffect()) {
                    d._type_|=DisplayObject.TYPE_FILTER_DIRTY;
                }
            }
        }
    }

    __proto.doCache=function(d,bShape)
    {
        (bShape===void 0) && (bShape=false);
        d._getBounds_(d,this.rect);
        this.getScale(d);
        this.rect.width+=BmpCache.X_OFF*2;
        this.rect.height+=BmpCache.Y_OFF*2;
        var w=this.rect.width*this.sx;
        var h=this.rect.height*this.sy;
        if (bShape) {
            if (w>8192 || h>4096 || w*h>0x400000)
                return false;
        } else if (w>2880 || h>2880 || w*h>0x100000) {
            return false;
        }
        if (!this.canvas) {
            this.canvas=document.createElement('canvas');
            this.ctx=this.canvas.getContext("2d");
        }
        this.rect.x-=BmpCache.X_OFF;
        this.rect.y-=BmpCache.Y_OFF;
        this.rect.x=Math.floor(this.rect.x*this.sx);
        this.rect.y=Math.floor(this.rect.y*this.sy);
        this.rect.width=Math.ceil(w);
        this.rect.height=Math.ceil(h);
        this.canvas.width=this.rect.width;
        this.canvas.height=this.rect.height;
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.setTransform(this.sx,0,0,this.sy, -this.rect.x, -this.rect.y);
        var bk=DisplayObject.bRender;
        DisplayObject.bRender=false;
        d._$paintThis(this.ctx);
        DisplayObject.bRender=bk;
        return true;
    }

    __proto.draw=function(ctx,d)
    {
        BmpCache.tempCache.getScale(d);
        if (BmpCache.tempCache.sx>this.sx*1.1 || BmpCache.tempCache.sy>this.sy*1.1) {
            this.dirty=true;
            return false;
        }
        if (this.sx==1 && this.sy==1) {
            ctx.drawImage(this.canvas,this.rect.x,this.rect.y);
        } else {
            ctx.save();
            ctx.scale(1/this.sx,1/this.sy);
            ctx.drawImage(this.canvas,this.rect.x,this.rect.y);
            ctx.restore();
        }
        return true;
    }

    __proto.needRedraw=function(d)
    {
        BmpCache.tempCache.getScale(d);
        return BmpCache.tempCache.sx>this.sx*1.1 || BmpCache.tempCache.sy>this.sy*1.1;
    }

    __proto.needUpdateEffect=function(d)
    {
        if (!DisplayObject.bRender) {
            return true;
        }
        var fid=EventDispatcher.window_as.updatecount;
        if (this.effectFirst<0) {
            this.effectFirst=fid+1;
            return false;
        }
        if ((getTimer()-EventDispatcher.window_as.updateTime)*Browser.frameRate>1000) {
            if (fid==this.effectFirst) {
                 ++this.effectFirst;
            }
            return false;
        }
        if (fid==this.effectFirst) {
            return true;
        }
        var dt=fid-d._$effectFrame;
        if (dt<Browser.frameRate/5) {
            return false;
        }
        if (EventDispatcher.window_as.fps<Browser.frameRate*0.9)
            return false;
        return true;
    }

    __proto.drawFilter=function(ctx,d)
    {
        if (this.sx==1 && this.sy==1) {
            ctx.drawImage(this.filterCanvas,this.rect.x-this.expandSize,this.rect.y-this.expandSize);
        } else {
            ctx.save();
            ctx.scale(1/this.sx,1/this.sy);
            ctx.drawImage(this.filterCanvas,this.rect.x-this.expandSize,this.rect.y-this.expandSize);
            ctx.restore();
        }
    }

    __proto.doFilter=function(filters,cx)
    {
        this.filterCanvas=MiraFilter.doFilters(this.canvas,filters,cx);
        this.expandSize=MiraFilter.expandSize;
        this.bFilterDirty=false;
    }

    __proto.getScale=function(d)
    {
        var m=d._getConcatenatedMatrix();
        if (m.b==0 && m.c==0) {
            this.sx=Math.abs(m.a);
            this.sy=Math.abs(m.d);
        } else {
            this.sx=Math.sqrt(m.a*m.a+m.b*m.b);
            this.sy=Math.sqrt(m.c*m.c+m.d*m.d);
        }
        this.sx*=MainWin.doc2.body.scaleX;
        this.sy*=MainWin.doc2.body.scaleY;
    }

    __proto.dispose=function()
    {
        this.canvas=null;
        this.ctx=null;
        this.filterCanvas=null;
        this.dirty=true;
    }

    __getset(0,__proto,'dirty',
        function()
        {
            return this.bDirty;
        },
        function(v)
        {
            this.bDirty=v;
            if (this.bDirty)
                this.bFilterDirty;
        }
    );

    __getset(0,__proto,'filterDirty',
        function()
        {
            return this.bFilterDirty;
        }
    );

    BmpCache.isStaticShape=function(d)
    {
        return d._$cid && (d instanceof Shape) && !(d instanceof MorphShape);
    }

    BmpCache.drawStaticShape=function(ctx,d)
    {
        var bc=BmpCache.staticShapes[d._$cid];
        if (!bc) {
            bc=new BmpCache();
            bc.doCache(d,true);
            bc.effectFirst=EventDispatcher.window_as.updatecount;
            BmpCache.staticShapes[d._$cid]=bc;
			/*if (!bc.canvas) {
				trace("no cache shape",d._$cid);
			}*/
        } else {
            BmpCache.tempCache.getScale(d);
            if (BmpCache.tempCache.sx>bc.sx*1.1 || BmpCache.tempCache.sy>bc.sy*1.1) {
                var r=new Rectangle();
                r.copyFrom(bc.rect);
                var sx=bc.sx;
                var sy=bc.sy;
                if (bc.doCache(d,true)) {
                    bc.effectFirst=EventDispatcher.window_as.updatecount;
                } else {
                    bc.rect.copyFrom(r);
                    bc.sx=sx;
                    bc.sy=sy;
                }
            }
        }
        if (!bc.canvas)
            return false;
        bc.draw(ctx,d);
        return true;
    }

    BmpCache.X_OFF=1;
    BmpCache.Y_OFF=1;

    __static(BmpCache,[
        'staticShapes',function(){return this.staticShapes=[];},
        'tempCache',function(){return this.tempCache=new BmpCache();}
    ]);

    BmpCache.toString=function(){return "[class BmpCache]";};
    Mira.un_proto(BmpCache);
    return BmpCache;
})();

var MiraFilter=(function() {
    function MiraFilter()
    {
    }

    __class(MiraFilter,'mirage.core.display.MiraFilter');

    MiraFilter.doFilters=function(canvas,filters,cx)
    {
        if (canvas.width==0 || canvas.height==0)
            return canvas;
        MiraFilter.curCanvas=canvas;
        var dirty=false;
        MiraFilter.expand(filters);
        if (cx) {
            MiraFilter.curCanvas=MiraFilter.colorTransform(MiraFilter.curCanvas,MiraFilter.curCanvas.getContext("2d"),cx);
        }
        if (filters) {
            for (var i=0;i<filters.length;i++) {
                var filter=filters[i];
                if (filter instanceof ColorMatrixFilter) {
                    MiraFilter.curCanvas=MiraFilter.colorMatrixFilter(filter);
                    dirty=true;
                } else if (filter instanceof BlurFilter) {
                    MiraFilter.curCanvas=MiraFilter.blurFilter(filter);
                    dirty=true;
                } else if (filter instanceof GlowFilter) {
                    MiraFilter.curCanvas=MiraFilter.glowFilter(filter);
                    dirty=true;
                } else if (filter instanceof DropShadowFilter) {
                    MiraFilter.curCanvas=MiraFilter.dropShadowFilter(filter);
                    dirty=true;
                } else if (filter instanceof ConvolutionFilter) {
                    MiraFilter.curCanvas=MiraFilter.convolutionFilter(filter);
                    dirty=true;
                } else if (filter instanceof BevelFilter) {
                    MiraFilter.curCanvas=MiraFilter.bevelFilter(filter);
                    dirty=true;
                } else if (filter instanceof GradientBevelFilter) {
                    MiraFilter.curCanvas=MiraFilter.gradientBevelFilter(filter);
                    dirty=true;
                } else if (filter instanceof GradientGlowFilter) {
                    MiraFilter.curCanvas=MiraFilter.gradientGlowFilter(filter);
                    dirty=true;
                }
            }
        }
        return MiraFilter.curCanvas;
    }

    MiraFilter.expand=function(filters)
    {
        var max=0;
        for (var i=0;i<filters.length;i++) {
            var filter=filters[i];
            if (filter instanceof BlurFilter || filter instanceof GlowFilter) {
                max+=Math.max(filter.blurX,filter.blurY)*filter.quality;
            } else if (filter instanceof DropShadowFilter || filter instanceof BevelFilter || filter instanceof GradientBevelFilter || filter instanceof GradientGlowFilter) {
                max+=Math.max(filter.blurX,filter.blurY)*filter.quality+filter.distance*2;
            }
        }
        if (max>0) {
            max=Math.ceil(max);
            if (max&1)
                 ++max;
            var canvas=MiraFilter.createCanvas(MiraFilter.curCanvas.width+max,MiraFilter.curCanvas.height+max);
            var ctx=canvas.getContext("2d");
            ctx.drawImage(MiraFilter.curCanvas,max/2,max/2);
            MiraFilter.curCanvas=canvas;
        } else {
            MiraFilter.expandSize=0;
        }
        MiraFilter.expandSize=max/2;
    }

    MiraFilter.bevelFilter=function(filter)
    {
        var highlightColor=[(filter.highlightColor>>16)&0xff,(filter.highlightColor>>8)&0xff,filter.highlightColor&0xff,filter.highlightAlpha];
        var shadowColor=[(filter.shadowColor>>16)&0xff,(filter.shadowColor>>8)&0xff,filter.shadowColor&0xff,filter.shadowAlpha];
        var colors=[shadowColor,[shadowColor[0],shadowColor[1],shadowColor[2],0],[highlightColor[0],highlightColor[1],highlightColor[2],0],highlightColor];
        return MiraFilter.gradientBevel(MiraFilter.curCanvas,MiraFilter.curCanvas.getContext("2d"),colors,[0,127,128,255],filter.blurX,filter.blurY,filter.strength,filter.type,filter.angle,filter.distance,filter.knockout,filter.quality);
    }

    MiraFilter.blurFilter=function(filter)
    {
        return MiraFilter.blur(MiraFilter.curCanvas,MiraFilter.curCanvas.getContext("2d"),filter.blurX,filter.blurY,filter.quality);
    }

    MiraFilter.colorMatrixFilter=function(filter)
    {
        return MiraFilter.colorMatrix(MiraFilter.curCanvas,MiraFilter.curCanvas.getContext("2d"),filter.matrix);
    }

    MiraFilter.convolutionFilter=function(filter)
    {
        return MiraFilter.convolution(MiraFilter.curCanvas,MiraFilter.curCanvas.getContext("2d"),filter.matrix,filter.preserveAlpha);
    }

    MiraFilter.dropShadowFilter=function(filter)
    {
        var color=[(filter.color>>16)&0xff,(filter.color>>8)&0xff,filter.color&0xff,filter.alpha];
        return MiraFilter.dropShadow(MiraFilter.curCanvas,MiraFilter.curCanvas.getContext("2d"),filter.blurX,filter.blurY,filter.angle,filter.distance,color,filter.inner,filter.quality,filter.strength,filter.knockout,filter.hideObject);
    }

    MiraFilter.glowFilter=function(filter)
    {
        var color=[(filter.color>>16)&0xff,(filter.color>>8)&0xff,filter.color&0xff,filter.alpha];
        return MiraFilter.dropShadow(MiraFilter.curCanvas,MiraFilter.curCanvas.getContext("2d"),filter.blurX,filter.blurY,45,0,color,filter.inner,filter.quality,filter.strength,filter.knockout,filter.knockout);
    }

    MiraFilter.gradientBevelFilter=function(filter)
    {
        var colors=[];
        for (var i=0;i<filter.colors.length;i++) {
            var color=filter.colors[i];
            colors[i]=[(color>>16)&0xff,(color>>8)&0xff,color&0xff,filter.alphas[i]];
        }
        return MiraFilter.gradientBevel(MiraFilter.curCanvas,MiraFilter.curCanvas.getContext("2d"),colors,filter.ratios,filter.blurX,filter.blurY,filter.strength,filter.type,filter.angle,filter.distance,filter.knockout,filter.quality);
    }

    MiraFilter.gradientGlowFilter=function(filter)
    {
        var colors=[];
        for (var i=0;i<filter.colors.length;i++) {
            var color=filter.colors[i];
            colors[i]=[(color>>16)&0xff,(color>>8)&0xff,color&0xff,filter.alphas[i]];
        }
        return MiraFilter.gradientGlow(MiraFilter.curCanvas,MiraFilter.curCanvas.getContext("2d"),filter.blurX,filter.blurY,filter.angle,filter.distance,colors,filter.ratios,filter.type,filter.quality,filter.strength,filter.knockout);
    }

    MiraFilter.colorMatrix=function(canvas,ctx,m)
    {
        var pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
        var data=pixels.data;
        for (var i=0;i<data.length;i+=4) {
            var r=i;
            var g=i+1;
            var b=i+2;
            var a=i+3;
            var oR=data[r];
            var oG=data[g];
            var oB=data[b];
            var oA=data[a];
            data[r]=(m[0]*oR)+(m[1]*oG)+(m[2]*oB)+(m[3]*oA)+m[4]|0;
            data[g]=(m[5]*oR)+(m[6]*oG)+(m[7]*oB)+(m[8]*oA)+m[9]|0;
            data[b]=(m[10]*oR)+(m[11]*oG)+(m[12]*oB)+(m[13]*oA)+m[14]|0;
            data[a]=(m[15]*oR)+(m[16]*oG)+(m[17]*oB)+(m[18]*oA)+m[19]|0;
        }
        var outCanvas=MiraFilter.createCanvas(canvas.width,canvas.height);
        var outCtx=outCanvas.getContext("2d");
        outCtx.putImageData(pixels,0,0);
        return outCanvas;
    }

    MiraFilter.colorTransform=function(canvas,ctx,cx)
    {
        var pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
        var rm=cx.redMultiplier;
        var gm=cx.greenMultiplier;
        var bm=cx.blueMultiplier;
        var ro=cx.redOffset;
        var go=cx.greenOffset;
        var bo=cx.blueOffset;
        var data=pixels.data;
        for (var i=0;i<data.length;i+=4) {
            data[i]=data[i]*rm+ro|0;
            data[i+1]=data[i+1]*gm+go|0;
            data[i+2]=data[i+2]*bm+bo|0;
        }
        var outCanvas=MiraFilter.createCanvas(canvas.width,canvas.height);
        var outCtx=outCanvas.getContext("2d");
        outCtx.putImageData(pixels,0,0);
        return outCanvas;
    }

    MiraFilter.blur=function(canvas,ctx,blurX,blurY,iterations)
    {
        var imgData=ctx.getImageData(0,0,canvas.width,canvas.height);
        var data=imgData.data;
        MiraFilter._premultiply(data);
        for (var i=0;i<iterations;i++) {
            if (blurX>1)
                MiraFilter._boxBlurX(data,canvas.width,canvas.height,Math.floor(blurX/2));
            if (blurY>1)
                MiraFilter._boxBlurY(data,canvas.width,canvas.height,Math.floor(blurY/2));
        }
        MiraFilter._unpremultiply(data);
        var width=canvas.width;
        var height=canvas.height;
        var retCanvas=MiraFilter.createCanvas(width,height);
        var retImg=retCanvas.getContext("2d");
        retImg.putImageData(imgData,0,0);
        return retCanvas;
    }

    MiraFilter.dropShadow=function(canvas,src,blurX,blurY,angle,distance,color,inner,iterations,strength,knockout,hideObject)
    {
        var width=canvas.width;
        var height=canvas.height;
        var angleRad=angle/180*Math.PI;
        var moveX=(distance*Math.cos(angleRad));
        var moveY=(distance*Math.sin(angleRad));
        var retCanvas=MiraFilter.createCanvas(width,height);
        var retImg=retCanvas.getContext("2d");
        retImg.drawImage(canvas,moveX,moveY);
        var shadowId=retImg.getImageData(0,0,width,height);
        var shadow=shadowId.data;
        if (inner) {
            for (var i=0;i<shadow.length;i+=4) {
                shadow[i+3]=255-shadow[i+3];
            }
        }
        MiraFilter.blurAlpha(shadow,width,height,blurX,blurY,iterations);
        var srcPixels=src.getImageData(0,0,width,height).data;
        strength*=color[3];
        for (var i=0;i<shadow.length;i+=4) {
            var a=shadow[i+3]*strength;
            if (inner)
                a*=srcPixels[i+3]/255;
            else if (knockout)
                a*=1-srcPixels[i+3]/255;
            a|=0;
            if (a>255)
                a=255;
            shadow[i]=color[0];
            shadow[i+1]=color[1];
            shadow[i+2]=color[2];
            shadow[i+3]=a;
        }
        retImg.putImageData(shadowId,0,0);
        if (!hideObject) {
            if (!inner)
                retImg.globalCompositeOperation="source-over";
            else
                retImg.globalCompositeOperation="destination-over";
            retImg.drawImage(canvas,0,0);
        }
        return retCanvas;
    }

    MiraFilter.gradientGlow=function(canvas,src,blurX,blurY,angle,distance,colors,ratios,type,iterations,strength,knockout)
    {
        var width=canvas.width;
        var height=canvas.height;
        var gradCanvas=MiraFilter.createCanvas(256,1);
        var gradient=gradCanvas.getContext("2d");
        var grd=gradient.createLinearGradient(0,0,255,0);
        for (var s=0;s<colors.length;s++) {
            var v="rgba("+colors[s][0]+","+colors[s][1]+","+colors[s][2]+","+colors[s][3]+")";
            grd.addColorStop(ratios[s]/255,v);
        }
        gradient.fillStyle=grd;
        gradient.fillRect(0,0,256,1);
        var gradientPixels=gradient.getImageData(0,0,gradCanvas.width,gradCanvas.height).data;
        var angleRad=angle/180*Math.PI;
        var moveX=(distance*Math.cos(angleRad));
        var moveY=(distance*Math.sin(angleRad));
        var retCanvas=MiraFilter.createCanvas(width,height);
        var retImg=retCanvas.getContext("2d");
        retImg.drawImage(canvas,moveX,moveY);
        var shadowId=retImg.getImageData(0,0,width,height);
        var shadow=shadowId.data;
        MiraFilter.blurAlpha(shadow,width,height,blurX,blurY,iterations);
        var maskType=0;
        if (type==BitmapFilterType.INNER) {
            maskType=1;
        }
        if (type==BitmapFilterType.OUTER) {
            maskType=2;
        }
        var srcPixels=src.getImageData(0,0,width,height).data;
        for (var i=0;i<shadow.length;i+=4) {
            var a=shadow[i+3]*strength;
            if (maskType==1)
                a*=srcPixels[i+3]/255;
            else if (maskType==2)
                a*=1-srcPixels[i+3]/255;
            a|=0;
            if (a>255)
                a=255;
            shadow[i]=gradientPixels[a*4];
            shadow[i+1]=gradientPixels[a*4+1];
            shadow[i+2]=gradientPixels[a*4+2];
            shadow[i+3]=gradientPixels[a*4+3];
        }
        retImg.putImageData(shadowId,0,0);
        if (!knockout) {
            if (maskType==2)
                retImg.globalCompositeOperation="source-over";
            else
                retImg.globalCompositeOperation="destination-over";
            retImg.drawImage(canvas,0,0);
        }
        return retCanvas;
    }

    MiraFilter.gradientBevel=function(canvas,src,colors,ratios,blurX,blurY,strength,type,angle,distance,knockout,iterations)
    {
        var width=canvas.width;
        var height=canvas.height;
        var retCanvas=MiraFilter.createCanvas(width,height);
        var srcPixels=src.getImageData(0,0,width,height).data;
        var gradient=MiraFilter.createCanvas(512,1);
        var gg=gradient.getContext("2d");
        var grd=gg.createLinearGradient(0,0,511,0);
        for (var s=0;s<colors.length;s++) {
            var v="rgba("+colors[s][0]+","+colors[s][1]+","+colors[s][2]+","+colors[s][3]+")";
            grd.addColorStop(ratios[s]/255,v);
        }
        gg.fillStyle=grd;
        gg.globalCompositeOperation="copy";
        gg.fillRect(0,0,gradient.width,gradient.height);
        var gradientPixels=gg.getImageData(0,0,gradient.width,gradient.height).data;
        if (type!=BitmapFilterType.OUTER) {
            var hilightIm=MiraFilter.dropShadow(canvas,src,0,0,angle,distance,[255,0,0,1],true,iterations,strength,true,true);
            var shadowIm=MiraFilter.dropShadow(canvas,src,0,0,angle+180,distance,[0,0,255,1],true,iterations,strength,true,true);
            var h2=MiraFilter.createCanvas(width,height);
            var s2=MiraFilter.createCanvas(width,height);
            var hc=h2.getContext("2d");
            var sc=s2.getContext("2d");
            hc.drawImage(hilightIm,0,0);
            hc.globalCompositeOperation="destination-out";
            hc.drawImage(shadowIm,0,0);
            sc.drawImage(shadowIm,0,0);
            sc.globalCompositeOperation="destination-out";
            sc.drawImage(hilightIm,0,0);
            var shadowInner=s2;
            var hilightInner=h2;
        }
        if (type!=BitmapFilterType.INNER) {
            var hilightIm=MiraFilter.dropShadow(canvas,src,0,0,angle+180,distance,[255,0,0,1],false,iterations,strength,true,true);
            var shadowIm=MiraFilter.dropShadow(canvas,src,0,0,angle,distance,[0,0,255,1],false,iterations,strength,true,true);
            var h2=MiraFilter.createCanvas(width,height);
            var s2=MiraFilter.createCanvas(width,height);
            var hc=h2.getContext("2d");
            var sc=s2.getContext("2d");
            hc.drawImage(hilightIm,0,0);
            hc.globalCompositeOperation="destination-out";
            hc.drawImage(shadowIm,0,0);
            sc.drawImage(shadowIm,0,0);
            sc.globalCompositeOperation="destination-out";
            sc.drawImage(hilightIm,0,0);
            var shadowOuter=s2;
            var hilightOuter=h2;
        }
        var hilightIm;
        var shadowIm;
        switch (type) {
        case BitmapFilterType.OUTER:
            hilightIm=hilightOuter;
            shadowIm=shadowOuter;
            break;
        case BitmapFilterType.INNER:
            hilightIm=hilightInner;
            shadowIm=shadowInner;
            break;
        case BitmapFilterType.FULL:
            hilightIm=hilightInner;
            shadowIm=shadowInner;
            var hc=hilightIm.getContext("2d");
            hc.globalCompositeOperation="source-over";
            hc.drawImage(hilightOuter,0,0);
            var sc=shadowIm.getContext("2d");
            sc.globalCompositeOperation="source-over";
            sc.drawImage(shadowOuter,0,0);
            break;
        }
        var maskType=0;
        if (type==BitmapFilterType.INNER) {
            maskType=1;
        }
        if (type==BitmapFilterType.OUTER) {
            maskType=2;
        }
        var retImg=retCanvas.getContext("2d");
        retImg.fillStyle="#000000";
        retImg.fillRect(0,0,width,height);
        retImg.drawImage(shadowIm,0,0);
        retImg.drawImage(hilightIm,0,0);
        var retId=retImg.getImageData(0,0,width,height);
        var ret=retId.data;
        MiraFilter.blurData(ret,width,height,blurX,blurY,iterations);
        for (var i=0;i<srcPixels.length;i+=4) {
            var a=(ret[i]-ret[i+2])*strength;
            if (maskType==1)
                a*=srcPixels[i+3]/255;
            else if (maskType==2)
                a*=1-srcPixels[i+3]/255;
            a=(a+255)|0;
            if (a>510)
                a=510;
            else if (a<0)
                a=0;
            a=a*4;
            ret[i]=gradientPixels[a];
            ret[i+1]=gradientPixels[a+1];
            ret[i+2]=gradientPixels[a+2];
            ret[i+3]=gradientPixels[a+3];
        }
        retImg.putImageData(retId,0,0);
        if (!knockout) {
            if (maskType==2)
                retImg.globalCompositeOperation="source-over";
            else
                retImg.globalCompositeOperation="destination-over";
            retImg.drawImage(canvas,0,0);
        }
        return retCanvas;
    }

    MiraFilter.convolution=function(canvas,ctx,weights,opaque)
    {
        var pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
        var side=Math.round(Math.sqrt(weights.length));
        var halfSide=Math.floor(side/2);
        var src=pixels.data;
        var sw=pixels.width;
        var sh=pixels.height;
        var w=sw;
        var h=sh;
        var outCanvas=MiraFilter.createCanvas(w,h);
        var outCtx=outCanvas.getContext("2d");
        var output=outCtx.getImageData(0,0,w,h);
        var dst=output.data;
        var alphaFac=opaque ? 1 : 0;
        for (var y=0;y<h;y++) {
            for (var x=0;x<w;x++) {
                var sy=y;
                var sx=x;
                var dstOff=(y*w+x)*4;
                var r=0,g=0,b=0,a=0;
                for (var cy=0;cy<side;cy++) {
                    for (var cx=0;cx<side;cx++) {
                        var scy=sy+cy-halfSide;
                        var scx=sx+cx-halfSide;
                        if (scy>=0 && scy<sh && scx>=0 && scx<sw) {
                            var srcOff=(scy*sw+scx)*4;
                            var wt=weights[cy*side+cx];
                            r+=src[srcOff]*wt;
                            g+=src[srcOff+1]*wt;
                            b+=src[srcOff+2]*wt;
                            a+=src[srcOff+3]*wt;
                        }
                    }
                }
                dst[dstOff]=r;
                dst[dstOff+1]=g;
                dst[dstOff+2]=b;
                dst[dstOff+3]=a+alphaFac*(255-a);
            }
        }
        outCtx.putImageData(output,0,0);
        return outCanvas;
    }

    MiraFilter.blurData=function(data,width,height,blurX,blurY,iterations)
    {
        MiraFilter._premultiply(data);
        for (var i=0;i<iterations;i++) {
            if (blurX>1)
                MiraFilter._boxBlurX(data,width,height,Math.floor(blurX/2));
            if (blurY>1)
                MiraFilter._boxBlurY(data,width,height,Math.floor(blurY/2));
        }
        MiraFilter._unpremultiply(data);
    }

    MiraFilter.blurAlpha=function(data,width,height,blurX,blurY,iterations)
    {
        for (var i=0;i<iterations;i++) {
            if (blurX>1)
                MiraFilter._boxBlurXAlpha(data,width,height,Math.floor(blurX/2));
            if (blurY>1)
                MiraFilter._boxBlurYAlpha(data,width,height,Math.floor(blurY/2));
        }
    }

    MiraFilter._boxBlurXAlpha=function(pixels,w,h,radius)
    {
        var index=0;
        var newColors=[];
        for (var y=0;y<h;y++) {
            var hits=0;
            var a=0;
            for (var x= -radius*4;x<w*4;x+=4) {
                var oldPixel=x-radius*4-4;
                if (oldPixel>=0) {
                    a-=pixels[index+oldPixel+3];
                     --hits;
                }
                var newPixel=x+radius*4;
                if (newPixel<w*4) {
                    a+=pixels[index+newPixel+3];
                     ++hits;
                }
                if (x>=0) {
                    newColors[x+3]=a/hits|0;
                }
            }
            for (var p=0;p<w*4;p+=4) {
                pixels[index+p+3]=newColors[p+3];
            }
            index+=w*4;
        }
    }

    MiraFilter._boxBlurYAlpha=function(pixels,w,h,radius)
    {
        var newColors=[];
        var oldPixelOffset= -(radius+1)*w*4;
        var newPixelOffset=(radius)*w*4;
        for (var x=0;x<w*4;x+=4) {
            var hits=0;
            var a=0;
            var index= -radius*w*4+x;
            for (var y= -radius;y<h;y++) {
                var oldPixel=y-radius-1;
                if (oldPixel>=0) {
                    a-=pixels[index+oldPixelOffset+3];
                     --hits;
                }
                var newPixel=y+radius;
                if (newPixel<h) {
                    a+=pixels[index+newPixelOffset+3];
                     ++hits;
                }
                if (y>=0) {
                    newColors[4*y+3]=a/hits|0;
                }
                index+=w*4;
            }
            for (var y=0;y<h;y++) {
                pixels[y*w*4+x+3]=newColors[4*y+3];
            }
        }
    }

    MiraFilter._boxBlurX=function(pixels,w,h,radius)
    {
        var index=0;
        var newColors=[];
        for (var y=0;y<h;y++) {
            var hits=0;
            var r=0;
            var g=0;
            var b=0;
            var a=0;
            for (var x= -radius*4;x<w*4;x+=4) {
                var oldPixel=x-radius*4-4;
                if (oldPixel>=0) {
                    r-=pixels[index+oldPixel];
                    g-=pixels[index+oldPixel+1];
                    b-=pixels[index+oldPixel+2];
                    a-=pixels[index+oldPixel+3];
                     --hits;
                }
                var newPixel=x+radius*4;
                if (newPixel<w*4) {
                    r+=pixels[index+newPixel];
                    g+=pixels[index+newPixel+1];
                    b+=pixels[index+newPixel+2];
                    a+=pixels[index+newPixel+3];
                     ++hits;
                }
                if (x>=0) {
                    newColors[x]=r/hits|0;
                    newColors[x+1]=g/hits|0;
                    newColors[x+2]=b/hits|0;
                    newColors[x+3]=a/hits|0;
                }
            }
            for (var p=0;p<w*4;p+=4) {
                pixels[index+p]=newColors[p];
                pixels[index+p+1]=newColors[p+1];
                pixels[index+p+2]=newColors[p+2];
                pixels[index+p+3]=newColors[p+3];
            }
            index+=w*4;
        }
    }

    MiraFilter._boxBlurY=function(pixels,w,h,radius)
    {
        var newColors=[];
        var oldPixelOffset= -(radius+1)*w*4;
        var newPixelOffset=(radius)*w*4;
        for (var x=0;x<w*4;x+=4) {
            var hits=0;
            var r=0;
            var g=0;
            var b=0;
            var a=0;
            var index= -radius*w*4+x;
            for (var y= -radius;y<h;y++) {
                var oldPixel=y-radius-1;
                if (oldPixel>=0) {
                    r-=pixels[index+oldPixelOffset];
                    g-=pixels[index+oldPixelOffset+1];
                    b-=pixels[index+oldPixelOffset+2];
                    a-=pixels[index+oldPixelOffset+3];
                     --hits;
                }
                var newPixel=y+radius;
                if (newPixel<h) {
                    r+=pixels[index+newPixelOffset];
                    g+=pixels[index+newPixelOffset+1];
                    b+=pixels[index+newPixelOffset+2];
                    a+=pixels[index+newPixelOffset+3];
                     ++hits;
                }
                if (y>=0) {
                    newColors[4*y]=r/hits|0;
                    newColors[4*y+1]=g/hits|0;
                    newColors[4*y+2]=b/hits|0;
                    newColors[4*y+3]=a/hits|0;
                }
                index+=w*4;
            }
            for (var y=0;y<h;y++) {
                pixels[y*w*4+x]=newColors[4*y];
                pixels[y*w*4+x+1]=newColors[4*y+1];
                pixels[y*w*4+x+2]=newColors[4*y+2];
                pixels[y*w*4+x+3]=newColors[4*y+3];
            }
        }
    }

    MiraFilter.createCanvas=function(width,height)
    {
        var c=document.createElement("canvas");
        c.width=width;
        c.height=height;
        return c;
    }

    MiraFilter._premultiply=function(data)
    {
        var len=data.length;
        for (var i=0;i<len;i+=4) {
            var f=data[i+3]*0.003921569;
            data[i]=data[i]*f|0;
            data[i+1]=data[i+1]*f|0;
            data[i+2]=data[i+2]*f|0;
        }
    }

    MiraFilter._unpremultiply=function(data)
    {
        var len=data.length;
        for (var i=0;i<len;i+=4) {
            var a=data[i+3];
            if (a==0) {
                data[i]=data[i+1]=data[i+2]=0;
                continue;
            }
            if (a==255) {
                continue;
            }
            var f=255/a;
            data[i]=data[i]*f|0;
            data[i+1]=data[i+1]*f|0;
            data[i+2]=data[i+2]*f|0;
        }
    }

    MiraFilter.expandSize=0;
    MiraFilter.curCanvas=null;

    MiraFilter.toString=function(){return "[class MiraFilter]";};
    return MiraFilter;
})();

var MiraText=(function() {
    function MiraText()
    {
    }

    __class(MiraText,'mirage.core.display.MiraText');

    MiraText.drawBG=function(context,x,y,tf)
    {
        var w=tf._$viewport[2]|0,h=tf._$viewport[3]|0;
        if (tf.background) {
            context.fillStyle=tf._$backgroundColor;
            context.fillRect(x,y,w,h);
        }
        if (tf.border) {
            context.strokeStyle=tf._$borderColor;
            context.strokeRect(x,y,w,h);
        }
    }

    MiraText.printText=function(tf,context,x,y)
    {
        if (!Driver.enableTouch() && tf._$inputting)
            return;
        var numNodes=tf._$nodes.length;
        for (var j=0;j<numNodes;j++) {
            var node=tf._$nodes.getElem(j);
            if (typeof node.font=='string') {
                context.font=node.font;
            } else {
                MiraText.drawEmbedText(node,context,x,y,tf);
                continue;
            }
            context.textBaseline='top';
            context.fillStyle=node.fillStyle;
            if (node.letterSpacing) {
                var len=node.text.length|0;
                for (var i=0;i<len;i++) {
                    context.fillText(node.text.charAt(i),x+node.lettersX[i]-tf._$viewport[0],node.y+y-tf._$viewport[1]);
                }
            } else {
                context.fillText(node.text,node.x+x-tf._$viewport[0],node.y+y-tf._$viewport[1]);
            }
            if (node.underlineWidth!=0)
                MiraText.drawUnderline(context,node,x|0,y-tf._$viewport[1]|0);
        }
    }

    MiraText.strokeText=function(text,strokeColor,strokeThickness,context,x,y)
    {
        context.strokeStyle=strokeColor;
        context.lineWidth=strokeThickness;
        context.lineCap="round";
        context.strokeText(text,x,y);
    }

    MiraText.drawUnderline=function(context,node,x,y)
    {
        context.lineWidth=1;
        context.strokeStyle=node.fillStyle;
        context.beginPath();
        context.moveTo(x+node.x,y+node.underlineY);
        context.lineTo(x+node.underlineWidth+node.x,y+node.underlineY);
        context.closePath();
        context.stroke();
    }

    MiraText.drawEmbedText=function(node,context,x,y,tf)
    {
        if (!node.tg) {
            var font=node.font.face;
            var size=node.font.size;
            var color=node.font.color|0;
            var letterSpacing=node.letterSpacing|0;
            var cmds=[];
            var text=__string(node.text);
            var len=text.length;
            var offx=0;
            var offy=font._$fontAscent*size/20480;
            for (var i=0;i<len;i++) {
                var code=text.charCodeAt(i);
                var gid=font._$codeTable.indexOf(code);
                if (gid>=0) {
                    SwfParser.processFontCmd(cmds,font,color,1,gid,offx,offy,size,tf.loaderInfo);
                    if (font._$advanceTable)
                        offx+=font._$advanceTable[gid]*size/20480+letterSpacing;
                }
            }
            var tg=new TagGraphics(null);
            len=cmds.length;
            for (i=0;i<len;i++) {
                var arr=cmds[i];
                tg[arr[0]].apply(tg,arr[1]);
            }
            node.tg=tg;
        }
        node.tg._canvas_.paint(context,x+node.x-tf._$viewport[0],y+node.y-tf._$viewport[1],0,0);
    }

    MiraText.toString=function(){return "[class MiraText]";};
    return MiraText;
})();

var VirtualCanvas=(function() {
    function VirtualCanvas()
    {
        this.width=0;
        this.height=0;
        this.widthScale=1;
        this.heightScale=1;
        this._cmds_=[];
    }

    __class(VirtualCanvas,'mirage.core.display.VirtualCanvas');
    var __proto=VirtualCanvas.prototype;

    __proto.size=function(w,h)
    {
        this.width=w;
        this.height=h;
    }

    __proto.isNormal=function()
    {
        return (this.baseImage && this._cmds_.length==1);
    }

    __proto.getImage=function()
    {
        return this.baseImage;
    }

    __proto.removeImage=function()
    {
        this.baseImage=null;
    }

    __proto.drawMartixImage=function(souce,m,clipRect)
    {
        if (souce._cmds_.length==0)
            return;
        if (m.b==0 && m.c==0 && m.a>0 && m.d>0 && souce.isNormal()) {
            this.drawImage(souce.baseImage,(clipRect.x-m.tx)/m.a,(clipRect.y-m.ty)/m.d,clipRect.width/m.a,clipRect.height/m.d,clipRect.x,clipRect.y,clipRect.width,clipRect.height);
        } else {
            VirtualCanvas._DEFAULT_.clear();
            VirtualCanvas._DEFAULT_.save();
            VirtualCanvas._DEFAULT_.beginPath();
            VirtualCanvas._DEFAULT_.rect(clipRect.x,clipRect.y,clipRect.width,clipRect.height);
            VirtualCanvas._DEFAULT_.clip();
            VirtualCanvas._DEFAULT_.transform(m.a,m.b,m.c,m.d,m.tx,m.ty);
            souce.copyTo(VirtualCanvas._DEFAULT_);
            VirtualCanvas._DEFAULT_.restore();
            this.drawVCanvas([VirtualCanvas._DEFAULT_._cmds_,clipRect.x,clipRect.y,clipRect.width,clipRect.height,clipRect.x,clipRect.y,clipRect.width,clipRect.height]);
        }
    }

    __proto.drawVCanvas=function(args)
    {
        this._cmds_.push(["_drawVCanvas_",args]);
    }

    __proto.save=function()
    {
        this._cmds_.push(["_save_",null]);
    }

    __proto.restore=function()
    {
        this._cmds_.push(["_restore_",null]);
    }

    __proto.beginPath=function()
    {
        this._cmds_.push(["_beginPath_",null]);
    }

    __proto.drawImage=function()
    {
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
        var obj=args[0];
        var soucecmd=obj._cmds_;
        if (obj.width>0 && obj.width<args[3])
            args[3]=obj.width;
        if (obj.width>0 && obj.height<args[4])
            args[4]=obj.height;
        if (soucecmd) {
            if (soucecmd.length==1 && soucecmd[0][1].length==3) {
                args[0]=soucecmd[0][1][0];
                this.drawImage.apply(this,args);
                return;
            }
            var scalex=args[7]/args[3];
            var scaley=args[8]/args[4];
            VirtualCanvas._DEFAULT_.clear();
            VirtualCanvas._DEFAULT_.save();
            VirtualCanvas._DEFAULT_.translate(args[5],args[6]);
            if (args[3]<obj.width || args[4]<obj.height) {
                VirtualCanvas._DEFAULT_.beginPath();
                VirtualCanvas._DEFAULT_.rect(0,0,args[7],args[8]);
                VirtualCanvas._DEFAULT_.clip();
            }
            VirtualCanvas._DEFAULT_.scale(scalex,scaley);
            VirtualCanvas._DEFAULT_.translate( -args[1], -args[2]);
            obj.copyTo(VirtualCanvas._DEFAULT_);
            VirtualCanvas._DEFAULT_.restore();
            args[0]=VirtualCanvas._DEFAULT_._cmds_;
            this.drawVCanvas(args);
        } else {
            if (args.length==3)
                this._cmds_.push(["_drawImage3_",args]);
            else if (args.length==5)
                this._cmds_.push(["_drawImage5_",args]);
            else
                this._cmds_.push(["_drawImage9_",args]);
        }
    }

    __proto.rect=function(x,y,w,h)
    {
        this._cmds_.push(["_rect_",[x,y,w,h]]);
    }

    __proto.clip=function()
    {
        this._cmds_.push(["_clip_",null]);
    }

    __proto.scale=function(x,y)
    {
        if (x==1 && y==1)
            return;
        this._cmds_.push(["_scale_",[x,y]]);
    }

    __proto.translate=function(x,y)
    {
        if (x==0 && y==0)
            return;
        this._cmds_.push(["_translate_",[x,y]]);
    }

    __proto.transform=function(a,b,c,d,tx,ty)
    {
        this._cmds_.push(["_transform_",[a,b,c,d,tx,ty]]);
    }

    __proto.clearRect=function(x,y,w,h)
    {
        if (x==0 && y==0 && w==this.width && h==this.height) {
            this.clear();
            return;
        }
        var cmd1;
        var ex=x+w,ey=y+h;
        for (var i=0,sz=this._cmds_.length;i<sz;i++) {
            var cmd=this._cmds_[i];
            if ((cmd[0]=="_drawVCanvas_" || cmd[0]=="_drawImage9_") && (cmd1=cmd[1])[5]>=x && cmd1[6]>=y && (cmd1[5]+cmd1[7])<=ex && (cmd1[6]+cmd1[8])<=ey) {
                this._cmds_.splice(i,1);
                i--;
                sz--;
            }
        }
    }

    __proto.closePath=function()
    {
        this._cmds_.push(["_closePath_",null]);
    }

    __proto.fillStyle=function(style)
    {
        this._cmds_.push(["_fillStyle_",[style]]);
    }

    __proto.fillBitmapStyle=function(cp,bmd,repeat)
    {
        this._cmds_.push(["_fillBitmapStyle_",[cp,bmd,repeat]]);
    }

    __proto.fillGradientMatrix=function(matrix)
    {
        if (matrix)
            this._cmds_.push(["_fillGradientMatrix_",[matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty]]);
        else
            this._cmds_.push(["_fillGradientMatrix_",null]);
    }

    __proto.fillMatrix=function(matrix)
    {
        if (matrix)
            this._cmds_.push(["_fillMatrix_",[matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty]]);
        else
            this._cmds_.push(["_fillMatrix_",null]);
    }

    __proto.fillRect=function(x,y,w,h)
    {
        this._cmds_.push(["_fillRect_",[x,y,w,h]]);
    }

    __proto.strokeStyle=function(style)
    {
        this._cmds_.push(["_strokeStyle_",[style]]);
    }

    __proto.strokeBitmapStyle=function(cp,bmd,repeat)
    {
        this._cmds_.push(["_strokeBitmapStyle_",[cp,bmd,repeat]]);
    }

    __proto.stroke=function()
    {
        this._cmds_.push(["_stroke_",null]);
    }

    __proto.strokeText=function(word,x,y)
    {
        this._cmds_.push(["_strokeText_",[word,x,y]]);
    }

    __proto.fillText=function(word,x,y)
    {
        var _$this=this;
        word=word.replace(VirtualCanvas.pre,function () {
            var charMap={"\0": "0","\1": "1","\2": "2","\3": "3","\4": "4","\5": "5","\6": "6","\7": "7"};
            return __string(charMap[arguments[0]] || arguments[0]);
        });
        this._cmds_.push(["_fillText_",[word,x,y]]);
    }

    __proto.fill=function()
    {
        this._cmds_.push(["_fill_",null]);
    }

    __proto.moveTo=function(x,y)
    {
        var len=this._cmds_.length;
        if (this._cmds_[len-1][0]=="_moveTo_") {
            this._cmds_[len-1][1]=[x,y];
            return;
        }
        this._cmds_.push(["_moveTo_",[x,y]]);
    }

    __proto.lineTo=function(x,y)
    {
        this._cmds_.push(["_lineTo_",[x,y]]);
    }

    __proto.arc=function(x,y,r,sAngle,eAngle,bCounterclockwise)
    {
        this._cmds_.push(["_arc_",[x,y,r,sAngle,eAngle,bCounterclockwise]]);
    }

    __proto.arcTo=function(x1,y1,x2,y2,radium)
    {
        this._cmds_.push(["_arcTo_",[x1,y1,x2,y2,radium]]);
    }

    __proto.bezierCurveTo=function(nCPX,nCPY,nCPX2,nCPY2,nEndX,nEndY)
    {
        this._cmds_.push(["_bezierCurveTo_",[nCPX,nCPY,nCPX2,nCPY2,nEndX,nEndY]]);
    }

    __proto.quadraticCurveTo=function(left,top,width,height)
    {
        this._cmds_.push(["_quadraticCurveTo_",[left,top,width,height]]);
    }

    __proto.fillImage=function(img,x,y,w,h)
    {
        this._cmds_.push(["_drawRepeat_",[img,x,y,w,h]]);
    }

    __proto._transform_=function(context,args)
    {
        context.transform.apply(context,args);
    }

    __proto._setTransform_=function(context,args)
    {
        context.setTransform.apply(context,args);
    }

    __proto._beginPath_=function(context,args)
    {
        context.beginPath();
    }

    __proto._closePath_=function(context,args)
    {
        context.closePath();
    }

    __proto._fillStyle_=function(context,args)
    {
        context.fillStyle=args[0];
    }

    __proto._fillBitmapStyle_=function(context,args)
    {
        var bmd=args[1];
        if (bmd._$dirty) {
            args[0]=context.createPattern(bmd.getCanvas(),__string(args[2]));
        }
        context.fillStyle=args[0];
    }

    __proto._fillGradientMatrix_=function(context,args)
    {
        if (!args) {
            this._fillMatrix=null;
            return;
        }
        if (this._fillMatrix==null)
            this._fillMatrix=new Matrix();
        this._fillMatrix.a=args[0]*819.2;
        this._fillMatrix.b=args[1]*819.2;
        this._fillMatrix.c=args[2]*819.2;
        this._fillMatrix.d=args[3]*819.2;
        this._fillMatrix.tx=args[4];
        this._fillMatrix.ty=args[5];
    }

    __proto._fillMatrix_=function(context,args)
    {
        if (!args) {
            this._fillMatrix=null;
            return;
        }
        if (this._fillMatrix==null)
            this._fillMatrix=new Matrix();
        this._fillMatrix.a=args[0];
        this._fillMatrix.b=args[1];
        this._fillMatrix.c=args[2];
        this._fillMatrix.d=args[3];
        this._fillMatrix.tx=args[4];
        this._fillMatrix.ty=args[5];
    }

    __proto._globalCompositeOperation_=function(context,args)
    {
        context.globalCompositeOperation=__string(args[0]);
    }

    __proto._lineCap_=function(context,args)
    {
        context.lineCap=__string(args[0]);
    }

    __proto._lineWidth_=function(context,args)
    {
        context.lineWidth=args[0];
    }

    __proto._lineJoin_=function(context,args)
    {
        context.lineJoin=__string(args[0]);
    }

    __proto._strokeStyle_=function(context,args)
    {
        context.strokeStyle=args[0];
    }

    __proto._strokeBitmapStyle_=function(context,args)
    {
        var bmd=args[1];
        if (bmd._$dirty) {
            args[0]=context.createPattern(bmd.getCanvas(),__string(args[2]));
        }
        context.strokeStyle=args[0];
    }

    __proto._stroke_=function(context,args)
    {
        context.stroke();
    }

    __proto._translate_=function(context,args)
    {
        context.translate.apply(context,args);
    }

    __proto._scale_=function(context,args)
    {
        context.scale.apply(context,args);
    }

    __proto._save_=function(context,args)
    {
        context.save();
    }

    __proto._restore_=function(context,args)
    {
        context.restore();
    }

    __proto._strokeText_=function(context,args)
    {
        context.strokeText.apply(context,args);
    }

    __proto._fillText_=function(context,args)
    {
        context.fillText.apply(context,args);
    }

    __proto._fill_=function(context,args)
    {
        if (this._fillMatrix) {
            context.save();
            context.transform(this._fillMatrix.a,this._fillMatrix.b,this._fillMatrix.c,this._fillMatrix.d,this._fillMatrix.tx,this._fillMatrix.ty);
            context.fill();
            context.restore();
        } else {
            context.fill();
        }
    }

    __proto._moveTo_=function(context,args)
    {
        context.moveTo.apply(context,args);
    }

    __proto._lineTo_=function(context,args)
    {
        context.lineTo.apply(context,args);
    }

    __proto._arc_=function(context,array)
    {
        context.arc.apply(context,array);
    }

    __proto._arcTo_=function(context,args)
    {
        context.arcTo.apply(context,args);
    }

    __proto._bezierCurveTo_=function(context,args)
    {
        context.bezierCurveTo.apply(context,args);
    }

    __proto._quadraticCurveTo_=function(context,args)
    {
        context.quadraticCurveTo.apply(context,args);
    }

    __proto._clip_=function(context,args)
    {
        context.clip();
    }

    __proto._rect_=function(context,args)
    {
        context.rect.apply(context,args);
    }

    __proto._drawImage3_=function(context,args)
    {
        if (args[0] && args[0].bitmap)
            args[0].bitmap._$flush();
        context.drawImage.apply(context,args);
    }

    __proto._drawImage5_=function(context,args)
    {
        if (args[0] && args[0].bitmap)
            args[0].bitmap._$flush();
        context.drawImage.apply(context,args);
    }

    __proto._drawImage9_=function(context,args)
    {
        if (args[0] && args[0].bitmap)
            args[0].bitmap._$flush();
        context.drawImage.apply(context,args);
    }

    __proto._drawVCanvas_=function(context,args)
    {
        var cmds=args[0];
        for (var i=0,n=cmds.length;i<n;i++) {
            this[cmds[i][0]].call(this,context,cmds[i][1]);
        }
    }

    __proto._font_=function(context,args)
    {
        context.font=__string(args[0]);
    }

    __proto._textBaseline_=function(context,args)
    {
        context.textBaseline=__string(args[0]);
    }

    __proto.copyTo=function(to)
    {
        for (var i=0,n=this._cmds_.length;i<n;i++) {
            this[this._cmds_[i][0]].call(this,to,this._cmds_[i][1]);
        }
    }

    __proto.paint=function(context,x,y,w,h)
    {
        var hasScale=false;
        if (w>0 && h>0) {
            this.widthScale=w/this.width;
            this.heightScale=h/this.height;
            hasScale=(this.widthScale!=1 || this.heightScale!=1);
        }
        var len=this._cmds_.length;
        var b=(x==0 && y==0);
        switch (len) {
        case 0:
            return;
        case 1:
            if (hasScale)
                context.save();
            if (!b) {
                context.translate(x,y);
                hasScale && context.scale(this.widthScale,this.heightScale);
                this[this._cmds_[0][0]].call(this,context,this._cmds_[0][1]);
                context.translate( -x, -y);
            } else {
                hasScale && context.scale(this.widthScale,this.heightScale);
                this[this._cmds_[0][0]].call(this,context,this._cmds_[0][1]);
            }
            if (hasScale)
                context.restore();
            break;
        default:
            context.save();
            !b && context.translate(x,y);
            if (this.widthScale!=1 || this.heightScale!=1)
                context.scale(this.widthScale,this.heightScale);
            for (var i=0,n=this._cmds_.length;i<n;i++) {
                this[this._cmds_[i][0]].call(this,context,this._cmds_[i][1]);
            }
            var g=this["graphics"];
            if (g) {
                if (g._$hasFill && g._$pNum>=2) {
                    this._fill_(context,null);
                    if (g._$hasLineFill) {
                        this._closePath_(context,null);
                        this._stroke_(context,null);
                    }
                }
            }
            context.restore();
        }
    }

    __proto._fillRect_=function(context,args)
    {
        context.fillRect.apply(context,args);
    }

    __proto.getContext=function(type)
    {
        return this;
    }

    __proto.clear=function()
    {
        this._cmds_=[];
        this.baseImage=null;
    }

    __proto.clone=function()
    {
        var result=new VirtualCanvas();
        this.copyTo(result);
        result.baseImage=this.baseImage;
        result.width=this.width;
        result.height=this.height;
        return result;
    }

    __proto.$save=function()
    {
        this._cmds_.push(["_save_",null]);
    }

    __proto.$beginPath=function()
    {
        this._cmds_.push(["_beginPath_",null]);
    }

    __proto.$closePath=function()
    {
        this._cmds_.push(["_closePath_",null]);
    }

    __proto.$fill=function()
    {
        this._cmds_.push(["_fill_",null]);
    }

    __proto.$fillRect=function(a)
    {
        this._cmds_.push(["_fillRect_",a]);
    }

    __proto.$fillStyle=function(a)
    {
        this._cmds_.push(["_fillStyle_",a]);
    }

    __proto.$clip=function()
    {
        this._cmds_.push(["_clip_",null]);
    }

    __proto.$lineCap=function(a)
    {
        this._cmds_.push(["_lineCap_",a]);
    }

    __proto.$lineWidth=function(a)
    {
        this._cmds_.push(["_lineWidth_",a]);
    }

    __proto.$lineJoin=function(a)
    {
        this._cmds_.push(["_lineJoin_",a]);
    }

    __proto.$moveTo=function(a)
    {
        this._cmds_.push(["_moveTo_",a]);
    }

    __proto.$lineTo=function(a)
    {
        this._cmds_.push(["_lineTo_",a]);
    }

    __proto.$quadraticCurveTo=function(a)
    {
        this._cmds_.push(["_quadraticCurveTo_",a]);
    }

    __proto.$stroke=function()
    {
        this._cmds_.push(["_stroke_",null]);
    }

    __proto.$strokeStyle=function(a)
    {
        this._cmds_.push(["_strokeStyle_",a]);
    }

    __proto.$restore=function()
    {
        this._cmds_.push(["_restore_",null]);
    }

    __proto.$transform=function(a)
    {
        this._cmds_.push(["_transform_",a]);
    }

    __getset(0,__proto,'context',
        function()
        {
            return this;
        }
    );

    __getset(0,__proto,'globalCompositeOperation',null,
        function(value)
        {
            this._cmds_.push(["_globalCompositeOperation_",[value]]);
        }
    );

    __getset(0,__proto,'lineCap',null,
        function(s)
        {
            this._cmds_.push(["_lineCap_",[s]]);
        }
    );

    __getset(0,__proto,'lineWidth',null,
        function(n)
        {
            this._cmds_.push(["_lineWidth_",[n]]);
        }
    );

    __getset(0,__proto,'lineJoin',null,
        function(s)
        {
            this._cmds_.push(["_lineJoin_",[s]]);
        }
    );

    __getset(0,__proto,'font',null,
        function(f)
        {
            this._cmds_.push(["_font_",[f]]);
        }
    );

    __getset(0,__proto,'textBaseline',null,
        function(f)
        {
            this._cmds_.push(["_textBaseline_",[f]]);
        }
    );

    __static(VirtualCanvas,[
        '_DEFAULT_',function(){return this._DEFAULT_=new VirtualCanvas();},
        'pre',function(){return this.pre=new RegExp("[\0\1\2\3\4\5\6\7\8\9]","g");}
    ]);

    VirtualCanvas.toString=function(){return "[class VirtualCanvas]";};
    Mira.un_proto(VirtualCanvas);
    return VirtualCanvas;
})();

var Ajax=(function() {
    function Ajax()
    {
    }

    __class(Ajax,'mirage.core.net.Ajax');

    Ajax.onJSONDone=function(callbackFn,response,onerr)
    {
        if (response==null) {
            onerr();
            return;
        }
        callbackFn(response);
    }

    Ajax.GetJSONInBrowser=function(url,callbackFn,splitChar,onerr)
    {
        (callbackFn===void 0) && (callbackFn=null);
        (splitChar===void 0) && (splitChar='&');
        (onerr===void 0) && (onerr=null);
        var _$this=this;
        var response;
        var jsoncb=function (args) {
            response=args;
        };
        var tm='';
        if (callbackFn!=null) {
            tm=getTimer()+"";
            window['miracallback'+tm]=jsoncb;
        }
        var script=document.createElement('script');
        script.type="text/javascript";
        if (onerr!=null) {
            script.onerror=onerr;
        } else {
            script.onerror=callbackFn;
        }
        script.onload=script.onreadystatechange=function (e,isAbort) {
            var reg=new RegExp("loaded|complete");
            if (isAbort || !script.readyState || reg.test(script.readyState+"")) {
                script.onload=script.onreadystatechange=null;
                if (script.parentNode!=null) {
                }
                if (!isAbort) {
                    Ajax.onJSONDone(callbackFn,__string(response),script.onerror);
                }
            }
        };
        script.src=url+(tm!='' ? (splitChar+'callback=miracallback'+tm) : '');
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    Ajax.GetJSONInApp=function(url,callbackFn,splitChar,onerr)
    {
        (callbackFn===void 0) && (callbackFn=null);
        (splitChar===void 0) && (splitChar='&');
        (onerr===void 0) && (onerr=null);
        var _$this=this;
        var response="";
        var tm="";
        if (callbackFn!=null) {
            tm=getTimer()+"";
            window["miracallback"+tm]=function (args) {
                response=__string(args);
            };
        }
        var nurl=url+(tm!="" ? (splitChar+"callback=miracallback"+tm) : "");
        window["downloadfile"](nurl,true,function (data) {
            trace('getJson onload:'+data);
            Browser.eval(__string(data));
            Ajax.onJSONDone(callbackFn,response,null);
        },function () {
            trace('getjson error');
            Ajax.onJSONDone(null,null,onerr!=null ? onerr : callbackFn);
        });
    }

    Ajax.GetJSON=function(url,callbackFn,splitChar,onerr)
    {
        (callbackFn===void 0) && (callbackFn=null);
        (splitChar===void 0) && (splitChar='&');
        (onerr===void 0) && (onerr=null);
        return Ajax.GetJSONInBrowser(url,callbackFn,splitChar,onerr);
    }

    Ajax.toString=function(){return "[class Ajax]";};
    return Ajax;
})();

var Cookie=(function() {
    function Cookie(name)
    {
        (name===void 0) && (name=null);
        this._name=name;
    }

    __class(Cookie,'mirage.core.net.Cookie');
    var __proto=Cookie.prototype;

    __proto.clear=function()
    {
        this._data={};
        localStorage.removeItem(this._name);
    }

    __proto.close=function()
    {
    }

    __proto.flush=function(minDiskSpace)
    {
        (minDiskSpace===void 0) && (minDiskSpace=0);
        localStorage.setItem(this._name,window.JSON.stringify(this._data));
        return this._name;
    }

    __proto.send=function()
    {
        var rest=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
    }

    __proto.setDirty=function(propertyName)
    {
    }

    __proto.setProperty=function(propertyName,value)
    {
        (value===void 0) && (value=null);
        this._data[propertyName]=value;
    }

    __getset(0,__proto,'data',
        function()
        {
            return this._data;
        }
    );

    __getset(0,__proto,'fps',null,
        function(updatesPerSecond)
        {
        }
    );

    __getset(0,__proto,'client',
        function()
        {
            return null;
        },
        function(object)
        {
        }
    );

    __getset(0,__proto,'objectEncoding',
        function()
        {
            return 0;
        },
        function(version)
        {
        }
    );

    __getset(0,__proto,'size',
        function()
        {
            return 0;
        }
    );

    __getset(1,Cookie,'defaultObjectEncoding',
        function()
        {
            return 0;
        },
        function(version)
        {
        }
    );

    Cookie.deleteAll=function(url)
    {
        return 0;
    }

    Cookie.getDiskUsage=function(url)
    {
        return 0;
    }

    Cookie.getLocal=function(name,localPath,secure)
    {
        (localPath===void 0) && (localPath=null);
        (secure===void 0) && (secure=false);
        var result=new Cookie(name);
        result._data=localStorage.getItem(name) ? window.JSON.parse(localStorage.getItem(name)) : {};
        return result;
    }

    Cookie.getRemote=function(name,remotePath,persistence,secure)
    {
        (remotePath===void 0) && (remotePath=null);
        (persistence===void 0) && (persistence=false);
        (secure===void 0) && (secure=false);
        return null;
    }

    Cookie.toString=function(){return "[class Cookie]";};
    Mira.un_proto(Cookie);
    return Cookie;
})();

var FileData=(function() {
    function FileData(url,type,mirroringWith)
    {
        this.state=0;
        this.state=FileData.LOAD_STATE_NO;
        this._type_=type || FileData.TYPE_TEXT;
        this.baseURI=new URI(Method.formatUrl(url));
        if (mirroringWith) {
            if (typeof mirroringWith=='string')
                mirroringWith=FileData.getFileData(__as(mirroringWith,String));
            this.quoteFile=__as(mirroringWith,FileData);
            this.contentdata=mirroringWith.contentdata;
        }
        FileData._files[this.baseURI.url]=this;
        this._fileRead_=[];
    }

    __class(FileData,'mirage.core.net.FileData');
    var __proto=FileData.prototype;

    __proto.unload=function()
    {
        this.contentdata=null;
        delete FileData._files[this.baseURI.url];
        this._fileRead_=null;
    }

    __proto.addFileRead=function(file)
    {
        if (this.state==FileData.LOAD_STATE_LOADED)
            file.onload(this.contentdata);
        else
            this._fileRead_.push(file);
    }

    __proto.onload=function(value)
    {
        if (FileData._files[this.baseURI.url]) {
            if (this._type_==FileData.TYPE_ARRAYBUFFER) {
                if (!value)
                    return;
                var b=new ByteArray();
                b.endian=__string(value.endian);
                b.writeArrayBuffer(value);
                b.position=0;
                value=b;
            }
            this.contentdata=value;
            this.state=FileData.LOAD_STATE_LOADED;
            this._disposeLoaded_();
        }
    }

    __proto.onerror=function(e)
    {
        delete FileData._files[this.baseURI.url];
        this.state=FileData.LOAD_STATE_ERR;
        this.onerrorLoaded();
    }

    __proto.getData=function(urlrequest)
    {
        (urlrequest===void 0) && (urlrequest=null);
        var _$this=this;
        if (this.state==FileData.LOAD_STATE_LOADED)
            return this.contentdata;
        if (this.quoteFile) {
            if (this.quoteFile.state==FileData.LOAD_STATE_LOADED) {
                return this.onload(this.quoteFile.getData());
            }
            this.quoteFile.addFileRead(this);
            return null;
        }
        if (this.state==FileData.LOAD_STATE_NO || this.state==FileData.LOAD_STATE_ERR) {
            this.state=FileData.LOAD_STATE_LOADING;
            var request=Browser.createHttpRequest();
            var _this=this;
            request.onload=function (d) {
                _this.onload(d);
            };
            request.onerror=function (d) {
                _this.onerror(d);
            };
            if (this._type_=="binary") {
                this._type_=FileData.TYPE_ARRAYBUFFER;
            }
            if (urlrequest) {
                request.open(this.baseURI.url,this._type_==FileData.TYPE_ARRAYBUFFER ? FileData.TYPE_ARRAYBUFFER : null,null,true,urlrequest.method,urlrequest.data,urlrequest.requestHeaders);
            } else {
                request.open(this.baseURI.url,this._type_==FileData.TYPE_ARRAYBUFFER ? FileData.TYPE_ARRAYBUFFER : null);
            }
            return null;
        }
    }

    __proto.onerrorLoaded=function()
    {
        this.state=FileData.LOAD_STATE_LOADED;
        if (!this._fileRead_)
            return;
        for (var i=0,sz=this._fileRead_.length;i<sz;i++) {
            this._fileRead_[i].loadError(this.contentdata);
        }
        this._fileRead_=null;
    }

    __proto._disposeLoaded_=function()
    {
        this.state=FileData.LOAD_STATE_LOADED;
        for (var i=0,sz=this._fileRead_.length;i<sz;i++) {
            this._fileRead_[i].onload(this.contentdata);
        }
        this._fileRead_=null;
    }

    FileData.setFileIsLoaded=function(url,file)
    {
        url=Method.formatUrl(url);
        FileData._files[url]=file;
    }

    FileData.fileIsLoaded=function(url)
    {
        url=Method.formatUrl(url);
        return FileData._files[url]!=null;
    }

    FileData.getFileData=function(url)
    {
        url=Method.formatUrl(url);
        return FileData._files[url];
    }

    FileData.LOAD_STATE_ERR= -1;
    FileData.LOAD_STATE_NO=0;
    FileData.LOAD_STATE_RELEASE=1;
    FileData.LOAD_STATE_LOADING=2;
    FileData.LOAD_STATE_LOADED=3;
    FileData.TYPE_IMAGE="image";
    FileData.TYPE_TEXT="text";
    FileData.TYPE_ARRAYBUFFER="arraybuffer";

    __static(FileData,[
        '_files',function(){return this._files=[];}
    ]);

    FileData.toString=function(){return "[class FileData]";};
    Mira.un_proto(FileData);
    return FileData;
})();

var FileRead=(function() {
    function FileRead(url,callback,type,urlRequest)
    {
        (callback===void 0) && (callback=null);
        (type===void 0) && (type=null);
        (urlRequest===void 0) && (urlRequest=null);
        this._callBack_=callback;
        this._createFileData_(url,type);
        this.data.getData(urlRequest);
    }

    __class(FileRead,'mirage.core.net.FileRead');
    var __proto=FileRead.prototype;

    __proto._createFileData_=function(url,type)
    {
        !this.data && (this.data=new FileData(url,type,null),this.data.contentType=Method.formatUrlType(url));
        this.data.addFileRead(this);
    }

    __proto.onload=function(value)
    {
        if (this._callBack_) {
            this._callBack_.onload.call(this._callBack_.reader,this);
            this._callBack_=null;
            this.unload();
        }
    }

    __proto.loadError=function(value)
    {
        if (this._callBack_) {
            this._callBack_.unOnload.call(this._callBack_.reader,this);
            this._callBack_=null;
        }
    }

    __proto.unload=function()
    {
        this.data && this.data.unload();
        this.data=null;
    }

    __proto.load=function()
    {
        return this.data.getData();
    }

    __getset(0,__proto,'contentType',
        function()
        {
            if (this.data)
                return this.data.contentType;
            return null;
        },
        function(type)
        {
            this.data && (this.data.contentType=type);
        }
    );

    __getset(0,__proto,'loaded',
        function()
        {
            return this.data.state==FileData.LOAD_STATE_LOADED;
        }
    );

    __getset(0,__proto,'url',
        function()
        {
            return this.data.baseURI.url;
        }
    );

    __getset(0,__proto,'contentdata',
        function()
        {
            this.data.getData();
            return this.data.contentdata;
        }
    );

    __getset(0,__proto,'baseURI',
        function()
        {
            return this.data.baseURI;
        }
    );

    FileRead.toString=function(){return "[class FileRead]";};
    Mira.un_proto(FileRead);
    return FileRead;
})();

var HttpRequest=(function(_super) {
    function HttpRequest()
    {
        HttpRequest.__super.call(this);
        if (window.XMLHttpRequest) {
            this._req=new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            this._req=new ActiveXObject('Microsoft.XMLHTTP');
        }
    }

    __class(HttpRequest,'mirage.core.net.HttpRequest',_super);
    var __proto=HttpRequest.prototype;

    __proto.onRequestHandler=function(_req)
    {
        if (_req.readyState!=4) {
            return;
        }
        var data=this._responseType_ ? _req.response : _req.responseText;
        if (_req.status==200 || (_req.can200 && _req.status==0 && data!=null && data!="")) {
            if (this._callBackFunc!=null)
                this._callBackFunc(data);
            if (this.onload!=null)
                this.onload(data);
        } else if (_req.status==404) {
            if (this.onerror!=null) {
                this.onerror(_req.status);
            }
        } else {
            if (this.onerror!=null) {
                this.onerror(_req.status);
            }
        }
    }

    __proto.PostData=function(data,requestHeaders)
    {
        (requestHeaders===void 0) && (requestHeaders=null);
        if (requestHeaders && requestHeaders.length>0) {
            this._req.setRequestHeader(requestHeaders[0].name,requestHeaders[0].value);
        } else {
            this._req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        }
        var temp="";
        if (typeof data=='string') {
            temp=__string(data);
        } else {
            var obj=data;
            if (data && data.variables) {
                obj=data.variables;
            }
            for (var key2 in obj) {
                temp+=key2+"="+obj[key2]+"&";
            }
            temp=temp.substring(0,temp.length-1);
        }
        this._req.send(temp);
    }

    __proto.open=function(url,format,callBackFunc,isAsync,requestType,data,requestHeaders)
    {
        (callBackFunc===void 0) && (callBackFunc=null);
        (isAsync===void 0) && (isAsync=true);
        (requestType===void 0) && (requestType="get");
        (data===void 0) && (data=null);
        (requestHeaders===void 0) && (requestHeaders=null);
        var _$this=this;
        this._callBackFunc=callBackFunc;
        if (this._req==null)
            return false;
        try {
            this._req.onreadystatechange=function (_req) {
                _$this.onRequestHandler(this);
            };
            this._req.onerror=function (_req) {
                _$this.onerror(404);
            };
            if (requestType=="text") {
                requestType='get';
            }
            var r=this._req.open(requestType,url,isAsync);
            if (url.indexOf("file:")==0) {
                this._req.can200=true;
            } else if (url.indexOf("http:")==0) {
                this._req.can200=false;
            }
            format && (this._responseType_=__string(this._req.responseType=format));
            if (requestType.toLowerCase()=='get') {
                this._req.send();
            } else if (requestType.toLowerCase()=='post') {
                if (data && data["_byteView_"]) {
                    throw ("un support binary post now");
                } else {
                    this.PostData(data,requestHeaders);
                }
            } else {
            }
        } catch (err) {
            if (this.onerror!=null) {
                this.onerror( -1);
            }
            return false;
        }
        return true;
    }

    HttpRequest.toString=function(){return "[class HttpRequest]";};
    Mira.un_proto(HttpRequest);
    return HttpRequest;
})(EventDispatcher);

var ApplicationDomain=(function() {
    function ApplicationDomain(parentDomain,isNotSys)
    {
        this._$parentDomain=null;
        (parentDomain===void 0) && (parentDomain=null);
        (isNotSys===void 0) && (isNotSys=true);
        if (parentDomain)
            this._$parentDomain=parentDomain;
        else if (isNotSys)
            this._$parentDomain=SystemAppDomain.systemApplicationDomain;
    }

    __class(ApplicationDomain,'flash.system.ApplicationDomain');
    var __proto=ApplicationDomain.prototype;

    __proto._$getDefInDomain=function(name)
    {
        var r;
        if (this._$parentDomain) {
            r=this._$parentDomain._$getDefInDomain(name);
        }
        return r;
    }

    __proto.getDefinition=function(name)
    {
        if (!name)
            throw new Error('No public definition exists with the specified name['+name+'].');
        name=name.replace("::",".");
        var result=this._$getDefInDomain(name);
        if (!result)
            throw new Error('No public definition exists with the specified name['+name+'].');
        result.__isclass=true;
        return result;
    }

    __proto.hasDefinition=function(name)
    {
        if (!name)
            return false;
        name=name.replace("::",".");
        return Boolean(this._$getDefInDomain(name));
    }

    __proto._$addRes=function(name,data)
    {
        return true;
    }

    __proto._$delRes=function(name)
    {
    }

    __getset(0,__proto,'domainMemory',
        function()
        {
            trace('-- NATIVE flash.system.ApplicationDomain.domainMemory');
        },
        function(mem)
        {
            trace('-- NATIVE flash.system.ApplicationDomain.domainMemory');
        }
    );

    __getset(0,__proto,'parentDomain',
        function()
        {
            return this._$parentDomain;
        }
    );

    __getset(1,ApplicationDomain,'currentDomain',
        function()
        {
            if (!ApplicationDomain._$currentDomain) {
                ApplicationDomain._$currentDomain=new ApplicationDomain(SystemAppDomain.systemApplicationDomain);
            }
            return ApplicationDomain._$currentDomain;
        }
    );

    __getset(1,ApplicationDomain,'MIN_DOMAIN_MEMORY_LENGTH',
        function()
        {
            trace('-- NATIVE flash.system.ApplicationDomain.MIN_DOMAIN_MEMORY_LENGTH');
        }
    );

    ApplicationDomain._$currentDomain=null;

    ApplicationDomain.toString=function(){return "[class ApplicationDomain]";};
    Mira.un_proto(ApplicationDomain);
    return ApplicationDomain;
})();

var SystemAppDomain=(function(_super) {
    function SystemAppDomain()
    {
        SystemAppDomain.__super.call(this,null,false);
    }

    __class(SystemAppDomain,'mirage.core.system.SystemAppDomain',_super);
    var __proto=SystemAppDomain.prototype;

    __proto._$getDefInDomain=function(name)
    {
        return getDefinitionByName(name);
    }

    __proto.hasDefinition=function(name)
    {
        return Boolean(getDefinitionByName(name));
    }

    __getset(1,SystemAppDomain,'systemApplicationDomain',
        function()
        {
            return SystemAppDomain._$systemAppDomain;
        }
    );

    __static(SystemAppDomain,[
        '_$systemAppDomain',function(){return this._$systemAppDomain=new SystemAppDomain();}
    ]);

    SystemAppDomain.toString=function(){return "[class SystemAppDomain]";};
    Mira.un_proto(SystemAppDomain);
    return SystemAppDomain;
})(ApplicationDomain);

var TimerCtrl=(function() {
    function TimerCtrl()
    {
        this.ids=0;
        this._frameTimer_=[];
        this.ids=1;
        this._timers_=[];
        this._nowTime_=getTimer();
    }

    __class(TimerCtrl,'mirage.core.system.TimerCtrl');
    var __proto=TimerCtrl.prototype;

    __proto.addFrameTimer=function(listener,owner)
    {
        (owner===void 0) && (owner=null);
        var o;
        for (var i=0,sz=this._frameTimer_.length;i<sz;i++) {
            o=this._frameTimer_[i];
            if (o.deleted) {
                return o._reset_(this._nowTime_,listener,owner);
            }
        }
        o=new TimerObject(this._nowTime_,listener,owner);
        this._frameTimer_.push(o);
        return o;
    }

    __proto.removeFrameTimer=function(listener,owner)
    {
        (owner===void 0) && (owner=null);
        var o;
        for (var i=0,sz=this._frameTimer_.length;i<sz;i++) {
            o=this._frameTimer_[i];
            if (o.listener==listener) {
                this._frameTimer_.splice(i,1);
                i--;
                o.deleted=true;
                return;
            }
        }
    }

    __proto.addTimer=function(ower,fn,delay,repeartCount)
    {
        var timer;
        if (typeof fn=='string') {
        } else {
            timer=new TimerObject(this._nowTime_,__as(fn,Function),ower,delay,repeartCount);
        }
        this._timers_.push(timer);
        return timer;
    }

    __proto._update_=function(tm)
    {
        this._nowTime_=tm;
        this._updateFrameTimer_(tm);
        this._updateTimer_(tm);
    }

    __proto._updateFrameTimer_=function(time)
    {
        for (var i=0;i<this._frameTimer_.length;i++) {
            if (!this._frameTimer_[i].run(time)) {
                this._frameTimer_.splice(i,1);
                i--;
            }
        }
    }

    __proto._updateTimer_=function(time)
    {
        var hasDeleted=false,i=0;
        for (i=0;i<this._timers_.length;i++) {
            if (!this._timers_[i].run(time)) {
                hasDeleted=true;
                this._timers_.splice(i,1);
                i--;
            }
        }
        if (!hasDeleted)
            return;
        var tsz=0;
        for (i=0;i<this._timers_.length;i++) {
            if (this._timers_[i].deleted) {
                continue;
            }
            this._timers_[tsz]=this._timers_[i];
            tsz++;
        }
        this._timers_.length=tsz;
    }

    __static(TimerCtrl,[
        '__DEFAULT__',function(){return this.__DEFAULT__=new TimerCtrl();}
    ]);

    TimerCtrl.toString=function(){return "[class TimerCtrl]";};
    Mira.un_proto(TimerCtrl);
    return TimerCtrl;
})();

var DocumentAdapter=(function() {
    function DocumentAdapter()
    {
        this.autoScaleDifference=0;
        this._screenRotate_=0;
        this._autorotate_="rotator";
        this._onWindows=navigator.userAgent.indexOf("Windows")> -1;
        MainWin.window_as._$addEventListener(Event.RESIZE,__bind(this.onResize,this));
    }

    __class(DocumentAdapter,'mirage.core.utils.DocumentAdapter');
    var __proto=DocumentAdapter.prototype;

    __proto.onResize=function()
    {
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
        if (!this._onWindows && Stage.stage.focus instanceof TextField) {
            return;
        }
        var body=MainWin.doc2.body;
        if (!body)
            return;
        var window=MainWin.window_as;
        var sx=window.innerWidth/Stage.stage.width;
        var sy=window.innerHeight/Stage.stage.height;
        body.width=Stage.stage.width;
        body.height=Stage.stage.height;
        if (Math.abs(sx-1)<0.02)
            sx=1;
        if (Math.abs(sy-1)<0.02)
            sy=1;
        if (Stage.stage.scaleMode==StageScaleMode.NO_SCALE) {
            sx=1;
            sy=1;
        } else if (Stage.stage.scaleMode==StageScaleMode.NO_BORDER) {
            if (sx<sy) {
                sx=sy;
            } else {
                sy=sx;
            }
        } else if (Stage.stage.scaleMode==StageScaleMode.SHOW_ALL) {
            if (sx>sy) {
                sx=sy;
            } else {
                sy=sx;
            }
        }
        window.scale.x=sx;
        window.scale.y=sy;
        body.scaleX=sx;
        body.scaleY=sy;
        var bodyPosX=Math.floor((window.innerWidth-Stage.stage.width*sx)/2);
        var bodyPosY=Math.floor((window.innerHeight-Stage.stage.height*sy)/2);
        if (Stage.stage.align!="") {
            if (StageAlign.isTop(Stage.stage.align)) {
                bodyPosY=0;
            }
            if (StageAlign.isBottom(Stage.stage.align)) {
                bodyPosY=Math.floor(window.innerHeight-Stage.stage.height*sy);
            }
            if (StageAlign.isLeft(Stage.stage.align)) {
                bodyPosX=0;
            }
            if (StageAlign.isRight(Stage.stage.align)) {
                bodyPosX=Math.floor(window.innerWidth-Stage.stage.width*sx);
            }
        }
        body.x=bodyPosX;
        body.y=bodyPosY;
    }

    __getset(0,__proto,'autorotate',
        function()
        {
            return this._autorotate_;
        },
        function(type)
        {
            this._autorotate_=type.toLowerCase();
            MainWin.window_as._$dispatchEvent(Event.RESIZE);
        }
    );

    __getset(0,__proto,'screenRotate',
        function()
        {
            return this._screenRotate_;
        }
    );

    DocumentAdapter.toString=function(){return "[class DocumentAdapter]";};
    Mira.un_proto(DocumentAdapter);
    return DocumentAdapter;
})();

var DynamicProperties=(function() {
    function DynamicProperties(_class,fndef,set_get,htmlNeed)
    {
        this.htmlNeed=false;
        (set_get===void 0) && (set_get=null);
        (htmlNeed===void 0) && (htmlNeed=true);
        this.htmlNeed=htmlNeed;
        if (_class==null)
            return;
        var strs=DynamicProperties._regProperties.exec(fndef);
        var name=__string(strs[2]);
        this.valueTo=strs[4] ? DynamicProperties.__CALCULATORTYPE__[strs[4]] : __bind(StringMethod.strToStr,StringMethod);
        this.nameWith=set_get==null ? name : (__as(set_get,String));
        _class.prototype["??"+name]=this;
    }

    __class(DynamicProperties,'mirage.core.utils.DynamicProperties');
    var __proto=DynamicProperties.prototype;

    __proto.setValue=function(obj,data)
    {
        obj[this.nameWith]=this.valueTo(data);
    }

    __proto.getValue=function(obj)
    {
        if (!(obj instanceof AudioPlayer) && this.nameWith=="autoplay")
            return null;
        return obj[this.nameWith];
    }

    __proto.toHTML=function()
    {
        return this.htmlNeed;
    }

    DynamicProperties.reg=function(_class,fndef,set_get,htmlNeed)
    {
        (set_get===void 0) && (set_get=null);
        (htmlNeed===void 0) && (htmlNeed=true);
        if (fndef.indexOf('(')<0)
            return new DynamicProperties(_class,fndef,set_get,htmlNeed);
        else
            return new DynamicMethods(_class,fndef,set_get,htmlNeed);
    }

    __static(DynamicProperties,[
        '__CALCULATORTYPE__',function(){return this.__CALCULATORTYPE__={'s': __bind(StringMethod.strToStr,StringMethod),'i': __bind(StringMethod.toInt,StringMethod),'I': __bind(StringMethod.strToBigInt,StringMethod),'d': __bind(StringMethod.toFloat,StringMethod),'b': __bind(StringMethod.toBool,StringMethod),'t': __bind(StringMethod.strToTime,StringMethod)};},
        '_regProperties',function(){return this._regProperties=new RegExp("(\\s*)([\\w-]+)\\s*(=\\s*(\\w))?");}
    ]);

    DynamicProperties.toString=function(){return "[class DynamicProperties]";};
    Mira.un_proto(DynamicProperties);
    return DynamicProperties;
})();

var DynamicMethods=(function(_super) {
    function DynamicMethods(_class,fndef,set_get,htmlNeed)
    {
        (set_get===void 0) && (set_get=null);
        (htmlNeed===void 0) && (htmlNeed=true);
        DynamicMethods.__super.call(this,null,null,set_get,htmlNeed);
        var strs=DynamicMethods._regMethoed.exec(fndef);
        this.setName=this.getName=__string(strs[2]);
        if (set_get) {
            if (typeof set_get=='string')
                this.setName=this.getName=__as(set_get,String);
            else {
                this.setName=__string(set_get['set']);
                this.getName=__string(set_get['get']);
            }
        }
        strs[3]=strs[3].replace(DynamicMethods._string_Trim_,'');
        var str=strs[3].split(DynamicMethods._argsClip);
        this.args=[];
        for (var i=0;i<str.length;i++) {
            this.args.push(DynamicProperties.__CALCULATORTYPE__[str[i]]);
        }
        _class.prototype["??"+strs[2]]=this;
    }

    __class(DynamicMethods,'mirage.core.utils.DynamicMethods',_super);
    var __proto=DynamicMethods.prototype;

    __proto.setValue=function(obj,data)
    {
        data=data.replace(DynamicMethods._string_Trim_,'');
        var strs=data.split(DynamicMethods._argsClip);
        var max=this.args.length>strs.length ? this.args.length : strs.length;
        var min=this.args.length+strs.length-max;
        for (var i=0,sz=min|0;i<sz;i++)
            strs[i]=this.args[i](strs[i]);
        strs.splice(i,uint(max-min));
        obj[this.setName].apply(obj,strs);
    }

    __proto.getValue=function(obj)
    {
        return obj[this.getName].call(obj);
    }

    __proto.toHTML=function()
    {
        return false;
    }

    __static(DynamicMethods,[
        '_regMethoed',function(){return this._regMethoed=new RegExp("(\\s*)([\\w-]+)\\s*[(]\\s*((\\w\\s*)+)[)]");},
        '_argsClip',function(){return this._argsClip=new RegExp("\\s+");},
        '_string_Trim_',function(){return this._string_Trim_=new RegExp("(^\\s*)|(\\s*$)","g");}
    ]);

    DynamicMethods.toString=function(){return "[class DynamicMethods]";};
    Mira.un_proto(DynamicMethods);
    return DynamicMethods;
})(DynamicProperties);

var MatrixUtil=(function() {
    function MatrixUtil()
    {
        throw new Error("can not new MatrixUtil");
    }

    __class(MatrixUtil,'mirage.core.utils.MatrixUtil');

    MatrixUtil.transformPoint=function(matrix,point,resultPoint)
    {
        (resultPoint===void 0) && (resultPoint=null);
        return MatrixUtil.transformCoords(matrix,point.x,point.y,resultPoint);
    }

    MatrixUtil.transformCoords=function(matrix,x,y,resultPoint)
    {
        (resultPoint===void 0) && (resultPoint=null);
        if (resultPoint==null)
            resultPoint=new Point();
        resultPoint.x=matrix.a*x+matrix.c*y+matrix.tx;
        resultPoint.y=matrix.d*y+matrix.b*x+matrix.ty;
        return resultPoint;
    }

    MatrixUtil.skew=function(matrix,skewX,skewY)
    {
        var sinX=Math.sin(skewX);
        var cosX=Math.cos(skewX);
        var sinY=Math.sin(skewY);
        var cosY=Math.cos(skewY);
        matrix._$setTransform(matrix.a*cosY-matrix.b*sinX,matrix.a*sinY+matrix.b*cosX,matrix.c*cosY-matrix.d*sinX,matrix.c*sinY+matrix.d*cosX,matrix.tx*cosY-matrix.ty*sinX,matrix.tx*sinY+matrix.ty*cosX);
    }

    MatrixUtil.prependMatrix=function(base,prep)
    {
        base._$setTransform(base.a*prep.a+base.c*prep.b,base.b*prep.a+base.d*prep.b,base.a*prep.c+base.c*prep.d,base.b*prep.c+base.d*prep.d,base.tx+base.a*prep.tx+base.c*prep.ty,base.ty+base.b*prep.tx+base.d*prep.ty);
    }

    MatrixUtil.prependTranslation=function(matrix,tx,ty)
    {
        matrix.tx+=matrix.a*tx+matrix.c*ty;
        matrix.ty+=matrix.b*tx+matrix.d*ty;
    }

    MatrixUtil.prependScale=function(matrix,sx,sy)
    {
        matrix._$setTransform(matrix.a*sx,matrix.b*sx,matrix.c*sy,matrix.d*sy,matrix.tx,matrix.ty);
    }

    MatrixUtil.prependRotation=function(matrix,angle)
    {
        var sin=Math.sin(angle);
        var cos=Math.cos(angle);
        matrix._$setTransform(matrix.a*cos+matrix.c*sin,matrix.b*cos+matrix.d*sin,matrix.c*cos-matrix.a*sin,matrix.d*cos-matrix.b*sin,matrix.tx,matrix.ty);
    }

    MatrixUtil.prependSkew=function(matrix,skewX,skewY)
    {
        var sinX=Math.sin(skewX);
        var cosX=Math.cos(skewX);
        var sinY=Math.sin(skewY);
        var cosY=Math.cos(skewY);
        matrix._$setTransform(matrix.a*cosY+matrix.c*sinY,matrix.b*cosY+matrix.d*sinY,matrix.c*cosX-matrix.a*sinX,matrix.d*cosX-matrix.b*sinX,matrix.tx,matrix.ty);
    }

    __static(MatrixUtil,[
        'sRawData',function(){return this.sRawData=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];},
        'sRawData2',function(){return this.sRawData2=__newvec(16,0);}
    ]);

    MatrixUtil.toString=function(){return "[class MatrixUtil]";};
    return MatrixUtil;
})();

var Method=(function() {
    function Method()
    {
    }

    __class(Method,'mirage.core.utils.Method');

    Method.getPath=function(url)
    {
        if (url==null || url=="")
            return "";
        var index=url.lastIndexOf("/");
        if (index>=0)
            url=url.substring(0,index+1);
        else
            url="/";
        if (url.charAt(0)=='/')
            url="file://"+url;
        return url;
    }

    Method.formatUrl=function(fileName)
    {
        if (fileName==null) {
            return "";
        }
        var basePath=MainWin.doc2.baseURI.path;
        if ((fileName.charAt(1)==':' && fileName.charAt(2)=='/'))
            fileName="file://"+fileName;
        if (fileName.charAt(0)=="/") {
            return basePath+fileName.substring(1,fileName.length);
        }
        if (fileName.indexOf("://")<0)
            fileName=basePath+fileName;
        return fileName;
    }

    Method.formatUrlType=function(url)
    {
        var end=url.indexOf("?");
        if (end== -1) {
            end=url.length;
        }
        var extension=".";
        var start=url.lastIndexOf("/",end);
        if (start>=0) {
            url=url.substring(start+1,end);
            end=end-start;
        }
        start=url.lastIndexOf(".",end);
        if (start>=0)
            extension=url.substring(start+1,end);
        return extension;
    }

    Method.toString=function(){return "[class Method]";};
    return Method;
})();

var PerlinNoise=(function() {
    function PerlinNoise()
    {
        this.octaveCount=0;
        this.seed=0;
        this.noiseQuality=0;
        this.persistence=0.5;
        this.lacunarity=2;
    }

    __class(PerlinNoise,'mirage.core.utils.PerlinNoise');
    var __proto=PerlinNoise.prototype;

    __proto.getValue=function(x,y)
    {
        var value=0;
        var curPersistence=1;
        x*=this.frequency;
        y*=this.frequency;
        for (var curOctave=0;curOctave<this.octaveCount;curOctave++) {
            var sd=(this.seed+curOctave)&0xffffffff;
            var signal=this.valueCoherentNoise2D(x,y,sd,this.noiseQuality);
            value+=signal*curPersistence;
            x*=this.lacunarity;
            y*=this.lacunarity;
            curPersistence*=this.persistence;
        }
        return value;
    }

    __proto.curve3=function(a)
    {
        return a*a*(3-a*2);
    }

    __proto.curve5=function(a)
    {
        var a3=a*a*a;
        var a4=a3*a;
        var a5=a4*a;
        return a5*6-a4*15+a3*10;
    }

    __proto.linearInterp=function(n0,n1,a)
    {
        return (1-a)*n0+a*n1;
    }

    __proto.valueCoherentNoise2D=function(x,y,seed,noiseQuality)
    {
        var x0=Math.floor(x);
        var x1=x0+1;
        var y0=Math.floor(y);
        var y1=y0+1;
        var xs=0,ys=0;
        switch (noiseQuality) {
        case 0:
            xs=x-x0;
            ys=y-y0;
            break;
        case 1:
            xs=this.curve3(x-x0);
            ys=this.curve3(y-y0);
            break;
        case 2:
            xs=this.curve5(x-x0);
            ys=this.curve5(y-y0);
            break;
        }
        var n0,n1,ix0,ix1;
        n0=this.valueNoise2D(x0,y0,seed);
        n1=this.valueNoise2D(x1,y0,seed);
        ix0=this.linearInterp(n0,n1,xs);
        n0=this.valueNoise2D(x0,y1,seed);
        n1=this.valueNoise2D(x1,y1,seed);
        ix1=this.linearInterp(n0,n1,xs);
        return this.linearInterp(ix0,ix1,ys);
    }

    __proto.valueNoise2D=function(x,y,seed)
    {
        return 1-this.intValueNoise2D(x,y,seed)/1073741824;
    }

    __proto.intValueNoise2D=function(x,y,seed)
    {
        var n=(x*1619+y*31337+seed*1013)&0x7fffffff;
        n=(n>>13)^n;
        return (n*(n*n*60493+19990303)+1376312589)&0x7fffffff;
    }

    __proto.makeInt32Range=function(n)
    {
        if (n>=1073741824.0) {
            return (2*(n%1073741824))-1073741824;
        } else if (n<= -1073741824.0) {
            return (2*(n%1073741824))+1073741824;
        } else {
            return n;
        }
    }

    PerlinNoise.toString=function(){return "[class PerlinNoise]";};
    Mira.un_proto(PerlinNoise);
    return PerlinNoise;
})();

var StringMethod=(function() {
    function StringMethod()
    {
    }

    __class(StringMethod,'mirage.core.utils.StringMethod');

    StringMethod.nChar=function(chr,n)
    {
        if (n<1)
            return "";
        var str="";
        for (var i=0;i<n;i++)
            str+=chr;
        return str;
    }

    StringMethod.strToStr=function(value)
    {
        return value;
    }

    StringMethod.toInt=function(d)
    {
        return (typeof d=='string') ? parseInt(__string(d)) : (__as(d,int));
    }

    StringMethod.toFloat=function(d)
    {
        return (typeof d=='string') ? d : (__as(d,Number));
    }

    StringMethod.toBool=function(str)
    {
        return (str==true || str=='true');
    }

    StringMethod.strToBigInt=function(value)
    {
        if (value=="infinite")
            return int.MAX_VALUE;
        else
            return parseInt(value);
    }

    StringMethod.strToTime=function(tm)
    {
        if (tm==null)
            return 0;
        var n=1,sz=tm.length;
        if (tm.charAt(sz-1)=='s') {
            if (tm.substring(0,sz-2)=='ms')
                sz-=2;
            else {
                sz--;
                n=1000;
            }
        }
        return Math.floor(parseFloat(tm.substring(0,sz))*n);
    }

    StringMethod.strTrim=function(str)
    {
        return str.replace(StringMethod._string_Trim_,"");
    }

    StringMethod.strRTrim=function(str)
    {
        return str.replace(StringMethod._string_RTrim_,"");
    }

    StringMethod.replaceBlankChar=function(str,dec)
    {
        return str.replace(StringMethod._string_Trim_,'').replace(StringMethod._removeBlankChar_,dec ? dec : ' ');
    }

    StringMethod.subString=function(str,headstr,endstr,nullrtn,pos)
    {
        (nullrtn===void 0) && (nullrtn=null);
        (pos===void 0) && (pos=null);
        if (str==null)
            return nullrtn;
        var b=str.indexOf(headstr),e=0;
        if (b<0)
            return nullrtn;
        b+=headstr.length;
        if (endstr==null)
            return str.substring(b,str.length);
        ((e=str.indexOf(endstr,b))<0) && (e=str.length);
        if (pos!=null) {
            pos.x=b;
            pos.y=e;
        }
        return str.substring(b,e);
    }

    StringMethod.getColorString=function(value)
    {
        if (!value && value!=0)
            return null;
        var s;
        s=value.toString(16).toUpperCase();
        s=s.replace(/0x|0X/,'');
        var len=6-s.length,str="";
        if (s.length<6) {
            for (var i=0;i<len;i++) {
                str+=0;
            }
        }
        s="#"+str+s;
        return s;
    }

    StringMethod.getRgbaColor=function(color,alpha)
    {
        var r=(color>>16)&0xff;
        var g=(color>>8)&0xff;
        var b=color&0xff;
        return "rgba("+r+","+g+","+b+","+alpha+")";
    }

    __static(StringMethod,[
        '_string_Trim_',function(){return this._string_Trim_=new RegExp("(^\\s*)|(\\s*$)","g");},
        '_string_LTrim_',function(){return this._string_LTrim_=new RegExp("(^\\s*)","g");},
        '_string_RTrim_',function(){return this._string_RTrim_=new RegExp("(\\s*$)","g");},
        '_removeBlankChar_',function(){return this._removeBlankChar_=new RegExp("\\s+","g");},
        '_WORDSIZEMAP_',function(){return this._WORDSIZEMAP_=[];}
    ]);

    StringMethod.toString=function(){return "[class StringMethod]";};
    return StringMethod;
})();

var TimerObject=(function() {
    function TimerObject(time,listener,owner,delay,repeatCount)
    {
        this.isdel=false;
        this.name="";
        (owner===void 0) && (owner=null);
        (delay===void 0) && (delay=0);
        (repeatCount===void 0) && (repeatCount=0);
        this.isdel=false;
        this.delay=delay;
        this.repeatCount=repeatCount;
        this._reset_(time,listener,owner);
        this.name=""+TimerObject.NameConut++;
    }

    __class(TimerObject,'mirage.core.utils.TimerObject');
    var __proto=TimerObject.prototype;
    Mira.imps(__proto,{"mirage.core.system.IObject":true});

    __proto._reset_=function(time,listener,owner)
    {
        this.deleted=false;
        this.data=null;
        this._listener_=listener;
        this.owner=owner;
        this.startTime=time;
        this.isdel=false;
        this.runCount=0;
        this.nextTime=this.startTime+this.delay;
        return this;
    }

    __proto.run=function(time)
    {
        if (this.isdel)
            return false;
        if (this.delay==0) {
            return (this.owner && this.owner.deleted) || (this._listener_ && this._listener_.call(this.owner,time,time-this.startTime,this));
        }
        if (this.nextTime==time)
            return true;
        while (this.nextTime<=time) {
            if (this.owner && this.owner.deleted) {
                return !(this.deleted=true);
            }
            if (this._listener_!=null && (this._listener_.call(this.owner,time,time-this.startTime,this)==false)) {
                return !(this.deleted=true);
            }
            this.nextTime+=this.delay;
            this.runCount++;
            if (this.repeatCount>0 && this.runCount>=this.repeatCount) {
                return !(this.deleted=true);
            }
        }
        return true;
    }

    __getset(0,__proto,'listener',
        function()
        {
            return this._listener_;
        }
    );

    __getset(0,__proto,'deleted',
        function()
        {
            return this.isdel;
        },
        function(b)
        {
            this.isdel=b;
            if (b) {
                this._listener_=null;
                this.owner=null;
                this.data=null;
            }
        }
    );

    TimerObject.NameConut=0;

    TimerObject.toString=function(){return "[class TimerObject]";};
    Mira.un_proto(TimerObject);
    return TimerObject;
})();

var URI=(function() {
    function URI(_url)
    {
        this.url=_url;
        this.path=Method.getPath(_url);
    }

    __class(URI,'mirage.core.utils.URI');
    var __proto=URI.prototype;

    __proto.toString=function()
    {
        return this.url;
    }

    URI.toString=function(){return "[class URI]";};
    Mira.un_proto(URI);
    return URI;
})();

var AGAL2GLSL=(function() {
    function AGAL2GLSL()
    {
        this.shaderType="";
        this.hasindirect=false;
        this.writedepth=false;
        this.tempRegId= -1;
        this.codes=[];
        this.regread=[[],[],[],[],[],[],[]];
        this.regwrite=[[],[],[],[],[],[],[]];
        this.samplers=[];
    }

    __class(AGAL2GLSL,'mirage.shader.AGAL2GLSL');
    var __proto=AGAL2GLSL.prototype;

    __proto.agalToGlsl=function(agal,sampler)
    {
        (sampler===void 0) && (sampler=null);
        var pos=agal.position;
        var endian=agal.endian;
        agal.position=0;
        agal.endian=Endian.LITTLE_ENDIAN;
        var glsl;
        try {
            this.decribeAGALByteArray(agal);
            glsl=this.parse();
        } catch (e) {
            glsl=null;
            trace("Error: "+e.message);
        }
        agal.position=pos;
        agal.endian=endian;
        if (sampler) {
            sampler.length=0;
            for (var i=0;i<this.samplers.length;i++) {
                var s=this.samplers[i];
                if (s) {
                    var o={};
                    o.wrap=s.wrap;
                    o.filter=s.filter;
                    o.mipmap=s.mipmap;
                    o.special=s.special;
                    sampler[i]=o;
                }
            }
        }
        return glsl;
    }

    __proto.decribeAGALByteArray=function(bytes)
    {
        if (bytes.readUnsignedByte()!=0xa0) {
            throw new Error("Bad AGAL: Missing 0xa0 magic byte.");
        }
        var version=bytes.readUnsignedInt();
        if (version>=0x10) {
            bytes.readUnsignedByte();
            version>>=1;
        }
        if (bytes.readUnsignedByte()!=0xa1) {
            throw new Error("Bad AGAL: Missing 0xa1 magic byte.");
        }
        var progid=bytes.readUnsignedByte();
        switch (progid) {
        case 1:
            this.shaderType="fragment";
            break;
        case 0:
            this.shaderType="vertex";
            break;
        case 2:
            this.shaderType="cpu";
            break;
        default:
            this.shaderType="";
            break;
        }
        while (bytes.position<bytes.length) {
            var code=new AglslCode();
            code.opcode=bytes.readUnsignedInt();
            var lutentry=AGAL2GLSL.agal2glsllut[code.opcode];
            if (!lutentry) {
                throw new Error("Opcode not valid or not implemented yet: "+code.opcode);
            }
            if (lutentry.dest) {
                code.dest.id=bytes.readUnsignedShort();
                code.dest.mask=bytes.readUnsignedByte();
                code.dest.type=bytes.readUnsignedByte();
                this.regwrite[code.dest.type][code.dest.id]|=code.dest.mask;
            } else {
                code.dest=null;
                bytes.readUnsignedInt();
            }
            if (lutentry.a) {
                this.readReg(code.a,1,bytes);
            } else {
                code.a=null;
                bytes.readUnsignedInt();
                bytes.readUnsignedInt();
            }
            if (lutentry.b) {
                this.readReg(code.b,lutentry.matrixheight,bytes);
            } else {
                code.b=null;
                bytes.readUnsignedInt();
                bytes.readUnsignedInt();
            }
            this.codes.push(code);
        }
        for (var i=0;i<this.codes.length;i++) {
            code=this.codes[i];
            if (code.opcode==24 || code.opcode==23) {
                if (code.dest.type==code.a.type && code.dest.id==code.a.id) {
                    var t=this.findTemp();
                    var dt=code.a.type;
                    var di=code.a.id;
                    code.a.type=2;
                    code.a.id=t;
                    var mov=new AglslCode();
                    mov.opcode=0;
                    mov.dest.type=2;
                    mov.dest.id=t;
                    mov.dest.mask=0xf;
                    mov.a.type=dt;
                    mov.a.id=di;
                    mov.a.swizzle=0xe4;
                    this.codes.splice(i,0,mov);
                     ++i;
                }
            }
        }
    }

    __proto.findTemp=function()
    {
        if (this.tempRegId>=0)
            return this.tempRegId;
        for (var i=0;i<this.regread[0x2].length || i<this.regwrite[0x2].length;i++) {
            if (!this.regread[0x2][i] && !this.regwrite[0x2][i]) {
                break;
            }
        }
        this.regread[2][i]=0xf;
        this.regwrite[2][i]=0xf;
        this.tempRegId=i;
        return i;
    }

    __proto.readReg=function(s,mh,bytes)
    {
        s.id=bytes.readUnsignedShort();
        s.indexoffset=bytes.readByte();
        s.swizzle=bytes.readUnsignedByte();
        s.type=bytes.readUnsignedByte();
        this.regread[s.type][s.id]=0xf;
        if (s.type==0x5) {
            s.lodbiad=s.indexoffset;
            s.indexoffset=0;
            s.swizzle=0;
            s.readmode=bytes.readUnsignedByte();
            s.dim=s.readmode>>4;
            s.readmode&=0xf;
            s.special=bytes.readUnsignedByte();
            s.wrap=s.special>>4;
            s.special&=0xf;
            s.mipmap=bytes.readUnsignedByte();
            s.filter=s.mipmap>>4;
            s.mipmap&=0xf;
            this.samplers[s.id]=s;
        } else {
            s.indexregtype=bytes.readUnsignedByte();
            s.indexselect=bytes.readUnsignedByte();
            s.indirectflag=bytes.readUnsignedByte();
        }
        if (s.indirectflag) {
            this.hasindirect=true;
            this.regread[s.indexregtype][s.id]=0xf;
        } else {
            for (var mhi=0;mhi<mh;mhi++) {
                this.regread[s.type][s.id+mhi]=this.regread[s.type][s.id];
            }
        }
    }

    __proto.parse=function()
    {
        var header="";
        var body="";
        header+="precision highp float;\n";
        var tag=this.shaderType.charAt(0);
        if (this.shaderType=="vertex") {
            header+="uniform float yflip;\n";
        }
        var i=0;
        if (!this.hasindirect) {
            for (i=0;i<this.regread[0x1].length;i++) {
                if (this.regread[0x1][i]) {
                    header+="uniform vec4 "+tag+"c"+i+";\n";
                }
            }
        } else {
            header+="uniform vec4 "+tag+"ca["+AGAL2GLSL.maxvertexconstants+"];\n";
        }
        for (i=0;i<this.regread[0x2].length || i<this.regwrite[0x2].length;i++) {
            if (this.regread[0x2][i] || this.regwrite[0x2][i]) {
                header+="vec4 "+tag+"t"+i+";\n";
            }
        }
        for (i=0;i<this.regread[0x0].length;i++) {
            if (this.regread[0x0][i]) {
                header+="attribute vec4 va"+i+";\n";
            }
        }
        for (i=0;i<this.regread[0x4].length || i<this.regwrite[0x4].length;i++) {
            if (this.regread[0x4][i] || this.regwrite[0x4][i]) {
                header+="varying vec4 vi"+i+";\n";
            }
        }
        var samptype=["2D","Cube","3D",""];
        for (i=0;i<this.samplers.length;i++) {
            if (this.samplers[i]) {
                header+="uniform sampler"+samptype[this.samplers[i].dim&3]+" fs"+i+";\n";
            }
        }
        if (this.shaderType=="vertex") {
            header+="vec4 outpos;\n";
        }
        if (this.writedepth) {
            header+="vec4 tmp_FragDepth;\n";
        }
        var derivatives=false;
        body+="void main() {\n";
        for (i=0;i<this.codes.length;i++) {
            var lutentry=AGAL2GLSL.agal2glsllut[this.codes[i].opcode];
            if (lutentry.s.indexOf("dFdx")!= -1 || lutentry.s.indexOf("dFdy")!= -1)
                derivatives=true;
            var sublines=lutentry.matrixheight || 1;
            for (var sl=0;sl<sublines;sl++) {
                var line="  "+lutentry.s;
                if (this.codes[i].dest) {
                    if (lutentry.matrixheight) {
                        if (((this.codes[i].dest.mask>>sl)&1)!=1) {
                            continue;
                        }
                        var destregstring=this.regtostring(this.codes[i].dest.type,this.codes[i].dest.id,tag);
                        var destcaststring="float";
                        var destmaskstring=__string(["x","y","z","w"][sl]);
                        destregstring+="."+destmaskstring;
                    } else {
                        destregstring=this.regtostring(this.codes[i].dest.type,this.codes[i].dest.id,tag);
                        if (this.codes[i].dest.mask!=0xf) {
                            var ndest=0;
                            destmaskstring="";
                            if (this.codes[i].dest.mask&1) {
                                ndest++;
                                destmaskstring+="x";
                            }
                            if (this.codes[i].dest.mask&2) {
                                ndest++;
                                destmaskstring+="y";
                            }
                            if (this.codes[i].dest.mask&4) {
                                ndest++;
                                destmaskstring+="z";
                            }
                            if (this.codes[i].dest.mask&8) {
                                ndest++;
                                destmaskstring+="w";
                            }
                            destregstring+="."+destmaskstring;
                            switch (ndest) {
                            case 1:
                                destcaststring="float";
                                break;
                            case 2:
                                destcaststring="vec2";
                                break;
                            case 3:
                                destcaststring="vec3";
                                break;
                            default:
                                throw new Error("Unexpected destination mask");
                            }
                        } else {
                            destcaststring="vec4";
                            destmaskstring="xyzw";
                        }
                    }
                    line=line.replace("%dest",destregstring);
                    line=line.replace("%cast",destcaststring);
                    line=line.replace("%dm",destmaskstring);
                }
                var dwm=0xf;
                if (!lutentry.ndwm && lutentry.dest && this.codes[i].dest) {
                    dwm=this.codes[i].dest.mask;
                }
                if (this.codes[i].a) {
                    line=line.replace("%a",this.sourcetostring(this.codes[i].a,0,dwm|0,lutentry.scalar,tag));
                }
                if (this.codes[i].b) {
                    line=line.replace("%b",this.sourcetostring(this.codes[i].b,sl,dwm|0,lutentry.scalar,tag));
                    if (this.codes[i].b.type==0x5) {
                        var texdim=__string(["2D","Cube","3D"][this.codes[i].b.dim]);
                        var texsize=__string(["vec2","vec3","vec3"][this.codes[i].b.dim]);
                        line=line.replace("%texdim",texdim);
                        line=line.replace("%texsize",texsize);
                        var texlod="";
                        line=line.replace("%lod",texlod);
                    }
                }
                body+=line;
            }
        }
        if (this.shaderType=="vertex") {
            body+="  gl_Position = vec4(outpos.x,outpos.y*yflip,outpos.z*2.0-outpos.w,outpos.w);\n";
        }
        if (derivatives && this.shaderType=="fragment") {
            header="#extension GL_OES_standard_derivatives : enable\n"+header;
        }
        if (this.writedepth) {
            body+="  gl_FragDepth = clamp(tmp_FragDepth,0.0,1.0);\n";
        }
        body+="}\n";
        return header+body;
    }

    __proto.regtostring=function(regtype,regnum,tag)
    {
        switch (regtype) {
        case 0x0:
            return "va"+regnum;
        case 0x1:
            if (this.hasindirect && this.shaderType=="vertex") {
                return "vca["+regnum+"]";
            } else {
                return tag+"c"+regnum;
            }
        case 0x2:
            return tag+"t"+regnum;
        case 0x3:
            return this.shaderType=="vertex" ? "outpos" : "gl_FragColor";
        case 0x4:
            return "vi"+regnum;
        case 0x5:
            return "fs"+regnum;
        case 0x6:
            return "tmp_FragDepth";
        default:
            throw new Error("Unknown register type");
        }
    }

    __proto.sourcetostring=function(s,subline,dwm,isscalar,tag)
    {
        var swiz=["x","y","z","w"];
        var r;
        if (s.indirectflag) {
            r="vca[int("+this.regtostring(s.indexregtype,s.id,tag)+"."+swiz[s.indexselect]+")";
            var realofs=subline+s.indexoffset;
            if (realofs<0)
                r+=realofs.toString();
            if (realofs>0)
                r+="+"+realofs.toString();
            r+="]";
        } else {
            r=this.regtostring(s.type,s.id+subline,tag);
        }
        if (s.type==0x5) {
            return r;
        }
        if (isscalar) {
            return r+"."+swiz[(s.swizzle>>0)&3];
        }
        if (s.swizzle==0xe4 && dwm==0xf) {
            return r;
        }
        r+=".";
        if (dwm&1)
            r+=swiz[(s.swizzle>>0)&3];
        if (dwm&2)
            r+=swiz[(s.swizzle>>2)&3];
        if (dwm&4)
            r+=swiz[(s.swizzle>>4)&3];
        if (dwm&8)
            r+=swiz[(s.swizzle>>6)&3];
        return r;
    }

    AGAL2GLSL.maxvertexconstants=128;

    __static(AGAL2GLSL,[
        'agal2glsllut',function(){return this.agal2glsllut=[new AglslOplut("%dest = %cast(%a);\n",0,true,true,false,0,0,false,false,false,false),new AglslOplut("%dest = %cast(%a + %b);\n",0,true,true,true,0,0,false,false,false,false),
            new AglslOplut("%dest = %cast(%a - %b);\n",0,true,true,true,0,0,false,false,false,false),new AglslOplut("%dest = %cast(%a * %b);\n",0,true,true,true,0,0,false,false,false,false),
            new AglslOplut("%dest = %cast(%a / %b);\n",0,true,true,true,0,0,false,false,false,false),new AglslOplut("%dest = %cast(1.0) / %a;\n",0,true,true,false,0,0,false,false,false,false),
            new AglslOplut("%dest = %cast(min(%a,%b));\n",0,true,true,true,0,0,false,false,false,false),new AglslOplut("%dest = %cast(max(%a,%b));\n",0,true,true,true,0,0,false,false,false,false),
            new AglslOplut("%dest = %cast(fract(%a));\n",0,true,true,false,0,0,false,false,false,false),new AglslOplut("%dest = %cast(sqrt(abs(%a)));\n",0,true,true,false,0,0,false,false,false,false),
            new AglslOplut("%dest = %cast(inversesqrt(abs(%a)));\n",0,true,true,false,0,0,false,false,false,false),new AglslOplut("%dest = %cast(pow(abs(%a),%b));\n",0,true,true,true,0,0,false,false,false,false),
            new AglslOplut("%dest = %cast(log2(abs(%a)));\n",0,true,true,false,0,0,false,false,false,false),new AglslOplut("%dest = %cast(exp2(%a));\n",0,true,true,false,0,0,false,false,false,false),
            new AglslOplut("%dest = %cast(normalize(vec3( %a ) ));\n",0,true,true,false,0,0,true,false,false,false),new AglslOplut("%dest = %cast(sin(%a));\n",0,true,true,false,0,0,false,false,false,false),
            new AglslOplut("%dest = %cast(cos(%a));\n",0,true,true,false,0,0,false,false,false,false),new AglslOplut("%dest = %cast(cross(vec3(%a),vec3(%b)));\n",0,true,true,true,0,0,true,false,false,false),
            new AglslOplut("%dest = %cast(dot(vec3(%a),vec3(%b)));\n",0,true,true,true,0,0,true,false,false,false),new AglslOplut("%dest = %cast(dot(vec4(%a),vec4(%b)));\n",0,true,true,true,0,0,true,false,false,false),
            new AglslOplut("%dest = %cast(abs(%a));\n",0,true,true,false,0,0,false,false,false,false),new AglslOplut("%dest = %cast(%a * -1.0);\n",0,true,true,false,0,0,false,false,false,false),
            new AglslOplut("%dest = %cast(clamp(%a,0.0,1.0));\n",0,true,true,false,0,0,false,false,false,false),new AglslOplut("%dest = %cast(dot(vec3(%a),vec3(%b)));\n",0,true,true,true,3,3,true,false,false,false),
            new AglslOplut("%dest = %cast(dot(vec4(%a),vec4(%b)));\n",0,true,true,true,4,4,true,false,false,false),new AglslOplut("%dest = %cast(dot(vec4(%a),vec4(%b)));\n",0,true,true,true,4,3,true,false,false,false),
            new AglslOplut("%dest = %cast(dFdx(%a));\n",0,true,true,false,0,0,false,false,false,false),new AglslOplut("%dest = %cast(dFdy(%a));\n",0,true,true,false,0,0,false,false,false,false),
            new AglslOplut("if (float(%a)==float(%b)) {;\n",0,false,true,true,0,0,false,true,false,false),new AglslOplut("if (float(%a)!=float(%b)) {;\n",0,false,true,true,0,0,false,true,false,false),
            new AglslOplut("if (float(%a)>=float(%b)) {;\n",0,false,true,true,0,0,false,true,false,false),new AglslOplut("if (float(%a)<float(%b)) {;\n",0,false,true,true,0,0,false,true,false,false),
            new AglslOplut("} else {;\n",0,false,false,false,0,0,false,false,false,false),new AglslOplut("};\n",0,false,false,false,0,0,false,false,false,false),new AglslOplut(null,0,false,false,false,0,0,false,false,false,false),
            new AglslOplut(null,0,false,false,false,0,0,false,false,false,false),new AglslOplut(null,0,false,false,false,0,0,false,false,false,false),new AglslOplut(null,0,false,false,false,0,0,false,false,false,false),
            new AglslOplut("%dest = %cast(texture%texdimLod(%b,%texsize(%a)).%dm);\n",0,true,true,true,0,0,false,false,true,false),new AglslOplut("if ( float(%a)<0.0 ) discard;\n",0,false,true,false,0,0,false,true,false,false),
            new AglslOplut("%dest = %cast(texture%texdim(%b,%texsize(%a)%lod).%dm);\n",0,true,true,true,0,0,true,false,true,true),new AglslOplut("%dest = %cast(greaterThanEqual(%a,%b).%dm);\n",0,true,true,true,0,0,true,false,true,false),
            new AglslOplut("%dest = %cast(lessThan(%a,%b).%dm);\n",0,true,true,true,0,0,true,false,true,false),new AglslOplut("%dest = %cast(sign(%a));\n",0,true,true,false,0,0,false,false,false,false),
            new AglslOplut("%dest = %cast(equal(%a,%b).%dm);\n",0,true,true,true,0,0,true,false,true,false),new AglslOplut("%dest = %cast(notEqual(%a,%b).%dm);\n",0,true,true,true,0,0,true,false,true,false)
            ];}
    ]);

    AGAL2GLSL.toString=function(){return "[class AGAL2GLSL]";};
    Mira.un_proto(AGAL2GLSL);
    return AGAL2GLSL;
})();

var AglslCode=(function() {
    function AglslCode()
    {
        this.opcode=0;
        this.dest=new AglslReg();
        this.a=new AglslReg();
        this.b=new AglslReg();
    }

    __class(AglslCode,'mirage.shader.AglslCode');

    AglslCode.toString=function(){return "[class AglslCode]";};
    return AglslCode;
})();

var AglslOplut=(function() {
    function AglslOplut(s,flags,dest,a,b,matrixwidth,matrixheight,ndwm,scaler,dm,lod)
    {
        this.flags=0;
        this.dest=false;
        this.a=false;
        this.b=false;
        this.matrixwidth=0;
        this.matrixheight=0;
        this.ndwm=false;
        this.scalar=false;
        this.dm=false;
        this.lod=false;
        this.s=s;
        this.flags=flags;
        this.dest=dest;
        this.a=a;
        this.b=b;
        this.matrixwidth=matrixwidth;
        this.matrixheight=matrixheight;
        this.ndwm=ndwm;
        this.scalar=scaler;
        this.dm=dm;
        this.lod=lod;
    }

    __class(AglslOplut,'mirage.shader.AglslOplut');

    AglslOplut.toString=function(){return "[class AglslOplut]";};
    return AglslOplut;
})();

var AglslReg=(function() {
    function AglslReg()
    {
        this.id=0;
        this.mask=0;
        this.type=0;
        this.indexoffset=0;
        this.swizzle=0;
        this.indexregtype=0;
        this.indexselect=0;
        this.indirectflag=0;
        this.lodbiad=0;
        this.readmode=0;
        this.dim=0;
        this.special=0;
        this.wrap=0;
        this.mipmap=0;
        this.filter=0;
    }

    __class(AglslReg,'mirage.shader.AglslReg');

    AglslReg.toString=function(){return "[class AglslReg]";};
    return AglslReg;
})();

var GLSLCompiler=(function() {
    function GLSLCompiler()
    {
    }

    __class(GLSLCompiler,'mirage.shader.GLSLCompiler');
    var __proto=GLSLCompiler.prototype;

    __proto.compile=function(context,vertexProgram,fragmentProgram)
    {
        this.webglContext=context;
        return this.loadProgram(vertexProgram,fragmentProgram);
    }

    __proto.loadProgram=function(vertShaderSrc,fragShaderSrc)
    {
        var vertexShader;
        var fragmentShader;
        var programObject;
        var linked;
        vertexShader=this.loadShader(this.webglContext.VERTEX_SHADER,vertShaderSrc);
        if (!vertexShader) {
            return null;
        }
        fragmentShader=this.loadShader(this.webglContext.FRAGMENT_SHADER,fragShaderSrc);
        if (!fragmentShader) {
            this.webglContext.deleteShader(vertexShader);
            return null;
        }
        programObject=this.webglContext.createProgram();
        if (!programObject) {
            this.webglContext.deleteShader(fragmentShader);
            this.webglContext.deleteShader(vertexShader);
            return null;
        }
        this.webglContext.attachShader(programObject,vertexShader);
        this.webglContext.attachShader(programObject,fragmentShader);
        for (var i=0;i<8;i++) {
            if (vertShaderSrc.indexOf("va"+i)>=0) {
                this.webglContext.bindAttribLocation(programObject,i,"va"+i);
            }
        }
        this.webglContext.linkProgram(programObject);
        linked=this.webglContext.getProgramParameter(programObject,this.webglContext.LINK_STATUS);
        if (!linked) {
            var errInfo=this.webglContext.getProgramInfoLog(programObject);
            this.webglContext.deleteProgram(programObject);
            return null;
        }
        this.webglContext.deleteShader(vertexShader);
        this.webglContext.deleteShader(fragmentShader);
        return programObject;
    }

    __proto.loadShader=function(type,shaderSrc)
    {
        var shader=this.webglContext.createShader(type);
        if (shader==null) {
            return null;
        }
        this.webglContext.shaderSource(shader,shaderSrc);
        this.webglContext.compileShader(shader);
        var compiled=this.webglContext.getShaderParameter(shader,this.webglContext.COMPILE_STATUS);
        if (!compiled) {
            var errInfo=this.webglContext.getShaderInfoLog(shader);
            this.webglContext.deleteShader(shader);
            return null;
        }
        return shader;
    }

    GLSLCompiler.toString=function(){return "[class GLSLCompiler]";};
    Mira.un_proto(GLSLCompiler);
    return GLSLCompiler;
})();

var AudioPlayer=(function(_super) {
    function AudioPlayer()
    {
        this._volume=1;
        this.loops=0;
        this._isPlay=false;
        this.isLoaded=false;
        this.fromTime=0;
        AudioPlayer.__super.call(this);
    }

    __class(AudioPlayer,'mirage.sound.AudioPlayer',_super);
    var __proto=AudioPlayer.prototype;
    Mira.imps(__proto,{"mirage.sound.IAudioPlayer":true});

    __proto.onEnded=function()
    {
        this.loops--;
        if (this.loops>0) {
            this.soundNode.currentTime=this.fromTime;
            this.soundNode.play();
        } else {
            var i=Sound._$playingAudio.indexOf(this);
            if (i!= -1)
                Sound._$playingAudio.splice(i,1);
            this._$dispatchEvent(Event.SOUND_COMPLETE);
        }
    }

    __proto.onloadComplete=function(e)
    {
        this.soundNode.removeEventListener("canplaythrough",__bind(this.onloadComplete,this));
        this.isLoaded=true;
        this._$dispatchEvent(Event.COMPLETE);
        if (this._isPlay) {
            this.soundNode.play();
        }
    }

    __proto.load=function(url)
    {
        if (this.soundNode)
            this.close();
        this.soundNode=document.createElement("audio");
        this.soundNode.addEventListener("canplaythrough",__bind(this.onloadComplete,this));
        this.soundNode.addEventListener("ended",__bind(this.onEnded,this));
        this.soundNode.src=url;
        this.soundNode.load();
    }

    __proto.play=function(startTime,loops)
    {
        (startTime===void 0) && (startTime=0);
        (loops===void 0) && (loops=0);
        if (startTime>this.length || startTime<0) {
            this.fromTime=0;
        } else
            this.fromTime=startTime/1000|0;
        if (loops<=0) {
            this.loops=1;
        } else
            this.loops=loops;
        this._isPlay=true;
        if (this.isLoaded) {
            this.soundNode.currentTime=this.fromTime;
            this.soundNode.play();
        }
    }

    __proto.stop=function()
    {
        this._isPlay=false;
        if (this.soundNode)
            this.soundNode.pause();
    }

    __proto.close=function()
    {
        if (this.soundNode) {
            this.soundNode.removeEventListener("canplaythrough",__bind(this.onloadComplete,this));
            this.soundNode.removeEventListener("ended",__bind(this.onEnded,this));
            this.stop();
            this.soundNode=null;
        }
    }

    __getset(0,__proto,'volume',
        function()
        {
            return this._volume;
        },
        function(v)
        {
            if (v<0)
                v=0;
            if (v>1)
                v=1;
            this._volume=v;
            this.soundNode && (this.soundNode.volume=this._volume);
        }
    );

    __getset(0,__proto,'length',
        function()
        {
            return this.soundNode ? this.soundNode.duration*1000 : 0;
        }
    );

    __getset(0,__proto,'position',
        function()
        {
            return uint(this.soundNode && this.soundNode.currentTime ? this.soundNode.currentTime*1000 : 0);
        }
    );

    AudioPlayer.toString=function(){return "[class AudioPlayer]";};
    Mira.un_proto(AudioPlayer);
    return AudioPlayer;
})(EventDispatcher);

var ContextPlayer=(function(_super) {
    function ContextPlayer()
    {
        this._isLoaded=false;
        this._isPlay=false;
        this._volume=1;
        this._loops=0;
        this._from=0;
        this._startTime=0;
        ContextPlayer.__super.call(this);
        this.ctx=Sound._$audioCtx;
    }

    __class(ContextPlayer,'mirage.sound.ContextPlayer',_super);
    var __proto=ContextPlayer.prototype;
    Mira.imps(__proto,{"mirage.sound.IAudioPlayer":true});

    __proto.load=function(url)
    {
        this._url=url;
        var ot=ContextPlayer._decodBuffs[this._url];
        if (ot) {
            ot.n+=1;
            this.prepareEnd(ot.d);
            return;
        }
        ot=ContextPlayer._downLoads[this._url];
        if (ot) {
            var arr=ContextPlayer._downLoads[this._url];
            arr.push(this);
            return;
        }
        var request=new XMLHttpRequest();
        request.open("GET",this._url,true);
        request.responseType="arraybuffer";
        request.addEventListener("load",__bind(this.fileLoadHandler,this));
        request.addEventListener("error",__bind(this.fileLoadErrorHandler,this));
        request.send();
        ContextPlayer._downLoads[this._url]=[this];
    }

    __proto.fileLoadHandler=function(e)
    {
        var request=e.target;
        request.removeEventListener("load",__bind(this.fileLoadHandler,this));
        request.removeEventListener("error",__bind(this.fileLoadErrorHandler,this));
        ContextPlayer._dataList.push({"url": this._url,"data": request.response});
        ContextPlayer._decodeSound();
    }

    __proto.fileLoadErrorHandler=function(e)
    {
        var request=e.target;
        request.removeEventListener("load",__bind(this.fileLoadHandler,this));
        request.removeEventListener("error",__bind(this.fileLoadErrorHandler,this));
        throw new IOErrorEvent(IOErrorEvent.IO_ERROR,false,false,"Load file ["+this._url+"] failed.");
    }

    __proto.prepareEnd=function(buff)
    {
        this.audioBuffer=buff;
        this._isLoaded=true;
        this._gain=this.ctx.createGain() || this.ctx.createGainNode();
        this._gain.connect(SoundMixer._$getGainAll());
        if (this._isPlay) {
            this._internalPlay();
        }
    }

    __proto.prepareError=function()
    {
        throw new IOErrorEvent(IOErrorEvent.IO_ERROR,false,"There is an error decoding the audio file data.["+this._url+"]");
    }

    __proto.play=function(startTime,loops)
    {
        (startTime===void 0) && (startTime=0);
        (loops===void 0) && (loops=0);
        loops<=0 ? this._loops=1 : this._loops=loops;
        this._from=startTime/1000|0;
        if (this._isLoaded) {
            this._internalPlay();
        }
        this._isPlay=true;
    }

    __proto._internalPlay=function()
    {
        if (!this.audioBuffer)
            return;
        if (this._bufferSource)
            this._bufferSource.disconnect();
        this._bufferSource=this.ctx.createBufferSource();
        this._bufferSource.buffer=this.audioBuffer;
        this._bufferSource.connect(this._gain);
        this._gain.gain.value=this._volume;
        if (this._loops>1) {
            this._bufferSource.loop=true;
        }
        this._bufferSource.addEventListener("ended",__bind(this.playEndHandler,this));
        this._startTime=getTimer();
        this._bufferSource.start(0,this._from);
    }

    __proto.playEndHandler=function(e)
    {
        this._loops--;
        if (this._loops<=0) {
            this.stop();
            var i=Sound._$playingAudio.indexOf(this);
            if (i!= -1)
                Sound._$playingAudio.splice(i,1);
            this.dispatchEvent(new Event(Event.SOUND_COMPLETE));
        }
    }

    __proto.stop=function()
    {
        this._isPlay=false;
        var sourceNode=this._bufferSource;
        if (sourceNode) {
            sourceNode.stop(0);
            sourceNode.disconnect();
            this._bufferSource=null;
        }
    }

    __proto.close=function()
    {
        this.stop();
        if (this._gain)
            this._gain.disconnect();
        this.audioBuffer=null;
        var o=ContextPlayer._decodBuffs[this._url];
        if (!o)
            return;
        if (o.n<=0) {
            delete ContextPlayer._decodBuffs[this._url];
        } else {
            o.n=o.n-1;
        }
    }

    __getset(0,__proto,'position',
        function()
        {
            return getTimer()-this._startTime+this._from*1000;
        }
    );

    __getset(0,__proto,'length',
        function()
        {
            return this.audioBuffer ? this.audioBuffer.duration*1000 : 0;
        }
    );

    __getset(0,__proto,'isBuffering',
        function()
        {
            return !this._isLoaded;
        }
    );

    __getset(0,__proto,'volume',
        function()
        {
            return this._volume;
        },
        function(v)
        {
            if (v<0)
                v=0;
            if (v>1)
                v=1;
            this._volume=v;
            this._gain && (this._gain.gain.value=this._volume);
        }
    );

    ContextPlayer._decodeSound=function()
    {
        if (ContextPlayer._dataList.length<=0 || ContextPlayer._isDecoding) {
            return;
        }
        ContextPlayer._isDecoding=true;
        var currDecode=ContextPlayer._dataList.shift();
        ContextPlayer._currDecodeUrl=__string(currDecode.url);
        Sound._$audioCtx.decodeAudioData(currDecode.data,ContextPlayer._decodeDone,ContextPlayer._decodeFail);
    }

    ContextPlayer._decodeDone=function(audioBuffer)
    {
        var arr=ContextPlayer._downLoads[ContextPlayer._currDecodeUrl];
        ContextPlayer._decodBuffs[ContextPlayer._currDecodeUrl]={"n": arr.length,"d": audioBuffer};
        var a;
        for (var i in arr) {
            a=arr[i];
            a.prepareEnd(audioBuffer);
        }
        arr.length=0;
        delete ContextPlayer._downLoads[ContextPlayer._currDecodeUrl];
        ContextPlayer._isDecoding=false;
        ContextPlayer._decodeSound();
    }

    ContextPlayer._decodeFail=function()
    {
        var arr=ContextPlayer._downLoads[ContextPlayer._currDecodeUrl];
        var a;
        for (var i in arr) {
            a=arr[i];
            a.prepareError();
        }
        arr.length=0;
        delete ContextPlayer._downLoads[ContextPlayer._currDecodeUrl];
        ContextPlayer._isDecoding=false;
        ContextPlayer._decodeSound();
    }

    ContextPlayer._isDecoding=false;
    ContextPlayer._currDecodeUrl=null;

    __static(ContextPlayer,[
        '_downLoads',function(){return this._downLoads={};},
        '_dataList',function(){return this._dataList=[];},
        '_decodBuffs',function(){return this._decodBuffs={};}
    ]);

    ContextPlayer.toString=function(){return "[class ContextPlayer]";};
    Mira.un_proto(ContextPlayer);
    return ContextPlayer;
})(EventDispatcher);

var MovieClipData=(function() {
    function MovieClipData()
    {
        this.cid=0;
        this.totalFrame=0;
        this.currentFrame= -1;
        this.cmds=[];
        this.labs={};
        this.scenes=[];
        this.depthDic={};
        this.removeDic={};
    }

    __class(MovieClipData,'mirage.swf.MovieClipData');
    var __proto=MovieClipData.prototype;

    __proto.clone=function()
    {
        var md=new MovieClipData();
        md.totalFrame=this.totalFrame;
        md.cmds=this.cmds;
        md.cid=this.cid;
        md.labs=this.labs;
        md.scenes=this.scenes;
        return md;
    }

    __proto.copyFrom=function(md)
    {
        this.totalFrame=md.totalFrame;
        this.cmds=md.cmds;
        this.cid=md.cid;
        this.labs=md.labs;
        this.currentFrame= -1;
        return md;
    }

    MovieClipData.toString=function(){return "[class MovieClipData]";};
    Mira.un_proto(MovieClipData);
    return MovieClipData;
})();

var SwfParser=(function() {
    function SwfParser()
    {
        this.requestLoad=0;
        this.loadedNum=0;
        this.isParsed=false;
    }

    __class(SwfParser,'mirage.swf.SwfParser');
    var __proto=SwfParser.prototype;

    __proto.parserFile=function(bytes,loadInf,callBack)
    {
        this.bytes=bytes;
        this.loadInf=loadInf;
        var it=loadInf._$url.lastIndexOf(".swf");
        if (it!= -1) {
            this.baseImgUrl=loadInf._$url.substr(0,it)+"/image/";
            this.baseSndUrl=loadInf._$url.substr(0,it)+"/mp3/";
        }
        this.callBack=callBack;
        this.requestLoad=0;
        this.loadedNum=0;
        this.symbolCls={};
        this.isParsed=false;
        bytes.readUnsignedByte();
        bytes.readUnsignedByte();
        bytes.readUnsignedByte();
        var ver=bytes.readUnsignedByte();
        var t=0,resType=0;
        var cid=0;
        var nbyte=0;
        var flag=0;
        var clsName;
        var ba;
        while (bytes.bytesAvailable>0) {
            t=bytes.readUnsignedByte();
            switch (t) {
            case SwfParser.TYPE_RES_DATA:
 {
                    cid=bytes.readUnsignedShort();
                    nbyte=bytes.readInt();
                    ba=new ByteArray();
                    bytes.readBytes(ba,0,nbyte);
                    loadInf._$resDataDic[cid]=ba;
                    break;
                }
            case SwfParser.TYPE_RESOURCE:
 {
                    resType=bytes.readUnsignedByte();
                    cid=bytes.readUnsignedShort();
                    flag=bytes.readUnsignedByte();
                    this.processRes(resType,cid,flag);
                    break;
                }
            case SwfParser.TYPE_SYMBOL_CLASS:
 {
                    cid=bytes.readUnsignedShort();
                    clsName=bytes.readUTF();
                    this.symbolCls[clsName]=cid;
                    break;
                }
            case SwfParser.TYPE_SCALE9GRID:
 {
                    cid=bytes.readUnsignedShort();
                    var x=bytes.readFloat();
                    var y=bytes.readFloat();
                    var w=bytes.readFloat();
                    var h=bytes.readFloat();
                    loadInf._$grid9s[cid]=new Rectangle(x,y,w,h);
                    break;
                }
            default:
 {
                    trace("错误的类型："+t);
                }
            }
        }
        this.isParsed=true;
        this.loadedNum--;
        this.checkLoadComplete();
    }

    __proto.processRes=function(resType,cid,flag)
    {
        var isEmbed=resType&0x80;
        resType=resType&0x7f;
        var ea;
        var res;
        var fileType;
        switch (resType) {
        case SwfParser.RES_BITMAP:
 {
                fileType=(flag&0x07)==1 ? "jpg" : "png";
                var isTransparent=(flag&0x08)!=0 ? true : false;
                var url;
                if (isEmbed) {
                    ea=this.loadInf._$resDataDic[cid];
                    var blob=new Blob([ea._$buffer.subarray(0,ea.bytesAvailable)],{type: 'image/'+fileType});
                    url=URL.createObjectURL(blob);
                    this.loadBitmap(url,cid,true,isTransparent);
                } else {
                    url=this.baseImgUrl+cid+"."+fileType;
                    this.loadBitmap(url,cid,false,isTransparent);
                }
                break;
            }
        case SwfParser.RES_EVENT_SOUND:
        case SwfParser.RES_STREAM_SOUND:
 {
                fileType=(flag&0x07)==2 ? "wav" : "mp3";
                if (isEmbed) {
                    ea=this.loadInf._$resDataDic[cid];
                    blob=new Blob([ea._$buffer.subarray(0,ea.bytesAvailable)],{type: 'audio/'+fileType});
                    url=URL.createObjectURL(blob);
                    this.loadSound(url,cid,true,resType);
                } else {
                    url=this.baseSndUrl+cid+"."+fileType;
                    this.loadSound(url,cid,false,resType);
                }
                break;
            }
        case SwfParser.RES_VIDEO:
 {
                res={"ready": 1,"resType": resType,"flag": flag};
                this.loadInf._$resDic[cid]=res;
                break;
            }
        default:
 {
                if (resType==SwfParser.RES_FONT) {
                    ea=this.loadInf._$resDataDic[cid];
                    if (ea) {
                        ea.position=1;
                        var fontName=ea.readUTF();
                        ea.position=0;
                        this.loadInf._$fontDic[fontName]=cid;
                    }
                }
                if (isEmbed) {
                    res={"ready": 0,"resType": resType,"flag": flag};
                    this.loadInf._$resDic[cid]=res;
                } else {
                }
                break;
            }
        }
    }

    __proto.loadBitmap=function(url,cid,isBlob,isTransparent)
    {
        var _$this=this;
        this.requestLoad++;
        var img=document.createElement("img");
        img["resType"]=SwfParser.RES_BITMAP;
        img["transp"]=isTransparent;
        img["ready"]=0;
        img.onload=function () {
            var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
            isBlob && URL.revokeObjectURL(url);
            img.onerror=img.onload=null;
            _$this.loadInf._$resDic[cid]=img;
            img["ready"]=1;
            _$this.checkLoadComplete();
        };
        img.onerror=function () {
            var args=[];for(var $c=0,$d=arguments.length;$c<$d;++$c)args.push(arguments[$c]);
            isBlob && URL.revokeObjectURL(url);
            img.onerror=img.onload=null;
            _$this.checkLoadComplete();
        };
        img.src=url;
    }

    __proto.loadSound=function(url,cid,isBlob,resType)
    {
        var _$this=this;
        if (Sound._$enableAudioContext) {
            this.requestLoad++;
            var request=new XMLHttpRequest();
            request.open("GET",url,true);
            request.responseType="arraybuffer";
            request.onload=function (event) {
                isBlob && URL.revokeObjectURL(url);
                request.onerror=request.onload=null;
                _$this.decodeSound(__as(request.response,ArrayBuffer),cid,resType);
            };
            request.onerror=function (event) {
                isBlob && URL.revokeObjectURL(url);
                request.onerror=request.onload=null;
                _$this.loadInf._$resDic[cid]={"resType": resType,"ready": 1};
                _$this.checkLoadComplete();
            };
            request.send();
        } else {
            this.loadInf._$resDic[cid]={"ready": 1,"resType": resType,"url": url};
        }
    }

    __proto.decodeSound=function(data,cid,resType)
    {
        var _$this=this;
        Sound._$audioCtx.decodeAudioData(data,function _decodeDone(audioBuffer) {
            audioBuffer["ready"]=1;
            audioBuffer["resType"]=resType;
            audioBuffer["ttlByte"]=data.byteLength;
            _$this.loadInf._$resDic[cid]=audioBuffer;
            _$this.checkLoadComplete();
        },function _decodeFail() {
            trace("解码声音数据失败：cid="+cid);
            _$this.loadInf._$resDic[cid]={"resType": resType,"ready": 1};
            _$this.checkLoadComplete();
        });
    }

    __proto.checkLoadComplete=function()
    {
        this.loadedNum++;
        if (this.loadedNum>=this.requestLoad) {
            this.processSymbol();
            this.callBack && this.callBack();
        }
    }

    __proto.processSymbol=function()
    {
        var dom=this.loadInf.applicationDomain;
        var clsName;
        var cid=0;
        var cls;
        for (clsName in this.symbolCls) {
            cls=dom._$getDefInDomain(clsName);
            if (!cls) {
                trace("Symbol Class的定义未找到。["+clsName+"]");
                continue;
            }
            cid=this.symbolCls[clsName]|0;
            this.loadInf._$id2symbol[cid]=clsName;
            this.modSuper(cls,cid);
        }
    }

    __proto.modSuper=function(cla,cid)
    {
        var _$this=this;
        if (!cla || cla.f)
            return;
        var pre=cla.__super;
        cla.f=true;
        cla.__super=function (ex) {
            (ex===void 0) && (ex=true);
            if (this instanceof MovieClip) {
                if (!this["_initMC_"])
                    this["_initMC_"]=[cla,this,cid,_$this.loadInf];
            }
            pre.apply(this,arguments);
            if (ex && !(this instanceof MovieClip))
                SwfParser._$$initClassInDefine(cla,this,cid,_$this.loadInf);
        };
    }

    SwfParser.boundValue=function(byteData,boundsFlag)
    {
        if (!boundsFlag) {
            var value=byteData.readShort();
            return Math.round(value/20*100)/100;
        } else {
            return byteData.readFloat();
        }
    }

    SwfParser.processShape=function(ba,loadInf)
    {
        var cmds=[];
        var boundsFlag=ba.readByte() ? true : false;
        cmds["boundsFlag"]=boundsFlag;
        cmds["x"]=SwfParser.boundValue(ba,boundsFlag);
        cmds["y"]=SwfParser.boundValue(ba,boundsFlag);
        cmds["width"]=SwfParser.boundValue(ba,boundsFlag);
        cmds["height"]=SwfParser.boundValue(ba,boundsFlag);
        var recordX;
        var recordY;
        var _x;
        var _y;
        var _argb=0;
        var _color=0;
        var _alpha;
        var _gradientType;
        var _num=0;
        var _matrix;
        var _repeat=false;
        var _bitmapId=0;
        var bitmap;
        var _i=0;
        var spread;
        var focal;
        var fillStart=false;
        var cmdTemp;
        while (ba.bytesAvailable) {
            var head=ba.readUnsignedByte();
            var _type=head&0x0f;
            var _flag=head&0x10;
            if (head&0x80) {
                _type=ba.readUnsignedByte();
            }
            var _colors=[];
            var _alphas=[];
            var _ratios=[];
            switch (_type) {
            case 0:
                cmdTemp=["endShape",null];
                break;
            case 1:
                _x=SwfParser.boundValue(ba,boundsFlag);
                _y=SwfParser.boundValue(ba,boundsFlag);
                recordX=_x;
                recordY=_y;
                cmdTemp=["moveTo",[_x,_y]];
                break;
            case 2:
                _x=SwfParser.boundValue(ba,boundsFlag);
                _y=SwfParser.boundValue(ba,boundsFlag);
                recordX=_x;
                recordY=_y;
                cmdTemp=["lineTo",[_x,_y]];
                break;
            case 3:
                _y=SwfParser.boundValue(ba,boundsFlag);
                recordY=_y;
                cmdTemp=["lineTo",[recordX,_y]];
                break;
            case 4:
                _x=SwfParser.boundValue(ba,boundsFlag);
                recordX=_x;
                cmdTemp=["lineTo",[_x,recordY]];
                break;
            case 5:
                var _controlX=SwfParser.boundValue(ba,boundsFlag);
                var _controlY=SwfParser.boundValue(ba,boundsFlag);
                _x=SwfParser.boundValue(ba,boundsFlag);
                _y=SwfParser.boundValue(ba,boundsFlag);
                recordX=_x;
                recordY=_y;
                cmdTemp=["curveTo",[_controlX,_controlY,_x,_y]];
                break;
            case 8:
                _argb=ba.readUnsignedInt();
                _alpha=((_argb>>24)&0xFF)/255;
                _color=_argb&0x00FFFFFF;
                cmdTemp=["beginFill",[_color,_alpha]];
                break;
            case 9:
                if (_flag==0x10) {
                    _gradientType=GradientType.RADIAL;
                } else {
                    _gradientType=GradientType.LINEAR;
                }
                _matrix=SwfParser.readMatrix(ba);
                _num=ba.readUnsignedByte();
                for (_i=0;_i<_num;_i++) {
                    _ratios[_i]=ba.readUnsignedByte();
                    _argb=ba.readUnsignedInt();
                    _colors[_i]=_argb&0x00FFFFFF;
                    _alphas[_i]=((_argb>>24)&0xFF)/255;
                }
                spread=__string(SwfParser.SPREADSTYLE[ba.readUnsignedByte()]);
                focal=ba.readUnsignedByte();
                cmdTemp=["beginGradientFill",[_gradientType,_colors,_alphas,_ratios,_matrix,spread,InterpolationMethod.RGB,focal]];
                break;
            case 10:
                if (_flag==0x10) {
                    _repeat=true;
                } else {
                    _repeat=false;
                }
                _bitmapId=ba.readUnsignedShort();
                _matrix=SwfParser.readMatrix(ba);
                _matrix=SwfParser.changeMatrix(_matrix);
                bitmap=SwfParser._$$createObjectByCid(_bitmapId,loadInf,null);
                cmdTemp=["beginBitmapFill",[bitmap.bitmapData,_matrix,_repeat]];
                break;
            case 11:
                cmdTemp=["endFill",null];
                break;
            case 12:
                var _thickness=SwfParser.boundValue(ba,boundsFlag);
                _argb=ba.readUnsignedInt();
                _alpha=((_argb>>24)&0xFF)/255;
                _color=_argb&0x00FFFFFF;
                var _caps_joints=ba.readUnsignedByte();
                var _caps=__string(SwfParser.CAPSSTYLE[(_caps_joints&0xF0)>>4]);
                var _joint=__string(SwfParser.JOINTSTYLE[_caps_joints&0x0F]);
                var _miterLimit=ba.readUnsignedShort();
                cmdTemp=["lineStyle",[_thickness,_color,_alpha,false,"normal",_caps,_joint,_miterLimit]];
                break;
            case 13:
                if (_flag==0x10) {
                    _gradientType=GradientType.RADIAL;
                } else {
                    _gradientType=GradientType.LINEAR;
                }
                _matrix=SwfParser.readMatrix(ba);
                _num=ba.readUnsignedByte();
                for (_i=0;_i<_num;_i++) {
                    _ratios[_i]=ba.readUnsignedByte();
                    _argb=ba.readUnsignedInt();
                    _colors[_i]=_argb&0x00FFFFFF;
                    _alphas[_i]=((_argb>>24)&0xFF)/255;
                }
                spread=__string(SwfParser.SPREADSTYLE[ba.readUnsignedByte()]);
                focal=ba.readUnsignedByte();
                cmdTemp=["lineGradientStyle",[_gradientType,_colors,_alphas,_ratios,_matrix,spread,InterpolationMethod.RGB,focal]];
                break;
            case 14:
                if (_flag==0x10) {
                    _repeat=true;
                } else {
                    _repeat=false;
                }
                _bitmapId=ba.readUnsignedShort();
                _matrix=SwfParser.readMatrix(ba);
                _matrix=SwfParser.changeMatrix(_matrix);
                bitmap=SwfParser._$$createObjectByCid(_bitmapId,loadInf,null);
                cmdTemp=["lineBitmapStyle",[bitmap.bitmapData,_matrix,_repeat]];
                break;
            case 15:
                var close=ba.readUnsignedByte() ? true : false;
                cmdTemp=["endLines",[close]];
                break;
            case 18:
                fillStart=true;
                cmdTemp=null;
                break;
            case 19:
                if (fillStart)
                    fillStart=false;
                else
                    cmdTemp && (cmdTemp["_$fillFlag"]=2);
                break;
            }
            if (fillStart && cmdTemp) {
                fillStart=false;
                cmdTemp["_$fillFlag"]=1;
                cmds["_$hasFill"]=true;
            }
            cmdTemp && cmds.push(cmdTemp);
        }
        return cmds;
    }

    SwfParser.processMorphShape=function(byteData,loadInfo)
    {
        var cmdShapeArr=[];
        var boundsFlag=byteData.readByte() ? true : false;
        cmdShapeArr["x1"]=SwfParser.boundValue(byteData,boundsFlag);
        cmdShapeArr["y1"]=SwfParser.boundValue(byteData,boundsFlag);
        cmdShapeArr["w1"]=SwfParser.boundValue(byteData,boundsFlag);
        cmdShapeArr["h1"]=SwfParser.boundValue(byteData,boundsFlag);
        cmdShapeArr["x2"]=SwfParser.boundValue(byteData,boundsFlag);
        cmdShapeArr["y2"]=SwfParser.boundValue(byteData,boundsFlag);
        cmdShapeArr["w2"]=SwfParser.boundValue(byteData,boundsFlag);
        cmdShapeArr["h2"]=SwfParser.boundValue(byteData,boundsFlag);
        var _argb=0;
        var _num=0;
        var _i=0;
        var bitmapId=0;
        while (byteData.bytesAvailable) {
            var head=byteData.readUnsignedByte();
            var _type=head&0x0f;
            var _flag=head&0x10;
            var obj=new Object();
            switch (_type) {
            case 0:
                obj.cmd="endShape";
                break;
            case 1:
                obj.cmd="moveTo";
                obj.x=SwfParser.boundValue(byteData,boundsFlag);
                obj.y=SwfParser.boundValue(byteData,boundsFlag);
                obj.ex=SwfParser.boundValue(byteData,boundsFlag);
                obj.ey=SwfParser.boundValue(byteData,boundsFlag);
                break;
            case 2:
                obj.cmd="lineTo";
                obj.x=SwfParser.boundValue(byteData,boundsFlag);
                obj.y=SwfParser.boundValue(byteData,boundsFlag);
                obj.ex=SwfParser.boundValue(byteData,boundsFlag);
                obj.ey=SwfParser.boundValue(byteData,boundsFlag);
                break;
            case 5:
                obj.cmd="curveTo";
                obj.controlX=SwfParser.boundValue(byteData,boundsFlag);
                obj.controlY=SwfParser.boundValue(byteData,boundsFlag);
                obj.anchorX=SwfParser.boundValue(byteData,boundsFlag);
                obj.anchorY=SwfParser.boundValue(byteData,boundsFlag);
                obj.controlEX=SwfParser.boundValue(byteData,boundsFlag);
                obj.controlEY=SwfParser.boundValue(byteData,boundsFlag);
                obj.anchorEX=SwfParser.boundValue(byteData,boundsFlag);
                obj.anchorEY=SwfParser.boundValue(byteData,boundsFlag);
                break;
            case 8:
                obj.cmd="beginFill";
                _argb=byteData.readUnsignedInt();
                obj.alpha=((_argb>>24)&0xFF)/255;
                obj.color=_argb&0x00FFFFFF;
                _argb=byteData.readUnsignedInt();
                obj.ealpha=((_argb>>24)&0xFF)/255;
                obj.ecolor=_argb&0x00FFFFFF;
                break;
            case 9:
                obj.cmd="beginGradientFill";
                obj.gradientType=byteData.readUnsignedByte()==1 ? GradientType.RADIAL : GradientType.LINEAR;
                obj.egradientType=byteData.readUnsignedByte()==1 ? GradientType.RADIAL : GradientType.LINEAR;
                obj.matrix=SwfParser.readMatrix(byteData);
                obj.ematrix=SwfParser.readMatrix(byteData);
                obj.ratios=[];
                obj.colors=[];
                obj.alphas=[];
                obj.eratios=[];
                obj.ecolors=[];
                obj.ealphas=[];
                _num=byteData.readUnsignedByte();
                for (_i=0;_i<_num;_i++) {
                    obj.ratios[_i]=byteData.readUnsignedByte();
                    _argb=byteData.readUnsignedInt();
                    obj.colors[_i]=_argb&0x00FFFFFF;
                    obj.alphas[_i]=((_argb>>24)&0xFF)/255;
                    obj.eratios[_i]=byteData.readUnsignedByte();
                    _argb=byteData.readUnsignedInt();
                    obj.ecolors[_i]=_argb&0x00FFFFFF;
                    obj.ealphas[_i]=((_argb>>24)&0xFF)/255;
                }
                obj.spread=SwfParser.SPREADSTYLE[byteData.readUnsignedByte()];
                obj.focalPointRatio=byteData.readUnsignedByte();
                break;
            case 10:
                obj.cmd="beginBitmapFill";
                bitmapId=byteData.readUnsignedShort();
                obj.bitmap=SwfParser._$$createObjectByCid(bitmapId,loadInfo,null);
                obj.matrix=SwfParser.readMatrix(byteData);
                obj.matrix=SwfParser.changeMatrix(obj.matrix);
                obj.repeat=byteData.readUnsignedByte()==1 ? true : false;
                bitmapId=byteData.readUnsignedShort();
                obj.ebitmap=SwfParser._$$createObjectByCid(bitmapId,loadInfo,null);
                obj.ematrix=SwfParser.readMatrix(byteData);
                obj.ematrix=SwfParser.changeMatrix(obj.ematrix);
                obj.erepeat=byteData.readUnsignedByte()==1 ? true : false;
                break;
            case 11:
                obj.cmd="endFill";
                break;
            case 12:
                obj.cmd="lineStyle";
                obj.thickness=SwfParser.boundValue(byteData,boundsFlag);
                _argb=byteData.readUnsignedInt();
                obj.alpha=((_argb>>24)&0xFF)/255;
                obj.color=_argb&0x00FFFFFF;
                var _caps_joints=byteData.readUnsignedByte();
                obj.caps=SwfParser.CAPSSTYLE[(_caps_joints&0xF0)>>4];
                obj.joint=SwfParser.JOINTSTYLE[_caps_joints&0x0F];
                obj.miterLimit=byteData.readUnsignedShort();
                obj.ethickness=SwfParser.boundValue(byteData,boundsFlag);
                _argb=byteData.readUnsignedInt();
                obj.ealpha=((_argb>>24)&0xFF)/255;
                obj.ecolor=_argb&0x00FFFFFF;
                _caps_joints=byteData.readUnsignedByte();
                obj.ecaps=SwfParser.CAPSSTYLE[(_caps_joints&0xF0)>>4];
                obj.ejoint=SwfParser.JOINTSTYLE[_caps_joints&0x0F];
                obj.emiterLimit=byteData.readUnsignedShort();
                break;
            case 13:
                obj.cmd="lineGradientStyle";
                obj.gradientType=byteData.readUnsignedByte()==1 ? GradientType.RADIAL : GradientType.LINEAR;
                obj.egradientType=byteData.readUnsignedByte()==1 ? GradientType.RADIAL : GradientType.LINEAR;
                obj.matrix=SwfParser.readMatrix(byteData);
                obj.ematrix=SwfParser.readMatrix(byteData);
                obj.ratios=[];
                obj.colors=[];
                obj.alphas=[];
                obj.eratios=[];
                obj.ecolors=[];
                obj.ealphas=[];
                _num=byteData.readUnsignedByte();
                for (_i=0;_i<_num;_i++) {
                    obj.ratios[_i]=byteData.readUnsignedByte();
                    _argb=byteData.readUnsignedInt();
                    obj.colors[_i]=_argb&0x00FFFFFF;
                    obj.alphas[_i]=((_argb>>24)&0xFF)/255;
                    obj.eratios[_i]=byteData.readUnsignedByte();
                    _argb=byteData.readUnsignedInt();
                    obj.ecolors[_i]=_argb&0x00FFFFFF;
                    obj.ealphas[_i]=((_argb>>24)&0xFF)/255;
                }
                obj.spread=SwfParser.SPREADSTYLE[byteData.readUnsignedByte()];
                obj.focalPointRatio=byteData.readUnsignedByte();
                break;
            case 14:
                obj.cmd="lineBitmapStyle";
                bitmapId=byteData.readUnsignedShort();
                obj.bitmap=SwfParser._$$createObjectByCid(bitmapId,loadInfo,null);
                obj.matrix=SwfParser.readMatrix(byteData);
                obj.matrix=SwfParser.changeMatrix(obj.matrix);
                obj.repeat=byteData.readUnsignedByte()==1 ? true : false;
                bitmapId=byteData.readUnsignedShort();
                obj.ebitmap=SwfParser._$$createObjectByCid(bitmapId,loadInfo,null);
                obj.ematrix=SwfParser.readMatrix(byteData);
                obj.ematrix=SwfParser.changeMatrix(obj.ematrix);
                obj.erepeat=byteData.readUnsignedByte()==1 ? true : false;
                break;
            case 15:
                obj.cmd="endLines";
                break;
            }
            cmdShapeArr.push(obj);
        }
        return cmdShapeArr;
    }

    SwfParser.processSprite=function(ba)
    {
        var md=new MovieClipData();
        md.totalFrame=ba.readUnsignedShort();
        var t=0;
        var c=0;
        var d=0;
        var frameCmds=[];
        var cmd;
        while (ba.bytesAvailable) {
            t=ba.readUnsignedByte();
            switch (t) {
            case SwfParser.ADD_CHILD:
 {
                    var flag=ba.readUnsignedByte();
                    d=ba.readUnsignedShort();
                    c=ba.readUnsignedShort();
                    var insName=null;
                    if (flag&4) {
                        insName=ba.readUTF();
                    }
                    cmd=[d,c,insName];
                    cmd["fun"]="_$$addChild";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.REMOVE_CHILD:
 {
                    d=ba.readUnsignedShort();
                    cmd=[d];
                    cmd["fun"]="_$$removeChild";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.REMOVE_ALL:
 {
                    cmd=[];
                    cmd["fun"]="_$$removeAll";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.SET_MATRIX:
 {
                    d=ba.readUnsignedShort();
                    var m=SwfParser.readMatrix(ba);
                    cmd=[d,m];
                    cmd["fun"]="_$$setMatix";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.SET_COLOR:
 {
                    d=ba.readUnsignedShort();
                    cmd=[d,SwfParser.readColorTransform(ba)];
                    cmd["fun"]="_$$setColor";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.SET_COLOR2:
 {
                    d=ba.readUnsignedShort();
                    cmd=[d,SwfParser.readColorTransform2(ba)];
                    cmd["fun"]="_$$setColor";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.SET_RATIO:
 {
                    d=ba.readUnsignedShort();
                    var ratio=Number(ba.readUnsignedShort())/65535.0;
                    cmd=[d,ratio];
                    cmd["fun"]="_$$setRatio";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.SET_MASK:
 {
                    d=ba.readUnsignedShort();
                    var clipDepth=ba.readUnsignedShort();
                    cmd=[d,clipDepth];
                    cmd["fun"]="_$$setMask";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.SET_VISIBLE:
 {
                    d=ba.readUnsignedShort();
                    var visible=Boolean(ba.readUnsignedByte());
                    cmd=[d,visible];
                    cmd["fun"]="_$$setVisible";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.SHOW_FRAME:
 {
                    md.cmds.push(frameCmds);
                    frameCmds=[];
                    break;
                }
            case SwfParser.FRAME_LABEL:
 {
                    var num=ba.readUnsignedByte();
                    var label;
                    var frame=0;
                    for (var i=0;i<num;i++) {
                        label=ba.readUTF();
                        frame=ba.readUnsignedShort();
                        md.labs[label]=frame;
                    }
                    break;
                }
            case SwfParser.SCENE_DATA:
 {
                    num=ba.readUnsignedByte();
                    for (i=0;i<num;i++) {
                        label=ba.readUTF();
                        frame=ba.readUnsignedShort();
                        var scene=new Scene();
                        scene._$name=label;
                        scene._$startFrame=frame;
                        scene._$numFrames=md.totalFrame-frame;
                        md.scenes[i]=scene;
                        md.scenes[label]=scene;
                        if (i>0) {
                            scene=md.scenes[i-1];
                            scene._$numFrames=frame-scene._$startFrame;
                        }
                    }
                    break;
                }
            case SwfParser.START_SOUND:
 {
                    var fg=ba.readUnsignedByte();
                    c=ba.readUnsignedShort();
                    var syncStop=ba.readBoolean();
                    var syncNoMultiple=ba.readBoolean();
                    var loopCount=0;
                    var startSecond=0,endSecond=0;
                    if (fg&0x01)
                        loopCount=ba.readUnsignedShort();
                    if (fg&0x02)
                        startSecond=ba.readUnsignedShort();
                    if (fg&0x04)
                        endSecond=ba.readUnsignedShort();
                    cmd=[c,startSecond,loopCount];
                    cmd["fun"]="_$$playEvtSnd";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.STREAM_SOUND_START:
 {
                    c=ba.readUnsignedShort();
                    cmd=[c];
                    cmd["fun"]="_$$playStreamSnd";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.STREAM_SOUND_END:
 {
                    c=ba.readUnsignedShort();
                    cmd=[c];
                    cmd["fun"]="_$$stopStreamSnd";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.SET_BACKGROUND_COLOR:
 {
                    var color=ba.readUnsignedInt();
                    cmd=[color&0xffffff];
                    cmd["fun"]="_$$setBgColor";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.SET_BLENDMODE:
 {
                    d=ba.readUnsignedShort();
                    var blendMode=ba.readUnsignedByte();
                    cmd=[d,blendMode];
                    cmd["fun"]="_$$blendMode";
                    frameCmds.push(cmd);
                    break;
                }
            case SwfParser.SET_FILTER:
 {
                    d=ba.readUnsignedShort();
                    cmd=[d,SwfParser.processFilters(ba)];
                    cmd["fun"]="_$$setFilter";
                    frameCmds.push(cmd);
                }
            }
        }
        return md;
    }

    SwfParser.processFilters=function(ba)
    {
        var filters=[];
        var _blurX;
        var _blurY;
        var _quality=0;
        var _strength;
        var _angle;
        var _distance;
        var flags=0;
        var _inner=false;
        var _knockout=false;
        var _compositeSource=false;
        var _onTop=false;
        var _alpha;
        var _color=0;
        var types;
        var i=0;
        var byteLen=ba.readUnsignedInt();
        var len=ba.readUnsignedByte();
        for (var k=0;k<len;k++) {
            var type=ba.readUnsignedByte();
            switch (type) {
            case SwfParser.FILTER_DROPSHADOWINT:
            case SwfParser.FILTER_GLOW:
                var argb=ba.readUnsignedInt();
                _alpha=((argb>>24)&0xFF)/255;
                _color=argb&0x00FFFFFF;
                _blurX=ba.readInt()/65536;
                _blurY=ba.readInt()/65536;
                if (type==SwfParser.FILTER_DROPSHADOWINT) {
                    _angle=(ba.readInt()/65536)*180/Math.PI;
                    _distance=ba.readInt()/65536;
                }
                _strength=ba.readShort()/256;
                flags=ba.readUnsignedByte();
                _inner=((flags&0x80)!=0);
                _knockout=((flags&0x40)!=0);
                _compositeSource=((flags&0x20)!=0);
                _quality=flags&0x1f;
                if (type==SwfParser.FILTER_DROPSHADOWINT) {
                    var drop=new DropShadowFilter(_distance,_angle,_color,_alpha,_blurX,_blurY,_strength,_quality,_inner);
                    filters.push(drop);
                } else {
                    var glow=new GlowFilter(_color,_alpha,_blurX,_blurY,_strength,_quality,_inner,_knockout);
                    filters.push(glow);
                }
                break;
            case SwfParser.FILTER_BLUR:
                _blurX=ba.readInt()/65536;
                _blurY=ba.readInt()/65536;
                _quality=ba.readUnsignedByte()>>3;
                var blur=new BlurFilter(_blurX,_blurY,_quality);
                filters.push(blur);
                break;
            case SwfParser.FILTER_BEVEL:
                var shadowColor=ba.readUnsignedInt();
                _alpha=((shadowColor>>24)&0xFF)/255;
                _color=shadowColor&0x00FFFFFF;
                var highlightColor=ba.readUnsignedInt();
                var _halpha=((highlightColor>>24)&0xFF)/255;
                var _hcolor=highlightColor&0x00FFFFFF;
                _blurX=ba.readInt()/65536;
                _blurY=ba.readInt()/65536;
                _angle=(ba.readInt()/65536)*180/Math.PI;
                _distance=ba.readInt()/65536;
                _strength=ba.readShort()/256;
                flags=ba.readUnsignedByte();
                _inner=((flags&0x80)!=0);
                _knockout=((flags&0x40)!=0);
                _compositeSource=((flags&0x20)!=0);
                _onTop=((flags&0x10)!=0);
                _quality=flags&0x0f;
                if (_inner) {
                    types=BitmapFilterType.INNER;
                } else if (_onTop) {
                    types=BitmapFilterType.FULL;
                } else {
                    types=BitmapFilterType.OUTER;
                }
                var bevel=new BevelFilter(_distance,_angle,_hcolor,_halpha,_color,_alpha,_blurX,_blurY,_strength,_quality,types,_knockout);
                filters.push(bevel);
                break;
            case SwfParser.FILTER_GRADIENTGLOW:
            case SwfParser.FILTER_GRADIENTBEVEL:
                var numColors=ba.readUnsignedByte();
                var _colors=[];
                var _alphas=[];
                var _ratios=[];
                for (i=0;i<numColors;i++) {
                    var gradientRGBA=ba.readUnsignedInt();
                    _alphas.push(((gradientRGBA>>24)&0xFF)/255);
                    _colors.push(gradientRGBA&0x00FFFFFF);
                }
                for (i=0;i<numColors;i++) {
                    _ratios.push(ba.readUnsignedByte());
                }
                _blurX=ba.readInt()/65536;
                _blurY=ba.readInt()/65536;
                _angle=(ba.readInt()/65536)*180/Math.PI;
                _distance=ba.readInt()/65536;
                _strength=ba.readShort()/256;
                flags=ba.readUnsignedByte();
                _inner=((flags&0x80)!=0);
                _knockout=((flags&0x40)!=0);
                _compositeSource=((flags&0x20)!=0);
                _onTop=((flags&0x10)!=0);
                _quality=flags&0x0f;
                if (_inner) {
                    types=BitmapFilterType.INNER;
                } else if (_onTop) {
                    types=BitmapFilterType.FULL;
                } else {
                    types=BitmapFilterType.OUTER;
                }
                if (type==SwfParser.FILTER_GRADIENTGLOW) {
                    var gradientGlow=new GradientGlowFilter(_distance,_angle,_colors,_alphas,_ratios,_blurX,_blurY,_strength,_quality,types,_knockout);
                    filters.push(gradientGlow);
                } else {
                    var gradientBevel=new GradientBevelFilter(_distance,_angle,_colors,_alphas,_ratios,_blurX,_blurY,_strength,_quality,types,_knockout);
                    filters.push(gradientBevel);
                }
                break;
            case SwfParser.FILTER_CONVOLUTION:
                var matrixX=ba.readUnsignedByte();
                var matrixY=ba.readUnsignedByte();
                var matrixs;
                var divisor=ba.readFloat();
                var bias=ba.readFloat();
                var matrixXY=matrixX*matrixY;
                for (i=0;i<matrixXY;i++) {
                    matrixs.push(ba.readFloat());
                }
                var defaultColor=ba.readUnsignedInt();
                _alpha=((shadowColor>>24)&0xFF)/255;
                _color=shadowColor&0x00FFFFFF;
                flags=ba.readUnsignedByte();
                var clamp=((flags&0x02)!=0);
                var preserveAlpha=((flags&0x01)!=0);
                var convolutton=new ConvolutionFilter(matrixX,matrixY,matrixs,divisor,bias,preserveAlpha,clamp,_color,_alpha);
                filters.push(convolutton);
                break;
            case SwfParser.FILTER_COLORMATRIX:
                var colors=[];
                for (var j=0;j<20;j++) {
                    colors.push(ba.readFloat());
                }
                var colorMatrix=new ColorMatrixFilter(colors);
                filters.push(colorMatrix);
                break;
            }
        }
        return filters;
    }

    SwfParser.processSimpBtn=function(ba,hasColor)
    {
        (hasColor===void 0) && (hasColor=false);
        var stateArr=[];
        var state;
        var num=0;
        var id=0;
        var m;
        for (var i=0;i<4;i++) {
            num=ba.readUnsignedByte();
            state=[];
            for (var j=0;j<num;j++) {
                id=ba.readUnsignedShort();
                m=SwfParser.readMatrix(ba);
                var c=null;
                if (hasColor) {
                    c=SwfParser.readColorTransform(ba);
                }
                state.push([id,m,c,null]);
            }
            stateArr[i]=state;
        }
        return stateArr;
    }

    SwfParser.processSimpBtn3=function(ba)
    {
        var stateArr=[];
        var state;
        var num=0;
        var id=0;
        var m;
        var flag=0;
        for (var i=0;i<4;i++) {
            num=ba.readUnsignedByte();
            state=[];
            for (var j=0;j<num;j++) {
                id=ba.readUnsignedShort();
                m=SwfParser.readMatrix(ba);
                flag=ba.readUnsignedByte();
                var c=null;
                if (flag&0x04) {
                    c=SwfParser.readColorTransform2(ba);
                }
                var blendMode=0;
                if (flag&0x01) {
                    blendMode=ba.readUnsignedByte();
                }
                var filters=null;
                if (flag&0x02) {
                    filters=SwfParser.processFilters(ba);
                }
                state.push([id,m,c,filters,blendMode]);
            }
            stateArr[i]=state;
        }
        return stateArr;
    }

    SwfParser.processFont=function(ba,loadInfo)
    {
        var font=new Font();
        var flag=ba.readUnsignedByte();
        font._$fontType=FontType.EMBEDDED;
        font._$fontName=ba.readUTF();
        var num=ba.readUnsignedShort();
        var nbyte=0;
        var shapeArr;
        var bytes;
        var i=0;
        for (i=0;i<num;i++) {
            nbyte=ba.readUnsignedInt();
            bytes=new ByteArray();
            ba.readBytes(bytes,0,nbyte);
            shapeArr=SwfParser.processShape(bytes,loadInfo);
            font._$glyphs.push(shapeArr);
        }
        if (flag&2) {
            font._$codeTable=[];
            for (i=0;i<num;i++) {
                font._$codeTable.push(ba.readUnsignedShort());
            }
        }
        if (flag&4) {
            font._$fontAscent=ba.readUnsignedShort();
            font._$fontDescent=ba.readUnsignedShort();
            font._$fontLeading=ba.readShort();
            font._$advanceTable=[];
            for (i=0;i<num;i++) {
                font._$advanceTable.push(ba.readShort());
            }
        }
        return font;
    }

    SwfParser.processText=function(ba)
    {
        var obj={};
        obj.x=ba.readFloat();
        obj.y=ba.readFloat();
        obj.w=ba.readFloat();
        obj.h=ba.readFloat();
        obj.wordWrap=ba.readBoolean();
        obj.multiline=ba.readBoolean();
        obj.readOnly=ba.readBoolean();
        obj.align=ba.readByte();
        obj.textColor=ba.readUTF();
        obj.fontHeight=ba.readFloat();
        obj.initialText=ba.readUTF();
        return obj;
    }

    SwfParser.processStaticText=function(ba,loadInfo)
    {
        var m=SwfParser.readMatrix(ba);
        var glyphBytes=ba.readUnsignedByte();
        var advanceBytes=ba.readUnsignedByte();
        var num=ba.readUnsignedShort();
        var cmds=[];
        var codes=[];
        var flag=0;
        var fontId=0;
        var font;
        var color=0;
        var alpha=1.0;
        var offx=m.tx;
        var offy=m.ty;
        cmds["x"]=offx;
        cmds["y"]=offy;
        var w=0;
        var h=offy|0;
        var size;
        var advance=0;
        for (var i=0;i<num;i++) {
            flag=ba.readUnsignedByte();
            if (flag&8) {
                fontId=ba.readUnsignedShort();
                font=loadInfo._$resDic[fontId];
                if (!font["ready"]) {
                    font=SwfParser.parseRes(font["resType"]|0,fontId,loadInfo,font["flag"]|0);
                }
            }
            if (flag&4) {
                var c=ba.readUnsignedInt();
                color=c&0xffffff;
                alpha=((c>>24) && 0xff)/255;
            }
            if (flag&1) {
                offx=ba.readShort()/20+m.tx;
            }
            if (flag&2) {
                offy=ba.readShort()/20+m.ty;
            }
            if (flag&8) {
                size=ba.readUnsignedShort()/20;
            }
            var gnum=ba.readUnsignedByte();
            var j=0;
            var gid=0;
            for (j=0;j<gnum;j++) {
                gid=(glyphBytes==1) ? ba.readUnsignedByte() : ba.readUnsignedShort();
                SwfParser.processFontCmd(cmds,font,color,alpha,gid,offx,offy,size,loadInfo);
                advance=(advanceBytes==1) ? ba.readByte() : ba.readShort();
                advance=advance/20;
                offx+=advance;
                w+=advance|0;
                codes.push(font._$codeTable[gid]);
            }
        }
        cmds["width"]=offx-m.tx;
        cmds["height"]=offy-m.ty;
        cmds["text"]=String.fromCharCode.apply(null,codes);
        return cmds;
    }

    SwfParser.processStaticText2=function(ba,loadInfo)
    {
        var flag=ba.readUnsignedByte();
        var x=flag==1 ? ba.readFloat() : ba.readShort()/20;
        var y=flag==1 ? ba.readFloat() : ba.readShort()/20;
        var w=flag==1 ? ba.readFloat() : ba.readShort()/20;
        var h=flag==1 ? ba.readFloat() : ba.readShort()/20;
        var cmds=SwfParser.processStaticText(ba,loadInfo);
        cmds["x"]=x;
        cmds["y"]=y;
        cmds["width"]=w;
        cmds["height"]=h;
        return cmds;
    }

    SwfParser.processFontCmd=function(cmds,font,color,alpha,gid,offx,offy,size,loadInfo)
    {
        var shapeCmd=font._$glyphs[gid];
        var num=shapeCmd.length;
        var cmd,args;
        var sc=size/1024;
        for (var i=0;i<num;i++) {
            cmd=__string(shapeCmd[i][0]);
            args=shapeCmd[i][1];
            if (cmd=="moveTo" || cmd=="lineTo") {
                args=[args[0]*sc+offx,args[1]*sc+offy];
                cmds.push([cmd,args]);
            } else if (cmd=="curveTo") {
                args=[args[0]*sc+offx,args[1]*sc+offy,args[2]*sc+offx,args[3]*sc+offy];
                cmds.push([cmd,args]);
            } else if (cmd=="beginFill") {
                args=[color,alpha];
                cmds.push([cmd,args]);
            } else {
                cmds.push(shapeCmd[i]);
            }
        }
    }

    SwfParser._$$initClassInDefine=function(cla,obj,cid,loadInf)
    {
        var res=loadInf._$resDic[cid];
        if (!res)
            return;
        var resType=res["resType"]|0;
        if (!res["ready"]) {
            res=SwfParser.parseRes(resType,cid,loadInf,res["flag"]|0);
        }
        obj._$cid=cid;
        obj._$loaderInfo=loadInf;
        var grid;
        if (obj instanceof BitmapData) {
            obj._$resizeCanvas(res.width,res.height);
            obj._$trans=res["transp"];
            obj._$context.drawImage(res,0,0);
            return;
        }
        if (obj instanceof Bitmap) {
            obj._parent_=cla["$pnt"];
            obj._$setImage(res,res["transp"]);
            obj._$cid=cid;
            return;
        }
        if (obj instanceof MovieClip) {
            obj._parent_=cla["$pnt"];
            obj._$data=res.clone();
            obj._type_|=DisplayObject.TYPE_CREATE_FROM_TAG;
            obj._$loaderInfo=loadInf;
            obj._$isStop=false;
            obj._$runCmd(0);
            grid=loadInf._$grid9s[cid];
            grid && (obj.scale9Data=grid);
            return;
        }
        if (obj instanceof Sprite) {
            obj._parent_=cla["$pnt"];
            obj._$data=res.clone();
            obj._type_|=DisplayObject.TYPE_CREATE_FROM_TAG;
            obj._$$initFromTag();
            grid=loadInf._$grid9s[cid];
            grid && (obj.scale9Data=grid);
            return;
        }
        if (obj instanceof SimpleButton) {
            obj._parent_=cla["$pnt"];
            obj.upState=SwfParser.createButtonState(res[0],loadInf);
            obj.overState=SwfParser.createButtonState(res[1],loadInf);
            obj.downState=SwfParser.createButtonState(res[2],loadInf);
            obj.hitTestState=SwfParser.createButtonState(res[3],loadInf);
            obj._$switchState(obj.upState);
            grid=loadInf._$grid9s[cid];
            grid && (obj.scale9Data=grid);
            return;
        }
        if (obj instanceof Sound) {
            obj._$initFromTag(res);
            return;
        }
        if (obj instanceof ByteArray) {
            obj.writeBytes(res);
            obj.position=0;
            return;
        }
        trace("_$$initClassInDefine: No find "+cid);
    }

    SwfParser._$$createObjectByCid=function(cid,loadInf,parent,target)
    {
        (target===void 0) && (target=null);
        var res=loadInf._$resDic[cid];
        if (!res)
            return null;
        var resType=res["resType"]|0;
        if (!res["ready"]) {
            res=SwfParser.parseRes(resType,cid,loadInf,res["flag"]|0);
        }
        if (!target) {
            var symblName=__string(loadInf._$id2symbol[cid]);
            if (symblName) {
                var c=__as(getDefinitionByName(symblName),Class);
                if (c) {
                    c["$pnt"]=parent;
                    var co=new c();
                    c["$pnt"]=null;
                    return co;
                }
            }
        }
        var grid;
        var len=0;
        var arr;
        var i=0;
        var obj;
        switch (resType) {
        case SwfParser.RES_BITMAP:
 {
                if (target==null) {
                    obj=new Bitmap();
                } else {
                    obj=target;
                }
                obj._$cid=cid;
                obj._parent_=parent;
                obj._$loaderInfo=loadInf;
                obj._$setImage(res,res["transp"]);
                return obj;
            }
        case SwfParser.RES_SHAPE:
        case SwfParser.RES_SHAPE2:
 {
                if (target==null) {
                    obj=new Shape();
                    var tg=new TagGraphics(obj);
                    obj._$graphics=tg;
                } else {
                    obj=target;
                    tg=new TagGraphics(obj);
                    obj._$graphics=tg;
                }
                obj._parent_=parent;
                obj._$cid=cid;
                obj._$loaderInfo=loadInf;
                tg._$x=res["x"];
                tg._$y=res["y"];
                tg._$width=res["width"];
                tg._$height=res["height"];
                tg._$res=res;
                if (res["ecmds"]) {
                    tg._canvas_._cmds_=res["ecmds"];
                } else {
                    len=res.length|0;
                    for (i=0;i<len;i++) {
                        arr=res[i];
                        tg[arr[0]].apply(tg,arr[1]);
                    }
                    res["ecmds"]=tg._canvas_._cmds_;
                }
                return obj;
            }
        case SwfParser.RES_MORPH_SHAPE:
 {
                if (target==null) {
                    obj=new MorphShape();
                } else {
                    obj=target;
                }
                obj._$cid=cid;
                obj._parent_=parent;
                obj._$loaderInfo=loadInf;
                tg=obj._$graphics;
                obj.setBounds(res["x1"],res["y1"],res["w1"],res["h1"],res["x2"],res["y2"],res["w2"],res["h2"]);
                obj._$shapeData=res;
                obj.ratio=0;
                return obj;
            }
        case SwfParser.RES_SPRITE:
 {
                if (target==null) {
                    obj=new MovieClip();
                    obj._$data=res.clone();
                } else {
                    obj=target;
                }
                obj._parent_=parent;
                obj._$cid=cid;
                obj._$loaderInfo=loadInf;
                if (!target) {
                    obj._type_|=DisplayObject.TYPE_CREATE_FROM_TAG;
                    obj._$isStop=false;
                    obj._$runCmd(0);
                }
                grid=loadInf._$grid9s[cid];
                grid && (obj.scale9Data=grid);
                return obj;
            }
        case SwfParser.RES_SIMPLEBUTTON:
        case SwfParser.RES_SIMPLEBUTTON2:
        case SwfParser.RES_SIMPLEBUTTON3:
 {
                if (target==null) {
                    obj=new SimpleButton();
                } else {
                    obj=target;
                }
                obj._parent_=parent;
                obj._$cid=cid;
                obj._$loaderInfo=loadInf;
                obj.upState=SwfParser.createButtonState(res[0],loadInf);
                obj.overState=SwfParser.createButtonState(res[1],loadInf);
                obj.downState=SwfParser.createButtonState(res[2],loadInf);
                obj.hitTestState=SwfParser.createButtonState(res[3],loadInf);
                obj._$switchState(obj.upState);
                grid=loadInf._$grid9s[cid];
                return obj;
            }
        case SwfParser.RES_STATIC_TEXT:
        case SwfParser.RES_STATIC_TEXT2:
 {
                if (target==null) {
                    obj=new StaticText();
                } else {
                    obj=target;
                }
                obj._parent_=parent;
                obj._$cid=cid;
                obj._$loaderInfo=loadInf;
                var tg=obj._$graphics=new TagGraphics(obj);
                tg._$x=res["x"];
                tg._$y=res["y"];
                tg._$width=res["width"];
                tg._$height=res["height"];
                if (res["ecmds"]) {
                    tg._canvas_._cmds_=res["ecmds"];
                } else {
                    len=res.length|0;
                    for (i=0;i<len;i++) {
                        arr=res[i];
                        tg[arr[0]].apply(tg,arr[1]);
                    }
                    res["ecmds"]=tg._canvas_._cmds_;
                }
                obj._$text=res["text"];
                return obj;
            }
        case SwfParser.RES_TEXT:
 {
                if (target==null) {
                    obj=new TextField();
                    obj.embedFonts=true;
                } else {
                    return target;
                }
                obj._parent_=parent;
                obj._$cid=cid;
                obj._$loaderInfo=loadInf;
                obj.width=res.w;
                obj.height=res.h;
                obj.tempBound={x: res.x,y: res.y};
                obj.multiline=res.multiline;
                obj.wordWrap=res.wordWrap;
                (!res.readOnly) && (obj.type="input");
                var tf=new TextFormat();
                tf.size=res.fontHeight/20;
                if (res.align==0)
                    tf.align="left";
                else if (res.align==1)
                    tf.align="right";
                else if (res.align==2)
                    tf.align="center";
                var index=res.textColor.lastIndexOf("*")|0;
                if (index!= -1) {
                    var temp=res.textColor.substring(index+1);
                    if (temp.indexOf('Bold')> -1)
                        tf.bold=true;
                    if (temp.indexOf('Italic')> -1)
                        tf.italic=true;
                    tf.font=__string(temp.replace(/\s*(Bold|Italic)\s*/g,''));
                    tf.color=Number(res.textColor.substring(0,index));
                } else {
                    tf.color=Number(res.textColor);
                }
                if (res.initialText) {
                    if (res.initialText.indexOf("<p")== -1) {
                        obj.text=res.initialText;
                    } else {
                        obj.htmlText=res.initialText;
                    }
                }
                obj.defaultTextFormat=tf;
                return obj;
            }
        case SwfParser.RES_STREAM_SOUND:
        case SwfParser.RES_EVENT_SOUND:
 {
                obj=new Sound();
                obj._$initFromTag(res);
                obj._$bytesTotal=res["ttlByte"];
                obj._$loaderInfo=loadInf;
                obj._$cid=cid;
                return obj;
            }
        case SwfParser.RES_VIDEO:
 {
                obj=new Video();
                obj._parent_=parent;
                obj._$cid=cid;
                obj._$loaderInfo=loadInf;
                return obj;
            }
        default:
 {
                trace("_$$createObjectByCid: No find "+cid);
                return obj;
            }
        }
    }

    SwfParser.createButtonState=function(stateArr,loadInf)
    {
        var state;
        var f;
        if (stateArr.length==1) {
            state=stateArr[0];
            var obj=SwfParser._$$createObjectByCid(state[0]|0,loadInf,null);
            obj.matrix=state[1];
            state[2] && (obj.alpha=state[2]._$getAlpha());
            f=state[3];
            if (f && f.length>0)
                obj.filters=f;
            state[4] && (obj.blendMode=Sprite._$getBlendModeStr(state[4]|0));
            return obj;
        }
        if (stateArr.length>1) {
            var sp=new Sprite();
            var ot;
            for (var j=0;j<stateArr.length;j++) {
                state=stateArr[j];
                ot=SwfParser._$$createObjectByCid(state[0]|0,loadInf,null);
                ot.matrix=state[1];
                state[2] && (ot.alpha=state[2]._$getAlpha());
                f=state[3];
                if (f && f.length>0)
                    ot.filters=f;
                state[4] && (ot.blendMode=Sprite._$getBlendModeStr(state[4]|0));
                sp.addChild(ot);
            }
            return sp;
        }
        return null;
    }

    SwfParser.parseRes=function(resType,cid,loadInf,flag)
    {
        var res;
        var ba=loadInf._$resDataDic[cid];
        if (!ba) {
            trace("*****未找到资源id:"+cid);
            return null;
        }
        switch (resType) {
        case SwfParser.RES_SHAPE:
 {
                res=SwfParser.processShape(ba,loadInf);
                res["resType"]=SwfParser.RES_SHAPE;
                var isCacheBitmap=flag&1;
                break;
            }
        case SwfParser.RES_SPRITE:
 {
                res=SwfParser.processSprite(ba);
                res["resType"]=SwfParser.RES_SPRITE;
                break;
            }
        case SwfParser.RES_SIMPLEBUTTON:
 {
                res=SwfParser.processSimpBtn(ba);
                res["resType"]=SwfParser.RES_SIMPLEBUTTON;
                break;
            }
        case SwfParser.RES_SIMPLEBUTTON2:
 {
                res=SwfParser.processSimpBtn(ba,true);
                res["resType"]=SwfParser.RES_SIMPLEBUTTON;
                break;
            }
        case SwfParser.RES_SIMPLEBUTTON3:
 {
                res=SwfParser.processSimpBtn3(ba);
                res["resType"]=SwfParser.RES_SIMPLEBUTTON;
                break;
            }
        case SwfParser.RES_TEXT:
 {
                res=SwfParser.processText(ba);
                res["resType"]=SwfParser.RES_TEXT;
                break;
            }
        case SwfParser.RES_FONT:
 {
                res=SwfParser.processFont(ba,loadInf);
                res["resType"]=SwfParser.RES_FONT;
                break;
            }
        case SwfParser.RES_STATIC_TEXT:
 {
                res=SwfParser.processStaticText(ba,loadInf);
                res["resType"]=SwfParser.RES_STATIC_TEXT;
                break;
            }
        case SwfParser.RES_STATIC_TEXT2:
 {
                res=SwfParser.processStaticText2(ba,loadInf);
                res["resType"]=SwfParser.RES_STATIC_TEXT2;
                break;
            }
        case SwfParser.RES_MORPH_SHAPE:
 {
                res=SwfParser.processMorphShape(ba,loadInf);
                res["resType"]=SwfParser.RES_MORPH_SHAPE;
                break;
            }
        case SwfParser.RES_BINARYDATA:
 {
                res=ba;
                res["resType"]=SwfParser.RES_BINARYDATA;
                break;
            }
        default:
 {
                trace("无效的资源类型："+resType);
                return null;
            }
        }
        res["ready"]=1;
        loadInf._$resDic[cid]=res;
        loadInf._$resDataDic[cid]=null;
        return res;
    }

    SwfParser.changeMatrix=function(matrix)
    {
        if (SwfParser.isNewMatrix) {
            matrix.a=matrix.a/20;
            matrix.b=matrix.b/20;
            matrix.c=matrix.c/20;
            matrix.d=matrix.d/20;
        }
        return matrix;
    }

    SwfParser.readMatrix=function(bytes)
    {
        var flag=bytes.readUnsignedByte();
        SwfParser.isNewMatrix=Boolean(flag&0x80);
        var hasS=flag&1;
        var hasR=flag&2;
        var hasT=flag&4;
        if (!hasS && !hasR && !hasT)
            return new Matrix();
        var a=1;
        var b=0;
        var c=0;
        var d=1;
        var tx=0;
        var ty=0;
        if (SwfParser.isNewMatrix) {
            if (hasS) {
                a=(flag&0x10) ? bytes.readUnsignedShort()/65536 : bytes.readInt()/65536;
                d=(flag&0x10) ? bytes.readUnsignedShort()/65536 : bytes.readInt()/65536;
            }
            if (hasR) {
                b=(flag&0x20) ? bytes.readUnsignedShort()/65536 : bytes.readInt()/65536;
                c=(flag&0x20) ? bytes.readUnsignedShort()/65536 : bytes.readInt()/65536;
            }
            if (hasT) {
                tx=(flag&0x40) ? bytes.readShort()/20 : bytes.readInt()/20;
                ty=(flag&0x40) ? bytes.readShort()/20 : bytes.readInt()/20;
            }
        } else {
            if (hasS) {
                a=(flag&0x10) ? bytes.readShort()/256.0 : bytes.readFloat();
                d=(flag&0x10) ? bytes.readShort()/256.0 : bytes.readFloat();
            }
            if (hasR) {
                b=(flag&0x20) ? bytes.readShort()/256.0 : bytes.readFloat();
                c=(flag&0x20) ? bytes.readShort()/256.0 : bytes.readFloat();
            }
            if (hasT) {
                tx=(flag&0x40) ? bytes.readShort()/20.0 : bytes.readFloat();
                ty=(flag&0x40) ? bytes.readShort()/20.0 : bytes.readFloat();
            }
        }
        return new Matrix(a,b,c,d,tx,ty);
    }

    SwfParser.readColorTransform=function(ba)
    {
        var rm=ba.readUnsignedShort()/256.0;
        var ro=ba.readUnsignedByte();
        var gm=ba.readUnsignedShort()/256.0;
        var go=ba.readUnsignedByte();
        var bm=ba.readUnsignedShort()/256.0;
        var bo=ba.readUnsignedByte();
        var am=ba.readUnsignedShort()/256.0;
        var ao=ba.readUnsignedByte();
        return new ColorTransform(rm,gm,bm,am,ro,go,bo,ao);
    }

    SwfParser.readColorTransform2=function(ba)
    {
        var rm=ba.readUnsignedShort()/256.0;
        var ro=ba.readShort();
        var gm=ba.readUnsignedShort()/256.0;
        var go=ba.readShort();
        var bm=ba.readUnsignedShort()/256.0;
        var bo=ba.readShort();
        var am=ba.readUnsignedShort()/256.0;
        var ao=ba.readShort();
        return new ColorTransform(rm,gm,bm,am,ro,go,bo,ao);
    }

    SwfParser.TYPE_RES_DATA=0x02;
    SwfParser.TYPE_RESOURCE=0x03;
    SwfParser.TYPE_SYMBOL_CLASS=0x04;
    SwfParser.TYPE_SCALE9GRID=0x05;
    SwfParser.RES_BITMAP=0x01;
    SwfParser.RES_BITMAP_ATLAS=0x02;
    SwfParser.RES_SHAPE=0x0a;
    SwfParser.RES_SHAPE2=0x1f;
    SwfParser.RES_SHAPE_ATLAS=0x0b;
    SwfParser.RES_SPRITE=0x15;
    SwfParser.RES_SIMPLEBUTTON=0x16;
    SwfParser.RES_TEXT=0x17;
    SwfParser.RES_STATIC_TEXT=0x18;
    SwfParser.RES_FONT=0x19;
    SwfParser.RES_MORPH_SHAPE=0x1a;
    SwfParser.RES_EVENT_SOUND=0x1b;
    SwfParser.RES_STREAM_SOUND=0x1c;
    SwfParser.RES_VIDEO=0x1d;
    SwfParser.RES_SIMPLEBUTTON2=0x1e;
    SwfParser.RES_SIMPLEBUTTON3=0x20;
    SwfParser.RES_STATIC_TEXT2=0x21;
    SwfParser.RES_BINARYDATA=0x22;
    SwfParser.SHOW_FRAME=0x01;
    SwfParser.FRAME_LABEL=0x02;
    SwfParser.ADD_CHILD=0x03;
    SwfParser.REMOVE_CHILD=0x04;
    SwfParser.REMOVE_ALL=0x05;
    SwfParser.SET_MATRIX=0x07;
    SwfParser.SET_COLOR=0x08;
    SwfParser.SET_RATIO=0x09;
    SwfParser.SET_MASK=0x0a;
    SwfParser.START_SOUND=0xb;
    SwfParser.STREAM_SOUND_START=0xc;
    SwfParser.STREAM_SOUND_END=0xd;
    SwfParser.SET_BACKGROUND_COLOR=0xe;
    SwfParser.SET_BLENDMODE=0xf;
    SwfParser.SET_FILTER=0x10;
    SwfParser.SET_COLOR2=0x11;
    SwfParser.SET_VISIBLE=0x12;
    SwfParser.SCENE_DATA=0x13;
    SwfParser.FILTER_DROPSHADOWINT=0x00;
    SwfParser.FILTER_BLUR=0x01;
    SwfParser.FILTER_GLOW=0x02;
    SwfParser.FILTER_BEVEL=0x03;
    SwfParser.FILTER_GRADIENTGLOW=0x04;
    SwfParser.FILTER_CONVOLUTION=0x05;
    SwfParser.FILTER_COLORMATRIX=0x06;
    SwfParser.FILTER_GRADIENTBEVEL=0x07;
    SwfParser.isNewMatrix=false;

    __static(SwfParser,[
        'JOINTSTYLE',function(){return this.JOINTSTYLE={1: "bevel",2: "miter",3: "round"};},
        'CAPSSTYLE',function(){return this.CAPSSTYLE={1: "none",2: "round",3: "square"};},
        'SPREADSTYLE',function(){return this.SPREADSTYLE={1: "pad",2: "reflect",3: "repeat"};}
    ]);

    SwfParser.toString=function(){return "[class SwfParser]";};
    Mira.un_proto(SwfParser);
    return SwfParser;
})();

var TagCanvasGradient=(function() {
    function TagCanvasGradient()
    {
        this.obj=new Object();
        this.obj["offsets"]=[];
        this.obj["colors"]=[];
        this.obj["alphas"]=[];
    }

    __class(TagCanvasGradient,'mirage.swf.TagCanvasGradient');
    var __proto=TagCanvasGradient.prototype;

    __proto.createLinearGradient=function(x0,y0,x1,y1)
    {
        this.obj["type"]="linear";
        this.obj["x0"]=x0;
        this.obj["y0"]=y0;
        this.obj["x1"]=x1;
        this.obj["y1"]=y1;
    }

    __proto.createRadialGradient=function(x0,y0,r0,x1,y1,r1)
    {
        this.obj["type"]="radial";
        this.obj["x0"]=x0;
        this.obj["y0"]=y0;
        this.obj["r0"]=r0;
        this.obj["x1"]=x1;
        this.obj["y1"]=y1;
        this.obj["r1"]=r1;
    }

    __proto.addColorStop=function(offset,color,alpha)
    {
        this.obj["offsets"].push(offset);
        this.obj["colors"].push(color);
        this.obj["alphas"].push(alpha);
    }

    __proto.createCanvasGradient=function()
    {
        var grd;
        if (this.obj.type=="linear") {
            grd=TagCanvasGradient.helpContext.createLinearGradient(this.obj.x0,this.obj.y0,this.obj.x1,this.obj.y1);
        } else {
            grd=TagCanvasGradient.helpContext.createRadialGradient(this.obj.x0,this.obj.y0,this.obj.r0,this.obj.x1,this.obj.y1,this.obj.r1);
        }
        var len=this.obj.offsets.length|0;
        for (var i=0;i<len;i++) {
            grd.addColorStop(this.obj.offsets[i],this._$tocolor(this.obj.colors[i]|0,this.obj.alphas[i]));
        }
        return grd;
    }

    __proto._$tocolor=function(color,alpha)
    {
        var r=(color>>16)&0xff;
        var g=(color>>8)&0xff;
        var b=color&0xff;
        var a=alpha;
        return "rgba("+r+","+g+","+b+","+a+")";
    }

    __static(TagCanvasGradient,[
        'helpContext',function(){return this.helpContext=document.createElement('canvas').getContext("2d");}
    ]);

    TagCanvasGradient.toString=function(){return "[class TagCanvasGradient]";};
    Mira.un_proto(TagCanvasGradient);
    return TagCanvasGradient;
})();

var Graphics=(function() {
    function Graphics(ower,isXor)
    {
        this._$width=0;
        this._$height=0;
        this._$x=0;
        this._$y=0;
        this._rectArea=null;
        this._$hasFill=false;
        this._$hasLineFill=false;
        this.currThickness=0;
        this.lastMoveX=NaN;
        this._$pNum=0;
        (isXor===void 0) && (isXor=false);
        this.ower=ower;
        this._canvas_=new VirtualCanvas();
        this._canvas_["graphics"]=this;
        this._context_=this._canvas_.getContext("2d");
        this._context_.lineCap="round";
        this._context_.lineJoin="round";
        isXor && (this._context_.globalCompositeOperation="xor");
    }

    __class(Graphics,'flash.display.Graphics');
    var __proto=Graphics.prototype;

    __proto.unionPoint=function(x,y)
    {
        var ht=this.currThickness/2;
        var rect=this._rectArea;
        x-=ht;
        y-=ht;
        if (x<rect.x) {
            rect.width+=rect.x-x;
            rect.x=x;
        } else if (x>rect.x+rect.width) {
            rect.width=x-rect.x+this.currThickness;
        }
        if (y<rect.y) {
            rect.height+=rect.y-y;
            rect.y=y;
        } else if (y>rect.y+rect.height) {
            rect.height=y-rect.y+this.currThickness;
        }
    }

    __proto._expandSize_=function(x,y)
    {
        if (!this._rectArea) {
            this._rectArea=new Rectangle();
            if (isNaN(this.lastMoveX)) {
                this._rectArea.x=x;
                this._rectArea.y=y;
            } else {
                this._rectArea.x=this.lastMoveX-this.currThickness/2;
                this._rectArea.y=this.lastMoveY-this.currThickness/2;
            }
        }
        this.unionPoint(x,y);
        if (this._rectArea.width>this._$width || this._rectArea.height>this._$height) {
            this._$width=Math.max(this._$width,this._rectArea.width);
            this._$height=Math.max(this._$height,this._rectArea.height);
            this.ower._height_=this._$height;
            this.ower._width_=this._$width;
            this._$x=this._rectArea.x;
            this._$y=this._rectArea.y;
            this._canvas_.size(this._$width,this._$height);
        }
    }

    __proto.isReady=function()
    {
        return this._$width>0 || this._$height>0;
    }

    __proto.getRgbaColor=function(color,alpha)
    {
        var r=(color>>16)&0xff;
        var g=(color>>8)&0xff;
        var b=color&0xff;
        return "rgba("+r+","+g+","+b+","+alpha+")";
    }

    __proto.createGradientFillStyle=function(type,colors,alphas,ratios)
    {
        var g;
        if (type==GradientType.LINEAR) {
            g=Graphics.helpContext.createLinearGradient( -1,0,1,0);
        } else {
            g=Graphics.helpContext.createRadialGradient(0,0,0,0,0,1);
        }
        var cn=colors.length;
        var r;
        for (var i=0;i<cn;i++) {
            r=ratios[i]/255.0;
            g.addColorStop(r,this.getRgbaColor(colors[i]|0,alphas[i]));
        }
        return g;
    }

    __proto.createGradientLineStyle=function(type,colors,alphas,ratios,matrix)
    {
        var g;
        if (matrix==null)
            matrix=new Matrix();
        var m=matrix.clone();
        if (m.c!=0) {
            var t=Math.atan2(matrix.c,matrix.a);
            if (t>0)
                t=Math.PI*2-t;
            m.rotate(t);
        }
        var p0=m.deltaTransformPoint(Graphics.GRADIENT_WH_POINT);
        var tx=matrix.tx-p0.x;
        var ty=matrix.ty-p0.y;
        var p1=matrix.deltaTransformPoint(Graphics.GRADIENT_POINT);
        if (type==GradientType.LINEAR) {
            g=Graphics.helpContext.createLinearGradient(tx,ty,p1.x+tx,p1.y+ty);
        } else {
            g=Graphics.helpContext.createRadialGradient(matrix.tx,matrix.ty,0,matrix.tx,matrix.ty,p0.x);
        }
        var cn=colors.length;
        var r;
        for (var i=0;i<cn;i++) {
            r=ratios[i]/255.0;
            g.addColorStop(r,this.getRgbaColor(colors[i]|0,alphas[i]));
        }
        return g;
    }

    __proto.beginBitmapFill=function(bitmap,matrix,repeat,smooth)
    {
        (matrix===void 0) && (matrix=null);
        (repeat===void 0) && (repeat=true);
        (smooth===void 0) && (smooth=false);
        this._$endFill();
        this._context_.beginPath();
        var r;
        if (repeat) {
            r="repeat";
        } else {
            r="no-repeat";
        }
        var cp=Graphics.helpContext.createPattern(bitmap.getCanvas(),r);
        this._context_.fillBitmapStyle(cp,bitmap,r);
        this._context_.fillMatrix(matrix);
        this._$hasFill=true;
        bitmap._$pushOwer(this);
    }

    __proto.beginFill=function(color,alpha)
    {
        (alpha===void 0) && (alpha=1.0);
        this._$endFill();
        this._context_.beginPath();
        this._context_.fillStyle(this.getRgbaColor(color,alpha));
        this._$hasFill=true;
    }

    __proto.beginGradientFill=function(type,colors,alphas,ratios,matrix,spreadMethod,interpolationMethod,focalPointRatio)
    {
        (matrix===void 0) && (matrix=null);
        (spreadMethod===void 0) && (spreadMethod="pad");
        (interpolationMethod===void 0) && (interpolationMethod="rgb");
        (focalPointRatio===void 0) && (focalPointRatio=0);
        this._$endFill();
        this._context_.beginPath();
        this._context_.fillStyle(this.createGradientFillStyle(type,colors,alphas,ratios));
        this._context_.fillGradientMatrix(matrix);
        this._$hasFill=true;
    }

    __proto.beginShaderFill=function(shader,matrix)
    {
        (matrix===void 0) && (matrix=null);
        trace('-- NATIVE flash.display.Graphics.beginShaderFill');
    }

    __proto.clear=function()
    {
        this.ower._$doDirty(true);
        this._$width=this._$height=this._$x=this._$y=0;
        this._$hasFill=this._$hasLineFill=false;
        this._rectArea=null;
        this.currThickness=0;
        this.lastMoveX=NaN;
        this._canvas_ && this._canvas_.clearRect(0,0,this._canvas_.width,this._canvas_.height);
        this._$outline=null;
    }

    __proto.copyFrom=function(sourceGraphics)
    {
        sourceGraphics._canvas_.copyTo(this._canvas_);
    }

    __proto.cubicCurveTo=function(controlX1,controlY1,controlX2,controlY2,anchorX,anchorY)
    {
        this.ower._$doDirty(true);
        if (isNaN(this.lastMoveX)) {
            this.moveTo(0,0);
        }
        this._context_.bezierCurveTo(controlX1,controlY1,controlX2,controlY2,anchorX,anchorY);
        this._$hasFill && this._$pushOutLineCmd(["bezierCurveTo",[controlX1,controlY1,controlX2,controlY2,anchorX,anchorY]]);
        if (this.lastMoveX==anchorX && this.lastMoveY==anchorY) {
            if (this._$hasFill) {
                this._context_.fill();
            }
            this._$pNum=0;
        } else {
            this._$pNum+=2;
        }
        if (this._$hasLineFill) {
            this._context_.stroke();
        }
        this._expandSize_(anchorX,anchorY);
        this._expandSize_(controlX1,controlY1);
        this._expandSize_(controlX2,controlY2);
    }

    __proto.curveTo=function(controlX,controlY,anchorX,anchorY)
    {
        this.ower._$doDirty(true);
        if (isNaN(this.lastMoveX)) {
            this.moveTo(0,0);
        }
        this._context_.quadraticCurveTo(controlX,controlY,anchorX,anchorY);
        this._$hasFill && this._$pushOutLineCmd(["quadraticCurveTo",[controlX,controlY,anchorX,anchorY]]);
        if (this.lastMoveX==anchorX && this.lastMoveY==anchorY) {
            if (this._$hasFill) {
                this._context_.fill();
            }
            this._$pNum=0;
        } else {
            this._$pNum+=2;
        }
        if (this._$hasLineFill) {
            this._context_.stroke();
        }
        this._expandSize_(controlX,controlY);
        this._expandSize_(anchorX,anchorY);
    }

    __proto.drawCircle=function(x,y,radius)
    {
        this.ower._$doDirty(true);
        this._$endFill();
        this._context_.beginPath();
        this._context_.arc(x,y,radius,0,2*Math.PI,true);
        this._$hasFill && this._$pushOutLineCmd(["arc",[x,y,radius,0,2*Math.PI,true]]);
        if (this._$hasFill)
            this._context_.fill();
        if (this._$hasLineFill)
            this._context_.stroke();
        this._$pNum=0;
        this._expandSize_(x-radius,y-radius);
        this._expandSize_(x+radius,y+radius);
        this.moveTo(x+radius,y);
    }

    __proto.drawEllipse=function(x,y,width,height)
    {
        this.ower._$doDirty(true);
        this._$endFill();
        this._context_.save();
        var r=(width>height) ? width : height;
        var ratioX=width/r*0.5;
        var ratioY=height/r*0.5;
        this._context_.scale(ratioX,ratioY);
        this._context_.beginPath();
        this._context_.arc((x+width*0.5)/ratioX,(y+height*0.5)/ratioY,r,0,2*Math.PI,true);
        this._$hasFill && this._$pushOutLineCmd(["arc",[(x+width*0.5)/ratioX,(y+height*0.5)/ratioY,r,0,2*Math.PI,true]]);
        if (this._$hasFill)
            this._context_.fill();
        this._context_.restore();
        if (this._$hasLineFill)
            this._context_.stroke();
        this._$pNum=0;
        this._expandSize_(x,y);
        this._expandSize_(x+width,y+height);
        this.moveTo(x+width,y+height/2);
    }

    __proto.drawGraphicsData=function(graphicsData)
    {
        trace('-- NATIVE flash.display.Graphics.drawGraphicsData');
    }

    __proto.drawPath=function(commands,data,winding)
    {
        (winding===void 0) && (winding="evenOdd");
        trace('-- NATIVE flash.display.Graphics.drawPath');
    }

    __proto.drawRect=function(x,y,w,h)
    {
        this.ower._$doDirty(true);
        this._$endFill();
        this._context_.beginPath();
        this._context_.rect(x,y,w,h);
        this._$hasFill && this._$pushOutLineCmd(["rect",[x,y,w,h]]);
        if (this._$hasFill) {
            this._context_.fill();
        }
        if (this._$hasLineFill) {
            this._context_.stroke();
        }
        this._$pNum=0;
        this._expandSize_(x,y);
        this._expandSize_(x+w,y+h);
        this.moveTo(x,y);
    }

    __proto.drawRoundRect=function(x,y,width,height,ellipseWidth,ellipseHeight)
    {
        (ellipseHeight===void 0) && (ellipseHeight=NaN);
        if (isNaN(ellipseHeight))
            ellipseHeight=ellipseWidth;
        if (!ellipseWidth || !ellipseHeight) {
            this.drawRect(x,y,width,height);
            return;
        }
        var radiusX=(ellipseWidth/2)|0;
        var radiusY=ellipseHeight ? (ellipseHeight/2)|0 : radiusX;
        var hw=width/2|0;
        var hh=height/2|0;
        if (radiusX>hw) {
            radiusX=hw;
        }
        if (radiusY>hh) {
            radiusY=hh;
        }
        if (hw==hh && hw==radiusX && hh==radiusY) {
            this.drawCircle(x+radiusX,y+radiusY,radiusX);
            return;
        }
        this._$endFill();
        this.moveTo(x+width,y+height-ellipseHeight/2);
        this.cubicCurveTo(x+width,(y+height-Graphics.e2*ellipseHeight),(x+width-Graphics.e2*ellipseWidth),y+height,x+width-ellipseWidth/2,y+height);
        this.lineTo(x+ellipseWidth/2,y+height);
        this.cubicCurveTo((x+Graphics.e2*ellipseWidth),y+height,x,(y+height-Graphics.e2*ellipseHeight),x,y+height-ellipseHeight/2);
        this.lineTo(x,y+ellipseHeight/2);
        this.cubicCurveTo(x,(y+Graphics.e2*ellipseHeight),(x+Graphics.e2*ellipseWidth),y,x+ellipseWidth/2,y);
        this.lineTo(x+width-ellipseWidth/2,y);
        this.cubicCurveTo((x+width-Graphics.e2*ellipseWidth),y,x+width,(y+Graphics.e2*ellipseHeight),x+width,y+ellipseHeight/2);
        this.lineTo(x+width,y+height-ellipseHeight/2);
    }

    __proto.drawRoundRectComplex=function(x,y,width,height,topLeftRadius,topRightRadius,bottomLeftRadius,bottomRightRadius)
    {
        trace('-- NATIVE flash.display.Graphics.drawRoundRectComplex');
    }

    __proto.drawTriangles=function(vertices,indices,uvtData,culling)
    {
        (indices===void 0) && (indices=null);
        (uvtData===void 0) && (uvtData=null);
        (culling===void 0) && (culling="none");
        trace('-- NATIVE flash.display.Graphics.drawTriangles');
    }

    __proto._$endFill=function()
    {
        if (this._$hasFill && this._$pNum>=2) {
            this._context_.fill();
            if (this._$hasLineFill) {
                this._context_.closePath();
                this._context_.stroke();
            }
        }
        this._$pNum=0;
    }

    __proto.endFill=function()
    {
        this._$endFill();
        this._$hasFill=false;
    }

    __proto.lineBitmapStyle=function(bitmap,matrix,repeat,smooth)
    {
        (matrix===void 0) && (matrix=null);
        (repeat===void 0) && (repeat=true);
        (smooth===void 0) && (smooth=false);
        if (!this._$hasLineFill) {
            return;
        }
        if (this._$hasLineFill) {
            this._context_.stroke();
        }
        this._context_.beginPath();
        var r;
        if (repeat) {
            r="repeat";
        } else {
            r="no-repeat";
        }
        var cp=Graphics.helpContext.createPattern(bitmap.getCanvas(),r);
        this._context_.strokeBitmapStyle(cp,bitmap,r);
        bitmap._$pushOwer(this);
    }

    __proto.lineGradientStyle=function(type,colors,alphas,ratios,matrix,spreadMethod,interpolationMethod,focalPointRatio)
    {
        (matrix===void 0) && (matrix=null);
        (spreadMethod===void 0) && (spreadMethod="pad");
        (interpolationMethod===void 0) && (interpolationMethod="rgb");
        (focalPointRatio===void 0) && (focalPointRatio=0);
        if (!this._$hasLineFill) {
            return;
        }
        if (this._$hasLineFill) {
            this._context_.stroke();
        }
        this._context_.beginPath();
        this._context_.strokeStyle(this.createGradientLineStyle(type,colors,alphas,ratios,matrix));
    }

    __proto.lineShaderStyle=function(shader,matrix)
    {
        (matrix===void 0) && (matrix=null);
        trace('-- NATIVE flash.display.Graphics.lineShaderStyle');
    }

    __proto.lineStyle=function(thickness,color,alpha,pixelHinting,scaleMode,caps,joints,miterLimit)
    {
        (thickness===void 0) && (thickness=NaN);
        (color===void 0) && (color=0);
        (alpha===void 0) && (alpha=1.0);
        (pixelHinting===void 0) && (pixelHinting=false);
        (scaleMode===void 0) && (scaleMode="normal");
        (caps===void 0) && (caps=null);
        (joints===void 0) && (joints=null);
        (miterLimit===void 0) && (miterLimit=3);
        if (isNaN(thickness)) {
            if (this._$hasLineFill) {
                this._context_.stroke();
            }
            this._$hasLineFill=false;
            this.currThickness=0;
            this._context_.beginPath();
            return;
        }
        if (thickness>255)
            thickness=255;
        this.currThickness=thickness;
        this._context_.lineWidth=thickness;
        this._context_.strokeStyle(this.getRgbaColor(color,alpha));
        this._$hasLineFill=true;
    }

    __proto.lineTo=function(x,y)
    {
        this.ower._$doDirty(true);
        if (isNaN(this.lastMoveX)) {
            this.moveTo(0,0);
        }
        this._expandSize_(x,y);
        this._context_.lineTo(x,y);
        this._$hasFill && this._$pushOutLineCmd(["lineTo",[x,y]]);
        if (this.lastMoveX==x && this.lastMoveY==y) {
            if (this._$hasFill) {
                this._context_.fill();
            }
            this._$pNum=0;
        } else {
            this._$pNum++;
        }
        if (this._$hasLineFill) {
            this._context_.stroke();
        }
    }

    __proto.moveTo=function(x,y)
    {
        this._$endFill();
        this.lastMoveX=x;
        this.lastMoveY=y;
        this._context_.beginPath();
        this._context_.moveTo(x,y);
        this._$hasFill && this._$pushOutLineCmd(["moveTo",[x,y]]);
    }

    __proto._$pushOutLineCmd=function(cmd)
    {
        if (!this._$outline)
            this._$outline=[];
        this._$outline.push(cmd);
    }

    __proto._$getOutLines=function()
    {
        if (this._$outline)
            return this._$outline;
        var outlines=[];
        var cms=this["_$res"];
        if (!cms || !cms["_$hasFill"] || cms.length<4) {
            this._$outline=outlines;
            return null;
        }
        var len=cms.length;
        var oldCvs=this._canvas_;
        if (len>3) {
            this._canvas_=new VirtualCanvas();
            this._canvas_.size(oldCvs.width,oldCvs.height);
        }
        var i=0;
        var tmpArr;
        var isFill=false;
        for (i=0;i<len;i++) {
            tmpArr=cms[i];
            if (tmpArr["_$fillFlag"]==1) {
                isFill=true;
            }
            if (isFill || tmpArr[0]=="endShape") {
                switch (tmpArr[0]) {
                case "beginBitmapFill":
                case "beginGradientFill":
                    this.beginFill(0);
                    break;
                default:
                    this[tmpArr[0]].apply(this,tmpArr[1]);
                }
            }
            if (tmpArr["_$fillFlag"]==2) {
                isFill=false;
            }
        }
        cms=this._canvas_._cmds_;
        len=cms.length;
        if (len<2) {
            this._canvas_=oldCvs;
            this._$outline=outlines;
            return null;
        }
        for (i=0;i<len;i++) {
            tmpArr=cms[i];
            if (tmpArr[0]=="_moveTo_") {
                outlines.push(["moveTo",tmpArr[1]]);
            } else if (tmpArr[0]=="_lineTo_") {
                outlines.push(["lineTo",tmpArr[1]]);
            } else if (tmpArr[0]=="_quadraticCurveTo_") {
                outlines.push(["quadraticCurveTo",tmpArr[1]]);
            }
        }
        this._$outline=outlines;
        this._canvas_=oldCvs;
        return outlines;
    }

    __proto._$doDirty=function(doThis)
    {
        (doThis===void 0) && (doThis=false);
        this.ower._$doDirty(true);
    }

    __static(Graphics,[
        'GRADIENT_POINT',function(){return this.GRADIENT_POINT=new Point(1638.4,0);},
        'GRADIENT_WH_POINT',function(){return this.GRADIENT_WH_POINT=new Point(819.2,819.2);},
        'helpContext',function(){return this.helpContext=document.createElement('canvas').getContext("2d");},
        'e',function(){return this.e=(Math.SQRT2-1)*2/3;},
        'e2',function(){return this.e2=(1-Graphics.e*2)/2;}
    ]);

    Graphics.toString=function(){return "[class Graphics]";};
    Mira.un_proto(Graphics);
    return Graphics;
})();

var TagGraphics=(function(_super) {
    function TagGraphics(ower)
    {
        this.fillMatrix=null;
        this.repeatCnt=0;
        this.fillWidth=0;
        this.fillHeight=0;
        this.pathData=[];
        this.strokeData=[];
        this.fillData=[];
        TagGraphics.__super.call(this,ower);
        this.shapeData=[];
    }

    __class(TagGraphics,'mirage.swf.TagGraphics',_super);
    var __proto=TagGraphics.prototype;

    __proto.isReady=function()
    {
        return this._$width>0 || this._$height>0;
    }

    __proto.endShape=function()
    {
        var arr;
        var len=this.shapeData.length;
        for (var i=0;i<len;i++) {
            arr=this.shapeData[i];
            this._canvas_[arr[0]](arr[1]);
        }
        this.shapeData=[];
    }

    __proto.beginFills=function()
    {
    }

    __proto.endFills=function()
    {
    }

    __proto.beginLines=function()
    {
    }

    __proto.endLines=function(close)
    {
        (close===void 0) && (close=false);
        if (close) {
            this.pathData.push('Z');
        }
        this.finalizePath();
    }

    __proto.beginFill=function(color,alpha)
    {
        (alpha===void 0) && (alpha=1.0);
        this.finalizePath();
        this.fillData.push(["$fillStyle",[this.getRgbaColor(color,alpha)]]);
    }

    __proto.beginGradientFill=function(type,colors,alphas,ratios,matrix,spreadMethod,interpolationMethod,focalPointRatio)
    {
        (matrix===void 0) && (matrix=null);
        (spreadMethod===void 0) && (spreadMethod=SpreadMethod.PAD);
        (interpolationMethod===void 0) && (interpolationMethod=InterpolationMethod.RGB);
        (focalPointRatio===void 0) && (focalPointRatio=0);
        this.finalizePath();
        var REPEAT_CNT=5;
        this.repeatCnt=spreadMethod==SpreadMethod.PAD ? 0 : REPEAT_CNT;
        var grd=new TagCanvasGradient();
        if (type==GradientType.LINEAR) {
            var start=matrix.transformPoint(new Point( -819.2-1638.4*this.repeatCnt,0));
            var end=matrix.transformPoint(new Point(819.2+1638.4*this.repeatCnt,0));
            grd.createLinearGradient(start.x,start.y,end.x,end.y);
        } else {
            this.fillMatrix=matrix;
            grd.createRadialGradient(focalPointRatio*16384/20,0,0,0,0,(16384+32768*this.repeatCnt)/20);
        }
        var repeatTotal=this.repeatCnt*2+1;
        var oneHeight=1.0/repeatTotal;
        var pos=0;
        var revert=false;
        if (type!=GradientType.LINEAR && spreadMethod==SpreadMethod.REFLECT) {
            revert=true;
        }
        for (var i=0;i<repeatTotal;i++) {
            if (spreadMethod==SpreadMethod.REFLECT) {
                revert=!revert;
            }
            for (var j=0;j<colors.length;j++) {
                grd.addColorStop(pos+(oneHeight*(revert ? 255-ratios[j] : ratios[j])/255.0),colors[j]|0,alphas[j]);
            }
            pos+=oneHeight;
        }
        this.fillData.push(["$fillStyle",[grd.createCanvasGradient()]]);
    }

    __proto.beginBitmapFill=function(bitmap,matrix,repeat,smooth)
    {
        (matrix===void 0) && (matrix=null);
        (repeat===void 0) && (repeat=true);
        (smooth===void 0) && (smooth=false);
        this.finalizePath();
        if (bitmap!=null) {
            this.fillWidth=bitmap.width|0;
            this.fillHeight=bitmap.height|0;
            if (matrix!=null) {
                this.fillMatrix=matrix;
            }
            var r;
            if (repeat) {
                r="repeat";
            } else {
                r="no-repeat";
            }
            var pat=Graphics.helpContext.createPattern(bitmap.getCanvas(),r);
            this.fillData.push(["$fillStyle",[pat]]);
        }
    }

    __proto.endFill=function()
    {
        this.finalizePath();
    }

    __proto.lineStyle=function(thickness,color,alpha,pixelHinting,scaleMode,startCaps,joints,miterLimit)
    {
        (thickness===void 0) && (thickness=NaN);
        (color===void 0) && (color=0);
        (alpha===void 0) && (alpha=1.0);
        (pixelHinting===void 0) && (pixelHinting=false);
        (scaleMode===void 0) && (scaleMode=LineScaleMode.NORMAL);
        (startCaps===void 0) && (startCaps=CapsStyle.ROUND);
        (joints===void 0) && (joints=JointStyle.ROUND);
        (miterLimit===void 0) && (miterLimit=3);
        this.finalizePath();
        if (!isNaN(thickness)) {
            this.strokeData.push(["$strokeStyle",[this.getRgbaColor(color,alpha)]]);
        }
        this.strokeData.push(["$lineWidth",[thickness==0 ? 0.1 : thickness]]);
        switch (startCaps) {
        case CapsStyle.NONE:
            this.strokeData.push(["$lineCap",["butt"]]);
            break;
        case CapsStyle.SQUARE:
            this.strokeData.push(["$lineCap",["square"]]);
            break;
        default:
            this.strokeData.push(["$lineCap",["round"]]);
            break;
        }
        switch (joints) {
        case JointStyle.BEVEL:
            this.strokeData.push(["$lineJoin",["bevel"]]);
            break;
        case JointStyle.ROUND:
            this.strokeData.push(["$lineJoin",["round"]]);
            break;
        default:
            this.strokeData.push(["$lineJoin",["miter"]]);
            break;
        }
    }

    __proto.lineGradientStyle=function(type,colors,alphas,ratios,matrix,spreadMethod,interpolationMethod,focalPointRatio)
    {
        (matrix===void 0) && (matrix=null);
        (spreadMethod===void 0) && (spreadMethod=SpreadMethod.PAD);
        (interpolationMethod===void 0) && (interpolationMethod=InterpolationMethod.RGB);
        (focalPointRatio===void 0) && (focalPointRatio=0);
        this.lineFillData=[];
        var REPEAT_CNT=5;
        this.repeatCnt=spreadMethod==SpreadMethod.PAD ? 0 : REPEAT_CNT;
        var grd=new TagCanvasGradient();
        if (type==GradientType.LINEAR) {
            var start=matrix.transformPoint(new Point( -819.2-1638.4*this.repeatCnt,0));
            var end=matrix.transformPoint(new Point(819.2+1638.4*this.repeatCnt,0));
            grd.createLinearGradient(start.x,start.y,end.x,end.y);
        } else {
            grd.createRadialGradient(focalPointRatio*16384/20,0,0,0,0,(16384+32768*this.repeatCnt)/20);
        }
        var repeatTotal=this.repeatCnt*2+1;
        var oneHeight=1.0/repeatTotal;
        var pos=0;
        var revert=false;
        if (type!=GradientType.LINEAR && spreadMethod==SpreadMethod.REFLECT) {
            revert=true;
        }
        for (var i=0;i<repeatTotal;i++) {
            if (spreadMethod==SpreadMethod.REFLECT) {
                revert=!revert;
            }
            for (var j=0;j<colors.length;j++) {
                grd.addColorStop(pos+(oneHeight*(revert ? 255-ratios[j] : ratios[j])/255.0),colors[j]|0,alphas[j]);
            }
            pos+=oneHeight;
        }
        this.lineFillData.push(["$strokeStyle",[grd.createCanvasGradient()]]);
    }

    __proto.moveTo=function(x,y)
    {
        this.pathData.push(TagGraphics.DRAW_COMMAND_M+" "+x+" "+y);
    }

    __proto.lineTo=function(x,y)
    {
        this.pathData.push(TagGraphics.DRAW_COMMAND_L+" "+x+" "+y);
    }

    __proto.curveTo=function(controlX,controlY,anchorX,anchorY)
    {
        this.pathData.push(TagGraphics.DRAW_COMMAND_Q+" "+controlX+" "+controlY+" "+anchorX+" "+anchorY);
    }

    __proto.finalizePath=function()
    {
        if (this.pathData && this.pathData.length>0) {
            var drawStroke=this._$drawPath(this.pathData,true);
            var drawFill=this._$drawPath(this.pathData,false);
            this.pathData=[];
            if (this.lineFillData && this.lineFillData.length>0) {
                this.lineFillData.push(["$save",null]);
                this.lineFillData=this.concatData(this.lineFillData,this.strokeData);
                this.lineFillData=this.concatData(this.lineFillData,drawStroke);
                this.lineFillData.push(["$restore",null]);
                this.strokeData=[];
            } else {
                this.pathData=this.concatData(this.pathData,this.strokeData);
            }
            if (this.fillMatrix) {
                this.pathData=this.concatData(this.pathData,drawFill);
                this.pathData.push(["$save",null]);
                this.pathData.push(["$clip",null]);
                this.pathData.push(["$transform",[this.fillMatrix.a,this.fillMatrix.b,this.fillMatrix.c,this.fillMatrix.d,this.fillMatrix.tx,this.fillMatrix.ty]]);
                if (this.fillWidth>0) {
                    var s_w=(this.fillWidth+1)/this.fillWidth;
                    var s_h=(this.fillHeight+1)/this.fillHeight;
                    this.pathData.push(["$transform",[s_w,0,0,s_h, -0.5, -0.5]]);
                }
                this.pathData=this.concatData(this.pathData,this.fillData);
                this.pathData.push(["$fillRect",[ -16384-32768*this.repeatCnt, -16384-32768*this.repeatCnt,2*16384+32768*2*this.repeatCnt,2*16384+32768*2*this.repeatCnt]]);
                this.pathData.push(["$restore",null]);
                this.shapeData=this.concatData(this.shapeData,this.pathData);
            } else {
                if (this.fillData && this.fillData.length>0) {
                    this.pathData=this.concatData(this.pathData,drawFill);
                    this.pathData.push(["$fill",null]);
                }
                this.fillData=this.concatData(this.fillData,this.pathData);
                this.shapeData=this.concatData(this.shapeData,this.fillData);
            }
            if (this.strokeData && this.strokeData.length>0) {
                this.shapeData=this.concatData(this.shapeData,drawStroke);
            } else if (this.lineFillData && this.lineFillData.length>0) {
                this.shapeData=this.concatData(this.shapeData,this.lineFillData);
            }
        }
        this.repeatCnt=0;
        this.pathData=[];
        this.fillData=[];
        this.strokeData=[];
        this.fillMatrix=null;
        this.lineFillData=[];
        this.fillWidth=0;
        this.fillHeight=0;
    }

    __proto.concatData=function(d1,d2)
    {
        if (!d1)
            d1=[];
        if (d2 && d2.length>0) {
            return d1.concat(d2);
        }
        return d1;
    }

    __proto._$drawPath=function(p,doStroke)
    {
        var pathCmd=[];
        var parts;
        var len=p.length;
        if (doStroke) {
            pathCmd.push(["$save",null]);
        }
        pathCmd.push(["$beginPath",null]);
        for (var i=0;i<len;i++) {
            parts=p[i].split(" ");
            switch (parts[0]) {
            case 'L':
                pathCmd.push(["$lineTo",[parts[1],parts[2]]]);
                break;
            case 'M':
                pathCmd.push(["$moveTo",[parts[1],parts[2]]]);
                break;
            case 'Q':
                pathCmd.push(["$quadraticCurveTo",[parts[1],parts[2],parts[3],parts[4]]]);
                break;
            case 'Z':
                pathCmd.push(["$closePath",null]);
                break;
            }
        }
        if (doStroke) {
            pathCmd.push(["$stroke",null]);
            pathCmd.push(["$restore",null]);
        }
        return pathCmd;
    }

    TagGraphics.DRAW_COMMAND_M="M";
    TagGraphics.DRAW_COMMAND_L="L";
    TagGraphics.DRAW_COMMAND_Q="Q";

    TagGraphics.toString=function(){return "[class TagGraphics]";};
    Mira.un_proto(TagGraphics);
    return TagGraphics;
})(Graphics);

var TagMorphGraphics=(function(_super) {
    function TagMorphGraphics(ower)
    {
        this.fillMatrix=null;
        this.repeatCnt=0;
        this.fillWidth=0;
        this.fillHeight=0;
        this.pathData=[];
        this.strokeData=[];
        this.fillData=[];
        TagMorphGraphics.__super.call(this,ower);
        this.shapeData=[];
    }

    __class(TagMorphGraphics,'mirage.swf.TagMorphGraphics',_super);
    var __proto=TagMorphGraphics.prototype;

    __proto.isReady=function()
    {
        return this._$width>0 || this._$height>0;
    }

    __proto.beginShape=function()
    {
        this.shapeData=[];
        this.repeatCnt=0;
        this.pathData=[];
        this.fillData=[];
        this.strokeData=[];
        this.fillMatrix=null;
        this.lineFillData=[];
        this.fillWidth=0;
        this.fillHeight=0;
    }

    __proto.endShape=function()
    {
        var arr;
        var len=this.shapeData.length;
        for (var i=0;i<len;i++) {
            arr=this.shapeData[i];
            this._canvas_[arr[0]](arr[1]);
        }
    }

    __proto.beginFills=function()
    {
    }

    __proto.endFills=function()
    {
    }

    __proto.beginLines=function()
    {
    }

    __proto.endLines=function()
    {
        this.finalizePath();
    }

    __proto.beginFill=function(color,alpha)
    {
        (alpha===void 0) && (alpha=1.0);
        this.finalizePath();
        this.fillData.push(["$fillStyle",[this.getRgbaColor(color,alpha)]]);
    }

    __proto.beginGradientFill=function(type,colors,alphas,ratios,matrix,spreadMethod,interpolationMethod,focalPointRatio)
    {
        (matrix===void 0) && (matrix=null);
        (spreadMethod===void 0) && (spreadMethod=SpreadMethod.PAD);
        (interpolationMethod===void 0) && (interpolationMethod=InterpolationMethod.RGB);
        (focalPointRatio===void 0) && (focalPointRatio=0);
        this.finalizePath();
        var REPEAT_CNT=5;
        this.repeatCnt=spreadMethod==SpreadMethod.PAD ? 0 : REPEAT_CNT;
        var grd=new TagCanvasGradient();
        if (type==GradientType.LINEAR) {
            var start=matrix.transformPoint(new Point( -819.2-1638.4*this.repeatCnt,0));
            var end=matrix.transformPoint(new Point(819.2+1638.4*this.repeatCnt,0));
            grd.createLinearGradient(start.x,start.y,end.x,end.y);
        } else {
            this.fillMatrix=matrix;
            grd.createRadialGradient(focalPointRatio*16384/20,0,0,0,0,(16384+32768*this.repeatCnt)/20);
        }
        var repeatTotal=this.repeatCnt*2+1;
        var oneHeight=1.0/repeatTotal;
        var pos=0;
        var revert=false;
        if (type!=GradientType.LINEAR && spreadMethod==SpreadMethod.REFLECT) {
            revert=true;
        }
        var s;
        for (var i=0;i<repeatTotal;i++) {
            if (spreadMethod==SpreadMethod.REFLECT) {
                revert=!revert;
            }
            for (var j=0;j<colors.length;j++) {
                s=pos+(oneHeight*(revert ? 255-ratios[j] : ratios[j])/255.0);
                if (s<0)
                    s=0;
                if (s>1)
                    s=1;
                grd.addColorStop(s,colors[j]|0,alphas[j]);
            }
            pos+=oneHeight;
        }
        this.fillData.push(["$fillStyle",[grd.createCanvasGradient()]]);
    }

    __proto.beginBitmapFill=function(bitmap,matrix,repeat,smooth)
    {
        (matrix===void 0) && (matrix=null);
        (repeat===void 0) && (repeat=true);
        (smooth===void 0) && (smooth=false);
        this.finalizePath();
        if (bitmap!=null) {
            this.fillWidth=bitmap.width|0;
            this.fillHeight=bitmap.height|0;
            if (matrix!=null) {
                this.fillMatrix=matrix;
            }
            var r;
            if (repeat) {
                r="repeat";
            } else {
                r="no-repeat";
            }
            var pat=Graphics.helpContext.createPattern(bitmap.getCanvas(),r);
            this.fillData.push(["$fillStyle",[pat]]);
        }
    }

    __proto.endFill=function()
    {
        this.finalizePath();
    }

    __proto.lineStyle=function(thickness,color,alpha,pixelHinting,scaleMode,startCaps,joints,miterLimit)
    {
        (thickness===void 0) && (thickness=NaN);
        (color===void 0) && (color=0);
        (alpha===void 0) && (alpha=1.0);
        (pixelHinting===void 0) && (pixelHinting=false);
        (scaleMode===void 0) && (scaleMode=LineScaleMode.NORMAL);
        (startCaps===void 0) && (startCaps=CapsStyle.ROUND);
        (joints===void 0) && (joints=JointStyle.ROUND);
        (miterLimit===void 0) && (miterLimit=3);
        this.finalizePath();
        this.strokeData.push(["$strokeStyle",[this.getRgbaColor(color,alpha)]]);
        this.strokeData.push(["$lineWidth",[thickness==0 ? 0.1 : thickness]]);
        switch (startCaps) {
        case CapsStyle.NONE:
            this.strokeData.push(["$lineCap",["butt"]]);
            break;
        case CapsStyle.SQUARE:
            this.strokeData.push(["$lineCap",["square"]]);
            break;
        default:
            this.strokeData.push(["$lineCap",["round"]]);
            break;
        }
        switch (joints) {
        case JointStyle.BEVEL:
            this.strokeData.push(["$lineJoin",["bevel"]]);
            break;
        case JointStyle.ROUND:
            this.strokeData.push(["$lineJoin",["round"]]);
            break;
        default:
            this.strokeData.push(["$lineJoin",["miter"]]);
            break;
        }
    }

    __proto.lineGradientStyle=function(type,colors,alphas,ratios,matrix,spreadMethod,interpolationMethod,focalPointRatio)
    {
        (matrix===void 0) && (matrix=null);
        (spreadMethod===void 0) && (spreadMethod=SpreadMethod.PAD);
        (interpolationMethod===void 0) && (interpolationMethod=InterpolationMethod.RGB);
        (focalPointRatio===void 0) && (focalPointRatio=0);
        this.lineFillData=[];
        var REPEAT_CNT=5;
        this.repeatCnt=spreadMethod==SpreadMethod.PAD ? 0 : REPEAT_CNT;
        var grd=new TagCanvasGradient();
        if (type==GradientType.LINEAR) {
            var start=matrix.transformPoint(new Point( -819.2-1638.4*this.repeatCnt,0));
            var end=matrix.transformPoint(new Point(819.2+1638.4*this.repeatCnt,0));
            grd.createLinearGradient(start.x,start.y,end.x,end.y);
        } else {
            grd.createRadialGradient(focalPointRatio*16384/20,0,0,0,0,(16384+32768*this.repeatCnt)/20);
        }
        var repeatTotal=this.repeatCnt*2+1;
        var oneHeight=1.0/repeatTotal;
        var pos=0;
        var revert=false;
        if (type!=GradientType.LINEAR && spreadMethod==SpreadMethod.REFLECT) {
            revert=true;
        }
        var s;
        for (var i=0;i<repeatTotal;i++) {
            if (spreadMethod==SpreadMethod.REFLECT) {
                revert=!revert;
            }
            for (var j=0;j<colors.length;j++) {
                s=pos+(oneHeight*(revert ? 255-ratios[j] : ratios[j])/255.0);
                if (s<0)
                    s=0;
                if (s>1)
                    s=1;
                grd.addColorStop(s,colors[j]|0,alphas[j]);
            }
            pos+=oneHeight;
        }
        this.lineFillData.push(["$strokeStyle",[grd.createCanvasGradient()]]);
    }

    __proto.moveTo=function(x,y)
    {
        this.pathData.push(TagMorphGraphics.DRAW_COMMAND_M+" "+x+" "+y);
    }

    __proto.lineTo=function(x,y)
    {
        this.pathData.push(TagMorphGraphics.DRAW_COMMAND_L+" "+x+" "+y);
    }

    __proto.curveTo=function(controlX,controlY,anchorX,anchorY)
    {
        this.pathData.push(TagMorphGraphics.DRAW_COMMAND_Q+" "+controlX+" "+controlY+" "+anchorX+" "+anchorY);
    }

    __proto.finalizePath=function()
    {
        if (this.pathData && this.pathData.length>0) {
            var drawStroke=this._$drawPath(this.pathData,true);
            var drawFill=this._$drawPath(this.pathData,false);
            this.pathData=[];
            if (this.lineFillData.length>0) {
                this.lineFillData.push(["$save",null]);
                this.lineFillData=this.concatData(this.lineFillData,this.strokeData);
                this.lineFillData=this.concatData(this.lineFillData,drawStroke);
                this.lineFillData.push(["$restore",null]);
                this.strokeData=[];
            } else {
                this.pathData=this.concatData(this.pathData,this.strokeData);
            }
            if (this.fillMatrix) {
                this.pathData=this.concatData(this.pathData,drawFill);
                this.pathData.push(["$save",null]);
                this.pathData.push(["$clip",null]);
                this.pathData.push(["$transform",[this.fillMatrix.a,this.fillMatrix.b,this.fillMatrix.c,this.fillMatrix.d,this.fillMatrix.tx,this.fillMatrix.ty]]);
                if (this.fillWidth>0) {
                    var s_w=(this.fillWidth+1)/this.fillWidth;
                    var s_h=(this.fillHeight+1)/this.fillHeight;
                    this.pathData.push(["$transform",[s_w,0,0,s_h, -0.5, -0.5]]);
                }
                this.pathData=this.concatData(this.pathData,this.fillData);
                this.pathData.push(["$fillRect",[ -16384-32768*this.repeatCnt, -16384-32768*this.repeatCnt,2*16384+32768*2*this.repeatCnt,2*16384+32768*2*this.repeatCnt]]);
                this.pathData.push(["$restore",null]);
                this.shapeData=this.concatData(this.shapeData,this.pathData);
            } else {
                if (this.fillData && this.fillData.length>0) {
                    this.pathData=this.concatData(this.pathData,drawFill);
                    this.pathData.push(["$fill",null]);
                }
                this.fillData=this.concatData(this.fillData,this.pathData);
                this.shapeData=this.concatData(this.shapeData,this.fillData);
            }
            if (this.strokeData && this.strokeData.length>0) {
                this.shapeData=this.concatData(this.shapeData,drawStroke);
            } else if (this.lineFillData && this.lineFillData.length>0) {
                this.shapeData=this.concatData(this.shapeData,this.lineFillData);
            }
        }
        this.repeatCnt=0;
        this.pathData=[];
        this.fillData=[];
        this.strokeData=[];
        this.fillMatrix=null;
        this.lineFillData=[];
        this.fillWidth=0;
        this.fillHeight=0;
    }

    __proto.concatData=function(d1,d2)
    {
        if (!d1)
            d1=[];
        if (d2 && d2.length>0) {
            return d1.concat(d2);
        }
        return d1;
    }

    __proto._$drawPath=function(p,doStroke)
    {
        var pathCmd=[];
        var parts;
        var len=p.length;
        if (doStroke) {
            pathCmd.push(["$save",null]);
        }
        pathCmd.push(["$beginPath",null]);
        for (var i=0;i<len;i++) {
            parts=p[i].split(" ");
            switch (parts[0]) {
            case 'L':
                pathCmd.push(["$lineTo",[parts[1],parts[2]]]);
                break;
            case 'M':
                pathCmd.push(["$moveTo",[parts[1],parts[2]]]);
                break;
            case 'Q':
                pathCmd.push(["$quadraticCurveTo",[parts[1],parts[2],parts[3],parts[4]]]);
                break;
            }
        }
        if (doStroke) {
            pathCmd.push(["$stroke",null]);
            pathCmd.push(["$restore",null]);
        }
        return pathCmd;
    }

    TagMorphGraphics.DRAW_COMMAND_M="M";
    TagMorphGraphics.DRAW_COMMAND_L="L";
    TagMorphGraphics.DRAW_COMMAND_Q="Q";

    TagMorphGraphics.toString=function(){return "[class TagMorphGraphics]";};
    Mira.un_proto(TagMorphGraphics);
    return TagMorphGraphics;
})(Graphics);

var ArgumentError=(function(_super) {
    function ArgumentError(message)
    {
        (message===void 0) && (message='');
        ArgumentError.__super.call(this,message);
        this.name='ArgumentError';
    }

    __class(ArgumentError,'ArgumentError',_super);

    ArgumentError.toString=function(){return "[class ArgumentError]";};
    return ArgumentError;
})(Error);

var MsDict=(function() {
    function MsDict(weakKeys)
    {
        this._keys=[];
        this._values=[];
        (weakKeys===void 0) && (weakKeys=false);
    }

    __class(MsDict,'MsDict');
    var __proto=MsDict.prototype;

    __proto.set=function(key,value)
    {
        key=this.noramlKey(key);
        var id=this._keys.indexOf(key);
        if (id>=0) {
            this._values[id]=value;
            return value;
        }
        this._keys.push(key);
        this._values.push(value);
        return value;
    }

    __proto.get=function(key)
    {
        var id=this._keys.indexOf(this.noramlKey(key));
        return id<0 ? undefined : this._values[id];
    }

    __proto.contains=function(key)
    {
        return this._keys.indexOf(this.noramlKey(key))>=0;
    }

    __proto.remove=function(key)
    {
        var id=this._keys.indexOf(this.noramlKey(key));
        if (id>=0) {
            this._keys.splice(id,1);
            this._values.splice(id,1);
            return true;
        }
        return false;
    }

    __proto.clear=function()
    {
        this._keys.length=0;
        this._values.length=0;
    }

    __proto.noramlKey=function(key)
    {
        if (typeof key=='number') {
            if (Math.floor(key)==key && key>=0 && key<0x10000000)
                return key;
            return String(key);
        }
        if (typeof key=='string') {
            var n=Number(key);
            if (Math.floor(n)==n && n>=0 && n<0x10000000)
                return n;
            return key;
        }
        if (key===null || key===undefined || key===false || key===true)
            return String(key);
        return key;
    }

    __getset(0,__proto,'keys',
        function()
        {
            return this._keys;
        }
    );

    __getset(0,__proto,'values',
        function()
        {
            return this._values;
        }
    );

    MsDict.toString=function(){return "[class MsDict]";};
    Mira.un_proto(MsDict);
    return MsDict;
})();

var Namespace=(function() {
    function Namespace(prefixValue,uriValue)
    {
        (uriValue===void 0) && (uriValue=null);
        if (arguments.length==2) {
            this.prefix=__string(prefixValue);
            this.uri=__string(uriValue);
        }
    }

    __class(Namespace,'Namespace');
    var __proto=Namespace.prototype;

    __proto.toString=function()
    {
        return this.uri;
    }

    __proto.valueOf=function()
    {
        return this.uri;
    }

    Namespace.toString=function(){return "[class Namespace]";};
    Mira.un_proto(Namespace);
    return Namespace;
})();

var RangeError=(function(_super) {
    function RangeError(message)
    {
        (message===void 0) && (message='');
        RangeError.__super.call(this,message);
        this.name='RangeError';
    }

    __class(RangeError,'RangeError',_super);

    RangeError.toString=function(){return "[class RangeError]";};
    return RangeError;
})(Error);

var ReferenceError=(function(_super) {
    function ReferenceError(message)
    {
        (message===void 0) && (message='');
        ReferenceError.__super.call(this,message);
        this.name='ReferenceError';
    }

    __class(ReferenceError,'ReferenceError',_super);

    ReferenceError.toString=function(){return "[class ReferenceError]";};
    return ReferenceError;
})(Error);

var SecurityError=(function(_super) {
    function SecurityError(message)
    {
        (message===void 0) && (message='');
        SecurityError.__super.call(this,message);
        this.name='SecurityError';
    }

    __class(SecurityError,'SecurityError',_super);

    SecurityError.toString=function(){return "[class SecurityError]";};
    return SecurityError;
})(Error);

var XML=(function() {
    function XML(value)
    {
        this._nestCount=0;
        this._attributes=[];
        this._childNodes=[];
        (value===void 0) && (value=null);
        if (value instanceof XML)
            return value;
        else if (value instanceof XMLList) {
            if (value.length()==1)
                return value[0];
            else
                return value;
        }
        if (value) {
            XML.create(value,this);
        }
    }

    __class(XML,'XML');
    var __proto=XML.prototype;

    __proto.toString=function()
    {
        var str="";
        if (this._childNodes.length) {
            str=this.toXMLString();
        } else
            str=this._nodeValue;
        return str;
    }

    __proto.hasOwnProperty=function(pName)
    {
        var len=0,i=0;
        if (pName.indexOf("@")==0) {
            var tmpPName=pName.substring(1);
            len=this._attributes.length;
            for (i=0;i<len;i++) {
                if (this._attributes[i].key==tmpPName)
                    return true;
            }
        } else {
            len=this._childNodes.length;
            for (i=0;i<len;i++) {
                if (this._childNodes[i]._nodeName==pName)
                    return true;
            }
        }
        return false;
    }

    __proto.propertyIsEnumerable=function(p)
    {
        trace('-- NATIVE XML.propertyIsEnumerable');
    }

    __proto.addNamespace=function(ns)
    {
        trace('-- NATIVE XML.addNamespace');
    }

    __proto.appendChild=function(value)
    {
        if (typeof value=='string') {
            value=XML.create(String(value));
        }
        if (value instanceof XML) {
            var name=__string(value._nodeName);
            var list=this[name];
            if (!list) {
                this[name]=list=new XMLList();
            }
            ((__isFunction(list))!=true) && (list.__addChild__(value));
            this._childNodes.push(value);
        } else if (value instanceof XMLList) {
            var len=value.length()|0;
            for (var i=0;i<len;i++) {
                this.appendChild(value[i]);
            }
        }
        value._parentNode=this;
        return value;
    }

    __proto.attribute=function(name)
    {
        var attr=this._attributes;
        var arr=[];
        for (var i=0;i<attr.length;i++) {
            var value=__string(attr[i]['key']);
            if (name=="*" || value==name) {
                arr.push({"key": attr[i]['key'],"val": attr[i]['val']});
            }
        }
        return XMLList.createFromAttribute(arr).valueOf();
    }

    __proto.attributes=function()
    {
        return this.attribute("*");
    }

    __proto.child=function(nName)
    {
        if (typeof nName=='number') {
            return XMLList.create([this._childNodes[nName]]);
        }
        var ar=[],len=this._childNodes ? this._childNodes.length : 0;
        for (var i=0;i<len;i++) {
            var n=this._childNodes[i];
            if (n.localName()==nName) {
                ar.push(n);
            }
        }
        return XMLList.create(ar);
    }

    __proto.childIndex=function()
    {
        var parent=this._parentNode;
        if (parent) {
            var nodes=parent._childNodes;
            for (var i=0,n=nodes.length;i<n;i++) {
                if (nodes[i]==this) {
                    return i;
                }
            }
        }
        return  -1;
    }

    __proto.children=function()
    {
        var l=XMLList.create(this._childNodes);
        if (!l.length() && (typeof this._nodeValue=='string') && this._nodeValue!="")
            l.push(this._nodeValue);
        return l;
    }

    __proto.comments=function()
    {
        return null;
    }

    __proto.contains=function(value)
    {
        trace('-- NATIVE XML.contains');
    }

    __proto.copy=function()
    {
        var xml=new XML(this.toXMLString());
        return xml;
    }

    __proto.descendants=function(name)
    {
        (name===void 0) && (name="*");
        var arr=[];
        this._$getDescendants(arr,this,String(name));
        return XMLList.create(arr);
    }

    __proto._$getDescendants=function(arr,xml,name)
    {
        var len=xml._childNodes ? xml._childNodes.length : 0;
        for (var i=0;i<len;i++) {
            var node=xml._childNodes[i];
            if (name=="*" || node._nodeName==name) {
                arr.push(node);
            }
            this._$getDescendants(arr,node,name);
        }
    }

    __proto.elements=function(name)
    {
        (name===void 0) && (name="*");
        if (name=='*')
            return XMLList.create(this._childNodes);
        return this.child(name);
    }

    __proto.filter=function(callback)
    {
        var ar=[],len=this._childNodes ? this._childNodes.length : 0;
        for (var i=0;i<len;i++) {
            var n=this._childNodes[i];
            if (callback(n)) {
                ar.push(n);
            }
        }
        return XMLList.create(ar);
    }

    __proto.hasComplexContent=function()
    {
        return this._childNodes.length>0;
    }

    __proto.hasSimpleContent=function()
    {
        if (this._childNodes.length>1) {
            return false;
        } else if (this._childNodes.length==1) {
            if (!this._childNodes[0].localName())
                return true;
            return false;
        }
        return true;
    }

    __proto.inScopeNamespaces=function()
    {
        trace('-- NATIVE XML.inScopeNamespaces');
    }

    __proto.insertChildAfter=function(child1,child2)
    {
        if (!child1) {
            this.appendChild(child2);
            return;
        }
        if (child1 instanceof XMLList)
            child1=child1[0];
        var list=child1.parent()._childNodes;
        if (list) {
            var idx=list.indexOf(child1);
            list.splice(idx+1,0,child2);
            var xl=new XMLList();
            xl.push(child2);
            child2._parentNode=this;
            child1.parent()[child2._nodeName]=xl;
            return this;
        }
        return undefined;
    }

    __proto.insertChildBefore=function(child1,child2)
    {
        if (!child1) {
            this.prependChild(child2);
            return;
        }
        if (child1 instanceof XMLList)
            child1=child1[0];
        var list=child1.parent()._childNodes;
        if (list) {
            var idx=list.indexOf(child1);
            list.splice(idx,0,child2);
            var xl=new XMLList();
            xl.push(child2);
            child2._parentNode=this;
            child1.parent()[child2._nodeName]=xl;
            return this;
        }
        return undefined;
    }

    __proto.length=function()
    {
        return 1;
    }

    __proto.localName=function()
    {
        return this._nodeName;
    }

    __proto.name=function()
    {
        return this._nodeName;
    }

    __proto.namespace=function(prefix)
    {
        (prefix===void 0) && (prefix=null);
        trace('-- NATIVE XML.namespace');
    }

    __proto.namespaceDeclarations=function()
    {
        trace('-- NATIVE XML.namespaceDeclarations');
    }

    __proto.nodeKind=function()
    {
        return this._nodeType;
    }

    __proto.normalize=function()
    {
        trace('-- NATIVE XML.normalize');
    }

    __proto.parent=function()
    {
        return this._parentNode;
    }

    __proto.processingInstructions=function(name)
    {
        (name===void 0) && (name="*");
        trace('-- NATIVE XML.processingInstructions');
    }

    __proto.prependChild=function(value)
    {
        var xml=__as(this.appendChild(value),XML);
        var nodes=this._childNodes;
        nodes.pop();
        nodes.splice(0,0,xml);
        return xml;
    }

    __proto.removeNamespace=function(ns)
    {
        trace('-- NATIVE XML.removeNamespace');
    }

    __proto.replace=function(propertyName,value)
    {
        trace('-- NATIVE XML.replace');
    }

    __proto.setChildren=function(value)
    {
        trace('-- NATIVE XML.setChildren');
    }

    __proto.setLocalName=function(name)
    {
        this._nodeName=name;
    }

    __proto.setName=function(name)
    {
        this._nodeName=name;
    }

    __proto.setNamespace=function(ns)
    {
        trace('-- NATIVE XML.setNamespace');
    }

    __proto.text=function()
    {
        trace('-- NATIVE XML.text');
    }

    __proto.toXMLString=function()
    {
        var str="";
        var name=this._nodeName;
        if (name) {
            str+="<"+name;
            for (var i=0;i<this._attributes.length;i++) {
                str+=" "+this._attributes[i]['key']+'="'+this._attributes[i]['val']+'"';
            }
        }
        if (this.hasSimpleContent() && !this._nodeValue)
            str+="/>";
        else {
            str+=name ? ">" : "";
            str+=(this._childNodes.length ? "\n" : this._nodeValue);
            this._nestCount=this._childNodes.length ? this._nestCount+1 : this._nestCount;
            for (i=0;i<this._childNodes.length;i++) {
                this._childNodes[i]._nestCount=this._nestCount;
                for (var j=0;j<this._nestCount;j++) {
                    str+="  ";
                }
                str+=this._childNodes[i].toXMLString();
                for (j=0;j<this._nestCount-1;j++) {
                    str+="  ";
                }
            }
            if (name)
                str+="</"+name+">";
        }
        return str;
    }

    __proto.valueOf=function()
    {
        if (!this._childNodes.length) {
            var n=Number(this._nodeValue);
            if (isNaN(n))
                return this._nodeValue;
            return n;
        }
        return this;
    }

    __getset(1,XML,'ignoreComments',
        function()
        {
            return true;
        },
        function(newIgnore)
        {
            trace('-- NATIVE XML.ignoreComments');
        }
    );

    __getset(1,XML,'ignoreProcessingInstructions',
        function()
        {
            return true;
        },
        function(newIgnore)
        {
            trace('-- NATIVE XML.ignoreProcessingInstructions');
        }
    );

    __getset(1,XML,'ignoreWhitespace',
        function()
        {
            return true;
        },
        function(newIgnore)
        {
            trace('-- NATIVE XML.ignoreWhitespace');
        }
    );

    __getset(1,XML,'prettyPrinting',
        function()
        {
            trace('-- NATIVE XML.prettyPrinting');
        },
        function(newPretty)
        {
            trace('-- NATIVE XML.prettyPrinting');
        }
    );

    __getset(1,XML,'prettyIndent',
        function()
        {
            trace('-- NATIVE XML.prettyIndent');
        },
        function(newIndent)
        {
            trace('-- NATIVE XML.prettyIndent');
        }
    );

    XML.create=function(value,node)
    {
        (node===void 0) && (node=null);
        node=node ? node : new XML();
        var xmld=new DOMParser().parseFromString(__string(value),'text/xml');
        var i=0;
        var t_xmld=null;
        do {
            t_xmld=xmld.childNodes[i++];
            if (t_xmld.nodeName!='#comment') {
                xmld=t_xmld;
                break;
            }
        } while (i<xmld.childNodes.length);
        XML.cloneXmlFromData(node,xmld);
        return node;
    }

    XML.cloneXmlFromData=function(xml,data)
    {
        xml._nodeName=__string(data.nodeName=="#text" ? null : data.nodeName);
        xml._nodeValue=__string(data.nodeValue==null ? data.textContent : data.nodeValue);
        var attribs=data.attributes;
        var len=attribs ? attribs.length : 0;
        var attributes=xml._attributes;
        for (var j=0;j<len;j++) {
            var attr=attribs[j];
            attributes.push({key: attr.nodeName,val: attr.nodeValue});
        }
        var nodes=data.childNodes;
        var child;
        for (var i=0;i<nodes.length;i++) {
            var node=nodes[i];
            var nodeName=node.nodeName;
            if (nodeName=="#text") {
                if (node.parentNode && node.parentNode.textContent!=node.textContent) {
                    var tValue=__string(node.nodeValue.replace(/(^\s*)|(\s*$)/g,''));
                    if (tValue.length>0) {
                        node.nodeValue=tValue;
                        child=new XML();
                        XML.cloneXmlFromData(child,node);
                        xml.appendChild(child);
                    }
                }
            } else if (nodeName!="#comment") {
                if (nodeName=="#cdata-section" || nodeName=="") {
                    xml._nodeValue=__string(node.nodeValue==null ? node.textContent : node.nodeValue);
                    continue;
                }
                child=new XML();
                XML.cloneXmlFromData(child,node);
                xml.appendChild(child);
            }
        }
    }

    XML.settings=function()
    {
        trace('-- NATIVE XML.settings');
    }

    XML.setSettings=function(o)
    {
        (o===void 0) && (o=null);
        trace('-- NATIVE XML.setSettings');
    }

    XML.defaultSettings=function()
    {
        trace('-- NATIVE XML.defaultSettings');
    }

    XML.toString=function(){return "[class XML]";};
    Mira.un_proto(XML);
    return XML;
})();

var XMLList=(function() {
    function XMLList(value)
    {
        this._$len=0;
        this._value="";
        this._parentNode=null;
        __uns(this,['_$len','_value','_parentNode']);
        if (value) {
            value="<data>"+value+"</data>";
            var list=XMLList.create(XML.create(value).childNodes);
            for (var i=0;i<list.length();i++) {
                this._$push(list[i]);
            }
        }
    }

    __class(XMLList,'XMLList');
    var __proto=XMLList.prototype;

    __proto.toString=function()
    {
        var str="";
        if (this._$len==1) {
            str=__string(this[0].toString());
        } else {
            for (var i=0;i<this._$len;i++) {
                str+=this[i].toXMLString();
            }
        }
        return str;
    }

    __proto.valueOf=function()
    {
        if (this._$len==1)
            return this[0].valueOf();
        return this;
    }

    __proto.hasOwnProperty=function(p)
    {
        trace('-- NATIVE XMLList.hasOwnProperty');
    }

    __proto.propertyIsEnumerable=function(p)
    {
        trace('-- NATIVE XMLList.propertyIsEnumerable');
    }

    __proto.attribute=function(name)
    {
        var arr=[],len=this._$len;
        for (var i=0;i<len;i++) {
            var attributes=this[i]._attributes;
            for (var j=0;j<attributes.length;j++) {
                var value=__string(attributes[j]['key']);
                if (name=="*" || value==name) {
                    arr.push({"key": attributes[j]['key'],"val": attributes[j]['val']});
                }
            }
        }
        return XMLList.createFromAttribute(arr);
    }

    __proto.attributes=function()
    {
        return this.attribute("*");
    }

    __proto.child=function(propertyName)
    {
        trace('-- NATIVE XMLList.child');
    }

    __proto.children=function()
    {
        trace('-- NATIVE XMLList.children');
    }

    __proto.comments=function()
    {
        trace('-- NATIVE XMLList.comments');
    }

    __proto.contains=function(value)
    {
        trace('-- NATIVE XMLList.contains');
    }

    __proto.copy=function()
    {
        trace('-- NATIVE XMLList.copy');
    }

    __proto.descendants=function(name)
    {
        (name===void 0) && (name="*");
        trace('-- NATIVE XMLList.descendants');
    }

    __proto.elements=function(name)
    {
        (name===void 0) && (name="*");
        trace('-- NATIVE XMLList.elements');
    }

    __proto.hasComplexContent=function()
    {
        trace('-- NATIVE XMLList.hasComplexContent');
    }

    __proto.hasSimpleContent=function()
    {
        trace('-- NATIVE XMLList.hasSimpleContent');
    }

    __proto.length=function()
    {
        return this._$len;
    }

    __proto.name=function()
    {
        trace('-- NATIVE XMLList.name');
    }

    __proto.normalize=function()
    {
        trace('-- NATIVE XMLList.normalize');
    }

    __proto.parent=function()
    {
        trace('-- NATIVE XMLList.parent');
    }

    __proto.processingInstructions=function(name)
    {
        (name===void 0) && (name="*");
        trace('-- NATIVE XMLList.processingInstructions');
    }

    __proto.text=function()
    {
        trace('-- NATIVE XMLList.text');
    }

    __proto.toXMLString=function()
    {
        var str="";
        for (var i=0;i<this._$len;i++) {
            var s=__string(this[i].toXMLString());
            if (str)
                str+='\n'+s;
            else
                str=s;
        }
        return str;
    }

    __proto.addNamespace=function(ns)
    {
        trace('-- NATIVE XMLList.addNamespace');
    }

    __proto.appendChild=function(child)
    {
        trace('-- NATIVE XMLList.appendChild');
    }

    __proto.childIndex=function()
    {
        trace('-- NATIVE XMLList.childIndex');
    }

    __proto.inScopeNamespaces=function()
    {
        trace('-- NATIVE XMLList.inScopeNamespaces');
    }

    __proto.insertChildAfter=function(child1,child2)
    {
        trace('-- NATIVE XMLList.insertChildAfter');
    }

    __proto.insertChildBefore=function(child1,child2)
    {
        trace('-- NATIVE XMLList.insertChildBefore');
    }

    __proto.nodeKind=function()
    {
        trace('-- NATIVE XMLList.nodeKind');
    }

    __proto.namespace=function(prefix)
    {
        (prefix===void 0) && (prefix=null);
        trace('-- NATIVE XMLList.namespace');
    }

    __proto.localName=function()
    {
        trace('-- NATIVE XMLList.localName');
    }

    __proto.namespaceDeclarations=function()
    {
        trace('-- NATIVE XMLList.namespaceDeclarations');
    }

    __proto.prependChild=function(value)
    {
        trace('-- NATIVE XMLList.prependChild');
    }

    __proto.replace=function(propertyName,value)
    {
        trace('-- NATIVE XMLList.replace');
    }

    __proto.setChildren=function(value)
    {
        trace('-- NATIVE XMLList.setChildren');
    }

    __proto.setLocalName=function(name)
    {
        trace('-- NATIVE XMLList.setLocalName');
    }

    __proto.setName=function(name)
    {
        trace('-- NATIVE XMLList.setName');
    }

    __proto.toJSON=function(k)
    {
        trace('-- NATIVE XMLList.toJSON');
    }

    __proto.__addChild__=function(value)
    {
        if (value instanceof XML) {
            var ixl=value._childNodes,len=ixl.length|0;
            for (var i=0;i<len;i++) {
                this.__doAdd__(ixl[i]);
            }
            this._$push(value);
        } else if (value instanceof XMLList) {
            len=value.length()|0;
            for (i=0;i<len;i++) {
                this.__addChild__(value[i]);
            }
        }
    }

    __proto.__doAdd__=function(value)
    {
        if (this._$indexOf(value)!= -1)
            return;
        var n=value._nodeName;
        var x=this[n];
        if (x instanceof XMLList) {
            x.__addChild__(value);
        } else if (x instanceof XML) {
            var tmp=x;
            x=this[n]=new XMLList();
            Object.defineProperty(this,[n],{value: this[n],writable: true,enumerable: false,configurable: false});
            x.__addChild__(tmp);
            x.__addChild__(value);
        } else if (!x) {
            x=this[n]=new XMLList();
            Object.defineProperty(this,[n],{value: this[n],writable: true,enumerable: false,configurable: false});
            x.__addChild__(value);
        }
    }

    __proto._$push=function(v)
    {
        this[this._$len++]=v;
    }

    __proto._$indexOf=function(v)
    {
        for (var i=0;i<this._$len;i++) {
            if (this[i]===v)
                return i;
        }
        return  -1;
    }

    XMLList.create=function(arr)
    {
        var xl=new XMLList();
        for (var i=0;i<arr.length;i++) {
            xl.__addChild__(arr[i]);
        }
        return xl;
    }

    XMLList.createFromAttribute=function(arr)
    {
        var xl=new XMLList();
        for (var i=0;i<arr.length;i++) {
            var xml=new XML();
            var obj=arr[i];
            xml._nodeName=__string(obj.key);
            xml._nodeValue=__string(obj.val);
            xl._$push(xml);
        }
        return xl;
    }

    XMLList.toString=function(){return "[class XMLList]";};
    Mira.un_proto(XMLList);
    return XMLList;
})();

var AccessibilityImplementation=(function() {
    function AccessibilityImplementation()
    {
        this.errno=0;
        this.stub=false;
    }

    __class(AccessibilityImplementation,'flash.accessibility.AccessibilityImplementation');
    var __proto=AccessibilityImplementation.prototype;

    __proto.accDoDefaultAction=function(childID)
    {
    }

    __proto.accLocation=function(childID)
    {
        return null;
    }

    __proto.accSelect=function(operation,childID)
    {
    }

    __proto.get_accDefaultAction=function(childID)
    {
        return "";
    }

    __proto.get_accFocus=function()
    {
        return 0;
    }

    __proto.get_accName=function(childID)
    {
        return "";
    }

    __proto.get_accRole=function(childID)
    {
        return 0;
    }

    __proto.get_accSelection=function()
    {
        return [];
    }

    __proto.get_accState=function(childID)
    {
        return 0;
    }

    __proto.get_accValue=function(childID)
    {
        return "";
    }

    __proto.getChildIDArray=function()
    {
        return [];
    }

    __proto.isLabeledBy=function(labelBounds)
    {
        return false;
    }

    AccessibilityImplementation.toString=function(){return "[class AccessibilityImplementation]";};
    Mira.un_proto(AccessibilityImplementation);
    return AccessibilityImplementation;
})();

var ActionScriptVersion=(function() {
    function ActionScriptVersion()
    {
    }

    __class(ActionScriptVersion,'flash.display.ActionScriptVersion');

    ActionScriptVersion.ACTIONSCRIPT2=2;
    ActionScriptVersion.ACTIONSCRIPT3=3;

    ActionScriptVersion.toString=function(){return "[class ActionScriptVersion]";};
    return ActionScriptVersion;
})();

var AVM1Movie=(function(_super) {
    function AVM1Movie()
    {
        AVM1Movie.__super.call(this);
    }

    __class(AVM1Movie,'flash.display.AVM1Movie',_super);
    var __proto=AVM1Movie.prototype;

    __proto.addCallback=function(functionName,closure)
    {
    }

    __proto.call=function(functionName)
    {
        var rest=[];for(var $a=1,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
    }

    AVM1Movie.toString=function(){return "[class AVM1Movie]";};
    Mira.un_proto(AVM1Movie);
    return AVM1Movie;
})(DisplayObject);

var Bitmap=(function(_super) {
    function Bitmap(bitmapData,pixelSnapping,smoothing)
    {
        this._scaleY_=1;
        this._scaleX_=1;
        this._$isTransparent=false;
        (bitmapData===void 0) && (bitmapData=null);
        (pixelSnapping===void 0) && (pixelSnapping="auto");
        (smoothing===void 0) && (smoothing=false);
        Bitmap.__super.call(this);
        bitmapData && (this.bitmapData=bitmapData);
    }

    __class(Bitmap,'flash.display.Bitmap',_super);
    var __proto=Bitmap.prototype;
    Mira.imps(__proto,{"flash.display.IBitmapDrawable":true});

    __proto._$setImage=function(data,isTransparent)
    {
        this._$imgData=data;
        this._$isTransparent=isTransparent;
        this._width_=Math.abs(data.width*this._scaleX_);
        this._height_=Math.abs(data.height*this._scaleY_);
        this._type_|=(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        if (!this._canvas_) {
            this._canvas_=new VirtualCanvas();
        }
        this._canvas_.size(data.width,data.height);
        this._canvas_.clear();
        this._canvas_.baseImage=data;
        this._canvas_.drawImage(data,0,0);
    }

    __proto.paint=function(ctx,x,y,w,h)
    {
        if (this._$bitmapData) {
            if (this._$bitmapData._$isdispose) {
                this.bitmapData=null;
                return;
            }
            this._$bitmapData._$flush();
        }
        this._canvas_ && this._canvas_.paint(ctx,x,y,w,h);
    }

    __proto._$paintThis=function(ctx)
    {
        this.paint(ctx,0,0,this._width_,this._height_);
    }

    __getset(0,__proto,'bitmapData',
        function()
        {
            if (!this._$bitmapData) {
                if (this._$imgData) {
                    this._$bitmapData=BitmapData._$createFromImage(this._$imgData,this._$isTransparent);
                    this._$setImage(this._$bitmapData.getCanvas(),this._$isTransparent);
                } else {
                    this._$bitmapData=new BitmapData(1,1,true,0);
                    this._$setImage(this._$bitmapData.getCanvas(),this._$bitmapData.transparent);
                }
                this._$imgData=null;
            }
            return this._$bitmapData;
        },
        function(value)
        {
            this._$doDirty(true);
            if (this._$bitmapData) {
                this._$bitmapData._$delOwer(this);
            }
            if (value) {
                this._$bitmapData=value;
                this._$setImage(this._$bitmapData.getCanvas(),this._$bitmapData.transparent);
                this._$imgData=null;
                value._$pushOwer(this);
            } else {
                this._$bitmapData=null;
                this._$imgData=null;
                this._canvas_=null;
            }
        }
    );

    __getset(0,__proto,'width',null,
        function(w)
        {
            if (this._width_==w)
                return;
            var oldW=this._width_/this._scaleX_;
            oldW && (this._scaleX_=w/oldW);
            this._width_=Math.abs(w);
            this._type_|=(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        }
    );

    __getset(0,__proto,'height',null,
        function(h)
        {
            if (this._height_==h)
                return;
            var oldH=this._height_/this._scaleY_;
            oldH && (this._scaleY_=h/oldH);
            this._height_=Math.abs(h);
            this._type_|=(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        }
    );

    __getset(0,__proto,'scaleX',
        function()
        {
            return this._scaleX_;
        },
        function(value)
        {
            var oldW;
            if (this._width_*this._scaleX_==0 && this.bitmapData)
                oldW=this.bitmapData.width;
            else
                oldW=this._width_/this._scaleX_;
            this._scaleX_=value;
            this._width_=Math.abs(oldW*value);
            _super.prototype._$set_scaleX.call(this,this._scaleX_>0 ? 1 :  -1);
        }
    );

    __getset(0,__proto,'scaleY',
        function()
        {
            return this._scaleY_;
        },
        function(value)
        {
            var oldH;
            if (this._height_*this._scaleY_==0 && this.bitmapData)
                oldH=this.bitmapData.height;
            else
                oldH=this._height_/this._scaleY_;
            this._scaleY_=value;
            this._height_=Math.abs(oldH*value);
            _super.prototype._$set_scaleY.call(this,this._scaleY_>0 ? 1 :  -1);
        }
    );

    __getset(0,__proto,'pixelSnapping',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'smoothing',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    Bitmap.toString=function(){return "[class Bitmap]";};
    Mira.un_proto(Bitmap);
    return Bitmap;
})(DisplayObject);

var BitmapData=(function() {
    function BitmapData(w,h,transparent,color)
    {
        this._$dirty=false;
        this._$width=0;
        this._$height=0;
        this._$trans=false;
        this._$isdispose=false;
        this._$cid=0;
        this._$owers=new MsDict();
        (transparent===void 0) && (transparent=true);
        (color===void 0) && (color=0xFFFFFFFF);
        this._$width=w;
        this._$height=h;
        this._$trans=transparent;
        this._$canvas=document.createElement('canvas');
        this._$canvas.width=w;
        this._$canvas.height=h;
        this._$context=this._$canvas.getContext("2d");
        this._$canvas["bitmap"]=this;
        if (!transparent || ((color>>24)&0xff)) {
            this._$fill(0,0,w,h,color);
        }
    }

    __class(BitmapData,'flash.display.BitmapData');
    var __proto=BitmapData.prototype;
    Mira.imps(__proto,{"flash.display.IBitmapDrawable":true});

    __proto.applyFilter=function(sourceBitmapData,sourceRect,destPoint,filter)
    {
        trace('-- NATIVE flash.display.BitmapData.applyFilter');
    }

    __proto.clone=function()
    {
        return BitmapData._$createFromImage(this._$canvas,this._$trans);
    }

    __proto.colorTransform=function(rect,colorTransform)
    {
        this._$ready();
        var data=this._$imgData.data;
        for (var i=0;i<rect.width; ++i) {
            for (var j=0;j<rect.height; ++j) {
                var pos=((rect.y+j)*this._$width+rect.x+i)<<2;
                data[pos]=data[pos]*colorTransform.redMultiplier+colorTransform.redOffset;
                data[pos+1]=data[pos+1]*colorTransform.greenMultiplier+colorTransform.greenOffset;
                data[pos+2]=data[pos+2]*colorTransform.blueMultiplier+colorTransform.blueOffset;
                data[pos+3]=data[pos+3]*colorTransform.alphaMultiplier+colorTransform.alphaOffset;
            }
        }
        this._$dirty=true;
        this._$doDirty();
    }

    __proto.compare=function(otherBitmapData)
    {
        if (!otherBitmapData) {
            throw new Error("otherBitmapData为空");
        }
        if (otherBitmapData.width!=this._$width) {
            return  -3;
        }
        if (otherBitmapData.height!=this._$height) {
            return  -4;
        }
        this._$ready();
        otherBitmapData._$ready();
        var bmd=new BitmapData(this._$width,this._$height,true,0);
        bmd._$ready();
        bmd._$dirty=true;
        var arrd=bmd._$imgData.data;
        var isSame=true;
        var arr1=this._$imgData.data;
        var arr2=otherBitmapData._$imgData.data;
        var len=arr1.byteLength;
        var i=0;
        for (i=0;i<len;i=i+4) {
            arrd[i]=arr1[i]-arr2[i];
            arrd[i+1]=arr1[i+1]-arr2[i+1];
            arrd[i+2]=arr1[i+2]-arr2[i+2];
            if (!arrd[i] && !arrd[i+1] && !arrd[i+2]) {
                arrd[i]=0xff;
                arrd[i+1]=0xff;
                arrd[i+2]=0xff;
                arrd[i+3]=arr1[i+3]-arr2[i+3];
                if (arrd[i+3])
                    isSame=false;
            } else {
                arrd[i+3]=0;
                isSame=false;
            }
        }
        if (isSame)
            return 0;
        else
            return bmd;
    }

    __proto.copyChannel=function(sourceBitmapData,sourceRect,destPoint,sourceChannel,destChannel)
    {
        this._$ready();
        var sourceData=sourceBitmapData._$getImageData().data;
        var destData=this._$imgData.data;
        var soff=sourceChannel>>1;
        if (soff>3)
            soff=3;
        var doff=destChannel>>1;
        if (doff>3)
            doff=3;
        for (var i=0;i<sourceRect.width; ++i) {
            for (var j=0;j<sourceRect.height; ++j) {
                var spos=(i+sourceRect.x+(j+sourceRect.y)*sourceBitmapData.width)<<2;
                var dpos=(i+destPoint.x+(j+destPoint.y)*this._$width)<<2;
                destData[dpos+doff]=sourceData[spos+soff];
            }
        }
        this._$dirty=true;
        this._$doDirty();
    }

    __proto.copyPixels=function(sourceBitmapData,sourceRect,destPoint,alphaBitmapData,alphaPoint,mergeAlpha)
    {
        (alphaBitmapData===void 0) && (alphaBitmapData=null);
        (alphaPoint===void 0) && (alphaPoint=null);
        (mergeAlpha===void 0) && (mergeAlpha=false);
        if (!sourceBitmapData || !sourceRect || !destPoint) {
            throw new Error("sourceBitmapData、sourceRect 和 destPoint 为空");
        }
        var w=this._$width;
        var h=this._$height;
        var dx=destPoint.x;
        var dy=destPoint.y;
        var sx=sourceRect.left;
        var sy=sourceRect.top;
        var sw=sourceRect.width;
        var sh=sourceRect.height;
        if (dx<0) {
            sx-=dx;
            sw+=dx;
            dx=0;
        }
        if (dy<0) {
            sy-=dy;
            sh+=dy;
            dy=0;
        }
        if (sw+dx>this.width)
            sw=this.width-dx;
        if (sh+dy>this.height)
            sh=this.height-dy;
        if (sourceBitmapData.width<sw)
            sw=sourceBitmapData.width;
        else if (sourceBitmapData.height<sh)
            sh=sourceBitmapData.height;
        if (sw<=0 || sh<=0)
            return;
        this._$flush();
        this._$imgData=null;
        sourceBitmapData._$flush();
        sw=Math.min(sw,this._$width);
        sh=Math.min(this._$height,sh);
        if (mergeAlpha) {
            this._$context.drawImage(sourceBitmapData._$canvas,sx,sy,sw,sh,dx,dy,sw,sh);
        } else {
            var imgdataDst=sourceBitmapData._$context.getImageData(sx,sy,sw,sh);
            this._$context.putImageData(imgdataDst,dx,dy);
        }
        this._$doDirty();
    }

    __proto.dispose=function()
    {
        this._$isdispose=true;
        this._$canvas=null;
        this._$context=null;
        this._$imgData=null;
    }

    __proto.draw=function(source,matrix,colorTransform,blendMode,clipRect,smoothing)
    {
        (matrix===void 0) && (matrix=null);
        (colorTransform===void 0) && (colorTransform=null);
        (blendMode===void 0) && (blendMode=null);
        (clipRect===void 0) && (clipRect=null);
        (smoothing===void 0) && (smoothing=false);
        if (!source)
            throw new ArgumentError("source is null.");
        this._$flush();
        this._$imgData=null;
        var isSave=false;
        var tempCanvas;
        var sourceW=0;
        var sourceH=0;
        var sourceTx=0;
        var sourceTy=0;
        if (source instanceof BitmapData) {
            var sourceBitmapData=__as(source,BitmapData);
            sourceW=sourceBitmapData.width;
            sourceH=sourceBitmapData.height;
            tempCanvas=sourceBitmapData.getCanvas();
            if (matrix) {
                this._$context.save();
                this._$context.transform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty);
                isSave=true;
                sourceTx=matrix.tx;
                sourceTy=matrix.ty;
            }
        } else if (source instanceof DisplayObject) {
            var d=__as(source,DisplayObject);
            sourceW=d.width;
            sourceH=d.height;
            tempCanvas=document.createElement("canvas");
            tempCanvas.width=this._$width;
            tempCanvas.height=this._$height;
            var mt=d._$getMatrixR().clone();
            if (matrix) {
                sourceTx=matrix.tx;
                sourceTy=matrix.ty;
                d.matrix=matrix;
            } else {
                d.matrix=new Matrix();
            }
            d._$miraPaint(tempCanvas.getContext("2d"));
            d.matrix=mt;
        }
        if (colorTransform) {
            var ctx=tempCanvas.getContext("2d");
            var imageData=ctx.getImageData(0,0,tempCanvas.width,tempCanvas.height);
            var data=imageData.data;
            for (var i=0;i<data.length;i+=4) {
                if (data[i+3]==0)
                    continue;
                data[i]=data[i]*colorTransform.redMultiplier+colorTransform.redOffset;
                data[i+1]=data[i+1]*colorTransform.greenMultiplier+colorTransform.greenOffset;
                data[i+2]=data[i+2]*colorTransform.blueMultiplier+colorTransform.blueOffset;
                data[i+3]=data[i+3]*colorTransform.alphaMultiplier+colorTransform.alphaOffset;
            }
            ctx.putImageData(imageData,0,0);
        }
        if (clipRect) {
            var sx=clipRect.x|0;
            var sy=clipRect.y|0;
            var sw=clipRect.width|0;
            var sh=clipRect.height|0;
            this._$context.drawImage(tempCanvas,sx,sy,sw,sh,sx,sy,sw,sh);
        } else {
            this._$context.drawImage(tempCanvas,0,0);
        }
        if (isSave) {
            this._$context.restore();
        }
        this._$doDirty();
    }

    __proto.fillRect=function(rect,color)
    {
        this._$flush();
        this._$imgData=null;
        this._$context.save();
        var s;
        if (this.transparent) {
            var alpha=(color>>24)&0xff;
            s=StringMethod.getRgbaColor(color,alpha/255);
        } else {
            s=StringMethod.getRgbaColor(color,1);
        }
        this._$context.fillStyle=s;
        this._$context.globalCompositeOperation="source-over";
        this._$context.clearRect(rect.x,rect.y,rect.width,rect.height);
        this._$context.fillRect(rect.x,rect.y,rect.width,rect.height);
        this._$context.restore();
        this._$doDirty();
    }

    __proto.floodFill=function(x,y,color)
    {
        trace('-- NATIVE flash.display.BitmapData.floodFill');
    }

    __proto._$fill=function(x,y,width,height,color)
    {
        this._$flush();
        this._$imgData=null;
        this._$context.save();
        var s;
        if (this.transparent) {
            var alpha=(color>>24)&0xff;
            s=StringMethod.getRgbaColor(color,alpha/255);
        } else {
            s=StringMethod.getRgbaColor(color,1);
        }
        this._$context.fillStyle=s;
        this._$context.globalCompositeOperation="copy";
        this._$context.fillRect(x,y,width,height);
        this._$context.restore();
    }

    __proto.generateFilterRect=function(sourceRect,filter)
    {
        trace('-- NATIVE flash.display.BitmapData.generateFilterRect');
    }

    __proto.getColorBoundsRect=function(mask,color,findColor)
    {
        (findColor===void 0) && (findColor=true);
        return new Rectangle(0,0,this._$width,this._$height);
    }

    __proto.getPixel=function(x,y)
    {
        this._$ready();
        var pos=(y*this._$width+x)<<2;
        if (!this._$imgData.data[pos+3])
            return 0;
        var r=this._$imgData.data[pos];
        var g=this._$imgData.data[pos+1];
        var b=this._$imgData.data[pos+2];
        return (r<<16)|(g<<8)|b;
    }

    __proto.getPixel32=function(x,y)
    {
        this._$ready();
        var pos=(y*this._$width+x)<<2;
        var r=this._$imgData.data[pos];
        var g=this._$imgData.data[pos+1];
        var b=this._$imgData.data[pos+2];
        var a=this._$imgData.data[pos+3];
        return (a<<24)|(r<<16)|(g<<8)|b;
    }

    __proto.getPixels=function(rect)
    {
        this._$flush();
        var imgdataDst=this._$context.getImageData(rect.x,rect.y,rect.width,rect.height);
        var b=new ByteArray(imgdataDst.data.buffer);
        return b;
    }

    __proto.getVector=function(rect)
    {
        this._$flush();
        var imgdataDst=this._$context.getImageData(rect.x,rect.y,rect.width,rect.height);
        var data=imgdataDst.data;
        var len=data.byteLength;
        var v=[];
        var j=0;
        for (var i=0;i<len;i=i+4) {
            v[j++]=(data[i+3]<<24)|(data[i]<<16)|(data[i+1]<<8)|(data[i+2]);
        }
        return v;
    }

    __proto.histogram=function(hRect)
    {
        (hRect===void 0) && (hRect=null);
        trace('-- NATIVE flash.display.BitmapData.histogram');
    }

    __proto.hitTest=function(firstPoint,firstAlphaThreshold,secondObject,secondBitmapDataPoint,secondAlphaThreshold)
    {
        (secondBitmapDataPoint===void 0) && (secondBitmapDataPoint=null);
        (secondAlphaThreshold===void 0) && (secondAlphaThreshold=1);
        trace('-- NATIVE flash.display.BitmapData.hitTest');
    }

    __proto.lock=function()
    {
    }

    __proto.noise=function(randomSeed,low,high,channelOptions,grayScale)
    {
        (low===void 0) && (low=0);
        (high===void 0) && (high=255);
        (channelOptions===void 0) && (channelOptions=7);
        (grayScale===void 0) && (grayScale=false);
        this._$ready();
        var imgdata=this._$imgData.data;
        var len=(this._$width*this._$height)<<2;
        var lm=high-low;
        var i=0;
        if (grayScale) {
            for (i=0;i<len;i=i+4) {
                imgdata[i]=imgdata[i+1]=imgdata[i+2]=Math.random()*lm+low;
            }
        } else {
            var r=channelOptions&BitmapDataChannel.RED;
            var g=channelOptions&BitmapDataChannel.GREEN;
            var b=channelOptions&BitmapDataChannel.BLUE;
            var a=channelOptions&BitmapDataChannel.ALPHA;
            for (i=0;i<len;i=i+4) {
                r && (imgdata[i]=Math.random()*lm+low);
                g && (imgdata[i+1]=Math.random()*lm+low);
                b && (imgdata[i+2]=Math.random()*lm+low);
                a && (imgdata[i+3]=Math.random()*lm+low);
            }
        }
        this._$dirty=true;
        this._$doDirty();
    }

    __proto.merge=function(sourceBitmapData,sourceRect,destPoint,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier)
    {
        trace('-- NATIVE flash.display.BitmapData.merge');
    }

    __proto.paletteMap=function(sourceBitmapData,sourceRect,destPoint,redArray,greenArray,blueArray,alphaArray)
    {
        (redArray===void 0) && (redArray=null);
        (greenArray===void 0) && (greenArray=null);
        (blueArray===void 0) && (blueArray=null);
        (alphaArray===void 0) && (alphaArray=null);
        trace('-- NATIVE flash.display.BitmapData.paletteMap');
    }

    __proto.perlinNoise=function(baseX,baseY,numOctaves,randomSeed,stitch,fractalNoise,channelOptions,grayScale,offsets)
    {
        (channelOptions===void 0) && (channelOptions=7);
        (grayScale===void 0) && (grayScale=false);
        (offsets===void 0) && (offsets=null);
        this._$ready();
        var imgdata=this._$imgData.data;
        var pn=new PerlinNoise();
        pn.frequency=1/baseX;
        pn.octaveCount=numOctaves;
        pn.seed=randomSeed;
        var k=0;
        for (var i=0;i<this._$height;i++) {
            for (var j=0;j<this._$width;j++) {
                var v=(pn.getValue(j,i)+1)*128|0;
                imgdata[k]=v;
                imgdata[k+1]=v;
                imgdata[k+2]=v;
                k+=4;
            }
        }
        this._$dirty=true;
        this._$doDirty();
    }

    __proto.setPixel=function(x,y,color)
    {
        this._$ready();
        var pos=(y*this._$width+x)<<2;
        this._$imgData.data[pos]=(color>>16)&0xff;
        this._$imgData.data[pos+1]=(color>>8)&0xff;
        this._$imgData.data[pos+2]=(color)&0xff;
        this._$imgData.data[pos+3]=255;
        this._$dirty=true;
        this._$doDirty();
    }

    __proto.setPixel32=function(x,y,color)
    {
        this._$ready();
        var pos=(y*this._$width+x)<<2;
        this._$imgData.data[pos]=(color>>16)&0xff;
        this._$imgData.data[pos+1]=(color>>8)&0xff;
        this._$imgData.data[pos+2]=(color)&0xff;
        this._$imgData.data[pos+3]=(color>>24)&0xff;
        this._$dirty=true;
        this._$doDirty();
    }

    __proto.setPixels=function(rect,inputByteArray)
    {
        this._$ready();
        var imgData=this._$imgData.data;
        var k=0;
        for (var j=0;j<rect.height; ++j) {
            var pos=((rect.y+j)*this._$width+rect.x)<<2;
            for (var i=0;i<rect.width; ++i) {
                imgData[pos]=inputByteArray.get(k+1);
                imgData[pos+1]=inputByteArray.get(k+2);
                imgData[pos+2]=inputByteArray.get(k+3);
                if (this.transparent)
                    imgData[pos+3]=inputByteArray.get(k);
                else
                    imgData[pos+3]=255;
                k+=4;
                pos+=4;
            }
        }
        this._$dirty=true;
        this._$doDirty();
    }

    __proto.setVector=function(rect,inputVector)
    {
        this._$ready();
        var imgData=this._$imgData.data;
        var k=0;
        var v=0;
        for (var j=0;j<rect.height; ++j) {
            var pos=((rect.y+j)*this._$width+rect.x)<<2;
            for (var i=0;i<rect.width; ++i) {
                v=inputVector[k];
                imgData[pos]=(v>>16)&0xff;
                imgData[pos+1]=(v>>8)&0xff;
                imgData[pos+2]=(v)&0xff;
                imgData[pos+3]=(v>>24)&0xff;
                k++;
                pos+=4;
            }
        }
        this._$dirty=true;
        this._$doDirty();
    }

    __proto.scroll=function(x,y)
    {
        this._$ready();
        var img=this._$imgData;
        this._$imgData=null;
        this._$dirty=false;
        this._$context.putImageData(img,x,y);
        this._$doDirty();
    }

    __proto.pixelDissolve=function(sourceBitmapData,sourceRect,destPoint,randomSeed,numPixels,fillColor)
    {
        (randomSeed===void 0) && (randomSeed=0);
        (numPixels===void 0) && (numPixels=0);
        (fillColor===void 0) && (fillColor=0);
        trace('-- NATIVE flash.display.BitmapData.pixelDissolve');
    }

    __proto.threshold=function(sourceBitmapData,sourceRect,destPoint,operation,threshold,color,mask,copySource)
    {
        (color===void 0) && (color=0);
        (mask===void 0) && (mask=0xFFFFFFFF);
        (copySource===void 0) && (copySource=false);
        var _$this=this;
        if (!sourceBitmapData || !sourceRect || !destPoint || !operation) {
            throw new Error("sourceBitmapData、sourceRect、destPoint 或 operation 为空。");
        }
        var opFun;
        switch (operation) {
        case "<":
            opFun=function (pixelValue,threshold,mask) {
                return (pixelValue&mask)<(threshold&mask);
            };
            break;
        case "<=":
            opFun=function (pixelValue,threshold,mask) {
                return (pixelValue&mask)<=(threshold&mask);
            };
            break;
        case ">":
            opFun=function (pixelValue,threshold,mask) {
                return (pixelValue&mask)>(threshold&mask);
            };
            break;
        case ">=":
            opFun=function (pixelValue,threshold,mask) {
                return (pixelValue&mask)>=(threshold&mask);
            };
            break;
        case "==":
            opFun=function (pixelValue,threshold,mask) {
                return (pixelValue&mask)==(threshold&mask);
            };
            break;
        case "!=":
            opFun=function (pixelValue,threshold,mask) {
                return (pixelValue&mask)!=(threshold&mask);
            };
            break;
        default:
            throw new Error("操作字符串不是有效的操作。");
        }
        var ca=(color>>24)&0xff;
        var cr=(color>>16)&0xff;
        var cg=(color>>8)&0xff;
        var cb=(color)&0xff;
        var num=0;
        var sw=(sourceRect.right>sourceBitmapData.width) ? sourceBitmapData.width-sourceRect.x : sourceRect.width;
        var sh=(sourceRect.bottom>sourceBitmapData.height) ? sourceBitmapData.height-sourceRect.y : sourceRect.height;
        if (destPoint.x+sw>this._$width)
            sw=this._$width-destPoint.x;
        if (destPoint.y+sh>this._$height)
            sh=this._$height-destPoint.y;
        if (sw<=0 || sh<=0)
            return 0;
        sourceBitmapData._$flush();
        var imgDataSrc=sourceBitmapData._$context.getImageData(sourceRect.x,sourceRect.y,sw,sh);
        var arrSrc=imgDataSrc.data;
        this._$ready();
        var arrDst=this._$imgData.data;
        var w=destPoint.x,h=destPoint.y;
        var i=(h*this._$width+w)<<2;
        var j=0;
        var pv=0;
        var len=arrSrc.byteLength;
        for (var n=0;n<len;n+=4) {
            pv=(arrSrc[n+3]<<24)|(arrSrc[n]<<16)|(arrSrc[n+1]<<8)|(arrSrc[n+2]);
            if (opFun(pv,threshold,mask)) {
                arrDst[i]=cr;
                arrDst[i+1]=cg;
                arrDst[i+2]=cb;
                arrDst[i+3]=ca;
                num++;
            } else {
                if (copySource) {
                    arrDst[i]=arrSrc[n];
                    arrDst[i+1]=arrSrc[n+1];
                    arrDst[i+2]=arrSrc[n+2];
                    arrDst[i+3]=arrSrc[n+3];
                    num++;
                }
            }
            j++;
            i+=4;
            if (j>=sw) {
                h++;
                j=0;
                i=(h*this._$width+w)<<2;
            }
        }
        this._$dirty=true;
        this._$doDirty();
        return num;
    }

    __proto.unlock=function()
    {
    }

    __proto._$ready=function()
    {
        if (!this._$imgData)
            this._$imgData=this._$context.getImageData(0,0,this._$width,this._$height);
    }

    __proto._$flush=function()
    {
        if (this._$dirty) {
            this._$context.putImageData(this._$imgData,0,0);
            this._$dirty=false;
        }
    }

    __proto._$getImageData=function()
    {
        this._$ready();
        return this._$imgData;
    }

    __proto.getCanvas=function()
    {
        this._$flush();
        return this._$canvas;
    }

    __proto.getContent=function()
    {
        return this._$context;
    }

    __proto.getTextureData=function()
    {
        if (this._$imgData)
            return this._$imgData;
        return this._$canvas;
    }

    __proto._$resizeCanvas=function(width,height)
    {
        if (this._$canvas.width!=width) {
            this._$canvas.width=width;
        }
        if (this._$canvas.height!=height) {
            this._$canvas.height=height;
        }
        this._$width=width|0;
        this._$height=height|0;
        this._$context.clearRect(0,0,width,height);
    }

    __proto._$doDirty=function()
    {
        var keys=this._$owers.keys;
        for (var i=0;i<keys.length;i++) {
            var o=keys[i];
            o && o._$doDirty(true);
        }
    }

    __proto._$pushOwer=function(o)
    {
        this._$owers.set(o,true);
    }

    __proto._$delOwer=function(o)
    {
        this._$owers.remove(o);
    }

    __getset(0,__proto,'height',
        function()
        {
            return this._$height;
        }
    );

    __getset(0,__proto,'rect',
        function()
        {
            return new Rectangle(0,0,this._$width,this._$height);
        }
    );

    __getset(0,__proto,'transparent',
        function()
        {
            return this._$trans;
        }
    );

    __getset(0,__proto,'width',
        function()
        {
            return this._$width;
        }
    );

    BitmapData._$createFromImage=function(data,isTransparent)
    {
        var bmd=new BitmapData(data.width,data.height,isTransparent,0);
        bmd._$context.drawImage(data,0,0);
        return bmd;
    }

    BitmapData.toString=function(){return "[class BitmapData]";};
    Mira.un_proto(BitmapData);
    return BitmapData;
})();

var BitmapDataChannel=(function() {
    function BitmapDataChannel()
    {
    }

    __class(BitmapDataChannel,'flash.display.BitmapDataChannel');

    BitmapDataChannel.ALPHA=8;
    BitmapDataChannel.BLUE=4;
    BitmapDataChannel.GREEN=2;
    BitmapDataChannel.RED=1;

    BitmapDataChannel.toString=function(){return "[class BitmapDataChannel]";};
    return BitmapDataChannel;
})();

var BlendMode=(function() {
    function BlendMode()
    {
    }

    __class(BlendMode,'flash.display.BlendMode');

    BlendMode.NORMAL="normal";
    BlendMode.LAYER="layer";
    BlendMode.MULTIPLY="multiply";
    BlendMode.SCREEN="screen";
    BlendMode.LIGHTEN="lighten";
    BlendMode.DARKEN="darken";
    BlendMode.ADD="add";
    BlendMode.SUBTRACT="subtract";
    BlendMode.DIFFERENCE="difference";
    BlendMode.INVERT="invert";
    BlendMode.OVERLAY="overlay";
    BlendMode.HARDLIGHT="hardlight";
    BlendMode.ALPHA="alpha";
    BlendMode.ERASE="erase";
    BlendMode.SHADER="shader";

    BlendMode.toString=function(){return "[class BlendMode]";};
    return BlendMode;
})();

var CapsStyle=(function() {
    function CapsStyle()
    {
    }

    __class(CapsStyle,'flash.display.CapsStyle');

    CapsStyle.ROUND="round";
    CapsStyle.NONE="none";
    CapsStyle.SQUARE="square";

    CapsStyle.toString=function(){return "[class CapsStyle]";};
    return CapsStyle;
})();

var InteractiveObject=(function(_super) {
    function InteractiveObject()
    {
        this._$focusRect=false;
        InteractiveObject.__super.call(this);
    }

    __class(InteractiveObject,'flash.display.InteractiveObject',_super);
    var __proto=InteractiveObject.prototype;

    __proto.changeFocus=function()
    {
        if (this.stage==null)
            return;
        if (this.stage.focus!=this) {
            this.repaint();
        }
    }

    __proto.repaint=function()
    {
    }

    __proto._hitTest_=function(_x,_y,checkV)
    {
        (checkV===void 0) && (checkV=true);
        var target=_super.prototype._hitTest_.call(this,_x,_y,checkV);
        if (target) {
            return this.mouseEnabled ? this : this.parent;
        }
        return null;
    }

    __getset(0,__proto,'focusRect',
        function()
        {
            return this._$focusRect;
        },
        function(param1)
        {
            this._$focusRect=param1;
        }
    );

    __getset(0,__proto,'mouseEnabled',
        function()
        {
            return (this._type_&DisplayObject.TYPE_MOUSE_ENABLE)!=0;
        },
        function(value)
        {
            if (value)
                this._type_|=DisplayObject.TYPE_MOUSE_ENABLE;
            else
                this._type_&=~DisplayObject.TYPE_MOUSE_ENABLE;
        }
    );

    __getset(0,__proto,'doubleClickEnabled',
        function()
        {
            return (this._type_&DisplayObject.TYPE_MOUSE_DBCLICK_ENABLE)!=0;
        },
        function(value)
        {
            if (value)
                this._type_|=DisplayObject.TYPE_MOUSE_DBCLICK_ENABLE;
            else
                this._type_&=~DisplayObject.TYPE_MOUSE_DBCLICK_ENABLE;
        }
    );

    __getset(0,__proto,'tabEnabled',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'contextMenu',
        function()
        {
            return null;
        },
        function(cm)
        {
        }
    );

    __getset(0,__proto,'tabIndex',
        function()
        {
            return 0;
        },
        function(param1)
        {
        }
    );

    InteractiveObject.toString=function(){return "[class InteractiveObject]";};
    Mira.un_proto(InteractiveObject);
    return InteractiveObject;
})(DisplayObject);

var DisplayObjectContainer=(function(_super) {
    function DisplayObjectContainer()
    {
        this._childs_=EventDispatcher.__NULLARRAY__;
        DisplayObjectContainer.__super.call(this);
        this._type_|=DisplayObject.TYPE_MOUSE_CHILDREN;
    }

    __class(DisplayObjectContainer,'flash.display.DisplayObjectContainer',_super);
    var __proto=DisplayObjectContainer.prototype;

    __proto.addChild=function(c)
    {
        if (!c)
            throw new ArgumentError("Parameter child must be non-null.");
        if (c._parent_!=null) {
            if (c._parent_==this) {
                var pre=this._$childIndexOf(c);
                this._$removeChildAt(pre,false);
            } else
                c._parent_.removeChild(c);
        }
        this._childs_==EventDispatcher.__NULLARRAY__ && (this._childs_=[]);
        this._childs_.push(c);
        this._$doDirty(true);
        c._$depth=0;
        c._parent_=this;
        if (EventDispatcher._isOpenTypeAdded)
            c._dispatchAddedEvent(c);
        c._propagateFlagsDown_(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        if (this._root_==Stage.stage) {
            c._$stageAdd();
        }
        return c;
    }

    __proto.addChildAt=function(c,index)
    {
        if (index<0 || index>this._childs_.length)
            throw new RangeError("The supplied index is out of bounds.");
        if (!c)
            throw new ArgumentError("Parameter child must be non-null.");
        if (c.deleted==true)
            return c;
        if (c._parent_!=null) {
            if (c._parent_==this) {
                var pre=this._$childIndexOf(c);
                if (index==pre)
                    return c;
                this._$removeChildAt(pre,false);
            } else
                c._parent_.removeChild(c);
        }
        this._childs_==EventDispatcher.__NULLARRAY__ && (this._childs_=[]);
        this._childs_.splice(index,0,c);
        this._$doDirty(true);
        c._parent_=this;
        c._$depth=0;
        if (EventDispatcher._isOpenTypeAdded)
            c._dispatchAddedEvent(c);
        c._propagateFlagsDown_(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        if (this._root_==Stage.stage) {
            c._$stageAdd();
        }
        return c;
    }

    __proto.contains=function(child)
    {
        if (this._childs_==null) {
            return false;
        }
        var result={flag: false};
        this._$checkContainsByChild(this,child,result);
        return result.flag;
    }

    __proto.getChildAt=function(index)
    {
        return this._childs_[index];
    }

    __proto.getChildByName=function(value)
    {
        for (var $a in this._childs_) {
            var child=this._childs_[$a];
            if (child.name==value)
                return child;
        }
        return null;
    }

    __proto.getChildIndex=function(child)
    {
        return this._childs_.indexOf(child);
    }

    __proto.getObjectsUnderPoint=function(point,toArr,hp,ext)
    {
        (toArr===void 0) && (toArr=null);
        (hp===void 0) && (hp=null);
        (ext===void 0) && (ext=null);
        var arr=toArr || [];
        if (!hp)
            hp=this.root.localToGlobal(DisplayObject.HELPER_POINT.setTo(point.x,point.y),DisplayObject.HELPER_POINT_ALT);
        var c;
        for (var i=this._childs_.length-1;i>=0;i--) {
            c=this._childs_[i];
            if (ext && ext==c) {
                continue;
            }
            if (!c.visible)
                continue;
            if (c.getBounds(Stage.stage).containsPoint(hp)) {
                if (c instanceof SimpleButton) {
                    arr.push((__as(c,SimpleButton))._$getCurrObj());
                } else if (c instanceof DisplayObjectContainer) {
                    (__as(c,DisplayObjectContainer)).getObjectsUnderPoint(point,arr,hp,ext);
                    arr.push(c);
                } else {
                    arr.push(c);
                }
            }
        }
        return arr;
    }

    __proto.removeChild=function(c)
    {
        this._$doDirty(true);
        return this._$removeChildAt(this._$childIndexOf(c));
    }

    __proto.removeChildAt=function(index)
    {
        this._$doDirty(true);
        return this._$removeChildAt(index);
    }

    __proto.removeChildren=function(beginIndex,endIndex)
    {
        (beginIndex===void 0) && (beginIndex=0);
        (endIndex===void 0) && (endIndex=2147483647);
        var num=this.numChildren;
        if (num==0)
            return;
        this._$doDirty(true);
        if (beginIndex<0)
            beginIndex=0;
        if (endIndex>=num)
            endIndex=num-1;
        while (endIndex>=beginIndex) {
            this._$removeChildAt(endIndex);
            endIndex--;
        }
    }

    __proto.setChildIndex=function(child,index)
    {
        this.addChildAt(child,index);
    }

    __proto.swapChildren=function(child1,child2)
    {
        var index1=this._childs_.indexOf(child1);
        var index2=this._childs_.indexOf(child2);
        this.swapChildrenAt(index1,index2);
    }

    __proto.swapChildrenAt=function(index1,index2)
    {
        this._$doDirty(true);
        var c=this._childs_[index1];
        this._childs_[index1]=this._childs_[index2];
        this._childs_[index2]=c;
        this._childs_[index1]._$depth=0;
        this._childs_[index2]._$depth=0;
    }

    __proto._$childIndexOf=function(child)
    {
        return this._childs_.indexOf(child);
    }

    __proto._$checkContainsByChild=function(display,child,result)
    {
        if (display==child) {
            result.flag=true;
            return;
        }
        if (display instanceof DisplayObjectContainer) {
            var box=__as(display,DisplayObjectContainer);
            for (var i=0,n=box._childs_.length;i<n;i++) {
                this._$checkContainsByChild(box._childs_[i],child,result);
            }
        }
    }

    __proto._$removeChildAt=function(index,isSendEvent)
    {
        (isSendEvent===void 0) && (isSendEvent=true);
        if (index<0)
            return this;
        var c=this._childs_[index];
        this._childs_.splice(index,1);
        if (isSendEvent) {
            this._$bmpCache && this._$bmpCache.dispose();
            c._dispatchRemovedEvent();
            if (this._root_==Stage.stage) {
                c._$stageRemove();
            }
        }
        c._parent_=null;
        c._type_&=~(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        if (MainWin.doc2.activeElement && MainWin.doc2.activeElement.__owner__.root!=this.stage) {
            MainWin.doc2.activeElement.blur();
            MainWin.doc2.activeElement=null;
        }
        return c;
    }

    __proto.getBounds=function(targetSpace,resultRect)
    {
        (resultRect===void 0) && (resultRect=null);
        if (!targetSpace)
            targetSpace=this;
        if (!resultRect)
            resultRect=new Rectangle();
        this._getBounds_(targetSpace,resultRect);
        if (targetSpace!=this) {
            if (targetSpace==this._parent_) {
                DisplayObject.HELPER_MATRIX.copyFrom(this._$getMatrixR());
            } else {
                Matrix._$mul(DisplayObject.HELPER_MATRIX,targetSpace._getInvertedConcatenatedMatrix(),this._getConcatenatedMatrix());
            }
            DisplayObject.HELPER_MATRIX._$transformBounds(resultRect);
        }
        this._type_&=~DisplayObject.TYPE_BOUNDS_CHG;
        return resultRect;
    }

    __proto._getBounds_=function(targetSpace,resultRect)
    {
        (resultRect===void 0) && (resultRect=null);
        if (!targetSpace)
            targetSpace=this;
        var p=DisplayObject.HELPER_POINT;
        if (resultRect==null)
            resultRect=new Rectangle();
        var numChildren=this._childs_.length;
        var child;
        if (numChildren==0) {
            resultRect.setTo(0,0,0,0);
        } else if (numChildren==1) {
            child=this._childs_[0];
            child._getBounds_(this,resultRect);
            child._$getMatrixR()._$transformBounds(resultRect);
        } else {
            var minX=Number.MAX_VALUE,maxX= -Number.MAX_VALUE;
            var minY=Number.MAX_VALUE,maxY= -Number.MAX_VALUE;
            for (var i=0;i<numChildren; ++i) {
                child=(this._childs_[i]);
                DisplayObject.HELPER_RECTANGLET.setTo(0,0,0,0);
                var r=DisplayObject.HELPER_RECTANGLET;
                child._getBounds_(this,r);
                child._$getMatrixR()._$transformBounds(r);
                if (minX>r.x)
                    minX=r.x;
                if (maxX<r.right)
                    maxX=r.right;
                if (minY>r.y)
                    minY=r.y;
                if (maxY<r.bottom)
                    maxY=r.bottom;
            }
            resultRect.setTo(minX,minY,maxX-minX,maxY-minY);
        }
        if (resultRect.width<0) {
            resultRect.x-=resultRect.width;
            resultRect.width=Math.abs(resultRect.width);
        }
        if (resultRect.height<0) {
            resultRect.y-=resultRect.height;
            resultRect.height=Math.abs(resultRect.height);
        }
        if (!resultRect) {
            resultRect.width*=this.scaleX;
            resultRect.height*=this.scaleY;
        }
        return resultRect;
    }

    __proto._hitTest_=function(x,y,checkV)
    {
        (checkV===void 0) && (checkV=true);
        if (!this.visible && checkV)
            return null;
        if (!this._checkHitMask(x,y)) {
            return null;
        }
        if (!this._checkHitScrollRect(x,y)) {
            return null;
        }
        if (this._private_._scrollRect_) {
            x+=this._private_._scrollRect_.x;
            y+=this._private_._scrollRect_.y;
        }
        var child;
        var target=null;
        var hitChild=false;
        var numChildren=this._childs_.length;
        var i=0;
        var isOutMask=false;
        var lastMaskDepth=0;
        for (i=0;i<numChildren;i++) {
            child=this._childs_[i];
            if (child._$maskDepth>0) {
                if (lastMaskDepth>0) {
                    isOutMask=false;
                }
                lastMaskDepth=child._$maskDepth;
                this.getTransformMatrix(child,DisplayObject.HELPER_MATRIX);
                MatrixUtil.transformCoords(DisplayObject.HELPER_MATRIX,x,y,DisplayObject.HELPER_POINT);
                target=child._hitTest_(DisplayObject.HELPER_POINT.x,DisplayObject.HELPER_POINT.y,checkV);
                if (!target) {
                    isOutMask=true;
                }
                continue;
            }
            if (lastMaskDepth>0) {
                if (child._$depth>lastMaskDepth) {
                    lastMaskDepth=0;
                    isOutMask=false;
                }
                if (isOutMask) {
                    child["_$$OutMask"]=true;
                } else {
                    child["_$$OutMask"]=false;
                }
                continue;
            }
        }
        for (i=numChildren-1;i>=0;i--) {
            child=this._childs_[i];
            if (child._$maskDepth>0 || child["_$$OutMask"]) {
                continue;
            }
            this.getTransformMatrix(child,DisplayObject.HELPER_MATRIX);
            MatrixUtil.transformCoords(DisplayObject.HELPER_MATRIX,x,y,DisplayObject.HELPER_POINT);
            target=child._hitTest_(DisplayObject.HELPER_POINT.x,DisplayObject.HELPER_POINT.y,checkV);
            if (target) {
                hitChild=true;
                if (!this.mouseChildren) {
                    return this;
                }
                if (target instanceof InteractiveObject) {
                    if ((__as(target,InteractiveObject)).mouseEnabled) {
                        return target;
                    }
                }
            }
        }
        if (hitChild) {
            return this;
        }
        return null;
    }

    __proto._$stageAdd=function()
    {
        this._$dispatchAdd(this);
        _super.prototype._$stageAdd.call(this);
    }

    __proto._$dispatchAdd=function(child)
    {
        var len=child._childs_.length|0;
        var i=0;
        while (i<len) {
            child._childs_[i]._$stageAdd();
            i++;
        }
    }

    __proto._$stageRemove=function()
    {
        _super.prototype._$stageRemove.call(this);
        this._$dispatchRemove(this);
    }

    __proto._$dispatchRemove=function(child)
    {
        var len=child._childs_.length|0;
        var i=0;
        while (i<len) {
            child._childs_[i]._$stageRemove();
            i++;
        }
    }

    __proto._propagateFlagsDown_=function(flags)
    {
        if ((this._type_&flags)==flags)
            return;
        var child;
        var num=this._childs_.length;
        for (var i=0;i<num;i++) {
            child=this._childs_[i];
            child._propagateFlagsDown_(flags);
        }
        this._type_|=flags;
    }

    __proto.updateScaleData=function(index)
    {
        (index===void 0) && (index=0);
        if (this.scale9Data) {
            var c=this._childs_[index];
            (c.scale9Data==null) && (c.scale9Data={});
            c.scale9Data.x1=this.scale9Data.x1-c.x;
            c.scale9Data.y1=this.scale9Data.y1-c.y;
            c.scale9Data.x2=this.scale9Data.x2-c.x;
            c.scale9Data.y2=this.scale9Data.y2-c.y;
            if (this._width_!=c._width_)
                c.width=this.width;
            if (this._height_!=c._height_)
                c.height=this.height;
        }
    }

    __proto._$destroy=function()
    {
        _super.prototype._$destroy.call(this);
        for (var i=0,sz=this._childs_.length;i<sz;i++) {
            this._childs_[i]._$destroy();
        }
        this._childs_.length=0;
    }

    __proto._$addChildByDepth=function(c)
    {
        var depth=c._$depth;
        for (var i=this._childs_.length-1;i>=0;i--) {
            var d=this._childs_[i]._$depth|0;
            if (d) {
                if (depth>d) {
                    this.addChildAt(c,i+1);
                    c._$depth=depth;
                    return;
                }
            }
        }
        this.addChildAt(c,0);
        c._$depth=depth;
    }

    __proto._$paintThis=function(ctx)
    {
        if (this._childs_.length==0)
            return;
        var c,childs=this._childs_;
        var sz=childs.length;
        var lastMaskDepth=0;
        for (var i=0;i<sz;i++) {
            c=childs[i];
            if (!c)
                continue;
            if (c._$maskDepth>0) {
                if (lastMaskDepth>0) {
                    ctx.restore();
                }
                lastMaskDepth=c._$maskDepth;
                ctx.save();
                ctx.beginPath();
                c._$paintMask(ctx);
                ctx.clip();
                continue;
            }
            if (lastMaskDepth>0 && c._$depth>lastMaskDepth) {
                ctx.restore();
                ctx.beginPath();
                lastMaskDepth=0;
            }
            if (!(c._type_&DisplayObject.TYPE_IS_VISIBLE) || !c.alpha)
                continue;
            this.updateScaleData(i);
            c._$miraPaint(ctx);
        }
        if (lastMaskDepth>0) {
            ctx.restore();
            ctx.beginPath();
            lastMaskDepth=0;
        }
    }

    __proto._$paintBlank=function()
    {
        return this._childs_.length==0;
    }

    __proto._$paintMask=function(ctx)
    {
        if (this._childs_.length==0)
            return;
        this._$ctxSave=false;
        var tx=this._left_;
        var ty=this._top_;
        var m=this._$getMatrixR();
        if (m && m._$isTransform()) {
            this._$doCtxSave(ctx);
            ctx.transform(m.a,m.b,m.c,m.d,tx,ty);
        } else if (tx || ty) {
            this._$doCtxSave(ctx);
            ctx.translate(tx,ty);
        }
        var sz=this._childs_.length;
        var i=0;
        var c;
        for (i=0;i<sz;i++) {
            c=this._childs_[i];
            if (c)
                c._$paintMask(ctx);
        }
        if (this._$ctxSave)
            ctx.restore();
    }

    __getset(0,__proto,'height',
        function()
        {
            if (this.scale9Data)
                return this._height_<=0 ? (_super.prototype._$get_height.call(this)) : this._height_;
            else
                return _super.prototype._$get_height.call(this);
        },
        function(h)
        {
            if (this._height_==h)
                return;
            this.scaleY=1.0;
            var oldH=this.getBounds(this).height;
            oldH && (this.scaleY=h/oldH);
            (this._height_!=h) && this._$changeSize(this._width_,h);
        }
    );

    __getset(0,__proto,'mouseChildren',
        function()
        {
            return (this._type_&DisplayObject.TYPE_MOUSE_CHILDREN)!=0;
        },
        function(value)
        {
            if (value)
                this._type_|=DisplayObject.TYPE_MOUSE_CHILDREN;
            else
                this._type_&=~DisplayObject.TYPE_MOUSE_CHILDREN;
        }
    );

    __getset(0,__proto,'numChildren',
        function()
        {
            return this._childs_.length;
        }
    );

    __getset(0,__proto,'tabChildren',
        function()
        {
            return false;
        },
        function(param1)
        {
        }
    );

    __getset(0,__proto,'width',
        function()
        {
            if (this.scale9Data)
                return this._width_<=0 ? (_super.prototype._$get_width.call(this)) : this._width_;
            else
                return _super.prototype._$get_width.call(this);
        },
        function(w)
        {
            if (this._width_==w)
                return;
            this.scaleX=1.0;
            var oldW=this.getBounds(this).width;
            oldW && (this.scaleX=w/oldW);
            (this._width_!=w) && this._$changeSize(w,this._height_);
        }
    );

    DisplayObjectContainer.toString=function(){return "[class DisplayObjectContainer]";};
    Mira.un_proto(DisplayObjectContainer);
    return DisplayObjectContainer;
})(InteractiveObject);

var FrameLabel=(function() {
    function FrameLabel()
    {
        this.frame=0;
    }

    __class(FrameLabel,'flash.display.FrameLabel');

    FrameLabel.toString=function(){return "[class FrameLabel]";};
    return FrameLabel;
})();

var GradientType=(function() {
    function GradientType()
    {
    }

    __class(GradientType,'flash.display.GradientType');

    GradientType.LINEAR="linear";
    GradientType.RADIAL="radial";

    GradientType.toString=function(){return "[class GradientType]";};
    return GradientType;
})();

var GraphicsEndFill=(function() {
    function GraphicsEndFill()
    {
    }

    __class(GraphicsEndFill,'flash.display.GraphicsEndFill');
    var __proto=GraphicsEndFill.prototype;
    Mira.imps(__proto,{"flash.display.IGraphicsFill":true,"flash.display.IGraphicsData":true});

    GraphicsEndFill.toString=function(){return "[class GraphicsEndFill]";};
    return GraphicsEndFill;
})();

var GraphicsGradientFill=(function() {
    function GraphicsGradientFill()
    {
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
    }

    __class(GraphicsGradientFill,'flash.display.GraphicsGradientFill');
    var __proto=GraphicsGradientFill.prototype;
    Mira.imps(__proto,{"flash.display.IGraphicsFill":true,"flash.display.IGraphicsData":true});

    __getset(0,__proto,'interpolationMethod',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'spreadMethod',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'type',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    GraphicsGradientFill.toString=function(){return "[class GraphicsGradientFill]";};
    return GraphicsGradientFill;
})();

var GraphicsPath=(function() {
    function GraphicsPath(commands,data,winding)
    {
        (commands===void 0) && (commands=null);
        (data===void 0) && (data=null);
        (winding===void 0) && (winding="evenOdd");
        trace('-- NATIVE flash.display.GraphicsPath.GraphicsPath');
    }

    __class(GraphicsPath,'flash.display.GraphicsPath');
    var __proto=GraphicsPath.prototype;
    Mira.imps(__proto,{"flash.display.IGraphicsPath":true,"flash.display.IGraphicsData":true});

    __proto.cubicCurveTo=function(controlX1,controlY1,controlX2,controlY2,anchorX,anchorY)
    {
        trace('-- NATIVE flash.display.GraphicsPath.cubicCurveTo');
    }

    __proto.curveTo=function(controlX,controlY,anchorX,anchorY)
    {
        trace('-- NATIVE flash.display.GraphicsPath.curveTo');
    }

    __proto.lineTo=function(x,y)
    {
        trace('-- NATIVE flash.display.GraphicsPath.lineTo');
    }

    __proto.moveTo=function(x,y)
    {
        trace('-- NATIVE flash.display.GraphicsPath.moveTo');
    }

    __proto.wideLineTo=function(x,y)
    {
        trace('-- NATIVE flash.display.GraphicsPath.wideLineTo');
    }

    __proto.wideMoveTo=function(x,y)
    {
        trace('-- NATIVE flash.display.GraphicsPath.wideMoveTo');
    }

    __getset(0,__proto,'winding',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    GraphicsPath.toString=function(){return "[class GraphicsPath]";};
    Mira.un_proto(GraphicsPath);
    return GraphicsPath;
})();

var GraphicsPathCommand=(function() {
    function GraphicsPathCommand()
    {
    }

    __class(GraphicsPathCommand,'flash.display.GraphicsPathCommand');

    GraphicsPathCommand.CUBIC_CURVE_TO=0;
    GraphicsPathCommand.CURVE_TO=3;
    GraphicsPathCommand.LINE_TO=2;
    GraphicsPathCommand.MOVE_TO=1;
    GraphicsPathCommand.NO_OP=0;
    GraphicsPathCommand.WIDE_LINE_TO=5;
    GraphicsPathCommand.WIDE_MOVE_TO=4;

    GraphicsPathCommand.toString=function(){return "[class GraphicsPathCommand]";};
    return GraphicsPathCommand;
})();

var GraphicsSolidFill=(function() {
    function GraphicsSolidFill()
    {
        this.color=0;
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
    }

    __class(GraphicsSolidFill,'flash.display.GraphicsSolidFill');
    var __proto=GraphicsSolidFill.prototype;
    Mira.imps(__proto,{"flash.display.IGraphicsFill":true,"flash.display.IGraphicsData":true});

    GraphicsSolidFill.toString=function(){return "[class GraphicsSolidFill]";};
    return GraphicsSolidFill;
})();

var GraphicsStroke=(function() {
    function GraphicsStroke()
    {
        this.pixelHinting=false;
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
    }

    __class(GraphicsStroke,'flash.display.GraphicsStroke');
    var __proto=GraphicsStroke.prototype;
    Mira.imps(__proto,{"flash.display.IGraphicsStroke":true,"flash.display.IGraphicsData":true});

    __getset(0,__proto,'caps',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'joints',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'scaleMode',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    GraphicsStroke.toString=function(){return "[class GraphicsStroke]";};
    return GraphicsStroke;
})();

var InterpolationMethod=(function() {
    function InterpolationMethod()
    {
    }

    __class(InterpolationMethod,'flash.display.InterpolationMethod');

    InterpolationMethod.LINEAR_RGB="linearRGB";
    InterpolationMethod.RGB="rgb";

    InterpolationMethod.toString=function(){return "[class InterpolationMethod]";};
    return InterpolationMethod;
})();

var JointStyle=(function() {
    function JointStyle()
    {
    }

    __class(JointStyle,'flash.display.JointStyle');

    JointStyle.ROUND="round";
    JointStyle.BEVEL="bevel";
    JointStyle.MITER="miter";

    JointStyle.toString=function(){return "[class JointStyle]";};
    return JointStyle;
})();

var LineScaleMode=(function() {
    function LineScaleMode()
    {
    }

    __class(LineScaleMode,'flash.display.LineScaleMode');

    LineScaleMode.HORIZONTAL="horizontal";
    LineScaleMode.NONE="none";
    LineScaleMode.NORMAL="normal";
    LineScaleMode.VERTICAL="vertical";

    LineScaleMode.toString=function(){return "[class LineScaleMode]";};
    return LineScaleMode;
})();

var Loader=(function(_super) {
    function Loader()
    {
        Loader.__super.call(this);
        this._$contentLoaderInfo=new LoaderInfo(this);
    }

    __class(Loader,'flash.display.Loader',_super);
    var __proto=Loader.prototype;

    __proto.load=function(request,context)
    {
        (context===void 0) && (context=null);
        var fileType=Method.formatUrlType(request.url).toLocaleLowerCase();
        this._$url=Method.formatUrl(request.url);
        if (context) {
            this._$loaderContext=context;
        } else {
            this._$loaderContext=new LoaderContext(false,new ApplicationDomain(ApplicationDomain.currentDomain));
        }
        this._$contentLoaderInfo._$url=this._$url;
        this._$contentLoaderInfo._$applicationDomain=this._$loaderContext.applicationDomain;
        this.contains(this._$content) && this.removeChild(this._$content);
        switch (fileType) {
        case "swf":
        case "swm":
            Stage.USE_SMALL ? this.loadSwf_Small(this._$url,fileType) : this.loadSwf(this._$url);
            break;
        default:
            var isTransparent=true;
            if (fileType=="jpg" || fileType=="jpeg") {
                isTransparent=false;
            }
            this.loadImg(this._$url,false,isTransparent);
            break;
        }
    }

    __proto.loadImg=function(url,isBlob,isTransparent)
    {
        var _$this=this;
        var img=document.createElement("img");
        img.onload=function () {
            var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
            isBlob && URL.revokeObjectURL(url);
            var bitmap=new Bitmap();
            bitmap._$setImage(img,isTransparent);
            _$this._$content=bitmap;
            _$this.addChild(_$this._$content);
            _$this._$contentLoaderInfo._$content=_$this._$content;
            _$this._$contentLoaderInfo._$height=_$this._$content.height|0;
            _$this._$contentLoaderInfo._$width=_$this._$content.width|0;
            _$this.contentLoaderInfo._$bytesLoaded=_$this.contentLoaderInfo._$bytesTotal=uint(_$this._$content.width*_$this._$content.height);
            _$this.contentLoaderInfo.dispatchEvent(new Event(Event.INIT,false,false));
            _$this.contentLoaderInfo.dispatchEvent(new ProgressEvent(ProgressEvent.PROGRESS,false,false,_$this.contentLoaderInfo._$bytesTotal,_$this.contentLoaderInfo._$bytesTotal));
            _$this.contentLoaderInfo.dispatchEvent(new Event(Event.COMPLETE,false,false));
            img.onerror=img.onload=null;
        };
        img.onerror=function () {
            var args=[];for(var $c=0,$d=arguments.length;$c<$d;++$c)args.push(arguments[$c]);
            isBlob && URL.revokeObjectURL(url);
            var io=new IOErrorEvent(IOErrorEvent.IO_ERROR,false,false,"找不到"+img.src);
            _$this.contentLoaderInfo.dispatchEvent(io);
            img.onerror=img.onload=null;
        };
        img.src=url;
    }

    __proto.close=function()
    {
    }

    __proto.unload=function()
    {
        if (this._$content) {
            this.removeChild(this._$content);
            this._$content._removeEvents_();
            this._$content=null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        if (this._$contentLoaderInfo) {
            this._$contentLoaderInfo._removeEvents_();
            this._$contentLoaderInfo._$content=null;
            this._$contentLoaderInfo=null;
        }
    }

    __proto.loadBytes=function(bytes,context)
    {
        (context===void 0) && (context=null);
        var _this=this;
        this.contains(this._$content) && this.removeChild(this._$content);
        var headType=this.getFileType(bytes);
        if (headType=="swf") {
            this._$url=Method.formatUrl(__string((__as(bytes,Object)).url));
            if (context) {
                this._$loaderContext=context;
            } else {
                this._$loaderContext=new LoaderContext(false,new ApplicationDomain(ApplicationDomain.currentDomain));
            }
            this._$contentLoaderInfo._$url=this._$url;
            this._$contentLoaderInfo._$applicationDomain=this._$loaderContext.applicationDomain;
            var tmpBytes=new ByteArray();
            bytes.readBytes(tmpBytes,0,tmpBytes.bytesAvailable);
            Stage.USE_SMALL ? this.loadSwf_Small(this._$url,headType,tmpBytes) : this.loadSwf(this._$url,tmpBytes);
        } else if (headType=="png" || headType=="jpeg" || headType=="gif") {
            var blob=new Blob([bytes._$buffer.subarray(0,bytes.length)],{type: 'image/'+headType});
            var url=URL.createObjectURL(blob);
            var isTransparent=(headType=="jpeg") ? false : true;
            this.loadImg(url,true,isTransparent);
        } else {
            throw new Error("Error #2124: 加载的文件为未知类型。");
        }
    }

    __proto.getFileType=function(fileData)
    {
        if (fileData.bytesAvailable<3) {
            return "unknown";
        }
        var b0=fileData.get(0)|0;
        var b1=fileData.get(1)|0;
        var b2=fileData.get(2)|0;
        var fileType="unknown";
        if (b0==0x89 && b1==0x50) {
            fileType="png";
        } else if (b0==0xff && b1==0xd8) {
            fileType="jpeg";
        } else if (b0==0x47 && b1==0x49) {
            fileType="gif";
        } else if (b1==0x57 && b2==0x53) {
            fileType="swf";
        }
        return fileType;
    }

    __proto.unloadAndStop=function(gc)
    {
        (gc===void 0) && (gc=true);
        this.unload();
    }

    __proto.loadSwf=function(url,tmpBytes)
    {
        (tmpBytes===void 0) && (tmpBytes=null);
        this._$contentLoaderInfo._$onload=__bind(this.onLoadeComplete,this);
        if (tmpBytes) {
            this._$contentLoaderInfo.setUrl(url);
            this._$contentLoaderInfo._$setByteArray(tmpBytes);
        } else
            this._$contentLoaderInfo.src=url;
    }

    __proto.loadSwf_Small=function(url,urltype,tmpBytes)
    {
        (tmpBytes===void 0) && (tmpBytes=null);
        var _$this=this;
        if (!this.imgLoader) {
            this.imgLoader=document.createElement("img");
        } else {
            this._$contentLoaderInfo._$onload=__bind(this.onLoadeComplete,this);
            if (tmpBytes) {
                this._$contentLoaderInfo.setUrl(url.substring(0,url.lastIndexOf("."+urltype)));
                this._$contentLoaderInfo._$setByteArray(tmpBytes);
            } else
                this._$contentLoaderInfo.src=url;
            return;
        }
        var charIndex=url.lastIndexOf("."+urltype);
        var loadUrl=url.substring(0,charIndex)+"/small.png";
        this.imgLoader.onload=function () {
            _$this.imgLoader.onerror=_$this.imgLoader.onload=null;
            _$this._$contentLoaderInfo._$onload=__bind(_$this.onLoadeComplete,_$this);
            if (tmpBytes) {
                _$this._$contentLoaderInfo.setUrl(url.substring(0,url.lastIndexOf("."+urltype)));
                _$this._$contentLoaderInfo._$setByteArray(tmpBytes);
            } else {
                _$this._$contentLoaderInfo.src=url;
            }
            _$this.imgLoader=null;
        };
        this.imgLoader.onerror=function () {
            _$this.imgLoader.onerror=_$this.imgLoader.onload=null;
            _$this.contentLoaderInfo.dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR,false,false,"找不到"+loadUrl));
            _$this.imgLoader=null;
        };
        this.imgLoader.src=loadUrl;
    }

    __proto.onLoadeComplete=function()
    {
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
        this._$content=this.contentLoaderInfo._$content;
        if (this._$content && this._$content!=MainWin.mc) {
            this.addChild(this._$content);
            this._$contentLoaderInfo._$height=this._$content.height|0;
            this._$contentLoaderInfo._$width=this._$content.width|0;
        }
        this.contentLoaderInfo.dispatchEvent(new Event(Event.INIT));
        this.contentLoaderInfo.dispatchEvent(new ProgressEvent(ProgressEvent.PROGRESS,false,false,this.contentLoaderInfo._$bytesTotal,this.contentLoaderInfo._$bytesTotal));
        this.contentLoaderInfo.dispatchEvent(new Event(Event.COMPLETE));
    }

    __getset(0,__proto,'contentLoaderInfo',
        function()
        {
            return this._$contentLoaderInfo;
        }
    );

    __getset(0,__proto,'content',
        function()
        {
            return this._$content;
        }
    );

    Loader.toString=function(){return "[class Loader]";};
    Mira.un_proto(Loader);
    return Loader;
})(DisplayObjectContainer);

var LoaderInfo=(function(_super) {
    function LoaderInfo(ld)
    {
        this._$bytes=null;
        this._$bytesLoaded=0;
        this._$bytesTotal=0;
        this._$sameDomain=false;
        this._$frameRate=0;
        this._$height=0;
        this._$width=0;
        this._swfVersion=0;
        this.__imageUrl__="";
        this._$isFirstSwf=false;
        this.countAsset=0;
        this._$actionScriptVersion=ActionScriptVersion.ACTIONSCRIPT3;
        this._$parameters={};
        this._$resDic=[];
        this._$resDataDic=[];
        this._$id2symbol=[];
        this._$grid9s=[];
        this._$fontDic={};
        LoaderInfo.__super.call(this);
        this._$loader=ld;
    }

    __class(LoaderInfo,'flash.display.LoaderInfo',_super);
    var __proto=LoaderInfo.prototype;

    __proto.onUrlLoaderComplete=function(event)
    {
        var source=event.target.data;
        source.position=0;
        var temp=new ByteArray();
        source.readBytes(temp);
        this._$setByteArray(temp);
        source=null;
        temp=null;
        (__as(event.target,URLLoader)).removeEventListener(Event.COMPLETE,__bind(this.onUrlLoaderComplete,this));
        (__as(event.target,URLLoader)).removeEventListener(IOErrorEvent.IO_ERROR,__bind(this.onUrlError,this));
    }

    __proto.onUrlError=function(event)
    {
        this._$onerror && this._$onerror();
    }

    __proto.setUrl=function(url)
    {
        this._$url=url=Method.formatUrl(url);
        if (this._$url.lastIndexOf(".swf")!= -1) {
            this.__imageUrl__=this._$url.substr(0,this._$url.lastIndexOf(".swf"))+"/image/";
        } else {
            this.__imageUrl__=this._$url+"/image/";
        }
    }

    __proto._getEvents_=function(obj)
    {
        this._eventListener_=obj._eventListener_;
    }

    __proto.readversion=function(data)
    {
        var version=0;
        data.position=3;
        version=data.readUnsignedByte();
        return version;
    }

    __proto._$setByteArray=function(data)
    {
        this._$bytesLoaded=this._$bytesTotal=data.length;
        var p=new SwfParser();
        p.parserFile(data,this,__bind(this.__finish,this));
    }

    __proto.__finish=function()
    {
        if (this.config && this.config['textureList'] && this.config['textureList'].length) {
            this.countAsset=this.config['textureList'].length|0;
            var img=document.createElement("img");
            img.onload=__bind(this.onLoadHandler,this);
            var tUrl=this.__imageUrl__+LoaderInfo.TextureSign+this.countAsset+".png";
            img.src=tUrl;
            TextureManager.getInstance().addTexture(tUrl,img);
        } else {
            var mainTime;
            var clsName=__string(this._$id2symbol[0]);
            if (clsName) {
                var cc=getDefinitionByName(clsName);
                Stage.stage._$loaderInfo=this;
                cc["$pnt"]=Stage.stage;
                mainTime=new cc();
                cc["$pnt"]=null;
            } else {
                mainTime=SwfParser._$$createObjectByCid(0,this,Stage.stage);
            }
            this._$content=mainTime;
            if (this._$isFirstSwf) {
                this.dispatchEvent(new Event("_$firstSwf_loaded"));
                if (this._$onload) {
                    setTimeout(this._$onload,200);
                }
            } else {
                this._$onload && this._$onload();
            }
        }
    }

    __proto.onLoadHandler=function()
    {
        this.countAsset--;
        if (this.countAsset) {
            var img=document.createElement("img");
            img.onload=__bind(this.onLoadHandler,this);
            var tUrl=this.__imageUrl__+LoaderInfo.TextureSign+this.countAsset+".png";
            img.src=tUrl;
            TextureManager.getInstance().addTexture(tUrl,img);
        } else {
            this._$onload && this._$onload();
        }
    }

    __getset(0,__proto,'applicationDomain',
        function()
        {
            return this._$applicationDomain;
        }
    );

    __getset(0,__proto,'bytes',
        function()
        {
            return this._$bytes;
        }
    );

    __getset(0,__proto,'bytesLoaded',
        function()
        {
            return this._$bytesLoaded;
        }
    );

    __getset(0,__proto,'bytesTotal',
        function()
        {
            return this._$bytesTotal;
        }
    );

    __getset(0,__proto,'childAllowsParent',
        function()
        {
            return true;
        }
    );

    __getset(0,__proto,'content',
        function()
        {
            return this._$content;
        }
    );

    __getset(0,__proto,'contentType',
        function()
        {
            return this._$contentType;
        }
    );

    __getset(0,__proto,'frameRate',
        function()
        {
            return this._$frameRate;
        }
    );

    __getset(0,__proto,'height',
        function()
        {
            return this._$height;
        }
    );

    __getset(0,__proto,'isURLInaccessible',
        function()
        {
            trace('-- NATIVE flash.display.LoaderInfo.isURLInaccessible');
        }
    );

    __getset(0,__proto,'loader',
        function()
        {
            return this._$loader;
        }
    );

    __getset(0,__proto,'loaderURL',
        function()
        {
            return this._$url;
        }
    );

    __getset(0,__proto,'parameters',
        function()
        {
            return this._$parameters;
        }
    );

    __getset(0,__proto,'parentAllowsChild',
        function()
        {
            return true;
        }
    );

    __getset(0,__proto,'sameDomain',
        function()
        {
            return this._$sameDomain;
        }
    );

    __getset(0,__proto,'sharedEvents',
        function()
        {
            trace('-- NATIVE flash.display.LoaderInfo.sharedEvents');
        }
    );

    __getset(0,__proto,'swfVersion',
        function()
        {
            return this._swfVersion;
        }
    );

    __getset(0,__proto,'url',
        function()
        {
            return this._$url;
        }
    );

    __getset(0,__proto,'width',
        function()
        {
            return this._$width;
        }
    );

    __getset(0,__proto,'src',
        function()
        {
            return this._$url;
        },
        function(url)
        {
            this._$url=url=Method.formatUrl(url);
            if (this._$url.lastIndexOf(".swf")!= -1) {
                this.__imageUrl__=this._$url.substr(0,this._$url.lastIndexOf(".swf"))+"/image/";
            }
            var _urlLoad=new URLLoader();
            _urlLoad.dataFormat=URLLoaderDataFormat.BINARY;
            _urlLoad.addEventListener(Event.COMPLETE,__bind(this.onUrlLoaderComplete,this));
            _urlLoad.addEventListener(IOErrorEvent.IO_ERROR,__bind(this.onUrlError,this));
            _urlLoad.load(new URLRequest(url));
        }
    );

    __getset(0,__proto,'$actionScriptVersion',
        function()
        {
            return this._$actionScriptVersion;
        }
    );

    LoaderInfo.getLoaderInfoByDefinition=function(object)
    {
        trace('-- NATIVE flash.display.LoaderInfo.getLoaderInfoByDefinition');
    }

    LoaderInfo.TextureSign="a";

    LoaderInfo.toString=function(){return "[class LoaderInfo]";};
    Mira.un_proto(LoaderInfo);
    return LoaderInfo;
})(EventDispatcher);

var Shape=(function(_super) {
    function Shape()
    {
        this._sc9Y_=1;
        this._sc9X_=1;
        this._scaleY_=1;
        this._scaleX_=1;
        Shape.__super.call(this);
    }

    __class(Shape,'flash.display.Shape',_super);
    var __proto=Shape.prototype;

    __proto._getBounds_=function(targetSpace,resultRect)
    {
        (resultRect===void 0) && (resultRect=null);
        if (!targetSpace)
            targetSpace=this;
        if (!resultRect)
            resultRect=DisplayObject.HELPER_RECTANGLET;
        resultRect.setTo(0,0,0,0);
        if (this._$graphics) {
            DisplayObject.HELPER_RECTANGLET_ALT.setTo(this._$graphics._$x,this._$graphics._$y,this._$graphics._$width,this._$graphics._$height);
            resultRect._$union_(DisplayObject.HELPER_RECTANGLET_ALT);
        }
        return resultRect;
    }

    __proto._hitTest_=function(_x,_y,checkV)
    {
        (checkV===void 0) && (checkV=true);
        if (!this.visible && checkV)
            return null;
        if (!this._checkHitMask(_x,_y)) {
            return null;
        }
        if (!this._checkHitScrollRect(_x,_y)) {
            return null;
        }
        if (this._private_._scrollRect_) {
            _x+=this._private_._scrollRect_.x;
            _y+=this._private_._scrollRect_.y;
        }
        var b=this._getBounds_(this,DisplayObject.HELPER_RECTANGLET)._$containsHit(_x,_y);
        if (b && this._$graphics && this._$graphics.isReady()) {
            var lines=this._$graphics._$getOutLines();
            if (lines && lines.length>0) {
                var len=lines.length;
                Shape._$hittestCvs.beginPath();
                for (var i=0;i<len;i++) {
                    Shape._$hittestCvs[lines[i][0]].apply(Shape._$hittestCvs,lines[i][1]);
                }
                b=Shape._$hittestCvs.isPointInPath(_x,_y);
            }
        }
        if (b) {
            return this;
        } else {
            return null;
        }
    }

    __proto._$destroy=function()
    {
        _super.prototype._$destroy.call(this);
        this._content_=null;
        this._scale9Data=null;
    }

    __proto._$paintMask=function(context)
    {
        if (!this._$graphics || !this._$graphics.isReady())
            return;
        this._$ctxSave=false;
        var tx=this._left_;
        var ty=this._top_;
        var m=this._$getMatrixR();
        if (m && m._$isTransform()) {
            this._$doCtxSave(context);
            context.transform(m.a,m.b,m.c,m.d,tx,ty);
        } else if (tx || ty) {
            this._$doCtxSave(context);
            context.translate(tx,ty);
        }
        var lines=this._$graphics._$getOutLines();
        if (lines && lines.length>0) {
            var len=lines.length;
            for (var i=0;i<len;i++) {
                context[lines[i][0]].apply(context,lines[i][1]);
            }
        } else {
            context.rect(this._$graphics._$x,this._$graphics._$y,this._$graphics._$width,this._$graphics._$height);
        }
        if (this._$ctxSave)
            context.restore();
    }

    __proto._$paintThis=function(ctx)
    {
        if (this._$graphics) {
            if (this._$graphics.isReady()) {
                this._$graphics._canvas_.paint(ctx,0,0,this._width_,this._height_);
            }
        }
    }

    __proto._$paintBlank=function()
    {
        return !this._$graphics || !this._$graphics.isReady();
    }

    __getset(0,__proto,'scale9Data',
        function()
        {
            return this._scale9Data;
        },
        function(value)
        {
            this._scale9Data=value;
        }
    );

    __getset(0,__proto,'graphics',
        function()
        {
            if (!this._$graphics)
                this._$graphics=new Graphics(this);
            return this._$graphics;
        }
    );

    __getset(0,__proto,'width',
        function()
        {
            return this.scale9Data ? this._width_ : (_super.prototype._$get_width.call(this));
        },
        function(w)
        {
            if (this._width_==w)
                return;
            if (this.scale9Data) {
                this._scaleX_=1;
                this._width_=w;
                return;
            }
            var oldW=this._width_/this._scaleX_;
            if (this._width_*this._scaleX_==0 && this.graphics)
                oldW=this.graphics._$width;
            oldW && (this._scaleX_=w/oldW);
            _super.prototype._$set_scaleX.call(this,this._scaleX_);
            this._type_|=(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        }
    );

    __getset(0,__proto,'height',
        function()
        {
            return this.scale9Data ? this._height_ : (_super.prototype._$get_height.call(this));
        },
        function(h)
        {
            if (this._height_==h)
                return;
            if (this.scale9Data) {
                this._scaleY_=1;
                this._height_=h;
                this._type_|=(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
                return;
            }
            var oldH;
            if (this._height_*this._scaleY_==0 && this.graphics)
                oldH=this.graphics._$height;
            else
                oldH=this._height_/this._scaleY_;
            oldH && (this._scaleY_=h/oldH);
            _super.prototype._$set_scaleY.call(this,this._scaleY_);
            this._type_|=(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        }
    );

    __getset(0,__proto,'scaleX',
        function()
        {
            return this.scale9Data ? this._sc9X_ : this._scaleX_;
        },
        function(value)
        {
            var oldW;
            if (this._width_*this._scaleX_==0 && this.graphics)
                oldW=this.graphics._$width;
            else
                oldW=this._width_/this._scaleX_;
            this._width_=Math.abs(oldW*value);
            if (this.scale9Data) {
                _super.prototype._$set_scaleX.call(this,this._scaleX_=1);
                this._sc9X_=value;
                return;
            }
            this._scaleX_=value;
            _super.prototype._$set_scaleX.call(this,this._scaleX_);
            this._type_|=(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        }
    );

    __getset(0,__proto,'scaleY',
        function()
        {
            return this.scale9Data ? this._sc9Y_ : this._scaleY_;
        },
        function(value)
        {
            var oldH;
            if (this._height_*this._scaleY_==0 && this.graphics)
                oldH=this.graphics._$height;
            else
                oldH=this._height_/this._scaleY_;
            this._height_=Math.abs(oldH*value);
            if (this.scale9Data) {
                _super.prototype._$set_scaleX.call(this,this._scaleY_=1);
                this._sc9Y_=value;
                return;
            }
            this._scaleY_=value;
            _super.prototype._$set_scaleY.call(this,this._scaleY_);
            this._type_|=(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        }
    );

    __static(Shape,[
        '_$hittestCvs',function(){return this._$hittestCvs=document.createElement('canvas').getContext("2d");}
    ]);

    Shape.toString=function(){return "[class Shape]";};
    Mira.un_proto(Shape);
    return Shape;
})(DisplayObject);

var MorphShape=(function(_super) {
    function MorphShape()
    {
        MorphShape.__super.call(this);
        this.g=new TagMorphGraphics(this);
        this._$graphics=this.g;
    }

    __class(MorphShape,'flash.display.MorphShape',_super);
    var __proto=MorphShape.prototype;

    __proto.setBounds=function(x1,y1,w1,h1,x2,y2,w2,h2)
    {
        if (!this.boundsObj)
            this.boundsObj=new Object();
        this.boundsObj.x1=x1;
        this.boundsObj.y1=y1;
        this.boundsObj.w1=w1;
        this.boundsObj.h1=h1;
        this.boundsObj.x2=x2;
        this.boundsObj.y2=y2;
        this.boundsObj.w2=w2;
        this.boundsObj.h2=h2;
    }

    __proto.rander=function()
    {
        this.g._canvas_.clear();
        this.g.beginShape();
        this.g._$x=this.getMorphedRatio(this.boundsObj.x1,this.boundsObj.x2,this._$ratio);
        this.g._$y=this.getMorphedRatio(this.boundsObj.y1,this.boundsObj.y2,this._$ratio);
        this.g._$width=this.getMorphedRatio(this.boundsObj.w1,this.boundsObj.w2,this._$ratio);
        this.g._$height=this.getMorphedRatio(this.boundsObj.h1,this.boundsObj.h2,this._$ratio);
        var obj=new Object();
        var ratios=[];
        var colors=[];
        var alphas=[];
        var matrix;
        var gradientType;
        var bitmap;
        var repeat=false;
        var i=0;
        for (i=0;i<this._$shapeData.length;i++) {
            obj=this._$shapeData[i];
            switch (obj.cmd) {
            case "endShape":
                this.g.endShape();
                break;
            case "moveTo":
                this.g.moveTo(this.getMorphedRatio(obj.x,obj.ex,this._$ratio),this.getMorphedRatio(obj.y,obj.ey,this._$ratio));
                break;
            case "lineTo":
                this.g.lineTo(this.getMorphedRatio(obj.x,obj.ex,this._$ratio),this.getMorphedRatio(obj.y,obj.ey,this._$ratio));
                break;
            case "curveTo":
                var contorlX=this.getMorphedRatio(obj.controlX,obj.controlEX,this._$ratio);
                var controlY=this.getMorphedRatio(obj.controlY,obj.controlEY,this._$ratio);
                var anchorX=this.getMorphedRatio(obj.anchorX,obj.anchorEX,this._$ratio);
                var anchorY=this.getMorphedRatio(obj.anchorY,obj.anchorEY,this._$ratio);
                this.g.curveTo(contorlX,controlY,anchorX,anchorY);
                break;
            case "beginFill":
                this.g.beginFill(this.getMorphedColor(obj.color|0,obj.ecolor|0,this._$ratio),this.getMorphedRatio(obj.alpha,obj.ealpha,this._$ratio));
                break;
            case "beginGradientFill":
                gradientType=__string(obj.gradientType);
                for (var j=0;j<obj.colors.length;j++) {
                    ratios[j]=this.getMorphedRatio(obj.ratios[j],obj.eratios[j],this._$ratio);
                    colors[j]=this.getMorphedColor(obj.colors[j]|0,obj.ecolors[j]|0,this._$ratio);
                    alphas[j]=this.getMorphedRatio(obj.alphas[j],obj.ealphas[j],this._$ratio);
                }
                matrix=this.getMorphedGradientMatrix(obj.matrix,obj.ematrix,this._$ratio);
                this.g.beginGradientFill(gradientType,colors,alphas,ratios,matrix,__string(obj.spread),InterpolationMethod.RGB,obj.focalPointRatio);
                break;
            case "beginBitmapFill":
                bitmap=obj.bitmap;
                repeat=obj.repeat;
                if (this._$ratio==1) {
                    bitmap=obj.ebitmap;
                    repeat=obj.erepeat;
                }
                matrix=this.getMorphedGradientMatrix(obj.matrix,obj.ematrix,this._$ratio);
                this.g.beginBitmapFill(bitmap.bitmapData,matrix,repeat);
                break;
            case "endFill":
                this.g.endFill();
                break;
            case "lineStyle":
                this.g.lineStyle(this.getMorphedRatio(obj.thickness,obj.ethickness,this._$ratio),this.getMorphedColor(obj.color|0,obj.ecolor|0,this._$ratio),this.getMorphedRatio(obj.alpha,obj.ealpha,this._$ratio),false,LineScaleMode.NORMAL,__string(obj.caps),__string(obj.joint),obj.miterLimit);
                break;
            case "lineGradientStyle":
                gradientType=__string(obj.gradientType);
                if (this._$ratio==1) {
                    gradientType=__string(obj.egradientType);
                }
                for (var k=0;k<obj.colors.length;k++) {
                    ratios[k]=this.getMorphedRatio(obj.ratios[k],obj.eratios[k],this._$ratio);
                    colors[k]=this.getMorphedColor(obj.colors[k]|0,obj.ecolors[k]|0,this._$ratio);
                    alphas[k]=this.getMorphedRatio(obj.alphas[k],obj.ealphas[k],this._$ratio);
                }
                matrix=this.getMorphedGradientMatrix(obj.matrix,obj.ematrix,this._$ratio);
                this.g.lineGradientStyle(gradientType,colors,alphas,ratios,matrix,__string(obj.spread),InterpolationMethod.RGB,obj.focalPointRatio);
                break;
            case "lineBitmapStyle":
                bitmap=obj.bitmap;
                repeat=obj.repeat;
                if (this._$ratio==1) {
                    bitmap=obj.ebitmap;
                    repeat=obj.erepeat;
                }
                matrix=this.getMorphedGradientMatrix(obj.matrix,obj.ematrix,this._$ratio);
                this.g.beginBitmapFill(bitmap.bitmapData,matrix,repeat);
                break;
            case "endLines":
                this.g.endLines();
                break;
            }
        }
    }

    __proto.getMorphedColor=function(startColor,endColor,ratio)
    {
        (ratio===void 0) && (ratio=0);
        return this.colorInterpolate(startColor,endColor,ratio);
    }

    __proto.getMorphedRatio=function(startRatio,endRatio,ratio)
    {
        (ratio===void 0) && (ratio=0);
        if (startRatio==endRatio)
            return startRatio;
        return startRatio+(endRatio-startRatio)*ratio;
    }

    __proto.getMorphedGradientMatrix=function(startGradientMatrix,endGradientMatrix,ratio)
    {
        (ratio===void 0) && (ratio=0);
        return this.interpolate(startGradientMatrix,endGradientMatrix,ratio);
    }

    __proto.getMorphedBitmapMatrix=function(startBitmapMatrix,endBitmapMatrix,ratio)
    {
        (ratio===void 0) && (ratio=0);
        return this.interpolate(startBitmapMatrix,endBitmapMatrix,ratio);
    }

    __proto.colorInterpolate=function(color1,color2,ratio)
    {
        var r1=Number((color1>>16)&0xff)/255;
        var g1=Number((color1>>8)&0xff)/255;
        var b1=Number((color1)&0xff)/255;
        var r2=Number((color2>>16)&0xff)/255;
        var g2=Number((color2>>8)&0xff)/255;
        var b2=Number((color2)&0xff)/255;
        var ri=uint((r1+(r2-r1)*ratio)*255);
        var gi=uint((g1+(g2-g1)*ratio)*255);
        var bi=uint((b1+(b2-b1)*ratio)*255);
        return bi|(gi<<8)|(ri<<16);
    }

    __proto.interpolate=function(matrix1,matrix2,ratio)
    {
        var matrix=new Matrix();
        if (matrix2.a==matrix1.a) {
            matrix.a=matrix2.a;
        } else {
            matrix.a=matrix1.a+(matrix2.a-matrix1.a)*ratio;
        }
        if (matrix2.d==matrix1.d) {
            matrix.d=matrix2.d;
        } else {
            matrix.d=matrix1.d+(matrix2.d-matrix1.d)*ratio;
        }
        if (matrix2.b==matrix1.b) {
            matrix.b=matrix2.b;
        } else {
            matrix.b=matrix1.b+(matrix2.b-matrix1.b)*ratio;
        }
        if (matrix2.c==matrix1.c) {
            matrix.c=matrix2.c;
        } else {
            matrix.c=matrix1.c+(matrix2.c-matrix1.c)*ratio;
        }
        if (matrix2.tx==matrix1.tx) {
            matrix.tx=matrix2.tx;
        } else {
            matrix.tx=matrix1.tx+(matrix2.tx-matrix1.tx)*ratio;
        }
        if (matrix2.ty==matrix1.ty) {
            matrix.ty=matrix2.ty;
        } else {
            matrix.ty=matrix1.ty+(matrix2.ty-matrix1.ty)*ratio;
        }
        return matrix;
    }

    __getset(0,__proto,'ratio',null,
        function(value)
        {
            this._$doDirty(true);
            this._$ratio=value;
            this.rander();
        }
    );

    MorphShape.toString=function(){return "[class MorphShape]";};
    Mira.un_proto(MorphShape);
    return MorphShape;
})(Shape);

var Sprite=(function(_super) {
    function Sprite()
    {
        this._$prelocationX_=0;
        this._$prelocationY_=0;
        this._sc9Y_=1;
        this._sc9X_=1;
        this._$buttonMode=false;
        this._$lockCenter=false;
        this._scriptList_=[];
        this._$data=new MovieClipData();
        this._$evtSounds=[];
        Sprite.__super.call(this);
    }

    __class(Sprite,'flash.display.Sprite',_super);
    var __proto=Sprite.prototype;

    __proto.startDrag=function(lockCenter,bounds)
    {
        (lockCenter===void 0) && (lockCenter=false);
        (bounds===void 0) && (bounds=null);
        this._dragRect_=bounds;
        if (Sprite._startedDrag_) {
            if (Sprite._startedDrag_==this)
                return;
            Sprite._startedDrag_.stopDrag();
        }
        this._$lockCenter=lockCenter;
        this._$getGlobalPointInParent();
        this._$prelocationX_=Sprite._$point0.x;
        this._$prelocationY_=Sprite._$point0.y;
        Stage.stage.addEventListener(MouseEvent.MOUSE_MOVE,__bind(this._$drag__,this));
        Sprite._startedDrag_=this;
        this._$drag__();
    }

    __proto.stopDrag=function()
    {
        if (Sprite._startedDrag_==this) {
            Stage.stage.removeEventListener(MouseEvent.MOUSE_MOVE,__bind(this._$drag__,this));
            this._dragRect_=null;
            Sprite._startedDrag_=null;
        }
    }

    __proto._$drag__=function(e)
    {
        (e===void 0) && (e=null);
        if (!Sprite._startedDrag_)
            return;
        this._$getGlobalPointInParent();
        if (this._$lockCenter) {
            this.x=Sprite._$point0.x;
            this.y=Sprite._$point0.y;
        } else {
            this.x+=Sprite._$point0.x-this._$prelocationX_;
            this.y+=Sprite._$point0.y-this._$prelocationY_;
            this._$prelocationX_=Sprite._$point0.x;
            this._$prelocationY_=Sprite._$point0.y;
        }
        if (this._dragRect_) {
            if (this.x>this._dragRect_.width+this._dragRect_.x)
                this.x=this._dragRect_.width+this._dragRect_.x;
            if (this.y>this._dragRect_.height+this._dragRect_.y)
                this.y=this._dragRect_.height+this._dragRect_.y;
            if (this.x<this._dragRect_.x)
                this.x=this._dragRect_.x;
            if (this.y<this._dragRect_.y)
                this.y=this._dragRect_.y;
        }
    }

    __proto._$getGlobalPointInParent=function()
    {
        if (this.parent) {
            this.parent.globalToLocal(new Point(EventManager._stageX,EventManager._stageY),Sprite._$point0);
        } else {
            Sprite._$point0.x=EventManager._stageX;
            Sprite._$point0.y=EventManager._stageY;
        }
    }

    __proto._$stageAdd=function()
    {
        this.updateScaleData();
        _super.prototype._$stageAdd.call(this);
    }

    __proto.addFrameScript=function()
    {
        var rest=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
        for (var i=0,sz=rest.length;i<sz;i+=2) {
            this._addFrameScript_(rest[i]|0,rest[i+1]);
        }
    }

    __proto._addFrameScript_=function(index,fn)
    {
        this._scriptList_[index+1]=fn;
        fn.call(this);
    }

    __proto._hitTest_=function(x,y,checkV)
    {
        (checkV===void 0) && (checkV=true);
        if (!this.visible && checkV)
            return null;
        var target=_super.prototype._hitTest_.call(this,x,y,checkV);
        if (target)
            return target;
        return this.graphicsHited(x,y);
    }

    __proto.graphicsHited=function(x,y)
    {
        if (this._graphics) {
            if (!this._checkHitMask(x,y)) {
                return null;
            }
            if (!this._checkHitScrollRect(x,y)) {
                return null;
            }
            if (this._private_._scrollRect_) {
                x+=this._private_._scrollRect_.x;
                y+=this._private_._scrollRect_.y;
            }
            DisplayObject.HELPER_RECTANGLET.setTo(this._graphics._$x,this._graphics._$y,this._graphics._$width*this.scaleX,this._graphics._$height*this.scaleY);
            if (DisplayObject.HELPER_RECTANGLET._$containsHit(x,y)) {
                return this;
            }
        }
        return null;
    }

    __proto.hitAreaMouseHandler=function(event)
    {
        this.dispatchEvent(new MouseEvent(event.type));
    }

    __proto._getBounds_=function(targetSpace,resultRect)
    {
        (resultRect===void 0) && (resultRect=null);
        if (!resultRect)
            resultRect=new Rectangle();
        _super.prototype._getBounds_.call(this,targetSpace,resultRect);
        if (this._graphics) {
            DisplayObject.HELPER_RECTANGLET_ALT.setTo(this._graphics._$x,this._graphics._$y,this._graphics._$width,this._graphics._$height);
            if (DisplayObject.HELPER_RECTANGLET_ALT.width || DisplayObject.HELPER_RECTANGLET_ALT.height) {
                if (this.numChildren)
                    resultRect._$union_(DisplayObject.HELPER_RECTANGLET_ALT);
                else
                    resultRect.setTo(DisplayObject.HELPER_RECTANGLET_ALT.x,DisplayObject.HELPER_RECTANGLET_ALT.y,DisplayObject.HELPER_RECTANGLET_ALT.width,DisplayObject.HELPER_RECTANGLET_ALT.height);
            }
        }
        return resultRect;
    }

    __proto._$$initFromTag=function()
    {
        var cmds=this._$data.cmds[0];
        var cmd;
        for (var i=0,sz=cmds.length;i<sz;i++) {
            cmd=cmds[i];
            this[cmd["fun"]].apply(this,cmd);
        }
    }

    __proto._$$addChild=function(depth,cid,insName)
    {
        var target=this._$getObjByDepth(depth);
        var bAdd=false;
        if (!target) {
            target=this._$data.removeDic[depth];
            if (target) {
                this._$data.removeDic[depth]=null;
                if (target._$cid==cid) {
                    if (target instanceof MovieClip)
                        (__as(target,MovieClip))._$bDiscard=false;
                    bAdd=true;
                } else {
                    target=null;
                }
            }
        }
        var diso=SwfParser._$$createObjectByCid(cid,this.loaderInfo,this,target);
        if (!diso)
            return;
        if (diso instanceof BitmapData) {
            diso=new Bitmap(diso);
            diso._$cid=cid;
        }
        if (target && !bAdd) {
            if (!(target instanceof Sprite)) {
                target._$doDirty(true);
            }
            return;
        }
        this._$data.depthDic[depth]=diso;
        diso.name=insName;
        insName && (this[insName]=diso);
        diso._$depth=depth;
        this._$addChildByDepth(diso);
    }

    __proto._$$removeAll=function()
    {
        var obj;
        this._$data.removeDic={};
        for (var depth in this._$data.depthDic) {
            obj=this._$getObjByDepth(depth);
            if (obj) {
                this._$data.depthDic[depth]=null;
                this._$data.removeDic[depth]=obj;
                if (obj instanceof MovieClip) {
                    (__as(obj,MovieClip))._$discard();
                }
                this.removeChild(obj);
            }
        }
        this._$streamSC && this._$streamSC.stop();
        var len=this._$evtSounds.length;
        var s,sc;
        for (var i=0;i<len;i=i+2) {
            s=this._$evtSounds[i];
            sc=this._$evtSounds[i+1];
            sc.stop();
            s.close();
        }
        this._$evtSounds.length=0;
    }

    __proto._$$removeChild=function(depth)
    {
        var cd=this._$data.depthDic[depth];
        if (cd) {
            if (cd instanceof MovieClip) {
                (__as(cd,MovieClip))._$discard();
            }
            if (cd.name && this[cd.name]==cd) {
                this[cd.name]=null;
            }
            this.removeChild(cd);
            this._$data.depthDic[depth]=null;
        }
    }

    __proto._$$setMatix=function(depth,m)
    {
        var obj=this._$getObjByDepth(depth);
        if (obj)
            obj.matrix=m;
    }

    __proto._$$setColor=function(depth,color)
    {
        var obj=this._$getObjByDepth(depth);
        if (obj) {
            obj.transform.colorTransform=color;
            obj.alpha=color._$getAlpha();
        }
    }

    __proto._$$setRatio=function(depth,value)
    {
        var obj=this._$getObjByDepth(depth);
        if (obj)
            obj.ratio=value;
    }

    __proto._$$setMask=function(depth,clipDepth)
    {
        var obj=this._$getObjByDepth(depth);
        if (obj) {
            obj._$maskDepth=clipDepth|0;
        }
    }

    __proto._$$setVisible=function(depth,visible)
    {
        var obj=this._$getObjByDepth(depth);
        if (obj) {
            obj.visible=visible;
        }
    }

    __proto._$$setBgColor=function(color)
    {
        Stage.stage.bgcolor=color;
    }

    __proto._$$blendMode=function(depth,blendMode)
    {
        var obj=this._$getObjByDepth(depth);
        if (obj) {
            obj.blendMode=Sprite._$getBlendModeStr(blendMode);
        }
    }

    __proto._$$setFilter=function(depth,filter)
    {
        var obj=this._$getObjByDepth(depth);
        if (obj) {
            if (filter instanceof Array)
                obj.filters=filter;
            else
                obj.filters=[filter];
        }
    }

    __proto._$$playEvtSnd=function(cid,startSecond,loopCount)
    {
        var s=SwfParser._$$createObjectByCid(cid,this.loaderInfo,this);
        var sc=s.play(0,1);
        this._$evtSounds.push(s,sc);
    }

    __proto._$$playStreamSnd=function(cid)
    {
        (!this._$streamSound) && (this._$streamSound=SwfParser._$$createObjectByCid(cid,this.loaderInfo,this));
        this._$streamSC=this._$streamSound.play(0,1);
    }

    __proto._$$stopStreamSnd=function(cid)
    {
        this._$streamSC && this._$streamSC.stop();
    }

    __proto._$getObjByDepth=function(depth)
    {
        var obj=this._$data.depthDic[depth];
        if (obj) {
            if (obj.parent==this)
                return obj;
        }
        return null;
    }

    __proto._$paintThis=function(ctx)
    {
        if (this._graphics) {
            if (this._graphics.isReady()) {
                this._graphics._canvas_.paint(ctx,0,0,this._width_,this._height_);
            }
        }
        if (this._childs_.length) {
            _super.prototype._$paintThis.call(this,ctx);
        }
    }

    __proto._$paintBlank=function()
    {
        return (!this._graphics || !this._graphics.isReady()) && this._childs_.length==0;
    }

    __proto._$paintMask=function(ctx)
    {
        if (this._childs_.length==0 && !this._graphics)
            return;
        this._$ctxSave=false;
        var tx=this._left_;
        var ty=this._top_;
        var m=this._$getMatrixR();
        if (m && m._$isTransform()) {
            this._$doCtxSave(ctx);
            ctx.transform(m.a,m.b,m.c,m.d,tx,ty);
        } else if (tx || ty) {
            this._$doCtxSave(ctx);
            ctx.translate(tx,ty);
        }
        var sz=this._childs_.length;
        var i=0;
        var c;
        for (i=0;i<sz;i++) {
            c=this._childs_[i];
            if (c)
                c._$paintMask(ctx);
        }
        if (this._graphics) {
            var lines=this._graphics._$getOutLines();
            if (lines && lines.length>0) {
                var len=lines.length;
                for (i=0;i<len;i++) {
                    ctx[lines[i][0]].apply(ctx,lines[i][1]);
                }
            }
        }
        if (this._$ctxSave)
            ctx.restore();
    }

    __getset(0,__proto,'graphics',
        function()
        {
            if (!this._graphics)
                this._graphics=new Graphics(this);
            return this._graphics;
        }
    );

    __getset(0,__proto,'useHandCursor',
        function()
        {
            return (this._type_&DisplayObject.TYPE_USEHANDCURSOR)!=0;
        },
        function(value)
        {
            if (value)
                this._type_|=DisplayObject.TYPE_USEHANDCURSOR;
            else
                this._type_&=~DisplayObject.TYPE_USEHANDCURSOR;
        }
    );

    __getset(0,__proto,'buttonMode',
        function()
        {
            return this._$buttonMode;
        },
        function(value)
        {
            this._$buttonMode=value;
        }
    );

    __getset(0,__proto,'dropTarget',
        function()
        {
            var hp=new Point(EventManager._stageX,EventManager._stageY);
            var a=Stage.stage.getObjectsUnderPoint(hp,null,hp,this);
            if (a.length>0) {
                if (a[0]==MainWin.mc)
                    return null;
                return a[0];
            }
            return null;
        }
    );

    __getset(0,__proto,'width',null,
        function(w)
        {
            if (w<0)
                return;
            if (this.scale9Data) {
                var c=this._childs_[0];
                c && c.scale9Data && (c.width=w);
                this._width_=w;
            } else
                (_super.prototype._$set_width.call(this,w));
        }
    );

    __getset(0,__proto,'height',null,
        function(h)
        {
            if (h<0)
                return;
            if (this.scale9Data) {
                var c=this._childs_[0];
                c && c.scale9Data && (c.height=h);
                this._height_=h;
            } else
                (_super.prototype._$set_height.call(this,h));
        }
    );

    __getset(0,__proto,'scaleX',
        function()
        {
            return this.scale9Data ? this._sc9X_ : (_super.prototype._$get_scaleX.call(this));
        },
        function(value)
        {
            if (this.scale9Data) {
                var c=this._childs_[0];
                c && c.scale9Data && (c.scaleX=value);
                this._sc9X_=value;
                this._width_*=value;
            } else
                (_super.prototype._$set_scaleX.call(this,value));
        }
    );

    __getset(0,__proto,'scaleY',
        function()
        {
            return this.scale9Data ? this._sc9Y_ : (_super.prototype._$get_scaleY.call(this));
        },
        function(value)
        {
            if (this.scale9Data) {
                var c=this._childs_[0];
                c && c.scale9Data && (c.scaleY=value);
                this._sc9Y_=value;
                this._height_*=value;
            } else
                (_super.prototype._$set_scaleY.call(this,value));
        }
    );

    __getset(0,__proto,'hitArea',
        function()
        {
            return this._hitArea;
        },
        function(value)
        {
            if (this._hitArea) {
                this._hitArea.removeEventListener(MouseEvent.CLICK,__bind(this.hitAreaMouseHandler,this));
                this._hitArea.removeEventListener(MouseEvent.DOUBLE_CLICK,__bind(this.hitAreaMouseHandler,this));
                this._hitArea.removeEventListener(MouseEvent.MOUSE_DOWN,__bind(this.hitAreaMouseHandler,this));
                this._hitArea.removeEventListener(MouseEvent.MOUSE_MOVE,__bind(this.hitAreaMouseHandler,this));
                this._hitArea.removeEventListener(MouseEvent.MOUSE_OUT,__bind(this.hitAreaMouseHandler,this));
                this._hitArea.removeEventListener(MouseEvent.MOUSE_OVER,__bind(this.hitAreaMouseHandler,this));
                this._hitArea.removeEventListener(MouseEvent.MOUSE_UP,__bind(this.hitAreaMouseHandler,this));
            }
            this._hitArea=value;
            this.mouseChildren=this.hitArea!=null ? true : false;
            this.mouseEnabled=this._hitArea!=null ? false : true;
            if (this._hitArea) {
                this._hitArea.mouseEnabled=true;
                this._hitArea.addEventListener(MouseEvent.CLICK,__bind(this.hitAreaMouseHandler,this));
                this._hitArea.addEventListener(MouseEvent.DOUBLE_CLICK,__bind(this.hitAreaMouseHandler,this));
                this._hitArea.addEventListener(MouseEvent.MOUSE_DOWN,__bind(this.hitAreaMouseHandler,this));
                this._hitArea.addEventListener(MouseEvent.MOUSE_MOVE,__bind(this.hitAreaMouseHandler,this));
                this._hitArea.addEventListener(MouseEvent.MOUSE_OUT,__bind(this.hitAreaMouseHandler,this));
                this._hitArea.addEventListener(MouseEvent.MOUSE_OVER,__bind(this.hitAreaMouseHandler,this));
                this._hitArea.addEventListener(MouseEvent.MOUSE_UP,__bind(this.hitAreaMouseHandler,this));
            }
        }
    );

    Sprite._$getBlendModeStr=function(v)
    {
        switch (v) {
        case 8:
            return BlendMode.ADD;
        case 4:
            return BlendMode.SCREEN;
        case 14:
            return BlendMode.HARDLIGHT;
        default:
            return BlendMode.NORMAL;
        }
    }

    Sprite._startedDrag_=null;

    __static(Sprite,[
        '_$point0',function(){return this._$point0=new Point(0,0);}
    ]);

    Sprite.toString=function(){return "[class Sprite]";};
    Mira.un_proto(Sprite);
    return Sprite;
})(DisplayObjectContainer);

var MovieClip=(function(_super) {
    function MovieClip()
    {
        this._$enable=true;
        this._$init0=false;
        this._$pend=null;
        this._$inScript=false;
        this._$bDiscard=false;
        this._$isStop=false;
        MovieClip.__super.call(this);
        if (this["_initMC_"]) {
            SwfParser._$$initClassInDefine.apply(null,this["_initMC_"]);
            this["_initMC_"]=null;
        }
        this._$collect();
    }

    __class(MovieClip,'flash.display.MovieClip',_super);
    var __proto=MovieClip.prototype;

    __proto.gotoAndPlay=function(frame,scene)
    {
        (scene===void 0) && (scene=null);
        frame=this._$getFrameId(frame,scene);
        if (this._$data.currentFrame==frame && this._$init0) {
            this._$isStop=false;
            return;
        }
        this._$goto(frame|0);
    }

    __proto.gotoAndStop=function(frame,scene)
    {
        (scene===void 0) && (scene=null);
        frame=this._$getFrameId(frame,scene);
        if (this._$data.currentFrame==frame && this._$init0) {
            this._$isStop=true;
            return;
        }
        this._$goto(frame|0,true);
    }

    __proto._$getFrameId=function(frame,scene)
    {
        var bLabel=false;
        if (typeof frame=='string') {
            var f=this._$data.labs[frame];
            if (f!=null) {
                frame=f+1;
                bLabel=true;
            } else {
                frame=frame|0;
            }
        }
        if (!bLabel && this._$data.scenes.length) {
            var scn;
            if (scene)
                scn=this._$data.scenes[scene];
            else
                scn=this.currentScene;
            if (scn)
                frame+=scn._$startFrame;
        }
        if (frame>this.totalFrames) {
            frame=this.totalFrames;
        } else if (frame<1) {
            frame=1;
        }
        return frame-1;
    }

    __proto.nextFrame=function()
    {
        this._$goto(this._$data.currentFrame+1,true);
    }

    __proto.prevFrame=function()
    {
        this._$goto(this._$data.currentFrame-1,true);
    }

    __proto.play=function()
    {
        this._$isStop=false;
    }

    __proto.stop=function()
    {
        this._$isStop=true;
    }

    __proto.prevScene=function()
    {
        trace('-- NATIVE flash.display.MovieClip.prevScene');
    }

    __proto.nextScene=function()
    {
        trace('-- NATIVE flash.display.MovieClip.nextScene');
    }

    __proto.addFrameTimer=function(fn)
    {
        return Stage.stage._tmctr_.addFrameTimer(fn,this);
    }

    __proto.addFrameScript=function()
    {
        var rest=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
        for (var i=0,sz=rest.length;i<sz;i+=2) {
            this._addFrameScript_(rest[i]|0,rest[i+1]);
        }
    }

    __proto._addFrameScript_=function(index,fn)
    {
        this._scriptList_[index+1]=fn;
    }

    __proto._$stageAdd=function()
    {
        _super.prototype._$stageAdd.call(this);
        if (this._$data.totalFrame>1) {
            this._$updateFun=__bind(this._$onUpdate,this);
            this._private_.onupdate.deleted=false;
        }
    }

    __proto._$stageRemove=function()
    {
        _super.prototype._$stageRemove.call(this);
        if (this._private_.onupdate) {
            this._private_.onupdate.deleted=true;
            this._private_.onupdate=null;
        }
    }

    __proto._$onUpdate=function(tm,tmgo,o)
    {
        if (this._$init0 && this.isPlaying) {
            var frame=this._$data.currentFrame+1;
            if (frame>=this._$data.totalFrame || frame<0)
                frame=0;
            this._$goto(frame);
        }
        return true;
    }

    __proto._$goto=function(frame,stop)
    {
        (stop===void 0) && (stop=false);
        if (frame<0 || frame>=this._$data.totalFrame)
            frame=0;
        if (this._$inScript) {
            this._$pend=[frame,stop];
            return;
        }
        if (!this._$init0) {
            if (this._$data.currentFrame<0) {
                this._$isStop=stop;
                this._$pend=[frame,stop];
                return;
            }
            this._$init0=true;
        }
        this._$doTag(frame);
        this._$isStop=stop;
        this._$doScript(frame);
        var len=this._childs_.length;
        var i=0;
        while (i<len) {
            var child=this._childs_[i];
            if ((child instanceof MovieClip) && !child._$init0) {
                child._$doInit0();
            }
            i++;
        }
        MovieClip._$doFrame0();
    }

    __proto._$doInit0=function()
    {
        this._$init0=true;
        if (this._$pend) {
            var p=this._$pend;
            this._$pend=null;
            this._$goto(p[0]|0,p[1]);
        } else {
            this._$doScript(0);
        }
    }

    __proto._$doScript=function(frame)
    {
        if (this._scriptList_[frame+1]) {
            var inScript=this._$inScript;
            this._$inScript=true;
            this._scriptList_[frame+1].call(this);
            this._$inScript=inScript;
            if (!this._$inScript && this._$pend) {
                var p=this._$pend;
                this._$pend=null;
                this._$goto(p[0]|0,p[1]);
            }
        }
    }

    __proto._$doTag=function(frame)
    {
        if (frame>=this._$data.totalFrame)
            frame=0;
        if (frame==this._$data.currentFrame)
            return;
        var i=this._$data.currentFrame+1;
        if (this._$data.currentFrame>frame)
            i=0;
        if (i<0 || i>=this._$data.totalFrame)
            i=0;
        var from=i;
        for (;i<=frame; ++i) {
            this._$runCmd(i);
        }
        if (from==0) {
            this._$data.removeDic={};
        }
    }

    __proto._$runCmd=function(frame)
    {
        this._$data.currentFrame=frame;
        var cmds=this._$data.cmds[frame];
        if (!cmds)
            return;
        var cmd;
        for (var i=0,sz=cmds.length;i<sz;i++) {
            cmd=cmds[i];
            this[cmd["fun"]].apply(this,cmd);
        }
    }

    __proto._$discard=function()
    {
        this._$bDiscard=true;
    }

    __proto._$collect=function()
    {
        MovieClip._$newMC.push(this);
    }

    __getset(0,__proto,'currentFrame',
        function()
        {
            var value=this._$data.currentFrame+1;
            if (value>this.totalFrames)
                value=this.totalFrames;
            return value<1 ? 1 : value;
        }
    );

    __getset(0,__proto,'enabled',
        function()
        {
            return this._$enable;
        },
        function(value)
        {
            this._$enable=value;
        }
    );

    __getset(0,__proto,'isPlaying',
        function()
        {
            return !this._$isStop;
        }
    );

    __getset(0,__proto,'totalFrames',
        function()
        {
            return this._$data ? this._$data.totalFrame : 1;
        }
    );

    __getset(0,__proto,'framesLoaded',
        function()
        {
            trace('-- NATIVE flash.display.MovieClip.framesLoaded');
        }
    );

    __getset(0,__proto,'currentFrameLabel',
        function()
        {
            var index=this.currentFrame-1;
            var label;
            var frame=0;
            for (var key in this._$data.labs) {
                label=key;
                frame=int(this._$data.labs[key]);
                if (index==frame) {
                    return label;
                }
            }
            return null;
        }
    );

    __getset(0,__proto,'currentLabel',
        function()
        {
            var index=this.currentFrame-1;
            var label;
            var frame=0;
            var arr={};
            for (var key in this._$data.labs) {
                label=key;
                frame=int(this._$data.labs[key]);
                if (index==frame) {
                    return label;
                }
                arr[frame]=label;
            }
            label=null;
            while (label==null) {
                label=__string(arr[index]);
                index--;
                if (index== -1)
                    break;
            }
            return label;
        }
    );

    __getset(0,__proto,'currentLabels',
        function()
        {
            var labs=this._$data.labs,arr=[];
            for (var key in labs) {
                var fl=new FrameLabel();
                fl.name=key;
                fl.frame=int(labs[key])+1;
                arr.push(fl);
            }
            return arr;
        }
    );

    __getset(0,__proto,'currentScene',
        function()
        {
            var frame=this._$data.currentFrame;
            var num=this._$data.scenes.length;
            if (num) {
                for (var i=0;i<num;i++) {
                    var scene=this._$data.scenes[i];
                    if (frame>=scene._$startFrame && frame<scene._$startFrame+scene._$numFrames)
                        return scene;
                }
            }
            return null;
        }
    );

    __getset(0,__proto,'scenes',
        function()
        {
            trace('-- NATIVE flash.display.MovieClip.scenes');
        }
    );

    __getset(0,__proto,'trackAsMenu',
        function()
        {
            trace('-- NATIVE flash.display.MovieClip.trackAsMenu');
        },
        function(value)
        {
            trace('-- NATIVE flash.display.MovieClip.trackAsMenu');
        }
    );

    __getset(0,__proto,'_$updateFun',null,
        function(fn)
        {
            if (this._private_.onupdate)
                this._private_.onupdate.deleted=true;
            this._private_.onupdate=this.addFrameTimer(fn);
        }
    );

    MovieClip._$doFrame0=function()
    {
        if (MovieClip._$newMC.length) {
            var mcs=MovieClip._$newMC;
            MovieClip._$newMC=[];
            var len=mcs.length;
            for (var i=0;i<len;i++) {
                var mc=mcs[i];
                if (mc._$init0 || mc._$bDiscard) {
                    continue;
                }
                mc._$doInit0();
                if (MovieClip._$newMC.length) {
                    MovieClip._$doFrame0();
                }
            }
        }
    }

    __static(MovieClip,[
        '_$newMC',function(){return this._$newMC=[];}
    ]);

    MovieClip.toString=function(){return "[class MovieClip]";};
    Mira.un_proto(MovieClip);
    return MovieClip;
})(Sprite);

var NativeMenu=(function(_super) {
    function NativeMenu()
    {
        NativeMenu.__super.call(this);
    }

    __class(NativeMenu,'flash.display.NativeMenu',_super);

    NativeMenu.toString=function(){return "[class NativeMenu]";};
    return NativeMenu;
})(EventDispatcher);

var NativeMenuItem=(function(_super) {
    function NativeMenuItem()
    {
        NativeMenuItem.__super.call(this);
    }

    __class(NativeMenuItem,'flash.display.NativeMenuItem',_super);
    var __proto=NativeMenuItem.prototype;

    __getset(0,__proto,'enabled',
        function()
        {
            return false;
        },
        function(isSeparator)
        {
        }
    );

    NativeMenuItem.toString=function(){return "[class NativeMenuItem]";};
    return NativeMenuItem;
})(EventDispatcher);

var PixelSnapping=(function() {
    function PixelSnapping()
    {
    }

    __class(PixelSnapping,'flash.display.PixelSnapping');

    PixelSnapping.ALWAYS="always";
    PixelSnapping.AUTO="auto";
    PixelSnapping.NEVER="never";

    PixelSnapping.toString=function(){return "[class PixelSnapping]";};
    return PixelSnapping;
})();

var Scene=(function() {
    function Scene()
    {
        this._$numFrames=0;
        this._$startFrame=0;
    }

    __class(Scene,'flash.display.Scene');
    var __proto=Scene.prototype;

    __getset(0,__proto,'labels',
        function()
        {
            trace('-- NATIVE flash.display.Scene.labels');
        }
    );

    __getset(0,__proto,'name',
        function()
        {
            return this._$name;
        }
    );

    __getset(0,__proto,'numFrames',
        function()
        {
            return this._$numFrames;
        }
    );

    Scene.toString=function(){return "[class Scene]";};
    return Scene;
})();

var Shader=(function() {
    function Shader(code)
    {
        (code===void 0) && (code=null);
        if (code) {
            this.byteCode=code;
        }
    }

    __class(Shader,'flash.display.Shader');
    var __proto=Shader.prototype;

    __getset(0,__proto,'byteCode',null,
        function(code)
        {
            this.data=new ShaderData(code);
        }
    );

    __getset(0,__proto,'data',
        function()
        {
            return this._data;
        },
        function(value)
        {
            this._data=value;
        }
    );

    __getset(0,__proto,'precisionHint',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    Shader.toString=function(){return "[class Shader]";};
    return Shader;
})();

var ShaderData=(function() {
    function ShaderData(byteCode)
    {
    }

    __class(ShaderData,'flash.display.ShaderData');

    ShaderData.toString=function(){return "[class ShaderData]";};
    return ShaderData;
})();

var ShaderJob=(function(_super) {
    function ShaderJob()
    {
        ShaderJob.__super.call(this);
        var a=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)a.push(arguments[$a]);
    }

    __class(ShaderJob,'flash.display.ShaderJob',_super);
    var __proto=ShaderJob.prototype;

    __proto.start=function(waitForCompletion)
    {
        (waitForCompletion===void 0) && (waitForCompletion=false);
    }

    ShaderJob.toString=function(){return "[class ShaderJob]";};
    Mira.un_proto(ShaderJob);
    return ShaderJob;
})(Sprite);

var SimpleButton=(function(_super) {
    function SimpleButton(upState,overState,downState,hitTestState)
    {
        this._enabled=true;
        (upState===void 0) && (upState=null);
        (overState===void 0) && (overState=null);
        (downState===void 0) && (downState=null);
        (hitTestState===void 0) && (hitTestState=null);
        SimpleButton.__super.call(this);
        upState && (this.upState=upState);
        overState && (this.overState=overState);
        downState && (this.downState=downState);
        hitTestState && (this.hitTestState=hitTestState);
        this._$switchState(upState);
        this.addEventListener(MouseEvent.MOUSE_OUT,__bind(this._onmouseOut_,this));
        this.addEventListener(MouseEvent.MOUSE_OVER,__bind(this._onmouseOver_,this));
        this.addEventListener(MouseEvent.MOUSE_DOWN,__bind(this._onmouseDown_,this));
        this.addEventListener(MouseEvent.MOUSE_UP,__bind(this._onmouseUp_,this));
    }

    __class(SimpleButton,'flash.display.SimpleButton',_super);
    var __proto=SimpleButton.prototype;

    __proto._$getCurrObj=function()
    {
        return this.currDisplay;
    }

    __proto._$switchState=function(state)
    {
        if (this._enabled) {
            if (this.currDisplay!=state) {
                if (this.currDisplay && this.currDisplay.parent)
                    this.removeChild(this.currDisplay);
                this.currDisplay=state;
                if (this.currDisplay) {
                    this.addChild(this.currDisplay);
                    if (state instanceof DisplayObjectContainer) {
                        var arr=state["_childs_"];
                        var n=arr.length;
                        var c,mc;
                        for (var i=0;i<n;i++) {
                            c=arr[i];
                            if (c instanceof MovieClip) {
                                mc=__as(c,MovieClip);
                                (mc._$data.totalFrame>1) && mc.gotoAndPlay(1);
                            }
                        }
                    }
                }
            }
        }
    }

    __proto._onmouseOut_=function(e)
    {
        this._$switchState(this.upState);
    }

    __proto._onmouseUp_=function(e)
    {
        this._$switchState(this.upState);
    }

    __proto._onmouseDown_=function(e)
    {
        this._$switchState(this.downState);
    }

    __proto._onmouseOver_=function(e)
    {
        this._$switchState(this.overState);
    }

    __proto._hitTest_=function(_x,_y,checkV)
    {
        (checkV===void 0) && (checkV=true);
        if ((!this.visible && checkV) || !this.hitTestState)
            return null;
        var m=this.hitTestState._$getMatrixR().clone();
        m.invert();
        if (this.hitTestState._hitTest_(m.a*_x+m.c*_y+m.tx,m.d*_y+m.b*_x+m.ty,checkV)) {
            return this;
        }
        return null;
    }

    __proto._getBounds_=function(targetSpace,resultRect)
    {
        (resultRect===void 0) && (resultRect=null);
        var d=this.currDisplay || this.hitTestState;
        if (d) {
            resultRect=d._getBounds_(targetSpace,resultRect);
            d._$getMatrixR()._$transformBounds(resultRect);
        }
        return resultRect;
    }

    __getset(0,__proto,'useHandCursor',
        function()
        {
            trace('-- NATIVE flash.display.SimpleButton.useHandCursor');
        },
        function(param1)
        {
            trace('-- NATIVE flash.display.SimpleButton.useHandCursor');
        }
    );

    __getset(0,__proto,'trackAsMenu',
        function()
        {
            trace('-- NATIVE flash.display.SimpleButton.trackAsMenu');
        },
        function(param1)
        {
            trace('-- NATIVE flash.display.SimpleButton.trackAsMenu');
        }
    );

    __getset(0,__proto,'enabled',
        function()
        {
            return this._enabled;
        },
        function(value)
        {
            if (!value) {
                this._$switchState(this.upState);
            }
            this._enabled=value;
        }
    );

    __getset(0,__proto,'width',
        function()
        {
            return this.currDisplay.width;
        }
    );

    __getset(0,__proto,'height',
        function()
        {
            return this.currDisplay.height;
        }
    );

    SimpleButton.toString=function(){return "[class SimpleButton]";};
    Mira.un_proto(SimpleButton);
    return SimpleButton;
})(DisplayObjectContainer);

var SpreadMethod=(function() {
    function SpreadMethod()
    {
    }

    __class(SpreadMethod,'flash.display.SpreadMethod');

    SpreadMethod.PAD="pad";
    SpreadMethod.REFLECT="reflect";
    SpreadMethod.REPEAT="repeat";

    SpreadMethod.toString=function(){return "[class SpreadMethod]";};
    return SpreadMethod;
})();

var Stage=(function(_super) {
    function Stage()
    {
        this.contentsScaleFactor=1;
        this._useActivateEventCount_=0;
        this._infoFlag=true;
        this._algin="";
        this._isInvalidate=false;
        this._bgc_=0xffffff;
        this._bgc2_="#ffffff";
        this.autoOrients=false;
        this.visibilityChange="hidden";
        this.visibilityState="visibilityState";
        this.stage3Ds=[new Stage3D(0),new Stage3D(1),new Stage3D(2),new Stage3D(3)];
        this._scaleMode_=StageScaleMode.SHOW_ALL;
        Stage.__super.call(this);
        this._width_=EventDispatcher.window_as.innerWidth;
        this._height_=EventDispatcher.window_as.innerHeight;
        this._tmctr_=TimerCtrl.__DEFAULT__;
    }

    __class(Stage,'flash.display.Stage',_super);
    var __proto=Stage.prototype;

    __proto.setOrientationEx=function(type)
    {
        MainWin.doc2.setOrientationEx(type);
    }

    __proto.setSize=function(w,h)
    {
        MainWin.doc2.size(w,h);
    }

    __proto.invalidate=function()
    {
        this._isInvalidate=true;
    }

    __proto.size=function(width,height)
    {
        MainWin.doc2.size(width|0,height|0);
    }

    __proto._hitTest_=function(x,y,checkV)
    {
        (checkV===void 0) && (checkV=true);
        var target=_super.prototype._hitTest_.call(this,x,y,checkV);
        if (!target)
            target=this;
        return target;
    }

    __proto.sendRender=function()
    {
        if (this._isInvalidate) {
            this._isInvalidate=false;
            this._$dispatchEvent(Event.RENDER);
        }
    }

    __proto.addEventListener=function(type,listener,useCapture,priority,useWeakReference)
    {
        (useCapture===void 0) && (useCapture=false);
        (priority===void 0) && (priority=0);
        (useWeakReference===void 0) && (useWeakReference=false);
        if (type==Event.ACTIVATE || type==Event.DEACTIVATE) {
            if (this.hasEventListener(type))
                return;
            if (this._useActivateEventCount_==0) {
                this.addVisibilityChangeEvent();
            }
            this._useActivateEventCount_++;
        }
        _super.prototype.addEventListener.call(this,type,listener,useCapture,priority,useWeakReference);
    }

    __proto.removeEventListener=function(type,listener,useCapture)
    {
        (useCapture===void 0) && (useCapture=false);
        if (type==Event.ACTIVATE || type==Event.DEACTIVATE) {
            if (!this.hasEventListener(type))
                return;
            this._useActivateEventCount_--;
            if (this._useActivateEventCount_==0) {
                this.removeVisibilityChangeEvent();
            }
        }
        _super.prototype.removeEventListener.call(this,type,listener,useCapture);
    }

    __proto.visibilitySysEvtHandler=function(e)
    {
        var evt=new Event(document[this.visibilityState]==="hidden" ? Event.DEACTIVATE : Event.ACTIVATE,e.bubbles,e.cancelable);
        this.dispatchEvent(evt);
    }

    __proto.addVisibilityChangeEvent=function()
    {
        if ("hidden" in document) {
            this.visibilityChange="visibilitychange";
            this.visibilityState="visibilityState";
        } else if ("mozHidden" in document) {
            this.visibilityChange="mozvisibilitychange";
            this.visibilityState="mozVisibilityState";
        } else if ("msHidden" in document) {
            this.visibilityChange="msvisibilitychange";
            this.visibilityState="msVisibilityState";
        } else if ("webkitHidden" in document) {
            this.visibilityChange="webkitvisibilitychange";
            this.visibilityState="webkitVisibilityState";
        }
        document.addEventListener(this.visibilityChange,__bind(this.visibilitySysEvtHandler,this));
    }

    __proto.removeVisibilityChangeEvent=function()
    {
        document.removeEventListener(this.visibilityChange,__bind(this.visibilitySysEvtHandler,this));
    }

    __proto.setAspectRatio=function(newAspectRatio)
    {
        switch (newAspectRatio) {
        case StageAspectRatio.PORTRAIT:
            MainWin.setAutoOrients(false);
            EventDispatcher.doc2.setOrientationEx(0);
            this.dispatchEvent(new StageOrientationEvent(StageOrientationEvent.ORIENTATION_CHANGE));
            break;
        case StageAspectRatio.LANDSCAPE:
            MainWin.setAutoOrients(false);
            EventDispatcher.doc2.setOrientationEx(1);
            this.dispatchEvent(new StageOrientationEvent(StageOrientationEvent.ORIENTATION_CHANGE));
            break;
        case StageAspectRatio.ANY:
            MainWin.setAutoOrients(true);
            break;
        }
    }

    __getset(0,__proto,'showDefaultContextMenu',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    __getset(0,__proto,'allowsFullScreen',
        function()
        {
            return false;
        }
    );

    __getset(0,__proto,'allowsFullScreenInteractive',
        function()
        {
            return false;
        }
    );

    __getset(0,__proto,'stageWidth',
        function()
        {
            return (this._scaleMode_==StageScaleMode.NO_SCALE ? EventDispatcher.window_as.innerWidth : this.width)|0;
        }
    );

    __getset(0,__proto,'stageHeight',
        function()
        {
            return (this._scaleMode_==StageScaleMode.NO_SCALE ? EventDispatcher.window_as.innerHeight : this.height)|0;
        }
    );

    __getset(0,__proto,'scaleMode',
        function()
        {
            return this._scaleMode_;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'width',
        function()
        {
            return this._width_;
        },
        function(w)
        {
            this._width_=w;
        }
    );

    __getset(0,__proto,'height',
        function()
        {
            return this._height_;
        },
        function(h)
        {
            this._height_=h;
        }
    );

    __getset(0,__proto,'focus',
        function()
        {
            return this.currentFocus;
        },
        function(val)
        {
            if (val instanceof TextField)
                val["onTextFocus"](null);
            this.currentFocus=val;
        }
    );

    __getset(0,__proto,'displayState',
        function()
        {
            return "";
        },
        function(val)
        {
        }
    );

    __getset(0,__proto,'color',
        function()
        {
            return this._bgc_;
        },
        function(value)
        {
            this.bgcolor=value;
        }
    );

    __getset(0,__proto,'bgcolor',null,
        function(value)
        {
            if (typeof value=='string') {
                var v=value.replace("#","")|0;
                v=parseInt(v+"",16);
                this._bgc_=v;
                if (isNaN(this._bgc_))
                    this._bgc_=0xffffff;
                this._bgc2_=__string(value);
            } else {
                this._bgc_=value|0;
                if (isNaN(this._bgc_))
                    this._bgc_=0xffffff;
                this._bgc2_=StringMethod.getColorString(this._bgc_);
            }
            window.document.body.style.backgroundColor=this._bgc2_;
        }
    );

    __getset(0,__proto,'autoScaleDifference',null,
        function(value)
        {
            MainWin.doc2.adapter.autoScaleDifference=value;
        }
    );

    __getset(0,__proto,'frameRate',
        function()
        {
            return Browser.frameRate;
        },
        function(value)
        {
            Browser.frameRate=value;
        }
    );

    __getset(0,__proto,'align',
        function()
        {
            return this._algin;
        },
        function(value)
        {
            var isChange=value!=this._algin;
            this._algin=value;
            if (isChange && MainWin.window_as) {
                MainWin.window_as._$dispatchEvent(Event.RESIZE);
            }
        }
    );

    __getset(0,__proto,'stageFocusRect',
        function()
        {
            return false;
        },
        function(param1)
        {
        }
    );

    __getset(0,__proto,'quality',
        function()
        {
            return "medium";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'fullScreenWidth',
        function()
        {
            return EventDispatcher.window_as.fullScreenWidth;
        }
    );

    __getset(0,__proto,'fullScreenHeight',
        function()
        {
            return EventDispatcher.window_as.fullScreenHeight;
        }
    );

    __getset(1,Stage,'stage',
        function()
        {
            return Stage._stage ? Stage._stage : (Stage._stage=new Stage());
        }
    );

    __getset(1,Stage,'supportsOrientationChange',
        function()
        {
            return true;
        }
    );

    Stage.USE_SMALL=true;
    Stage._stage=null;

    Stage.toString=function(){return "[class Stage]";};
    Mira.un_proto(Stage);
    return Stage;
})(DisplayObjectContainer);

var Stage3D=(function(_super) {
    function Stage3D(layer)
    {
        this._$layer=0;
        this._$x=0;
        this._$y=0;
        this._$visible=true;
        this._$disposed=false;
        Stage3D.__super.call(this);
        this._$layer=layer;
    }

    __class(Stage3D,'flash.display.Stage3D',_super);
    var __proto=Stage3D.prototype;

    __proto.requestContext3D=function(context3DRenderMode,profile)
    {
        (context3DRenderMode===void 0) && (context3DRenderMode="auto");
        (profile===void 0) && (profile="baseline");
        if (!this._$canvas) {
            this._$canvas=document.createElement("canvas");
            var gl;
            try {
                var attr={premultipliedAlpha: false,alpha: false,stencil: true};
                gl=this._$canvas.getContext("experimental-webgl",attr);
                if (!gl)
                    gl=this._$canvas.getContext("webgl",attr);
            } catch (e) {
                gl=null;
            }
            if (!gl) {
                this._$canvas=null;
                alert("WebGL is not available.");
                return;
            }
            this._$canvas.style.position='absolute';
            this._$canvas.style.zIndex=(this._$layer-4)*10;
            this._$context=new Context3D(gl,this);
        }
        this._$disposed=false;
        document.body.appendChild(this._$canvas);
        this.x=this._$x;
        this.y=this._$y;
        this._$setSize(Stage.stage.stageWidth,Stage.stage.stageHeight);
        this._$context._$reset(this._$canvas.width,this._$canvas.height);
        var event=new Event(Event.CONTEXT3D_CREATE);
        event._$target=this;
        EventManager.queueEvent(event);
    }

    __proto._$setSize=function(width,height)
    {
        if (this._$canvas) {
            this._$canvas.width=width;
            this._$canvas.height=height;
        }
    }

    __proto._$dispose=function()
    {
        if (this._$canvas && !this._$disposed) {
            document.body.removeChild(this._$canvas);
        }
        this._$disposed=true;
    }

    __getset(0,__proto,'context3D',
        function()
        {
            if (!this._$disposed)
                return this._$context;
            return null;
        }
    );

    __getset(0,__proto,'visible',
        function()
        {
            return this._$visible;
        },
        function(value)
        {
            this._$visible=value;
            if (this._$canvas)
                this._$canvas.style.visibility=value ? 'visible' : 'hidden';
        }
    );

    __getset(0,__proto,'x',
        function()
        {
            return this._$x;
        },
        function(value)
        {
            if (this._$canvas)
                this._$canvas.style.left=value;
            this._$x=value;
        }
    );

    __getset(0,__proto,'y',
        function()
        {
            return this._$y;
        },
        function(value)
        {
            if (this._$canvas)
                this._$canvas.style.top=value;
            this._$y=value;
        }
    );

    Stage3D.toString=function(){return "[class Stage3D]";};
    Mira.un_proto(Stage3D);
    return Stage3D;
})(EventDispatcher);

var StageAlign=(function() {
    function StageAlign()
    {
    }

    __class(StageAlign,'flash.display.StageAlign');

    StageAlign.isTop=function(align)
    {
        return (StageAlign.ALIGN_SIGN[align]&StageAlign.NUM_T)==StageAlign.NUM_T;
    }

    StageAlign.isBottom=function(align)
    {
        return (StageAlign.ALIGN_SIGN[align]&StageAlign.NUM_B)==StageAlign.NUM_B;
    }

    StageAlign.isLeft=function(align)
    {
        return (StageAlign.ALIGN_SIGN[align]&StageAlign.NUM_L)==StageAlign.NUM_L;
    }

    StageAlign.isRight=function(align)
    {
        return (StageAlign.ALIGN_SIGN[align]&StageAlign.NUM_R)==StageAlign.NUM_R;
    }

    StageAlign.NUM_T=1;
    StageAlign.NUM_L=2;
    StageAlign.NUM_R=4;
    StageAlign.NUM_B=8;
    StageAlign.BOTTOM="B";
    StageAlign.BOTTOM_LEFT="BL";
    StageAlign.BOTTOM_RIGHT="BR";
    StageAlign.LEFT="L";
    StageAlign.RIGHT="R";
    StageAlign.TOP="T";
    StageAlign.TOP_LEFT="TL";
    StageAlign.TOP_RIGHT="TR";

    __static(StageAlign,[
        'ALIGN_SIGN',function(){return this.ALIGN_SIGN={"T": 1,"L": 2,"R": 4,"B": 8,"BL": 10,"BR": 12,"TL": 3,"TR": 5};}
    ]);

    StageAlign.toString=function(){return "[class StageAlign]";};
    return StageAlign;
})();

var StageAspectRatio=(function() {
    function StageAspectRatio()
    {
    }

    __class(StageAspectRatio,'flash.display.StageAspectRatio');

    StageAspectRatio.ANY="any";
    StageAspectRatio.LANDSCAPE="landscape";
    StageAspectRatio.PORTRAIT="portrait";

    StageAspectRatio.toString=function(){return "[class StageAspectRatio]";};
    return StageAspectRatio;
})();

var StageDisplayState=(function() {
    function StageDisplayState()
    {
    }

    __class(StageDisplayState,'flash.display.StageDisplayState');

    StageDisplayState.FULL_SCREEN="fullScreen";
    StageDisplayState.FULL_SCREEN_INTERACTIVE="fullScreenInteractive";
    StageDisplayState.NORMAL="normal";

    StageDisplayState.toString=function(){return "[class StageDisplayState]";};
    return StageDisplayState;
})();

var StageOrientation=(function() {
    function StageOrientation()
    {
    }

    __class(StageOrientation,'flash.display.StageOrientation');

    StageOrientation.DEFAULT="default";
    StageOrientation.ROTATED_LEFT="rotatedLeft";
    StageOrientation.ROTATED_RIGHT="rotatedRight";
    StageOrientation.UNKNOWN="unknown";
    StageOrientation.UPSIDE_DOWN="upsideDown";

    StageOrientation.toString=function(){return "[class StageOrientation]";};
    return StageOrientation;
})();

var StageQuality=(function() {
    function StageQuality()
    {
    }

    __class(StageQuality,'flash.display.StageQuality');

    StageQuality.LOW="low";
    StageQuality.MEDIUM="medium";
    StageQuality.HIGH="high";
    StageQuality.BEST="best";

    StageQuality.toString=function(){return "[class StageQuality]";};
    return StageQuality;
})();

var StageScaleMode=(function() {
    function StageScaleMode()
    {
    }

    __class(StageScaleMode,'flash.display.StageScaleMode');

    StageScaleMode.SHOW_ALL="showAll";
    StageScaleMode.EXACT_FIT="exactFit";
    StageScaleMode.NO_BORDER="noBorder";
    StageScaleMode.NO_SCALE="noScale";

    StageScaleMode.toString=function(){return "[class StageScaleMode]";};
    return StageScaleMode;
})();

var SWFVersion=(function() {
    function SWFVersion()
    {
    }

    __class(SWFVersion,'flash.display.SWFVersion');

    SWFVersion.FLASH1=1;
    SWFVersion.FLASH10=10;
    SWFVersion.FLASH11=11;
    SWFVersion.FLASH12=0;
    SWFVersion.FLASH2=2;
    SWFVersion.FLASH3=3;
    SWFVersion.FLASH4=4;
    SWFVersion.FLASH5=5;
    SWFVersion.FLASH6=6;
    SWFVersion.FLASH7=7;
    SWFVersion.FLASH8=8;
    SWFVersion.FLASH9=9;

    SWFVersion.toString=function(){return "[class SWFVersion]";};
    return SWFVersion;
})();

var Context3D=(function(_super) {
    function Context3D(context,stage3d)
    {
        this.enableErrorChecking=false;
        this.maxBackBufferWidth=0;
        this.maxBackBufferHeight=0;
        this._$backWidth=0;
        this._$backHeight=0;
        this._$inScreen=true;
        this._$stencilRef=0;
        this._$stencilReadMask=0xff;
        this._$stencilFunc=0;
        this._$depthMask=false;
        this._$vcLen=0;
        this._$prog=false;
        this._$screenViewport=new Rectangle(0,0,0,0);
        this._$viewport=new Rectangle(0,0,0,0);
        Context3D.__super.call(this);
        this._$gl=context;
        this._$stage3d=stage3d;
        this._$initContants();
        this._$initObjects();
    }

    __class(Context3D,'flash.display3D.Context3D',_super);
    var __proto=Context3D.prototype;

    __proto._$reset=function(w,h)
    {
        this._$prog=false;
        this._$cmd=[];
        this._$tex=[];
        this._$gl.enable(this._$gl.BLEND);
        this.setBlendFactors(Context3DBlendFactor.SOURCE_ALPHA,Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
        this.setCulling(Context3DTriangleFace.NONE);
        this._$stencilFunc=this._$gl.ALWAYS;
        this._$curProgram=null;
        this._$gl.viewport(0,0,w,h);
        this.clear(0,0,0,1);
    }

    __proto._$initContants=function()
    {
        this._$CULL={};
        this._$CULL[Context3DTriangleFace.BACK]=this._$gl.FRONT;
        this._$CULL[Context3DTriangleFace.FRONT]=this._$gl.BACK;
        this._$CULL[Context3DTriangleFace.FRONT_AND_BACK]=this._$gl.FRONT_AND_BACK;
        this._$CULL2={};
        this._$CULL2[Context3DTriangleFace.BACK]=this._$gl.BACK;
        this._$CULL2[Context3DTriangleFace.FRONT]=this._$gl.FRONT;
        this._$CULL2[Context3DTriangleFace.FRONT_AND_BACK]=this._$gl.FRONT_AND_BACK;
        this._$BLEND={};
        this._$BLEND[Context3DBlendFactor.ONE]=this._$gl.ONE;
        this._$BLEND[Context3DBlendFactor.ZERO]=this._$gl.ZERO;
        this._$BLEND[Context3DBlendFactor.DESTINATION_ALPHA]=this._$gl.DST_ALPHA;
        this._$BLEND[Context3DBlendFactor.DESTINATION_COLOR]=this._$gl.DST_COLOR;
        this._$BLEND[Context3DBlendFactor.ONE_MINUS_DESTINATION_ALPHA]=this._$gl.ONE_MINUS_DST_ALPHA;
        this._$BLEND[Context3DBlendFactor.ONE_MINUS_DESTINATION_COLOR]=this._$gl.ONE_MINUS_DST_COLOR;
        this._$BLEND[Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA]=this._$gl.ONE_MINUS_SRC_ALPHA;
        this._$BLEND[Context3DBlendFactor.ONE_MINUS_SOURCE_COLOR]=this._$gl.ONE_MINUS_SRC_COLOR;
        this._$BLEND[Context3DBlendFactor.SOURCE_ALPHA]=this._$gl.SRC_ALPHA;
        this._$BLEND[Context3DBlendFactor.SOURCE_COLOR]=this._$gl.SRC_COLOR;
        this._$COMPARE={};
        this._$COMPARE[Context3DCompareMode.ALWAYS]=this._$gl.ALWAYS;
        this._$COMPARE[Context3DCompareMode.EQUAL]=this._$gl.EQUAL;
        this._$COMPARE[Context3DCompareMode.GREATER]=this._$gl.GREATER;
        this._$COMPARE[Context3DCompareMode.GREATER_EQUAL]=this._$gl.GEQUAL;
        this._$COMPARE[Context3DCompareMode.LESS]=this._$gl.LESS;
        this._$COMPARE[Context3DCompareMode.LESS_EQUAL]=this._$gl.LEQUAL;
        this._$COMPARE[Context3DCompareMode.NEVER]=this._$gl.NEVER;
        this._$COMPARE[Context3DCompareMode.NOT_EQUAL]=this._$gl.NOTEQUAL;
        this._$STENCIL={};
        this._$STENCIL[Context3DStencilAction.DECREMENT_SATURATE]=this._$gl.DECR;
        this._$STENCIL[Context3DStencilAction.DECREMENT_WRAP]=this._$gl.DECR_WRAP;
        this._$STENCIL[Context3DStencilAction.INCREMENT_SATURATE]=this._$gl.INCR;
        this._$STENCIL[Context3DStencilAction.INCREMENT_WRAP]=this._$gl.INCR_WRAP;
        this._$STENCIL[Context3DStencilAction.INVERT]=this._$gl.INVERT;
        this._$STENCIL[Context3DStencilAction.KEEP]=this._$gl.KEEP;
        this._$STENCIL[Context3DStencilAction.SET]=this._$gl.REPLACE;
        this._$STENCIL[Context3DStencilAction.ZERO]=this._$gl.ZERO;
        var e=CubeTexture.sidesEnum=[];
        e[0]=this._$gl.TEXTURE_CUBE_MAP_POSITIVE_X;
        e[1]=this._$gl.TEXTURE_CUBE_MAP_NEGATIVE_X;
        e[2]=this._$gl.TEXTURE_CUBE_MAP_POSITIVE_Y;
        e[3]=this._$gl.TEXTURE_CUBE_MAP_NEGATIVE_Y;
        e[4]=this._$gl.TEXTURE_CUBE_MAP_POSITIVE_Z;
        e[5]=this._$gl.TEXTURE_CUBE_MAP_NEGATIVE_Z;
        this._$USAGE={};
        this._$USAGE[Context3DBufferUsage.DYNAMIC_DRAW]=this._$gl.DYNAMIC_DRAW;
        this._$USAGE[Context3DBufferUsage.STATIC_DRAW]=this._$gl.STATIC_DRAW;
        this._$CNUM={};
        this._$CNUM[Context3DVertexBufferFormat.BYTES_4]=1;
        this._$CNUM[Context3DVertexBufferFormat.FLOAT_1]=1;
        this._$CNUM[Context3DVertexBufferFormat.FLOAT_2]=2;
        this._$CNUM[Context3DVertexBufferFormat.FLOAT_3]=3;
        this._$CNUM[Context3DVertexBufferFormat.FLOAT_4]=4;
        this._$vc=new Float32Array(Context3D.VC_MAX_NUM*4);
    }

    __proto._$initObjects=function()
    {
        this._$rttFB=this._$gl.createFramebuffer();
        this._$screenFB=this._$gl.getParameter(this._$gl.FRAMEBUFFER_BINDING);
        this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER,this._$screenFB);
    }

    __proto.clear=function(red,green,blue,alpha,depth,stencil,mask)
    {
        (red===void 0) && (red=0);
        (green===void 0) && (green=0);
        (blue===void 0) && (blue=0);
        (alpha===void 0) && (alpha=1);
        (depth===void 0) && (depth=1);
        (stencil===void 0) && (stencil=0);
        (mask===void 0) && (mask=4294967295);
        this._$gl.clearColor(red,green,blue,alpha);
        this._$gl.clearDepth(depth);
        this._$gl.clearStencil(stencil);
        var flag=0;
        if (mask&Context3DClearMask.COLOR)
            flag|=this._$gl.COLOR_BUFFER_BIT|0;
        if (mask&Context3DClearMask.DEPTH)
            flag|=this._$gl.DEPTH_BUFFER_BIT|0;
        if (mask&Context3DClearMask.STENCIL)
            flag|=this._$gl.STENCIL_BUFFER_BIT|0;
        if (mask&Context3DClearMask.ALL)
            flag=this._$gl.COLOR_BUFFER_BIT|this._$gl.DEPTH_BUFFER_BIT|this._$gl.STENCIL_BUFFER_BIT;
        if (flag) {
            if (!this._$depthMask)
                this._$gl.depthMask(true);
            this._$gl.clear(flag);
            if (!this._$depthMask)
                this._$gl.depthMask(false);
        }
    }

    __proto.configureBackBuffer=function(width,height,antiAlias,enableDepthAndStencil,wantsBestResolution,wantsBestResolutionOnBrowserZoom)
    {
        (enableDepthAndStencil===void 0) && (enableDepthAndStencil=true);
        (wantsBestResolution===void 0) && (wantsBestResolution=false);
        (wantsBestResolutionOnBrowserZoom===void 0) && (wantsBestResolutionOnBrowserZoom=false);
        this._$backWidth=width;
        this._$backHeight=height;
        this._$screenViewport.x=0;
        this._$screenViewport.y=0;
        this._$screenViewport.width=this._$backWidth;
        this._$screenViewport.height=this._$backHeight;
        this._$viewport.copyFrom(this._$screenViewport);
        this._$stage3d._$setSize(width,height);
        this._$gl.viewport(0,0,width,height);
        if (enableDepthAndStencil==true) {
            this._$gl.enable(this._$gl.DEPTH_TEST);
            this._$gl.depthFunc(this._$gl.LEQUAL);
            this._$gl.depthMask(true);
            this._$gl.enable(this._$gl.STENCIL_TEST);
            this._$gl.stencilFunc(this._$gl.ALWAYS,1,1);
            this._$gl.stencilOp(this._$gl.KEEP,this._$gl.KEEP,this._$gl.REPLACE);
        } else {
            this._$gl.depthMask(false);
            this._$gl.disable(this._$gl.DEPTH_TEST);
            this._$gl.disable(this._$gl.STENCIL_TEST);
        }
    }

    __proto.createCubeTexture=function(size,format,optimizeForRenderToTexture)
    {
        return new CubeTexture(this._$gl,size,format,optimizeForRenderToTexture);
    }

    __proto.createIndexBuffer=function(numIndices,bufferUsage)
    {
        (bufferUsage===void 0) && (bufferUsage=Context3DBufferUsage.STATIC_DRAW);
        return new IndexBuffer3D(this._$gl,numIndices,this._$USAGE[bufferUsage]);
    }

    __proto.createProgram=function()
    {
        return new Program3D(this._$gl);
    }

    __proto.createRectangleTexture=function(width,height,format,optimizeForRenderToTexture)
    {
        return new RectangleTexture(this._$gl,width,height,format,optimizeForRenderToTexture);
    }

    __proto.createTexture=function(width,height,format,optimizeForRenderToTexture,streamingLevels)
    {
        (streamingLevels===void 0) && (streamingLevels=0);
        return new Texture(this._$gl,width,height,format,optimizeForRenderToTexture,streamingLevels);
    }

    __proto.createVertexBuffer=function(numVertices,data32PerVertex,bufferUsage)
    {
        (bufferUsage===void 0) && (bufferUsage=Context3DBufferUsage.STATIC_DRAW);
        return new VertexBuffer3D(this._$gl,numVertices,data32PerVertex,this._$USAGE[bufferUsage]);
    }

    __proto.dispose=function()
    {
        this._$stage3d._$dispose();
    }

    __proto.drawToBitmapData=function(destination)
    {
        trace('-- NATIVE flash.display3D.Context3D.drawToBitmapData');
    }

    __proto.drawTriangles=function(indexBuffer,firstIndex,numTriangles)
    {
        (firstIndex===void 0) && (firstIndex=0);
        (numTriangles===void 0) && (numTriangles= -1);
        if (this._$curProgram) {
            if (this._$cmd.length) {
                this._$prog=true;
                this._$execCmd();
            }
            this._$sendVc();
            this._$curProgram.setSamplers(this._$tex);
            this._$gl.uniform1f(this._$curProgram.getUniformLocation("yflip"),this._$inScreen ? 1 :  -1);
            var numIndices=0;
            if (numTriangles== -1) {
                numIndices=indexBuffer._$numIndexes-firstIndex;
            } else {
                numIndices=((firstIndex+numTriangles*3)<=indexBuffer._$numIndexes) ? (numTriangles*3) : (indexBuffer._$numIndexes-firstIndex);
            }
            this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER,indexBuffer._$ibo);
            this._$gl.drawElements(this._$gl.TRIANGLES,numIndices,this._$gl.UNSIGNED_SHORT,firstIndex*2);
            this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER,null);
        }
        this._$prog=false;
        this._$cmd.length=0;
    }

    __proto.present=function()
    {
        this._$gl.bindTexture(this._$gl.TEXTURE_2D,null);
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,null);
        this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER,null);
        this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER,this._$screenFB);
        this._$gl.flush();
        this._$prog=false;
        this._$cmd.length=0;
    }

    __proto.setBlendFactors=function(sourceFactor,destinationFactor)
    {
        this._$gl.blendFunc(this._$BLEND[sourceFactor],this._$BLEND[destinationFactor]);
    }

    __proto.setColorMask=function(red,green,blue,alpha)
    {
        this._$gl.colorMask(red,green,blue,alpha);
    }

    __proto.setCulling=function(triangleFaceToCull)
    {
        this._$culling=triangleFaceToCull;
        if (triangleFaceToCull==Context3DTriangleFace.NONE) {
            this._$gl.disable(this._$gl.CULL_FACE);
        } else {
            this._$gl.enable(this._$gl.CULL_FACE);
            if (this._$inScreen)
                this._$gl.cullFace(this._$CULL[triangleFaceToCull]);
            else
                this._$gl.cullFace(this._$CULL2[triangleFaceToCull]);
        }
    }

    __proto.setDepthTest=function(depthMask,passCompareMode)
    {
        this._$depthMask=depthMask;
        this._$gl.depthMask(depthMask);
        this._$gl.depthFunc(this._$COMPARE[passCompareMode]);
    }

    __proto.setProgram=function(program)
    {
        this._$curProgram=program;
        if (program) {
            this._$gl.useProgram(program._$programID);
            this._$prog=true;
            this._$execCmd();
        } else {
            this._$prog=false;
        }
    }

    __proto._$execCmd=function()
    {
        var len=this._$cmd.length;
        for (var i=0;i<len;i+=2) {
            this[this._$cmd[i]].apply(this,this._$cmd[i+1]);
        }
        if (this._$cmd.length>len) {
            trace("error exec_cmd");
        }
        this._$cmd.length=0;
    }

    __proto.setProgramConstantsFromByteArray=function(programType,firstRegister,numRegisters,data,byteArrayOffset)
    {
        if (!data) {
            return;
        }
        if (!this._$prog) {
            this._$cmd.push("setProgramConstantsFromByteArray",[programType,firstRegister,numRegisters,data,byteArrayOffset]);
            return;
        }
        var endian=data.endian;
        var pos=data.position;
        data.endian=Endian.LITTLE_ENDIAN;
        data.position=byteArrayOffset;
        var loc=this._$uniformLocI(programType);
        if (loc) {
            trace("index reg setProgramConstantsFromByteArray");
            return;
        }
        for (var i=0;i<numRegisters;i++) {
            var v0=data.readFloat();
            var v1=data.readFloat();
            var v2=data.readFloat();
            var v3=data.readFloat();
            this._$gl.uniform4f(this._$uniformLoc(programType,firstRegister+i),v0,v1,v2,v3);
        }
        data.endian=endian;
        data.position=pos;
    }

    __proto.setProgramConstantsFromMatrix=function(programType,firstRegister,matrix,transposedMatrix)
    {
        (transposedMatrix===void 0) && (transposedMatrix=false);
        if (!matrix) {
            return;
        }
        if (!this._$prog) {
            this._$cmd.push("setProgramConstantsFromMatrix",[programType,firstRegister,matrix.clone(),transposedMatrix]);
            return;
        }
        var v=matrix.$vec;
        if (this._$curProgram._$vci && programType==Context3DProgramType.VERTEX) {
            if (transposedMatrix) {
                this._$setVc(firstRegister,v[0],v[4],v[8],v[12]);
                this._$setVc(firstRegister+1,v[1],v[5],v[9],v[13]);
                this._$setVc(firstRegister+2,v[2],v[6],v[10],v[14]);
                this._$setVc(firstRegister+3,v[3],v[7],v[11],v[15]);
            } else {
                this._$setVc(firstRegister,v[0],v[1],v[2],v[3]);
                this._$setVc(firstRegister+1,v[4],v[5],v[6],v[7]);
                this._$setVc(firstRegister+2,v[8],v[9],v[10],v[11]);
                this._$setVc(firstRegister+3,v[12],v[13],v[14],v[15]);
            }
            return;
        } else if (this._$curProgram._$fci && programType==Context3DProgramType.FRAGMENT) {
            trace("fragment index reg setProgramConstantsFromMatrix");
            return;
        }
        if (transposedMatrix) {
            this._$gl.uniform4f(this._$uniformLoc(programType,firstRegister),v[0],v[4],v[8],v[12]);
            this._$gl.uniform4f(this._$uniformLoc(programType,firstRegister+1),v[1],v[5],v[9],v[13]);
            this._$gl.uniform4f(this._$uniformLoc(programType,firstRegister+2),v[2],v[6],v[10],v[14]);
            this._$gl.uniform4f(this._$uniformLoc(programType,firstRegister+3),v[3],v[7],v[11],v[15]);
        } else {
            this._$gl.uniform4f(this._$uniformLoc(programType,firstRegister),v[0],v[1],v[2],v[3]);
            this._$gl.uniform4f(this._$uniformLoc(programType,firstRegister+1),v[4],v[5],v[6],v[7]);
            this._$gl.uniform4f(this._$uniformLoc(programType,firstRegister+2),v[8],v[9],v[10],v[11]);
            this._$gl.uniform4f(this._$uniformLoc(programType,firstRegister+3),v[12],v[13],v[14],v[15]);
        }
    }

    __proto.setProgramConstantsFromVector=function(programType,firstRegister,data,numRegisters)
    {
        (numRegisters===void 0) && (numRegisters= -1);
        if (!data) {
            return;
        }
        if (!this._$prog) {
            this._$cmd.push("setProgramConstantsFromVector",[programType,firstRegister,data.slice(),numRegisters]);
            return;
        }
        if (numRegisters== -1)
            numRegisters=data.length>>2;
        if (this._$curProgram._$vci && programType==Context3DProgramType.VERTEX) {
            for (var i=0,j=0;i<numRegisters;i++,j+=4) {
                this._$setVc(firstRegister+i,data[j],data[j+1],data[j+2],data[j+3]);
            }
            return;
        } else if (this._$curProgram._$fci && programType==Context3DProgramType.FRAGMENT) {
            trace("fragment index reg setProgramConstantsFromVector");
            return;
        }
        for (i=0,j=0;i<numRegisters;i++,j+=4) {
            this._$gl.uniform4f(this._$uniformLoc(programType,firstRegister+i),data[j],data[j+1],data[j+2],data[j+3]);
        }
    }

    __proto._$uniformLoc=function(programType,firstRegister)
    {
        var reg_name=(programType==Context3DProgramType.VERTEX ? "vc" : "fc")+firstRegister;
        return this._$curProgram.getUniformLocation(reg_name);
    }

    __proto._$uniformLocI=function(programType)
    {
        if (this._$curProgram._$vci && programType==Context3DProgramType.VERTEX)
            return this._$curProgram.getUniformLocation("vca");
        if (this._$curProgram._$fci && programType==Context3DProgramType.FRAGMENT)
            return this._$curProgram.getUniformLocation("fca");
        return null;
    }

    __proto._$setVc=function(id,x,y,z,w)
    {
        if (id>=Context3D.VC_MAX_NUM) {
            trace("too many vertex uniform");
            return;
        }
        var pos=id<<2;
        this._$vc[pos]=x;
        this._$vc[pos+1]=y;
        this._$vc[pos+2]=z;
        this._$vc[pos+3]=w;
        if (id+1>this._$vcLen)
            this._$vcLen=id+1;
    }

    __proto._$sendVc=function()
    {
        if (this._$vcLen) {
            if (this._$curProgram._$vci) {
                this._$gl.uniform4fv(this._$curProgram.getUniformLocation("vca"),this._$vc.subarray(0,this._$vcLen*4));
            }
            this._$vcLen=0;
        }
    }

    __proto.setRenderToBackBuffer=function()
    {
        if (!this._$inScreen) {
            this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER,this._$screenFB);
            this._$viewport.copyFrom(this._$screenViewport);
            this._$gl.viewport(this._$viewport.x,this._$viewport.y,this._$viewport.width,this._$viewport.height);
            this._$gl.disable(this._$gl.SCISSOR_TEST);
            this._$inScreen=true;
            this.setCulling(this._$culling);
        }
    }

    __proto.setRenderToTexture=function(texture,enableDepthAndStencil,antiAlias,surfaceSelector,colorOutputIndex)
    {
        (enableDepthAndStencil===void 0) && (enableDepthAndStencil=false);
        (antiAlias===void 0) && (antiAlias=0);
        (surfaceSelector===void 0) && (surfaceSelector=0);
        (colorOutputIndex===void 0) && (colorOutputIndex=0);
        if (texture==null) {
            this.setRenderToBackBuffer();
        } else {
            this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER,this._$rttFB);
            if (texture instanceof CubeTexture)
                this._$gl.framebufferTexture2D(this._$gl.FRAMEBUFFER,this._$gl.COLOR_ATTACHMENT0,CubeTexture.sidesEnum[surfaceSelector],texture._$texID,0);
            else
                this._$gl.framebufferTexture2D(this._$gl.FRAMEBUFFER,this._$gl.COLOR_ATTACHMENT0,this._$gl.TEXTURE_2D,texture._$texID,0);
            if (enableDepthAndStencil) {
                texture._$setDepthBuffer(surfaceSelector);
                this._$gl.framebufferRenderbuffer(this._$gl.FRAMEBUFFER,this._$gl.DEPTH_STENCIL_ATTACHMENT,this._$gl.RENDERBUFFER,texture._$depthBuffer[surfaceSelector]);
            } else {
                this._$gl.framebufferRenderbuffer(this._$gl.FRAMEBUFFER,this._$gl.DEPTH_STENCIL_ATTACHMENT,this._$gl.RENDERBUFFER,null);
            }
            var status=this._$gl.checkFramebufferStatus(this._$gl.FRAMEBUFFER);
            if (status!=this._$gl.FRAMEBUFFER_COMPLETE) {
                this.setRenderToBackBuffer();
                return;
            }
            this._$inScreen=false;
            this._$viewport.x=0;
            this._$viewport.y=0;
            this._$viewport.width=texture._$width;
            this._$viewport.height=texture._$height;
            this._$gl.viewport(0,0,this._$viewport.width,this._$viewport.height);
            if (enableDepthAndStencil) {
                this._$gl.enable(this._$gl.DEPTH_TEST);
                this._$gl.enable(this._$gl.STENCIL_TEST);
            } else {
                this._$gl.disable(this._$gl.DEPTH_TEST);
                this._$gl.disable(this._$gl.STENCIL_TEST);
            }
            this.setCulling(this._$culling);
        }
    }

    __proto.setSamplerStateAt=function(sampler,wrap,filter,mipfilter)
    {
        if (sampler>=0 && sampler<8) {
            if (!this._$prog || !this._$tex[sampler]) {
                this._$cmd.push("setSamplerStateAt",[sampler,wrap,filter,mipfilter]);
                return;
            }
            this._$tex[sampler]._$ignore=true;
            this._$gl.activeTexture(this._$gl["TEXTURE"+sampler]);
            if (mipfilter=="mipnone") {
                var ft;
                if (filter=="linear")
                    ft=this._$gl.LINEAR;
                else
                    ft=this._$gl.NEAREST;
                this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_MIN_FILTER,ft);
                this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_MAG_FILTER,ft);
            }
            switch (wrap) {
            case Context3DWrapMode.CLAMP:
                this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_S,this._$gl.CLAMP_TO_EDGE);
                this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_T,this._$gl.CLAMP_TO_EDGE);
                break;
            case Context3DWrapMode.REPEAT:
                this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_S,this._$gl.REPEAT);
                this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_T,this._$gl.REPEAT);
                break;
            case Context3DWrapMode.CLAMP_U_REPEAT_V:
                this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_S,this._$gl.CLAMP_TO_EDGE);
                this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_T,this._$gl.REPEAT);
                break;
            case Context3DWrapMode.REPEAT_U_CLAMP_V:
                this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_S,this._$gl.REPEAT);
                this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_T,this._$gl.CLAMP_TO_EDGE);
                break;
            }
        }
    }

    __proto.setScissorRectangle=function(rectangle)
    {
        if (rectangle==null) {
            this._$gl.disable(this._$gl.SCISSOR_TEST);
        } else {
            var yStart;
            if (this._$viewport.equals(this._$screenViewport)==false) {
                yStart=rectangle.y;
            } else {
                yStart=this._$viewport.height-(rectangle.y+rectangle.height);
                if (yStart<0)
                    yStart=0;
            }
            this._$gl.scissor(rectangle.x,yStart,rectangle.width,rectangle.height);
            this._$gl.enable(this._$gl.SCISSOR_TEST);
        }
    }

    __proto.setStencilActions=function(triangleFace,compareMode,actionOnBothPass,actionOnDepthFail,actionOnDepthPassStencilFail)
    {
        (triangleFace===void 0) && (triangleFace="frontAndBack");
        (compareMode===void 0) && (compareMode="always");
        (actionOnBothPass===void 0) && (actionOnBothPass="keep");
        (actionOnDepthFail===void 0) && (actionOnDepthFail="keep");
        (actionOnDepthPassStencilFail===void 0) && (actionOnDepthPassStencilFail="keep");
        this._$stencilFunc=this._$COMPARE[compareMode];
        this._$gl.stencilFunc(this._$stencilFunc,this._$stencilRef,this._$stencilReadMask);
        this._$gl.stencilOp(this._$STENCIL[actionOnDepthPassStencilFail],this._$STENCIL[actionOnDepthFail],this._$STENCIL[actionOnBothPass]);
    }

    __proto.setStencilReferenceValue=function(referenceValue,readMask,writeMask)
    {
        (readMask===void 0) && (readMask=255);
        (writeMask===void 0) && (writeMask=255);
        this._$stencilRef=referenceValue;
        this._$stencilReadMask=readMask;
        this._$gl.stencilFunc(this._$stencilFunc,referenceValue,readMask);
        this._$gl.stencilMask(writeMask);
    }

    __proto.setTextureAt=function(sampler,texture)
    {
        if (sampler>=0 && sampler<8) {
            if (texture==null || texture._$texID==null) {
                this._$gl.activeTexture(this._$gl["TEXTURE"+sampler]);
                this._$gl.bindTexture(this._$gl.TEXTURE_2D,null);
                this._$tex[sampler]=null;
                return;
            }
            if (!this._$prog) {
                this._$cmd.push("setTextureAt",[sampler,texture]);
                return;
            }
            this._$tex[sampler]=(texture && texture._$texID) ? texture : null;
            this._$gl.uniform1i(this._$curProgram.getUniformLocation("fs"+sampler),sampler);
            this._$gl.activeTexture(this._$gl["TEXTURE"+sampler]);
            this._$gl.bindTexture((texture instanceof CubeTexture) ? this._$gl.TEXTURE_CUBE_MAP : this._$gl.TEXTURE_2D,texture._$texID);
        }
    }

    __proto.setVertexBufferAt=function(index,buffer,bufferOffset,format)
    {
        (bufferOffset===void 0) && (bufferOffset=0);
        (format===void 0) && (format="float4");
        if (buffer==null) {
            this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,null);
            this._$gl.disableVertexAttribArray(index);
            return;
        }
        if (buffer._$vbo) {
            var components=this._$CNUM[format]|0;
            this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,buffer._$vbo);
            this._$gl.enableVertexAttribArray(index);
            var m=Float32Array.BYTES_PER_ELEMENT;
            if (format=="bytes4")
                this._$gl.vertexAttribPointer(index,4,this._$gl.UNSIGNED_BYTE,true,buffer._$data32PerVertex*m,bufferOffset*m);
            else
                this._$gl.vertexAttribPointer(index,components,this._$gl.FLOAT,false,buffer._$data32PerVertex*m,bufferOffset*m);
        }
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,null);
    }

    __getset(0,__proto,'backBufferHeight',
        function()
        {
            return this._$backHeight;
        }
    );

    __getset(0,__proto,'backBufferWidth',
        function()
        {
            return this._$backWidth;
        }
    );

    __getset(0,__proto,'driverInfo',
        function()
        {
            return "WebGL";
        }
    );

    __getset(0,__proto,'profile',
        function()
        {
            return "standard";
        }
    );

    __getset(1,Context3D,'supportsVideoTexture',
        function()
        {
            return false;
        }
    );

    Context3D.VC_MAX_NUM=128;

    Context3D.toString=function(){return "[class Context3D]";};
    Mira.un_proto(Context3D);
    return Context3D;
})(EventDispatcher);

var Context3DBlendFactor=(function() {
    function Context3DBlendFactor()
    {
    }

    __class(Context3DBlendFactor,'flash.display3D.Context3DBlendFactor');

    Context3DBlendFactor.DESTINATION_ALPHA="destinationAlpha";
    Context3DBlendFactor.DESTINATION_COLOR="destinationColor";
    Context3DBlendFactor.ONE="one";
    Context3DBlendFactor.ONE_MINUS_DESTINATION_ALPHA="oneMinusDestinationAlpha";
    Context3DBlendFactor.ONE_MINUS_DESTINATION_COLOR="oneMinusDestinationColor";
    Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA="oneMinusSourceAlpha";
    Context3DBlendFactor.ONE_MINUS_SOURCE_COLOR="oneMinusSourceColor";
    Context3DBlendFactor.SOURCE_ALPHA="sourceAlpha";
    Context3DBlendFactor.SOURCE_COLOR="sourceColor";
    Context3DBlendFactor.ZERO="zero";

    Context3DBlendFactor.toString=function(){return "[class Context3DBlendFactor]";};
    return Context3DBlendFactor;
})();

var Context3DBufferUsage=(function() {
    function Context3DBufferUsage()
    {
    }

    __class(Context3DBufferUsage,'flash.display3D.Context3DBufferUsage');

    Context3DBufferUsage.DYNAMIC_DRAW="dynamicDraw";
    Context3DBufferUsage.STATIC_DRAW="staticDraw";

    Context3DBufferUsage.toString=function(){return "[class Context3DBufferUsage]";};
    return Context3DBufferUsage;
})();

var Context3DClearMask=(function() {
    function Context3DClearMask()
    {
    }

    __class(Context3DClearMask,'flash.display3D.Context3DClearMask');

    Context3DClearMask.ALL=0x1;
    Context3DClearMask.COLOR=0x2;
    Context3DClearMask.DEPTH=0x4;
    Context3DClearMask.STENCIL=0x8;

    Context3DClearMask.toString=function(){return "[class Context3DClearMask]";};
    return Context3DClearMask;
})();

var Context3DCompareMode=(function() {
    function Context3DCompareMode()
    {
    }

    __class(Context3DCompareMode,'flash.display3D.Context3DCompareMode');

    Context3DCompareMode.ALWAYS="always";
    Context3DCompareMode.EQUAL="equal";
    Context3DCompareMode.GREATER="greater";
    Context3DCompareMode.GREATER_EQUAL="greaterEqual";
    Context3DCompareMode.LESS="less";
    Context3DCompareMode.LESS_EQUAL="lessEqual";
    Context3DCompareMode.NEVER="never";
    Context3DCompareMode.NOT_EQUAL="notEqual";

    Context3DCompareMode.toString=function(){return "[class Context3DCompareMode]";};
    return Context3DCompareMode;
})();

var Context3DMipFilter=(function() {
    function Context3DMipFilter()
    {
    }

    __class(Context3DMipFilter,'flash.display3D.Context3DMipFilter');

    Context3DMipFilter.MIPLINEAR="miplinear";
    Context3DMipFilter.MIPNEAREST="mipnearest";
    Context3DMipFilter.MIPNONE="mipnone";

    Context3DMipFilter.toString=function(){return "[class Context3DMipFilter]";};
    return Context3DMipFilter;
})();

var Context3DProfile=(function() {
    function Context3DProfile()
    {
    }

    __class(Context3DProfile,'flash.display3D.Context3DProfile');

    Context3DProfile.BASELINE="baseline";
    Context3DProfile.BASELINE_CONSTRAINED="baselineConstrained";
    Context3DProfile.BASELINE_EXTENDED="baselineExtended";
    Context3DProfile.STANDARD="standard";
    Context3DProfile.STANDARD_CONSTRAINED="standardConstrained";

    Context3DProfile.toString=function(){return "[class Context3DProfile]";};
    return Context3DProfile;
})();

var Context3DProgramType=(function() {
    function Context3DProgramType()
    {
    }

    __class(Context3DProgramType,'flash.display3D.Context3DProgramType');

    Context3DProgramType.FRAGMENT="fragment";
    Context3DProgramType.VERTEX="vertex";

    Context3DProgramType.toString=function(){return "[class Context3DProgramType]";};
    return Context3DProgramType;
})();

var Context3DRenderMode=(function() {
    function Context3DRenderMode()
    {
    }

    __class(Context3DRenderMode,'flash.display3D.Context3DRenderMode');

    Context3DRenderMode.AUTO="auto";
    Context3DRenderMode.SOFTWARE="software";

    Context3DRenderMode.toString=function(){return "[class Context3DRenderMode]";};
    return Context3DRenderMode;
})();

var Context3DStencilAction=(function() {
    function Context3DStencilAction()
    {
    }

    __class(Context3DStencilAction,'flash.display3D.Context3DStencilAction');

    Context3DStencilAction.DECREMENT_SATURATE="decrement_saturate";
    Context3DStencilAction.DECREMENT_WRAP="decrement_wrap";
    Context3DStencilAction.INCREMENT_SATURATE="increment_saturate";
    Context3DStencilAction.INCREMENT_WRAP="increment_wrap";
    Context3DStencilAction.INVERT="invert";
    Context3DStencilAction.KEEP="keep";
    Context3DStencilAction.SET="set";
    Context3DStencilAction.ZERO="zero";

    Context3DStencilAction.toString=function(){return "[class Context3DStencilAction]";};
    return Context3DStencilAction;
})();

var Context3DTextureFilter=(function() {
    function Context3DTextureFilter()
    {
    }

    __class(Context3DTextureFilter,'flash.display3D.Context3DTextureFilter');

    Context3DTextureFilter.ANISOTROPIC16X="anisotropic16x";
    Context3DTextureFilter.ANISOTROPIC2X="anisotropic2x";
    Context3DTextureFilter.ANISOTROPIC4X="anisotropic4x";
    Context3DTextureFilter.ANISOTROPIC8X="anisotropic8x";
    Context3DTextureFilter.LINEAR="linear";
    Context3DTextureFilter.NEAREST="nearest";

    Context3DTextureFilter.toString=function(){return "[class Context3DTextureFilter]";};
    return Context3DTextureFilter;
})();

var Context3DTextureFormat=(function() {
    function Context3DTextureFormat()
    {
    }

    __class(Context3DTextureFormat,'flash.display3D.Context3DTextureFormat');

    Context3DTextureFormat.BGRA="bgra";
    Context3DTextureFormat.BGRA_PACKED="bgraPacked4444";
    Context3DTextureFormat.BGR_PACKED="bgrPacked565";
    Context3DTextureFormat.COMPRESSED="compressed";
    Context3DTextureFormat.COMPRESSED_ALPHA="compressedAlpha";
    Context3DTextureFormat.RGBA_HALF_FLOAT="rgbaHalfFloat";

    Context3DTextureFormat.toString=function(){return "[class Context3DTextureFormat]";};
    return Context3DTextureFormat;
})();

var Context3DTriangleFace=(function() {
    function Context3DTriangleFace()
    {
    }

    __class(Context3DTriangleFace,'flash.display3D.Context3DTriangleFace');

    Context3DTriangleFace.BACK="back";
    Context3DTriangleFace.FRONT="front";
    Context3DTriangleFace.FRONT_AND_BACK="frontAndBack";
    Context3DTriangleFace.NONE="none";

    Context3DTriangleFace.toString=function(){return "[class Context3DTriangleFace]";};
    return Context3DTriangleFace;
})();

var Context3DVertexBufferFormat=(function() {
    function Context3DVertexBufferFormat()
    {
    }

    __class(Context3DVertexBufferFormat,'flash.display3D.Context3DVertexBufferFormat');

    Context3DVertexBufferFormat.BYTES_4="bytes4";
    Context3DVertexBufferFormat.FLOAT_1="float1";
    Context3DVertexBufferFormat.FLOAT_2="float2";
    Context3DVertexBufferFormat.FLOAT_3="float3";
    Context3DVertexBufferFormat.FLOAT_4="float4";

    Context3DVertexBufferFormat.toString=function(){return "[class Context3DVertexBufferFormat]";};
    return Context3DVertexBufferFormat;
})();

var Context3DWrapMode=(function() {
    function Context3DWrapMode()
    {
    }

    __class(Context3DWrapMode,'flash.display3D.Context3DWrapMode');

    Context3DWrapMode.CLAMP="clamp";
    Context3DWrapMode.CLAMP_U_REPEAT_V="clamp_u_repeat_v";
    Context3DWrapMode.REPEAT="repeat";
    Context3DWrapMode.REPEAT_U_CLAMP_V="repeat_u_clamp_v";

    Context3DWrapMode.toString=function(){return "[class Context3DWrapMode]";};
    return Context3DWrapMode;
})();

var IndexBuffer3D=(function() {
    function IndexBuffer3D(context,numIndices,bufferUsage)
    {
        this._$numIndexes=0;
        this._$bytesPerElement=0;
        this._$gl=context;
        this._$numIndexes=numIndices;
        this._$data=new Uint16Array(this._$numIndexes);
        this._$bytesPerElement=Uint16Array.BYTES_PER_ELEMENT;
        this._$ibo=this._$gl.createBuffer();
        this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER,this._$ibo);
        this._$gl.bufferData(this._$gl.ELEMENT_ARRAY_BUFFER,this._$numIndexes*this._$bytesPerElement,bufferUsage);
        this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER,null);
    }

    __class(IndexBuffer3D,'flash.display3D.IndexBuffer3D');
    var __proto=IndexBuffer3D.prototype;

    __proto.dispose=function()
    {
        if (this._$ibo) {
            this._$gl.deleteBuffer(this._$ibo);
            this._$data=null;
            this._$ibo=null;
        }
    }

    __proto.uploadFromByteArray=function(data,byteArrayOffset,startOffset,count)
    {
        if (count<0 || startOffset+count>this._$numIndexes) {
            return;
        }
        var doff=data.position;
        data.position=byteArrayOffset;
        for (var i=0;i<count;i++) {
            this._$data[i+startOffset]=data.readUnsignedShort();
        }
        data.position=doff;
        var tmpbuf=this._$data.subarray(startOffset,startOffset+count);
        this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER,this._$ibo);
        this._$gl.bufferSubData(this._$gl.ELEMENT_ARRAY_BUFFER,startOffset*this._$bytesPerElement,tmpbuf);
        this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER,null);
    }

    __proto.uploadFromVector=function(indices,startOffset,count)
    {
        if (count<0 || startOffset+count>this._$numIndexes) {
            return;
        }
        this._$data.set(indices,startOffset);
        var tmpbuf=this._$data.subarray(startOffset,startOffset+count);
        this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER,this._$ibo);
        this._$gl.bufferSubData(this._$gl.ELEMENT_ARRAY_BUFFER,startOffset*this._$bytesPerElement,tmpbuf);
        this._$gl.bindBuffer(this._$gl.ELEMENT_ARRAY_BUFFER,null);
    }

    IndexBuffer3D.toString=function(){return "[class IndexBuffer3D]";};
    Mira.un_proto(IndexBuffer3D);
    return IndexBuffer3D;
})();

var Program3D=(function() {
    function Program3D(context)
    {
        this._$vci=false;
        this._$fci=false;
        this._$gl=context;
        this._$samplers=[];
    }

    __class(Program3D,'flash.display3D.Program3D');
    var __proto=Program3D.prototype;

    __proto.dispose=function()
    {
        if (this._$programID) {
            this._$gl.deleteProgram(this._$programID);
            this._$programID=null;
        }
    }

    __proto.upload=function(vertexProgram,fragmentProgram)
    {
        if (vertexProgram instanceof ByteArray) {
            var ag=new AGAL2GLSL();
            vertexProgram=ag.agalToGlsl(vertexProgram);
            this._$vci=ag.hasindirect;
        }
        if (fragmentProgram instanceof ByteArray) {
            ag=new AGAL2GLSL();
            fragmentProgram=ag.agalToGlsl(fragmentProgram,this._$samplers);
            this._$fci=ag.hasindirect;
        }
        this._$programID=new GLSLCompiler().compile(this._$gl,__string(vertexProgram),__string(fragmentProgram));
        if (!this._$programID) {
            throw new Error("Program3D.upload fail");
        }
    }

    __proto.setSamplers=function(tex)
    {
        for (var i=0;i<this._$samplers.length;i++) {
            var o=this._$samplers[i];
            if (!o || !tex[i] || (o.special&4) || tex[i]._$ignore)
                continue;
            this._$gl.activeTexture(this._$gl["TEXTURE"+i]);
            var texture=tex[i];
            var target=(texture instanceof CubeTexture) ? this._$gl.TEXTURE_CUBE_MAP : this._$gl.TEXTURE_2D;
            this._$gl.bindTexture(target,texture._$texID);
            switch (o.wrap) {
            case 0:
                this._$gl.texParameteri(target,this._$gl.TEXTURE_WRAP_S,this._$gl.CLAMP_TO_EDGE);
                this._$gl.texParameteri(target,this._$gl.TEXTURE_WRAP_T,this._$gl.CLAMP_TO_EDGE);
                break;
            case 1:
                this._$gl.texParameteri(target,this._$gl.TEXTURE_WRAP_S,this._$gl.REPEAT);
                this._$gl.texParameteri(target,this._$gl.TEXTURE_WRAP_T,this._$gl.REPEAT);
                break;
            }
            var mag=o.filter ? this._$gl.LINEAR : this._$gl.NEAREST;
            var min=0;
            if (o.mipmap) {
                if (!texture._$mipmap)
                    texture.genMipmap();
                if (texture._$mipmap) {
                    min=o.mipmap==2 ? this._$gl.LINEAR_MIPMAP_LINEAR : this._$gl.NEAREST_MIPMAP_NEAREST;
                } else {
                    min=o.mipmap==2 ? this._$gl.LINEAR : this._$gl.NEAREST;
                }
            } else {
                min=mag;
            }
            this._$gl.texParameteri(target,this._$gl.TEXTURE_MIN_FILTER,min);
            this._$gl.texParameteri(target,this._$gl.TEXTURE_MAG_FILTER,mag);
        }
    }

    __proto.getAttributeLocation=function(nameOfAttrib)
    {
        return uint(this._$gl.getAttribLocation(this._$programID,nameOfAttrib));
    }

    __proto.getUniformLocation=function(nameOfUniform)
    {
        return this._$gl.getUniformLocation(this._$programID,nameOfUniform);
    }

    Program3D.toString=function(){return "[class Program3D]";};
    Mira.un_proto(Program3D);
    return Program3D;
})();

var VertexBuffer3D=(function() {
    function VertexBuffer3D(context,numVertices,data32PerVertex,bufferUsage)
    {
        this._$numVertices=0;
        this._$bytesPerElement=0;
        this._$data32PerVertex=0;
        this._$gl=context;
        this._$numVertices=numVertices;
        this._$data32PerVertex=data32PerVertex;
        this._$data=new Float32Array(this._$numVertices*this._$data32PerVertex);
        this._$bytesPerElement=Float32Array.BYTES_PER_ELEMENT;
        this._$vbo=this._$gl.createBuffer();
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,this._$vbo);
        this._$gl.bufferData(this._$gl.ARRAY_BUFFER,this._$numVertices*this._$data32PerVertex*this._$bytesPerElement,bufferUsage);
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,null);
    }

    __class(VertexBuffer3D,'flash.display3D.VertexBuffer3D');
    var __proto=VertexBuffer3D.prototype;

    __proto.dispose=function()
    {
        if (this._$vbo) {
            this._$gl.deleteBuffer(this._$vbo);
            this._$data=null;
            this._$vbo=null;
        }
    }

    __proto.uploadFromByteArray=function(data,byteArrayOffset,startVertex,numVertices)
    {
        if (numVertices<0 || startVertex+numVertices>this._$numVertices) {
            return;
        }
        var count=numVertices*this._$data32PerVertex*4;
        var b=new Uint8Array(this._$data.buffer);
        for (var i=0;i<count;i++) {
            b[startVertex*this._$data32PerVertex+i]=data.get(byteArrayOffset+i);
        }
        var tmpbuf=this._$data.subarray(startVertex*this._$data32PerVertex,(startVertex+numVertices)*this._$data32PerVertex);
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,this._$vbo);
        this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER,startVertex*this._$data32PerVertex*this._$bytesPerElement,tmpbuf);
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,null);
    }

    __proto.uploadFromVector=function(buffer,startVertex,numVertices)
    {
        if (numVertices<0 || startVertex+numVertices>this._$numVertices) {
            return;
        }
        this._$data.set(buffer,startVertex*this._$data32PerVertex);
        var tmpbuf=this._$data.subarray(startVertex*this._$data32PerVertex,(startVertex+numVertices)*this._$data32PerVertex);
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,this._$vbo);
        this._$gl.bufferSubData(this._$gl.ARRAY_BUFFER,startVertex*this._$data32PerVertex*this._$bytesPerElement,tmpbuf);
        this._$gl.bindBuffer(this._$gl.ARRAY_BUFFER,null);
    }

    VertexBuffer3D.toString=function(){return "[class VertexBuffer3D]";};
    Mira.un_proto(VertexBuffer3D);
    return VertexBuffer3D;
})();

var TextureBase=(function(_super) {
    function TextureBase()
    {
        this._$width=0;
        this._$height=0;
        this._$mipmap=0;
        this._$ignore=false;
        TextureBase.__super.call(this);
        this._$texID=null;
    }

    __class(TextureBase,'flash.display3D.textures.TextureBase',_super);
    var __proto=TextureBase.prototype;

    __proto.dispose=function()
    {
        if (this._$texID) {
            this._$gl.deleteTexture(this._$texID);
            this._$texID=null;
            this._$width=0;
            this._$height=0;
            this._$mipmap=0;
        }
        if (this._$depthBuffer) {
            this._$gl.deleteRenderbuffer(this._$depthBuffer[0]);
            this._$depthBuffer=null;
        }
    }

    __proto.genMipmap=function()
    {
    }

    __proto._$setDepthBuffer=function(side)
    {
        (side===void 0) && (side=0);
        if (!this._$depthBuffer)
            this._$depthBuffer=[];
        var db=this._$depthBuffer[side];
        if (!db) {
            db=this._$depthBuffer[side]=this._$gl.createRenderbuffer();
            this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,db);
            this._$gl.renderbufferStorage(this._$gl.RENDERBUFFER,this._$gl.DEPTH_STENCIL,this._$width,this._$height);
            this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER,null);
            if (this instanceof CubeTexture) {
                for (var i=0;i<6;i++)
                    this._$depthBuffer[i]=db;
            }
        }
    }

    TextureBase.toString=function(){return "[class TextureBase]";};
    Mira.un_proto(TextureBase);
    return TextureBase;
})(EventDispatcher);

var CubeTexture=(function(_super) {
    function CubeTexture(context,size,format,optimizeForRenderToTexture)
    {
        CubeTexture.__super.call(this);
        this._$gl=context;
        this._$width=size;
        this._$height=size;
        this.mipSize=[];
        while (size>0) {
            this.mipSize.push(size);
            size>>=1;
        }
        this._$texFormat=this._$gl.RGBA;
        this._$gl.pixelStorei(this._$gl.UNPACK_ALIGNMENT,1);
        this._$texID=this._$gl.createTexture();
        if (this._$texID!=null) {
            this._$gl.bindTexture(this._$gl.TEXTURE_CUBE_MAP,this._$texID);
            this._$gl.texParameteri(this._$gl.TEXTURE_CUBE_MAP,this._$gl.TEXTURE_MIN_FILTER,this._$gl.LINEAR);
            this._$gl.texParameteri(this._$gl.TEXTURE_CUBE_MAP,this._$gl.TEXTURE_MAG_FILTER,this._$gl.LINEAR);
            this._$gl.texParameteri(this._$gl.TEXTURE_CUBE_MAP,this._$gl.TEXTURE_WRAP_S,this._$gl.CLAMP_TO_EDGE);
            this._$gl.texParameteri(this._$gl.TEXTURE_CUBE_MAP,this._$gl.TEXTURE_WRAP_T,this._$gl.CLAMP_TO_EDGE);
        }
    }

    __class(CubeTexture,'flash.display3D.textures.CubeTexture',_super);
    var __proto=CubeTexture.prototype;

    __proto.uploadCompressedTextureFromByteArray=function(data,byteArrayOffset,async)
    {
        (async===void 0) && (async=false);
        trace('-- NATIVE flash.display3D.textures.CubeTexture.uploadCompressedTextureFromByteArray');
    }

    __proto.uploadFromBitmapData=function(source,side,miplevel)
    {
        (miplevel===void 0) && (miplevel=0);
        if (!source || this.mipSize[miplevel]!=source.width)
            return;
        source=source.getTextureData();
        this._$gl.bindTexture(this._$gl.TEXTURE_CUBE_MAP,this._$texID);
        this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1);
        this._$gl.texImage2D(CubeTexture.sidesEnum[side],miplevel,this._$gl.RGBA,this._$gl.RGBA,this._$gl.UNSIGNED_BYTE,source);
    }

    __proto.uploadFromByteArray=function(data,byteArrayOffset,side,miplevel)
    {
        (miplevel===void 0) && (miplevel=0);
        trace('-- NATIVE flash.display3D.textures.CubeTexture.uploadFromByteArray');
    }

    CubeTexture.sidesEnum=null;

    CubeTexture.toString=function(){return "[class CubeTexture]";};
    Mira.un_proto(CubeTexture);
    return CubeTexture;
})(TextureBase);

var RectangleTexture=(function(_super) {
    function RectangleTexture(context,width,height,format,optimizeForRenderToTexture)
    {
        RectangleTexture.__super.call(this);
        this._$gl=context;
        this._$width=width;
        this._$height=height;
        this._$texFormat=this._$gl.RGBA;
        this._$gl.pixelStorei(this._$gl.UNPACK_ALIGNMENT,1);
        this._$texID=this._$gl.createTexture();
        if (this._$texID!=null) {
            this._$gl.bindTexture(this._$gl.TEXTURE_2D,this._$texID);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_MIN_FILTER,this._$gl.LINEAR);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_MAG_FILTER,this._$gl.LINEAR);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_S,this._$gl.CLAMP_TO_EDGE);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_T,this._$gl.CLAMP_TO_EDGE);
            this._$gl.texImage2D(this._$gl.TEXTURE_2D,0,this._$texFormat,this._$width,this._$height,0,this._$texFormat,this._$gl.UNSIGNED_BYTE,null);
        }
    }

    __class(RectangleTexture,'flash.display3D.textures.RectangleTexture',_super);
    var __proto=RectangleTexture.prototype;

    __proto.uploadFromBitmapData=function(bmpData)
    {
        if (bmpData && (bmpData instanceof BitmapData))
            bmpData=bmpData.getTextureData();
        this._$gl.bindTexture(this._$gl.TEXTURE_2D,this._$texID);
        this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1);
        this._$gl.texSubImage2D(this._$gl.TEXTURE_2D,0,0,0,this._$gl.RGBA,this._$gl.UNSIGNED_BYTE,bmpData);
    }

    __proto.uploadFromByteArray=function(data,byteArrayOffset)
    {
        trace('-- NATIVE flash.display3D.textures.RectangleTexture.uploadFromByteArray');
    }

    RectangleTexture.toString=function(){return "[class RectangleTexture]";};
    Mira.un_proto(RectangleTexture);
    return RectangleTexture;
})(TextureBase);

var Texture=(function(_super) {
    function Texture(context,width,height,format,optimizeForRenderToTexture,streamingLevels)
    {
        Texture.__super.call(this);
        (streamingLevels===void 0) && (streamingLevels=0);
        this._$gl=context;
        this._$width=width;
        this._$height=height;
        this._$texFormat=this._$gl.RGBA;
        this._$gl.pixelStorei(this._$gl.UNPACK_ALIGNMENT,1);
        this._$texID=this._$gl.createTexture();
        if (this._$texID!=null) {
            this._$gl.bindTexture(this._$gl.TEXTURE_2D,this._$texID);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_MIN_FILTER,this._$gl.LINEAR);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_MAG_FILTER,this._$gl.LINEAR);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_S,this._$gl.REPEAT);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D,this._$gl.TEXTURE_WRAP_T,this._$gl.REPEAT);
            this._$gl.texImage2D(this._$gl.TEXTURE_2D,0,this._$texFormat,this._$width,this._$height,0,this._$texFormat,this._$gl.UNSIGNED_BYTE,null);
        }
    }

    __class(Texture,'flash.display3D.textures.Texture',_super);
    var __proto=Texture.prototype;

    __proto.uploadCompressedTextureFromByteArray=function(data,byteArrayOffset,async)
    {
        (async===void 0) && (async=false);
        trace('-- NATIVE flash.display3D.textures.Texture.uploadCompressedTextureFromByteArray');
    }

    __proto.uploadFromBitmapData=function(source,miplevel)
    {
        (miplevel===void 0) && (miplevel=0);
        if (!source || source.width!=(this._$width>>miplevel))
            return;
        source=source.getTextureData();
        this._$gl.bindTexture(this._$gl.TEXTURE_2D,this._$texID);
        this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1);
        this._$gl.texImage2D(this._$gl.TEXTURE_2D,miplevel,this._$gl.RGBA,this._$gl.RGBA,this._$gl.UNSIGNED_BYTE,source);
    }

    __proto.uploadFromByteArray=function(data,byteArrayOffset,miplevel)
    {
        (miplevel===void 0) && (miplevel=0);
        trace('-- NATIVE flash.display3D.textures.Texture.uploadFromByteArray');
    }

    __proto.genMipmap=function()
    {
        if (this._$mipmap==0) {
            this._$gl.generateMipmap(this._$gl.TEXTURE_2D);
            this._$mipmap=1;
        }
    }

    Texture.toString=function(){return "[class Texture]";};
    Mira.un_proto(Texture);
    return Texture;
})(TextureBase);

var VideoTexture=(function(_super) {
    function VideoTexture()
    {
        this._videoHeight=240;
        this._videoWidth=320;
        VideoTexture.__super.call(this);
    }

    __class(VideoTexture,'flash.display3D.textures.VideoTexture',_super);
    var __proto=VideoTexture.prototype;

    __proto.attachCamera=function(theCamera)
    {
        throw new Error("");
    }

    __getset(0,__proto,'videoHeight',
        function()
        {
            return this._videoHeight;
        },
        function(value)
        {
            this._videoHeight=value;
        }
    );

    __getset(0,__proto,'videoWidth',
        function()
        {
            return this._videoWidth;
        },
        function(value)
        {
            this._videoWidth=value;
        }
    );

    VideoTexture.toString=function(){return "[class VideoTexture]";};
    Mira.un_proto(VideoTexture);
    return VideoTexture;
})(TextureBase);

var IOError=(function(_super) {
    function IOError(message,id)
    {
        (message===void 0) && (message="");
        (id===void 0) && (id=0);
        IOError.__super.call(this,message,id);
    }

    __class(IOError,'flash.errors.IOError',_super);

    IOError.toString=function(){return "[class IOError]";};
    return IOError;
})(Error);

var EOFError=(function(_super) {
    function EOFError(message,id)
    {
        (message===void 0) && (message="");
        (id===void 0) && (id=0);
        EOFError.__super.call(this,message,id);
    }

    __class(EOFError,'flash.errors.EOFError',_super);

    EOFError.toString=function(){return "[class EOFError]";};
    return EOFError;
})(IOError);

var IllegalOperationError=(function(_super) {
    function IllegalOperationError(message,id)
    {
        (message===void 0) && (message="");
        (id===void 0) && (id=0);
        IllegalOperationError.__super.call(this,message,id);
    }

    __class(IllegalOperationError,'flash.errors.IllegalOperationError',_super);

    IllegalOperationError.toString=function(){return "[class IllegalOperationError]";};
    return IllegalOperationError;
})(Error);

var Event=(function() {
    function Event(type,bubbles,cancelable,_d)
    {
        this._type_=0;
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (_d===void 0) && (_d=null);
        this._type_=0;
        this.bubbles=bubbles;
        this.type=type;
        this.cancelable=cancelable;
        !this._$edata && (this._$edata=_d);
    }

    __class(Event,'flash.events.Event');
    var __proto=Event.prototype;

    __proto._$setTarget=function(obj)
    {
        this._$target=obj;
    }

    __proto.clone=function()
    {
        return new Event(this.type,this.bubbles,this.cancelable,this._$edata);
    }

    __proto.stopPropagation=function()
    {
        this.stopsPropagation=this.returnValue=true;
    }

    __proto.stopImmediatePropagation=function()
    {
        this.stopsImmediatePropagation=true;
    }

    __proto.formatToString=function(className)
    {
        var rest=[];for(var $a=1,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
        return null;
    }

    __proto.isDefaultPrevented=function()
    {
        return false;
    }

    __proto.preventDefault=function()
    {
    }

    __proto.toString=function()
    {
        return "event:"+this._type_;
    }

    __proto.destory=function()
    {
        this._$target=null;
        this._currentTarget_=null;
    }

    __proto.toMouseEvent=function()
    {
        if (Event.__helpMouseEvt__==null) {
            Event.__helpMouseEvt__=new MouseEvent("");
        }
        return Event.__helpMouseEvt__;
    }

    __proto.dispatchOne=function(ep)
    {
        this.resetStops();
        this._$setTarget(ep);
        ep.evalEvent(this.toMouseEvent());
        if (this instanceof TouchEvent) {
            if (Multitouch.inputMode!=MultitouchInputMode.GESTURE) {
                ep.evalEvent(this);
            } else {
                var ge=TouchInfo.dealGestrueHandler(__as(this,TouchEvent));
                if (ge) {
                    ep.evalEvent(ge);
                }
            }
        }
    }

    __proto.dispatch=function(chain)
    {
        if (chain && chain.length) {
            this.resetStops();
            var chainLength=this.bubbles ? chain.length : 1;
            var endIndex=chain.length-1;
            var chainElement=__as(chain[endIndex],EventDispatcher);
            this._$setTarget(chainElement);
            this.dispatchTargetsEvt(this.toMouseEvent(),chain,chainLength,endIndex);
            if (this instanceof TouchEvent) {
                if (Multitouch.inputMode!=MultitouchInputMode.GESTURE) {
                    this.dispatchTargetsEvt(this,chain,chainLength,endIndex);
                } else {
                    var gestureEvt=TouchInfo.dealGestrueHandler(__as(this,TouchEvent));
                    if (gestureEvt) {
                        this.dispatchTargetsEvt(gestureEvt,chain,chainLength,endIndex);
                    }
                }
            }
        }
    }

    __proto.dispatchTargetsEvt=function(evt,chain,chainLength,endIndex)
    {
        for (var i=0;i<chainLength;i++) {
            if (evt.stopsImmediatePropagation)
                break;
            chain[endIndex-i].evalEvent(evt);
            if (evt.stopsPropagation)
                break;
        }
    }

    __proto.resetStops=function()
    {
        this.stopsImmediatePropagation=false;
        this.stopsPropagation=false;
    }

    __proto.checkType=function(type)
    {
        return (this._type_&type)!=0;
    }

    __proto.addType=function(type)
    {
        this._type_|=type;
    }

    __proto.removeType=function(type)
    {
        (this._type_&=~type);
    }

    __getset(0,__proto,'stopsPropagation',
        function()
        {
            return (this._type_&Event.TYPE_STOPSPROPAGATION)!=0;
        },
        function(value)
        {
            if (value)
                this._type_|=Event.TYPE_STOPSPROPAGATION;
            else
                this._type_&=~Event.TYPE_STOPSPROPAGATION;
        }
    );

    __getset(0,__proto,'stopsImmediatePropagation',
        function()
        {
            return (this._type_&Event.TYPE_STOPSIMMEDIATEPROPAGATION)!=0;
        },
        function(value)
        {
            if (value)
                this._type_|=Event.TYPE_STOPSIMMEDIATEPROPAGATION;
            else
                this._type_&=~Event.TYPE_STOPSIMMEDIATEPROPAGATION;
        }
    );

    __getset(0,__proto,'currentTarget',
        function()
        {
            return this._currentTarget_;
        }
    );

    __getset(0,__proto,'target',
        function()
        {
            return this._$target;
        }
    );

    __getset(0,__proto,'eventPhase',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'bubbles',
        function()
        {
            return this.checkType(Event.TYPE_BUBBLES);
        },
        function(b)
        {
            if (b)
                this.addType(Event.TYPE_BUBBLES);
            else
                this.removeType(Event.TYPE_BUBBLES);
        }
    );

    __getset(0,__proto,'cancelable',
        function()
        {
            return this.checkType(Event.TYPE_CANCELABLE);
        },
        function(b)
        {
            if (b)
                this.addType(Event.TYPE_CANCELABLE);
            else
                this.removeType(Event.TYPE_CANCELABLE);
        }
    );

    __getset(0,__proto,'returnValue',
        function()
        {
            return this.checkType(Event.TYPE_RETURNVALUE);
        },
        function(b)
        {
            if (b)
                this.addType(Event.TYPE_RETURNVALUE);
            else
                this.removeType(Event.TYPE_RETURNVALUE);
        }
    );

    __getset(0,__proto,'_$eData',
        function()
        {
            return this._$edata;
        },
        function(value)
        {
            this._$edata=value;
        }
    );

    Event.copyFromByObj=function(dstO,srcO,namesO)
    {
        if (!namesO)
            return;
        var tKey;
        for (tKey in namesO) {
            dstO[tKey]=srcO[namesO[tKey]];
        }
    }

    Event.ACTIVATE="activate";
    Event.ADDED="added";
    Event.ADDED_TO_STAGE="addedToStage";
    Event.CANCEL="cancel";
    Event.CHANGE="change";
    Event.DESTROY="destroy";
    Event.CLEAR="clear";
    Event.CLOSE="close";
    Event.COMPLETE="complete";
    Event.CONNECT="connect";
    Event.CONTEXT3D_CREATE="context3DCreate";
    Event.COPY="copy";
    Event.CUT="cut";
    Event.DEACTIVATE="deactivate";
    Event.ENTER_FRAME="enterFrame";
    Event.EXIT_FRAME="exitFrame";
    Event.FRAME_CONSTRUCTED="frameConstructed";
    Event.FULLSCREEN="fullScreen";
    Event.ID3="id3";
    Event.INIT="init";
    Event.MOUSE_LEAVE="mouseLeave";
    Event.OPEN="open";
    Event.LOADED="loaded";
    Event.PASTE="paste";
    Event.ONRESHOW="onreshow";
    Event.REMOVED="removed";
    Event.REMOVED_FROM_STAGE="removedFromStage";
    Event.RENDER="render";
    Event.RESIZE="resize";
    Event.REPOS="repos";
    Event.SCROLL="scroll";
    Event.SCROLLSIZE="scrollsize";
    Event.SELECT="select";
    Event.SELECT_ALL="selectAll";
    Event.SOUND_COMPLETE="soundComplete";
    Event.TAB_CHILDREN_CHANGE="tabChildrenChange";
    Event.TAB_ENABLED_CHANGE="tabEnabledChange";
    Event.TAB_INDEX_CHANGE="tabIndexChange";
    Event.TEXT_INTERACTION_MODE_CHANGE="textInteractionModeChange";
    Event.TEXTURE_READY="textureReady";
    Event.UNLOAD="unload";
    Event.ONPARENT="onparent";
    Event.TODOCUMENT="todocument";
    Event.ERROR="error";
    Event.MESSAGE="message";
    Event.TYPE_BUBBLES=0x1;
    Event.TYPE_CANCELABLE=0x2;
    Event.TYPE_RETURNVALUE=0x4;
    Event.TYPE_STOPSIMMEDIATEPROPAGATION=0x8;
    Event.TYPE_STOPSPROPAGATION=0x10;
    Event.__helpMouseEvt__=null;

    __static(Event,[
        'INPUT_EVENT_TYPE_MAP',function(){return this.INPUT_EVENT_TYPE_MAP={"mousedown": "touchstart","mouseup": "touchend","mousemove": "touchmove"};}
    ]);

    Event.toString=function(){return "[class Event]";};
    Mira.un_proto(Event);
    return Event;
})();

var AccelerometerEvent=(function(_super) {
    function AccelerometerEvent(type,bubbles,cancelable,_d)
    {
        this.accelerationX=0;
        this.accelerationY=0;
        this.accelerationZ=0;
        this.timestamp=0;
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (_d===void 0) && (_d=null);
        AccelerometerEvent.__super.call(this,type,bubbles,cancelable,_d);
    }

    __class(AccelerometerEvent,'flash.events.AccelerometerEvent',_super);
    var __proto=AccelerometerEvent.prototype;

    __proto.clone=function()
    {
        var ae=new AccelerometerEvent(this.type,this.bubbles,this.cancelable,this._$edata);
        ae.accelerationX=this.accelerationX;
        ae.accelerationY=this.accelerationY;
        ae.accelerationZ=this.accelerationZ;
        return ae;
    }

    AccelerometerEvent.copySysEvent=function(e)
    {
        var ae=new AccelerometerEvent(AccelerometerEvent.UPDATE,e.bubbles,e.cancelable,null);
        ae.accelerationX= -e.accelerationIncludingGravity.y;
        ae.accelerationY=e.accelerationIncludingGravity.x;
        ae.accelerationZ=e.accelerationIncludingGravity.z;
        ae.timestamp=e.timeStamp;
        return ae;
    }

    AccelerometerEvent.UPDATE="update";

    AccelerometerEvent.toString=function(){return "[class AccelerometerEvent]";};
    Mira.un_proto(AccelerometerEvent);
    return AccelerometerEvent;
})(Event);

var ActivityEvent=(function(_super) {
    function ActivityEvent(type,bubbles,cancelable,_d)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (_d===void 0) && (_d=null);
        ActivityEvent.__super.call(this,type,bubbles,cancelable,_d);
    }

    __class(ActivityEvent,'flash.events.ActivityEvent',_super);
    var __proto=ActivityEvent.prototype;

    __getset(0,__proto,'activating',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    ActivityEvent.ACTIVITY="activity";

    ActivityEvent.toString=function(){return "[class ActivityEvent]";};
    return ActivityEvent;
})(Event);

var TextEvent=(function(_super) {
    function TextEvent(type,bubbles,cancelable,text)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (text===void 0) && (text="");
        TextEvent.__super.call(this,type,bubbles,cancelable);
        this.m_text=text;
    }

    __class(TextEvent,'flash.events.TextEvent',_super);
    var __proto=TextEvent.prototype;

    __proto.clone=function()
    {
        var te=new TextEvent(this.type,this.bubbles,this.cancelable,this.m_text);
        te.copyNativeData(this);
        return te;
    }

    __proto.copyNativeData=function(param1)
    {
    }

    __getset(0,__proto,'text',
        function()
        {
            return this.m_text;
        },
        function(value)
        {
            this.m_text=value;
        }
    );

    TextEvent.LINK="link";
    TextEvent.TEXT_INPUT="textInput";

    TextEvent.toString=function(){return "[class TextEvent]";};
    Mira.un_proto(TextEvent);
    return TextEvent;
})(Event);

var ErrorEvent=(function(_super) {
    function ErrorEvent(type,bubbles,cancelable,text,id)
    {
        this.m_errorID=0;
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (text===void 0) && (text="");
        (id===void 0) && (id=0);
        ErrorEvent.__super.call(this,type,bubbles,cancelable,text);
        this.m_errorID=id;
    }

    __class(ErrorEvent,'flash.events.ErrorEvent',_super);
    var __proto=ErrorEvent.prototype;

    __proto.clone=function()
    {
        return new ErrorEvent(this.type,this.bubbles,this.cancelable,this.text,this.m_errorID);
    }

    __proto.toString=function()
    {
        return this.formatToString("ErrorEvent","type","bubbles","cancelable","eventPhase","text","errorID");
    }

    __getset(0,__proto,'errorID',
        function()
        {
            return this.m_errorID;
        }
    );

    ErrorEvent.ERROR="error";

    ErrorEvent.toString=function(){return "[class ErrorEvent]";};
    Mira.un_proto(ErrorEvent);
    return ErrorEvent;
})(TextEvent);

var AsyncErrorEvent=(function(_super) {
    function AsyncErrorEvent(type,bubbles,cancelable,text,error)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (text===void 0) && (text="");
        (error===void 0) && (error=null);
        AsyncErrorEvent.__super.call(this,type,bubbles,cancelable,text);
    }

    __class(AsyncErrorEvent,'flash.events.AsyncErrorEvent',_super);
    var __proto=AsyncErrorEvent.prototype;

    __proto.clone=function()
    {
        return null;
    }

    AsyncErrorEvent.ASYNC_ERROR="asyncError";

    AsyncErrorEvent.toString=function(){return "[class AsyncErrorEvent]";};
    Mira.un_proto(AsyncErrorEvent);
    return AsyncErrorEvent;
})(ErrorEvent);

var ContextMenuEvent=(function(_super) {
    function ContextMenuEvent(type,bubbles,cancelable,_d)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (_d===void 0) && (_d=null);
        ContextMenuEvent.__super.call(this,type,bubbles,cancelable,_d);
    }

    __class(ContextMenuEvent,'flash.events.ContextMenuEvent',_super);
    var __proto=ContextMenuEvent.prototype;

    __getset(0,__proto,'contextMenuOwner',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'isMouseTargetInaccessible',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'mouseTarget',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    ContextMenuEvent.MENU_ITEM_SELECT="menuItemSelect";
    ContextMenuEvent.MENU_SELECT="menuSelect";

    ContextMenuEvent.toString=function(){return "[class ContextMenuEvent]";};
    return ContextMenuEvent;
})(Event);

var DataEvent=(function(_super) {
    function DataEvent(type,bubbles,cancelable,data)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (data===void 0) && (data="");
        DataEvent.__super.call(this,type,bubbles,cancelable);
    }

    __class(DataEvent,'flash.events.DataEvent',_super);
    var __proto=DataEvent.prototype;

    __getset(0,__proto,'data',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    DataEvent.DATA="data";
    DataEvent.UPLOAD_COMPLETE_DATA="uploadCompleteData";

    DataEvent.toString=function(){return "[class DataEvent]";};
    return DataEvent;
})(TextEvent);

var EventListener=(function() {
    function EventListener(listener,useCapture,priority,useWeakReference,ower)
    {
        this.useCapture=false;
        this.priority=0;
        this.useWeakReference=false;
        this._deleted_=false;
        this.reset(listener,useCapture,priority,useWeakReference,ower);
    }

    __class(EventListener,'flash.events.EventListener');
    var __proto=EventListener.prototype;

    __proto.setOwer=function(o)
    {
        this._ower_=o;
    }

    __proto.run=function(o,event)
    {
        if ((this._ower_ && this._ower_.deleted) || this.listener==null) {
            this.destroy();
            return false;
        }
        var isfalse=true;
        if (this._target_) {
            event._$target=this._target_;
            event._currentTarget_=this._target_;
            isfalse=this.callListener(event);
            event._$target=o;
        } else {
            isfalse=this.callListener(event);
        }
        if (isfalse)
            this.destroy();
        return !isfalse;
    }

    __proto.callListener=function(event)
    {
        var isfalse=true;
        isfalse=this.listener.call(this._ower_,event)==false;
        return isfalse;
    }

    __proto.reset=function(listener,useCapture,priority,useWeakReference,ower)
    {
        this.listener=listener;
        this.useCapture=useCapture;
        this.priority=priority;
        this.useWeakReference=useWeakReference;
        this._ower_=ower;
        this._deleted_=false;
        this.data=null;
    }

    __proto.destroy=function()
    {
        if (!this._deleted_) {
            this._ower_=null;
            this.listener=null;
            this._target_=null;
            this._deleted_=true;
            this.data=null;
        }
    }

    EventListener.__create__=function(listener,useCapture,priority,useWeakReference,ower)
    {
        return new EventListener(listener,useCapture,priority,useWeakReference,ower);
    }

    EventListener.toString=function(){return "[class EventListener]";};
    Mira.un_proto(EventListener);
    return EventListener;
})();

var EventManager=(function() {
    function EventManager()
    {
        this.enableTouch=false;
        this._clientX=0;
        this._clientY=0;
        this._isMoveUpdated=false;
        this.dealAccepInput=__bind(this.dealAcceptSysMouseInput,this);
        this._bubbleChain=[];
        this._keyEvents_=[];
    }

    __class(EventManager,'flash.events.EventManager');
    var __proto=EventManager.prototype;

    __proto.acceptSystemKeyEvent=function(event)
    {
        this._keyEvents_.push(event);
    }

    __proto._dispatchKeyEvent_=function(event)
    {
        switch (event.type) {
        case KeyboardEvent.KEY_DOWN:
            MainWin.doc2.onkeydown && MainWin.doc2.onkeydown(event);
            break;
        case KeyboardEvent.KEY_UP:
            MainWin.doc2.onkeyup && MainWin.doc2.onkeyup(event);
            break;
        }
        event.currentTarget && event.currentTarget._$dispatchEvent(event);
        event._currentTarget_=MainWin.doc2.activeElement;
        MainWin.doc2._$dispatchEvent(event);
    }

    __proto.dispatchSystemEvent=function()
    {
        if (!EventManager.stage) {
            return;
        }
        if (this._currentSysEvent) {
            this.dealAccepInput();
        }
        if (!this._keyEvents_.length)
            return;
        var ks=this._keyEvents_;
        var sz=ks.length;
        this._keyEvents_=[];
        for (var i=0;i<sz;i++) {
            var keyevent=new KeyboardEvent(ks[i].type);
            keyevent.changeEvent(ks[i]);
            EventManager.stage._$dispatchEvent(__as(keyevent,Event));
        }
    }

    __proto.dispatchPendingEvent=function()
    {
        var sz=EventManager.pendingEvents.length;
        if (sz>0) {
            for (var i=0;i<sz;i++) {
                var e=EventManager.pendingEvents[i];
                e._$target._$dispatchEvent(e);
            }
            EventManager.pendingEvents.length=0;
        }
    }

    __proto.dealAcceptSysMouseInput=function()
    {
        EventManager.clientToStage(this._currentSysEvent.clientX,this._currentSysEvent.clientY);
        if (this._currentSysEvent.type!="mousemove")
            return;
        EventManager._mouseEvent=MouseEvent.copyFromSysEvent(this._currentSysEvent);
        if (EventManager._mouseEvent.button!=0)
            return;
        this._curChainTop=EventManager.stage._hitTest_(EventManager._stageX,EventManager._stageY);
        if (this._chainTop!=this._curChainTop) {
            var curBubbleChain=this.getTargetBubbleChain(this._curChainTop);
            var common= -1;
            var len=curBubbleChain.length;
            for (var i=0;i<len;i++) {
                if (this._bubbleChain.length<=i || curBubbleChain[i]!=this._bubbleChain[i])
                    break;
                common=i;
            }
            var mouseOutEvt=EventManager._mouseEvent;
            mouseOutEvt.type=MouseEvent.MOUSE_OUT;
            mouseOutEvt.bubbles=true;
            mouseOutEvt.relatedObject=this._curChainTop;
            mouseOutEvt.dispatch(this._bubbleChain);
            for (i=this._bubbleChain.length-1;i>common;i--) {
                var rolloutEvt=EventManager._mouseEvent;
                rolloutEvt.type=MouseEvent.ROLL_OUT;
                rolloutEvt.bubbles=false;
                rolloutEvt.relatedObject=this._curChainTop;
                rolloutEvt.dispatchOne(this._bubbleChain[i]);
            }
            for (i=curBubbleChain.length-1;i>common;i--) {
                var rolloverEvt=EventManager._mouseEvent;
                rolloverEvt.type=MouseEvent.ROLL_OVER;
                rolloverEvt.bubbles=false;
                rolloverEvt.relatedObject=this._chainTop;
                rolloverEvt.dispatchOne(curBubbleChain[i]);
            }
            var mouseoverEvt=EventManager._mouseEvent;
            mouseoverEvt.type=MouseEvent.MOUSE_OVER;
            mouseoverEvt.bubbles=true;
            mouseoverEvt.relatedObject=this._chainTop;
            mouseoverEvt.dispatch(curBubbleChain);
            this._chainTop=this._curChainTop;
            this._bubbleChain=curBubbleChain;
        }
        if (EventManager._stageX!=this._clientX || EventManager._stageY!=this._clientY) {
            this._clientX=EventManager._stageX;
            this._clientY=EventManager._stageY;
            var mousemoveEvt=EventManager._mouseEvent;
            mousemoveEvt.bubbles=true;
            mousemoveEvt.relatedObject=this._chainTop;
            mousemoveEvt.type=MouseEvent.MOUSE_MOVE;
            if (this._bubbleChain) {
                mousemoveEvt.dispatch(this._bubbleChain);
            }
        }
        if (EventManager._mouseEvent)
            EventManager._mouseEvent.destory();
        this._currentSysEvent=null;
    }

    __proto.dealAcceptTouchInput=function()
    {
        if (this._currentSysEvent.touches.length!=0) {
            if (this._currentSysEvent.type!="touchmove" || !this._isMoveUpdated)
                return;
            this._isMoveUpdated=false;
            TouchEvent.touchSysEvent(this._currentSysEvent,__bind(this.touchMoveInterval,this));
        } else {
            this._currentSysEvent=null;
        }
    }

    __proto.touchMoveInterval=function(event)
    {
        var touchInfo=TouchInfo.getTouchInfo(event);
        touchInfo.curChainTop=EventManager.stage._hitTest_(event.stageX,event.stageY);
        if (touchInfo.chainTop!=touchInfo.curChainTop) {
            var curBubbleChain=this.getTargetBubbleChain(touchInfo.curChainTop);
            var common= -1;
            var len=curBubbleChain.length;
            for (var i=0;i<len;i++) {
                if (touchInfo.bubbleChain.length<=i || curBubbleChain[i]!=touchInfo.bubbleChain[i])
                    break;
                common=i;
            }
            event.type=TouchEvent.TOUCH_OUT;
            event.bubbles=true;
            event.relatedObject=touchInfo.curChainTop;
            event.dispatch(touchInfo.bubbleChain);
            for (i=touchInfo.bubbleChain.length-1;i>common;i--) {
                event.type=TouchEvent.TOUCH_ROLL_OUT;
                event.bubbles=false;
                event.relatedObject=touchInfo.curChainTop;
                event.dispatchOne(touchInfo.bubbleChain[i]);
            }
            for (i=curBubbleChain.length-1;i>common;i--) {
                event.type=TouchEvent.TOUCH_ROLL_OVER;
                event.bubbles=false;
                event.relatedObject=touchInfo.chainTop;
                event.dispatchOne(curBubbleChain[i]);
            }
            event.type=TouchEvent.TOUCH_OVER;
            event.bubbles=true;
            event.relatedObject=touchInfo.chainTop;
            event.dispatch(curBubbleChain);
            touchInfo.chainTop=touchInfo.curChainTop;
            touchInfo.bubbleChain=curBubbleChain;
        }
        if (event.stageX!=touchInfo.stageX || event.stageY!=touchInfo.stageY) {
            event.bubbles=true;
            event.type=TouchEvent.TOUCH_MOVE;
            event.relatedObject=touchInfo.chainTop;
            if (touchInfo.bubbleChain) {
                event.dispatch(touchInfo.bubbleChain);
            }
            touchInfo.touchMove(event);
        }
        if (event)
            event.destory();
    }

    __proto.getTargetBubbleChain=function(target)
    {
        var bubbleChain=[];
        var p=target;
        while (p) {
            bubbleChain.unshift(p);
            p=p.parent;
        }
        return bubbleChain;
    }

    __proto.dispatchTargetEvent=function(target,event)
    {
        event.dispatch(this.getTargetBubbleChain(target));
    }

    __proto.acceptSystemMouseEvent=function(event)
    {
        this.prevent(event);
        this._currentSysEvent=event;
        if (TouchEvent.isTypeMove(__string(this._currentSysEvent.type))) {
            this._isMoveUpdated=true;
            this.dispatchSystemEvent();
            return;
        }
        if (!this.enableTouch) {
            EventManager._mouseEvent=MouseEvent.copyFromSysEvent(this._currentSysEvent);
            if (EventManager._mouseEvent.button!=0)
                return;
            this._curChainTop=EventManager.stage._hitTest_(EventManager._stageX,EventManager._stageY);
            this.dispatchTargetEvent(this._curChainTop,EventManager._mouseEvent);
            if (this._currentSysEvent.type=="mousedown") {
                this._mouseDownTarget=this._curChainTop;
            } else if (this._currentSysEvent.type=="mouseup") {
                if (this._curChainTop==this._mouseDownTarget) {
                    EventManager._mouseEvent.bubbles=true;
                    EventManager._mouseEvent.type=MouseEvent.CLICK;
                    this.dispatchTargetEvent(this._curChainTop,EventManager._mouseEvent);
                }
                this._mouseDownTarget=null;
            }
            if (EventManager._mouseEvent)
                EventManager._mouseEvent.destory();
        } else {
            TouchEvent.touchSysEvent(event,__bind(this.touchMomentHandler,this));
        }
    }

    __proto.prevent=function(event)
    {
        event.stopPropagation();
        if (event["isScroll"]!=true) {
            event.preventDefault();
        }
    }

    __proto.touchMomentHandler=function(event)
    {
        var touchInfo=TouchInfo.getTouchInfo(event);
        touchInfo.curChainTop=EventManager.stage._hitTest_(EventManager._stageX,EventManager._stageY);
        touchInfo.stageX=EventManager._stageX;
        touchInfo.stageY=EventManager._stageY;
        if (event.type==TouchEvent.TOUCH_BEGIN) {
            touchInfo.touchBegin(event);
            this.dispatchTargetEvent(touchInfo.curChainTop,event);
        } else if (event.type==TouchEvent.TOUCH_END) {
            touchInfo.touchEnd(event);
            this.dispatchTargetEvent(touchInfo.curChainTop,event);
            if (touchInfo.curChainTop==touchInfo.touchDownTarget) {
                event.type=TouchEvent.TOUCH_TAP;
                this.dispatchTargetEvent(touchInfo.curChainTop,event);
            }
            touchInfo.destory();
        }
        if (event)
            event.destory();
    }

    EventManager.queueEvent=function(e)
    {
        EventManager.pendingEvents.push(e);
    }

    EventManager.clientToStage=function(x,y)
    {
        if (MainWin.window_as.mouseX==x && MainWin.window_as.mouseY==y)
            return;
        var tempX=x|0;
        if (MainWin.doc2.adapter.screenRotate!=0) {
            x=y;
            y=MainWin.window_as.innerHeight-tempX;
        }
        EventManager._stageX=(x-MainWin.doc2.body._left_)/MainWin.window_as.scale.x|0;
        EventManager._stageY=(y-MainWin.doc2.body._top_)/MainWin.window_as.scale.y|0;
        MainWin.doc2.mouseX=EventManager._stageX;
        MainWin.doc2.mouseY=EventManager._stageY;
        MainWin.window_as.mouseX=x|0;
        MainWin.window_as.mouseY=y|0;
    }

    EventManager.stage=null;
    EventManager._stageX=0;
    EventManager._stageY=0;
    EventManager._mouseEvent=null;

    __static(EventManager,[
        'mgr',function(){return this.mgr=new EventManager();},
        'pendingEvents',function(){return this.pendingEvents=[];}
    ]);

    EventManager.toString=function(){return "[class EventManager]";};
    Mira.un_proto(EventManager);
    return EventManager;
})();

var EventPhase=(function() {
    function EventPhase()
    {
    }

    __class(EventPhase,'flash.events.EventPhase');

    EventPhase.AT_TARGET=2;
    EventPhase.BUBBLING_PHASE=3;
    EventPhase.CAPTURING_PHASE=1;

    EventPhase.toString=function(){return "[class EventPhase]";};
    return EventPhase;
})();

var FocusEvent=(function(_super) {
    function FocusEvent(type,bubbles,cancelable,relatedObject,shiftKey,keyCode)
    {
        this._keyCode=0;
        this._shiftKey=false;
        (bubbles===void 0) && (bubbles=true);
        (cancelable===void 0) && (cancelable=false);
        (relatedObject===void 0) && (relatedObject=null);
        (shiftKey===void 0) && (shiftKey=false);
        (keyCode===void 0) && (keyCode=0);
        FocusEvent.__super.call(this,type,bubbles,cancelable,relatedObject);
        this._shiftKey=shiftKey;
        this._keyCode=keyCode;
    }

    __class(FocusEvent,'flash.events.FocusEvent',_super);
    var __proto=FocusEvent.prototype;

    __proto.clone=function()
    {
        return this;
    }

    __getset(0,__proto,'isRelatedObjectInaccessible',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'keyCode',
        function()
        {
            return this._keyCode;
        },
        function(value)
        {
            this._keyCode=value;
        }
    );

    __getset(0,__proto,'relatedObject',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'shiftKey',
        function()
        {
            return this._shiftKey;
        },
        function(value)
        {
            this._shiftKey=value;
        }
    );

    FocusEvent.FOCUS_IN="focusIn";
    FocusEvent.FOCUS_OUT="focusOut";
    FocusEvent.KEY_FOCUS_CHANGE="keyFocusChange";
    FocusEvent.MOUSE_FOCUS_CHANGE="mouseFocusChange";

    FocusEvent.toString=function(){return "[class FocusEvent]";};
    Mira.un_proto(FocusEvent);
    return FocusEvent;
})(Event);

var FullScreenEvent=(function(_super) {
    function FullScreenEvent(type,bubbles,cancelable,activating)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (activating===void 0) && (activating=false);
        FullScreenEvent.__super.call(this,type,bubbles,cancelable,activating);
    }

    __class(FullScreenEvent,'flash.events.FullScreenEvent',_super);
    var __proto=FullScreenEvent.prototype;

    __getset(0,__proto,'fullScreen',
        function()
        {
            return false;
        }
    );

    FullScreenEvent.FULL_SCREEN="fullScreen";

    FullScreenEvent.toString=function(){return "[class FullScreenEvent]";};
    return FullScreenEvent;
})(ActivityEvent);

var GeolocationEvent=(function(_super) {
    function GeolocationEvent(type,bubbles,cancelable,latitude,longitude,altitude,hAccuracy,vAccuracy,speed,heading,timestamp)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (latitude===void 0) && (latitude=0);
        (longitude===void 0) && (longitude=0);
        (altitude===void 0) && (altitude=0);
        (hAccuracy===void 0) && (hAccuracy=0);
        (vAccuracy===void 0) && (vAccuracy=0);
        (speed===void 0) && (speed=0);
        (heading===void 0) && (heading=0);
        (timestamp===void 0) && (timestamp=0);
        GeolocationEvent.__super.call(this,type,bubbles,cancelable,null);
        this.latitude=latitude;
        this.longitude=longitude;
        this.altitude=altitude;
        this.horizontalAccuracy=hAccuracy;
        this.verticalAccuracy=vAccuracy;
        this.speed=speed;
        this.heading=heading;
        this.timestamp=timestamp;
    }

    __class(GeolocationEvent,'flash.events.GeolocationEvent',_super);
    var __proto=GeolocationEvent.prototype;

    __getset(0,__proto,'altitude',
        function()
        {
            return this._altitude;
        },
        function(value)
        {
            this._altitude=value;
        }
    );

    __getset(0,__proto,'heading',
        function()
        {
            return this._heading;
        },
        function(value)
        {
            this._heading=value;
        }
    );

    __getset(0,__proto,'horizontalAccuracy',
        function()
        {
            return this._horizontalAccuracy;
        },
        function(value)
        {
            this._horizontalAccuracy=value;
        }
    );

    __getset(0,__proto,'latitude',
        function()
        {
            return this._latitude;
        },
        function(value)
        {
            this._latitude=value;
        }
    );

    __getset(0,__proto,'longitude',
        function()
        {
            return this._longitude;
        },
        function(value)
        {
            this._longitude=value;
        }
    );

    __getset(0,__proto,'speed',
        function()
        {
            return this._speed;
        },
        function(value)
        {
            this._speed=value;
        }
    );

    __getset(0,__proto,'timestamp',
        function()
        {
            return this._timestamp;
        },
        function(value)
        {
            this._timestamp=value;
        }
    );

    __getset(0,__proto,'verticalAccuracy',
        function()
        {
            return this._timestamp;
        },
        function(value)
        {
            this._verticalAccuracy=value;
        }
    );

    GeolocationEvent.getFromH5Event=function(evt)
    {
        var rst=new GeolocationEvent(GeolocationEvent.UPDATE);
        Event.copyFromByObj(rst,evt,GeolocationEvent.NAME_MAP);
        return rst;
    }

    GeolocationEvent.UPDATE="update";

    __static(GeolocationEvent,[
        'NAME_MAP',function(){return this.NAME_MAP={"latitude": "latitude","longitude": "longitude","altitude": "altitude","speed": "speed","horizontalAccuracy": "accuracy","verticalAccuracy": "altitudeAccuracy","heading": "heading"};}
    ]);

    GeolocationEvent.toString=function(){return "[class GeolocationEvent]";};
    return GeolocationEvent;
})(Event);

var GestureEvent=(function(_super) {
    function GestureEvent(type,bubbles,cancelable,phase,localX,localY,ctrlKey,altKey,shiftKey,commandKey,controlKey,_d)
    {
        this.altKey=false;
        this.controlKey=false;
        this.ctrlKey=false;
        this.commandKey=false;
        this.shiftKey=false;
        this.localX=0;
        this.localY=0;
        this.phase=null;
        this.__stageX__=0;
        this.__stageY__=0;
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (phase===void 0) && (phase=null);
        (localX===void 0) && (localX=0);
        (localY===void 0) && (localY=0);
        (ctrlKey===void 0) && (ctrlKey=false);
        (altKey===void 0) && (altKey=false);
        (shiftKey===void 0) && (shiftKey=false);
        (commandKey===void 0) && (commandKey=false);
        (controlKey===void 0) && (controlKey=false);
        (_d===void 0) && (_d=null);
        GestureEvent.__super.call(this,type,bubbles,cancelable,_d);
        this.altKey=altKey;
        this.controlKey=controlKey;
        this.ctrlKey=ctrlKey;
        this.commandKey=commandKey;
        this.shiftKey=shiftKey;
        this.localX=localX;
        this.localY=localY;
        this.phase=phase;
    }

    __class(GestureEvent,'flash.events.GestureEvent',_super);
    var __proto=GestureEvent.prototype;

    __proto.toMouseEvent=function()
    {
        _super.prototype.toMouseEvent.call(this);
        Event.__helpMouseEvt__.type=MouseEvent.CLICK;
        Event.__helpMouseEvt__.bubbles=this.bubbles;
        Event.__helpMouseEvt__.cancelable=this.cancelable;
        Event.__helpMouseEvt__.relatedObject=null;
        Event.__helpMouseEvt__.mCtrlKey=this.ctrlKey;
        Event.__helpMouseEvt__.mAltKey=this.altKey;
        Event.__helpMouseEvt__.mShiftKey=this.shiftKey;
        Event.__helpMouseEvt__.buttonDown=false;
        Event.__helpMouseEvt__._$target=this._$target;
        Event.__helpMouseEvt__._$eData=this._$eData;
        Event.__helpMouseEvt__._type_=this._type_;
        return Event.__helpMouseEvt__;
    }

    __proto.updateAfterEvent=function()
    {
    }

    __getset(0,__proto,'stageX',
        function()
        {
            return this.__stageX__;
        }
    );

    __getset(0,__proto,'stageY',
        function()
        {
            return this.__stageY__;
        }
    );

    GestureEvent.getGestureEvent=function()
    {
        if (GestureEvent._gestrueEvt==null)
            GestureEvent._gestrueEvt=new GestureEvent(GestureEvent.GESTURE_TWO_FINGER_TAP,true,false,GesturePhase.END);
        return GestureEvent._gestrueEvt;
    }

    GestureEvent.GESTURE_TWO_FINGER_TAP="gestureTwoFingerTap";
    GestureEvent._gestrueEvt=null;

    GestureEvent.toString=function(){return "[class GestureEvent]";};
    Mira.un_proto(GestureEvent);
    return GestureEvent;
})(Event);

var GesturePhase=(function() {
    function GesturePhase()
    {
    }

    __class(GesturePhase,'flash.events.GesturePhase');

    GesturePhase.ALL="all";
    GesturePhase.BEGIN="begin";
    GesturePhase.END="end";
    GesturePhase.UPDATE="update";

    __static(GesturePhase,[
        'GESTURE_PHASE_MAP_TOUCH',function(){return this.GESTURE_PHASE_MAP_TOUCH={"touchBegin": "begin","touchEnd": "end","touchMove": "update","touchOut": "all","touchOver": "all","touchRollOut": "all","touchRollOver": "all","touchTap": "end"};}
    ]);

    GesturePhase.toString=function(){return "[class GesturePhase]";};
    return GesturePhase;
})();

var HTTPStatusEvent=(function(_super) {
    function HTTPStatusEvent(type,bubbles,cancelable,_d)
    {
        this.m_status=0;
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (_d===void 0) && (_d=null);
        HTTPStatusEvent.__super.call(this,type,bubbles,cancelable,_d);
    }

    __class(HTTPStatusEvent,'flash.events.HTTPStatusEvent',_super);
    var __proto=HTTPStatusEvent.prototype;

    __getset(0,__proto,'responseHeaders',
        function()
        {
            return this.m_responseHeaders;
        },
        function(value)
        {
            this.m_responseHeaders=value;
        }
    );

    __getset(0,__proto,'responseURL',
        function()
        {
            return this.m_responseURL;
        },
        function(value)
        {
            this.m_responseURL=value;
        }
    );

    __getset(0,__proto,'status',
        function()
        {
            return this.m_status;
        }
    );

    HTTPStatusEvent.HTTP_RESPONSE_STATUS="httpResponseStatus";
    HTTPStatusEvent.HTTP_STATUS="httpStatus";

    HTTPStatusEvent.toString=function(){return "[class HTTPStatusEvent]";};
    return HTTPStatusEvent;
})(Event);

var IMEEvent=(function(_super) {
    function IMEEvent(type,bubbles,cancelable,text)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (text===void 0) && (text="");
        IMEEvent.__super.call(this,type,bubbles,cancelable,text);
    }

    __class(IMEEvent,'flash.events.IMEEvent',_super);
    var __proto=IMEEvent.prototype;

    __proto.clone=function()
    {
        return null;
    }

    __getset(0,__proto,'imeClient',
        function()
        {
            return null;
        },
        function(value)
        {
            ;
        }
    );

    IMEEvent.IME_COMPOSITION="imeComposition";
    IMEEvent.IME_START_COMPOSITION="imeStartComposition";

    IMEEvent.toString=function(){return "[class IMEEvent]";};
    Mira.un_proto(IMEEvent);
    return IMEEvent;
})(TextEvent);

var IOErrorEvent=(function(_super) {
    function IOErrorEvent(type,bubbles,cancelable,text,id)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (text===void 0) && (text="");
        (id===void 0) && (id=0);
        IOErrorEvent.__super.call(this,type,bubbles,cancelable,text,id);
    }

    __class(IOErrorEvent,'flash.events.IOErrorEvent',_super);

    IOErrorEvent.DISK_ERROR="disk_error";
    IOErrorEvent.IO_ERROR="ioError";
    IOErrorEvent.NETWORK_ERROR="network_error";
    IOErrorEvent.VERIFY_ERROR="verify_error";

    IOErrorEvent.toString=function(){return "[class IOErrorEvent]";};
    return IOErrorEvent;
})(ErrorEvent);

var KeyboardEvent=(function(_super) {
    function KeyboardEvent(type,bubbles,cancelable,charCodeValue,keyCodeValue,keyLocationValue,ctrlKeyValue,altKeyValue,shiftKeyValue)
    {
        this._altKey=false;
        this._charCode=0;
        this._ctrlKey=false;
        this._keyCode=0;
        this._keyLocation=0;
        this._shiftKey=false;
        (bubbles===void 0) && (bubbles=true);
        (cancelable===void 0) && (cancelable=false);
        (charCodeValue===void 0) && (charCodeValue=0);
        (keyCodeValue===void 0) && (keyCodeValue=0);
        (keyLocationValue===void 0) && (keyLocationValue=0);
        (ctrlKeyValue===void 0) && (ctrlKeyValue=false);
        (altKeyValue===void 0) && (altKeyValue=false);
        (shiftKeyValue===void 0) && (shiftKeyValue=false);
        KeyboardEvent.__super.call(this,type,bubbles,cancelable);
    }

    __class(KeyboardEvent,'flash.events.KeyboardEvent',_super);
    var __proto=KeyboardEvent.prototype;

    __proto.clone=function()
    {
        return null;
    }

    __proto.updateAfterEvent=function()
    {
    }

    __proto.changeEvent=function(e)
    {
        this._currentTarget_=e._currentTarget_;
        this.keyCode=e.keyCode;
        this._type_=e._type_;
        this._$target=e._$target;
        this.cancelable=e.cancelable;
        this.charCode=e.charCode;
        this.ctrlKey=e.ctrlKey;
        this.altKey=e.altKey;
        this.shiftKey=e.shiftKey;
    }

    __getset(0,__proto,'altKey',
        function()
        {
            return this._altKey;
        },
        function(value)
        {
            this._altKey=value;
        }
    );

    __getset(0,__proto,'charCode',
        function()
        {
            return this._charCode;
        },
        function(value)
        {
            this._charCode=value;
        }
    );

    __getset(0,__proto,'ctrlKey',
        function()
        {
            return this._ctrlKey;
        },
        function(value)
        {
            this._ctrlKey=value;
        }
    );

    __getset(0,__proto,'keyCode',
        function()
        {
            return this._keyCode;
        },
        function(value)
        {
            this._keyCode=value;
        }
    );

    __getset(0,__proto,'keyLocation',
        function()
        {
            return this._keyLocation;
        },
        function(value)
        {
            this._keyLocation=value;
        }
    );

    __getset(0,__proto,'shiftKey',
        function()
        {
            return this._shiftKey;
        },
        function(value)
        {
            this._shiftKey=value;
        }
    );

    KeyboardEvent.KEY_DOWN="keyDown";
    KeyboardEvent.KEY_UP="keyUp";

    KeyboardEvent.toString=function(){return "[class KeyboardEvent]";};
    Mira.un_proto(KeyboardEvent);
    return KeyboardEvent;
})(Event);

var MouseEvent=(function(_super) {
    function MouseEvent(type,bubbles,cancelable,localX,localY,relatedObject,ctrlKey,altKey,shiftKey,buttonDown,delta)
    {
        this.mShiftKey=false;
        this.mCtrlKey=false;
        this._buttonDown=false;
        this.mAltKey=false;
        this._localX=0;
        this._localY=0;
        this._delta=0;
        this.button=0;
        (bubbles===void 0) && (bubbles=true);
        (cancelable===void 0) && (cancelable=false);
        (localX===void 0) && (localX=NaN);
        (localY===void 0) && (localY=NaN);
        (relatedObject===void 0) && (relatedObject=null);
        (ctrlKey===void 0) && (ctrlKey=false);
        (altKey===void 0) && (altKey=false);
        (shiftKey===void 0) && (shiftKey=false);
        (buttonDown===void 0) && (buttonDown=false);
        (delta===void 0) && (delta=0);
        MouseEvent.__super.call(this,type,bubbles);
        this._timestamp_= -1.0;
        this.mShiftKey=shiftKey;
        this.mCtrlKey=ctrlKey;
        this.mAltKey=altKey;
        this._buttonDown=buttonDown;
        this.relatedObject=relatedObject;
        this._localX=localX;
        this._localY=localY;
        this.delta=delta;
    }

    __class(MouseEvent,'flash.events.MouseEvent',_super);
    var __proto=MouseEvent.prototype;

    __proto.getTouches=function(target,phase,result)
    {
        (phase===void 0) && (phase=null);
        (result===void 0) && (result=null);
        if (result==null)
            result=[];
        var allTouches=__as(this._$eData,Array);
        var numTouches=allTouches.length;
        for (var i=0;i<numTouches; ++i) {
            var touch=__as(allTouches[i],Touch);
            var correctTarget=touch.isTouching(target);
            var correctPhase=(phase==null || phase==touch._phase_);
            if (correctTarget && correctPhase)
                result[result.length]=touch;
        }
        return result;
    }

    __proto.getTouch=function(target,phase,id)
    {
        (phase===void 0) && (phase=null);
        (id===void 0) && (id= -1);
        this.getTouches(target,phase,MouseEvent.sTouches);
        var numTouches=MouseEvent.sTouches.length;
        if (numTouches>0) {
            var touch=null;
            if (id<0)
                touch=MouseEvent.sTouches[0];
            else {
                for (var i=0;i<numTouches; ++i)
                    if (MouseEvent.sTouches[i].id==id) {
                        touch=MouseEvent.sTouches[i];
                        break;
                    }
            }
            MouseEvent.sTouches.length=0;
            return touch;
        } else
            return null;
    }

    __proto.interactsWith=function(target)
    {
        var result=false;
        this.getTouches(target,null,MouseEvent.sTouches);
        for (var i=MouseEvent.sTouches.length-1;i>=0; --i) {
            if (MouseEvent.sTouches[i]._phase_!=TouchPhase.ENDED) {
                result=true;
                break;
            }
        }
        MouseEvent.sTouches.length=0;
        return result;
    }

    __proto.updateAfterEvent=function()
    {
    }

    __proto.toMouseEvent=function()
    {
        return this;
    }

    __proto.clone=function()
    {
        var e=new MouseEvent(this.type,this.bubbles,this.cancelable,this.localX,this.localY,null,this.ctrlKey,this.altKey,this.shiftKey,this.buttonDown,this.delta);
        e.clientX=this.clientX;
        e.clientY=this.clientY;
        e.offsetX=this.offsetX;
        e.offsetY=this.offsetY;
        e._localX=this._localX;
        e._localY=this._localY;
        e.nativeEvent=this.nativeEvent;
        e.touchEvent=this.touchEvent;
        return e;
    }

    __proto.destory=function()
    {
        this.nativeEvent=null;
        this._$edata=null;
        this._$target=null;
        this.touchEvent=null;
        this.relatedObject=null;
        _super.prototype.destory.call(this);
    }

    __getset(0,__proto,'stageX',
        function()
        {
            return EventManager._stageX;
        }
    );

    __getset(0,__proto,'stageY',
        function()
        {
            return EventManager._stageY;
        }
    );

    __getset(0,__proto,'localY',
        function()
        {
            if (this._$target==null) {
                return this._localY;
            }
            return this._$target.mouseY;
        }
    );

    __getset(0,__proto,'localX',
        function()
        {
            if (this._$target==null) {
                return this._localX;
            }
            return this._$target.mouseX;
        }
    );

    __getset(0,__proto,'_$eData',null,
        function(value)
        {
            _super.prototype._$set__$eData.call(this,value);
            if (!value)
                return;
            var numTouches=this._$edata.length|0;
            for (var i=0;i<numTouches; ++i)
                if (this._$edata[i]._timestamp_>this._timestamp_)
                    this._timestamp_=this._$edata[i]._timestamp_;
        }
    );

    __getset(0,__proto,'delta',
        function()
        {
            return this._delta;
        },
        function(value)
        {
            this._delta=value;
        }
    );

    __getset(0,__proto,'timestamp',
        function()
        {
            return this._timestamp_;
        }
    );

    __getset(0,__proto,'touches',
        function()
        {
            return (__as(this._$eData,Array)).concat();
        }
    );

    __getset(0,__proto,'shiftKey',
        function()
        {
            return this.mShiftKey;
        }
    );

    __getset(0,__proto,'altKey',
        function()
        {
            return this.mAltKey;
        }
    );

    __getset(0,__proto,'ctrlKey',
        function()
        {
            return this.mCtrlKey;
        }
    );

    __getset(0,__proto,'buttonDown',
        function()
        {
            return this._buttonDown;
        },
        function(value)
        {
            this._buttonDown=value;
        }
    );

    MouseEvent.getSignType=function(type)
    {
        type=type.toLowerCase();
        if (type==MouseEvent.MOUSE_OVER || type===TouchEvent.TOUCH_OVER) {
            return MouseEvent.MOUSE_OVER;
        } else if (type==MouseEvent.MOUSE_OUT || type===TouchEvent.TOUCH_OUT) {
            return MouseEvent.MOUSE_OUT;
        } else if (type==MouseEvent.MOUSE_DOWN || type===TouchEvent.TOUCH_BEGIN) {
            return MouseEvent.MOUSE_DOWN;
        } else if (type==MouseEvent.MOUSE_UP || type===TouchEvent.TOUCH_END) {
            return MouseEvent.MOUSE_UP;
        } else if (type==MouseEvent.CLICK || type===TouchEvent.TOUCH_TAP) {
            return MouseEvent.CLICK;
        } else if (type==MouseEvent.MOUSE_MOVE || type===TouchEvent.TOUCH_MOVE) {
            return MouseEvent.MOUSE_MOVE;
        } else if (type==MouseEvent.ROLL_OUT || type===TouchEvent.TOUCH_ROLL_OUT) {
            return MouseEvent.ROLL_OUT;
        } else if (type==MouseEvent.ROLL_OVER || type===TouchEvent.TOUCH_ROLL_OVER) {
            return MouseEvent.ROLL_OVER;
        }
        return type;
    }

    MouseEvent.copyFromSysEvent=function(e)
    {
        var event=new MouseEvent(MouseEvent.SYS_MOUSE_INPUT_MAP[e.type],e.bubbles,e.cancelable,NaN,NaN,null,e.ctrlKey,e.altKey,e.shiftKey,e.buttons!=0,0);
        event.button=e.button || 0;
        if (e["delta"]!=undefined) {
            event.delta=e.delta|0;
        } else {
            event.delta=(e.wheelDeltaY ? e.wheelDeltaY/40 : 0)|0;
        }
        event.nativeEvent=e;
        return event;
    }

    MouseEvent.CLICK="click";
    MouseEvent.DOUBLE_CLICK="doubleClick";
    MouseEvent.MOUSE_DOWN="mouseDown";
    MouseEvent.MOUSE_MOVE="mouseMove";
    MouseEvent.MOUSE_OUT="mouseOut";
    MouseEvent.MOUSE_OVER="mouseOver";
    MouseEvent.MOUSE_UP="mouseUp";
    MouseEvent.MOUSE_WHEEL="mouseWheel";
    MouseEvent.ROLL_OUT="rollOut";
    MouseEvent.ROLL_OVER="rollOver";
    MouseEvent.MIDDLE_CLICK="middleClick";
    MouseEvent.MIDDLE_MOUSE_DOWN="middleMouseDown";
    MouseEvent.MIDDLE_MOUSE_UP="middleMouseUp";
    MouseEvent.RIGHT_CLICK="rightClick";
    MouseEvent.RIGHT_MOUSE_DOWN="rightMouseDown";
    MouseEvent.RIGHT_MOUSE_UP="rightMouseUp";
    MouseEvent.FOCUS="focus";
    MouseEvent.BLUR="blur";
    MouseEvent.MOUSE_DRAG="drag";
    MouseEvent.MOUSE_DRAG_START="dragstart";
    MouseEvent.MOUSE_DRAG_END="dragend";

    __static(MouseEvent,[
        'SYS_MOUSE_INPUT_MAP',function(){return this.SYS_MOUSE_INPUT_MAP={"mousedown": "mouseDown","mouseup": "mouseUp","mousemove": "mouseMove","mousewheel": "mouseWheel"};},
        'sTouches',function(){return this.sTouches=[];}
    ]);

    MouseEvent.toString=function(){return "[class MouseEvent]";};
    Mira.un_proto(MouseEvent);
    return MouseEvent;
})(Event);

var NetStatusEvent=(function(_super) {
    function NetStatusEvent(type,bubbles,cancelable,info)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (info===void 0) && (info=null);
        this.info=info;
        NetStatusEvent.__super.call(this,type,bubbles,cancelable);
    }

    __class(NetStatusEvent,'flash.events.NetStatusEvent',_super);

    NetStatusEvent.NET_STATUS="netStatus";

    NetStatusEvent.toString=function(){return "[class NetStatusEvent]";};
    return NetStatusEvent;
})(Event);

var PressAndTapGestureEvent=(function(_super) {
    function PressAndTapGestureEvent(type,bubbles,cancelable,phase,localX,localY,ctrlKey,altKey,shiftKey,commandKey,controlKey,_d)
    {
        this.tapLocalX=0;
        this.tapLocalY=0;
        this.tapStageX=0;
        this.tapStageY=0;
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (phase===void 0) && (phase=null);
        (localX===void 0) && (localX=0);
        (localY===void 0) && (localY=0);
        (ctrlKey===void 0) && (ctrlKey=false);
        (altKey===void 0) && (altKey=false);
        (shiftKey===void 0) && (shiftKey=false);
        (commandKey===void 0) && (commandKey=false);
        (controlKey===void 0) && (controlKey=false);
        (_d===void 0) && (_d=null);
        PressAndTapGestureEvent.__super.call(this,type,bubbles,cancelable,phase,localX,localY,ctrlKey,altKey,shiftKey,commandKey,controlKey,_d);
    }

    __class(PressAndTapGestureEvent,'flash.events.PressAndTapGestureEvent',_super);

    PressAndTapGestureEvent.getInstance=function()
    {
        if (PressAndTapGestureEvent._instance==null)
            PressAndTapGestureEvent._instance=new PressAndTapGestureEvent(PressAndTapGestureEvent.GESTURE_PRESS_AND_TAP,true,false,GesturePhase.ALL);
        return PressAndTapGestureEvent._instance;
    }

    PressAndTapGestureEvent.GESTURE_PRESS_AND_TAP="gesturePressAndTap";
    PressAndTapGestureEvent._instance=null;

    PressAndTapGestureEvent.toString=function(){return "[class PressAndTapGestureEvent]";};
    return PressAndTapGestureEvent;
})(GestureEvent);

var ProgressEvent=(function(_super) {
    function ProgressEvent(type,bubbles,cancelable,bytesLoaded,bytesTotal)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (bytesLoaded===void 0) && (bytesLoaded=0);
        (bytesTotal===void 0) && (bytesTotal=0);
        ProgressEvent.__super.call(this,type,bubbles,cancelable);
        this._bytesLoaded=bytesLoaded;
        this._bytesTotal=bytesTotal;
    }

    __class(ProgressEvent,'flash.events.ProgressEvent',_super);
    var __proto=ProgressEvent.prototype;

    __getset(0,__proto,'bytesLoaded',
        function()
        {
            return this._bytesLoaded;
        },
        function(value)
        {
            this._bytesLoaded=value;
        }
    );

    __getset(0,__proto,'bytesTotal',
        function()
        {
            return this._bytesTotal;
        },
        function(value)
        {
            this._bytesTotal=value;
        }
    );

    ProgressEvent.PROGRESS="progress";
    ProgressEvent.SOCKET_DATA="socketData";

    ProgressEvent.toString=function(){return "[class ProgressEvent]";};
    return ProgressEvent;
})(Event);

var SampleDataEvent=(function(_super) {
    function SampleDataEvent(type,bubbles,cancelable,theposition,thedata)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (theposition===void 0) && (theposition=0);
        (thedata===void 0) && (thedata=null);
        SampleDataEvent.__super.call(this,type,bubbles);
    }

    __class(SampleDataEvent,'flash.events.SampleDataEvent',_super);
    var __proto=SampleDataEvent.prototype;

    __getset(0,__proto,'data',
        function()
        {
            return null;
        },
        function(thedata)
        {
        }
    );

    __getset(0,__proto,'position',
        function()
        {
            return 0;
        },
        function(theposition)
        {
        }
    );

    SampleDataEvent.SAMPLE_DATA="sampleData";

    SampleDataEvent.toString=function(){return "[class SampleDataEvent]";};
    return SampleDataEvent;
})(Event);

var SecurityErrorEvent=(function(_super) {
    function SecurityErrorEvent(type,bubbles,cancelable,text,id)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (text===void 0) && (text="");
        (id===void 0) && (id=0);
        SecurityErrorEvent.__super.call(this,type,bubbles,cancelable,text,id);
    }

    __class(SecurityErrorEvent,'flash.events.SecurityErrorEvent',_super);

    SecurityErrorEvent.SECURITY_ERROR="securityError";

    SecurityErrorEvent.toString=function(){return "[class SecurityErrorEvent]";};
    return SecurityErrorEvent;
})(ErrorEvent);

var ShaderEvent=(function(_super) {
    function ShaderEvent(type,bubbles,cancelable,bitmap,array,vector)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (bitmap===void 0) && (bitmap=null);
        (array===void 0) && (array=null);
        (vector===void 0) && (vector=null);
        ShaderEvent.__super.call(this,type);
    }

    __class(ShaderEvent,'flash.events.ShaderEvent',_super);
    var __proto=ShaderEvent.prototype;

    __proto.clone=function()
    {
        return null;
    }

    __getset(0,__proto,'bitmapData',
        function()
        {
            return null;
        },
        function(bmpData)
        {
        }
    );

    __getset(0,__proto,'byteArray',
        function()
        {
            return null;
        },
        function(bArray)
        {
        }
    );

    __getset(0,__proto,'vector',
        function()
        {
            return null;
        },
        function(v)
        {
        }
    );

    ShaderEvent.COMPLETE="complete";

    ShaderEvent.toString=function(){return "[class ShaderEvent]";};
    Mira.un_proto(ShaderEvent);
    return ShaderEvent;
})(Event);

var StageOrientationEvent=(function(_super) {
    function StageOrientationEvent(type,bubbles,cancelable,beforeOrientation,afterOrientation)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (beforeOrientation===void 0) && (beforeOrientation=null);
        (afterOrientation===void 0) && (afterOrientation=null);
        this.beforeOrientation=beforeOrientation;
        this.afterOrientation=afterOrientation;
        StageOrientationEvent.__super.call(this,type,bubbles,cancelable,null);
    }

    __class(StageOrientationEvent,'flash.events.StageOrientationEvent',_super);

    StageOrientationEvent.ORIENTATION_CHANGE="orientationChange";
    StageOrientationEvent.ORIENTATION_CHANGING="orientationChanging";

    StageOrientationEvent.toString=function(){return "[class StageOrientationEvent]";};
    return StageOrientationEvent;
})(Event);

var StatusEvent=(function(_super) {
    function StatusEvent(type,bubbles,cancelable,code,level)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (code===void 0) && (code=null);
        (level===void 0) && (level="");
        StatusEvent.__super.call(this,type,bubbles,cancelable);
        this._code=code;
        this._level=level;
    }

    __class(StatusEvent,'flash.events.StatusEvent',_super);
    var __proto=StatusEvent.prototype;

    __getset(0,__proto,'code',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'level',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    StatusEvent.STATUS="status";

    StatusEvent.toString=function(){return "[class StatusEvent]";};
    return StatusEvent;
})(Event);

var SyncEvent=(function(_super) {
    function SyncEvent(type,bubbles,cancelable,_d)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (_d===void 0) && (_d=null);
        SyncEvent.__super.call(this,type,bubbles,cancelable,_d);
    }

    __class(SyncEvent,'flash.events.SyncEvent',_super);
    var __proto=SyncEvent.prototype;

    __proto.clone=function()
    {
        return null;
    }

    __getset(0,__proto,'changeList',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    SyncEvent.SYNC="sync";

    SyncEvent.toString=function(){return "[class SyncEvent]";};
    Mira.un_proto(SyncEvent);
    return SyncEvent;
})(Event);

var ThrottleEvent=(function(_super) {
    function ThrottleEvent(type,bubbles,cancelable,state,targetFrameRate)
    {
        this._targetFrameRate=0.0;
        this._state=ThrottleType.RESUME;
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (state===void 0) && (state=null);
        (targetFrameRate===void 0) && (targetFrameRate=0);
        ThrottleEvent.__super.call(this,type,bubbles,cancelable);
        this._state=state;
        this._targetFrameRate=targetFrameRate;
    }

    __class(ThrottleEvent,'flash.events.ThrottleEvent',_super);
    var __proto=ThrottleEvent.prototype;

    __proto.clone=function()
    {
        return new ThrottleEvent(ThrottleType.THROTTLE);
    }

    __getset(0,__proto,'state',
        function()
        {
            return this._state;
        }
    );

    __getset(0,__proto,'targetFrameRate',
        function()
        {
            if (this._state==ThrottleType.PAUSE)
                return 0.0;
            else if (this._state==ThrottleType.THROTTLE)
                return 2.0;
            else
                return this._targetFrameRate;
        }
    );

    ThrottleEvent.THROTTLE="throttle";

    ThrottleEvent.toString=function(){return "[class ThrottleEvent]";};
    Mira.un_proto(ThrottleEvent);
    return ThrottleEvent;
})(Event);

var ThrottleType=(function() {
    function ThrottleType()
    {
    }

    __class(ThrottleType,'flash.events.ThrottleType');

    ThrottleType.PAUSE="pause";
    ThrottleType.RESUME="resume";
    ThrottleType.THROTTLE="throttle";

    ThrottleType.toString=function(){return "[class ThrottleType]";};
    return ThrottleType;
})();

var TimerEvent=(function(_super) {
    function TimerEvent(type,bubbles,cancelable)
    {
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        TimerEvent.__super.call(this,type,bubbles,cancelable);
    }

    __class(TimerEvent,'flash.events.TimerEvent',_super);
    var __proto=TimerEvent.prototype;

    __proto.clone=function()
    {
        return null;
    }

    __proto.updateAfterEvent=function()
    {
    }

    __proto.toString=function()
    {
        return "["+"TimerEvent"+" type="+this.type+" bubbles="+this.bubbles+" cancelable="+this.cancelable+" eventPhase="+this.eventPhase+"]";
    }

    TimerEvent.TIMER="timer";
    TimerEvent.TIMER_COMPLETE="timerComplete";

    TimerEvent.toString=function(){return "[class TimerEvent]";};
    Mira.un_proto(TimerEvent);
    return TimerEvent;
})(Event);

var Touch=(function() {
    function Touch(id)
    {
        this._id_=0;
        this._tapCount_=0;
        this._id_=id;
        this._tapCount_=0;
        this._phase_=TouchPhase.HOVER;
        this._pressure_=this._width_=this._height_=1.0;
        this._bubbleChain_=[];
    }

    __class(Touch,'flash.events.Touch');
    var __proto=Touch.prototype;

    __proto.getLocation=function(space,resultPoint)
    {
        (resultPoint===void 0) && (resultPoint=null);
        Touch.SHELPER_POINT.setTo(this._globalX_,this._globalY_);
        space.globalToLocal(Touch.SHELPER_POINT,resultPoint);
        return resultPoint;
    }

    __proto.getPreviousLocation=function(space,resultPoint)
    {
        (resultPoint===void 0) && (resultPoint=null);
        Touch.SHELPER_POINT.setTo(this._previousGlobalX_,this._previousGlobalY_);
        return space.globalToLocal(Touch.SHELPER_POINT,resultPoint);
    }

    __proto.getMovement=function(space,resultPoint)
    {
        (resultPoint===void 0) && (resultPoint=null);
        if (resultPoint==null)
            resultPoint=new Point();
        this.getLocation(space,resultPoint);
        var x=resultPoint.x;
        var y=resultPoint.y;
        this.getPreviousLocation(space,resultPoint);
        resultPoint.setTo(x-resultPoint.x,y-resultPoint.y);
        return resultPoint;
    }

    __proto.isTouching=function(target)
    {
        return this._bubbleChain_.indexOf(target)!= -1;
    }

    __proto.clone=function()
    {
        var result=new Touch(this._id_);
        result._globalX_=this._globalX_;
        result._globalY_=this._globalY_;
        result._previousGlobalX_=this._previousGlobalX_;
        result._previousGlobalY_=this._previousGlobalY_;
        result._phase_=this._phase_;
        result._tapCount_=this._tapCount_;
        result._timestamp_=this._timestamp_;
        result._pressure_=this._pressure_;
        result._width_=this._width_;
        result._height_=this._height_;
        result.target=this._target_;
        result.touchType=this.touchType;
        result.nativeEvent=this.nativeEvent;
        return result;
    }

    __proto.updateBubbleChain=function()
    {
        if (this._target_) {
            var length=1;
            var element=this._target_;
            this._bubbleChain_.length=1;
            this._bubbleChain_[0]=element;
            while ((element=__as(element.parent,DisplayObject))!=null)
                this._bubbleChain_[int(length++)]=element;
        } else
            this._bubbleChain_.length=0;
    }

    __proto.dispatchEvent=function(event)
    {
        this._target_ && event.dispatch(this._bubbleChain_);
    }

    __getset(0,__proto,'id',
        function()
        {
            return this._id_;
        }
    );

    __getset(0,__proto,'previousGlobalX',
        function()
        {
            return this._previousGlobalX_;
        }
    );

    __getset(0,__proto,'previousGlobalY',
        function()
        {
            return this._previousGlobalY_;
        }
    );

    __getset(0,__proto,'globalX',
        function()
        {
            return this._globalX_;
        },
        function(value)
        {
            this._previousGlobalX_=this._globalX_!=this._globalX_ ? value : this._globalX_;
            this._globalX_=value;
        }
    );

    __getset(0,__proto,'globalY',
        function()
        {
            return this._globalY_;
        },
        function(value)
        {
            this._previousGlobalY_=this._globalY_!=this._globalY_ ? value : this._globalY_;
            this._globalY_=value;
        }
    );

    __getset(0,__proto,'target',
        function()
        {
            return this._target_;
        },
        function(value)
        {
            if (this._target_!=value) {
                this._target_=value;
                this.updateBubbleChain();
            }
        }
    );

    __getset(0,__proto,'bubbleChain',
        function()
        {
            return this._bubbleChain_.concat();
        }
    );

    __static(Touch,[
        'SHELPER_MATRIX',function(){return this.SHELPER_MATRIX=new Matrix();},
        'SHELPER_POINT',function(){return this.SHELPER_POINT=new Point();}
    ]);

    Touch.toString=function(){return "[class Touch]";};
    Mira.un_proto(Touch);
    return Touch;
})();

var TouchEvent=(function(_super) {
    function TouchEvent(type,bubbles,cancelable,touchPointID,isPrimaryTouchPoint,localX,localY,sizeX,sizeY,pressure,relatedObject,ctrlKey,altKey,shiftKey,commandKey,controlKey,timestamp,touchIntent,samples,isTouchPointCanceled,_d)
    {
        this.altKey=false;
        this.commandKey=false;
        this.controlKey=false;
        this.ctrlKey=false;
        this.shiftKey=false;
        this.isPrimaryTouchPoint=false;
        this.timestamp=0;
        this.isTouchPointCanceled=false;
        this._localX=0.0;
        this._localY=0.0;
        this.sizeX=0.0;
        this.sizeY=0.0;
        this.pressure=0.0;
        this.touchPointID=0;
        (bubbles===void 0) && (bubbles=true);
        (cancelable===void 0) && (cancelable=false);
        (touchPointID===void 0) && (touchPointID=0);
        (isPrimaryTouchPoint===void 0) && (isPrimaryTouchPoint=false);
        (localX===void 0) && (localX=NaN);
        (localY===void 0) && (localY=NaN);
        (sizeX===void 0) && (sizeX=NaN);
        (sizeY===void 0) && (sizeY=NaN);
        (pressure===void 0) && (pressure=NaN);
        (relatedObject===void 0) && (relatedObject=null);
        (ctrlKey===void 0) && (ctrlKey=false);
        (altKey===void 0) && (altKey=false);
        (shiftKey===void 0) && (shiftKey=false);
        (commandKey===void 0) && (commandKey=false);
        (controlKey===void 0) && (controlKey=false);
        (timestamp===void 0) && (timestamp=NaN);
        (touchIntent===void 0) && (touchIntent="unknown");
        (samples===void 0) && (samples=null);
        (isTouchPointCanceled===void 0) && (isTouchPointCanceled=false);
        (_d===void 0) && (_d=null);
        TouchEvent.__super.call(this,type,bubbles,cancelable,_d);
        this.touchPointID=touchPointID;
        this.isPrimaryTouchPoint=isPrimaryTouchPoint;
        this._localX=localX;
        this._localY=localY;
        this.sizeX=sizeX;
        this.sizeY=sizeY;
        this.pressure=pressure;
        this.relatedObject=relatedObject;
        this.ctrlKey=ctrlKey;
        this.altKey=altKey;
        this.shiftKey=shiftKey;
        this.commandKey=commandKey;
        this.controlKey=controlKey;
        this.timestamp=timestamp|0;
        this.touchIntent=touchIntent;
        this.samples=samples;
        this.isTouchPointCanceled=isTouchPointCanceled;
    }

    __class(TouchEvent,'flash.events.TouchEvent',_super);
    var __proto=TouchEvent.prototype;

    __proto.updateAfterEvent=function()
    {
    }

    __proto.toMouseEvent=function()
    {
        _super.prototype.toMouseEvent.call(this);
        Event.__helpMouseEvt__.type=__string(TouchEvent.MOUSE_INPUT_TO_TOUCH_MAP[this.type]);
        Event.__helpMouseEvt__.bubbles=this.bubbles;
        Event.__helpMouseEvt__.cancelable=this.cancelable;
        Event.__helpMouseEvt__.relatedObject=this.relatedObject;
        Event.__helpMouseEvt__.mCtrlKey=this.ctrlKey;
        Event.__helpMouseEvt__.mAltKey=this.altKey;
        Event.__helpMouseEvt__.mShiftKey=this.shiftKey;
        Event.__helpMouseEvt__.buttonDown=true;
        Event.__helpMouseEvt__._$target=this._$target;
        Event.__helpMouseEvt__._$eData=this._$eData;
        Event.__helpMouseEvt__._type_=this._type_;
        Event.__helpMouseEvt__.touchEvent=this;
        return Event.__helpMouseEvt__;
    }

    __proto.clone=function()
    {
        var tEvt=new TouchEvent(this.type,this.bubbles,this.cancelable,this.touchPointID,this.isPrimaryTouchPoint,this._localX,this._localY,this.sizeX,this.sizeY,this.pressure,this.relatedObject,this.ctrlKey,this.altKey,this.shiftKey,this.commandKey,this.controlKey,this.timestamp,this.touchIntent,this.samples,this.isTouchPointCanceled,this._$eData);
        return tEvt;
    }

    __proto.destory=function()
    {
        this.samples=null;
        this.relatedObject=null;
        _super.prototype.destory.call(this);
    }

    __getset(0,__proto,'localY',
        function()
        {
            if (this._$target) {
                this._localY=this._$target.mouseY;
            }
            return this._localY;
        }
    );

    __getset(0,__proto,'localX',
        function()
        {
            if (this._$target) {
                this._localX=this._$target.mouseX;
            }
            return this._localX;
        }
    );

    __getset(0,__proto,'stageX',
        function()
        {
            return EventManager._stageX;
        }
    );

    __getset(0,__proto,'stageY',
        function()
        {
            return EventManager._stageY;
        }
    );

    TouchEvent.isTypeMove=function(type)
    {
        return type=="touchmove" || type=="mousemove";
    }

    TouchEvent.isTouchType=function(type)
    {
        return type.indexOf("touch")!= -1;
    }

    TouchEvent.touchSysEvent=function(touchEvent,callbackFunc)
    {
        (callbackFunc===void 0) && (callbackFunc=null);
        var len=touchEvent.changedTouches.length|0;
        var evt,changedTouch=null,touch;
        for (var i=0;i<len;i++) {
            changedTouch=touchEvent.changedTouches[i];
            evt=new TouchEvent(TouchEvent.SYS_TOUCH_INPUT_MAP[touchEvent.type],touchEvent.bubbles,touchEvent.cancelable,changedTouch.identifier,i==0,0.0,0.0,changedTouch.radiusX,changedTouch.radiusY,changedTouch.force,null,touchEvent.ctrlKey,touchEvent.altKey,touchEvent.shiftKey,false,false,touchEvent.timeStamp,"unknown",null,false,null);
            EventManager.clientToStage(changedTouch.clientX,changedTouch.clientY);
            if (callbackFunc!=null)
                callbackFunc(evt);
        }
    }

    TouchEvent.TOUCH_BEGIN="touchBegin";
    TouchEvent.TOUCH_END="touchEnd";
    TouchEvent.TOUCH_MOVE="touchMove";
    TouchEvent.TOUCH_OUT="touchOut";
    TouchEvent.TOUCH_OVER="touchOver";
    TouchEvent.TOUCH_ROLL_OUT="touchRollOut";
    TouchEvent.TOUCH_ROLL_OVER="touchRollOver";
    TouchEvent.TOUCH_TAP="touchTap";

    __static(TouchEvent,[
        'MOUSE_INPUT_TO_TOUCH_MAP',function(){return this.MOUSE_INPUT_TO_TOUCH_MAP={"mouseDown": "touchBegin","mouseUp": "touchEnd","mouseMove": "touchMove","mouseOut": "touchOut","mouseOver": "touchOver","rollOut": "touchRollOut","rollOver": "touchRollOver","click": "touchTap","touchBegin": "mouseDown","touchEnd": "mouseUp","touchMove": "mouseMove","touchOut": "mouseOut","touchOver": "mouseOver","touchRollOut": "rollOut","touchRollOver": "rollOver","touchTap": "click"};},
        'SYS_TOUCH_INPUT_MAP',function(){return this.SYS_TOUCH_INPUT_MAP={"touchstart": "touchBegin","touchmove": "touchMove","touchend": "touchEnd","touchcancel": "touchEnd"};}
    ]);

    TouchEvent.toString=function(){return "[class TouchEvent]";};
    Mira.un_proto(TouchEvent);
    return TouchEvent;
})(Event);

var TouchEventIntent=(function() {
    function TouchEventIntent()
    {
    }

    __class(TouchEventIntent,'flash.events.TouchEventIntent');

    TouchEventIntent.ERASER="eraser";
    TouchEventIntent.PEN="pen";
    TouchEventIntent.UNKNOWN="unknown";

    TouchEventIntent.toString=function(){return "[class TouchEventIntent]";};
    return TouchEventIntent;
})();

var TouchInfo=(function() {
    function TouchInfo(evt)
    {
        this.touchPointID=0;
        this.startTimestamp=0;
        this.endTimestamp=0;
        this.stageX=0;
        this.stageY=0;
        this.startX=0;
        this.startY=0;
        this.endX=0;
        this.endY=0;
        this.bubbleChain=[];
        this.touchEvent=evt;
        this.touchPointID=evt.touchPointID;
    }

    __class(TouchInfo,'flash.events.TouchInfo');
    var __proto=TouchInfo.prototype;

    __proto.touchBegin=function(event)
    {
        this.startTimestamp=event.timestamp;
        this.startX=event.stageX|0;
        this.startY=event.stageY|0;
        this.stageX=this.startX;
        this.stageY=this.startY;
        this.endX=this.startX;
        this.endY=this.startY;
        this.touchDownTarget=this.curChainTop;
    }

    __proto.touchEnd=function(event)
    {
        this.endTimestamp=event.timestamp;
        this.endX=event.stageX|0;
        this.endY=event.stageY|0;
        this.stageX=this.endX;
        this.stageY=this.endY;
    }

    __proto.touchMove=function(event)
    {
        this.stageX=event.stageX|0;
        this.stageY=event.stageY|0;
    }

    __proto.destory=function()
    {
        for (var i=0;i<TouchInfo.touchs.length;i++) {
            if (this.touchPointID==TouchInfo.touchs[i].touchPointID) {
                TouchInfo.touchs.splice(i,1);
                break;
            }
        }
        delete TouchInfo.touchInfos[this.touchPointID];
        this.bubbleChain=null;
        this.chainTop=null;
        this.curChainTop=null;
        this.touchDownTarget=null;
        this.touchEvent=null;
    }

    __getset(0,__proto,'localX',
        function()
        {
            return this.curChainTop.mouseX|0;
        }
    );

    __getset(0,__proto,'localY',
        function()
        {
            return this.curChainTop.mouseY|0;
        }
    );

    TouchInfo.getTouchInfo=function(touchEvent)
    {
        var touchInfo=TouchInfo.touchInfos[touchEvent.touchPointID];
        if (touchInfo==null) {
            touchInfo=TouchInfo.touchInfos[touchEvent.touchPointID]=new TouchInfo(touchEvent);
            TouchInfo.touchs.push(touchInfo);
        }
        return touchInfo;
    }

    TouchInfo.dealGestrueHandler=function(touchEvent)
    {
        var tLen=TouchInfo.touchs.length;
        if (tLen==2 && touchEvent.type==TouchEvent.TOUCH_BEGIN) {
            TouchInfo.twoFingerGapTime=Math.abs(TouchInfo.touchs[1].startTimestamp-TouchInfo.touchs[0].startTimestamp)|0;
            TouchInfo.twoFignerDownTime=TouchInfo.touchs[0].startTimestamp;
            TouchInfo.isTwoFingerDown=true;
            TouchInfo.twoFignerDownCount=1;
        } else if (tLen!=2 && touchEvent.type==TouchEvent.TOUCH_END) {
            TouchInfo.isTwoFingerDown=false;
            TouchInfo.twoFignerDownCount=0;
        }
        if (touchEvent.type==TouchEvent.TOUCH_TAP) {
            if (tLen==2 && TouchInfo.twoFingerGapTime<TouchInfo.TWO_FINGER_GAP_MIN_TIME) {
                var twoFingerTapTime=touchEvent.timestamp-TouchInfo.twoFignerDownTime;
                if (twoFingerTapTime-TouchInfo.TWO_FINGER_GAP_MIN_TIME<50) {
                    var ge=GestureEvent.getGestureEvent();
                    ge._$target=touchEvent.target;
                    return ge;
                }
            }
        }
        var twoFingerTapTime2=touchEvent.timestamp-TouchInfo.twoFignerDownTime;
        if (tLen==2 && twoFingerTapTime2>120 && (touchEvent.type==TouchEvent.TOUCH_MOVE || touchEvent.type==TouchEvent.TOUCH_END)) {
            var transformTouchInfo=TouchInfo.touchInfos[touchEvent.touchPointID];
            var t0=TouchInfo.touchInfos[0];
            var t1=TouchInfo.touchInfos[1];
            var transformTouchEvt=new TransformGestureEvent("",true,false,GesturePhase.GESTURE_PHASE_MAP_TOUCH[touchEvent.type]);
            transformTouchEvt.localX=touchEvent.localX;
            transformTouchEvt.localY=touchEvent.localY;
            transformTouchEvt._$target=touchEvent._$target;
            transformTouchEvt.shiftKey=touchEvent.shiftKey;
            transformTouchEvt.ctrlKey=touchEvent.ctrlKey;
            transformTouchEvt.altKey=touchEvent.altKey;
            transformTouchEvt.offsetX=touchEvent.stageX-transformTouchInfo.stageX;
            transformTouchEvt.offsetY=touchEvent.stageY-transformTouchInfo.stageY;
            if (TouchInfo.twoFignerTouchType==TouchEvent.TOUCH_END) {
                TouchInfo.twoFignerTouchType="";
                return null;
            }
            TouchInfo.twoFignerTouchType=touchEvent.type;
            if ((t0.stageX-t0.startX)*(t1.stageX-t1.startX)>TouchInfo.TRANSFORM_MIN_SIZE && (t0.stageY-t0.startY)*(t1.stageY-t1.startY)>TouchInfo.TRANSFORM_MIN_SIZE) {
                transformTouchEvt.type=TransformGestureEvent.GESTURE_PAN;
            } else {
                if (TouchInfo.twoFignerDownCount>0) {
                    transformTouchEvt.phase=GesturePhase.BEGIN;
                    TouchInfo.twoFignerDownCount=0;
                }
                var startVectorX=t1.startX-t0.startX;
                var startVectorY=t1.startY-t0.startY;
                var startDis=Math.sqrt(startVectorX*startVectorX+startVectorY*startVectorY);
                var nowVectorX=t1.stageX-t0.stageX;
                var nowVectorY=t1.stageY-t0.stageY;
                var nowDis=Math.sqrt(nowVectorX*nowVectorX+nowVectorY*nowVectorY);
                var cos=Math.acos((startVectorX*nowVectorX+startVectorY*nowVectorY)/(startDis*nowDis));
                var endVectorX=t1.endX-t0.endX;
                var endVectorY=t1.endY-t0.endY;
                nowVectorX=Math.abs(nowVectorX)<1 ? 1 : nowVectorX;
                nowVectorY=Math.abs(nowVectorY)<1 ? 1 : nowVectorY;
                endVectorX=Math.abs(endVectorX)<1 ? 1 : endVectorX;
                endVectorY=Math.abs(endVectorY)<1 ? 1 : endVectorY;
                var nex=nowVectorX/endVectorX;
                var ney=nowVectorY/endVectorY;
                nex=nex>1.1 ? 1.1 : nex;
                nex=nex<0.9 ? 0.9 : nex;
                ney=ney>1.1 ? 1.1 : ney;
                ney=ney<0.9 ? 0.9 : ney;
                transformTouchEvt.scaleX=nex;
                transformTouchEvt.scaleY=ney;
                transformTouchEvt.type=TransformGestureEvent.GESTURE_ZOOM;
                if (cos>TouchInfo.MIN_ROTATION_NUM*TouchInfo.RAD_UNIT) {
                    var endDis=Math.sqrt(endVectorX*endVectorX+endVectorY*endVectorY);
                    var dir=(endVectorX*nowVectorY-endVectorY*nowVectorX)>=0 ? 1 :  -1;
                    var changeRotation=dir*Math.acos((endVectorX*nowVectorX+endVectorY*nowVectorY)/(endDis*nowDis));
                    transformTouchEvt.rotation=changeRotation/TouchInfo.RAD_UNIT;
                    transformTouchEvt.type=TransformGestureEvent.GESTURE_ROTATE;
                }
                t1.endX=t1.stageX;
                t0.endX=t0.stageX;
                t1.endY=t1.stageY;
                t0.endY=t0.stageY;
            }
            return transformTouchEvt;
        }
        if (tLen==1 && touchEvent.type==TouchEvent.TOUCH_BEGIN) {
            TouchInfo.isSingleFingerDown=true;
            TouchInfo.singleFignerDownTime=touchEvent.timestamp;
        } else if (tLen==1 && touchEvent.type==TouchEvent.TOUCH_END) {
            TouchInfo.isSingleFingerDown=false;
            TouchInfo.singleFignerDownTime=0;
        }
        if (tLen==2 && touchEvent.type==TouchEvent.TOUCH_END && TouchInfo.twoFingerGapTime>=TouchInfo.TWO_FINGER_GAP_MIN_TIME) {
            var patge=PressAndTapGestureEvent.getInstance();
            patge._$target=touchEvent.target;
            patge.tapLocalX=touchEvent.localX;
            patge.tapLocalY=touchEvent.localY;
            patge.tapStageX=touchEvent.stageX;
            patge.tapStageY=touchEvent.stageY;
            return patge;
        }
        if (tLen==1 && TouchInfo.isSingleFingerDown && touchEvent.type==TouchEvent.TOUCH_MOVE && TouchInfo.singleFignerDownTime!=0 && (touchEvent.timestamp-TouchInfo.singleFignerDownTime>TouchInfo.GESTURE_SWIPE_MIN_TIME)) {
            TouchInfo.singleFignerDownTime=0;
            var swipeTouchInfo=TouchInfo.touchs[0];
            var swipeTouchEvt=new TransformGestureEvent(TransformGestureEvent.GESTURE_SWIPE,true,false,GesturePhase.GESTURE_PHASE_MAP_TOUCH[touchEvent.type]);
            swipeTouchEvt.localX=touchEvent.localX;
            swipeTouchEvt.localY=touchEvent.localY;
            swipeTouchEvt._$target=touchEvent._$target;
            swipeTouchEvt.shiftKey=touchEvent.shiftKey;
            swipeTouchEvt.ctrlKey=touchEvent.ctrlKey;
            swipeTouchEvt.altKey=touchEvent.altKey;
            swipeTouchEvt.offsetX=touchEvent.stageX-swipeTouchInfo.startX>0 ? 1 :  -1;
            swipeTouchEvt.offsetY=touchEvent.stageY-swipeTouchInfo.startY>0 ? 1 :  -1;
            return swipeTouchEvt;
        }
        return null;
    }

    TouchInfo.TWO_FINGER_GAP_MIN_TIME=100;
    TouchInfo.GESTURE_SWIPE_MIN_TIME=80;
    TouchInfo.TRANSFORM_MIN_SIZE=10;
    TouchInfo.MIN_ROTATION_NUM=20;
    TouchInfo.twoFingerGapTime=0;
    TouchInfo.twoFignerDownTime=0;
    TouchInfo.singleFignerDownTime=0;
    TouchInfo.isSingleFingerDown=false;
    TouchInfo.isTwoFingerDown=false;
    TouchInfo.twoFignerDownCount=0;
    TouchInfo.twoFignerTouchType="";

    __static(TouchInfo,[
        'touchInfos',function(){return this.touchInfos={};},
        'touchs',function(){return this.touchs=[];},
        'RAD_UNIT',function(){return this.RAD_UNIT=Math.PI/180;}
    ]);

    TouchInfo.toString=function(){return "[class TouchInfo]";};
    Mira.un_proto(TouchInfo);
    return TouchInfo;
})();

var TouchPhase=(function() {
    function TouchPhase()
    {
    }

    __class(TouchPhase,'flash.events.TouchPhase');

    TouchPhase.HOVER="hover";
    TouchPhase.BEGAN="began";
    TouchPhase.MOVED="moved";
    TouchPhase.STATIONARY="stationary";
    TouchPhase.ENDED="ended";

    TouchPhase.toString=function(){return "[class TouchPhase]";};
    return TouchPhase;
})();

var TransformGestureEvent=(function(_super) {
    function TransformGestureEvent(type,bubbles,cancelable,phase,localX,localY,scaleX,scaleY,rotation,offsetX,offsetY,ctrlKey,altKey,shiftKey,commandKey,controlKey,_d)
    {
        this.offsetX=0;
        this.offsetY=0;
        this.rotation=0;
        this.scaleX=0;
        this.scaleY=0;
        (bubbles===void 0) && (bubbles=false);
        (cancelable===void 0) && (cancelable=false);
        (phase===void 0) && (phase=null);
        (localX===void 0) && (localX=0);
        (localY===void 0) && (localY=0);
        (scaleX===void 0) && (scaleX=1);
        (scaleY===void 0) && (scaleY=1);
        (rotation===void 0) && (rotation=0);
        (offsetX===void 0) && (offsetX=0);
        (offsetY===void 0) && (offsetY=0);
        (ctrlKey===void 0) && (ctrlKey=false);
        (altKey===void 0) && (altKey=false);
        (shiftKey===void 0) && (shiftKey=false);
        (commandKey===void 0) && (commandKey=false);
        (controlKey===void 0) && (controlKey=false);
        (_d===void 0) && (_d=null);
        TransformGestureEvent.__super.call(this,type,bubbles,cancelable,phase,localX,localY,ctrlKey,altKey,shiftKey,commandKey,controlKey,_d);
        this.offsetX=offsetX;
        this.offsetY=offsetY;
        this.rotation=rotation;
        this.scaleX=scaleX;
        this.scaleY=scaleY;
    }

    __class(TransformGestureEvent,'flash.events.TransformGestureEvent',_super);
    var __proto=TransformGestureEvent.prototype;

    __proto.toMouseEvent=function()
    {
        _super.prototype.toMouseEvent.call(this);
        Event.__helpMouseEvt__.type=MouseEvent.MOUSE_MOVE;
        Event.__helpMouseEvt__.buttonDown=true;
        return Event.__helpMouseEvt__;
    }

    TransformGestureEvent.GESTURE_PAN="gesturePan";
    TransformGestureEvent.GESTURE_ROTATE="gestureRotate";
    TransformGestureEvent.GESTURE_SWIPE="gestureSwipe";
    TransformGestureEvent.GESTURE_ZOOM="gestureZoom";

    TransformGestureEvent.toString=function(){return "[class TransformGestureEvent]";};
    Mira.un_proto(TransformGestureEvent);
    return TransformGestureEvent;
})(GestureEvent);

var ExternalInterface=(function() {
    function ExternalInterface()
    {
    }

    __class(ExternalInterface,'flash.external.ExternalInterface');

    __getset(1,ExternalInterface,'available',
        function()
        {
            return false;
        }
    );

    __getset(1,ExternalInterface,'objectID',
        function()
        {
            return "";
        }
    );

    ExternalInterface.addCallback=function(functionName,closure)
    {
    }

    ExternalInterface.call=function(functionName)
    {
        var rest=[];for(var $a=1,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
        return null;
    }

    ExternalInterface.marshallExceptions=false;

    ExternalInterface.toString=function(){return "[class ExternalInterface]";};
    return ExternalInterface;
})();

var BitmapFilter=(function() {
    function BitmapFilter(inType)
    {
        this._$type=inType;
    }

    __class(BitmapFilter,'flash.filters.BitmapFilter');
    var __proto=BitmapFilter.prototype;

    __proto.clone=function()
    {
        return new BitmapFilter(this._$type);
    }

    BitmapFilter.toString=function(){return "[class BitmapFilter]";};
    Mira.un_proto(BitmapFilter);
    return BitmapFilter;
})();

var BevelFilter=(function(_super) {
    function BevelFilter(distance,angle,highlightColor,highlightAlpha,shadowColor,shadowAlpha,blurX,blurY,strength,quality,type,knockout)
    {
        this.highlightColor=0;
        this.knockout=false;
        this.quality=0;
        this.shadowColor=0;
        (distance===void 0) && (distance=0);
        (angle===void 0) && (angle=0);
        (highlightColor===void 0) && (highlightColor=0xFF);
        (highlightAlpha===void 0) && (highlightAlpha=1);
        (shadowColor===void 0) && (shadowColor=0);
        (shadowAlpha===void 0) && (shadowAlpha=1);
        (blurX===void 0) && (blurX=4);
        (blurY===void 0) && (blurY=4);
        (strength===void 0) && (strength=1);
        (quality===void 0) && (quality=1);
        (type===void 0) && (type="full");
        (knockout===void 0) && (knockout=false);
        BevelFilter.__super.call(this,"BevelFilter");
        this.distance=distance;
        this.angle=angle;
        this.highlightColor=highlightColor;
        this.highlightAlpha=highlightAlpha;
        this.shadowColor=shadowColor;
        this.shadowAlpha=shadowAlpha;
        this.blurX=blurX;
        this.blurY=blurY;
        this.strength=strength;
        this.quality=quality;
        this.type=type;
        this.knockout=knockout;
    }

    __class(BevelFilter,'flash.filters.BevelFilter',_super);
    var __proto=BevelFilter.prototype;

    __proto.clone=function()
    {
        return new BevelFilter(this.distance,this.angle,this.highlightColor,this.highlightAlpha,this.shadowColor,this.shadowAlpha,this.blurX,this.blurY,this.strength,this.quality,this.type,this.knockout);
    }

    BevelFilter.toString=function(){return "[class BevelFilter]";};
    Mira.un_proto(BevelFilter);
    return BevelFilter;
})(BitmapFilter);

var BitmapFilterQuality=(function() {
    function BitmapFilterQuality()
    {
    }

    __class(BitmapFilterQuality,'flash.filters.BitmapFilterQuality');

    BitmapFilterQuality.HIGH=3;
    BitmapFilterQuality.LOW=1;
    BitmapFilterQuality.MEDIUM=2;

    BitmapFilterQuality.toString=function(){return "[class BitmapFilterQuality]";};
    return BitmapFilterQuality;
})();

var BitmapFilterType=(function() {
    function BitmapFilterType()
    {
    }

    __class(BitmapFilterType,'flash.filters.BitmapFilterType');

    BitmapFilterType.FULL="full";
    BitmapFilterType.INNER="inner";
    BitmapFilterType.OUTER="outer";

    BitmapFilterType.toString=function(){return "[class BitmapFilterType]";};
    return BitmapFilterType;
})();

var BlurFilter=(function(_super) {
    function BlurFilter(inBlurX,inBlurY,inQuality)
    {
        this.quality=0;
        (inBlurX===void 0) && (inBlurX=4);
        (inBlurY===void 0) && (inBlurY=4);
        (inQuality===void 0) && (inQuality=1);
        BlurFilter.__super.call(this,"BlurFilter");
        this.blurX=inBlurX;
        this.blurY=inBlurY;
        this.quality=inQuality;
    }

    __class(BlurFilter,'flash.filters.BlurFilter',_super);
    var __proto=BlurFilter.prototype;

    __proto.clone=function()
    {
        return new BlurFilter(this.blurX,this.blurY,this.quality);
    }

    BlurFilter.toString=function(){return "[class BlurFilter]";};
    Mira.un_proto(BlurFilter);
    return BlurFilter;
})(BitmapFilter);

var ColorMatrixFilter=(function(_super) {
    function ColorMatrixFilter(matrix)
    {
        (matrix===void 0) && (matrix=null);
        ColorMatrixFilter.__super.call(this,"ColorMatrixFilter");
        this.matrix=matrix;
    }

    __class(ColorMatrixFilter,'flash.filters.ColorMatrixFilter',_super);
    var __proto=ColorMatrixFilter.prototype;

    __proto.clone=function()
    {
        return new ColorMatrixFilter(this.matrix);
    }

    ColorMatrixFilter.toString=function(){return "[class ColorMatrixFilter]";};
    Mira.un_proto(ColorMatrixFilter);
    return ColorMatrixFilter;
})(BitmapFilter);

var ConvolutionFilter=(function(_super) {
    function ConvolutionFilter(matrixX,matrixY,matrix,divisor,bias,preserveAlpha,clamp,color,alpha)
    {
        this.clamp=false;
        this.color=0;
        this.preserveAlpha=false;
        (matrixX===void 0) && (matrixX=0);
        (matrixY===void 0) && (matrixY=0);
        (matrix===void 0) && (matrix=null);
        (divisor===void 0) && (divisor=1);
        (bias===void 0) && (bias=0);
        (preserveAlpha===void 0) && (preserveAlpha=true);
        (clamp===void 0) && (clamp=true);
        (color===void 0) && (color=0);
        (alpha===void 0) && (alpha=0);
        ConvolutionFilter.__super.call(this,"ConvolutionFilter");
        this.matrixX=matrixX;
        this.matrixY=matrixY;
        this.matrix=matrix;
        this.divisor=divisor;
        this.preserveAlpha=preserveAlpha;
        this.clamp=clamp;
        this.color=color;
        this.alpha=alpha;
    }

    __class(ConvolutionFilter,'flash.filters.ConvolutionFilter',_super);
    var __proto=ConvolutionFilter.prototype;

    __proto.clone=function()
    {
        return new ConvolutionFilter(this.matrixX,this.matrixY,this.matrix,this.divisor,this.bias,this.preserveAlpha,this.clamp,this.color,this.alpha);
    }

    ConvolutionFilter.toString=function(){return "[class ConvolutionFilter]";};
    Mira.un_proto(ConvolutionFilter);
    return ConvolutionFilter;
})(BitmapFilter);

var DisplacementMapFilter=(function(_super) {
    function DisplacementMapFilter(mapBitmap,mapPoint,componentX,componentY,scaleX,scaleY,mode,color,alpha)
    {
        this.color=0;
        this.componentX=0;
        this.componentY=0;
        (mapBitmap===void 0) && (mapBitmap=null);
        (mapPoint===void 0) && (mapPoint=null);
        (componentX===void 0) && (componentX=0);
        (componentY===void 0) && (componentY=0);
        (scaleX===void 0) && (scaleX=0);
        (scaleY===void 0) && (scaleY=0);
        (mode===void 0) && (mode=null);
        (color===void 0) && (color=0);
        (alpha===void 0) && (alpha=0);
        DisplacementMapFilter.__super.call(this,"DisplacementMapFilter");
        this.mapBitmap=mapBitmap;
        this.mapPoint=mapPoint;
        this.componentY=componentY;
        this.scaleX=scaleX;
        this.scaleY=scaleY;
        this.mode=mode;
        this.color=color;
        this.alpha=alpha;
    }

    __class(DisplacementMapFilter,'flash.filters.DisplacementMapFilter',_super);

    DisplacementMapFilter.toString=function(){return "[class DisplacementMapFilter]";};
    return DisplacementMapFilter;
})(BitmapFilter);

var DisplacementMapFilterMode=(function() {
    function DisplacementMapFilterMode()
    {
    }

    __class(DisplacementMapFilterMode,'flash.filters.DisplacementMapFilterMode');

    DisplacementMapFilterMode.CLAMP="clamp";
    DisplacementMapFilterMode.COLOR="color";
    DisplacementMapFilterMode.IGNORE="ignore";
    DisplacementMapFilterMode.WRAP="wrap";

    DisplacementMapFilterMode.toString=function(){return "[class DisplacementMapFilterMode]";};
    return DisplacementMapFilterMode;
})();

var DropShadowFilter=(function(_super) {
    function DropShadowFilter(in_distance,in_angle,in_color,in_alpha,in_blurX,in_blurY,in_strength,in_quality,in_inner,in_knockout,in_hideObject)
    {
        this.color=0;
        this.hideObject=false;
        this.inner=false;
        this.knockout=false;
        this.quality=0;
        (in_distance===void 0) && (in_distance=4.0);
        (in_angle===void 0) && (in_angle=45.0);
        (in_color===void 0) && (in_color=0);
        (in_alpha===void 0) && (in_alpha=1.0);
        (in_blurX===void 0) && (in_blurX=4.0);
        (in_blurY===void 0) && (in_blurY=4.0);
        (in_strength===void 0) && (in_strength=1.0);
        (in_quality===void 0) && (in_quality=1);
        (in_inner===void 0) && (in_inner=false);
        (in_knockout===void 0) && (in_knockout=false);
        (in_hideObject===void 0) && (in_hideObject=false);
        DropShadowFilter.__super.call(this,"DropShadowFilter");
        this.distance=in_distance;
        this.angle=in_angle;
        this.color=in_color;
        this.alpha=in_alpha;
        this.blurX=in_blurX;
        this.blurY=in_blurX;
        this.strength=in_strength;
        this.quality=in_quality;
        this.inner=in_inner;
        this.knockout=in_knockout;
        this.hideObject=in_hideObject;
    }

    __class(DropShadowFilter,'flash.filters.DropShadowFilter',_super);
    var __proto=DropShadowFilter.prototype;

    __proto.clone=function()
    {
        return new DropShadowFilter(this.distance,this.angle,this.color,this.alpha,this.blurX,this.blurY,this.strength,this.quality,this.inner,this.knockout,this.hideObject);
    }

    DropShadowFilter.toString=function(){return "[class DropShadowFilter]";};
    Mira.un_proto(DropShadowFilter);
    return DropShadowFilter;
})(BitmapFilter);

var GlowFilter=(function(_super) {
    function GlowFilter(in_color,in_alpha,in_blurX,in_blurY,in_strength,in_quality,in_inner,in_knockout)
    {
        this.color=0;
        this.inner=false;
        this.knockout=false;
        this.quality=0;
        (in_color===void 0) && (in_color=0);
        (in_alpha===void 0) && (in_alpha=1.0);
        (in_blurX===void 0) && (in_blurX=6.0);
        (in_blurY===void 0) && (in_blurY=6.0);
        (in_strength===void 0) && (in_strength=1.0);
        (in_quality===void 0) && (in_quality=1);
        (in_inner===void 0) && (in_inner=false);
        (in_knockout===void 0) && (in_knockout=false);
        GlowFilter.__super.call(this,"GlowFilter");
        this.color=in_color;
        this.alpha=in_alpha;
        this.blurX=in_blurX;
        this.blurY=in_blurX;
        this.strength=in_strength;
        this.quality=in_quality;
        this.inner=in_inner;
        this.knockout=in_knockout;
    }

    __class(GlowFilter,'flash.filters.GlowFilter',_super);
    var __proto=GlowFilter.prototype;

    __proto.clone=function()
    {
        return new GlowFilter(this.color,this.alpha,this.blurX,this.blurY,this.strength,this.quality,this.inner,this.knockout);
    }

    GlowFilter.toString=function(){return "[class GlowFilter]";};
    Mira.un_proto(GlowFilter);
    return GlowFilter;
})(BitmapFilter);

var GradientBevelFilter=(function(_super) {
    function GradientBevelFilter(distance,angle,colors,alphas,ratios,blurX,blurY,strength,quality,type,knockout)
    {
        this.knockout=false;
        this.quality=0;
        (distance===void 0) && (distance=4);
        (angle===void 0) && (angle=45);
        (colors===void 0) && (colors=null);
        (alphas===void 0) && (alphas=null);
        (ratios===void 0) && (ratios=null);
        (blurX===void 0) && (blurX=4);
        (blurY===void 0) && (blurY=4);
        (strength===void 0) && (strength=1);
        (quality===void 0) && (quality=1);
        (type===void 0) && (type="inner");
        (knockout===void 0) && (knockout=false);
        GradientBevelFilter.__super.call(this,"GradientBevelFilter");
        this.distance=distance;
        this.angle=angle;
        this.colors=colors;
        this.alphas=alphas;
        this.ratios=ratios;
        this.blurX=blurX;
        this.blurY=blurY;
        this.strength=strength;
        this.quality=quality;
        this.type=type;
        this.knockout=knockout;
    }

    __class(GradientBevelFilter,'flash.filters.GradientBevelFilter',_super);
    var __proto=GradientBevelFilter.prototype;

    __proto.clone=function()
    {
        return new GradientBevelFilter(this.distance,this.angle,this.colors,this.alphas,this.ratios,this.blurX,this.blurY,this.strength,this.quality,this.type,this.knockout);
    }

    GradientBevelFilter.toString=function(){return "[class GradientBevelFilter]";};
    Mira.un_proto(GradientBevelFilter);
    return GradientBevelFilter;
})(BitmapFilter);

var GradientGlowFilter=(function(_super) {
    function GradientGlowFilter(distance,angle,colors,alphas,ratios,blurX,blurY,strength,quality,type,knockout)
    {
        this.knockout=false;
        this.quality=0;
        (distance===void 0) && (distance=4);
        (angle===void 0) && (angle=45);
        (colors===void 0) && (colors=null);
        (alphas===void 0) && (alphas=null);
        (ratios===void 0) && (ratios=null);
        (blurX===void 0) && (blurX=4);
        (blurY===void 0) && (blurY=4);
        (strength===void 0) && (strength=1);
        (quality===void 0) && (quality=1);
        (type===void 0) && (type="inner");
        (knockout===void 0) && (knockout=false);
        GradientGlowFilter.__super.call(this,"GradientGlowFilter");
        this.distance=distance;
        this.angle=angle;
        this.colors=colors;
        this.alphas=alphas;
        this.ratios=ratios;
        this.blurX=blurX;
        this.blurY=blurY;
        this.strength=strength;
        this.quality=quality;
        this.type=type;
        this.knockout=knockout;
    }

    __class(GradientGlowFilter,'flash.filters.GradientGlowFilter',_super);
    var __proto=GradientGlowFilter.prototype;

    __proto.clone=function()
    {
        return new GradientGlowFilter(this.distance,this.angle,this.colors,this.alphas,this.ratios,this.blurX,this.blurY,this.strength,this.quality,this.type,this.knockout);
    }

    GradientGlowFilter.toString=function(){return "[class GradientGlowFilter]";};
    Mira.un_proto(GradientGlowFilter);
    return GradientGlowFilter;
})(BitmapFilter);

var ColorTransform=(function() {
    function ColorTransform(redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier,redOffset,greenOffset,blueOffset,alphaOffset)
    {
        this._$noEffect=false;
        (redMultiplier===void 0) && (redMultiplier=1.0);
        (greenMultiplier===void 0) && (greenMultiplier=1.0);
        (blueMultiplier===void 0) && (blueMultiplier=1.0);
        (alphaMultiplier===void 0) && (alphaMultiplier=1.0);
        (redOffset===void 0) && (redOffset=0);
        (greenOffset===void 0) && (greenOffset=0);
        (blueOffset===void 0) && (blueOffset=0);
        (alphaOffset===void 0) && (alphaOffset=0);
        this.redMultiplier=redMultiplier;
        this.greenMultiplier=greenMultiplier;
        this.blueMultiplier=blueMultiplier;
        this.alphaMultiplier=alphaMultiplier;
        this.redOffset=redOffset;
        this.greenOffset=greenOffset;
        this.blueOffset=blueOffset;
        this.alphaOffset=alphaOffset;
    }

    __class(ColorTransform,'flash.geom.ColorTransform');
    var __proto=ColorTransform.prototype;

    __proto.concat=function(second)
    {
        this.redOffset=this.redOffset+this.redMultiplier*second.redOffset;
        this.greenOffset=this.greenOffset+this.greenMultiplier*second.greenOffset;
        this.blueOffset=this.blueOffset+this.blueMultiplier*second.blueOffset;
        this.alphaOffset=this.alphaOffset+this.alphaMultiplier*second.alphaOffset;
        this.redMultiplier=this.redMultiplier*second.redMultiplier;
        this.greenMultiplier=this.greenMultiplier*second.greenMultiplier;
        this.blueMultiplier=this.blueMultiplier*second.blueMultiplier;
        this.alphaMultiplier=this.alphaMultiplier*second.alphaMultiplier;
    }

    __proto._$getAlpha=function()
    {
        return this.alphaMultiplier+this.alphaOffset;
    }

    __proto.toString=function()
    {
        return "(redMultiplier="+this.redMultiplier+", greenMultiplier="+this.greenMultiplier+", blueMultiplier="+this.blueMultiplier+", alphaMultiplier="+this.alphaMultiplier+", redOffset="+this.redOffset+", greenOffset="+this.greenOffset+", blueOffset="+this.blueOffset+", alphaOffset="+this.alphaOffset+")";
    }

    __proto._$clone=function()
    {
        return new ColorTransform(this.redMultiplier,this.greenMultiplier,this.blueMultiplier,this.alphaMultiplier,this.redOffset,this.greenOffset,this.blueOffset,this.alphaOffset);
    }

    __proto._$copyFrom=function(ct)
    {
        this.redMultiplier=ct.redMultiplier;
        this.greenMultiplier=ct.greenMultiplier;
        this.blueMultiplier=ct.blueMultiplier;
        this.alphaMultiplier=ct.alphaMultiplier;
        this.redOffset=ct.redOffset;
        this.greenOffset=ct.greenOffset;
        this.blueOffset=ct.blueOffset;
        this.alphaOffset=ct.alphaOffset;
    }

    __proto._$check=function()
    {
        this._$noEffect=(this.redMultiplier==1 && this.greenMultiplier==1 && this.blueMultiplier==1 && this.alphaMultiplier==1 && this.redOffset==0 && this.greenOffset==0 && this.blueOffset==0 && this.alphaOffset==0);
    }

    __getset(0,__proto,'color',
        function()
        {
            return this.redOffset<<16|this.greenOffset<<8|this.blueOffset;
        },
        function(newColor)
        {
            this.redMultiplier=this.greenMultiplier=this.blueMultiplier=0;
            this.redOffset=newColor>>16&255;
            this.greenOffset=newColor>>8&255;
            this.blueOffset=newColor&255;
        }
    );

    ColorTransform.toString=function(){return "[class ColorTransform]";};
    Mira.un_proto(ColorTransform);
    return ColorTransform;
})();

var Matrix=(function() {
    function Matrix(a,b,c,d,tx,ty)
    {
        this.a=1;
        this.b=0;
        this.c=0;
        this.d=1;
        this.tx=0;
        this.ty=0;
        (a===void 0) && (a=1);
        (b===void 0) && (b=0);
        (c===void 0) && (c=0);
        (d===void 0) && (d=1);
        (tx===void 0) && (tx=0);
        (ty===void 0) && (ty=0);
        this.a=a;
        this.b=b;
        this.c=c;
        this.d=d;
        this.tx=tx;
        this.ty=ty;
    }

    __class(Matrix,'flash.geom.Matrix');
    var __proto=Matrix.prototype;

    __proto._$isTransform=function()
    {
        return this.a!=1 || this.b!=0 || this.c!=0 || this.d!=1;
    }

    __proto.clone=function()
    {
        return new Matrix(this.a,this.b,this.c,this.d,this.tx,this.ty);
    }

    __proto.createGradientBox=function(width,height,rotation,tx,ty)
    {
        (rotation===void 0) && (rotation=0);
        (tx===void 0) && (tx=0);
        (ty===void 0) && (ty=0);
        this.createBox(width/1638.4,height/1638.4,rotation,tx+width/2,ty+height/2);
    }

    __proto.transformPoint=function(point)
    {
        return new Point(this.a*point.x+this.c*point.y+this.tx,this.d*point.y+this.b*point.x+this.ty);
    }

    __proto.identity=function()
    {
        this.a=this.d=1;
        this.b=this.c=this.tx=this.ty=0;
    }

    __proto.copyFrom=function(src)
    {
        this.a=src.a;
        this.b=src.b;
        this.c=src.c;
        this.d=src.d;
        this.tx=src.tx;
        this.ty=src.ty;
    }

    __proto.copyRowTo=function(row,vector3D)
    {
        switch (row) {
        case 0:
            vector3D.x=this.a;
            vector3D.y=this.c;
            vector3D.z=this.tx;
            break;
        case 1:
            vector3D.x=this.b;
            vector3D.y=this.d;
            vector3D.z=this.ty;
            break;
        case 2:
            vector3D.x=0;
            vector3D.y=0;
            vector3D.z=1;
            break;
        }
    }

    __proto.copyColumnTo=function(column,vector3D)
    {
        switch (column) {
        case 0:
            vector3D.x=this.a;
            vector3D.y=this.b;
            vector3D.z=0;
            break;
        case 1:
            vector3D.x=this.c;
            vector3D.y=this.d;
            vector3D.z=0;
            break;
        case 2:
            vector3D.x=this.tx;
            vector3D.y=this.ty;
            vector3D.z=1;
            break;
        }
    }

    __proto.copyRowFrom=function(row,vector3D)
    {
        switch (row) {
        case 0:
            this.a=vector3D.x;
            this.c=vector3D.y;
            this.tx=vector3D.z;
            break;
        case 1:
            this.b=vector3D.x;
            this.d=vector3D.y;
            this.ty=vector3D.z;
            break;
        }
    }

    __proto.copyColumnFrom=function(column,vector3D)
    {
        switch (column) {
        case 0:
            this.a=vector3D.x;
            this.c=vector3D.y;
            this.tx=vector3D.z;
            break;
        case 1:
            this.b=vector3D.x;
            this.d=vector3D.y;
            this.ty=vector3D.z;
            break;
        }
    }

    __proto.translate=function(x,y)
    {
        this.tx=x+this.tx;
        this.ty=y+this.ty;
    }

    __proto.rotate=function(angle)
    {
        var u=Math.cos(angle);
        var v=Math.sin(angle);
        var result_a=u*this.a-v*this.b;
        var result_b=v*this.a+u*this.b;
        var result_c=u*this.c-v*this.d;
        var result_d=v*this.c+u*this.d;
        var result_tx=u*this.tx-v*this.ty;
        var result_ty=v*this.tx+u*this.ty;
        this.a=result_a;
        this.b=result_b;
        this.c=result_c;
        this.d=result_d;
        this.tx=result_tx;
        this.ty=result_ty;
    }

    __proto.scale=function(sx,sy)
    {
        this.a*=sx;
        this.b*=sy;
        this.c*=sx;
        this.d*=sy;
        this.tx*=sx;
        this.ty*=sy;
    }

    __proto._$setTransform=function(n11,n12,n21,n22,n31,n32)
    {
        this.a=n11;
        this.b=n12;
        this.c=n21;
        this.d=n22;
        this.tx=n31;
        this.ty=n32;
    }

    __proto.invert=function()
    {
        var a0;
        var a1;
        var a2;
        var a3;
        var det;
        var point;
        if (this.b==0 && this.c==0) {
            this.a=1/this.a;
            this.d=1/this.d;
            this.b=this.c=0;
            this.tx*= -this.a;
            this.ty*= -this.d;
        } else {
            a0=this.a;
            a1=this.b;
            a2=this.c;
            a3=this.d;
            det=a0*a3-a1*a2;
            if (det==0) {
                this.identity();
                return;
            }
            det=1/det;
            this.a=a3*det;
            this.b= -a1*det;
            this.c= -a2*det;
            this.d=a0*det;
            point=this.deltaTransformPoint(new Point(this.tx,this.ty));
            this.tx= -point.x;
            this.ty= -point.y;
        }
    }

    __proto.concat=function(m)
    {
        var result_a;
        var result_b;
        var result_c;
        var result_d;
        var result_tx;
        var result_ty;
        result_a=this.a*m.a;
        result_d=this.d*m.d;
        result_b=result_c=0;
        result_tx=this.tx*m.a+m.tx;
        result_ty=this.ty*m.d+m.ty;
        if (this.b!=0 || this.c!=0 || m.b!=0 || m.c!=0) {
            result_a+=this.b*m.c;
            result_d+=this.c*m.b;
            result_b=this.a*m.b+this.b*m.d;
            result_c=this.c*m.a+this.d*m.c;
            result_tx+=this.ty*m.c;
            result_ty+=this.tx*m.b;
        }
        this.a=result_a;
        this.b=result_b;
        this.c=result_c;
        this.d=result_d;
        this.tx=result_tx;
        this.ty=result_ty;
    }

    __proto._$preMultiplyInto=function(other,target)
    {
        var n=other,t=target;
        var a=n.a*this.a;
        var b=0.0;
        var c=0.0;
        var d=n.d*this.d;
        var tx=n.tx*this.a+this.tx;
        var ty=n.ty*this.d+this.ty;
        if (n.b!==0.0 || n.c!==0.0 || this.b!==0.0 || this.c!==0.0) {
            a+=n.b*this.c;
            d+=n.c*this.b;
            b+=n.a*this.b+n.b*this.d;
            c+=n.c*this.a+n.d*this.c;
            tx+=n.ty*this.c;
            ty+=n.tx*this.b;
        }
        t.a=a;
        t.b=b;
        t.c=c;
        t.d=d;
        t.tx=tx;
        t.ty=ty;
    }

    __proto.deltaTransformPoint=function(point)
    {
        return new Point(point.x*this.a+point.y*this.c,point.x*this.b+point.y*this.d);
    }

    __proto.createBox=function(scaleX,scaleY,rotation,tx,ty)
    {
        (rotation===void 0) && (rotation=0);
        (tx===void 0) && (tx=0);
        (ty===void 0) && (ty=0);
        var u=Math.cos(rotation);
        var v=Math.sin(rotation);
        this.a=u*scaleX;
        this.b=v*scaleY;
        this.c= -v*scaleX;
        this.d=u*scaleY;
        this.tx=tx;
        this.ty=ty;
    }

    __proto.setTo=function(a1,b1,c1,d1,tx1,ty1)
    {
        this.a=a1;
        this.b=b1;
        this.c=c1;
        this.d=d1;
        this.tx=tx1;
        this.ty=ty1;
    }

    __proto._$transformPointInPlace=function(source,out)
    {
        out.setTo(this.a*source.x+this.c*source.y+this.tx,this.b*source.x+this.d*source.y+this.ty);
        return out;
    }

    __proto._$transformBounds=function(bounds)
    {
        if (!bounds)
            return bounds;
        var x=bounds.x;
        var y=bounds.y;
        var w=Math.abs(bounds.width);
        var h=Math.abs(bounds.height);
        x=bounds.width<0 ? x-w : x;
        y=bounds.height<0 ? y-h : y;
        var x0=this.a*x+this.c*y+this.tx;
        var y0=this.b*x+this.d*y+this.ty;
        var x1=this.a*(x+w)+this.c*y+this.tx;
        var y1=this.b*(x+w)+this.d*y+this.ty;
        var x2=this.a*(x+w)+this.c*(y+h)+this.tx;
        var y2=this.b*(x+w)+this.d*(y+h)+this.ty;
        var x3=this.a*x+this.c*(y+h)+this.tx;
        var y3=this.b*x+this.d*(y+h)+this.ty;
        bounds.x=Math.min(x0,x1,x2,x3);
        bounds.width=Math.max(x0,x1,x2,x3)-bounds.x;
        bounds.y=Math.min(y0,y1,y2,y3);
        bounds.height=Math.max(y0,y1,y2,y3)-bounds.y;
        return bounds;
    }

    __proto.toString=function()
    {
        return "(a="+this.a+", b="+this.b+", c="+this.c+", d="+this.d+", tx="+this.tx+", ty="+this.ty+")";
    }

    Matrix._$mul=function(mo,m1,m2)
    {
        var aa=m1.a,ab=m1.b,ac=m1.c,ad=m1.d,atx=m1.tx,aty=m1.ty,ba=m2.a,bb=m2.b,bc=m2.c,bd=m2.d,btx=m2.tx,bty=m2.ty;
        mo.a=aa*ba+ab*bc;
        mo.b=aa*bb+ab*bd;
        mo.c=ac*ba+ad*bc;
        mo.d=ac*bb+ad*bd;
        mo.tx=ba*atx+bc*aty+btx;
        mo.ty=bb*atx+bd*aty+bty;
    }

    Matrix.toString=function(){return "[class Matrix]";};
    Mira.un_proto(Matrix);
    return Matrix;
})();

var Matrix3D=(function() {
    function Matrix3D(v)
    {
        this.$vec=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
        this.$transposeTransform=[0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15];
        (v===void 0) && (v=null);
        if (v!=null) {
            if (v.length!=this.$vec.length) {
                throw new Error("Not equal length!");
            }
            for (var i=0;i<this.$vec.length;i++) {
                this.$vec[i]=v[i];
            }
        }
    }

    __class(Matrix3D,'flash.geom.Matrix3D');
    var __proto=Matrix3D.prototype;

    __proto.append=function(lhs)
    {
        var ma=lhs.rawData,mb=this.$vec;
        var ma11=ma[0],ma12=ma[4],ma13=ma[8],ma14=ma[12];
        var ma21=ma[1],ma22=ma[5],ma23=ma[9],ma24=ma[13];
        var ma31=ma[2],ma32=ma[6],ma33=ma[10],ma34=ma[14];
        var ma41=ma[3],ma42=ma[7],ma43=ma[11],ma44=ma[15];
        var mb11=mb[0],mb12=mb[4],mb13=mb[8],mb14=mb[12];
        var mb21=mb[1],mb22=mb[5],mb23=mb[9],mb24=mb[13];
        var mb31=mb[2],mb32=mb[6],mb33=mb[10],mb34=mb[14];
        var mb41=mb[3],mb42=mb[7],mb43=mb[11],mb44=mb[15];
        this.$vec[0]=ma11*mb11+ma12*mb21+ma13*mb31+ma14*mb41;
        this.$vec[1]=ma21*mb11+ma22*mb21+ma23*mb31+ma24*mb41;
        this.$vec[2]=ma31*mb11+ma32*mb21+ma33*mb31+ma34*mb41;
        this.$vec[3]=ma41*mb11+ma42*mb21+ma43*mb31+ma44*mb41;
        this.$vec[4]=ma11*mb12+ma12*mb22+ma13*mb32+ma14*mb42;
        this.$vec[5]=ma21*mb12+ma22*mb22+ma23*mb32+ma24*mb42;
        this.$vec[6]=ma31*mb12+ma32*mb22+ma33*mb32+ma34*mb42;
        this.$vec[7]=ma41*mb12+ma42*mb22+ma43*mb32+ma44*mb42;
        this.$vec[8]=ma11*mb13+ma12*mb23+ma13*mb33+ma14*mb43;
        this.$vec[9]=ma21*mb13+ma22*mb23+ma23*mb33+ma24*mb43;
        this.$vec[10]=ma31*mb13+ma32*mb23+ma33*mb33+ma34*mb43;
        this.$vec[11]=ma41*mb13+ma42*mb23+ma43*mb33+ma44*mb43;
        this.$vec[12]=ma11*mb14+ma12*mb24+ma13*mb34+ma14*mb44;
        this.$vec[13]=ma21*mb14+ma22*mb24+ma23*mb34+ma24*mb44;
        this.$vec[14]=ma31*mb14+ma32*mb24+ma33*mb34+ma34*mb44;
        this.$vec[15]=ma41*mb14+ma42*mb24+ma43*mb34+ma44*mb44;
    }

    __proto.appendRotation=function(degrees,axis,pivotPoint)
    {
        (pivotPoint===void 0) && (pivotPoint=null);
        this.append(this.getRotationMatrix(degrees/180*Math.PI,axis.x,axis.y,axis.z,pivotPoint ? pivotPoint.x : 0,pivotPoint ? pivotPoint.y : 0,pivotPoint ? pivotPoint.z : 0));
    }

    __proto.appendScale=function(xScale,yScale,zScale)
    {
        this.$vec[0]*=xScale;
        this.$vec[1]*=yScale;
        this.$vec[2]*=zScale;
        this.$vec[4]*=xScale;
        this.$vec[5]*=yScale;
        this.$vec[6]*=zScale;
        this.$vec[8]*=xScale;
        this.$vec[9]*=yScale;
        this.$vec[10]*=zScale;
        this.$vec[12]*=xScale;
        this.$vec[13]*=yScale;
        this.$vec[14]*=zScale;
    }

    __proto.appendTranslation=function(x,y,z)
    {
        var m=this.$vec;
        var m41=m[3],m42=m[7],m43=m[11],m44=m[15];
        m[0]+=x*m41;
        m[1]+=y*m41;
        m[2]+=z*m41;
        m[4]+=x*m42;
        m[5]+=y*m42;
        m[6]+=z*m42;
        m[8]+=x*m43;
        m[9]+=y*m43;
        m[10]+=z*m43;
        m[12]+=x*m44;
        m[13]+=y*m44;
        m[14]+=z*m44;
    }

    __proto.clone=function()
    {
        return new Matrix3D(this.$vec);
    }

    __proto.copyColumnFrom=function(column,vector3D)
    {
        if (column>3)
            throw new Error("column number too bigger");
        var offset=column<<2;
        this.$vec[offset]=vector3D.x;
        this.$vec[offset+1]=vector3D.y;
        this.$vec[offset+2]=vector3D.z;
        this.$vec[offset+3]=vector3D.w;
    }

    __proto.copyColumnTo=function(column,vector3D)
    {
        if (column>3)
            throw new Error("column number too bigger");
        var offset=column<<2;
        vector3D.x=this.$vec[offset];
        vector3D.y=this.$vec[offset+1];
        vector3D.z=this.$vec[offset+2];
        vector3D.w=this.$vec[offset+3];
    }

    __proto.copyFrom=function(sourceMatrix3D)
    {
        for (var i=0;i<this.$vec.length;i++) {
            this.$vec[i]=sourceMatrix3D.$vec[i];
        }
    }

    __proto.copyRawDataFrom=function(vector,index,transpose)
    {
        (index===void 0) && (index=0);
        (transpose===void 0) && (transpose=false);
        var i=0,j=index|0;
        if (transpose) {
            for (;i<16;i++,j++) {
                this.$vec[this.$transposeTransform[i]]=vector[j] || 0;
            }
        } else {
            for (;i<16;i++,j++) {
                this.$vec[i]=vector[j] || 0;
            }
        }
    }

    __proto.copyRawDataTo=function(vector,index,transpose)
    {
        (index===void 0) && (index=0);
        (transpose===void 0) && (transpose=false);
        var i=0,j=index|0;
        if (transpose) {
            for (;i<16;i++,j++) {
                vector[j]=this.$vec[this.$transposeTransform[i]];
            }
        } else {
            for (;i<16;i++,j++) {
                vector[j]=this.$vec[i];
            }
        }
    }

    __proto.copyRowFrom=function(row,vector3D)
    {
        if (row>3)
            throw new Error("row number too bigger",0);
        var offset=row|0;
        this.$vec[offset]=vector3D.x;
        this.$vec[offset+4]=vector3D.y;
        this.$vec[offset+8]=vector3D.z;
        this.$vec[offset+12]=vector3D.w;
    }

    __proto.copyRowTo=function(row,vector3D)
    {
        var offset=row|0;
        vector3D.x=this.$vec[offset];
        vector3D.y=this.$vec[offset+4];
        vector3D.z=this.$vec[offset+8];
        vector3D.w=this.$vec[offset+12];
    }

    __proto.copyToMatrix3D=function(dest)
    {
        for (var i=0;i<16;i++) {
            dest.rawData[i]=this.$vec[i];
        }
    }

    __proto.decompose=function(orientationStyle)
    {
        (orientationStyle===void 0) && (orientationStyle="eulerAngles");
        var ret=[new Vector3D(),new Vector3D(),new Vector3D()];
        var colX=new Vector3D(this.$vec[0],this.$vec[1],this.$vec[2]);
        var colY=new Vector3D(this.$vec[4],this.$vec[5],this.$vec[6]);
        var colZ=new Vector3D(this.$vec[8],this.$vec[9],this.$vec[10]);
        var pos=ret[0];
        pos.x=this.$vec[12];
        pos.y=this.$vec[13];
        pos.z=this.$vec[14];
        var scale=ret[2];
        var skew=new Vector3D();
        scale.x=colX.length;
        colX.scaleBy(1/scale.x);
        skew.x=colX.dotProduct(colY);
        colY.x-=colX.x*skew.x;
        colY.y-=colX.y*skew.x;
        colY.z-=colX.z*skew.x;
        scale.y=colY.length;
        colY.scaleBy(1/scale.y);
        skew.x/=scale.y;
        skew.y=colX.dotProduct(colZ);
        colZ.x-=colX.x*skew.y;
        colZ.y-=colX.y*skew.y;
        colZ.z-=colX.z*skew.y;
        skew.z=colY.dotProduct(colZ);
        colZ.x-=colY.x*skew.z;
        colZ.y-=colY.y*skew.z;
        colZ.z-=colY.z*skew.z;
        scale.z=colZ.length;
        colZ.scaleBy(1/scale.z);
        skew.y/=scale.z;
        skew.z/=scale.z;
        if (colX.dotProduct(colY.crossProduct(colZ))<0) {
            scale.z= -scale.z;
            colZ.x= -colZ.x;
            colZ.y= -colZ.y;
            colZ.z= -colZ.z;
        }
        var rot=ret[1];
        switch (orientationStyle) {
        case Orientation3D.AXIS_ANGLE:
            rot.w=Math.acos((colX.x+colY.y+colZ.z-1)/2);
            var len=Math.sqrt((colY.z-colZ.y)*(colY.z-colZ.y)+(colZ.x-colX.z)*(colZ.x-colX.z)+(colX.y-colY.x)*(colX.y-colY.x));
            rot.x=(colY.z-colZ.y)/len;
            rot.y=(colZ.x-colX.z)/len;
            rot.z=(colX.y-colY.x)/len;
            break;
        case Orientation3D.QUATERNION:
            var tr=colX.x+colY.y+colZ.z;
            if (tr>0) {
                rot.w=Math.sqrt(1+tr)/2;
                rot.x=(colY.z-colZ.y)/(4*rot.w);
                rot.y=(colZ.x-colX.z)/(4*rot.w);
                rot.z=(colX.y-colY.x)/(4*rot.w);
            } else if ((colX.x>colY.y) && (colX.x>colZ.z)) {
                rot.x=Math.sqrt(1+colX.x-colY.y-colZ.z)/2;
                rot.w=(colY.z-colZ.y)/(4*rot.x);
                rot.y=(colX.y+colY.x)/(4*rot.x);
                rot.z=(colZ.x+colX.z)/(4*rot.x);
            } else if (colY.y>colZ.z) {
                rot.y=Math.sqrt(1+colY.y-colX.x-colZ.z)/2;
                rot.x=(colX.y+colY.x)/(4*rot.y);
                rot.w=(colZ.x-colX.z)/(4*rot.y);
                rot.z=(colY.z+colZ.y)/(4*rot.y);
            } else {
                rot.z=Math.sqrt(1+colZ.z-colX.x-colY.y)/2;
                rot.x=(colZ.x+colX.z)/(4*rot.z);
                rot.y=(colY.z+colZ.y)/(4*rot.z);
                rot.w=(colX.y-colY.x)/(4*rot.z);
            }
            break;
        case Orientation3D.EULER_ANGLES:
            rot.y=Math.asin( -colX.z);
            if (colX.z!=1 && colX.z!= -1) {
                rot.x=Math.atan2(colY.z,colZ.z);
                rot.z=Math.atan2(colX.y,colX.x);
            } else {
                rot.z=0;
                rot.x=Math.atan2(colY.x,colY.y);
            }
            break;
        }
        return ret;
    }

    __proto.deltaTransformVector=function(v)
    {
        var x=v.x,y=v.y,z=v.z;
        return new Vector3D(this.$vec[0]*x+this.$vec[4]*y+this.$vec[8]*z,this.$vec[1]*x+this.$vec[5]*y+this.$vec[9]*z,this.$vec[2]*x+this.$vec[6]*y+this.$vec[10]*z);
    }

    __proto.identity=function()
    {
        this.$vec[0]=this.$vec[5]=this.$vec[10]=this.$vec[15]=1;
        this.$vec[1]=this.$vec[2]=this.$vec[3]=this.$vec[4]=this.$vec[6]=this.$vec[7]=this.$vec[8]=this.$vec[9]=this.$vec[11]=this.$vec[12]=this.$vec[13]=this.$vec[14]=0;
    }

    __proto.interpolateTo=function(toMat,percent)
    {
        throw new Error("NOT REAL FUNCTION!!!",0);
    }

    __proto.invert=function()
    {
        var d=this.determinant;
        var invertable=Math.abs(d)>0.00000000001;
        if (invertable) {
            d=1/d;
            var m11=this.$vec[0];
            var m12=this.$vec[1];
            var m13=this.$vec[2];
            var m14=this.$vec[3];
            var m21=this.$vec[4];
            var m22=this.$vec[5];
            var m23=this.$vec[6];
            var m24=this.$vec[7];
            var m31=this.$vec[8];
            var m32=this.$vec[9];
            var m33=this.$vec[10];
            var m34=this.$vec[11];
            var m41=this.$vec[12];
            var m42=this.$vec[13];
            var m43=this.$vec[14];
            var m44=this.$vec[15];
            this.$vec[0]=d*(m22*(m33*m44-m43*m34)-m32*(m23*m44-m43*m24)+m42*(m23*m34-m33*m24));
            this.$vec[1]= -d*(m12*(m33*m44-m43*m34)-m32*(m13*m44-m43*m14)+m42*(m13*m34-m33*m14));
            this.$vec[2]=d*(m12*(m23*m44-m43*m24)-m22*(m13*m44-m43*m14)+m42*(m13*m24-m23*m14));
            this.$vec[3]= -d*(m12*(m23*m34-m33*m24)-m22*(m13*m34-m33*m14)+m32*(m13*m24-m23*m14));
            this.$vec[4]= -d*(m21*(m33*m44-m43*m34)-m31*(m23*m44-m43*m24)+m41*(m23*m34-m33*m24));
            this.$vec[5]=d*(m11*(m33*m44-m43*m34)-m31*(m13*m44-m43*m14)+m41*(m13*m34-m33*m14));
            this.$vec[6]= -d*(m11*(m23*m44-m43*m24)-m21*(m13*m44-m43*m14)+m41*(m13*m24-m23*m14));
            this.$vec[7]=d*(m11*(m23*m34-m33*m24)-m21*(m13*m34-m33*m14)+m31*(m13*m24-m23*m14));
            this.$vec[8]=d*(m21*(m32*m44-m42*m34)-m31*(m22*m44-m42*m24)+m41*(m22*m34-m32*m24));
            this.$vec[9]= -d*(m11*(m32*m44-m42*m34)-m31*(m12*m44-m42*m14)+m41*(m12*m34-m32*m14));
            this.$vec[10]=d*(m11*(m22*m44-m42*m24)-m21*(m12*m44-m42*m14)+m41*(m12*m24-m22*m14));
            this.$vec[11]= -d*(m11*(m22*m34-m32*m24)-m21*(m12*m34-m32*m14)+m31*(m12*m24-m22*m14));
            this.$vec[12]= -d*(m21*(m32*m43-m42*m33)-m31*(m22*m43-m42*m23)+m41*(m22*m33-m32*m23));
            this.$vec[13]=d*(m11*(m32*m43-m42*m33)-m31*(m12*m43-m42*m13)+m41*(m12*m33-m32*m13));
            this.$vec[14]= -d*(m11*(m22*m43-m42*m23)-m21*(m12*m43-m42*m13)+m41*(m12*m23-m22*m13));
            this.$vec[15]=d*(m11*(m22*m33-m32*m23)-m21*(m12*m33-m32*m13)+m31*(m12*m23-m22*m13));
        }
        return invertable;
    }

    __proto.pointAt=function(pos,at,up)
    {
        (at===void 0) && (at=null);
        (up===void 0) && (up=null);
    }

    __proto.prepend=function(rhs)
    {
        var ma=this.$vec,mb=rhs.rawData;
        var ma11=ma[0],ma12=ma[4],ma13=ma[8],ma14=ma[12];
        var ma21=ma[1],ma22=ma[5],ma23=ma[9],ma24=ma[13];
        var ma31=ma[2],ma32=ma[6],ma33=ma[10],ma34=ma[14];
        var ma41=ma[3],ma42=ma[7],ma43=ma[11],ma44=ma[15];
        var mb11=mb[0],mb12=mb[4],mb13=mb[8],mb14=mb[12];
        var mb21=mb[1],mb22=mb[5],mb23=mb[9],mb24=mb[13];
        var mb31=mb[2],mb32=mb[6],mb33=mb[10],mb34=mb[14];
        var mb41=mb[3],mb42=mb[7],mb43=mb[11],mb44=mb[15];
        this.$vec[0]=ma11*mb11+ma12*mb21+ma13*mb31+ma14*mb41;
        this.$vec[1]=ma21*mb11+ma22*mb21+ma23*mb31+ma24*mb41;
        this.$vec[2]=ma31*mb11+ma32*mb21+ma33*mb31+ma34*mb41;
        this.$vec[3]=ma41*mb11+ma42*mb21+ma43*mb31+ma44*mb41;
        this.$vec[4]=ma11*mb12+ma12*mb22+ma13*mb32+ma14*mb42;
        this.$vec[5]=ma21*mb12+ma22*mb22+ma23*mb32+ma24*mb42;
        this.$vec[6]=ma31*mb12+ma32*mb22+ma33*mb32+ma34*mb42;
        this.$vec[7]=ma41*mb12+ma42*mb22+ma43*mb32+ma44*mb42;
        this.$vec[8]=ma11*mb13+ma12*mb23+ma13*mb33+ma14*mb43;
        this.$vec[9]=ma21*mb13+ma22*mb23+ma23*mb33+ma24*mb43;
        this.$vec[10]=ma31*mb13+ma32*mb23+ma33*mb33+ma34*mb43;
        this.$vec[11]=ma41*mb13+ma42*mb23+ma43*mb33+ma44*mb43;
        this.$vec[12]=ma11*mb14+ma12*mb24+ma13*mb34+ma14*mb44;
        this.$vec[13]=ma21*mb14+ma22*mb24+ma23*mb34+ma24*mb44;
        this.$vec[14]=ma31*mb14+ma32*mb24+ma33*mb34+ma34*mb44;
        this.$vec[15]=ma41*mb14+ma42*mb24+ma43*mb34+ma44*mb44;
    }

    __proto.prependRotation=function(degrees,axis,pivotPoint)
    {
        (pivotPoint===void 0) && (pivotPoint=null);
        this.prepend(this.getRotationMatrix(degrees/180*Math.PI,axis.x,axis.y,axis.z,pivotPoint ? pivotPoint.x : 0,pivotPoint ? pivotPoint.y : 0,pivotPoint ? pivotPoint.z : 0));
    }

    __proto.prependScale=function(xScale,yScale,zScale)
    {
        this.$vec[0]*=xScale;
        this.$vec[1]*=xScale;
        this.$vec[2]*=xScale;
        this.$vec[3]*=xScale;
        this.$vec[4]*=yScale;
        this.$vec[5]*=yScale;
        this.$vec[6]*=yScale;
        this.$vec[7]*=yScale;
        this.$vec[8]*=zScale;
        this.$vec[9]*=zScale;
        this.$vec[10]*=zScale;
        this.$vec[11]*=zScale;
    }

    __proto.prependTranslation=function(x,y,z)
    {
        var m=this.$vec;
        var m11=m[0],m12=m[4],m13=m[8];
        var m21=m[1],m22=m[5],m23=m[9];
        var m31=m[2],m32=m[6],m33=m[10];
        var m41=m[3],m42=m[7],m43=m[11];
        m[12]+=m11*x+m12*y+m13*z;
        m[13]+=m21*x+m22*y+m23*z;
        m[14]+=m31*x+m32*y+m33*z;
        m[15]+=m41*x+m42*y+m43*z;
    }

    __proto.recompose=function(components,orientationStyle)
    {
        (orientationStyle===void 0) && (orientationStyle="eulerAngles");
        var pos=(components[0]) ? components[0] : this.position;
        this.identity();
        var scale=components[2];
        if (scale && (scale.x!=1 || scale.y!=1 || scale.z!=1))
            this.appendScale(scale.x,scale.y,scale.z);
        var sin;
        var cos;
        var raw=Matrix3D.tempMatrix.$vec;
        raw[12]=0;
        raw[13]=0;
        raw[14]=0;
        raw[15]=0;
        var rotation=components[1];
        if (rotation) {
            var angle= -rotation.x;
            if (angle!=0) {
                sin=Math.sin(angle);
                cos=Math.cos(angle);
                raw[0]=1;
                raw[1]=0;
                raw[2]=0;
                raw[3]=0;
                raw[4]=0;
                raw[5]=cos;
                raw[6]= -sin;
                raw[7]=0;
                raw[8]=0;
                raw[9]=sin;
                raw[10]=cos;
                raw[11]=0;
                this.append(Matrix3D.tempMatrix);
            }
            angle= -rotation.y;
            if (angle!=0) {
                sin=Math.sin(angle);
                cos=Math.cos(angle);
                raw[0]=cos;
                raw[1]=0;
                raw[2]=sin;
                raw[3]=0;
                raw[4]=0;
                raw[5]=1;
                raw[6]=0;
                raw[7]=0;
                raw[8]= -sin;
                raw[9]=0;
                raw[10]=cos;
                raw[11]=0;
                this.append(Matrix3D.tempMatrix);
            }
            angle= -rotation.z;
            if (angle!=0) {
                sin=Math.sin(angle);
                cos=Math.cos(angle);
                raw[0]=cos;
                raw[1]= -sin;
                raw[2]=0;
                raw[3]=0;
                raw[4]=sin;
                raw[5]=cos;
                raw[6]=0;
                raw[7]=0;
                raw[8]=0;
                raw[9]=0;
                raw[10]=1;
                raw[11]=0;
                this.append(Matrix3D.tempMatrix);
            }
        }
        this.position=pos;
        this.rawData[15]=1;
        return true;
    }

    __proto.transformVector=function(v)
    {
        var x=v.x,y=v.y,z=v.z;
        return new Vector3D(this.$vec[0]*x+this.$vec[4]*y+this.$vec[8]*z+this.$vec[12],this.$vec[1]*x+this.$vec[5]*y+this.$vec[9]*z+this.$vec[13],this.$vec[2]*x+this.$vec[6]*y+this.$vec[10]*z+this.$vec[14]);
    }

    __proto.transformVectors=function(vin,vout)
    {
        var m11=this.$vec[0],m12=this.$vec[4],m13=this.$vec[8],m14=this.$vec[12];
        var m21=this.$vec[1],m22=this.$vec[5],m23=this.$vec[9],m24=this.$vec[13];
        var m31=this.$vec[2],m32=this.$vec[6],m33=this.$vec[10],m34=this.$vec[14];
        var m41=this.$vec[3],m42=this.$vec[7],m43=this.$vec[11],m44=this.$vec[15];
        for (var i=0;i<vin.length-2;i+=3) {
            var x=vin[i],y=vin[i+1],z=vin[i+2];
            vout[i]=m11*x+m12*y+m13*z+m14;
            vout[i+1]=m21*x+m22*y+m23*z+m24;
            vout[i+2]=m31*x+m32*y+m33*z+m34;
        }
    }

    __proto.transpose=function()
    {
        var tmp;
        tmp=this.$vec[1];
        this.$vec[1]=this.$vec[4];
        this.$vec[4]=tmp;
        tmp=this.$vec[2];
        this.$vec[2]=this.$vec[8];
        this.$vec[8]=tmp;
        tmp=this.$vec[3];
        this.$vec[3]=this.$vec[12];
        this.$vec[12]=tmp;
        tmp=this.$vec[6];
        this.$vec[6]=this.$vec[9];
        this.$vec[9]=tmp;
        tmp=this.$vec[7];
        this.$vec[7]=this.$vec[13];
        this.$vec[13]=tmp;
        tmp=this.$vec[11];
        this.$vec[11]=this.$vec[14];
        this.$vec[14]=tmp;
    }

    __proto.getRotationMatrix=function(theta,u,v,w,a,b,c)
    {
        var u2=u*u,v2=v*v,w2=w*w;
        var L2=u2+v2+w2,L=Math.sqrt(L2);
        u/=L;
        v/=L;
        w/=L;
        u2/=L2;
        v2/=L2;
        w2/=L2;
        var cos=Math.cos(theta),sin=Math.sin(theta);
        var vec=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
        vec[0]=u2+(v2+w2)*cos;
        vec[1]=u*v*(1-cos)+w*sin;
        vec[2]=u*w*(1-cos)-v*sin;
        vec[3]=0;
        vec[4]=u*v*(1-cos)-w*sin;
        vec[5]=v2+(u2+w2)*cos;
        vec[6]=v*w*(1-cos)+u*sin;
        vec[7]=0;
        vec[8]=u*w*(1-cos)+v*sin;
        vec[9]=v*w*(1-cos)-u*sin;
        vec[10]=w2+(u2+v2)*cos;
        vec[11]=0;
        vec[12]=(a*(v2+w2)-u*(b*v+c*w))*(1-cos)+(b*w-c*v)*sin;
        vec[13]=(b*(u2+w2)-v*(a*u+c*w))*(1-cos)+(c*u-a*w)*sin;
        vec[14]=(c*(u2+v2)-w*(a*u+b*v))*(1-cos)+(a*v-b*u)*sin;
        return new Matrix3D(vec);
    }

    __getset(0,__proto,'determinant',
        function()
        {
            var m11=this.$vec[0],m12=this.$vec[4],m13=this.$vec[8],m14=this.$vec[12];
            var m21=this.$vec[1],m22=this.$vec[5],m23=this.$vec[9],m24=this.$vec[13];
            var m31=this.$vec[2],m32=this.$vec[6],m33=this.$vec[10],m34=this.$vec[14];
            var m41=this.$vec[3],m42=this.$vec[7],m43=this.$vec[11],m44=this.$vec[15];
            return m11*(m22*(m33*m44-m43*m34)-m32*(m23*m44-m43*m24)+m42*(m23*m34-m33*m24))-m21*(m12*(m33*m44-m43*m34)-m32*(m13*m44-m43*m14)+m42*(m13*m34-m33*m14))+m31*(m12*(m23*m44-m43*m24)-m22*(m13*m44-m43*m14)+m42*(m13*m24-m23*m14))-m41*(m12*(m23*m34-m33*m24)-m22*(m13*m34-m33*m14)+m32*(m13*m24-m23*m14));
        }
    );

    __getset(0,__proto,'position',
        function()
        {
            return new Vector3D(this.$vec[12],this.$vec[13],this.$vec[14]);
        },
        function(pos)
        {
            this.$vec[12]=pos.x;
            this.$vec[13]=pos.y;
            this.$vec[14]=pos.z;
        }
    );

    __getset(0,__proto,'rawData',
        function()
        {
            return this.$vec;
        },
        function(v)
        {
            if (v.length!=this.$vec.length) {
                throw new Error("Data Error");
            }
            for (var i=0;i<v.length;i++) {
                this.$vec[i]=v[i];
            }
        }
    );

    Matrix3D.interpolate=function(thisMat,toMat,percent)
    {
        return null;
    }

    __static(Matrix3D,[
        'tempMatrix',function(){return this.tempMatrix=new Matrix3D();}
    ]);

    Matrix3D.toString=function(){return "[class Matrix3D]";};
    Mira.un_proto(Matrix3D);
    return Matrix3D;
})();

var Orientation3D=(function() {
    function Orientation3D()
    {
    }

    __class(Orientation3D,'flash.geom.Orientation3D');

    Orientation3D.AXIS_ANGLE="axisAngle";
    Orientation3D.EULER_ANGLES="eulerAngles";
    Orientation3D.QUATERNION="quaternion";

    Orientation3D.toString=function(){return "[class Orientation3D]";};
    return Orientation3D;
})();

var PerspectiveProjection=(function() {
    function PerspectiveProjection()
    {
    }

    __class(PerspectiveProjection,'flash.geom.PerspectiveProjection');
    var __proto=PerspectiveProjection.prototype;

    __proto.toMatrix3D=function()
    {
        return null;
    }

    __getset(0,__proto,'fieldOfView',
        function()
        {
            return 0;
        },
        function(fieldOfViewAngleInDegrees)
        {
        }
    );

    __getset(0,__proto,'focalLength',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'projectionCenter',
        function()
        {
            return null;
        },
        function(p)
        {
        }
    );

    PerspectiveProjection.toString=function(){return "[class PerspectiveProjection]";};
    Mira.un_proto(PerspectiveProjection);
    return PerspectiveProjection;
})();

var Point=(function() {
    function Point(x,y)
    {
        (x===void 0) && (x=0);
        (y===void 0) && (y=0);
        this.x=x;
        this.y=y;
    }

    __class(Point,'flash.geom.Point');
    var __proto=Point.prototype;

    __proto.add=function(v)
    {
        var result=new Point();
        result.x=this.x+v.x;
        result.y=this.y+v.y;
        return result;
    }

    __proto.clone=function()
    {
        var result=new Point();
        result.x=this.x;
        result.y=this.y;
        return result;
    }

    __proto.copyFrom=function(sourcePoint)
    {
        this.x=sourcePoint.x;
        this.y=sourcePoint.y;
    }

    __proto.equals=function(toCompare)
    {
        return toCompare.x==this.x && toCompare.y==this.y;
    }

    __proto.normalize=function(thickness)
    {
        var invD=this.length;
        if (invD>0) {
            invD=(thickness/invD);
            this.x=(this.x*invD);
            this.y=(this.y*invD);
        }
    }

    __proto.offset=function(dx,dy)
    {
        this.x+=dx;
        this.y+=dy;
    }

    __proto.setTo=function(xa,ya)
    {
        this.x=xa;
        this.y=ya;
        return this;
    }

    __proto.subtract=function(v)
    {
        var result=new Point();
        result.x=this.x-v.x;
        result.y=this.y-v.y;
        return result;
    }

    __proto.identity=function()
    {
        this.x=this.y=0.0;
    }

    __proto.toString=function()
    {
        return "(x="+this.x+", y="+this.y+")";
    }

    __getset(0,__proto,'length',
        function()
        {
            return Math.sqrt(this.x*this.x+this.y*this.y);
        }
    );

    Point.distance=function(pt1,pt2)
    {
        return pt1.subtract(pt2).length;
    }

    Point.interpolate=function(pt1,pt2,f)
    {
        var f1=1-f;
        var result=new Point();
        result.x=pt1.x*f+pt2.x*f1;
        result.y=pt1.y*f+pt2.y*f1;
        return result;
    }

    Point.polar=function(len,angle)
    {
        var result=new Point();
        result.x=len*Math.cos(angle);
        result.y=len*Math.sin(angle);
        return result;
    }

    __static(Point,[
        '__DEFAULT__',function(){return this.__DEFAULT__=new Point();}
    ]);

    Point.toString=function(){return "[class Point]";};
    Mira.un_proto(Point);
    return Point;
})();

var Rectangle=(function() {
    function Rectangle(x,y,width,height)
    {
        this.height=0;
        this.width=0;
        this.x=0;
        this.y=0;
        (x===void 0) && (x=0);
        (y===void 0) && (y=0);
        (width===void 0) && (width=0);
        (height===void 0) && (height=0);
        this.x=Number(x);
        this.y=Number(y);
        this.width=Number(width);
        this.height=Number(height);
    }

    __class(Rectangle,'flash.geom.Rectangle');
    var __proto=Rectangle.prototype;

    __proto.clone=function()
    {
        return new Rectangle(this.x,this.y,this.width,this.height);
    }

    __proto.contains=function(x,y)
    {
        return x>=this.x && y>=this.y && x<this.x+this.width && y<this.y+this.height;
    }

    __proto._$containsHit=function(x,y)
    {
        return x>this.x && y>this.y && x<this.x+this.width && y<this.y+this.height;
    }

    __proto.containsPoint=function(point)
    {
        return this.contains(point.x,point.y);
    }

    __proto.containsRect=function(rect)
    {
        var r1=(rect.x+rect.width);
        var b1=(rect.y+rect.height);
        var r2=(this.x+this.width);
        var b2=(this.y+this.height);
        return rect.x>=this.x && rect.x<r2 && rect.y>=this.y && rect.y<b2 && r1>this.x && r1<=r2 && b1>this.y && b1<=b2;
    }

    __proto.copyFrom=function(sourceRect)
    {
        this.x=sourceRect.x;
        this.y=sourceRect.y;
        this.width=sourceRect.width;
        this.height=sourceRect.height;
    }

    __proto.equals=function(toCompare)
    {
        return this.x==toCompare.x && this.y==toCompare.y && this.width==toCompare.width && this.height==toCompare.height;
    }

    __proto.inflate=function(dx,dy)
    {
        this.x-=dx;
        this.y-=dy;
        this.width+=dx*2;
        this.height+=dy*2;
    }

    __proto.inflatePoint=function(point)
    {
        this.inflate(point.x,point.y);
    }

    __proto.intersection=function(toIntersect)
    {
        var result=new Rectangle();
        if (this.isEmpty() || toIntersect.isEmpty()) {
            return result;
        }
        result.x=Math.max(this.x,toIntersect.x);
        result.y=Math.max(this.y,toIntersect.y);
        result.width=Math.min((this.x+this.width),(toIntersect.x+toIntersect.width))-result.x;
        result.height=Math.min((this.y+this.height),(toIntersect.y+toIntersect.height))-result.y;
        if (result.width<=0 || result.height<=0) {
            result.setEmpty();
        }
        return result;
    }

    __proto.intersects=function(toIntersect)
    {
        if (this.isEmpty() || toIntersect.isEmpty()) {
            return false;
        }
        var resultx=Math.max(this.x,toIntersect.x);
        var resulty=Math.max(this.y,toIntersect.y);
        var resultwidth=(Math.min((this.x+this.width),(toIntersect.x+toIntersect.width))-resultx);
        var resultheight=(Math.min((this.y+this.height),(toIntersect.y+toIntersect.height))-resulty);
        if (resultwidth<=0 || resultheight<=0) {
            return false;
        }
        return true;
    }

    __proto.isEmpty=function()
    {
        return this.width<=0 || this.height<=0;
    }

    __proto.offset=function(dx,dy)
    {
        this.x+=dx;
        this.y+=dy;
    }

    __proto.offsetPoint=function(point)
    {
        this.x+=point.x;
        this.y+=point.y;
    }

    __proto.setEmpty=function()
    {
        this.x=this.y=this.width=this.height=0;
    }

    __proto.setTo=function(xa,ya,widtha,heighta)
    {
        this.x=xa;
        this.y=ya;
        this.width=widtha;
        this.height=heighta;
    }

    __proto.toString=function()
    {
        return "(x="+this.x+", y="+this.y+", w="+this.width+", h="+this.height+")";
    }

    __proto.union=function(toUnion)
    {
        if (this.isEmpty()) {
            return toUnion.clone();
        }
        if (toUnion.isEmpty()) {
            return this.clone();
        }
        var r=new Rectangle();
        r.x=Math.min(this.x,toUnion.x);
        r.y=Math.min(this.y,toUnion.y);
        r.width=Math.max((this.x+this.width),(toUnion.x+toUnion.width))-r.x;
        r.height=Math.max((this.y+this.height),(toUnion.y+toUnion.height))-r.y;
        return r;
    }

    __proto._$union_=function(toUnion)
    {
        if (toUnion==null)
            return this;
        if (this.width==0 || this.height==0) {
            this.x=toUnion.x;
            this.y=toUnion.y;
            this.width=toUnion.width;
            this.height=toUnion.height;
            return this;
        }
        if (toUnion.width==0 || toUnion.height==0) {
            return this;
        }
        var maxr=Math.max(this.x+this.width,toUnion.right);
        var maxb=Math.max(this.y+this.height,toUnion.bottom);
        var minx=Math.min(this.x,toUnion.x);
        var miny=Math.min(this.y,toUnion.y);
        this.x=minx;
        this.y=miny;
        this.width=maxr-minx;
        this.height=maxb-miny;
        return this;
    }

    __getset(0,__proto,'bottom',
        function()
        {
            return this.height+this.y;
        },
        function(value)
        {
            this.height=value-this.y;
        }
    );

    __getset(0,__proto,'bottomRight',
        function()
        {
            return new Point(this.x+this.width,this.height+this.y);
        },
        function(value)
        {
            this.right=value.x;
            this.bottom=value.y;
        }
    );

    __getset(0,__proto,'left',
        function()
        {
            return this.x;
        },
        function(value)
        {
            this.width-=value-this.x;
            this.x=value;
        }
    );

    __getset(0,__proto,'right',
        function()
        {
            return this.x+this.width;
        },
        function(value)
        {
            this.width=value-this.x;
        }
    );

    __getset(0,__proto,'size',
        function()
        {
            return new Point(this.width,this.height);
        },
        function(value)
        {
            this.width=value.x;
            this.height=value.y;
        }
    );

    __getset(0,__proto,'top',
        function()
        {
            return this.y;
        },
        function(value)
        {
            this.height-=value-this.y;
            this.y=value;
        }
    );

    __getset(0,__proto,'topLeft',
        function()
        {
            return new Point(this.x,this.y);
        },
        function(value)
        {
            this.left=value.x;
            this.top=value.y;
        }
    );

    Rectangle.toString=function(){return "[class Rectangle]";};
    Mira.un_proto(Rectangle);
    return Rectangle;
})();

var Transform=(function() {
    function Transform(displayObject)
    {
        this._$rotate=0;
        this._$skew=0;
        this._$mat=new Matrix();
        this._scale_=Transform.__SCALE__;
        (displayObject===void 0) && (displayObject=null);
        if (!displayObject)
            return;
        displayObject._transform_=this;
        this._setNode_(displayObject);
    }

    __class(Transform,'flash.geom.Transform');
    var __proto=Transform.prototype;

    __proto._setNode_=function(d)
    {
        this._$node=d;
        this._$ct=null;
        return this;
    }

    __proto._setRotation_=function(value)
    {
        if (value==this._$rotate)
            return;
        this._$rotate=value;
        this._$node._type_|=DisplayObject.TYPE_MATRIX_CHG;
        this._$node._propagateFlagsDown_(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
    }

    __proto._setScaleX_=function(value)
    {
        if (value==this._scale_.x)
            return;
        (this._scale_!=Transform.__SCALE__) ? (this._scale_.x=value) : (this._scale_=new Point(value,1));
        this._$node._type_|=DisplayObject.TYPE_MATRIX_CHG;
        this._$node._propagateFlagsDown_(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
    }

    __proto._setScaleY_=function(value)
    {
        if (value==this._scale_.y)
            return;
        (this._scale_!=Transform.__SCALE__) ? (this._scale_.y=value) : (this._scale_=new Point(1,value));
        this._$node._type_|=DisplayObject.TYPE_MATRIX_CHG;
        this._$node._propagateFlagsDown_(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
    }

    __proto._$getMatrix=function()
    {
        if (!this._$node || (this._$node._type_&DisplayObject.TYPE_MATRIX_CHG)==0)
            return this._$mat;
        this._$node._type_&=~DisplayObject.TYPE_MATRIX_CHG;
        if (this._$skew==0) {
            if (this._$rotate==0) {
                this._$mat.setTo(this._scale_.x,0,0,this._scale_.y,this._$node._left_,this._$node._top_);
            } else {
                var cos=Math.cos(this._$rotate*Transform.ATOR);
                var sin=Math.sin(this._$rotate*Transform.ATOR);
                this._$mat.a=this._scale_.x*cos;
                this._$mat.b=this._scale_.x*sin;
                this._$mat.c=this._scale_.y* -sin;
                this._$mat.d=this._scale_.y*cos;
                this._$mat.tx=this._$node._left_;
                this._$mat.ty=this._$node._top_;
            }
        } else {
            this._$mat.identity();
            this._$mat.a=this._scale_.x;
            this._$mat.c=this._scale_.y* -Math.sin(this._$skew);
            this._$mat.d=this._scale_.y*Math.cos(this._$skew);
            if (this._$rotate) {
                this._$mat.rotate(this._$rotate*Transform.ATOR);
            }
            this._$mat.translate(this._$node._left_,this._$node._top_);
        }
        return this._$mat;
    }

    __getset(0,__proto,'matrix',
        function()
        {
            return this._$getMatrix().clone();
        },
        function(v)
        {
            if (this._$mat.a==v.a && this._$mat.b==v.b && this._$mat.c==v.c && this._$mat.d==v.d && this._$mat.tx==v.tx && this._$mat.ty==v.ty) {
                return;
            }
            this._$node._$doDirty();
            this._$mat.copyFrom(v);
            this._$node.x=this._$mat.tx;
            this._$node.y=this._$mat.ty;
            if (this._scale_==Transform.__SCALE__)
                this._scale_=new Point();
            if (Math.abs(v.b)==0 && Math.abs(v.c)==0 && v.a>0 && v.d>0) {
                this._$skew=0;
                this._scale_.x=v.a;
                this._scale_.y=v.d;
                this._$rotate=0;
            } else {
                var skx=Math.atan( -this._$mat.c/this._$mat.d);
                var sky=Math.atan(this._$mat.b/this._$mat.a);
                if (skx!=skx)
                    skx=0;
                if (sky!=sky)
                    sky=0;
                this._scale_.y=(skx> -Transform.PI_4 && skx<Transform.PI_4) ? this._$mat.d/Math.cos(skx) :  -this._$mat.c/Math.sin(skx);
                this._scale_.x=(sky> -Transform.PI_4 && sky<Transform.PI_4) ? this._$mat.a/Math.cos(sky) : this._$mat.b/Math.sin(sky);
                if (Math.abs(skx-sky)>Transform.PI_2) {
                    if (this._scale_.x<0) {
                        this._scale_.x= -this._scale_.x;
                        sky=sky>0 ? sky-Math.PI : sky+Math.PI;
                    } else {
                        this._scale_.y= -this._scale_.y;
                        skx=skx>0 ? skx-Math.PI : skx+Math.PI;
                    }
                } else if (this._scale_.x<0) {
                    this._scale_.x= -this._scale_.x;
                    sky=sky>0 ? sky-Math.PI : sky+Math.PI;
                    this._scale_.y= -this._scale_.y;
                    skx=skx>0 ? skx-Math.PI : skx+Math.PI;
                }
                this._$rotate=sky*Transform.RTOA;
                this._$skew=skx-sky;
            }
            this._$node._propagateFlagsDown_(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        }
    );

    __getset(0,__proto,'colorTransform',
        function()
        {
            if (this._$ct) {
                return this._$ct._$clone();
            } else {
                return new ColorTransform();
            }
        },
        function(value)
        {
            this._$node._$effectFrame=EventDispatcher.window_as.updatecount;
            this._$node._type_|=DisplayObject.TYPE_FILTER_DIRTY;
            if (value) {
                if (this._$ct)
                    this._$ct._$copyFrom(value);
                else
                    this._$ct=value._$clone();
                this._$ct._$check();
            } else {
                this._$ct=null;
            }
        }
    );

    __getset(0,__proto,'concatenatedMatrix',
        function()
        {
            if (this._$node)
                return this._$node._getConcatenatedMatrix().clone();
            return this.matrix;
        }
    );

    __getset(0,__proto,'pixelBounds',
        function()
        {
            if (this._$node)
                return this._$node.getBounds(Stage.stage);
            return null;
        }
    );

    __static(Transform,[
        '__SCALE__',function(){return this.__SCALE__=new Point(1,1);},
        '__DEFAULT__',function(){return this.__DEFAULT__=new Transform();},
        'PI2',function(){return this.PI2=(Math.PI*2);},
        'PI_2',function(){return this.PI_2=(Math.PI/2);},
        'PI_4',function(){return this.PI_4=(Math.PI/4);},
        'RTOA',function(){return this.RTOA=(180/Math.PI);},
        'ATOR',function(){return this.ATOR=(Math.PI/180);}
    ]);

    Transform.toString=function(){return "[class Transform]";};
    Mira.un_proto(Transform);
    return Transform;
})();

var Vector3D=(function() {
    function Vector3D(x,y,z,w)
    {
        this.$x=0;
        this.$y=0;
        this.$z=0;
        this.$w=0;
        (x===void 0) && (x=0);
        (y===void 0) && (y=0);
        (z===void 0) && (z=0);
        (w===void 0) && (w=0);
        this.$x=x;
        this.$y=y;
        this.$z=z;
        this.$w=w;
    }

    __class(Vector3D,'flash.geom.Vector3D');
    var __proto=Vector3D.prototype;

    __proto.add=function(a)
    {
        return new Vector3D(this.$x+a.x,this.$y+a.y,this.$z+a.z);
    }

    __proto.clone=function()
    {
        return new Vector3D(this.$x,this.$y,this.$z,this.$w);
    }

    __proto.copyFrom=function(sourceVector3D)
    {
        this.$x=sourceVector3D.x;
        this.$y=sourceVector3D.y;
        this.$z=sourceVector3D.z;
    }

    __proto.crossProduct=function(a)
    {
        return new Vector3D(this.$y*a.z-this.$z*a.y,this.$z*a.x-this.$x*a.z,this.$x*a.y-this.$y*a.x,1.0);
    }

    __proto.decrementBy=function(a)
    {
        this.$x-=a.x;
        this.$y-=a.y;
        this.$z-=a.z;
    }

    __proto.dotProduct=function(a)
    {
        return (this.$x*a.x+this.$y*a.y+this.$z*a.z);
    }

    __proto.equals=function(toCompare,allFour)
    {
        (allFour===void 0) && (allFour=false);
        return (this.$x===toCompare.x) && (this.$y===toCompare.y) && (this.$z===toCompare.z) && (!allFour || (this.$w===toCompare.w));
    }

    __proto.incrementBy=function(a)
    {
        this.$x+=a.x;
        this.$y+=a.y;
        this.$z+=a.z;
    }

    __proto.nearEquals=function(toCompare,tolerance,allFour)
    {
        (allFour===void 0) && (allFour=false);
        return (Math.abs(this.$x-toCompare.x)<tolerance) && (Math.abs(this.$y-toCompare.y)<tolerance) && (Math.abs(this.$z-toCompare.z)<tolerance) && (!allFour || (Math.abs(this.$w-toCompare.w)<tolerance));
    }

    __proto.negate=function()
    {
        this.$x= -this.$x;
        this.$y= -this.$y;
        this.$z= -this.$z;
    }

    __proto.normalize=function()
    {
        var len=this.length;
        if (len!==0) {
            this.$x/=len;
            this.$y/=len;
            this.$z/=len;
        } else {
            this.$x=this.$y=this.$z=0;
        }
        return len;
    }

    __proto.project=function()
    {
        this.$x/=this.$w;
        this.$y/=this.$w;
        this.$z/=this.$w;
    }

    __proto.scaleBy=function(s)
    {
        this.$x*=s;
        this.$y*=s;
        this.$z*=s;
    }

    __proto.setTo=function(xa,ya,za)
    {
        this.$x=xa;
        this.$y=ya;
        this.$z=za;
    }

    __proto.subtract=function(a)
    {
        return new Vector3D(this.$x-a.x,this.$y-a.y,this.$z-a.z);
    }

    __proto.toString=function()
    {
        return "Vector3D("+this.$x+", "+this.$y+", "+this.$z+")";
    }

    __getset(0,__proto,'x',
        function()
        {
            return this.$x;
        },
        function(val)
        {
            this.$x=val;
        }
    );

    __getset(0,__proto,'y',
        function()
        {
            return this.$y;
        },
        function(val)
        {
            this.$y=val;
        }
    );

    __getset(0,__proto,'z',
        function()
        {
            return this.$z;
        },
        function(val)
        {
            this.$z=val;
        }
    );

    __getset(0,__proto,'w',
        function()
        {
            return this.$w;
        },
        function(val)
        {
            this.$w=val;
        }
    );

    __getset(0,__proto,'length',
        function()
        {
            return Math.sqrt(this.lengthSquared);
        }
    );

    __getset(0,__proto,'lengthSquared',
        function()
        {
            return (this.$x*this.$x+this.$y*this.$y+this.$z*this.$z);
        }
    );

    Vector3D.angleBetween=function(a,b)
    {
        return Math.acos(a.dotProduct(b)/(a.length*b.length));
    }

    Vector3D.distance=function(pt1,pt2)
    {
        return pt1.subtract(pt2).length;
    }

    __static(Vector3D,[
        'X_AXIS',function(){return this.X_AXIS=new Vector3D(1,0,0);},
        'Y_AXIS',function(){return this.Y_AXIS=new Vector3D(0,1,0);},
        'Z_AXIS',function(){return this.Z_AXIS=new Vector3D(0,0,1);}
    ]);

    Vector3D.toString=function(){return "[class Vector3D]";};
    Mira.un_proto(Vector3D);
    return Vector3D;
})();

var Camera=(function(_super) {
    function Camera()
    {
        Camera.__super.call(this);
    }

    __class(Camera,'flash.media.Camera',_super);
    var __proto=Camera.prototype;

    __proto.setCamera=function(camera)
    {
        this._camera=camera;
        return this;
    }

    __proto.setCursor=function(value)
    {
        this._camera.setCursor(value);
    }

    __proto.setKeyFrameInterval=function(keyFrameInterval)
    {
        this._camera.setKeyFrameInterval(keyFrameInterval);
    }

    __proto.setLoopback=function(compress)
    {
        (compress===void 0) && (compress=false);
        this._camera.setLoopback(compress);
    }

    __proto.setMode=function(width,height,fps,favorArea)
    {
        (favorArea===void 0) && (favorArea=true);
        this._camera.setMode(width,height,fps,favorArea);
    }

    __proto.setMotionLevel=function(motionLevel,timeout)
    {
        (timeout===void 0) && (timeout=2000);
        this._camera.setMotionLevel(motionLevel,timeout);
    }

    __proto.setQuality=function(bandwidth,quality)
    {
        this._camera.setQuality(bandwidth,quality);
    }

    __getset(0,__proto,'activityLevel',
        function()
        {
            return this._camera.activityLevel;
        }
    );

    __getset(0,__proto,'bandwidth',
        function()
        {
            return this._camera.bandwidth|0;
        }
    );

    __getset(0,__proto,'currentFPS',
        function()
        {
            return this._camera.currentFPS;
        }
    );

    __getset(0,__proto,'fps',
        function()
        {
            return this._camera.fps;
        }
    );

    __getset(0,__proto,'height',
        function()
        {
            return this._camera.height|0;
        }
    );

    __getset(0,__proto,'index',
        function()
        {
            return this._camera.index|0;
        }
    );

    __getset(0,__proto,'keyFrameInterval',
        function()
        {
            return this._camera.keyFrameInterval|0;
        }
    );

    __getset(0,__proto,'loopback',
        function()
        {
            return this._camera.loopback;
        }
    );

    __getset(0,__proto,'motionLevel',
        function()
        {
            return this._camera.motionLevel|0;
        }
    );

    __getset(0,__proto,'motionTimeout',
        function()
        {
            return this._camera.motionTimeout|0;
        }
    );

    __getset(0,__proto,'muted',
        function()
        {
            return this._camera.muted;
        }
    );

    __getset(0,__proto,'name',
        function()
        {
            return __string(this._camera.name);
        }
    );

    __getset(0,__proto,'quality',
        function()
        {
            return this._camera.quality|0;
        }
    );

    __getset(0,__proto,'width',
        function()
        {
            return this._camera.width|0;
        }
    );

    __getset(1,Camera,'isSupported',
        function()
        {
            return Camera.isSupported;
        }
    );

    __getset(1,Camera,'names',
        function()
        {
            var result=[];
            for (var $a in Camera._cameras) {
                var key=Camera._cameras[$a];
                result.push(key);
            }
            return result;
        }
    );

    Camera._scanHardware=function()
    {
    }

    Camera.getCamera=function(name)
    {
        (name===void 0) && (name=null);
        if (Camera._cameras[name])
            return Camera._cameras[name];
        var result=new Camera();
        Camera._cameras[name]=result;
        return result.setCamera(Camera.getCamera(name));
    }

    __static(Camera,[
        '_cameras',function(){return this._cameras=new Object();}
    ]);

    Camera.toString=function(){return "[class Camera]";};
    Mira.un_proto(Camera);
    return Camera;
})(EventDispatcher);

var ID3Info=(function() {
    function ID3Info()
    {
    }

    __class(ID3Info,'flash.media.ID3Info');

    ID3Info.toString=function(){return "[class ID3Info]";};
    return ID3Info;
})();

var Microphone=(function(_super) {
    function Microphone()
    {
        Microphone.__super.call(this);
    }

    __class(Microphone,'flash.media.Microphone',_super);
    var __proto=Microphone.prototype;

    __proto.setMicrophone=function(mic)
    {
        this._mic=mic;
        return this;
    }

    __proto.setLoopBack=function(state)
    {
        (state===void 0) && (state=true);
        this._mic.setLoopBack=state;
    }

    __proto.setSilenceLevel=function(silenceLevel,timeout)
    {
        (timeout===void 0) && (timeout= -1);
        this._mic.setSilenceLevel(silenceLevel,timeout);
    }

    __proto.setUseEchoSuppression=function(useEchoSuppression)
    {
        this._mic.setUseEchoSuppression(useEchoSuppression);
    }

    __getset(0,__proto,'activityLevel',
        function()
        {
            return this._mic.activityLevel;
        }
    );

    __getset(0,__proto,'codec',
        function()
        {
            return __string(this._mic.codec);
        },
        function(codec)
        {
            this._mic.codec=codec;
        }
    );

    __getset(0,__proto,'enableVAD',
        function()
        {
            return this._mic.enableVAD;
        },
        function(enable)
        {
            this._mic.enableVAD=enable;
        }
    );

    __getset(0,__proto,'encodeQuality',
        function()
        {
            return this._mic.encodeQuality|0;
        },
        function(quality)
        {
            this._mic.encodeQuality=quality;
        }
    );

    __getset(0,__proto,'framesPerPacket',
        function()
        {
            return this._mic.framesPerPacket|0;
        },
        function(frames)
        {
            this._mic.framesPerPacket=frames;
        }
    );

    __getset(0,__proto,'gain',
        function()
        {
            return this._mic.gain;
        },
        function(gain)
        {
            this._mic.gain=gain;
        }
    );

    __getset(0,__proto,'index',
        function()
        {
            return this._mic.activityLevel|0;
        }
    );

    __getset(0,__proto,'muted',
        function()
        {
            return this._mic.activityLevel;
        }
    );

    __getset(0,__proto,'name',
        function()
        {
            return __string(this._mic.activityLevel);
        }
    );

    __getset(0,__proto,'noiseSuppressionLevel',
        function()
        {
            return this._mic.noiseSuppressionLevel|0;
        },
        function(level)
        {
            this._mic.noiseSuppressionLevel=level;
        }
    );

    __getset(0,__proto,'rate',
        function()
        {
            return this._mic.rate|0;
        },
        function(rate)
        {
            this._mic.rate=rate;
        }
    );

    __getset(0,__proto,'silenceLevel',
        function()
        {
            return this._mic.activityLevel;
        }
    );

    __getset(0,__proto,'silenceTimeout',
        function()
        {
            return this._mic.activityLevel|0;
        }
    );

    __getset(0,__proto,'soundTransform',
        function()
        {
            return this._mic.soundTransform;
        },
        function(sndTransform)
        {
            this._mic.soundTransform=sndTransform;
        }
    );

    __getset(0,__proto,'useEchoSuppression',
        function()
        {
            return this._mic.activityLevel;
        }
    );

    __getset(1,Microphone,'isSupported',
        function()
        {
            return Microphone.isSupported;
        }
    );

    __getset(1,Microphone,'names',
        function()
        {
            var result=[];
            for (var $a in Microphone._mics) {
                var mic=Microphone._mics[$a];
                result.push(mic.name);
            }
            return result;
        }
    );

    Microphone.getMicrophone=function(index)
    {
        (index===void 0) && (index= -1);
        if (Microphone._mics[index])
            return Microphone._mics[index];
        var result=new Microphone();
        Microphone._mics[index]=result;
        return result.setMicrophone(Microphone.getMicrophone(index));
    }

    __static(Microphone,[
        '_mics',function(){return this._mics=new Object();}
    ]);

    Microphone.toString=function(){return "[class Microphone]";};
    Mira.un_proto(Microphone);
    return Microphone;
})(EventDispatcher);

var Sound=(function(_super) {
    function Sound(stream,context)
    {
        this._$bytesTotal=0;
        this._$cid=0;
        Sound.__super.call(this);
        (stream===void 0) && (stream=null);
        (context===void 0) && (context=null);
        if (Sound._$enableAudioContext) {
            this._$audio=new ContextPlayer();
        } else {
            this._$audio=new AudioPlayer();
        }
        stream && this.load(stream,context);
    }

    __class(Sound,'flash.media.Sound',_super);
    var __proto=Sound.prototype;

    __proto.close=function()
    {
        if (!this._$audio)
            return;
        this._$audio.removeEventListener(Event.COMPLETE,__bind(this._$loadEnd,this));
        this._$audio.close();
        var i=Sound._$playingAudio.indexOf(this._$audio);
        if (i!= -1)
            Sound._$playingAudio.splice(i,1);
    }

    __proto.extract=function(target,length,startPosition)
    {
        (startPosition===void 0) && (startPosition= -1);
        trace('-- NATIVE flash.media.Sound.extract');
    }

    __proto.load=function(stream,context)
    {
        (context===void 0) && (context=null);
        this._$audio.addEventListener(Event.COMPLETE,__bind(this._$loadEnd,this));
        this._$audio.load(stream.url);
    }

    __proto.play=function(startTime,loops,sndTransform)
    {
        (startTime===void 0) && (startTime=0);
        (loops===void 0) && (loops=0);
        (sndTransform===void 0) && (sndTransform=null);
        this._$audio.play(startTime,loops);
        Sound._$playingAudio.push(this._$audio);
        !this._$soundChannel && (this._$soundChannel=new SoundChannel());
        this._$soundChannel._$audio=this._$audio;
        if (sndTransform) {
            sndTransform._$player=this._$audio;
            this._$soundChannel.soundTransform=sndTransform;
        }
        if (!this._$audio.hasEventListener(Event.SOUND_COMPLETE)) {
            this._$audio.addEventListener(Event.SOUND_COMPLETE,__bind(this._$playEnd,this));
        }
        return this._$soundChannel;
    }

    __proto._$playEnd=function(e)
    {
        this._$audio!=null && (this._$audio.removeEventListener(Event.SOUND_COMPLETE,__bind(this._$playEnd,this)));
        this._$soundChannel.dispatchEvent(new Event(Event.SOUND_COMPLETE));
    }

    __proto._$loadEnd=function(e)
    {
        this._$audio && (this._$audio.removeEventListener(Event.COMPLETE,__bind(this._$loadEnd,this)));
        this._$dispatchEvent(Event.COMPLETE);
    }

    __proto._$initFromTag=function(data)
    {
        if (this._$audio instanceof ContextPlayer) {
            var cp=__as(this._$audio,ContextPlayer);
            cp.prepareEnd(data);
        } else {
            var ap=__as(this._$audio,AudioPlayer);
            ap.load(__string(data.url));
        }
    }

    __proto.loadCompressedDataFromByteArray=function(bytes,length)
    {
        trace('-- NATIVE flash.media.Sound.loadCompressedDataFromByteArray');
    }

    __getset(0,__proto,'bytesLoaded',
        function()
        {
            if (this._$bytesTotal) {
                return this._$bytesTotal;
            } else {
                return uint(this.length*4096);
            }
        }
    );

    __getset(0,__proto,'bytesTotal',
        function()
        {
            if (this._$bytesTotal) {
                return this._$bytesTotal;
            } else {
                return this.length*4096|0;
            }
        }
    );

    __getset(0,__proto,'id3',
        function()
        {
            trace('-- NATIVE flash.media.Sound.id3');
        }
    );

    __getset(0,__proto,'isBuffering',
        function()
        {
            return false;
        }
    );

    __getset(0,__proto,'isURLInaccessible',
        function()
        {
            return false;
        }
    );

    __getset(0,__proto,'length',
        function()
        {
            return this._$audio ? this._$audio.length : 0;
        }
    );

    __static(Sound,[
        '_$enableAudioContext',function(){return this._$enableAudioContext=window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];},
        '_$audioCtx',function(){return this._$audioCtx=Sound._$enableAudioContext ? new (window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"])() : undefined;},
        '_$playingAudio',function(){return this._$playingAudio=[];}
    ]);

    Sound.toString=function(){return "[class Sound]";};
    Mira.un_proto(Sound);
    return Sound;
})(EventDispatcher);

var SoundChannel=(function(_super) {
    function SoundChannel()
    {
        SoundChannel.__super.call(this);
    }

    __class(SoundChannel,'flash.media.SoundChannel',_super);
    var __proto=SoundChannel.prototype;

    __proto.stop=function()
    {
        if (!this._$audio)
            return;
        this._$audio.stop();
        var i=Sound._$playingAudio.indexOf(this._$audio);
        if (i!= -1)
            Sound._$playingAudio.splice(i,1);
    }

    __getset(0,__proto,'leftPeak',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'position',
        function()
        {
            if (this._$audio && this._$audio.position)
                return this._$audio.position;
            return 0;
        }
    );

    __getset(0,__proto,'rightPeak',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'soundTransform',
        function()
        {
            return this._$soundTransform ? this._$soundTransform : this._$soundTransform=new SoundTransform();
        },
        function(sndTransform)
        {
            this._$soundTransform=sndTransform;
            if (this._$audio && !isNaN(this._$soundTransform.volume)) {
                this._$audio.volume=this._$soundTransform.volume;
            }
            this._$soundTransform._$player=this._$audio;
        }
    );

    SoundChannel.toString=function(){return "[class SoundChannel]";};
    Mira.un_proto(SoundChannel);
    return SoundChannel;
})(EventDispatcher);

var SoundLoaderContext=(function() {
    function SoundLoaderContext()
    {
        this.checkPolicyFile=false;
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
    }

    __class(SoundLoaderContext,'flash.media.SoundLoaderContext');

    SoundLoaderContext.toString=function(){return "[class SoundLoaderContext]";};
    return SoundLoaderContext;
})();

var SoundMixer=(function() {
    function SoundMixer()
    {
    }

    __class(SoundMixer,'flash.media.SoundMixer');

    __getset(1,SoundMixer,'soundTransform',
        function()
        {
            return SoundMixer._$soundTransform;
        },
        function(value)
        {
            SoundMixer._$soundTransform=value;
            if (Sound._$enableAudioContext) {
                SoundMixer._$getGainAll() && (SoundMixer._$getGainAll().gain.value=value.volume);
            } else {
                var arr=Sound._$playingAudio;
                var len=arr.length;
                var audio;
                for (var i=0;i<len;i++) {
                    audio=arr[i];
                    audio && (audio.volume=value.volume);
                }
            }
        }
    );

    SoundMixer.areSoundsInaccessible=function()
    {
        return false;
    }

    SoundMixer._$getGainAll=function()
    {
        if (Sound._$enableAudioContext) {
            if (!SoundMixer._$$gainAll) {
                SoundMixer._$$gainAll=Sound._$audioCtx.createGain() || Sound._$audioCtx.createGainNode();
                SoundMixer._$$gainAll.connect(Sound._$audioCtx.destination);
            }
            return SoundMixer._$$gainAll;
        } else {
            return null;
        }
    }

    SoundMixer.computeSpectrum=function(outputArray,FFTMode,stretchFactor)
    {
        (FFTMode===void 0) && (FFTMode=false);
        (stretchFactor===void 0) && (stretchFactor=0);
    }

    SoundMixer.stopAll=function()
    {
        var arr=Sound._$playingAudio;
        var len=arr.length;
        var audio;
        for (var i=0;i<len;i++) {
            audio=arr[i];
            audio && audio.stop();
        }
        arr.length=0;
    }

    SoundMixer.bufferTime=0;
    SoundMixer._$$gainAll=null;

    __static(SoundMixer,[
        '_$soundTransform',function(){return this._$soundTransform=new SoundTransform();}
    ]);

    SoundMixer.toString=function(){return "[class SoundMixer]";};
    return SoundMixer;
})();

var SoundTransform=(function() {
    function SoundTransform(vol,panning)
    {
        (vol===void 0) && (vol=1);
        (panning===void 0) && (panning=0);
        this._$volume=vol;
    }

    __class(SoundTransform,'flash.media.SoundTransform');
    var __proto=SoundTransform.prototype;

    __getset(0,__proto,'leftToLeft',
        function()
        {
            return 0;
        },
        function(leftToLeft)
        {
        }
    );

    __getset(0,__proto,'leftToRight',
        function()
        {
            return 0;
        },
        function(leftToRight)
        {
        }
    );

    __getset(0,__proto,'pan',
        function()
        {
            return 0;
        },
        function(panning)
        {
        }
    );

    __getset(0,__proto,'rightToLeft',
        function()
        {
            return 0;
        },
        function(rightToLeft)
        {
        }
    );

    __getset(0,__proto,'rightToRight',
        function()
        {
            return 0;
        },
        function(rightToRight)
        {
        }
    );

    __getset(0,__proto,'volume',
        function()
        {
            return this._$volume;
        },
        function(vol)
        {
            this._$$player && (this._$$player.volume=vol);
            this._$volume=vol;
        }
    );

    __getset(0,__proto,'_$player',null,
        function(player)
        {
            this._$$player=player;
            this._$$player && (this._$$player.volume=this._$volume);
        }
    );

    SoundTransform.toString=function(){return "[class SoundTransform]";};
    return SoundTransform;
})();

var Video=(function(_super) {
    function Video(width,height)
    {
        this._$deblocking=0;
        this._$smoothing=false;
        this._scaleY_=1;
        this._scaleX_=1;
        this._$fromFrame=0;
        this._$frameNum=0;
        (width===void 0) && (width=320);
        (height===void 0) && (height=240);
        Video.__super.call(this);
        this._height_=height;
        this._width_=height;
    }

    __class(Video,'flash.media.Video',_super);
    var __proto=Video.prototype;

    __proto.attachCamera=function(camera)
    {
    }

    __proto.attachNetStream=function(netStream)
    {
        trace('-- NATIVE flash.media.Video.attachNetStream');
    }

    __proto.clear=function()
    {
    }

    __proto._$paintThis=function(ctx)
    {
        this._$canvas && this._$canvas.paint(ctx,0,0,this._width_,this._height_);
    }

    __proto._$setVideo=function(data,fromFrame,frameNum)
    {
        (fromFrame===void 0) && (fromFrame=0);
        (frameNum===void 0) && (frameNum=0);
        this._$htmlVideo=data;
        this._$fromFrame=fromFrame;
        this._$frameNum=frameNum;
        this._width_=Math.abs(data.videoWidth*this._scaleX_);
        this._height_=Math.abs(data.videoHeight*this._scaleY_);
        this._type_|=(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        if (!this._$canvas) {
            this._$canvas=new VirtualCanvas();
        }
        this._$canvas.size(data.videoWidth,data.videoHeight);
        this._$canvas.clear();
        this._$canvas.baseImage=data;
        this._$canvas.drawImage(data,0,0);
    }

    __proto._$stageAdd=function()
    {
        _super.prototype._$stageAdd.call(this);
        if (this._$htmlVideo) {
            this._$updateFun=__bind(this._$onUpdate,this);
            this._private_.onupdate.deleted=false;
            this._$htmlVideo.play();
        }
    }

    __proto._$stageRemove=function()
    {
        _super.prototype._$stageRemove.call(this);
        if (this._$htmlVideo) {
            this._$htmlVideo.pause();
            this._$htmlVideo.currentTime=0;
        }
        if (this._private_.onupdate) {
            this._private_.onupdate.deleted=true;
            this._private_.onupdate=null;
        }
    }

    __proto.addFrameTimer=function(fn)
    {
        return Stage.stage._tmctr_.addFrameTimer(fn,this);
    }

    __proto._$onUpdate=function(tm,tmgo,o)
    {
        if (this._$htmlVideo && !this._$htmlVideo.paused) {
            this._$doDirty(true);
        }
        return true;
    }

    __getset(0,__proto,'deblocking',
        function()
        {
            return this._$deblocking;
        },
        function(value)
        {
            this._$deblocking=value;
        }
    );

    __getset(0,__proto,'smoothing',
        function()
        {
            return this._$smoothing;
        },
        function(value)
        {
            this._$smoothing=value;
        }
    );

    __getset(0,__proto,'videoHeight',
        function()
        {
            return (this._$htmlVideo ? this._$htmlVideo.videoHeight : 0)|0;
        }
    );

    __getset(0,__proto,'videoWidth',
        function()
        {
            return (this._$htmlVideo ? this._$htmlVideo.videoWidth : 0)|0;
        }
    );

    __getset(0,__proto,'width',null,
        function(w)
        {
            if (this._width_==w)
                return;
            var oldW=this._width_/this._scaleX_;
            oldW && (this._scaleX_=w/oldW);
            this._width_=Math.abs(w);
            this._type_|=(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        }
    );

    __getset(0,__proto,'height',null,
        function(h)
        {
            if (this._height_==h)
                return;
            var oldH=this._height_/this._scaleY_;
            oldH && (this._scaleY_=h/oldH);
            this._height_=Math.abs(h);
            this._type_|=(DisplayObject.TYPE_CONCATENATEDMATRIX_CHG|DisplayObject.TYPE_BOUNDS_CHG);
        }
    );

    __getset(0,__proto,'scaleX',
        function()
        {
            return this._scaleX_;
        },
        function(value)
        {
            var oldW;
            if (this._width_*this._scaleX_==0 && this._$htmlVideo)
                oldW=this._$htmlVideo.videoWidth;
            else
                oldW=this._width_/this._scaleX_;
            this._scaleX_=value;
            this._width_=Math.abs(oldW*value);
            _super.prototype._$set_scaleX.call(this,this._scaleX_>0 ? 1 :  -1);
        }
    );

    __getset(0,__proto,'scaleY',
        function()
        {
            return this._scaleY_;
        },
        function(value)
        {
            var oldH;
            if (this._height_*this._scaleY_==0 && this._$htmlVideo)
                oldH=this._$htmlVideo.videoHeight;
            else
                oldH=this._height_/this._scaleY_;
            this._scaleY_=value;
            this._height_=Math.abs(oldH*value);
            _super.prototype._$set_scaleY.call(this,this._scaleY_>0 ? 1 :  -1);
        }
    );

    __getset(0,__proto,'_$updateFun',null,
        function(fn)
        {
            if (this._private_.onupdate)
                this._private_.onupdate.deleted=true;
            this._private_.onupdate=this.addFrameTimer(fn);
        }
    );

    Video.toString=function(){return "[class Video]";};
    Mira.un_proto(Video);
    return Video;
})(DisplayObject);

var classDic={};

var FileFilter=(function() {
    function FileFilter(description,extension,macType)
    {
        (macType===void 0) && (macType=null);
    }

    __class(FileFilter,'flash.net.FileFilter');
    var __proto=FileFilter.prototype;

    __getset(0,__proto,'description',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'extension',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'macType',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    FileFilter.toString=function(){return "[class FileFilter]";};
    return FileFilter;
})();

var FileReference=(function(_super) {
    function FileReference()
    {
        FileReference.__super.call(this);
    }

    __class(FileReference,'flash.net.FileReference',_super);
    var __proto=FileReference.prototype;

    __proto.browse=function(typeFilter)
    {
        (typeFilter===void 0) && (typeFilter=null);
        return false;
    }

    __proto.cancel=function()
    {
    }

    __proto.download=function(request,defaultFileName)
    {
        (defaultFileName===void 0) && (defaultFileName=null);
    }

    __proto.load=function()
    {
    }

    __proto.save=function(data,defaultFileName)
    {
        (defaultFileName===void 0) && (defaultFileName=null);
    }

    __proto.upload=function(request,uploadDataFieldName,testUpload)
    {
        (uploadDataFieldName===void 0) && (uploadDataFieldName="Filedata");
        (testUpload===void 0) && (testUpload=false);
    }

    __getset(0,__proto,'creationDate',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'creator',
        function()
        {
            return "";
        }
    );

    __getset(0,__proto,'data',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'modificationDate',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'name',
        function()
        {
            return "";
        }
    );

    __getset(0,__proto,'size',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'type',
        function()
        {
            return "";
        }
    );

    FileReference.toString=function(){return "[class FileReference]";};
    Mira.un_proto(FileReference);
    return FileReference;
})(EventDispatcher);

var getClassByAlias=function(aliasName)
{
    var className=classDic[aliasName];
    if (!className) {
        throw new Error("未注册别名。");
    }
    return className;
}

var LocalConnection=(function(_super) {
    function LocalConnection()
    {
        LocalConnection.__super.call(this);
    }

    __class(LocalConnection,'flash.net.LocalConnection',_super);
    var __proto=LocalConnection.prototype;

    __proto.allowDomain=function()
    {
        var rest=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
    }

    __proto.allowInsecureDomain=function()
    {
        var rest=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
    }

    __proto.close=function()
    {
    }

    __proto.connect=function(connectionName)
    {
    }

    __proto.send=function(connectionName,methodName)
    {
        var rest=[];for(var $a=2,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
    }

    __getset(0,__proto,'client',
        function()
        {
            return null;
        },
        function(client)
        {
        }
    );

    __getset(0,__proto,'domain',
        function()
        {
            return "";
        }
    );

    __getset(0,__proto,'isPerUser',
        function()
        {
            return false;
        },
        function(newValue)
        {
        }
    );

    __getset(1,LocalConnection,'isSupported',
        function()
        {
            return false;
        }
    );

    LocalConnection.toString=function(){return "[class LocalConnection]";};
    Mira.un_proto(LocalConnection);
    return LocalConnection;
})(EventDispatcher);

var navigateToURL=function(request,_window)
{
    (_window===void 0) && (_window=null);
    window.open(request.url || request,_window ? _window : '_blank');
}

var NetConnection=(function(_super) {
    function NetConnection()
    {
        this._version=0;
        NetConnection.__super.call(this);
        Log.error("NetConnection no");
        if (this._netConnection==null) {
        }
    }

    __class(NetConnection,'flash.net.NetConnection',_super);
    var __proto=NetConnection.prototype;

    __proto.addHeader=function(operation,mustUnderstand,param)
    {
        (mustUnderstand===void 0) && (mustUnderstand=false);
        (param===void 0) && (param=null);
        this._netConnection.addHeader(operation,mustUnderstand,param);
    }

    __proto.call=function(command,responder)
    {
        var rest=[];for(var $a=2,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
        var args=[command,responder.resp];
        rest && rest.length>0 && (args=args.concat(rest));
        this._netConnection.call.apply(this._netConnection,args);
    }

    __proto.close=function()
    {
        this._netConnection.close();
    }

    __proto.connect=function(command)
    {
        var rest=[];for(var $a=1,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
        if (command==null) {
            Log.error("Error: Can only connect in \"HTTP streaming\" mode");
        }
        this._netConnection.connect(command,rest);
    }

    __getset(0,__proto,'client',
        function()
        {
            return null;
        },
        function(object)
        {
        }
    );

    __getset(0,__proto,'connected',
        function()
        {
            return true;
        }
    );

    __getset(0,__proto,'connectedProxyType',
        function()
        {
            return "";
        }
    );

    __getset(0,__proto,'farID',
        function()
        {
            return "";
        }
    );

    __getset(0,__proto,'farNonce',
        function()
        {
            return "";
        }
    );

    __getset(0,__proto,'maxPeerConnections',
        function()
        {
            return 8;
        },
        function(maxPeers)
        {
        }
    );

    __getset(0,__proto,'nearID',
        function()
        {
            return "";
        }
    );

    __getset(0,__proto,'nearNonce',
        function()
        {
            return "";
        }
    );

    __getset(0,__proto,'objectEncoding',
        function()
        {
            return this._version;
        },
        function(version)
        {
            this._version=version;
        }
    );

    __getset(0,__proto,'protocol',
        function()
        {
            return "";
        }
    );

    __getset(0,__proto,'proxyType',
        function()
        {
            return "";
        },
        function(ptype)
        {
        }
    );

    __getset(0,__proto,'unconnectedPeerStreams',
        function()
        {
            return [];
        }
    );

    __getset(0,__proto,'uri',
        function()
        {
            return "";
        }
    );

    __getset(0,__proto,'usingTLS',
        function()
        {
            return false;
        }
    );

    __getset(1,NetConnection,'defaultObjectEncoding',
        function()
        {
            return 0;
        },
        function(version)
        {
        }
    );

    NetConnection.CONNECT_SUCCESS="connectSuccess";

    NetConnection.toString=function(){return "[class NetConnection]";};
    Mira.un_proto(NetConnection);
    return NetConnection;
})(EventDispatcher);

var NetStream=(function(_super) {
    function NetStream(connection,peerID)
    {
        NetStream.__super.call(this);
        (peerID===void 0) && (peerID="connectToFMS");
    }

    __class(NetStream,'flash.net.NetStream',_super);
    var __proto=NetStream.prototype;

    __proto.close=function()
    {
    }

    __proto.pause=function()
    {
    }

    __proto.play=function()
    {
        var rest=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
    }

    __proto.seek=function(offset)
    {
    }

    __getset(0,__proto,'bufferLength',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'bytesLoaded',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'bytesTotal',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'client',
        function()
        {
            return null;
        },
        function(object)
        {
        }
    );

    NetStream.toString=function(){return "[class NetStream]";};
    Mira.un_proto(NetStream);
    return NetStream;
})(EventDispatcher);

var ObjectEncoding=(function() {
    function ObjectEncoding()
    {
    }

    __class(ObjectEncoding,'flash.net.ObjectEncoding');

    __getset(1,ObjectEncoding,'dynamicPropertyWriter',
        function()
        {
            return null;
        },
        function(object)
        {
        }
    );

    ObjectEncoding.AMF0=0;
    ObjectEncoding.AMF3=3;
    ObjectEncoding.DEFAULT=3;

    ObjectEncoding.toString=function(){return "[class ObjectEncoding]";};
    return ObjectEncoding;
})();

var registerClassAlias=function(aliasName,classObject)
{
    classDic[aliasName]=classObject;
}

var Responder=(function() {
    function Responder(result,status)
    {
        (status===void 0) && (status=null);
        this._resp=new Responder(result,status);
    }

    __class(Responder,'flash.net.Responder');
    var __proto=Responder.prototype;

    __getset(0,__proto,'resp',
        function()
        {
            return this._resp;
        }
    );

    Responder.toString=function(){return "[class Responder]";};
    return Responder;
})();

var SecurityPanel=(function() {
    function SecurityPanel()
    {
    }

    __class(SecurityPanel,'flash.net.SecurityPanel');

    SecurityPanel.CAMERA="camera";
    SecurityPanel.DEFAULT="default";
    SecurityPanel.DISPLAY="display";
    SecurityPanel.LOCAL_STORAGE="localStorage";
    SecurityPanel.MICROPHONE="microphone";
    SecurityPanel.PRIVACY="privacy";
    SecurityPanel.SETTINGS_MANAGER="settingsManager";

    SecurityPanel.toString=function(){return "[class SecurityPanel]";};
    return SecurityPanel;
})();

var sendToURL=function(request)
{
}

var SharedObject=(function(_super) {
    function SharedObject()
    {
        SharedObject.__super.call(this);
    }

    __class(SharedObject,'flash.net.SharedObject',_super);
    var __proto=SharedObject.prototype;

    __proto.clear=function()
    {
        this.cookie.clear();
    }

    __proto.close=function()
    {
    }

    __proto.flush=function(minDiskSpace)
    {
        (minDiskSpace===void 0) && (minDiskSpace=0);
        return __string(this.cookie.flush(minDiskSpace));
    }

    __proto.send=function()
    {
        var rest=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
    }

    __proto.setDirty=function(propertyName)
    {
    }

    __proto.setProperty=function(propertyName,value)
    {
        (value===void 0) && (value=null);
        this.cookie.setProperty(propertyName,value);
    }

    __proto.setCookie=function(value)
    {
        this.cookie=value;
        return this;
    }

    __getset(0,__proto,'client',
        function()
        {
            return null;
        },
        function(object)
        {
        }
    );

    __getset(0,__proto,'data',
        function()
        {
            return this.cookie.data;
        }
    );

    __getset(0,__proto,'fps',null,
        function(updatesPerSecond)
        {
        }
    );

    __getset(0,__proto,'objectEncoding',
        function()
        {
            return 0;
        },
        function(version)
        {
        }
    );

    __getset(0,__proto,'size',
        function()
        {
            if (this.data==null)
                return 0;
            var i=0;
            for (var k in this.data) {
                i++;
            }
            return i;
        }
    );

    __getset(1,SharedObject,'defaultObjectEncoding',
        function()
        {
            return 0;
        },
        function(version)
        {
        }
    );

    SharedObject.deleteAll=function(url)
    {
        return 0;
    }

    SharedObject.getDiskUsage=function(url)
    {
        return 0;
    }

    SharedObject.getLocal=function(name,localPath,secure)
    {
        (localPath===void 0) && (localPath=null);
        (secure===void 0) && (secure=false);
        if (SharedObject._cookies_[name])
            return SharedObject._cookies_[name];
        var result=new SharedObject();
        SharedObject._cookies_[name]=result;
        return result.setCookie(Cookie.getLocal(name,localPath,secure));
    }

    SharedObject.getRemote=function(name,remotePath,persistence,secure)
    {
        (remotePath===void 0) && (remotePath=null);
        (persistence===void 0) && (persistence=false);
        (secure===void 0) && (secure=false);
        return null;
    }

    __static(SharedObject,[
        '_cookies_',function(){return this._cookies_=[];}
    ]);

    SharedObject.toString=function(){return "[class SharedObject]";};
    Mira.un_proto(SharedObject);
    return SharedObject;
})(EventDispatcher);

var SharedObjectFlushStatus=(function() {
    function SharedObjectFlushStatus()
    {
    }

    __class(SharedObjectFlushStatus,'flash.net.SharedObjectFlushStatus');

    SharedObjectFlushStatus.FLUSHED="flushed";
    SharedObjectFlushStatus.PENDING="pending";

    SharedObjectFlushStatus.toString=function(){return "[class SharedObjectFlushStatus]";};
    return SharedObjectFlushStatus;
})();

var Socket=(function(_super) {
    function Socket(host,port)
    {
        this._connected=false;
        this._port=0;
        this._addInputPosition=0;
        this.timeout=0;
        this.objectEncoding=0;
        (host===void 0) && (host=null);
        (port===void 0) && (port=0);
        Socket.__super.call(this);
        this._endian=Socket.BIG_ENDIAN;
        this.timeout=20000;
        this._addInputPosition=0;
        if (port>0 && port<65535)
            this.connect(host,port);
    }

    __class(Socket,'flash.net.Socket',_super);
    var __proto=Socket.prototype;

    __proto.connect=function(host,port)
    {
        if (this._socket!=null)
            this._socket.onclose=null;
        this.close();
        var url="ws://"+host+":"+port;
        this._host=host;
        this._port=port;
        this._socket=new WebSocket(url);
        this._socket.binaryType="arraybuffer";
        this._stamp=getTimer();
        this._output=new ByteArray();
        this._output.endian=this.endian;
        this._input=new ByteArray();
        this._input.endian=this.endian;
        this._socket.onopen=__bind(this.onOpenHandler,this);
        this._socket.onmessage=__bind(this.onMessageHandler,this);
        this._socket.onclose=__bind(this.onCloseHandler,this);
        this._socket.onerror=__bind(this.onErrorHandler,this);
        this._socket.binaryType="arraybuffer";
    }

    __proto.cleanSocket=function()
    {
        try {
            this._socket.close();
        } catch (e) {
        }
        this._socket=null;
    }

    __proto.close=function()
    {
        if (this._socket!=null) {
            this._connected=false;
            this.cleanSocket();
        }
    }

    __proto.readBoolean=function()
    {
        return this._input.readBoolean();
    }

    __proto.readByte=function()
    {
        return this._input.readByte();
    }

    __proto.readDouble=function()
    {
        return this._input.readDouble();
    }

    __proto.readFloat=function()
    {
        return this._input.readFloat();
    }

    __proto.readInt=function()
    {
        return this._input.readInt();
    }

    __proto.readMultiByte=function(length,charSet)
    {
        return this._input.readMultiByte(length,charSet);
    }

    __proto.readObject=function()
    {
        return this._input.readObject();
    }

    __proto.readShort=function()
    {
        return this._input.readShort();
    }

    __proto.readUnsignedByte=function()
    {
        return this._input.readUnsignedByte();
    }

    __proto.readUnsignedInt=function()
    {
        return this._input.readUnsignedInt();
    }

    __proto.readUnsignedShort=function()
    {
        return this._input.readUnsignedShort();
    }

    __proto.readUTF=function()
    {
        return this._input.readUTF();
    }

    __proto.readUTFBytes=function(length)
    {
        return this._input.readUTFBytes(length);
    }

    __proto.readBytes=function(bytes,offset,length)
    {
        (offset===void 0) && (offset=0);
        (length===void 0) && (length=0);
        this._input.readBytes(bytes,offset,length);
    }

    __proto.writeBoolean=function(value)
    {
        this._output.writeBoolean(value);
    }

    __proto.writeByte=function(value)
    {
        this._output.writeByte(value);
    }

    __proto.writeDouble=function(value)
    {
        this._output.writeDouble(value);
    }

    __proto.writeFloat=function(value)
    {
        this._output.writeFloat(value);
    }

    __proto.writeInt=function(value)
    {
        this._output.writeInt(value);
    }

    __proto.writeMultiByte=function(value,charSet)
    {
        (charSet===void 0) && (charSet="UTF-8");
        this._output.writeMultiByte(value,charSet);
    }

    __proto.writeShort=function(value)
    {
        this._output.writeShort(value);
    }

    __proto.writeUTF=function(value)
    {
        this._output.writeUTF(value);
    }

    __proto.writeUTFBytes=function(value)
    {
        this._output.writeUTFBytes(value);
    }

    __proto.writeUnsignedInt=function(value)
    {
        this._output.writeUnsignedInt(value);
    }

    __proto.writeObject=function(value)
    {
        this._output.writeObject(value);
    }

    __proto.writeBytes=function(bytes,offset,length)
    {
        (offset===void 0) && (offset=0);
        (length===void 0) && (length=0);
        this._output.writeBytes(bytes,offset,length);
    }

    __proto.onOpenHandler=function()
    {
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
        this._connected=true;
        this.dispatchEvent(new Event(Event.CONNECT));
    }

    __proto.onMessageHandler=function(msg)
    {
        if (this._input.length>=0 && this._input.bytesAvailable<1) {
            this._input.clear();
            this._addInputPosition=0;
        }
        var pre=this._input.position;
        !this._addInputPosition && (this._addInputPosition=0);
        this._input.position=this._addInputPosition;
        if (msg) {
            if (typeof msg.data=='string') {
                this._input.writeUTFBytes(__string(msg.data));
            } else {
                this._input.writeArrayBuffer(msg.data);
            }
        }
        this._addInputPosition=this._input.position;
        this._input.position=pre;
        this.dispatchEvent(new Event(ProgressEvent.SOCKET_DATA));
    }

    __proto.onflashMessage=function(evt)
    {
        this.dispatchEvent(new ProgressEvent(ProgressEvent.SOCKET_DATA));
    }

    __proto.onCloseHandler=function()
    {
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
        this._connected=false;
        this.dispatchEvent(new Event(Event.CLOSE));
    }

    __proto.onErrorHandler=function()
    {
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
        this.dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR));
    }

    __proto.flush=function()
    {
        if (this._output && this._output.length>0) {
            try {
                this._socket && this._socket.send(new Uint8Array(this._output._buf,0,this._output.length));
                this._output.endian=this.endian;
                this._output.clear();
            } catch (e) {
            }
        }
    }

    __getset(0,__proto,'connected',
        function()
        {
            return this._connected;
        }
    );

    __getset(0,__proto,'endian',
        function()
        {
            return this._endian;
        },
        function(value)
        {
            this._endian=value;
            if (this._input!=null)
                this._input.endian=value;
            if (this._output!=null)
                this._output.endian=value;
        }
    );

    __getset(0,__proto,'bytesAvailable',
        function()
        {
            return this._input.bytesAvailable;
        }
    );

    __getset(0,__proto,'bytesPending',
        function()
        {
            return this._output.length;
        }
    );

    Socket.LITTLE_ENDIAN="littleEndian";
    Socket.BIG_ENDIAN="bigEndian";

    Socket.toString=function(){return "[class Socket]";};
    Mira.un_proto(Socket);
    return Socket;
})(EventDispatcher);

var URLLoader=(function(_super) {
    function URLLoader(request)
    {
        this.bytesLoaded=0;
        this.bytesTotal=0;
        this.crossDomain=false;
        this.dataFormat=URLLoaderDataFormat.TEXT;
        URLLoader.__super.call(this);
        (request===void 0) && (request=null);
        if (request!=null) {
            this.load(request);
        }
    }

    __class(URLLoader,'flash.net.URLLoader',_super);
    var __proto=URLLoader.prototype;

    __proto.close=function()
    {
    }

    __proto.load=function(request)
    {
        var _$this=this;
        this._$url=request.url;
        var contentType=Method.formatUrlType(request.url);
        if (this.dataFormat==URLLoaderDataFormat.TEXT) {
            if (contentType=="xml") {
                this._$file=new FileRead(request.url,{onload: __bind(this._Loader,this),unOnload: __bind(this._LoaderError,this)},null);
                this._$file.contentType=contentType;
            } else if (contentType=="fnt") {
                this._$file=new FileRead(request.url,{onload: __bind(this._Loader,this),unOnload: __bind(this._LoaderError,this)},null);
                this._$file.contentType=contentType;
            } else if (request.url.indexOf("?")> -1 && this.crossDomain) {
                var _this=this;
                var f=function (d) {
                    var e=new Event(Event.COMPLETE);
                    _this.data=e._$eData=d;
                    _this.dispatchEvent(e);
                };
                Ajax.GetJSON(request.url,f);
            } else {
                if (request.data!=null) {
                    var data2=request.data.toString();
                    if (data2) {
                        var method=request.method.toLowerCase();
                        if (method!="post") {
                            if (request.url.indexOf("?")== -1) {
                                request.url=request.url+"?"+data2;
                            } else {
                                request.url=request.url+"&"+data2;
                            }
                        }
                    }
                }
                this._$file=new FileRead(request.url,{onload: __bind(this._Loader,this),unOnload: __bind(this._LoaderError,this)},null,request);
                this._$file.contentType=contentType;
            }
        } else if (this.dataFormat==URLLoaderDataFormat.BINARY) {
            this._$file=new FileRead(request.url,{onload: __bind(this._Loader,this),unOnload: __bind(this._LoaderError,this)},URLLoaderDataFormat.BINARY,request);
            this._$file.contentType=Method.formatUrlType(request.url);
        } else {
        }
    }

    __proto._LoaderError=function(fileread)
    {
        this.dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR));
        this._$file=null;
    }

    __proto._Loader=function(fileread)
    {
        this.data=fileread.contentdata;
        this.bytesTotal=this.data.length|0;
        this.bytesLoaded=this.data.length|0;
        if (fileread.contentType=="swf") {
            this.data["url"]=this._$url;
        }
        this.dispatchEvent(new Event(Event.COMPLETE));
        this._$file=null;
    }

    URLLoader.toString=function(){return "[class URLLoader]";};
    Mira.un_proto(URLLoader);
    return URLLoader;
})(EventDispatcher);

var URLLoaderDataFormat=(function() {
    function URLLoaderDataFormat()
    {
    }

    __class(URLLoaderDataFormat,'flash.net.URLLoaderDataFormat');

    URLLoaderDataFormat.BINARY="binary";
    URLLoaderDataFormat.TEXT="text";
    URLLoaderDataFormat.VARIABLES="variables";

    URLLoaderDataFormat.toString=function(){return "[class URLLoaderDataFormat]";};
    return URLLoaderDataFormat;
})();

var URLRequest=(function() {
    function URLRequest(url)
    {
        this._method=URLRequestMethod.GET;
        this._requestHeaders=[];
        (url===void 0) && (url=null);
        this._url=url;
    }

    __class(URLRequest,'flash.net.URLRequest');
    var __proto=URLRequest.prototype;

    __getset(0,__proto,'contentType',
        function()
        {
            return this._contentType;
        },
        function(value)
        {
            this._contentType=value;
        }
    );

    __getset(0,__proto,'data',
        function()
        {
            return this._data;
        },
        function(value)
        {
            this._data=value;
        }
    );

    __getset(0,__proto,'digest',
        function()
        {
            return this._digest;
        },
        function(value)
        {
            this._digest=value;
        }
    );

    __getset(0,__proto,'method',
        function()
        {
            return this._method;
        },
        function(value)
        {
            this._method=value;
        }
    );

    __getset(0,__proto,'requestHeaders',
        function()
        {
            return this._requestHeaders;
        },
        function(value)
        {
            this._requestHeaders=value;
        }
    );

    __getset(0,__proto,'url',
        function()
        {
            return this._url;
        },
        function(value)
        {
            this._url=value;
        }
    );

    URLRequest.toString=function(){return "[class URLRequest]";};
    return URLRequest;
})();

var URLRequestHeader=(function() {
    function URLRequestHeader(name,value)
    {
        this.name="Content-Type";
        this.value="application/x-www-form-urlencoded";
        (name===void 0) && (name="");
        (value===void 0) && (value="");
        this.name=name;
        this.value=value;
    }

    __class(URLRequestHeader,'flash.net.URLRequestHeader');

    URLRequestHeader.toString=function(){return "[class URLRequestHeader]";};
    return URLRequestHeader;
})();

var URLRequestMethod=(function() {
    function URLRequestMethod()
    {
    }

    __class(URLRequestMethod,'flash.net.URLRequestMethod');

    URLRequestMethod.DELETE="DELETE";
    URLRequestMethod.GET="GET";
    URLRequestMethod.HEAD="HEAD";
    URLRequestMethod.OPTIONS="OPTIONS";
    URLRequestMethod.POST="POST";
    URLRequestMethod.PUT="PUT";

    URLRequestMethod.toString=function(){return "[class URLRequestMethod]";};
    return URLRequestMethod;
})();

var URLStream=(function(_super) {
    function URLStream()
    {
        this.fileData=null;
        URLStream.__super.call(this);
        this._input==null && (this._input=new ByteArray());
    }

    __class(URLStream,'flash.net.URLStream',_super);
    var __proto=URLStream.prototype;

    __proto.close=function()
    {
    }

    __proto.load=function(request)
    {
        var index=(request.url).lastIndexOf("?");
        var contentType=Method.formatUrlType(request.url);
        this.file=new FileRead(request.url,{onload: __bind(this._Loader,this),unOnload: __bind(this._LoaderError,this)},URLLoaderDataFormat.BINARY,request);
        this.file.contentType=Method.formatUrlType(request.url);
    }

    __proto._LoaderError=function(fileread)
    {
        this.dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR));
    }

    __proto._Loader=function(fileread)
    {
        if (fileread.contentType=="swf") {
            var bytes=new ByteArray();
            fileread.contentdata.readBytes(bytes,bytes.position);
            bytes.set("url",fileread.url);
            bytes.position=0;
            this._input=bytes;
            bytes=null;
        } else {
            fileread.contentdata.position=0;
            this._input=fileread.contentdata;
        }
        this.dispatchEvent(new Event(Event.COMPLETE));
    }

    __proto.readBoolean=function()
    {
        return this._input.readBoolean();
    }

    __proto.readByte=function()
    {
        return this._input.readByte();
    }

    __proto.readBytes=function(bytes,offset,length)
    {
        (offset===void 0) && (offset=0);
        (length===void 0) && (length=0);
        return this._input.readBytes(bytes);
    }

    __proto.readDouble=function()
    {
        return this._input.readDouble();
    }

    __proto.readFloat=function()
    {
        return this._input.readFloat();
    }

    __proto.readInt=function()
    {
        return this._input.readInt();
    }

    __proto.readMultiByte=function(length,charSet)
    {
        return this._input.readMultiByte(length,charSet);
    }

    __proto.readObject=function()
    {
        return this._input.readObject();
    }

    __proto.readShort=function()
    {
        return this._input.readShort();
    }

    __proto.readUnsignedByte=function()
    {
        return this._input.readUnsignedByte();
    }

    __proto.readUnsignedInt=function()
    {
        return this._input.readUnsignedInt();
    }

    __proto.readUnsignedShort=function()
    {
        return this._input.readUnsignedShort();
    }

    __proto.readUTF=function()
    {
        return this._input.readUTF();
    }

    __proto.readUTFBytes=function(length)
    {
        return this._input.readUTFBytes(length);
    }

    __getset(0,__proto,'bytesAvailable',
        function()
        {
            if (this._input.bytesAvailable==0) {
                this._input.position=0;
            }
            return this._input.bytesAvailable;
        }
    );

    __getset(0,__proto,'connected',
        function()
        {
            return false;
        }
    );

    __getset(0,__proto,'endian',
        function()
        {
            return this._input.endian;
        },
        function(type)
        {
            this._input.endian=type;
        }
    );

    __getset(0,__proto,'objectEncoding',
        function()
        {
            return this._input.objectEncoding;
        },
        function(version)
        {
            this._input.objectEncoding=version;
        }
    );

    URLStream.toString=function(){return "[class URLStream]";};
    Mira.un_proto(URLStream);
    return URLStream;
})(EventDispatcher);

var URLVariables=(function() {
    function URLVariables(source)
    {
        this.__decodeRegExp__=new RegExp("[?&]?([^=]+)=([^&]*)","g");
        (source===void 0) && (source=null);
        source!=null && this.decode(source);
    }

    __class(URLVariables,'flash.net.URLVariables');
    var __proto=URLVariables.prototype;

    __proto.decode=function(source)
    {
        if (!source)
            return;
        if (!this.variables) {
            this.variables={};
        }
        source=source.split("+").join(" ");
        var tokens;
        var re=this.__decodeRegExp__;
        while (tokens=re.exec(source)) {
            Log.unfinished("URLVariables","decode");
            this.variables[tokens[1]]=tokens[2];
        }
    }

    __proto.toString=function()
    {
        var variables={};
        var str="";
        var isFirst=true;
        if (!this.variables) {
            for (var key in this) {
                if (key=="variables" || key=="decode" || key=="__decodeRegExp__" || key=="toString")
                    continue;
                if (isFirst) {
                    isFirst=false;
                } else {
                    str+="&";
                }
                str+=key+"="+this[key];
            }
            return str;
        }
        for (key in variables) {
            if (isFirst) {
                isFirst=false;
            } else {
                str+="&";
            }
            str+=key+"="+variables[key];
        }
        return str;
    }

    URLVariables.toString=function(){return "[class URLVariables]";};
    Mira.un_proto(URLVariables);
    return URLVariables;
})();

var Accelerometer=(function(_super) {
    function Accelerometer()
    {
        this._useCount=0;
        this._interval=30;
        this._curTimestamp=0;
        Accelerometer.__super.call(this);
    }

    __class(Accelerometer,'flash.sensors.Accelerometer',_super);
    var __proto=Accelerometer.prototype;

    __proto.setRequestedUpdateInterval=function(interval)
    {
        this._interval=interval;
    }

    __proto.addEventListener=function(type,listener,useCapture,priority,useWeakReference)
    {
        (useCapture===void 0) && (useCapture=false);
        (priority===void 0) && (priority=0);
        (useWeakReference===void 0) && (useWeakReference=false);
        _super.prototype.addEventListener.call(this,type,listener,useCapture,priority,useWeakReference);
        if (this._useCount==0) {
            Accelerometer.acceptSysOrientationListener();
        }
        if (Accelerometer._accList.indexOf(this)== -1) {
            Accelerometer._accList.push(this);
            this._useCount++;
        }
    }

    __proto.removeEventListener=function(type,listener,useCapture)
    {
        (useCapture===void 0) && (useCapture=false);
        _super.prototype.removeEventListener.call(this,type,listener,useCapture);
        var index=Accelerometer._accList.indexOf(this);
        if (index!= -1) {
            Accelerometer._accList.splice(index,1);
            this._useCount--;
        }
        if (this._useCount==0) {
            Accelerometer.removeSysOrientationListener();
        }
    }

    __proto.dispatchAccEvent=function(e)
    {
        if (e.timestamp-this._curTimestamp>this._interval) {
            this.dispatchEvent(e);
            this._curTimestamp=e.timestamp;
        }
    }

    __getset(0,__proto,'muted',
        function()
        {
            return false;
        }
    );

    __getset(1,Accelerometer,'isSupported',
        function()
        {
            if (window.DeviceMotionEvent)
                return true;
            return false;
        }
    );

    Accelerometer.orientationListener=function(e)
    {
        var e=AccelerometerEvent.copySysEvent(e);
        for (var $a in Accelerometer._accList) {
            var ar=Accelerometer._accList[$a];
            ar.dispatchAccEvent(e);
        }
    }

    Accelerometer.acceptSysOrientationListener=function()
    {
        window.addEventListener('devicemotion',Accelerometer.orientationListener,false);
    }

    Accelerometer.removeSysOrientationListener=function()
    {
        window.removeEventListener('devicemotion',Accelerometer.orientationListener,false);
    }

    __static(Accelerometer,[
        '_accList',function(){return this._accList=[];}
    ]);

    Accelerometer.toString=function(){return "[class Accelerometer]";};
    Mira.un_proto(Accelerometer);
    return Accelerometer;
})(EventDispatcher);

var Geolocation=(function(_super) {
    function Geolocation(target)
    {
        this.preTime=0;
        this._muted=false;
        this._isFirstStatu=true;
        this._inteval=10;
        (target===void 0) && (target=null);
        Geolocation.__super.call(this,target);
    }

    __class(Geolocation,'flash.sensors.Geolocation',_super);
    var __proto=Geolocation.prototype;

    __proto.positionGet=function(pos)
    {
        this.muteds=false;
        var tTime=getTimer();
        if (tTime-this.preTime>this._inteval) {
            var evt;
            evt=GeolocationEvent.getFromH5Event(pos.coords);
            evt.timestamp=pos.timestamp;
            this.dispatchEvent(evt);
            this.preTime=tTime;
        } else {
        }
    }

    __proto.positionFail=function(error)
    {
        switch (error.code) {
        case 0:
            trace("获取位置信息出错！");
            break;
        case 1:
            trace("您设置了阻止该页面获取位置信息！");
            break;
        case 2:
            trace("浏览器无法确定您的位置！");
            break;
        case 3:
            trace("获取位置信息超时！");
            break;
        }
        this.muteds=true;
    }

    __proto.beginGetPosition=function()
    {
        this.stopGetPostion();
        this._listenID=Browser.navigator.geolocation.watchPosition(__bind(this.positionGet,this),__bind(this.positionFail,this));
    }

    __proto.stopGetPostion=function()
    {
        Browser.navigator.geolocation.clearWatch(this._listenID);
    }

    __proto.addEventListener=function(type,listener,useCapture,priority,useWeakReference)
    {
        (useCapture===void 0) && (useCapture=false);
        (priority===void 0) && (priority=0);
        (useWeakReference===void 0) && (useWeakReference=false);
        _super.prototype.addEventListener.call(this,type,listener,useCapture,priority,useWeakReference);
        if (type==GeolocationEvent.UPDATE) {
            this.beginGetPosition();
        }
    }

    __proto.removeEventListener=function(type,listener,useCapture)
    {
        (useCapture===void 0) && (useCapture=false);
        _super.prototype.removeEventListener.call(this,type,listener,useCapture);
        if (type==GeolocationEvent.UPDATE) {
            this.stopGetPostion();
        }
    }

    __proto.setRequestedUpdateInterval=function(interval)
    {
        (interval===void 0) && (interval=500);
        this._inteval=interval|0;
        return;
    }

    __getset(0,__proto,'muted',
        function()
        {
            return this._muted;
        }
    );

    __getset(0,__proto,'muteds',null,
        function(value)
        {
            if ((value!=this._muted) || this._isFirstStatu) {
                var evt=new StatusEvent(StatusEvent.STATUS);
                this._muted=value;
                this.dispatchEvent(evt);
                this._isFirstStatu=false;
            }
        }
    );

    __getset(1,Geolocation,'isSupported',
        function()
        {
            return Browser.navigator.geolocation;
        }
    );

    Geolocation.toString=function(){return "[class Geolocation]";};
    Mira.un_proto(Geolocation);
    return Geolocation;
})(EventDispatcher);

var Capabilities=(function() {
    function Capabilities()
    {
    }

    __class(Capabilities,'flash.system.Capabilities');

    __getset(1,Capabilities,'os',
        function()
        {
            if (Capabilities._$os)
                return Capabilities._$os;
            var sUserAgent;
            Capabilities._$os="Unknown";
            var pf=__string(navigator.platform.toLowerCase());
            if (pf=="iphone")
                Capabilities._$os="iPhone";
            else if (pf=="ipad")
                Capabilities._$os="iPad";
            else if ((pf=="mac68k") || (pf=="macppc") || (pf=="macintosh") || (pf=="macintel"))
                Capabilities._$os="Mac OS";
            else if (pf.indexOf("linux")> -1) {
                sUserAgent=__string(navigator.userAgent.toLowerCase());
                if (sUserAgent.indexOf("android")> -1) {
                    Capabilities._$os="Android";
                } else
                    Capabilities._$os="Linux";
            } else if ((pf=="win32") || (pf=="windows")) {
                sUserAgent=__string(navigator.userAgent);
                if (sUserAgent.indexOf("Windows NT 5.0")> -1 || sUserAgent.indexOf("Windows 2000")> -1)
                    Capabilities._$os="Windows 2000";
                else if (sUserAgent.indexOf("Windows NT 5.1")> -1 || sUserAgent.indexOf("Windows XP")> -1)
                    Capabilities._$os="Windows XP";
                else if (sUserAgent.indexOf("Windows NT 5.2")> -1 || sUserAgent.indexOf("Windows 2003")> -1)
                    Capabilities._$os="Windows Server 2003";
                else if (sUserAgent.indexOf("Windows NT 6.0")> -1 || sUserAgent.indexOf("Windows Vista")> -1)
                    Capabilities._$os="Windows Vista";
                else if (sUserAgent.indexOf("Windows NT 6.1")> -1 || sUserAgent.indexOf("Windows 7")> -1)
                    Capabilities._$os="Windows 7";
                else if (sUserAgent.indexOf("Windows NT 6.2")> -1 || sUserAgent.indexOf("Windows NT 6.3")> -1)
                    Capabilities._$os="Windows 8";
                else if (sUserAgent.indexOf("Windows NT 10")> -1 || sUserAgent.indexOf("Windows 10")> -1)
                    Capabilities._$os="Windows 10";
                else
                    Capabilities._$os="Windows";
            }
            return Capabilities._$os;
        }
    );

    __getset(1,Capabilities,'isDebugger',
        function()
        {
            return false;
        }
    );

    __getset(1,Capabilities,'language',
        function()
        {
            return __string(window.navigator.language);
        }
    );

    __getset(1,Capabilities,'playerType',
        function()
        {
            return "PlugIn";
        }
    );

    __getset(1,Capabilities,'screenResolutionX',
        function()
        {
            if (Capabilities._screenResolutionX==0)
                Capabilities.initScreenResolutionXY();
            return Capabilities._screenResolutionX;
        }
    );

    __getset(1,Capabilities,'screenResolutionY',
        function()
        {
            if (Capabilities._screenResolutionY==0)
                Capabilities.initScreenResolutionXY();
            return Capabilities._screenResolutionY;
        }
    );

    __getset(1,Capabilities,'serverString',
        function()
        {
            return "";
        }
    );

    __getset(1,Capabilities,'version',
        function()
        {
            var p;
            var s=Capabilities.os;
            if (s=="iPhone" || s=="Mac OS" || s=="iPad")
                p="MAC";
            else if (s=="Android")
                p="AND";
            else if (s=="Linux")
                p="LNX";
            else
                p="WIN";
            return p+" 12,0,0,1";
        }
    );

    __getset(1,Capabilities,'browser',
        function()
        {
            if (Capabilities._$browserType)
                return Capabilities._$browserType;
            var UserAgent=__string(navigator.userAgent.toLowerCase());
            if (/version\/([\d.]+).*safari/.test(UserAgent))
                Capabilities._$browserType="Safari";
            else if (/ucweb/.test(UserAgent))
                Capabilities._$browserType="UC";
            else if (/firefox/.test(UserAgent))
                Capabilities._$browserType="Firefox";
            else if (/opera/.test(UserAgent))
                Capabilities._$browserType="Opera";
            else if (/360se/.test(UserAgent))
                Capabilities._$browserType="360";
            else if (/bidubrowser/.test(UserAgent))
                Capabilities._$browserType="Baidu";
            else if (/metasr/.test(UserAgent))
                Capabilities._$browserType="Sougou";
            else if (/msie 6.0/.test(UserAgent))
                Capabilities._$browserType="IE6";
            else if (/msie 7.0/.test(UserAgent))
                Capabilities._$browserType="IE7";
            else if (/msie 8.0/.test(UserAgent))
                Capabilities._$browserType="IE8";
            else if (/msie 9.0/.test(UserAgent))
                Capabilities._$browserType="IE9";
            else if (/msie 10.0/.test(UserAgent))
                Capabilities._$browserType="IE10";
            else if (/msie 11.0/.test(UserAgent))
                Capabilities._$browserType="IE11";
            else if (/edge/.test(UserAgent))
                Capabilities._$browserType="Edge";
            else if (/lbbrowser/.test(UserAgent))
                Capabilities._$browserType="LB";
            else if (/micromessenger/.test(UserAgent))
                Capabilities._$browserType="WX";
            else if (/qqbrowser/.test(UserAgent))
                Capabilities._$browserType="QQ";
            else if (/chrome\/([\d.]+)/.test(UserAgent))
                Capabilities._$browserType="Chrome";
            return Capabilities._$browserType;
        }
    );

    __getset(1,Capabilities,'screenDPI',
        function()
        {
            if (Capabilities._deviceXDPI== -1)
                Capabilities._getDPI();
            return Capabilities._deviceXDPI;
        }
    );

    Capabilities.initScreenResolutionXY=function()
    {
        Capabilities._screenResolutionX=window.screen.width;
        Capabilities._screenResolutionY=window.screen.height;
    }

    Capabilities._getDPI=function()
    {
        var win=window;
        if (win.screen.deviceXDPI) {
            Capabilities._deviceXDPI=win.screen.deviceXDPI|0;
            Capabilities._deviceYDPI=win.screen.deviceYDPI|0;
        } else {
            var doc=document;
            var tmpNode=doc.createElement("DIV");
            tmpNode.style.cssText="width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            doc.body.appendChild(tmpNode);
            Capabilities._deviceXDPI=parseInt(__string(tmpNode.offsetWidth));
            Capabilities._deviceYDPI=parseInt(__string(tmpNode.offsetHeight));
            tmpNode.parentNode.removeChild(tmpNode);
        }
    }

    Capabilities._$os=null;
    Capabilities._$browserType=null;
    Capabilities._screenResolutionX=0;
    Capabilities._screenResolutionY=0;
    Capabilities._deviceXDPI= -1;
    Capabilities._deviceYDPI=0;

    Capabilities.toString=function(){return "[class Capabilities]";};
    return Capabilities;
})();

var fscommand=function(command,args)
{
    (args===void 0) && (args="");
}

var ImageDecodingPolicy=(function() {
    function ImageDecodingPolicy()
    {
    }

    __class(ImageDecodingPolicy,'flash.system.ImageDecodingPolicy');

    ImageDecodingPolicy.ON_DEMAND="onDemand";
    ImageDecodingPolicy.ON_LOAD="onLoad";

    ImageDecodingPolicy.toString=function(){return "[class ImageDecodingPolicy]";};
    return ImageDecodingPolicy;
})();

var IME=(function(_super) {
    function IME(target)
    {
        (target===void 0) && (target=null);
        IME.__super.call(this,target);
    }

    __class(IME,'flash.system.IME',_super);

    __getset(1,IME,'conversionMode',
        function()
        {
            return "";
        },
        function(mode)
        {
        }
    );

    __getset(1,IME,'enabled',
        function()
        {
            return false;
        },
        function(enabled)
        {
        }
    );

    __getset(1,IME,'isSupported',
        function()
        {
            return false;
        }
    );

    IME.toString=function(){return "[class IME]";};
    return IME;
})(EventDispatcher);

var LoaderContext=(function() {
    function LoaderContext(checkPolicyFile,applicationDomain,securityDomain)
    {
        this.checkPolicyFile=false;
        this.allowCodeImport=true;
        this.imageDecodingPolicy=ImageDecodingPolicy.ON_LOAD;
        (checkPolicyFile===void 0) && (checkPolicyFile=false);
        (applicationDomain===void 0) && (applicationDomain=null);
        (securityDomain===void 0) && (securityDomain=null);
        this.checkPolicyFile=checkPolicyFile;
        if (applicationDomain)
            this.applicationDomain=applicationDomain;
        else
            this.applicationDomain=new ApplicationDomain(ApplicationDomain.currentDomain);
        this.securityDomain=securityDomain;
    }

    __class(LoaderContext,'flash.system.LoaderContext');

    LoaderContext.toString=function(){return "[class LoaderContext]";};
    return LoaderContext;
})();

var Security=(function() {
    function Security()
    {
    }

    __class(Security,'flash.system.Security');

    __getset(1,Security,'sandboxType',
        function()
        {
            return "";
        }
    );

    Security.allowDomain=function()
    {
        var rest=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
    }

    Security.allowInsecureDomain=function()
    {
        var rest=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
    }

    Security.loadPolicyFile=function(url)
    {
    }

    Security.showSettings=function(panel)
    {
        (panel===void 0) && (panel="default");
    }

    Security.disableAVM1Loading=false;
    Security.exactSettings=false;
    Security.APPLICATION="application";
    Security.LOCAL_TRUSTED="localTrusted";
    Security.LOCAL_WITH_FILE="localWithFile";
    Security.LOCAL_WITH_NETWORK="localWithNetwork";
    Security.REMOTE="remote";

    Security.toString=function(){return "[class Security]";};
    return Security;
})();

var SecurityDomain=(function() {
    function SecurityDomain()
    {
    }

    __class(SecurityDomain,'flash.system.SecurityDomain');

    __getset(1,SecurityDomain,'currentDomain',
        function()
        {
            return new SecurityDomain();
        }
    );

    SecurityDomain.toString=function(){return "[class SecurityDomain]";};
    return SecurityDomain;
})();

var System=(function() {
    function System()
    {
    }

    __class(System,'flash.system.System');

    __getset(1,System,'freeMemory',
        function()
        {
            return 0;
        }
    );

    __getset(1,System,'privateMemory',
        function()
        {
            return 0;
        }
    );

    __getset(1,System,'totalMemory',
        function()
        {
            return 0;
        }
    );

    __getset(1,System,'totalMemoryNumber',
        function()
        {
            return 0;
        }
    );

    __getset(1,System,'useCodePage',
        function()
        {
            return System._useCodePage;
        },
        function(value)
        {
            System._useCodePage=value;
        }
    );

    System.disposeXML=function(node)
    {
    }

    System.exit=function(code)
    {
    }

    System.gc=function()
    {
    }

    System.nativeConstructionOnly=function(object)
    {
    }

    System.pause=function()
    {
    }

    System.pauseForGCIfCollectionImminent=function(imminence)
    {
        (imminence===void 0) && (imminence=0.75);
    }

    System.resume=function()
    {
    }

    System.setClipboard=function(string)
    {
    }

    System._useCodePage=false;

    System.toString=function(){return "[class System]";};
    return System;
})();

var AntiAliasType=(function() {
    function AntiAliasType()
    {
    }

    __class(AntiAliasType,'flash.text.AntiAliasType');

    AntiAliasType.ADVANCED="advanced";
    AntiAliasType.NORMAL="normal";

    AntiAliasType.toString=function(){return "[class AntiAliasType]";};
    return AntiAliasType;
})();

var Font=(function() {
    function Font()
    {
        this._$fontAscent=0;
        this._$fontDescent=0;
        this._$fontLeading=0;
        this._$glyphs=[];
    }

    __class(Font,'flash.text.Font');
    var __proto=Font.prototype;

    __proto.hasGlyphs=function(str)
    {
        return false;
    }

    __getset(0,__proto,'fontName',
        function()
        {
            return this._$fontName;
        }
    );

    __getset(0,__proto,'fontStyle',
        function()
        {
            return "";
        }
    );

    __getset(0,__proto,'fontType',
        function()
        {
            return this._$fontType;
        }
    );

    Font.registerFont=function(font)
    {
        var f=new font();
        Font._$fontDic[f.fontName]=f;
    }

    Font.enumerateFonts=function(enumerateDeviceFonts)
    {
        (enumerateDeviceFonts===void 0) && (enumerateDeviceFonts=false);
        var arr=[];
        for (var n in Font._$fontDic) {
            arr.push(Font._$fontDic[n]);
        }
        return arr;
    }

    Font._$regFont=function(f)
    {
        Font._$fontDic[f.fontName]=f;
    }

    Font._$getFont=function(name)
    {
        return Font._$fontDic[name];
    }

    __static(Font,[
        '_$fontDic',function(){return this._$fontDic={};}
    ]);

    Font.toString=function(){return "[class Font]";};
    Mira.un_proto(Font);
    return Font;
})();

var FontStyle=(function() {
    function FontStyle()
    {
    }

    __class(FontStyle,'flash.text.FontStyle');

    FontStyle.BOLD="bold";
    FontStyle.BOLD_ITALIC="boldItalic";
    FontStyle.ITALIC="italic";
    FontStyle.REGULAR="regular";

    FontStyle.toString=function(){return "[class FontStyle]";};
    return FontStyle;
})();

var FontType=(function() {
    function FontType()
    {
    }

    __class(FontType,'flash.text.FontType');

    FontType.DEVICE="device";
    FontType.EMBEDDED="embedded";
    FontType.EMBEDDED_CFF="embeddedCFF";

    FontType.toString=function(){return "[class FontType]";};
    return FontType;
})();

var GridFitType=(function() {
    function GridFitType()
    {
    }

    __class(GridFitType,'flash.text.GridFitType');

    GridFitType.NONE="none";
    GridFitType.PIXEL="pixel";
    GridFitType.SUBPIXEL="subpixel";

    GridFitType.toString=function(){return "[class GridFitType]";};
    return GridFitType;
})();

var StageTextInitOptions=(function() {
    function StageTextInitOptions(multiline)
    {
        this._multiline=false;
        (multiline===void 0) && (multiline=false);
        this.multiline=multiline;
    }

    __class(StageTextInitOptions,'flash.text.StageTextInitOptions');
    var __proto=StageTextInitOptions.prototype;

    __getset(0,__proto,'multiline',
        function()
        {
            return this._multiline;
        },
        function(value)
        {
            this._multiline=value;
        }
    );

    StageTextInitOptions.toString=function(){return "[class StageTextInitOptions]";};
    return StageTextInitOptions;
})();

var StaticText=(function(_super) {
    function StaticText()
    {
        StaticText.__super.call(this);
    }

    __class(StaticText,'flash.text.StaticText',_super);
    var __proto=StaticText.prototype;

    __getset(0,__proto,'text',
        function()
        {
            return this._$text;
        }
    );

    StaticText.toString=function(){return "[class StaticText]";};
    return StaticText;
})(Shape);

var StyleSheet=(function(_super) {
    function StyleSheet()
    {
        StyleSheet.__super.call(this);
    }

    __class(StyleSheet,'flash.text.StyleSheet',_super);
    var __proto=StyleSheet.prototype;

    __proto.clear=function()
    {
    }

    __proto.getStyle=function(styleName)
    {
        return null;
    }

    __proto.parseCSS=function(CSSText)
    {
    }

    __proto.setStyle=function(styleName,styleObject)
    {
    }

    __proto.transform=function(formatObject)
    {
        return null;
    }

    __getset(0,__proto,'styleNames',
        function()
        {
            return null;
        }
    );

    StyleSheet.toString=function(){return "[class StyleSheet]";};
    Mira.un_proto(StyleSheet);
    return StyleSheet;
})(EventDispatcher);

var TextColorType=(function() {
    function TextColorType()
    {
    }

    __class(TextColorType,'flash.text.TextColorType');

    TextColorType.DARK_COLOR="dark";
    TextColorType.LIGHT_COLOR="light";

    TextColorType.toString=function(){return "[class TextColorType]";};
    return TextColorType;
})();

var TextField=(function(_super) {
    function TextField()
    {
        this._$autoSize="none";
        this._$background=false;
        this._$border=false;
        this._$borderColor="#000000";
        this._$bottomScrollV=0;
        this._$caretIndex=0;
        this._$condenseWhite=false;
        this._$disAsPass=false;
        this._$embedFonts=false;
        this._$htmlText="";
        this._$maxChars=0;
        this._$maxScrollV=0;
        this._$multiline=false;
        this._$restrict=null;
        this._$scrollV=0;
        this._$selectable=true;
        this._$selectionBeginIndex=0;
        this._$selectionEndIndex=0;
        this._$text="";
        this._$textColor=0;
        this._$textHeight=0;
        this._$textWidth=0;
        this._$wordWrap=false;
        this._$inputting=false;
        this._$autoSizeX=0;
        this._$isNextLineNewParagraph=false;
        this._$nodeIndex=0;
        this._$tHeight=100;
        this._$tWidth=100;
        this._$df=TextField.DF;
        this._$type=TextFieldType.DYNAMIC;
        this._$nodes=new TextNodeList();
        this._$formatIndices=[];
        this._$formats=[];
        this._$formatsOrigin=[];
        this._$lines=[];
        this._$nodeCoord=new Point();
        TextField.__super.call(this);
        TextField.DF._blockIndent=0;
        this._$textWidth=TextField.LEFT_PADDING+TextField.RIGHT_PADDING;
        this._$textHeight=TextField.TOP_PADDING+TextField.BOTTOM_PADDING;
        this._$autoSizeWidth=this._$tWidth;
        this._$viewport=[0,0,this._$tWidth,this._$tHeight];
        this.addEventListener(Event.ADDED_TO_STAGE,__bind(this._$onTextAdded,this));
    }

    __class(TextField,'flash.text.TextField',_super);
    var __proto=TextField.prototype;

    __proto._$doAutoSize=function()
    {
        if (this._$wordWrap)
            return;
        switch (this._$autoSize) {
        case "center":
            (_super.prototype._$set_x.call(this,this._$autoSizeX-this._$textWidth/2));
            break;
        case "right":
            (_super.prototype._$set_x.call(this,this._$autoSizeX-this._$textWidth-TextField.RIGHT_PADDING));
            break;
        case "left":
            (_super.prototype._$set_x.call(this,this._$autoSizeX));
            break;
        }
    }

    __proto.appendText=function(newText)
    {
        if (this._$text)
            newText=this._$text+newText;
        this._$formatsOrigin.length=0;
        this._$text=newText.toString();
        this._$nodeIndex=0;
        this._$formatsOrigin.push({begin: 0,end: this._$text.length,format: this._$df});
        this._$createFormats();
        this._$addToRender();
    }

    __proto.getCharBoundaries=function(charIndex,workInternally)
    {
        (workInternally===void 0) && (workInternally=false);
        if (charIndex>=this._$text.length || charIndex<0)
            return null;
        workInternally || this._$renderThis();
        var result=new Rectangle();
        var line=this._$lines[this.getLineIndexOfChar(charIndex)];
        charIndex-=line.begin;
        var node=this._$getNodeFromLineByIndex(charIndex,line);
        charIndex-=node.firstCharIndex|0;
        var format=node.format;
        var metrics=this._$measureText(format,__string(node.text.substring(0,charIndex)));
        result.x=node.x+metrics.width;
        var char=__string(node.text.charAt(charIndex));
        metrics=this._$measureText(format,char);
        result.y=line.height-metrics.height+line.y;
        result.width=metrics.width;
        result.height=metrics.height;
        return result;
    }

    __proto.getCharIndexAtPoint=function(x,y,workForCaret)
    {
        (workForCaret===void 0) && (workForCaret=false);
        if (!this._$text || this._$text.length==0)
            return 0;
        this._$renderThis();
        x+=this._$viewport[0];
        y+=this._$viewport[1];
        var charIndex=0;
        if (y<this._$textHeight) {
            var line;
            var i=this._$scrollV ? this._$scrollV-1 : 0;
            for (i;i<this._$bottomScrollV;i++) {
                line=this._$lines[i];
                if (y<line.y+line.height) {
                    break;
                }
            }
        }
        if (!line) {
            if (workForCaret)
                line=this._$lines[this._$lines.length-1];
            else
                return  -1;
        }
        if (x>line.width+line.nodes[0].x) {
            if (workForCaret) {
                if (this._$text.charAt(line.end)=="\n") {
                    return line.end;
                }
                return line.end+1;
            }
            return  -1;
        }
        var nodes=line.nodes;
        var node;
        var format;
        var tempX=0;
        var tempWid=0;
        var len=nodes.length;
        var find=false;
        for (i=0;i<len;i++) {
            node=nodes[i];
            format=node.format;
            tempX=node.x|0;
            var numChars=node.text.length|0;
            if (!numChars)
                return line.end;
            for (var j=0;j<numChars;j++) {
                var char=__string(node.text[j]);
                if (char=="\n" && workForCaret)
                    return line.end;
                tempWid=this._$measureText(format,char).width|0;
                tempX+=tempWid;
                charIndex++;
                if (tempX>x) {
                    find=true;
                    tempX-=((format.letterSpacing) ? format.letterSpacing : 0)|0;
                    return workForCaret ? ((tempX-(tempWid>>1))<x ? charIndex+line.begin : charIndex+line.begin-1) : (charIndex+line.begin-1);
                }
            }
        }
        return  -1;
    }

    __proto.getFirstCharInParagraph=function(charIndex)
    {
        return 0;
    }

    __proto.getImageReference=function(id)
    {
        return null;
    }

    __proto.getLineIndexAtPoint=function(x,y)
    {
        this._$renderThis();
        var charIndex=this.getCharIndexAtPoint(x,y);
        return this.getLineIndexOfChar(charIndex);
    }

    __proto.getLineIndexOfChar=function(charIndex)
    {
        if (charIndex<0 || charIndex>=this._$text.length)
            return  -1;
        this._$renderThis();
        var len=this._$lines.length;
        var line;
        for (var i=0;i<len;i++) {
            line=this._$lines[i];
            if (charIndex>=line.begin && charIndex<=line.end)
                return i;
        }
        return this._$lines.length-1;
    }

    __proto.getLineLength=function(lineIndex)
    {
        this._$renderThis();
        return this._$lines[lineIndex].text.length|0;
    }

    __proto.getLineMetrics=function(lineIndex)
    {
        this._$renderThis();
        if (lineIndex<0 || lineIndex>=this._$lines.length)
            return new TextLineMetrics(0,0,this._$df.size+TextFormat.HEI_OFF,0,0,0);
        var line=this._$lines[lineIndex];
        var x=(line.nodes ? line.nodes[0].x : 0)|0;
        var wid=line.width|0;
        var hei=line.height|0;
        var ascent=0;
        var descent=0;
        var leading=line.maxLeading;
        return new TextLineMetrics(x,wid,hei,ascent,descent,leading);
    }

    __proto.getLineOffset=function(lineIndex)
    {
        this._$renderThis();
        return this._$lines[lineIndex].begin|0;
    }

    __proto.getLineText=function(lineIndex)
    {
        this._$renderThis();
        return __string(this._$lines[lineIndex].text);
    }

    __proto.getParagraphLength=function(charIndex)
    {
        return 0;
    }

    __proto.getTextFormat=function(beginIndex,endIndex)
    {
        (beginIndex===void 0) && (beginIndex= -1);
        (endIndex===void 0) && (endIndex= -1);
        if (beginIndex== -1 && endIndex== -1)
            return this._$df.clone();
        var format;
        if (beginIndex!= -1 && endIndex!= -1) {
            for (var i=this._$formatsOrigin.length-1;i>=0;i--) {
                format=this._$formatsOrigin[i];
                if (format.begin<=beginIndex && format.end>=endIndex)
                    return format.format.clone();
            }
            return null;
        }
        if (beginIndex!= -1 && endIndex== -1) {
            for (i=this._$formatsOrigin.length-1;i>=0;i--) {
                format=this._$formatsOrigin[i];
                if (beginIndex>=format.begin && beginIndex<format.end)
                    return format.format;
            }
        }
        return null;
    }

    __proto.replaceSelectedText=function(value)
    {
    }

    __proto.replaceText=function(beginIndex,endIndex,newText)
    {
        var forepart=this._$text.substring(0,beginIndex);
        var endpart=this._$text.substring(endIndex);
        this._$text=forepart+newText+endpart;
        var format;
        for (var i=0,len=this._$formatsOrigin.length;i<len;i++) {
            format=this._$formatsOrigin[i];
            if (format.begin<=beginIndex && format.end>=beginIndex) {
                format.end+=newText.length-(endIndex-beginIndex);
            }
        }
        this._$createFormats();
        this._$addToRender();
    }

    __proto.setSelection=function(beginIndex,endIndex)
    {
    }

    __proto.setTextFormat=function(format,beginIndex,endIndex)
    {
        (beginIndex===void 0) && (beginIndex= -1);
        (endIndex===void 0) && (endIndex= -1);
        if (!this._$text || !this._$text.length)
            return;
        this._$formats=[];
        if (arguments.length==1) {
            beginIndex=0;
            endIndex=this.text.length;
        } else if (arguments.length==2) {
            endIndex=beginIndex+1;
        }
        this._$addToRender();
        var tempFormat;
        for (var i=this._$formatsOrigin.length-1;i>=0;i--) {
            tempFormat=this._$formatsOrigin[i];
            if (tempFormat.begin==beginIndex && tempFormat.end==endIndex) {
                if (this._$cmpFunc(format,this.defaultTextFormat)) {
                    this._$formatsOrigin=[];
                    if (!this._$formatsOrigin.length)
                        this._$formatsOrigin.push({begin: 0,end: this._$text.length,format: format});
                } else {
                    this._$formatsOrigin[i].format=this._$mixTextFormats([this._$formatsOrigin[i].format,format]);
                }
                this._$createFormats();
                return;
            }
        }
        this._$insertFormt(format,beginIndex,endIndex);
        this._$createFormats();
    }

    __proto._$cmpFunc=function(x,y)
    {
        for (var p in x) {
            if (x.hasOwnProperty(p)) {
                if (!y.hasOwnProperty(p)) {
                    return false;
                }
                if (x[p]===y[p]) {
                    continue;
                }
            }
        }
        for (p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    }

    __proto._$parseHTMLText=function(xml)
    {
        var _$this=this;
        if (xml==null)
            return;
        var tagName=__string(xml.nodeName);
        if (tagName=="#text" || tagName=="#cdata-section")
            this._$text+=StringMethod.strTrim(__string(xml.textContent));
        else if (!xml.length) {
            var startIndex=this._$text.length;
            var format=new TextFormat();
            if (xml.childNodes && !xml.childNodes.length) {
                if (xml.firstChild && xml.firstChild.nodeType==3)
                    this._$text+=xml.textContent;
            } else {
                this._$parseHTMLText(xml.childNodes);
            }
            var getAtt=function (name) {
                return xml.getAttribute(name) || xml.getAttribute(name.toUpperCase());
            };
            tagName=tagName.toLowerCase();
            switch (tagName) {
            case "b":
                format.bold=true;
                break;
            case "br":
                this._$text+="\n";
                break;
            case "font":
                var color=getAtt("color");
                if (color) {
                    format.color=String(color).replace("#","0x");
                    format.color=parseInt(__string(format.color),16);
                }
                var face=__string(getAtt("face"));
                if (face)
                    format.font=face;
                var size=getAtt("size");
                if (size) {
                    var firstChar=__string(size.charAt(0));
                    if (firstChar=="+")
                        format.size=Number(format.size)+parseInt(__string(size));
                    else if (firstChar=="-")
                        format.size=Number(format.size)-parseInt(__string(size));
                    else
                        format.size=getAtt("size");
                }
                break;
            case "i":
                format.italic=true;
                break;
            case "p":
                var align=__string(getAtt("align"));
                if (align)
                    format.align=align;
                this._$multiline && (this._$text+="\n");
                break;
            case "textformat":
                var blockIndent=getAtt("blockindent")|0;
                if (blockIndent)
                    format.blockIndent=blockIndent;
                var indent=getAtt("indent")|0;
                if (indent)
                    format.indent=indent;
                var leading=getAtt("leading")|0;
                if (leading)
                    format.leading=leading;
                var leftmargin=getAtt("leftmargin")|0;
                if (leftmargin)
                    format.leftMargin=leftmargin;
                var rightmargin=getAtt("rightmargin")|0;
                if (rightmargin)
                    format.rightMargin=rightmargin;
                break;
            case "u":
                format.underline=true;
                break;
            case "a":
                var href=__string(getAtt("href"));
                this._$links || (this._$links=[]);
                href || (href="");
                if (href.indexOf("event:")==0) {
                    var te=new TextEvent(TextEvent.LINK);
                    te.text=href.substr(6);
                    this._$links.push({event: te});
                } else {
                    this._$links.push({event: href});
                }
                break;
            case "img":
                break;
            }
            if (tagName=="a") {
                this._$links[this._$links.length-1].begin=startIndex;
                this._$links[this._$links.length-1].end=this._$text.length;
            } else
                this._$insertFormt(format,startIndex,this._$text.length,false);
        } else {
            var xmlLength=xml.length|0;
            if (xmlLength==1 && xml[0].nodeType==3) {
                this._$text+=StringMethod.strTrim(__string(xml[0].textContent));
            } else {
                for (var i=0;i<xmlLength;i++) {
                    this._$parseHTMLText(xml[i]);
                }
            }
        }
    }

    __proto._$insertFormt=function(format,beginIndex,endIndex,usePush)
    {
        (usePush===void 0) && (usePush=true);
        var temp={begin: beginIndex,end: endIndex,format: format.clone()};
        if (usePush)
            this._$formatsOrigin.push(temp);
        else
            this._$formatsOrigin.unshift(temp);
        this._$formatIndices.push(beginIndex,endIndex);
    }

    __proto._$createFormats=function()
    {
        if (!this._$formatsOrigin.length)
            this._$formatsOrigin.push({begin: 0,end: this._$text.length,format: this._$df});
        this._$formats.length=0;
        this._$formatIndices.push(0,this._$text.length);
        this._$formatIndices.sort(__bind(this._$numberSortCallback,this));
        var lastValue=this._$formatIndices[this._$formatIndices.length-1]|0;
        for (var i=this._$formatIndices.length-2;i>=0;i--) {
            if (this._$formatIndices[i]==lastValue || this._$formatIndices[i]>this._$text.length)
                this._$formatIndices.splice(i,1);
            lastValue=this._$formatIndices[i]|0;
        }
        if (this._$formatIndices[this._$formatIndices.length-1]>this._$text.length)
            this._$formatIndices.pop();
        var end=this._$formatIndices.length-1;
        for (i=0;i<end;i++) {
            var relateFormats=this._$getRelateTextForamts(this._$formatIndices[i]|0);
            this._$formats.push({format: this._$mixTextFormats(relateFormats),begin: this._$formatIndices[i],end: this._$formatIndices[i+1]});
        }
        this._$addToRender();
    }

    __proto._$mixTextFormats=function(formats)
    {
        var format;
        var result=formats[formats.length-1].clone();
        for (var i=formats.length-2;i>=0;i--) {
            format=formats[i];
            result._align==null && (result._align=format._align);
            result._blockIndent==null && (result._blockIndent=format._blockIndent);
            result._bold==null && (result._bold=format._bold);
            result._color==null && (result._color=format._color);
            result._font==null && (result._font=format._font);
            result._indent==null && (result._indent=format._indent);
            result._italic==null && (result._italic=format._italic);
            result._leading==null && (result._leading=format._leading);
            result._leftMargin==null && (result._leftMargin=format._leftMargin);
            result._letterSpacing==null && (result._letterSpacing=format._letterSpacing);
            result._rightMargin==null && (result._rightMargin=format._rightMargin);
            result._size==null && (result._size=format._size);
            result._underline==null && (result._underline=format._underline);
        }
        return result;
    }

    __proto._$numberSortCallback=function(a,b)
    {
        return a>b ? 1 :  -1;
    }

    __proto._$getRelateTextForamts=function(index)
    {
        var result=[];
        var len=this._$formatsOrigin.length;
        for (var i=0;i<len;i++) {
            var format=this._$formatsOrigin[i];
            if (index>=format.begin && index<format.end) {
                result.push(format.format);
            }
        }
        return result;
    }

    __proto._$measureText=function(format,text)
    {
        var font=this._$getFontName(format);
        var ret;
        if (typeof font=='string') {
            ret=format.measureText(text);
        } else {
            ret=this._$getTextRect(font,text);
            if (ret.lost) {
                format._font=__string(font.face._$fontName);
                this._$embedFonts=false;
                ret=format.measureText(text);
            }
        }
        ret.width=Math.ceil(ret.width);
        return ret;
    }

    __proto._$getTextRect=function(ft,text)
    {
        var font=ft.face;
        var len=text.length;
        var w=0;
        var lost=0;
        for (var i=0;i<text.length;i++) {
            var code=text.charCodeAt(i);
            var gid=font._$codeTable.indexOf(code);
            if (gid>=0) {
                w+=font._$advanceTable[gid];
            } else {
                lost++;
            }
        }
        var h=font._$fontAscent+font._$fontDescent;
        return {width: w*ft.size/20480,height: h*ft.size/20480,lost: lost==text.length};
    }

    __proto._$getFontName=function(format)
    {
        var name=format.font;
        if (this._$embedFonts || name.charAt(0)=="#") {
            if (name) {
                var font=this._$getFont(name);
                if (font) {
                    if (font._$glyphs.length && font._$advanceTable && font._$fontAscent+font._$fontDescent>0) {
                        return {face: font,color: format.color,size: (format.size ? format.size : 12)};
                    } else {
                        this._$embedFonts=false;
                        format._font=font.fontName;
                    }
                }
            }
        }
        return format.getFont();
    }

    __proto._$getFont=function(name)
    {
        var font=Font._$getFont(name);
        if (!font) {
            var fontId=this.loaderInfo._$fontDic[name];
            if (!fontId && name.charAt(0)=="#") {
                fontId=name.substring(1)|0;
            }
            if (fontId) {
                font=this.loaderInfo._$resDic[fontId];
                if (!font["ready"]) {
                    font=SwfParser.parseRes(font["resType"]|0,fontId|0,this.loaderInfo,font["flag"]|0);
                    if (font) {
                        Font._$regFont(font);
                    }
                }
            }
        }
        return font;
    }

    __proto._$engineClear=function(clearInputValue)
    {
        (clearInputValue===void 0) && (clearInputValue=false);
        this._$nodes.clear();
        this._$lines.length=0;
        this._$textWidth=0;
        this._$textHeight=0;
        this._$text='';
        this._$htmlText=null;
        this._$charsToRender=null;
        this._$nodeIndex=0;
        var idx=TextField.TextsToRender.indexOf(this);
        if (idx> -1)
            TextField.TextsToRender.splice(idx,1);
        if (this._$type=='input' && clearInputValue) {
            Browser.input.value='';
        }
    }

    __proto._$engineUpdate=function()
    {
        if (this._$text=="") {
            this._$engineClear();
            this._$updateViewport();
            return;
        }
        this._$textWidth=0;
        this._$lines.length=0;
        this._$currLineInfo=null;
        this._$nodeCoord.setTo(TextField.LEFT_PADDING,TextField.TOP_PADDING);
        this._$nodeIndex=0;
        if (this._$text.length) {
            if (this._$disAsPass) {
                this._$charsToRender="";
                for (var i=this._$text.length;i>0;i--)
                    this._$charsToRender+="*";
            } else
                this._$charsToRender=this._$text;
            var len=this._$formats.length;
            var format;
            for (i=0;i<len;i++) {
                format=this._$formats[i];
                this._$createStyle(format.begin|0,format.end-1|0,format.format);
            }
            if (this._$type==TextFieldType.INPUT) {
                var textLen=this._$text.length;
                if (this._$text.charAt(textLen-1)=="\n") {
                    var ti=new TextLineInfo(this._$text.length-1,false,this._$lines[this._$lines.length-1].y+this._$df.size+(this._$df.leading ? this._$df.leading : 0));
                    ti.nodes.push({x: TextField.LEFT_PADDING,firstCharIndex: this._$text.length,lastCharIndex: this._$text.length,format: this._$df,text: ""});
                    ti.height=this._$df.size+3;
                    this._$lines.push(ti);
                }
            }
            var tempLineIdx=this._$lines.length;
            if (tempLineIdx) {
                this._$textHeight=this._$lines[tempLineIdx-1].y+this._$lines[tempLineIdx-1].height;
                if (this._$autoSize=="none" && this._$textHeight>this._$tHeight) {
                    for (i=tempLineIdx-1;i>=0;i--) {
                        if (this._$textHeight-this._$lines[i].y>this._$tHeight) {
                            this._$maxScrollV=i+2;
                            break;
                        }
                    }
                    this._$bottomScrollV=this._$getBottomScrollV(this._$scrollV);
                } else
                    this._$bottomScrollV=this._$lines.length;
            } else {
                this._$textHeight=0;
                this._$maxScrollV=0;
            }
            this._$engineLayout(true);
            this._$checkActiveScroll();
            this._$charsToRender=null;
        }
        this._$updateViewport();
        this._$doAutoSize();
    }

    __proto._$getBottomScrollV=function(startLine)
    {
        if (this._$lines.length==0 || startLine>this._$lines.length)
            return 0;
        if (this._$lines.length==1)
            return 1;
        if (this._$textHeight<this._$tHeight)
            return this._$lines.length;
        var totalLines=this._$lines.length;
        for (var i=startLine-1;i<totalLines;i++) {
            if (!this._$lines[i])
                continue;
            if (this._$lines[i].y+this._$lines[i].height>this._$tHeight+this._$viewport[1]) {
                if (i==0) {
                    return 1;
                }
                return i;
            }
        }
        return totalLines;
    }

    __proto._$updateViewport=function()
    {
        var w=0,h=0;
        if (this.autoSize!='none' && this.autoSize) {
            w=(this._$wordWrap ? this._$tWidth : this._$textWidth+TextField.LEFT_PADDING+TextField.RIGHT_PADDING)|0;
            h=(this._$textHeight || this._$df.size)+TextField.TOP_PADDING+TextField.BOTTOM_PADDING|0;
        } else {
            w=this._$tWidth|0;
            h=this._$tHeight|0;
        }
        this._$viewport[2]=w;
        this._$viewport[3]=h;
    }

    __proto._$createStyle=function(startIndex,endIndex,format)
    {
        var text=this._$charsToRender.substring(startIndex,endIndex+1);
        if (!this._$currLineInfo) {
            this._$currLineInfo=new TextLineInfo(startIndex,this._$isNextLineNewParagraph,this._$nodeCoord.y);
            this._$currLineInfo.rightMargin=format.rightMargin|0;
            this._$nodeCoord.x+=format.leftMargin+format.blockIndent;
            if (this._$isNextLineNewParagraph) {
                this._$nodeCoord.x+=format.indent;
            }
            this._$lines.push(this._$currLineInfo);
        }
        this._$isNextLineNewParagraph=false;
        var lineBreakIdx=text.indexOf("\n");
        if (lineBreakIdx== -1) {
            var textWidth=this._$measureText(format,text).width;
            if (!this._$wordWrap || this._$stuffEnough(this._$nodeCoord.x+textWidth)) {
                this._$createNodeStyle(text,this._$nodeIndex,format,textWidth|0);
                this._$nodeCoord.x+=textWidth;
                this._$nodeIndex+=text.length;
            } else {
                textWidth=this._$measureText(format,text.charAt(0)).width;
                if (!this._$stuffEnough(this._$nodeCoord.x+textWidth) && this._$currLineInfo.text.length>0) {
                    this._$resetToNewline(format);
                    this._$createStyle(startIndex,endIndex,format);
                    return;
                }
                var i=1;
                var ee=text.length;
                while (i+1<ee) {
                    var c=(i+ee)>>1;
                    var tw=this._$measureText(format,text.substr(0,c)).width;
                    if (this._$stuffEnough(this._$nodeCoord.x+tw)) {
                        i=c;
                        textWidth=tw;
                    } else {
                        ee=c;
                    }
                }
                var execResult=/\b\w+$/.exec(text.substring(0,i));
                if (execResult) {
                    if (execResult.index>0) {
                        i=execResult.index|0;
                        textWidth=this._$measureText(format,StringMethod.strRTrim(text.substr(0,i))).width;
                    }
                }
                this._$createNodeStyle(text.substring(0,i),this._$nodeIndex,format,textWidth|0);
                this._$nodeIndex+=i;
                if (startIndex+i<=endIndex) {
                    this._$resetToNewline(format);
                    this._$createStyle(startIndex+i,endIndex,format);
                }
            }
        } else {
            if (text=="\n") {
                this._$currLineInfo.text+="\n";
                if (!this._$currLineInfo.height) {
                    this._$currLineInfo.height=format.size ? format.size : 12;
                }
                this._$currLineInfo.nodes.push({x: TextField.LEFT_PADDING,firstCharIndex: startIndex,lastCharIndex: startIndex,format: format,text: "\n"});
                this._$resetToNewline(format);
                this._$isNextLineNewParagraph=true;
            } else {
                this._$createStyle(startIndex,startIndex+lineBreakIdx-1,format);
                this._$currLineInfo.text+="\n";
                if (this._$currLineInfo.nodes.length)
                    this._$currLineInfo.nodes[this._$currLineInfo.nodes.length-1].text+="\n";
                if (!this._$currLineInfo.height) {
                    this._$currLineInfo.height=format.size ? format.size : 12;
                }
                this._$currLineInfo.end++;
                this._$resetToNewline(format);
                this._$isNextLineNewParagraph=true;
                if (startIndex+lineBreakIdx+1<=endIndex)
                    this._$createStyle(startIndex+lineBreakIdx+1,endIndex,format);
            }
        }
    }

    __proto._$stuffEnough=function(value)
    {
        return value+this._$currLineInfo.rightMargin<=this._$tWidth-TextField.RIGHT_PADDING;
    }

    __proto._$resetToNewline=function(format)
    {
        this._$nodeIndex=0;
        this._$nodeCoord.x=TextField.LEFT_PADDING;
        this._$nodeCoord.y+=this._$currLineInfo.height+(format.leading ? format.leading : 0)+TextField.LINE_LEADING;
        this._$currLineInfo=null;
    }

    __proto._$createNodeStyle=function(text,startIndex,format,wordWidth)
    {
        var node={};
        node.x=this._$nodeCoord.x;
        this._$currLineInfo.nodes.push(node);
        node.firstCharIndex=startIndex;
        node.lastCharIndex=startIndex+text.length-1;
        node.format=format;
        node.text=text;
        this._$currLineInfo.text+=text;
        this._$currLineInfo.end+=text.length-1;
        this._$currLineInfo.height=Math.max(this._$measureText(format,this._$currLineInfo.text).height,this._$currLineInfo.height);
        this._$currLineInfo.width+=wordWidth;
        this._$currLineInfo.maxLeading=Math.max(this._$currLineInfo.maxLeading,(format.leading ? Number(format.leading) : 0))|0;
        this._$textWidth=Math.max(this._$textWidth,this._$currLineInfo.width);
    }

    __proto._$engineLayout=function(updateNodeX)
    {
        (updateNodeX===void 0) && (updateNodeX=false);
        this._$nodes.clear();
        var line;
        var lineNodes;
        var numNodes=0;
        var node;
        var format;
        var xOffset=0;
        var yOffset=0;
        var numLines=this._$lines.length;
        for (var li=0;li<numLines;li++) {
            if (this._$textHeight>this._$tHeight && this._$autoSize=="none") {
                if (li<this._$scrollV-1)
                    continue;
                else if (li>=this._$bottomScrollV)
                    break;
            }
            line=this._$lines[li];
            lineNodes=line.nodes;
            numNodes=lineNodes.length;
            if (!numNodes)
                continue;
            node=lineNodes[0];
            format=node.format;
            yOffset=line.y|0;
            xOffset=node.x|0;
            var align=format.align;
            if (updateNodeX && (this._$autoSize=="none" || this._$wordWrap)) {
                if (align==TextFormatAlign.CENTER) {
                    if (this._$tWidth>line.width)
                        xOffset+=(this._$tWidth-line.width)/2|0;
                } else if (align==TextFormatAlign.RIGHT) {
                    xOffset+=(this._$tWidth-line.width-TextField.RIGHT_PADDING-TextField.LEFT_PADDING)|0;
                }
            }
            for (var ni=0;ni<numNodes;ni++) {
                node=lineNodes[ni];
                format=node.format;
                var letterSpacing=int(format.letterSpacing);
                var nodeMetrics=this._$measureText(format,__string(node.text));
                var nodeToPush;
                var tempFont=this._$getFontName(format);
                var tempFillStyle=StringMethod.getColorString(Number(format.color) || 0x000000);
                var tempUnderlineWidth=(format.underline ? nodeMetrics.width-(format.letterSpacing ? format.letterSpacing : 0) : 0)|0;
                nodeToPush={};
                this._$nodes.push(nodeToPush);
                nodeToPush.font=tempFont;
                nodeToPush.fillStyle=tempFillStyle;
                nodeToPush.x=xOffset;
                nodeToPush.y=yOffset+line.height-(nodeMetrics.height || format.size);
                nodeToPush.letterSpacing=letterSpacing;
                nodeToPush.text=node.text;
                nodeToPush.underlineWidth=tempUnderlineWidth;
                nodeToPush.underlineY=line.y+line.height;
                updateNodeX && (node.x=xOffset);
                if (letterSpacing) {
                    var lettersX=[];
                    var m=node.text.length|0;
                    nodeToPush.lettersX=lettersX;
                    for (var j=0;j<m;j++) {
                        var word=__string(node.text.charAt(j));
                        lettersX.push(xOffset);
                        xOffset+=this._$measureText(format,word).width|0;
                    }
                } else
                    xOffset+=nodeMetrics.width|0;
            }
        }
    }

    __proto._$checkActiveScroll=function()
    {
        if (this._$selectable && this._$type=="dynamic" && this._$autoSize=="none" && (this._$textWidth>this._$tWidth || this._$textHeight>this._$tHeight) && !this._$scroller) {
            this._$scrollV=1;
            this._$scroller=new Timer(100);
            this._$scroller.addEventListener(TimerEvent.TIMER,__bind(this._$onTextScroll,this),false,0,true);
            this.addEventListener(MouseEvent.MOUSE_DOWN,__bind(this._$onTextMouseDown,this),false,0,true);
        }
    }

    __proto._$getNodeFromLineByIndex=function(index,line)
    {
        var nodes=line.nodes;
        var node;
        var len=nodes.length;
        for (var i=0;i<len;i++) {
            node=nodes[i];
            if (index>=node.firstCharIndex && index<=node.lastCharIndex)
                return node;
        }
        return nodes[len-1];
    }

    __proto._$addToRender=function()
    {
        if (TextField.TextsToRender.indexOf(this)== -1)
            TextField.TextsToRender.push(this);
    }

    __proto._$renderThis=function()
    {
        var idx=TextField.TextsToRender.indexOf(this);
        if (idx!= -1) {
            TextField.TextsToRender.splice(idx,1);
            this._$engineUpdate();
            return true;
        }
        return false;
    }

    __proto._$onTextAdded=function(e)
    {
        this.addEventListener(MouseEvent.MOUSE_UP,__bind(this.onTextFocus,this),false, -99);
        this.addEventListener(Event.REMOVED_FROM_STAGE,__bind(this._$onTextRemoved,this));
        this.removeEventListener(Event.ADDED_TO_STAGE,__bind(this._$onTextAdded,this));
    }

    __proto._$onTextRemoved=function(e)
    {
        this.addEventListener(Event.ADDED_TO_STAGE,__bind(this._$onTextAdded,this));
        this.removeEventListener(MouseEvent.CLICK,__bind(this.onTextFocus,this));
        if (this._$scroller)
            this._$scroller.removeEventListener(TimerEvent.TIMER,__bind(this._$onTextScroll,this));
    }

    __proto.onTextFocus=function(e)
    {
        if (!this.stage)
            return;
        if (this._$links && this._$links.length) {
            this._$caretIndex=this.getCharIndexAtPoint(this.mouseX,this.mouseY,true);
            this._$checkLinkEvent(this._$caretIndex);
        } else if (this._$type=="input") {
            if (this._$inputting) {
                if (Driver.enableTouch())
                    this._$checkTextFocusout(null);
                return;
            }
            TextField.onMobile && Driver.deactivateTouchEvent();
            this._$inputting=true;
            TextField.isInputting=true;
            this._$caretIndex=this.getCharIndexAtPoint(this.mouseX,this.mouseY,true);
            if (this.stage.currentFocus!=this) {
                var concatedMatrix=this._getConcatenatedMatrix();
                Browser.input.setType(this._$disAsPass ? "password" : "text");
                if (!Driver.enableTouch()) {
                    Browser.input.setColor(StringMethod.getColorString(this._$df.color|0) || "#000000");
                    Browser.input.setSize(this._$tWidth,this._$tHeight);
                    Browser.input.setFont(this._$df.font || "Times New Roman");
                    Browser.input.setFontSize(this._$df.size || 12);
                    Browser.input.setScale(this.scaleX*MainWin.window_as.scale.x*concatedMatrix.a,this.scaleY*MainWin.window_as.scale.y*concatedMatrix.d);
                    Browser.input.value=this._$text;
                    var pos=new Point(concatedMatrix.tx,concatedMatrix.ty);
                    Browser.input.setPos(pos.x*MainWin.window_as.scale.x+MainWin.doc2.body.x,pos.y*MainWin.window_as.scale.y+MainWin.doc2.body.y);
                } else {
                    Browser.input.setPos(0,0);
                    Browser.input.clear();
 {
                        Browser.input.setSize(TextField.initialWindowWidth,(this._$multiline ? TextField.textAreaHeight : TextField.inputHeight));
                        Browser.input.setFontSize(TextField.inputFontSize);
                        Browser.input.style.background="Linen";
                        Browser.input.style.borderTop="3px solid orange";
                        Browser.input.style.borderBottom="3px solid orange";
                        Browser.input.value=this._$text;
                        window.document.body.scrollTop=0;
                    }
                }
                if (!TextField.onMobile) {
                    Browser.addToBody(Browser.input);
                    Browser.input.setAlign(this._$df.align || 'left');
                }
                Browser.input.style.whiteSpace=(this._$wordWrap || this._$multiline) ? "normal" : "nowrap";
                Browser.input.onkeydown=this._$multiline ? null : __bind(this._$onInputKeyDown,this);
                Browser.input.oninput=this._$maxChars>0 ? __bind(this._$onMaxCharsLimit,this).bind(this) : null;
                Browser.input.target=this;
                TextField.onMobile || Browser.input.focus();
                Stage.stage.addEventListener(MouseEvent.MOUSE_DOWN,__bind(this._$checkTextFocusout,this));
            }
            Browser.input.addEventListener("input",__bind(this._$dispathInput,this));
            var caretIndex=this._$caretIndex;
            if (caretIndex<0)
                caretIndex=0;
            else if (caretIndex>this._$text.length)
                caretIndex=this._$text.length;
        }
        if (this.stage && (this.stage.currentFocus!=this && this._$selectable)) {
            this.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_IN));
            this.stage.currentFocus=this;
        }
        if (this.type=="input")
            this._$setInputCaret(caretIndex);
    }

    __proto._$setInputCaret=function(caret)
    {
        caret=Math.max(this._$text.length,caret)|0;
        Browser.input.setSelectionRange(caret,caret);
    }

    __proto._$dispathInput=function()
    {
        this.dispatchEvent(new TextEvent(TextEvent.TEXT_INPUT));
        if (!Driver.enableTouch()) {
            this._$text=__string(Browser.input.value);
            this._$doDirty(true);
        } else
            this.text=__string(Browser.input.value);
        this.dispatchEvent(new Event(Event.CHANGE));
    }

    __proto._$onMaxCharsLimit=function(e)
    {
        if (Browser.input.value.length>this._$maxChars) {
            Browser.input.value=Browser.input.value.substr(0,this._$maxChars);
        }
    }

    __proto._$onInputKeyDown=function(e)
    {
        if (e.keyCode==Keyboard.ENTER) {
            e.returnValue=false;
            e.preventDefault();
        }
    }

    __proto._$checkTextFocusout=function(e)
    {
        if (!e || e.target!=this) {
            this._$inputting=false;
            TextField.isInputting=false;
            this._$text=__string(Browser.input.value);
            if (this._$restrict)
                this._$text=this._$text.replace(this._$restrict,"");
            this._$formats[0]=this._$formats[0] || ({begin: 0,end: 0});
            this._$formats[0].format=this._$df;
            this._$formats[0].end=this._$text.length;
            this._$engineUpdate();
            Browser.input.removeEventListener("input",__bind(this._$dispathInput,this));
            Stage.stage.removeEventListener(MouseEvent.MOUSE_DOWN,__bind(this._$checkTextFocusout,this));
            Browser.removeFromBody(Browser.input);
            Browser.input.setSize(1,1);
            Browser.input.setPos(0, -2000);
            TextField.onMobile && Driver.activateTouchEvent();
            this._$doDirty(true);
        }
        Stage.stage.focus=null;
        this.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_OUT));
    }

    __proto._$checkLinkEvent=function(indexClick)
    {
        var link;
        for (var i=this._$links.length-1;i>=0;i--) {
            link=this._$links[i];
            if (indexClick>=link.begin && indexClick<link.end) {
                if (typeof link.event=='string')
                    navigateToURL(link.event);
                else
                    this.dispatchEvent(link.event);
                return;
            }
        }
    }

    __proto._$onTextMouseDown=function(e)
    {
        if (this._$scroller) {
            this._$scroller.start();
            this._$mouseDownX=this.mouseX;
            this._$mouseDownY=this.mouseY;
        }
        Stage.stage.addEventListener(MouseEvent.MOUSE_UP,__bind(this._$onTextMouseUp,this));
    }

    __proto._$onTextMouseUp=function(e)
    {
        Stage.stage.removeEventListener(MouseEvent.MOUSE_UP,__bind(this._$onTextMouseUp,this));
        this._$scroller && this._$scroller.stop();
    }

    __proto._$onTextScroll=function(e)
    {
        if (this._$lines.length==0)
            return;
        var hSpeed=this.mouseX-this._$mouseDownX|0;
        var vDir=0;
        if (this.mouseY==this._$mouseDownY)
            vDir=0;
        else if (this.mouseY<this._$mouseDownY)
            vDir=1;
        else
            vDir= -1;
        this._$scrollVNoRender(this._$scrollV+vDir);
        this._$scrollHNoRender(this._$viewport[0]+hSpeed|0);
        this._$engineLayout();
    }

    __proto._$scrollVNoRender=function(value)
    {
        if (value<0 || value>this._$lines.length)
            return;
        if (this._$maxScrollV>1) {
            var lastValue=this._$scrollV;
            this._$scrollV=Math.max(value,1)|0;
            this._$scrollV=Math.min(this._$scrollV,this._$maxScrollV)|0;
            if (this._$scrollV>this._$maxScrollV)
                if (lastValue==this._$scrollV)
                    return;
            this._$viewport[1]=this._$lines[this._$scrollV-1].y;
            this._$bottomScrollV=this._$getBottomScrollV(this._$scrollV);
            this.dispatchEvent(new Event(Event.SCROLL));
        } else {
            this._$bottomScrollV=this._$lines.length;
            this._$scrollV=1;
            this._$viewport[1]=0;
        }
    }

    __proto._$scrollHNoRender=function(value)
    {
        if (value<0)
            value=0;
        else if (value>this.maxScrollH)
            value=this.maxScrollH;
        if (this._$viewport[0]==value)
            return;
        this._$viewport[0]=value;
        this.dispatchEvent(new Event(Event.SCROLL));
    }

    __proto._getBounds_=function(targetSpace,resultRect)
    {
        (resultRect===void 0) && (resultRect=null);
        if (!resultRect)
            resultRect=new Rectangle();
        if (this._$type=="input")
            resultRect.setTo(this._$viewport[0],this._$viewport[1],this._$tWidth,this._$tHeight);
        else
            resultRect.setTo(this._$viewport[0],this._$viewport[1],this.width,this.height);
        if (this.tempBound) {
            resultRect.x+=this.tempBound.x;
            resultRect.y+=this.tempBound.y;
        }
        return resultRect;
    }

    __proto._hitTest_=function(_x,_y)
    {
        if (!this.visible || !this.mouseEnabled)
            return null;
        if (!this._checkHitMask(_x,_y)) {
            return null;
        }
        if (this._getBounds_(this,DisplayObject.HELPER_RECTANGLET)._$containsHit(_x,_y)) {
            return this;
        } else {
            return null;
        }
    }

    __proto._$destroy=function()
    {
        this._$df=null;
        this._$nodes=null;
        if (this._$scroller) {
            this._$scroller.stop();
            this._$scroller.removeEventListener(TimerEvent.TIMER,__bind(this._$onTextScroll,this));
            this._$scroller=null;
        }
        this._$formatsOrigin=null;
        this._$formats=null;
        this._$lines=null;
        this._$currLineInfo=null;
        this._$nodeCoord=null;
    }

    __proto._$paintThis=function(ctx)
    {
        var x=0;
        var y=0;
        if (this.tempBound) {
            x=this.tempBound.x;
            y=this.tempBound.y;
        }
        ctx.save();
        MiraText.drawBG(ctx,x,y,this);
        ctx.beginPath();
        ctx.rect(x+TextField.LEFT_PADDING,y,this._$viewport[2]-TextField.LEFT_PADDING-TextField.RIGHT_PADDING,this._$viewport[3]);
        ctx.clip();
        MiraText.printText(this,ctx,x,y);
        ctx.closePath();
        ctx.restore();
    }

    __getset(0,__proto,'alwaysShowSelection',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'antiAliasType',
        function()
        {
            return "normal";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'autoSize',
        function()
        {
            return this._$autoSize;
        },
        function(value)
        {
            if (this._$autoSize!=value && !this._$wordWrap) {
                this._$addToRender();
                this._$renderThis();
                if (value=="center")
                    this._$autoSizeX=(_super.prototype._$get_x.call(this))+this._$autoSizeWidth/2;
                else if (value=="right")
                    this._$autoSizeX=(_super.prototype._$get_x.call(this))+this._$autoSizeWidth;
                else
                    this._$autoSizeX=_super.prototype._$get_x.call(this);
            }
            this._$autoSize=value;
            this._$doAutoSize();
        }
    );

    __getset(0,__proto,'background',
        function()
        {
            return this._$background;
        },
        function(value)
        {
            this._$backgroundColor || (this._$backgroundColor="#FFFFFF");
            this._$background=value;
        }
    );

    __getset(0,__proto,'backgroundColor',
        function()
        {
            if (this._$backgroundColor)
                return parseInt("0x"+this._$backgroundColor.substring(2),16);
            return 0xFFFFFF;
        },
        function(value)
        {
            this._$backgroundColor=StringMethod.getColorString(value);
        }
    );

    __getset(0,__proto,'border',
        function()
        {
            return this._$border;
        },
        function(value)
        {
            this._$border=value;
        }
    );

    __getset(0,__proto,'borderColor',
        function()
        {
            return parseInt("0x"+this._$borderColor.substring(2),16);
        },
        function(value)
        {
            this._$borderColor=StringMethod.getColorString(value);
        }
    );

    __getset(0,__proto,'bottomScrollV',
        function()
        {
            this._$renderThis();
            return this._$bottomScrollV;
        }
    );

    __getset(0,__proto,'caretIndex',
        function()
        {
            return this._$caretIndex;
        }
    );

    __getset(0,__proto,'condenseWhite',
        function()
        {
            return this._$condenseWhite;
        },
        function(value)
        {
            this._$condenseWhite=value;
        }
    );

    __getset(0,__proto,'defaultTextFormat',
        function()
        {
            return this._$df.clone();
        },
        function(format)
        {
            if (this._$df==TextField.DF)
                this._$df=new TextFormat();
            this._$df.align=format.align!=null ? format.align : TextField.DF.align;
            this._$df.blockIndent=format.blockIndent!=null ? format.blockIndent : TextField.DF.blockIndent;
            this._$df.bold=format.bold!=null ? format.bold : TextField.DF.bold;
            this._$df.bullet=format.bullet!=null ? format.bullet : TextField.DF.bullet;
            this._$df.display=format.display!=null ? format.display : TextField.DF.display;
            this._$df.font=format.font!=null ? format.font : TextField.DF.font;
            this._$df.indent=format.indent!=null ? format.indent : TextField.DF.indent;
            this._$df.italic=format.italic!=null ? format.italic : TextField.DF.italic;
            this._$df.leading=format.leading!=null ? format.leading : TextField.DF.leading;
            this._$df.leftMargin=format.leftMargin!=null ? format.leftMargin : TextField.DF.leftMargin;
            this._$df.letterSpacing=format.letterSpacing!=null ? format.letterSpacing : TextField.DF.letterSpacing;
            this._$df.rightMargin=format.rightMargin!=null ? format.rightMargin : TextField.DF.rightMargin;
            this._$df.size=format.size!=null ? format.size : TextField.DF.size;
            this._$df.tabStops=format.tabStops!=null ? format.tabStops : TextField.DF.tabStops;
            this._$df.target=format.target!=null ? format.target : TextField.DF.target;
            this._$df.underline=format.underline!=null ? format.underline : TextField.DF.underline;
            if (format.color!=null)
                this._$df.color=format.color;
            else
                this._$df.color=this._$textColor || this._$df.color;
            this._$df.url=format.url;
            if (this._$formatsOrigin[0])
                this._$formatsOrigin[0].format=this._$df;
            if (this._$type!="input" && this._$text && this._$text.length) {
                this._$addToRender();
                this._$createFormats();
            }
        }
    );

    __getset(0,__proto,'displayAsPassword',
        function()
        {
            return this._$disAsPass;
        },
        function(value)
        {
            this._$disAsPass=value;
            this._$addToRender();
        }
    );

    __getset(0,__proto,'embedFonts',
        function()
        {
            return this._$embedFonts;
        },
        function(value)
        {
            this._$embedFonts=value;
        }
    );

    __getset(0,__proto,'gridFitType',
        function()
        {
            return '';
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'height',
        function()
        {
            this._$renderThis();
            return (this._$autoSize!="none") ? this._$textHeight+(TextField.TOP_PADDING+TextField.BOTTOM_PADDING) : this._$tHeight;
        },
        function(value)
        {
            if (value==this._$tHeight || value<0)
                return;
            this._$tHeight=value;
            this._$addToRender();
        }
    );

    __getset(0,__proto,'htmlText',
        function()
        {
            return this._$htmlText;
        },
        function(value)
        {
            this._$doDirty(true);
            if (value=="" && this._$text)
                this._$engineClear(true);
            this._$links && (this._$links.length=0);
            this._$formatsOrigin.length=0;
            this._$htmlText=value;
            this._$text="";
            if (!this._$htmlText || !this._$htmlText.length) {
                this._$nodes.clear();
                return;
            }
            this._$addToRender();
            value="<data>"+value+"</data>";
            value=value.replace(/(\<br\>|\n)/g,"<br/>");
            if (this._$condenseWhite)
                value=value.replace(/(\s)+/g,'$1');
            var xml=(new DOMParser()).parseFromString(value,'text/xml');
            if (!xml.childNodes[0].textContent)
                return;
            var data=xml.childNodes[0].childNodes;
            this._$formatIndices.length=0;
            this._$parseHTMLText(data);
            this._$formatsOrigin.unshift({begin: 0,end: this._$text.length,format: this._$df});
            this._$createFormats();
            this._$isNextLineNewParagraph=true;
        }
    );

    __getset(0,__proto,'length',
        function()
        {
            return this._$text ? this._$text.length : 0;
        }
    );

    __getset(0,__proto,'maxChars',
        function()
        {
            return this._$maxChars;
        },
        function(value)
        {
            this._$maxChars=value;
        }
    );

    __getset(0,__proto,'maxScrollH',
        function()
        {
            if (!this._$textWidth)
                return 0;
            this._$renderThis();
            return Math.max(0,this._$textWidth-(this._$tWidth-TextField.LINE_WIDTH-TextField.LEFT_PADDING-TextField.RIGHT_PADDING))|0;
        }
    );

    __getset(0,__proto,'maxScrollV',
        function()
        {
            this._$renderThis();
            return this._$maxScrollV ? this._$maxScrollV : 1;
        }
    );

    __getset(0,__proto,'mouseWheelEnabled',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'multiline',
        function()
        {
            return this._$multiline;
        },
        function(value)
        {
            this._$multiline=value;
        }
    );

    __getset(0,__proto,'numLines',
        function()
        {
            this._$renderThis();
            if (!this._$lines || this._$lines.length==0)
                return 1;
            return this._$lines.length;
        }
    );

    __getset(0,__proto,'restrict',
        function()
        {
            return __string(!this._$restrict ? this._$restrict : this._$restrict.source);
        },
        function(value)
        {
            if (!value) {
                this._$restrict=null;
                return;
            }
            if (!(/^\[.+\]$/.test(value)))
                value="[^"+value+"]";
            this._$restrict=new RegExp(value,"g");
        }
    );

    __getset(0,__proto,'scrollH',
        function()
        {
            return this._$viewport[0]|0;
        },
        function(value)
        {
            this._$scrollHNoRender(value);
            this._$engineLayout();
        }
    );

    __getset(0,__proto,'scrollV',
        function()
        {
            return this._$scrollV ? this._$scrollV : 1;
        },
        function(value)
        {
            this._$scrollVNoRender(value);
            this._$engineLayout();
        }
    );

    __getset(0,__proto,'selectable',
        function()
        {
            return this._$selectable;
        },
        function(value)
        {
            this._$selectable=value;
            if (!value && this._$scroller) {
                this._$scroller.running && this._$scroller.stop();
                this._$scroller.removeEventListener(TimerEvent.TIMER,__bind(this._$onTextScroll,this));
                this._$scroller=null;
            }
        }
    );

    __getset(0,__proto,'selectionBeginIndex',
        function()
        {
            return this._$selectionBeginIndex;
        }
    );

    __getset(0,__proto,'selectionEndIndex',
        function()
        {
            return this._$selectionEndIndex;
        }
    );

    __getset(0,__proto,'sharpness',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'styleSheet',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'text',
        function()
        {
            return this._$text;
        },
        function(value)
        {
            this._$doDirty(true);
            this._$htmlText="";
            if (value==undefined) {
                throw new Error("Parameter text must be non-null.");
            }
            if (value=="") {
                this._$engineClear(true);
                return;
            }
            this._$text=value+'';
            this._$nodeIndex=0;
            this._$addToRender();
            this._$viewport[0]=0;
            this._$scrollV=1;
            this._$formatsOrigin.length=0;
            this._$formatsOrigin.push({begin: 0,end: this._$text.length,format: this._$df});
            this._$formatIndices.length=0;
            this._$createFormats();
            this._$isNextLineNewParagraph=true;
        }
    );

    __getset(0,__proto,'textColor',
        function()
        {
            return this._$textColor;
        },
        function(value)
        {
            if (value>0xFFFFFF)
                value=uint(Number("0x"+value.toString(16).substr(2)));
            if (this._$df==TextField.DF)
                this._$df=TextField.DF.clone();
            if (this._$formatsOrigin[0])
                this._$formatsOrigin[0].format=this._$df;
            this._$textColor=value;
            this._$df.color=this._$textColor;
            if (this._$text && this._$text.length>0) {
                this._$createFormats();
                this._$addToRender();
            }
        }
    );

    __getset(0,__proto,'textHeight',
        function()
        {
            this._$renderThis();
            return this._$textHeight;
        }
    );

    __getset(0,__proto,'textInteractionMode',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'textWidth',
        function()
        {
            this._$renderThis();
            return this._$textWidth;
        }
    );

    __getset(0,__proto,'thickness',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'type',
        function()
        {
            return this._$type;
        },
        function(value)
        {
            var _$this=this;
            this._$type=value;
            if (this._$type=="input") {
                this._$caretIndex=0;
                if (!MainWin.doc2.canvas['onmouseup'] && TextField.onMobile) {
                    MainWin.doc2.canvas['onmouseup']=function (e) {
                        if (TextField.isInputting) {
                            if (Browser.input.parentNode)
                                Browser.input.target._$checkTextFocusout(null);
                            else
                                Browser.addToBody(Browser.input);
                            Browser.input.focus();
                        }
                    };
                }
            }
        }
    );

    __getset(0,__proto,'useRichTextClipboard',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'wordWrap',
        function()
        {
            return this._$wordWrap;
        },
        function(value)
        {
            if (this._$wordWrap!=value)
                this._$addToRender();
            this._$wordWrap=value;
        }
    );

    __getset(0,__proto,'width',
        function()
        {
            this._$renderThis();
            if (this._$wordWrap)
                return this._$tWidth;
            return (this._$autoSize!="none") ? this._$textWidth+(TextField.LEFT_PADDING+TextField.RIGHT_PADDING) : this._$tWidth;
        },
        function(value)
        {
            if (value==this._$tWidth || value<0)
                return;
            if (this._$autoSize!="none") {
                this._$renderThis();
                if (this._$autoSize=="center")
                    this._$autoSizeX=this.x+value/2;
                else if (this._$autoSize=="right")
                    this._$autoSizeX=this.x+value;
                else
                    this._$autoSizeX=this.x;
                this._$autoSizeWidth=this._$textWidth;
            } else
                this._$autoSizeWidth=value;
            this._$tWidth=value;
            this._$addToRender();
        }
    );

    __getset(0,__proto,'x',
        function()
        {
            this._$renderThis();
            return _super.prototype._$get_x.call(this);
        },
        function(value)
        {
            if (this._$autoSize=='center')
                this._$autoSizeX=value+this.width/2;
            else if (this._$autoSize=='right')
                this._$autoSizeX=value+this.width;
            else
                this._$autoSizeX=value;
            if (this._$autoSize!="none")
                this._$autoSizeWidth=this._$textWidth;
            else
                this._$autoSizeWidth=this._$tWidth;
            _super.prototype._$set_x.call(this,value);
            if (this._$type=="input" && Stage.stage.focus==this) {
                var concatedMatrix=this._getConcatenatedMatrix();
                var tempX=concatedMatrix.tx*MainWin.window_as.scale.x+MainWin.doc2.body.x|0;
                if (tempX!=Browser.input.left) {
                    Browser.input.setPos(tempX,concatedMatrix.ty*MainWin.window_as.scale.y+MainWin.doc2.body.y);
                }
            }
        }
    );

    TextField.isFontCompatible=function(fontName,fontStyle)
    {
        return true;
    }

    TextField.renderTexts=function()
    {
        var len=TextField.TextsToRender.length;
        if (len==0)
            return;
        for (var i=len-1;i>=0;i--) {
            var t=TextField.TextsToRender.pop();
            t._$engineUpdate();
        }
    }

    TextField.LINE_WIDTH=1;
    TextField.LEFT_PADDING=2;
    TextField.RIGHT_PADDING=2;
    TextField.TOP_PADDING=2;
    TextField.BOTTOM_PADDING=2;
    TextField.LINE_LEADING=0;
    TextField.isInputting=false;

    __static(TextField,[
        'myAgent',function(){return this.myAgent=__string(navigator.userAgent);},
        'onIPhone',function(){return this.onIPhone=TextField.myAgent.indexOf("iPhone")> -1;},
        'onIPad',function(){return this.onIPad=TextField.myAgent.indexOf("iPad")> -1;},
        'onAndriod',function(){return this.onAndriod=TextField.myAgent.indexOf("Android")> -1;},
        'onWP',function(){return this.onWP=TextField.myAgent.indexOf("Windows Phone")> -1;},
        'onQQ',function(){return this.onQQ=TextField.myAgent.indexOf("QQBrowser")> -1;},
        'onMobile',function(){return this.onMobile=TextField.onIPhone || TextField.onAndriod || TextField.onWP || TextField.onIPad;},
        'initialWindowWidth',function(){return this.initialWindowWidth=window.innerWidth|0;},
        'initialWindowHeight',function(){return this.initialWindowHeight=window.innerHeight|0;},
        'deviceAvailWidth',function(){return this.deviceAvailWidth=window.screen.availWidth|0;},
        'deviceAvailHeight',function(){return this.deviceAvailHeight=window.screen.availHeight|0;},
        'pixelRatio',function(){return this.pixelRatio=TextField.deviceAvailHeight/TextField.initialWindowHeight;},
        'inputHeight',function(){return this.inputHeight=(50/Math.min(1,TextField.pixelRatio)/2|0)*2;},
        'textAreaHeight',function(){return this.textAreaHeight=(80/Math.min(1,TextField.pixelRatio)/2|0)*2;},
        'inputFontSize',function(){return this.inputFontSize=((25/Math.min(1,TextField.pixelRatio)/2|0)+1)*2;},
        'TextsToRender',function(){return this.TextsToRender=[];},
        'DF',function(){return this.DF=new TextFormat("Times New Roman",12,0,false,false,false,null,null,"left",0,0,0,0);}
    ]);

    TextField.toString=function(){return "[class TextField]";};
    Mira.un_proto(TextField);
    return TextField;
})(InteractiveObject);
var TextLineInfo=(function() {
    function TextLineInfo(begin,isFirstLineOfParagraph,y)
    {
        this.text="";
        this.begin=0;
        this.end=0;
        this.width=0;
        this.height=0;
        this.maxLeading=0;
        this.isFirstLineOfParagraph=false;
        this.rightMargin=0;
        this.nodes=[];
        this.begin=this.end=begin;
        this.isFirstLineOfParagraph=isFirstLineOfParagraph;
        this.y=y;
    }

    __class(TextLineInfo,'TextLineInfo');

    TextLineInfo.toString=function(){return "[class TextLineInfo]";};
    return TextLineInfo;
})();

var TextFieldAutoSize=(function() {
    function TextFieldAutoSize()
    {
    }

    __class(TextFieldAutoSize,'flash.text.TextFieldAutoSize');

    TextFieldAutoSize.NONE="none";
    TextFieldAutoSize.LEFT="left";
    TextFieldAutoSize.CENTER="center";
    TextFieldAutoSize.RIGHT="right";

    TextFieldAutoSize.toString=function(){return "[class TextFieldAutoSize]";};
    return TextFieldAutoSize;
})();

var TextFieldType=(function() {
    function TextFieldType()
    {
    }

    __class(TextFieldType,'flash.text.TextFieldType');

    TextFieldType.INPUT="input";
    TextFieldType.DYNAMIC="dynamic";

    TextFieldType.toString=function(){return "[class TextFieldType]";};
    return TextFieldType;
})();

var TextFormat=(function() {
    function TextFormat(font,size,color,bold,italic,underline,url,target,align,leftMargin,rightMargin,indent,leading)
    {
        (font===void 0) && (font=null);
        (size===void 0) && (size=null);
        (color===void 0) && (color=null);
        (bold===void 0) && (bold=null);
        (italic===void 0) && (italic=null);
        (underline===void 0) && (underline=null);
        (url===void 0) && (url=null);
        (target===void 0) && (target=null);
        (align===void 0) && (align=null);
        (leftMargin===void 0) && (leftMargin=null);
        (rightMargin===void 0) && (rightMargin=null);
        (indent===void 0) && (indent=null);
        (leading===void 0) && (leading=null);
        this.font=font;
        this.size=size;
        this.color=color;
        this.bold=bold;
        this.italic=italic;
        this.underline=underline;
        this.align=align;
        this.leftMargin=leftMargin;
        this.rightMargin=rightMargin;
        this.indent=indent;
        this.leading=leading;
    }

    __class(TextFormat,'flash.text.TextFormat');
    var __proto=TextFormat.prototype;

    __proto.measureText=function(text)
    {
        var result={width: 0,height: 0};
        if (!text || !text.length)
            return result;
        if (text=="\n") {
            result={width: 0,height: this._size+3};
            return result;
        }
        text=text.replace(/\n/g,"");
        TextFormat.ctx.font=this.getFont();
        var mRes=TextFormat.ctx.measureText(text);
        result.width=mRes.width1 || mRes.width;
        this._letterSpacing && (result.width+=this._letterSpacing*text.length);
        result.height=(int(this._size) || 12)+TextFormat.HEI_OFF;
        return result;
    }

    __proto.getFont=function()
    {
        var result="";
        if (this._italic)
            result+="italic ";
        if (this._bold)
            result+="bold ";
        result+=(this._size ? this._size : 12)+"px ";
        if (this._font) {
            if (/\d/.test(this._font.charAt(0)))
                result+="Microsoft YaHei";
            else
                result+=this._font;
        } else
            result+="Times New Roman";
        return result;
    }

    __proto.clone=function()
    {
        var result=new TextFormat();
        result._align=this._align;
        result._blockIndent=this._blockIndent;
        result._bold=this._bold;
        result._bullet=this._bullet;
        result._color=this._color;
        result._font=this._font;
        result._indent=this._indent;
        result._italic=this._italic;
        result._leading=this._leading;
        result._leftMargin=this._leftMargin;
        result._letterSpacing=this._letterSpacing;
        result._rightMargin=this._rightMargin;
        result._size=this._size;
        result._underline=this._underline;
        return result;
    }

    __getset(0,__proto,'align',
        function()
        {
            return this._align;
        },
        function(value)
        {
            this._align=value;
        }
    );

    __getset(0,__proto,'blockIndent',
        function()
        {
            return this._blockIndent;
        },
        function(value)
        {
            this._blockIndent=value;
        }
    );

    __getset(0,__proto,'bold',
        function()
        {
            return this._bold;
        },
        function(value)
        {
            this._bold=value;
        }
    );

    __getset(0,__proto,'bullet',
        function()
        {
            return this._bullet;
        },
        function(value)
        {
            this._bullet=value;
        }
    );

    __getset(0,__proto,'color',
        function()
        {
            return this._color;
        },
        function(value)
        {
            this._color=value;
        }
    );

    __getset(0,__proto,'font',
        function()
        {
            return this._font;
        },
        function(value)
        {
            this._font=value;
        }
    );

    __getset(0,__proto,'indent',
        function()
        {
            return this._indent;
        },
        function(value)
        {
            this._indent=value;
        }
    );

    __getset(0,__proto,'italic',
        function()
        {
            return this._italic;
        },
        function(value)
        {
            this._italic=value;
        }
    );

    __getset(0,__proto,'leading',
        function()
        {
            return this._leading;
        },
        function(value)
        {
            this._leading=value;
        }
    );

    __getset(0,__proto,'leftMargin',
        function()
        {
            return this._leftMargin;
        },
        function(value)
        {
            this._leftMargin=value;
        }
    );

    __getset(0,__proto,'letterSpacing',
        function()
        {
            return this._letterSpacing;
        },
        function(value)
        {
            this._letterSpacing=value;
        }
    );

    __getset(0,__proto,'rightMargin',
        function()
        {
            return this._rightMargin;
        },
        function(value)
        {
            this._rightMargin=value;
        }
    );

    __getset(0,__proto,'size',
        function()
        {
            return this._size;
        },
        function(value)
        {
            this._size=value;
        }
    );

    __getset(0,__proto,'display',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'kerning',
        function()
        {
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'tabStops',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'target',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'url',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'underline',
        function()
        {
            return this._underline;
        },
        function(value)
        {
            this._underline=value;
        }
    );

    TextFormat.BULLET_INDENT=50;
    TextFormat.BULLET_RADIUS=2;
    TextFormat.HEI_OFF=3;

    __static(TextFormat,[
        'canvas',function(){return this.canvas=document.createElement("canvas");},
        'ctx',function(){return this.ctx=TextFormat.canvas.getContext("2d");}
    ]);

    TextFormat.toString=function(){return "[class TextFormat]";};
    Mira.un_proto(TextFormat);
    return TextFormat;
})();

var TextFormatAlign=(function() {
    function TextFormatAlign()
    {
    }

    __class(TextFormatAlign,'flash.text.TextFormatAlign');

    TextFormatAlign.CENTER="center";
    TextFormatAlign.JUSTIFY="justify";
    TextFormatAlign.LEFT="left";
    TextFormatAlign.RIGHT="right";

    TextFormatAlign.toString=function(){return "[class TextFormatAlign]";};
    return TextFormatAlign;
})();

var TextLineMetrics=(function() {
    function TextLineMetrics(x,width,height,ascent,descent,leading)
    {
        this.x=x;
        this.width=width;
        this.height=height;
        this.ascent=ascent;
        this.descent=descent;
        this.leading=leading;
    }

    __class(TextLineMetrics,'flash.text.TextLineMetrics');

    TextLineMetrics.toString=function(){return "[class TextLineMetrics]";};
    return TextLineMetrics;
})();

var TextNodeList=(function() {
    function TextNodeList()
    {
        this._source=[];
    }

    __class(TextNodeList,'flash.text.TextNodeList');
    var __proto=TextNodeList.prototype;

    __proto.clear=function()
    {
        this._source.length=0;
    }

    __proto.getElem=function(index)
    {
        return this._source[index];
    }

    __proto.push=function(value)
    {
        this._source.push(value);
    }

    __proto.clone=function()
    {
        var result=new TextNodeList();
        var obj;
        for (var i=0,len=this._source.length;i<len;i++) {
            obj={};
            for (var key in this._source[i]) {
                obj[key]=this._source[i][key];
            }
            result.push(obj);
        }
        return result;
    }

    __getset(0,__proto,'length',
        function()
        {
            return this._source.length;
        }
    );

    __getset(0,__proto,'source',
        function()
        {
            return this._source;
        }
    );

    TextNodeList.toString=function(){return "[class TextNodeList]";};
    Mira.un_proto(TextNodeList);
    return TextNodeList;
})();

var TextSnapshot=(function() {
    function TextSnapshot()
    {
    }

    __class(TextSnapshot,'flash.text.TextSnapshot');
    var __proto=TextSnapshot.prototype;

    __proto.findText=function(beginIndex,textToFind,caseSensitive)
    {
        return 0;
    }

    __proto.getSelected=function(beginIndex,endIndex)
    {
        return false;
    }

    __proto.getSelectedText=function(includeLineEndings)
    {
        (includeLineEndings===void 0) && (includeLineEndings=false);
        return null;
    }

    __proto.getText=function(beginIndex,endIndex,includeLineEndings)
    {
        (includeLineEndings===void 0) && (includeLineEndings=false);
        return null;
    }

    __proto.getTextRunInfo=function(beginIndex,endIndex)
    {
        return null;
    }

    __proto.hitTestTextNearPos=function(x,y,maxDistance)
    {
        (maxDistance===void 0) && (maxDistance=0);
        return 0;
    }

    __proto.setSelectColor=function(hexColor)
    {
        (hexColor===void 0) && (hexColor=16776960);
    }

    __proto.setSelected=function(beginIndex,endIndex,select)
    {
    }

    __getset(0,__proto,'charCount',
        function()
        {
            return 0;
        }
    );

    TextSnapshot.toString=function(){return "[class TextSnapshot]";};
    Mira.un_proto(TextSnapshot);
    return TextSnapshot;
})();

var ContentElement=(function() {
    function ContentElement(elementFormat,eventMirror,textRotation)
    {
        (elementFormat===void 0) && (elementFormat=null);
        (eventMirror===void 0) && (eventMirror=null);
        (textRotation===void 0) && (textRotation="rotate0");
    }

    __class(ContentElement,'flash.text.engine.ContentElement');
    var __proto=ContentElement.prototype;

    __getset(0,__proto,'elementFormat',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'eventMirror',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'groupElement',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'rawText',
        function()
        {
            return "";
        }
    );

    __getset(0,__proto,'text',
        function()
        {
            return "";
        }
    );

    __getset(0,__proto,'textBlock',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'textBlockBeginIndex',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'textRotation',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    ContentElement.GRAPHIC_ELEMENT=0xFDEF;

    ContentElement.toString=function(){return "[class ContentElement]";};
    return ContentElement;
})();

var ElementFormat=(function() {
    function ElementFormat()
    {
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
        return;
    }

    __class(ElementFormat,'flash.text.engine.ElementFormat');
    var __proto=ElementFormat.prototype;

    __proto.clone=function()
    {
        return null;
    }

    __proto.getFontMetrics=function()
    {
        return null;
    }

    __getset(0,__proto,'alignmentBaseline',
        function()
        {
            return "";
        },
        function(alignmentBaseline)
        {
        }
    );

    __getset(0,__proto,'alpha',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'baselineShift',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'breakOpportunity',
        function()
        {
            return "";
        },
        function(opportunityType)
        {
        }
    );

    __getset(0,__proto,'color',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'digitCase',
        function()
        {
            return "";
        },
        function(digitCaseType)
        {
        }
    );

    __getset(0,__proto,'digitWidth',
        function()
        {
            return "";
        },
        function(digitWidthType)
        {
        }
    );

    __getset(0,__proto,'dominantBaseline',
        function()
        {
            return "";
        },
        function(dominantBaseline)
        {
        }
    );

    __getset(0,__proto,'fontDescription',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'fontSize',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'kerning',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'ligatureLevel',
        function()
        {
            return "";
        },
        function(ligatureLevelType)
        {
        }
    );

    __getset(0,__proto,'locale',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'locked',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'textRotation',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'trackingLeft',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'trackingRight',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'typographicCase',
        function()
        {
            return "";
        },
        function(typographicCaseType)
        {
        }
    );

    ElementFormat.toString=function(){return "[class ElementFormat]";};
    Mira.un_proto(ElementFormat);
    return ElementFormat;
})();

var FontDescription=(function() {
    function FontDescription()
    {
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
        return;
    }

    __class(FontDescription,'flash.text.engine.FontDescription');
    var __proto=FontDescription.prototype;

    __proto.clone=function()
    {
        return null;
    }

    __getset(0,__proto,'cffHinting',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'fontLookup',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'fontName',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'fontPosture',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'fontWeight',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'locked',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'renderingMode',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    FontDescription.isDeviceFontCompatible=function(fontName,fontWeight,fontPosture)
    {
        return false;
    }

    FontDescription.isFontCompatible=function(fontName,fontWeight,fontPosture)
    {
        return false;
    }

    FontDescription.toString=function(){return "[class FontDescription]";};
    Mira.un_proto(FontDescription);
    return FontDescription;
})();

var FontLookup=(function() {
    function FontLookup()
    {
    }

    __class(FontLookup,'flash.text.engine.FontLookup');

    FontLookup.DEVICE="device";
    FontLookup.EMBEDDED_CFF="embeddedCFF";

    FontLookup.toString=function(){return "[class FontLookup]";};
    return FontLookup;
})();

var FontMetrics=(function() {
    function FontMetrics()
    {
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
        return;
    }

    __class(FontMetrics,'flash.text.engine.FontMetrics');

    FontMetrics.toString=function(){return "[class FontMetrics]";};
    return FontMetrics;
})();

var GraphicElement=(function(_super) {
    function GraphicElement()
    {
        GraphicElement.__super.call(this);
        var args=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)args.push(arguments[$a]);
        return;
    }

    __class(GraphicElement,'flash.text.engine.GraphicElement',_super);
    var __proto=GraphicElement.prototype;

    __getset(0,__proto,'elementHeight',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'elementWidth',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'graphic',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    GraphicElement.toString=function(){return "[class GraphicElement]";};
    return GraphicElement;
})(ContentElement);

var GroupElement=(function(_super) {
    function GroupElement()
    {
        GroupElement.__super.call(this);
        var a=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)a.push(arguments[$a]);
    }

    __class(GroupElement,'flash.text.engine.GroupElement',_super);
    var __proto=GroupElement.prototype;

    __proto.getElementAt=function(index)
    {
        return null;
    }

    __proto.getElementAtCharIndex=function(charIndex)
    {
        return null;
    }

    __proto.getElementIndex=function(element)
    {
        return 0;
    }

    __proto.groupElements=function(beginIndex,endIndex)
    {
        return null;
    }

    __proto.mergeTextElements=function(beginIndex,endIndex)
    {
        return null;
    }

    __proto.replaceElements=function(beginIndex,endIndex,newElements)
    {
        return null;
    }

    __proto.setElements=function(value)
    {
    }

    __proto.splitTextElement=function(elementIndex,splitIndex)
    {
        return null;
    }

    __proto.ungroupElements=function(groupIndex)
    {
    }

    __getset(0,__proto,'elementCount',
        function()
        {
            return 0;
        }
    );

    GroupElement.toString=function(){return "[class GroupElement]";};
    Mira.un_proto(GroupElement);
    return GroupElement;
})(ContentElement);

var TextJustifier=(function() {
    function TextJustifier(locale,lineJustification)
    {
    }

    __class(TextJustifier,'flash.text.engine.TextJustifier');
    var __proto=TextJustifier.prototype;

    __proto.clone=function()
    {
        return null;
    }

    __getset(0,__proto,'lineJustification',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'locale',
        function()
        {
            return "";
        }
    );

    TextJustifier.getJustifierForLocale=function(locale)
    {
        return null;
    }

    TextJustifier.toString=function(){return "[class TextJustifier]";};
    Mira.un_proto(TextJustifier);
    return TextJustifier;
})();

var SpaceJustifier=(function(_super) {
    function SpaceJustifier(locale,lineJustification,letterSpacing)
    {
        (locale===void 0) && (locale="en");
        (lineJustification===void 0) && (lineJustification="unjustified");
        (letterSpacing===void 0) && (letterSpacing=false);
        SpaceJustifier.__super.call(this,locale,lineJustification);
    }

    __class(SpaceJustifier,'flash.text.engine.SpaceJustifier',_super);
    var __proto=SpaceJustifier.prototype;

    __proto.clone=function()
    {
        return null;
    }

    __getset(0,__proto,'letterSpacing',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'maximumSpacing',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'minimumSpacing',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'optimumSpacing',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    SpaceJustifier.toString=function(){return "[class SpaceJustifier]";};
    Mira.un_proto(SpaceJustifier);
    return SpaceJustifier;
})(TextJustifier);

var TabStop=(function() {
    function TabStop()
    {
        var a=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)a.push(arguments[$a]);
    }

    __class(TabStop,'flash.text.engine.TabStop');
    var __proto=TabStop.prototype;

    __getset(0,__proto,'alignment',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'decimalAlignmentToken',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'position',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    TabStop.toString=function(){return "[class TabStop]";};
    return TabStop;
})();

var TextBaseline=(function() {
    function TextBaseline()
    {
    }

    __class(TextBaseline,'flash.text.engine.TextBaseline');

    TextBaseline.ASCENT="ascent";
    TextBaseline.DESCENT="descent";
    TextBaseline.IDEOGRAPHIC_BOTTOM="ideographicBottom";
    TextBaseline.IDEOGRAPHIC_CENTER="ideographicCenter";
    TextBaseline.IDEOGRAPHIC_TOP="ideographicTop";
    TextBaseline.ROMAN="roman";
    TextBaseline.USE_DOMINANT_BASELINE="useDominantBaseline";

    TextBaseline.toString=function(){return "[class TextBaseline]";};
    return TextBaseline;
})();

var TextBlock=(function() {
    function TextBlock()
    {
        var a=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)a.push(arguments[$a]);
        return;
    }

    __class(TextBlock,'flash.text.engine.TextBlock');
    var __proto=TextBlock.prototype;

    __proto.createTextLine=function(previousLine,width,lineOffset,fitSomething)
    {
        (previousLine===void 0) && (previousLine=null);
        (width===void 0) && (width=1000000);
        (lineOffset===void 0) && (lineOffset=0);
        (fitSomething===void 0) && (fitSomething=false);
        return null;
    }

    __proto.dump=function()
    {
        return "";
    }

    __proto.findNextAtomBoundary=function(afterCharIndex)
    {
        return 0;
    }

    __proto.findNextWordBoundary=function(afterCharIndex)
    {
        return 0;
    }

    __proto.findPreviousAtomBoundary=function(beforeCharIndex)
    {
        return 0;
    }

    __proto.findPreviousWordBoundary=function(beforeCharIndex)
    {
        return 0;
    }

    __proto.getTextLineAtCharIndex=function(charIndex)
    {
        return null;
    }

    __proto.recreateTextLine=function(textLine,previousLine,width,lineOffset,fitSomething)
    {
        (previousLine===void 0) && (previousLine=null);
        (width===void 0) && (width=1000000);
        (lineOffset===void 0) && (lineOffset=0);
        (fitSomething===void 0) && (fitSomething=false);
        return null;
    }

    __proto.releaseLineCreationData=function()
    {
    }

    __proto.releaseLines=function(firstLine,lastLine)
    {
    }

    __getset(0,__proto,'applyNonLinearFontScaling',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'baselineFontDescription',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'baselineFontSize',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'baselineZero',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'bidiLevel',
        function()
        {
            return 0;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'content',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'firstInvalidLine',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'firstLine',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'lastLine',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'lineRotation',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'tabStops',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'textJustifier',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'textLineCreationResult',
        function()
        {
            return "";
        }
    );

    TextBlock.toString=function(){return "[class TextBlock]";};
    Mira.un_proto(TextBlock);
    return TextBlock;
})();

var TextElement=(function(_super) {
    function TextElement()
    {
        TextElement.__super.call(this);
        var a=[];for(var $a=0,$b=arguments.length;$a<$b;++$a)a.push(arguments[$a]);
    }

    __class(TextElement,'flash.text.engine.TextElement',_super);
    var __proto=TextElement.prototype;

    __proto.replaceText=function(beginIndex,endIndex,newText)
    {
    }

    __getset(0,__proto,'text',null,
        function(value)
        {
        }
    );

    TextElement.toString=function(){return "[class TextElement]";};
    Mira.un_proto(TextElement);
    return TextElement;
})(ContentElement);

var TextLine=(function(_super) {
    function TextLine()
    {
        this.getMirrorRegion=null;
        TextLine.__super.call(this);
    }

    __class(TextLine,'flash.text.engine.TextLine',_super);
    var __proto=TextLine.prototype;

    __proto.dump=function()
    {
        return "";
    }

    __proto.flushAtomData=function()
    {
    }

    __proto.getAtomBidiLevel=function(atomIndex)
    {
        return 0;
    }

    __proto.getAtomBounds=function(atomIndex)
    {
        return null;
    }

    __proto.getAtomCenter=function(atomIndex)
    {
        return 0;
    }

    __proto.getAtomGraphic=function(atomIndex)
    {
        return null;
    }

    __proto.getAtomIndexAtCharIndex=function(charIndex)
    {
        return 0;
    }

    __proto.getAtomIndexAtPoint=function(stageX,stageY)
    {
        return 0;
    }

    __proto.getAtomTextBlockBeginIndex=function(atomIndex)
    {
        return 0;
    }

    __proto.getAtomTextBlockEndIndex=function(atomIndex)
    {
        return 0;
    }

    __proto.getAtomTextRotation=function(atomIndex)
    {
        return "";
    }

    __proto.getAtomWordBoundaryOnLeft=function(atomIndex)
    {
        return false;
    }

    __proto.getBaselinePosition=function(baseline)
    {
        return 0;
    }

    __getset(0,__proto,'ascent',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'atomCount',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'contextMenu',null,
        function(value)
        {
        }
    );

    __getset(0,__proto,'descent',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'hasGraphicElement',
        function()
        {
            return false;
        }
    );

    __getset(0,__proto,'hasTabs',
        function()
        {
            return false;
        }
    );

    __getset(0,__proto,'mirrorRegions',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'nextLine',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'previousLine',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'rawTextLength',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'specifiedWidth',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'tabChildren',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'textBlock',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'textBlockBeginIndex',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'textHeight',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'textWidth',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'totalAscent',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'totalDescent',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'totalHeight',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'unjustifiedTextWidth',
        function()
        {
            return 0;
        }
    );

    __getset(0,__proto,'validity',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    TextLine.MAX_LINE_WIDTH=1000000;

    TextLine.toString=function(){return "[class TextLine]";};
    Mira.un_proto(TextLine);
    return TextLine;
})(DisplayObjectContainer);

var TextLineMirrorRegion=(function() {
    function TextLineMirrorRegion()
    {
    }

    __class(TextLineMirrorRegion,'flash.text.engine.TextLineMirrorRegion');
    var __proto=TextLineMirrorRegion.prototype;

    __getset(0,__proto,'bounds',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'element',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'mirror',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'nextRegion',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'previousRegion',
        function()
        {
            return null;
        }
    );

    __getset(0,__proto,'textLine',
        function()
        {
            return null;
        }
    );

    TextLineMirrorRegion.toString=function(){return "[class TextLineMirrorRegion]";};
    return TextLineMirrorRegion;
})();

var ImgText=(function() {
    function ImgText()
    {
    }

    __class(ImgText,'flash.text.textformat.ImgText');
    var __proto=ImgText.prototype;

    __proto.getInstance=function()
    {
        if (ImgText.instance==null)
            ImgText.instance=new ImgText();
        return ImgText.instance;
    }

    __proto.formatFont=function(text,textFontObj)
    {
        var textRect=new Rectangle();
        if (text.length<=0)
            return textRect;
        return null;
    }

    ImgText.instance=null;

    ImgText.toString=function(){return "[class ImgText]";};
    Mira.un_proto(ImgText);
    return ImgText;
})();

var ContextMenu=(function(_super) {
    function ContextMenu()
    {
        this._$builtInItems=new ContextMenuBuiltInItems();
        ContextMenu.__super.call(this);
    }

    __class(ContextMenu,'flash.ui.ContextMenu',_super);
    var __proto=ContextMenu.prototype;

    __proto.clone=function()
    {
        return new NativeMenu();
    }

    __proto.hideBuiltInItems=function()
    {
    }

    __getset(0,__proto,'builtInItems',
        function()
        {
            return this._$builtInItems;
        },
        function(value)
        {
            this._$builtInItems=value;
        }
    );

    __getset(0,__proto,'clipboardItems',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'clipboardMenu',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'customItems',
        function()
        {
            return [];
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'link',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(1,ContextMenu,'isSupported',
        function()
        {
            return false;
        }
    );

    ContextMenu.toString=function(){return "[class ContextMenu]";};
    Mira.un_proto(ContextMenu);
    return ContextMenu;
})(NativeMenu);

var ContextMenuBuiltInItems=(function() {
    function ContextMenuBuiltInItems()
    {
    }

    __class(ContextMenuBuiltInItems,'flash.ui.ContextMenuBuiltInItems');
    var __proto=ContextMenuBuiltInItems.prototype;

    __proto.clone=function()
    {
        return new ContextMenuBuiltInItems();
    }

    __getset(0,__proto,'forwardAndBack',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    __getset(0,__proto,'loop',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    __getset(0,__proto,'play',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    __getset(0,__proto,'print',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    __getset(0,__proto,'quality',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    __getset(0,__proto,'rewind',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    __getset(0,__proto,'save',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    __getset(0,__proto,'zoom',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    ContextMenuBuiltInItems.toString=function(){return "[class ContextMenuBuiltInItems]";};
    Mira.un_proto(ContextMenuBuiltInItems);
    return ContextMenuBuiltInItems;
})();

var ContextMenuClipboardItems=(function() {
    function ContextMenuClipboardItems()
    {
    }

    __class(ContextMenuClipboardItems,'flash.ui.ContextMenuClipboardItems');
    var __proto=ContextMenuClipboardItems.prototype;

    __proto.clone=function()
    {
        return new ContextMenuClipboardItems();
    }

    __getset(0,__proto,'clear',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    __getset(0,__proto,'copy',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    __getset(0,__proto,'cut',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    __getset(0,__proto,'paste',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    __getset(0,__proto,'selectAll',
        function()
        {
            return false;
        },
        function(val)
        {
        }
    );

    ContextMenuClipboardItems.toString=function(){return "[class ContextMenuClipboardItems]";};
    Mira.un_proto(ContextMenuClipboardItems);
    return ContextMenuClipboardItems;
})();

var ContextMenuItem=(function(_super) {
    function ContextMenuItem(caption,separatorBefore,enabled,visible)
    {
        (separatorBefore===void 0) && (separatorBefore=false);
        (enabled===void 0) && (enabled=true);
        (visible===void 0) && (visible=true);
        ContextMenuItem.__super.call(this);
    }

    __class(ContextMenuItem,'flash.ui.ContextMenuItem',_super);
    var __proto=ContextMenuItem.prototype;

    __proto.clone=function()
    {
        return null;
    }

    __getset(0,__proto,'caption',
        function()
        {
            return null;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'separatorBefore',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    __getset(0,__proto,'visible',
        function()
        {
            return false;
        },
        function(value)
        {
        }
    );

    ContextMenuItem.toString=function(){return "[class ContextMenuItem]";};
    Mira.un_proto(ContextMenuItem);
    return ContextMenuItem;
})(NativeMenuItem);

var Keyboard=(function() {
    function Keyboard()
    {
    }

    __class(Keyboard,'flash.ui.Keyboard');

    __getset(1,Keyboard,'capsLock',
        function()
        {
            return false;
        }
    );

    __getset(1,Keyboard,'numLock',
        function()
        {
            return false;
        }
    );

    __getset(1,Keyboard,'hasVirtualKeyboard',
        function()
        {
            return false;
        }
    );

    __getset(1,Keyboard,'physicalKeyboardType',
        function()
        {
            return "";
        }
    );

    Keyboard.isAccessible=function()
    {
        return false;
    }

    Keyboard.KEYNAME_UPARROW="Up";
    Keyboard.KEYNAME_DOWNARROW="Down";
    Keyboard.KEYNAME_LEFTARROW="Left";
    Keyboard.KEYNAME_RIGHTARROW="Right";
    Keyboard.KEYNAME_F1="F1";
    Keyboard.KEYNAME_F2="F2";
    Keyboard.KEYNAME_F3="F3";
    Keyboard.KEYNAME_F4="F4";
    Keyboard.KEYNAME_F5="F5";
    Keyboard.KEYNAME_F6="F6";
    Keyboard.KEYNAME_F7="F7";
    Keyboard.KEYNAME_F8="F8";
    Keyboard.KEYNAME_F9="F9";
    Keyboard.KEYNAME_F10="F10";
    Keyboard.KEYNAME_F11="F11";
    Keyboard.KEYNAME_F12="F12";
    Keyboard.KEYNAME_F13="F13";
    Keyboard.KEYNAME_F14="F14";
    Keyboard.KEYNAME_F15="F15";
    Keyboard.KEYNAME_F16="F16";
    Keyboard.KEYNAME_F17="F17";
    Keyboard.KEYNAME_F18="F18";
    Keyboard.KEYNAME_F19="F19";
    Keyboard.KEYNAME_F20="F20";
    Keyboard.KEYNAME_F21="F21";
    Keyboard.KEYNAME_F22="F22";
    Keyboard.KEYNAME_F23="F23";
    Keyboard.KEYNAME_F24="F24";
    Keyboard.KEYNAME_F25="F25";
    Keyboard.KEYNAME_F26="F26";
    Keyboard.KEYNAME_F27="F27";
    Keyboard.KEYNAME_F28="F28";
    Keyboard.KEYNAME_F29="F29";
    Keyboard.KEYNAME_F30="F30";
    Keyboard.KEYNAME_F31="F31";
    Keyboard.KEYNAME_F32="F32";
    Keyboard.KEYNAME_F33="F33";
    Keyboard.KEYNAME_F34="F34";
    Keyboard.KEYNAME_F35="F35";
    Keyboard.KEYNAME_INSERT="Insert";
    Keyboard.KEYNAME_DELETE="Delete";
    Keyboard.KEYNAME_HOME="Home";
    Keyboard.KEYNAME_BEGIN="Begin";
    Keyboard.KEYNAME_END="End";
    Keyboard.KEYNAME_PAGEUP="PgUp";
    Keyboard.KEYNAME_PAGEDOWN="PgDn";
    Keyboard.KEYNAME_PRINTSCREEN="PrntScrn";
    Keyboard.KEYNAME_SCROLLLOCK="ScrlLck";
    Keyboard.KEYNAME_PAUSE="Pause";
    Keyboard.KEYNAME_SYSREQ="SysReq";
    Keyboard.KEYNAME_BREAK="Break";
    Keyboard.KEYNAME_RESET="Reset";
    Keyboard.KEYNAME_STOP="Stop";
    Keyboard.KEYNAME_MENU="Menu";
    Keyboard.KEYNAME_USER="User";
    Keyboard.KEYNAME_SYSTEM="Sys";
    Keyboard.KEYNAME_PRINT="Print";
    Keyboard.KEYNAME_CLEARLINE="ClrLn";
    Keyboard.KEYNAME_CLEARDISPLAY="ClrDsp";
    Keyboard.KEYNAME_INSERTLINE="InsLn";
    Keyboard.KEYNAME_DELETELINE="DelLn";
    Keyboard.KEYNAME_INSERTCHAR="InsChr";
    Keyboard.KEYNAME_DELETECHAR="DelChr";
    Keyboard.KEYNAME_PREV="Prev";
    Keyboard.KEYNAME_NEXT="Next";
    Keyboard.KEYNAME_SELECT="Select";
    Keyboard.KEYNAME_EXECUTE="Exec";
    Keyboard.KEYNAME_UNDO="Undo";
    Keyboard.KEYNAME_REDO="Redo";
    Keyboard.KEYNAME_FIND="Find";
    Keyboard.KEYNAME_HELP="Help";
    Keyboard.KEYNAME_MODESWITCH="ModeSw";
    Keyboard.NUMBER_0=48;
    Keyboard.NUMBER_1=49;
    Keyboard.NUMBER_2=50;
    Keyboard.NUMBER_3=51;
    Keyboard.NUMBER_4=52;
    Keyboard.NUMBER_5=53;
    Keyboard.NUMBER_6=54;
    Keyboard.NUMBER_7=55;
    Keyboard.NUMBER_8=56;
    Keyboard.NUMBER_9=57;
    Keyboard.A=65;
    Keyboard.B=66;
    Keyboard.C=67;
    Keyboard.D=68;
    Keyboard.E=69;
    Keyboard.F=70;
    Keyboard.G=71;
    Keyboard.H=72;
    Keyboard.I=73;
    Keyboard.J=74;
    Keyboard.K=75;
    Keyboard.L=76;
    Keyboard.M=77;
    Keyboard.N=78;
    Keyboard.O=79;
    Keyboard.P=80;
    Keyboard.Q=81;
    Keyboard.R=82;
    Keyboard.S=83;
    Keyboard.T=84;
    Keyboard.U=85;
    Keyboard.V=86;
    Keyboard.W=87;
    Keyboard.X=88;
    Keyboard.Y=89;
    Keyboard.Z=90;
    Keyboard.SEMICOLON=186;
    Keyboard.EQUAL=187;
    Keyboard.COMMA=188;
    Keyboard.MINUS=189;
    Keyboard.PERIOD=190;
    Keyboard.SLASH=191;
    Keyboard.BACKQUOTE=192;
    Keyboard.LEFTBRACKET=219;
    Keyboard.BACKSLASH=220;
    Keyboard.RIGHTBRACKET=221;
    Keyboard.QUOTE=222;
    Keyboard.ALTERNATE=18;
    Keyboard.BACKSPACE=8;
    Keyboard.CAPS_LOCK=20;
    Keyboard.COMMAND=15;
    Keyboard.CONTROL=17;
    Keyboard.DELETE=46;
    Keyboard.DOWN=40;
    Keyboard.END=35;
    Keyboard.ENTER=13;
    Keyboard.ESCAPE=27;
    Keyboard.F1=112;
    Keyboard.F2=113;
    Keyboard.F3=114;
    Keyboard.F4=115;
    Keyboard.F5=116;
    Keyboard.F6=117;
    Keyboard.F7=118;
    Keyboard.F8=119;
    Keyboard.F9=120;
    Keyboard.F10=121;
    Keyboard.F11=122;
    Keyboard.F12=123;
    Keyboard.F13=124;
    Keyboard.F14=125;
    Keyboard.F15=126;
    Keyboard.HOME=36;
    Keyboard.INSERT=45;
    Keyboard.LEFT=37;
    Keyboard.NUMPAD=21;
    Keyboard.NUMPAD_0=96;
    Keyboard.NUMPAD_1=97;
    Keyboard.NUMPAD_2=98;
    Keyboard.NUMPAD_3=99;
    Keyboard.NUMPAD_4=100;
    Keyboard.NUMPAD_5=101;
    Keyboard.NUMPAD_6=102;
    Keyboard.NUMPAD_7=103;
    Keyboard.NUMPAD_8=104;
    Keyboard.NUMPAD_9=105;
    Keyboard.NUMPAD_ADD=107;
    Keyboard.NUMPAD_DECIMAL=110;
    Keyboard.NUMPAD_DIVIDE=111;
    Keyboard.NUMPAD_ENTER=108;
    Keyboard.NUMPAD_MULTIPLY=106;
    Keyboard.NUMPAD_SUBTRACT=109;
    Keyboard.PAGE_DOWN=34;
    Keyboard.PAGE_UP=33;
    Keyboard.RIGHT=39;
    Keyboard.SHIFT=16;
    Keyboard.SPACE=32;
    Keyboard.TAB=9;
    Keyboard.UP=38;
    Keyboard.RED=16777216;
    Keyboard.GREEN=16777217;
    Keyboard.YELLOW=16777218;
    Keyboard.BLUE=16777219;
    Keyboard.CHANNEL_UP=16777220;
    Keyboard.CHANNEL_DOWN=16777221;
    Keyboard.RECORD=16777222;
    Keyboard.PLAY=16777223;
    Keyboard.PAUSE=16777224;
    Keyboard.STOP=16777225;
    Keyboard.FAST_FORWARD=16777226;
    Keyboard.REWIND=16777227;
    Keyboard.SKIP_FORWARD=16777228;
    Keyboard.SKIP_BACKWARD=16777229;
    Keyboard.NEXT=16777230;
    Keyboard.PREVIOUS=16777231;
    Keyboard.LIVE=16777232;
    Keyboard.LAST=16777233;
    Keyboard.MENU=16777234;
    Keyboard.INFO=16777235;
    Keyboard.GUIDE=16777236;
    Keyboard.EXIT=16777237;
    Keyboard.BACK=16777238;
    Keyboard.AUDIO=16777239;
    Keyboard.SUBTITLE=16777240;
    Keyboard.DVR=16777241;
    Keyboard.VOD=16777242;
    Keyboard.INPUT=16777243;
    Keyboard.SETUP=16777244;
    Keyboard.HELP=16777245;
    Keyboard.MASTER_SHELL=16777246;
    Keyboard.SEARCH=16777247;

    __static(Keyboard,[
        'CharCodeStrings',function(){return this.CharCodeStrings=[Keyboard.KEYNAME_UPARROW,Keyboard.KEYNAME_DOWNARROW,Keyboard.KEYNAME_LEFTARROW,Keyboard.KEYNAME_RIGHTARROW,Keyboard.KEYNAME_F1,Keyboard.KEYNAME_F2,Keyboard.KEYNAME_F3,
            Keyboard.KEYNAME_F4,Keyboard.KEYNAME_F5,Keyboard.KEYNAME_F6,Keyboard.KEYNAME_F7,Keyboard.KEYNAME_F8,Keyboard.KEYNAME_F9,Keyboard.KEYNAME_F10,Keyboard.KEYNAME_F11,
            Keyboard.KEYNAME_F12,Keyboard.KEYNAME_F13,Keyboard.KEYNAME_F14,Keyboard.KEYNAME_F15,Keyboard.KEYNAME_F16,Keyboard.KEYNAME_F17,Keyboard.KEYNAME_F18,Keyboard.KEYNAME_F19,
            Keyboard.KEYNAME_F20,Keyboard.KEYNAME_F21,Keyboard.KEYNAME_F22,Keyboard.KEYNAME_F23,Keyboard.KEYNAME_F24,Keyboard.KEYNAME_F25,Keyboard.KEYNAME_F26,Keyboard.KEYNAME_F27,
            Keyboard.KEYNAME_F28,Keyboard.KEYNAME_F29,Keyboard.KEYNAME_F30,Keyboard.KEYNAME_F31,Keyboard.KEYNAME_F32,Keyboard.KEYNAME_F33,Keyboard.KEYNAME_F34,Keyboard.KEYNAME_F35,
            Keyboard.KEYNAME_INSERT,Keyboard.KEYNAME_DELETE,Keyboard.KEYNAME_HOME,Keyboard.KEYNAME_BEGIN,Keyboard.KEYNAME_END,Keyboard.KEYNAME_PAGEUP,Keyboard.KEYNAME_PAGEDOWN,
            Keyboard.KEYNAME_PRINTSCREEN,Keyboard.KEYNAME_SCROLLLOCK,Keyboard.KEYNAME_PAUSE,Keyboard.KEYNAME_SYSREQ,Keyboard.KEYNAME_BREAK,Keyboard.KEYNAME_RESET,Keyboard.KEYNAME_STOP,
            Keyboard.KEYNAME_MENU,Keyboard.KEYNAME_USER,Keyboard.KEYNAME_SYSTEM,Keyboard.KEYNAME_PRINT,Keyboard.KEYNAME_CLEARLINE,Keyboard.KEYNAME_CLEARDISPLAY,Keyboard.KEYNAME_INSERTLINE,
            Keyboard.KEYNAME_DELETELINE,Keyboard.KEYNAME_INSERTCHAR,Keyboard.KEYNAME_DELETECHAR,Keyboard.KEYNAME_PREV,Keyboard.KEYNAME_NEXT,Keyboard.KEYNAME_SELECT,
            Keyboard.KEYNAME_EXECUTE,Keyboard.KEYNAME_UNDO,Keyboard.KEYNAME_REDO,Keyboard.KEYNAME_FIND,Keyboard.KEYNAME_HELP,Keyboard.KEYNAME_MODESWITCH];}
    ]);

    Keyboard.toString=function(){return "[class Keyboard]";};
    return Keyboard;
})();

var KeyboardType=(function() {
    function KeyboardType()
    {
    }

    __class(KeyboardType,'flash.ui.KeyboardType');

    KeyboardType.ALPHANUMERIC="alphanumeric";
    KeyboardType.KEYPAD="keypad";
    KeyboardType.NONE="none";

    KeyboardType.toString=function(){return "[class KeyboardType]";};
    return KeyboardType;
})();

var KeyLocation=(function() {
    function KeyLocation()
    {
    }

    __class(KeyLocation,'flash.ui.KeyLocation');

    KeyLocation.STANDARD=0;
    KeyLocation.LEFT=1;
    KeyLocation.RIGHT=2;
    KeyLocation.NUM_PAD=3;
    KeyLocation.D_PAD=4;

    KeyLocation.toString=function(){return "[class KeyLocation]";};
    return KeyLocation;
})();

var Mouse=(function() {
    function Mouse()
    {
    }

    __class(Mouse,'flash.ui.Mouse');

    __getset(1,Mouse,'supportsCursor',
        function()
        {
            return false;
        }
    );

    __getset(1,Mouse,'cursor',
        function()
        {
            return "";
        },
        function(value)
        {
        }
    );

    __getset(1,Mouse,'supportsNativeCursor',
        function()
        {
            return false;
        }
    );

    Mouse.hide=function()
    {
    }

    Mouse.show=function()
    {
    }

    Mouse.registerCursor=function(value,cursorData)
    {
    }

    Mouse.unregisterCursor=function(param1)
    {
    }

    Mouse.toString=function(){return "[class Mouse]";};
    return Mouse;
})();

var MouseCursor=(function() {
    function MouseCursor()
    {
    }

    __class(MouseCursor,'flash.ui.MouseCursor');

    MouseCursor.ARROW="arrow";
    MouseCursor.AUTO="auto";
    MouseCursor.BUTTON="button";
    MouseCursor.HAND="hand";
    MouseCursor.IBEAM="ibeam";

    MouseCursor.toString=function(){return "[class MouseCursor]";};
    return MouseCursor;
})();

var MouseCursorData=(function() {
    function MouseCursorData()
    {
    }

    __class(MouseCursorData,'flash.ui.MouseCursorData');
    var __proto=MouseCursorData.prototype;

    __getset(0,__proto,'data',
        function()
        {
            return null;
        },
        function(param1)
        {
        }
    );

    __getset(0,__proto,'hotSpot',
        function()
        {
            return null;
        },
        function(param1)
        {
        }
    );

    __getset(0,__proto,'frameRate',
        function()
        {
            return 0;
        },
        function(param1)
        {
        }
    );

    MouseCursorData.toString=function(){return "[class MouseCursorData]";};
    return MouseCursorData;
})();

var Multitouch=(function() {
    function Multitouch()
    {
    }

    __class(Multitouch,'flash.ui.Multitouch');

    __getset(1,Multitouch,'inputMode',
        function()
        {
            if (!Multitouch._$inputMode) {
                if (Multitouch.isSupportTouch) {
                    Multitouch._$inputMode=MultitouchInputMode.GESTURE;
                } else {
                    Multitouch._$inputMode=MultitouchInputMode.NONE;
                }
            }
            return Multitouch._$inputMode;
        },
        function(value)
        {
            if (value==MultitouchInputMode.GESTURE || value==MultitouchInputMode.TOUCH_POINT) {
                if (Multitouch.isSupportTouch) {
                    Multitouch._$inputMode=value;
                } else {
                    Multitouch._$inputMode=MultitouchInputMode.NONE;
                }
            } else {
                Multitouch._$inputMode=value;
            }
        }
    );

    __getset(1,Multitouch,'mapTouchToMouse',
        function()
        {
            Multitouch._$mapTouchToMouse=Multitouch.isSupportTouch;
            return Multitouch._$mapTouchToMouse;
        }
    );

    __getset(1,Multitouch,'maxTouchPoints',
        function()
        {
            Multitouch._$maxTouchPoints=3;
            return Multitouch._$maxTouchPoints;
        },
        function(value)
        {
            Multitouch._$maxTouchPoints=value;
        }
    );

    __getset(1,Multitouch,'supportedGestures',
        function()
        {
            Multitouch._$supportedGestures=[];
            if (Multitouch.isSupportTouch) {
                Multitouch._$supportedGestures.push(TransformGestureEvent.GESTURE_PAN);
                Multitouch._$supportedGestures.push(TransformGestureEvent.GESTURE_ROTATE);
                Multitouch._$supportedGestures.push(TransformGestureEvent.GESTURE_SWIPE);
                Multitouch._$supportedGestures.push(TransformGestureEvent.GESTURE_ZOOM);
                Multitouch._$supportedGestures.push(GestureEvent.GESTURE_TWO_FINGER_TAP);
            }
            return Multitouch._$supportedGestures;
        }
    );

    __getset(1,Multitouch,'supportsGestureEvents',
        function()
        {
            Multitouch._$supportsGestureEvents=Multitouch.isSupportTouch;
            return Multitouch._$supportsGestureEvents;
        }
    );

    __getset(1,Multitouch,'supportsTouchEvents',
        function()
        {
            Multitouch._$supportsTouchEvents=Multitouch.isSupportTouch;
            return Multitouch._$supportsTouchEvents;
        }
    );

    __getset(1,Multitouch,'isSupportTouch',
        function()
        {
            var isSupportTouch="ontouchend" in document ? true : false;
            return isSupportTouch;
        }
    );

    Multitouch._$inputMode=null;
    Multitouch._$mapTouchToMouse=false;
    Multitouch._$maxTouchPoints=0;
    Multitouch._$supportedGestures=null;
    Multitouch._$supportsGestureEvents=false;
    Multitouch._$supportsTouchEvents=false;

    Multitouch.toString=function(){return "[class Multitouch]";};
    return Multitouch;
})();

var MultitouchInputMode=(function() {
    function MultitouchInputMode()
    {
    }

    __class(MultitouchInputMode,'flash.ui.MultitouchInputMode');

    MultitouchInputMode.GESTURE="gesture";
    MultitouchInputMode.NONE="none";
    MultitouchInputMode.TOUCH_POINT="touchPoint";

    MultitouchInputMode.toString=function(){return "[class MultitouchInputMode]";};
    return MultitouchInputMode;
})();

var ByteArray=(function() {
    function ByteArray(ab)
    {
        this._position=0;
        this._$len=0;
        this._isLittle=false;
        this._strTable=[];
        this._objTable=[];
        this._traitsTable=[];
        (ab===void 0) && (ab=null);
        if (ab) {
            this._buf=ab;
            this._position=0;
            this._$len=this.data.byteLength;
        } else {
            this._init();
        }
        this.endian=Endian.BIG_ENDIAN;
    }

    __class(ByteArray,'flash.utils.ByteArray');
    var __proto=ByteArray.prototype;
    Mira.imps(__proto,{"flash.utils.IDataInput":true,"flash.utils.IDataOutput":true});

    __proto._init=function()
    {
        this._buf=new ArrayBuffer(0);
        this._position=this._$len=0;
    }

    __proto.readBytes=function(bytes,offset,length)
    {
        (offset===void 0) && (offset=0);
        (length===void 0) && (length=0);
        if (bytes) {
            if (length==0)
                length=this.bytesAvailable;
            else if (!this.validate(length))
                return;
            bytes.validateBuffer(length);
            bytes._$buffer.set(this._$buffer.subarray(this._position,this._position+length),offset);
            this._position+=length;
        }
    }

    __proto.writeBytes=function(bytes,offset,length)
    {
        (offset===void 0) && (offset=0);
        (length===void 0) && (length=0);
        if (offset<0 || length<0)
            return;
        if (length==0)
            length=bytes.length-offset;
        else
            length=uint(Math.min(bytes.length-offset,length));
        if (length>0) {
            this.validateBuffer(length);
            var src=new Uint8Array(bytes._buf);
            this._$buffer.set(src.subarray(offset,offset+length),this._position);
            this._position+=length;
        }
    }

    __proto.writeBoolean=function(value)
    {
        this.validateBuffer(1);
        this.data.setUint8(this._position++,value ? 1 : 0);
    }

    __proto.writeByte=function(value)
    {
        this.validateBuffer(1);
        this.data.setInt8(this._position++,value);
    }

    __proto.writeShort=function(value)
    {
        this.validateBuffer(2);
        this.data.setInt16(this._position,value,this._isLittle);
        this._position+=2;
    }

    __proto.writeInt=function(value)
    {
        this.validateBuffer(4);
        this.data.setInt32(this._position,value,this._isLittle);
        this._position+=4;
    }

    __proto.writeUnsignedInt=function(value)
    {
        this.validateBuffer(4);
        this.data.setUint32(this._position,value,this._isLittle);
        this._position+=4;
    }

    __proto.writeFloat=function(value)
    {
        this.validateBuffer(4);
        this.data.setFloat32(this._position,value,this._isLittle);
        this._position+=4;
    }

    __proto.writeDouble=function(value)
    {
        this.validateBuffer(8);
        this.data.setFloat64(this._position,value,this._isLittle);
        this._position+=8;
    }

    __proto.writeMultiByte=function(value,charSet)
    {
        value=value+"";
        if (charSet=="UNICODE" || charSet=="unicode") {
            return this.writeUnicode(value);
        }
        this.writeUTFBytes(value);
    }

    __proto.writeUnicode=function(value)
    {
        value=value+"";
        this.ensureWrite(this._position+value.length*2);
        var c=0;
        for (var i=0,sz=value.length;i<sz;i++) {
            c=value.charCodeAt(i)|0;
            this.data[this._position++]=c&0xff;
            this.data[this._position++]=c>>8;
        }
    }

    __proto.ensureWrite=function(lengthToEnsure)
    {
        if (this.length<lengthToEnsure)
            this.length=lengthToEnsure;
    }

    __proto.writeUTF=function(value)
    {
        var pos=this._position;
        this.writeShort(0);
        this.writeUTF8(value);
        this.data.setInt16(pos,this._position-pos-2,this._isLittle);
    }

    __proto.writeUTFBytes=function(value)
    {
        this.writeUTF8(value);
    }

    __proto.readBoolean=function()
    {
        if (!this.validate(1))
            return false;
        return this.data.getUint8(this._position++)!=0;
    }

    __proto.readByte=function()
    {
        if (!this.validate(1))
            return 0;
        return this.data.getInt8(this._position++);
    }

    __proto.get=function(pos)
    {
        if (pos>=0 && pos<this._$len)
            return this.data.getUint8(pos);
        return 0;
    }

    __proto.set=function(pos,value)
    {
        if (pos>=0 && pos<this._$len)
            this.data.setUint8(pos,value);
    }

    __proto.readUnsignedByte=function()
    {
        if (!this.validate(1))
            return 0;
        return this.data.getUint8(this._position++);
    }

    __proto.readShort=function()
    {
        if (!this.validate(2))
            return 0;
        var value=this.data.getInt16(this._position,this._isLittle);
        this._position+=2;
        return value;
    }

    __proto.readUnsignedShort=function()
    {
        if (!this.validate(2))
            return 0;
        var value=this.data.getUint16(this._position,this._isLittle);
        this._position+=2;
        return value;
    }

    __proto.readInt=function()
    {
        if (!this.validate(4))
            return 0;
        var value=this.data.getInt32(this._position,this._isLittle);
        this._position+=4;
        return value;
    }

    __proto.readUnsignedInt=function()
    {
        if (!this.validate(4))
            return 0;
        var value=this.data.getUint32(this._position,this._isLittle);
        this._position+=4;
        return value;
    }

    __proto.readFloat=function()
    {
        if (!this.validate(4))
            return 0;
        var value=this.data.getFloat32(this._position,this._isLittle);
        this._position+=4;
        return value;
    }

    __proto.readDouble=function()
    {
        if (!this.validate(8))
            return 0;
        var value=this.data.getFloat64(this._position,this._isLittle);
        this._position+=8;
        return value;
    }

    __proto.readMultiByte=function(length,charSet)
    {
        if (charSet=="UNICODE" || charSet=="unicode") {
            return this.readUnicode(length);
        }
        return this.readUTFBytes(length);
    }

    __proto.readUnicode=function(length)
    {
        var value="";
        var max=this._position+length;
        var c1=0,c2=0;
        while (this._position<max) {
            c2=this.data[this._position++]|0;
            c1=this.data[this._position++]|0;
            value+=String.fromCharCode(c1<<8|c2);
        }
        return value;
    }

    __proto.readUTF=function()
    {
        if (!this.validate(2))
            return null;
        var length=this.data.getUint16(this._position,this._isLittle);
        this._position+=2;
        if (length>0)
            return this.readUTFBytes(length);
        return '';
    }

    __proto.readUTFBytes=function(length)
    {
        if (!this.validate(length))
            return null;
        return this.readUTF8(length);
    }

    __proto.writeObject=function(object)
    {
        this._strTable=[];
        this._objTable=[];
        this._traitsTable=[];
        this.writeObject2(object);
    }

    __proto.readObject=function()
    {
        this._strTable=[];
        this._objTable=[];
        this._traitsTable=[];
        return this.readObject2();
    }

    __proto.deflate=function()
    {
    }

    __proto.compress=function(algorithm)
    {
        (algorithm===void 0) && (algorithm="zlib");
        var deflate=new Deflate(this._$buffer);
        this._$buffer=deflate.compress();
        this.data=new DataView(this._$buffer.buffer);
        this._position=this._$len=this._$buffer.byteLength|0;
    }

    __proto.inflate=function()
    {
    }

    __proto.uncompress=function(algorithm)
    {
        (algorithm===void 0) && (algorithm="zlib");
        var inflate=new Inflate(this._$buffer);
        this._$buffer=inflate.decompress();
        this.data=new DataView(this._$buffer.buffer);
        this._$len=this._$buffer.byteLength|0;
        this._position=0;
    }

    __proto.toString=function()
    {
        var pos=this._position;
        this._position=0;
        var value=this.readUTFBytes(this._$len);
        this._position=pos;
        return value;
    }

    __proto.clear=function()
    {
        this._init();
    }

    __proto.toJSON=function(k)
    {
        return "ByteArray";
    }

    __proto.atomicCompareAndSwapIntAt=function(byteIndex,expectedValue,newValue)
    {
        return 0;
    }

    __proto.atomicCompareAndSwapLength=function(expectedLength,newLength)
    {
        return 0;
    }

    __proto.validateBuffer=function(len,needReplace)
    {
        (needReplace===void 0) && (needReplace=false);
        len+=this._position;
        if (this.data.byteLength<len || needReplace) {
            var capacity=this.data.byteLength;
            if (capacity<16)
                capacity=16;
            while (capacity<len)
                capacity<<=1;
            if (needReplace) {
                if (len<1) {
                    this.clear();
                    return;
                }
                while (capacity>=len*2)
                    capacity>>=1;
            }
            var tmp=new Uint8Array(new ArrayBuffer(capacity));
            var length=Math.min(this._$len,len)|0;
            tmp.set(new Uint8Array(this.data.buffer,0,length));
            this._buf=tmp.buffer;
            if (needReplace)
                this._$len=len;
        }
        if (len>this._$len)
            this._$len=len;
    }

    __proto.validate=function(len)
    {
        if (this._position+len<=this._$len)
            return true;
        return false;
    }

    __proto.readUTF8=function(length)
    {
        var pos=this._position;
        var end=pos+length;
        var ret='';
        while (pos<end) {
            var c=this.data.getUint8(pos++);
            var c2=0,c3=0,c4=0;
            if (c>=0xf0) {
                c2=this.data.getUint8(pos++);
                c3=this.data.getUint8(pos++);
                c4=this.data.getUint8(pos++);
                c=((c<<18)&0x1c0000)|((c2<<12)&0x3f000)|((c3<<6)&0xfc0)|(c4&0x3f);
            } else if (c>=0xe0) {
                c2=this.data.getUint8(pos++);
                c3=this.data.getUint8(pos++);
                c=((c<<12)&0xf000)|((c2<<6)&0xfc0)|(c3&0x3f);
            } else if (c>=0xc0) {
                c2=this.data.getUint8(pos++);
                c=((c<<6)&0x7c0)|(c2&0x3f);
            }
            if (c<0x10000) {
                ret+=String.fromCharCode(c);
            } else {
                c-=0x10000;
                ret+=String.fromCharCode(((c>>10)&0x3ff)+0xd800)+String.fromCharCode((c&0x3ff)+0xdc00);
            }
        }
        this._position=end;
        return ret;
    }

    __proto.writeUTF8=function(str)
    {
        var pos=0;
        var len=str.length;
        while (pos<len) {
            var c=uint(str.charCodeAt(pos++));
            if (c<0x80) {
                this.writeByte(c);
            } else if (c<0x800) {
                this.writeByte(0xc0|((c>>6)&0x1f));
                this.writeByte(0x80|(c&0x3f));
            } else if (c<0xd800 || c>=0xe000) {
                this.writeByte(0xe0|((c>>12)&0x0f));
                this.writeByte(0x80|((c>>6)&0x3f));
                this.writeByte(0x80|(c&0x3f));
            } else if (c<0xdc00) {
                var c2=str.charCodeAt(pos++);
                if (c2>=0xdc00 && c2<0xe000) {
                    c=uint(((c-0xd800)<<10)+(c2-0xdC00)+0x10000);
                    this.writeByte(0xf0|((c>>18)&0x07));
                    this.writeByte(0x80|((c>>12)&0x3f));
                    this.writeByte(0x80|((c>>6)&0x3f));
                    this.writeByte(0x80|(c&0x3f));
                } else {
                    this.writeByte(0xef);
                    this.writeByte(0xbf);
                    this.writeByte(0xbd);
                }
            } else {
                this.writeByte(0xef);
                this.writeByte(0xbf);
                this.writeByte(0xbd);
            }
        }
    }

    __proto._$copyArrayBuffer=function(arraybuffer,toPosition)
    {
        (toPosition===void 0) && (toPosition=0);
        this.validateBuffer(toPosition+arraybuffer.byteLength-this._position|0);
        var srcArray=new Uint8Array(arraybuffer);
        this._$buffer.set(srcArray,toPosition);
    }

    __proto.readObject2=function()
    {
        var type=this.readByte();
        return this.readObjectValue(type);
    }

    __proto.readObjectValue=function(type)
    {
        var value;
        switch (type) {
        case ByteArray.NULL_TYPE:
            break;
        case ByteArray.STRING_TYPE:
            value=this.__readString();
            break;
        case ByteArray.INTEGER_TYPE:
            value=this.readInterger();
            break;
        case ByteArray.FALSE_TYPE:
            value=false;
            break;
        case ByteArray.TRUE_TYPE:
            value=true;
            break;
        case ByteArray.OBJECT_TYPE:
            value=this.readScriptObject();
            break;
        case ByteArray.ARRAY_TYPE:
            value=this.readArray();
            break;
        case ByteArray.DOUBLE_TYPE:
            value=this.readDouble();
            break;
        case ByteArray.BYTEARRAY_TYPE:
            value=this.readByteArray();
            break;
        case ByteArray.DICTIONARY_TYPE:
            value=this.readDictionary();
            break;
        default:
            trace("Unknown object type tag!!!"+type);
        }
        return value;
    }

    __proto.readDictionary=function()
    {
        var ref=this.readUInt29();
        if ((ref&1)==0) {
            return __as(this.getObjRef(ref>>1),MsDict);
        }
        var len=ref>>1;
        var weakKeys=this.readBoolean();
        var obj=new MsDict(weakKeys);
        this._objTable.push(obj);
        for (var c=0;c<len;c++) {
            var key=this.readObject2();
            var value=this.readObject2();
            obj.set(key,value);
        }
        return obj;
    }

    __proto.readByteArray=function()
    {
        var ref=this.readUInt29();
        if ((ref&1)==0) {
            return __as(this.getObjRef(ref>>1),ByteArray);
        } else {
            var len=(ref>>1);
            var ba=new ByteArray();
            this._objTable.push(ba);
            this.readBytes(ba,0,len);
            return ba;
        }
    }

    __proto.readInterger=function()
    {
        var i=this.readUInt29();
        i=(i<<3)>>3;
        return int(i);
    }

    __proto.getStrRef=function(ref)
    {
        return __string(this._strTable[ref]);
    }

    __proto.getObjRef=function(ref)
    {
        return this._objTable[ref];
    }

    __proto.__readString=function()
    {
        var ref=this.readUInt29();
        if ((ref&1)==0) {
            return this.getStrRef(ref>>1);
        }
        var len=(ref>>1);
        if (0==len) {
            return ByteArray.EMPTY_STRING;
        }
        var str=this.readUTFBytes(len);
        this._strTable.push(str);
        return str;
    }

    __proto.readTraits=function(ref)
    {
        var ti;
        if ((ref&3)==1) {
            ti=this.getTraitReference(ref>>2);
            return ti.propoties ? ti : {obj: {}};
        } else {
            var externalizable=((ref&4)==4);
            var isDynamic=((ref&8)==8);
            var count=(ref>>4);
            var className=this.__readString();
            ti={};
            ti.className=className;
            ti.propoties=[];
            ti.dynamic=isDynamic;
            ti.externalizable=externalizable;
            if (count>0) {
                for (var i=0;i<count;i++) {
                    var propName=this.__readString();
                    ti.propoties.push(propName);
                }
            }
            this._traitsTable.push(ti);
            return ti;
        }
    }

    __proto.readScriptObject=function()
    {
        var ref=this.readUInt29();
        if ((ref&1)==0) {
            return this.getObjRef(ref>>1);
        } else {
            var objref=this.readTraits(ref);
            var className=__string(objref.className);
            var externalizable=objref.externalizable;
            var obj;
            var propName;
            var pros=objref.propoties;
            if (className && className!="") {
                var rst=getClassByAlias(className);
                if (!rst) {
                    rst=getDefinitionByName(className);
                }
                if (rst) {
                    obj=new rst();
                } else {
                    obj={};
                }
            } else {
                obj={};
            }
            this._objTable.push(obj);
            if (pros) {
                for (var d=0;d<pros.length;d++) {
                    obj[pros[d]]=this.readObject2();
                }
            }
            if (objref.dynamic) {
                for (;;) {
                    propName=this.__readString();
                    if (propName==null || propName.length==0)
                        break;
                    obj[propName]=this.readObject2();
                }
            }
            return obj;
        }
    }

    __proto.readArray=function()
    {
        var ref=this.readUInt29();
        if ((ref&1)==0) {
            return this.getObjRef(ref>>1);
        }
        var obj=null;
        var count=(ref>>1);
        var propName;
        for (;;) {
            propName=this.__readString();
            if (propName==null || propName.length==0)
                break;
            if (obj==null) {
                obj={};
            }
            obj[propName]=this.readObject2();
        }
        if (obj==null) {
            obj=[];
            var i=0;
            for (i=0;i<count;i++) {
                obj.push(this.readObject2());
            }
        } else {
            for (i=0;i<count;i++) {
                obj[i.toString()]=this.readObject2();
            }
        }
        this._objTable.push(obj);
        return obj;
    }

    __proto.readUInt29=function()
    {
        var value=0;
        var b=this.readByte()&0xFF;
        if (b<128) {
            return b;
        }
        value=(b&0x7F)<<7;
        b=this.readByte()&0xFF;
        if (b<128) {
            return (value|b);
        }
        value=(value|(b&0x7F))<<7;
        b=this.readByte()&0xFF;
        if (b<128) {
            return (value|b);
        }
        value=(value|(b&0x7F))<<8;
        b=this.readByte()&0xFF;
        return (value|b);
    }

    __proto.writeObject2=function(o)
    {
        if (o==null) {
            this.writeAMFNull();
            return;
        }
        var type=typeof (o);
        if ("string"===type) {
            this.writeAMFString(__string(o));
        } else if ("boolean"===type) {
            this.writeAMFBoolean(o);
        } else if ("number"===type) {
            if (String(o).indexOf(".")!= -1) {
                this.writeAMFDouble(o);
            } else {
                this.writeAMFInt(o|0);
            }
        } else if ("object"===type) {
            if (o instanceof Array) {
                this.writeArray(o);
            } else if (o instanceof ByteArray) {
                this.writeAMFByteArray(o);
            } else if (o instanceof MsDict) {
                this.writeDictionary(o);
            } else {
                this.writeCustomObject(o);
            }
        }
    }

    __proto.writeDictionary=function(obj)
    {
        var ref=this._objTable.indexOf(obj);
        this.writeByte(ByteArray.DICTIONARY_TYPE);
        if (ref>=0) {
            this.writeByte(ref<<1);
            return;
        }
        this._objTable.push(obj);
        this.writeByte((obj._$getSize()<<1)|1);
        this.writeBoolean(obj._$isUsingWeakKeys());
        for (var c=0;c<obj._$getSize();c++) {
            this.writeObject2(obj._$keyAt(c));
            this.writeObject2(obj._$valueAt(c));
        }
    }

    __proto.writeAMFNull=function()
    {
        this.writeByte(ByteArray.NULL_TYPE);
    }

    __proto.writeAMFString=function(s)
    {
        this.writeByte(ByteArray.STRING_TYPE);
        this.writeStringWithoutType(s);
    }

    __proto.writeStringWithoutType=function(s)
    {
        if (s.length==0) {
            this.writeUInt29(1);
            return;
        }
        var ref=this._strTable.indexOf(s);
        if (ref>=0) {
            this.writeUInt29(ref<<1);
        } else {
            var utflen=this._getUTFBytesCount(s);
            this.writeUInt29((utflen<<1)|1);
            this.writeUTFBytes(s);
            this._strTable.push(s);
        }
    }

    __proto.writeAMFInt=function(i)
    {
        if (i>=ByteArray.INT28_MIN_VALUE && i<=ByteArray.INT28_MAX_VALUE) {
            i=i&ByteArray.UINT29_MASK;
            this.writeByte(ByteArray.INTEGER_TYPE);
            this.writeUInt29(i);
        } else {
            this.writeAMFDouble(i);
        }
    }

    __proto.writeAMFDouble=function(d)
    {
        this.writeByte(ByteArray.DOUBLE_TYPE);
        this.writeDouble(d);
    }

    __proto.writeAMFBoolean=function(b)
    {
        if (b)
            this.writeByte(ByteArray.TRUE_TYPE);
        else
            this.writeByte(ByteArray.FALSE_TYPE);
    }

    __proto.writeCustomObject=function(o)
    {
        this.writeByte(ByteArray.OBJECT_TYPE);
        var refNum=this._objTable.indexOf(o);
        if (refNum!= -1) {
            this.writeUInt29(refNum<<1);
        } else {
            this._objTable.push(o);
            var traitsInfo=new Object();
            traitsInfo.className=this.getNameByObj(o);
            traitsInfo.dynamic=false;
            traitsInfo.externalizable=false;
            traitsInfo.properties=[];
            for (var prop in o) {
                if (__isFunction(o[prop]))
                    continue;
                traitsInfo.properties.push(prop);
            }
            var tRef=ByteArray.getTraitsInfoRef(this._traitsTable,traitsInfo);
            var count=traitsInfo.properties.length|0;
            var i=0;
            if (tRef>=0) {
                this.writeUInt29((tRef<<2)|1);
            } else {
                this._traitsTable.push(traitsInfo);
                this.writeUInt29(3|(traitsInfo.externalizable ? 4 : 0)|(traitsInfo.dynamic ? 8 : 0)|(count<<4));
                this.writeStringWithoutType(__string(traitsInfo.className));
                for (i=0;i<count;i++) {
                    this.writeStringWithoutType(__string(traitsInfo.properties[i]));
                }
            }
            for (i=0;i<count;i++) {
                this.writeObject2(o[traitsInfo.properties[i]]);
            }
        }
    }

    __proto.getNameByObj=function(obj)
    {
        var tClassName=getQualifiedClassName(obj);
        if (tClassName==null || tClassName=="")
            return "";
        var tClass=__as(getDefinitionByName(tClassName),Class);
        if (tClass==null)
            return "";
        var tkey;
        for (tkey in classDic) {
            if (classDic[tkey]==tClass) {
                return tkey;
            }
        }
        return tClassName;
    }

    __proto.writeArray=function(value)
    {
        this.writeByte(ByteArray.ARRAY_TYPE);
        var len=value.length;
        var ref=this._objTable.indexOf(value);
        if (ref> -1) {
            this.writeUInt29(len<<1);
        } else {
            this.writeUInt29((len<<1)|1);
            this.writeStringWithoutType(ByteArray.EMPTY_STRING);
            for (var i=0;i<len;i++) {
                this.writeObject2(value[i]);
            }
            this._objTable.push(value);
        }
    }

    __proto.writeAMFByteArray=function(ba)
    {
        this.writeByte(ByteArray.BYTEARRAY_TYPE);
        var ref=this._objTable.indexOf(ba);
        if (ref>=0) {
            this.writeUInt29(ref<<1);
        } else {
            var len=ba.length;
            this.writeUInt29((len<<1)|1);
            this.writeBytes(ba,0,len);
        }
    }

    __proto.writeMapAsECMAArray=function(o)
    {
        this.writeByte(ByteArray.ARRAY_TYPE);
        this.writeUInt29((0<<1)|1);
        var count=0,key;
        for (key in o) {
            count++;
            this.writeStringWithoutType(key);
            this.writeObject2(o[key]);
        }
        this.writeStringWithoutType(ByteArray.EMPTY_STRING);
    }

    __proto.writeUInt29=function(ref)
    {
        if (ref<0x80) {
            this.writeByte(ref);
        } else if (ref<0x4000) {
            this.writeByte(((ref>>7)&0x7F)|0x80);
            this.writeByte(ref&0x7F);
        } else if (ref<0x200000) {
            this.writeByte(((ref>>14)&0x7F)|0x80);
            this.writeByte(((ref>>7)&0x7F)|0x80);
            this.writeByte(ref&0x7F);
        } else if (ref<0x40000000) {
            this.writeByte(((ref>>22)&0x7F)|0x80);
            this.writeByte(((ref>>15)&0x7F)|0x80);
            this.writeByte(((ref>>8)&0x7F)|0x80);
            this.writeByte(ref&0xFF);
        } else {
            trace("Integer out of range: "+ref);
        }
    }

    __proto.getTraitReference=function(ref)
    {
        return this._traitsTable[ref];
    }

    __proto._getUTFBytesCount=function(value)
    {
        var count=0;
        value=value+"";
        for (var i=0,sz=value.length;i<sz;i++) {
            var c=value.charCodeAt(i)|0;
            if (c<=0x7F) {
                count+=1;
            } else if (c<=0x7FF) {
                count+=2;
            } else if (c<=0xFFFF) {
                count+=3;
            } else {
                count+=4;
            }
        }
        return count;
    }

    __proto.writeArrayBuffer=function(arraybuffer,offset,length)
    {
        (offset===void 0) && (offset=0);
        (length===void 0) && (length=0);
        if (offset<0 || length<0)
            throw "writeArrayBuffer error - Out of bounds";
        if (length==0)
            length=uint(arraybuffer.byteLength-offset);
        this.validateBuffer(length);
        var uint8array=new Uint8Array(arraybuffer);
        this._$buffer.set(uint8array.subarray(offset,offset+length),this._position);
        this._position+=length;
    }

    __getset(0,__proto,'_buf',
        function()
        {
            return this.data.buffer;
        },
        function(value)
        {
            this.data=new DataView(value);
            this._$buffer=new Uint8Array(value);
        }
    );

    __getset(0,__proto,'length',
        function()
        {
            return this._$len;
        },
        function(value)
        {
            if (value==int.MAX_VALUE || value==int.MIN_VALUE) {
                throw new Error("系统内存不足。");
                return;
            }
            this.validateBuffer(value-this._position,true);
        }
    );

    __getset(0,__proto,'bytesAvailable',
        function()
        {
            return this._$len-this._position;
        }
    );

    __getset(0,__proto,'position',
        function()
        {
            return this._position;
        },
        function(offset)
        {
            if (this._position<offset) {
                if (!this.validate(offset-this._position)) {
                    return;
                }
            }
            this._position=offset;
        }
    );

    __getset(0,__proto,'objectEncoding',
        function()
        {
            return 3;
        },
        function(version)
        {
        }
    );

    __getset(0,__proto,'endian',
        function()
        {
            return this._endian;
        },
        function(type)
        {
            this._endian=type;
            this._isLittle=type==Endian.LITTLE_ENDIAN;
        }
    );

    __getset(0,__proto,'shareable',
        function()
        {
            return false;
        },
        function(newValue)
        {
        }
    );

    __getset(1,ByteArray,'defaultObjectEncoding',
        function()
        {
            return 3;
        },
        function(version)
        {
        }
    );

    ByteArray.getTraitsInfoRef=function(arr,ti)
    {
        var i=0,len=arr.length;
        for (i=0;i<len;i++) {
            if (ByteArray.equalsTraitsInfo(ti,arr[i]))
                return i;
        }
        return  -1;
    }

    ByteArray.equalsTraitsInfo=function(ti1,ti2)
    {
        if (ti1==ti2) {
            return true;
        }
        if (!ti1.className===ti2.className) {
            return false;
        }
        if (ti1.properties.length!=ti2.properties.length) {
            return false;
        }
        var len=ti1.properties.length|0;
        var prop;
        ti1.properties.sort();
        ti2.properties.sort();
        for (var i=0;i<len;i++) {
            if (ti1.properties[i]!=ti2.properties[i]) {
                return false;
            }
        }
        return true;
    }

    ByteArray.UNDEFINED_TYPE=0;
    ByteArray.NULL_TYPE=1;
    ByteArray.FALSE_TYPE=2;
    ByteArray.TRUE_TYPE=3;
    ByteArray.INTEGER_TYPE=4;
    ByteArray.DOUBLE_TYPE=5;
    ByteArray.STRING_TYPE=6;
    ByteArray.XML_TYPE=7;
    ByteArray.DATE_TYPE=8;
    ByteArray.ARRAY_TYPE=9;
    ByteArray.OBJECT_TYPE=10;
    ByteArray.AVMPLUSXML_TYPE=11;
    ByteArray.BYTEARRAY_TYPE=12;
    ByteArray.DICTIONARY_TYPE=17;
    ByteArray.EMPTY_STRING="";
    ByteArray.UINT29_MASK=0x1FFFFFFF;
    ByteArray.INT28_MAX_VALUE=0x0FFFFFFF;
    ByteArray.INT28_MIN_VALUE= -268435456;

    ByteArray.toString=function(){return "[class ByteArray]";};
    Mira.un_proto(ByteArray);
    return ByteArray;
})();

var describeType=function(value)
{
    var name=getQualifiedClassName(value);
    while (name.indexOf('.')!= -1) {
        name=name.replace('.','');
    }
    name='dst'+name.replace('::','_');
    var f=getDefinitionByName('DescribeTypeClass')[name];
    return new XML(f());
}

var Dictionary=(function() {
    function Dictionary(weakKeys)
    {
        (weakKeys===void 0) && (weakKeys=false);
    }

    __class(Dictionary,'flash.utils.Dictionary');
    var __proto=Dictionary.prototype;

    __proto.toJSON=function(k)
    {
        return "Dictionary";
    }

    Dictionary.toString=function(){return "[class Dictionary]";};
    Mira.un_proto(Dictionary);
    return Dictionary;
})();

var Endian=(function() {
    function Endian()
    {
    }

    __class(Endian,'flash.utils.Endian');

    Endian.BIG_ENDIAN="bigEndian";
    Endian.LITTLE_ENDIAN="littleEndian";

    Endian.toString=function(){return "[class Endian]";};
    return Endian;
})();

var escapeMultiByte=function(source)
{
    return encodeURIComponent(source).replace('_','%5F').replace('.','%2E');
}

var flash_proxy=null;

var getAliasName=function(param1)
{
    return "";
}

var getQualifiedSuperclassName=function(value)
{
    trace('-- NATIVE getQualifiedSuperclassName');
}

var getTimer=function()
{
    return uint((Date.now()-Timer.__STARTTIME__)*Timer.__SPEED__);
}

var Log=(function() {
    function Log()
    {
    }

    __class(Log,'flash.utils.Log');

    Log.log=function(str)
    {
        if (Log.isLog)
            trace("[Log]:"+str);
    }

    Log.error=function(str)
    {
        if (!Log.isError)
            trace("[error]:"+str);
    }

    Log.warming=function(str)
    {
        if (!Log.isWarMing)
            trace("[warming]:"+str);
    }

    Log.unfinished=function(className,functionName)
    {
        if (Log.isOpen)
            trace("[unfinished]:"+className+"--"+functionName);
    }

    Log.isOpen=false;
    Log.isLog=false;
    Log.isWarMing=false;
    Log.isError=false;

    Log.toString=function(){return "[class Log]";};
    return Log;
})();

var Proxy=(function() {
    function Proxy()
    {
    }

    __class(Proxy,'flash.utils.Proxy');
    var __proto=Proxy.prototype;

    __proto.getProperty=function(name)
    {
        Error.throwError(IllegalOperationError,2088);
        return null;
    }

    __proto.setProperty=function(name,value)
    {
        Error.throwError(IllegalOperationError,2089);
    }

    __proto.callProperty=function(name)
    {
        var rest=[];for(var $a=1,$b=arguments.length;$a<$b;++$a)rest.push(arguments[$a]);
        Error.throwError(IllegalOperationError,2090);
        return null;
    }

    __proto.hasProperty=function(name)
    {
        Error.throwError(IllegalOperationError,2091);
        return false;
    }

    __proto.deleteProperty=function(name)
    {
        Error.throwError(IllegalOperationError,2092);
        return false;
    }

    __proto.getDescendants=function(name)
    {
        Error.throwError(IllegalOperationError,2093);
        return false;
    }

    __proto.nextNameIndex=function(index)
    {
        Error.throwError(IllegalOperationError,2105);
        return 0;
    }

    __proto.nextName=function(index)
    {
        Error.throwError(IllegalOperationError,2106);
        return null;
    }

    __proto.nextValue=function(index)
    {
        Error.throwError(IllegalOperationError,2107);
        return null;
    }

    __proto.isAttribute=function(param1)
    {
        return false;
    }

    Proxy.toString=function(){return "[class Proxy]";};
    Mira.un_proto(Proxy);
    return Proxy;
})();

var TextureManager=(function() {
    function TextureManager()
    {
        this._textureDic={};
    }

    __class(TextureManager,'flash.utils.TextureManager');
    var __proto=TextureManager.prototype;

    __proto.getTexture=function(textureUrl)
    {
        return this._textureDic[textureUrl];
    }

    __proto.addTexture=function(textureUrl,data)
    {
        this._textureDic[textureUrl]=data;
    }

    TextureManager.getInstance=function()
    {
        if (!TextureManager._instance)
            TextureManager._instance=new TextureManager();
        return TextureManager._instance;
    }

    TextureManager._instance=null;

    TextureManager.toString=function(){return "[class TextureManager]";};
    Mira.un_proto(TextureManager);
    return TextureManager;
})();

var Timer=(function(_super) {
    function Timer(delay,repeatCount)
    {
        this._repeatCount=0;
        this._running=false;
        Timer.__super.call(this);
        (repeatCount===void 0) && (repeatCount=0);
        this.delay=delay;
        this.repeatCount=repeatCount;
        this._running=false;
    }

    __class(Timer,'flash.utils.Timer',_super);
    var __proto=Timer.prototype;

    __proto._ontimer_=function(tm,m,obj)
    {
        this._$dispatchEvent(new TimerEvent(TimerEvent.TIMER));
        if (this.currentCount>=this.repeatCount && this._running==true) {
            if (this.repeatCount!=0) {
                this._running=false;
                this._$dispatchEvent(new TimerEvent(TimerEvent.TIMER_COMPLETE));
            }
        }
    }

    __proto.reset=function()
    {
        if (this._timeobj!=null) {
            if (this._timeobj.runCount<(this.repeatCount-1)) {
                this._timeobj.runCount=0;
            }
            this.stop();
        }
    }

    __proto.start=function()
    {
        this.stop();
        this._timeobj=this._timeobj || TimerCtrl.__DEFAULT__.addTimer(this,__bind(this._ontimer_,this),this.delay,this.repeatCount);
        this._running=true;
    }

    __proto.stop=function()
    {
        if (this._timeobj!=null) {
            this._timeobj.deleted=true;
            this._timeobj=null;
        }
        this._running=false;
    }

    __getset(0,__proto,'currentCount',
        function()
        {
            if (this._timeobj!=null)
                return this._timeobj.runCount+1|0;
            return 0;
        }
    );

    __getset(0,__proto,'delay',
        function()
        {
            return this._delay;
        },
        function(value)
        {
            if (value<0) {
                throw new Error("指定的定时器延时超出范围");
            }
            if (value<16) {
                value=16;
            }
            this._delay=value;
            this._timeobj && (this._timeobj.delay=value);
        }
    );

    __getset(0,__proto,'repeatCount',
        function()
        {
            return this._repeatCount;
        },
        function(value)
        {
            this._repeatCount=value;
        }
    );

    __getset(0,__proto,'running',
        function()
        {
            return this._running;
        }
    );

    Timer.__STARTTIME__=0;
    Timer.__SPEED__=1;

    Timer.toString=function(){return "[class Timer]";};
    Mira.un_proto(Timer);
    return Timer;
})(EventDispatcher);

;
/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function() {'use strict';var m=this;function q(c,d){var a=c.split("."),b=m;!(a[0]in b)&&b.execScript&&b.execScript("var "+a[0]);for(var e;a.length&&(e=a.shift());)!a.length&&void 0!==d?b[e]=d:b=b[e]?b[e]:b[e]={}};var s="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array&&"undefined"!==typeof DataView;function t(c){var d=c.length,a=0,b=Number.POSITIVE_INFINITY,e,f,g,h,k,l,p,n,r,K;for(n=0;n<d;++n)c[n]>a&&(a=c[n]),c[n]<b&&(b=c[n]);e=1<<a;f=new (s?Uint32Array:Array)(e);g=1;h=0;for(k=2;g<=a;){for(n=0;n<d;++n)if(c[n]===g){l=0;p=h;for(r=0;r<g;++r)l=l<<1|p&1,p>>=1;K=g<<16|n;for(r=l;r<e;r+=k)f[r]=K;++h}++g;h<<=1;k<<=1}return[f,a,b]};function u(c,d){this.g=[];this.h=32768;this.d=this.f=this.a=this.l=0;this.input=s?new Uint8Array(c):c;this.m=!1;this.i=v;this.s=!1;if(d||!(d={}))d.index&&(this.a=d.index),d.bufferSize&&(this.h=d.bufferSize),d.bufferType&&(this.i=d.bufferType),d.resize&&(this.s=d.resize);switch(this.i){case w:this.b=32768;this.c=new (s?Uint8Array:Array)(32768+this.h+258);break;case v:this.b=0;this.c=new (s?Uint8Array:Array)(this.h);this.e=this.A;this.n=this.w;this.j=this.z;break;default:throw Error("invalid inflate mode");
}}var w=0,v=1,x={u:w,t:v};
u.prototype.k=function(){for(;!this.m;){var c=y(this,3);c&1&&(this.m=!0);c>>>=1;switch(c){case 0:var d=this.input,a=this.a,b=this.c,e=this.b,f=d.length,g=void 0,h=void 0,k=b.length,l=void 0;this.d=this.f=0;if(a+1>=f)throw Error("invalid uncompressed block header: LEN");g=d[a++]|d[a++]<<8;if(a+1>=f)throw Error("invalid uncompressed block header: NLEN");h=d[a++]|d[a++]<<8;if(g===~h)throw Error("invalid uncompressed block header: length verify");if(a+g>d.length)throw Error("input buffer is broken");switch(this.i){case w:for(;e+
g>b.length;){l=k-e;g-=l;if(s)b.set(d.subarray(a,a+l),e),e+=l,a+=l;else for(;l--;)b[e++]=d[a++];this.b=e;b=this.e();e=this.b}break;case v:for(;e+g>b.length;)b=this.e({p:2});break;default:throw Error("invalid inflate mode");}if(s)b.set(d.subarray(a,a+g),e),e+=g,a+=g;else for(;g--;)b[e++]=d[a++];this.a=a;this.b=e;this.c=b;break;case 1:this.j(z,A);break;case 2:B(this);break;default:throw Error("unknown BTYPE: "+c);}}return this.n()};
var C=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],D=s?new Uint16Array(C):C,E=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],F=s?new Uint16Array(E):E,G=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],H=s?new Uint8Array(G):G,I=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],J=s?new Uint16Array(I):I,L=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,
13],M=s?new Uint8Array(L):L,N=new (s?Uint8Array:Array)(288),O,P;O=0;for(P=N.length;O<P;++O)N[O]=143>=O?8:255>=O?9:279>=O?7:8;var z=t(N),Q=new (s?Uint8Array:Array)(30),R,S;R=0;for(S=Q.length;R<S;++R)Q[R]=5;var A=t(Q);function y(c,d){for(var a=c.f,b=c.d,e=c.input,f=c.a,g=e.length,h;b<d;){if(f>=g)throw Error("input buffer is broken");a|=e[f++]<<b;b+=8}h=a&(1<<d)-1;c.f=a>>>d;c.d=b-d;c.a=f;return h}
function T(c,d){for(var a=c.f,b=c.d,e=c.input,f=c.a,g=e.length,h=d[0],k=d[1],l,p;b<k&&!(f>=g);)a|=e[f++]<<b,b+=8;l=h[a&(1<<k)-1];p=l>>>16;c.f=a>>p;c.d=b-p;c.a=f;return l&65535}
function B(c){function d(a,c,b){var d,e=this.q,f,g;for(g=0;g<a;)switch(d=T(this,c),d){case 16:for(f=3+y(this,2);f--;)b[g++]=e;break;case 17:for(f=3+y(this,3);f--;)b[g++]=0;e=0;break;case 18:for(f=11+y(this,7);f--;)b[g++]=0;e=0;break;default:e=b[g++]=d}this.q=e;return b}var a=y(c,5)+257,b=y(c,5)+1,e=y(c,4)+4,f=new (s?Uint8Array:Array)(D.length),g,h,k,l;for(l=0;l<e;++l)f[D[l]]=y(c,3);if(!s){l=e;for(e=f.length;l<e;++l)f[D[l]]=0}g=t(f);h=new (s?Uint8Array:Array)(a);k=new (s?Uint8Array:Array)(b);c.q=0;
c.j(t(d.call(c,a,g,h)),t(d.call(c,b,g,k)))}u.prototype.j=function(c,d){var a=this.c,b=this.b;this.o=c;for(var e=a.length-258,f,g,h,k;256!==(f=T(this,c));)if(256>f)b>=e&&(this.b=b,a=this.e(),b=this.b),a[b++]=f;else{g=f-257;k=F[g];0<H[g]&&(k+=y(this,H[g]));f=T(this,d);h=J[f];0<M[f]&&(h+=y(this,M[f]));b>=e&&(this.b=b,a=this.e(),b=this.b);for(;k--;)a[b]=a[b++-h]}for(;8<=this.d;)this.d-=8,this.a--;this.b=b};
u.prototype.z=function(c,d){var a=this.c,b=this.b;this.o=c;for(var e=a.length,f,g,h,k;256!==(f=T(this,c));)if(256>f)b>=e&&(a=this.e(),e=a.length),a[b++]=f;else{g=f-257;k=F[g];0<H[g]&&(k+=y(this,H[g]));f=T(this,d);h=J[f];0<M[f]&&(h+=y(this,M[f]));b+k>e&&(a=this.e(),e=a.length);for(;k--;)a[b]=a[b++-h]}for(;8<=this.d;)this.d-=8,this.a--;this.b=b};
u.prototype.e=function(){var c=new (s?Uint8Array:Array)(this.b-32768),d=this.b-32768,a,b,e=this.c;if(s)c.set(e.subarray(32768,c.length));else{a=0;for(b=c.length;a<b;++a)c[a]=e[a+32768]}this.g.push(c);this.l+=c.length;if(s)e.set(e.subarray(d,d+32768));else for(a=0;32768>a;++a)e[a]=e[d+a];this.b=32768;return e};
u.prototype.A=function(c){var d,a=this.input.length/this.a+1|0,b,e,f,g=this.input,h=this.c;c&&("number"===typeof c.p&&(a=c.p),"number"===typeof c.v&&(a+=c.v));2>a?(b=(g.length-this.a)/this.o[2],f=258*(b/2)|0,e=f<h.length?h.length+f:h.length<<1):e=h.length*a;s?(d=new Uint8Array(e),d.set(h)):d=h;return this.c=d};
u.prototype.n=function(){var c=0,d=this.c,a=this.g,b,e=new (s?Uint8Array:Array)(this.l+(this.b-32768)),f,g,h,k;if(0===a.length)return s?this.c.subarray(32768,this.b):this.c.slice(32768,this.b);f=0;for(g=a.length;f<g;++f){b=a[f];h=0;for(k=b.length;h<k;++h)e[c++]=b[h]}f=32768;for(g=this.b;f<g;++f)e[c++]=d[f];this.g=[];return this.buffer=e};
u.prototype.w=function(){var c,d=this.b;s?this.s?(c=new Uint8Array(d),c.set(this.c.subarray(0,d))):c=this.c.subarray(0,d):(this.c.length>d&&(this.c.length=d),c=this.c);return this.buffer=c};function U(c,d){var a,b;this.input=c;this.a=0;if(d||!(d={}))d.index&&(this.a=d.index),d.verify&&(this.B=d.verify);a=c[this.a++];b=c[this.a++];switch(a&15){case V:this.method=V;break;default:throw Error("unsupported compression method");}if(0!==((a<<8)+b)%31)throw Error("invalid fcheck flag:"+((a<<8)+b)%31);if(b&32)throw Error("fdict flag is not supported");this.r=new u(c,{index:this.a,bufferSize:d.bufferSize,bufferType:d.bufferType,resize:d.resize})}
U.prototype.k=function(){var c=this.input,d,a;d=this.r.k();this.a=this.r.a;if(this.B){a=(c[this.a++]<<24|c[this.a++]<<16|c[this.a++]<<8|c[this.a++])>>>0;var b=d;if("string"===typeof b){var e=b.split(""),f,g;f=0;for(g=e.length;f<g;f++)e[f]=(e[f].charCodeAt(0)&255)>>>0;b=e}for(var h=1,k=0,l=b.length,p,n=0;0<l;){p=1024<l?1024:l;l-=p;do h+=b[n++],k+=h;while(--p);h%=65521;k%=65521}if(a!==(k<<16|h)>>>0)throw Error("invalid adler-32 checksum");}return d};var V=8;q("Inflate",U);q("Inflate.prototype.decompress",U.prototype.k);var W={ADAPTIVE:x.t,BLOCK:x.u},X,Y,Z,$;if(Object.keys)X=Object.keys(W);else for(Y in X=[],Z=0,W)X[Z++]=Y;Z=0;for($=X.length;Z<$;++Z)Y=X[Z],q("Inflate.BufferType."+Y,W[Y]);}).call(this);

/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function() {'use strict';var n=void 0,w=!0,aa=this;function ba(f,d){var c=f.split("."),e=aa;!(c[0]in e)&&e.execScript&&e.execScript("var "+c[0]);for(var b;c.length&&(b=c.shift());)!c.length&&d!==n?e[b]=d:e=e[b]?e[b]:e[b]={}};var C="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array&&"undefined"!==typeof DataView;function K(f,d){this.index="number"===typeof d?d:0;this.e=0;this.buffer=f instanceof(C?Uint8Array:Array)?f:new (C?Uint8Array:Array)(32768);if(2*this.buffer.length<=this.index)throw Error("invalid index");this.buffer.length<=this.index&&ca(this)}function ca(f){var d=f.buffer,c,e=d.length,b=new (C?Uint8Array:Array)(e<<1);if(C)b.set(d);else for(c=0;c<e;++c)b[c]=d[c];return f.buffer=b}
K.prototype.b=function(f,d,c){var e=this.buffer,b=this.index,a=this.e,g=e[b],m;c&&1<d&&(f=8<d?(L[f&255]<<24|L[f>>>8&255]<<16|L[f>>>16&255]<<8|L[f>>>24&255])>>32-d:L[f]>>8-d);if(8>d+a)g=g<<d|f,a+=d;else for(m=0;m<d;++m)g=g<<1|f>>d-m-1&1,8===++a&&(a=0,e[b++]=L[g],g=0,b===e.length&&(e=ca(this)));e[b]=g;this.buffer=e;this.e=a;this.index=b};K.prototype.finish=function(){var f=this.buffer,d=this.index,c;0<this.e&&(f[d]<<=8-this.e,f[d]=L[f[d]],d++);C?c=f.subarray(0,d):(f.length=d,c=f);return c};
var da=new (C?Uint8Array:Array)(256),M;for(M=0;256>M;++M){for(var N=M,S=N,ea=7,N=N>>>1;N;N>>>=1)S<<=1,S|=N&1,--ea;da[M]=(S<<ea&255)>>>0}var L=da;function ia(f){this.buffer=new (C?Uint16Array:Array)(2*f);this.length=0}ia.prototype.getParent=function(f){return 2*((f-2)/4|0)};ia.prototype.push=function(f,d){var c,e,b=this.buffer,a;c=this.length;b[this.length++]=d;for(b[this.length++]=f;0<c;)if(e=this.getParent(c),b[c]>b[e])a=b[c],b[c]=b[e],b[e]=a,a=b[c+1],b[c+1]=b[e+1],b[e+1]=a,c=e;else break;return this.length};
ia.prototype.pop=function(){var f,d,c=this.buffer,e,b,a;d=c[0];f=c[1];this.length-=2;c[0]=c[this.length];c[1]=c[this.length+1];for(a=0;;){b=2*a+2;if(b>=this.length)break;b+2<this.length&&c[b+2]>c[b]&&(b+=2);if(c[b]>c[a])e=c[a],c[a]=c[b],c[b]=e,e=c[a+1],c[a+1]=c[b+1],c[b+1]=e;else break;a=b}return{index:f,value:d,length:this.length}};function ka(f,d){this.d=la;this.i=0;this.input=C&&f instanceof Array?new Uint8Array(f):f;this.c=0;d&&(d.lazy&&(this.i=d.lazy),"number"===typeof d.compressionType&&(this.d=d.compressionType),d.outputBuffer&&(this.a=C&&d.outputBuffer instanceof Array?new Uint8Array(d.outputBuffer):d.outputBuffer),"number"===typeof d.outputIndex&&(this.c=d.outputIndex));this.a||(this.a=new (C?Uint8Array:Array)(32768))}var la=2,na={NONE:0,h:1,g:la,n:3},T=[],U;
for(U=0;288>U;U++)switch(w){case 143>=U:T.push([U+48,8]);break;case 255>=U:T.push([U-144+400,9]);break;case 279>=U:T.push([U-256+0,7]);break;case 287>=U:T.push([U-280+192,8]);break;default:throw"invalid literal: "+U;}
ka.prototype.f=function(){var f,d,c,e,b=this.input;switch(this.d){case 0:c=0;for(e=b.length;c<e;){d=C?b.subarray(c,c+65535):b.slice(c,c+65535);c+=d.length;var a=d,g=c===e,m=n,k=n,p=n,t=n,u=n,l=this.a,h=this.c;if(C){for(l=new Uint8Array(this.a.buffer);l.length<=h+a.length+5;)l=new Uint8Array(l.length<<1);l.set(this.a)}m=g?1:0;l[h++]=m|0;k=a.length;p=~k+65536&65535;l[h++]=k&255;l[h++]=k>>>8&255;l[h++]=p&255;l[h++]=p>>>8&255;if(C)l.set(a,h),h+=a.length,l=l.subarray(0,h);else{t=0;for(u=a.length;t<u;++t)l[h++]=
a[t];l.length=h}this.c=h;this.a=l}break;case 1:var q=new K(C?new Uint8Array(this.a.buffer):this.a,this.c);q.b(1,1,w);q.b(1,2,w);var s=oa(this,b),x,fa,z;x=0;for(fa=s.length;x<fa;x++)if(z=s[x],K.prototype.b.apply(q,T[z]),256<z)q.b(s[++x],s[++x],w),q.b(s[++x],5),q.b(s[++x],s[++x],w);else if(256===z)break;this.a=q.finish();this.c=this.a.length;break;case la:var B=new K(C?new Uint8Array(this.a.buffer):this.a,this.c),ta,J,O,P,Q,La=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],X,ua,Y,va,ga,ja=Array(19),
wa,R,ha,y,xa;ta=la;B.b(1,1,w);B.b(ta,2,w);J=oa(this,b);X=pa(this.m,15);ua=qa(X);Y=pa(this.l,7);va=qa(Y);for(O=286;257<O&&0===X[O-1];O--);for(P=30;1<P&&0===Y[P-1];P--);var ya=O,za=P,F=new (C?Uint32Array:Array)(ya+za),r,G,v,Z,E=new (C?Uint32Array:Array)(316),D,A,H=new (C?Uint8Array:Array)(19);for(r=G=0;r<ya;r++)F[G++]=X[r];for(r=0;r<za;r++)F[G++]=Y[r];if(!C){r=0;for(Z=H.length;r<Z;++r)H[r]=0}r=D=0;for(Z=F.length;r<Z;r+=G){for(G=1;r+G<Z&&F[r+G]===F[r];++G);v=G;if(0===F[r])if(3>v)for(;0<v--;)E[D++]=0,
H[0]++;else for(;0<v;)A=138>v?v:138,A>v-3&&A<v&&(A=v-3),10>=A?(E[D++]=17,E[D++]=A-3,H[17]++):(E[D++]=18,E[D++]=A-11,H[18]++),v-=A;else if(E[D++]=F[r],H[F[r]]++,v--,3>v)for(;0<v--;)E[D++]=F[r],H[F[r]]++;else for(;0<v;)A=6>v?v:6,A>v-3&&A<v&&(A=v-3),E[D++]=16,E[D++]=A-3,H[16]++,v-=A}f=C?E.subarray(0,D):E.slice(0,D);ga=pa(H,7);for(y=0;19>y;y++)ja[y]=ga[La[y]];for(Q=19;4<Q&&0===ja[Q-1];Q--);wa=qa(ga);B.b(O-257,5,w);B.b(P-1,5,w);B.b(Q-4,4,w);for(y=0;y<Q;y++)B.b(ja[y],3,w);y=0;for(xa=f.length;y<xa;y++)if(R=
f[y],B.b(wa[R],ga[R],w),16<=R){y++;switch(R){case 16:ha=2;break;case 17:ha=3;break;case 18:ha=7;break;default:throw"invalid code: "+R;}B.b(f[y],ha,w)}var Aa=[ua,X],Ba=[va,Y],I,Ca,$,ma,Da,Ea,Fa,Ga;Da=Aa[0];Ea=Aa[1];Fa=Ba[0];Ga=Ba[1];I=0;for(Ca=J.length;I<Ca;++I)if($=J[I],B.b(Da[$],Ea[$],w),256<$)B.b(J[++I],J[++I],w),ma=J[++I],B.b(Fa[ma],Ga[ma],w),B.b(J[++I],J[++I],w);else if(256===$)break;this.a=B.finish();this.c=this.a.length;break;default:throw"invalid compression type";}return this.a};
function ra(f,d){this.length=f;this.k=d}
var sa=function(){function f(b){switch(w){case 3===b:return[257,b-3,0];case 4===b:return[258,b-4,0];case 5===b:return[259,b-5,0];case 6===b:return[260,b-6,0];case 7===b:return[261,b-7,0];case 8===b:return[262,b-8,0];case 9===b:return[263,b-9,0];case 10===b:return[264,b-10,0];case 12>=b:return[265,b-11,1];case 14>=b:return[266,b-13,1];case 16>=b:return[267,b-15,1];case 18>=b:return[268,b-17,1];case 22>=b:return[269,b-19,2];case 26>=b:return[270,b-23,2];case 30>=b:return[271,b-27,2];case 34>=b:return[272,
b-31,2];case 42>=b:return[273,b-35,3];case 50>=b:return[274,b-43,3];case 58>=b:return[275,b-51,3];case 66>=b:return[276,b-59,3];case 82>=b:return[277,b-67,4];case 98>=b:return[278,b-83,4];case 114>=b:return[279,b-99,4];case 130>=b:return[280,b-115,4];case 162>=b:return[281,b-131,5];case 194>=b:return[282,b-163,5];case 226>=b:return[283,b-195,5];case 257>=b:return[284,b-227,5];case 258===b:return[285,b-258,0];default:throw"invalid length: "+b;}}var d=[],c,e;for(c=3;258>=c;c++)e=f(c),d[c]=e[2]<<24|
e[1]<<16|e[0];return d}(),Ha=C?new Uint32Array(sa):sa;
function oa(f,d){function c(b,c){var a=b.k,d=[],e=0,f;f=Ha[b.length];d[e++]=f&65535;d[e++]=f>>16&255;d[e++]=f>>24;var g;switch(w){case 1===a:g=[0,a-1,0];break;case 2===a:g=[1,a-2,0];break;case 3===a:g=[2,a-3,0];break;case 4===a:g=[3,a-4,0];break;case 6>=a:g=[4,a-5,1];break;case 8>=a:g=[5,a-7,1];break;case 12>=a:g=[6,a-9,2];break;case 16>=a:g=[7,a-13,2];break;case 24>=a:g=[8,a-17,3];break;case 32>=a:g=[9,a-25,3];break;case 48>=a:g=[10,a-33,4];break;case 64>=a:g=[11,a-49,4];break;case 96>=a:g=[12,a-
65,5];break;case 128>=a:g=[13,a-97,5];break;case 192>=a:g=[14,a-129,6];break;case 256>=a:g=[15,a-193,6];break;case 384>=a:g=[16,a-257,7];break;case 512>=a:g=[17,a-385,7];break;case 768>=a:g=[18,a-513,8];break;case 1024>=a:g=[19,a-769,8];break;case 1536>=a:g=[20,a-1025,9];break;case 2048>=a:g=[21,a-1537,9];break;case 3072>=a:g=[22,a-2049,10];break;case 4096>=a:g=[23,a-3073,10];break;case 6144>=a:g=[24,a-4097,11];break;case 8192>=a:g=[25,a-6145,11];break;case 12288>=a:g=[26,a-8193,12];break;case 16384>=
a:g=[27,a-12289,12];break;case 24576>=a:g=[28,a-16385,13];break;case 32768>=a:g=[29,a-24577,13];break;default:throw"invalid distance";}f=g;d[e++]=f[0];d[e++]=f[1];d[e++]=f[2];var k,m;k=0;for(m=d.length;k<m;++k)l[h++]=d[k];s[d[0]]++;x[d[3]]++;q=b.length+c-1;u=null}var e,b,a,g,m,k={},p,t,u,l=C?new Uint16Array(2*d.length):[],h=0,q=0,s=new (C?Uint32Array:Array)(286),x=new (C?Uint32Array:Array)(30),fa=f.i,z;if(!C){for(a=0;285>=a;)s[a++]=0;for(a=0;29>=a;)x[a++]=0}s[256]=1;e=0;for(b=d.length;e<b;++e){a=
m=0;for(g=3;a<g&&e+a!==b;++a)m=m<<8|d[e+a];k[m]===n&&(k[m]=[]);p=k[m];if(!(0<q--)){for(;0<p.length&&32768<e-p[0];)p.shift();if(e+3>=b){u&&c(u,-1);a=0;for(g=b-e;a<g;++a)z=d[e+a],l[h++]=z,++s[z];break}0<p.length?(t=Ia(d,e,p),u?u.length<t.length?(z=d[e-1],l[h++]=z,++s[z],c(t,0)):c(u,-1):t.length<fa?u=t:c(t,0)):u?c(u,-1):(z=d[e],l[h++]=z,++s[z])}p.push(e)}l[h++]=256;s[256]++;f.m=s;f.l=x;return C?l.subarray(0,h):l}
function Ia(f,d,c){var e,b,a=0,g,m,k,p,t=f.length;m=0;p=c.length;a:for(;m<p;m++){e=c[p-m-1];g=3;if(3<a){for(k=a;3<k;k--)if(f[e+k-1]!==f[d+k-1])continue a;g=a}for(;258>g&&d+g<t&&f[e+g]===f[d+g];)++g;g>a&&(b=e,a=g);if(258===g)break}return new ra(a,d-b)}
function pa(f,d){var c=f.length,e=new ia(572),b=new (C?Uint8Array:Array)(c),a,g,m,k,p;if(!C)for(k=0;k<c;k++)b[k]=0;for(k=0;k<c;++k)0<f[k]&&e.push(k,f[k]);a=Array(e.length/2);g=new (C?Uint32Array:Array)(e.length/2);if(1===a.length)return b[e.pop().index]=1,b;k=0;for(p=e.length/2;k<p;++k)a[k]=e.pop(),g[k]=a[k].value;m=Ja(g,g.length,d);k=0;for(p=a.length;k<p;++k)b[a[k].index]=m[k];return b}
function Ja(f,d,c){function e(a){var b=k[a][p[a]];b===d?(e(a+1),e(a+1)):--g[b];++p[a]}var b=new (C?Uint16Array:Array)(c),a=new (C?Uint8Array:Array)(c),g=new (C?Uint8Array:Array)(d),m=Array(c),k=Array(c),p=Array(c),t=(1<<c)-d,u=1<<c-1,l,h,q,s,x;b[c-1]=d;for(h=0;h<c;++h)t<u?a[h]=0:(a[h]=1,t-=u),t<<=1,b[c-2-h]=(b[c-1-h]/2|0)+d;b[0]=a[0];m[0]=Array(b[0]);k[0]=Array(b[0]);for(h=1;h<c;++h)b[h]>2*b[h-1]+a[h]&&(b[h]=2*b[h-1]+a[h]),m[h]=Array(b[h]),k[h]=Array(b[h]);for(l=0;l<d;++l)g[l]=c;for(q=0;q<b[c-1];++q)m[c-
1][q]=f[q],k[c-1][q]=q;for(l=0;l<c;++l)p[l]=0;1===a[c-1]&&(--g[0],++p[c-1]);for(h=c-2;0<=h;--h){s=l=0;x=p[h+1];for(q=0;q<b[h];q++)s=m[h+1][x]+m[h+1][x+1],s>f[l]?(m[h][q]=s,k[h][q]=d,x+=2):(m[h][q]=f[l],k[h][q]=l,++l);p[h]=0;1===a[h]&&e(h)}return g}
function qa(f){var d=new (C?Uint16Array:Array)(f.length),c=[],e=[],b=0,a,g,m,k;a=0;for(g=f.length;a<g;a++)c[f[a]]=(c[f[a]]|0)+1;a=1;for(g=16;a<=g;a++)e[a]=b,b+=c[a]|0,b<<=1;a=0;for(g=f.length;a<g;a++){b=e[f[a]];e[f[a]]+=1;m=d[a]=0;for(k=f[a];m<k;m++)d[a]=d[a]<<1|b&1,b>>>=1}return d};function Ka(f,d){this.input=f;this.a=new (C?Uint8Array:Array)(32768);this.d=V.g;var c={},e;if((d||!(d={}))&&"number"===typeof d.compressionType)this.d=d.compressionType;for(e in d)c[e]=d[e];c.outputBuffer=this.a;this.j=new ka(this.input,c)}var V=na;
Ka.prototype.f=function(){var f,d,c,e,b,a,g=0;a=this.a;switch(8){case 8:f=Math.LOG2E*Math.log(32768)-8;break;default:throw Error("invalid compression method");}d=f<<4|8;a[g++]=d;switch(8){case 8:switch(this.d){case V.NONE:e=0;break;case V.h:e=1;break;case V.g:e=2;break;default:throw Error("unsupported compression type");}break;default:throw Error("invalid compression method");}c=e<<6|0;a[g++]=c|31-(256*d+c)%31;var m=this.input;if("string"===typeof m){var k=m.split(""),p,t;p=0;for(t=k.length;p<t;p++)k[p]=
(k[p].charCodeAt(0)&255)>>>0;m=k}for(var u=1,l=0,h=m.length,q,s=0;0<h;){q=1024<h?1024:h;h-=q;do u+=m[s++],l+=u;while(--q);u%=65521;l%=65521}b=(l<<16|u)>>>0;this.j.c=g;a=this.j.f();g=a.length;C&&(a=new Uint8Array(a.buffer),a.length<=g+4&&(this.a=new Uint8Array(a.length+4),this.a.set(a),a=this.a),a=a.subarray(0,g+4));a[g++]=b>>24&255;a[g++]=b>>16&255;a[g++]=b>>8&255;a[g++]=b&255;return a};ba("Deflate",Ka);ba("Deflate.compress",function(f,d){return(new Ka(f,d)).f()});ba("Deflate.prototype.compress",Ka.prototype.f);var Ma={NONE:V.NONE,FIXED:V.h,DYNAMIC:V.g},Na,Oa,W,Pa;if(Object.keys)Na=Object.keys(Ma);else for(Oa in Na=[],W=0,Ma)Na[W++]=Oa;W=0;for(Pa=Na.length;W<Pa;++W)Oa=Na[W],ba("Deflate.CompressionType."+Oa,Ma[Oa]);}).call(this);

Mira.init();
