var url;
var language="ES";
var Log_En=0;
var PoolData=0;
var Reqest =  new Array();
var URLs= new Array();
var FNCs= new Array();
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
	var d = new Date();
	var ms = d.getTime();
	if(URLs.length && enProceso==false)
	{
		GetUrl(URLs[0],FNCs[0]);
		FNCs.splice(0,1);
		URLs.splice(0,1);
		return;
	}
	//else
	{
		if(Reqest[PoolData].Status==0)
		{
			if(Reqest[PoolData].LstRqst<ms)
			{
				//LOG(Reqest[PoolData].LstRqst+" "+ms+" "+(ms-Reqest[PoolData].LstRqst)+"\n");
				Reqest[PoolData].LstRqst=ms+(Reqest[PoolData].Refresh-5);
				Reqest[PoolData].Status=1;
				GetUrlB(Reqest[PoolData].Url,RcvMoni);
			}
			else
			{
				PoolData++;
				PoolData%=Reqest.length;
			}
		}
		else
		{
			LOG(Reqest[PoolData].Status+"\n");
		}
		if(Reqest[PoolData].Status==-1)
		{
			PoolData++;
			PoolData%=Reqest.length;
		}
	}
}

function RcvMoni(Datos)
{
	var out="";
	var hora = new Date();
	if(Datos && Reqest[PoolData].Status==1)
	{
		if(Datos.status==200)
		{
			if(Reqest[PoolData].WinName)
			{
				document.getElementById(Reqest[PoolData].WinName+"Title").innerHTML="";
				//document.getElementById(Reqest[PoolData].WinName+"Title").innerHTML+="<img src='./img/reload.png' onclick='chgsts("+PoolData+");' width='14' height='14' /> ";
				document.getElementById(Reqest[PoolData].WinName+"Title").innerHTML+=Reqest[PoolData].Name;
				document.getElementById(Reqest[PoolData].WinName+"Hora").innerHTML=hora.getHours()+":"+hora.getMinutes()+":"+hora.getSeconds()+" ";
				document.getElementById(Reqest[PoolData].WinName+"Body").innerHTML=Reqest[PoolData].Fnc(Datos);
			}
			else
			{
				Reqest[PoolData].Fnc(Datos);
			}
		}
		else
		{
			if(Reqest[PoolData].WinName)
				document.getElementById(Reqest[PoolData].WinName+"Body").innerHTML=Datos.status+" "+Datos.statusText;
		}
		Reqest[PoolData].Status=0;
	}
	PoolData++;
	PoolData%=Reqest.length;
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

function chgsts(Data)
{
	if(Reqest[Data].Status==-1)
		Reqest[Data].Status=0;
	else
		Reqest[Data].Status=-1;
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
