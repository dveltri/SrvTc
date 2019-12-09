var HolyDays= new Array();
var WeekDays= new Array();
var TimeScheduler= new Array();
var WinSchId="";
var OptSch="";
var FncList;
function InitWinSch()
{
	winAdd("WinConf");
	winList["WinConf"].SetW("420px");
	winList["WinConf"].SetH("420px");
	winUdate();
}

function GetSchActList()
{
	GetUrlB("./getitems.jsp?sql=SELECT id,id FROM schedulerweek GROUP BY id",rcvSchLs);
	//GetUrlB("./getitems.jsp?sql=SELECT id,id FROM Logics GROUP BY id",rcvLgcLs);
	GetUrlB("./getlist.jsp?cmps=*&tbl=schedulerfnc&ord=id",rcvSchFncList);
}
function rcvSchLs(Datos)
{
	var Refresh=0;
	Datos=Datos.responseText;
	Datos=replaceAll(Datos,"\n","\t");
	Datos=Datos.split("\t");
	RemoveUnusedItem(Datos);
	OptSch=Datos;
}
function rcvSchFncList(Datos)
{
	Datos=rcvtbl(Datos);
	FncList=owl.deepCopy(Datos);
	if (winList["List"])
	{
		winList["List"].open();
		winList["List"].SetH((4+25+50+(Datos.length*24))+"px");
		winList["List"].SetW(450+"px");
	}
	document.getElementById("ListTitle").innerHTML=Str_VarCtrlGroups;
	document.getElementById("ListBody").innerHTML=ShowSchFncList(FncList,-1);
}
function ShowSchFncList(Datos,key)
{
	var x=0;
	var y=0;
	var bgcolor="";
	var out="";
	{
		out+="<table border=\"1\" cellpadding=\"2\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"100%\" style=\"border-collapse:collapse;border:2px solid #000000;\">\n";
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\" >\n";
		out+="<td align=\"center\" valign=\"middle\" colspan=\"2\" >\n";
		out+=Str_Function_Control;
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\">\n";
		out+=Str_VarGroupName;
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\">\n";
		out+=Str_Variable;
		out+="</td>\n";
		out+="</tr>\n";
		//--------------------------
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\" >\n";
		out+="<td align=\"center\" valign=\"middle\">\n";
		out+=Str_Ctrl_By_Scheduler;
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\">\n";
		out+="<select class=\"INTEXT\" onchange=\"document.getElementById('SchName').value=this.value;return false;\" >\n";
		out+="<option value=\"\" ></option>\n";
		out+=GenOptionsV(OptSch,'');
		out+="</select>\n";
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\" rowspan=\"1\">\n";
		out+="<input class=\"INTEXT\" id=\"SchName\" size=\"15\" maxlength=\"80\"  value=\"";
		if(key>=0)
			out+=Datos[key][0];
		out+="\" />\n";
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\">\n";
		out+="<select class=\"INTEXT\" id=\"SchFncVar\" >\n";
		out+="<option value=\"\" ></option>\n";
		for(var i=0;i<VarTree.length;i++)
		{
			if(VarTree[i][3].indexOf("w")!=-1 || VarTree[i][3].indexOf("W")!=-1)
			{
				out+="<option value=\""+VarTree[i][0]+"\"";
				if(key>=0)
					if(VarTree[i][0]==Datos[key][1])out+=" selected=\"selected\"";
				out+=">"+VarTree[i][0]+"</option>\n";
			}
		}
		out+="</select><br/>\n";
		out+="</td>\n";
		out+="</tr>\n";
		//--------------------------
		out+="</table>\n";
	}
	if(key>=0)
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_ModFncSch+"\" onclick=\"ModSchFnc("+Datos[key][3]+");return false;\" />\n";
	else
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_AddFncSch+"\" onclick=\"AddSchFnc();return false;\" />\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"winList['List'].close();return false;\" />\n";
	out+="<table border=\"1\" cellpadding=\"2\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"100%\" style=\"border-collapse:collapse;border:2px solid #000000;\">\n";
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\" >\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="	</td>\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Ident+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Variables+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Status+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">key</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
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
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"document.getElementById('ListBody').innerHTML=ShowSchFncList(FncList,"+y+");\">\n";
		out+="		<img src=\"../img/efile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		x=0;
		while(x<Datos[y].length)
		{
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Datos[y][x]+"</font>\n";
			out+="	</td>\n";
			x++;
		}
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"GetUrlB('./setitems.jsp?sql=DELETE FROM schedulerfnc WHERE key="+Datos[y][3]+"',fncnone);GetSchActList();\">\n";
		out+="		<img src=\"../img/defile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		out+="</tr>\n";
		y++;
	}
	//---------------------------------------------------------------------
	out+="</table>\n";
	return out;
}
//------------------------------------------------------------------------------------
function GetSch(id)
{
	WinSchId=id;
	GetUrlB("./getitems.jsp?sql=SELECT id,id FROM schedulerweek GROUP BY id",rcvSchLs);
	if(id!="")
	{
		GetUrlB("./getitems.jsp?sql=SELECT * FROM schedulerdate WHERE id LIKE %27"+WinSchId+"%27 ORDER BY date DESC",schedulerdate);
		GetUrlB("./getitems.jsp?sql=SELECT * FROM schedulerweek WHERE id LIKE %27"+WinSchId+"%27 ORDER BY date DESC",schedulerweek);
		GetUrlB("./getitems.jsp?sql=SELECT * FROM schedulertime WHERE id LIKE %27"+WinSchId+"%2F%25%27 ORDER BY id  DESC, time DESC",schedulertime);
	}
	setTimeout("RefreshSch()",500);
}
function RefreshSch()
{
	document.getElementById("WinConfTitle").innerHTML=Str_AdminScheduler;
	document.getElementById("WinConfBody").innerHTML=ShowAgenda();
	if (winList["WinConf"])
	{
		winList["WinConf"].open();
		winAutoPos();
	}
}
function AddSchFnc()
{
	if(document.getElementById("SchFncVar").value=="")
		return;
	if(document.getElementById("SchName").value=="")
		return;
	GetUrlB("./setitems.jsp?sql=DELETE FROM schedulerfnc WHERE setvar LIKE %27"+document.getElementById("SchFncVar").value+"%27",fncnone);
	GetUrlB("./setitems.jsp?sql=INSERT INTO schedulerfnc (id,setvar,lts) VALUES (%27"+document.getElementById("SchName").value+"%27,%27"+document.getElementById("SchFncVar").value+"%27,%272000-01-01 01:00:00%27)",fncnone);
	GetSchActList();
}
function ModSchFnc(key)
{
	if(document.getElementById("SchFncVar").value=="")
		return;
	if(document.getElementById("SchName").value=="")
		return;
		GetUrlB("./setitems.jsp?sql=UPDATE schedulerfnc SET (id,setvar,lts)%3D(%27"+document.getElementById("SchName").value+"%27,%27"+document.getElementById("SchFncVar").value+"%27,%272000-01-01 01:00:00%27)%20WHERE%20key%3D"+key,fncnone);
		GetSchActList();
}

