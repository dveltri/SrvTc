var Altrawcolor=[180,180,180];
var Altrafltr=new Array();
var Reports=null;
var ReqestIdx=0;
var Alerts;
//=================================================
function InitAlerts()
{
	var i=Reqest.length;
	//-------------------------------------------
	Reqest[i]= new Object();
	Reqest[i].Name=Str_Alerts;
	Reqest[i].WinName=Str_Alerts;
	ReqestIdx=i;
	UpDateUrl();
	Reqest[i].Fnc=rcvAlert;
	Reqest[i].Status=0;
	Reqest[i].Refresh=1000;
	Reqest[i].LstRqst=0;
	winAdd(Reqest[i].WinName);
	winUdate();
	winList[Reqest[i].WinName].SetY(710);//parseInt("0"+winList["WinAllMap"].frame.style.width)+70
}
function UpDateUrl()
{
	Reqest[ReqestIdx].Url="./getAlerts.jsp?sql=SELECT%20*%20FROM%20alerts";
	if(Altrafltr.length>=1)
	{
		Reqest[ReqestIdx].Url+="%20WHERE";
		for(var i=0;i<Altrafltr.length;i++)
		{
			if(i==0)
				Reqest[ReqestIdx].Url+="%20description LIKE %27%25"+Altrafltr[i]+"%25%27"
			else
				Reqest[ReqestIdx].Url+="%20OR description LIKE %27%25"+Altrafltr[i]+"%25%27"
		}
	}
	Reqest[ReqestIdx].Url+="%20order%20by%20time%20DESC";
}
//=================================================
function rcvAlert(Datos)
{
	var tmp="";
	var Obj=Datos.Obj;
	Datos=Datos.responseText;
	Datos=Datos.split("\n");
	RemoveUnusedItem(Datos);
	if(Datos.length!=0)
	{
		for(var a=0;a<Datos.length;a++)
		{
			Datos[a]=Datos[a].split("\t");
			/*if(Datos[a].length<3)
				return "";			//	*/
		}
	}
	if (winList[Obj.WinName])
	{
		winList[Obj.WinName].SetH((10+25+25+(Datos.length*20))+"px"); //("100px");
		winList[Obj.WinName].open();
		if(compare2objects(Alerts,Datos)!=true)
			winList[Obj.WinName].makeActive();
		winAutoPos();
	}
	Alerts=owl.deepCopy(Datos)
	//----------------------------
	return ShowAlerts();
}

function rcvReportsList(Datos)
{
	var tmp="";
	Reports=Datos.responseText;
	Reports=Reports.split("\n");
	RemoveUnusedItem(Reports);
	if(Reports.length!=0)
	{
		for(var a=0;a<Reports.length;a++)
		{
			Reports[a]=Reports[a].split("\t");
			/*if(Datos[a].length<3)
				return "";			//	*/
		}
	}
	if (winList["List"])
	{
		winList["List"].open();
		winList["List"].SetH((70+(Reports.length*50))+"px");
		winList["List"].SetW(500+"px");
	}
	document.getElementById("ListTitle").innerHTML=Str_Reports;
	ShowRepList(-1);
}
function ShowRepList(key)
{
	var x=0;
	var y=0;
	var bgcolor="";
	var out="";
	{
		out+="<table border=\"1\" cellpadding=\"2\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"100%\" style=\"border-collapse:collapse;border:2px solid #000000;\">\n";
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\" >\n";
		out+="<td align=\"center\" valign=\"middle\">\n";
		out+=Str_Target;
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\">\n";
		out+=Str_Contend;
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\">\n";
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"winList['List'].close();return false;\" />\n";
		out+="</td>\n";
		out+="</tr>\n";
		//--------------------------
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\" >\n";
		out+="<td align=\"center\" valign=\"middle\">\n";
		out+="<input class=\"INTEXT\" id=\"RepTrg\" size=\"50\" maxlength=\"50\"  value=\"";
		if(key>=0)
			out+=Reports[key][0]+'" onchange="Reports['+key+'][0]=this.value;';
		out+="\" />\n";
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\" rowspan=\"1\">\n";
		out+="<input class=\"INTEXT\" id=\"RepInf\" size=\"70\" maxlength=\"100\"  value=\"";
		if(key>=0)
			out+=Reports[key][1]+'" onchange="Reports['+key+'][1]=this.value;'
		out+="\" />\n";
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\">\n";
		if(key>=0)
			out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Save+"\" onclick=\"ModRep("+key+");return false;\" />\n";
		else
			out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Add+"\" onclick=\"AddRep();return false;\" />\n";
		out+="</td>\n";
		out+="</tr>\n";
		//--------------------------
		out+="</table>\n";
	}
	
	out+="<table border=\"1\" cellpadding=\"2\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"100%\" style=\"border-collapse:collapse;border:2px solid #000000;\">\n";
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\" >\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="	</td>\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Target+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Contend+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	y=0;
	while(y<Reports.length)
	{
		if((y%2)==0)
			bgcolor="#808080";
		else
			bgcolor="#A0A0A0";
		out+="<tr align=\"center\" bgcolor=\""+bgcolor+"\" >\n";
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"ShowRepList("+y+");\">\n";
		out+="		<img src=\"../img/efile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Reports[y][0]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Reports[y][1]+"</font>\n";
			out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"GetUrlB('./setitems.jsp?sql=DELETE FROM reports WHERE key="+Reports[y][3]+"',fncnone);GetUrlB('./getlist.jsp?cmps=*&tbl=reports&ord=date',rcvReportsList);\">\n";
		out+="		<img src=\"../img/defile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		out+="</tr>\n";
		y++;
	}
	//---------------------------------------------------------------------
	out+="</table>\n";
	document.getElementById("ListBody").innerHTML=out;
}

