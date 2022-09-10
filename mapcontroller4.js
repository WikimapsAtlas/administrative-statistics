jscolor.presets.default = {
	previewPosition:'right'
};

jscolor.presets.leftbutton = {
	previewPosition:'left'
};
jscolor.presets.rightbutton = {
	previewPosition:'right'
};

var legendelementid = 1;
var currentPaintingColorId = "";
var currentPaintingColor = "";
var currentSelectedPaintingColorButton ="";
var defaultStrokeWidth = '1';
var defaultStrokeColor = 'black';
var currentPlotType="";
var initialx = 0;
var initialy = 0;
var initialelx = 0;
var initialely = 0;
var scalex = 1;
var scaley = 1;
var initialPointer = 'default';
var svg = 0;
var previousmovex = 0;
var previousmovey = 0;


function loadlisteners(){
	var x = document.getElementsByClassName("mapitem");
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].addEventListener("mouseover", highlightElement);
		x[i].addEventListener("mouseout", shadowElement);
		x[i].addEventListener("click", editElement);
	}
}

function highlightElement(){
	
	defaultStrokeColor = this.style.stroke;
	//defaultStrokeWidth  = this.style['stroke-width'];
	
	this.style.stroke = '#ff0000';
	this.style['stroke-width'] = 5;
	selectedId = this.id;
}

function shadowElement(){
	this.style.stroke = defaultStrokeColor; 
	this.style['stroke-width'] = defaultStrokeWidth;
}

function editElement(e){
	
	var selected = currentPlotType;
	
	switch (selected) {
	  case 'clr':
		var x = document.getElementsByClassName('onmapclrselectors');
		
		for (i = 0; i < x.length; i++)
			x[i].setAttribute("style", 'display:none');
		
		var elmnt =document.getElementById("onmapclrselector"+this.id);
		if (elmnt==null || elmnt=='') {
			elmnt = document.createElement('input');
			elmnt.setAttribute("id", "onmapclrselector"+this.id);
			elmnt.setAttribute("class", "onmapclrselectors");
			elmnt.setAttribute("type", "text");
			elmnt.setAttribute("data-jscolor", "");
			elmnt.setAttribute("size", "6");
			document.getElementById('servicecontainer').appendChild(elmnt);
		}		
		elmnt.setAttribute("style", "position:absolute; left:"+e.pageX+"px;top:"+e.pageY+"px;");
		elmnt.setAttribute("onchange", "document.getElementById('select_color"+this.id+"').jscolor.fromString(this.jscolor.toString());document.getElementById('select_color"+this.id+"').onchange();this.jscolor.hide(); this.style.display='none';");
		elmnt.setAttribute("onfocusout", "this.style.display='none';");
		jscolor.install();
		elmnt.jscolor.fromString(document.getElementById('select_color'+this.id).jscolor.toString());
		elmnt.focus();
		elmnt.jscolor.show();
		//document.getElementById('select_color'+this.id).jscolor.show();
		break;
	case 'num':
		var x = document.getElementsByClassName('onmapnumselectors');
		
		for (i = 0; i < x.length; i++)
			x[i].setAttribute("style", 'display:none');
		
		var elmnt =document.getElementById("onmapnumselector"+this.id);
		if (elmnt==null || elmnt=='') {
			elmnt = document.createElement('input');
			elmnt.setAttribute("id", "onmapnumselector"+this.id);
			elmnt.setAttribute("class", "onmapnumselectors");
			elmnt.setAttribute("value", document.getElementById('select_value'+this.id).value);
			elmnt.setAttribute("type", "text");
			elmnt.setAttribute("size", "6");
			document.getElementById('servicecontainer').appendChild(elmnt);
		}		
		elmnt.setAttribute("style", "position:absolute; left:"+e.pageX+"px;top:"+e.pageY+"px;");
		elmnt.setAttribute("onchange", "document.getElementById('select_value"+this.id+"').value = this.value; document.getElementById('select_value"+this.id+"').onchange();this.style.display='none';");
		elmnt.setAttribute("onfocusout", "this.style.display='none';");
		elmnt.focus();
		//document.getElementById('select_color'+this.id).jscolor.show();
		break;
	  case 'pie':
		toggleMenuItemOnMousePosition('container-piechart'+this.id);
		break;
	  case 'mandates':
		toggleMenuItemOnMousePosition('container-mand'+this.id);
		break;
	  case 'legend':
		var colel = document.getElementById(currentPaintingColorId);
		if (colel != null){
			this.style.fill = colel.jscolor.toString();
			groupnum = currentPaintingColorId.replace('color_litem', '');
			//this.classList.add("mapcolorgroup"+groupnum);
			this.setAttribute('class', "mapitem mapcolorgroup" + groupnum);
			document.getElementById(("select_color"+this.id)).jscolor.fromString(colel.jscolor.toString());
			document.getElementById(("select_legentry4reg"+this.id)).value = groupnum;
		}
		break;
	case 'bubble':
		var elmnt =document.getElementById("onmapbubbleselector"+this.id);
		if (elmnt==null || elmnt=='') {
			elmnt = document.createElement('input');
			elmnt.setAttribute("id", "onmapbubbleselector"+this.id);
			elmnt.setAttribute("class", "onmapbubbleselectors");
			elmnt.setAttribute("value", document.getElementById('bubble_value'+this.id).value);
			elmnt.setAttribute("type", "text");
			elmnt.setAttribute("size", "6");
			document.getElementById('servicecontainer').appendChild(elmnt);
		}		
		elmnt.setAttribute("style", "position:absolute; left:"+e.pageX+"px;top:"+e.pageY+"px;");
		elmnt.setAttribute("onchange", "document.getElementById('bubble_value"+this.id+"').value = this.value; document.getElementById('bubble_value"+this.id+"').onchange();this.style.display='none';");
		elmnt.setAttribute("onfocusout", "this.style.display='none';");
		elmnt.focus();
		break;
		default:
	}
	
	
}

function ShowMapChartLayer (selection) {
	document.getElementById("mapplot-pie").style.display = 'none';
	document.getElementById("mapplot-mand").style.display = 'none';
	document.getElementById("mapplot-circle").style.display = 'none';
	
	switch (selection) {
	  case 'pie':
		document.getElementById("mapplot-pie").style.display = 'inline';
		break;
	  case 'mandates':
		document.getElementById("mapplot-mand").style.display = 'inline';
		break;
	case 'bubble':
		document.getElementById("mapplot-circle").style.display = 'inline';
		break;
	  default:
	}
}

function grabSVGElement (event){
	initialPointer = document.body.style.cursor;
	document.body.style.cursor = 'move';
	
	svg = document.getElementById('svgmap');
	var pt = svg.createSVGPoint();
	pt.x = event.pageX;
	pt.y = event.pageY;
	pt = pt.matrixTransform(svg.getScreenCTM().inverse());
	
	initialelx = this.getAttribute("x") - pt.x;
	initialely = this.getAttribute("y") - pt.y;
	
	previousmovex = pt.x;
	previousmovey = pt.y;
	
	this.setAttribute('isMoving', 'true');

	//console.log(`clickx: ${event.screenX} elx: ${initialelx} bboxwidth: ${svg.viewBox.baseVal.width} clientwidth: ${svg.clientWidth} scalex: ${scalex}`);	
}

