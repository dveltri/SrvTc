import java.sql.*;
import java.io.*;

public class Pdgv
{

	private int db=0;
	int Pdgv_Osi2(char *pucBuffer,unsigned int ulLen,unsigned int ori)//byte stream
	{
	   unsigned char Data;
	   while(ulLen--)
	   {
		   Data=*pucBuffer++;
		   Sck->RxTOut=get_timer0();
		   //---------------------------------------------------------------------------
		   switch(Sck->RxSts)
		   {
			  case Osi2:
			  case Osi2_Start:
				 if(Data!=pdgv_Preambulo)
					break;
				 output_hi(LedRx);
				 Sck->RxSts=Osi2_Ctrl;
			  break;
			  case Osi2_Ctrl:
				 if((0XEB&Data)!=0)
				 {
					output_low(LedRx);
					RxSts=Osi2;
					return 0;
				 }
				 Sck->TmpBf[CmpCtr]=Data;
				 Sck->RxSts=Osi2_IdS;
			  break;
			  case Osi2_IdS:
				 Sck->TmpBf[CmpIdS]=Data;
				 Sck->RxSts=Osi2_IdT;
			  break;
			  case Osi2_IdT:
				 Sck->TmpBf[CmpIdT]=Data;
				 Sck->RxSts=Osi2_SockS;
			  break;
			  case Osi2_SockS:
				 Sck->TmpBf[CmpSkS]=Data;
				 Sck->RxSts=Osi2_SockT;
			  break;
			  case Osi2_SockT:
				 Sck->TmpBf[CmpSkT]=Data;
				 Sck->ui32tmp=0;
				 Sck->LenSz=0;
				 Sck->RxSts=Osi2_Len;
			  break;
			  case Osi2_Len:
				 if(Data>MaxLen)
				 {
					output_low(LedRx);
					Sck->RxSts=Osi2;
					Error(DgvP_Er_Ctrl);
					return 0;
				 }
				 Sck->RxPk=(DgvPk *)MallocDGV((unsigned short)(DgvPSizePk+Data+15),"New.RxPk");
				 if(Sck->RxPk==0)
				 {
					output_low(LedRx);
					Sck->RxSts=Osi2;
					return 0;
				 }
				 memcpy(Sck->RxPk,Sck->TmpBf,CmpLen);
				 Sck->RxPk->Len=Data;
				 Sck->RxPtr=&Sck->RxPk->Data[0];
				 Sck->RxLst=&Sck->RxPk->Data[0];
				 Sck->RxLst+=Sck->RxPk->Len;
				 if(Sck->RxPk->Len)
				 {
					 Sck->RxLst--;
					 Sck->RxSts=Osi2_Datos;
				 }
				 else
				 {
					output_low(LedRx);
					Sck->RxTim=get_timer0();
					Sck->RxSts=Osi3;
					return 1;
				 }
			  break;
			  case Osi2_Datos:
				 *Sck->RxPtr=Data;
				 Sck->RxPtr++;
				 if(Sck->RxPtr>Sck->RxLst)
				 {
					output_low(LedRx);
					Sck->RxTim=get_timer0();
					Sck->RxSts=Osi3;
					return 1;
				 }
			  break;
		   }
	   }
	   return 0;
	}
	
