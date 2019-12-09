var OptModels=[0,""
,1,"MSTC-V1M3"
,2,"GW1M3"
,3,"GW2M3"
,4,"GW3M3"
,5,"GW1M4"
,6,"GW2M4"
,7,"GW3M4"
,8,"GW4M4"
,9,"STC-S4-M3"
,10,"MAC-TC1"
,11,"SAD-V1M4"
,12,"SAD-V2M4"
,13,"SAD-V3M4"
,14,"DGV-uTC1-M4"];

var Models=		["","MSTC-V1M3","GW1M3","GW2M3","GW3M3","GW1M4","GW2M4","GW3M4","GW4M4","STC-S4-M3","MAC-TC1","SAD-V1M4","SAD-V2M4","SAD-V3M4","DGV-uTC1-M4"];
var VecMod2Rsrc=[0,1,1,1,1,2,2,2,2,2,2,2,2,2,2];
var RsrcGvM=	[""	,"GbVars.bin"				,"GbVars.bin"];
var RsrcPlcsM=	[""	,"plcs.bin"					,"plcs.bin"];
var RsrcIOsM=	[""	,"ios.bin"					,"ios.bin"];
var RsrcLogM=	[""	,"log.bin"					,"log.bin"];
var RsrcPhasesM=[""	,"phases.bin"				,"phases.bin"];
var RsrcIplcM=	[""	,"iplc.bin"					,"iplc.bin"];
var RsrcFcp=	[""	,"web/runplans.dgv"	,"web/runplans.dgv"];
var OptCtrl=	[0,"",1,"Agenda Central"];
var OptDrv=		["none","Disable","drv1","Driver 1","drv2","Driver 2","drv3","Driver 3"];
var OptDrvs=	["tout.","","drv1","drv1","drv2","drv2","drv3","drv3","drv4","drv4"];
var OptGrp=		[];


var ConfigureTcHttp=[
{Key:0,
oID:0,
ID:0,
Modelo:1,
Drv:"",
URL:0,
WAC:"",
TimeOut:0,
Refresh:1000,
Resource:"GbVars.bin"
},{Key:0,
Modelo:1,
TimeOut:0,
Refresh:1000,
Resource:"plcs.bin"
},{Key:0,
Modelo:1,
TimeOut:0,
Refresh:1000,
Resource:"phases.bin"
},{Key:0,
Modelo:1,
TimeOut:0,
Refresh:1000,
Resource:"ios.bin"
}];

//=================================================
function HttpAdd()
{
	ConfigureTcHttp=[
{Key:0,
oID:0,
ID:0,
Modelo:1,
Drv:"",
URL:0,
WAC:"",
TimeOut:0,
Refresh:1000,
Resource:"GbVars.bin"
},{Key:0,
Modelo:1,
TimeOut:0,
Refresh:1000,
Resource:"plcs.bin"
},{Key:0,
Modelo:1,
TimeOut:0,
Refresh:1000,
Resource:"phases.bin"
},{Key:0,
Modelo:1,
TimeOut:0,
Refresh:1000,
Resource:"ios.bin"
}];
RefreshHtpConf();
}

function InitTcHttpConf()
{
	winAdd("TcHttpConf");
	winList["TcHttpConf"].SetW("350px");
	winUdate();
}

function GetTcHttpConf(Id)
{
	GetUrlB("./getitems.jsp?sql=SELECT * FROM httpdrv WHERE id LIKE %27"+Id+"%27 order by id",rcvTcHttpConf);
}

function RefreshHtpConf()
{
	if (winList['TcHttpConf'])
	{
		winList['TcHttpConf'].open();
		winList["TcHttpConf"].SetH("325px");
	}
	document.getElementById("TcHttpConfTitle").innerHTML=Str_Config+" New";
	document.getElementById("TcHttpConfBody").innerHTML=ShowConf();
}

