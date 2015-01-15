/* Editor Paint 
*   Autor: Abraao Barros
*   Data: 30 de setembro
*/
Error.createCustromConstructor = function(name, init, proto){};
var NotImplementedYet = Error.createCustromConstructor('NotImplementedError');

/*
*   Classe que associa as ferramentas com eventos no mouse
*/
function Tools(board){
    this.board = board;
}

Tools.prototype.listenerMouseClick = function(callback) {
    element = document.getElementById(this.board.canvasID);
    element.onmousedown= function(e){
        var cursorX = e.pageX;
        var cursorY = e.pageY;
        console.log("asda");
        callback(cursorX,cursorY);
    };
};

Tools.prototype.cancelMouseClick = function(callback) {
    element.onmousedown= null;
};

Tools.prototype.listenerMouseTwoClicks = function(callback_click1,callback_move, callback_click2) {
    element = document.getElementById(this.board.canvasID);
    count = 0;

    click1 = function(e){
        var x = e.pageX;
        var y = e.pageY;
        callback_click1(x,y);
        
        element.onmousedown = function(e){
            var x = e.pageX;
            var y = e.pageY;
            callback_click2(x,y);
            element.onmousedown = click1;
            element.onmousemove = null;
        };
        
        element.onmousemove = function(e){
            var x = e.pageX;
            var y = e.pageY;
            callback_move(x,y);
        };
    };
    element.onmousedown = click1;
};

Tools.prototype.listenerMouseDragAndDrop = function(callback_down, callback_move, callback_up) {
    element = document.getElementById(this.board.canvasID);
    count = 0;
    mouse_is_down = false;
    var x0,y0;

    element.onmousedown = function(e){
        x0 = e.pageX;
        y0 = e.pageY;
        callback_down(x0,y0);
        mouse_is_down = true;

        element.onmouseup = function(e){
            var x = e.pageX;
            var y = e.pageY;
            callback_up(x,y);
            mouse_is_down = false;
            element.onmousemove = null;
            element.onmouseup = null;
        };
        element.onmousemove = function(e){
            if(!mouse_is_down) return;
            var x = e.pageX;
            var y = e.pageY;
            callback_move(x-x0,y-y0);
            x0 = x;
            y0 = y;
        };
    };

    
};

Tools.prototype.drawline = function() {
    var x0,y0;
    var board = this.board;
    this.listenerMouseTwoClicks(function(x,y){
        x0 = x;
        y0 = y;
    },function(x,y){
        var obj = new Line(x0, y0, x, y, board.current_color, board.current_pattern);
        board.objects.push(obj);
        board.show();
        board.objects.pop();
    },
    function(x,y){
        var obj = new Line(x0, y0, x, y, board.current_color, board.current_pattern);
        board.objects.push(obj);
        board.show();
    });
};

Tools.prototype.drawcircle = function() {
    var x0,y0;
    var board = this.board;
    this.listenerMouseTwoClicks(function(x,y){
        x0 = x;
        y0 = y;
        console.log(x0,y0);
    },function(x,y){
        board.objects.push(new Circle(x0, y0, x, y, board.current_color,board.current_pattern));
        board.show();
        board.objects.pop();
    },function(x,y){
        board.objects.push(new Circle(x0, y0, x, y, board.current_color,board.current_pattern));
        board.show();
    });
};

Tools.prototype.drawrect= function() {
    var x0,y0;
    var board = this.board;
    this.listenerMouseTwoClicks(function(x,y){
        x0 = x;
        y0 = y;
    },function(x,y){
        board.objects.push(new Rect(x0, y0, x, y, board.current_color,board.current_pattern));
        board.show();
        board.objects.pop();
    },function(x,y){
        board.objects.push(new Rect(x0, y0, x, y, board.current_color,board.current_pattern));
        board.show();
    });
};

