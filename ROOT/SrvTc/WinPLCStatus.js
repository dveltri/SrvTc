//=================================================
var IdPlcSts="";
var flashing=0;
function InitPlcSts()
{
	winAdd("PlcSts");
	winList["PlcSts"].SetW("420px");
	winList["PlcSts"].SetH("420px");
	winUdate();
}

function rcvPlcSts(Datos)
{
	var urlx=Datos.urlx.split('?');
	urlx=urlx[0];
	urlx=urlx.split('/');
	for(var i=0;i<urlx.length;i++)
	{
		if(urlx[i].indexOf('.svg')!=-1)
			break;
	}
	urlx=urlx[i];
	urlx=replaceAll(urlx,".svg","");
	Datos=Datos.responseText;
	Datos=Datos.substring(Datos.indexOf("<svg "));
	if (winList[urlx])
	{
		winList[urlx].open();
		winAutoPos();
	}
	else
	{
		winAdd(urlx);
		winList[urlx].SetW("420px");
		winList[urlx].SetH("420px");
		winUdate();
		winList[urlx].open();
		winAutoPos();
	}
	if(winList[urlx].isOpen==true)
	{
		document.getElementById(urlx+"Title").innerHTML=Str_Cruce;
		document.getElementById(urlx+"Body").innerHTML="";
		document.getElementById(urlx+"Body").innerHTML+="<input type=\"button\" class=\"INTEXT2\" onclick=\"window.open('https://svg-edit.github.io/svgedit/releases/svg-edit-2.8.1/svg-editor.html');\" value=\"SvgEditor\" target=\"_blank\" />\n";
		//document.getElementById(urlx+"Body").innerHTML+="<a href=\"https://svg-edit.github.io/svgedit/releases/svg-edit-2.8.1/svg-editor.html\" target=\" _blank\" >[SvgEditor]</a>\n";
		document.getElementById(urlx+"Body").innerHTML+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"winRemove('"+urlx+"');return false;\" />\n";
		document.getElementById(urlx+"Body").innerHTML+="<br /><br />";
		document.getElementById(urlx+"Body").innerHTML+=Datos;
	}
}
//=================================================

function getbyid(objs,id)
{
	for(var i=0;i<objs.length;i++)
		if(id==objs[i].id)
			return objs[i];
	return null;
}

