function DragObj(_obj) {
        this.obj=_obj;
        this.point={};
        this.moveBool=false;
        this.obj.self=this;
        this.obj.addEventListener("mousedown",this.mouseHandler);
        this.obj.addEventListener("mouseup",this.mouseHandler);
        this.obj.addEventListener("mousemove",this.mouseHandler);
        this.obj.addEventListener("mouseleave",this.mouseHandler);
}
DragObj.prototype={
    mouseHandler:function (e) {
        if(!e){
            e=window.event;
        }
        if(e.type=="mousedown"){
            this.self.moveBool=true;
            this.self.point.x=e.offsetX;
            this.self.point.y=e.offsetY;
        }else if(e.type=="mousemove"){
            if(!this.self.moveBool) return;
            this.self.obj.style.left=(e.clientX-this.self.point.x)+"px"
            this.self.obj.style.top=(e.clientY-this.self.point.y)+"px"
        }else if(e.type=="mouseup" || e.type=="mouseleave"){
            this.self.moveBool=false;
        }
    },
    removeEvent:function () {

        this.obj.removeEventListener("mousedown",this.mouseHandler);
        this.obj.removeEventListener("mouseup",this.mouseHandler);
        this.obj.removeEventListener("mousemove",this.mouseHandler);
        this.obj.removeEventListener("mouseleave",this.mouseHandler);

        this.obj=null;
        this.point=null;
    }
};
var HitTest=HitTest || (function () {
        return {
            to:function (display0,display1) {
                var rect=display0.getBoundingClientRect();
                var rect1=display1.getBoundingClientRect();
                if(rect.left>=rect1.left && rect.left<=rect1.left+rect1.width && rect.top>=rect1.top && rect.top<=rect1.top+rect1.height){
                   return true;
                }
                if(rect.left+rect.width>=rect1.left && rect.left+rect.width<=rect1.left+rect1.width && rect.top>=rect1.top && rect.top<=rect1.top+rect1.height){
                    return true;
                }
                if(rect.left>=rect1.left && rect.left<=rect1.left+rect1.width && rect.top+rect.height>=rect1.top && rect.top+rect.height<=rect1.top+rect1.height){
                    return true;
                }
                if(rect.left+rect.width>=rect1.left && rect.left+rect.width<=rect1.left+rect1.width && rect.top+rect.height>=rect1.top && rect.top+rect.height<=rect1.top+rect1.height){
                    return true;
                }
            }
        }
    })();
var LoadImg=LoadImg || (function () {
        return {
            load:function (listSrc,callBack) {
                this.callBack=callBack;
                this.listSrc=listSrc;
                this.num=0;
                this.imgArr=[];
                var img=new Image();
                img.addEventListener("load",this.loadHandler.bind(this));
                img.src=listSrc[0];
            },
            loadHandler:function (e) {
                if(!e){
                    e=window.event;
                }
                e.currentTarget.removeEventListener("load",this.loadHandler.bind(this));
                this.imgArr[this.num]=e.currentTarget;
                if(this.num==this.listSrc.length-1){
                    this.callBack(this.imgArr)
                    return;
                }
                var img=new Image();
                this.num++;
                img.addEventListener("load",this.loadHandler.bind(this));
                img.src=this.listSrc[this.num];
            }
        }
    })();