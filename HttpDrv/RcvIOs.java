import java.sql.*;
import java.io.*;

public class RcvIOs
{

	private int db=0;
	public int ByToInt(String Datos)
	{
		int temp=0;
		int temp2=0;
		temp2=((int)Datos.charAt(3))&255;
		temp+=temp2<<24;
		temp2=((int)Datos.charAt(2))&255;
		temp+=temp2<<16;
		temp2=((int)Datos.charAt(1))&255;
		temp+=temp2<<8;
		temp2=((int)Datos.charAt(0))&255;
		temp+=temp2;
		return temp;
	}

	public RcvIOs(String str,String id,String resource) throws Exception
	{
		Connection c = null;
    Statement stmt = null;
		java.util.Date dt = new java.util.Date();
		ResultSet rs;
		String sql;
		Timestamp lsttmstmp=null;
		String[] datos;
		int tempV=0;
		int tempV2=0;
		long tmpL=0;
		String temp;
		//---------------------------------------
		int periodo=0;
		int io=0;
		int Plc=0;
		int FlagV=0;
		String Flags="";
		int conteo=0;
		int valor=0;
		int muestras=0;
		String Error="";
		datos=new String[10];
		java.util.Date timeDb;
		Object colorTable[]={"Off","Red","Yellow","Red+Yellow","Green","Err G+R","Green+Yellow","Error Code","Err 0x08","Err 0x09","Err 0x0A","Err 0x0B","Err 0x0C","Err 0x0D","Err 0x0E","Err 0x0F","+ Flashing 1hz off","+ Flashing 1hz Red","+ Flashing 1hz Yellow","+ Flashing 1hz Red+Yellow","+ Flashing 1hz Green","+ Flashing 1hz Green","Err G+R","+ Flashing 1hz Green+Yellow","+ Flashing 2hz Red","+ Flashing 2hz Yellow","+ Flashing 2hz Red+Yellow","+ Flashing 2hz Green","+ Flashing 2hz Green","Err G+R","+ Flashing 2hz Green+Yellow"};
		//-----------------------------------------
		String conection="";
		conection="jdbc:postgresql://localhost:5432/SrvDb";	//conection="jdbc:sqlite:ServerDb.sqlite";
		Class.forName("org.postgresql.Driver");//Class.forName("org.sqlite.JDBC");
		c = DriverManager.getConnection(conection,"postgres","admin");
		c.setAutoCommit(true);
		stmt = c.createStatement();
		//---------------------------------------
		try
		{
			tempV=str.indexOf("RTC:");
			if(tempV!=-1)
			{
				temp=str.substring(tempV+4);
				tempV=temp.indexOf("\r");
				temp=temp.substring(0,tempV);
				temp=temp.trim();
				tempV=Integer.parseInt(temp);
				//System.out.print("RTC:"+tempV+" str:"+str.length()+"\n");
				sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+tempV+"\') WHERE id = \'/"+id+"/RTC\'";
				try
				{
					stmt.executeUpdate(sql);
				}
				catch ( Exception e )
				{
					System.err.println("Err0:"+e.getClass().getName() + ": " + e.getMessage() );
				}
			}
			System.out.print("\n---------------------(28)IOs:"+str.length()+"-------------------------\n");
			//---------------------------------------------------
		}
		catch ( Exception e )
		{
			System.err.println("Err1:"+e.getClass().getName() + ": " + e.getMessage() );
			System.exit(0);
		}
		//-----------------------------------------
		if(str.length()%28!=0)
			System.out.println("Leng"+str.length()+"!=28");
		//else
		{
			while(str.length()>=28)
			{
				io++;
				sql="SELECT * FROM variables WHERE id = \'/"+id+"/IOs"+io+"/Datos\' ORDER BY lstchg DESC";
				rs = stmt.executeQuery(sql);
				if(rs.next())
				{
					sql = rs.getString("value");
					lsttmstmp = rs.getTimestamp("lstchg");
					datos =sql.split(",");
				}
				//----------------
				try
				{
					tempV=str.charAt(0);
					Flags="Output";
					if((tempV&0x00000001)!=0)
						Flags="Input";
					if((tempV&0x00000002)!=0)
						Flags+=",precent";
					else
						Flags+=",absent";
					if((tempV&0x00000010)!=0)
						Flags+=",Enable";
					else
						Flags+=",Disable";
					if((tempV&0x00000020)!=0)
						Flags+=",Fail";
					sql = "";
				}
				catch ( Exception e )
				{
					System.err.println("\tErrProcData:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
				}
				try
				{
					sql = "INSERT INTO variables (id,lstchg,value,typ) VALUES (\'/"+id+"/IOs"+io+"/Status\',LOCALTIMESTAMP,\'"+Flags+"\','StrR');"; 
					stmt.executeUpdate(sql);
				}
				catch ( Exception x )
				{
					try
					{
						sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+Flags+"\') WHERE id = \'/"+id+"/IOs"+io+"/Status\'";
						stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\tErr2:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
				}
				//----------------
				temp=str.substring(4,8);
				muestras=ByToInt(temp);
				try
				{
					sql = "INSERT INTO variables (id,lstchg,value,typ) VALUES (\'/"+id+"/IOs"+io+"/Samples\',LOCALTIMESTAMP,\'"+muestras+"\','IntR');"; 
					stmt.executeUpdate(sql);
				}
				catch ( Exception x )
				{
					try
					{
						sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+muestras+"\') WHERE id = \'/"+id+"/IOs"+io+"/Samples\'";
						stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\tErr3:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
				}
				//----------------
				temp=str.substring(8,12);
				valor=ByToInt(temp);
				try
				{
					sql = "INSERT INTO variables (id,lstchg,value,typ) VALUES (\'/"+id+"/IOs"+io+"/Valor\',LOCALTIMESTAMP,\'"+valor+"\','IntR');"; 
					stmt.executeUpdate(sql);
				}
				catch ( Exception x )
				{
					try
					{
						sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+valor+"\') WHERE id = \'/"+id+"/IOs"+io+"/Valor\'";
						stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\tErr4:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
				}
				//----------------
				if(datos[1]!=null && datos[2]!=null)
				{
					try
					{
						tempV=Integer.parseInt(datos[1]);
						if(muestras>tempV)
							tempV2=muestras-tempV;
						else
							tempV2=tempV-muestras;
						tempV=Integer.parseInt(datos[2]);
						if(valor>tempV)
							tempV=valor-tempV;
						else
							tempV=tempV-valor;
						tempV=((tempV*100)/tempV2);
						tempV=Math.round(tempV*100)/100;
						sql = "INSERT INTO variables (id,lstchg,value,typ) VALUES (\'/"+id+"/IOs"+io+"/Ocup\',LOCALTIMESTAMP,\'"+tempV+"\','IntR');"; 
						stmt.executeUpdate(sql);
					}
					catch ( Exception x )
					{
						try
						{
							sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+tempV+"\') WHERE id = \'/"+id+"/IOs"+io+"/Ocup\'";
							stmt.executeUpdate(sql);
						}
						catch ( Exception e )
						{
							System.err.println("\tErr5:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
						}
					}
				}
				//----------------
				temp=str.substring(12,16);
				conteo=ByToInt(temp);
				try
				{
					sql = "INSERT INTO variables (id,lstchg,value,typ) VALUES (\'/"+id+"/IOs"+io+"/ConteoAcumulado\',LOCALTIMESTAMP,\'"+conteo+"\','IntR');"; 
					stmt.executeUpdate(sql);
				}
				catch ( Exception x )
				{
					try
					{
						sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+conteo+"\') WHERE id = \'/"+id+"/IOs"+io+"/ConteoAcumulado\'";
						stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\tErr6:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
				}
				//----------------
				if(datos[3]!=null && datos[3]!="")
				{
					tempV=Integer.parseInt(datos[3]);
					if(conteo>tempV)
						tempV=(conteo-tempV);
					else
						tempV=(tempV-conteo);
					try
					{
						sql = "INSERT INTO variables (id,lstchg,value,typ) VALUES (\'/"+id+"/IOs"+io+"/Conteo\',LOCALTIMESTAMP,\'"+tempV+"\','IntR');"; 
						stmt.executeUpdate(sql);
					}
					catch ( Exception x )
					{
						try
						{
							sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+tempV+"\') WHERE id = \'/"+id+"/IOs"+io+"/Conteo\'";
							stmt.executeUpdate(sql);
						}
						catch ( Exception e )
						{
							System.err.println("\tErr7:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
						}
					}
					//-----------------------
					if(lsttmstmp!=null)
					{
						tmpL=lsttmstmp.getTime();
						lsttmstmp=new Timestamp(System.currentTimeMillis());
						tmpL=lsttmstmp.getTime()-tmpL;
						tmpL=(tmpL/1000);
						try
						{
							sql = "INSERT INTO variables (id,lstchg,value,typ) VALUES (\'/"+id+"/IOs"+io+"/Periodo\',LOCALTIMESTAMP,\'"+tmpL+"\','IntR');"; 
							stmt.executeUpdate(sql);
						}
						catch ( Exception x )
						{
							try
							{
								sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+tmpL+"\') WHERE id = \'/"+id+"/IOs"+io+"/Periodo\'";
								stmt.executeUpdate(sql);
							}
							catch ( Exception e )
							{
								System.err.println("\tErr8:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
							}
						}
					}
				}
				//----------------
				Flags=Flags.replace(",","/");
				try
				{
					System.out.print("\t/"+id+"/IO["+io+"]\t"+Flags+"\t"+valor+","+conteo+","+muestras+"\n");
					sql = "INSERT INTO variables (id,lstchg,value,typ) VALUES (\'/"+id+"/IOs"+io+"/Datos\',LOCALTIMESTAMP,\'"+Flags+","+muestras+","+valor+","+conteo+"\','StrR');"; 
					stmt.executeUpdate(sql);
				}
				catch ( Exception x )
				{
					try
					{
						sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+Flags+","+muestras+","+valor+","+conteo+"\') WHERE id = \'/"+id+"/IOs"+io+"/Datos\'";
						stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\tErr9:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
				}
				//===================================================================
				sql="SELECT * FROM hisvars WHERE id LIKE \'/"+id+"/IOs"+io+"/CapTime\' ORDER BY date DESC" ;
				rs = stmt.executeQuery(sql);
				if(rs.next())
				{
					periodo=Integer.parseInt(rs.getString("value"));
					sql="SELECT * FROM hisvars WHERE id LIKE \'/"+id+"/IOs"+io+"/%\' ORDER BY date DESC" ;
					rs = stmt.executeQuery(sql);
					if(rs.next() && datos[0]!=null && datos[1]!=null && datos[2]!=null && datos[3]!=null && periodo!=0)
					{
						dt = new java.util.Date();
						timeDb = rs.getTimestamp("date");
						if((dt.getTime()-timeDb.getTime())>(periodo*1000))
						{
							tempV=Integer.parseInt(datos[3]);
							try
							{
								System.out.print("\t"+datos[0]+"[Conteo:"+(conteo-tempV));
								sql = "INSERT INTO hisvars (id,value,date) VALUES (\'/"+id+"/IOs"+io+"/Conteo\',\'"+(conteo-tempV)+"\',LOCALTIMESTAMP);"; 
								stmt.executeUpdate(sql);
							}
							catch ( Exception e )
							{
								System.err.println("\tErr10:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
							}
							if(muestras!=0)
							{
								try
								{
									tempV=Integer.parseInt(datos[1]);
									if(muestras>tempV)
										muestras=muestras-tempV;
									tempV=Integer.parseInt(datos[2]);
									valor=valor-tempV;
									tempV=((valor/muestras)*100);
								}
								catch ( Exception e )
								{
									System.err.println("\tDatos["+datos[1]+","+datos[2]+","+datos[3]+"]V:"+valor+" M:"+muestras+"");
									System.err.println("\tErrOcup:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
								}
							}
							try
							{
								System.out.print(",Ocupacion:"+tempV+"] ("+datos[0]+","+datos[1]+","+datos[2]+","+datos[3]+")\n");
								sql = "INSERT INTO hisvars (id,value,date) VALUES (\'/"+id+"/IOs"+io+"/Ocup\',\'"+tempV+"\',LOCALTIMESTAMP);"; 
								stmt.executeUpdate(sql);
							}
							catch ( Exception e )
							{
								System.err.println("\tErr11:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
							}
						}
						else
						{
							System.out.print("\t[Next Time Cap:"+((15*60*1000)-(dt.getTime()-timeDb.getTime()))/60000+"]\n");
						}
					}
				}
				//-----------------------------------------
				str=str.substring(28);
			}
		}
		//c.commit();
		stmt.close();
		c.close();//*/
	}
}