function moveSVGElement (event){
	
	if (this.getAttribute('isMoving') == 'true') {
			
		var pt = svg.createSVGPoint();
		pt.x = event.pageX;
		pt.y = event.pageY;
		pt = pt.matrixTransform(svg.getScreenCTM().inverse());
		
		this.setAttribute("x", pt.x + initialelx);
		this.setAttribute("y", pt.y + initialely);
	}
	//console.log(`clickx: ${event.screenX} elx: ${newx}`);	
}

function moveSVGElementbyTranslate (event){
	
	if (this.getAttribute('isMoving') == 'true') {
			
		var pt = svg.createSVGPoint();
		pt.x = event.pageX;
		pt.y = event.pageY;
		pt = pt.matrixTransform(svg.getScreenCTM().inverse());
		
		var newx = this.transform.baseVal.consolidate().matrix.e + pt.x - previousmovex;
		var newy = this.transform.baseVal.consolidate().matrix.f + pt.y - previousmovey;
		this.transform.baseVal.consolidate().matrix.e = newx;
		this.transform.baseVal.consolidate().matrix.f = newy;
		
		previousmovex = pt.x;
		previousmovey = pt.y;
	}
	//console.log(`clickx: ${event.screenX} elx: ${newx}`);	
}

function moveSVGElementwithChildren (event){
	
	if (this.getAttribute('isMoving') == 'true') {
		
		var pt = svg.createSVGPoint();
		pt.x = event.pageX;
		pt.y = event.pageY;
		pt = pt.matrixTransform(svg.getScreenCTM().inverse());
		
		var newx = pt.x + initialelx;
		var newy = pt.y + initialely;
		
		var newx1 = 1*this.getAttribute('x') + pt.x - previousmovex;
		var newy1 = 1*this.getAttribute('y') + pt.y - previousmovey;
		
		this.setAttribute("x", newx1);
		this.setAttribute("y", newy1);
		//console.log(`${newx} ${newy}`);
		
		for (let i = 0; i < this.children.length; i++) {
			if (this.children[i].getAttribute("x")) this.children[i].setAttribute("x", 1*this.children[i].getAttribute('x') + pt.x - previousmovex);
			if (this.children[i].getAttribute("y")) this.children[i].setAttribute("y", 1*this.children[i].getAttribute('y') + pt.y - previousmovey);
		}
		
		previousmovex = pt.x;
		previousmovey = pt.y;
	}
	
}

function fixSVGElement (){
	document.body.style.cursor = initialPointer;
	this.removeAttribute('isMoving');
}

function makeMovableSVGElement(el){
	el.addEventListener("mousedown", grabSVGElement);
	document.addEventListener("mousemove", moveSVGElement.bind(el));
	el.addEventListener("mouseup", fixSVGElement);
}

function makeMovableSVGElementWithChildren(el){
	el.addEventListener("mousedown", grabSVGElement);
	document.addEventListener("mousemove", moveSVGElementwithChildren.bind(el));
	el.addEventListener("mouseup", fixSVGElement);
}

function makeMovableSVGElementbyTranslate(el){
	el.addEventListener("mousedown", grabSVGElement);
	document.addEventListener("mousemove", moveSVGElementbyTranslate.bind(el));
	el.addEventListener("mouseup", fixSVGElement);
}

function setColorSvgElements(classname, color, empty=false)
{
	var elements = document.getElementsByClassName(classname);
	
	for (i = 0; i < elements.length; i++){
		
		if(empty)
			elements[i].style.fill = "none";
		else
			elements[i].style.fill = color;
	}
}

function setColorSvgElement(id, color, empty=false)
{
	var element = document.getElementById(id);
	
	if(empty)
		element.style.fill = "none";
	else
		element.style.fill = color;
}

function setColorInputElementsFromGroup(selectedlegendid, color)
{
	var el = document.getElementsByClassName('mapcolorgroup' + selectedlegendid);
	
	for (i = 0; i < el.length; i++){
		var inpel = document.getElementById("select_color" + el[i].id); 
		inpel.jscolor.fromString(color);
	}
	
	var el = document.getElementsByClassName('pieelmnt-v' + (selectedlegendid-1));
	
	for (i = 0; i < el.length; i++){
		el[i].style.fill = color;
	}
	
	var el = document.getElementsByClassName('mnditem-v' + (selectedlegendid-1));
	
	for (i = 0; i < el.length; i++){
		el[i].style.fill = color;
	}
}

function setShadedColorSvgElementFromLegend(id, legendentry, val, min, max)
{
	var x = document.getElementsByClassName('shadeslegend-item' + legendentry); 
	
	if (x.length == 0) return;
	
	var range = Math.abs((min < 0)?min - max:max - min);
	var step = range/(x.length-2);
	var index = Math.trunc((val-min)/step)+2;
	if (val < min) index = 1;
	if (val > max) index = x.length;
	var color = document.getElementById('shadeslegend-item'+legendentry+'_r'+index).getAttribute('fill');
	var element = document.getElementById(id);
	
	element.style.fill = color;
	return color;
}

function setSvgCircleRfromValue (id, value, startvalue, stopvalue)
{
	var element = document.getElementById("circle"+id);
	var r = getRadius4Value(value, startvalue, stopvalue);
	element.setAttribute("r", r);
}

function setTextSvgElement (id, text, black=true)
{
	var elmnt = document.getElementById("text"+id);
	
	if (elmnt != null){
		elmnt.textContent = text;
		elmnt.style.display = "inline";
	}
	
	var colorcntrl = document.getElementById("select_color"+id); 
	var textcol = "black";
	if(!black) {textcol = "white";}
	if (elmnt != null) elmnt.style.fill = textcol;
	
	
	var elmntcontainer = document.getElementById("textcontainer"+id);
	if(elmntcontainer != null) {
		elmntcontainer.style.fill = textcol;
	}
}

function setTextSvgElementColor (id, black=true)
{
	var elmnt = document.getElementById("text"+id);
	var colorcntrl = document.getElementById("select_color"+id); 
	var textcol = "black";
	if(!black) {textcol = "white";}
	if (elmnt != null) elmnt.style.fill = textcol;
	
	
	var elmntcontainer = document.getElementById("textcontainer"+id);
	if(elmntcontainer != null) elmntcontainer.style.fill = textcol;
}

function setTextSvgElementsColor (classname, black=true)
{
	var el = document.getElementsByClassName(classname);
	var textcol = "black";
	if(!black) {textcol = "white";}
	
	for (i = 0; i < el.length; i++){
		el[i].style.fill = textcol;
	}

}

function checkAll(checked)
{
	var el=document.getElementsByClassName("select_fill"); 
	for (var i = 0; i < el.length; i++) 
	{	
		el[i].checked = checked;
		el[i].onchange();
	}
}

function updateClassOnChange(classname)
{
	var el=document.getElementsByClassName(classname); 
	for (i = 0; i < el.length; i++) 
	{
		el[i].onchange();
	}
}

