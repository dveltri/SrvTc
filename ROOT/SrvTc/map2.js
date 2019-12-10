var zoom=12;
var FncMapClk=fncnone;
var IdxCol=0;
//---------------------------------------------------------------------------------------------------------------------------------------
var layer;
var source;
var View;
var map;
var MapItems=new Array();
var vector;
var markers;
//---------------------------------------------------------------------------------------------------------------------------------------
var popup
var container;
var content;
var closer;
var mapFixedSize=4;
//var overlay;
var ItemText
var MapItem=new Object();
var MapItemList;
var MapItemListBk;
var OptLayers=[0,Str_Controllers,1,Str_Cameras];
OptGraphC=["","","Circle 10","Circle 1","Circle 20","Circle 2","Circle 30","Circle 3","Circle 40","Circle 4","LineString 5","LineString 1","LineString 10","LineString 2","LineString 15","LineString 3"];
//OptGraph=["","","Circle","Circle","LineString","LineString","Polygon","Polygon"];

function AddMapItm()
{
		RemoveUnusedItem(MapItem.infcmp);
		var Color="";
		for(var i=0;i<MapItem.color.length;i++)
		{
			Color+="/"+MapItem.color[i];
		}
		{
			GetUrlB("./setitems.jsp?sql=INSERT INTO variables (id,lstchg,value) VALUES (\'"+MapItem.gps+"\',LOCALTIMESTAMP,\'"+document.getElementById("Itmpos").innerHTML+"\')",fncnone);
			GetUrlB("./setitems.jsp?sql=UPDATE variables SET (id,lstchg,value)%3D(\'"+MapItem.gps+"\',LOCALTIMESTAMP,\'"+document.getElementById("Itmpos").innerHTML+"\')%20WHERE%20id%3D%27"+MapItem.gps+"%27",fncnone);
		}
		GetUrlB("./setitems.jsp?sql=INSERT INTO mapitems (layer,variable,graph,zoomrange,infcmps,color,pos) VALUES (%27"+MapItem.layer+"%27,%27"+MapItem.variable+"%27,%27"+MapItem.graph+"%27,%27"+MapItem.zoom+"%27,%27"+MapItem.infcmp+"%27,%27"+Color+"%27,%27"+MapItem.gps+"%27)",fncnone);
		GetUrlB('./getlist.jsp?cmps=*&tbl=mapitems&ord=variable',rcvMapList);
}
function ModMapItm(key)
{
		RemoveUnusedItem(MapItem.infcmp);
		var Color="";
		for(var i=0;i<MapItem.color.length;i++)
		{
			Color+="/"+MapItem.color[i];
		}
		{
			GetUrlB("./setitems.jsp?sql=INSERT INTO variables (id,lstchg,value) VALUES (\'"+MapItem.gps+"\',LOCALTIMESTAMP,\'"+document.getElementById("Itmpos").innerHTML+"\')",fncnone);
			GetUrlB("./setitems.jsp?sql=UPDATE variables SET (id,lstchg,value)%3D(\'"+MapItem.gps+"\',LOCALTIMESTAMP,\'"+document.getElementById("Itmpos").innerHTML+"\')%20WHERE%20id%3D%27"+MapItem.gps+"%27",fncnone);
		}
		GetUrlB("./setitems.jsp?sql=UPDATE mapitems SET (variable,graph,zoomrange,infcmps,color,pos)%3D(%27"+MapItem.variable+"%27,%27"+MapItem.graph+"%27,%27"+MapItem.zoom+"%27,%27"+MapItem.infcmp+"%27,%27"+Color+"%27,%27"+MapItem.gps+"%27)%20WHERE%20key%3D"+key,fncnone);
		GetUrlB('./getlist.jsp?cmps=*&tbl=mapitems&ord=variable',rcvMapList);
}
function NewMapItm()
{
	IdxCol=0;
	MapItem.key=0;
	MapItem.layer="0";
	MapItem.variable="";
	MapItem.graph="Circle 20";
	MapItem.zoom="0,28";
	MapItem.infcmp=["","","",""];
	MapItem.color=["X","150,255,150"];
	MapItem.gps="";
}
function rcvMapFncList(i)
{
	IdxCol=0;
	MapItem.key=MapItemList[i][0];
	MapItem.variable=MapItemList[i][1];
	MapItem.graph=MapItemList[i][2];//="Circle";
	MapItem.zoom=MapItemList[i][3];
	MapItem.infcmp=MapItemList[i][4];
	MapItem.infcmp=replaceAll(MapItem.infcmp,",undefined","");
	MapItem.infcmp=MapItem.infcmp.split(",");
	RemoveUnusedItem(MapItem.infcmp);
	MapItem.color=MapItemList[i][5].split("/");
	RemoveUnusedItem(MapItem.color);
	MapItem.gps=MapItemList[i][6];
	MapItem.layer=""+parseInt("0"+MapItemList[i][7]);
	RefreshMapItem();
}
function RefreshMapItem()
{
	document.getElementById("TcHttpConfTitle").innerHTML=Str_MapList;
	document.getElementById("TcHttpConfBody").innerHTML=ShowMapItem();
	if (winList['TcHttpConf'])
	{
		winList["TcHttpConf"].open();
		winList["TcHttpConf"].SetH("400px");
	}
}

