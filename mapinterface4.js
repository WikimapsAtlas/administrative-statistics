
var descPalletteColors = [
	["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"],
	["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8856a7","#810f7c"],
	["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#43a2ca","#0868ac"],
	["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#e34a33","#b30000"],
	["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#2b8cbe","#045a8d"],
	["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#1c9099","#016c59"],
	["#f1eef6","#d4b9da","#c994c7","#df65b0","#dd1c77","#980043"],
	["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#c51b8a","#7a0177"],
	["#ffffcc","#d9f0a3","#addd8e","#78c679","#31a354","#006837"],
	["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"],
	["#ffffd4","#fee391","#fec44f","#fe9929","#d95f0e","#993404"],
	["#ffffb2","#fed976","#feb24c","#fd8d3c","#f03b20","#bd0026"],
	["#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"],
	["#edf8e9","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"],
	["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d","#a63603"],
	["#b2182b","#ef8a62","#fddbc7","#d1e5f0","#67a9cf","#2166ac"],
	["#d73027","#fc8d59","#fee090","#e0f3f8","#91bfdb","#4575b4"],
	["#b2182b","#ef8a62","#fddbc7","#e0e0e0","#999999","#4d4d4d"],
	["#8c510a","#d8b365","#f6e8c3","#c7eae5","#5ab4ac","#01665e"],
	["#d73027","#fc8d59","#fee08b","#d9ef8b","#91cf60","#1a9850"],
	["#e4e5e6","#c9cbce","#aeb1b6","#93979e","#757d86","#60646b"]
];

var fillvalue = "FEFEE9";
var pinnedElement = false;

function loadInterfaceListeners(){
	
	var x = document.getElementsByClassName("pinable");
	
	for (i = 0; i < x.length; i++) {
		x[i].addEventListener("click", pinChart);
	}
	
	document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
}

function pinChart (event){
	
	pinnedElement = this.textContent=="\u2606";
	var sym = this.textContent=="\u2605" ? "\u2606": "\u2605";
	var x = document.getElementsByClassName("menuitem-pinable");
	
	for (i = 0; i < x.length; i++) {
		DisableMenu(x[i], pinnedElement);
	}
	
	var x = document.getElementsByClassName("pinable");
	
	for (i = 0; i < x.length; i++) {
		x[i].textContent = "\u2606";
	}
	
	DisableMenu(this.parentNode, false);
	
	
	this.textContent=sym; 
	//event.stopPropagation();
}