function selectNumType(selectedval)
{
	//document.getElementById('legend-levelswithtext').style.display = 'none';
	
	if (selectedval == 0) 
	{
		document.getElementById('gradientcolor-contpalcontrol').style.display = 'inline';
		document.getElementById('gradientcolor-discpalcontrol').style.display = 'none';
		document.getElementById('descretescale').style.display = 'none';
		//document.getElementById('rectlegend').style.display = 'inline';
	}
	else
	{
		document.getElementById('gradientcolor-contpalcontrol').style.display = 'none';
		document.getElementById('gradientcolor-discpalcontrol').style.display = 'inline';
		document.getElementById('descretescale').style.display = 'inline';
		//document.getElementById('rectlegend').style.display = 'none';
		//if (document.getElementById('hidevalues').checked) document.getElementById('legend-levelswithtext').style.display = 'inline';
		
	}
}

function plotPie(conttable, regionid)
{
	var list = [];
	var clrs = [];
	var sum = 0;
	var piesize = getMaxCircleRadius()/2;
	
	
	var x = conttable.getElementsByClassName('container-piechart-valueinput');
	for (i = 0; i < x.length; i++) {
		if ( x[i].value === "") x[i].value = '0';
		list[i] = 100*x[i].value; // multiply by 100 to deal with decimals better
		sum += list[i];		
		
		var itemclasses = x[i].getAttribute('class');
		clrid = itemclasses.split(' ')[1];
		clrid = clrid.replace('ref-', '');
		color = document.getElementById(clrid).jscolor.toString();
		clrs[i] = color;
	}
	
	var cumulativePercent = 0;
	
	
	var	group = document.getElementById("pie"+regionid);
	group.innerHTML = '';
	//svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	
	var mx = parseInt(group.getAttribute('x'));
	var my = parseInt(group.getAttribute('y'));
	group.setAttribute('x', mx - piesize);
	group.setAttribute('y', my - piesize);
	
	circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	circle.setAttribute("cx", piesize);
	circle.setAttribute("cy", piesize);
	circle.setAttribute("r", piesize);
	circle.setAttribute("style", "fill:none;stroke:black;stroke-width:1;");
	
	if (list.length <=1 ){
		if (list.length == 0) clr = 'none';
		else clr = clrs[0];
		circle.setAttribute("style", "fill:" + clr + ";stroke:black;stroke-width:1;"); 
		circle.setAttribute('class', "pieelmnt-v0");
		group.appendChild(circle);
		return;
	}
	
	
	var isfirstnotnull = 1;	
	for (var i = 0; i < list.length; i++){
		if (list[i] !=0)
		{	
				// destructuring assignment sets the two variables at once
				const [startX, startY] = getPieCoordinatesForPercent(cumulativePercent);
				cumulativePercent += list[i]/sum;
				const [endX, endY] = getPieCoordinatesForPercent(cumulativePercent);
					  
				// if the slice is more than 50%, take the large arc (the long way around)
				const largeArcFlag = list[i]/sum > .5 ? 1 : 0;
				
				// create an array and join it just for code readability
				const pathData = [
					`M ${startX*piesize+piesize} ${startY*piesize+piesize}`, // Move
					`A ${piesize} ${piesize} 0 ${largeArcFlag} 1 ${endX*piesize+piesize} ${endY*piesize+piesize}`, // Arc
					`L ${piesize} ${piesize}`, // Line
				].join(' ');	
				
			if (isfirstnotnull == 1) {
				const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
				pathEl.setAttribute('class', "pieelmnt-v" + i);
				pathEl.setAttribute('cx', piesize);
				pathEl.setAttribute('cy', piesize);
				pathEl.setAttribute('r', piesize);
				pathEl.setAttribute('style', 'stroke:black; stroke-width:0.5px; fill:'+clrs[i]);
				group.appendChild(pathEl);
				isfirstnotnull = 0;
			}	
			else{
				
				// create a <path> and append it to the <svg> element
				const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
				pathEl.setAttribute('class', "pieelmnt-v" + i);
				pathEl.setAttribute('d', pathData);
				pathEl.setAttribute('style', 'fill:'+clrs[i]);
				pathEl.style.fill = clrs[i];
				group.appendChild(pathEl);
			}
		}
		
	}	
	
	//group.appendChild(svg);
}

function getPieCoordinatesForPercent(percent) {
  y = -Math.cos(2 * Math.PI * percent);
  x = Math.sin(2 * Math.PI * percent);
  return [x, y];
}

function plotMandate(conttable, regionid)
{
	var list = [];
	var clrs = [];
	var mandates = 0;
	var mandlist = [];
	var mandclr = [];
	var indm = 0;
	var rectsize = getMaxCircleRadius()/4;
	
	
	var	cont = document.getElementById("mand"+regionid);
	cont.innerHTML = '';
		
	var x = conttable.getElementsByClassName('container-mand-valueinput');
	for (i = 0; i < x.length; i++) {
		if ( x[i].value === "") x[i].value = '0';
		list[i] = parseInt(x[i].value);
		mandates += list[i];		
		
		var itemclasses = x[i].getAttribute('class');
		clrid = itemclasses.split(' ')[1];
		clrid = clrid.replace('ref-', '');
		color = document.getElementById(clrid).jscolor.toString();
		clrs[i] = color;
		for (k = 0; k < list[i]; k++) {
			mandlist[indm] = i;
			mandclr[indm] = color;
			indm = indm + 1;
		}
	}
	
	colnum = mandates <= 4 ? 2 : (mandates <= 9 ? 3 : (mandates <= 16 ? 4 : 5));
	if (mandates >30) {colnum = 10;rectsize = getMaxCircleRadius()/12;spacesize=0;}
	var spacesize = rectsize/8;
	
	var mx = parseInt(cont.getAttribute('x'));
	var my = parseInt(cont.getAttribute('y'));
	
	cont.setAttribute('x', mx - colnum*rectsize/2);
	cont.setAttribute('y', my - (rectsize*mandates/colnum)/2);
	
	group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttribute("class", "gmand");
	
		for (var j = 0; j < mandates; j++){
			rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");	
			rect.setAttribute("x", 1 + (j%colnum)*(rectsize+spacesize));
			rect.setAttribute("y", 1 + Math.floor(j/colnum)*(rectsize+spacesize));
			rect.setAttribute("width", rectsize);
			rect.setAttribute("height", rectsize);
			rect.setAttribute("class", "mnditem-v" + mandlist[j]);
			rect.setAttribute("id", "mnditem" + regionid + "-" + parseInt(j));
			rect.setAttribute('style', 'stroke:black;stroke-width:'+spacesize/5+'px;fill:'+mandclr[j]);
			group.appendChild(rect);
			
		}

	cont.appendChild(group);
	
}

function openMapItemInterfaceOnPage(id)
{
	var selected = currentPlotType;
	
	switch (selected) {
	  case 'pie':
		toggleMenuItemOnMousePosition('container-piechart'+id);
		break;
	  case 'mandates':
		toggleMenuItemOnMousePosition('container-mand'+id);
		break;
	  default:
		console.log(`${selected} not found.`);
	}
}