function SetMapItemVar(VarName)
{
	if(VarName!='')
	{
		if(VarName=='New')
		{
			VarName=prompt(Str_InNameCamera)
			if(VarName!='')
			{
				VarName=replaceAll(VarName," ","_");
				MapItem.variable='/'+Str_Cameras+'/'+VarName+'/status';
				GetUrlB("./setitems.jsp?sql=INSERT INTO variables (id,lstchg,value) VALUES (\'%2F"+Str_Cameras+"%2F"+VarName+"%2Fstatus\',LOCALTIMESTAMP,\'ok\')",fncnone);
				GetUrlB('./getitems.jsp?sql=SELECT * FROM variables order by id',rcvFastSts);
				GetUrlB('./getitems.jsp?sql=SELECT * FROM variables order by id',ShowMapItem);
			}
		}
		else
		{
			MapItem.variable=VarName;
			setTimeout('ShowMapItem()',500);
		}
	}
}
function ShowMapItem()
{
	var out="";
	var Z=[0,28];
	Z=MapItem.zoom.split(",");
	var C=[128,128,128];
	if((MapItem.color.length%2)==0)
		C=MapItem.color[IdxCol+1].split(",");
	MapItem.layer=parseInt(MapItem.layer);
	out+="<table border=\"1\" cellpadding=\"2\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"100%\" style=\"border-collapse:collapse;border:2px solid #000000;\">\n";
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Parameter+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Config+"</font>\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Layer+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<select class=\"INTEXT\" onchange=\"if(this.value!=''){MapItem.layer=this.value;ShowMapItem();}return false;\" >\n";
		out+=GenOptionsV(OptLayers,parseInt(MapItem.layer));
		out+="		</select><br/>\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Variable+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		if(MapItem.layer==0)
		{
			out+="<select class=\"INTEXT\" onchange=\"if(this.value!=''){MapItem.variable=this.value;}return false;\"";
		}
		if(MapItem.layer==1)
		{
			out+="<select class=\"INTEXT\" onchange=\"SetMapItemVar(this.value);return false;\"";
		}
		if(MapItem.key!=0)
			out+=" disabled";
		out+=" >\n";
		out+="			<option value=\"\" ></option>\n";
		if(MapItem.layer==1)
			out+="			<option value=\"New\" >New</option>\n";
		for(var i=0;i<VarTree.length;i++)
		{
			if( MapItem.layer==0 || (MapItem.layer==1  && (VarTree[i][0].indexOf('/'+Str_Cameras)!=-1) ) )
			{
				out+="<option value=\""+VarTree[i][0]+"\"";
				if(VarTree[i][0]==MapItem.variable)
					out+=" selected=\"selected\"";
				out+=" >"+VarTree[i][0]+"</option>\n";
			}
		}
		out+="		</select><br/>\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	if(MapItem.layer==0)
	{
		{
			out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
			out+="	<td align=\"center\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Str_BubleInfos+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<select class=\"INTEXT\" onchange=\"if(this.value!=''){MapItem.infcmp[0]=this.value;}return false;\" >\n";
			out+="			<option value=\"\" ></option>\n";
			for(var i=0;i<VarTree.length;i++)
			{
				out+="		<option value=\""+VarTree[i][0]+"\"";
				if(VarTree[i][0]==MapItem.infcmp[0])
					out+=" selected=\"selected\"";
				out+=" >"+VarTree[i][0]+"</option>\n";
			}
			out+="		</select><br/>\n";
			out+="		<select class=\"INTEXT\" onchange=\"if(this.value!=''){MapItem.infcmp[1]=this.value;}return false;\" >\n";
			out+="			<option value=\"\" ></option>\n";
			for(var i=0;i<VarTree.length;i++)
			{
				out+="		<option value=\""+VarTree[i][0]+"\"";
				if(VarTree[i][0]==MapItem.infcmp[1])
					out+=" selected=\"selected\"";
				out+=" >"+VarTree[i][0]+"</option>\n";
			}
			out+="		</select><br/>\n";
			out+="		<select class=\"INTEXT\" onchange=\"if(this.value!=''){MapItem.infcmp[2]=this.value;}return false;\" >\n";
			out+="			<option value=\"\" ></option>\n";
			for(var i=0;i<VarTree.length;i++)
			{
				out+="		<option value=\""+VarTree[i][0]+"\"";
				if(VarTree[i][0]==MapItem.infcmp[2])
					out+=" selected=\"selected\"";
				out+=" >"+VarTree[i][0]+"</option>\n";
			}
			out+="		</select><br/>\n";
			out+="		<select class=\"INTEXT\" onchange=\"if(this.value!=''){MapItem.infcmp[3]=this.value;}return false;\" >\n";
			out+="			<option value=\"\" ></option>\n";
			for(var i=0;i<VarTree.length;i++)
			{
				out+="		<option value=\""+VarTree[i][0]+"\"";
				if(VarTree[i][0]==MapItem.infcmp[3])
					out+=" selected=\"selected\"";
				out+=" >"+VarTree[i][0]+"</option>\n";
			}
			out+="		</select><br/>\n";
			out+="	</td>\n";
			out+="</tr>\n";
		}
		//---------------------------------------------------------------------
		{
			out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
			out+="	<td align=\"center\">\n";
			out+="		<font id=\"ShwColor\"  style=\"color: #000000; background-color: #ffffff\" size=\"2\" face=\"Verdana\">[ "+Str_Color+" ]</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\">\n";
			out+="	<input class=\"INTEXT\" size=\"5\" maxlength=\"25\" value=\""+MapItem.color[IdxCol]+"\" onkeyup=\"MapItem.color[IdxCol]=this.value;UpDtCl();\" /><br/>\n";
			out+="	R<input onchange=\"changeAll();\" id=\"slideRed\"  min=\"0\" max=\"255\" type=\"range\" value =\""+C[0]+"\" /><br/>";
			out+="	G<input onchange=\"changeAll();\" id=\"slideGreen\" min=\"0\" max=\"255\" type=\"range\" value =\""+C[1]+"\" /><br/>";
			out+="	B<input onchange=\"changeAll();\" id=\"slideBlue\" min=\"0\" max=\"255\" type=\"range\" value =\""+C[2]+"\" /><br/>";
			out+="	</td>\n";
			out+="</tr>\n";
		}
		//---------------------------------------------------------------------
		{
			out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
			out+="	<td align=\"center\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Str_Color+"/"+Str_Status+"</font>\n";
			out+="		<img src=\"../img/add.png\" width=\"18\" height=\"18\" border=\"0\" onclick=\"AddStsVarCol();UpDtCl();\" /><br />\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\" id=\"StsCol\">\n";
			out+=UpDtCl();
			out+="	</td>\n";
			out+="</tr>\n";
		}
	}
	//=====================================================================
	if(MapItem.layer==1)
	{
		//---------------------------------------------------------------------
		{
			out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
			out+="	<td align=\"center\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Str_URL+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="<input onchange=\"MapItem.infcmp=this.value;return false;\" value =\""+MapItem.infcmp+"\" /><br/>";
			out+="	</td>\n";
			out+="</tr>\n";
		}
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Ubicacion+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<select class=\"INTEXT\" onchange=\"chgps(this.value);return false;\" >\n";
		out+="			<option value=\"\" ></option>\n";
		out+="			<option value=\"New\" >New</option>\n";
		for(var i=0;i<VarTree.length;i++)
		{
			if(VarTree[i][0].indexOf("Location")!=-1)
			{
				out+="		<option value=\""+VarTree[i][0]+"\"";
				if(VarTree[i][0]==MapItem.gps)
					out+=" selected=\"selected\"";
				out+=" >"+VarTree[i][0]+"</option>\n";
			}
		}
		out+="		</select><br/>\n";
		out+="		<font size=\"1\" id=\"Itmpos\" face=\"Verdana\" onclick=\"MapStrPos(this.innerHTML);\" >";
		out+=GetIdVal(MapItem.gps);
		out+="		</font>\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" id=\"Itmzoom\" face=\"Verdana\">"+Str_ZoomRange+"["+Z+"]</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="	<input onchange=\"changeZoom(0);\" id=\"StartZoom\"  min=\"0\" max=\"28\" type=\"range\" value =\""+Z[0]+"\" /><br/>";
		out+="	<input onchange=\"changeZoom(1);\" id=\"EndZoom\" min=\"0\" max=\"28\" type=\"range\" value =\""+Z[1]+"\" /><br/>";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Representacion+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		if(MapItem.layer==0)
		{
			out+="		<select class=\"INTEXT\" onchange=\"if(this.value!=''){MapItem.graph=this.value;}return false;\" >\n";
			out+=GenOptionsV(OptGraphC,MapItem.graph);
			out+="		</select><br/>\n";
		}
		if(MapItem.layer==1)
		{
			MapItem.graph='../img/camera.png';
			out+="<img src=\"../img/camera.png\" width=\"18\" height=\"18\" border=\"0\" /><br />\n";
		}
		out+="	</td>\n";
		out+="</tr>\n";
	}// */
	//---------------------------------------------------------------------
	out+="</table>\n";
	if(MapItem.key==0)
	{
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Add+"\" onclick=\"AddMapItm();winList['TcHttpConf'].close();return false;\" />\n";
	}
	else
	{
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_save+"\" onclick=\"ModMapItm("+MapItem.key+");winList['TcHttpConf'].close();return false;\" />\n";
	}
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"FncMapClk=fncnone;winList['TcHttpConf'].close();return false;\" />\n";
	if(document.getElementById("TcHttpConfBody"))
		document.getElementById("TcHttpConfBody").innerHTML=out;
	return out;
}
//---------------------------------------------------------------------------------------------------------------------------------------
function chgps(valor)
{
	var id
	FncMapClk=fncnone;
	if(valor!='')
	{
		if(valor!='New')
		{
			MapItem.gps=valor;
			document.getElementById("Itmpos").innerHTML=GetIdVal(MapItem.gps);
		}
		else
		{
			if(MapItem.variable.lastIndexOf("/")!=-1)
			{
				document.getElementById("Itmpos").innerHTML="";
				id=MapItem.variable.substring(0,MapItem.variable.lastIndexOf("/"));
				id=id+"/Location";
				MapItem.gps=id;
				FncMapClk=setitmpos;
			}
			else
				alert(Str_AlertSelectVar);
		}
	}
}
function setitmpos(pos) 
{
	if(MapItem.graph.indexOf("Circle")!=-1)
		document.getElementById("Itmpos").innerHTML=(Math.round(pos.cord[1]*10000)/10000)+","+(Math.round(pos.cord[0]*10000)/10000)+","+pos.zoom;
	if(MapItem.graph.indexOf("LineString")!=-1)
		document.getElementById("Itmpos").innerHTML+=(Math.round(pos.cord[1]*10000)/10000)+","+(Math.round(pos.cord[0]*10000)/10000)+",";
}
//---------------------------------------------------------------------------------------------------------------------------------------
function changeZoom(C) 
{
    var ObjS=document.getElementById('StartZoom');
    var ObjE=document.getElementById('EndZoom');
		if(C==0)
		{
			if(parseInt(ObjS.value)>parseInt(ObjE.value))
				ObjE.value=ObjS.value;
		}
		if(C==1)
		{
			if(parseInt(ObjE.value)<parseInt(ObjS.value))
				ObjS.value=ObjE.value;
		}
		MapItem.zoom=ObjS.value+","+ObjE.value;
		document.getElementById('Itmzoom').innerHTML=Str_ZoomRange+"["+MapItem.zoom+"]";
		RefreshMapItem();
}
function changeAll() 
{
    var C =[0,0,0]
		C[0]=document.getElementById('slideRed').value;
    C[1]=document.getElementById('slideGreen').value;
    C[2]=document.getElementById('slideBlue').value;
    document.getElementById('ShwColor').style.backgroundColor = "rgb("+C[0]+","+C[1]+","+C[2]+")";
		document.getElementById('ShwColor').style.color = "rgb("+(255-C[0])+","+(255-C[1])+","+(255-C[2])+")";
		MapItem.color[IdxCol+1]=C[0]+","+C[1]+","+C[2];
		UpDtCl();
}
function AddStsVarCol()
{
	var i=MapItem.color.length
	i-=(i%2);
	MapItem.color[i]="X";
	MapItem.color[i+1]="255,255,255";
}
function UpDtCl()
{
		var out="";
    var C =[0,0,0]
		if(MapItem.color.length<=IdxCol)
			IdxCol=0;
		if((MapItem.color.length%2)==0)
		{
			for(var i=0;i<MapItem.color.length;i+=2)
			{
				C=MapItem.color[i+1].split(",");
				out+="<font style=\"color:rgba("+(255-C[0])+","+(255-C[1])+","+(255-C[2])+",1);background-color:rgba("+C[0]+","+C[1]+","+C[2]+",1);\" size=\"2\" face=\"Verdana\" onclick=\"IdxCol="+i+";ShowMapItem();\">[ "+MapItem.color[i]+" ]</font>\n";
			  out+="<img src=\"../img/error1.jpg\" width=\"18\" height=\"18\" border=\"0\" onclick=\"MapItem.color.splice("+i+",2);IdxCol=0;UpDtCl();\" /><br />\n";
			}
			if(document.getElementById('StsCol'))
				document.getElementById('StsCol').innerHTML=out;
		}
		return out;
}
//---------------------------------------------------------------------------------------------------------------------------------------
function WinMapResized()
{
	setTimeout( function() { map.updateSize();}, 200);
}
function UpDateMap()
{
	var color;
	var Color2 = "rgba(150,150,150,1) rgba(100,100,100,0.8)";
	var col;
	var valor="";
	var Location="";
	var Zoom;
	var MapZoom=0;
	var i=0;
	var b=0;
	winList["WinAllMap"].FixSize(mapFixedSize);
	winList["WinAllMap"].ResizeFnc=WinMapResized;
	/*while(i<MapItemList.length && b<MapItemListBk.length)
	{
		if(MapItemList[i][0]>MapItemListBk[b][0])
		{
			//alert("Borrado:"+MapItemListBk[b][1]);
			b++;
		}
		if(MapItemList[i][0]<MapItemListBk[b][0])
		{
			//alert("Agregado:"+MapItemList[i][1]);
			i++;
		}
		if(MapItemList[i][0]==MapItemListBk[b][0])
		{
			i++;
			b++;
		}
	}// */
	i=0;
	while(i<MapItemList.length)
	{
		Zoom=MapItemList[i][3].split(",");
		MapZoom=map.getView().getZoom();
		if(MapZoom>=parseInt(Zoom[0]) && MapZoom<=parseInt(Zoom[1]))
		{
			Color2 = "rgba(150,150,150,1) rgba(100,100,100,0.8)";
			valor=GetIdVal(MapItemList[i][1]);
			Location=GetIdVal(MapItemList[i][6]);
			if(parseInt('0'+MapItemList[i][7])==0)	//controllers
			{
				color=MapItemList[i][5].split("/");
				RemoveUnusedItem(color);
				for(var a=0;a<color.length;a+=2)
				{
					if(valor.indexOf(color[a])!=-1)
					{
						col=color[a+1].split(",");
						Color2="rgba("+col[0]+","+col[1]+","+col[2]+",1) rgba("+col[0]+","+col[1]+","+col[2]+",0.8)"
					}
				}
				UpDtMapItm(MapItemList[i][1],MapItemList[i][2],Location,Color2);
			}
			if(parseInt('0'+MapItemList[i][7])==1)	//Cameras
			{
				UpDtMapMrk(MapItemList[i][1],MapItemList[i][2],Location,Color2);
			}			
		}
		else
		{
			DelMapItm(MapItemList[i][1],parseInt('0'+MapItemList[i][7]));
		}
		i++;
	}
}

