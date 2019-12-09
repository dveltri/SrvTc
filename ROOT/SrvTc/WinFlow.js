var FlowKey=0;
var FlowName="";
var Code="";
var FlowList;
var FlwRqst=-1;

//var FlowSts=["Edit"	,"Ed.png"	,"Check","EdChk.png","Running","Run.gif","Stop","Stop.jpg","Error"	,"Er.png"];
//var FlowCmd=["Check(",Str_Check,"Play(",Str_Run		,"Play("	,Str_Run,"Stop(",Str_Stop ,"Edit(",Str_Edit];
var FlowSts=	["Edit"			,"Check"			,"Checking"			,"Start"		,"Running"		,"Paused"		,"Stoped"		,"Error"		,"Stop"		];
var FlowStsTxt=	[Str_Edit		,Str_Checking+".."	,Str_Checking+".."	,Str_Checked	,Str_Running	,Str_Paused		,Str_Stoped		,Str_Error		,Str_Stop	];
var FlowStsIco=	["Ed.png"		,"Ed.png"			,"Ed.png"			,"EdChk.png"	,"Run.gif"		,"Stop.jpg"		,"Stop.jpg"		,"Er.png"		,"Stop.jpg"	];
var FlowCmdTxt=	[Str_Check		,Str_Edit			,Str_Edit   		,Str_Run		,Str_Pause		,Str_Run		,Str_Start 		,Str_Edit		,Str_Start	];
var FlowCmd=	["CheckFlow("	,"GetFlow("			,"GetFlow("			,"PlayFlow("	,"PauseFlow("	,"PlayFlow("	,"StartFlow("	,"GetFlow("		,""			];
//------------------------
var DataPlan= new Array();
//------------------------
//var Funciones= new Array();
//var retornos= new Array();
//------------------------
var Variables= new Array();
var Etiquetas= new Array();
//var Labels= new Array();
//var saltos= new Array();
//------------------------
var insttable=[
 {OPC:0,Nombre:"Iguala"									,Valor:"mov"		,Args:[Variables,Variables]},
 {OPC:0,Nombre:"Suma"										,Valor:"add"		,Args:[Variables,Variables]},
 {OPC:0,Nombre:"Resta"									,Valor:"sub"		,Args:[Variables,Variables]},
 {OPC:0,Nombre:"And logico"							,Valor:"and"		,Args:[Variables,Variables]},
 {OPC:0,Nombre:"Xor logico"							,Valor:"xor"		,Args:[Variables,Variables]},
 {OPC:0,Nombre:"Or logico"							,Valor:"or"			,Args:[Variables,Variables]},
 {OPC:0,Nombre:"Not logico"							,Valor:"not"		,Args:[Variables]},
 {OPC:0,Nombre:"Multiplicacion"					,Valor:"mul"		,Args:[Variables,Variables]},
 {OPC:0,Nombre:"Divicion"								,Valor:"div"		,Args:[Variables,Variables]},
 {OPC:0,Nombre:"Compara si es igual"		,Valor:"=="			,Args:[Variables,Variables,";ELSE;FI"]},
 {OPC:0,Nombre:"Compara si es diferente",Valor:"!="			,Args:[Variables,Variables,";ELSE;FI"]},
 {OPC:0,Nombre:"Compara si es mayor"		,Valor:">"			,Args:[Variables,Variables,";ELSE;FI"]},
 {OPC:0,Nombre:"Compara si es menor"		,Valor:"<"			,Args:[Variables,Variables,";ELSE;FI"]},
 {OPC:0,Nombre:"Llamar a la funcion"		,Valor:"call"		,Args:[Etiquetas]},
 {OPC:0,Nombre:"Retorno de Funcion"			,Valor:"return"	,Args:null}];

 /*
{OPC:0,Nombre:"Termina el Script"			,Valor:"end"		,Args:null}];
{OPC:0,Nombre:"Mientras sea igual"			,Valor:"whl=="	,Args:[Variables,Variables]},
{OPC:0,Nombre:"Mientras sea diferente"	,Valor:"whl!="	,Args:[Variables,Variables]},
{OPC:0,Nombre:"Mientras sea mayor"			,Valor:"whl>"		,Args:[Variables,Variables]},
{OPC:0,Nombre:"Mientras sea menor"			,Valor:"whl<"		,Args:[Variables,Variables]},
{OPC:0,Nombre:"Condicion opuesta"				,Valor:"ELSE"		,Args:null},
{OPC:0,Nombre:"Fin Condicion"						,Valor:"FI"	,Args:null},
{OPC:0,Nombre:"Fin Bucle"								,Valor:"ENDW"		,Args:null},
*/

function InitAutoRefreshFlowLs()
{
	if(FlwRqst!=-1)
		return;
	//-------------------------------------------
	FlwRqst=Reqest.length;
	Reqest[FlwRqst]= new Object();
	Reqest[FlwRqst].Name="Logic";
	Reqest[FlwRqst].Url="./getitems.jsp?sql=SELECT * FROM logics order by key desc";
	Reqest[FlwRqst].Fnc=rcvFlowLstShw;
	Reqest[FlwRqst].Status=0;
	Reqest[FlwRqst].Refresh=1000;
	Reqest[FlwRqst].LstRqst=0;
	GetFlowList();
}
//---------------------------------------------------------------
function GetFlowList(nada)
{
	var sql="";
	sql+="./getitems.jsp?sql=SELECT * FROM logics order by key desc";
	GetUrlB(sql,rcvFlowLstShw);
}

function rcvFlowLstShw(Datos)
{
	FlowList=rcvtbl(Datos);
	if (winList["List"])
	{
		winList["List"].open();
		winList["List"].SetH((50+(FlowList.length*45))+"px");
		winList["List"].SetW("824px");
	}
	winList["WinConf"].FixSize(0);
	var hora = new Date();
	document.getElementById("ListHora").innerHTML=hora.getHours()+":"+hora.getMinutes()+":"+hora.getSeconds()+" ";
	document.getElementById("ListTitle").innerHTML=Str_List_Flow_Ctrl+"";
	document.getElementById("ListBody").innerHTML=ShowFlowLstShw();
}

function ShowFlowLstShw()
{
	var tmp="";
	var sts="";
	var y=0;
	var bgcolor="";
	var out="";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"Reqest.splice(FlwRqst,1);FlwRqst=-1;winList['List'].close();return false;\" />\n";
	//out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Update+"\" onclick=\"GetFlowList();return false;\" />\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_New_Flow_Ctrl+"\" onclick=\"GetFlow();return false;\" />\n";
	out+="<table border=\"1\" cellpadding=\"2\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"100%\" style=\"border-collapse:collapse;border:2px solid #000000;\">\n";
	//---------------------------------------------------------------------
	{
		out+="<tr align=\"center\" bgcolor=\"#C0C0C0\" >\n";
		out+="	<td align=\"center\" valign=\"middle\" colspan=\"2\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Commands+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Status+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_Title+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_ListVariables+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Str_LTE+"</font>\n";
		out+="	</td>\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="	</td>\n";
		out+="</tr>\n";
	}
	//---------------------------------------------------------------------
	y=0;
	while(y<FlowList.length)
	{
		if((y%2)==0)
			bgcolor="#808080";
		else
			bgcolor="#A0A0A0";
		//-------------------------------------------------------
		sts=FlowList[y][6].split(":");
		tmp=FlowSts.indexOf(sts[0])
		out+="<tr align=\"center\" bgcolor=\""+bgcolor+"\" >\n";
		{
			out+="	<td align=\"center\" valign=\"middle\" onclick=\"\">\n";
			if(tmp!=-1)
			{
				if(FlowCmd[tmp]!="")
					out+="<input type=\"button\" class=\"INTEXT2\" value=\""+FlowCmdTxt[tmp]+"\" onclick=\""+FlowCmd[tmp]+y+");return false;\" />\n";
			}
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<img src=\"../img/efile.png\" width=\"18\" height=\"18\" border=\"0\" onclick=\"GetFlow("+y+");return false;\" />";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">";
			if(tmp!=-1)
				out+=FlowStsTxt[tmp]
			else
				out+=sts[0];
			out+="</font>\n";
			//out+="		<img border=\"0\" src=\"../img/"+FlowStsIco[tmp]+"\" width=\"20\" height=\"20\" title=\""+FlowList[y][6]+"\" />\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+FlowList[y][2]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+replaceAll(FlowList[y][3],";","<br />")+"</font>\n";
			out+="	</td>\n";
			/*out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+FlowList[y][1]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+FlowList[y][4]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+FlowList[y][5]+"</font>\n";
			out+="	</td>\n";*/
			out+="	<td align=\"center\" valign=\"middle\">\n";
			out+="		<font size=\"1\" face=\"Verdana\">"+FlowList[y][7]+"</font>\n";
			out+="	</td>\n";
			out+="	<td align=\"center\" valign=\"middle\" onclick=\"GetUrlB('./setitems.jsp?sql=DELETE FROM logics WHERE key%3D%27"+FlowList[y][0]+"%27',fncnone);GetFlowList();\">\n";
			out+="		<img src=\"../img/defile.png\" width=\"18\" height=\"18\" border=\"0\" />";
			out+="	</td>\n";
		}
		out+="</tr>\n";
		y++;
	}
	out+="</table>\n";
	return out;
}

