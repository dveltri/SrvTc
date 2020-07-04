var url;
var language="ES";
var Log_En=0;
var PoolData=0;
var Reqest =  new Array();
var OBJs= new Array();
var FlyMnu;
/*---------------------------------------------------------------------------*/
function WebStart()
{
	url=document.location.href;
	if(url.indexOf("Log_En")!=-1)
		Log_En=1;
	if(url.indexOf("Log=1")!=-1)
		Log_En=1;
	if(url.indexOf("Log=0")!=-1)
		Log_En=0;
	url=url.substring(0,url.indexOf("/main."));
	//alert(url);
	if(language=='PO')
		LanguageToPO();
	if(language=='ES')
		LanguageToES();
	//-------------------------------------------
	winInit();
	InitFastSts();
	InitAlerts();
	InitList();
	InitWinOL();
	InitTcHttpConf();
	InitUsers();
	InitPlcSts();
	InitStadistic();
	InitWinSch();
	InitOL();
	//-------------------------------------------
	IniMenu();
	UL2Menu_ConvertMenu();
	document.getElementById("LOADING").style.visibility = 'hidden';
	FlyMnu = document.getElementById("divFlyMnu");
	FlyMnu.idx=0;
	intval=setInterval("fnc0()",250);
	GetUrlB('./getitems.jsp?sql=SELECT * FROM variables order by id',rcvList);
	return;
}

function fnc0()
{
	var digital = new Date();
	var ms = digital.getTime();
	if(OBJs.length)
	{
		var rv=GetUrl(OBJs[0]);
		if(rv==0 || rv==3)
		{
			OBJs[0].Status=0;
			OBJs.splice(0,1);
		}
	}
	if(Reqest[PoolData].Status!=1)
	{
		if(Reqest[PoolData].LstRqst<ms)
		{
			//LOG(Reqest[PoolData].LstRqst+" "+ms+" "+(ms-Reqest[PoolData].LstRqst)+"\n");
			Reqest[PoolData].Status=1;
			Reqest[PoolData].url=Reqest[PoolData].Url;
			if(Reqest[PoolData].FncUrl)
				Reqest[PoolData].url=Reqest[PoolData].FncUrl;
			Reqest[PoolData].fnc=RcvMoni;
			Reqest[PoolData].LstRqst=ms+(Reqest[PoolData].Refresh-5);
			OBJs.push(Reqest[PoolData]);
		}
	}
	PoolData++;
	PoolData%=Reqest.length;
}

function RcvMoni(Datos)
{
	var result="";
	var hora = new Date();
	if(Datos && Datos.Obj)
	{
		if(Datos.status!=200)
		{
			result=Datos.status+" "+Datos.statusText;
		}
		else
		{
			if(Datos.Obj.Fnc)
				result = Datos.Obj.Fnc(Datos);
		}
		if(Datos.Obj.WinName)
		{
			document.getElementById(Datos.Obj.WinName+"Title").innerHTML="";
			document.getElementById(Datos.Obj.WinName+"Title").innerHTML+=Datos.Obj.Name;
			document.getElementById(Datos.Obj.WinName+"Hora").innerHTML=hora.getHours()+":"+hora.getMinutes()+":"+hora.getSeconds()+" ";
			document.getElementById(Datos.Obj.WinName+"Body").innerHTML=result;
		}
		if(Datos.Obj.Dest)
		{
			if(Datos.Obj.Dest.innerHTML)
				Datos.Obj.Dest.innerHTML=result;
			if(Datos.Obj.Dest.value)
				Datos.Obj.Dest.value=result;
		}
		Datos.Obj.Status=0;
		return;
	}
	else
	{
		LOG("No data!\n");
	}
}

function CountItem(Aray,Item)
{
	var ret=0;
	for(var i=0;i<Aray.length;i++)
	{
		if(Item!=Aray[i])ret++;
	}
	return ret;
}

function ByToInt(Datos)
{
	var temp=0;
	temp+=Datos.charCodeAt(3)<<24;
	temp+=Datos.charCodeAt(2)<<16;
	temp+=Datos.charCodeAt(1)<<8;
	temp+=Datos.charCodeAt(0);
	return temp;
}
function ByToSht(Datos)
{
	var temp=0;
	temp+=Datos.charCodeAt(1)<<8;
	temp+=Datos.charCodeAt(0);
	return temp;
}
function roundNumber(num, dec) 
{
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function Resize()
{
	LOGdirect("["+document.body.scrollWidth+" "+document.documentElement.clientHeight+"]");
}

/*---------------------------------------------------------------------------*/
function showFlyMnu(evt,obj)
{
	FlyMnu.innerHTML = obj.HTML;
	FlyMnu.TimeOut = obj.TimeOut;
	if(FlyMnu.TimeOut==0 && obj.HTML.indexOf("hideFlyMnu")==-1)
		FlyMnu.innerHTML+="<input type=\"button\" onclick=\"hideFlyMnu("+FlyMnu.idx+");\" value=\""+Str_Close+"\"  class=\"INTEXT2\" />\n";
	FlyMnu.style.display = "block";
	if(evt)
	{
		if(evt.pageX)
		{
			FlyMnu.style.left = evt.pageX + 10 + 'px';
			FlyMnu.style.top = evt.pageY + 10 + 'px';
		}
	}
	FlyMnu.style.zIndex = ++winCtrl.maxzIndex;
	FlyMnu.idx=obj.idx;
	FlyMnu.Mouse=1;
	if(FlyMnu.TimeOut>0)
		FlyMnu.Tout=setTimeout("hideFlyMnu("+FlyMnu.idx+");",(FlyMnu.TimeOut*2));
	else
		FlyMnu.Tout=null;
}
function SetFlyMnu(html)
{
	FlyMnu.innerHTML =html;
	if(FlyMnu.TimeOut==0 && html.indexOf("hideFlyMnu")==-1)
		FlyMnu.innerHTML+="<input type=\"button\" onclick=\"hideFlyMnu("+FlyMnu.idx+");\" value=\""+Str_Close+"\"  class=\"INTEXT2\" />\n";
}
function outFlyMnu(idx)
{
	if(FlyMnu.idx==0)
		return;
	if(FlyMnu.idx!=idx)
		return;
	if(FlyMnu.Mouse==0)
		return;
	FlyMnu.Mouse=0;
	if(FlyMnu.TimeOut>0)
		FlyMnu.Tout=setTimeout("hideFlyMnu("+FlyMnu.idx+");",FlyMnu.TimeOut);
	else
		FlyMnu.Tout=null;
	
}
function overFlyMnu(idx)
{
	if(FlyMnu.idx==0)
		return;
	if(FlyMnu.idx!=idx)
		return;
	FlyMnu.Mouse=1;
  FlyMnu.style.display = "block";
	FlyMnu.style.zIndex = ++winCtrl.maxzIndex;
  clearInterval(FlyMnu.Tout);
}
function hideFlyMnu(idx)
{
	/*var inp=FlyMnu.getElementsByTagName("input");
	var x;
	var i=0;
	x=document.activeElement;
	for(i=0;i<inp.length;i++)
	{
		if((inp[i].id)==(x.id))
		{
			FlyMnu.Tout=setTimeout("hideFlyMnu("+idx+");",FlyMnu.TimeOut);
			return;
		}
	}*/
	FlyMnu.idx=0;
  FlyMnu.style.display = "none";
}
/*---------------------------------------------------------------------------*/