function SetMapSts(idx)
{
	var b=0;
	var Color2 = "rgba(150,150,150,1) rgba(100,100,100,0.8)";
	var Color;
	if(FastSts[idx].Lnk)
	{
		if(FastSts[idx].Lnk.indexOf("Timeout")!=-1)
			Color2= "rgba(150,150,255,1) rgba(100,100,150,0.8)";
		if(FastSts[idx].Lnk.indexOf("ok")!=-1)
			Color2= "rgba(150,255,150,1) rgba(100,150,100,0.8)";
	}
	if(FastSts[idx].Plcs)
	{
		for(b=0;b<FastSts[idx].Plcs.length;b++)
		{
			if(FastSts[idx].Plcs[b])
			{
				Color=Color2;
				if(FastSts[idx].Plcs[b].Status)
				{
					if(FastSts[idx].Plcs[b].Status.indexOf("Error")!=-1)
						Color = "rgba(255,150,150,1) rgba(150,100,100,0.8)";
					if(FastSts[idx].Plcs[b].Status.indexOf("Flashing")!=-1)
						Color = "rgba(150,150,100,1) rgba(255,255,150,0.8)";
				}
				if(FastSts[idx].Plcs[b].Location)
					UpDtMapItm(FastSts[idx].Id+"/"+FastSts[idx].Plcs[b].Nombre,"Circle 20",FastSts[idx].Plcs[b].Location,Color);
			}
		}
	}
	if(FastSts[idx].IOs)
	{
		for(b=0;b<FastSts[idx].IOs.length;b++)
		{
			if(FastSts[idx].IOs[b])
			{
				Color = "rgba(150,150,150,1) rgba(100,100,100,0.8)";
				if(FastSts[idx].IOs[b].Status)
				{
					if(FastSts[idx].IOs[b].Status.indexOf("precent")!=-1)
						Color = "rgba(150,255,150,1) rgba(100,150,100,0.8)";
				}
				if(FastSts[idx].IOs[b].Location)
					UpDtMapItm(FastSts[idx].Id+"/IOs["+b+"]","Circle 15",FastSts[idx].Plcs[b].Location,Color);
			}
		}
	}
}