function ModRep(key)
{
	GetUrlB("./setitems.jsp?sql=UPDATE reports SET (destino,contiene,date)=(%27"+Reports[key][0]+"%27,%27"+Reports[key][1]+"%27,LOCALTIMESTAMP) WHERE key="+Reports[key][3]+"",fncnone);
	GetUrlB('./getlist.jsp?cmps=*&tbl=reports&ord=date',rcvReportsList);
}
function AddRep()
{
	if(document.getElementById("RepTrg").value=="")
		return;
	if(document.getElementById("RepInf").value=="")
		return;
	GetUrlB("./setitems.jsp?sql=INSERT INTO reports (destino,contiene,date) VALUES (%27"+document.getElementById("RepTrg").value+"%27,%27"+document.getElementById("RepInf").value+"%27,LOCALTIMESTAMP)",fncnone);
	GetUrlB('./getlist.jsp?cmps=*&tbl=reports&ord=date',rcvReportsList);
}

function alertDelFlt()
{
	Url='./setitems.jsp?sql=DELETE FROM alerts';
	if(Altrafltr.length>=1)
	{
		Url+="%20WHERE";
		for(var i=0;i<Altrafltr.length;i++)
		{
			if(i==0)
				Url+="%20description LIKE %27%25"+Altrafltr[i]+"%25%27"
			else
				Url+="%20OR description LIKE %27%25"+Altrafltr[i]+"%25%27"
		}
	}
	GetUrlB(Url,fncnone);
}

function ShowAlerts()
{
	var bgcolor="";
	var rtc=0;
	var out="";
	var rawcolor;
	//-------------------------------------------------------------------------------------------------------------------------
	out+="<table border=\"1\" align=\"center\" valign=\"top\" cellpadding=\"1\" cellspacing=\"1\" class=\"table1\" bordercolor=\"rgba(0,0,0,0)\" background=\"\" width=\"99%\" style=\"border-collapse:collapse;border:0px solid rgba(0,0,0,0);\" >\n";
	out+="<tr><td align=\"center\" >\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Delet+" "+Str_New+"\" onclick=\"GetUrlB('./setitems.jsp?sql=DELETE FROM alerts WHERE status=%27Viewed%27',fncnone);return false;\" />\n";
	out+="</td>\n";
	out+="<td align=\"center\">\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Delet+" "+Str_Viewed+"\" onclick=\"GetUrlB('./setitems.jsp?sql=DELETE FROM alerts WHERE status=%27Delet%27',fncnone);return false;\" />\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Delet+" "+Str_Filtred+"\" onclick=\"alertDelFlt();return false;\" />\n";
	out+="</td>\n";
	out+="<td align=\"center\">\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Filtro+"\" onclick=\"Altrafltr[Altrafltr.length]=prompt('"+Str_Filtro+"','');UpDateUrl();\" /><br />\n";
	for(var i=0;i<Altrafltr.length;i++)
	{
		out+="<input type=\"button\" class=\"INTEXT2\" value=\"[X]["+Altrafltr[i]+"]\" onclick=\"Altrafltr.splice("+i+",1);UpDateUrl();\" />\n";
	}
	out+="</td>\n";
	out+="<td align=\"center\">\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\"Limpiar "+Str_Filtro+"\" onclick=\"Altrafltr.length=0;UpDateUrl();\" />\n";
	out+="</td>\n";
	out+="<td align=\"center\">\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Print_Info+"\" onclick=\"AlrtMadeInfo();return false;\" />\n";
	out+="</td></tr>\n";
	out+="</table>\n";
	//-------------------------------------------------------------------------------------------------------------------------
	out+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"99%\" style=\"border-collapse:collapse;border:1px solid rgba(0,0,0,1);\">\n";
	out+="<tr align=\"center\" bgcolor=\"#EEEEEE\">\n";
	out+="	<td align=\"center\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_Status+"</font>\n";
	out+="	</td>\n";
	out+="	<td align=\"center\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_Ident+"</font>\n";
	out+="	</td>\n";
	out+="	<td align=\"center\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_Description+"</font>\n";
	out+="	</td>\n";
	out+="	<td align=\"center\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_Date+"</font>\n";
	out+="	</td>\n";
	out+="</tr>\n";
	//---------------------------------------------------------------------
	for(var a=0;a<Alerts.length;a++)
	{
		if(!Alerts[a][0])
			return "";
		rawcolor=Altrawcolor.slice();
		if((a%2)==0)
		{
			rawcolor[0]+=20;
			rawcolor[1]+=20;
			rawcolor[2]+=20;
		}
		if(Alerts[a][1].indexOf("Viewed")	!=-1)
		{
			rawcolor[0]+=50;
		}
		if(Alerts[a][1].indexOf("Reported")	!=-1)
		{
			rawcolor[2]+=50;
		}
		if(Alerts[a][1].indexOf("Delet")	!=-1)
		{
		}
		bgcolor="#"+rawcolor[0].toString(16)+""+rawcolor[1].toString(16)+""+rawcolor[2].toString(16)+"";
		//---------------------------------------------------------------------
		out+="<tr bgcolor=\""+bgcolor+"\" class=\"bottom top\" align=\"center\" >\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<a href=\"\" onclick=\"ChgSltSts("+Alerts[a][5]+",'"+Alerts[a][1]+"');return false;\">";
		out+="		<font size=\"1\" face=\"Verdana\">"+Alerts[a][1]+"</font>\n";
		out+="		</a>\n";
		out+="	</td>\n";
		//--------------------
		out+="	<td align=\"center\">\n";
		if(Alerts[a][3])
		{
			//out+="		<a href=\"\" onclick=\"ShowItemMap("+Alerts[a][3]+");return false;\">";
			out+="		<font size=\"1\" face=\"Verdana\">"+Alerts[a][3]+"</font>\n";
//			out+="		</a>\n";
		}
		else
		{
			out+="		<font size=\"1\" face=\"Verdana\">-·-</font>\n";
		}
		out+="	</td>\n";
		//--------------------
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Alerts[a][2]+"</font>\n";
		out+="	</td>\n";
		//--------------------
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Alerts[a][0]+"</font>\n";
		out+="	</td>\n";
		//--------------------
		out+="</tr>\n";
	}
	out+="</table>\n";
	return out;
}
//=================================================