function ShwSchControl(Id)
{
	var out="";
	if(OptSch)
	{
		//-------------------------------------------------------------------------------------------------
		out+="<center>";
		out+="<font size=\"1\" face=\"Verdana\">"+Str_ShowSchedulers+":</font>\n";
		out+="<select class=\"INTEXT\" onchange=\"GetSch(this.value);return false;\" >\n";
		out+="<option value=\"\" ></option>\n";
		out+=GenOptionsV(OptSch,Id);
		/*for(var i=0;i<OptSch.length;i++)
		{
			if(Id==OptSch[i])
				out+="<option value=\""+OptSch[i]+"\" selected=\"selected\" >"+OptSch[i]+"</option>\n";
			else
				out+="<option value=\""+OptSch[i]+"\" >"+OptSch[i]+"</option>\n";
		} // */
		out+="</select><br/>\n";
		//-------------------------------------------------------------------------------------------------
		out+="<font size=\"1\" face=\"Verdana\">"+Str_DelSchedulers+":</font>\n";
		out+="<select class=\"INTEXT\" onchange=\"if(this.value!=''){DelSch(this.value);}return false;\" >\n";
		out+="<option value=\"\" ></option>\n";
		out+=GenOptionsV(OptSch,"");
		/*for(var i=0;i<OptSch.length;i++)
		{
				out+="<option value=\""+OptSch[i]+"\" >"+OptSch[i]+"</option>\n";
		} // */
		out+="</select><br/>\n";
		//-------------------------------------------------------------------------------------------------
	}
	//-------------------------------------------------------------------------------------------------
	//out+="<font size=\"1\" face=\"Verdana\">"+Str_AddSchedulers+":</font>\n";
	//out+="<input class=\"INTEXT\" size=\"10\" maxlength=\"15\" value=\"\" onkeyup=\"return false\" />\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_AddSchedulers+"\" onclick=\"NewSch(prompt('"+Str_InpSch+"'));return false;\" /><br/>\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"winList['WinConf'].close();return false;\" /><br/>\n";
	out+="</center>";
	return out;
}

