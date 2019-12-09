var MaxTop =24;	//24;
var WinCount = 3;
var winList = new Array();
var winCtrl = new Object();
var browser = new Browser();
var LstTop=[0,0,0];
var Row2Left=0;
var EnWinAutoPos=0;
//=============================================================================
// Initialization code.
//=============================================================================
function winInit() 
{
	winCtrl.maxzIndex						=	0;
	winCtrl.resizeCornerSize				=  18;
	winCtrl.minimizedTextWidth				= 100;
	
	winCtrl.inactiveFrameBackgroundColor	 = winactFrameBackgroundColor
	winCtrl.inactiveFrameBorderColor		 = winactFrameBorderColor
	winCtrl.inactiveTitleBarColor			 = winactTitleBarColor
	winCtrl.inactiveTitleTextColor			 = winactTitleTextColor;
	winCtrl.inactiveClientAreaBorderColor	 = winactClientAreaBorderColor;
	winCtrl.inactiveClientAreaScrollbarColor = winactClientAreaScrollbarColor;
	winCtrl.inactiveButtonsImage			 = winactButtonsImage;
	
	winCtrl.activeFrameBackgroundColor		 = wactFrameBackgroundColor
	winCtrl.activeFrameBorderColor			 = wactFrameBorderColor; 
	winCtrl.activeTitleBarColor				 = wactTitleBarColor;
	winCtrl.activeTitleTextColor			 = wactTitleTextColor;
	winCtrl.activeClientAreaBorderColor		 = wactClientAreaBorderColor;
	winCtrl.activeClientAreaScrollbarColor	 = wactClientAreaScrollbarColor;
	
	winCtrl.inMoveDrag					 = false;
	winCtrl.inResizeDrag				 = false;
	//----------------------------------------------------------------
}

function winUdate()
{
	winAutoPos();
	var elList = document.getElementsByTagName("div");
	for (var i = 0; i < elList.length; i++)
	{
		if (elList[i].className == "window")
		{
			winList[elList[i].id] = new Window(elList[i]);
		}
	}
}

function winAutoPosX()
{
}

function winAutoPos()
{
	if(EnWinAutoPos==0)
		return;
	var elList = document.getElementsByTagName("div");
	LstTop[0]=0;
	LstTop[1]=0;
	for (var i = 0; i < elList.length; i++)
	{
		if (elList[i].className == "window")
		{
			//if(winList[elList[i].id].isOpen==true)
			{
				if(LstTop[0]<=LstTop[1])
				{
					winList[elList[i].id].SetX(0);
					winList[elList[i].id].SetY(LstTop[0]);
				}
				else
				{
					winList[elList[i].id].SetX((Row2Left+18));
					winList[elList[i].id].SetY(LstTop[1]);
				}
				if(0==parseInt(winList[elList[i].id].frame.style.left))
				{
					LstTop[0]+=parseInt(winList[elList[i].id].clientArea.style.height)+48;
				}
				else
				{
					LstTop[1]+=parseInt(winList[elList[i].id].clientArea.style.height)+48;
				}
			}
		}
	}
}
// Determine browser and version.
function Browser() 
{
	var ua, s, i;
	this.isIE = false;	// Internet Explorer
	this.isNS = false;	// Netscape
	this.version = null;
	ua = navigator.userAgent;
	s = "MSIE";
	if ((i = ua.indexOf(s)) >= 0) 
	{
		this.isIE = true;
		this.version = parseFloat(ua.substr(i + s.length));
		return;
	}
	s = "Netscape6/";
	if ((i = ua.indexOf(s)) >= 0) 
	{
		this.isNS = true;
		this.version = parseFloat(ua.substr(i + s.length));
		return;
	}
	// Treat any other "Gecko" browser as NS 6.1.
	s = "Gecko";
	if ((i = ua.indexOf(s)) >= 0) 
	{
		this.isNS = true;
		this.version = 6.1;
		return;
	}
}