function addNewLegendItem()
{
	var legendtable = document.getElementById('legend-control-table');
	var numrectel = 5;
	
	var inputitemtr = document.createElement("tr");
	inputitemtr.setAttribute('id', "inputline_litem"+legendelementid);
	var inputitemtdc = document.createElement("td");
	var inputitemtdl = document.createElement("td");
	var inputitemtdr = document.createElement("td");
	var inputitemtds = document.createElement("td");
	inputitemtdr.setAttribute('style', 'margin:auto;');
	var inputitemtdp = document.createElement("td");
	inputitemtdp.setAttribute('style', 'margin:auto;text-align :center;');
	
	var el = document.createElement("input");
	el.setAttribute("type", "text");
	el.setAttribute('id', "color_litem"+legendelementid);
	el.setAttribute('class', "legend_color_litem");
	el.setAttribute("data-jscolor", "");
	el.setAttribute("size", "6");
	el.setAttribute("value", "FEFEE9");
	el.setAttribute("autocomplete", "off");
	el.setAttribute("onChange", "setColorSvgElements('mapcolorgroup" + legendelementid+"', this.jscolor.toString());setColorInputElementsFromGroup(" + legendelementid + ", this.jscolor.toString()); setShadesPalette('shadeslegendclr-item" + legendelementid + "_clr', " + numrectel + ", " + Math.ceil(numrectel/2) + ", document.getElementById('color_litem"+legendelementid + "'));if(document.getElementById('checkshadedlegend').checked )document.getElementById('checkshadedlegend').onchange();updateMapLegend();updateInterfaceLegend();");	
	inputitemtdc.appendChild(el);
	inputitemtr.appendChild(inputitemtdc);
	
	var label = document.createElement("input");
	label.setAttribute("type", "text");
	label.setAttribute("size", "26");
	label.setAttribute('id', "name_litem"+legendelementid);
	label.setAttribute('class', "name_litem");
	label.setAttribute("onChange", "legendInputLabelChange(this);");
	inputitemtdl.appendChild(label);
	inputitemtr.appendChild(inputitemtdl);
	
	var legshadesvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	var legshadediv = document.createElement("div");
	var recth = 18;
	var rectw = 18;
	
	legshadesvg.setAttribute("width", numrectel*rectw);
	legshadesvg.setAttribute("height", recth);
	legshadesvg.setAttribute("onload", "setShadesPalette('shadeslegendclr-item" + legendelementid + "_clr'," + numrectel + ", " + Math.ceil(numrectel/2) + " , document.getElementById('color_litem"+legendelementid + "'));");
	
	for (i = 1; i <= numrectel; i++) 
	{		
		var rct = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		rct.setAttribute("id", "shadeslegend-item" + legendelementid + "_r" + i);
		rct.setAttribute("class", "shadeslegend-item" + legendelementid);
		rct.setAttribute("x", (i-1)*rectw);
		rct.setAttribute("y","0");
		rct.setAttribute("width", rectw);
		rct.setAttribute("height", recth);
		rct.setAttribute("fill", "none");
		rct.setAttribute("style", "stroke:#646464; stroke-width:1px;");
		legshadesvg.appendChild(rct);
		
		var clrin = document.createElement("input");
		clrin.setAttribute("type", "text");
		clrin.setAttribute('id', "shadeslegendclr-item" + legendelementid + "_clr" + i);
		clrin.setAttribute('class', "shadeslegendclr-item" + legendelementid);
		clrin.setAttribute("data-jscolor", "");
		clrin.setAttribute("onChange", "document.getElementById('shadeslegend-item" + legendelementid + "_r" + i +"').setAttribute('fill', this.jscolor.toString());");
		clrin.setAttribute("style", "display:none;");
		legshadediv.appendChild(clrin);
	}
	inputitemtds.appendChild(legshadesvg);
	inputitemtds.appendChild(legshadediv);
	inputitemtr.appendChild(inputitemtds);
	
	var buttonrm = document.createElement("button");
	buttonrm.textContent = "x";
	buttonrm.setAttribute('onclick', 'removeLegendItemFromButton("'+legendelementid + '")');
	buttonrm.setAttribute('style', 'background-color:#EE2610;color: white;font-weight:1000; font-size: 10px;');
	inputitemtdr.appendChild(buttonrm);
	inputitemtr.appendChild(inputitemtdr);
	
	var buttonpnt = document.createElement("button");
	buttonpnt.textContent = "o";
	buttonpnt.setAttribute('onclick', 'paintFromLegend(this, "color_litem'+legendelementid + '");');
	buttonpnt.setAttribute('style', 'background-color:#1491FE;color: white;font-weight:1000; font-size: 10px;');
	buttonpnt.setAttribute('class', 'selectclr_litem');
	buttonpnt.setAttribute('id', "painter_litem"+legendelementid);
	//inputitemtdp.appendChild(buttonpnt);
	inputitemtr.appendChild(inputitemtdp);
	
	legendtable.appendChild(inputitemtr);
	
	// add inputs for the pie charts
	var pietables = document.getElementsByClassName('container-piechart-table');
	for (i = 0; i < pietables.length; i++) 
	{
		var ttr = document.createElement("tr");
		ttr.setAttribute('class', "container-piechart-table-inputline_litem"+legendelementid);
		//ttr.setAttribute('class', "container-piechart-table-r");
		var ttd1 = document.createElement("td");
		ttd1.setAttribute('class', 'container-piechart-table-name_litem'+legendelementid);
		var ttd2 = document.createElement("td");
		var inval = document.createElement("input");
		inval.setAttribute("type", "text");
		inval.setAttribute("size", "6");
		inval.setAttribute("class", 'container-piechart-valueinput ref-color_litem' + legendelementid);
		ttd2.appendChild(inval);
		ttr.appendChild(ttd1);
		ttr.appendChild(ttd2);
		pietables[i].appendChild(ttr);
	} 
	
	// add inputs for the mandates plot
	var mandables = document.getElementsByClassName('container-mand-table');
	for (i = 0; i < mandables.length; i++) 
	{
		var ttr = document.createElement("tr");
		ttr.setAttribute('class', "container-mand-table-inputline_litem"+legendelementid);
		//ttr.setAttribute('class', "container-mandate-table-r");
		var ttd1 = document.createElement("td");
		ttd1.setAttribute('class', 'container-mand-table-name_litem'+legendelementid);
		var ttd2 = document.createElement("td");
		var inval = document.createElement("input");
		inval.setAttribute("type", "text");
		inval.setAttribute("size", "6");
		inval.setAttribute("class", 'container-mand-valueinput ref-color_litem' + legendelementid);
		ttd2.appendChild(inval);
		ttr.appendChild(ttd1);
		ttr.appendChild(ttd2);
		mandables[i].appendChild(ttr);
	} 
	
	// add inputs for the legends per region plot
	var tt = document.getElementsByClassName('select_legentry4reg');
	for (i = 0; i < tt.length; i++) 
	{
		var ttr = document.createElement("option");
		ttr.setAttribute('value', legendelementid);
		ttr.setAttribute('class', 'option_legentry4reg-name_litem' + legendelementid);
		tt[i].appendChild(ttr);
	} 
	
	// add inputs for the legend plot
	/*var cc = document.getElementsByClassName('mlegendin-dyn');
	var ttr = document.createElement("tr");
	ttr.setAttribute('class', "mlegend_litem"+legendelementid);
	var ttd1 = document.createElement("td");
		ttd1.setAttribute('class', 'container-mand-table-name_litem'+legendelementid);
		var ttd2 = document.createElement("td");
		var inval = document.createElement("input");
		inval.setAttribute("type", "text");
		inval.setAttribute("size", "6");
		inval.setAttribute("class", 'container-mand-valueinput ref-color_litem' + legendelementid);
		ttd2.appendChild(inval);
		ttr.appendChild(ttd1);
		ttr.appendChild(ttd2);
		mandables[i].appendChild(ttr);*/ 
	
	legendelementid = legendelementid+1;
	jscolor.install();
	
	updateMapLegend();
	updateInterfaceLegend();
	el.onchange();
	
	
}