//------------------------------
function schedulerdate(Datos)
{
	if(Datos)
	{
		if(Datos.status==200)
		{
			Datos=Datos.responseText;
			Datos=Datos.split("\n");
			RemoveUnusedItem(Datos);
			for(var i=0;i<Datos.length;i++)
			{
				Datos[i]=Datos[i].split("\t");
			}
			HolyDays.length=0;
			for(var i=0;i<Datos.length;i++)
			{
				idx=HolyDays.length;
				HolyDays[idx]=new Object();
				HolyDays[idx].id=Datos[i][0];
				HolyDays[idx].TimeScheduler=Datos[i][1];
				HolyDays[idx].key=Datos[i][2];
				HolyDays[idx].Date=Datos[i][3];
				HolyDays[idx].action="";
			}
		}
	}
	RefreshSch();
}
function schedulerweek(Datos)
{
	if(Datos)
	{
		if(Datos.status==200)
		{
			Datos=Datos.responseText;
			Datos=Datos.split("\n");
			RemoveUnusedItem(Datos);
			for(var i=0;i<Datos.length;i++)
			{
				Datos[i]=Datos[i].split("\t");
			}
			WeekDays.length=0;
			for(var i=0;i<Datos.length;i++)
			{
				idx=WeekDays.length;
				WeekDays[idx]=new Object();
				WeekDays[idx].TimeScheduler=new Array();
				WeekDays[idx].id=Datos[i][0];
				WeekDays[idx].TimeScheduler[0]=Datos[i][1];
				WeekDays[idx].TimeScheduler[1]=Datos[i][2];
				WeekDays[idx].TimeScheduler[2]=Datos[i][3];
				WeekDays[idx].TimeScheduler[3]=Datos[i][4];
				WeekDays[idx].TimeScheduler[4]=Datos[i][5];
				WeekDays[idx].TimeScheduler[5]=Datos[i][6];
				WeekDays[idx].TimeScheduler[6]=Datos[i][7];
				WeekDays[idx].Date=Datos[i][8];
				WeekDays[idx].key=Datos[i][9];
				WeekDays[idx].action="";
			}
		}
		RefreshSch();
	}
}
function schedulertime(Datos)
{
	if(Datos)
	{
		if(Datos.status==200)
		{
			Datos=Datos.responseText;
			Datos=Datos.split("\n");
			RemoveUnusedItem(Datos);
			for(var i=0;i<Datos.length;i++)
			{
				Datos[i]=Datos[i].split("\t");
			}
			TimeScheduler.length=0;
			for(var i=0;i<Datos.length;i++)
			{
				idx=TimeScheduler.length;
				TimeScheduler[idx]=new Object();
				TimeScheduler[idx].id=Datos[i][0].split("/");
				TimeScheduler[idx].variable=Datos[i][1];
				TimeScheduler[idx].valor=parseInt(Datos[i][2]);
				//if(Datos[i][2].indexOf("snxchg=")!=-1)
					//TimeScheduler[idx].valor=parseInt(Datos[i][2].substring(6));
				TimeScheduler[idx].time=Datos[i][3].split(":");
				TimeScheduler[idx].key=Datos[i][4];
				TimeScheduler[idx].action="";
			}
		}
		RefreshSch();
	}
}