function GetFlow(key)
{
	if(winList["WinConf"])
	{
		winList["WinConf"].open();
		winList["WinConf"].SetH("720px");
		winList["WinConf"].SetW("824px");
	}
	winList["WinConf"].FixSize(0);
	winList["WinConf"].SetX(1010);
	document.getElementById("WinConfTitle").innerHTML=Str_Edit_Flow_Ctrl;
	document.getElementById("WinConfBody").innerHTML=EditFlow();
	//----------------------------------------------------------
	if(key==null)
	{
		FlowKey=null;
		StartNewFlowProg();
		LoadFlowProg(FlowName,Code);
	}
	else
	{
		//var sql="./getitems.jsp?sql=SELECT * FROM logics WHERE key="+key+" order by key desc";
		//GetUrlB(sql,RcvFlowProg);
		FlowKey	=	FlowList[key][0];
		Code	=		FlowList[key][1];
		FlowName=	FlowList[key][2];
		LoadFlowProg(FlowName,Code);
	}
}

function CheckFlow(key)
{
	if(key!=null)
	{
		GetUrlB("./setitems.jsp?sql=UPDATE logics SET (status,lstchg)%3D('Check',LOCALTIMESTAMP)%20WHERE%20key%3D%27"+FlowList[key][0]+"%27",fncnone);
		//GetUrlB("../servlets/srvcmd?drv=SrvFlow&driver="+FlowList[key][4]+"&flw="+replaceAll(FlowList[key][2]," ","_")+"&cmd=Check",fncnone);
	}
}

function PlayFlow(key)
{
	if(key!=null)
	{
		GetUrlB("./setitems.jsp?sql=UPDATE logics SET (status,lstchg)%3D('Running',LOCALTIMESTAMP)%20WHERE%20key%3D%27"+FlowList[key][0]+"%27",fncnone);
		//GetUrlB("../servlets/srvcmd?drv=SrvFlow&driver="+FlowList[key][4]+"&flw="+replaceAll(FlowList[key][2]," ","_")+"&cmd=Play",fncnone);
	}
}
function StartFlow(key)
{
	if(key!=null)
	{
		GetUrlB("./setitems.jsp?sql=UPDATE logics SET (status,lstchg)%3D('Start',LOCALTIMESTAMP)%20WHERE%20key%3D%27"+FlowList[key][0]+"%27",fncnone);
		//GetUrlB("../servlets/srvcmd?drv=SrvFlow&driver="+FlowList[key][4]+"&flw="+replaceAll(FlowList[key][2]," ","_")+"&cmd=Play",fncnone);
	}
}
function PauseFlow(key)
{
	if(key!=null)
	{
		GetUrlB("./setitems.jsp?sql=UPDATE logics SET (status,lstchg)%3D('Paused',LOCALTIMESTAMP)%20WHERE%20key%3D%27"+FlowList[key][0]+"%27",fncnone);
		//GetUrlB("../servlets/srvcmd?drv=SrvFlow&driver="+FlowList[key][4]+"&flw="+replaceAll(FlowList[key][2]," ","_")+"&cmd=Pause",fncnone);
	}
}

//----------------------------------------------------------------
function EditFlow()
{
	var p=0;
	var out="";
	out+="<table border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"table1\" bordercolor=\"#FfFfFf\" bgcolor=\"LightGrey\" width=\"100%\">\n";
	//------------------------------------
	out+="<tr>\n";
	out+="<td align=\"center\" >\n";
	//------------------
	out+="<table border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"table1\" bordercolor=\"#FfFfFf\" bgcolor=\"LightGrey\" width=\"100%\">\n";
	out+="<tr>\n";
	out+="<td align=\"center\" colspan=\"2\">\n";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Close+"\" onclick=\"winList['WinConf'].close();return false;\" />\n";
	out+="</td>\n";
	out+="<td align=\"center\">";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Add_Variable+"\" onclick=\"ShwAddNewVar(event);\"/>";
	out+="</td>\n";
	out+="<td align=\"center\">";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Reset+"\" onclick=\"Code='';LoadFlowProg(FlowName,Code);\"/>";
	out+="</td>\n";
	out+="<td align=\"center\" colspan=\"2\">\n";
	out+="<font size=\"1\" face=\"Verdana\">"+Str_Name+"</font>\n";
	out+="<input id=\"FileNameFP\" type=\"text\" class=\"INTEXT\" value=\"\" size=\"20\" maxlength=\"40\" />\n";
	out+="</td>\n";
	out+="<td align=\"center\">";
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Save+"\" onclick=\"MakeCode();\" />\n";
	out+="</td>\n";
	out+="</tr>\n";
	out+="</table>\n";
	//------------------
	out+="</td>\n";
	out+="</tr>\n";
	//------------------------------------
	out+="<tr>\n";
	out+="<td align=\"left\" bgcolor=\"#FFFFFF\" valign=\"top\">\n";
	//------------------
	out+="<div id=\"FlowProg\" style=\"overflow:auto;width:800px;height:700px;\"></div>\n";
	//------------------
	out+="</td>\n";
	out+="</tr>\n"
	//------------------------------------
	out+="<tr>\n";
	out+="<td align=\"left\" bgcolor=\"#FFFFFF\" valign=\"top\">\n";
	//------------------
	out+="<div id=\"GPrgStp\" style=\"overflow:auto;width:800px;\"></div>\n";
	//------------------
	out+="</td>\n";
	out+="</tr>\n"
	//------------------------------------
	out+="</table>\n";
	return out;
}

function CheckSpecialCharacters(data,iChars)
{
	if(iChars==null || iChars=="")
	iChars = " !@#$%^&*()+=-[]\\\';,/{}|\":<>?~"; 
	for (var i = 0; i < data.length; i++) 
	{
		if (iChars.indexOf(data.charAt(i)) != -1) 
		{
			alert ("Your string has special characters. \nThese are not allowed.");
			return true;
		}
	}
	return false;
}

function RstWz()
{
	document.getElementById("FlowProg").innerHTML=UpDateFlow(DataPlan);
}

function ChekInst(linea) 
{
	for(var i=0; i<insttable.length; i++) 
	{
		if (linea.indexOf(insttable[i].Valor)!=-1)
			return true;
	}
	return false;
}

function RcvFlowProg(Datos)
{
	if(Datos.status==200)
	{
		Datos=Datos.responseText;
		if (winList["WinConf"])
		{
			winList["WinConf"].open();
			winList["WinConf"].SetH("720px");
			winList["WinConf"].SetW("824px");
		}
		winList["WinConf"].FixSize(0);
		document.getElementById("WinConfTitle").innerHTML=Str_Edit_Flow_Ctrl;
		document.getElementById("WinConfBody").innerHTML=EditFlow();
		LoadFlowProg(UpFile,Datos)
	}
}

function StartNewFlowProg()
{
FlowName="NewFlow";
Code="";
/*Code=";\
SqlIntR /ID1/IOs10/Conteo=0;\
Int plan=1;\
Int c20=20;\
Int c30=30;\
Int c40=40;\
mov 1 plan;\
IF< /ID1/IOs10/Conteo c20;\
mov c20 plan;\
ELSE;\
FI;\
IF< /ID1/IOs10/Conteo c30;\
mov c30 plan;\
IF< /ID1/IOs10/Conteo c40;\
mov c40 plan;\
ELSE;\
mov c20 plan;\
FI;\
ELSE;\
IF< /ID1/IOs10/Conteo c20;\
mov c20 plan;\
ELSE;\
mov c20 plan;\
FI;\
FI;\
div 10 plan;\
mov plan /ID1/Splan;\
end;";*/
}

