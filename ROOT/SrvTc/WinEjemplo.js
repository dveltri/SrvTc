//=================================================
function InitAlerts()
{
	var idx=Reqest.length;
	//-------------------------------------------
	Reqest[idx]= new Object();
	Reqest[idx].Url="./getitems.jsp";
	Reqest[idx].Fnc=rcvAlert;
	Reqest[idx].Status=1;
	Reqest[idx].Refresh=1000;
	Reqest[idx].LstRqst=0;
	Reqest[idx].Dest=document.getElementById("sample2Body");
}
//=================================================
function rcvAlert(Datos)
{
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
	if (winList['sample2']){winList['sample2'].open();}
	return ShowAlerts(Datos);
}

function ShowAlerts(Alerts)
{
	var rtc=0;
	var out="";
	out+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" background=\"\" width=\"100%\" style=\"border-collapse:collapse;border:2px solid #000000;\">\n";
	out+="<tr align=\"center\" bgcolor=\"#C0C0C0\">\n";
	out+="	<td align=\"center\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_Date+"</font>\n";
	out+="	</td>\n";
	out+="	<td align=\"center\" valign=\"middle\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_Description+"</font>\n";
	out+="	</td>\n";
	out+="	<td align=\"center\" valign=\"middle\">\n";
	out+="		<font size=\"1\" face=\"Verdana\">"+Str_Status+"</font>\n";
	out+="	</td>\n";
	for(var a=3;a<Alerts[0].length;a++)
	{
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+a+"</font>\n";
		out+="	</td>\n";
	}
	out+="</tr>\n";
	//---------------------------------------------------------------------
	var bgcolor="";
	for(var a=0;a<Alerts.length;a++)
	{
		if(Alerts[a][1].indexOf("New")!=-1)
			((a%2)==0?bgcolor="#FFE0E0":bgcolor="#FFC0C0")
		else
			((a%2)==0?bgcolor="#E0E0E0":bgcolor="#C0C0C0")
		//---------------------------------------------------------------------
		out+="<tr bgcolor=\""+bgcolor+"\" align=\"center\" class=\"bottom top\" ";
		if(Alerts[a][3])
			out+="onclick=\""+Alerts[a][3]+"\"";
		out+=">\n";
		out+="	<td align=\"center\" valign=\"middle\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">\n";
		out+=Alerts[a][0];
		/*rtc=parseInt(Alerts[a][0]);
		rtc*=1000;
		var dat = new Date(rtc);
		rtc+=(dat.getTimezoneOffset()*60000);
		dat = new Date(rtc);
		var temp=""+dat;
		out+=temp.substring(0, 24);*/
		out+="		</font>\n";
		out+="	</td>\n";
		//--------------------
		out+="	<td align=\"center\">\n";
		out+="		<font size=\"1\" face=\"Verdana\">"+Alerts[a][2]+"</font>\n";
		out+="	</td>\n";
		//--------------------
		out+="	<td align=\"center\">\n";
		out+="		<a href=\"\" onclick=\"ChgSltSts();return false;\">";
		out+="		<font size=\"1\" face=\"Verdana\">";
		out+=Alerts[a][1];
		out+="		</font>\n";
		out+="		</a>\n";
		out+="	</td>\n";
		//--------------------
		for(var b=3;b<Alerts[a].length;b++)
		{
			out+="	<td align=\"center\">\n";
			out+="		<a href=\"\" onclick=\"return false;\">";
			out+="		<font size=\"1\" face=\"Verdana\">";
			out+=Alerts[a][b];
			out+="		</font>\n";
			out+="		</a>\n";
			out+="	</td>\n";
		}
		out+="</tr>\n";
	}
	out+="</table>\n";
	return out;
}
//=================================================

