var VGsOpt;
var VGsDt;
var VGsWinTyp=0;
//---------------------------------------------------------------
function GetVGsConf()
{
	VGsWinTyp=1;
	VGsOpt=0;
	GetUrlB("./getitems.jsp?sql=SELECT id,id FROM vargroup GROUP by id order by id desc",rcvVGsConf);
}
function rcvVGsConf(Datos)
{
	VGsOpt=rcvtbl(Datos);
	GetVGsList(0);
}
function GetVGsList(id)
{
	var sql="";
	sql+="./getitems.jsp?sql=SELECT * FROM vargroup ";
	if(id!=0)
		sql+="WHERE id LIKE '"+id+"' ";
	sql+="order by id desc";
	GetUrlB(sql,rcvVGsLstShw);
}
function rcvVGsLstShw(Datos)
{
	VGsDt=rcvtbl(Datos);
	if (winList["List"])
	{
		winList["List"].open();
		if(!VGsDt.length)
			VGsDt= new Array();
		winList["List"].SetH((70+(VGsDt.length*40))+"px");
		winList["List"].SetW("500px");
	}
	document.getElementById("ListTitle").innerHTML=Str_VarGroups;
	document.getElementById("ListBody").innerHTML=ShowVGsLstShw(0);
}
function ShowVGsLstShw(key)
{
	var x=0;
	var y=0;
	var bgcolor="";
	var out="";
	if(VGsWinTyp==1)
	{
		out+="<input class=\"INTEXT\" id=\"GrpId\" size=\"15\" maxlength=\"80\"  value=\"\" />\n";
		out+="<select class=\"INTEXT\" id=\"IdVar\" >\n";
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
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Add+"\" onclick=\"AddVG();return false;\" />\n";
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"winList['List'].close();return false;\" />\n";
	}
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
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_ListVariables+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	y=0;
	while(y<VGsDt.length)
	{
		if((y%2)==0)
			bgcolor="#808080";
		else
			bgcolor="#A0A0A0";
		out+="<tr align=\"center\" bgcolor=\""+bgcolor+"\" >\n";
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"EndDate='"+VGsDt[y][3]+"';StartDate='"+VGsDt[y][2]+"';GetIOs('"+VGsDt[y][0]+"');return false;\">\n";
		out+="		<img src=\"../img/Graficos.jpg\" width=\"18\" height=\"18\" border=\"0\" />";
		out+="	</td>\n";
		{
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+VGsDt[y][0]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+VGsDt[y][1]+"</font>\n";
			out+="	</td>\n";
		}
		out+="	<td align=\"center\" valign=\"middle\" onclick=\"GetUrlB('./setitems.jsp?sql=DELETE FROM vargroup WHERE id LIKE %27"+VGsDt[y][3]+"%27',fncnone);GetIOsList();\">\n";
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
function DelVG(key)
{
	GetUrlB("./setitems.jsp?sql=DELETE FROM vargroup WHERE key%3D"+key+"",fncnone);
	GetVGsConf();
}
function AddVG()
{
	if(document.getElementById("GrpId").value=="")
		return;
	if(document.getElementById("IdVar").value=="")
		return;
	GetUrlB("./setitems.jsp?sql=INSERT INTO vargroup (id,var) VALUES (%27"+document.getElementById("GrpId").value+"%27,%27"+document.getElementById("IdVar").value+"%27)",fncnone);
	GetVGsConf();
}
//---------------------------------------------------------------------------------------
function OptTime()
{
		var out="";
		var d1=(24*60);
    var n = new Date();
    n = n.toLocaleTimeString();
    n=n.split(':');
    n[0]=parseInt(n[0]);
    n[1]=parseInt(n[1])+7;
    n[1]-=(n[1]%5);
		if(n[1]>=60)
		{
			n[1]-=60;
			n[0]++;
			n[0]%=24;
		}
  	for(var h=0;h<24;h++)
    {
      for(var m=0;m<60;m+=5)
      {
      	if(((h*60)+m)>=((n[0]*60)+n[1]))
					d1=0;
				out+="<option value=\""+(d1+(h*60)+m)+"\"";
      	if(h==n[0] && m==n[1])
					out+= " selected=\"selected\" ";
				out+=" >"+("0"+h).slice(-2)+":"+("0"+m).slice(-2)+":00";
				if(d1)
					out+=" +1D";
				out+="</option>\n";
			}
		}
    return out;
}

function OptTime2()
{
		var out="";
		var d1=1;
    var d = new Date();
		var n;
		var t;
    n = d.toLocaleTimeString();
    n=n.split(':');
    n[0]=parseInt(n[0]);
    n[1]=parseInt(n[1])+7;
    n[1]-=(n[1]%5);
		if(n[1]>=60)
		{
			n[1]-=60;
			n[0]++;
			n[0]%=24;
		}
  	for(var h=0;h<24;h++)
    {
      for(var m=0;m<60;m+=5)
      {
      	if(((h*60)+m)>=((n[0]*60)+n[1]))
					d1=0;
				t=new Date(d.getFullYear()+"/"+(d.getMonth()+1)+"/"+(d.getDate()+d1)+" "+("0"+h).slice(-2)+":"+("0"+m).slice(-2)+":00");
				out+="<option value=\""+t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+("0"+h).slice(-2)+":"+("0"+m).slice(-2)+":00"+"\"";
      	if(h==n[0] && m==n[1])
					out+= " selected=\"selected\" ";
				out+=" >"+("0"+h).slice(-2)+":"+("0"+m).slice(-2)+":00";
				if(d1)
					out+=" +1D";
				out+="</option>\n";
			}
		}
    return out;
}
//---------------------------------------------------------------------------------------
function FrcPlnShow()
{
	GetUrlB("./getlist.jsp?cmps=id&tbl=schedulerfnc&grp=id&ord=id",FrcPlnShow2);
}
function FrcPlnShow2(Datos)
{
	Datos=Datos.responseText;
	Datos=replaceAll(Datos,"\n","\t");
	Datos=Datos.split("\t");
	RemoveUnusedItem(Datos);
	OptGrp=Datos;
	if (winList["List"])
	{
		winList["List"].open();
		winList["List"].SetH(50+"px");
		winList["List"].SetW("500px");
	}
	document.getElementById("ListTitle").innerHTML=Str_Force_Plan;
	document.getElementById("ListBody").innerHTML=FrcPlnCode();
}
function FrcPlnCode()
{
	var x=0;
	var y=0;
	var bgcolor="";
	var out="";
	{
		out+="<table border=\"1\" cellpadding=\"2\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"100%\" style=\"border-collapse:collapse;border:2px solid #000000;\">\n";
		//--------------------------
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\" >\n";
		out+="<td align=\"center\" valign=\"middle\">\n";
		out+=Str_VarGroupsList;
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\" rowspan=\"1\">\n";
		out+=Str_Plan;
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\" rowspan=\"1\">\n";
		out+=Str_GP_Time_Force;
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\" rowspan=\"1\">\n";
		out+="</td>\n";
		out+="</tr>\n";
		//--------------------------
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\" >\n";
		out+="<td align=\"center\" valign=\"middle\">\n";
		out+="<select class=\"INTEXT\" id=\"FrcIdVar\" >\n";
		out+="<option value=\"\" ></option>\n";
		for(var i=0;i<OptGrp.length;i++)
		{
			out+="<option value=\""+OptGrp[i]+"\">"+OptGrp[i]+"</option>\n";
		}
		/*for(var i=0;i<VarTree.length;i++)
		{
			if(VarTree[i][3].indexOf("w")!=-1 || VarTree[i][3].indexOf("W")!=-1)
			{
				out+="<option value=\""+VarTree[i][0]+"\">"+VarTree[i][0]+"</option>\n";
			}
		}*/
		out+="</select><br/>\n";
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\" rowspan=\"1\">\n";
		//out+="<input class=\"INTEXT\" id=\"FrcPlan\" size=\"15\" maxlength=\"15\"  value=\"\" />\n";
		out+="<select class=\"INTEXT\" id=\"FrcPlan\" >\n";
		out+=GenOptionsV(OptFrcPln,0);
		out+="<option value=\"\" ></option>\n";
		out+="</select><br/>\n";
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\">\n";
		out+="<select class=\"INTEXT\" id=\"FrcTime\" >\n";
		out+=OptTime2();
		out+="</select><br/>\n";
		out+="</td>\n";
		out+="<td align=\"center\" valign=\"middle\" rowspan=\"1\">\n";
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Force_Plan+"\" onclick=\"FrcPlanCmd();return false;\" />\n";
		out+="</td>\n";
		out+="</tr>\n";
		//--------------------------
		out+="</table>\n";
	}
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\"  onclick=\"document.getElementById('FrcPlan').value=0;winList['List'].close();return false;\" />\n"; //FrcPlanCmd();
	return out;
}
function FrcPlanCmd()
{
	var frcplan=parseInt(document.getElementById("FrcPlan").value);
	document.getElementById("FrcPlan").value=frcplan;
	if(document.getElementById("FrcIdVar").value=="")
		return;
	GetUrlB("./ForceDrv.jsp?var="+document.getElementById("FrcIdVar").value+"&val="+frcplan+"&time="+document.getElementById("FrcTime").value+"",fncnone);
}
