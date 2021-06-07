var PdgvGp=	[32,"Plcs",33,"Loops",34,"Inputs",37,"phases"];
var PdgvGv=	[12,"voltage",16,"rtc",20,"version"];
var PdgvPLC=[0,"Mode",1,"ReIntento",148,"Plan"];
var PdgvIOs=[0,"Flags",8,"samples",12,"act",16,"count"];
var PdgvPHs=[0,"State",16,"current",18,"potR",20,"potY",22,"potG",24,"ErrorFlgs"];
var OptDrvDgvp=	["none","Disable","drv1","Driver 1","drv2","Driver 2","drv3","Driver 3","DrvRtc","Driver RTC"];

var LsCmps=			[	"RTC",
						"Voltage",
						"PlcMode",
						"Nplan",
						"Cph",
						"Cio",
						"PhColor",
						"PhRColor",
						"PhCurrent",
						"PhError",
						"IOsts"];
var LsCmpsTxt=		[	Str_DgvP_Date,
						Str_DgvP_Voltage,
						Str_DgvP_Mode,
						Str_DgvP_Plan,
						Str_DgvP_Cph,
						Str_DgvP_Cio,
						Str_DgvP_PhSts,
						Str_DgvP_PhStsR,
						Str_DgvP_PhCurr,
						Str_DgvP_PhErrors,
						Str_DgvP_IOsts];

var ConfigureTcDgvp={
drv:0,
srvid:0,
pdgvid:0,
id:0,
ipport:0,
TimeOut:60,
Status:"ok",
cmps:[]
}; 

