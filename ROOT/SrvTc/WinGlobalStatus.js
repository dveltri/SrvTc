var FastSts =  new Array();
var VarTree =  new Array();
var PLCsfltr=  new Array();
var timestamp_fltr=0;
var Reqest_idx=0;
var Stsrawcolor=[180,180,180];
var PhCol=["#A0A0A0","#FF0000","#FFFF00","#FF8F00","#00FF00"];
//=================================================
function InitFastSts()
{
	Reqest_idx=Reqest.length;
	//-------------------------------------------
	Reqest[Reqest_idx]= new Object();
	Reqest[Reqest_idx].Name=Str_Status;
	Reqest[Reqest_idx].WinName=Str_Status;
	Reqest[Reqest_idx].Url=null;
	Reqest[Reqest_idx].FncUrl=GlobalStatusUrl;
	//Reqest[Reqest_idx].Url="./getitems.jsp?sql=SELECT * FROM variables WHERE id LIKE %27%2FID%25%27 order by id";
	//select CONCAT(var1.value,'/',var3.id),var2.value from variables AS var1 JOIN variables AS var2 ON var2.id = var1.value JOIN variables AS var3 ON var3.id LIKE CONCAT(var2.value,'%') WHERE var1.id LIKE 'Group' AND var3.id LIKE '%Status%'
	Reqest[Reqest_idx].Fnc=rcvFastSts;
	Reqest[Reqest_idx].Status=0;
	Reqest[Reqest_idx].Refresh=1000;
	Reqest[Reqest_idx].LstRqst=0;
	winAdd(Reqest[Reqest_idx].WinName);
	winList[Reqest[Reqest_idx].WinName].SetW(340);
	winList[Reqest[Reqest_idx].WinName].SetX(655);
	winUdate();
}
function GlobalStatusUrl()
{
	if (Reqest[Reqest_idx].timestamp)
	{
		var d = Reqest[Reqest_idx].timestamp;
		d.setMinutes(d.getMinutes()+d.getTimezoneOffset())
		d.setMilliseconds(d.getMilliseconds()-Reqest[Reqest_idx].Refresh)
		temp=d.getFullYear();
		var timestamp_fltr=temp+"-";
		temp=d.getMonth()+1;
		timestamp_fltr+=temp.pad()+"-";
		temp=d.getDate();
		timestamp_fltr+=temp.pad()+" ";
		temp=d.getHours();
		timestamp_fltr+=temp.pad()+":";
		temp=d.getMinutes();
		timestamp_fltr+=temp.pad()+":";
		temp=d.getSeconds();
		timestamp_fltr+=temp.pad()+".00";
		base = "./getitems.jsp?sql=SELECT * FROM variables WHERE lstchg >= \'"+timestamp_fltr+"\' order by id";
	}
	else
	{
		base = "./getitems.jsp?sql=SELECT * FROM variables order by id";
	}
	return base;
}

