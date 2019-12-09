import java.net.*;
import java.io.*;
import java.util.*;
import java.sql.*;
import java.lang.*;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Scanner;
//package com.mkyong;
//package com.tutorialspoint;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;

public class HttpDrvFcp 
{
	
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
		//-----------------------------------------------------
		Connection c = null;
		Statement stmt = null;
		Statement stmt2 = null;
		String url = "http://";
		String address = "10.0.0.161";
		String resource = "plc.ini";
		String action= "";
		String id ="";
		resource = "phases.bin";
		int MadeGet=0;
		int wac=0;
		int size=0;
		int countloop=0;
		String status;
		String model;
		String timtemp="";
		String conection="";
		conection="jdbc:postgresql://localhost:5432/SrvDb";
		Class.forName("org.postgresql.Driver");
		c = DriverManager.getConnection(conection,"postgres","admin");
		c.setAutoCommit(true);
		int key;
		java.util.Date dt = new java.util.Date();
		java.util.Date dt2 = new java.util.Date();
		java.util.Date dt3 = new java.util.Date();
		ResultSet rs;
		ResultSet rs2;
		java.util.Date timeDb;
		URL oracle;
		HttpURLConnection con;
		InputStream Datos;
		//RcvGbVarsM4 rcvGbVarsM4;
		//RcvGbVarsM3 rcvGbVarsM3;
		RcvPLCs rcvplcs;
		RcvPLCsM4 rcvplcsM4;
		RcvPhases rcvphases;
		RcvIOs rcvios;
		String sql;
		RcvPhasesM4 rcvphasesM4;
		String drv;
		String[] drv2;
		byte[] x;
		byte[] y;
		byte[] b;
		byte[] trg;
		String str;
		String Splan;
		int tempV;
		int tempV2;
		int response_to;
//		getmac();
		while(true)
		{
			countloop++;
			try
			{
				dt = new java.util.Date();
				stmt = c.createStatement();
				stmt2 = c.createStatement();
				sql="SELECT * FROM httpdrv where drv LIKE '"+args[0]+"%' AND action LIKE '%pool%' AND lstchg < to_timestamp("+(dt.getTime()/1000)+")" ;
				rs = stmt.executeQuery(sql);
				dt2=dt;
				MadeGet=0;
				//System.out.println(sql);
				if(rs.next())
				{
					while(rs.next())
					{
						MadeGet=1;
						Splan="";
						//--------------------------------------------
						key = rs.getInt("key");
						id = rs.getString("id");
						address = rs.getString("address");
						resource = rs.getString("resource");
						wac  = rs.getInt("wac");
						response_to = Integer.parseInt(rs.getString("response_to"));
						timeDb = rs.getTimestamp("lstchg");
						status  = rs.getString("status");
						action  = rs.getString("action");
						model  = rs.getString("model");
						drv  = rs.getString("drv");
System.out.println("----------------------\n"+key+" "+id+" "+address+" "+resource+" "+wac+"\n "+response_to+" "+timeDb+" "+status+" "+action+" "+model+" "+drv+"\n---------------------------------------");

						//--------------------------------------------
						url ="http://";
						url+=address+"/";
						url+=resource;
						//--------------------------------------------
						sql = "SELECT *  FROM variables WHERE id = \'/"+id+"/Lnk_Status\'";
						rs2 = stmt2.executeQuery(sql);
						if (!rs2.next()) 
						{
							sql = "INSERT INTO variables (id,value,lstchg,typ) VALUES (\'/"+id+"/Drv_Status\',\'pool\',LOCALTIMESTAMP,'StrR')";
							stmt2.executeUpdate(sql);
							sql = "INSERT INTO variables (id,value,lstchg,typ) VALUES (\'/"+id+"/Lnk_Status\',\'ok\',LOCALTIMESTAMP,'StrR')";
							stmt2.executeUpdate(sql);
							sql = "INSERT INTO variables (id,value,lstchg,typ) VALUES (\'/"+id+"/address\',\'"+address+"\',LOCALTIMESTAMP,'StrR')";
							stmt2.executeUpdate(sql);
							sql = "INSERT INTO variables (id,value,lstchg,typ) VALUES (\'/"+id+"/RTC\',\' \',LOCALTIMESTAMP,'StrR')";
							stmt2.executeUpdate(sql);
							//c.commit();
						}
						//----------------------------------------------
						str=rs2.getString("value");
						if(str.indexOf("Paused")==-1)
						{
							System.out.print("Get:"+id+"."+url);
							//--------------------------------------------
							if(resource.indexOf("runplan")!=-1)
							{
								try
								{
									sql = "SELECT * FROM variables WHERE id LIKE \'/"+id+"/%Splan%\'";
									//System.out.println(sql);
									rs2 = stmt2.executeQuery(sql);
									if(rs2.next()) 
									{
										Splan="0"+rs2.getString("value");
										tempV=Integer.parseInt(Splan);
										//------------------------------
										if(Splan!="" && Splan!="''" && tempV>0)
										{
											System.out.println("Force Plan:"+tempV);
											url+="?splan\'"+Splan+"&snxchg\'60";
										}
										else
										{
											url="";
										}
									}
									else
									{
										try
										{
											sql = "INSERT INTO variables (id,lstchg,value,typ) VALUES (\'/"+id+"/Splan\',LOCALTIMESTAMP,\'\','IntW');"; //"+Flags+"
											stmt.executeUpdate(sql);
										}
										catch ( Exception e )
										{
											System.err.println("\tErrInsRunPln:"+e.getClass().getName() + ":" + e.getMessage() );
										}
										url="";
									}
									System.out.print("\n");
								}
								catch ( Exception e )
								{
									System.err.println("\tErrRunPln:"+e.getClass().getName() + ":" + e.getMessage() );
									url="";
								}
							}
							//--------------------------------------------
							if(url!="")
							{
								//System.out.print(args[0]+"."+id+"."+url+"->");
								timtemp =""+dt.getTime();// dt.getHours()+""+dt.getMinutes()+""+dt.getSeconds();
								if(url.indexOf("?")!=-1)
									url=url.replace("?","?WAC="+wac+"&");
								else
									url+="?WAC="+wac;
								url+="&AJAX="+timtemp;
								//--------------------------------------------
								try
								{
									System.out.print("\n");
									System.out.println(url);
									oracle = new URL(url);
									con = (HttpURLConnection)oracle.openConnection();
									con.setRequestMethod("GET");
									con.setConnectTimeout(response_to);
									con.setReadTimeout(response_to);
									con.connect();
									System.out.println("getHeaderFieldDate:"+con.getHeaderField("Date"));
									Datos = con.getInputStream();
									str = con.getResponseMessage();
									System.out.print("("+str+")");
									tempV=0;
									System.out.print("["+model+"]");
									x=new byte[0];
									if(model.indexOf("M3")!=-1)
									{
										x=new byte[Datos.available()+1];
										tempV=Datos.read(x);
										System.out.print("["+tempV+"]");
									}
									y = new byte[Datos.available()+1];
									tempV2=Datos.read(y);
									System.out.print("["+tempV2+"]");
									//----------------------------
									if(tempV<0)
										tempV=0;
									if(tempV2<0)
										tempV2=0;
									b = new byte[tempV+tempV2+1];
									trg=new byte[tempV+tempV2+1];
									//-----------------------------
									int a=0;
									if(tempV>0)
									{
										for(a=0;a<tempV;a++)
										{
											b[a]=x[a];
											//System.out.print(String.format("%02X",b[a]&255));
										}
									}
									tempV=a;
									if(tempV2>0)
									{
										for(a=0;a<tempV2;a++)
										{
											b[a+tempV]=y[a];
											//System.out.print(String.format("%02X",b[a+tempV2]&255));
										}
									}
									tempV+=tempV2;
									//--------------------------------------------*/
									Datos.reset();
									//--------------------------------------------
									if(tempV!=0)
									{
										str = new String(b, "UTF-8");
										size = utf8conv(b,tempV,trg);
										//--------------------------------------------
										/*if(resource.indexOf("phases.bin")!=-1)
										{
											int i=0;
											while(i<size)
											{
												if((i%8)==0)
													System.out.print("\n");
												System.out.print(String.format("%02X",trg[i]&255));
												i++;
											}
										}// */
										//--------------------------------------------
										if(model.indexOf("M4")!=-1)
										{
//											if(resource.indexOf("GbVars.bin")!=-1)
//												rcvGbVarsM4 = new RcvGbVarsM4(b,id,resource);
											if(resource.indexOf("plcs.bin")!=-1)
												rcvplcsM4 = new RcvPLCsM4(b,id,resource);
											if(resource.indexOf("phases.bin")!=-1)
												rcvphasesM4 = new RcvPhasesM4(str,id,resource);
											if(resource.indexOf("ios.bin")!=-1)
												rcvios = new RcvIOs(str,id,resource); // */
											/*
											if(resource.indexOf("runplan")!=-1)
											{
												tempV=str.indexOf("\r\n\r\n");
												if(tempV!=-1)
													tempV+=4;
												else
													tempV=172;
												System.out.print("\t["+str.substring(0,tempV)+"]");
											}
											*/
										}
										if(model.indexOf("M3")!=-1)
										{
//											if(resource.indexOf("GbVars.bin")!=-1)
//												rcvGbVarsM3 = new RcvGbVarsM3(b,id,resource);
											if(resource.indexOf("plcs.bin")!=-1)
												rcvplcs = new RcvPLCs(b,id,resource);
											if(resource.indexOf("phases.bin")!=-1)
												rcvphases = new RcvPhases(str,id,resource);
											if(resource.indexOf("ios.bin")!=-1)
												rcvios = new RcvIOs(str,id,resource); // */
											/*
											if(resource.indexOf("runplan")!=-1)
											{
												tempV=str.indexOf("\r\n\r\n");
												if(tempV!=-1)
													tempV+=4;
												else
													tempV=172;
												System.out.print("\t["+str.substring(0,tempV)+"]");
											}
											*/
										}
									}
									//--------------------------------------------
									con.disconnect();
									stmt = c.createStatement();
									sql = "UPDATE httpdrv set lstchg = to_timestamp("+(dt.getTime()+rs.getInt("refresh"))/1000+") where key="+key+";";
									stmt.executeUpdate(sql);
									if(drv.indexOf("tout.")!=-1)
									{
										drv2=drv.split(".");
										drv=drv.replace("tout.","");
										sql = "UPDATE httpdrv set (drv) = ('"+drv+"') where key="+key+";";
										stmt.executeUpdate(sql);
									}
									dt3 = new java.util.Date();
									sql = "UPDATE httpdrv set status = \'ok "+(dt3.getTime()-dt.getTime())+"ms\' where key="+key+";";
									stmt.executeUpdate(sql);
									sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'ok "+(dt3.getTime()-dt.getTime())+"ms\') ";
									//sql+= "WHERE id = \'/"+id+"/Lnk_Status\'";
									sql+= "WHERE id = \'/"+id+"/Lnk_Status\' AND value NOT LIKE '%Paused%'";
									stmt.executeUpdate(sql);
									sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+address+"\') ";
									sql+= "WHERE id = \'/"+id+"/address\'";
									stmt.executeUpdate(sql);
									//c.commit();
									System.out.print(" ok "+((dt3.getTime()-dt.getTime()))+"ms "+(dt3.getTime()-timeDb.getTime())+"ms");
									dt = new java.util.Date();
								}
								catch (java.net.SocketTimeoutException e) 
								{
									System.err.println("\tErr[1]:"+e.getClass().getName() + ":" + e.getMessage() );
									stmt = c.createStatement();
									dt = new java.util.Date();
									//-----------------------------------------------------------
									drv=drv.replace("tout.","");
									sql = "UPDATE httpdrv set (drv,status,lstchg) = (\'tout."+drv+"\',\'Timeout Exception\',to_timestamp("+(dt.getTime()+rs.getInt("refresh"))/1000+")) where key="+key+";";
									stmt.executeUpdate(sql);
									//-----------------------------------------------------------
									//c.commit();
								}
								catch (java.io.IOException e)
								{
									System.err.println("\tErr[2]:"+e.getClass().getName() + ":" + e.getMessage() );
									stmt = c.createStatement();
									drv=drv.replace("tout.","");
									sql = "UPDATE httpdrv set (drv,status,lstchg) = (\'tout."+drv+"\',\'IO Exception\',to_timestamp("+(dt.getTime()+rs.getInt("refresh"))/1000+")) where key="+key+";";
									stmt.executeUpdate(sql);
									if(resource.indexOf("plcs.bin")!=-1)
									{
										sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'IO Exception\') ";
										//sql+= "WHERE id = \'/"+id+"/Lnk_Status\'";
									    sql+= "WHERE id = \'/"+id+"/Lnk_Status\' AND value NOT LIKE '%Paused%'";
										stmt.executeUpdate(sql);
									}
									//c.commit();
								}
								System.out.print("\n\n");
							}
							else
							{
									stmt = c.createStatement();
									sql = "UPDATE httpdrv set lstchg = to_timestamp("+(dt.getTime()+rs.getInt("refresh"))/1000+") where key="+key+";";
									stmt.executeUpdate(sql);
							}
						}
						else
						{
							if(drv.indexOf("tout.")==-1)
							{
								System.out.print("Paused:"+id+"."+url+"\n\n");
							}
						}
					}
				}
				else
				{
					System.out.println(args[0]+" No id to request("+countloop+")");
				}
				rs.close();
				//-------------------------------------------------------------
				if(MadeGet!=0)
				{
					sql="SELECT tb.id,COUNT(*) AS cant,MAX(sts) AS sts2,MAX(var.value) FROM (SELECT id,COUNT(status),MAX(status) AS sts FROM httpdrv WHERE drv LIKE '%"+args[0]+"' AND status NOT LIKE '%ok%' AND status NOT LIKE '%New%' GROUP BY id UNION SELECT id,COUNT(status),MAX(status) AS sts FROM httpdrv WHERE drv LIKE '%"+args[0]+"' AND status LIKE '%ok%' AND status NOT LIKE '%New%' GROUP BY id) as tb INNER JOIN variables AS var ON var.id LIKE CONCAT('/',tb.id,'/Lnk_Status') GROUP BY tb.id";
					//sql="SELECT id,COUNT(*) AS cant,MAX(sts) FROM (SELECT id,COUNT(status),MAX(status) AS sts FROM httpdrv WHERE drv LIKE '%"+args[0]+"' AND status NOT LIKE '%ok%' AND status NOT LIKE '%New%' GROUP BY id UNION SELECT id,COUNT(status),MAX(status) AS sts FROM httpdrv WHERE drv LIKE '%"+args[0]+"' AND status LIKE '%ok%' AND status NOT LIKE '%New%' GROUP BY id) as TB GROUP BY id";
					rs = stmt.executeQuery(sql);
					while(rs.next())
					{
						id = rs.getString("id");
						key = rs.getInt("cant");
						status = rs.getString("sts2");
						resource = rs.getString("max");
						System.out.print("Device["+id+"] Lnk["+status+"] Val["+resource+"] Count["+key+"] ");
						if(key==1)
						{
							//-----------------------------------------------------------
							if(status.indexOf("ok")!=-1)
							{
								sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+status+"\') ";
								//sql+= "WHERE id = \'/"+id+"/Lnk_Status\'";
								sql+= "WHERE id = \'/"+id+"/Lnk_Status\' AND value NOT LIKE '%Paused%'";
							}
							else
							{
								sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'Timeout Exception\') ";
								//sql+= "WHERE id = \'/"+id+"/Lnk_Status\'";
								sql+= "WHERE id = \'/"+id+"/Lnk_Status\' AND value NOT LIKE '%Paused%'";
							}
							System.out.print("UpdVar ");
							stmt2.executeUpdate(sql);
							//-----------------------------------------------------------
							if(status.indexOf("ok")==-1 && resource.indexOf("ok")!=-1)
							{
								try
								{
									sql = "INSERT INTO alerts VALUES (LOCALTIMESTAMP,\'Viewed\',\'["+id+"] Lost Connection\',\'"+id+"\',\'Link\')";
									System.out.print("UpdAlrt ");
									stmt2.executeUpdate(sql);
								}
								catch (Exception e) 
								{
								}
								//---------------------------------------------
								try
								{
									sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'Lost Connection\') WHERE id LIKE \'/"+id+"/PLC%/Status\' ";
									System.out.print("PlcSts ");
									//System.out.println(sql);
									stmt2.executeUpdate(sql);
								}
								catch (Exception e) 
								{
									System.out.println("PlcSts! ");
								}
								//---------------------------------------------
								try
								{
									sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'0\') WHERE id LIKE \'/"+id+"/PLC%/Phase%/Color\'";
									System.out.print("PhCol ");
									//System.out.println(sql);
									stmt2.executeUpdate(sql);
								}
								catch ( Exception e )
								{
									System.out.println("PhCol! ");
								}
							}
							//----------------------------------------------------------- */
						}
						System.out.print("\n");
						System.out.print("\n=====================================================\n\n");
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
				sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'Driver Close:"+e.getMessage()+"\') ";
				//sql+= "WHERE id = \'/"+id+"/Lnk_Status\'";
				sql+= "WHERE id = \'/"+id+"/Lnk_Status\' AND value NOT LIKE '%Paused%'";
				//stmt.executeUpdate(sql);
				//c.commit();
				System.exit(0);
			}
			try
			{
				Thread.sleep(100);
			}
			catch (InterruptedException ie) 
			{
				System.err.println("\tErr[4]:"+ie.getClass().getName() + ":" + ie.getMessage() );
				System.exit(0);
			}
			//System.out.print("-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-\n\n");
		}
	}
}