function LoadFlowProg(FileNameFP,Datos)
{
	var linea="";
	while(Datos.indexOf("\n")!=-1)
	{
		Datos=Datos.replace("\n",";");
		Datos=Datos.replace(";;",";");
	}
	DataPlan=Datos.split(";");
	var out="";
	//--------------------------------------------
	for(var i=0;i<DataPlan.length;i++)
	{
		DataPlan[i]=RemoveUnuseChar(DataPlan[i]);
		if(!DataPlan[i].length)
		{
			DataPlan.splice(i,1);
			i--;
		}
	}
	//--------------------------------------------
	Variables.length=0;
	Etiquetas.length=0;
	for(i=0;i<DataPlan.length;i++)
	{
		linea=DataPlan[i].split(" ");
		if(linea.length==2)
		{
			switch(linea[0])
			{
				case "Int":
				case "Str":
				case "nSqlIntR":
				case "nSqlIntW":
				case "nSqlStrR":
				case "nSqlStrW":
					linea=DataPlan[i].replace("="," ");
					linea=linea.split(" ");
					DataPlan.splice(i,1);
					i--;
									//typo		nombre		valor
					AddNewVar(linea[0],linea[1],linea[2]);
				break;
				case "SqlIntR":
				case "SqlIntW":
				case "SqlStrR":
				case "SqlStrW":
					linea=DataPlan[i].replace("="," ");
					linea=linea.split(" ");
					DataPlan.splice(i,1);
					i--;
									//typo		nombre		valor
					AddNewVar(linea[0],linea[1],null);
				break;
				default:
				break;
			}
		}
		/*if(linea.length==1)
		{
			linea=DataPlan[i].split(" ");
			if(ChekInst(linea[0])==false && linea.length==1)					// DETECTA ETIQUETAS
				AddNewLabel(linea[0],"");
		}*/
	}
	//--------------------------------------------
	document.getElementById("FileNameFP").value=replaceAll(FlowName,"_"," ");
	document.getElementById("FlowProg").innerHTML=UpDateFlow(DataPlan);
}

function UpDateFlow(Data)
{
	var Y=5;
	var X=0;
	var out="";
	var out2="";
	var rtrn= new Object;
	rtrn=GraphVars(550,Y);
	out2+=rtrn.out;
	Y=50;
	//-------------------------------
	out2+="<g>\n<ellipse fill=\"#FFC0C0\" stroke=\"#FF0000\" cx=\""+(X+100)+"\" cy=\""+Y+"\" id=\"Ginicio\" rx=\"40\" ry=\"10\"/>\n";
	out2+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(X+100)+"\" y=\""+(Y+3)+"\" font-size=\"10\" font-family=\"serif\" text-anchor=\"middle\">\nINICIO</text>\n"; // xml:space=\"preserve\"
	out2+="</g>\n";
	Y+=10;
	//-------------------------------
	out2+="<ellipse cx=\""+(X+100)+"\" cy=\""+(Y+9)+"\" rx=\"70\" ry=\"8\" stroke-width=\"1\"  stroke=\"rgba(0,254,0,0)\" fill=\"rgba(0,254,0,0)\" \
	onclick=\"var rtr=ShwAddNewInsT(0);showFlyMnu(evt,{idx:10000,HTML:rtr,TimeOut:0});\" \
	onmouseover=\"overFlyMnu(10000);this.setAttribute('style', 'stroke:rgba(  0,254,  0,0.2);fill:rgba(  0,254,  0,0.2);');\" onmousemove=\"overFlyMnu(10000);\" \
	onmouseout=\"	outFlyMnu(10000); this.setAttribute('style', 'stroke:rgba(255,255,255,0  );fill:rgba(255,255,255,0  );');\" />\n";
	out2+="<path id=\"svg_7\" d=\"m"+(X+100)+" "+(Y+0)+" L"+(X+100)+" "+(Y+21)+" L"+(X+98)+" "+(Y+21)+" L"+(X+100)+" "+(Y+23)+" L"+(X+102)+" "+(Y+21)+" L"+(X+100)+" "+(Y+21)+"\" stroke-width=\"2\" stroke=\"#000000\" fill=\"none\"/>\n";
	Y+=25;
	//-------------------------------
	rtrn=SegFlow(X,Y,Data,0);
	out2+=rtrn.out;
	X=rtrn.X;
	Y=rtrn.Y;
	//-------------------------------
	out2+="<ellipse cx=\""+(X+100)+"\" cy=\""+(Y+9)+"\" rx=\"70\" ry=\"8\" stroke-width=\"1\"  stroke=\"rgba(0,254,0,0)\" fill=\"rgba(0,254,0,0)\" \
	onclick=\"var rtr=ShwAddNewInsT("+Data.length+");showFlyMnu(evt,{idx:10000,HTML:rtr,TimeOut:0});\" \
	onmouseover=\"overFlyMnu(10000);this.setAttribute('style', 'stroke:rgba(  0,254,  0,0.2);fill:rgba(  0,254,  0,0.2);');\" onmousemove=\"overFlyMnu(10000);\" \
	onmouseout=\"	outFlyMnu(10000); this.setAttribute('style', 'stroke:rgba(255,255,255,0  );fill:rgba(255,255,255,0  );');\" />\n";
	out2+="<path id=\"svg_7\" d=\"m"+(X+100)+" "+(Y+0)+" L"+(X+100)+" "+(Y+21)+" L"+(X+98)+" "+(Y+21)+" L"+(X+100)+" "+(Y+23)+" L"+(X+102)+" "+(Y+21)+" L"+(X+100)+" "+(Y+21)+"\" stroke-width=\"2\" stroke=\"#000000\" fill=\"none\"/>\n";
	Y+=25;
	//-------------------------------
	Y+=13;
	out2+="<g><ellipse fill=\"#FFC0C0\" stroke=\"#FF0000\" cx=\""+(X+100)+"\" cy=\""+(Y-3)+"\" id=\"Ginicio\" rx=\"40\" ry=\"10\"/>\
	<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(X+100)+"\" y=\""+Y+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"middle\" xml:space=\"preserve\">FIN</text>\
	</g>\n";
	//-------------------------------
	out+="<svg width=\"780\" height=\""+(rtrn.Y+50)+"\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n";
	out+=out2;
	out+="</svg>\n";
	return out;
}

function GraphVars(x,y)
{
	var rtrn= new Object;
	rtrn.out="";
	var y2=y;
	for(i=0;i<Variables.length;i++)
	{
		y+=20;
		switch(Variables[i].Type)
		{
			case "Int":
			case "Str":
				rtrn.out+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(x+23)+"\" y=\""+y+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"start\" xml:space=\"preserve\">\n";
				rtrn.out+=HTMLEncode(Variables[i].Type+" "+Variables[i].Nombre+"="+Variables[i].Valor)+"</text>\n"
			break;
			case "nSqlIntR":
			case "nSqlIntW":
			case "nSqlStrR":
			case "nSqlStrW":
			case "SqlIntR":
			case "SqlIntW":
			case "SqlStrR":
			case "SqlStrW":
				rtrn.out+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(x+23)+"\" y=\""+y+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"start\" xml:space=\"preserve\">\n";
				rtrn.out+=HTMLEncode(Variables[i].Type+" "+Variables[i].Nombre);
				if(Variables[i].Valor)
					rtrn.out+=" "+Variables[i].Valor;
				rtrn.out+="</text>\n"
			break;
		}
		rtrn.out+="<image xlink:href=\"../img/defile.png\" x=\""+(x+6)+"\" y=\""+(y-12)+"\" height=\"15px\" width=\"15px\" onclick=\"DeletVar("+i+");\" />\n";
	}
	rtrn.out+="<rect id=\"IniParms\" height=\""+(y-y2)+"\" width=\"225\" y=\""+(y2+5)+"\" x=\""+(x+5)+"\" stroke-width=\"1\" stroke=\"#000000\" fill=\"none\" />\n";
	y+=20;
	rtrn.Y=y;
	rtrn.X=x;
	return rtrn;
}

function DeletVar(pos)
{
	if(confirm("["+Variables[pos].Nombre+"]"+Str_Del_Confirm)==true)
	{
		Variables.splice(pos,1);
		setTimeout('RstWz();',1000);
	}
}

