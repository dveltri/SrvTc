var enProceso = 0;
var http = getHTTPObject();
http.fnc = 0;
http.time =0;

function GetUrlB(Url,Fnc)
{
	if(Fnc)
		OBJs.push({url:Url,fnc:Fnc});
	else
		OBJs.push({url:Url});
}

function fncnone(Data)
{
}

function GetUrl(obj)
{
	obj.urlx = obj.url;
	var digital = new Date();
	if (!http)
		return 1;
	if(obj.fnc && typeof obj.fnc != "function")
		return 2;
	if(enProceso!=0)
	{
		if((digital.getTime()-enProceso)>=1000)
		{
			enProceso=0;
			return 3;	// timeout
		}
		return 1; // busy
	}
	//----------------------------
	enProceso = digital.getTime();
	http.time = digital.getTime();
	http.Obj=obj;
	http.fnc=0;
	if(obj.fnc)
		http.fnc=obj.fnc;
	var hours = digital.getHours();
	var minutes = digital.getMinutes();
	var seconds = digital.getSeconds();
	obj.urlx=replaceAll(obj.urlx,'//','/');
	obj.urlx=obj.urlx.replace("http:/","http://");
	if(obj.urlx.indexOf("?")!=-1)
		obj.urlx=obj.urlx.replace("?","?AJAX="+enProceso+"&");
	else
		obj.urlx+="?AJAX="+enProceso;
	http.urlx=obj.urlx;
	http.open("GET", obj.urlx, true);//"POST"
	http.onreadystatechange = handleHttpResponse;
	//http.onload = handleHttpResponse;
	http.send(null);
	return 0;
}

function handleHttpResponse()  
{
	switch(http.readyState)
	{
		case 0:
		{
			if(Log_En>1)LOG("Request not initialized\n");
		}
		break;
		case 1:
		{
			if(Log_En>1)LOG("server connection established\n");
		}
		break;
		case 2:
		{
			if(Log_En>1)LOG("Request received\n");
		}
		break;
		case 3:
		{
			if(Log_En>1)LOG("Processing request\n");
		}
		break;
		case 4:
 		{
			if (http.status == 200)
			{
				if (http.responseText.indexOf('invalid') == -1)
				{
					if(Log_En>1)LOG("http.status:"+http.readyState+","+http.status+"\n");
					enProceso = 0;
					var chklogout=http.responseText;
					if(chklogout.indexOf("[*]")!=-1)
						window.location.href = '../index.htm';
					if(http.fnc)
						http.fnc(http);
				}
				else
				{
					if(Log_En>1)
					if(Log_En)LOG("Error:"+http.readyState+","+http.status+":"+http.statusText+"\n");LOG("Response invalid<br />");
				}
			}
			else
			{
				if(Log_En)LOG("Error:"+http.readyState+","+http.status+":"+http.statusText+"\n");
				enProceso = 0;
				if(http.fnc)
					http.fnc(http);
			}
		}
		break;
		default:
		{
			if(Log_En)LOG("Error:"+http.readyState+","+http.status+":"+http.statusText+"\n");
		}
		break;
	}
}

function getHTTPObject() 
{
	var xmlhttp;
	if (!xmlhttp && typeof XMLHttpRequest != 'undefined') 
	{
		try
		{
			xmlhttp = new XMLHttpRequest();
		}
		catch (e) 
		{
			xmlhttp = false;
		}
	}
	return xmlhttp;
}

function HTMLEncode(str)
{
	if(!str)
		return
	var aStr = str;
	var i = aStr.length
	var aRet = [];
	while (i) 
	{
		i--;
		var iC = aStr[i].charCodeAt();
		if ((iC > 127 || (iC>90 && iC<97) || (iC>1 && iC<32) || (iC>32 && iC<48) || (iC>57 && iC<65)) && iC!=10) 
		{
			if(iC<16)
				aRet.push('&#0'+iC+';');
			else
				aRet.push('&#'+iC+';');
		}
		else 
			if(iC==10)
				aRet.push('<br />\n');//aRet.push('&#'+iC+';');
			else
				if(iC==0)
					aRet.push(' 0x00\n');//aRet.push('&#'+iC+';');
				else
					aRet.push(aStr[i]);
	}
	return aRet.reverse().join('');
}

function HexEncode(str)
{
	var r="";
	var c=0;
	var h;
	while(c<str.length)
	{
		h=str.charCodeAt(c);
		h=h.toString(16);
		h=h.toUpperCase();
		while(h.length<2) h="0"+h;
		r+="0x"+h+" ";
		c++;
		if((c%4)==0)r+="\n";
	}
	return r;
}

function HexDecode(str)
{
	var r="";
	var ptr=0
	var ptrM=0
	while(ptr!=-1)
	{
		ptr=str.substring(ptrM+ptr).indexOf("0x");
		if(ptr!=-1)
		{
			ptrM+=ptr;
			ptr=0;
			r+=String.fromCharCode(str.substring(ptrM,ptrM+4));
			ptrM++;
		}
	}
	return r;
}