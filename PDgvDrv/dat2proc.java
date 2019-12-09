import java.net.*;
class dat2proc
{
	public byte[] RxData=null;
	public InetAddress IPAddress=null;
	public int port=0;
	dat2proc(byte[] RxDataO,InetAddress IPAddressO,int portO)
	{
		RxData=new byte[RxDataO.length];
		System.arraycopy(RxDataO,0,RxData,0,RxDataO.length);
		IPAddress=IPAddressO;
		port=portO;
	}
}
