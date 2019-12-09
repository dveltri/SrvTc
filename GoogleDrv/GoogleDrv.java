import java.net.*;
import java.io.*;
import java.util.*;
import java.sql.*;
import java.lang.*;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Scanner;

import org.json.simple.parser.*;
import org.json.simple.*;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;

public class GoogleDrv 
{
	private static libsql var= new libsql();
	
	public static void getmac()
	{
		InetAddress ip;
		try
		{
			ip = InetAddress.getLocalHost();
			System.out.println("Current IP address : " + ip.getHostAddress());
			NetworkInterface network = NetworkInterface.getByInetAddress(ip);
			byte[] mac = network.getHardwareAddress();
			System.out.print("Current MAC address : ");
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < mac.length; i++)
			{
				sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));
			}
			System.out.println(sb.toString());
		}
		catch (UnknownHostException e)
		{
			e.printStackTrace();
		}
		catch (SocketException e)
		{
			e.printStackTrace();
		}
   }

	public static int utf8conv(byte[] psrc,int Len,byte[] ptrg)
	{
	  int trg=0;
		int src=0;
    while(Len!=0)
    {
      if((psrc[src]&0xFC)==0xC0)
      {
				ptrg[trg]=0;
        ptrg[trg]=(byte)((psrc[src]&0x03) << 6);
        src++;
				Len--;
        ptrg[trg]|=(psrc[src]&0x3F);
      }
      else
			{
    	  ptrg[trg]=psrc[src];
			}
      trg++;
			src++;
      Len--;
    }
		return trg;
	}
	
	public static void main(String[] args) throws Exception
	{
		String[] tmpGetVar;
		//-----------------------------------------------------
		Connection c = null;
		Statement stmt = null;
		Statement stmt2 = null;
		ResultSet rs;
		String sql="";
		//-----------------------------
		int key	=	0;
		String id =	"";
		java.util.Date timeDb;
		String status	=	"";
		String action= "";
		String drv	= "";
		String gldkey	= "";
		//---------------
		String orig = "";
		String dest = "";
		//-----------------------------
		String str="";
		int idx1;
		int idx2;
		int tempV;
		int responseCode=0;
		byte[] y;
		int refresh=0;
		int countloop=0;
		//-----------------------------
		String conection="";
		conection="jdbc:postgresql://localhost:5432/SrvDb";
		Class.forName("org.postgresql.Driver");
		c = DriverManager.getConnection(conection,"postgres","admin");
		c.setAutoCommit(true);
		java.util.Date dt = new java.util.Date();
		//-----------------------------
		String url = "";
		URL oracle;
		HttpURLConnection con;
		InputStream Datos;
		//https://maps.googleapis.com/maps/api/distancematrix/json?departure_time=now&units=metric&origins=-34.624975,-58.416129&destinations=-34.626101,-58.416058&key=
		//-----------------------------
		//getmac();
		while(true)
		{
			countloop++;
			str="";
			try
			{
				dt = new java.util.Date();
				stmt = c.createStatement();
				stmt2 = c.createStatement();
				sql="SELECT * FROM googledrv where drv LIKE '"+args[0]+"%' AND action LIKE '%pool%' AND lstchg < to_timestamp("+(dt.getTime()/1000)+")" ;
				rs = stmt.executeQuery(sql);
				{
					while(rs.next())
					{
						dt = new java.util.Date();
						System.out.println("--------------------------------------------");
						System.out.println(dt);
						//--------------------------------------------
						key		= rs.getInt("key");
						id		= rs.getString("id");
						tmpGetVar=var.GetSqlVar("/GLD/"+id+"/Location");
						if(tmpGetVar[0]!="")
						{
							tmpGetVar=tmpGetVar[1].split(",");
							orig=tmpGetVar[0]+","+tmpGetVar[1];
							dest=tmpGetVar[2]+","+tmpGetVar[3];
							//orig	= rs.getString("orig");
							//dest	= rs.getString("dest");
							timeDb= rs.getTimestamp("lstchg");
							status= rs.getString("status");
							action= rs.getString("action");
							refresh=rs.getInt("refresh");
							drv		= rs.getString("drv");
							gldkey		= rs.getString("gldkey");
							//--------------------------------------------
							url="";
							url+="&origins=";
							url+=orig;
							//url+="-34.624975,-58.416129";
							url+="&destinations=";
							url+=dest;
							//url+="-34.626101,-58.416058";
							//----------------------------------------------
							System.out.println("\t"+id+":"+url);
							//--------------------------------------------
							try
							{
								url="https://maps.googleapis.com/maps/api/distancematrix/json?departure_time=now&units=metric&key="+gldkey+""+url; //
								oracle = new URL(url);
								con = (HttpURLConnection)oracle.openConnection();
								con.setRequestMethod("GET");
								con.setConnectTimeout(800);
								con.setReadTimeout(800);
								con.connect();
								responseCode = con.getResponseCode();
								if (responseCode == HttpURLConnection.HTTP_OK)
								{
									//System.out.println(con.getHeaderField("Date"));
									Datos = con.getInputStream();
									BufferedReader in = new BufferedReader(new InputStreamReader(Datos));
									//StringBuffer response = new StringBuffer();
									str = con.getResponseMessage();
									//System.out.println("("+str+")");
									//----------------------------
									y = new byte[Datos.available()+1];
									tempV=Datos.read(y);
									System.out.println("\tRx["+tempV+"]Size");
									str= new String(y);
									try
									{
										idx1=str.indexOf("duration_in_traffic");
										idx1=str.indexOf("value",idx1);
										idx1=str.indexOf(":",idx1);
										idx2=str.indexOf('}',idx1);
										str=str.substring(idx1+2,idx2);
										str=str.replaceAll(" ","");
										str=str.replaceAll("\n","");
										System.out.println("\tValor:"+str);
									}
									catch (Exception e)
									{
										System.err.println("\tErr[x]:"+e.getClass().getName() + ":" + e.getMessage() );
									}
									//----------------------------
									//Datos.reset();
									//----------------------------
								}
								con.disconnect();
								stmt2 = c.createStatement();
								sql = "UPDATE googledrv set lstchg = to_timestamp("+((dt.getTime()/1000)+(refresh*1))+") where key="+key+";";
								stmt2.executeUpdate(sql);
								//----------------------------
								System.out.println("\tSet "+id+":"+str);
								var.SetSqlVar("/GLD/"+id+"/value",str,"IntR","GLD."+id+"",null);
								sql = "INSERT INTO hisvars (id,value,date) VALUES (\'/GLD/"+id+"/value\',\'"+str+"\',LOCALTIMESTAMP);"; 
								//System.out.println("\t"+sql);
								stmt2.executeUpdate(sql);
								//c.commit();
							}
							catch (java.net.SocketTimeoutException e) 
							{
								System.err.println("\tErr[1]:"+e.getClass().getName() + ":" + e.getMessage() );
								//-----------------------------------------------------------
							}
							catch (java.io.IOException e)
							{
								System.err.println("\tErr[2]:"+e.getClass().getName() + ":" + e.getMessage() );
							}
							System.out.print("\n\n");
						}
					}
				}
				//-------------------------------------------------------------
				rs.close();
				stmt.close();
				//c.commit();
			}
			catch ( Exception e )
			{
				System.err.println("\tErr[3]:"+e.getClass().getName() + ":" + e.getMessage() );
				System.exit(0);
			}
			//-------------------------------------------------------------
			try
			{
				Thread.sleep(1000);
			}
			catch (InterruptedException ie) 
			{
				System.err.println("\tErr[4]:"+ie.getClass().getName() + ":" + ie.getMessage() );
				System.exit(0);
			}
		}
	}
}