//=============================================================================
// Window Object
//=============================================================================
function winAdd(Name)
{
	var parent = document.getElementById("AllWindows");
	if(document.getElementById(Name))
		return 0;
	if(winList[Name])
		return 0;
	var out="\n\
<div id=\""+Name+"\" class=\"window\" FixedSize=\"0\" style=\"z-index: 1; left:0px; top:"+MaxTop+"px; width: 640px;\">\n\
	<div class=\"titleBar\">\n\
		<span id=\""+Name+"Title\" class=\"titleBarText\">...</span>\n\
		<span id=\""+Name+"Hora\" class=\"titleBarHora\">::</span>\n\
	</div>\n\
	<div class=\"clientArea\" id=\""+Name+"Body\" style=\"height: 80px;\">\n\
	</div>\n\
</div>\n";
	parent.innerHTML+=out;
	var elList = document.getElementById(Name);
	winList[elList.id] = new Window(elList);
	return 1;
}

function GetWinByName(Name)
{
	for (var i = 0; i < winList.length; i++)
	{
		if(winList[i].frame.id==Name)
			return winList[i];
	}
}

function winRemove(Name)
{
	winList[Name].close();
	var parent = document.getElementById("AllWindows");
	delete winList[Name];
	var child = document.getElementById(Name);
	parent.removeChild(child);
}

function Window(el) 
{
	var initLt, initWd, w, dw;
	var i, mapList, mapName;

	// Get window components.
	this.frame		 = el;
	this.titleBar		 = winFindByClassName(el, "titleBar");
	this.titleBarText		= winFindByClassName(el, "titleBarText");
	this.titleBarButtons = winFindByClassName(el, "titleBarButtons");
	this.clientArea	 = winFindByClassName(el, "clientArea");

	// Find matching button image map.
	if(this.titleBarButtons)
	{
		mapName = this.titleBarButtons.useMap.substr(1);
		mapList = document.getElementsByTagName("map");
		for (i = 0; i < mapList.length; i++)
			if (mapList[i].name == mapName)
	 		this.titleBarMap = mapList[i];
	}
	// Save colors.
	/*this.activeFrameBackgroundColor	= this.frame.style.backgroundColor;
	this.activeFrameBorderColor	 = this.frame.style.borderColor;
	this.activeTitleBarColor			= this.titleBar.style.backgroundColor;
	this.activeTitleTextColor	 	= this.titleBar.style.color;
	this.activeClientAreaBorderColor = this.clientArea.style.borderColor;
	if (browser.isIE)
		this.activeClientAreaScrollbarColor = this.clientArea.style.scrollbarBaseColor;
	*/
	// Save images.
	if(this.titleBarButtons)
	{
		this.activeButtonsImage	 = this.titleBarButtons.src;
		this.inactiveButtonsImage = this.titleBarButtons.longDesc;
	}

	// Set flags.
	this.isOpen	 	 = false;
	this.isMinimized = false;
	this.FixedPos	 = false;
	this.FixedSize	 = 3;

	// Set methods.
	this.open		= winOpen;
	this.close	 	= winClose;
	this.minimize	= winMinimize;
	this.restore	= winRestore;
	this.makeActive = winMakeActive;
	this.SetX		= winSetX;
	this.SetY		= winSetY;
	this.SetH		= winSetH;
	this.SetW		= winSetW;
	this.FixSize	= winFixSize;
	this.FixPos		= winFixPos;

	// Set up event handling.
	this.frame.parentWindow = this;

	this.frame.onmousemove	= winResizeCursorSet;
	this.frame.onmouseout	 = winResizeCursorRestore;
	this.frame.onmousedown	= winResizeDragStart;
	
	this.titleBar.parentWindow = this;
	this.titleBar.onmousedown = winMoveDragStart;
	this.clientArea.parentWindow = this;
	this.clientArea.onclick	 = winClientAreaClick;
	if(this.titleBarButtons)
	{
		for (i = 0; i < this.titleBarMap.childNodes.length; i++)
			if (this.titleBarMap.childNodes[i].tagName == "area")
	 		this.titleBarMap.childNodes[i].parentWindow = this;
	}
	// Save the inital frame width and position, then reposition
	// the window.
	initLt = this.frame.style.left;
	initWd = parseInt(this.frame.style.width);
	this.frame.style.left = -this.titleBarText.offsetWidth + "px";

	// For IE, start calculating the value to use when setting
	// the client area width based on the frame width.
	if (browser.isIE) 
	{
		this.titleBarText.style.display = "none";
		w = this.clientArea.offsetWidth;
		this.widthDiff = this.frame.offsetWidth - w;
		this.clientArea.style.width = w + "px";
		dw = this.clientArea.offsetWidth - w;
		w -= dw;	
		this.widthDiff += dw;
		this.titleBarText.style.display = "";
	}

	// Find the difference between the frame's style and offset widths. For IE, adjust the client area/frame width difference accordingly.
	w = this.frame.offsetWidth;
	this.frame.style.width = w + "px";
	dw = this.frame.offsetWidth - w;
	w -= dw;	
	this.frame.style.width = w + "px";
	if (browser.isIE)
		this.widthDiff -= dw;

	// Find the minimum width for resize.
	this.isOpen = true;	// Flag as open so minimize call will work.
	this.minimize();
	// Get the minimum width.
	if (browser.isNS && browser.version >= 1.2)
		// For later versions of Gecko.
		this.minimumWidth = this.frame.offsetWidth;
	else
		// For all others.
		this.minimumWidth = this.frame.offsetWidth - dw;

	// Find the frame width at which or below the title bar text will
	// need to be clipped.
	this.titleBarText.style.width = "";
	this.clipTextMinimumWidth = this.frame.offsetWidth - dw;

	// Set the minimum height.
	this.minimumHeight = 1;

	// Restore window. For IE, set client area width.
	this.restore();
	this.isOpen = false;	// Reset flag.
	initWd = Math.max(initWd, this.minimumWidth);
	this.frame.style.width = initWd + "px";
	if (browser.isIE)
		this.clientArea.style.width = (initWd - this.widthDiff) + "px";

	// Clip the title bar text if needed.
	if (this.clipTextMinimumWidth >= this.minimumWidth)
		this.titleBarText.style.width = (winCtrl.minimizedTextWidth + initWd - this.minimumWidth) + "px";

	// Restore the window to its original position.
	this.frame.style.left = initLt;
}