function ShowItemMap(id)
{
	var loc;
	var idx=SearchId(id);
	if(idx!=FastSts.length)
	{
		loc=FastSts[idx].Plcs[0].Location.split(",");
		MapPos(loc[0],loc[1],17);
	}
}

function ChgSltSts(Key,Status)
{
	if(Status=="New")
		GetUrlB("./setitems.jsp?sql=UPDATE alerts SET status=%27Viewed%27 WHERE key="+Key+"",fncnone);
	if(Status=="Viewed")
		GetUrlB("./setitems.jsp?sql=UPDATE alerts SET status=%27Delet%27 WHERE key="+Key+"",fncnone);
	if(Status=="Reported")
		GetUrlB("./setitems.jsp?sql=UPDATE alerts SET status=%27Delet%27 WHERE key="+Key+"",fncnone);
	if(Status=="Delet")
		GetUrlB("./setitems.jsp?sql=DELETE FROM alerts WHERE key="+Key+"",fncnone);
}

function AlrtMadeInfo()
{
	var y;
	var out="";
	WinInfo=window.open("","WinInfo","location=0,titlebar=0,toolbar=0,status=0,scrollbars=1,menubar=1,fullscreen=1,resizable=1");
	//,width=800,height=700,top=20,left=50
	docInfo=WinInfo.document;
	docInfo.open();
	out+="<html><head><title>"+Str_Alerts+"</title></head>\n";
	out+="<BODY topMargin=0 leftmargin=0 rightmargin=0 bottommargin=0><center>\n";
	//------------------------------------------------
	out+="<TABLE width=\"%100\" style=\"border:5px solid #101010;\" >\n";
	out+="<tr align=\"center\" bgcolor=\"#EEEEEE\">\n";
	out+="	<td align=\"center\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_Ident+"</font>\n";
	out+="	</td>\n";
	out+="	<td align=\"center\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_Description+"</font>\n";
	out+="	</td>\n";
	out+="	<td align=\"center\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_Date+"</font>\n";
	out+="	</td>\n";
	out+="</tr>\n";
	//-----------------
	for(var a=0;a<Alerts.length;a++)
	{
		out+="<tr align=\"center\" bgcolor=\"#EEEEEE\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Alerts[a][3]+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Alerts[a][2]+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Alerts[a][0]+"</font>\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//-----------------
	out+="</TABLE>\n";
	//------------------------------------------------
	out+="</center></body></html>\n";
	docInfo.writeln(out);
	docInfo.close();
}
