import java.rmi.Naming;
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.rmi.*;
import java.rmi.server.*;
import java.io.Serializable;
import java.rmi.registry.Registry;
import java.rmi.registry.LocateRegistry;
//-------------------------
import java.net.*;
import java.io.*;
import java.util.*;
import java.sql.*;
import java.lang.*;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Scanner;
//import static java.lang.System.*;
//import qj.util.ReflectUtil;
//import qj.util.lang.DynamicClassLoader;

//package com.mkyong;
//package com.tutorialspoint;
//-------------------------
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
//-------------------------
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;

public class SrvFlow
{
	//--------------------------------------------------------
	public static FlowInterface howdy(String whichClass)
	{
		//-----------------------------------------------------------------
		try
		{
			return (FlowInterface) Class.forName(whichClass,false,new dgvclssldr()).newInstance();
			//return (FlowInterface) Class.forName(whichClass).newInstance();
		}
		catch (ClassNotFoundException e)
		{
			e.printStackTrace();
		}
		catch (InstantiationException e)
		{
			e.printStackTrace();
		}
		catch (IllegalAccessException e)
		{
			e.printStackTrace();
		}
		return null;
	}
	//--------------------------------------------------------
	public static void getmac() // this function only works on windows at moment 
	{
		InetAddress ip;
		try
		{
			ip = InetAddress.getLocalHost();
			System.out.println("Current IP address : " + ip.getHostAddress());
			NetworkInterface network = NetworkInterface.getByInetAddress(ip);
			//byte[] mac = network.getHardwareAddress();
			System.out.print("Current MAC address : ");
			StringBuilder sb = new StringBuilder();
			/*for (int i = 0; i < mac.length; i++)
			{
				sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));
			}*/
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
	//--------------------------------------------------------
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
	//--------------------------------------------------------
	public static void main(String[] args) throws Exception
	{
		//-----------------------------------------------------
		int key;
		String title = "";
		String status = "";
		String drv = "";
		int refresh;
		java.util.Date timeDb;
		//-------------------
		Connection c = null;
		Statement stmt = null;
		Statement stmt2 = null;
		ResultSet rs = null;
		ResultSet rs2 = null;
		String conection="jdbc:postgresql://localhost:5432/SrvDb";
		Class.forName("org.postgresql.Driver");
		c = DriverManager.getConnection(conection,"postgres","admin");
		c.setAutoCommit(true);
		//-------------------
		java.util.Date dt = new java.util.Date();
		int countloop=0;
		int rows=0;
		String sql=null;
		//-------------------
		String cmd=null;
		int tmp=0;
		int tmp2=0;
		Process exec=null;
		File tmpDir=null;
		//-------------------
		int T2sleep=1000;
		Thread FlowThreads = null;
		Set<Thread> threads = Thread.getAllStackTraces().keySet();
		//FlowInterface FlowInst = null;
		ArrayList<FlowInterface> FlowInstAL = new ArrayList<FlowInterface>();
		libcmd rxcmd = null;
		rxcmd=new libcmd ("Nombre");
		//-------------------
		Runtime runtime = Runtime.getRuntime();
		//-------------------
		System.out.println("system class loader: "+ClassLoader.getSystemClassLoader().getClass().getName());
		System.out.println("context class loader: "+Thread.currentThread().getContextClassLoader().getClass().getName());
		//System.out.println("current class loader: "+InternalTest.class.getClassLoader());		
		//-------------------
		//getmac();
		try
		{
			Registry registry = LocateRegistry.createRegistry(2000);
			registry.rebind("SrvFlow",rxcmd);	//SetName of RMI connection
			System.err.println("Server ready");
		}
		catch (Exception e)
		{
			System.err.println("Server exception: " + e.toString());
			e.printStackTrace();
		}
		rxcmd.command="";
		//--------------------------------------------
		try
		{
			//--------------------------------------------
			while(true)
			{
				countloop++;
				System.out.println("\n=---=---=---=---=---=---=["+countloop+"]=---=---=---=---=---=---=("+FlowInstAL.size()+")");
				T2sleep=1000;
				//-------------------------------------------- List Of Threads
				threads = Thread.getAllStackTraces().keySet();
				if((countloop%10)==0)
				{
					System.out.printf("List Of Threads\n");
					for (Thread t : threads)
					{
						String name = t.getName();
						Thread.State state = t.getState();
						int priority = t.getPriority();
						String type = t.isDaemon() ? "Daemon" : "Normal";
						System.out.printf("%-40s \t %s \t %d \t %s\n", name, state, priority, type);
					}
				}
				//=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=
				//-------------------------------------------- Proc Data Base
				stmt = c.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_UPDATABLE);
				stmt2= c.createStatement();
				//sql="SELECT * FROM logics where drv LIKE '"+args[0]+"%' order by refresh desc";
				sql="SELECT * FROM logics order by refresh desc";
				rs = stmt.executeQuery(sql);
				rs.last();
				rows = rs.getRow();
				rs.beforeFirst();
				if(rows>0)
				{
					System.out.println("Data Base Found:"+rows+"rows");
					while(rs.next())
					{
						//-----------------------------------
						key = rs.getInt("key");
						title = rs.getString("title");
						status  = rs.getString("status");
						refresh  = rs.getInt("refresh");
						//timeDb = rs.getTimestamp("lstchg");
						System.out.print("Title:"+title+"\tStatus:"+status+"->");
						//-----------------------------------
						if(status=="Checked" || status=="Paused" || status=="Running")
						{
							tmpDir = null;
							tmpDir = new File(""+title+".class");
							if(tmpDir.exists()==false)
							{
								System.out.print("?");
								status="Edit";
								try
								{
									sql = "UPDATE logics SET (status,lstchg)=('Edit',LOCALTIMESTAMP) WHERE key="+key+"";
									stmt2.executeUpdate(sql);
								}
								catch (Exception e) 
								{
									System.out.print("(Not UPDATE! Edit)");
								}
							}
						}
						//-----------------------------------*/
						switch(status)
						{
//----------------------------------------------------------------------------------
							case "Stoped":
							{
							}
							break;
//----------------------------------------------------------------------------------
							case "Edit":
							case "Stop":
							{
								cmd="";
								for (Thread t : threads)// search if then title is running
								{
									if(t.getName().indexOf(title)!=-1)
									{
										cmd=title;
									}
								}				
								//--------------------------------------------
								if(cmd!="") //if the class is running then get instance
								{
									tmp=0;
									while(tmp<FlowInstAL.size())	//search for instance
									{
										System.out.print(FlowInstAL.get(tmp).GetName()+"="+FlowInstAL.get(tmp).GetName().indexOf(title));
										if(FlowInstAL.get(tmp).GetName().indexOf(title)!=-1)
										{
											break;
										}
										tmp++;
									}
									if(tmp<FlowInstAL.size())
									{
										System.out.print("-------------------------------------Cerrar Logic-----------------------------------\n");
										FlowInstAL.get(tmp).Command(-1); // send command stop to thread
										FlowInstAL.remove(tmp);				// remove it
									}
								}
								try
								{
									sql = "UPDATE logics SET (status,lstchg)=('Stoped',LOCALTIMESTAMP) WHERE key="+key+"";
									stmt2.executeUpdate(sql);
								}
								catch (Exception e) 
								{
									System.out.print("(Not UPDATE! Running)");
								}
							}
							break;
//----------------------------------------------------------------------------------
							case "Check":
							{
								//------------------------------------
								try
								{
									sql = "UPDATE logics SET (status,lstchg)=('Checking',LOCALTIMESTAMP) WHERE key="+key+"";
									stmt2.executeUpdate(sql);
								}
								catch (Exception e) 
								{
									System.out.print("(Not UPDATE! Checking)");
								}
								//------------------------------------
								cmd="javac -Xlint lgc_"+title+".java";
								exec = null;
								exec =runtime.exec(cmd); // run command line to compile java file
								System.out.print("Compiling["+cmd+"]");
								exec.waitFor();
							}
							break;
//----------------------------------------------------------------------------------
							case "Checking":
							{
								tmpDir = null;
								tmpDir = new File("lgc_"+title+".class");
								if(tmpDir.exists()) // check if file class exist
								{
									try
									{
										sql = "UPDATE logics SET (status,lstchg)=('Stop',LOCALTIMESTAMP) WHERE key="+key+"";
										stmt2.executeUpdate(sql);
									}
									catch (Exception e) 
									{
										System.out.print("(Not UPDATE! Stop)");
									}
								}
								else
								{
									try
									{
										sql = "UPDATE logics SET (status,lstchg)=('Check',LOCALTIMESTAMP) WHERE key="+key+"";
										stmt2.executeUpdate(sql);
									}
									catch (Exception e) 
									{
										System.out.print("(Not UPDATE! Check)");
									}
								}
							}
							break;
//----------------------------------------------------------------------------------
							case "Start":
							{
								cmd="";
								for (Thread t : threads) // search if then title is running
								{
									if(t.getName().indexOf(title)!=-1)
									{
										cmd=title;
									}
								}				
								//--------------------------------------------
								if(cmd=="") //if the class is not running then start it
								{
									tmpDir = null;
									tmpDir = new File("lgc_"+title+".class");
									if(tmpDir.exists()==false)// check if file class exist
									{
										try
										{
											sql = "UPDATE logics SET (status,lstchg)=('Check',LOCALTIMESTAMP) WHERE key="+key+"";
											stmt2.executeUpdate(sql);
										}
										catch (Exception e) 
										{
											System.out.print("(Not UPDATE! Check)");
										}
										break;
									}
									//-----------------------------------
									System.out.print("Starting\n");
									tmp=FlowInstAL.size();
									FlowInstAL.add(howdy("lgc_"+title)); // add new instance of title class 
									//-----------------------------------
									FlowThreads=new Thread(FlowInstAL.get(tmp)); // create it as thread
									FlowThreads.start();						//start it
									//-----------------------------------
									try
									{
										sql = "UPDATE logics SET (status,lstchg)=('Running',LOCALTIMESTAMP) WHERE key="+key+"";
										stmt2.executeUpdate(sql);
									}
									catch (Exception e) 
									{
										System.out.print("(Not UPDATE! Running)");
									}
									System.out.print("go->Running");
								}
								else // if it is already running, it must restart
								{
									tmp=0;
									while(tmp<FlowInstAL.size())// search instance of class to stop
									{
										System.out.print(FlowInstAL.get(tmp).GetName()+"="+FlowInstAL.get(tmp).GetName().indexOf(title));
										if(FlowInstAL.get(tmp).GetName().indexOf(title)!=-1)
										{
											break;
										}
										tmp++;
									}
									if(tmp<FlowInstAL.size())
									{
										System.out.print("-------------------------------------Cerrar Logic-----------------------------------\n");
										FlowInstAL.get(tmp).Command(-1); // send command stop to thread
										FlowInstAL.remove(tmp);			// remove instance of class
									}
								}
							}
							break;
//----------------------------------------------------------------------------------
							case "Paused":
							{
								//--------------------------------------------
								cmd="";
								for (Thread t : threads)
								{
									if(t.getName().indexOf(title)!=-1)
									{
										cmd=title;
									}
								}				
								//--------------------------------------------
								if(cmd=="")
								{
									System.out.print("False ");
									try
									{
										sql = "UPDATE logics SET (status,lstchg)=('Stop',LOCALTIMESTAMP) WHERE key="+key+"";
										stmt2.executeUpdate(sql);
									}
									catch (Exception e) 
									{
										System.out.print("(Not UPDATE! Stop)");
									}
									break;
								}
								else
								{
									System.out.print("True ");
								}
								//--------------------------------------------
								tmp=0;
								while(tmp<FlowInstAL.size())
								{
									if(FlowInstAL.get(tmp).GetName().indexOf(title)!=-1)
									{
										break;
									}
									tmp++;
								}
								if(tmp<FlowInstAL.size())
								{
									if(FlowInstAL.get(tmp).GetStatus()!=0)
									{
										System.out.print("Set Paused");
										FlowInstAL.get(tmp).Command(0);
									}
								}
								else
								{
									System.out.print("No found:"+title);
								}
								//--------------------------------------------
							}
							break;
							case "Running":
							{
								//--------------------------------------------
								cmd="";
								for (Thread t : threads)
								{
									if(t.getName().indexOf(title)!=-1)
									{
										cmd=title;
									}
								}				
								//--------------------------------------------
								if(cmd=="")
								{
									System.out.print("False ");
									try
									{
										sql = "UPDATE logics SET (status,lstchg)=('Stop',LOCALTIMESTAMP) WHERE key="+key+"";
										stmt2.executeUpdate(sql);
									}
									catch (Exception e) 
									{
										System.out.print("(Not UPDATE! Stop)");
									}
								}
								else
								{
									System.out.print("True ");
								}
								//--------------------------------------------
								tmp=0;
								while(tmp<FlowInstAL.size())
								{
									if(FlowInstAL.get(tmp).GetName().indexOf(title)!=-1)
									{
										break;
									}
									tmp++;
								}
								if(tmp<FlowInstAL.size())
								{
									if(FlowInstAL.get(tmp).GetStatus()!=300)
									{
										System.out.print("Set Running");
										FlowInstAL.get(tmp).Command(300);
									}
								}
								else
								{
									System.out.print("No found:"+title);
								}
								//------------------------------------------
							}
							break;
							default:
							{
								System.out.print("Status desconocido["+status+"]");
							}
							break;
						}
						System.out.print("\n");
					}
				}
				else
				{
					System.out.println("No Rslt:"+sql);
					System.exit(0);
				}
				rs.close();
				stmt.close();
				//=--=--=--=--=--=--=--=--=--=--=--=--=--= Rx Commands =--=--=--=--=--=--=--=--=--=--=--=--=--=--=
				try
				{
					dt = new java.util.Date();
					if(rxcmd.command!=null && rxcmd.flow!=null && rxcmd.command!="" && rxcmd.flow!="")
					{
						System.out.print("Rx Command for "+rxcmd.flow+":("+rxcmd.command+")\n");
						//--------------------------------------------------------
						/*tmp=0;
						while(tmp<FlowInstAL.size())
						{
							System.out.print(FlowInstAL.get(tmp).GetName()+"="+FlowInstAL.get(tmp).GetName().indexOf(rxcmd.flow));
							if(FlowInstAL.get(tmp).GetName().indexOf(rxcmd.flow)!=-1)
							{
								break;
							}
							tmp++;
						}
						if(tmp>=FlowInstAL.size())
						{
							System.out.print("["+rxcmd.flow+"?]\n");
							rxcmd.command="";
						}
						System.out.print("["+rxcmd.flow+"="+FlowInstAL.get(tmp).GetName()+"]->");
						switch(rxcmd.command)
						{
							case "Play":
							{
								tmp2=FlowInstAL.get(tmp).GetStatus()
								FlowInstAL.get(tmp).Command(300);
								try
								{
									sql = "UPDATE logics SET (status,lstchg)=('Running',LOCALTIMESTAMP) WHERE title='"+rxcmd.flow+"'";
									stmt2.executeUpdate(sql);
								}
								catch (Exception e) 
								{
									System.out.print("(Not UPDATE! Running)");
								}
							}
							break;
							case "Stop":
							{
								System.out.print("mata thread");
								FlowInstAL.get(tmp).Command(-1);
							}
							break;
							case "Pause":
							{
								FlowInstAL.get(tmp).Command(0);
								try
								{
									sql = "UPDATE logics SET (status,lstchg)=('Paused',LOCALTIMESTAMP) WHERE title='"+rxcmd.flow+"'";
									stmt2.executeUpdate(sql);
								}
								catch (Exception e) 
								{
									System.out.print("(Not UPDATE! Paused)");
								}
							}
							break;
							default:
							{
								System.out.print("<default>");
							}
							break;
						}
						System.out.print("\n");*/
						rxcmd.command="";
					}
				}
				catch ( Exception e )
				{
					System.out.print("\nError on RxCommand\n"+e.toString());
					System.exit(0);
				}
				//=--=--=--=--=--=--=--=--=--=--=--=--=--= wait =--=--=--=--=--=--=--=--=--=--=--=--=--=--=
				stmt2.close();
				try
				{
					Thread.sleep(T2sleep);
				}
				catch (InterruptedException ie) 
				{
					System.err.println("\tErr[0]:"+ie.getClass().getName() + ":" + ie.getMessage() );
					System.exit(0);
				}
			}
			//=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=
		}
		catch ( Exception e )
		{
				System.err.println("\tErr[5]:"+e.getClass().getName() + ":" + e.getMessage() );
				System.exit(0);
		}
	}
}