//-------------------------------
function SchDelItemH(Item)
{
	GetUrlB("./setitems.jsp?sql=DELETE FROM schedulerdate WHERE key="+HolyDays[Item].key+"",fncnone);
	HolyDays[Item].action="del";
  HolyDays.splice(Item,1);
	GetUrlB("./getitems.jsp?sql=SELECT * FROM schedulerdate WHERE id LIKE %27"+WinSchId+"%27 ORDER BY date DESC",schedulerdate);
}
function SchDelItemW(Item)
{
	GetUrlB("./setitems.jsp?sql=DELETE FROM schedulerweek WHERE key="+WeekDays[Item].key+"",fncnone);
	WeekDays[Item].action="del";
  WeekDays.splice(Item,1);
	GetUrlB("./getitems.jsp?sql=SELECT * FROM schedulerweek WHERE id LIKE %27"+WinSchId+"%27 ORDER BY date DESC",schedulerweek);
}
function SchDelItemT(Item)
{
	GetUrlB("./setitems.jsp?sql=DELETE FROM schedulertime WHERE key="+TimeScheduler[Item].key+"",fncnone);
	TimeScheduler[Item].action="del";
  TimeScheduler.splice(Item,1);
	GetUrlB("./getitems.jsp?sql=SELECT * FROM schedulertime WHERE id LIKE %27"+WinSchId+"%2F%25%27 ORDER BY id  DESC, time DESC",schedulertime);
}
function SchDelItemTT(id)
{
	GetUrlB("./setitems.jsp?sql=DELETE FROM schedulertime WHERE id LIKE %27"+id+"%27",fncnone);
	GetUrlB("./getitems.jsp?sql=SELECT * FROM schedulertime WHERE id LIKE %27"+WinSchId+"%2F%25%27 ORDER BY id  DESC, time DESC",schedulertime);
}

//-------------------------------
function NewSch(id)
{
	for(var i=0;i<OptSch.length;i+=2)
	{
		if(OptSch[i]==id)
			return;
	}
	GetUrlB("./setitems.jsp?sql=INSERT INTO schedulerweek (id,d1,d2,d3,d4,d5,d6,d7,date) VALUES (%27"+id+"%27,%27%27,%27%27,%27%27,%27%27,%27%27,%27%27,%27%27,%272000/01/00%27)",fncnone);
	setTimeout("GetSch('"+id+"')",1000);
}
function DelSch(id)
{
	GetUrlB("./setitems.jsp?sql=DELETE FROM schedulerdate WHERE id LIKE %27"+id+"%27",fncnone);
	GetUrlB("./setitems.jsp?sql=DELETE FROM schedulerweek WHERE id LIKE %27"+id+"%27",fncnone);
	GetUrlB("./setitems.jsp?sql=DELETE FROM schedulertime WHERE id LIKE %27"+id+"%2F%25%27",fncnone);
	setTimeout("GetSch('')",1000);
}