Tools.prototype.fill = function() {
    var board = this.board;
    this.listenerMouseClick(function(x,y){
        d = new Draw(board);
        var target_color = board.getPixelColor(x,y);
        d.fill(x,y,target_color,board.current_color);
        board.show();
    });
};

Tools.prototype.drawPixelMouseClick = function() {
    var board = this.board;
    this.listenerMouseClick(function(x,y){
        d = new Draw(board);
        d.pixel(x,y,board.current_color);
        board.show();
    });
};

Tools.prototype.select = function(x,y) {
    var board = this.board;
    var obj = null;
    this.listenerMouseClick(function(x,y){
        for (var i = 0; i < board.objects.length; i++) {
            var obj_selected;
            if(board.objects[i].is_intern(x,y)){
                obj_selected = board.objects[i];
                obj = board.objects[i];
            }
        }
        board.selected_object = obj;
        board.show();
    });
};

Tools.prototype.delete = function(x,y) {
    var board = this.board;
    var obj = null;
    this.listenerMouseClick(function(x,y){
        for (var i = 0; i < board.objects.length; i++) {
            var obj_selected;
            if(board.objects[i].is_intern(x,y)){
                obj_selected = board.objects[i];
                obj = board.objects[i];
            }
        }

        var index = board.objects.indexOf(obj);
        board.objects.splice(index,1);
        console.log(index);
        board.show();
    });
};

Tools.prototype.move = function(x,y) {
    var x0,y0;
    sel = this.select_xy;
    var board = this.board;
    this.listenerMouseDragAndDrop(function(x,y){
        x0 = x;
        y0 = y;
        var obj = null;
        for (var i = 0; i < board.objects.length; i++) {
            var obj_selected;
            if(board.objects[i].is_intern(x,y)){
                obj_selected = board.objects[i];
                obj = board.objects[i];
            }
        }
        board.selected_object = obj;
        board.show();
    },function(x,y){
        board.selected_object.translation(x,y);
        board.show();
    },function(x,y){
        board.show();
    });
};

Tools.prototype.scale = function(x,y) {
    var x0,y0;
    sel = this.select_xy;
    var board = this.board;
    this.listenerMouseDragAndDrop(function(x,y){
        x0 = x;
        y0 = y;
        var obj = null;
        for (var i = 0; i < board.objects.length; i++) {
            var obj_selected;
            if(board.objects[i].is_intern(x,y)){
                obj_selected = board.objects[i];
                obj = board.objects[i];
            }
        }
        board.selected_object = obj;
        board.show();
    },function(x,y){
        board.selected_object.scale(Math.abs((x-x0)/x0),Math.abs((y-y0)/y0));
        board.show();
    },function(x,y){
        board.show();
    });
};

Tools.prototype.rotate = function(x,y) {
    var x0,y0;
    sel = this.select_xy;
    var board = this.board;
    this.listenerMouseDragAndDrop(function(x,y){
        x0 = x;
        y0 = y;
        var obj = null;
        for (var i = 0; i < board.objects.length; i++) {
            var obj_selected;
            if(board.objects[i].is_intern(x,y)){
                obj_selected = board.objects[i];
                obj = board.objects[i];
            }
        }
        board.selected_object = obj;
        board.show();
    },function(x,y){
        board.selected_object.rotate(Math.PI*(x+y)/180);
        board.show();
    },function(x,y){
        board.show();
    });
};







/*
* Class que representa a tela editvel
*/
function Board(canvasID){
    this.canvasID = canvasID;
    this.current_color = [0,0,0,255];
    this.current_pattern= PATTERN.SOLID;

    //Os objetos que seram impressos na tela na ordem
    this.objects = [];
    this.selected_object = null;
    
    this.element = document.getElementById(canvasID);
    this.context = this.element.getContext("2d");

    this.width = this.element.width;
    this.height = this.element.height;

    this.board = this.context.createImageData(this.width, this.height);
    this.buffer = this.context.createImageData(this.width, this.height);
}