function rcvFastSts(Datos)
{
	var tmp=0;
	var plc=0;
	var id=0;
	var io=0;
	var ph=0;
	var pos;
	var TblSize=0;
	var Obj=Datos.Obj;
	var headers=Datos.getAllResponseHeaders();
	Datos=rcvtbl(Datos);
	LOGdirect("new vars updates:"+Datos.length);
	VarTree=owl.deepCopy(Datos);
	//---------------------------------------------------------
	UpDateMap();
	//---------------------------------------------------------
	//FastSts.length=0;
	for(var a=0;a<Datos.length;a++)
	{
		Datos[a][0]=Datos[a][0].split("/");
		RemoveUnusedItem(Datos[a][0]);
	}
	for(var a=0;a<Datos.length;a++)
	{
		id=SearchId(Datos[a][0][0]);
		if(id==FastSts.length)
		{
		  FastSts[id]= new Object();
			FastSts[id].Id=Datos[a][0][0];
			FastSts[id].Plcs= new Array();
			FastSts[id].IOs= new Array();
			FastSts[id].Phases= new Array();
		}
		tmp=-1;
		if(Datos[a][0][1])
		{
			//--------------------------------
			switch(Datos[a][0][1])
			{
				case "Group":
					FastSts[id].Group=Datos[a][1];
				break;
				case "Lnk_Status":
					FastSts[id].Lnk=Datos[a][1];
				break;
				case "RTC":
					FastSts[id].RTC=parseInt(Datos[a][1]);
				break;
				case "Nombre":
					FastSts[id].Nombre=Datos[a][1];
				break;
				case "address":
					FastSts[id].ip=Datos[a][1];
				break;
				case "Splan":
					FastSts[id].Splan=parseInt(Datos[a][0][2]);
				break;
			}
			//--------------------------------
			tmp=Datos[a][0][1].indexOf("PLC");
			if(tmp!=-1)	// parametros de PLC
			{
				plc=parseInt(Datos[a][0][1].substring(tmp+3));
				plc--;
				if(plc<4)
				{					
					if(!FastSts[id].Plcs[plc])
						FastSts[id].Plcs[plc]= new Object();
					//--------------------------------
					switch(Datos[a][0][2])
					{
						case "Status":
							FastSts[id].Plcs[plc].Status=Datos[a][1];
						break;
						case "Nombre":
							FastSts[id].Plcs[plc].Nombre=Datos[a][1];
						break;
						case "Cplan":
							FastSts[id].Plcs[plc].Cplan=Datos[a][1];
						break;
						case "Location":
							FastSts[id].Plcs[plc].Location=Datos[a][1];
						break;
						case "Error":
							FastSts[id].Plcs[plc].Error=Datos[a][1].split(",");
						break;
					}
					//--------------------------------
					tmp=Datos[a][0][2].indexOf("Phase");
					if(tmp!=-1)	// parametros de phase
					{
						if(!FastSts[id].Plcs[plc].Phases)
							FastSts[id].Plcs[plc].Phases= new Array();
						ph=parseInt(Datos[a][0][2].substring(tmp+5));
						ph--;
						if(ph<24)
						{
							if(!FastSts[id].Plcs[plc].Phases[ph])
								FastSts[id].Plcs[plc].Phases[ph]= new Object();
							switch(Datos[a][0][3])
							{
								case "Color":
									FastSts[id].Plcs[plc].Phases[ph].Color=Datos[a][1];
								break;
								case "Current":
									FastSts[id].Phases[ph].Current=Datos[a][1];
								break;
								case "Errors":
									FastSts[id].Plcs[plc].Phases[ph].Error=Datos[a][1];
								break;
							}
						}
					}
				}
			}
			//--------------------------------
			tmp=Datos[a][0][1].indexOf("Phase");
			if(tmp!=-1)
			{
				ph=parseInt(Datos[a][0][1].substring(tmp+5));
				ph--;
				if(ph<24)
				{
					if(!FastSts[id].Phases[ph])
						FastSts[id].Phases[ph]= new Object();
					switch(Datos[a][0][2])
					{
						case "Color":
							FastSts[id].Phases[ph].Color=Datos[a][1];
						break;
						case "Current":
							FastSts[id].Phases[ph].Current=Datos[a][1];
						break;
						case "Errors":
							FastSts[id].Phases[ph].Error=Datos[a][1];
						break;
					}
				}
			}
			//--------------------------------
			tmp=Datos[a][0][1].indexOf("IOs");
			if(tmp!=-1)
			{
				io=parseInt(Datos[a][0][1].substring(tmp+3));
				io--;
				if(!FastSts[id].IOs[io])
					FastSts[id].IOs[io]= new Object();
				switch(Datos[a][0][2])
				{
					case "Valor":
						FastSts[id].IOs[io].Valor=Datos[a][1];
					break;
					case "Conteos":
						FastSts[id].IOs[io].Conteos=Datos[a][1];
					break;
					case "Samples":
						FastSts[id].IOs[io].Samples=Datos[a][1];
					break;
					case "Status":
						FastSts[id].IOs[io].Status=Datos[a][1];
					break;
					case "Datos":
						FastSts[id].IOs[io].Datos=Datos[a][1];
					break;
				}
			}
			//--------------------------------
		}
	}
	//---------------------------------------------------------
	for(var a=0;a<FastSts.length;a++)
	{
		for(var b=0;b<FastSts[a].Plcs.length;b++)
		{
			if(FastSts[a].Plcs[b])
			{
				if(!FastSts[a].Plcs[b].Status)
				{
					FastSts[a].Plcs.splice(b,1);
				}
				else
						TblSize++;
			}
			else
			{
				FastSts[a].Plcs.splice(b,8);
			}
		}
	}
	//---------------------------------------------------------
	if (winList[Obj.WinName])
	{
		winList[Obj.WinName].SetH((10+30+30+(TblSize*24))+"px"); //("300px");
		winList[Obj.WinName].open();
		winAutoPos();
	}
	//setTimeout("CollapsibleLists.apply()",1000);
	return ShowFastSts();
}

