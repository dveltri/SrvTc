var Users;
var user={
key:0,
usr:"",
pass:"",
email:"",
permission:"",
lst:0,
status:""}
//=================================================
function InitUsers()
{
	winAdd("UsrsConf");
	winList["UsrsConf"].SetW(350+"px");
	winUdate();
}

function ShowtUsers()
{
	Rstuser();
	GetUrlB("./getitems.jsp?sql=SELECT key,usr,permission,status,lst,pass,email FROM users ORDER BY key",rcvUsers);
}

function Rstuser()
{
	user.key=0;
	user.usr="";
	user.permission="";
	user.status="";
	user.lst=0;
	user.pass="";
	user.email="";
}

function ModUsr(a)
{
	user.key=parseInt(Users[a][0]);
	user.usr=Users[a][1];
	user.permission=Users[a][2];
	user.status=Users[a][3];
	user.lst=parseInt(Users[a][4]);
	user.pass=Users[a][5];
	user.email=Users[a][6];
	document.getElementById("UsrsConfBody").innerHTML=ShowUsers(Users);
}

//=================================================
function rcvUsers(Datos)
{
	var tmp="";
	Datos=Datos.responseText;
	Datos=Datos.split("\n");
	RemoveUnusedItem(Datos);
	if(Datos.length==0)
		return "";
	for(var a=0;a<Datos.length;a++)
	{
		Datos[a]=Datos[a].split("\t");
		if(Datos[a].length<3)
			return "";
	}
	Users=Datos;
	if (winList['UsrsConf'])
	{
		winList['UsrsConf'].open();
		winList["UsrsConf"].SetH("325px");
		winAutoPos();
	}
	document.getElementById("UsrsConfTitle").innerHTML=Str_Config+" "+Str_User;
	document.getElementById("UsrsConfBody").innerHTML=ShowUsers(Users);
}

function UpDateUsr()
{
	user.permission="";
	var perm;
	perm=document.getElementsByName("permiss");
	for(var i=0;i<perm.length;i++)
	{
		if(perm[i].checked == true)
			user.permission+="%2F"+perm[i].value;
	}
	GetUrlB("./setitems.jsp?sql=UPDATE users SET usr=%27"+user.usr+"%27,pass=%27"+user.pass+"%27,email=%27"+user.email+"%27,permission=%27"+user.permission+"%27,status=%27"+user.status+"%27 WHERE key="+user.key+"",fncnone);
	ShowtUsers();
}

function AddUsr()
{
	user.permission="";
	var j=0;
	var len;
	if(user.usr!="" && user.pass!="")
	{
		len=document.getElementsByName("permiss").length;
		for(j=0;j<len;j++)
		{
			if(document.getElementsByName("permiss")[j].checked == true)
				user.permission+=document.getElementsByName("permiss")[j].value+"/";
		}
		//alert(user.usr+"\n"+user.pass+"\n"+user.permission);
		GetUrlB("./setitems.jsp?sql=INSERT INTO users (usr,pass,email,permission,status) VALUES (%27"+user.usr+"%27,%27"+user.pass+"%27,%27"+user.email+"%27,%27"+user.permission+"%27,%27new%27);",fncnone);
	}
	ShowtUsers();
}

