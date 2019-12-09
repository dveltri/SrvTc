var TVars=new Array();

var OptVarTyp=["IntR",Str_Integer+" "+Str_OREAD,
		"IntW",Str_Integer+" "+Str_Writable,
		"StrR",Str_String+" "+Str_OREAD,
		"StrW",Str_String+" "+Str_Writable];

function InitList()
{
	//-------------------------------------------
	winAdd("List");
	winUdate();
}
//=================================================
function FindInLevel(vt,item)
{
	for(var a=0;a<vt.length;a++)
	{
		if(vt[a].name==item)
			return a;
	}
	return -1;
}

function updTVar(TV,flt,typ)
{
	var idx;
	var vt;
	var vt2;
	tVars=owl.deepCopy(TV);
	for(var a=0;a<tVars.length;a++)
	{
		if((flt=="" || tVars[a][0].indexOf(flt)!=-1))// || (typ!="" && tVars[a][3].indexOf(typ)!=-1))
		{
			tVars[a][0]=tVars[a][0].split("/");
			RemoveUnusedItem(tVars[a][0]);
		}
		else
		{
			tVars.splice(a,1);
			a--;
		}
	}
	for(var a=0;a<tVars.length;a++)
	{
		vt=tVars[a][0];
		vt2=TVars;
		for(var b=0;b<vt.length;b++)	//para cada nombre
		{
			idx=FindInLevel(vt2,vt[b]);
			if(idx==-1)
			{
				idx=vt2.length;
				vt2[idx]=new Object();
				vt2[idx].name=owl.deepCopy(vt[b]);
				if(b<(vt.length-1))
					vt2[idx].val=new Array();
				else
				{
					vt2[idx].val=owl.deepCopy(tVars[a][1]);
					vt2[idx].date=owl.deepCopy(tVars[a][2]);
					vt2[idx].type=owl.deepCopy(tVars[a][3]);
				}
			}
			if(Array.isArray(vt2[idx].val)==true)
			vt2=vt2[idx].val;
		}
	}
	
}

function rcvList(Datos)
{
	var rows=0;
	var cols=0;
	Datos=Datos.responseText;
	Datos=Datos.split("\n");
	RemoveUnusedItem(Datos);
	rows=Datos.length;
	if(Datos.length==0)
		return "";
	for(var a=0;a<Datos.length;a++)
	{
		Datos[a]=Datos[a].split("\t");
		if(Datos[a].length>cols)
			cols=Datos[a].length;
	}
	VarTree.length=0;
	VarTree=owl.deepCopy(Datos);
	if(winList["List"])
	{
		winList["List"].SetW("800px");
		ShowList(cols);
	}
}

function OpenList()
{
	if(winList["List"])
	{
		winList["List"].SetH(600);//(4+15+(Datos.length*22))+"px");
		winList["List"].open();
		winAutoPos();
	}
	if(document.getElementById("ListTitle"))
		document.getElementById("ListTitle").innerHTML=Str_ListVariables;
}