Board.prototype.show = function() {
    this.clear();
    var selected_object;
    for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].draw(this);
    }
    if (this.selected_object) {
        this.selected_object.select(this);
    }
    this.context.putImageData(this.board, 0, 0);
};

Board.prototype.clear = function() {
    this.board = this.context.createImageData(this.width, this.height);
    this.buffer = this.context.createImageData(this.width, this.height);
    this.context.putImageData(this.board, 0, 0);
};

Board.prototype.clean = function() {
    this.objects = [];
    this.show();
};

//return color of pixel
Board.prototype.getPixelColor = function(x, y) {
    color = [];
    index = (x + y * this.buffer.width) * 4;
    color.push(this.buffer.data[index+0]);
    color.push(this.buffer.data[index+1]);
    color.push(this.buffer.data[index+2]);
    color.push(this.buffer.data[index+3]);
    return color;
};

/*
* Class que desenha no editor
*/

function Draw(board){
    this.board = board;
}

/*
*   Put a pixel in editor
*   color = [r,g,b,a]
*/
Draw.prototype.pixel = function(x, y, color) {
    index = (x + y * this.board.width) * 4;
    this.board.buffer.data[index+0] = color[0];
    this.board.buffer.data[index+1] = color[1];
    this.board.buffer.data[index+2] = color[2];
    this.board.buffer.data[index+3] = color[3];
};

//Patterns of line
var PATTERN = {
    SOLID: function(iterable){
        return true;
    },
    DOTTED: function(iterable){
        return iterable%10===0;
    },
    DASHED: function(iterable){
        return iterable%10!==0 && iterable%10!=1 && iterable%10!=2;
    },
    DOTTED_DASHED: function(iterable){
        return (iterable%15===0 || iterable%15>4 && iterable%15<11)  ;
    }
};

Draw.prototype.fill = function(xc, yc, current_color, target_color) {
    var queue = [];
    queue.push([xc,yc]);
    console.log(current_color,target_color);
    for (var i = queue[0]; queue.length>0; i = queue.shift()) {
        var e = i[0];
        var w = i[0];
        //console.log(this.board.getPixelColor(e,i[1]).toString(),current_color.toString());
        while(this.board.getPixelColor(e,i[1]).toString() == current_color.toString() && e < this.board.width){
            e++;
        }
        while(this.board.getPixelColor(w,i[1]).toString() == current_color.toString() && w > 0){
            w--;
        }
        for (var n = w; n<e; n++ ) {
            this.pixel(n, i[1], target_color);
            if (this.board.getPixelColor(n,i[1]+1).toString() == current_color.toString()){
                queue.push([n,i[1]+1]);
            }
            if (this.board.getPixelColor(n,i[1]-1).toString() == current_color.toString()){
                queue.push([n,i[1]-1]);
            }
        }
    }
};



/*
*   Interface to manipulate object
*
*/
function Layer(){
    this.enveloper = [0,0,0,0];
    this.values = {
        "x0": 0,
        "y0": 0,
        "x1": 0,
        "y1": 0,
        "color": [0,0,0,255],
        "fill": [0,0,0,255],
        "pattern": PATTERN.SOLID
    };
    this.selected = false;
}

Layer.prototype.draw = function(board) {
    // Used to present in board 
    throw new NotImplementedYet("draw");

};

Layer.prototype.fill = function(color){
    throw new NotImplementedYet("draw");
};

Layer.prototype.translation = function(dx,dy) {
    this.values["x0"]= this.values["x0"]+dx;
    this.values["y0"]= this.values["y0"]+dy;
    this.values["x1"]= this.values["x1"]+dx;
    this.values["y1"]= this.values["y1"]+dy;

    var d = this.intervalo(this.values["x0"],this.values["y0"],this.values["x1"],this.values["y1"]);
    this.enveloper = [d[0]-4,d[1]-4,d[2]+4,d[3]+4];
};

