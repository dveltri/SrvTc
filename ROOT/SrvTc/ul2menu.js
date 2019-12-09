//AttachEvent(window,'load',UL2Menu_ConvertMenu,true);
var MenuElement;

function IniMenu(mnuElement)
{
	MenuElement
	out="<ul id=\"menu\" class=\"horizontal\" border=\"0\">\n";
	//=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=
	out+="<li>";
	out+="<img src=\"../img/conf.jpg\" width=\"18\" height=\"18\" border=\"0\" />"+Str_MN_Config;
	out+="<ul>\n";
		//-----------------------
		out+="<li><a href=\"\" onclick=\"ShowtUsers();return false\">";
		out+="<img src=\"../img/usergroup.png\" width=\"18\" height=\"18\" border=\"0\" /> "+Str_AdminUsers;
		out+="</a></li>\n";
		//-----------------------
		out+="<li>";
		out+="<img src=\"../img/sts.jpg\" width=\"18\" height=\"18\" border=\"0\" />\n"+Str_Statistic;
		out+="<ul>";
			//- - - - - - - - - - -
			out+="<li><a href=\"\" onclick=\"GetIOsListConf();return false\">";
			out+="<img src=\"../img/sts.jpg\" width=\"18\" height=\"18\" border=\"0\" />\n"+Str_MN_Config;
			out+="</li>\n";
			//- - - - - - - - - - -
			out+="<li><a href=\"\" onclick=\"GetIOsList();return false\">";
			out+="<img src=\"../img/sts.jpg\" width=\"18\" height=\"18\" border=\"0\" />\n"+Str_StatisticList;
			out+="</li>\n";
			//- - - - - - - - - - -
		out+="</ul></li>\n";
		//-----------------------
		out+="<li>";
		out+="<img src=\"../img/sch.jpg\" width=\"18\" height=\"18\" border=\"0\" /> "+Str_Scheduler;
		out+="<ul>";
			//- - - - - - - - - - -
			out+="<li><a href=\"\" onclick=\"GetSch('');return false\">";
			out+="<img src=\"../img/sch.jpg\" width=\"18\" height=\"18\" border=\"0\" /> "+Str_AdminScheduler;
			out+="</a></li>\n";
			//- - - - - - - - - - -
			out+="<li><a href=\"\" onclick=\"GetSchActList();return false\">";
			out+="<img src=\"../img/sch.jpg\" width=\"18\" height=\"18\" border=\"0\" /> "+Str_SchedulersFnc;
			out+="</a></li>\n";
			//- - - - - - - - - - -
		out+="</ul></li>\n";
		//-----------------------
		out+="<li>";
		out+="<img src=\"../img/TC3.png\" width=\"18\" height=\"18\" border=\"0\" /> "+Str_AdminDevice;
		out+="<ul>";
			//- - - - - - - - - - -
			out+="<li><a href=\"\" onclick=\"GetListHttp();return false\">";
			out+="<img src=\"../img/plc0.png\" width=\"18\" height=\"18\" border=\"0\" /> "+Str_ListDevice;
			out+="</a></li>\n";
			//- - - - - - - - - - -
			out+="<li><a href=\"\" onclick=\"AddtTcHttpConf();return false\">";
			out+="<img src=\"../img/plc0.png\" width=\"18\" height=\"18\" border=\"0\" /> "+Str_AddDeviceHttp;
			out+="</a></li>\n";
			//- - - - - - - - - - -
		out+="</ul></li>\n";
		//-----------------------
		out+="<li>";
		out+="<img src=\"../img/BolaDelMundo.png\" width=\"18\" height=\"18\" border=\"0\" />\n"+Str_Map;
		out+="<ul>";
			//- - - - - - - - - - -
			out+="<li><a href=\"\" onclick=\"AddtTcHttpConf();RefreshMapItem();return false;\">";
			out+="<img src=\"../img/BolaDelMundo.png\" width=\"18\" height=\"18\" border=\"0\" />\n"+Str_MapItem;
			out+="</a></li>\n";
			//- - - - - - - - - - -
			out+="<li><a href=\"\" onclick=\"GetUrlB('./getlist.jsp?cmps=*&tbl=mapitems&ord=variable',rcvMapList);return false;\">";
			out+="<img src=\"../img/BolaDelMundo.png\" width=\"18\" height=\"18\" border=\"0\" />\n"+Str_MapList;
			out+="</a></li>\n";
			//- - - - - - - - - - -
		out+="</ul></li>\n";
		//-----------------------
	out+="</ul></li>";
	//=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=
	out+="<li>";
	out+="<img src=\"../img/Graficos.jpg\" width=\"16\" height=\"16\" border=\"0\" />"+Str_MN_Info;
	out+="<ul>"
		//-----------------------
		out+="<li><a href=\"\" onclick=\"MapPos("+GlobView+");return false;\">";
		out+="<img src=\"../img/BolaDelMundo.png\" width=\"18\" height=\"18\" border=\"0\" />\n"+Str_Map;
		out+="</a></li>\n";
		//-----------------------
		out+="<li><a href=\"\" onclick=\"GetUrlB('./getitems.jsp?sql=SELECT * FROM variables order by id',rcvList);return false;\">\n";
		out+="<img src=\"../img/io.jpg\" width=\"18\" height=\"18\" border=\"0\" />\n"+Str_ListVariables;
		out+="</a></li>\n";		
		//-----------------------
		out+="<li><a href=\"\" onclick=\"alert("+Str_About_Msg+");return false;\">\n";
		out+="<img src=\"../img/file.png\" width=\"18\" height=\"18\" border=\"0\" />\n"+Str_About;
		out+="</a></li>\n";		
		//-----------------------
	out+="</ul></li>";
	//=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=
	out+="</ul>\n";
	//-------------------------------------------------------------- */
	document.getElementById("divMenu").innerHTML=out;
}