function SchAddItemH()
{
	var idx=HolyDays.length
	var temp=0;
	var tablt="";
	var i=0;
	//-----------------------------------------------
	temp=document.getElementById("MnewHd").options[document.getElementById("MnewHd").selectedIndex].value
	if(temp.length==1)
		temp="0"+temp;
	temp=document.getElementById("DnewHd").options[document.getElementById("DnewHd").selectedIndex].value+"%2F"+temp;
	if(temp.length==6)
		temp="0"+temp;
	temp+="%2F????";
	tablt=document.getElementById("htable").options[document.getElementById("htable").selectedIndex].value;
	while(i<idx && HolyDays[i].Date!=temp)
		i++;
	if(i==idx && tablt!="")
	{
		HolyDays[idx]=new Object();
		HolyDays[idx].id=WinSchId;
		HolyDays[idx].Date=temp;
		HolyDays[idx].TimeScheduler=tablt;
		GetUrlB("./setitems.jsp?sql=INSERT INTO schedulerdate (id,timescheduler,date) VALUES (%27"+WinSchId+"%27,%27"+tablt+"%27,%27"+temp+"%27)",fncnone);
	}
	GetUrlB("./getitems.jsp?sql=SELECT * FROM schedulerdate WHERE id LIKE %27"+WinSchId+"%27 ORDER BY date DESC",schedulerdate);
}
function SchAddItemW()
{
	var sql="";
	var idx=WeekDays.length
	var tablt= new Array();
	var temp=0;
	var tim="";
	var i=0;
	tim=document.getElementById("MnewWd").options[document.getElementById("MnewWd").selectedIndex].value
	if(tim.length==1)tim="0"+tim;
	tim=document.getElementById("DnewWd").options[document.getElementById("DnewWd").selectedIndex].value+"%2F"+tim;
	if(tim.length==6)tim="0"+tim;
	tim+="%2F????";
	//--------------
	for(var j=0;j<7;j++)
		tablt[j]=document.getElementById(("Tablas"+j)).options[document.getElementById(("Tablas"+j)).selectedIndex].value;
	while(i<idx && WeekDays[i].id==WinSchId && WeekDays[i].Date!=tim)
		i++;
	if(i==idx && tablt.indexOf("")==-1)
	{
		temp="";
		for(var j=0;j<7;j++)
		{
			temp+=",%27"+tablt[j]+"%27";
		}
		sql="./setitems.jsp?sql=INSERT INTO schedulerweek (id,d1,d2,d3,d4,d5,d6,d7,date) VALUES (%27"+WinSchId+"%27"+temp+",%27"+tim+"%27)";
		GetUrlB(sql,fncnone);
	}
	GetUrlB("./getitems.jsp?sql=SELECT * FROM schedulerweek WHERE id LIKE %27"+WinSchId+"%27 ORDER BY date DESC",schedulerweek);
}
function SchAddItemT(tabla)
{
	var plan="";
	var idx=TimeScheduler.length;
	var tim=document.getElementById(("nTSsec")).options[document.getElementById(("nTSsec")).selectedIndex].value;
	if(tim.length==1)tim="0"+tim;
	tim=":"+tim;
	tim=document.getElementById(("nTSmin")).options[document.getElementById(("nTSmin")).selectedIndex].value+tim;
	if(tim.length==4)tim="0"+tim;
	tim=":"+tim;
	tim=document.getElementById(("nTSHs")).options[document.getElementById(("nTSHs")).selectedIndex].value+tim;
	if(tim.length==7)tim="0"+tim;
	plan=document.getElementById("nTSPlan").value;
	if(plan!="")
	{
		GetUrlB("./setitems.jsp?sql=INSERT INTO schedulertime (id,time,variable,value) VALUES (%27"+WinSchId+"%2F"+tabla+"%27,%27"+tim+"%27,%27X%27,%27"+plan+"%27)",fncnone);
	}
	GetUrlB("./getitems.jsp?sql=SELECT * FROM schedulertime WHERE id LIKE %27"+WinSchId+"%2F%25%27 ORDER BY id  DESC, time DESC",schedulertime);
}
function SchAddItemTT(tabla)
{
	var idx=TimeScheduler.length;
	var plan="";
	var tim=document.getElementById(("TSsec"+tabla)).options[document.getElementById(("TSsec"+tabla)).selectedIndex].value;
	if(tim.length==1)tim="0"+tim;
	tim=":"+tim;
	tim=document.getElementById(("TSmin"+tabla)).options[document.getElementById(("TSmin"+tabla)).selectedIndex].value+tim;
	if(tim.length==4)tim="0"+tim;
	tim=":"+tim;
	tim=document.getElementById(("TSHs"+tabla)).options[document.getElementById(("TSHs"+tabla)).selectedIndex].value+tim;
	if(tim.length==7)tim="0"+tim;
	plan=document.getElementById(("TSPlan"+tabla)).value;
	if(plan!="")
	{
		GetUrlB("./setitems.jsp?sql=INSERT INTO schedulertime (id,time,variable,value) VALUES (%27"+WinSchId+"%2F"+tabla+"%27,%27"+tim+"%27,%27X%27,%27"+plan+"%27)",fncnone);
	}
	GetUrlB("./getitems.jsp?sql=SELECT * FROM schedulertime WHERE id LIKE %27"+WinSchId+"%2F%25%27 ORDER BY id  DESC, time DESC",schedulertime);
}