function ShowUsers(Datos)
{
	var rtc=0;
	var out="";
	{
		out+=" <input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"winList['UsrsConf'].close();return false;\" />\n";
		out+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"100%\" style=\"border-collapse:collapse;border:2px solid #000000;\">\n";
		out+="	<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"center\">\n";
		out+="			<font size=\"1\" face=\"Verdana\">"+Str_Email+"</font>\n";
		out+="		</td>\n";
		out+="		<td align=\"center\">\n";
		out+="			<input class=\"INTEXT\" size=\"25\" maxlength=\"55\"  value=\""+user.email+"\" onkeyup=\"user.email=this.value;\" />\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		out+="	<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"center\">\n";
		out+="			<font size=\"1\" face=\"Verdana\">"+Str_User+"</font>\n";
		out+="		</td>\n";
		out+="		<td align=\"center\">\n";
		out+="			<input class=\"INTEXT\" id=\"usrnada\" size=\"15\" maxlength=\"5\"  value=\""+user.usr+"\" onkeyup=\"user.usr=this.value;\" />\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		out+="	<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"center\">\n";
		out+="			<font size=\"1\" face=\"Verdana\">"+Str_Passwords+"</font>\n";
		out+="		</td>\n";
		out+="		<td align=\"center\">\n";
		out+="			<input type=\"password\" id=\"pswnada\" class=\"INTEXT\" size=\"15\" maxlength=\"5\"  value=\""+user.pass+"\" onkeyup=\"user.pass=this.value;\" />\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		out+="	<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"center\">\n";
		out+="			<font size=\"1\" face=\"Verdana\">"+Str_Permission+"</font>\n";
		out+="		</td>\n";
		out+="		<td align=\"center\">\n";
		out+="			<font size=\"1\" face=\"Verdana\">"+Str_Admin+"</font>\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="			<input name=\"permiss\" type=\"checkbox\" value=\"users\"";
		if(user.permission.indexOf("users")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_User+"s\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"VarGroupsConf\"";
		if(user.permission.indexOf("VarGroupsConf")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_VarGroupsConf+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"VarGroupsList\"";
		if(user.permission.indexOf("VarGroupsList")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_VarGroupsList+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"StatisticConf\"";
		if(user.permission.indexOf("StatisticConf")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_Statistic+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"StatisticList\"";
		if(user.permission.indexOf("StatisticList")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_StatisticList+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"SchedulerAdmin\"";
		if(user.permission.indexOf("SchedulerAdmin")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_AdminScheduler+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"SchedulerFnc\"";
		if(user.permission.indexOf("SchedulerFnc")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_SchedulersFnc+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"GreenWave\"";
		if(user.permission.indexOf("GreenWave")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_GreenWave+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"httpdrv\"";
		if(user.permission.indexOf("httpdrv")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_DrvHttp+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"dgvpdrv\"";
		if(user.permission.indexOf("dgvpdrv")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_DrvDgvp+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"opctdrv\"";
		if(user.permission.indexOf("opctdrv")!=-1)
			out+="checked"
		out+=" disabled>";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_DrvOPCT+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"GLdrv\"";
		if(user.permission.indexOf("GLdrv")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_DrvGLD+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"utmcdrv\"";
		if(user.permission.indexOf("utmcdrv")!=-1)
			out+="checked"
		out+=" disabled>";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_DrvUTMC+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"MapAdmin\"";
		if(user.permission.indexOf("MapAdmin")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_MapItem+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"MapList\"";
		if(user.permission.indexOf("MapList")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_MapList+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"CtrlPlan\"";
		if(user.permission.indexOf("CtrlPlan")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_Force_Plan+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"ReportAdmin\"";
		if(user.permission.indexOf("ReportAdmin")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_Reports+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"FlowAdmin\"";
		if(user.permission.indexOf("FlowAdmin")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_Edit_Flow_Ctrl+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="	<tr align=\"left\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"right\">\n";
		out+="<input name=\"permiss\" type=\"checkbox\" value=\"FlowList\"";
		if(user.permission.indexOf("FlowList")!=-1)
			out+="checked"
		out+=">";
		out+="		</td>\n";
		out+="		<td align=\"left\">\n";
		out+=Str_List_Flow_Ctrl+"\n";
		out+="		</td>\n";
		out+="	</tr>\n";
		//----------------------------------
		out+="		</td>\n";
		out+="	</tr>\n";
		out+="	<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="		<td align=\"center\" colspan=\"2\">\n";
		if(user.key==0)
		{
			out+="			<input type=\"button\" value=\""+Str_Add+"\" onclick=\"AddUsr();return false;\" >\n";
		}
		else
		{
			out+="			<input type=\"button\" value=\""+Str_Save+"\"onclick=\"UpDateUsr();return false;\" >\n";
		}
		out+="		</td>\n";
		out+="	</tr>\n";
		out+="</table><br />\n";
	}
	//----------------------------------------------------------------------------
	{
		out+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"100%\" style=\"border-collapse:collapse;border:2px solid #000000;\">\n";
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="	</td>\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_User+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Permission+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Status+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_LTS+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	var bgcolor="";
	for(var a=0;a<Datos.length;a++)
	{
		((a%2)==0?bgcolor="#E0E0E0":bgcolor="#C0C0C0")
		//---------------------------------------------------------------------
		out+="<tr bgcolor=\""+bgcolor+"\" align=\"center\" class=\"bottom top\" >\n";
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"ModUsr("+a+");return false;\">\n";
		out+="		<img src=\"../img/efile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		//--------------------
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Datos[a][1]+"</font>\n";
		out+="	</td>\n";
		//--------------------
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Datos[a][2]+"s</font>\n";
		out+="	</td>\n";
		//--------------------
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Datos[a][3]+"</font>\n";
		out+="	</td>\n";
		//--------------------
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Datos[a][4]+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"GetUrlB('./setitems.jsp?sql=DELETE FROM users WHERE key="+Datos[a][0]+"',fncnone);ShowtUsers();\">\n";
		out+="		<img src=\"../img/defile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	out+="</table>\n";
	return out;
}
//=================================================