//=================================================
function RefreshDgvpConf()
{
	if (winList['TcHttpConf'])
	{
		winList['TcHttpConf'].open();
	}
  winList["TcHttpConf"].SetH("290px");
	document.getElementById("TcHttpConfTitle").innerHTML=Str_Config;
	document.getElementById("TcHttpConfBody").innerHTML=ShowDgvpConf();
}
function AddtTcDgvpConf()
{
	ConfigureTcDgvp.drv="drv1";
	ConfigureTcDgvp.srvid=254;
	ConfigureTcDgvp.pdgvid=1;
	ConfigureTcDgvp.id="1";
	ConfigureTcDgvp.ipport=1055;
	ConfigureTcDgvp.cmps=[];
	ConfigureTcDgvp.Key=0;
	ConfigureTcDgvp.TimeOut=60;
	ConfigureTcDgvp.Status="ok";
}
function dgvpAdd()
{
	AddtTcDgvpConf();
	RefreshDgvpConf();
}
function rcvTcDgvpConf(Datos)
{
	var Refresh=0;
	var Resource="";
	var id=0;
	Datos=Datos.responseText;
	Datos=Datos.split("\n");
	RemoveUnusedItem(Datos);
	if(Datos.length==0)
		return "";
	ConfigureTcDgvp.Key=0;
	ConfigureTcDgvp.drv=0;
	ConfigureTcDgvp.srvid=0;
	ConfigureTcDgvp.pdgvid=0;
	ConfigureTcDgvp.id=0;
	ConfigureTcDgvp.URL="";
	ConfigureTcDgvp.ipport=0;
	ConfigureTcDgvp.TimeOut=60;
	ConfigureTcDgvp.cmps=[];
	ConfigureTcDgvp.Status="ok";
	for(var a=0;a<Datos.length;a++)
	{
		Datos[a]=Datos[a].split("\t");
		if(Datos[a].length>=7)
		{
			ConfigureTcDgvp.drv=Datos[a][0];
			ConfigureTcDgvp.drv=ConfigureTcDgvp.drv.replace("tout.","");
			ConfigureTcDgvp.srvid=parseInt(Datos[a][1]);
			ConfigureTcDgvp.pdgvid=parseInt(Datos[a][2]);
			ConfigureTcDgvp.id=Datos[a][3];
			ConfigureTcDgvp.id=ConfigureTcDgvp.id.replace("ID","");
			ConfigureTcDgvp.ipport=parseInt(Datos[a][4]);
			ConfigureTcDgvp.cmps=Datos[a][5].split(",");;
			ConfigureTcDgvp.Key=parseInt(Datos[a][6]);
			ConfigureTcDgvp.URL=Datos[a][7];
			ConfigureTcDgvp.LstUpd=Datos[a][8];
			ConfigureTcDgvp.TimeOut=parseInt(Datos[a][9]);
			ConfigureTcDgvp.Status=Datos[a][10];
			ConfigureTcDgvp.Model=Datos[a][11];
		}
		else
			Datos.splice(a,1);
	}
	RefreshDgvpConf();
}
function ShowDgvpConf()
{
	var idx=0;
	var tmp=0;
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
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Dgvp_ID+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		ID<input class=\"INTEXT\" id=\"pdgvid\" size=\"5\" maxlength=\"5\"  value=\""+ConfigureTcDgvp.id+"\" onkeyup=\"ConfigureTcDgvp.id=this.value;\" />\n";
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
		out+="<select class=\"INTEXT\" onchange=\"ConfigureTcDgvp.Model=this.value;\" >\n";
		out+=GenOptionsVi(Models,ConfigureTcDgvp.Model);
		out+="</select>\n"
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------*/
	/*{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_GP_ETH_Address+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<input class=\"INTEXT\" id=\"pdgvurl\" size=\"15\" maxlength=\"80\"  value=\""+ConfigureTcDgvp.URL+"\" onkeyup=\"ConfigureTcDgvp.URL=this.value;\" />\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------*/
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Dgvp_ipport+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<input class=\"INTEXT\" id=\"pdgvipport\" size=\"5\" maxlength=\"5\"  value=\""+ConfigureTcDgvp.ipport+"\" onkeyup=\"ConfigureTcDgvp.ipport=this.value;\" />\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------*/
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Time_Out+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<input class=\"INTEXT\" id=\"pdgvTimeOut\" size=\"5\" maxlength=\"5\"  value=\""+ConfigureTcDgvp.TimeOut+"\" onkeyup=\"ConfigureTcDgvp.TimeOut=this.value;\" />\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Dgvp_srvid+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<input class=\"INTEXT\" id=\"pdgvsrvid\" size=\"5\" maxlength=\"5\"  value=\""+ConfigureTcDgvp.srvid+"\" onkeyup=\"ConfigureTcDgvp.srvid=this.value;\" />\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Dgvp_pdgvid+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<input class=\"INTEXT\" id=\"pdgvpdgvid\" size=\"5\" maxlength=\"5\"  value=\""+ConfigureTcDgvp.pdgvid+"\" onkeyup=\"ConfigureTcDgvp.pdgvid=this.value;\" />\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Dgvp_cmps+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"left\" valign=\"middle\">\n";
		for(var i=0;i<ConfigureTcDgvp.cmps.length;i++)
		{
			tmp=LsCmps.indexOf(ConfigureTcDgvp.cmps[i]);
			out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Del+":";
			if(tmp!=-1)
			{
				out+=LsCmpsTxt[tmp];
			}
			else
			{
				out+=ConfigureTcDgvp.cmps[i]
			}
			out+="\" onclick=\"ConfigureTcDgvp.cmps.splice("+i+",1);RefreshDgvpConf();return false;\" /><br />\n";
		}
		out+="<br />["+Str_Add+":<select class=\"INTEXT\" onchange=\"if(this.selectedIndex>0){ConfigureTcDgvp.cmps[ConfigureTcDgvp.cmps.length]=LsCmps[this.selectedIndex-1];}RefreshDgvpConf();\" >\n";
		out+="<option></option>\n";
		out+=GenOptionsVi(LsCmpsTxt,null);
		out+="</select>]\n"
		//out+="		<input class=\"INTEXT\" id=\"pdgvcmps\" size=\"45\" maxlength=\"45\"  value=\""+ConfigureTcDgvp.cmps+"\" onkeyup=\"ConfigureTcDgvp.cmps=this.value;\" />\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Dgvp_drv+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="<select class=\"INTEXT\" id=\"pdgvDrv\" onchange=\"ConfigureTcDgvp.drv=this.value;\" >\n";
		out+=GenOptionsV(OptDrvDgvp,ConfigureTcDgvp.drv);
		out+="</select>\n"
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	out+="</table>\n";
	if(ConfigureTcDgvp.Key==0)
	{
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Add+"\" onclick=\"UpDtTcDgvpConf();return false;\" />\n";
	}
	else
	{
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_save+"\" onclick=\"UpDtTcDgvpConf();return false;\" />\n";
		//out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Delet+"\" onclick=\"DelTcDgvpConf('"+ConfigureTcDgvp.id+"');return false;\" />\n";
	}
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Cancel+"\" onclick=\"winList['TcHttpConf'].close();return false;\" />\n";
	return out;
}
//=================================================
function GetTcDgvpConf(id)
{
	GetUrlB("./getitems.jsp?sql=SELECT * FROM pdgv WHERE id LIKE %27"+id+"%27 order by id",rcvTcDgvpConf);
}
function DelTcDgvpConf(id)
{
	GetUrlB("./setitems.jsp?sql=DELETE FROM pdgv WHERE id LIKE %27%25"+id+"%25%27",fncnone);
	GetUrlB("./setitems.jsp?sql=DELETE FROM variables WHERE id LIKE %27%25"+id+"%2F%25%27",fncnone);
	GetUrlB("./setitems.jsp?sql=DELETE FROM hisvars WHERE id LIKE %27%25"+id+"%2F%25%27",fncnone);
}