function GetBuble(IdPlcSts)
{
	var campos="";
	var out ="<p>";
	for(var i=0;i<MapItemList.length;i++)
	{
		if(MapItemList[i][1]==IdPlcSts)
		{
			if(parseInt('0'+MapItemList[i][7])==0)
			{
				out+="<img src=\"../img/efile.png\" width=\"18\" height=\"18\" border=\"0\" onclick=\"rcvMapFncList("+i+");\" />"+IdPlcSts;
				out+="<br />\n";
				campos=MapItemList[i][4];
				campos=replaceAll(campos,"undefined","");
				campos=campos.split(",");
				RemoveUnusedItem(campos);
				for(var b=0;b<campos.length;b++)
				{
					out+=campos[b].substring(campos[b].lastIndexOf("/")+1);
					out+=":";
					out+=GetIdVal(campos[b])+"<br />";
				}
				out+="<br />";
				break;
			}
			if(parseInt('0'+MapItemList[i][7])==1)
			{
				out+="<img src=\"../img/efile.png\" width=\"18\" height=\"18\" border=\"0\" onclick=\"rcvMapFncList("+i+");\" />"+IdPlcSts;
				out+="<br />\n";
				out+='<video src="'+MapItemList[i][4]+'">Your browser does not support the VIDEO tag and/or RTP streams.</video>';
			}
		}
	}
	out+="</p>\n";
	//out+="<a href=\"\" onclick=\"GetUrlB('./cruces/"+IdPlcSts+".svg',rcvPlcSts);return false;\" >\n"+Str_Cruce+"</a><br />\n"; //MapItems[feature.idx].Name
	return out;
}
//---------------------------------------------------------------------------------------------------------------------------------------
function SearchItem(name)
{
	for(var a=0;a<MapItems.length;a++)
	{
		if(MapItems[a].Name==name)
			return a;
	}
	return a;
}