function SegFlow(x,y,Data,idx)
{
	var ptr;
	var ValorVar=0;
	var ptrT;
	var GrpArw=1;
	var linea="";
	var posYL=0;
	var posY0=0;
	var posY1=0;
	var posY2=0;
	var posY=y;
	var offX=x;
	var posX=0;
	var width=150;
	var height=y;
	var rtrn= new Object;
	var tmp=0;
	//Labels.length=0;
	//saltos.length=0
	var out2="";
	var out="";
	//---------------------------------------------------------------------
	ptr=0;
	for(var i=0;i<Data.length;i++)
	{
		linea=RemoveUnuseChar(Data[i]);
		linea=linea.split(" ");
		if(linea[0]!="" && linea[0].charAt(0)!="#" )
		{
			linea[0]=linea[0].toLowerCase();
			if(ChekInst(linea[0]))
			{
				GrpArw=1;
				posYL=posY;
				//-------------------------------------------------------
				out2="<ellipse cx=\""+(offX+100)+"\" cy=\""+(posY+8)+"\" rx=\"70\" ry=\"8\" stroke-width=\"1\" stroke=\"rgba(0,0,254,0)\" fill=\"rgba(0,0,254,0)\" \
				onclick=\"DeletInstr("+(i+idx)+");\" \
				onmouseover=\"this.setAttribute('style', 'stroke:rgba(  0,  0,254,0.2);fill:rgba(  0,  0,254,0.2);');\" \
				onmouseout=\" this.setAttribute('style', 'stroke:rgba(255,255,255,0  );fill:rgba(255,255,255,0  );');\" />\n";
				//-------------------------------------------------------
				switch(linea[0])
				{
					/*case "call":
						Funciones.push(linea[1]);
						Funciones.push(posY);
						out+="<a xlink:href=\"#\" id=\"lnk\">\n";
						out+="<rect id=\"IniParms\" onclick=\"GotoLabel('"+linea[1]+"');\" height=\"15\" width=\"135\" y=\""+posY+"\" x=\""+(offX+35)+"\" stroke-width=\"1\" stroke=\"#0000FF\" fill=\"#FFFFFF\" />\n";
						out+="<text fill=\"#000000\" onclick=\"GotoLabel('"+linea[1]+"');\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(offX+100)+"\" y=\""+(posY+10)+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"middle\" xml:space=\"preserve\">\n"+Str_Call+" "+Str_Function+" "+linea[1]+"</text>\n"
						out+="</a>\n";
					break;
					case "return":
						posY+=13;
						out+="<ellipse fill=\"none\" stroke=\"#FF0000\" cx=\""+(offX+100)+"\" cy=\""+(posY-3)+"\" id=\"Ginicio\" rx=\"40\" ry=\"10\"/>\n";
						out+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(offX+100)+"\" y=\""+posY+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"middle\" xml:space=\"preserve\">\n"+HTMLEncode(linea[0])+"</text>\n";
						retornos.push((posY+10));
						posY+=20;
					break;*/
					case "if>":
					case "if<":
					case "if!=":
					case "if==":
					{
						linea="Es "+linea[1]+" "+replaceAll(linea[0],"if","")+" "+linea[2]+"? ";
						ptrT=0;//linea.length*3;
						linea=HTMLEncode(linea);
						width+=150;
						posY+=10;
						/*out2="<rect y=\""+(posY)+"\" x=\""+(offX+30)+"\" height=\""+17+"\" width=\"140\" stroke-width=\"1\" stroke=\"rgba(0,0,254,0.2)\" fill=\"rgba(0,0,254,0.2)\"\*/
						//onclick=\"showFlyMnu(evt,{idx:"+(i+idx+1)+",HTML:'"+Data[i]+"("+(i+idx)+")',TimeOut:0});\" 
						out2="<ellipse cx=\""+(offX+100)+"\" cy=\""+(posY+10)+"\" rx=\"70\" ry=\"12\" stroke-width=\"1\" stroke=\"rgba(0,0,254,0)\" fill=\"rgba(0,0,254,0)\" \
						onclick=\"DeletInstr("+(i+idx)+");\" \
						onmouseover=\"overFlyMnu("+(i+idx+1)+");this.setAttribute('style', 'stroke:rgba(  0,  0,254,0.2);fill:rgba(  0,  0,254,0.2);');\" onmousemove=\"overFlyMnu("+(i+idx+1)+");\" \
						onmouseout=\"outFlyMnu("+(i+idx+1)+");  this.setAttribute('style', 'stroke:rgba(255,255,255,0  );fill:rgba(255,255,255,0  );');\" />\n";
						
						out+="<path id=\"svg_IF\" d=\"m"+(offX+ 25-ptrT)+" "+(posY+10)+"\
																					L"+(offX+ 30-ptrT)+" "+(posY- 0)+"\
																					L"+(offX+100+ptrT)+" "+(posY-10)+"\
																					L"+(offX+170+ptrT)+" "+(posY+ 0)+"\
																					L"+(offX+175+ptrT)+" "+(posY+10)+"\
																					L"+(offX+170+ptrT)+" "+(posY+20)+"\
																					L"+(offX+100+ptrT)+" "+(posY+30)+"\
																					L"+(offX+ 30-ptrT)+" "+(posY+20)+" Z\" stroke-width=\"1\" stroke=\"#008F00\" fill=\"none\"/>\n";
						
						
						out+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(offX+100)+"\" y=\""+(posY+13)+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"middle\" xml:space=\"preserve\">\n";
						out+=linea;
						out+="</text>\n";
						//-----------
						posY0=posY;
						//-----------
						posY+=15;
						posY+=16;
						out+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(offX+100)+"\" y=\""+(posY+10)+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"start\" xml:space=\"preserve\">\n(Si)</text>\n";
						out+="<path id=\"svg_Si\" d=\"m"+(offX+100)+" "+(posY+0)+" L"+(offX+100)+" "+(posY+15)+" L"+(offX+98)+" "+(posY+15)+" L"+(offX+100)+" "+(posY+17)+" L"+(offX+102)+" "+(posY+15)+" L"+(offX+100)+" "+(posY+15)+"\" stroke-width=\"2\" stroke=\"#000000\" fill=\"none\"/>\n";
						posY+=4;
						posY+=15;
						posY2=posY;
						posY1=posY;
						//-----------(Si)
						var j=i+1;
						var stk=1;
						while(j<Data.length && stk>0)
						{
							if(Data[j].indexOf("IF")!=-1)
								stk++;
							if(Data[j].indexOf("ELSE")!=-1)
								stk--;
							j++;
						}
						//-----------
						j--;
						rtrn.out="";
						tmp=offX;
						rtrn.W=150;
						if((i+1)!=j)
						{
							rtrn=SegFlow(offX+0,posY,Data.slice(i+1,j),(i+idx+1));
							posY2=rtrn.Y;
							out+=rtrn.out;
						}
						tmp+=rtrn.W;
						i=j;
						var I=i;
						//-----------(No)
						var j=i+1;
						var stk=1;
						while(j<Data.length && stk>0)
						{
							if(Data[j].indexOf("IF")!=-1)
								stk++;
							if(Data[j].indexOf("FI")!=-1)
								stk--;
							j++;
						}
						//-----------
						j--;
						rtrn.out="";
						if((i+1)!=j)
						{
							rtrn=SegFlow(tmp,posY,Data.slice(i+1,j),(i+idx+1));
							posY1=rtrn.Y;
							out+=rtrn.out;
						}
						i=j;
						//-----------
						if(posY2>posY1)
							posY=posY2;
						else
							posY=posY1;
						//-----------
						out+="<path id=\"svg_8\" d=\"m"+(tmp+100 )+" "+(posY1)+" L"+(tmp+100 )+" "+(posY+13)+" L"+(offX+106)+" "+(posY+13)+" L"+(offX+106)+" "+(posY+11)+" L"+(offX+104)+" "+(posY+13)+" L"+((offX+106))+" "+(posY+15)+" L"+(offX+106)+" "+(posY+13)+" \" stroke=\"rgb("+(50+parseInt(Math.random()*128))+","+(50+parseInt(Math.random()*128))+","+(50+parseInt(Math.random()*128))+")\" stroke-width=\"2\" fill=\"none\"/>\n";
						out+="<path id=\"svg_7\" d=\"m"+(offX+100)+" "+(posY2)+" L"+(offX+100)+" "+(posY+13)+" L"+(offX+98 )+" "+(posY+13)+" L"+(offX+100)+" "+(posY+15)+" L"+(offX+102)+" "+(posY+13)+" L"+(offX+100)+" "+(posY+13)+"\" stroke-width=\"2\" stroke=\"#000000\" fill=\"none\"/>\n";
						//-----------
						posY2=posY0+16+15+17-2;
						out+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(offX+177)+"\" y=\""+(posY0+4)+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"start\" xml:space=\"preserve\">\n(No)</text>\n";
						out+="<path id=\"svg_NoR\" d=\"m"+(offX+177)+" "+(posY0+10)+" L"+(offX+175)+" "+(posY0+12)+" L"+(offX+175)+" "+(posY0+8)+" L"+(offX+177)+" "+(posY0+10)+" L"+((tmp+100))+" "+(posY0+10)+" L"+((tmp+100))+" "+(posY2)+" L"+(tmp+98)+" "+(posY2)+" L"+(tmp+100)+" "+(posY2+2)+" L"+(tmp+102)+" "+(posY2)+" L"+(tmp+100)+" "+(posY2)+"\" stroke=\"rgb("+(50+parseInt(Math.random()*128))+","+(50+parseInt(Math.random()*128))+","+(50+parseInt(Math.random()*128))+")\" stroke-width=\"2\" fill=\"none\"/>\n";
						//-------------------------si-------------
						out+="<ellipse cx=\""+(offX+100)+"\" cy=\""+(posY+8)+"\" rx=\"70\" ry=\"10\" stroke-width=\"1\"  stroke=\"rgba(0,254,0,0)\" fill=\"rgba(0,254,0,0)\" \
						onclick=\"var rtr=ShwAddNewInsT("+(I+idx)+");showFlyMnu(evt,{idx:"+(I+idx+10000)+",HTML:rtr,TimeOut:0});\" \
						onmouseover=\"overFlyMnu("+(I+idx+10000)+");this.setAttribute('style', 'stroke:rgba(  0,254,  0,0.2);fill:rgba(  0,254,  0,0.2);');\" onmousemove=\"overFlyMnu("+(I+idx+10000)+");\" \
						onmouseout=\"outFlyMnu("+(I+idx+10000)+");  this.setAttribute('style', 'stroke:rgba(255,255,255,0  );fill:rgba(255,255,255,0  );');\" />\n";
						//-------------------------no-------------
						out+="<ellipse cx=\""+(tmp+100)+"\" cy=\""+(posY+8)+"\" rx=\"70\" ry=\"10\" stroke-width=\"1\"  stroke=\"rgba(0,254,0,0)\" fill=\"rgba(0,254,0,0)\" \
						onclick=\"var rtr=ShwAddNewInsT("+(i+idx)+");showFlyMnu(evt,{idx:"+(i+idx+10000)+",HTML:rtr,TimeOut:0});\" \
						onmouseover=\"overFlyMnu("+(i+idx+10000)+");this.setAttribute('style', 'stroke:rgba(  0,254,  0,0.2);fill:rgba(  0,254,  0,0.2);');\" onmousemove=\"overFlyMnu("+(i+idx+10000)+");\" \
						onmouseout=\"outFlyMnu("+(i+idx+10000)+");  this.setAttribute('style', 'stroke:rgba(255,255,255,0  );fill:rgba(255,255,255,0  );');\" />\n";
						GrpArw=0;
					}
					break;
					case "mov":
					{
						linea=linea[2]+" = "+linea[1];
						ptrT=linea.length*3;
						linea=HTMLEncode(linea);
						out+="<path id=\"svg_MOV\" d=\"m"+((offX+105)-(ptrT))+" "+posY+" L"+((offX+105)+(ptrT))+" "+posY+" L"+((offX+95)+(ptrT))+" "+(posY+15)+" L"+((offX+95)-(ptrT))+" "+(posY+15)+" Z\" stroke-width=\"1\" stroke=\"#008F00\" fill=\"none\"/>\n";
						out+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(offX+100)+"\" y=\""+(posY+10)+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"middle\" xml:space=\"preserve\">\n"+linea+"</text>\n";
					}
					break;
					case "add":
					{
						linea=linea[2]+"="+linea[2]+"+"+linea[1];
						ptrT=linea.length*3;
						linea=HTMLEncode(linea);
						out+="<path id=\"svg_ADD\" d=\"m"+((offX+105)-(ptrT))+" "+posY+" L"+((offX+105)+(ptrT))+" "+posY+" L"+((offX+95)+(ptrT))+" "+(posY+15)+" L"+((offX+95)-(ptrT))+" "+(posY+15)+" Z\" stroke-width=\"1\" stroke=\"#008F00\" fill=\"none\"/>\n";
						out+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(offX+100)+"\" y=\""+(posY+10)+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"middle\" xml:space=\"preserve\">\n"+linea+"</text>\n";
					}
					break;
					case "or":
					{
						linea=linea[2]+"="+linea[2]+" or "+linea[1];
						ptrT=linea.length*3;
						linea=HTMLEncode(linea);
						out+="<path id=\"svg_OR\" d=\"m"+((offX+105)-(ptrT))+" "+posY+" L"+((offX+105)+(ptrT))+" "+posY+" L"+((offX+95)+(ptrT))+" "+(posY+15)+" L"+((offX+95)-(ptrT))+" "+(posY+15)+" Z\" stroke-width=\"1\" stroke=\"#008F00\" fill=\"none\"/>\n";
						out+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(offX+100)+"\" y=\""+(posY+10)+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"middle\" xml:space=\"preserve\">\n"+linea+"</text>\n";
					}
					break;
					case "sub":
					{
						linea=linea[2]+"="+linea[2]+"-"+linea[1];
						ptrT=linea.length*3;
						linea=HTMLEncode(linea);
						out+="<path id=\"svg_SUB\" d=\"m"+((offX+105)-(ptrT))+" "+posY+" L"+((offX+105)+(ptrT))+" "+posY+" L"+((offX+95)+(ptrT))+" "+(posY+15)+" L"+((offX+95)-(ptrT))+" "+(posY+15)+" Z\" stroke-width=\"1\" stroke=\"#008F00\" fill=\"none\"/>\n";
						out+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(offX+100)+"\" y=\""+(posY+10)+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"middle\" xml:space=\"preserve\">\n"+linea+"</text>\n";
					}
					break;
					case "mul":
					{
						linea=linea[2]+"="+linea[2]+"* "+linea[1];
						ptrT=linea.length*3;
						linea=HTMLEncode(linea);
						out+="<path id=\"svg_MUL\" d=\"m"+((offX+105)-(ptrT))+" "+posY+" L"+((offX+105)+(ptrT))+" "+posY+" L"+((offX+95)+(ptrT))+" "+(posY+15)+" L"+((offX+95)-(ptrT))+" "+(posY+15)+" Z\" stroke-width=\"1\" stroke=\"#008F00\" fill=\"none\"/>\n";
						out+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(offX+100)+"\" y=\""+(posY+10)+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"middle\" xml:space=\"preserve\">\n"+linea+"</text>\n";
					}
					break;
					case "div":
					{
						linea=linea[2]+"="+linea[2]+" / "+linea[1];
						ptrT=linea.length*3;
						linea=HTMLEncode(linea);
						out+="<path id=\"svg_DIV\" d=\"m"+((offX+105)-(ptrT))+" "+posY+" L"+((offX+105)+(ptrT))+" "+posY+" L"+((offX+95)+(ptrT))+" "+(posY+15)+" L"+((offX+95)-(ptrT))+" "+(posY+15)+" Z\" stroke-width=\"1\" stroke=\"#008F00\" fill=\"none\"/>\n";
						out+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(offX+100)+"\" y=\""+(posY+10)+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"middle\" xml:space=\"preserve\">\n"+linea+"</text>\n";
					}
					break;
					default:
					{
						linea=RemoveUnuseChar(Data[i]).toLowerCase();
						ptrT=linea.length*6;
						out+="<path id=\"svg_7\" d=\"m"+((offX+105)-(ptrT/2))+" "+posY+" L"+((offX+105)+(ptrT/2))+" "+posY+" L"+((offX+95)+(ptrT/2))+" "+(posY+15)+" L"+((offX+95)-(ptrT/2))+" "+(posY+15)+" Z\" stroke-width=\"1\" stroke=\"#008F00\" fill=\"none\"/>\n";
						out+="<text fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\" x=\""+(offX+100)+"\" y=\""+(posY+10)+"\" id=\"svg_2\" font-size=\"10\" font-family=\"serif\" text-anchor=\"middle\" xml:space=\"preserve\">\n"+HTMLEncode(linea)+"</text>\n";
					}
					break;
				}
				posY+=16;
				out+=out2;
				//----------------------
				if(GrpArw==1 && i<(Data.length-1))
				{
					/*out+="<rect y=\""+(posY)+"\" x=\""+(offX+25)+"\" height=\"18\" width=\"140\" stroke-width=\"1\" stroke=\"rgba(0,254,0,0.2)\" fill=\"rgba(0,254,0,0.2)\" \*/
					out+="<ellipse cx=\""+(offX+100)+"\" cy=\""+(posY+9)+"\" rx=\"70\" ry=\"8\" stroke-width=\"1\"  stroke=\"rgba(0,254,0,0)\" fill=\"rgba(0,254,0,0)\" \
					onclick=\"var rtr=ShwAddNewInsT("+(i+idx+1)+");showFlyMnu(evt,{idx:"+(i+idx+10000)+",HTML:rtr,TimeOut:0});\" \
					onmouseover=\"overFlyMnu("+(i+idx+10000)+");this.setAttribute('style', 'stroke:rgba(  0,254,  0,0.2);fill:rgba(  0,254,  0,0.2);');\" onmousemove=\"overFlyMnu("+(i+idx+10000)+");\" \
					onmouseout=\"outFlyMnu("+(i+idx+10000)+");  this.setAttribute('style', 'stroke:rgba(255,255,255,0  );fill:rgba(255,255,255,0  );');\" />\n";
					out+="<path id=\"svg_7\" d=\"m"+(offX+100)+" "+(posY+0)+" L"+(offX+100)+" "+(posY+15)+" L"+(offX+98)+" "+(posY+15)+" L"+(offX+100)+" "+(posY+17)+" L"+(offX+102)+" "+(posY+15)+" L"+(offX+100)+" "+(posY+15)+"\" stroke-width=\"2\" stroke=\"#000000\" fill=\"none\"/>\n";
					posY+=4;
					posY+=15;
				}
			}
		}
	}
	//--------------------------------------------------------------------------------------------
	rtrn.Y=posY;
	rtrn.X=offX;
	rtrn.W=width;
	rtrn.H=posY-height;
	rtrn.out=out;
	return rtrn;
}