function MenuSts(MnuX,MnuY,MnuOri)
{
	var DivMenu1 = document.getElementById('DivMenu');
	if (MnuX!=null)
	 DivMenu1.style.left =MnuX;
	if (MnuY!=null)
	 DivMenu1.style.top =MnuY;
	if (MnuOri=='v')
	 ChangeOrientation();
	DivMenu1.style.visibility='visible';
}

function UL2Menu_ConvertMenu()
{
	var menu=document.getElementById('menu');
	if (!menu) return;
	var menuIsHorizontal=HasClass(menu,'horizontal');
	var lis = menu.getElementsByTagName('li');
	for (var i=0,len=lis.length;i<len;i++)
	{
		var li=lis[i];
		var uls = li.getElementsByTagName('ul');
		if (!uls || uls.length==0) continue;
		var ul=uls[0];
		li.sub=ul;
		li.onmouseover=UL2Menu_ShowHead;
		li.onmouseout=UL2Menu_HideHead;
		li.isTop = li.parentNode==menu;
		li.isHorizontal = (menuIsHorizontal && li.isTop);
		if (li.addedArrow || li.isTop) continue;
		//var arrow=document.createElement('span');
		//arrow.innerHTML='&nbsp;&rArr;';
		//var a = li.getElementsByTagName('a');
		//if (a && a.length>0 && a[0].parentNode==li) a[0].innerHTML+='&nbsp;&rArr;';
		//else li.insertBefore(arrow,li.childNodes[1]);
		//li.addedArrow=true;
	}
}

function UL2Menu_ShowHead()
{
	var li=this;
	var x1;
	var y1;
	AddClass(li,'active');
	var xy=FindXYWH(li);
	if (li.isTop)
	{
		x1=(xy.x+(!li.isHorizontal?xy.w:0))+'px';
		li.sub.style.left=x1;
		y1=(xy.y+(li.isHorizontal?xy.h:0)-(li.isTop?0:1))+'px';
		li.sub.style.top=y1;
	}
	else 
	{
		li.sub.style.left=(li.offsetWidth-5)+'px';
		li.sub.style.top=li.offsetTop+'px';
	}
	li.sub.style.zIndex=winCtrl.maxzIndex+1
	li.sub.style.visibility='visible';
	LOG(x1 + " "+ y1+" " +li.sub.style.zIndex);	
}

function UL2Menu_HideHead()
{
	var li=this;
	li.sub.style.visibility='hidden';
	KillClass(li,'active');
	LOG("kil head" + this );
}

function FindXY(obj)
{
	var x=0,y=0;
	while (obj)
	{
		x+=obj.offsetLeft - (obj.scrollLeft || 0);
		y+=obj.offsetTop - (obj.scrollTop || 0);
		obj=null;
	}
	return {x:x,y:y};
}

function FindXYWH(obj)
{
	if (!obj) return { x:0, y:0, w:0, h:0 };
	var objXY = FindXY(obj);
	return { x:objXY.x, y:objXY.y, w:obj.offsetWidth||0, h:obj.offsetHeight||0 };
}

function AttachEvent(obj,evt,fnc,useCapture)
{
	if (obj.addEventListener)
	{
		obj.addEventListener(evt,fnc,useCapture);
		return true;
	}
	else
	{
		if (obj.attachEvent)
		{
			return obj.attachEvent("on"+evt,fnc);
		}
		else
		{
			obj['on'+evt]=fnc;
		}
	}
	return true;
}

function HasClass(obj,cName)
{ 
	return (!obj || !obj.className)?false:(new RegExp("\\b"+cName+"\\b")).test(obj.className) 
}

function AddClass(obj,cName)
{

	if (!obj) return;
	if (obj.className==null) obj.className='';
	obj.className+=(obj.className.length>0?' ':'')+cName;
	obj.style.zIndex= winCtrl.maxzIndex;
//	LOG("ZI:"+obj.style.zIndex);//= winCtrl.maxzIndex+1;
	return;
}

function KillClass(obj,cName)
{
	if (!obj) return;
	return obj.className=obj.className.replace(RegExp("^"+cName+"\\b\\s*|\\s*\\b"+cName+"\\b",'g'),'');
}

function KillCSS()
{
	var css=document.styleSheets[0];
	css.disabled=!css.disabled;
}

function ChangeOrientation()
{
	var menu = document.getElementById('menu');
	//menu.className=(menu.className=='vertical')?'horizontal':'vertical';
	if (menu.className=='vertical')
	{
		menu.className='horizontal'
		WCookie('MnuOri','h');
	}
	else
	{
		menu.className='vertical';
		WCookie('MnuOri','v');
	}
	UL2Menu_ConvertMenu(); //fix cached calculations
}

function checkS(event)
{
	// capture the mouse position
	if (event.button==4)
	{
		var posx = 0;
		var posy = 0;
		var e = window.event;
		if (e.pageX || e.pageY)
		{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY)
		{
			posx = e.clientX;
			posy = e.clientY;
		}
		//document.getElementById('DivMenu').innerHTML = 'Mouse position is: X='+posx+' Y='+posy;
		document.getElementById('DivMenu').style.left = posx;
		WCookie("MnuX",posx);
		document.getElementById('DivMenu').style.top = posy;
		WCookie("MnuY",posy);
		//document.oncontextmenu=new Function("return false") 
	}	
}

document.onmousedown=checkS;
