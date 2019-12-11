/*---------------------------------------------------------------------------*/
function loadjscssfile(id,filename, filetype)
{
	if (document.getElementById(id))
		return;
	if (filetype=="js")
	{ //if filename is a external JavaScript file
		var fileref=document.createElement('script');
		fileref.setAttribute("id",id);
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", filename);
	}
	if (filetype=="css")
	{ //if filename is an external CSS file
		var fileref=document.createElement("link");
		fileref.setAttribute("id",id);
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename);
	}
	if (typeof fileref!="undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref);
}
/*---------------------------------------------------------------------------*/
function LoadRsc(flag,id,file,type,fnc)
{
	if (ResourceLoad&flag!=0)
	{
		fnc();
	}		
	else
	{
		loadjscssfile(id,file,type);
		setTimeout("LoadRsc("+flag+","+id+","+file+","+type+","+fnc+")",50);
	}
}
/*---------------------------------------------------------------------------*/
function RemoveUnusedItem(Datos)
{
	var j=0;
	while(j<Datos.length)
	{
		Datos[j]=Datos[j].trim();
		if(Datos[j]=="")
			Datos.splice(j,1);
		else
			if(Datos[j].indexOf('//')!=-1)
				Datos.splice(j,1);
			else
				j++;
	}
}
function rcvtbl(Datos)
{
	Datos=Datos.responseText;
	Datos=Datos.split("\n");
	RemoveUnusedItem(Datos);
	for(var a=0;a<Datos.length;a++)
	{
		Datos[a]=Datos[a].split("\t");
	}
	return Datos;
}
/*---------------------------------------------------------------------------*/
function replaceAll(str, de, para)
{
	var pos = str.indexOf(de);
	while (pos > -1)
	{
		str = str.replace(de, para);
		pos = str.indexOf(de);
	}
	return str;
}
/*---------------------------------------------------------------------------*/
function delay(millis)
{
	var date = new Date();
	var curDate = null;
	do { curDate = new Date(); }
	while(curDate-date < millis);
} 

function GenOptions(Vect,Item)
{
	var out="";
	for(var i=0;i<Vect.length;i+=2)
	{
		out+="<option value=\""+Vect[i]+"\"";
		if(Vect[i+1]==Item)out+=" selected=\"selected\"";
		out+=">"+Vect[i+1]+"</option>\n";
	}
	return out;
}
function GenOptionsV(Vect,Valor)
{
	var out="";
	for(var i=0;i<Vect.length;i+=2)
	{
		out+="<option value=\""+Vect[i]+"\"";
		if(Vect[i]==Valor)out+=" selected=\"selected\"";
		out+=">"+Vect[i+1]+"</option>\n";
	}
	return out;
}
function GenOptionsVi(Vect,Valor)
{
	var out="";
	for(var i=0;i<Vect.length;i++)
	{
		out+="<option value=\""+Vect[i]+"\"";
		if(Vect[i]==Valor)out+=" selected=\"selected\"";
		out+=">"+Vect[i]+"</option>\n";
	}
	return out;
}
function GetVecItm(Vect,Item)
{
	var out="";
	for(var i=0;i<Vect.length;i+=2)
	{
		if(Vect[i+1] && Vect[i+1]==Item)
		 return Vect[i];
	}
	return "";
}

/*---------------------------------------------------------------------------*/
function LOG(log)
{
	if(Log_En && log)document.getElementById('dgv').innerHTML=HTMLEncode(log)+"<br />"+document.getElementById('dgv').innerHTML;
}
/*---------------------------------------------------------------------------*/
function ClsLOG()
{
	if(Log_En)document.getElementById('dgv').innerHTML="";
}
/*---------------------------------------------------------------------------*/
function LOGdirect(log)
{
	if(Log_En)document.getElementById('dgv2').innerHTML=HTMLEncode(log)+"<br />";
}

function printObject(o)
{
  var out='';
  for(var p in o)
	{
		if(p)
		{
			if(typeof(o[p])!=="object")
			{
				out+=p+":"+o[p]+"<br />";
			}
			else
			{
				out+=p+":"+printObject(o[p])+"<br />";
			}
		}
  }
	out=replaceAll(out,"<br /><br />","<br />");
  return out;
}