function RemoveUnuseChar(linea)
{
	var temp="";
	var ptrT=0;
	do
	{
		ptrT=linea.indexOf(";");
		if(ptrT!=-1)
			linea=linea.substring(0,ptrT);
		ptrT=linea.indexOf("//");
		if(ptrT!=-1)
		{
			temp=linea.substring(0,ptrT);
			linea=linea.substring(ptrT);
			ptrT=linea.indexOf('\n');
			if(ptrT!=-1)
				linea=linea.substring(ptrT);
			else
				linea="";
			linea=(temp+linea);
		}
		linea=linea.replace("  "," ");
		linea=linea.replace("\t"," ");
		linea=linea.trim();
	}while(linea.indexOf("\t")!=-1 || linea.indexOf("  ")!=-1 || linea.indexOf("//")!=-1);
	return linea;
}
//=================================================================
function ShwAddNewInsT(pos)
{
	var out="";
	out+="<font size=\"1\" face=\"Verdana\"> "+Str_Add_Instruction+" </font><br />\n";
	out+="<select class=\"INTEXT\" onchange=\"if(this.selectedIndex>0){AddNewInsT0("+pos+",this.selectedIndex-1);}\">\n";
	out+="<option value=\"\"></option>\n";
	for(var i=0;i<insttable.length;i++)
	{
		out+="<option value=\""+i+"\" >"+insttable[i].Nombre+"</option>\n"; //onclick=\"AddNewInsT0("+pos+","+i+");\"
	}
	out+="</select><br /><br />\n";
	return out;
}

