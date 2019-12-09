var GrphDat= new Array();
var GrphDatVl= new Array();
var GrphDatFq= new Array();
var MinAmp=0;
var MaxAmp=1;
var MinFq=0;
var MaxFq=0;
var StartValue=0;
var EndValue=0;
var StartDate="1970-01-01 00:00";
var EndDate=  "2020-01-01 00:00";
var ed=-1;
var StadisticDt;
var WinInfo;
//---------------------------------------------------------------
function MadeInfo(id)
{
	var y;
	var out="";
	WinInfo=window.open("","WinInfo","location=0,titlebar=0,toolbar=0,status=0,scrollbars=1,menubar=1,fullscreen=1,resizable=1");
	//,width=800,height=700,top=20,left=50
	docInfo=WinInfo.document;
	docInfo.open();
	out+="<html><head><title>"+id+"</title></head>\n";
	out+="<BODY topMargin=0 leftmargin=0 rightmargin=0 bottommargin=0><center>\n";
	//------------------------------------------------
	out+=id;
	out+="<TABLE width=\"%100\" style=\"border:5px solid #101010;\" >\n";
	//-----------------
	out+="<TR style=\"border: 20px solid #FFFFFF;\">\n";
  out+="<TD height=\"80\" valign=top align=\"center\">\n";
	out+=ShwVlFq();
  out+="</TD>\n";
  out+="<TD height=\"80\" valign=top align=\"center\" width=\"%100\" >\n";
	out+=GraphVlFq("#000000","#000000");
  out+="</TD>\n";
	out+="</TR>\n";
	//-----------------
	out+="<TR style=\"border: 10px solid #FFFFFF;\">\n";
  out+="<TD valign=top align=\"left\">\n";
	out+=ShwDta();
  out+="</TD>\n";
  out+="<TD valign=top align=\"center\" width=\"%100\" >\n";
	out+=Hisform("#000000","#000000");
  out+="</TD>\n";
	out+="</TR>\n";
	//-----------------
	out+="<TR style=\"border: 10px solid #FFFFFF;\">\n";
  out+="<TD valign=top align=\"left\">\n";
  out+="</TD>\n";
	out+="</TR>\n";
	//-----------------
	out+="</TABLE>\n";
	//------------------------------------------------
	out+="</center></body></html>\n";
	docInfo.writeln(out);
	docInfo.close();
	//docInfo.getElementById("GrphDat").setAttribute("d", ShwGrphDat());
	//docInfo.getElementById("GraphName").innerHTML=id;
}
function ShwDta()
{
	var out="";
	var bgcolor="";
	var y=0;
	out+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" background=\"\" style=\"border-collapse:collapse;border:1px solid #000000;\">\n";
	out+="<tr align=\"center\" bgcolor=\"#E0E0E0\" >\n";
	out+="	<td align=\"center\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_Date+"</font>\n";
	out+="	</td>\n";
	out+="	<td align=\"center\" valign=\"middle\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_Value+"</font>\n";
	out+="	</td>\n";
	out+="</tr>\n";
	y=0;
	while(y<GrphDat.length)
	{
		if((y%2)==0)
			bgcolor="#C0C0C0";
		else
			bgcolor="#E0E0E0";
		out+="<tr align=\"center\" bgcolor=\""+bgcolor+"\" >\n";
		{
			out+="	<td align=\"left\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+GrphDat[y][1]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+GrphDat[y][0]+"</font>\n";
			out+="	</td>\n";
		}
		out+="</tr>\n";
		y++;
	}
	out+="</table>\n";
	return out;
}
function ShwVlFq()
{
	var out="";
	var bgcolor="";
	var y=0;
	out+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" background=\"\" style=\"border-collapse:collapse;border:1px solid #000000;\">\n";
	out+="<tr align=\"center\" bgcolor=\"#E0E0E0\" >\n";
	out+="	<td align=\"center\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_Value+"</font>\n";
	out+="	</td>\n";
	out+="	<td align=\"center\" valign=\"middle\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_CantSamples+"</font>\n";
	out+="	</td>\n";
	out+="</tr>\n";
	y=0;
	while(y<GrphDatVl.length)
	{
		if((y%2)==0)
			bgcolor="#C0C0C0";
		else
			bgcolor="#E0E0E0";
		out+="<tr align=\"center\" bgcolor=\""+bgcolor+"\" >\n";
		{
			out+="	<td align=\"left\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+GrphDatVl[y]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+GrphDatFq[y]+"</font>\n";
			out+="	</td>\n";
		}
		out+="</tr>\n";
		y++;
	}
	out+="</table>\n";
	return out;
}
//---------------------------------------------------------------
function GetIOsListConf()
{
	ed=-1;
	GetUrlB("./getitems.jsp?sql=SELECT id,value,key,date FROM hisvars WHERE id LIKE %27%25%2FCapTime%25%27 Order BY date desc",rcvIOsLs);
}
function GetIOsList()
{
	//WHERE id NOT LIKE '%/CapTime'
	GetUrlB("./getitems.jsp?sql=SELECT id,count(*),MIN(date),MAX(date) FROM hisvars WHERE id NOT LIKE '%25/CapTime' GROUP by id order by id desc",rcvIOsLsShw);
}
function GetIOs(id)
{
	var sql="./getitems.jsp?sql=SELECT * FROM hisvars ";
	sql+="WHERE id LIKE '"+id+"%25' AND id NOT LIKE '%25%2FCapTime' ";
	sql+="AND date>='"+StartDate+"' AND date<='"+EndDate+"' ";
	sql+="order by date asc"; //desc
	GetUrlB(sql,rcvhisIOs);
}
function rcvIOsLsShw(Datos)
{
	StadisticDt=rcvtbl(Datos);
	if (winList["List"])
	{
		winList["List"].open();
		winList["List"].SetH((70+(StadisticDt.length*40))+"px");
		winList["List"].SetW("500px");
	}
	document.getElementById("ListTitle").innerHTML=Str_StatisticList;
	document.getElementById("ListBody").innerHTML=ShowIOsListShw();
}
function rcvIOsLs(Datos)
{
	StadisticDt=rcvtbl(Datos);
	if (winList["List"])
	{
		winList["List"].open();
		winList["List"].SetH((70+(StadisticDt.length*40))+"px");
		winList["List"].SetW("500px");
	}
	document.getElementById("ListTitle").innerHTML=Str_MN_Config+" "+Str_Statistic;
	document.getElementById("ListBody").innerHTML=ShowIOsList();
}
function ModCapVar()
{
	GetUrlB("./setitems.jsp?sql=UPDATE hisvars SET (id,value,date)%3D(%27"+document.getElementById("CapVar").value+"%2FCapTime%27,%27"+document.getElementById("CapTime").value+"%27,LOCALTIMESTAMP) WHERE key%3D"+document.getElementById("CapKey").value+"",fncnone);
	GetIOsListConf();
}
function AddCapVar()
{
	GetUrlB("./setitems.jsp?sql=INSERT INTO hisvars (id,value,date) VALUES (%27"+document.getElementById("CapVar").value+"%2FCapTime%27,%27"+document.getElementById("CapTime").value+"%27,LOCALTIMESTAMP)",fncnone);
	GetIOsListConf();
}
function ShowIOsList()
{
	var x=0;
	var y=0;
	var bgcolor="";
	var out="";
	Datos=StadisticDt;
	out+=" <input type=\"button\" class=\"INTEXT2\" value=\""+Str_New+"\" onclick=\"ed=0;ShowIOsList();return false;\" />\n";
	if(ed!=-1)
	{
		out+="<font size=\"1\" face=\"Verdana\">"+Str_Variables+":</font>\n";
		out+="	<select class=\"INTEXT\" id=\"CapVar\" >\n";
		out+="		<option value=\"\" ></option>\n";
		for(var i=0;i<VarTree.length;i++)
		{
			out+="		<option value=\""+VarTree[i][0]+"\" >"+VarTree[i][0]+"</option>\n";
		}
		out+="	</select>\n";
		out+="	<input class=\"INTEXT\" id=\"CapTime\" size=\"4\" maxlength=\"4\" value=\"\" />segs\n";
		out+="	<input type=\"hidden\" id=\"CapKey\" value=\""+ed+"\" />\n";
		if(ed!=0)
			out+=" <input type=\"button\" class=\"INTEXT2\" value=\""+Str_Save+"\" onclick=\"ModCapVar();return false;\" />\n";
		else
			out+=" <input type=\"button\" class=\"INTEXT2\" value=\""+Str_Add+"\" onclick=\"AddCapVar();return false;\" />\n";
	}
	out+=" <input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"winList['List'].close();return false;\" />\n";
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
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_period+"</font>\n";
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
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"EditCap("+y+");return false;\">\n";
		out+="		<img src=\"../img/efile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		{
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Datos[y][0]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Datos[y][1]+"</font>\n";
			out+="	</td>\n";
		}
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"GetUrlB('./setitems.jsp?sql=DELETE FROM hisvars WHERE id LIKE %27"+Datos[y][0].replace("/CapTime","")+"%25%27',fncnone);GetIOsListConf();\">\n";
		out+="		<img src=\"../img/defile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		out+="</tr>\n";
		y++;
	}
	out+="</table>\n";
	if(document.getElementById("ListBody"))
		document.getElementById("ListBody").innerHTML=out;
	return out;
}
function FltrDate(id)
{
	EndDate=document.getElementById("EndDate").value+" "+document.getElementById("EndTime").value;
	StartDate=document.getElementById("StartDate").value+" "+document.getElementById("StartTime").value;
	GetIOs(id);
}
function ShowIOsListShw()
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
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="	</td>\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Ident+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_CantSamples+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">Start Date</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">End Date</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	y=0;
	while(y<StadisticDt.length)
	{
		if((y%2)==0)
			bgcolor="#808080";
		else
			bgcolor="#A0A0A0";
		out+="<tr align=\"center\" bgcolor=\""+bgcolor+"\" >\n";
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"EndDate='"+StadisticDt[y][3]+"';StartDate='"+StadisticDt[y][2]+"';GetIOs('"+StadisticDt[y][0]+"');return false;\">\n";	//+","+StadisticDt[y][2]+","+StadisticDt[y][3]
		out+="		<img src=\"../img/Graficos.jpg\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		{
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+StadisticDt[y][0]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+StadisticDt[y][1]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+StadisticDt[y][2]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+StadisticDt[y][3]+"</font>\n";
			out+="	</td>\n";
		}
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"GetUrlB('./setitems.jsp?sql=DELETE FROM hisvars WHERE id LIKE %27"+StadisticDt[y][0]+"%27',fncnone);GetIOsList();\">\n";
		out+="		<img src=\"../img/defile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		out+="</tr>\n";
		y++;
	}
	out+="</table>\n";
	if(document.getElementById("ListBody"))
		document.getElementById("ListBody").innerHTML=out;
	return out;
}
function InitStadistic()
{
	winAdd("IOsStadistic");
	winList["IOsStadistic"].SetW(350+"px");
	winUdate();
}
function ShwControl(Id)
{
	var out="";
	var hs;
	//-------------------------------------------------------------------------------------------------
	var dat=StartDate.split(" ");
	hs=dat[1].split(":");
	out+="<table border=\"0\" cellpadding=\"2\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"90%\" >\n";
	out+="<tr align=\"center\" >\n";
	out+="<td align=\"center\" valign=\"middle\">\n";
	out+="<font size=\"1\" face=\"Verdana\">"+Str_StartDate+":</font>\n";
	out+="<a href=\"javascript:NewCal('StartDate','yyyymmdd',false,24)\">\n";
	out+="	<img src=\"../img/cal.gif\" width=\"16\" height=\"16\" border=\"0\" alt=\"Pick a date\">\n";
	out+="</a>\n";
	out+="<input type=\"Text\" class=\"INTEXT\" id=\"StartDate\" maxlength=\"15\" size=\"15\" value=\""+dat[0]+"\"> \n";
	out+="<select class=\"INTEXT\" id=\"StartTime\" onchange=\"return false;\" >\n";
	out+="<option value=\"\" ></option>\n";
	for(var h=0;h<24;h++)
	{
		for(var m=0;m<60;m++)
		{
			out+="<option value=\""+h+":"+m+"\" ";
			if(parseInt(hs[0])==h && parseInt(hs[1])==m)
				out+=" selected=\"selected\"";
			out+=">"+h+":"+m+"</option>\n";
		}
	}
	out+="</select>\n";
	out+="</td>\n";
	//-------------------------------------------------------------------------------------------------
	out+="<td align=\"center\" valign=\"middle\">\n";
	dat=EndDate.split(" ");
	hs=dat[1].split(":");
	out+="<font size=\"1\" face=\"Verdana\">"+Str_EndDate+":</font>\n";
	out+="<a href=\"javascript:NewCal('EndDate','yyyymmdd',false,24)\">\n";
	out+="	<img src=\"../img/cal.gif\" width=\"16\" height=\"16\" border=\"0\" alt=\"Pick a date\">\n";
	out+="</a>\n";
	out+="<input type=\"Text\" class=\"INTEXT\" id=\"EndDate\" maxlength=\"15\" size=\"15\" value=\""+dat[0]+"\"> \n";
	out+="<select class=\"INTEXT\" id=\"EndTime\" onchange=\"return false;\" >\n";
	out+="<option value=\"\" ></option>\n";
	for(var h=0;h<24;h++)
	{
		for(var m=0;m<60;m++)
		{
			out+="<option value=\""+h+":"+m+"\" ";
			if(parseInt(hs[0])==h && parseInt(hs[1])==m)
				out+=" selected=\"selected\"";
			out+=">"+h+":"+m+"</option>\n";
		}
	}
	out+="</select>\n";
	out+="</td>\n";
	//-------------------------------------------------------------------------------------------------
	out+="<td align=\"center\" valign=\"middle\">\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Filtro+"\" onclick=\"FltrDate('"+Id+"');return false;\" />\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Print_Info+"\" onclick=\"MadeInfo('"+Id+"');return false;\" />\n";
	out+="</td>\n";
	//-------------------------------------------------------------------------------------------------
	out+="</td>\n";
	out+="</tr>\n";
	out+="<tr align=\"center\" >\n";
	out+="<td align=\"center\" valign=\"middle\">\n";
	out+="<input type=\"checkbox\" onchange=\"if(this.checked==false){StartValue=0;EndValue=0;}FltrDate('"+Id+"');\" id=\"chkfltval\" value=\"\" ";
	if(EndValue!=StartValue)
			out+="checked"
	out+=">"+Str_Filtro+" "+Str_Value+"\n";
	out+="</td>\n";
	out+="<td align=\"center\" valign=\"middle\">\n";
	out+="<input type=\"Text\" class=\"INTEXT\" id=\"StartValue\" maxlength=\"15\" size=\"15\" onkeyup=\"StartValue=this.value;\" value=\""+StartValue+"\"><br/>\n";
	out+="<input type=\"Text\" class=\"INTEXT\" id=\"EndValue\" maxlength=\"15\" size=\"15\" onkeyup=\"EndValue=this.value;\" value=\""+EndValue+"\"> \n";
	out+="</td>\n";
	out+="<td align=\"center\" valign=\"middle\">\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"winList['IOsStadistic'].close();return false;\" /><br/>\n";
	out+="</td>\n";
	out+="</table>\n";
	return out;
}
function EditCap(id)
{
	ed=StadisticDt[id][2];
 	ShowIOsList();
	document.getElementById("CapVar").value=StadisticDt[id][0].replace("/CapTime","");
	document.getElementById("CapTime").value=StadisticDt[id][1];
	document.getElementById("CapKey").value=StadisticDt[id][2];
}
function rcvMinMax(Datos)
{
	Datos=Datos.responseText;
	Datos=replaceAll(Datos,"\n","\t");
	Datos=Datos.split("\t");
	RemoveUnusedItem(Datos);
	MinAmp=Datos[0];
	if(Datos[1]>10)
		MaxAmp=Datos[1];
	else
		MaxAmp=40;
}
function rcvhisIOs(Datos)
{
	var idx=0;
	var out="";
	var temp="";
	var temp2="";
	var valor=0;
	GrphDat.length=0;
	GrphDatFq.length=0;
	GrphDatVl.length=0;
	if(Log_En)
		document.getElementById('dgv').innerHTML="";
	//-----------------------------
	MaxAmp=1;
	MinAmp=0;
	MaxFq=0;
	MinFq=0;
	Datos=rcvtbl(Datos);
	//-----------------------------
	for(var a=0;a<Datos.length;a++)
	{
		//----------------------------------------------------- calcuos de Ocupacion para parametro de IOsX/Datos
		if(Datos[a][0].indexOf("/IOs")!=-1 && Datos[a][0].indexOf("/Datos")!=-1)
		{
			if(a<(Datos.length-1))
			{
				temp=Datos[a][1];
				temp=temp.split(",");
				temp2=Datos[a+1][1];
				temp2=temp2.split(",");
				temp[1]=parseInt(temp[1]);
				temp[2]=parseInt(temp[2]);
				temp2[1]=parseInt(temp2[1]);
				temp2[2]=parseInt(temp2[2]);
				if(temp[1]<temp2[1])
					valor=(temp2[1]-temp[1]);
				else
					valor=(temp[1]-temp2[1]);
				if(temp[2]<temp2[2])
					valor=100*((temp2[2]-temp[2])/valor);
				else
					valor=100*((temp[2]-temp2[2])/valor);
				if(temp[1]==temp2[1])
				{
					if(Datos[a][1].indexOf("precent")!=-1)
						valor=100;
					else
						valor=0;
				}
				Datos[a][1]=""+(valor*100);
			}
			else
				Datos.splice(a+1,1);
		}
		//-----------------------------------------------------
		idx=GrphDat.length;
		valor=parseInt(Datos[a][1]);
		if(valor>MaxAmp)
			MaxAmp=(valor+(valor/20));	// calcula amplittud
		if(valor<MinAmp)
			MinAmp=valor;								// calcula amplitud negativa
		if(document.getElementById("chkfltval") && document.getElementById("chkfltval").checked==true)
		{
			if(valor>=StartValue && valor<=EndValue)
			{
				GrphDat[idx]=new Array();
				GrphDat[idx][0]=valor;
				GrphDat[idx][1]=Datos[a][2];
			}
		}
		else
		{
				GrphDat[idx]=new Array();
				GrphDat[idx][0]=valor;
				GrphDat[idx][1]=Datos[a][2];
		}
	}
	for(var a=0;a<GrphDat.length;a++)
	{
		valor=GrphDatVl.indexOf(GrphDat[a][0])
		if(valor==-1)
		{
			valor=GrphDatFq.length;
			GrphDatVl[valor]=GrphDat[a][0];
			GrphDatFq[valor]=0;
		}
		GrphDatFq[valor]++;
		if(MaxFq<GrphDatFq[valor])
			MaxFq=GrphDatFq[valor];
	}
	for(var a=0;a<GrphDatVl.length;a++)
	{
		for(var b=0;b<(GrphDatVl.length-1);b++)
		{
			if(GrphDatVl[b]>GrphDatVl[b+1])
			{
				valor=GrphDatVl[b+1];
				GrphDatVl[b+1]=GrphDatVl[b];
				GrphDatVl[b]=valor;
				valor=GrphDatFq[b+1];
				GrphDatFq[b+1]=GrphDatFq[b];
				GrphDatFq[b]=valor;
			}
		}
	}
	if (winList["IOsStadistic"])
	{
		winList["IOsStadistic"].open();
		winList["IOsStadistic"].SetH("420px");
		winList["IOsStadistic"].SetW("700px");
	}
	//---------------------------------Title
	document.getElementById("IOsStadisticTitle").innerHTML=Str_Config;
	document.getElementById("IOsStadisticBody").innerHTML=ShwControl(Datos[0][0]);
	document.getElementById("IOsStadisticBody").innerHTML+=Hisform("#0000FF","#FF0000");
	//document.getElementById("GraphName").innerHTML=Datos[0][0];
	//document.getElementById("GrphDat").setAttribute("d", ShwGrphDat());
}
function ShwGrphDat()
{
	var GridX="";
	var outO="";
	var tempV;
	var Mcnt;
	//---------------------------------
	outO="M50,300 ";
	tempV=300;
	//---------------------------------
	Mcnt=GrphDat.length;
	//---------------------------------
	var MsPx=1;
	var PxMs=1;
	var MsPy=1;
	var PyMs=1;
	if(300>=MaxAmp)
		MsPy=(300/MaxAmp);
	else
		PyMs=(MaxAmp/300);
	//----------------
	if(650>=Mcnt)
		MsPx=(650/Mcnt);
	else
		PxMs=(Mcnt/650);
	var idx=0;
	while((tempV=Math.round(idx*PxMs))<Mcnt)
	{
		if(tempV<GrphDat.length)
		{
			if(MsPx>10) 
				GridX+="<text fill=\"#000000\" x=\""+(100+Math.round(idx*MsPx))+"\" y=\""+(370-Math.round(idx*MsPx))+"\" transform=\"rotate(45 0,0)\" stroke-width=\"0\" font-size=\"8\" font-family=\"Monospace\" text-anchor=\"start\" xml:space=\"preserve\">"+GrphDat[tempV][1]+"</text>";
			tempV=(300-Math.round((MsPy*GrphDat[tempV][0])/PyMs));// eje Y
			if((50+Math.round(idx*MsPx))>650)
				outO+="L650,"+tempV+" ";
			else
				outO+="L"+(50+Math.round(idx*MsPx))+","+tempV+" ";
		}
		idx++;
	}
	if(GridX.indexOf("text")!=-1)
		document.getElementById("gridXtext").innerHTML=GridX;
	//---------------------------------
	outO+="L650,300 ";
	return outO;
	//---------------------------------
}
function Hisform(color,colorL)
{
	var temps="";
	var out="";
	var outP="";
	var GridX="";
	var outO="";
	var tempV;
	var Mcnt;
	var curve1="";
	var xnow;
	var xold;
	var yold;
	//---------------------------------
	outO="M50,300 ";
	tempV=300;
	//---------------------------------
	Mcnt=GrphDat.length;
	//---------------------------------
	var MsPx=1;
	var PxMs=1;
	var MsPy=1;
	var PyMs=1;
	if(300>=MaxAmp)
		MsPy=(300/MaxAmp);
	else
		PyMs=(MaxAmp/300);
	//----------------
	if(650>=Mcnt)
		MsPx=(650/Mcnt);
	else
		PxMs=(Mcnt/650);
	var idx=0;
	yold=0;
	xold=0;
	while((tempV=Math.round(idx*PxMs))<Mcnt)
	{
		if(tempV<GrphDat.length)
		{
			temps=GrphDat[tempV][1];
			//if(MsPx>10)GridX+="<text fill=\"#000000\" x=\""+(100+Math.round(idx*MsPx))+"\" y=\""+(370-Math.round(idx*MsPx))+"\" transform=\"rotate(45 0,0)\" stroke-width=\"0\" font-size=\"8\" font-family=\"Monospace\" text-anchor=\"start\" xml:space=\"preserve\">"+temps+"</text>";
			tempV=Math.round((MsPy*GrphDat[tempV][0])/PyMs);// eje Y
			xnow=Math.round(idx*MsPx);
			if((50+xnow)>650)
			{
				xnow=600;
				outO+="L650,"+(300-tempV)+" ";
			}
			else
				outO+="L"+(50+xnow)+","+(300-tempV)+" ";
			if(MsPx>4)outP+="<circle cx=\""+(50+xnow)+"\" cy=\""+(300-tempV)+"\" r=\"2\"  fill=\""+colorL+"\" stroke=\""+colorL+"\" stroke-width=\"1\"  />";
			if(MsPx>10)
			{
				curve1+="<path id=\"lineAB\" d=\"";
				curve1+="M"+(50+xold)+","+(300-yold)+"  C"+(50+xold+Math.round((xnow-xold)/2))+","+(300-yold)+" "+(50+xold+Math.round((xnow-xold)/2))+","+(300-tempV)+" "+(50+xnow)+","+(300-tempV);
				curve1+="\" stroke=\"#0000FF\" stroke-width=\"1\" fill=\"none\" />\n";
				xold=xnow;
				yold=tempV;
			}
		}
		idx++;
	}
	if(MsPx>10)
	{
		xnow=600;
		tempV=0;
		curve1+="<path id=\"lineAB\" d=\"";
		curve1+="M"+(50+xold)+","+(300-yold)+"  C"+(50+xold+Math.round((xnow-xold)/2))+","+(300-yold)+" "+(50+xold+Math.round((xnow-xold)/2))+","+(300-tempV)+" "+(50+xnow)+","+(300-tempV);
		curve1+="\" stroke=\"#0000FF\" stroke-width=\"1\" fill=\"none\" />\n";
	}
	//---------------------------------
	outO+="L650,300 ";
	//---------------------------------
	out+="<svg width=\"670\" height=\"500\" xmlns=\"http://www.w3.org/2000/svg\">";
	out+="<title>"+Str_Statistic+"</title>";
	out+="<rect fill=\"#FFFFFF\" stroke=\"#000000\" x=\"1\" y=\"1\" width=\"669\" height=\"339\" id=\"fondo\" />";
	//---------------------
	/*out+="<rect style=\"fill:rgba(0,0,0,0.0);\" stroke=\"#000000\" x=\"1\" y=\"1\" width=\"669\" height=\"339\" id=\"fondo\" \
	onmousedown=\"ZoomHMD(evt);\" \
  onmouseup=\"ZoomHMU(evt);\" \
  onmouseover=\"ZoomHMO(evt);\" \
  onmousemove=\"ZoomHMM(evt);\" \
  onmouseout=\"ZoomHMOut(evt);\" \
	/>";//*/
	//---------------------
	out+="<g	id=\"Gtextwwwwww\" transform=\"translate(0,15)\" >";
	{
		//---------------------
		out+="<g id=\"gridY\" >";
		{
			var Step=(MaxAmp-MinAmp)/20
			for(var y=0;y<21;y++)
			{
				out+="<line id=\"svg_"+(y+10)+"\" x1=\"50\" y2=\""+(y*15)+"\" x2=\"650\" y1=\""+(y*15)+"\" stroke=\"#000000\" fill=\"none\"/>";
				out+="<text fill=\""+color+"\" x=\"6\" y=\""+(y*15)+"\" stroke-width=\"0\" font-size=\"10\" font-family=\"Monospace\" text-anchor=\"start\" xml:space=\"preserve\">"+Math.round((MaxAmp-(y*Step))*100)/100+"</text>";
			}
		}
		out+="</g>";
		//---------------------
		out+="<g id=\"gridX\">";
		{
			out+="<line id=\"svg_33\" y2=\"0\" x2=\"50\" y1=\"300\" x1=\"50\" stroke=\"#000000\" fill=\"none\"/>";
			out+="<line id=\"svg_35\" y2=\"0\" x2=\"650\" y1=\"300\" x1=\"650\" stroke=\"#000000\" fill=\"none\"/>";
		}
		out+="</g>";
		//---------------------
		out+="<path stroke=\""+colorL+"\" fill=\""+colorL+"\" stroke-width=\"1\" fill-opacity=\"0.20\" id=\"GrphDat\" d=\""+outO+"\" />";
		//out+="<path stroke=\"#FF0000\" fill=\"#FF0000\" stroke-width=\"1\" fill-opacity=\"0.20\" id=\"Conteo\" d=\"M50,300 L650,300\" />";
		//out+="<line id=\"refresh\" y2=\"0\" x2=\"50\" y1=\"305\" x1=\"50\" stroke-width=\"2\" stroke=\"#000000\" fill=\"none\"/>";
		out+="<g id=\"gridXtext\" >";
		if(GridX.indexOf("text")!=-1)
			out+=GridX;
		out+=curve1;
		out+=outP;
		out+="</g>";
	}
	out+="</g>";
	out+="</svg>";
	return out;
}
function GraphVlFq(color,colorL)
{
	var curve1="";
	var xnow;
	var ynow;
	var xold;
	var yold;
	var out="";
	out+="<svg width=\"670\" height=\"350\" xmlns=\"http://www.w3.org/2000/svg\">";
	out+="<title>"+Str_Statistic+"</title>";
	out+="<rect fill=\"#FFFFFF\" stroke=\"#000000\" x=\"1\" y=\"1\" width=\"669\" height=\"339\" id=\"fondo\" />";
	//---------------------
	out+="<g	id=\"Gtextwwwwww\" transform=\"translate(0,15)\" >";
	{
		//---------------------
		out+="<g id=\"gridY\">";
		{
			var Stepy=MaxFq/20;
			for(var y=0;y<21;y++)
			{
				out+="<line id=\"svg_y"+(y+10)+"\" x1=\"50\" y2=\""+(y*15)+"\" x2=\"650\" y1=\""+(y*15)+"\" stroke=\"#000000\" fill=\"none\"/>";
				out+="<text fill=\""+color+"\" x=\"6\" y=\""+(y*15)+"\" stroke-width=\"0\" font-size=\"10\" font-family=\"Monospace\" text-ancho-r=\"start\" xml:space=\"preserve\">"+Math.round((MaxFq-(y*Stepy))*100)/100+"</text>";
			}
		}
		out+="</g>";
		//---------------------
		out+="<g id=\"gridX\">";
		{
			Stepy=300/MaxFq;
			var Stepx=600/(GrphDatVl.length+1);
			out+="<line id=\"svg_x33\" y2=\"0\" x2=\"50\" y1=\"300\" x1=\"50\" stroke=\"#000000\" fill=\"none\"/>";
			xold=0;
			yold=0;
			for(var x=0;x<GrphDatVl.length;x++)
			{
				out+="<circle cx=\""+(50+(Stepx*(x+1)))+"\" cy=\""+(300-(Stepy*GrphDatFq[x]))+"\" r=\"4\"  fill=\""+colorL+"\" stroke=\""+colorL+"\" stroke-width=\"1\"  />";
				out+="<rect x=\""+(50+(Stepx*(x+1))-(Stepx/4))+"\" y=\""+(300-(Stepy*GrphDatFq[x]))+"\" width=\""+(Stepx/2)+"\" height=\""+(Stepy*GrphDatFq[x])+"\" id=\"svg_x"+(x+10)+"\" fill=\""+colorL+"\" stroke=\""+colorL+"\" stroke-width=\"1\" fill-opacity=\"0.20\" />";
				//out+="<line x1=\""+(50+(Stepx*(x+1)))+"\" y2=\""+(300-(Stepy*GrphDatFq[x]))+"\" x2=\""+(50+(Stepx*(x+1)))+"\" y1=\"300\" id=\"svg_x"+(x+10)+"\" stroke=\"#000000\" fill=\"none\"/>";
				out+="<text fill=\""+color+"\" x=\""+(50+(Stepx*(x+1)))+"\" y=\"310\" stroke-width=\"0\" font-size=\"10\" font-family=\"Monospace\" text-anchor=\"start\" xml:space=\"preserve\">"+GrphDatVl[x]+"</text>";
				//if(MsPx>10)
				{
					xnow=(Stepx*(x+1));
					if((50+xnow)>650)
						xnow=600;
					ynow=(Stepy*GrphDatFq[x]);
					curve1+="<path id=\"lineAB\" d=\"";
					curve1+="M"+(50+xold)+","+(300-yold)+"  C"+(50+xold+Math.round((xnow-xold)/2))+","+(300-yold)+" "+(50+xold+Math.round((xnow-xold)/2))+","+(300-ynow)+" "+(50+xnow)+","+(300-ynow);
					curve1+="\" stroke=\"#0000FF\" stroke-width=\"1\" fill=\"none\" />\n";
					xold=xnow;
					yold=ynow;
				}
			}
			{
				xnow=600;
				ynow=0;
				curve1+="<path id=\"lineAB\" d=\"";
				curve1+="M"+(50+xold)+","+(300-yold)+"  C"+(50+xold+Math.round((xnow-xold)/2))+","+(300-yold)+" "+(50+xold+Math.round((xnow-xold)/2))+","+(300-ynow)+" "+(50+xnow)+","+(300-ynow);
				curve1+="\" stroke=\"#0000FF\" stroke-width=\"1\" fill=\"none\" />\n";
			}
			out+=curve1;
			out+="<line id=\"svg_x35\" y2=\"0\" x2=\"650\" y1=\"300\" x1=\"650\" stroke=\"#000000\" fill=\"none\"/>";
		}
		out+="</g>";
		//---------------------
		//out+="<path stroke=\""+colorL+"\" fill=\""+colorL+"\" stroke-width=\"1\" fill-opacity=\"0.20\" id=\"GrphDat\" d=\"M50,300 L650,300\" />";
		//out+="<path stroke=\"#FF0000\" fill=\"#FF0000\" stroke-width=\"1\" fill-opacity=\"0.20\" id=\"Conteo\" d=\"M50,300 L650,300\" />";
		out+="<line id=\"refresh\" y2=\"0\" x2=\"50\" y1=\"305\" x1=\"50\" stroke-width=\"2\" stroke=\"#000000\" fill=\"none\"/>";
	}
	out+="</g>";
	out+="</svg>";
	return out;
}
//------------------------------------------------
function ZoomHMD(e)
{
	//LOG("Down["+e.clientX+","+e.clientY+"]");
}
function ZoomHMU(e)
{
}
function ZoomHMO(e)
{
//	LOG("Over["+e.clientX+","+e.clientY+"]");
}
function ZoomHMM(e)
{
	//LOG("Mov["+e.clientX+","+e.clientY+"]");
}
function ZoomHMOut(e)
{
//	LOG("Out["+e.clientX+","+e.clientY+"]");
}