function ShowDgvpList(Datos)
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
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Dgvp_ID+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Dgvp_drv+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Dgvp_srvid+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Dgvp_pdgvid+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Dgvp_ipport+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Dgvp_cmps+"</font>\n";
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
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"GetTcDgvpConf('"+Datos[y][0]+"');\">\n";
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
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"DelTcDgvpConf('"+Datos[y][0]+"');GetListdgvp();\">\n";
		out+="		<img src=\"../img/defile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		out+="</tr>\n";
		y++;
	}
	//---------------------------------------------------------------------
	out+="</table>\n";
	return out;
}
function GetListdgvp()
{
	GetUrlB("./getitems.jsp?sql=SELECT id,drv,srvid,pdgvid,ipport,cmps FROM pdgv order by id",rcvTcDgvpList);
}
function rcvTcDgvpList(Datos)
{
	Datos=rcvtbl(Datos);
	if (winList["List"])
	{
		winList["List"].open();
		winList["List"].SetH((4+15+(Datos.length*25))+"px");
		winList["List"].SetW(450+"px");
	}
	//document.getElementById("ListHora").innerHTML="";
	document.getElementById("ListTitle").innerHTML=Str_ListDevice;
	document.getElementById("ListBody").innerHTML=ShowDgvpList(Datos);
}
//=================================================
function UpDtTcDgvpConf()
{
	ConfigureTcDgvp.drv=document.getElementById("pdgvDrv").value;
	ConfigureTcDgvp.srvid=parseInt(document.getElementById("pdgvsrvid").value);
	ConfigureTcDgvp.pdgvid=parseInt(document.getElementById("pdgvpdgvid").value);
	ConfigureTcDgvp.id=document.getElementById("pdgvid").value;
	//ConfigureTcDgvp.URL=document.getElementById("pdgvurl").value;
	ConfigureTcDgvp.ipport=parseInt(document.getElementById("pdgvipport").value);
	ConfigureTcDgvp.TimeOut=parseInt(document.getElementById("pdgvTimeOut").value);
	//ConfigureTcDgvp.cmps=document.getElementById("pdgvcmps").value;
	if(ConfigureTcDgvp.Key==0)
	{
		GetUrlB("./setitems.jsp?sql=INSERT INTO pdgv (drv,srvid,pdgvid,id,ip,ipport,cmps,timeout,status,lstupd,model) VALUES (%27"+ConfigureTcDgvp.drv+"%27,"+ConfigureTcDgvp.srvid+","+ConfigureTcDgvp.pdgvid+",%27ID"+ConfigureTcDgvp.id+"%27,%27"+ConfigureTcDgvp.URL+"%27,"+ConfigureTcDgvp.ipport+",%27"+ConfigureTcDgvp.cmps+"%27,"+ConfigureTcDgvp.TimeOut+",%27ok%27,LOCALTIMESTAMP,%27"+ConfigureTcDgvp.Model+"%27)",fncnone);
	}
	else
	{
		GetUrlB("./setitems.jsp?sql=UPDATE pdgv SET (drv,srvid,pdgvid,id,ip,ipport,cmps,timeout,status,lstupd,model)%3D(%27"+ConfigureTcDgvp.drv+"%27,"+ConfigureTcDgvp.srvid+","+ConfigureTcDgvp.pdgvid+",%27ID"+ConfigureTcDgvp.id+"%27,%27"+ConfigureTcDgvp.URL+"%27,"+ConfigureTcDgvp.ipport+",%27"+ConfigureTcDgvp.cmps+"%27,"+ConfigureTcDgvp.TimeOut+",%27ok%27,LOCALTIMESTAMP,%27"+ConfigureTcDgvp.Model+"%27) WHERE key="+ConfigureTcDgvp.Key+"",fncnone);
	}
	//----------------------------------------------------------------------------------------------------------------------------------------------------------------
	winList['TcHttpConf'].close();
}