function rcvIOs(Datos)
{
	hindex++;
	if(hindex>=Hsize)
		hindex=0;
	var out="";
	var inidx=0;
	Datos=Datos.responseText;
	var StructSize=28;
	Number_Of_Inputs=(Datos.length/StructSize)
	ioflags[hindex]= new Array(Number_Of_Inputs);
	tiempo[hindex]= new Array(Number_Of_Inputs);
	ocupacion[hindex]= new Array(Number_Of_Inputs);
	conteo[hindex]= new Array(Number_Of_Inputs);
	ioLTC[hindex]= new Array(Number_Of_Inputs);
	//----------------------------------------------------
	while(inidx<Number_Of_Inputs)
	{
		//--------------------------------- flags
		temp=Datos.substring(StructSize*inidx+0,StructSize*inidx+4);
		ioflags[hindex][inidx]=ByToInt(temp);		
		if(ioflags[hindex][inidx]&1)
		{
			//--------------------------------- Muestras
			temp=Datos.substring(StructSize*inidx+4,StructSize*inidx+8);
			tiempo[hindex][inidx]=ByToInt(temp);
			//--------------------------------- ocupacion
			temp=Datos.substring(StructSize*inidx+8,StructSize*inidx+12);
			ocupacion[hindex][inidx]=ByToInt(temp);
			//---------------------------------	count
			temp=Datos.substring(StructSize*inidx+12,StructSize*inidx+16);
			conteo[hindex][inidx]=ByToInt(temp);
			//--------------------------------- LTC
			temp=Datos.substring(StructSize*inidx+16,StructSize*inidx+20);
			ioLTC[hindex][inidx]=ByToInt(temp);
		}
		else
		{
			tiempo[hindex][inidx]=hindex;
			temp=Datos.substring(StructSize*inidx+8,StructSize*inidx+12);
			ocupacion[hindex][inidx]=ByToInt(temp);
			conteo[hindex][inidx]=hindex;
		}
		inidx++;
	}
	if(hindex)
		return	rcvIOs2();
	else
		return "";
}
function rcvIOs2()
{
	var Tcount=0;
	var out="";
	//---------------------------------Title
	out="<br/><table border=\"1\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"table1\" bordercolor=\"#000000\" bgcolor=\"#c0c0c0\" width=\"90%\">\n";
	out+="<tr>\n";
	out+="<td align=\"center\"><font size=\"2\" face=\"Verdana\"><b>&#160;Info&#160;</b></font></td>\n";
	out+="<td align=\"center\"><font size=\"2\" face=\"Verdana\"><b>&#160;Conteo&#160;</b></font></td>\n";
	out+="<td align=\"center\"><font size=\"2\" face=\"Verdana\"><b>&#160;Ocupacion&#160;</b></font></td>\n";
	out+="</tr>\n";
	while(Tcount<Number_Of_Inputs)
	{
		if(ioflags[hindex] && ioflags[hindex][Tcount]&1)
		{
			out+="<tr>\n";
			out+="<td align=\"center\"><font size=\"1\" face=\"Verdana\">&#160;"+Str_Inputs+":"+(Tcount+1)+" "
			out+="LTC:";
			RTC=parseInt(ioLTC[hindex][Tcount]);
			if(RTC!=0)
			{
				RTC*=1000;
				dat = new Date(RTC);
				RTC+=(dat.getTimezoneOffset()*60000);
				var dat = new Date(RTC);
			}
			else
				var dat="";// */
			out+=dat+" ";
			if(ioflags[hindex][Tcount]&0x10)
				out+="Enab";
			else
				out+="Disab";
			if(ioflags[hindex][Tcount]&0x20)
				out+=" Fail";
			out+="&#160;</font></td>\n";
			out+="<td align=\"center\"><font size=\"2\" face=\"Verdana\">&#160;"+(conteo[hindex][Tcount]-conteo[hindex-1][Tcount])+"&#160;</font></td>\n";
			out+="<td align=\"center\"><font size=\"2\" face=\"Verdana\">&#160;%"+Math.round((1000*(ocupacion[hindex][Tcount]-ocupacion[hindex-1][Tcount]))/(tiempo[hindex][Tcount]-tiempo[hindex-1][Tcount]))/10+"&#160;</font></td>\n";
			out+="</tr>\n";
		}
		else
		{
			out+="<tr>\n";
			out+="<td align=\"center\"><font size=\"2\" face=\"Verdana\"><b>&#160;"+Str_Output+":"+(Tcount+1)+"&#160;</b></font></td>\n";
			out+="<td align=\"center\"><font size=\"2\" face=\"Verdana\"><b>&#160;&#160;</b></font></td>\n";
			out+="<td align=\"center\"><font size=\"2\" face=\"Verdana\"><b>&#160;"+ocupacion[hindex][Tcount]+"&#160;</b></font></td>\n";
			out+="</tr>\n";
		}
		Tcount++;
	}
	out+="</table>\n";
	return out;
}
//=================================================
function rcvLogs(Datos)
{
	var temp="";
	var tempV=0;
	var count=0;
	Datos=Datos.responseText;
	document.getElementById("sample15Title").innerHTML="LOGS";//["+Datos.length+"]";
	temp=Datos.substring(0,4);
	tempV=ByToInt(temp);
	Datos=Datos.substring(4);
	if (LOG_Index>tempV)
	{
		temp=Datos.substring(LOG_Index);
		Datos=temp+Datos.substring(4,tempV);
	}
	else
		Datos=Datos.substring(LOG_Index,tempV);
	LOG_Index=tempV;
	count=Datos.length;
	document.getElementById("sizeofLog").innerHTML=count;
	if(!count)
		return;
	Datos=HTMLEncode(Datos);
	document.getElementById("LogTC").innerHTML+=Datos;
	count=document.getElementById("LogTC").innerHTML.length-20000;
	if(count>0)
		document.getElementById("LogTC").innerHTML=document.getElementById("LogTC").innerHTML.substring(count);
	document.getElementById("LogTC").scrollTop = document.getElementById("LogTCscc").offsetTop+document.getElementById('LogTC').scrollTop+55;
	LOGdirect(document.getElementById("LogTC").scrollTop +" "+ document.getElementById("LogTCscc").offsetTop);
}
//=================================================
function loadArq(Datos)
{
	Datos=Datos.responseText;
	Datos=Datos.substring(Datos.indexOf("<svg "));
	document.getElementById("DistFis").innerHTML=Datos;
	document.getElementById("sample8").style.width="420px"
	if (winList['sample8'])
	{
		winList['sample8'].open();
	}
}
//=================================================
function rcvphases(Datos)
{
 var RTC=Datos.getResponseHeader("Content-Type");
 var count=RTC.indexOf("RTC:");
 count+=4;
 RTC=RTC.substring(count);
 RTC=parseInt(RTC);
 if(RTC!=0)
 {
	RTC*=1000;
	dat = new Date(RTC);
	RTC+=(dat.getTimezoneOffset()*60000);
	var dat = new Date(RTC);
 }
 else
	var dat="";// */
 count=0;
 Datos=Datos.responseText;
 var phase=0;
 var phases=Datos.length;
 var temp="";
 var tempV=0;
 var out=0;
 var color=0;
 dat=0;
 //---------------------------------
 out="<table border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"table1\" bordercolor=\"#FFFFFF\" bgcolor=\"#FFFFFF\" id=\"phases\" width=\"100%\">\
 <tr align=\"center\" bgcolor=\"#808080\">\n\
 <td><font size=\"2\" face=\"Verdana\"> "+Str_Number+" </font></td>\n\
 <td><font size=\"2\" face=\"Verdana\"> "+Str_Status+" </font></td>\n\
 <td><font size=\"2\" face=\"Verdana\"> "+Str_Extra_Data+" </font></td>\n\
 <td><font size=\"2\" face=\"Verdana\"> "+Str_Error+" </font></td>\n\
 <td><font size=\"2\" face=\"Verdana\"> "+Str_Last_Time_Green+" </font></td>\n\
 <td><font size=\"2\" face=\"Verdana\"> "+Str_Controller+" </font></td>\n\
 </tr>\n";
 color="#E0E0E0";
 while(phase<phases)
 {
	temp=HexEncode(Datos.substring(phase+0,phase+4));
	if(!phase)
		LOGdirect(temp);
	else
		LOG(temp);
	//---------------------------------
	Datos=Datos.substring(temp);
	out+="<tr align=\"center\" ";
	if (count==0)
		out+="bgcolor=\"#E0E0E0\"";
	out+=">\n";
	count^=1;
	//---------------------------------//Numero de phase
		out+="<td><font size=\"1\" face=\"Verdana\">"+((phase/PhasesStructSize)+1)+"</font></td>\n"; 
	//--------------------------------- //Estado
	tempV=Datos.charCodeAt(phase+0);
	out+="<td width=\"5\" valign=\"middle\" >\n";//+(tempV>>4)+" "+(tempV&0x0F);
	if ((tempV&0x07)==0x07)
	{
		tempV&=0xF0;
		tempV|=0x12;
	}
	out+=color2svg(tempV);
	/*
	if (tempV&0xF0)
	{
		out+="<b><font size=\"1\" face=\"Verdana\" color=\"#000000\">";
		if (tempV&0x80)out+="S";
		if (tempV&0x40)out+="F";
		if (tempV&0x30)out+="T";
		out+="</font></b><br />\n";
	}
	out+="<svg width=\"22\" height=\"50\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n"
	out+="<rect x=\"0\" y=\"3\" width=\"20\" height=\"44\" fill=\"#000000\" stroke-width=\"0\" stroke=\"black\"/>\n"
	out+="<rect x=\"3\" y=\"6\" width=\"20\" height=\"44\" fill=\"#404040\" stroke-width=\"0\" stroke=\"black\"/>\n"
		color="\"#600000\"";
		if (tempV&1)color="\"#F00000\"";
	out+="<circle cx=\"13\" cy=\"16\" r=\"5\" stroke=\"black\" stroke-width=\"1\" fill="+color+"/>\n"
		color="\"#606000\"";
		if (tempV&2)color="\"#F0F000\"";
	out+="<circle cx=\"13\" cy=\"28\" r=\"5\" stroke=\"black\" stroke-width=\"1\" fill="+color+"/>\n"
		color="\"#006000\"";
		if (tempV&4)color="\"#00F000\"";
	out+="<circle cx=\"13\" cy=\"40\" r=\"5\" stroke=\"black\" stroke-width=\"1\" fill="+color+"/>\n"
	out+="</svg>\n"
	// */
	out+="</td>\n";
	//--------------------------------- Extra Data
	out+="<td><font size=\"1\" face=\"Verdana\">Current:";
	temp=Datos.substring(phase+17,phase+18);
	tempV=ByToSht(temp);
	if(tempV)
		out+=tempV;
	else
		out+="-";
	color=Datos.charCodeAt(phase+1);
	out+=" Color:";
	out+=(color&0x0F);
	//temp=HexEncode(Datos.substring(phase+28,phase+29));
	//out+=temp;
	color=(color/16)&0x0F;
	//-------------------------------------
	temp=Datos.substring(phase+19,phase+20);
	tempV=ByToSht(temp);
	out+="<br />";
	if(color&1)
		out+=tempV+"homs";
	else
		out+=tempV/1000+"w";
	out+=" ["+Datos.charCodeAt(phase+12)+"w]";
	//-------------------------------------
	temp=Datos.substring(phase+21,phase+22);
	tempV=ByToSht(temp);
	out+="<br />";
	if(color&2)
		out+=tempV+"homs";
	else
		out+=tempV/1000+"w";
	out+=" ["+Datos.charCodeAt(phase+13)+"w]";
	//-------------------------------------
	temp=Datos.substring(phase+23,phase+24);
	tempV=ByToSht(temp);
	out+="<br />";
	if(color&4)
		out+=tempV+"homs";
	else
		out+=tempV/1000+"w";
	out+=" ["+Datos.charCodeAt(phase+14)+"w]";
	//-------------------------------------
	out+="</font></td>\n";// */
	//--------------------------------- Error code
	out+="<td><font size=\"1\" face=\"Verdana\">";
	tempV=Datos.charCodeAt(phase+24);
	if (tempV&1)out+=Str_Lack_Red+"<br />\n";
	if (tempV&2)out+=Str_Lack_Yellow+"<br />\n";
	if (tempV&4)out+=Str_Lack_Green+"<br />\n";
	if (tempV&8)out+="Min Green Time<br />\n";
	if (tempV&16)out+=Str_Lack_Red.toLowerCase()+"<br />\n";
	if (tempV&32)out+=Str_Lack_Yellow.toLowerCase()+"<br />\n";
	if (tempV&64)out+=Str_Lack_Green.toLowerCase()+"<br />\n";
	if (tempV&128)out+="Min Red Time<br />\n";
	tempV=Datos.charCodeAt(phase+25);
	if (tempV&1)out+=Str_Err_Electric_Red+"<br />\n";
	if (tempV&2)out+=Str_Err_Electric_Yellow+"<br />\n";
	if (tempV&4)out+=Str_Err_Electric_Green+"<br />\n";
	if (tempV&8)out+="Err Report<br />\n";
	if (tempV&16)out+="Err Flag Flashing<br />\n";
	if (tempV&32)out+="Err Flag Flank<br />\n";
	if (tempV&64)out+="Err Flag Service<br />\n";
	if (tempV&128)out+="Err Signal Sync<br />\n";
	out+=HexEncode(Datos.substring(phase+24,phase+28))+"<br />\n";
	out+=HexEncode(Datos.substring(phase+28,phase+32))+"<br />\n";
	out+="</font></td>\n";
	// */
	//--------------------------------- Ultimo cambio de Verde
	out+="<td align=\"center\" valign=\"middle\"><font size=\"1\" face=\"Verdana\">\n";
	//temp=Datos.substring(phase+8,phase+12);
	//tempV=ByToInt(temp);
	//out+="LTR:"+tempV+"<br />";// */
	//temp=Datos.substring(phase+12,phase+16);
	//tempV=ByToInt(temp);
	//out+="LTW:"+tempV+"<br />";// */

	temp=Datos.substring(phase+40,phase+44);
	tempV=ByToInt(temp);
	if(tempV!=0)
	{
		tempV*=1000;
		dat = new Date(tempV);
		tempV+=(dat.getTimezoneOffset()*60000);// */
		dat = new Date(tempV);
	}
	else
		dat="";
	out+="LTG:"+dat+"<br />";// */
	temp=Datos.substring(phase+20,phase+24);
	tempV=ByToInt(temp);
	out+="Sec:"+tempV;// */+"<br />"
	out+="</font></td>\n";
	//--------------------------------- PLC address
	tempV=Datos.charCodeAt(phase+2);
	out+="<td><font size=\"1\" face=\"Verdana\">"+(tempV&0x0F)+"</font></td>\n";
	//---------------------------------
	out+="</tr>";
	phase+=PhasesStructSize;
 } 
 out+="</table>";
 return out;
}
function rcvphases2(Datos)
{
 Datos=Datos.responseText;
 var phaseC=0;
 var phase=0;
 var color=null;
 var phases=Datos.length;
 var temp=0;
 var flags=0;
 var out=0;
 //---------------------------------Title
 out=document.getElementById("sample8Title");
 out.innerHTML=Str_Intersection;
 //---------------------------------
 while(phase<phases)
 {
	//--------------------------------- //Estado
	flags=0;
	tempV=Datos.charCodeAt(phase+0);
	if (tempV&0xF0)
	{
		if (tempV&0x80)flags+=8;
		if (tempV&0x40)flags+=4;
		if (tempV&0x30)flags+=1;
	}
	//------------------------------------------------------------
	out = document.getElementById("phase"+phaseC+"R");
	if(out!=null)
	{
		if(tempV&1)
		{
			color=" rgb(240,0,0)";
			temp=getgroup(out,"style","fill");
			if(flags&1 && color==temp)
				color=" rgb(127,127,127)";
			setgroup(out,"style", "fill:"+color);
		}
		else
			setgroup(out,"style", "fill:rgb(127,127,127)");
	}
	//------------------------------------------------------------
	out = document.getElementById("phase"+phaseC+"Y");
	if(out!=null)
	{
		if(tempV&2)
		{
			color=" rgb(240,240,0)";
			temp=getgroup(out,"style","fill");
			if(flags&1 && color==temp)
				color=" rgb(127,127,127)";
			setgroup(out,"style", "fill:"+color);
		}
		else
			setgroup(out,"style", "fill:rgb(127,127,127)");
	}
	//------------------------------------------------------------
	out = document.getElementById("phase"+phaseC+"G");
	if(out!=null)
	{
		if(tempV&4)
		{
			color=" rgb(0,240,0)";
			temp=getgroup(out,"style","fill");
			if(flags&1 && color==temp)
				color=" rgb(127,127,127)";
			setgroup(out,"style", "fill:"+color);
		}
		else
			setgroup(out,"style", "fill:rgb(127,127,127)");
	}
	//------------------------------------------------------------
	if(out==null)
	{
		out = document.getElementById("phase"+phaseC);
		switch(tempV&7)
		{
			case 1:
				color=" rgb(240, 0, 0)";
			break;
			case 2:
				color=" rgb(240, 240, 0)";
			break;
			case 4:
				color=" rgb(0, 240, 0)";
			break;
			default:
				color=" rgb(127, 127, 127)";
			break;
		}
		if(out!=null)
		{
			if(flags&1)
			{
				tempV=getgroup(out,"style","fill");
				if(tempV==color)
				color=" rgb(127, 127, 127)";
			}
			setgroup(out,"style", "fill:"+color);//+";stroke:"+color
		}
	}
	phase+=PhasesStructSize;
	phaseC++;
 }
}
function rcvphases3(Datos)
{
	var RTC=Datos.getResponseHeader("Content-Type");
	var count=RTC.indexOf("RTC:");
	count+=4;
	RTC=RTC.substring(count);
	RTC=parseInt(RTC);
	if(RTC!=0)
	{
		RTC*=1000;
		dat = new Date(RTC);
		RTC+=(dat.getTimezoneOffset()*60000);
		var dat = new Date(RTC);
	}
	else
		var dat="";// */
	Datos=Datos.responseText;
	var PhObj=new Object();
	PhObj.Datos=Datos.slice();
	PhObj.Date=dat;
	PhHist.push(PhObj);
	PhHist.shift();
	if(PhHist[PhHist.length-1])
	{
		Datos=PhHist[PhHist.length-1].Datos.slice();
		dat=PhHist[PhHist.length-1].Date;
	}
	else
	{
		Datos=0;
		dat=""
	}
	var count=0;
	var phase=0;
	var Y,X;
	var State=null;
	var phases=Datos.length;
	phases/=PhasesStructSize;
	var temp=0;
	var flags=0;
	var out=0;
	var yspt=14;
	//---------------------------------
	out="<svg width=\""+(fullscaleX+65)+"\" height=\""+(100+(yspt*phases))+"\" xmlns=\"http://www.w3.org/2000/svg\">\
	<title>"+Str_Phase_Status+" "+PhHist.length+" "+dat+"</title>\
	<defs>\
		<linearGradient id=\"grad1\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\
		  <stop offset=\"0%\" style=\"stop-color:rgb(255,255,250);stop-opacity:1\" />\
		  <stop offset=\"100%\" style=\"stop-color:rgb(255,255,255);stop-opacity:0\" />\
		</linearGradient>\
	</defs>\
	<rect fill=\"#FFFFFF\" stroke=\"#FFFFFF\" x=\"1\" y=\"1\" width=\""+(fullscaleX+65)+"\" height=\""+(100+(yspt*phases))+"\" id=\"fondo\"/>";
	for(var phase=0;phase<phases;phase++)
	{
		//--------------------------------- PLC Number
		tempV=Datos.charCodeAt((phase*PhasesStructSize)+3);
		tempV&=0x07;
		out+="<text fill=\"#000000\" x=\""+(fullscaleX+3)+"\" y=\""+(22+(yspt*phase))+"\" stroke-width=\"0\" font-size=\"14\" font-family=\"Monospace\" text-anchor=\"start\" xml:space=\"preserve\">["+(phase+1)+"]."+(tempV)+"</text>";
		//--------------------------------- color
		tempV=Datos.charCodeAt((phase*PhasesStructSize)+0);
	}
	for(var temp=0;temp<(fullscaleX/Pxs);temp++)
	{
		if(PhHist[temp])
		{
			Datos=PhHist[temp].Datos;
			dat=PhHist[temp].Date;
		}
		else
		{
			Datos=0;
			dat=""
		}
		X=(fullscaleX-(Pxs*(PhHist.length-temp)))+5;
		for(var phase=0;phase<phases;phase++)
		{
			if(Datos)
				tempV=Datos.charCodeAt((phase*PhasesStructSize)+0);
			else
				tempV=0;
			color="\"#404040\"";
			if ((tempV&0x07)==0x07)
				tempV=0x12;
			if (tempV&1)color="\"#F00000\"";
			if (tempV&2)color="\"#C0C000\"";
			if (tempV&4)color="\"#00A000\"";
			Y=(20+(yspt*phase));
			if (tempV&0x30)
			{
				out+="<line id=\"svg_13\" y1=\""+Y+"\" x1=\""+X+"\" y2=\""+Y+"\" x2=\""+(X+(Pxs/4))+"\" stroke="+color+" fill=\"none\" stroke-width=\"6\"/>";
				out+="<line id=\"svg_13\" y1=\""+Y+"\" x1=\""+(X+(Pxs/2))+"\" y2=\""+Y+"\" x2=\""+(X+(Pxs/2)+(Pxs/4))+"\" stroke="+color+" fill=\"none\" stroke-width=\"6\"/>";
			}
			else
				out+="<line id=\"svg_13\" y2=\""+Y+"\" x2=\""+(X+(Pxs))+"\" y1=\""+Y+"\" x1=\""+X+"\" stroke="+color+" fill=\"none\" stroke-width=\"8\"/>";
		}
		if(dat!="")
			out+="<g transform=\"translate("+(X+8)+" "+(15+(yspt*(phases)))+")\"><text fill=\"#000000\" x=\"-5\" y=\"5\" transform=\"rotate(50)\" stroke-width=\"0\" font-size=\"9\" font-family=\"Monospace\" text-anchor=\"start\" xml:space=\"preserve\">-"+dat.getHours()+":"+dat.getMinutes()+":"+dat.getSeconds()+"</text></g>";
	}
	out+="<rect fill=\"url(#grad1)\" stroke-width=\"0\" x=\"1\" y=\"1\" width=\""+(fullscaleX/6)+"\" height=\""+(100+(yspt*phases))+"\"/>";
	out+="</svg>";
	return out;
}
//=================================================
function rcvNetStat(Datos)
{
 Datos=Datos.responseText;
  var temp="";
 var tempV=0;
 var out=0;
//---------------------------------Title
 txt=document.getElementById("sample16Title");
 txt.innerHTML="Net Status["+Datos.length+"]";
 //---------------------------------
	out="<ul>\n";
	out+="<li>IP\n";
		out+="<ul>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(0,2);
		tempV=ByToSht(temp);
		out+="Number of dropped packets at the IP:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(2,4);
		tempV=ByToSht(temp);
		out+="Number of received packets at the IP:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(4,6);
		tempV=ByToSht(temp);
		out+="Number of sent packets at the IP:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(6,8);
		tempV=ByToSht(temp);
		out+="Number of packets dropped due to wrong IP version or header length:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(8,10);
		tempV=ByToSht(temp);
		out+="Number of packets dropped due to wrong IP length, high byte.:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(10,12);
		tempV=ByToSht(temp);
		out+="Number of packets dropped due to wrong IP length, low byte.:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(12,14);
		tempV=ByToSht(temp);
		out+="Number of packets dropped since they were IP fragments:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(14,16);
		tempV=ByToSht(temp);
		out+="Number of packets dropped due to IP checksum errors:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(16,18);
		tempV=ByToSht(temp);
		out+="Number of packets dropped since they were neither ICMP, UDP nor TCP.:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="</ul>";
	out+="</li>";
	out+="<li>ICMP\n";
		out+="<ul>\n";
		//--------------------------------------------------------------Number of dropped ICMP packets.
		out+="<li>\n";
		temp=Datos.substring(18,20);
		tempV=ByToSht(temp);
		out+="Number of dropped ICMP packets.:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(20,22);
		tempV=ByToSht(temp);
		out+="Number of received ICMP packets.:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(22,24);
		tempV=ByToSht(temp);
		out+="Number of sent ICMP packets:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(24,26);
		tempV=ByToSht(temp);
		out+="Number of ICMP packets with a wrong type:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="</ul>";
	out+="</li>";
	out+="<li>TCP\n";
		out+="<ul>\n";
		//--------------------------------------------------------------Number of dropped ICMP packets.
		out+="<li>\n";
		temp=Datos.substring(26,28);
		tempV=ByToSht(temp);
		out+="Number of dropped TCP segments.:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(28,30);
		tempV=ByToSht(temp);
		out+="Number of recived TCP segments.:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(30,32);
		tempV=ByToSht(temp);
		out+="Number of sent TCP segments.:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(32,34);
		tempV=ByToSht(temp);
		out+="Number of TCP segments with a bad checksum.:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(34,36);
		tempV=ByToSht(temp);
		out+="Number of TCP segments with a bad ACK number.:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(36,38);
		tempV=ByToSht(temp);
		out+="Number of recevied TCP RST (reset) segments:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(38,40);
		tempV=ByToSht(temp);
		out+="Number of retransmitted TCP segments:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(40,42);
		tempV=ByToSht(temp);
		out+="Number of dropped SYNs due to too few connections was avaliable:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="<li>\n";
		temp=Datos.substring(42,44);
		tempV=ByToSht(temp);
		out+="Number of SYNs for closed ports, triggering a RST.:"+tempV+"\n";
		out+="</li>\n";
		//--------------------------------------------------------------
		out+="</ul>";
	out+="</li>";
	out+="</ul>";
 txt=document.getElementById("sample16Bdy");
 txt.innerHTML=out;
 DisplayOn('sample16Bdy');
}
//=================================================
function rcvInterprete(Datos)
{
	var StepName=["Run","Pause"];
	var out="";
	var temp="";
	var tempi=0;
	var pInterp=new Object();
	Datos=Datos.responseText;
	pInterp.run=Datos.charCodeAt(0);
	pInterp.script_file=Datos.substring(1,16);
	pInterp.script_file=pInterp.script_file.substring(0,pInterp.script_file.search("\0"));
	pInterp.reg=new Object();
	pInterp.reg.CurrentDate=Datos.substring(16,31);
	pInterp.reg.CurrentDate=pInterp.reg.CurrentDate.substring(0,pInterp.reg.CurrentDate.search("\0"));
	pInterp.reg.CurrentTable=Datos.substring(31,46);
	pInterp.reg.CurrentTable=pInterp.reg.CurrentTable.substring(0,pInterp.reg.CurrentTable.search("\0"));
	pInterp.reg.NexTime=Datos.substring(46,56);
	pInterp.reg.NexTime=pInterp.reg.NexTime.substring(0,pInterp.reg.NexTime.search("\0"));
	temp=Datos.substring(56,60);
	pInterp.reg.last_sync=ByToInt(temp);
	temp=Datos.substring(68,72);
	pInterp.reg.LSTCHG=ByToInt(temp);
	temp=Datos.substring(72,76);
	pInterp.reg.MCT=ByToInt(temp);
	temp=Datos.substring(76,80);
	pInterp.reg.NEXCHG=ByToInt(temp);
	temp=Datos.substring(92,96);
	pInterp.RTC=ByToInt(temp);	//utemp
	temp=Datos.substring(96,100);
	temp=ByToInt(temp)
	pInterp.StkIdx=(temp&7);
	pInterp.RunSync=(temp&8);	
	temp=Datos.substring(104,108);
	pInterp.code_size=ByToInt(temp);
	pInterp.ptr_code= new Array();
	temp=Datos.substring(280,284);
	pInterp.ptr_code[0]=ByToInt(temp);
	temp=Datos.substring(284,288);
	pInterp.ptr_code[1]=ByToInt(temp);
	temp=Datos.substring(288,292);
	pInterp.ptr_code[2]=ByToInt(temp);
	temp=Datos.substring(292,296);
	pInterp.ptr_code[3]=ByToInt(temp);
	temp=Datos.substring(296,300);
	pInterp.StartCode=ByToInt(temp);
	pInterp.code=Datos.substring(300);
	//---------------------------------------------------------------------------------------------------------------
	temp=pInterp.code.substring((pInterp.ptr_code[pInterp.StkIdx]-pInterp.StartCode));
	tempi=temp.search("\0");
	temp=pInterp.code.substring(0,(pInterp.ptr_code[pInterp.StkIdx]-pInterp.StartCode)+tempi);
	temp+="«";
	temp+=pInterp.code.substring((pInterp.ptr_code[pInterp.StkIdx]-pInterp.StartCode)+tempi);
	pInterp.code=temp;
	pInterp.code=decompilador(pInterp.code);
	//---------------------------------------------------------------------------------------------------------------
	tempi=pInterp.code.search("«");
	temp=HTMLEncode(pInterp.code.substring(0,tempi));
	temp+="&#160;&#160;&#160;<b><font size=\"2\" face=\"Verdana\" color=\"#FFFFFF\">&#60;&#60;----["+(pInterp.ptr_code[pInterp.StkIdx]-pInterp.StartCode)+":"+(pInterp.RTC-pInterp.reg.last_sync)+"]</font></b>\n";
	temp+=HTMLEncode(pInterp.code.substring(tempi+1));
	pInterp.code=temp;
	//alert(pInterp.code);// */
	//---------------------------------------------------------------------------------------------------------------
	out+="<table border=\"0\" cellpadding=\"4\" cellspacing=\"0\" bgcolor=\"#000000\"  width=\"%100\">\n\
	<tr><td align=\"left\">\n\
	<div id=\"interpCode\" style=\"overflow:auto;height: 1050px; width: 500px;color:#00FF00;font-family:Terminal;font-size:8px;\" ondblclick=\"this.innerHTML='';\">\n";
	out+=pInterp.code;
	out+="</div>\n\
	</td><td align=\"left\">\n\
	<div id=\"interpVars\" style=\"overflow:auto;height: 1050px; width: 300px;color:#00FF00;font-family:Terminal;font-size:8px;\" >\n";
	out+="File Name ["+HTMLEncode(pInterp.script_file)+"]<br />\n";
	out+="Time Scheduler ["+HTMLEncode(pInterp.reg.CurrentTable)+"<br />\n";
	out+="Date ["+HTMLEncode(pInterp.reg.CurrentDate)+"]<br />\n";
	out+="Nex Time ["+HTMLEncode(pInterp.reg.NexTime)+"]<br />\n";
	out+="Step [";
	if(pInterp.run>1)
		out+=pInterp.run;
	else
		out+=StepName[pInterp.run];
	out+="]<br />\n";
	out+="LTS [";
	if(pInterp.reg.last_sync!=0)
	{
		temp=(pInterp.reg.last_sync+1)*1000;
		dat = new Date(temp);
		temp+=(dat.getTimezoneOffset()*60000);
		temp = new Date(temp);
	}
	else
		temp="";// */
	out+=temp;
	out+="]<br />\n";
	out+="RTC [";
	if(pInterp.RTC!=0)
	{
		temp=(pInterp.RTC)*1000;
		dat = new Date(temp);
		temp+=(dat.getTimezoneOffset()*60000);
		temp = new Date(temp);
	}
	else
		temp="";// */
	out+=temp;
	out+="]<br />\n";
	out+="RunTime ["+(pInterp.RTC-pInterp.reg.last_sync)+"]<br />\n";
	out+="Stack Deep ["+pInterp.StkIdx+"]<br />\n";
	out+="Run Sync ["+pInterp.RunSync+"]<br />\n";
	out+="Code size ["+pInterp.code_size+"]<br />\n";
	out+="ptr_code[Stkdeep]:"+pInterp.ptr_code[pInterp.StkIdx]+"<br />\n"; // */
	out+="Start Code:"+pInterp.StartCode+"<br />\n"; // */
	out+="MCT ["+(pInterp.reg.MCT)+"]<br />\n"; // */
	//-------------------------------
	out+="LSTCHG [";
	//out+=pInterp.reg.LSTCHG;
	temp=(pInterp.reg.LSTCHG)*1000;
	dat = new Date(temp);
	temp+=(dat.getTimezoneOffset()*60000);
	temp = new Date(temp);
	out+=temp;// */
	out+="]<br />\n";
	//-------------------------------
	out+="NEXCHG [";
	temp=(pInterp.reg.NEXCHG)*1000;
	dat = new Date(temp);
	temp+=(dat.getTimezoneOffset()*60000);
	temp = new Date(temp);
	out+=temp;
	out+="]<br />\n"; // */
	out+="</div>\n\
	</td></tr>\n\
	</table>\n";
	return out;
/*	tempi=pInterp.code.search("----");
	temp=pInterp.code.split("\n");
	temp=temp.length+tempi;
	LOG(CtrlIdx+" "+temp);
	if(document.getElementById("dbgscrl").checked)
		document.getElementById("interpCode").scrollTop =(temp/8)+55;//+document.getElementById('interpCode').scrollTop // */
}