function AdmVname(obj)
{
	var out="";
	out+="<font size=\"1\" face=\"Verdana\">Administrar Variable</font>\n<br />";
	if(obj.type!="undefined")
	{
		//-----------------------------------
		out+="<font size=\"1\" face=\"Verdana\"> "+Str_Name+" </font>\n";
		out+="<font size=\"1\" face=\"Verdana\"> "+obj.name+" </font><br />\n";
		//-----------------------------------
		if(obj.type.indexOf("0")!=-1)
			obj.type="StrR";
		if(obj.type.indexOf("w")!=-1)
			obj.type="StrW";
		out+="<font size=\"1\" face=\"Verdana\"> "+Str_Type+" </font>\n";
		out+="<select id=\"AdmVarType\" class=\"INTEXT\" onchange=\"if(this.value!=''){}\" >\n";
		out+=GenOptionsV(OptVarTyp,obj.type);
		out+="</select><br />\n";
		//-----------------------------------
		out+="<font size=\"1\" face=\"Verdana\"> "+Str_Value+" </font>\n";
		out+="<input id=\"AdmVarValue\" type=\"text\" class=\"INTEXT\" value=\""+obj.val+"\" size=\"20\" maxlength=\"64\" />\n<br />";
		//-----------------------------------
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Save+"\" onclick=\"AdmModVar(\
		{name:'"+obj.name+"',val:document.getElementById('AdmVarValue').value,type:document.getElementById('AdmVarType').value})\" />\n<br />";
	}
	else
	{
		obj.name+="/";
		//-----------------------------------
		out+="<font size=\"1\" face=\"Verdana\"> "+Str_Add+" </font>\n";
		out+="<input id=\"AdmVarName\" type=\"text\" class=\"INTEXT\" value=\""+obj.name+"\" size=\"20\" maxlength=\"64\" />\n<br />";
		//-----------------------------------
		out+="<font size=\"1\" face=\"Verdana\"> "+Str_Type+" </font>\n";
		out+="<select id=\"AdmVarType\" class=\"INTEXT\" onchange=\"if(this.value!=''){}\" >\n";
		out+=GenOptions(OptVarTyp,"");
		out+="</select><br />\n";
		//-----------------------------------
		out+="<font size=\"1\" face=\"Verdana\"> "+Str_Value+" </font>\n";
		out+="<input id=\"AdmVarValue\" type=\"text\" class=\"INTEXT\" value=\"\" size=\"20\" maxlength=\"64\" />\n<br />";
		//-----------------------------------
		out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Save+"\" onclick=\"AdmAddVar(\
		{name:document.getElementById('AdmVarName').value,val:document.getElementById('AdmVarValue').value,type:document.getElementById('AdmVarType').value})\" />\n<br />";
	}
	//-----------------------------------
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Del+"\" onclick=\"AdmDelVar({name:'"+obj.name+"'})\" />\n<br />";
	showFlyMnu(obj.evt,{idx:1234567,HTML:out,TimeOut:0});
}
function AdmModVar(obj)
{
		GetUrlB("./setitems.jsp?sql=UPDATE variables SET (id,value,typ,lstchg)%3D(\'"+obj.name+"\',\'"+obj.val+"\',\'"+obj.type+"\',LOCALTIMESTAMP)%20WHERE%20id%3D%27"+obj.name+"%27",fncnone);
		hideFlyMnu();
		//GetUrlB('./getitems.jsp?sql=SELECT * FROM variables order by id',rcvList);
		setTimeout('ShowList()',500);
}
function AdmAddVar(obj)
{
		GetUrlB("./setitems.jsp?sql=INSERT INTO variables (id,value,typ,lstchg) VALUES (\'"+obj.name+"\',\'"+obj.val+"\',\'"+obj.type+"\',LOCALTIMESTAMP)",fncnone);
		hideFlyMnu();
		//GetUrlB('./getitems.jsp?sql=SELECT * FROM variables order by id',rcvList);
		setTimeout('ShowList()',500);
}
function AdmDelVar(obj)
{
		GetUrlB("./setitems.jsp?sql=DELETE FROM variables WHERE id LIKE %27"+obj.name+"%25%27",fncnone);
		hideFlyMnu();
		//GetUrlB('./getitems.jsp?sql=SELECT * FROM variables order by id',rcvList);//rcvFastSts
		setTimeout('ShowList()',500);
}

function ShowList(cols)
{
	var out="";
	TVars.length=0;
	updTVar(owl.deepCopy(VarTree),"","");
	out+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"100%\" >\n";
	out+="<tr align=\"center\">\n";	
	out+="	<td valign=\"top\" align=\"left\" width=\"50%\" >\n";
	out+=getTree(TVars,"AdmVname");	//AdmVname
	out+="	</td>\n";
	out+="	<td align=\"left\">\n";
	out+=ShowList2(VarTree,0,cols);
	out+="	</td>\n";
	out+="</tr>\n";
	out+="</table>\n";
	if(document.getElementById("ListBody"))
	{
		document.getElementById("ListBody").innerHTML=out;
		CollapsibleLists.applyTo(document.getElementById("VarTree"));
	}
	return out;
}