Layer.prototype.scale = function(g_x,g_y) {
    this.values["x1"]= this.values["x0"]+(this.values["x1"]-this.values["x0"])*g_x;
    this.values["y1"]= this.values["y0"]+(this.values["y1"]-this.values["y0"])*g_y;
    var d = this.intervalo(this.values["x0"],this.values["y0"],this.values["x1"],this.values["y1"]);
    this.enveloper = [d[0]-4,d[1]-4,d[2]+4,d[3]+4];
};

Layer.prototype.rotate = function(board) {
    // Used to rotate 
    throw new NotImplementedYet("rotate");
};

Layer.prototype.pixel = function(x, y, color, board) {
    index = (x + y * board.width) * 4;
    board.board.data[index+0] = color[0];
    board.board.data[index+1] = color[1];
    board.board.data[index+2] = color[2];
    board.board.data[index+3] = color[3];
};

Layer.prototype.select = function(board) {
    e = this.enveloper;
    rect = new Rect(e[0], e[1], e[2], e[3], [255,0,255,255], PATTERN.DASHED);
    rect.draw(board);
    this.selected = true;
};

Layer.prototype.is_intern = function(x,y) {
    d = this.enveloper;

    if (x < d[2] && x>d[0] && y < d[3] && y > d[1]) {
        return true;
    }
    return false;
};

Layer.prototype.intervalo = function(x0,y0,x1,y1) {
    x_max = Math.max(x0,x1);
    x_min = Math.min(x0,x1);
    y_max = Math.max(y0,y1);
    y_min = Math.min(y0,y1);
    return [x_min,y_min,x_max,y_max];
};

/*
    Draw line
*/


function Line(x0, y0, x1, y1, color, pattern){
    d = this.intervalo(x0, y0, x1, y1);
    this.enveloper = [d[0]-4,d[1]-4,d[2]+4,d[3]+4];
    this.values = {
        "x0": x0,
        "y0": y0,
        "x1": x1,
        "y1": y1,
        "color": color,
        "pattern":pattern
    };
}
// Heranca 
Line.prototype = new Layer();

Line.prototype.draw = function(board) {
    var x0 = this.values["x0"];
    var y0 = this.values["y0"];
    var x1 = this.values["x1"];
    var y1 = this.values["y1"];
    var color = this.values["color"];
    var pattern = this.values["pattern"];
    var dx = x1-x0;
    var dy = y1-y0;
    var n_passo = Math.max(Math.abs(dx),Math.abs(dy));
    var xin = dx/n_passo;
    var yin = dy/n_passo;

    for (var i = 0; i <= n_passo+1; i++) {
        // if (pattern(i)) {
            this.pixel(Math.round(x0), Math.round(y0),color,board);
            this.pixel(Math.round(x0), Math.round(y0-1),color,board);
            this.pixel(Math.round(x0-1), Math.round(y0),color,board);
            this.pixel(Math.round(x0-1), Math.round(y0-1),color,board);
        // }
        x0 = x0 + xin;
        y0 = y0 + yin;
    }

};

Line.prototype.rotate = function(angle) {
    console.log(angle);
    var xc = (this.values["x0"]+this.values["x1"])/2;
    var yc = (this.values["y0"]+this.values["y1"])/2;

    this.translation(-xc,-yc);
    console.log(this.values);
    var x = this.values["x0"];
    var y = this.values["y0"];
    var x0_ =  x*Math.cos(angle) + y*Math.sin(angle);
    var y0_ = -y*Math.cos(angle) + y*Math.sin(angle);
    this.values["x0"] = x;
    this.values["y0"] = y;

    x = this.values["x1"];
    y = this.values["y1"];
    var x1_ =  x*Math.cos(angle) + y*Math.sin(angle);
    var y1_ = -y*Math.cos(angle) + y*Math.sin(angle);
    this.values["x1"] = x;
    this.values["y1"] = y;
    console.log(this.values);
    this.translation(xc,yc);

};