function Init ()
{
	var flotingmenues = document.createElement("div");
	
	var x = document.getElementsByClassName("mapitem");	
	var cont = document.getElementById("managementarea");
	
	pInitRegionSelectionInterface();
	pInitColorInterface();
	pInitNumvalInterface();
	pInitLegendEntriesInterface();
	pInitPichartInterface();
	pInitMandatesInterface();
	pInitBubblechartInterface();
	
	addDiscreteColorPalette(descPalletteColors);
	selectMapType('mregions');HighlightMenu(document.getElementById('menuitemregions'));
	
	document.getElementById('menuitemregions').onclick();
	
	document.getElementById('servicecontainer').innerHTML = "";
	
	for (i = 0; i < x.length; i++){
		
		var regname = getMapitemName(x[i]);
		
		var div1 = document.createElement("div");
		div1.setAttribute("id", "container-mand"+x[i].getAttribute("id"));
		div1.setAttribute("class", "container-mand");
		var div1title = document.createElement("div");
		div1title.setAttribute("class", "popupitemtitle");
		div1title.innerHTML = regname;
		div1.appendChild(div1title);
		var tbl = document.createElement("table");
		tbl.setAttribute("id", "container-mand-table"+x[i].getAttribute("id"));
		tbl.setAttribute("class", "container-mand-table");
		div1.appendChild(tbl);
		var btn = document.createElement("button");
		btn.textContent = "Close";
		btn.setAttribute("onclick", "this.parentNode.style.display = 'none';");
		btn.setAttribute("style", "margin-left:10px;margin-right:10px;");
		div1.appendChild(btn);
		var btn = document.createElement("button");
		btn.textContent = "Plot";
		btn.setAttribute("onclick", "plotMandate(document.getElementById('container-mand-table"+x[i].getAttribute("id") + "'), '"+x[i].getAttribute("id")+"');");
		div1.appendChild(btn);
		
		var div2 = document.createElement("div");
		div2.setAttribute("id", "container-piechart"+x[i].getAttribute("id"));
		div2.setAttribute("class", "container-piechart");
		var div2title = document.createElement("div");
		div2title.setAttribute("class", "popupitemtitle");
		div2title.innerHTML = regname;
		div2.appendChild(div2title);
		var tbl = document.createElement("table");
		tbl.setAttribute("id", "container-piechart-table"+x[i].getAttribute("id"));
		tbl.setAttribute("class", "container-piechart-table");
		div2.appendChild(tbl);
		var btn = document.createElement("button");
		btn.textContent = "Close";
		btn.setAttribute("onclick", "this.parentNode.style.display = 'none';");
		btn.setAttribute("style", "margin-left:10px;margin-right:10px;");
		div2.appendChild(btn);
		var btn = document.createElement("button");
		btn.textContent = "Plot";
		btn.setAttribute("onclick", "plotPie(document.getElementById('container-piechart-table"+x[i].getAttribute("id") + "'), '"+x[i].getAttribute("id")+"');");
		btn.setAttribute("style", "margin-left:10px;margin-right:10px;");
		div2.appendChild(btn);
		
		document.getElementById('servicecontainer').appendChild(div1);
		document.getElementById('servicecontainer').appendChild(div2);
	}
	
	jscolor.install();
	
}

function pInitLegendEntriesInterface(){
	
	var x = document.getElementsByClassName("mapitem");
	var divcolorssettings = document.getElementById("mlegendreg-dyn-textarea");
	divcolorssettings.innerHTML = "";
	
	var ttableclrs = document.createElement("table");
	ttableclrs.setAttribute('style', 'border-collapse: collapse;')
	divcolorssettings.appendChild(ttableclrs);
	
	for (i = 0; i < x.length; i++){
		
		// create color selection for regions
		var trow = document.createElement("tr");
			
		var regname = getMapitemName(x[i]);
		
		var tcell = document.createElement("td");
		tcell.textContent = regname;
		trow.appendChild(tcell);
		
		var tcell = document.createElement("td");
		var el = document.createElement("select");
		el.setAttribute("id", "select_legentry4reg"+x[i].getAttribute("id"));
		el.setAttribute("class", "select_legentry4reg");
		el.setAttribute("style", "max-width:120px;");
		el.setAttribute("onChange", "if(this.value >=0){document.getElementById('"+x[i].getAttribute("id") + "').style.fill = document.getElementById('color_litem'+this.value).jscolor.toString(); document.getElementById('"+x[i].getAttribute("id") + "').setAttribute('class', 'mapitem mapcolorgroup'+this.value);document.getElementById('select_color"+x[i].getAttribute("id") + "').jscolor.fromString(document.getElementById('color_litem'+this.value).jscolor.toString());if(document.getElementById('checkshadedlegend').checked )document.getElementById('select_legval"+x[i].getAttribute("id") + "').onchange();}");
		
		var op = document.createElement("option");
		op.setAttribute('value', '-1');
		op.textContent = '---';
		el.appendChild(op);
		
		tcell.appendChild(el);
		trow.appendChild(tcell);
		
		var tcell = document.createElement("td");
		var inp = document.createElement("input");
		inp.setAttribute("id", "select_legval"+x[i].getAttribute("id"));
		inp.setAttribute("class", "select_legval");
		inp.setAttribute("type", "text");
		inp.setAttribute("size", "6");
		inp.setAttribute("style", "display:none;");
		inp.setAttribute("onChange", "c = setShadedColorSvgElementFromLegend('" + x[i].getAttribute("id")+"',Number(document.getElementById('select_legentry4reg"+x[i].getAttribute("id")+"').value), Number(this.value), Number(document.getElementById('shadedlegentrymin').value), Number(document.getElementById('shadedlegentrymax').value)); if (typeof c !== 'undefined') document.getElementById('select_color"+x[i].getAttribute("id")+"').jscolor.fromString(c);");
		
		tcell.appendChild(inp);
		trow.appendChild(tcell);
		
		ttableclrs.appendChild(trow);
		
		//setColorSvgElement(x[i].getAttribute("id"), '#'+fillvalue);
	}
	
}