function removeLegendItemFromButton(id)
{
	var trelement = document.getElementById('inputline_litem' + id);
	trelement.remove();
	
	var pietables = document.getElementsByClassName('container-piechart-table-inputline_litem'+id);
	var ll = pietables.length;
	for (i = ll; i > 0; i--) 
	{
		pietables[i-1].remove();
	}
	
	var mandtables = document.getElementsByClassName('container-mand-table-inputline_litem'+id);
	var ll = mandtables.length;
	for (i = ll; i > 0; i--) 
	{
		mandtables[i-1].remove();
	}
	
	var legendentries = document.getElementsByClassName('option_legentry4reg-name_litem'+ id);
	var ll = legendentries.length;
	for (i = ll; i > 0; i--) 
	{
		legendentries[i-1].remove();
	}
	
	updateMapLegend();
	updateInterfaceLegend();
}

function updateMapLegend(){
	
	var rectsize = getMaxCircleRadius()/2;
	var spacesize = rectsize/4;
	
	var x = document.getElementsByClassName('legend_color_litem');
	
	//color_litem
	
	var cont = document.getElementById('legend-container');
	cont.innerHTML = "";
	
	var contshaded = document.getElementById('shadedlegend-container');
	contshaded.innerHTML = "";
	
	var bx = contshaded.getBBox(); 	
	var startx = 0; //bx.x; 
	var starty = 0; //bx.y;
	
	var shadesnum = 0;
	var fontsizelimits = Math.round(0.18*getMaxCircleRadius());
	
	for (i = 0; i < x.length; i++) 
	{
		rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");	
		rect.setAttribute("x", 5);
		rect.setAttribute("y", 1 + i*(rectsize/2+spacesize));
		rect.setAttribute("height", rectsize/2);
		rect.setAttribute("width", rectsize);
		rect.setAttribute("style", 'stroke:black; stroke-width:1;');
		rect.style.fill = x[i].jscolor.toString();
				
		var n = document.getElementById(x[i].getAttribute("id").replace("color","name"));
		var txtx = document.createElementNS("http://www.w3.org/2000/svg", "text");
		//txtx.setAttribute("id", "textcontainer"+x[i].getAttribute("id").replace("graph", ""));
		txtx.setAttribute("x", 5+rectsize*1.25);
		txtx.setAttribute("y", 1 + i*(rectsize/2+spacesize)+rectsize/2);
		txtx.setAttribute('style', 'font-size:'+Math.round(0.25*getMaxCircleRadius())+'px;');
		//txtx.setAttribute("text-anchor", "middle");
		//txtx.setAttribute("dominant-baseline", "central");
		txtx.innerHTML = n.value;
		
		cont.append(txtx);
		cont.append(rect);
		
		var shades = document.getElementsByClassName(x[i].getAttribute("id").replace("color_l","shadeslegend-"));
			
		shadesnum = shades.length;
		for (k = 0; k < shades.length; k++) {
			var rectsh = document.createElementNS("http://www.w3.org/2000/svg", "rect");	
			rectsh.setAttribute("x", startx + k*rectsize);
			rectsh.setAttribute("y", starty + fontsizelimits + i*(rectsize/2+spacesize));
			rectsh.setAttribute("height", rectsize/2);
			rectsh.setAttribute("width", rectsize);
			rectsh.setAttribute("style", 'stroke:black; stroke-width:1;');
			rectsh.setAttribute('fill', shades[k].getAttribute('fill'));
			contshaded.appendChild(rectsh);
		}
		
		var txtx2 = txtx.cloneNode(true);
		txtx2.setAttribute("x", startx + shades.length*rectsize*1.05);
		txtx2.setAttribute("y", starty + fontsizelimits + i*(rectsize/2+spacesize)+rectsize/2);
		contshaded.appendChild(txtx2);
	}
		
	var txtlim = document.createElementNS("http://www.w3.org/2000/svg", "text");
	txtlim.setAttribute("x", startx + rectsize);
	txtlim.setAttribute("y", starty + fontsizelimits - rectsize*0.15);
	txtlim.setAttribute("id", "shadeslegend-lim1");
	txtlim.setAttribute('style', 'text-anchor: middle; font-size:'+fontsizelimits + 'px;');
	txtlim.innerHTML = document.getElementById('shadedlegentrymin').value;
	contshaded.appendChild(txtlim);
	
	var txtlim2 = txtlim.cloneNode(true);
	txtlim2.setAttribute("x", startx + (shadesnum-1)*rectsize);
	txtlim2.setAttribute("id", "shadeslegend-lim2");
	txtlim2.innerHTML = document.getElementById('shadedlegentrymax').value;
	contshaded.appendChild(txtlim2);
}

function updateInterfaceLegend(){
	
	var x = document.getElementsByClassName('legend_color_litem');
	
	var legendtable = document.getElementById('legend-table');
	legendtable.setAttribute('style', 'border-collapse: collapse; border: 1px solid  #ddd; margin: auto;');
		
	legendtable.innerHTML = "";
	
	for (i = 0; i < x.length; i++) 
	{	
		var inputitemtr = document.createElement("tr");
		legendtable.appendChild(inputitemtr);

		var inputitemtdc = document.createElement("td");
		inputitemtr.appendChild(inputitemtdc);
		inputitemtdc.setAttribute('width', '25px');
		inputitemtdc.setAttribute('style', 'padding:5px;');
		var divclr = document.createElement("div");
		inputitemtdc.appendChild(divclr);
		divclr.setAttribute('style', 'width:30px; height:20px; border: 1px solid  #ddd;');
		divclr.style['background-color'] = x[i].jscolor.toString();
		
		var inputitemtdl = document.createElement("td");
		inputitemtr.appendChild(inputitemtdl);
		var n = document.getElementById(x[i].getAttribute("id").replace("color","name"));
		inputitemtdl.textContent = n.value;
		inputitemtdl.setAttribute('width', '220px');
		inputitemtdl.setAttribute('style', 'padding-left:10px;');
		
		var inputitemtdp = document.createElement("td");
		inputitemtr.appendChild(inputitemtdp);
		inputitemtdp.setAttribute('width', '30px');
		var buttonpnt = document.createElement("button");
		buttonpnt.textContent = "o";
		buttonpnt.setAttribute('onclick', 'paintFromLegend(this, "'+ x[i].id + '");');
		buttonpnt.setAttribute('class', 'legendpaintbtn');
		buttonpnt.setAttribute('id', "painter_litem"+legendelementid);
		inputitemtdp.appendChild(buttonpnt);
	}
}