function ShowFastSts2()
{
	var out="";
	out+="<ul class=\"collapsibleList\">\n";
 	for(var a=0;a<FastSts.length;a++)
	{
		out+="<li>";
		out+=FastSts[a].Id;
		out+="\n<ul>\n";
		for(var b=0;b<FastSts[a].Plcs.length;b++)
		{
			out+="<li>"+FastSts[a].Plcs[b].Nombre;
			out+="\n<ul>\n";
			for(var c=0;c<FastSts[a].Plcs[b].Phases.length;c++)
			{
				out+="<li>PH["+c+"]."+FastSts[a].Plcs[b].Phases[c].Color+"</li>";
			}
			out+="</ul>\n";
			out+="</li>\n";
		}
		out+="</ul>\n";
		out+="</li>\n";
	}
	out+="</ul>\n";
	return out;
}

function ShowFastSts()
{
	var rtc=0;
	var rawcolor=Stsrawcolor;
	var out="";
	var tout="";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Filtro+"\" onclick=\"newflt=prompt('"+Str_Filtro+"','');if(newflt!=null){PLCsfltr[PLCsfltr.length]=newflt;}return 0;\" /><br />\n";
	for(var i=0;i<PLCsfltr.length;i++)
	{
		out+="<input type=\"button\" class=\"INTEXT2\" value=\"[X]["+PLCsfltr[i]+"]\" onclick=\"PLCsfltr.splice("+i+",1);\" />\n";
	}
	out+="<table border=\"0\" cellpadding=\"2\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"100%\" style=\"border-collapse:collapse;border:1px solid rgba(0,0,0,1);\">\n";
	{
		//---------------------------------------------------------------------
		out+="<tr align=\"center\" bgcolor=\"#EEEEEE\">\n";
		out+="	<td align=\"center\" colspan=\"4\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">";
		out+="Total:"+FastSts.length;
		var ok=0
		var to=0;
		for(var a=0;a<FastSts.length;a++)
		{
			if(FastSts[a].Lnk)
			{
				if(FastSts[a].Lnk.indexOf("ok")!=-1)
					ok++;
			}
		}
		out+=" online:"+ok;
		out+=" offline:"+(FastSts.length-ok);
		out+="		</font>\n";
		out+="	</td>\n";
		out+="</tr>\n";
		//---------------------------------------------------------------------
		out+="<tr align=\"center\" bgcolor=\"#EEEEEE\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Source+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Virtual_Controlers+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Status_Controllers+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="	</td>\n";
		out+="</tr>\n";
		//---------------------------------------------------------------------
	}
	var bgcolor="";
	for(var a=0;a<FastSts.length;a++)
	{
		rawcolor=Stsrawcolor.slice();
		if((a%2)==0)
		{
			rawcolor[0]+=20;
			rawcolor[1]+=20;
			rawcolor[2]+=20;
		}
		if(FastSts[a].Lnk)
		{
			if(FastSts[a].Lnk.indexOf("ok")!=-1)
			{
				rawcolor[1]+=50;
				if(FastSts[a].Plcs && FastSts[a].Plcs[0] && FastSts[a].Plcs[0].Status && FastSts[a].Plcs[0].Status.indexOf("Flash")!=-1)
				{
					rawcolor[0]+=50;
				}
			}
			if(FastSts[a].Lnk.indexOf("Timeout")!=-1)
			{
				rawcolor[0]+=50;
			}
		}
		bgcolor="#"+rawcolor[0].toString(16)+""+rawcolor[1].toString(16)+""+rawcolor[2].toString(16)+"";
		//---------------------------------------------------------------------
		tout="<tr bgcolor=\""+bgcolor+"\" align=\"center\" class=\"bottom top\">\n";
		//--------------------
		tout+="	<td align=\"center\" valign=\"middle\"";
		if(FastSts[a].Plcs.length>1)
			tout+=" rowspan=\""+FastSts[a].Plcs.length+"\"";
		tout+=">\n";
		tout+="		<font size=\"1\" face=\"Verdana\">\n";
		if(FastSts[a].Lnk)
		{
			//-------------------------------------------------
			/*if(FastSts[a].Lnk.indexOf("ok")!=-1 && FastSts[a].ip)
			{
				//tout+="<a href=\"#\" onclick=\"window.open('"+url+":8080/web/index.xhtml?remotehost="+FastSts[a].ip+"&srv','_blank');";
				tout+="<a href=\"#\" onclick=\"window.open('../lp3/web/index.xhtml?remotehost="+FastSts[a].ip+"&srv','_blank');";
				if(FastSts[a].Lnk.indexOf("Paused")!=-1)
					tout+="GetUrlB('./setitems.jsp?sql=UPDATE variables SET (lstchg,value)%3D(LOCALTIMESTAMP,%27Runing%27)%20WHERE%20id%3D%27%2F"+FastSts[a].Id+"%2FLnk_Status%27',fncnone);";
				else
					tout+="GetUrlB('./setitems.jsp?sql=UPDATE variables SET (lstchg,value)%3D(LOCALTIMESTAMP,%27Paused%27)%20WHERE%20id%3D%27%2F"+FastSts[a].Id+"%2FLnk_Status%27',fncnone);";
				tout+="\" >\n";
				tout+=FastSts[a].Id+"</a>\n";
			}
			else // */
			{
				tout+=FastSts[a].Id;
			}
			/*//-------------------------------------------------
			{
				tout+="<a href=\"#\" onclick=\"";
				if(FastSts[a].Lnk.indexOf("Paused")!=-1)
					tout+="GetUrlB('./setitems.jsp?sql=UPDATE variables SET (lstchg,value)%3D(LOCALTIMESTAMP,%27Runing%27)%20WHERE%20id%3D%27%2F"+FastSts[a].Id+"%2FLnk_Status%27',fncnone);";
				else
					tout+="GetUrlB('./setitems.jsp?sql=UPDATE variables SET (lstchg,value)%3D(LOCALTIMESTAMP,%27Paused%27)%20WHERE%20id%3D%27%2F"+FastSts[a].Id+"%2FLnk_Status%27',fncnone);";
				tout+="\" >\n";
				if(FastSts[a].Lnk.indexOf("Paused")!=-1)
					tout+="<img src=\"../img/DisConnected.png\" width=\"18\" height=\"18\"  border=\"1\" />\n";
				else
					tout+="<img src=\"../img/Connected.png\"    width=\"18\" height=\"18\"  border=\"1\" />\n";
				tout+="</a>\n";
			}
			//-------------------------------------------------*/
		}
		if(FastSts[a].Splan)
		{
			tout+="Force:"+FastSts[a].Splan
		}
		tout+="    </font>\n";
		tout+="	</td>\n";
		//--------------------
		for(var b=0;b<FastSts[a].Plcs.length;b++)
		{
			if(FastSts[a].Plcs[b])
			{
				if(b>0)
					tout+="<tr bgcolor=\""+bgcolor+"\" align=\"center\" class=\"bottom top\">\n";
				tout+="	<td align=\"center\">\n";
				if(FastSts[a].Plcs[b].Location)
					tout+="		<a href=\"\" onclick=\"MapPos("+FastSts[a].Plcs[b].Location+");return false;\">";
				tout+="		<font size=\"1\" face=\"Verdana\">";
				if(FastSts[a].Nombre)
					tout+=FastSts[a].Nombre+" ";
				else
					tout+=FastSts[a].Plcs[b].Nombre+" ";
				tout+="		</font>\n";
				if(FastSts[a].Plcs[b].Location)
					tout+="		</a>\n";
				tout+="	</td>\n";
				tout+="	<td align=\"center\">\n";
				tout+="		<font size=\"1\" face=\"Verdana\">";
				tout+=FastSts[a].Plcs[b].Status;
				if(FastSts[a].Plcs[b].Error && FastSts[a].Plcs[b].Error[0]!="0")
					tout+=" "+FastSts[a].Plcs[b].Error[1];
				if(FastSts[a].Plcs[b].Cplan && FastSts[a].Plcs[b].Cplan.indexOf("97")!=-1)
					tout+=",LampOff";
				if(FastSts[a].Plcs[b].Cplan && FastSts[a].Plcs[b].Cplan.indexOf("99")!=-1)
					tout+=",Piscante";
				tout+="		</font>\n";
				tout+="	</td>\n";
				tout+="	<td align=\"center\">\n";
				tout+="		<a href=\"\" onclick=\"GetUrlB('./cruces/"+FastSts[a].Id+"_"+FastSts[a].Plcs[b].Nombre+".svg',rcvPlcSts);return false;\" >\n"; //IdPlcSts='"+FastSts[a].Id+"';
				tout+="			<img src=\"../img/plcs.png\" width=\"18\" height=\"18\" border=\"0\" />\n";
				tout+="		</a><br />\n";
				tout+="	</td>\n";
				tout+="</tr>\n";
				//---------------------------------------------------------
				if(winList[FastSts[a].Id+"_"+FastSts[a].Plcs[b].Nombre])// && winList[FastSts[a].Id+"_"+FastSts[a].Plcs[b].Nombre].isOpen==true)
				{
					winList[FastSts[a].Id+"_"+FastSts[a].Plcs[b].Nombre].open();
					winAutoPos();
					ShwPhases(a);
				}
			}
		}
		if(b==0)
		{
				tout+="	<td align=\"center\">\n";
				tout+="	</td>\n";
				tout+="	<td align=\"center\">\n";
				tout+="	</td>\n";
				tout+="	<td align=\"center\">\n";
				tout+="	</td>\n";
				tout+="</tr>\n";
		}
		if(PLCsfltr.length==0)
		{
			out+=tout;
		}
		else
		{
			for(var i=0;i<PLCsfltr.length;i++)
			{
				/*if(tout.indexOf(PLCsfltr[i])!=-1)
				{
					out+=tout;
					break;					
				}// */
				if(FastSts[a].Id && FastSts[a].Id.indexOf(PLCsfltr[i])!=-1)
				{
					out+=tout;
					break;					
				}
				if(FastSts[a].Nombre && FastSts[a].Nombre.indexOf(PLCsfltr[i])!=-1)
				{
					out+=tout;
					break;					
				}
				if(FastSts[a].Plcs && FastSts[a].Plcs[0] && FastSts[a].Plcs[0].Status && FastSts[a].Plcs[0].Status.indexOf(PLCsfltr[i])!=-1)
				{
					out+=tout;
					break;					
				}
			}
		}
	}
	out+="</table>\n";
	return out;
}

function SearchId(id)
{
	for(var a=0;a<FastSts.length;a++)
	{
		if(FastSts[a].Id==id)
			return a;
	}
	return a;
}
function GetIdVal(id)
{
	for(var a=0;a<VarTree.length;a++)
	{
		if(VarTree[a][0]==id)
			return VarTree[a][1];
	}
	return "";
}
function SubId(Vec,id)
{
	for(var a=1;a<=Vec.length;a++)
	{
		if(Vec[a-1].Id==id)
			return (a-1);
	}
	return 0;
}

//----------------------------------------------------------------