function pInitRegionSelectionInterface(){
	
	var x = document.getElementsByClassName("mapitem");
	var divssettings = document.getElementById("mregions-dyn");
	divssettings.innerHTML = "";
	
	var ttableclrs = document.createElement("table");
	ttableclrs.appendChild(document.createRange().createContextualFragment('<tr><td colspan="2"><input type="checkbox" onChange="checkAll(this.checked)" id="selectall" checked/>all</td><td></td></tr>'));
	divssettings.appendChild(ttableclrs);
	
	for (i = 0; i < x.length; i++){
		
		// create color selection for reagions
		var trow = document.createElement("tr");
			
		var tcell = document.createElement("td");
		var chckbx = document.createElement("input");
		chckbx.setAttribute("id", "select_fill"+x[i].getAttribute("id"));
		chckbx.setAttribute("class", "select_fill");
		chckbx.setAttribute("type", "checkbox");
		chckbx.setAttribute("checked", "");
		chckbx.setAttribute("onChange", "setColorSvgElement('" + x[i].getAttribute("id")+"', document.getElementById('select_color"+x[i].getAttribute("id")+"').jscolor.toString(), !this.checked); displayClass('connected2mapitem"+x[i].getAttribute("id")+"', this.checked);");		
		tcell.appendChild(chckbx);
		trow.appendChild(tcell);
		
		var regname = getMapitemName(x[i]);
		
		var tcell = document.createElement("td");
		var nameinput = document.createElement("input");
		nameinput.setAttribute("class", "regionnameinput");
		nameinput.setAttribute("type", "text");
		nameinput.setAttribute("disabled", "");
		nameinput.setAttribute("value", regname);
		nameinput.setAttribute("onChange", "");
		nameinput.setAttribute("style", "font-size:1em;border:0;background:none;color:black;");
		tcell.appendChild(nameinput);
		
		trow.appendChild(tcell);
		
		ttableclrs.appendChild(trow);
	}
}