	public Pdgv(byte[] Rx,String id,String resource) throws Exception
	{
		Connection c = null;
		Statement stmt = null;
		Statement stmt2 = null;
		java.util.Date dt = new java.util.Date();
		String sql;
		String Flags="";
		int tempV=0;
		int SDta=0;
		String temp;
		byte[] b;
		//---------------------------------------
		String modo[]={"Error","Flashing","Off","Normal","Normal lock","Remote","Manual","StpByStp","8","9","10","11","12","13","14","15"};
		int Plc=0;
		int Modo=0;
		int ReIntento=0;
		int Estado=0;
		int Plan=0;
		int ErrorCode=0;
		int tErrorCode=0;
		int schnexchg=0;
		int schlstchg=0;
		String str;
		String grp="";
		String str2[];
		String Error="";
		String tError="";
		String Script="";
		String SyncRef="";
		String Name="";
		String Location="";
		String conection="";
		//-----------------------------------------
		conection="jdbc:postgresql://localhost:5432/SrvDb";
		Class.forName("org.postgresql.Driver");
		c = DriverManager.getConnection(conection,"postgres","admin");
		c.setAutoCommit(true);
		//-----------------------------------------
		stmt = c.createStatement();
		stmt2 = c.createStatement();
		ResultSet rs;
		sql = "SELECT * FROM schedulerfnc WHERE setvar LIKE '/"+id+"/%'";
		rs = stmt2.executeQuery(sql);
		if(rs.next())
		{
			grp = rs.getString("id");
		}
		//-----------------------------------------
		str = new String(Rx, "UTF-8");
		if((268-(str.length()%268))==1)
		{
			System.out.println("M3xxx");
			b= new byte[Rx.length+1];
			b[0]=67;
			System.arraycopy(Rx, 0, b, 1, Rx.length);
		}
		else
		{
			b= new byte[Rx.length];
			System.arraycopy(Rx, 0, b, 0, Rx.length);
		}
		/*int i=0;
		while((i+8)<b.length)
		{
			System.out.print("0x"+Integer.toHexString(b[i+0]&255)+"");
			System.out.print( " "+Integer.toHexString(b[i+1]&255)+"");
			System.out.print( " "+Integer.toHexString(b[i+2]&255)+"");
			System.out.print( " "+Integer.toHexString(b[i+3]&255)+"");
			System.out.print("\t"+Integer.toHexString(b[i+4]&255)+"");
			System.out.print( " "+Integer.toHexString(b[i+5]&255)+"");
			System.out.print( " "+Integer.toHexString(b[i+6]&255)+"");
			System.out.print( " "+Integer.toHexString(b[i+7]&255)+"\n");
			i+=8;
		}
		//--------------------------------------------*/
		str = new String(b, "UTF-8");
		System.out.print("\n----------------------(268)PLC:"+str.length()+"-------------------------\n");
		//---------------------------------------
		if((str.length()%268)!=0)
			System.out.println("Leng"+str.length()+"!=268");
		//else
		{
			while(str.length()>=268 && Plc<4)
			{
				Plc++;
				temp=str.substring(0,4);
				tempV=ByToInt(temp);
				//----------------
				Modo=tempV & 0x0F;
				ReIntento=(tempV>>14)&0x03;
				Estado=(tempV>>16)&0x1F;
				Flags="";
				if((tempV&0x00000040)!=0)Flags+=",LampOff";
				//if((tempV&0x00000080)!=0)Flags+=",Test";
				//if((tempV&0x00200000)!=0)Flags+=",EV";
				//if((tempV&0x40000000)!=0)Flags+=",Tmin";
				sql = "";
				//-----------------------------------------
				try
				{
					System.out.println("\n\t["+Integer.toHexString(tempV)+"]");
					System.out.print("\tModo:"+Modo+"="+modo[Modo]);
					System.out.print(","+ReIntento);
					System.out.print(","+Estado);
					System.out.println(Flags);
					sql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+Plc+"/Status\',LOCALTIMESTAMP,\'"+modo[Modo]+Flags+"\');"; //"+Flags+"
					stmt.executeUpdate(sql);
				}
				catch ( Exception x )
				{
					try
					{
						sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+modo[Modo]+"\') WHERE id = \'/"+id+"/PLC"+Plc+"/Status\' ";	//"+Flags+"
						stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\n\tErr1:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
				}
				//----------------
				SyncRef=str.substring(4,28);
				str2=SyncRef.split("\0");
				if(str2.length!=0)SyncRef=str2[0];
				SyncRef=SyncRef.trim();
				SyncRef=SyncRef.replaceAll("\n","");
				SyncRef=SyncRef.replaceAll("[\\p{Cc}\\p{Cf}\\p{Co}\\p{Cn}]", "");
				try
				{
					System.out.println("\tSyncRef:"+SyncRef);
					sql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+Plc+"/SyncRef\',LOCALTIMESTAMP,\'"+SyncRef+"\');"; 
					stmt.executeUpdate(sql);
				}
				catch ( Exception x )
				{
					try
					{
						sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+SyncRef+"\') WHERE id = \'/"+id+"/PLC"+Plc+"/SyncRef\'";
						stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\n\tErr2:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
				}
				//----------------
				Script=str.substring(28,43);
				str2=Script.split("\0");
				if(str2.length!=0)Script=str2[0];
				Script=Script.trim();
				Script=Script.replaceAll("\n","");
				Script=Script.replaceAll("[\\p{Cc}\\p{Cf}\\p{Co}\\p{Cn}]", "");
				try
				{
					System.out.println("\tScript:"+Script);
					sql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+Plc+"/Cplan\',LOCALTIMESTAMP,\'"+Script+"\');"; 
					stmt.executeUpdate(sql);
				}
				catch ( Exception x )
				{
					try
					{
						sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+Script+"\') WHERE id = \'/"+id+"/PLC"+Plc+"/Cplan\'";
						stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\n\tErr3:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
				}
				//----------------
				Name="";
				Name=str.substring(43,68);
				str2=Name.split("\0");
				if(str2.length!=0)Name=str2[0];
				Name=Name.trim();
				Name=Name.replaceAll("\n","");
				Name=Name.replaceAll("[\\p{Cc}\\p{Cf}\\p{Co}\\p{Cn}]", "");
				try
				{
					System.out.println("\tName:"+Name);
					sql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+Plc+"/Nombre\',LOCALTIMESTAMP,\'"+Name+"\');"; 
					stmt.executeUpdate(sql);
				}
				catch ( Exception x )
				{
					try
					{
						sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+Name+"\') WHERE id = \'/"+id+"/PLC"+Plc+"/Nombre\'";
						stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\n\tErr4:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
				}
				//----------------
				Location=str.substring(68,92);
				str2=Location.split("\0");
				if(str2.length!=0)Location=str2[0];
				Location=Location.trim();
				Location=Location.replaceAll("\n","");
				Location=Location.replaceAll("[\\p{Cc}\\p{Cf}\\p{Co}\\p{Cn}]", "");
				try
				{
					if(resource.indexOf("gps")!=-1)
					{
						System.out.println("\tGPS:"+Location);
						sql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+Plc+"/Location\',LOCALTIMESTAMP,\'"+Location+",17\');"; 
						stmt.executeUpdate(sql);
					}
				}
				catch ( Exception x )
				{
					try
					{
						sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+Location+",17\') WHERE id = \'/"+id+"/PLC"+Plc+"/Location\'";
						if(resource.indexOf("gps")!=-1)
							stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\n\tErr4:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
				}
				//----------------
				temp=str.substring(92,96);
				schlstchg=ByToInt(temp);
				try
				{
					System.out.println("\tLST:"+schlstchg);
					sql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+Plc+"/SchLstChg\',LOCALTIMESTAMP,\'"+schlstchg+"\');"; 
					stmt.executeUpdate(sql);
				}
				catch ( Exception x )
				{
					try
					{
						sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+schlstchg+"\') WHERE id = \'/"+id+"/PLC"+Plc+"/SchLstChg\'";
						stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\n\tErr5:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
				}
				//----------------
				temp=str.substring(96,100);
				schnexchg=ByToInt(temp);
				try
				{
					System.out.println("\tNTC:"+schnexchg);
					sql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+Plc+"/SchNexChg\',LOCALTIMESTAMP,\'"+schnexchg+"\');"; 
					stmt.executeUpdate(sql);
				}
				catch ( Exception x )
				{
					try
					{
						sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+schnexchg+"\') WHERE id = \'/"+id+"/PLC"+Plc+"/SchNexChg\'";
						stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\n\tErr6:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
				}
				//----------------
				Plan=str.charAt(147);
				try
				{
					System.out.println("\tPlan:"+Plan);
					sql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+Plc+"/Nplan\',LOCALTIMESTAMP,\'"+Plan+"\');"; 
					stmt.executeUpdate(sql);
				}
				catch ( Exception x )
				{
					try
					{
						sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+Plan+"\') WHERE id = \'/"+id+"/PLC"+Plc+"/Nplan\'";
						stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\n\tErr7:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
				}
				//-----------------------------------------
				sql = "SELECT * FROM variables WHERE id LIKE '/"+id+"/PLC"+Plc+"/Error'";
				//sql = "SELECT * FROM alerts WHERE ref LIKE '"+id+"' AND status NOT LIKE 'Viewed\'";
				rs = stmt2.executeQuery(sql);
				if(rs.next())
				{
					tError = rs.getString("value");
					if(tError.length()>=2)
					{
						str2=tError.split(",");
						str2[0]=str2[0].trim();
						System.out.println("["+str2[0]+"]");
						tErrorCode=0+Integer.parseInt(str2[0]);
					}
				}
				//---------------- */
				{
				temp=str.substring(164,168);
				ErrorCode=ByToInt(temp);
				Error=str.substring(168,268);
				str2=Error.split("\0");
				if(str2.length!=0)Error=str2[0];
				Error=Error.trim();
				Error=Error.replaceAll("\n","");
				Error=Error.replaceAll("[\\p{Cc}\\p{Cf}\\p{Co}\\p{Cn}]", "");
					if(ErrorCode==0)
						Error="";
				try
				{
						if(ErrorCode==0)
						{
							System.out.println("\tClear Error:"+id+".PLC"+Plc);
							sql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+Plc+"/Error\',LOCALTIMESTAMP,\'0,\');"; 
						}
						else
						{
							if(ErrorCode!=tErrorCode)// tError.length()<10)
							{
								System.out.println("\t["+tError.length()+"]("+tErrorCode+")Error Code:"+ErrorCode+","+Error);
								System.out.println("\tInsert Alert Error:"+id);
								sql = "INSERT INTO alerts VALUES (LOCALTIMESTAMP,\'Viewed\',\'"+grp+" Anel:"+Plc+" "+ErrorCode+","+Error+"\',\'"+id+"\',\'Link\')";
								stmt.executeUpdate(sql);
							}
							sql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+Plc+"/Error\',LOCALTIMESTAMP,\'"+ErrorCode+","+Error+"\');"; 
						}
							stmt.executeUpdate(sql);
						}
				catch ( Exception x )
				{
					try
					{
							if(ErrorCode==0)
							{
								System.out.println("\tClear Error:"+id+".PLC"+Plc);
								sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'0,\') WHERE id = \'/"+id+"/PLC"+Plc+"/Error\'";
							}
							else
							{
								if(ErrorCode!=tErrorCode)// tError.length()<10)
								{
									System.out.println("\tInsert Alert Error:"+id);
									sql = "INSERT INTO alerts VALUES (LOCALTIMESTAMP,\'Viewed\',\'"+grp+" Anel:"+Plc+" "+ErrorCode+","+Error+"\',\'"+id+"\',\'Link\')";
									stmt.executeUpdate(sql);
								}
								sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+ErrorCode+","+Error+"\') WHERE id = \'/"+id+"/PLC"+Plc+"/Error\'";
							}
							stmt.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\n\tErr8:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
						}
					}
				}
				//-----------------------------------------*/
				//if(str.length()>267)
					str=str.substring(268);
			}
			Plc++;
			while(Plc<=8)
			{
				sql="DELETE FROM variables WHERE id LIKE '/"+id+"/PLC"+Plc+"%'";
				try
				{
					stmt.executeUpdate(sql);
				}
				catch ( Exception e )
				{
					System.err.println("\n\tErrD:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
				}//*/
				Plc++;
			}
		}
		//c.commit();
		stmt.close();
		c.close();
	}
}