//-------------------------------
function MkTS(ArgIdx,Sel)
{
	var LstTbl="";	
	out="<select id=\""+ArgIdx+"\" class=\"INTEXT\">\n";
	out+="<option value=\"\"></option>\n";
	for(var j=0;j<TimeScheduler.length;j++)
	{
		if(LstTbl!=TimeScheduler[j].id[1])
		{
			out+="<option value=\""+TimeScheduler[j].id[1]+"\"";
			if(TimeScheduler[j].id[1]==Sel)
				out+=" selected=\"selected\"";
			out+=" >"+HTMLEncode(TimeScheduler[j].id[1])+"</option>\n";
			LstTbl=TimeScheduler[j].id[1];
		}
	}
	out+="</select>\n";
	return out;
}
function MkTSF(ArgIdx,Sel)
{
	var Cplans=0;
	out="";
	out+="<input class=\"INTEXT\" size=\"5\" maxlength=\"5\"  value=\""+Sel+"\" id=\""+ArgIdx+"\" />\n";
	return out;
}
function MkSelDay(obj,Mes)
{
	var dim=[31,29,31,30,31,30,31,31,30,31,30,31];
	out="";
	out+="Day:<select id=\"D"+obj+"\" class=\"INTEXT\">\n";
	for(var j=1;j<=dim[Mes-1];j++)
		out+="<option value=\""+j+"\">"+j+"</option>\n";
	out+="</select>\n";
	out+=" Month:<select id=\"M"+obj+"\" class=\"INTEXT\" onchange=\"\">\n"; //MkSelDay('"+obj+"',this.value);
	for(var j=1;j<=12;j++)
	{
		out+="<option value=\""+j+"\"";
		if(j==Mes) out+=" selected=\"selected\"";
		out+=">"+j+"</option>\n";
	}
	out+="</select>\n";
	return out;
}
//-------------------------------