//=============================================================================
// Window Methods
//=============================================================================
function winOpen() 
{
	if (this.isOpen)
		return;
	this.makeActive();
	this.isOpen = true;
	if (this.isMinimized)
		this.restore();
	this.frame.style.visibility = "visible";
}

function winClose() 
{
	this.frame.style.visibility = "hidden";
	this.isOpen = false;
}

function winMinimize() 
{
	if (!this.isOpen || this.isMinimized)
		return;
	this.makeActive();
	this.restoreFrameWidth = this.frame.style.width;
	this.restoreTextWidth = this.titleBarText.style.width;
	this.clientArea.style.display = "none";
	if (this.minimumWidth)
		this.frame.style.width = this.minimumWidth + "px";
	else
		this.frame.style.width = "";
	this.titleBarText.style.width = winCtrl.minimizedTextWidth + "px";
	this.isMinimized = true;
}

function winRestore() 
{
	if (!this.isOpen || !this.isMinimized)
		return;
	this.makeActive();
	this.clientArea.style.display = "";
	this.frame.style.width = this.restoreFrameWidth;
	this.titleBarText.style.width = this.restoreTextWidth;
	this.isMinimized = false;
}

function winMakeActive() 
{
	if (winCtrl.active == this)
		return;
	// Inactivate the currently active window.
	if (winCtrl.active) 
	{
		//document.getElementById('dgv').innerHTML+="in de if [" + winCtrl.active.inactiveButtonsImage+"]<br />";
		winCtrl.active.frame.style.backgroundColor		= winCtrl.inactiveFrameBackgroundColor;
		winCtrl.active.frame.style.borderColor		 = winCtrl.inactiveFrameBorderColor;
		winCtrl.active.titleBar.style.backgroundColor = winCtrl.inactiveTitleBarColor;
		winCtrl.active.titleBar.style.color		 = winCtrl.inactiveTitleTextColor;
		winCtrl.active.clientArea.style.borderColor	 = winCtrl.inactiveClientAreaBorderColor;
		if (browser.isIE)
			winCtrl.active.clientArea.style.scrollbarBaseColor = winCtrl.inactiveClientAreaScrollbarColor;
		if (browser.isNS && browser.version < 6.1)
			winCtrl.active.clientArea.style.overflow = "hidden";
		if (winCtrl.active.inactiveButtonsImage)
			winCtrl.active.titleBarButtons.src = winCtrl.active.inactiveButtonsImage;
	}
	//else // Activate this window.
	{
	this.frame.style.backgroundColor	 = winCtrl.activeFrameBackgroundColor;
	this.frame.style.borderColor		 = winCtrl.activeFrameBorderColor;
	this.titleBar.style.backgroundColor	 = winCtrl.activeTitleBarColor;
	this.titleBar.style.color			 = winCtrl.activeTitleTextColor;
	this.clientArea.style.borderColor	 = winCtrl.activeClientAreaBorderColor;
	if (browser.isIE)
		this.clientArea.style.scrollbarBaseColor = winCtrl.activeClientAreaScrollbarColor;
	if (browser.isNS && browser.version < 6.1)
		this.clientArea.style.overflow = "auto";
	if (this.inactiveButtonsImage)
		this.titleBarButtons.src = winCtrl.activeButtonsImage;
	this.frame.style.zIndex = ++winCtrl.maxzIndex;
	//------------------------------------------------ Menu Alwais on top
	var mvar=document.getElementById("menu");
	if(mvar)
	{
		mvar.style.zIndex= winCtrl.maxzIndex+1;
		LOG("winCtrl.maxzIndex:" + winCtrl.maxzIndex);
		LOG("menu.Index:" + mvar.style.zIndex);
	}
	winCtrl.active = this;
	}
}