/*===========================================================================*/
function clock()
{
 var digital = new Date();
 var hours = digital.getHours() + ":" + digital.getMinutes();
 var seconds = digital.getSeconds();
 var days =digital.getMonth()+1;
 days=digital.getDate()+"/"+days+"/"+digital.getYear();
 window.status = hours+" "+days+"  ( SkyNet® v8.03.12 )    Resolucion: "+screenz()+"        ";
 setTimeout("clock()", 30000);
}

function screenz()
{
 return screen.width + " x " + screen.height;
}

function checkLocation()
{
 yy=250 + eval(document.body.scrollTop);
 objet1.innerHTML = yy;
 eval("objet1.style.pixelTop="+yy);
 setTimeout("checkLocation()",20);
}

function GetCmp(ndex,Datos,separador)
{
 var Ctc
 var x
 var temp
 x=0;
 temp="";
 Ctc=0;
 while(x < Datos.length && Ctc!=ndex)
 {
  if (separador == Datos.substring(x,x+1))
   Ctc = Ctc + 1;
  x = x + 1;
 }
 if (x <= Datos.length && ndex == Ctc)
 {
  while (Datos.substring(x,x+1) != separador && x < Datos.length)
  {
   temp = temp + Datos.substring(x,x+1);
   x = x + 1;
  }
 }
 return temp
}

/*

CollapsibleLists.js

An object allowing lists to dynamically expand and collapse

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/*const CollapsibleLists = (function(){

  // Makes all lists with the class 'collapsibleList' collapsible. The
  // parameter is:
  //
  // doNotRecurse - true if sub-lists should not be made collapsible
  function apply(doNotRecurse){

    [].forEach.call(document.getElementsByTagName('ul'), node => {

      if (node.classList.contains('collapsibleList')){

        applyTo(node, true);

        if (!doNotRecurse){

          [].forEach.call(node.getElementsByTagName('ul'), subnode => {
            subnode.classList.add('collapsibleList')
          });

        }

      }

    })

  }

  // Makes the specified list collapsible. The parameters are:
  //
  // node         - the list element
  // doNotRecurse - true if sub-lists should not be made collapsible
  function applyTo(node, doNotRecurse){

    [].forEach.call(node.getElementsByTagName('li'), li => {

      if (!doNotRecurse || node === li.parentNode){

        li.style.userSelect       = 'none';
        li.style.MozUserSelect    = 'none';
        li.style.msUserSelect     = 'none';
        li.style.WebkitUserSelect = 'none';

        li.addEventListener('click', handleClick.bind(null, li));

        toggle(li);

      }

    });

  }

  // Handles a click. The parameter is:
  //
  // node - the node for which clicks are being handled
  function handleClick(node, e){

    let li = e.target;
    while (li.nodeName !== 'LI'){
      li = li.parentNode;
    }

    if (li === node){
      toggle(node);
    }

  }

  // Opens or closes the unordered list elements directly within the
  // specified node. The parameter is:
  //
  // node - the node containing the unordered list elements
  function toggle(node){

    const open = node.classList.contains('collapsibleListClosed');
    const uls  = node.getElementsByTagName('ul');

    [].forEach.call(uls, ul => {

      let li = ul;
      while (li.nodeName !== 'LI'){
        li = li.parentNode;
      }

      if (li === node){
        ul.style.display = (open ? 'block' : 'none');
      }

    });

    node.classList.remove('collapsibleListOpen');
    node.classList.remove('collapsibleListClosed');

    if (uls.length > 0){
      node.classList.add('collapsibleList' + (open ? 'Open' : 'Closed'));
    }

  }

  return {apply, applyTo};

})(); //*/