function paintFromLegend(btn, legid)
{
	var activePointer = 'crosshair';
	var inactivePointer = 'default';
	
	if (btn.classList.contains('legendpaintbtn-selected')){
		btn.classList.remove('legendpaintbtn-selected');
		//document.body.style.cursor = inactivePointer;
		document.getElementById('map').style.cursor = inactivePointer;
		currentPaintingColorId = '';
		return;
	}
	
	var x = document.getElementsByClassName('legendpaintbtn');
	
	for (i = 0; i < x.length; i++){
		x[i].classList.remove('legendpaintbtn-selected');
	}
	
	currentPaintingColorId = legid;
	btn.classList.add('legendpaintbtn-selected');
	//document.body.style.cursor = activePointer;
	document.getElementById('map').style.cursor = activePointer;
}

function legendInputLabelChange(el)
{
	var x = document.getElementsByClassName('container-piechart-table-'+el.id);
	for (i = 0; i < x.length; i++) 
	{
		x[i].textContent = el.value;
	}
	
	var x = document.getElementsByClassName('container-mand-table-'+el.id);
	for (i = 0; i < x.length; i++) 
	{
		x[i].textContent = el.value;
	}
	
	var x = document.getElementsByClassName('option_legentry4reg-'+el.id);
	for (i = 0; i < x.length; i++) 
	{
		x[i].textContent = el.value;
	}
	updateMapLegend();
	updateInterfaceLegend();
}

function getColor4Value(value)
{
	
	var startval = parseInt(document.getElementById('gradientstartvalue').value);
	var stoptval = parseInt(document.getElementById('gradientstopvalue').value);
	var paltype = document.getElementById('colselector').selectedIndex;
	if (paltype == 1) 
	{
		if (value >= stoptval) {
			return document.getElementById("plrect5").getAttribute("fill").replace("#","");
		}
		if (value <= startval) {
			return document.getElementById("plrect0").getAttribute("fill").replace("#","");
		}
		
		var range = Math.abs((startval < 0)?startval - stoptval:stoptval - startval);
		step = range/6;
		colind = Math.floor((value-startval)/step);
		return document.getElementById("plrect" + colind).getAttribute("fill").replace("#","");
	}
	else
	{
		var startcol = document.getElementById('gradientstartcolor').value.replace('#','');
		var stopcol = document.getElementById('gradientstopcolor').value.replace('#','');
		
		var val = value;
		
		if (value > stoptval) val = stoptval;
		if (value < startval) val = startval;
		
		var bigint1 = parseInt(startcol, 16);
		var r1 = (bigint1 >> 16) & 255;
		var g1 = (bigint1 >> 8) & 255;
		var b1 = bigint1 & 255;
		
		var bigint2 = parseInt(stopcol, 16);
		var r2 = (bigint2 >> 16) & 255;
		var g2 = (bigint2 >> 8) & 255;
		var b2 = bigint2 & 255;
		
		r = Math.round(r1 + ((val-startval)/(stoptval-startval))*(r2-r1));
		g = Math.round(g1 + ((val-startval)/(stoptval-startval))*(g2-g1));
		b = Math.round(b1 + ((val-startval)/(stoptval-startval))*(b2-b1));
		
		return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}
}

function getRadius4Value(value, startval, stoptval)
{
	var maxR = getMaxCircleRadius();
	//var startval = parseInt(document.getElementById('gradientstartvalue').value);
	//var stoptval = parseInt(document.getElementById('gradientstopvalue').value);
	var range = Math.abs(stoptval-startval);
	var r = maxR*(value - startval)/range;
	return r;//r>0.1*maxR?r:0.1*maxR;
}

function getMaxCircleRadius()
{
	var svg = document.getElementById('svgmap');
	const {x, y, width, height} = svg.viewBox.baseVal;
	var r = 0.08*Math.min(width, height);
	return r;
}

function setDiscretePalette(palname)
{
	var paletteobj = document.getElementById(palname).children;
	
	for (i = 0; i < paletteobj.length; i++) {
		document.getElementById("plrect" + i).setAttribute("fill", paletteobj[i].getAttribute("fill"));
		document.getElementById("descretescale-item" + i).setAttribute("fill", paletteobj[i].getAttribute("fill"));
		//document.getElementById("rectlegend-d" + i +'a').setAttribute("fill", paletteobj[i].getAttribute("fill"));
		}
}

function toggleVisiblity(id)
{
	var obj = document.getElementById(id);
	
	if (obj.style.display == "inline")
		obj.style.display = "none"
	else
		obj.style.display = "inline"
}

function toggleMenuItemOnMousePosition(id) {
	var el = document.getElementById(id);
	var yoffset = 0;
		
	toggleVisiblity(id);
	var bounding = el.getBoundingClientRect();
	
	if (event.y > document.documentElement.clientHeight*0.66) yoffset = bounding.height;
	
	el.style.top = (event.y - yoffset) + 'px';
	el.style.left =  event.x + 10 + 'px';
}

function openTextInWindow()
{
        var textToWrite = document.getElementById("map").innerHTML;
        var wnd = window.open('about:blank', '_blank', '');
        wnd.document.open();
        wnd.document.write(textToWrite);
        wnd.document.close();
}

function saveTextAsFile()
{
	var textToWrite = document.getElementById("svgmap").outerHTML;

	try {
		var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
		var fileNameToSaveAs = "map.svg";

		var downloadLink = document.createElement("a");

		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		if (window.webkitURL != null)
		{
				// Chrome allows the link to be clicked
				// without actually adding it to the DOM.
				downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		}
		else
		{
				// Firefox requires the link to be added to the DOM
				// before it can be clicked.

				downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
				downloadLink.onclick = destroyClickedElement;
				downloadLink.style.display = "none";
				document.body.appendChild(downloadLink);

		}

		downloadLink.click();
	}
	catch(err) {
			alert('Вашият браузър не подържа функцията за запазване на файла. Използвайте бутона за показване в отделен прозорец и запазете файла!');
	}
}

const parser = new DOMParser();

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    var x = document.getElementById('map');
	var doc = document.createRange().createContextualFragment(contents);
	x.innerHTML = "";
	x.appendChild(doc);
	Init();InitMap();
  };
  reader.readAsText(file, "UTF-8");
  //
}

var xhttp = new XMLHttpRequest();

function readSingleHttpFile(filename) {
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		   // Typical action to be performed when the document is ready: document.getElementById("demo").innerHTML = xhttp.responseText;
			var x = document.getElementById('map');
			var doc = document.createRange().createContextualFragment(xhttp.responseText);
			x.innerHTML = "";
			x.appendChild(doc);
			Init();InitMap();
		}
	};
	xhttp.open("GET", filename, true);
	xhttp.send();
}


