import java.net.*;
import java.sql.*;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class SrvPdgvX
{
	private static final int quezise	=1000;
	private static BlockingQueue<String[]> queueP = new LinkedBlockingQueue<>(quezise*10);
	private static BlockingQueue<dat2proc> queuePd = new LinkedBlockingQueue<>(quezise);
	//---------------------------------------
	private static final int pdgv_Ver		=0x01;
	private static final int pdgv_TCP		=0x00;
	private static final int pdgv_UDP		=0x10;
	private static final int pdgv_None		=0x00;
	private static final int pdgv_Chs		=0x04;
	private static final int pdgv_Sum		=0x08;
	private static final int pdgv_Crc		=0x0C;
	//---------------------------------------
	private static final int CMD_RTC			=17;
	private static final int CMD_Msg			=18;
	private static final int CMD_GVars			=28;
	//---------------------------------------
	private static final int CmpCtr		=1;
	private static final int CmpIdS		=2;
	private static final int CmpIdT		=3;
	private static final int CmpSkS		=4;
	private static final int CmpSkT		=5;
	private static final int CmpLen		=6;
	private static final int CmpDat		=7;
	//---------------------------------------
	public static DatagramSocket serverSocket=null;
	public static byte[] sendData = new byte[1024];
	public static byte[] receiveData = new byte[1024];
	public static int SrvId=0;
	public static String drv="";
	//---------------------------------------
	public static String conection="jdbc:postgresql://localhost:5432/SrvDb";
	private static DatagramPacket sendPacketP;
	private static int log=1;
	private static Thread procdat,procsql;
	//----------------------------------------------------------------------*/
	public static int dgvsql(String InsSql,String UdtSql)
	{
		try
		{
			queueP.put(new String[]{InsSql,UdtSql});
		}
		catch ( Exception e )
		{
			System.err.println("\n\tErrUdtP:"+e.getClass().getName() + ":" + e.getMessage());
			return 2;
		}
		return 0;
	}
	
	//----------------------------------------------------------------------
	public static byte CalChs(byte[] pucBuffer)
	{
		byte CHS=0;
		int idx=CmpSkT;
		int size=0;
		int LenSz=0;
		CHS^=pucBuffer[CmpCtr];
		CHS^=pucBuffer[CmpIdS];
		CHS^=pucBuffer[CmpIdT];
		CHS^=pucBuffer[CmpSkS];
		CHS^=pucBuffer[CmpSkT];
		do
		{
			idx++;
			CHS^=pucBuffer[idx];
			size|=((pucBuffer[idx]&0x7F)<<LenSz);
			LenSz+=7;
		}
		while((pucBuffer[idx]&0x80)!=0);
		idx++;
		size-=1;
		while(size!=0)
		{
			CHS^=pucBuffer[idx];
			idx++;
			size--;
		}
		return CHS;
	}
	public static void main(String[] args) throws Exception
	{
		String InsSql="";
		String UdtSql="";
		String sql="";
		String str="";
		String id="";
		String typ="";
		String Sval="";
		String sts="";
		String model="";
		int Ival=0;
		int countloop=0;
		int idt=0;
		int timeout=0;
		int port=0;
		long temp=0;
		int THS=1;
		int THD=1;
		//-----------------------------------------------------
		drv=args[0];
		SrvId=Integer.parseInt(args[1]);
		port=Integer.parseInt(args[2]);
		if(args.length>3)THS=Integer.parseInt(args[3]);
		if(args.length>4)THD=Integer.parseInt(args[4]);
		if(args.length>5)log=Integer.parseInt(args[5]);
		//-----------------------------------------------------
		System.out.println("Drv Name:"+drv);
		System.out.println("Pdgv ID:"+SrvId);
		System.out.println("UDP port:"+port);
		//getmac();
		//-----------------------------------------------------
		DatagramPacket receivePacketP=null;
		InetAddress IPAddress=null;
		serverSocket = new DatagramSocket(port);
		//-----------------------------------------------------
		Connection c 	=null;
		Statement stmt	=null;
		Statement stmt1 =null;
		Statement stmt2 =null;
		ResultSet rs	=null;
		ResultSet rs2	=null;
		//-----------------------------------------------------
		java.util.Date dt0 = new java.util.Date();	//used as time reference of now
		java.util.Date dt1 = new java.util.Date();	//used to proc period 1seg
		java.util.Date dt2 = new java.util.Date();	//used to update RTC
		java.util.Date dt3 = new java.util.Date();	//used to check if timeout
		//-----------------------------------------------------
		try
		{
			Class.forName("org.postgresql.Driver");
			c = DriverManager.getConnection(conection,"postgres","admin");
			c.setAutoCommit(true);
			stmt = c.createStatement();
			stmt1 = c.createStatement();
			stmt2 = c.createStatement();
		}
		catch ( Exception e )
		{
			System.err.println("\tErr[0]:"+e.getClass().getName() + ":" + e.getMessage() );
		}
		//---------------------------------------------------*/
		receivePacketP=null;
		receivePacketP=new DatagramPacket(receiveData, receiveData.length);
		serverSocket.setSoTimeout(1000);
		for(countloop=0;countloop<THS;countloop++)
		{
			procsql=new Thread(new procSql(queueP));
			procsql.start();
		}
		for(countloop=0;countloop<THD;countloop++)
		{
			procdat=new Thread(new procDat(drv,SrvId,queuePd,queueP,stmt1));
			//procdat.log=log;
			procdat.start();
		}
		//-----------------------------------------------------------------------------
		countloop=0;
		while(true)
		{
			countloop++;
			//-----------------------------------------------------------------------------
			try
			{
				serverSocket.receive(receivePacketP);
				try
				{
					queuePd.put(new dat2proc(receivePacketP.getData(),receivePacketP.getAddress(),receivePacketP.getPort()));
				}
				catch ( Exception e )
				{
					System.err.println("procDat["+e.getClass().getName()+":"+e.getMessage()+"]");
					System.exit(0);
				}
			}
			catch ( Exception e )
			{
				System.err.println("serverSocket["+e.getClass().getName()+":"+e.getMessage()+"]");
			}
			//-----------------------------------------------------------------------------
			dt0 =null;
			dt0 =new java.util.Date();
			if( (dt1.getTime()+1000) < (dt0.getTime())) // proc cada 1 seg
			{
				System.gc();
				System.out.print("x");
				try
				{
					sql="SELECT * FROM pdgv where drv LIKE '"+drv+"'";
					rs = stmt.executeQuery(sql);
					while(rs.next())
					{
						port		= rs.getInt("ipport");
						idt			= rs.getInt("pdgvid");
						id			= rs.getString("id");
						str			= rs.getString("ip");
						str			= str.replace("/","");
						IPAddress	= InetAddress.getByName(str);
						timeout		= rs.getInt("timeout");
						dt3 		= rs.getTimestamp("lstupd");
						sts			= ""+rs.getString("status");
						model 		= rs.getString("model");
						//try { if (rs != null) rs.close(); } catch (Exception e) {};
						//-------------------------------------
						if(	drv.indexOf("Rtc")!=-1 && (	(dt2.getTime()+(timeout*1000)) <= dt0.getTime() ) ) // send RTC
						{
							sendData[0]=0x7E;
							sendData[CmpCtr]=(pdgv_UDP|pdgv_Chs);
							sendData[CmpIdS]=(byte)(SrvId&255);
							sendData[CmpIdT]=(byte)(idt&255);
							sendData[CmpSkS]=CMD_Msg;
							sendData[CmpSkT]=CMD_RTC;
							sendData[CmpLen]=5;
							dt2 = null;
							dt2 = new java.util.Date();
							Ival=(int)(dt2.getTime()/1000);
							sendData[CmpDat+0]=(byte)((Ival>> 0)&255);
							sendData[CmpDat+1]=(byte)((Ival>> 8)&255);
							sendData[CmpDat+2]=(byte)((Ival>>16)&255);
							sendData[CmpDat+3]=(byte)((Ival>>24)&255);
							sendData[CmpDat+4]=CalChs(sendData);
							sendPacketP=null;
							sendPacketP = new DatagramPacket(sendData,7+sendData[CmpLen], IPAddress, port);
							serverSocket.send(sendPacketP);
							System.out.print("TxPk-RTC("+id+")->"+IPAddress+":"+port+"\n");	/*+(javax.xml.bind.DatatypeConverter.printHexBinary(Arrays.copyOf(sendData,7+sendData[CmpLen])))*/
						}
						//-------------------------------------
						if(sts.indexOf("ok")!=-1) //check if timeout then add alert and update variables
						{
							if(	(dt3.getTime()+(timeout*1000))	<=	dt0.getTime()	)
							{
								if((log&1)!=0)System.out.println("SrvPdgv("+port+") !!!! /"+id+".TimeOut !!!!");
								InsSql = "INSERT INTO alerts VALUES (LOCALTIMESTAMP,\'Viewed\',\'["+id+"] Lost Connection\',\'"+id+"\',\'Link\')";
								dgvsql(InsSql,"");
								UdtSql = "UPDATE pdgv SET (status,lstupd)=(\'Lost Connection\',LOCALTIMESTAMP) WHERE id=\'"+id+"\'";
								dgvsql("",UdtSql);
								UdtSql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'\') WHERE id LIKE \'/"+id+"/Phase%/Color\'";
								dgvsql("",UdtSql);
								UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'Lost Connection\') WHERE id LIKE \'/"+id+"/Lnk_Status\'";
								dgvsql("",UdtSql);
							}
							else
							{
								temp=( ((dt3.getTime()/1000)+timeout) - (dt0.getTime()/1000) );
								if( temp < (timeout/10) )
								{
									if((log&1)!=0)System.out.println("SrvPdgv("+port+")/"+id+".TimeOut->"+temp);
								}
							}
						}
						//-------------------------------------	check if had some var to update on controler
						sql = "SELECT * FROM variables WHERE id LIKE \'/"+id+"/%\' AND typ LIKE \'%W%\'";
						sql+= " AND lstchg > to_timestamp("+((dt1.getTime()/1000))+")";
						/*System.out.println(""+sql); //{"+new java.util.Date().getTime()/1000+"} // */
						rs2 	= stmt2.executeQuery(sql);
						while(rs2.next())
						{
							str =rs2.getString("id");
							Sval =rs2.getString("value");
							typ =rs2.getString("typ");
							//try { if (rs2 != null) rs2.close(); } catch (Exception e) {};
							//-------------------------------------
							System.out.println(""+str+" "+Sval+" "+typ);
							str=str.replaceAll("/"+id+"/","");
							byte[] vname = str.getBytes("ASCII");
							if(typ.indexOf("Int")!=-1)
								Ival=Integer.parseInt(Sval);
							Arrays.fill(sendData, (byte)0);
							sendData[0]=0x7E;
							sendData[CmpCtr]=(pdgv_UDP|pdgv_Chs);
							sendData[CmpIdS]=(byte)(SrvId&255);
							sendData[CmpIdT]=(byte)(idt&255);
							sendData[CmpSkS]=CMD_Msg;
							sendData[CmpSkT]=CMD_GVars;
							sendData[CmpLen]=(byte)vname.length;
							sendData[CmpLen]+=7;
							sendData[CmpDat]=5;//set GVars //(byte)(147&0xFF);
							System.arraycopy(vname,0,sendData,CmpDat+1,vname.length);//copy name of var
							sendData[CmpDat+2+vname.length]=(byte)(Ival&255);
							sendData[CmpDat+3+vname.length]=(byte)((Ival>>8)&255);
							sendData[CmpDat+4+vname.length]=(byte)((Ival>>16)&255);
							sendData[CmpDat+5+vname.length]=(byte)((Ival>>24)&255);
							sendData[CmpDat+6+vname.length]=CalChs(sendData);
							System.out.print("TxPk:"/*+(javax.xml.bind.DatatypeConverter.printHexBinary(Arrays.copyOf(sendData,7+sendData[CmpLen])))*/+"->"+IPAddress+":"+port+"\n\n");
							sendPacketP=null;
							sendPacketP = new DatagramPacket(sendData,7+sendData[CmpLen], IPAddress, port);
							serverSocket.send(sendPacketP);
						}
						try { if (rs2 != null) rs2.close(); } catch (Exception e) {};
						//stmt2.close();
					}
					try { if (rs != null) rs.close(); } catch (Exception e) {};
					//stmt.close();
				}
				catch ( Exception e )
				{
					System.err.println("\tErr[mn.4]:"+e.getClass().getName() + ":" + e.getMessage() );
				}
				//-----------------------------------------------------------------------------
				//if((log&1)!=0)System.out.print("\nSrvPdgv LsTx:"+dt0.getTime()+" - now:"+(new java.util.Date().getTime())+"="+(dt0.getTime()-(new java.util.Date().getTime()))+"["+countloop+"]\n");
				dt1 = null;
				dt1 = new java.util.Date(dt0.getTime());
			}
			//-----------------------------------------------------------------------------
			//System.out.print("\033[s");
			//System.out.print("\033["+0+";"+0+"H");
			//System.out.print("\033[37;101m");
			if(queueP.remainingCapacity()==(quezise*10))
			{
				System.out.print("\n\0337\033[37;44mSrvPdgv-"+drv+" SqlQ("+queueP.remainingCapacity()+") DatQ("+queuePd.remainingCapacity()+") THS("+THS+") THD("+THD+")\0338\n");
			}
			else
			{
				System.out.print("\n\0337\033[37;101mSrvPdgv-"+drv+" SqlQ("+queueP.remainingCapacity()+") DatQ("+queuePd.remainingCapacity()+") THS("+THS+") THD("+THD+")\0338\n");
				if(queueP.remainingCapacity()<(quezise*4))
				{
					System.out.print("Restart Drv by queue size");
					System.exit(0);
				}
			}
			//System.out.print("\033[37;40m");
			//System.out.print("\033[u");
		}
	}
}