function rcvTcHttpConf(Datos)
{
	var Rsc=0;
	Datos=Datos.responseText;
	Datos=Datos.split("\n");
	RemoveUnusedItem(Datos);
	if(Datos.length==0)
		return "";
	ConfigureTcHttp=new Array();
	for(var a=0;a<Datos.length;a++)
	{
		Rsc=ConfigureTcHttp.length;
		Datos[a]=Datos[a].split("\t");
		if(Datos[a].length>=12)
		{
			ConfigureTcHttp[Rsc]=new Object();
			ConfigureTcHttp[Rsc].Drv=Datos[a][0];
			ConfigureTcHttp[Rsc].Drv=ConfigureTcHttp[Rsc].Drv.replace("tout.","");
			ConfigureTcHttp[Rsc].URL=Datos[a][1];
			ConfigureTcHttp[Rsc].Resource=Datos[a][2];
			ConfigureTcHttp[Rsc].WAC=Datos[a][4];
			ConfigureTcHttp[Rsc].Refresh=parseInt(Datos[a][6]);
			ConfigureTcHttp[Rsc].ID=Datos[a][8];
			ConfigureTcHttp[Rsc].ID=ConfigureTcHttp[Rsc].ID.replace("ID","");
			ConfigureTcHttp[Rsc].oID=ConfigureTcHttp[Rsc].ID;
			ConfigureTcHttp[Rsc].TimeOut=parseInt(Datos[a][9]);
			ConfigureTcHttp[Rsc].Modelo=GetVecItm(OptModels,Datos[a][10]);//Models.indexOf(
			ConfigureTcHttp[Rsc].Key=parseInt(Datos[a][11])+1;
		}
		else
			Datos.splice(a,1);
	}
	if (winList['TcHttpConf'])
	{
		winList['TcHttpConf'].open();
		winList["TcHttpConf"].SetH("270px");
	}
	document.getElementById("TcHttpConfTitle").innerHTML=Str_Config+" ID"+ConfigureTcHttp[0].ID;
	document.getElementById("TcHttpConfBody").innerHTML=ShowConf();
}
function ShowConf()
{
	var idx=0;
	var out="";
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
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Ident+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		ID<input class=\"INTEXT\" size=\"5\" maxlength=\"5\"  value=\""+ConfigureTcHttp[0].ID+"\" onkeyup=\"ConfigureTcHttp[0].ID=this.value;\" />\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_GP_ETH_Address+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<input class=\"INTEXT\" size=\"15\" maxlength=\"80\"  value=\""+ConfigureTcHttp[0].URL+"\" onkeyup=\"ConfigureTcHttp[0].URL=this.value;\" />\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">WAC</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<input class=\"INTEXT\" size=\"5\" maxlength=\"5\"  value=\""+ConfigureTcHttp[0].WAC+"\" onkeyup=\"ConfigureTcHttp[0].WAC=this.value;\" />\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Model+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="<select class=\"INTEXT\" id=\"SelectModel\" onchange=\"ConfigureTcHttp[0].Modelo=this.value;\" >\n";
		out+=GenOptionsV(OptModels,ConfigureTcHttp[0].Modelo);
		out+="</select>\n"
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">Drv</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="<select class=\"INTEXT\" id=\"SelectDrv\" onchange=\"ConfigureTcHttp[0].Drv=this.value;\" >\n";
		out+=GenOptionsV(OptDrv,ConfigureTcHttp[0].Drv);
		out+="</select>\n"
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	for(var Rsc=0;Rsc<ConfigureTcHttp.length;Rsc++)
	{
		
		if(ConfigureTcHttp[Rsc].Resource.indexOf(RsrcFcp[VecMod2Rsrc[ConfigureTcHttp[0].Modelo]])==-1) // exclude runplan
		{
			out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
			out+="	<td align=\"center\">\n";
			if(ConfigureTcHttp[Rsc].Resource.indexOf(RsrcGvM[VecMod2Rsrc[ConfigureTcHttp[0].Modelo]])!=-1)
				out+="		<font size=\"1\" face=\"Verdana\">GV</font>\n";
			if(ConfigureTcHttp[Rsc].Resource.indexOf(RsrcPlcsM[VecMod2Rsrc[ConfigureTcHttp[0].Modelo]])!=-1)
				out+="		<font size=\"1\" face=\"Verdana\">"+Str_Virtual_Controlers+"</font>\n";
			if(ConfigureTcHttp[Rsc].Resource.indexOf(RsrcPhasesM[VecMod2Rsrc[ConfigureTcHttp[0].Modelo]])!=-1)
				out+="		<font size=\"1\" face=\"Verdana\">"+Str_Phases+"</font>\n";
			if(ConfigureTcHttp[Rsc].Resource.indexOf(RsrcIOsM[VecMod2Rsrc[ConfigureTcHttp[0].Modelo]])!=-1)
				out+="		<font size=\"1\" face=\"Verdana\">"+Str_Inputs+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<input class=\"INTEXT\" size=\"5\" maxlength=\"5\"  value=\""+ConfigureTcHttp[Rsc].Refresh/1000+"\" onkeyup=\"ConfigureTcHttp["+Rsc+"].Refresh=(this.value*1000);\" />\n";
			out+="	</td>\n";
			out+="</tr>\n";
		}
	}
	//---------------------------------------------------------------------
	out+="</table>\n";
	if(ConfigureTcHttp[0].Key==0)
	{
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Add+"\" onclick=\"UpDtTcHttpConf();return false;\" />\n";
	}
	else
	{
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_save+"\" onclick=\"UpDtTcHttpConf();return false;\" />\n";
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Delet+"\" onclick=\"DelTcHttpConf('"+ConfigureTcHttp[0].oID+"');return false;\" />\n";
	}
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Cancel+"\" onclick=\"winList['TcHttpConf'].close();return false;\" />\n";
	return out;
}
//=================================================
function ShowHtmlList(Datos)
{
	var x=0;
	var y=0;
	var bgcolor="";
	var out="";
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
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Model+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_IP+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Status+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Driver+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\">\n";
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
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"GetTcHttpConf('"+Datos[y][0]+"');winList['List'].close();\">\n";
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
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"DelTcHttpConf('"+Datos[y][0]+"');GetListHttp();\">\n";
		out+="		<img src=\"../img/defile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		out+="</tr>\n";
		y++;
	}
	//---------------------------------------------------------------------
	out+="</table>\n";
	return out;
}
function GetListHttp()
{
	GetUrlB("./getlist.jsp?cmps=max(id),max(model),max(address),max(status),max(drv)&tbl=httpdrv&grp=id&",rcvTcHttpList);
}
function rcvTcHttpList(Datos)
{
	Datos=rcvtbl(Datos);
	if (winList["List"])
	{
		winList["List"].open();
		winList["List"].SetH((4+15+(Datos.length*25))+"px");
		winList["List"].SetW(450+"px");
	}
	document.getElementById("ListTitle").innerHTML=Str_ListDevice;
	document.getElementById("ListBody").innerHTML=ShowHtmlList(Datos);
}
//=================================================
function DelTcHttpConf(ID)
{
	GetUrlB("./setitems.jsp?sql=DELETE FROM httpdrv WHERE id LIKE %27%25"+ID+"%25%27",fncnone);
	GetUrlB("./setitems.jsp?sql=DELETE FROM variables WHERE id LIKE %27%25"+ID+"%2F%25%27 AND NOT id LIKE %27%25%2FLocation%25%27",fncnone);
	GetUrlB("./setitems.jsp?sql=DELETE FROM hisvars WHERE id LIKE %27%25"+ID+"%2F%25%27",fncnone);
}