function InitMap (){
	
	// text layer
	
	var svg = document.getElementById("svgmap");
	var x = document.getElementsByClassName("mapitem");
	createGraphContainers(svg);
		
	var textlayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
	var circlelayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
	var pielayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
	var mandlayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
	textlayer.setAttribute("id", "mapplot-text");
	circlelayer.setAttribute("id", "mapplot-circle");
	circlelayer.setAttribute("style", "display:none;");
	pielayer.setAttribute("id", "mapplot-pie");
	pielayer.setAttribute("style", "display:none;");
	mandlayer.setAttribute("id", "mapplot-mand");
	mandlayer.setAttribute("style", "display:none;");
	
	for (i = 0; i < x.length; i++){
		var elementcenter = getMapItemCenter(x[i]);
		var elid = x[i].getAttribute("id").replace("graph", "");
		//console.log(elementcenter.x elementcenter.y);
		var textitem = document.createElementNS("http://www.w3.org/2000/svg", "text");
		textitem.setAttribute("id", "textcontainer"+elid);
		textitem.setAttribute("class", "textcontainer connected2mapitem" +elid);
		textitem.setAttribute("x", elementcenter.x);
		textitem.setAttribute("y", elementcenter.y);
		textitem.setAttribute("text-anchor", "middle");
		textitem.setAttribute("dominant-baseline", "central"); 
		textitem.setAttribute("style", 'user-select: none;');
		makeMovableSVGElementWithChildren(textitem);
		
		var textitem1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
		textitem1.textContent = getMapitemName(document.getElementById(elid), false);
		textitem1.setAttribute("class", "nameofitemonmap");
		textitem1.setAttribute("x", elementcenter.x);
		textitem1.setAttribute("dy", '-0.6em');
		//textitem1.setAttribute("text-anchor", "middle");
		textitem.appendChild(textitem1);
		
		var textitem2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
		textitem2.setAttribute("id", "text"+elid);
		textitem2.setAttribute("class", "numbervalueonmap");
		textitem2.setAttribute("x", elementcenter.x);
		textitem2.setAttribute("dy", '1.2em');
		//textitem2.setAttribute("text-anchor", "middle");
		textitem.appendChild(textitem2);
		
		textlayer.appendChild(textitem);
		
		var circleitem = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		circleitem.setAttribute("id", "circle"+elid);
		circleitem.setAttribute("class", "circleitem connected2mapitem" +elid);
		circleitem.setAttribute("cx", elementcenter.x);
		circleitem.setAttribute("cy", elementcenter.y);
		circleitem.setAttribute("r", "30");
		circleitem.setAttribute("style", "fill:#B2B2FF; fill-opacity:0.5; stroke:black; stroke-width:1px;");
		circlelayer.appendChild(circleitem);
		
		var pieitem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		pieitem.setAttribute("id", "pie"+elid);
		pieitem.setAttribute("class", "pieitem connected2mapitem" +elid);
		pieitem.setAttribute("x", elementcenter.x);
		pieitem.setAttribute("y", elementcenter.y);
		//pieitem.setAttribute("d", "");
		//circleitem.setAttribute("style", "fill:#B2B2FF; fill-opacity:0.5; stroke:black; stroke-width:1px;");
		pielayer.appendChild(pieitem);
		
		var manditem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		manditem.setAttribute("id", "mand"+elid);
		manditem.setAttribute("class", "mandateitem connected2mapitem" +elid);
		manditem.setAttribute("x", elementcenter.x);
		manditem.setAttribute("y", elementcenter.y);
		//pieitem.setAttribute("d", "");
		//circleitem.setAttribute("style", "fill:#B2B2FF; fill-opacity:0.5; stroke:black; stroke-width:1px;");
		mandlayer.appendChild(manditem);
		
	}
	
	svg.appendChild(circlelayer);
	svg.appendChild(pielayer);
	svg.appendChild(mandlayer);
	svg.appendChild(textlayer);
	
	
	var widthb = svg.viewBox.baseVal.width;
	var heightb = svg.viewBox.baseVal.height;
	var xb = svg.viewBox.baseVal.x;
	var yb = svg.viewBox.baseVal.y;
	
	// scale
	var legel = document.getElementById("scale-container");	
	if (legel == null){
		legel = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		legel.setAttribute('id', "scale-container");
		legel.setAttribute('width', 0.2*widthb);
		legel.setAttribute('height', 0.04*heightb);
		legel.setAttribute('x', xb+0.78*widthb);
		legel.setAttribute('y', yb+0.93*heightb);
		svg.appendChild(legel);		
	}
	
	var scw = legel.getAttribute("width");
	var sch = legel.getAttribute("height");
	
	var leg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	leg.setAttribute("x", scw*0.1);
	leg.setAttribute("y", sch*0.25);
	leg.setAttribute("width", scw*0.8);
	leg.setAttribute("height", sch*0.35);
	leg.setAttribute("style", "fill:url(#scalegradient);stroke:#646464; stroke-width:1px;padding-bottom:5px;");
	
	var df1 = document.createElementNS("http://www.w3.org/2000/svg", "defs");
	var df2 = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");df2.setAttribute("id", "scalegradient");df2.setAttribute("x1", "100%");df2.setAttribute("x2", "0%");df2.setAttribute("y1", "0%");df2.setAttribute("y2", "0%");
	var df3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");df3.setAttribute("offset", "0"); df3.setAttribute("id","offsetstop1"); df3.setAttribute("style","stop-color:#BD0026;stop-opacity:1;");
	var df4 = document.createElementNS("http://www.w3.org/2000/svg", "stop");df4.setAttribute("offset", "1"); df4.setAttribute("id","offsetstop2"); df4.setAttribute("style","stop-color:#FFFFB2;stop-opacity:1;");
	
	df2.appendChild(df3);df2.appendChild(df4);df1.appendChild(df2);
	
	var tsize = Math.round(0.18*getMaxCircleRadius());
	var tstart = document.createElementNS("http://www.w3.org/2000/svg", "text");
	tstart.setAttribute("x", scw*0.1);
	tstart.setAttribute("y", sch*0.25+sch*0.36+tsize);
	tstart.setAttribute("id", 'scale-value-min');
	tstart.setAttribute("style", 'text-anchor:middle;font-size:'+tsize+'px;');
	tstart.textContent = "0";
	var tstop = document.createElementNS("http://www.w3.org/2000/svg", "text");
	tstop.setAttribute("x", scw*0.9);
	tstop.setAttribute("y", sch*0.25+sch*0.36+tsize);
	tstop.setAttribute("id", 'scale-value-max');
	tstop.setAttribute("style", 'text-anchor:middle;font-size:'+tsize+'px;');
	tstop.textContent = "1";
	
	var tscaletitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
	tscaletitle.setAttribute("x", scw*0.5);
	tscaletitle.setAttribute("y", sch*0.18);
	tscaletitle.setAttribute("id", "scale-measurementext");
	tscaletitle.setAttribute("style", 'text-anchor:middle;font-size:'+0.8*tsize+'px;');
	
	var svg = document.getElementById('svgmap');
	var width = svg.viewBox.baseVal.width;
	var ctitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
	ctitle.setAttribute("x", xb+width/2);
	ctitle.setAttribute("y", yb+heightb*0.05);
	ctitle.setAttribute("id", "title-custom");
	ctitle.setAttribute("style", 'text-anchor:middle;font-weight:bold;font-size:'+Math.round(0.3*getMaxCircleRadius())+'px;');
	svg.appendChild(ctitle);
	
	//tscaletitle.textContent = "unit";
	
	
	legel.appendChild(df1);
	legel.appendChild(tscaletitle);
	legel.appendChild(leg);
	legel.appendChild(tstart);
	legel.appendChild(tstop);
	
	var discrg = document.createElementNS("http://www.w3.org/2000/svg", "g");
	discrg.setAttribute("id", "descretescale");
	discrg.setAttribute("style", "display:none;");
	for (i = 0; i < 6; i++) 
	{
		var telmnt = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		telmnt.setAttribute("id", "descretescale-item" + i);
		telmnt.setAttribute("x", scw*0.1 + i*scw*0.8/6);
		telmnt.setAttribute("y", sch*0.25);
		telmnt.setAttribute("width", scw*0.8/6);
		telmnt.setAttribute("height", sch*0.35);
		telmnt.setAttribute("fill", "none");
		telmnt.setAttribute("style", "stroke:#646464; stroke-width:1px;");
		discrg.appendChild(telmnt);
	}
	
	var mid = document.createElementNS("http://www.w3.org/2000/svg", "path")
	mid.setAttribute('d', 'm ' + (scw*0.1 + 3*scw*0.8/6) + ',' + (sch*0.25 + sch*0.35) + ' v ' + sch*0.1);
	mid.setAttribute("style", "stroke:#646464; stroke-width:1px;");
	discrg.appendChild(mid);
	
	legel.appendChild(discrg);
	//setDiscretePalette('descrpal12');
		
	
	// add legend container if does not exist
	var legel2 = document.getElementById("legend-container");	
	if (legel2 == null){
		legel2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		legel2.setAttribute('id', "legend-container");
		legel2.setAttribute('width', 0.35*widthb);
		legel2.setAttribute('height', 0.35*heightb);
		legel2.setAttribute('x', xb + 0.8*widthb);
		legel2.setAttribute('y', yb + 0.7*heightb);	
		svg.appendChild(legel2);
	}
	
	// add shaded legend container if does not exist
	var legel3 = document.getElementById("shadedlegend-container");	
	if (legel3 == null){
		
		glegel2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
		glegel2.setAttribute('id', "shadedlegend-container");
		//glegel2.setAttribute('x', xb + 0.8*widthb);
		//glegel2.setAttribute('y', yb + 0.7*heightb);
		//glegel2.setAttribute('width', 0.35*widthb);
		//glegel2.setAttribute('height', 0.35*heightb);
		glegel2.setAttribute('transform', 'translate('+Math.round(xb + 0.8*widthb)+', '+Math.round(yb + 0.7*heightb)+')');
		glegel2.setAttribute("style", "display:none;");		
		
		svg.appendChild(glegel2);
	}
	
	
	makeMovableSVGElement(ctitle);
	makeMovableSVGElement(legel);
	makeMovableSVGElement(document.getElementById("legend-container"));
	makeMovableSVGElementbyTranslate(document.getElementById("shadedlegend-container"));
	
	loadlisteners();
	
	updateMapLegend();
}