function DelMapItm(Name,Layer)
{
	var idx=SearchItem(Name);
	if(idx<MapItems.length)
	{
		if(Layer==0)
		{
			vector.getSource().removeFeature(MapItems[idx].Feature);
			MapItems.splice(idx,1);
		}
		if(Layer==1)
		{
			markers.getSource().removeFeature(MapItems[idx].Feature);
			MapItems.splice(idx,1);
		}
	}
}

function UpDtMapItm(Name,Type,Cord2,Color)
{
	var res;
	Type=Type.split(" ");
	var Cord=Cord2.split(",");
	Color=Color.split(" ");
	if(Type[0].indexOf('Circle')!=-1)
	{
			var lat=parseFloat(Cord[0]);
			var lon=parseFloat(Cord[1]);
			if(isNaN(lat) || isNaN(lon))
			{
				return;
			}
			else
			{
				idx=SearchItem(Name);
				if(idx==MapItems.length)
				{
					MapItems[idx]= new Object();
				}
				else
				{
					res=compare2objects(MapItems[idx].pos,ol.proj.fromLonLat([lon,lat]));
					if(res)	
					{
						res=compare2objects(MapItems[idx].Style,new ol.style.Style({stroke:new ol.style.Stroke({color:Color[0],width:5}),fill:new ol.style.Fill({color:Color[1]}),radius:parseInt(Type[1])}));
						if(res)
						{
							return
						}
					}
					vector.getSource().removeFeature(MapItems[idx].Feature);
				}
				MapItems[idx].Name=Name;
				MapItems[idx].pos=ol.proj.fromLonLat([lon,lat]);
				MapItems[idx].Feature=new ol.Feature(new ol.geom.Circle(MapItems[idx].pos,parseInt(Type[1])));
				MapItems[idx].Style=new ol.style.Style({stroke:new ol.style.Stroke({color:Color[0],width:5}),fill:new ol.style.Fill({color:Color[1]}),radius:parseInt(Type[1])})
				MapItems[idx].Feature.setStyle(MapItems[idx].Style);
				MapItems[idx].Feature.idx=idx;
				vector.getSource().addFeature(MapItems[idx].Feature);
			}
	}
	if(Type[0].indexOf('Line')!=-1)
	{
			var lat1=parseFloat(Cord[0]);
			var lon1=parseFloat(Cord[1]);
			var lat2=parseFloat(Cord[2]);
			var lon2=parseFloat(Cord[3]);
			if(isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2))
			{
				return;
			}
			else
			{
				idx=SearchItem(Name);
				if(idx==MapItems.length)
				{
					MapItems[idx]= new Object();
				}
				else
				{
					res=compare2objects(MapItems[idx].pos,[ol.proj.fromLonLat([lon1,lat1]),ol.proj.fromLonLat([lon2,lat2])]);
					if(res)	
					{
						res=compare2objects(MapItems[idx].Style,new ol.style.Style({stroke: new ol.style.Stroke({color:Color[0],width:parseInt(Type[1])})	}));
						if(res)
						{
							return
						}
					}
					vector.getSource().removeFeature(MapItems[idx].Feature);
				}
				MapItems[idx].Name=Name;
				MapItems[idx].pos =[ol.proj.fromLonLat([lon1,lat1]),ol.proj.fromLonLat([lon2,lat2])];
				MapItems[idx].Feature=new ol.Feature(new ol.geom.LineString(MapItems[idx].pos));
				MapItems[idx].Style=new ol.style.Style({stroke: new ol.style.Stroke({color:Color[0],width:parseInt(Type[1])})	});
				MapItems[idx].Feature.setStyle(MapItems[idx].Style);
				MapItems[idx].Feature.idx=idx;
				vector.getSource().addFeature(MapItems[idx].Feature);
			}
	}
}