function pInitColorInterface(){
	
	var x = document.getElementsByClassName("mapitem");
	var divcolorssettings = document.getElementById("mcolors-dyn");
	divcolorssettings.innerHTML = "";
	
	var ttableclrs = document.createElement("table");
	ttableclrs.setAttribute('style', 'border-collapse: collapse;')
	divcolorssettings.appendChild(ttableclrs);
	
	var trr = document.createElement("tr");
	trr.setAttribute('style', 'border: 0pt solid grey; background:#8fc1e3; padding:5px;');
	trr.innerHTML = '<td style="padding-bottom:5px;padding-top:5px;"><input id="checkclrall" type="checkbox" onChange="DisableAllInputsfromClass(\'select_color\', this.checked); if (this.checked) {setColorSvgElements(\'mapitem\', document.getElementById(\'allcolorselector\').jscolor.toString());setTextSvgElementsColor(\'textcontainer\', document.getElementById(\'allcolorselector\').jscolor.isLight()); } else {var el=document.getElementsByClassName(\'select_color\'); for (i = 0; i < el.length; i++) el[i].onchange();}"/>all</td><td  style="padding-bottom:5px;padding-top:5px;"><input id="allcolorselector" data-jscolor="" type="text" size="6" value="'+fillvalue+'" onChange="if (document.getElementById(\'checkclrall\').checked) {setColorSvgElements(\'mapitem\', this.jscolor.toString());setTextSvgElementsColor(\'textcontainer\', this.jscolor.isLight());}"/></td><td><button onclick="var el=document.getElementsByClassName(\'select_color\'); for (i = 0; i < el.length; i++){ el[i].jscolor.fromString(document.getElementById(\'allcolorselector\').jscolor.toString()); el[i].onchange();}">Set all to this</button></td>';
	ttableclrs.appendChild(trr);
	
	
	for (i = 0; i < x.length; i++){
		
		var fillclr = rgb2hex(x[i].style.fill);
		if (fillclr == '') fillclr = rgb2hex(getComputedStyle(x[i]).fill);
		if (fillclr == '') fillclr = fillvalue;
		
		
		// create color selection for reagions
		var trow = document.createElement("tr");
			
		var regname = getMapitemName(x[i]);
		
		var tcell = document.createElement("td");
		tcell.textContent = regname;
		trow.appendChild(tcell);
		
		var tcell = document.createElement("td");
		var el = document.createElement("input");
		el.setAttribute("id", "select_color"+x[i].getAttribute("id"));
		el.setAttribute("class", "select_color");
		el.setAttribute("type", "text");
		el.setAttribute("data-jscolor", "");
		el.setAttribute("size", "6");
		el.setAttribute("value", fillclr);
		el.setAttribute("autocomplete", "off");
		el.setAttribute("onChange", "if (document.getElementById('select_fill"+x[i].getAttribute("id")+"').checked) {setColorSvgElement('" + x[i].getAttribute("id")+"', document.getElementById('select_color"+x[i].getAttribute("id")+"').jscolor.toString()); setTextSvgElementColor('"+x[i].getAttribute("id")+"', document.getElementById('select_color"+x[i].getAttribute("id")+"').jscolor.isLight());}");
		tcell.appendChild(el);
		trow.appendChild(tcell);
		
		var tcell = document.createElement("td");
		trow.appendChild(tcell);
		
		ttableclrs.appendChild(trow);
		
		setColorSvgElement(x[i].getAttribute("id"), '#'+fillclr);
	}
}

function pInitNumvalInterface(){
	
	var x = document.getElementsByClassName("mapitem");
	var divnumssettings = document.getElementById("mnumval-dyn");
	divnumssettings.innerHTML = "";
	
	var ttablenum = document.createElement("table");
	divnumssettings.appendChild(ttablenum);
	
	for (i = 0; i < x.length; i++){
		
				
		// create value selection per regions
		var trow = document.createElement("tr");
		
		var regname = getMapitemName(x[i]);
		
		var tcell = document.createElement("td");
		tcell.textContent = regname;
		trow.appendChild(tcell);
		
		var tcell = document.createElement("td");
		tcell.setAttribute("style", "width:80px;");
		
		var el = document.createElement("input");
		el.setAttribute("id", "select_value"+x[i].getAttribute("id"));
		el.setAttribute("class", "select_value");
		el.setAttribute("type", "text");
		el.setAttribute("size", "6");
		//el.setAttribute('style', 'display:none;');
		el.setAttribute("onChange", "if(this.value != ''){document.getElementById('select_color"+x[i].getAttribute("id")+"').jscolor.fromString(getColor4Value(this.value));document.getElementById('select_color"+x[i].getAttribute("id")+"').onchange(); setTextSvgElement('"+x[i].getAttribute("id")+"', this.value, document.getElementById('select_color"+x[i].getAttribute("id")+"').jscolor.isLight());}");
		tcell.appendChild(el);
		
		trow.appendChild(tcell);		
		ttablenum.appendChild(trow);
	}
}