/*
    Object circle
*/

function Circle(x0, y0, x, y, color, pattern) {
    var dxm = Math.round(Math.abs(Math.max(x/2,x0/2)-Math.min(x/2,x0/2)));
    var dym = Math.round(Math.abs(Math.max(y/2,y0/2)-Math.min(y/2,y0/2)));
    var xc = x0;
    var yc = y0;
    var r = Math.sqrt(Math.pow(Math.max(x,x0)-Math.min(x,x0),2)+Math.pow(Math.max(y,y0)-Math.min(y,y0),2));
    this.values = {
        "xc": xc,
        "yc": yc,
        "r": r,
        "color": color,
        "pattern":pattern
    };
    this.enveloper = this.intervalo(xc-r-4,yc+r+4,xc+r+4,yc-r-4);
}

Circle.prototype = new Layer();

Circle.prototype.draw = function(board) {
    var xc = this.values["xc"];
    var yc = this.values["yc"];
    var r = this.values["r"];
    var color = this.values["color"];
    var pattern = this.values["pattern"];

    var count = 0;
    for (var i = 0.0; i <= 360.0; i+=0.05) {
        count++;
        if (pattern(count)) {
            var angle = i*Math.PI/180;
            var x = Math.round(xc+r*Math.cos(angle));
            var y = Math.round(yc+r*Math.sin(angle));
            this.pixel(x, y, color, board);
        }
    }
};

Circle.prototype.translation = function(dx,dy) {
    this.values["xc"]= this.values["xc"]+dx;
    this.values["yc"]= this.values["yc"]+dy;

    var xc = this.values["xc"];
    var yc = this.values["yc"];
    var r = this.values["r"];
    var color = this.values["color"];
    var pattern = this.values["pattern"];
    this.enveloper = this.intervalo(xc-r-4,yc+r+4,xc+r+4,yc-r-4);
};

Circle.prototype.scale = function(g_x,g_y) {
    this.values["r"] = this.values["r"] * Math.min(g_x,g_y);
    var xc = this.values["xc"];
    var yc = this.values["yc"];
    var r = this.values["r"];
    var color = this.values["color"];
    var pattern = this.values["pattern"];
    this.enveloper = this.intervalo(xc-r-4,yc+r+4,xc+r+4,yc-r-4);
};

function Rect(x0, y0, x1, y1, color, pattern){
    d = this.intervalo(x0, y0, x1, y1);
    this.enveloper = [d[0]-4,d[1]-4,d[2]+4,d[3]+4];

    this.selected = false;
    this.values = {
        "x0": x0,
        "y0": y0,
        "x1": x1,
        "y1": y1,
        "color": color,
        "pattern":pattern
    };
}

Rect.prototype = new Layer();

Rect.prototype.draw = function(board) {
    // function to create line
    rect = this;
    line = function(x0, y0, x1, y1, color, pattern){
        var dx = x1-x0;
        var dy = y1-y0;
        var n_passo = Math.max(Math.abs(dx),Math.abs(dy));
        var xin = dx/n_passo;
        var yin = dy/n_passo;

        for (var i = 0; i <= n_passo+1; i++) {
            if (pattern(i)) {
                rect.pixel(Math.round(x0), Math.round(y0),color,board);
            }
            x0 = x0 + xin;
            y0 = y0 + yin;
        }
    };

    var x0 = this.values["x0"];
    var y0 = this.values["y0"];
    var x = this.values["x1"];
    var y = this.values["y1"];
    var color = this.values["color"];
    var pattern = this.values["pattern"];

    line(x0, y0, x0, y, color, pattern);
    line(x0, y, x, y, color,pattern);
    line(x,y,x,y0,color,pattern);
    line(x,y0,x0,y0,color,pattern);
};



