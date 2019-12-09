var GWsList=[];
var Conf="";
//---------------------------------------------------------------
function ShowGWConf(rxConf)
{
	var out="";
	{
		if(rxConf!="")
		{
			Conf=rxConf.split('\t');
			Conf[3]=Conf[3].split(' ');
			for(var i=0;i<Conf[3].length;i++)
			{
				Conf[3][i]=Conf[3][i].split(',');
			}
		}
		else
		{
			if(Conf=="")
			{
				Conf=new Array();
				Conf[0]=-1;
				Conf[1]="OndaVerde1";
				Conf[2]=60;
				Conf[3]=new Array();
			}
		}
		out+="<input class=\"INTEXT\" id=\"GWId\" size=\"15\" maxlength=\"80\"  value=\""+Conf[1]+"\" /><br/>\n";
		out+="<input class=\"INTEXT\" id=\"GWSpeed\" size=\"3\" maxlength=\"3\"  value=\""+Conf[2]+"\" /><br/>\n";
		out+="<select class=\"INTEXT\" id=\"IdVar\" onchange=\"if(this.value!=''){Conf[3].push([this.value,100]);ShowGWConf('"+rxConf+"');};\" >\n";
		out+="<option value=\"\" ></option>\n";
		for(var i=0;i<VarTree.length;i++)
		{
			if(VarTree[i][3].indexOf("w")!=-1 || VarTree[i][3].indexOf("W")!=-1)
			{
				out+="<option value=\""+VarTree[i][0]+"\"";
				//if(key>=0)if(VarTree[i][0]==VGsDt[key][1])out+=" selected=\"selected\"";
				out+=">"+VarTree[i][0]+"</option>\n";
			}
		}
		out+="</select><br/>\n";
		for(var i=0;i<Conf[3].length;i++)
		{
			out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Del+":";
			out+=Conf[3][i][0];
			out+="\" onclick=\"ConfigureTcDgvp.cmps.splice("+i+",1);RefreshDgvpConf();return false;\" /> ";
			out+="<input class=\"INTEXT\" id=\"GWDist"+i+"\" size=\"4\" maxlength=\"4\"  value=\""+Conf[3][i][1]+"\" /><br/>\n";			
		}
		if(rxConf!="")
		{
			out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Del+"\" onclick=\"return false;\" />\n";
			out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Save+"\" onclick=\"return false;\" />\n";
		}
		else
		{
			out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Add+"\" onclick=\"Conf='';return false;\" />\n";
		}
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"Conf='';winList['List'].close();return false;\" />\n";
	}
	if(winList["WinConf"])
	{
		winList["WinConf"].open();
		winList["WinConf"].SetH("720px");
		winList["WinConf"].SetW("824px");
	}
	//winList["WinConf"].FixSize(0);
	//winList["WinConf"].SetX(1010);
	document.getElementById("WinConfTitle").innerHTML=Str_GreenWave;
	document.getElementById("WinConfBody").innerHTML=out;
	return out;
}
function GetGreenWaveList()
{
	GetUrlB("./getitems.jsp?sql=SELECT * FROM greenwaves order by id desc",RcvGWsLst);
}
function RcvGWsLst(Datos)
{
	GWsList.length=0;
	GWsList=rcvtbl(Datos);
	if (winList["List"])
	{
		winList["List"].open();
		if(!GWsList.length)
		winList["List"].SetH((70+(GWsList.length*40))+"px");
		winList["List"].SetW("500px");
	}
	document.getElementById("ListTitle").innerHTML=Str_GreenWaveList;
	document.getElementById("ListBody").innerHTML=ShwGWsLst(GWsList);
}

function ShwGWsLst(GWsList)
{
	var x=0;
	var y=0;
	var bgcolor="";
	var out="";
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
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Speed+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_ListVariables+"</font>\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	y=0;
	while(y<GWsList.length)
	{
		if((y%2)==0)
			bgcolor="#808080";
		else
			bgcolor="#A0A0A0";
		out+="<tr align=\"center\" bgcolor=\""+bgcolor+"\" >\n";
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"ShowGWConf(VGsDt["+y+"].join('\t'));return false;\">\n";
		out+="		<img src=\"../img/Ed.png\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		{//----------------------------------------------------------------------
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+GWsList[y][1]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+GWsList[y][2]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+GWsList[y][3]+"</font>\n";
			out+="	</td>\n";
		}//----------------------------------------------------------------------
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"GetUrlB('./setitems.jsp?sql=DELETE FROM greenwaves WHERE key%3D"+GWsList[y][0]+"',GetGreenWaveList);\">\n";
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
function AddGW(GWid,GWSpeed,GWDat)
{
	GetUrlB("./setitems.jsp?sql=INSERT INTO greenwaves (id,speed,dat) VALUES (%27"+GWid+"%27,%27"+GWSpeed+"%27,%27"+GWDat+"%27)",GetGreenWaveList);
}
function UpDtGW(key,GWid,GWSpeed,GWDat)
{
	GetUrlB("./setitems.jsp?sql=UPDATE greenwaves SET (id,speed,dat)%3D(%27"+GWid+"%27,%27"+GWSpeed+"%27,%27"+GWDat+"%27)%20WHERE%20key%3D%27"+Key+"%27",GetGreenWaveList);
}
//---------------------------------------------------------------------------------------