function AddNewInsT0(pos,i)
{
	FlyMnu.innerHTML=ShwAddNewInsT2(pos,i,"");
  var elList = document.getElementsByTagName("select");
	for (var i = 0; i < elList.length; i++)
	{
		if (elList[i].className == "INTEXTSEL")
		{
			$("#"+elList[i].id).editableSelect();
			i--;
		}
	}
}

function ShwAddNewInsT2(pos,InstIdx,instruct)
{
	var ArgIdx=1;
	var out="<font size=\"1\" face=\"Verdana\">";
			out+=insttable[InstIdx].Nombre+":<br />";
	switch(insttable[InstIdx].Valor)
	{
		case "not":
		{
			out+=mkSelOpt(ArgIdx,insttable[InstIdx].Args[ArgIdx-1],instruct.split(" ")[ArgIdx]);
		}
		break;
		case "mov":
		{
			out+=mkSelOpt(ArgIdx+1,insttable[InstIdx].Args[ArgIdx],instruct.split(" ")[ArgIdx+1])+" = "+mkSelOpt(ArgIdx,insttable[InstIdx].Args[ArgIdx-1],instruct.split(" ")[ArgIdx]);
		}
		break;
		case "==":
		case "!=":
		case ">":
		case "<":
		{
			out+="Es "+mkSelOpt(ArgIdx,insttable[InstIdx].Args[ArgIdx-1],instruct.split(" ")[ArgIdx]);
			out+=HTMLEncode(insttable[InstIdx].Valor);
			out+=mkSelOpt(ArgIdx+1,insttable[InstIdx].Args[ArgIdx],instruct.split(" ")[ArgIdx+1])+"?";
			out+="<input type=\"hidden\" id=\"Arg3\"  value=\""+insttable[InstIdx].Args[ArgIdx+1]+"\">";
		}
		break;
		case "add":
		{
			out+="<font id=\"ResultOperation\" size=\"1\" face=\"Verdana\">"+insttable[InstIdx].Args[ArgIdx][0].Nombre+"</font> = ";
			out+="<select id=\"Arg"+(ArgIdx+1)+"\" onkeydown=\"\" class=\"INTEXTSEL\">\n";
			for(var j=0;j<insttable[InstIdx].Args[ArgIdx].length;j++)
			{
				out+="<option onclick=\"document.getElementById('ResultOperation').innerHTML='"+insttable[InstIdx].Args[ArgIdx][j].Nombre+"';\" value=\""+j+"\"";
				if(insttable[InstIdx].Args[ArgIdx][j].Valor==instruct.split(" ")[ArgIdx+1])
					out+=" selected=\"selected\"";
				out+=" >"+insttable[InstIdx].Args[ArgIdx][j].Nombre+"</option>\n";
			}
			out+="</select> + ";			
			out+=mkSelOpt(ArgIdx,insttable[InstIdx].Args[ArgIdx-1],instruct.split(" ")[ArgIdx]);
			ArgIdx++;
		}
		break;
		case "sub":
		{
			out+="<font id=\"ResultOperation\" size=\"1\" face=\"Verdana\">"+insttable[InstIdx].Args[ArgIdx][0].Nombre+"</font> = ";
			out+="<select id=\"Arg"+(ArgIdx+1)+"\" class=\"INTEXTSEL\">\n";
			for(var j=0;j<insttable[InstIdx].Args[ArgIdx].length;j++)
			{
				out+="<option onclick=\"document.getElementById('ResultOperation').innerHTML='"+insttable[InstIdx].Args[ArgIdx][j].Nombre+"';\" value=\""+j+"\"";
				if(insttable[InstIdx].Args[ArgIdx][j].Valor==instruct.split(" ")[ArgIdx+1])
					out+=" selected=\"selected\"";
				out+=" >"+insttable[InstIdx].Args[ArgIdx][j].Nombre+"</option>\n";
			}
			out+="</select> -\n";			
			out+=mkSelOpt(ArgIdx,insttable[InstIdx].Args[ArgIdx-1],instruct.split(" ")[ArgIdx]);
		}
		break;
		case "xor":
		{
			out+="<font id=\"ResultOperation\" size=\"1\" face=\"Verdana\">"+insttable[InstIdx].Args[ArgIdx][0].Nombre+"</font> = ";
			out+="<select id=\"Arg"+(ArgIdx+1)+"\" class=\"INTEXTSEL\">\n";
			for(var j=0;j<insttable[InstIdx].Args[ArgIdx].length;j++)
			{
				out+="<option onclick=\"document.getElementById('ResultOperation').innerHTML='"+insttable[InstIdx].Args[ArgIdx][j].Nombre+"';\" value=\""+j+"\"";
				if(insttable[InstIdx].Args[ArgIdx][j].Valor==instruct.split(" ")[ArgIdx+1])
					out+=" selected=\"selected\"";
				out+=" >"+insttable[InstIdx].Args[ArgIdx][j].Nombre+"</option>\n";
			}
			out+="</select> xor \n";			
			out+=mkSelOpt(ArgIdx,insttable[InstIdx].Args[ArgIdx-1],instruct.split(" ")[ArgIdx]);
		}
		break;
		case "mul":
		{
			out+="<font id=\"ResultOperation\" size=\"1\" face=\"Verdana\">"+insttable[InstIdx].Args[ArgIdx][0].Nombre+"</font> = ";
			out+="<select id=\"Arg"+(ArgIdx+1)+"\" class=\"INTEXTSEL\">\n";
			for(var j=0;j<insttable[InstIdx].Args[ArgIdx].length;j++)
			{
				out+="<option onclick=\"document.getElementById('ResultOperation').innerHTML='"+insttable[InstIdx].Args[ArgIdx][j].Nombre+"';\" value=\""+j+"\"";
				if(insttable[InstIdx].Args[ArgIdx][j].Valor==instruct.split(" ")[ArgIdx+1])
					out+=" selected=\"selected\"";
				out+=" >"+insttable[InstIdx].Args[ArgIdx][j].Nombre+"</option>\n";
			}
			out+="</select> * \n";			
			out+=mkSelOpt(ArgIdx,insttable[InstIdx].Args[ArgIdx-1],instruct.split(" ")[ArgIdx]);
		}
		break;
		case "div":
		{
			out+="<font id=\"ResultOperation\" size=\"1\" face=\"Verdana\">"+insttable[InstIdx].Args[ArgIdx][0].Nombre+"</font> = ";
			out+="<select id=\"Arg"+(ArgIdx+1)+"\" class=\"INTEXTSEL\">\n";
			for(var j=0;j<insttable[InstIdx].Args[ArgIdx].length;j++)
			{
				out+="<option onclick=\"document.getElementById('ResultOperation').innerHTML='"+insttable[InstIdx].Args[ArgIdx][j].Nombre+"';\" value=\""+j+"\"";
				if(insttable[InstIdx].Args[ArgIdx][j].Valor==instruct.split(" ")[ArgIdx+1])
					out+=" selected=\"selected\"";
				out+=" >"+insttable[InstIdx].Args[ArgIdx][j].Nombre+"</option>\n";
			}
			out+="</select> \\ \n";			
			out+=mkSelOpt(ArgIdx,insttable[InstIdx].Args[ArgIdx-1],instruct.split(" ")[ArgIdx]);
		}
		break;
		case "and":
		{
			out+="<font id=\"ResultOperation\" size=\"1\" face=\"Verdana\">"+insttable[InstIdx].Args[ArgIdx][0].Nombre+"</font> = ";
			out+="<select id=\"Arg"+(ArgIdx+1)+"\" class=\"INTEXTSEL\">\n";
			for(var j=0;j<insttable[InstIdx].Args[ArgIdx].length;j++)
			{
				out+="<option onclick=\"document.getElementById('ResultOperation').innerHTML='"+insttable[InstIdx].Args[ArgIdx][j].Nombre+"';\" value=\""+j+"\"";
				if(insttable[InstIdx].Args[ArgIdx][j].Valor==instruct.split(" ")[ArgIdx+1])
					out+=" selected=\"selected\"";
				out+=" >"+insttable[InstIdx].Args[ArgIdx][j].Nombre+"</option>\n";
			}
			out+="</select> and \n";			
			out+=mkSelOpt(ArgIdx,insttable[InstIdx].Args[ArgIdx-1],instruct.split(" ")[ArgIdx]);
		}
		break;
	}
	out+="</font><br /><br />\n";
	out+="<center><input type=\"button\" class=\"INTEXT2\" value=\""+Str_Add+"\" onclick=\"AddNewInsT("+InstIdx+","+pos+");hideFlyMnu();RstWz();\"/></center><br />\n";
	return out;
}
//=================================================================
function ChkArg(evt,obj)
{
	var txt=obj.value;
}

