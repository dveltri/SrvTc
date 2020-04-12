import java.net.*;
class dat2proc
{
	public byte[] RxData=null;
	public InetAddress IPAddress=null;
	public int port=0;
	dat2proc(byte[] RxDataO,int length,InetAddress IPAddressO,int portO)
	{
		RxData=new byte[length+1];
		System.arraycopy(RxDataO,0,RxData,0,length);
		IPAddress=IPAddressO;
		port=portO;
	}
}