function hideChartLayers(hide = true){
	if (hide){
		document.getElementById('mapplot-pie').style.display = 'none';
		document.getElementById('mapplot-mand').style.display = 'none';
		document.getElementById('mapplot-circle').style.display = 'none';
	}
}

function createGraphContainers(svg){
	var g = document.getElementsByClassName("mapitem-graph");
	if (g.length > 0) return;
	
	var gr = document.createElementNS("http://www.w3.org/2000/svg", "g");
	svg.appendChild(gr);
	var x = document.getElementsByClassName("mapitem");
	for (i = 0; i < x.length; i++){
		var bbox = x[i].getBBox();
		var st = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		st.setAttribute('class', 'mapitem-graph');
		st.setAttribute('id', 'graph'+x[i].id);
		st.setAttribute('x', bbox.x + bbox.width / 2);
		st.setAttribute('y', bbox.y + bbox.height/ 2);
		//console.log(`${bbox.x} : ${bbox.y}`);
		gr.appendChild(st);

	}
}

function getMapItemCenter(mapitem){
	var centers = mapitem.getElementsByClassName('itemcenter');	
	var boundingbox = mapitem.getBBox();
	
	if (centers.length > 0) boundingbox = centers[0].getBBox();
	
	var p = {x:0, y:0};
	p.x = boundingbox.x + boundingbox.width/2;
	p.y = boundingbox.y + boundingbox.height/2; 
	return p;
}

var f1;
var f2;
var f3;
var viewboxarray = []; 
	
function zoomin(el, isactive) {
	
	var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rect.setAttribute('style', 'stroke:#000000; stroke-width:1px;fill:none;')
	var plotobj = {'svg': el, 'rect': rect, 'draw': false};
	
	if(isactive) {
		
		f1 = setZoomRect.bind(plotobj);
		f2 = drawZoomRect.bind(plotobj);
		f3 = cutZoomRect.bind(plotobj);
		
		el.addEventListener('mousedown', f1);
		el.addEventListener('mousemove', f2);
		el.addEventListener('mouseup', f3);
		}
	else { 
		el.removeEventListener('mousedown', f1);
		el.removeEventListener('mousemove', f2);
		el.removeEventListener('mouseup', f3);
	}
}

function setZoomRect(ev){
	
	var pt = this.svg.createSVGPoint();
	pt.x = event.pageX;
	pt.y = event.pageY;
	pt = pt.matrixTransform(this.svg.getScreenCTM().inverse());
	this.svg.appendChild(this.rect);
		
	this.rect.setAttribute('x', pt.x);
	this.rect.setAttribute('y', pt.y);
	this.rect.setAttribute('width', '1');
	this.rect.setAttribute('height', '1');
	this.draw  = true;
}

function drawZoomRect(ev){
	
	if (this.draw){
		var pt = this.svg.createSVGPoint();
		pt.x = event.pageX;
		pt.y = event.pageY;
		pt = pt.matrixTransform(this.svg.getScreenCTM().inverse());
		this.rect.setAttribute('width',  Math.abs(pt.x - this.rect.getAttribute('x')));
		this.rect.setAttribute('height', Math.abs(pt.y - this.rect.getAttribute('y')));
	}
	
}

function cutZoomRect() {
	
	this.draw = false;
	this.svg.removeChild(this.rect);
	
	var box = this.svg.viewBox.baseVal;
	//if (this.rect.getAttribute('width')=='0' || box.height == this.rect.getAttribute('height')=='0') return;
	
	viewboxarray.push({x: box.x, y:box.y, width:box.width, height:box.height});
	
	box.x = this.rect.getAttribute('x');
	box.y =this.rect.getAttribute('y');
	box.width = this.rect.getAttribute('width');
	box.height = this.rect.getAttribute('height');
	this.svg.viewBox = box;
	
}

function zoomout(el) {

	if (viewboxarray.length > 0){
		var coord = viewboxarray.pop();
		var box = el.viewBox.baseVal;
		box.x = coord.x;
		box.y = coord.y;
		box.width = coord.width;
		box.height = coord.height;
		el.viewBox = box;
	}
	
}