/*---------------------------------------------------------------------------*/
function color2svg(ColorCode,text)
{
var vh=5;
var out="";
var vbgcolor="#808080";
if((ColorCode&128) && ColorCode<255)
	vbgcolor="#000000";
out+="<svg width=\"34\" height=\"";
if(ColorCode>255)
	out+=(vh+800);
else
	out+=(vh+33);
out+="\" xmlns=\"http://www.w3.org/2000/svg\">\n\
 <defs>\n\
  <marker id=\"se_marker_end_svg_11\" markerUnits=\"strokeWidth\" orient=\"auto\" viewBox=\"0 0 100 100\" markerWidth=\"5\" markerHeight=\"5\" refX=\"50\" refY=\"50\">\n\
   <path d=\"m100,50l-100,40l30,-40l-30,-40l100,40z\" fill=\"#FF0000\" stroke=\"#FF0000\" stroke-width=\"10\"/>\n\
  </marker>\n\
  <marker id=\"se_marker_end_svg_12\" markerUnits=\"strokeWidth\" orient=\"auto\" viewBox=\"0 0 100 100\" markerWidth=\"5\" markerHeight=\"5\" refX=\"50\" refY=\"50\">\n\
   <path d=\"m100,50l-100,40l30,-40l-30,-40l100,40z\" fill=\"#FFFF00\" stroke=\"#FFFF00\" stroke-width=\"10\"/>\n\
  </marker>\n\
  <marker id=\"se_marker_end_svg_13\" markerUnits=\"strokeWidth\" orient=\"auto\" viewBox=\"0 0 100 100\" markerWidth=\"5\" markerHeight=\"5\" refX=\"50\" refY=\"50\">\n\
   <path d=\"m100,50l-100,40l30,-40l-30,-40l100,40z\" fill=\"#00FF00\" stroke=\"#00FF00\" stroke-width=\"10\"/>\n\
  </marker>\n\
  <linearGradient id=\"svg_111\" x1=\"0\" y1=\"0.5\" x2=\"1\" y2=\"0.5\">\n\
   <stop offset=\"0\" stop-color=\"#808080\"/>\n\
   <stop offset=\"1\" stop-color=\"#000000\"/>\n\
  </linearGradient>\n\
 </defs>\n";
if((ColorCode&7)==0 || ColorCode>255)
{
	//out+="<rect fill=\"url(#svg_111)\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\" id=\"CC_OFF\"/>\n";
	out+="<rect fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\" id=\"svg_9\"/>\n";
	out+="<line id=\"svg_6\" x1=\"2\" y1=\""+(vh+16)+"\" x2=\"32\" y2=\""+(vh+16)+"\" stroke=\"#000000\" fill=\"#404040\" stroke-width=\"8\"/>\n";
}
if(ColorCode>255)vh+=50;
if(((ColorCode&0x47)==0x01 && ColorCode&0x30) || ColorCode>255)
out+="<g id=\"CC_ATR\">\n\
   <rect fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\" id=\"svg_9\"/>\n\
   <line id=\"svg_8\" x1=\"3\" y1=\""+(vh+16)+"\" x2=\"32\" y2=\""+(vh+16)+"\" stroke=\"#FF0000\" fill=\"#404040\" stroke-width=\"8\" stroke-dasharray=\"4,4\"/>\n\
  </g>\n";
/*   <line fill=\"#404040\" stroke=\"#FF0000\" x1=\"5\" y1=\""+(vh+25)+"\" x2=\"23\" y2=\""+(vh+9)+"\" id=\"svg_11\" marker-end=\"url(#se_marker_end_svg_11)\"/>\n\ */
if(ColorCode>255)vh+=50;
if(((ColorCode&0x47)==0x02 && ColorCode&0x30) || ColorCode>255)
out+="<g id=\"CC_ATA\">\n\
   <rect id=\"svg_17\" fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\"/>\n\
   <line id=\"svg_18\" x1=\"3\" y1=\""+(vh+16)+"\" x2=\"32\" y2=\""+(vh+16)+"\" stroke=\"#FFFF00\" fill=\"#404040\" stroke-width=\"8\" stroke-dasharray=\"4,4\"/>\n\
  </g>\n";
/*   <line id=\"svg_19\" fill=\"#404040\" stroke=\"#FFFF00\" x1=\"5\" y1=\""+(vh+25)+"\" x2=\"23\" y2=\""+(vh+9)+"\" marker-end=\"url(#se_marker_end_svg_12)\"/>\n\ */
if(ColorCode>255)vh+=50;
if(((ColorCode&0x47)==0x04 && ColorCode&0x30) || ColorCode>255)
out+="<g id=\"CC_ATG\">\n\
   <rect id=\"svg_21\" fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\"/>\n\
   <line id=\"svg_22\" x1=\"3\" y1=\""+(vh+16)+"\" x2=\"32\" y2=\""+(vh+16)+"\" stroke=\"#00FF00\" fill=\"#404040\" stroke-width=\"8\" stroke-dasharray=\"4,4\"/>\n\
  </g>\n";
/*   <line id=\"svg_23\" fill=\"#404040\" stroke=\"#00FF00\" x1=\"5\" y1=\""+(vh+25)+"\" x2=\"23\" y2=\""+(vh+9)+"\" marker-end=\"url(#se_marker_end_svg_13)\"/>\n\ */
if(ColorCode>255)vh+=50;
if((ColorCode&0x77)==0x04 || ColorCode>255)
out+="<g id=\"CC_G\" transform=\"scale(1, 1)\">\n\
   <rect fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\" id=\"svg_7\"/>\n\
   <line id=\"svg_6\" x1=\"2\" y1=\""+(vh+16)+"\" x2=\"32\" y2=\""+(vh+16)+"\" stroke=\"#00ff00\" fill=\"#404040\" stroke-width=\"8\"/>\n\
  </g>\n";
if(ColorCode>255)vh+=50;
if((ColorCode&0x77)==0x02 || ColorCode>255)
out+="<g id=\"CC_A\">\n\
   <rect fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\" id=\"svg_5\"/>\n\
   <line id=\"svg_4\" x1=\"2\" y1=\""+(vh+16)+"\" x2=\"32\" y2=\""+(vh+16)+"\" stroke=\"#ffff00\" fill=\"#404040\" stroke-width=\"8\"/>\n\
  </g>\n";
if(ColorCode>255)vh+=50;
if((ColorCode&0x77)==0x01 || ColorCode>255)
out+="<g id=\"CC_R\">\n\
   <rect fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\" id=\"svg_3\"/>\n\
   <line id=\"svg_2\" x1=\"2\" y1=\""+(vh+16)+"\" x2=\"32\" y2=\""+(vh+16)+"\" stroke=\"#FF0000\" fill=\"#404040\" stroke-width=\"8\"/>\n\
  </g>\n";
if(ColorCode>255)vh+=50;
if((ColorCode&0x77)==0x06 || ColorCode>255)
out+="<g id=\"CC_AG\">\n\
   <rect id=\"svg_28\" fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\"/>\n\
   <line id=\"svg_29\" x1=\"2\" y1=\""+(vh+12)+"\" x2=\"32\" y2=\""+(vh+12)+"\" stroke=\"#FFff00\" fill=\"#404040\" stroke-width=\"2\"/>\n\
   <line id=\"svg_29\" x1=\"2\" y1=\""+(vh+20)+"\" x2=\"32\" y2=\""+(vh+20)+"\" stroke=\"#00ff00\" fill=\"#404040\" stroke-width=\"8\"/>\n\
  </g>\n";
if(ColorCode>255)vh+=50;
if((ColorCode&0x77)==0x03 || ColorCode>255)
out+="<g id=\"CC_RA\">\n\
   <rect id=\"svg_34\" fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\"/>\n\
   <line id=\"svg_35\" x1=\"2\" y1=\""+(vh+12)+"\" x2=\"32\" y2=\""+(vh+12)+"\" stroke=\"#FF0000\" fill=\"#404040\" stroke-width=\"8\"/>\n\
   <line id=\"svg_35\" x1=\"2\" y1=\""+(vh+20)+"\" x2=\"32\" y2=\""+(vh+20)+"\" stroke=\"#FFFF00\" fill=\"#404040\" stroke-width=\"2\"/>\n\
  </g>\n";
if(ColorCode>255)vh+=50;
if(((ColorCode&0x47)==0x06 && ColorCode&0x30) || ColorCode>255)
out+="<g id=\"CC_ATAG\">\n\
   <rect fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\" id=\"svg_37\"/>\n\
   <line id=\"svg_18\" x1=\"3\" y1=\""+(vh+12)+"\" x2=\"32\" y2=\""+(vh+12)+"\" stroke=\"#FFFF00\" fill=\"#404040\" stroke-width=\"2\" stroke-dasharray=\"4,4\"/>\n\
   <line x1=\"2\" y1=\""+(vh+20)+"\" x2=\"32\" y2=\""+(vh+20)+"\" stroke=\"#00ff00\" fill=\"#404040\" stroke-width=\"2\" id=\"svg_39\"/>\n\
  </g>\n";
/*   <line id=\"svg_19\" fill=\"#404040\" stroke=\"#FFFF00\" x1=\"5\" y1=\""+(vh+25)+"\" x2=\"23\" y2=\""+(vh+9)+"\" marker-end=\"url(#se_marker_end_svg_12)\"/>\n\ */
if(ColorCode>255)vh+=50;
if(((ColorCode&0x47)==0x03 && ColorCode&0x30) || ColorCode>255)
out+="<g id=\"CC_ATRA\">\n\
   <rect fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\" id=\"svg_41\"/>\n\
   <line id=\"svg_18\" x1=\"3\" y1=\""+(vh+20)+"\" x2=\"32\" y2=\""+(vh+20)+"\" stroke=\"#FFFF00\" fill=\"#404040\" stroke-width=\"2\" stroke-dasharray=\"4,4\"/>\n\
   <line x1=\"2\" y1=\""+(vh+12)+"\" x2=\"32\" y2=\""+(vh+12)+"\" stroke=\"#FF0000\" fill=\"#404040\" stroke-width=\"2\" id=\"svg_43\"/>\n\
  </g>\n";
/*   <line id=\"svg_19\" fill=\"#404040\" stroke=\"#FFFF00\" x1=\"5\" y1=\""+(vh+25)+"\" x2=\"23\" y2=\""+(vh+9)+"\" marker-end=\"url(#se_marker_end_svg_12)\"/>\n\ */
if(ColorCode>255)vh+=50;
if(((ColorCode&0x47)==0x41 && ColorCode&0x30) || ColorCode>255)
out+="<g id=\"CC_DTR\">\n\
   <rect fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\" id=\"svg_87\"/>\n\
   <line x1=\"3\" y1=\""+(vh+16)+"\" x2=\"32\" y2=\""+(vh+16)+"\" stroke=\"#FF0000\" fill=\"#404040\" stroke-width=\"2\" stroke-dasharray=\"4,4\" id=\"svg_88\"/>\n\
  </g>\n";
/*   <line fill=\"#404040\" stroke=\"#FF0000\" x1=\"5\" y1=\""+(vh+9)+"\" x2=\"23\" y2=\""+(vh+25)+"\" marker-end=\"url(#se_marker_end_svg_11)\" id=\"svg_89\"/>\n\ */
if(ColorCode>255)vh+=50;
if(((ColorCode&0x47)==0x42 && ColorCode&0x30) || ColorCode>255)
out+="<g id=\"CC_DTA\">\n\
   <rect fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\" id=\"svg_91\"/>\n\
   <line x1=\"3\" y1=\""+(vh+16)+"\" x2=\"32\" y2=\""+(vh+16)+"\" stroke=\"#FFFF00\" fill=\"#404040\" stroke-width=\"2\" stroke-dasharray=\"4,4\" id=\"svg_92\"/>\n\
  </g>\n";
/*   <line fill=\"#404040\" stroke=\"#FFFF00\" x1=\"5\" y1=\""+(vh+9)+"\" x2=\"23\" y2=\""+(vh+25)+"\" marker-end=\"url(#se_marker_end_svg_12)\" id=\"svg_93\"/>\n\*/
if(ColorCode>255)vh+=50;
if(((ColorCode&0x47)==0x44 && ColorCode&0x30) || ColorCode>255)
out+="<g id=\"CC_DTG\">\n\
   <rect fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\" id=\"svg_95\"/>\n\
   <line x1=\"3\" y1=\""+(vh+16)+"\" x2=\"32\" y2=\""+(vh+16)+"\" stroke=\"#00FF00\" fill=\"#404040\" stroke-width=\"2\" stroke-dasharray=\"4,4\" id=\"svg_96\"/>\n\
  </g>\n";
/*   <line fill=\"#404040\" stroke=\"#00FF00\" x1=\"5\" y1=\""+(vh+9)+"\" x2=\"23\" y2=\""+(vh+25)+"\" marker-end=\"url(#se_marker_end_svg_13)\" id=\"svg_97\"/>\n\ */
if(ColorCode>255)vh+=50;
if(((ColorCode&0x47)==0x46 && ColorCode&0x30) || ColorCode>255)
out+="<g id=\"CC_DTAG\">\n\
   <rect fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\" id=\"svg_99\"/>\n\
   <line x1=\"3\" y1=\""+(vh+12)+"\" x2=\"32\" y2=\""+(vh+12)+"\" stroke=\"#FFFF00\" fill=\"#404040\" stroke-width=\"2\" stroke-dasharray=\"4,4\" id=\"svg_100\"/>\n\
   <line x1=\"2\" y1=\""+(vh+20)+"\" x2=\"32\" y2=\""+(vh+20)+"\" stroke=\"#00ff00\" fill=\"#404040\" stroke-width=\"2\" id=\"svg_102\"/>\n\
  </g>\n";
   /*<line fill=\"#404040\" stroke=\"#FFFF00\" x1=\"5\" y1=\""+(vh+9)+"\" x2=\"23\" y2=\""+(vh+25)+"\" marker-end=\"url(#se_marker_end_svg_12)\" id=\"svg_101\"/>\n\*/
if(ColorCode>255)vh+=50;
if(((ColorCode&0x47)==0x43 && ColorCode&0x30) || ColorCode>255)
out+="<g id=\"CC_DTRA\">\n\
   <rect fill=\""+vbgcolor+"\" stroke=\"#000000\" x=\"1\" y=\""+vh+"\" width=\"32\" height=\"32\" id=\"svg_104\"/>\n\
   <line x1=\"2\" y1=\""+(vh+12)+"\" x2=\"32\" y2=\""+(vh+12)+"\" stroke=\"#FF0000\" fill=\"#404040\" stroke-width=\"2\" id=\"svg_107\"/>\n\
   <line x1=\"3\" y1=\""+(vh+20)+"\" x2=\"32\" y2=\""+(vh+20)+"\" stroke=\"#FFFF00\" fill=\"#404040\" stroke-width=\"2\" stroke-dasharray=\"4,4\" id=\"svg_105\"/>\n\
  </g>\n";
/*   <line fill=\"#404040\" stroke=\"#FFFF00\" x1=\"5\" y1=\""+(vh+9)+"\" x2=\"23\" y2=\""+(vh+25)+"\" marker-end=\"url(#se_marker_end_svg_12)\" id=\"svg_106\"/>\n\ */
//if((ColorCode&0x30) && ColorCode<255) out+="<text fill=\"#00FFFF\" stroke-width=\"0\" x=\"29\" y=\""+(vh+8)+"\" id=\"svg_112\" font-size=\"9\" font-family=\"Fantasy\" text-anchor=\"middle\" font-weight=\"bold\">"+((ColorCode>>4)&3)+"</text>\n";  
if(text)
	out+="<text fill=\"#000000\" stroke-width=\"0\" x=\"13\" y=\"16\" id=\"svg_113\" font-size=\"12\" font-family=\"Fantasy\" text-anchor=\"middle\" font-weight=\"bold\">"+text+"</text>\n";
out+="</svg>\n";
if(ColorCode==255)
	out="<font size=\"1\" face=\"Verdana\">"+Str_no_Change+"<br /></font>\n";
return out;
}