//=============================================================================
// Event handlers.
//=============================================================================
function winClientAreaClick(event) 
{
	this.parentWindow.makeActive();
}

//-----------------------------------------------------------------------------
// Window dragging.
//-----------------------------------------------------------------------------
function winSetX(X)
{
	X=parseInt("0"+X);
	this.frame.style.left=X+"px";
}

function winSetY(Y)
{
	Y=parseInt("0"+Y);
	if(Y<MaxTop)
		Y=MaxTop;
	this.frame.style.top=Y+"px";
}

function winFixSize(s)
{
	this.FixedSize=s;
}

function winFixPos(s)
{
	this.FixedPos=s;
}

function winMoveDragStart(event) 
{
	var target;
	var x, y;
	if (browser.isIE)
		target = window.event.srcElement.tagName;
	if (browser.isNS)
		target = event.target.tagName;
	if (target == "area" || this.parentWindow.FixedPos)
		return;
	this.parentWindow.makeActive();
	if (browser.isIE) 
	{
		x = window.event.x;
		y = window.event.y;
	}
	if (browser.isNS) 
	{
		x = event.pageX;
		y = event.pageY;
	}
	winCtrl.xOffset = winCtrl.active.frame.offsetLeft - x;
	winCtrl.yOffset = winCtrl.active.frame.offsetTop	- y;
	if (browser.isIE) 
	{
		document.onmousemove = winMoveDragGo;
		document.onmouseup	 = winMoveDragStop;
	}
	if (browser.isNS) 
	{
		document.addEventListener("mousemove",	winMoveDragGo,	true);
		document.addEventListener("mouseup",	winMoveDragStop,true);
		event.preventDefault();
	}
	winCtrl.inMoveDrag = true;
}