function ShowAgenda()
{
	var LstTbl="";
	var NowT=new Date();
	var vlast="";
	var idx=0;
	var out="";
	out+=ShwSchControl(WinSchId)
	if(WinSchId!="")
	{
		out+="<table border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"table1\" bordercolor=\"#FfFfFf\" width=\"100%\">\n";
		out+="<tr><td align=\"left\">\n";
		out+="</td></tr>\n"
		out+="<tr>\n";
		out+="<td align=\"center\">\n";
		out+="<br/>\n";
		//-----------------------------------------------------
		{
			out+="<table border=\"1\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"table1\" bordercolor=\"#FfFfFf\" bgcolor=\"#FFFFFF\" width=\"50%\">\n";
			out+="<tr><td align=\"center\" colspan=\"3\"><font size=\"1\" face=\"Verdana\">Dias Especiales</font></td></tr>\n";
			out+="<tr>\n";
			out+="	<td align=\"center\"><a href=\"\" onclick=\"SchAddItemH();return false;\"><img src=\"../img/add.png\" width=\"16\" height=\"16\" border=\"0\" /></a></td>\n";
			out+="	<td align=\"center\"><font size=\"1\" face=\"Verdana\"><div id=\"newHd\">"+MkSelDay("newHd",1)+"</div></font></td>\n";
			out+="	<td align=\"center\"><font size=\"1\" face=\"Verdana\">"+MkTS("htable","")+"</font></td>\n";
			out+="</tr>\n";
			//HolyDays=HolyDays.sort(sortfuncDate);
			for(var i=0;i<HolyDays.length;i++)
			{
				if(HolyDays[i].action!="del")
				{
					out+="<tr>\n";
					out+="	<td align=\"center\"><a href=\"\" onclick=\"SchDelItemH("+i+");return false;\"><img src=\"../img/error1.jpg\" width=\"16\" height=\"16\" border=\"0\" /></a></td>\n";
					out+="	<td align=\"center\"><font size=\"1\" face=\"Verdana\">"+HolyDays[i].Date+"</font></td>\n";
					out+="	<td align=\"center\"><font size=\"1\" face=\"Verdana\">"+HolyDays[i].TimeScheduler;+"</font></td>\n";
					out+="</tr>\n";
				}
			}
			out+="</table>\n";
		}
		//-----------------------------------------------------
		out+="</td></tr>\n";
		out+="<tr><td align=\"center\"><br/>\n";
		//-----------------------------------------------------
		{
			out+="<table border=\"1\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"table1\" bordercolor=\"#FfFfFf\" bgcolor=\"#FFFFFF\" width=\"100%\">\n";
			out+="<tr><td align=\"center\" colspan=\"9\"><font size=\"1\" face=\"Verdana\">Tabla semanal</font></td></tr>\n";
			out+="<tr>\n";
			out+="	<td align=\"center\"><a href=\"\" onclick=\"SchAddItemW();return false;\"><img src=\"../img/add.png\" width=\"16\" height=\"16\" border=\"0\" /></a></td>\n";
			out+="	<td align=\"center\"><font size=\"1\" face=\"Verdana\"><div id=\"newWd\">"+MkSelDay("newWd",1);+"</div></font></td>\n";
			for(var j=0;j<7;j++)
			{
				out+="	<td align=\"center\" id=\"\"><font size=\"1\" face=\"Verdana\">"+Str_DaysName[j]+"<br/>"+MkTS(("Tablas"+j),"")+"</font></td>\n";
			}
			out+="</tr>\n";
			//WeekDays=WeekDays.sort(sortfuncDate);
			for(var i=0;i<WeekDays.length;i++)
			{
				if(WeekDays[i].action!="del")
				{
					out+="<tr>\n";
					out+="	<td align=\"center\"><a href=\"\" onclick=\"SchDelItemW("+i+");return false;\"><img src=\"../img/error1.jpg\" width=\"16\" height=\"16\" border=\"0\" /></a></td>\n";
					out+="	<td align=\"center\"><font size=\"1\" face=\"Verdana\">"+WeekDays[i].Date+"</font></td>\n";
					for(var j=0;j<7;j++)
					{
						out+="	<td align=\"center\" id=\"\"><font size=\"1\" face=\"Verdana\">"+WeekDays[i].TimeScheduler[j]+"</font></td>\n";
					}
					out+="</tr>\n";
				}
			}
			out+="</table>\n";
		}
		//-----------------------------------------------------
		out+="</td></tr>\n"
		out+="<tr><td align=\"left\"><br/>\n";
		{
			out+="<table border=\"1\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"table1\" bordercolor=\"#FfFfFf\" bgcolor=\"#FFFFFF\" width=\"50%\">\n";
			out+="<tr>\n";
			out+="	<td align=\"center\"><a href=\"\" onclick=\"SchAddItemT(document.getElementById('nTblName').value);return false;\"><img src=\"../img/add.png\" width=\"16\" height=\"16\" border=\"0\" /></a></td>\n";
			out+="	<td align=\"center\"><input class=\"INTEXT\" size=\"5\" maxlength=\"5\"  value=\"TableName\" id=\"nTblName\" /></td>\n";
			out+="	<td align=\"center\">";
			out+="	<select id=\"nTSHs\" class=\"INTEXT\">\n";
			for(var j=0;j<24;j++)
				out+="	<option value=\""+j+"\">"+j+"</option>\n";
			out+="	</select>:\n";
			out+="	<select id=\"nTSmin\" class=\"INTEXT\">\n";
			for(var j=0;j<60;j++)
				out+="	<option value=\""+j+"\">"+j+"</option>\n";
			out+="	</select>:\n";
			out+="	<select id=\"nTSsec\" class=\"INTEXT\">\n";
			for(var j=0;j<60;j++)
				out+="	<option value=\""+j+"\">"+j+"</option>\n";
			out+="	</select>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\">"+MkTSF("nTSPlan","")+"</td>\n";
			out+="</tr>\n";
			out+="</table>\n";			
		}
		out+="</td></tr>\n"
		if(TimeScheduler.length)
		{
			while(idx<TimeScheduler.length)
			{
				out+="<tr><td align=\"center\"><br/>\n";
				//-----------------------------------------------------
				LstTbl=TimeScheduler[idx].id[1];
				out+="<table border=\"1\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"table1\" bordercolor=\"#FfFfFf\" bgcolor=\"#FFFFFF\" width=\"50%\">\n";
				out+="<tr>\n";
				out+="<td align=\"center\" colspan=\"3\"><font size=\"1\" face=\"Verdana\">\n";
				out+="<a href=\"\" onclick=\"SchDelItemTT('"+TimeScheduler[idx].id[0]+"%2F"+LstTbl+"');return false;\"><img src=\"../img/error1.jpg\" width=\"16\" height=\"16\" border=\"0\" alt=\"Delet\" /></a>\n";
				out+="["+LstTbl+"]";
				//out+="<a href=\"\" onclick=\"SchCpyItemTT("+idx+");return false;\"><img src=\"../img/cpy.jpg\" width=\"16\" height=\"16\" border=\"0\" alt=\"Copy\" /></a></font></td>\n";
				out+="</tr>\n";
				//- - - - - - - - - - - - - - - - - - - - - - - - - - -
				out+="<tr>\n";
				out+="<td align=\"center\"><a href=\"\" onclick=\"SchAddItemTT('"+LstTbl+"');return false;\">\n";
				out+="<img src=\"../img/add.png\" width=\"16\" height=\"16\" border=\"0\" />\n";
				out+="</a></td>\n";
				out+="<td align=\"center\"><font size=\"1\" face=\"Verdana\">"
				out+="<select id=\"TSHs"+LstTbl+"\" class=\"INTEXT\">\n";
				for(var j=0;j<24;j++)
					out+="<option value=\""+j+"\">"+j+"</option>\n";
				out+="</select>:\n";
				out+="<select id=\"TSmin"+LstTbl+"\" class=\"INTEXT\">\n";
				for(var j=0;j<60;j++)
					out+="<option value=\""+j+"\">"+j+"</option>\n";
				out+="</select>:\n";
				out+="<select id=\"TSsec"+LstTbl+"\" class=\"INTEXT\">\n";
				for(var j=0;j<60;j++)
					out+="<option value=\""+j+"\">"+j+"</option>\n";
				out+="</select>\n";
				out+="</font></td>\n";
				out+="<td align=\"center\"><font size=\"1\" face=\"Verdana\">"
				out+=MkTSF("TSPlan"+LstTbl,"");
				out+="</font></td>\n";
				out+="</tr>\n";
				while(idx<TimeScheduler.length && TimeScheduler[idx].id[1]==LstTbl)
				{
					if(TimeScheduler[idx].action!="del")
					{
						out+="<tr>\n";
						out+="	<td align=\"center\"><a href=\"\" onclick=\"SchDelItemT("+idx+");return false;\"><img src=\"../img/error1.jpg\" width=\"16\" height=\"16\" border=\"0\" /></a></td>\n";
						out+="	<td align=\"center\"><font size=\"1\" face=\"Verdana\">"+TimeScheduler[idx].time+"</font></td>\n";
						out+="	<td align=\"center\" id=\"\"><font size=\"1\" face=\"Verdana\">"+TimeScheduler[idx].valor+"</font></td>\n";
						out+="</tr>\n";
					}
					idx++;
				}
				out+="</table>\n";
				out+="</td></tr>\n"
			}
		}
		out+="</table>\n";
	}
	return out;
}