function UpDtTcHttpConf()
{
	//ConfigureTcHttp[0].Modelo=parseInt(document.getElementById("SelectModel").value);
	//ConfigureTcHttp[0].Drv=document.getElementById("SelectDrv").value;
	//----------------------------------------------------------------------------------------------------------------------------------------------------------------
	if(ConfigureTcHttp[0].Key!=0)
	{
		for(var Rsc=0;Rsc<ConfigureTcHttp.length;Rsc++)
		{
			GetUrlB("./setitems.jsp?sql=UPDATE httpdrv SET (resource,refresh,wac,drv,address,id,response_to,model,action,lstchg,status)%3D(%27"+ConfigureTcHttp[Rsc].Resource+"%27,"+ConfigureTcHttp[Rsc].Refresh+","+ConfigureTcHttp[0].WAC+",%27"+ConfigureTcHttp[0].Drv+"%27,%27"+ConfigureTcHttp[0].URL+"%27,%27ID"+ConfigureTcHttp[0].ID+"%27,%27"+ConfigureTcHttp[0].TimeOut+"%27,%27"+Models[ConfigureTcHttp[0].Modelo]+"%27,%27pool%27,%272000-01-01 01:00:00%27,%27New%27)%20WHERE%20key%3D%27"+(ConfigureTcHttp[Rsc].Key-1)+"%27",fncnone);
/*
GetUrlB("./setitems.jsp?sql=INSERT INTO httpdrv (drv,address,resource,wac,refresh,action,id,response_to,model,lstchg,status) VALUES (%27"+ConfigureTcHttp.Drv+"%27,%27"+ConfigureTcHttp.URL+"%27,%27"+RsrcGvM[VecMod2Rsrc[ConfigureTcHttp.Modelo]]+"%27,"+ConfigureTcHttp.WAC+","+ConfigureTcHttp.GV+",%27pool%27,%27ID"+ConfigureTcHttp.ID+"%27,%27"+ConfigureTcHttp.TimeOut+"%27,%27"+Models[ConfigureTcHttp.Modelo]+"%27,%272000-01-01 01:00:00%27,%27New%27)",fncnone);
GetUrlB("./setitems.jsp?sql=INSERT INTO httpdrv (drv,address,resource,wac,refresh,action,id,response_to,model,lstchg,status) VALUES (%27"+ConfigureTcHttp.Drv+"%27,%27"+ConfigureTcHttp.URL+"%27,%27"+RsrcPlcsM[VecMod2Rsrc[ConfigureTcHttp.Modelo]]+"%27,"+ConfigureTcHttp.WAC+","+ConfigureTcHttp.PLCs+",%27pool%27,%27ID"+ConfigureTcHttp.ID+"%27,%27"+ConfigureTcHttp.TimeOut+"%27,%27"+Models[ConfigureTcHttp.Modelo]+"%27,%272000-01-01 01:00:00%27,%27New%27)",fncnone);
GetUrlB("./setitems.jsp?sql=INSERT INTO httpdrv (drv,address,resource,wac,refresh,action,id,response_to,model,lstchg,status) VALUES (%27"+ConfigureTcHttp.Drv+"%27,%27"+ConfigureTcHttp.URL+"%27,%27"+RsrcPhasesM[VecMod2Rsrc[ConfigureTcHttp.Modelo]]+"%27,"+ConfigureTcHttp.WAC+","+ConfigureTcHttp.Phases+",%27pool%27,%27ID"+ConfigureTcHttp.ID+"%27,%27"+ConfigureTcHttp.TimeOut+"%27,%27"+Models[ConfigureTcHttp.Modelo]+"%27,%272000-01-01 01:00:00%27,%27New%27)",fncnone);
GetUrlB("./setitems.jsp?sql=INSERT INTO httpdrv (drv,address,resource,wac,refresh,action,id,response_to,model,lstchg,status) VALUES (%27"+ConfigureTcHttp.Drv+"%27,%27"+ConfigureTcHttp.URL+"%27,%27"+RsrcIOsM[VecMod2Rsrc[ConfigureTcHttp.Modelo]]+"%27,"+ConfigureTcHttp.WAC+","+ConfigureTcHttp.IOs+",%27pool%27,%27ID"+ConfigureTcHttp.ID+"%27,%27"+ConfigureTcHttp.TimeOut+"%27,%27"+Models[ConfigureTcHttp.Modelo]+"%27,%272000-01-01 01:00:00%27,%27New%27)",fncnone);
GetUrlB("./setitems.jsp?sql=INSERT INTO httpdrv (drv,address,resource,wac,refresh,action,id,response_to,model,lstchg,status) VALUES (%27"+ConfigureTcHttp.Drv+"%27,%27"+ConfigureTcHttp.URL+"%27,%27"+RsrcFcp[VecMod2Rsrc[ConfigureTcHttp.Modelo]]+"%27,"+ConfigureTcHttp.WAC+",12000,%27pool%27,%27ID"+ConfigureTcHttp.ID+"%27,%27"+ConfigureTcHttp.TimeOut+"%27,%27"+Models[ConfigureTcHttp.Modelo]+"%27,%272000-01-01 01:00:00%27,%27New%27)",fncnone);*/
		}
	}
	else
	{
		if(ConfigureTcHttp.GV)
			GetUrlB("./setitems.jsp?sql=INSERT INTO httpdrv (drv,address,resource,wac,refresh,action,id,response_to,model,lstchg,status) VALUES (%27"+ConfigureTcHttp[0].Drv+"%27,%27"+ConfigureTcHttp[0].URL+"%27,%27"+RsrcGvM[VecMod2Rsrc[ConfigureTcHttp[0].Modelo]]+"%27,"+ConfigureTcHttp[0].WAC+","+ConfigureTcHttp[0].Refresh+",%27pool%27,%27ID"+ConfigureTcHttp[0].ID+"%27,%27"+ConfigureTcHttp[0].TimeOut+"%27,%27"+Models[ConfigureTcHttp[0].Modelo]+"%27,%272000-01-01 01:00:00%27,%27New%27)",fncnone);
		if(ConfigureTcHttp.PLCs)
			GetUrlB("./setitems.jsp?sql=INSERT INTO httpdrv (drv,address,resource,wac,refresh,action,id,response_to,model,lstchg,status) VALUES (%27"+ConfigureTcHttp[0].Drv+"%27,%27"+ConfigureTcHttp[0].URL+"%27,%27"+RsrcPlcsM[VecMod2Rsrc[ConfigureTcHttp[0].Modelo]]+"%27,"+ConfigureTcHttp[0].WAC+","+ConfigureTcHttp[1].Refresh+",%27pool%27,%27ID"+ConfigureTcHttp[0].ID+"%27,%27"+ConfigureTcHttp[0].TimeOut+"%27,%27"+Models[ConfigureTcHttp[0].Modelo]+"%27,%272000-01-01 01:00:00%27,%27New%27)",fncnone);
		if(ConfigureTcHttp.Phases)
			GetUrlB("./setitems.jsp?sql=INSERT INTO httpdrv (drv,address,resource,wac,refresh,action,id,response_to,model,lstchg,status) VALUES (%27"+ConfigureTcHttp[0].Drv+"%27,%27"+ConfigureTcHttp[0].URL+"%27,%27"+RsrcPhasesM[VecMod2Rsrc[ConfigureTcHttp[0].Modelo]]+"%27,"+ConfigureTcHttp[0].WAC+","+ConfigureTcHttp[2].Refresh+",%27pool%27,%27ID"+ConfigureTcHttp[0].ID+"%27,%27"+ConfigureTcHttp[0].TimeOut+"%27,%27"+Models[ConfigureTcHttp[0].Modelo]+"%27,%272000-01-01 01:00:00%27,%27New%27)",fncnone);
		if(ConfigureTcHttp.IOs)
			GetUrlB("./setitems.jsp?sql=INSERT INTO httpdrv (drv,address,resource,wac,refresh,action,id,response_to,model,lstchg,status) VALUES (%27"+ConfigureTcHttp[0].Drv+"%27,%27"+ConfigureTcHttp[0].URL+"%27,%27"+RsrcIOsM[VecMod2Rsrc[ConfigureTcHttp[0].Modelo]]+"%27,"+ConfigureTcHttp[0].WAC+","+ConfigureTcHttp[3].Refresh+",%27pool%27,%27ID"+ConfigureTcHttp[0].ID+"%27,%27"+ConfigureTcHttp[0].TimeOut+"%27,%27"+Models[ConfigureTcHttp[0].Modelo]+"%27,%272000-01-01 01:00:00%27,%27New%27)",fncnone);
		GetUrlB("./setitems.jsp?sql=INSERT INTO httpdrv (drv,address,resource,wac,refresh,action,id,response_to,model,lstchg,status) VALUES (%27"+ConfigureTcHttp[0].Drv+"%27,%27"+ConfigureTcHttp[0].URL+"%27,%27"+RsrcFcp[VecMod2Rsrc[ConfigureTcHttp[0].Modelo]]+"%27,"+ConfigureTcHttp[0].WAC+",12000,%27pool%27,%27ID"+ConfigureTcHttp[0].ID+"%27,%27"+ConfigureTcHttp[0].TimeOut+"%27,%27"+Models[ConfigureTcHttp[0].Modelo]+"%27,%272000-01-01 01:00:00%27,%27New%27)",fncnone);
	}
	//----------------------------------------------------------------------------------------------------------------------------------------------------------------
	//GetUrlB("./setitems.jsp?sql=DELETE FROM variables WHERE id LIKE %27%25ID"+ConfigureTcHttp.oID+"%2F%25%27 AND NOT id LIKE %27%25%2FLocation%25%27",fncnone);
	winList['TcHttpConf'].close();
}
