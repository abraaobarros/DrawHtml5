# DrawHtml5

Javascript Plataform to make and manipulate simple draws.

## Install

- copy draw.js file to your project
- link file on html file

## Setup

add this code on top of your <body>

```
$(document).ready(function() {
	    b = new Board("canvas1");
		tool = new Tools(b);
	});
```
add board on your body
```
<canvas style="border:1px solid black"id="canvas1" width="400", height="500">
```

## Actions
- tool.drawline() 
- tool.drawcircle() 
- tool.drawrect() 
- tool.select() 
- tool.move() 
- tool.scale() 
- tool.delete() 
- tool.rotate() 
- tool.fill() 
- tool.clean()
	
## Personalize

- Color:
```	
<a href="#" id="blue" onclick="b.current_color = [0,0,255,255]" ><span class="cor blue"></span></a>-->
<a href="#" id="green" onclick="b.current_color = [0,255,0,255]" ><span class="cor green"></span></a>-->
<a href="#" id="red" onclick="b.current_color = [255,0,0,255]" ><span class="cor red"></span></a>-->
```	
- Pattern
```	
<a href="#"  onclick="b.current_pattern = PATTERN.SOLID" ><span class="line solid selected"><hr></span></a>-->
<a href="#"  onclick="b.current_pattern = PATTERN.DASHED" ><span class="line dashed"><hr></span></a>-->
<a href="#"  onclick="b.current_pattern = PATTERN.DOTTED" ><span class="line dotted"><hr></span></a>-->
```	