function winMoveDragGo(event) 
{
	var x, y;
	if (!winCtrl.inMoveDrag)
		return;
	if (browser.isIE) 
	{
		x = window.event.x;
		y = window.event.y;
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	if (browser.isNS) 
	{
		x = event.pageX;
		y = event.pageY;
		event.preventDefault();
	}
	if((x + winCtrl.xOffset)>0)
		winCtrl.active.frame.style.left = (x + winCtrl.xOffset) + "px";
	else
		winCtrl.active.frame.style.left ="0px"
	if((y + winCtrl.yOffset)>MaxTop)
		winCtrl.active.frame.style.top	= (y + winCtrl.yOffset) + "px";
	else
		winCtrl.active.frame.style.top	=MaxTop+"px"
}

function winMoveDragStop(event) 
{
	winCtrl.inMoveDrag = false;
	if (browser.isIE) 
	{
		document.onmousemove = null;
		document.onmouseup	 = null;
	}
	if (browser.isNS) 
	{
		document.removeEventListener("mousemove", winMoveDragGo,	 true);
		document.removeEventListener("mouseup",	 winMoveDragStop, true);
	}
	//winCtrl.active.titleBarText.innerHTML="["+winCtrl.active.frame.style.left+" "+winCtrl.active.frame.style.top+"]["+winCtrl.active.frame.style.width+" "+winCtrl.active.clientArea.style.height+"]";
}

//-----------------------------------------------------------------------------
// Window resizing.
//-----------------------------------------------------------------------------
function winSetH(H)
{
	H=parseInt("0"+H);
	this.clientArea.style.height=H+"px";
}

function winSetW(W)
{
	W=parseInt("0"+W);
	this.frame.style.width=W+"px";
	if(this.frame.style.left=="0px" && Row2Left<parseInt("0"+this.frame.style.width))
		Row2Left=parseInt("0"+this.frame.style.width);
}

function winResizeCursorSet(event) 
{
	var target;
	var xOff, yOff;

	if (this.parentWindow.isMinimized || winCtrl.inResizeDrag)
		return;
	if (browser.isIE)
		target = window.event.srcElement;
	if (browser.isNS)
		target = event.target;
	if (target != this.parentWindow.frame)
		return;
	if (browser.isIE) 
	{
		xOff = window.event.offsetX;
		yOff = window.event.offsetY;
	}
	if (browser.isNS) 
	{
		xOff = event.layerX;
		yOff = event.layerY;
	}
	winCtrl.resizeDirection = ""
	if (yOff <= winCtrl.resizeCornerSize)
		winCtrl.resizeDirection += "n";
	else if (yOff >= this.parentWindow.frame.offsetHeight - winCtrl.resizeCornerSize)
		winCtrl.resizeDirection += "s";
	if (xOff <= winCtrl.resizeCornerSize)
		winCtrl.resizeDirection += "w";
	else if (xOff >= this.parentWindow.frame.offsetWidth - winCtrl.resizeCornerSize)
		winCtrl.resizeDirection += "e";
	if (winCtrl.resizeDirection == "") 
	{
		this.onmouseout(event);
		return;
	}
	if (browser.isIE)
		document.body.style.cursor = winCtrl.resizeDirection + "-resize";
	if (browser.isNS)
		this.parentWindow.frame.style.cursor = winCtrl.resizeDirection + "-resize";
}

function winResizeCursorRestore(event) 
{
	if (winCtrl.inResizeDrag)
		return;
	if (browser.isIE)
		document.body.style.cursor = "";
	if (browser.isNS)
		this.parentWindow.frame.style.cursor = "";
}

function winResizeDragStart(event) 
{
	var target;
	if (browser.isIE)
		target = window.event.srcElement;
	if (browser.isNS)
		target = event.target;
	if((target != this.parentWindow.frame) || this.parentWindow.FixedSize==0)
		return;
	this.parentWindow.makeActive();
	if (this.parentWindow.isMinimized)
		return;
	if (browser.isIE) 
	{
		winCtrl.xPosition = window.event.x;
		winCtrl.yPosition = window.event.y;
	}
	if (browser.isNS) 
	{
		winCtrl.xPosition = event.pageX;
		winCtrl.yPosition = event.pageY;
	}
	winCtrl.oldLeft	 = parseInt(this.parentWindow.frame.style.left,	10);
	winCtrl.oldTop		= parseInt(this.parentWindow.frame.style.top,	 10);
	winCtrl.oldWidth	= parseInt(this.parentWindow.frame.style.width, 10);
	winCtrl.oldHeight = parseInt(this.parentWindow.clientArea.style.height, 10);
	if (browser.isIE) 
	{
		document.onmousemove = winResizeDragGo;
		document.onmouseup	 = winResizeDragStop;
	}
	if (browser.isNS) 
	{
		document.addEventListener("mousemove", winResizeDragGo,	 true);
		document.addEventListener("mouseup"	, winResizeDragStop, true);
		event.preventDefault();
	}
	winCtrl.inResizeDrag = true;
}

function winResizeDragGo(event) 
{
 var north, south, east, west;
 var dx, dy;
 var w, h;
 if (!winCtrl.inResizeDrag)
	return;
	north = false;
	south = false;
	east	= false;
	west	= false;
	if (winCtrl.resizeDirection.charAt(0) == "n")
		north = true;
	if (winCtrl.resizeDirection.charAt(0) == "s")
		south = true;
	if (winCtrl.resizeDirection.charAt(0) == "e" || winCtrl.resizeDirection.charAt(1) == "e")
		east = true;
	if (winCtrl.resizeDirection.charAt(0) == "w" || winCtrl.resizeDirection.charAt(1) == "w")
		west = true;
	if (browser.isIE) 
	{
		dx = window.event.x - winCtrl.xPosition;
		dy = window.event.y - winCtrl.yPosition;
	}
	if (browser.isNS) 
	{
		dx = event.pageX - winCtrl.xPosition;
		dy = event.pageY - winCtrl.yPosition;
	}
	if (west)
		dx = -dx;
	if (north)
		dy = -dy;
	if((winCtrl.active.FixedSize&4)!=0 && winCtrl.resizeDirection.length==2)
	{
		dy=dx;
		w = winCtrl.oldWidth  + dx;
		h = winCtrl.oldHeight + dy;
	}
	else
	{
		if((winCtrl.active.FixedSize&1)!=0)
			w = winCtrl.oldWidth  + dx;
		else
			w = winCtrl.oldWidth;
		if((winCtrl.active.FixedSize&2)!=0)
			h = winCtrl.oldHeight + dy;
		else
			h = winCtrl.oldHeight;
	}
	if (w <= winCtrl.active.minimumWidth) 
	{
		w = winCtrl.active.minimumWidth;
		dx = w - winCtrl.oldWidth;
	}
	if (h <= winCtrl.active.minimumHeight) 
	{
		h = winCtrl.active.minimumHeight;
		dy = h - winCtrl.oldHeight;
	}
	if (east || west) 
	{
		winCtrl.active.frame.style.width = w + "px";
		if (browser.isIE)
			winCtrl.active.clientArea.style.width = (w - winCtrl.active.widthDiff) + "px";
	}
	if (north || south)
		winCtrl.active.clientArea.style.height = h + "px";
	if (east || west) 
	{
		if (w < winCtrl.active.clipTextMinimumWidth)
			winCtrl.active.titleBarText.style.width = (winCtrl.minimizedTextWidth + w - winCtrl.active.minimumWidth) + "px";
		else
			winCtrl.active.titleBarText.style.width = "";
	}
	if (west)
		if((winCtrl.oldLeft - dx)>0)
			winCtrl.active.frame.style.left = (winCtrl.oldLeft - dx) + "px";
		else
			winCtrl.active.frame.style.left ="0px"
	if (north)
		if((winCtrl.oldTop	- dy)>MaxTop)
			winCtrl.active.frame.style.top	= (winCtrl.oldTop	- dy) + "px";
		else
			winCtrl.active.frame.style.top	=MaxTop+"px"	
	if (browser.isIE) 
	{
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	if (browser.isNS)
		event.preventDefault();
	//winCtrl.active.titleBarText.innerHTML="["+winCtrl.active.frame.style.left+" "+winCtrl.active.frame.style.top+"]["+winCtrl.active.frame.style.width+" "+winCtrl.active.clientArea.style.height+"]";
}

function winResizeDragStop(event) 
{
	winCtrl.inResizeDrag = false;
	if (browser.isIE) 
	{
		document.onmousemove = null;
		document.onmouseup	 = null;
	}
	if (browser.isNS) 
	{
		document.removeEventListener("mousemove", winResizeDragGo,	 true);
		document.removeEventListener("mouseup"	, winResizeDragStop, true);
	}
	if(winCtrl.active.ResizeFnc)
		winCtrl.active.ResizeFnc();
}

//=============================================================================
// Utility functions.
//=============================================================================

function winFindByClassName(el, className) 
{
	var i, tmp;
	if (el.className == className)
		return el;
	// Search for a descendant element assigned the given class.
	for (i = 0; i < el.childNodes.length; i++) 
	{
		tmp = winFindByClassName(el.childNodes[i], className);
		if (tmp != null)
	 return tmp;
	}
	return null;
}