function DlSel(DlName,el)
{
	var datalist = document.getElementById (DlName);
  LOG(datalist.selectedIndex+"->"+datalist.options[datalist.selectedIndex]+"\n");
}

function mkSelOpt(ArgIdx,Vect,Sel)
{
	out="";
	if(Vect)
	{
		if(Vect!="Text")
		{
			//--------------------------------------------------------------------
			out+="<select id=\"Arg"+ArgIdx+"\" class=\"INTEXTSEL\" >\n";
			for(var j=0;j<Vect.length;j++)
			{
				out+="<option value=\""+j+"\""; //+HTMLEncode(Vect[j].Nombre)+"\"";
				if(Vect[j].Nombre==Sel)
					out+=" selected=\"selected\"";
				out+=" >"+HTMLEncode(Vect[j].Nombre)+"</option>\n";
			}
			out+="</select>\n";
			//--------------------------------------------------------------------
		}
		else
		{
			out+="<input id=\"Arg"+ArgIdx+"\" type=\"text\" class=\"INTEXT\" value=\"\" size=\"15\" maxlength=\"60\" />\n";
		}
	}
	return out;
}

function AddNewInsT(InstIdx,pos)
{
	var out="";
	var outT="";
	var i=0;
	var k=0;
	out=insttable[InstIdx].Valor+" ";
	switch(insttable[InstIdx].Valor)
	{
		case "==":
		case "!=":
		case ">":
		case "<":
		{
			out="IF"+insttable[InstIdx].Valor+" ";
			k=document.getElementById("Arg1")
			out+=k.value+" ";
			k=document.getElementById("Arg2")
			out+=k.value;
			k=document.getElementById("Arg3")
			out+=k.value;
		}
		break;
		default:
		{
			if(insttable[InstIdx].Args)
			{
				outT="";
				for(var j=0;j<insttable[InstIdx].Args.length;j++)
				{
					k=document.getElementById("Arg"+(j+1))
					outT+=k.value+" ";
					/*if(Variables!=insttable[InstIdx].Args[j])
						out+=insttable[InstIdx].Args[j]+" ";
					else
						out+=Variables[k].Nombre+" ";*/
				}
				out+=outT.trim();
			}
		}
		break;
	}
	while(out.indexOf("\n")!=-1)
	{
		out=out.replace("\n",";");
		out=out.replace(";;",";");
	}
	out=out.split(";");
	for(j=(out.length-1);j>=0;j--)
	{
		DataPlan.splice(pos,0,out[j]);
	}
}

function setVname(obj)
{
	if(obj.type.indexOf("0")!=-1)
		obj.type="StrR";
	if(obj.type.indexOf("w")!=-1)
		obj.type="StrW";
	obj.type="Sql"+obj.type;
	obj.type=replaceAll(obj.type,"SqlnSql","nSql");
	obj.type=replaceAll(obj.type,"SqlSql","Sql");
	AddNewVar(obj.type,obj.name,null);
	hideFlyMnu();
	RstWz();
}

function ShwAddNewSql(evt)
{
	var out="";
	updTVar(owl.deepCopy(VarTree),"","");
	out+="<font size=\"1\" face=\"Verdana\">"+Str_Select+" "+Str_Variable+"</font>\n<br />";
	out+=getTree(TVars,"setVname");
	showFlyMnu(evt,{idx:123456,HTML:out,TimeOut:0});
	//SetFlyMnu(out);
	CollapsibleLists.applyTo(FlyMnu);
}

function ShwAddNewVar(evt)
{
	var out="";
	out+="<font size=\"1\" face=\"Verdana\"> "+Str_Type+" </font>\n";
	out+="<select id=\"TypeOfVar\" class=\"INTEXT\" onchange=\"if(this.value=='Sql'){ShwAddNewSql({pageX:"+evt.pageX+",pageY:"+evt.pageY+"});}\" >\n";
	out+="<option value=\"\"></option>\n";
	out+="<option value=\"Int\">"+Str_New+" "+Str_Local+" "+Str_Integer+"</option>\n";
	out+="<option value=\"Str\">"+Str_New+" "+Str_Local+" "+Str_String+"</option>\n";
	out+="<option value=\"nSqlIntR\">"+Str_New+" "+Str_Sql+" "+Str_Integer+" "+Str_OREAD+"</option>\n";
	out+="<option value=\"nSqlIntW\">"+Str_New+" "+Str_Sql+" "+Str_Integer+" "+Str_Writable+"</option>\n";
	out+="<option value=\"nSqlStrR\">"+Str_New+" "+Str_Sql+" "+Str_String+" "+Str_OREAD+"</option>\n";
	out+="<option value=\"nSqlStrW\">"+Str_New+" "+Str_Sql+" "+Str_String+" "+Str_Writable+"</option>\n";
	out+="<option value=\"Sql\" >"+Str_From+" "+Str_Sql+"</option>\n";
	out+="</select><br />\n";
	//-----------------------------------
	out+="<font size=\"1\" face=\"Verdana\"> "+Str_Name+" </font>\n";
	out+="<input id=\"NameOfVar\" type=\"text\" class=\"INTEXT\" value=\"\" size=\"20\" maxlength=\"64\" />\n<br />";
	//-----------------------------------
	out+="<font size=\"1\" face=\"Verdana\"> "+Str_Value+" </font>\n";
	out+="<input id=\"ValueOfVar\" type=\"text\" class=\"INTEXT\" value=\"\" size=\"20\" maxlength=\"64\" />\n<br />";
	//-----------------------------------
	out+="<input type=\"button\" class=\"INTEXT2\" value=\""+Str_Add+"\" onclick=\"AddNewVar(\
	document.getElementById('TypeOfVar').options[document.getElementById('TypeOfVar').selectedIndex].value,\
	document.getElementById('NameOfVar').value,\
	document.getElementById('ValueOfVar').value);RstWz();\"/>\n<br />";
	showFlyMnu(evt,{idx:123456,HTML:out,TimeOut:0});
}

function AddNewVar(Type,Name,Val)
{
	var idx=Variables.length;
	Variables[idx]= new Object();
	Variables[idx].Type=Type;
	Variables[idx].Nombre=Name;
	Variables[idx].Valor=Val;
}

/*function AddNewLabel(Name,Type)
{
	var idx=Etiquetas.length;
	Etiquetas[idx]= new Object();
	Etiquetas[idx].Type=Type;
	Etiquetas[idx].Nombre=Name;
	Etiquetas[idx].Valor=Name;
}
*/

/*function GotoLabel(label)
{
	for(var i=0;i<Labels.length;i+=2)
	{
		if(Labels[i]==label)
		{
			//alert(Labels[i+1]);
			document.getElementById("FlowProg").scrollTop=Labels[i+1]-15;
		}
	}
}
*/

function DeletInstr(pos)
{
	if(confirm("["+DataPlan[pos]+"]"+Str_Del_Confirm)==true)
	{
		var j=pos+1;
		var stk=1;
		var zice=1;
		if(DataPlan[pos].indexOf("IF")!=-1)
		{
			while(j<DataPlan.length && stk>0)
			{
				if(DataPlan[j].indexOf("IF")!=-1)
					stk++;
				if(DataPlan[j].indexOf("FI")!=-1)
					stk--;
				j++;
				zice++;
			}
		}
		DataPlan.splice(pos,zice);
		setTimeout('RstWz();',1000);
  }
}

function adaptVarName(text)
{
	text=replaceAll(text,"/","_");
	text=replaceAll(text,".","POINT");
	text=replaceAll(text,"[","aCORCH");
	text=replaceAll(text,"]","cCORCH");
	return text;
}