function getObjli(obj,fnc,lstnm)
{
	var out="";
	out+="<li>\n";
	lstnm+="/"+obj.name;
	if(obj.type)
	{
		if(fnc!=null)
			out+="<a href=\"\" onclick=\""+fnc+"({name:'"+lstnm+"',val:'"+obj.val+"',type:'"+obj.type+"',date:'"+obj.date+"',evt:event});return false\">";
		out+=obj.name;
		if(fnc!=null)
			out+="</a>";
	}
	else
	{
		if(fnc!=null)
			out+="<a href=\"\" onclick=\""+fnc+"({name:'"+lstnm+"',val:'"+obj.val+"',type:'"+obj.type+"',date:'"+obj.date+"',evt:event});return false\">";
		out+=obj.name;
		if(fnc!=null)
			out+="</a>";
		out+="<ul>\n";
		for(var a=0;a<obj.val.length;a++)
		{
			out+=getObjli(obj.val[a],fnc,lstnm);
		}
		out+="</ul>\n";
	}
	out+="</li>\n";
	return out
}

function getTree(vct,fnc)
{
	var out="";
	var idx;
	var vt2;
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Cancel+"\" onclick=\"winList['List'].close();return false;\" />\n";
	out+="<div id=\"VarTree\" name=\"VarTree\">";
	out+="<font size=\"1\" face=\"Verdana\">";
	out+="<ul id=\"VarsList\">\n";
	//---------------------------------------------------------------
	for(var a=0;a<vct.length;a++)
	{
		out+=getObjli(vct[a],fnc,"");
	}
	//---------------------------------------------------------------
	out+="</ul>\n</font><br />\n";
	out+="</div>";
	return out;
}

function ShowList2(Datos,rows,cols)
{
	var bgcolor="";
	var x=0;
	var out="";
	//---------------------------------------------------------------------
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"winList['List'].close();return false;\" />\n";
	out+="<table border=\"1\" cellpadding=\"1\" cellspacing=\"1\" align=\"center\" background=\"\" style=\"border-collapse:collapse;border:0px solid #000000;\">\n";
	/* //
	out+="<tr align=\"center\" bgcolor=\"#EEEEEE\">\n";
	for(var y=0;y<Datos.length;y++)
	{
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">";
		out+="";
		out+="		</font>\n";
		out+="	</td>\n";
	}
	out+="</tr>\n";
	// */
	//--------------------
	for(var y=0;y<Datos.length;y++)
	{
		if((y%2)==0)
			bgcolor="#808080";
		else
			bgcolor="#A0A0A0";
		//--------------------
		out+="<tr bgcolor=\""+bgcolor+"\" class=\"bottom top\" align=\"center\" >\n";
		out+="	<td align=\"left\" valign=\"middle\">\n";
		out+="		<a href=\"\" onclick=\"GetUrlB('./setitems.jsp?sql=DELETE FROM variables WHERE id LIKE %27"+Datos[y][0]+"%27',fncnone);GetUrlB('./getitems.jsp?sql=SELECT * FROM variables order by id',rcvList);return false;\">";
		out+="		<img src=\"../img/error1.jpg\" width=\"18\" height=\"18\" border=\"0\" />\n";
		out+="		</a>\n";
		out+="	</td>\n";
		//--------------------
		x=0;
		while(x<Datos[y].length)
		{
			out+="	<td align=\"left\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+Datos[y][x]+"</font>\n";
			out+="	</td>\n";
			x++;
		}
		while(x<cols)
		{
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">-</font>\n";
			out+="	</td>\n";
			x++;
		}
		//--------------------
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	out+="</table>\n";
	return out;
}
//=================================================