function buildCal(m, y, cM, cH, cDW, cD, brdr)
{
	var mn=['January','February','March','April','May','June','July','August','September','October','November','December'];
	
	var oD = new Date(y, m-1, 1); //DD replaced line to fix date bug when current day is 31st
	oD.od=oD.getDay()+1; //DD replaced line to fix date bug when current day is 31st

	var todaydate=new Date() //DD added
	var scanfortoday=(y==todaydate.getFullYear() && m==todaydate.getMonth()+1)? todaydate.getDate() : 0 //DD added
	var dim=[31,0,31,30,31,30,31,31,30,31,30,31];
	dim[1]=(((oD.getFullYear()%100!=0)&&(oD.getFullYear()%4==0))||(oD.getFullYear()%400==0))?29:28;
	var t='<div class="'+cM+'">\n<table class="'+cM+'" cols="7" cellpadding="0" border="'+brdr+'" cellspacing="0">\n<tr align="center">\n';
	t+='<td colspan="7" align="center" class="'+cH+'">'+mn[m-1]+' - '+y+'</td>\n</tr>\n<tr align="center">\n';
	for(var s=0;s<7;s++)
		t+='<td class="'+cDW+'">'+"DLMMJVS".substr(s,1)+'</td>\n';
	t+='</tr>\n<tr align="center">\n';
	for(var i=1;i<=42;i++)
	{
		var x=((i-oD.od>=0)&&(i-oD.od<dim[m-1]))? i-oD.od+1 : ' ';
		if (x==scanfortoday) //DD added
			x='<span id="today">'+x+'</span>\n' //DD added
		t+='<td class="'+cD+'">'+x+'</td>\n';
		if((i)%7==0 && x==' ')
			break;
		if(((i)%7==0)&&(i<36))
		{
			t+='</tr>\n<tr align="center">\n';
		}
	}
	return t+='</tr>\n</table>\n</div>\n';
}

function sortfuncDate(a,b)
{
	return((b.Date.split("/").reverse().join(""))<(a.Date.split("/").reverse().join("")));
}

function sortfuncTime(a,b)
{
	return((b.Time)<(a.Time));
}

percent=100;