function MakeCode()
{
	var out="";
	var outD="";
	var vars="";
	var tmp="";
	var linea="";
	var indt=2;
	UpFile=document.getElementById('FileNameFP').value;
	UpFile=replaceAll(UpFile," ","_");
	//--------------------------------------------------
	indt++;
	for(i=0;i<Variables.length;i++)
	{
			tmp=Variables[i].Type+" "+(Variables[i].Nombre);
			if(Variables[i].Valor)
				tmp+="="+Variables[i].Valor;
			tmp+=";";
			outD+=tmp.trim();
			if(tmp.indexOf("Sql")!=-1)
				vars+=tmp.trim();
			switch(Variables[i].Type)
			{
				case "Int":
					out+="\t".repeat(indt)+"int "+adaptVarName(Variables[i].Nombre)+"="+Variables[i].Valor+";";
				break;
				case "Str":
					out+="\t".repeat(indt)+"String "+adaptVarName(Variables[i].Nombre)+"='"+Variables[i].Valor+"';";
				break;
				case "nSqlStrR":
				case "nSqlStrW":
					out+="\t".repeat(indt)+"System.out.print('\t');\n";
					if(Variables[i].Nombre.charAt(0)=='/')
						out+="\t".repeat(indt)+"var.AddSqlVar('"+Variables[i].Nombre+"','"+Variables[i].Valor+"','"+replaceAll(Variables[i].Type,"nSql","")+"',',logic."+UpFile+"',null);\n";
					else
						out+="\t".repeat(indt)+"var.AddSqlVar('/logic/"+UpFile+"/"+Variables[i].Nombre+"','"+Variables[i].Valor+"','"+replaceAll(Variables[i].Type,"nSql","")+"',',logic."+UpFile+"',null);\n";
					out+="\t".repeat(indt)+"String "+adaptVarName(Variables[i].Nombre)+"='"+Variables[i].Valor+"';";
				break;
				case "nSqlIntR":
				case "nSqlIntW":
					out+="\t".repeat(indt)+"System.out.print('\t');\n";
					if(Variables[i].Nombre.charAt(0)=='/')
						out+="\t".repeat(indt)+"var.AddSqlVar('"+Variables[i].Nombre+"','"+Variables[i].Valor+"','"+replaceAll(Variables[i].Type,"nSql","")+"',',logic."+UpFile+"',null);\n";
					else
						out+="\t".repeat(indt)+"var.AddSqlVar('/logic/"+UpFile+"/"+Variables[i].Nombre+"','"+Variables[i].Valor+"','"+replaceAll(Variables[i].Type,"nSql","")+"',',logic."+UpFile+"',null);\n";
					out+="\t".repeat(indt)+"int "+adaptVarName(Variables[i].Nombre)+"="+Variables[i].Valor+";";
				break;
				case "SqlIntR":
				case "SqlIntW":
					out+="\t".repeat(indt)+"System.out.print('\t');\n";
					out+="\t".repeat(indt)+"tmpGetVar=var.GetSqlVar('"+Variables[i].Nombre+"');\n";
					out+="\t".repeat(indt)+"int "+adaptVarName(Variables[i].Nombre)+"=Integer.parseInt('0'+tmpGetVar[1]);";
				break;
				case "SqlStrR":
				case "SqlStrW":
					out+="\t".repeat(indt)+"System.out.print('\t');\n";
					out+="\t".repeat(indt)+"tmpGetVar=var.GetSqlVar('"+Variables[i].Nombre+"');\n";
					out+="\t".repeat(indt)+"String "+adaptVarName(Variables[i].Nombre)+"=tmpGetVar[1];";
				break;
			}
			out+="\n";
	}
	//---------------------------------------------------------------------------
	RemoveUnusedItem(DataPlan);
	for(var i=0;i<DataPlan.length;i++)
	{
		linea=DataPlan[i];
		outD+=(DataPlan[i]+";").trim();
		linea=linea.split(" ");
		{
			switch(linea[0])
			{
				case "ELSE":
				indt--;
				out+="\t".repeat(indt)+"}\n"
				out+="\t".repeat(indt)+"else\n";
				out+="\t".repeat(indt)+"{";
				indt++;
				break;
				case "FI":
				indt--;
				out+="\t".repeat(indt)+"}";
				break;
				case "IF==":
				case "IF!=":
				case "IF>":
				case "IF<":
				out+="\t".repeat(indt)+"if("+adaptVarName(linea[1])+""+replaceAll(linea[0],"IF","")+""+adaptVarName(linea[2])+")\n";
				out+="\t".repeat(indt)+"{";
				indt++;
				break;
				case "mov":
				out+="\t".repeat(indt)+adaptVarName(linea[2])+"="+adaptVarName(linea[1])+";";
				break;
				case "add":
				out+="\t".repeat(indt)+adaptVarName(linea[2])+"+="+adaptVarName(linea[1])+";";
				break;
				case "sub":
				out+="\t".repeat(indt)+adaptVarName(linea[2])+"-="+adaptVarName(linea[1])+";";
				break;
				case "mul":
				out+="\t".repeat(indt)+adaptVarName(linea[2])+"*="+adaptVarName(linea[1])+";";
				break;
				case "div":
				out+="\t".repeat(indt)+adaptVarName(linea[2])+"/="+adaptVarName(linea[1])+";";
				break;
				case "not":
				out+="\t".repeat(indt)+adaptVarName(linea[2])+"=-"+adaptVarName(linea[1])+";";
				break;
				case "and":
				out+="\t".repeat(indt)+adaptVarName(linea[2])+"&="+adaptVarName(linea[1])+";";
				break;
				case "or":
				out+="\t".repeat(indt)+adaptVarName(linea[2])+"|="+adaptVarName(linea[1])+";";
				break;
				case "xor":
				out+="\t".repeat(indt)+adaptVarName(linea[2])+"^="+adaptVarName(linea[1])+";";
				break;
			}
		}
		//out+="\t//"+DataPlan[i];
		out+="\n";
	}
	for(i=0;i<Variables.length;i++)
	{
		switch(Variables[i].Type)
		{
			case "nSqlIntR":
			case "nSqlIntW":
			case "nSqlStrR":
			case "nSqlStrW":
				out+="\t".repeat(indt)+"System.out.print('\t');\n";
				if(Variables[i].Nombre.charAt(0)=='/')
					out+="\t".repeat(indt)+"var.SetSqlVar(\""+Variables[i].Nombre+"\",\"\"+"+adaptVarName(Variables[i].Nombre)+",\""+replaceAll(Variables[i].Type,"nSql","")+"\",\"logic."+UpFile+"\",null);\n";
				else
					out+="\t".repeat(indt)+"var.SetSqlVar(\"/logic/"+UpFile+"/"+Variables[i].Nombre+"\",\"\"+"+adaptVarName(Variables[i].Nombre)+",\""+replaceAll(Variables[i].Type,"nSql","")+"\",\"logic."+UpFile+"\",null);\n";
			break;
			case "SqlIntW":
			case "SqlStrW":
				out+="\t".repeat(indt)+"System.out.print('\t');\n";
				out+="\t".repeat(indt)+"var.SetSqlVar(\""+Variables[i].Nombre+"\",\"\"+"+adaptVarName(Variables[i].Nombre)+",\""+replaceAll(Variables[i].Type,"nSql","")+"\",\"logic."+UpFile+"\",null);\n";
			break;
		}
	}
	//----------------------------------------
	ClsLOG();
	out=replaceAll(out,"'","\"")
	document.getElementById('GPrgStp').innerHTML="";
	//document.getElementById('GPrgStp').innerHTML+="<textarea name=\"codeDGV\" rows=\"40\" cols=\"111\">"+replaceAll(outD,";",";\n");+"</textarea>";
	//document.getElementById('GPrgStp').innerHTML+="<textarea name=\"codeJava\" rows=\"40\" cols=\"111\">"+out+"</textarea><br />";
	out=encodeURIComponent(out);
	if(FlowKey==null)
	{
		GetUrlB("./setitems.jsp?sql=INSERT INTO logics (title,data,vars,status,lstchg) VALUES (\'"+UpFile+"\',\'"+encodeURIComponent(outD)+"\','"+encodeURIComponent(vars)+"','Edit',LOCALTIMESTAMP)",fncnone);	//encodeURIComponent
	}
	else
	{
		GetUrlB("./setitems.jsp?sql=UPDATE logics SET (title,data,vars,status,lstchg)%3D(\'"+UpFile+"\',\'"+encodeURIComponent(outD)+"\','"+encodeURIComponent(vars)+"','Edit',LOCALTIMESTAMP)%20WHERE%20key%3D%27"+FlowKey+"%27",fncnone);
	}
	GetUrlB("./AddSrv.jsp?title="+UpFile+"&codej="+out,fncnone);
	winList['WinConf'].close();
}

