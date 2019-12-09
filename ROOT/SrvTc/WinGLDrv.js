var Datos;
var GLD={
key:0,
refresh:60,
drv:"drv1",
id:"Name",
lsu:0,
mode:"pool",
gldkey:"https://developers.google.com/maps/documentation/distance-matrix/get-api-key",
status:"ok"
};

function GetListGLD()
{
	GetUrlB("./getitems.jsp?sql=SELECT * FROM googledrv",rcvGLDList);
}

//---------------------------------------------------------------------------------------------------------------------------------------
function rcvGLDList(Dato)
{
	Datos=rcvtbl(Dato);
	if (winList["List"])
	{
		winList["List"].open();
		winList["List"].SetH((4+25+(Datos.length*50))+"px");
		winList["List"].SetW(500+"px");
	}
	document.getElementById("ListTitle").innerHTML=Str_GLDList;
	document.getElementById("ListBody").innerHTML=ShowGLDList(Datos);
}
function ShowGLDList(Datos)
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
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Refresh_Time+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Driver+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Ident+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_LTU+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Mode+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Status+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_GLDKey+"</font>\n";
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
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"EditGLDConf("+y+");\">\n";
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
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Datos[y][6]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Datos[y][7]+"</font>\n";
			out+="	</td>\n";
		}
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"GetUrlB('./setitems.jsp?sql=DELETE FROM googledrv WHERE key="+Datos[y][0]+"',fncnone);GetUrlB('./getlist.jsp?cmps=*&tbl=googledrv&ord=key',rcvGLDList);\">\n";
		out+="		<img src=\"../img/defile.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		out+="</tr>\n";
		y++;
	}
	//---------------------------------------------------------------------
	out+="</table>\n";
	return out;
}

function EditGLDConf(y)
{
	if (winList['TcHttpConf'])
	{
		winList['TcHttpConf'].open();
		winList["TcHttpConf"].SetH("100px");
	}
	document.getElementById("TcHttpConfTitle").innerHTML=Str_Config;
	document.getElementById("TcHttpConfBody").innerHTML=ShowGLDConf(y);
}
function ShowGLDConf(y)
{
	var idx=y;
	if(y==-1)
	{
		GLD.key=-1;
		GLD.refresh=60;
		GLD.drv="drv";
		GLD.id="Name";
		GLD.lsu=0;
		GLD.mode="pool";
		GLD.status="ok";
		GLD.gldkey="https://developers.google.com/maps/documentation/distance-matrix/get-api-key";
	}
	else
	{
		GLD.key=Datos[y][0];
		GLD.refresh=Datos[y][1];
		GLD.drv=Datos[y][2];
		GLD.id=Datos[y][3];
		GLD.lsu=Datos[y][4];
		GLD.mode=Datos[y][5];
		GLD.status=Datos[y][6];
		GLD.gldkey=Datos[y][7];
	}
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
		out+="		ID<input class=\"INTEXT\" size=\"10\" maxlength=\"15\"  value=\""+GLD.id+"\" onkeyup=\"GLD.id=this.value;\" />\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Refresh_Time+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<input class=\"INTEXT\" size=\"5\" maxlength=\"5\"  value=\""+GLD.refresh+"\" onkeyup=\"GLD.refresh=this.value;\" />\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}// */
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_GLDKey+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<input class=\"INTEXT\" size=\"40\" maxlength=\"60\"  value=\""+GLD.gldkey+"\" onkeyup=\"GLD.gldkey=this.value;\" />\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}// */
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">Drv</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="<select class=\"INTEXT\" id=\"SelectDrv\" onchange=\"GLD.drv=this.value;\" >\n";
		out+=GenOptionsV(OptDrv,GLD.drv);
		out+="</select>\n"
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	out+="</table>\n";
	if(y==-1)
	{
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Add+"\" onclick=\"UpDtGLDConf();return false;\" />\n";
	}
	else
	{
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_save+"\" onclick=\"UpDtGLDConf();return false;\" />\n";
	}
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Cancel+"\" onclick=\"winList['TcHttpConf'].close();return false;\" />\n";
	return out;
}

function UpDtGLDConf()
{
	if(GLD.key==-1)
	{
		GetUrlB("./setitems.jsp?sql=INSERT INTO googledrv (drv,refresh,id,action,gldkey,lstchg) VALUES (%27"+GLD.drv+"%27,"+GLD.refresh+",%27"+GLD.id+"%27,%27"+GLD.mode+"%27,%27"+GLD.gldkey+"%27,LOCALTIMESTAMP)",fncnone);
		GetUrlB("./setitems.jsp?sql=INSERT INTO variables (id,lstchg,typ,usrwrite) VALUES (\'%2FGLD%2F"+GLD.id+"%2Fvalue\',LOCALTIMESTAMP,'IntR','GLD."+GLD.id+"')",fncnone);
	}
	else
	{
		GetUrlB("./setitems.jsp?sql=UPDATE googledrv SET (drv,refresh,id,action,gldkey,lstchg)%3D(%27"+GLD.drv+"%27,"+GLD.refresh+",%27"+GLD.id+"%27,%27"+GLD.mode+"%27,%27"+GLD.gldkey+"%27,LOCALTIMESTAMP) WHERE key="+GLD.key+"",fncnone);
		GetUrlB("./setitems.jsp?sql=INSERT INTO variables (id,lstchg,typ,usrwrite) VALUES (\'%2FGLD%2F"+GLD.id+"%2Fvalue\',LOCALTIMESTAMP,'IntR','GLD."+GLD.id+"')",fncnone);
	}
	//----------------------------------------------------------------------------------------------------------------------------------------------------------------
	winList['TcHttpConf'].close();
}