function ShwPhases(idx)
{
	flashing^=1;
	var plc=0;
	var phase=0;
	var color=0;
	var temp="";
	var tempV=0;
	var obj=0;
	//---------------------------------Title
	//document.getElementById("Title").innerHTML=Str_Intersection+" "+idx;
	//idx=SearchId(idx);
	var parent=document.getElementById(FastSts[idx].Id+"_"+FastSts[idx].Plcs[0].Nombre);
	var g = parent.getElementsByTagName("g");
	//---------------------------------------------------------------
	for(plc=0;plc<FastSts[idx].Plcs.length;plc++)
	{
		if(FastSts[idx].Plcs[plc])
		{
		}
	}
	//---------------------------------------------------------------
	for(phase=0;phase<FastSts[idx].Phases.length;phase++)
	{
		if(FastSts[idx].Phases[phase])
		{
			tempV=parseInt(FastSts[idx].Phases[phase].Color);
			//- - - - - - - - - - - - - - - - - - - - - - - -
			obj = getbyid(g,"phase"+phase+"R");
			if(obj!=null)
			{
				if(tempV&1)
				{
					color="rgb(240,0,0)";
					temp=getgroup(obj,"style","fill");
					if(tempV&0x30 && flashing&1 && color==temp)
								color="rgb(127,127,127)";
					setgroup(obj,"style", "fill:"+color);
				}
				else
					setgroup(obj,"style", "fill:rgb(127,127,127)");
			}
			//- - - - - - - - - - - - - - - - - - - - - - - -
			obj = getbyid(g,"phase"+phase+"Y");
			if(obj!=null)
			{
				if(tempV&2)
				{
					color="rgb(240,240,0)";
					temp=getgroup(obj,"style","fill");
					if(tempV&0x30 && flashing&1 && color==temp)
								color="rgb(127,127,127)";
					setgroup(obj,"style", "fill:"+color);
				}
				else
					setgroup(obj,"style", "fill:rgb(127,127,127)");
			}
			//- - - - - - - - - - - - - - - - - - - - - - - -
			obj = getbyid(g,"phase"+phase+"G");
			if(obj!=null)
			{
				if(tempV&4)
				{
					color="rgb(0,240,0)";
					temp=getgroup(obj,"style","fill");
					if(tempV&0x30 && flashing&1 && color==temp)
								color="rgb(127,127,127)";
					setgroup(obj,"style", "fill:"+color);
				}
				else
					setgroup(obj,"style", "fill:rgb(127,127,127)");
			}
			//- - - - - - - - - - - - - - - - - - - - - - - -
			if(obj==null)
			{
				obj = getbyid(g,"phase"+phase);
				switch(tempV&7)
				{
					case 1:
						color="rgb(240, 0, 0)";
					break;
					case 2:
						color="rgb(240, 240, 0)";
					break;
					case 4:
						color="rgb(0, 240, 0)";
					break;
					default:
						color="rgb(127, 127, 127)";
					break;
				}
				if(obj!=null)
				{
					temp=getgroup(obj,"style","fill");
					if(tempV&0x30 && flashing&1 && color==temp)
								color="rgb(127,127,127)";
					setgroup(obj,"style", "fill:"+color+";stroke:"+color);
				}
			}
		}
	}
	//---------------------------------------------------------------
	for(io=0;io<FastSts[idx].IOs.length;io++)
	{
		if(FastSts[idx].IOs[io])
		{
			obj = getbyid(g,"input"+io);
			color=" rgb(100, 100, 100)";
			if(FastSts[idx].IOs[io].Status.indexOf("precent")!=-1)
				color=" rgb(0, 0, 254)";
			if(obj!=null)
				setgroup(obj,"style", "stroke:"+color+";fill:"+color);
		}
	}
	//---------------------------------------------------------------
}

function setgroup(out,Attrib,valor)
{
	var temp;
	if (out==null)return;
	if (out.childNodes.length)
	{
		for(temp=0;temp<out.childNodes.length;temp++)
		{
			if(out.childNodes[temp].nodeName!="#text")
			{
				if(out.childNodes[temp].nodeName!="g")
					out.childNodes[temp].setAttribute(Attrib,valor);
				else
					setgroup(out.childNodes[temp],Attrib,valor);
			}
		}
	}
	else
	{
		out.setAttribute(Attrib,valor);
	}
}

function getgroup(out,Attrib,valor)
{
	var temp;
	var rtn=null;
	if (out==null)return;
	if(out.childNodes.length)
	{
		for(temp=0;temp<out.childNodes.length;temp++)
		{
			if(out.childNodes[temp].nodeName!="#text")
			{
				if(out.childNodes[temp].nodeName!="g")
				{
					var rstyle = out.childNodes[temp].getAttribute(Attrib);//;
					if(rstyle)
					{
						var temp2;
						rstyle=rstyle.split(';');
						for(var j=0; j < rstyle.length; j++)
						{
							temp2=rstyle[j].split(':');
							if(temp2[0] == valor)
								return temp2[1];
						}
					}
				}
				else
					rtn=getgroup(out.childNodes[temp],Attrib,valor);
			}
		}
	}
	else
	{
		var rstyle = out.getAttribute(Attrib);//;
		if(rstyle)
		{
			var temp2;
			rstyle=rstyle.split(';');
			for(var j=0; j < rstyle.length; j++)
			{
				temp2=rstyle[j].split(':');
				if(temp2[0] == valor)
					return temp2[1];
			}
		}
	}
	return rtn;
}
//----------------------------------------------------------------