function pInitBubblechartInterface(){
	
	var x = document.getElementsByClassName("mapitem");
	var divnumssettings = document.getElementById("mbubblechart-dyn");
	divnumssettings.innerHTML = "";
	
	var ttablenum = document.createElement("table");
	divnumssettings.appendChild(ttablenum);
	
	for (i = 0; i < x.length; i++){
		
				
		// create value selection per regions
		var trow = document.createElement("tr");
		
		var regname = getMapitemName(x[i]);
		
		var tcell = document.createElement("td");
		tcell.textContent = regname;
		trow.appendChild(tcell);
		
		var tcell = document.createElement("td");
		tcell.setAttribute("style", "width:80px;");
		
		var el = document.createElement("input");
		el.setAttribute("id", "bubble_value"+x[i].getAttribute("id"));
		el.setAttribute("class", "bubble_value");
		el.setAttribute("type", "text");
		el.setAttribute("size", "6");
		//el.setAttribute('style', 'display:none;');
		el.setAttribute("onChange", "setSvgCircleRfromValue('"+x[i].getAttribute("id")+"', this.value, document.getElementById('bubblestartvalue').value, document.getElementById('bubblestopvalue').value)");
		tcell.appendChild(el);
		
		trow.appendChild(tcell);		
		ttablenum.appendChild(trow);
	}
}

function pInitPichartInterface(){
	
	var x = document.getElementsByClassName("mapitem");
	var divsettings = document.getElementById("mpiechart-dyn");
	divsettings.innerHTML = "";
	
	var ttablenum = document.createElement("table");
	divsettings.appendChild(ttablenum);
	
	for (i = 0; i < x.length; i++){
		
		// create value selection per regions
		var trow = document.createElement("tr");
		
		var regname = getMapitemName(x[i]);
		
		var tcell = document.createElement("td");
		tcell.textContent = regname;
		trow.appendChild(tcell);
		
		var tcell = document.createElement("td");
		tcell.setAttribute("style", "width:80px;");
		
		var element2 = document.createElement("button");
		element2.setAttribute("id", "select_button"+x[i].getAttribute("id"));
		element2.setAttribute("class", "select_button");
		element2.textContent = "+";
		element2.setAttribute("onclick", "openMapItemInterfaceOnPage('" + x[i].getAttribute("id")+"')");
		
		tcell.appendChild(element2);
		
		trow.appendChild(tcell);
		
		ttablenum.appendChild(trow);
	}
}

function pInitMandatesInterface(){
	
	var x = document.getElementsByClassName("mapitem");
	var divsettings = document.getElementById("mmandates-dyn");
	divsettings.innerHTML = "";
	
	var ttablenum = document.createElement("table");
	divsettings.appendChild(ttablenum);
	
	for (i = 0; i < x.length; i++){
		
		// create value selection per regions
		var trow = document.createElement("tr");
		
		var regname = getMapitemName(x[i]);
		
		var tcell = document.createElement("td");
		tcell.textContent = regname;
		trow.appendChild(tcell);
		
		var tcell = document.createElement("td");
		tcell.setAttribute("style", "width:80px;");
		
		var element2 = document.createElement("button");
		element2.setAttribute("id", "select_button"+x[i].getAttribute("id"));
		element2.setAttribute("class", "select_button");
		element2.textContent = "+";
		element2.setAttribute("onclick", "openMapItemInterfaceOnPage('" + x[i].getAttribute("id")+"')");
		
		tcell.appendChild(element2);
		
		trow.appendChild(tcell);
		
		ttablenum.appendChild(trow);
	}
}

function selectMapType(selectedval){

	displayClass('minterface', false);
	displayId(selectedval);
}

function displayId(id, show=true, value="inline")
{
	var t = document.getElementById(id);
	t.style.display = show?value:"none"; 
}

function displayClass(classname, show=true)
{
	var status=show?"inline":"none";
	var el=document.getElementsByClassName(classname); 
	for (i = 0; i < el.length; i++) 
	{	
		el[i].style.display = status;
	}
}

function DisableAllInputsfromClass(classname, disable=true){
	
	var x = document.getElementsByClassName(classname);
	
	for (i = 0; i < x.length; i++){
		if (disable) x[i].setAttribute('disabled', '');
		else x[i].removeAttribute('disabled');
	}
}