function UpDtMapMrk(Name,Type,Cord2,Color)
{
	var res;
	var Cord=Cord2.split(",");
	Color=Color.split(" ");
	if(Type.indexOf('png')!=-1)
	{
			var lat=parseFloat(Cord[0]);
			var lon=parseFloat(Cord[1]);
			if(isNaN(lat) || isNaN(lon))
			{
				return;
			}
			else
			{
				idx=SearchItem(Name);
				if(idx==MapItems.length)
				{
					MapItems[idx]= new Object();
				}
				else
				{
					res=compare2objects(MapItems[idx].pos,ol.proj.fromLonLat([lon,lat]));
					if(res)	
					{
						res=compare2objects(MapItems[idx].Style,new ol.style.Style({stroke:new ol.style.Stroke({color:Color[0],width:5}),fill:new ol.style.Fill({color:Color[1]}),radius:parseInt(Type[1])}));
						if(res)
						{
							return
						}
					}
					markers.getSource().removeFeature(MapItems[idx].Feature);
				}
				MapItems[idx].Name=Name;
				MapItems[idx].pos=ol.proj.fromLonLat([lon,lat]);
				MapItems[idx].Feature=new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([lon,lat])));
				
				MapItems[idx].Style=new ol.style.Style({
								image:new ol.style.Icon({
										anchor: [0.5, 46],
										anchorXUnits: 'fraction',
										anchorYUnits: 'pixels',
										opacity: 0.95,
										src:Type //'icon.png'
										}),
								stroke:new ol.style.Stroke({width: 3,color: [255, 0, 0, 1]}),
								fill:new ol.style.Fill({color: [0, 0, 255, 0.6]})
								});
				MapItems[idx].Feature.setStyle(MapItems[idx].Style);
				MapItems[idx].Feature.idx=idx;
				markers.getSource().addFeature(MapItems[idx].Feature);
			}
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------
function InitWinOL()
{
	document.getElementById("WinAllMapTitle").innerHTML=Str_Map;
	document.getElementById("WinAllMapBody").innerHTML="<div id=\"AllMap\" class=\"map\"><div id=\"info\"></div></div>";
	winList["WinAllMap"].SetH(winList["WinAllMap"].frame.style.width);
	winUdate();
	winList["WinAllMap"].open();
	var idx=Reqest.length;
	//-------------------------------------------
	Reqest[idx]= new Object();
	Reqest[idx].Name=Str_MapItem;
	Reqest[idx].Url="./getlist.jsp?cmps=*&tbl=mapitems&ord=variable";
	Reqest[idx].Fnc=rcvMapListBK;
	Reqest[idx].Status=0;
	Reqest[idx].Refresh=10000;
	Reqest[idx].LstRqst=0;
	GetUrlB("./getlist.jsp?cmps=*&tbl=mapitems&ord=variable",rcvMapListBK);
}
function InitOL()
{
	var pos =GlobView.split(",");
	var lat=parseFloat(pos[0]);	//-34.62933;
	var lon=parseFloat(pos[1]);
	pos = ol.proj.fromLonLat([lon,lat]);
	//--------------------------------------------------------
	container = document.getElementById('popup');
	content = document.getElementById('popup-content');
	closer = document.getElementById('popup-closer');
	container.style.display = "none";
	//-------------------------------------------------------- Mapa
	layer = new ol.layer.Tile({source: new ol.source.OSM()});
	//-------------------------------------------------------- Overlay
	popup = new ol.Overlay({position: pos,element:container});
	/*var OverMk = new ol.Overlay({
                        position: [lat, lon],
                        positioning: 'center-center',
                        element: document.getElementById('OverMk'),
                        stopEvent: false
                    });// */
	//-----------------------------------------------------
	var pointFeature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([lon,lat])));
	var iconstyle = new ol.style.Style({
							image:	new ol.style.Icon({
										anchor: [0.5, 46],
										anchorXUnits: 'fraction',
										anchorYUnits: 'pixels',
										opacity: 0.95,
										src:'icon.png'	//'https://openlayers.org/en/v3.20.1/examples/data/icon.png'	//'/icon.png'	//
										}),
							stroke:	new ol.style.Stroke({width: 3,color: [255, 0, 0, 1]}),
							fill:	new ol.style.Fill({color: [0, 0, 255, 0.6]})
							});
	var iconsource = new ol.source.Vector({
						wrapX: false,
						ratio: 1,
						params: {'LAYERS': 'show:0'},
						features: [] //pointFeature
						});
	markers = new ol.layer.Vector({
						title:'Camaras',
						source: iconsource,
						style: iconstyle
						});
	//-----------------------------------------------------
	StyleVar = new ol.style.Style({
						fill: new ol.style.Fill({color: 'rgba(255, 100, 100, 0.8)'}),
						stroke: new ol.style.Stroke({color: '#ff3333',width: 2}),
						image: new ol.style.Circle({radius: 17,fill: new ol.style.Fill({color: '#ff3333'})})
					});
	source = new ol.source.Vector({
						wrapX: false,
						ratio: 1,
						params: {'LAYERS': 'show:0'},
					});
	vector = new ol.layer.Vector({
                        title: 'Controladores',
						source:source,
						style:StyleVar
					});// */
	//-----------------------------------------------------
	View = new ol.View({center: ol.proj.transform([lon,lat],'EPSG:4326','EPSG:3857'),zoom:12})
	map = new ol.Map({
				target:'AllMap',
				layers:[layer],
				overlays: [popup],
				view:View
				});
	//--------------------------------------------------------
	var layerSwitcher = new ol.control.LayerSwitcher({tipLabel: 'Légende'});
	//AddMrk();
	//--------------------------------------------------------
	map.addLayer(vector);
	map.addLayer(markers);
	map.addOverlay(popup);
    //map.addOverlay(OverMk);
    map.addControl(layerSwitcher);
	//--------------------------------------------------------
	//map.on('pointermove',OnMoveMap);
	map.on('click',OnClickMap);
}

