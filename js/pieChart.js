/**
 * Created by ati http://at4321.com on 2017/1/22.
 */
function pieChart(option) {
    //所有传入数据的和
    this.sumData = 0;
    //传入数据，格式为数组
    this.data = [];
    //各数据所占的百分比,在init时执行
    this.dataPercent = [];
    //显示文本
    this.text = ["GB", "食堂", "咖啡"];
    //显示颜色
    this.color = ["#C23531", "#2F4554", "#61A0A8"];
    this.canvasID = '';
    this.height = 300;
    this.width = 300;
    this.padding = 10;
    this.scale = window.devicePixelRatio;
    this.textPosition = 'top';
    this.textFormat = '{a}:￥{b}({c}%)';
    this.isPC = false;
    this.lineHeight = 1.0;
    //根据所传参数初始化函数
    this.init = function () {
        this.text = option.text;
        this.data = option.data;
        this.color = option.color;
        this.canvasID = option.canvasID;
        this.padding = option.padding;
        this.width = option.width;
        this.height = option.height;
        if (option.scale) {
            this.scale = option.scale;
        }
        if (option.lineHeight) {
            this.lineHeight = option.lineHeight;
        }
        if (option.textFormat) {
            this.textFormat = option.textFormat;
        }
        //js数组求和优化，比用循环代码更少更快//http://blog.csdn.net/pic_me/article/details/51382327
        this.sumData = eval(this.data.join("+"));
        //循环获取百分比
        this.dataPercent = [];
        for (var i = 0; i < this.data.length; i++) {
            this.dataPercent.push(this.data[i] / this.sumData * 100);
        }
        //this.isPC = this.isPC();
    };

    this.drawCircle = function () {
        if (option) {
            this.init(option);
        }
        if (!this.sumData) {
            this.drawNull();
            return false;
        }
        ;
        var canvas = document.getElementById(this.canvasID);
        this.height = this.height * this.scale;
        this.width = this.width * this.scale;

        canvas.height = this.height;
        canvas.width = this.width;
        var radius = Math.min(this.height, this.width) / 2 - this.padding;
        console.log("radius:" + radius);
        console.log("width:" + canvas.width);
        var centerX = this.width / 2;
        var centerY = radius + this.padding;
        if (this.height > this.width) {
            console.log("yOffset:" + (this.height - this.width) / 2);
            console.log("centerY before add:" + centerY);
            centerY = centerY + ((this.height - this.width));
            console.log("centerY:" + centerY);
        }
        if (this.height < this.width) {
            centerX += (this.width - this.height) / 2 - this.padding;
        }
        var startPoint = 1.5 * Math.PI;
        var ctx = canvas.getContext("2d");

        for (var i = 0; i < this.data.length; i++) {
            ctx.fillStyle = this.color[i];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startPoint, startPoint - Math.PI * 2 * (this.dataPercent[i] / 100), true);
            ctx.fill();
            //ctx.stroke();
            startPoint -= Math.PI * 2 * (this.dataPercent[i] / 100);

            //绘制色块：
            var fontSize = 12 * this.scale;
            ctx.moveTo(this.padding, (i) * fontSize * this.lineHeight + this.padding);
            ctx.lineTo(this.padding * this.scale, (i ) * fontSize * this.lineHeight + this.padding);
            ctx.lineTo(this.padding * this.scale, (i ) * fontSize * this.lineHeight + this.padding * this.scale);
            ctx.lineTo(this.padding, (i) * fontSize * this.lineHeight + this.padding * this.scale);
            ctx.lineTo(this.padding, (i ) * fontSize * this.lineHeight + this.padding);
            ctx.fill();
            //绘制文本
            ctx.font = fontSize + "px/" + fontSize * this.lineHeight + "px Arial,微软雅黑";
            if (this.isPC) {
                ctx.font = fontSize + "px/" + fontSize * this.lineHeight + "px Arial,微软雅黑";
            }
            var textToFill = this.textFormat.replace(/\{a\}/g, this.text[i]).replace(/\{b\}/g, this.data[i]).replace(/\{c\}/g, this.dataPercent[i].toFixed(2));
            ctx.fillText(textToFill, this.padding * this.scale + fontSize * 0.5, (i + 0.6) * fontSize * this.lineHeight + this.padding);
        }
        ;
        this.scaleCanvas();
    };
    /**
     * 如果数据都为0，画空图形
     */
    this.drawNull = function () {
        var canvas = document.getElementById(this.canvasID);
        this.height = this.height * this.scale;
        this.width = this.width * this.scale;
        canvas.height = this.height;
        canvas.width = this.width;
        var radius = Math.min(this.height, this.width) / 2 - this.padding;
        var centerX = this.width / 2;
        var centerY = this.height / 2;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.fill();
        var fontSize = 12;
        ctx.font = fontSize * this.scale + "px/" + fontSize * this.scale * this.lineHeight + "px Arial,微软雅黑";
        //if (this.isPC) {
        //ctx.font = "14px/21px Arial,微软雅黑";
        //}
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.textAlign = "center";
        ctx.fillText("您的报表暂无数据。", centerX, centerY);
    };
    //根据设备像素比率修改canvas的显示大小，这样在不同的devicePixelRatio下，都不会出现发虚的现象
    this.scaleCanvas = function () {
        var canvas = document.getElementById(this.canvasID);
        if (!(this.scale === 1)) {
            console.log(this.scale);
            canvas.style.transform = "scale(" + 1/this.scale + ")";
            canvas.style.transformOrigin = "0 0";
        }
    }
    ;
    return this.drawCircle();
}
;