function addDiscreteColorPalette(palette) {
	var menuitem = document.getElementById('discpal-menu');
	menuitem.innerHTML = "";
	
	for (i = 0; i < palette.length; i++){
		var entry = document.createElement("div");
		entry.setAttribute('onmouseenter', "this.style.background = 'grey'");
		entry.setAttribute('onmouseleave', "this.style.background = 'none'");
		entry.setAttribute('onclick', "setDiscretePalette('descrpal" + i +"');updateClassOnChange('select_value');toggleVisiblity('discpal-menu');");
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute('width', "90");
		svg.setAttribute('height', "15");
		svg.setAttribute('id', 'descrpal' + i);
		entry.appendChild(svg);
			
		for (j = 0; j < palette[i].length; j++){
				
			var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			rect.setAttribute('fill', palette[i][j]);
			rect.setAttribute('width', '15');
			rect.setAttribute('height', '100%');
			rect.setAttribute('x', 15*j);
			svg.appendChild(rect);			
		}
		menuitem.appendChild(entry);
	}
}

function addNewPaletteItem(){
	var entry = [];
	for (i = 1; i < 7; i++){
		var it = document.getElementById('custompalettei' + i);
		entry[i-1] = it.style.fill;
	}
	
	descPalletteColors.push(entry);
	addDiscreteColorPalette(descPalletteColors);
}

function HighlightMenu(el){
	
	var x = document.getElementsByClassName("menuitem");
	
	for (i = 0; i < x.length; i++){
		//x[i].setAttribute('class', 'menuitem');
		x[i].classList.remove('menuitem-selected');
	}
	//el.setAttribute('class', 'menuitem menuitem-selected');
	el.classList.add('menuitem-selected');
}
	
function DisableMenu(el, disable=true){
	
	if (disable)
		el.classList.add('menuitem-disabled');
	else
		el.classList.remove('menuitem-disabled');
}

function setShadesPalette(baseid, num, pos, jscolorinstance) {
	
	var h = jscolorinstance.jscolor.channel('H');
	var s = jscolorinstance.jscolor.channel('S');
	var v = jscolorinstance.jscolor.channel('V');
	var a = jscolorinstance.jscolor.channel('A');
	var r = jscolorinstance.jscolor.channel('R');
	var g = jscolorinstance.jscolor.channel('G');
	var b = jscolorinstance.jscolor.channel('B');
	
	var t = hsv2hsl(h, s, v);
	step = 100/num-3;
	
	for (i=1; i<=num; i++ ) {	
		//document.getElementById(baseid+i).jscolor.fromHSVA(h, s - (pos - i)*step, v + (pos - i)*step, a);
		//document.getElementById(baseid+i).jscolor.fromRGB(r + r*(pos - i)*step, g + g*(pos - i)*step, b + b*(pos - i)*step);
		
		var nl = t[2] + (pos - i)*step;
		tt = hsl2hsv(t[0], t[1], nl);
		document.getElementById(baseid+i).jscolor.fromHSVA(tt[0], tt[1], tt[2], a);
		
		document.getElementById(baseid+i).onchange();
	}
	
}

function hsv2hsl(h, s, v){
	var l = (v/100)-(v/100)*(s/100)/2;
	var m = Math.min(l,1-l);
	var s2 = m?((v/100)-l)/m:0;
	return [h, s2*100, l*100];
}

function hsl2hsv(h, s, l){
	var v=(s/100)*Math.min((l/100),1-(l/100))+(l/100);
	var s2 = v?2-2*(l/100)/v:0;
	return [h, s2*100, v*100];
}

function getMapitemName(mapitem, getidifnotitle = true) {
	var chldrn = mapitem.children;
	for (var i = 0; i< chldrn.length; i++)
		if (chldrn[i].tagName.toLowerCase() == 'title') return chldrn[i].textContent;
	
	if (getidifnotitle) return mapitem.getAttribute("id");
	
	return "";
}

function rgb2hex(rgb){
	if (rgb == 'none') return '';
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}