function AddMrk(lat,lon)
{
	var size = new ol.Size(21,25);
	var offset = new ol.Pixel(-(size.w/2), -size.h);
	var icon = new ol.Icon('http://www.openlayers.org/dev/img/marker.png',size,offset);
	markers.addMarker(new ol.Marker(new ol.LonLat(lon,lat),icon));
}

function OnMoveMap(evt)
{
	if (evt.dragging)
	{
		return;
	}
	displayFeatureInfo(map.getEventPixel(evt.originalEvent));
}
function OnClickMap(evt)
{
	var out="";
	var coordinate = evt.coordinate;
	var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
	var pos= new Object();
	pos.cord=ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
	pos.zoom=map.getView().getZoom();
	LOG("Map:"+pos.cord+" Zoom:"+pos.zoom+"\n");
	FncMapClk(pos);
	popup.setPosition(coordinate);
	var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){return feature;});
	if(feature) //feature.idx!=='undefined'
	{
		container.style.display = "";
		content.innerHTML="";
		content.innerHTML+=GetBuble(MapItems[feature.idx].Name);
		content.innerHTML+="<code>"+hdms+"</code>";
	}
	else
	{
		container.style.display = "none";
	}
}
function delfnc()
{
	var iter=vector.getSource();
	var fea=iter.getFeatures();
	for(var i=0;i<fea.length;i++)
	{
		iter.removeFeature(fea[i]);
	}
}
function MapStrPos(pos)
{
	pos=pos.split(',');
	MapPos(pos[0],pos[1],pos[2])
}
function MapPos(lat,lon,zoom)
{
	lat=parseFloat(lat);
	lon=parseFloat(lon);
	map.getView().setCenter(ol.proj.fromLonLat([lon, lat]));
	map.getView().setZoom(zoom);
}
//---------------------------------------------------------------------------------------------------------------------------------------
function rcvMapListBK(Datos)
{
	Datos=rcvtbl(Datos);
	MapItemListBk=owl.deepCopy(MapItemList);
	MapItemList=owl.deepCopy(Datos);
	UpDateMap();
}
function rcvMapList(Datos)
{
	Datos=rcvtbl(Datos);
	MapItemList=owl.deepCopy(Datos);
	if (winList["List"])
	{
		winList["List"].open();
		winList["List"].SetH((4+25+(Datos.length*50))+"px");
		winList["List"].SetW(500+"px");
	}
	document.getElementById("ListTitle").innerHTML=Str_MapList;
	document.getElementById("ListBody").innerHTML=ShowMapList(Datos);
}
function ShowMapList(Datos)
{
	var x=0;
	var y=0;
	var bgcolor="";
	var out="";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"winList['List'].close();return false;\" />\n";
	out+="<table border=\"1\" cellpadding=\"2\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"100%\" style=\"border-collapse:collapse;border:2px solid #000000;\">\n";
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\" >\n";
		out+="	<td align=\"center\">\n";
		out+="	</td>\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Ident+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Type+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Zoom+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_BubleInfos+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Color+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Ubicacion+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" >\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	y=0;
	while(y<Datos.length)
	{
		if((y%2)==0)
			bgcolor="#808080";
		else
			bgcolor="#A0A0A0";
		out+="<tr align=\"center\" bgcolor=\""+bgcolor+"\" >\n";
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"rcvMapFncList("+y+");\">\n";
		out+="		<img src=\"../img/efile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		{
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Datos[y][1]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Datos[y][2]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Datos[y][3]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Datos[y][4]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Datos[y][5]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\" onclick=\"MapStrPos('"+GetIdVal(Datos[y][6])+"');\" >\n";
			out+="		<font size=\"1\" face=\"Verdana\" >"+GetIdVal(Datos[y][6])+"</font>\n";
			out+="	</td>\n";
		}
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"DelMapItm('"+Datos[y][1]+"');GetUrlB('./setitems.jsp?sql=DELETE FROM mapitems WHERE key="+Datos[y][0]+"',fncnone);GetUrlB('./getlist.jsp?cmps=*&tbl=mapitems&ord=variable',rcvMapList);\">\n";
		out+="		<img src=\"../img/defile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		out+="</tr>\n";
		y++;
	}
	//---------------------------------------------------------------------
	out+="</table>\n";
	return out;
}
//---------------------------------------------------------------------------------------------------------------------------------------
/*		var LinePoints=[ol.proj.fromLonLat([-46.776000,-23.523000]),ol.proj.fromLonLat([-46.779000,-23.521000])];
		var lineFeature = 		new ol.Feature(new ol.geom.LineString(LinePoints));
		var lineStyle = new ol.style.Style({stroke: new ol.style.Stroke({color:'rgba(140,20,20,0.7)',width:10})	});
		lineFeature.setStyle(lineStyle);
		source.addFeature(lineFeature);	// */

		/*var LinePoints=[ol.proj.fromLonLat([-46.776000,-23.521000]),ol.proj.fromLonLat([-46.779000,-23.523000])];
		var lineFeature = 		new ol.Feature(new ol.geom.LineString(LinePoints));
		var lineStyle = new ol.style.Style({stroke: new ol.style.Stroke({color:'rgba(20,140,20,0.7)',width:10})	});
		lineFeature.setStyle(lineStyle);
		source.addFeature(lineFeature); // */
		
		/*var PolyPoints=[ol.proj.fromLonLat([-46.776000,-23.523000]),
										ol.proj.fromLonLat([-46.776000,-23.521000]),
										ol.proj.fromLonLat([-46.779000,-23.521000]),
										ol.proj.fromLonLat([-46.779000,-23.523000]),
										ol.proj.fromLonLat([-46.776000,-23.523000])];
		var polygonFeature = 	new ol.Feature(new ol.geom.Polygon([PolyPoints]));
		source.addFeature(polygonFeature); // */