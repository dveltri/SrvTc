import java.net.*;
import java.sql.*;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class procDat implements Runnable
{
	//---------------------------------------
	private static final int Osi2			=0;
	private static final int Osi2_Start		=1;
	private static final int Osi2_Ctrl		=2;
	private static final int Osi2_IdS		=3;
	private static final int Osi2_IdT		=4;
	private static final int Osi2_SockS		=5;
	private static final int Osi2_SockT		=6;
	private static final int Osi2_Len		=7;
	private static final int Osi2_Datos		=8;
	private static final int Osi3			=10;
	private static final int Osi3_Chk_Crc	=11;
	private static final int Osi3_Chk_ID	=12;
	private static final int Osi2_Len2		=13;
	//---------------------------------------
	private static final int Procces		=20;
	private static final int pdgv_Preambulo	=126;
	private static final int LedRx			=1;
	private static final int LedPs			=2;
	private static final int LedTx			=3;
	private static final int MaxLen			=6144;
	//---------------------------------------
	private static final int pdgv_Ver		=0x01;
	private static final int pdgv_TCP		=0x00;
	private static final int pdgv_UDP		=0x10;
	private static final int pdgv_None		=0x00;
	private static final int pdgv_Chs		=0x04;
	private static final int pdgv_Sum		=0x08;
	private static final int pdgv_Crc		=0x0C;
	//---------------------------------------
	private static final int CMD_RESET			=0;
	private static final int CMD_CHG_ID			=1;
	private static final int CMD_PING			=2;
	private static final int CMD_WEE			=3;
	private static final int CMD_REE			=4;
	private static final int CMD_WRAM			=5;
	private static final int CMD_RRAM			=6;
	private static final int CMD_SBIT_RAM		=7;
	private static final int CMD_CBIT_RAM		=8;
	private static final int CMD_XBIT_RAM		=9;
	private static final int CMD_INC_RAM		=10;
	private static final int CMD_DEC_RAM		=11;
	private static final int CMD_RSRAM			=12;
	private static final int CMD_CBIT_EE		=13;
	private static final int CMD_XBIT_EE		=14;
	private static final int CMD_INC_EE			=15;
	private static final int CMD_DEC_EE			=16;
	private static final int CMD_RTC			=17;
	private static final int CMD_Msg			=18;
	private static final int CMD_EIL			=19;
	private static final int CMD_DgvFs			=20;
	private static final int CMD_PHASE			=21;
	private static final int CMD_LOOP			=22;
	private static final int CMD_MIO12			=23;
	private static final int CMD_UpdIO			=24;
	private static final int CMD_Scoot			=27;
	private static final int CMD_GVars			=28;
	private static final int CMD_RcvFIT			=30;
	private static final int CMD_RcvRtr			=31;
	//private static final int CMD_DPK_TCP		=12;
	private static final int CMD_CONFIRM_TCP	=82;
	private static final int CMD_Err_Trg_Fnc	=83; 		//El Target no tiene el comando/funcion implementado
	private static final int CMD_RUN_PkTSKs		=-4;
	private static final int CMD_RUN_RgTSK		=-3;
	private static final int CMD_RUN_2TSK		=-2;
	//---------------------------------------
	private static final int CmpCtr		=1;
	private static final int CmpIdS		=2;
	private static final int CmpIdT		=3;
	private static final int CmpSkS		=4;
	private static final int CmpSkT		=5;
	private static final int CmpLen		=6;
	private static final int CmpDat		=7;
	//---------------------------------------
	private static final String modo[]={"Error","Flashing","Off","Normal","Normal lock","Remote","Manual","StpByStp","8","9","10","11","12","13","14","15"};
	public static DatagramSocket serverSocket=null;
	public static int RxSts=Osi2;
	public static int SrvId=0;
	public static String drv="";
	//---------------------------------------
	public final BlockingQueue<String[]> queueSql;
	public final BlockingQueue<dat2proc> queuePdgvRx;
	public final BlockingQueue<dat2proc> queuePdgvTx;
	public dat2proc dat=null;
	public Statement stmtD=null;
	//---------------------------------------
	private DatagramPacket sendPacket=null;
	public byte[] sendData = new byte[1024];
	public int log=0;
	//----------------------------------------------------------------------
	//private static final int quezise	=1000;
	//private static String conection="jdbc:postgresql://localhost:5432/SrvDb";
	//private final BlockingQueue<String[]> queueSQ;
	//----------------------------------------------------------------------
	public procDat(String drvo,int srvid,BlockingQueue<dat2proc> queuepdgvrx,BlockingQueue<String[]> queuesql,BlockingQueue<dat2proc> queuepdgvtx,Statement stmt)
	{
		queueSql=queuesql;
		queuePdgvRx=queuepdgvrx;
		queuePdgvTx=queuepdgvtx;
		stmtD=stmt;
		SrvId=srvid;
		drv=drvo;
	}
	//----------------------------------------------------------------------
	public int dgvsqlTH(String InsSql,String UdtSql)
	{
		try
		{
			//System.out.println("<<dgvsqlTH>>["+queueSql.remainingCapacity()+"]");
			queueSql.put(new String[]{InsSql,UdtSql});
		}
		catch ( Exception e )
		{
			System.err.println("\n\tErrUdtTH:"+e.getClass().getName() + ":" + e.getMessage());
			return 2;
		}
		return 0;
	}
	//----------------------------------------------------------------------
	public int output_low(int led)
	{
		return 0;
	}
	public int output_hi(int led)
	{
		return 0;
	}
	public byte CalChsTH(byte[] pucBuffer)
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
	//----------------------------------------------------------------------
	public int Pdgv_Osi2(byte[] pucBuffer,int ulLen,long ori,InetAddress IPAddress, int port)
	{
		int ret=0;
		int idx=0;
		long crc1=0;
		long crc2=0;
		byte Data=0;
		RxSts=Osi2;
		//---------------
		String InsSql="";
		String UdtSql="";
		int size=0;
		int LenSz=0;
		//------------------------------------------------
		//byte[] pucBuffer=Arrays.copyOf(pucBuffer1,ulLen);
		if((log&4)!=0)System.out.printf("\tRxDat["/*+Arrays.toString(pucBuffer)*/+"] Size:"+ulLen+" IP:"+IPAddress.toString()+":"+port+"\n");
		while(idx<ulLen)
		{
			Data=pucBuffer[idx];
			//System.out.println(","+ Integer.toHexString(Data)+"("+idx+")"+RxSts);
			idx++;
			//---------------------------------------------------------------------------
			switch(RxSts)
			{
			  case Osi2:
			  case Osi2_Start:
				if(Data!=pdgv_Preambulo)
					break;
				output_hi(LedRx);
				RxSts=Osi2_Ctrl;
			  break;
			  case Osi2_Ctrl:
				if((0XEB&Data)!=0)
				{
					output_low(LedRx);
					RxSts=Osi2;
					System.out.println("Err.Ctrl");
					return 0;
				}
				RxSts=Osi2_IdS;
			  break;
			  case Osi2_IdS:
				RxSts=Osi2_IdT;
			  break;
			  case Osi2_IdT:
				RxSts=Osi2_SockS;
			  break;
			  case Osi2_SockS:
				RxSts=Osi2_SockT;
			  break;
			  case Osi2_SockT:
				size=0;
				LenSz=0;
				RxSts=Osi2_Len;
			  break;
			  case Osi2_Len:
				size|=((Data&0x7F)<<LenSz);
				if((Data&0x80)!=0)
				{
					LenSz+=7;
				}
				else
				{
					 LenSz=0;
					 if(size>MaxLen)
					 {
						output_low(LedRx);
						RxSts=Osi2;
						System.out.println("Err.MAX");
						return 0;
					 }
					 RxSts=Osi2_Datos;
				}
			  break;
			  case Osi2_Datos:
				LenSz++;
				if(LenSz==size)
				{
					output_low(LedRx);
					RxSts=Osi3;
					//System.out.println(".crc:"+(Data|0x100));
					//System.out.print("\n");
					return (Data|0x100);
				}
			  break;
			}
		}
		System.out.println("Err.out");
		return 0;
	}
	public int Pdgv_Osi3(byte[] pucBuffer1,int ulLen,byte crc1,InetAddress IPAddress, int port)
	{
		byte crc2=0;
		//-----------------------------------------------------
		crc2=CalChsTH(pucBuffer1);
		if(crc1==crc2)
		{
			pucBuffer1[CmpLen]-=1;
			if((log&1)!=0)System.out.print("\tPdgv_Osi3 ok\n");
		}
		else
		{
			if((log&1)!=0)System.out.print("\tPdgv_Osi3 Err Pk.CRC:"+ Long.toHexString(crc1)+ " Cal.CRC:"+Long.toHexString(crc2)+"\n");
			return 1;
		}
		if(pucBuffer1[CmpIdT]==(byte)SrvId)
		{
			return 0;
		}
		else
		{
			if(pucBuffer1[CmpIdS]==(byte)SrvId)
				return 2;
			System.out.print("\tPdgv_Osi3 Err ID:"+pucBuffer1[CmpIdT]+"!="+SrvId+"\n");
			return 1;
		}
	}
	public int Pdgv_Osi4(byte[] pucBuffer1,int ulLen,long ori,InetAddress IPAddress, int port)
	{
		if((pucBuffer1[CmpCtr]&pdgv_UDP)==0)
		{
			sendData[0]=pdgv_Preambulo;
			sendData[CmpCtr]=(pdgv_UDP);
			sendData[CmpIdS]=(byte)ori;
			sendData[CmpIdT]=pucBuffer1[CmpIdS];
			sendData[CmpSkS]=pucBuffer1[CmpSkT];
			sendData[CmpSkT]=CMD_CONFIRM_TCP;
			sendData[CmpLen]=1;
			sendData[CmpDat]=CalChsTH(sendData);
			System.out.print("\tTx ACK to ->"+IPAddress+":"+port+"\n");
			sendPacket = new DatagramPacket(sendData,8, IPAddress, port);
			return 1;
		}
		return 0;
	}
	public int Pdgv_Osi5(byte[] pucBuffer1,int ulLen,long ori,InetAddress IPAddress, int port)
	{
		String id="";
		String cmp="";
		String model="";
		String[] cmps;
		String tmpT="";
		String InsSql="";
		String UdtSql="";
		java.util.Date dt;
		float tmpF=0;
		long tmpL=0;
		int tmpI=0;
		byte tmpB=0;
		int mem=CmpDat;
		int cph=1;
		int cio=1;
		int cplc=1;
		//----------------------------------------------
		ResultSet rs;
		if((log&1)!=0)System.out.print("\tOsi5:\n");
		//-----------------------------------------------------
		//dt = new java.util.Date();
		//UdtSql="SELECT * FROM pdgv where drv LIKE '"+drv+"%' AND action NOT LIKE '%Sended%' AND lstchg < to_timestamp("+(dt.getTime()/1000)+")" ;
		//dt = null
		UdtSql="SELECT * FROM pdgv where drv LIKE '"+drv+"' AND pdgvid="+((int)pucBuffer1[CmpIdS]&0xFF);
		try
		{
			rs = stmtD.executeQuery(UdtSql);
			if(rs.next())
			{
				if((log&2)!=0)System.out.print("\t\tGetCmps:"+drv+" dgvp.id:"+((int)pucBuffer1[CmpIdS]&0xFF)+" Found!\n");
				id = rs.getString("id");
				cmp = rs.getString("cmps");
				model = rs.getString("model");
				try
				{
					try { if (rs != null) rs.close(); } catch (Exception e) {};
					if((log&2)!=0)System.out.println("\t\tID:"+id);
					//if((log&1)!=0)System.out.println("\t\tCmps:\n\t["+cmp+"]");
					if((log&2)!=0)System.out.println("\t\tModel:"+model);
					if((log&2)!=0)
					{
						System.out.print  ("\t\tFlg:"+((int)pucBuffer1[CmpCtr]&0xFF)+" IDS:"+((int)pucBuffer1[CmpIdS]&0xFF)+" IDT:"+((int)pucBuffer1[CmpIdT]&0xFF)+" SckS:"+((int)pucBuffer1[CmpSkS]&0xFF)+" SckT:"+((int)pucBuffer1[CmpSkT]&0xFF)+" Len:"+((int)pucBuffer1[CmpLen]&0xFF));
						System.out.println("Dat:");
					}
				}
				catch ( Exception e )
				{
					System.err.println("\tErr[osi5.1.log]:"+e.getClass().getName() + ":" + e.getMessage() );
				}
				cmps=cmp.split(",");
				try
				{
					InsSql = "INSERT INTO variables VALUES (\'/"+id+"/Drv_Status\',\'pool\',LOCALTIMESTAMP)";
					UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'pool\') WHERE id=\'/"+id+"/Drv_Status\' AND value<>\'pool\'";
					dgvsqlTH(InsSql,UdtSql);
					InsSql = "INSERT INTO variables VALUES (\'/"+id+"/Lnk_Status\',\'ok\',LOCALTIMESTAMP)";
					UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'ok\') WHERE id=\'/"+id+"/Lnk_Status\' AND value<>\'ok\'";
					dgvsqlTH(InsSql,UdtSql);
					InsSql = "INSERT INTO variables VALUES (\'/"+id+"/address\',\'"+IPAddress+"\',LOCALTIMESTAMP)";
					UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'"+IPAddress+"\') WHERE id=\'/"+id+"/address\' AND value<>\'"+IPAddress+"\'";
					dgvsqlTH(InsSql,UdtSql);
					UdtSql = "UPDATE pdgv SET (ip,status,lstupd)=(\'"+IPAddress+"\',\'ok\',LOCALTIMESTAMP) WHERE id=\'"+id+"\'";
					dgvsqlTH("",UdtSql);
				}
				catch ( Exception e )
				{
					System.err.println("\tErr[osi5.2.ok]:"+e.getClass().getName() + ":" + e.getMessage() );
				}
				//------------------------------------------------------------------------------------------
				switch((int)pucBuffer1[CmpSkT])
				{
					case CMD_PING:
					{
						if((log&2)!=0)System.out.println("\t\tCMD_PING..");
					}
					break;
					case CMD_Msg:
					{
						if((log&2)!=0)System.out.println("\t\tCMD_Msg:");
						InsSql = "INSERT INTO alerts VALUES (LOCALTIMESTAMP,\'Viewed\',\'["+id+"] "+new String(Arrays.copyOfRange(pucBuffer1, CmpDat,pucBuffer1[CmpLen]))+"\',\'"+id+"\',\'Link\')";
						dgvsqlTH(InsSql,"");
						InsSql = "";
					}
					break;
					case CMD_CONFIRM_TCP:
					{
						if((log&2)!=0)System.out.println("\t\tCMD_CONFIRM_TCP");
					}
					break;
					case CMD_Err_Trg_Fnc:
					{
						if((log&2)!=0)System.out.println("\t\tCMD_Err_Trg_Fnc");
					}
					break;
					case CMD_RUN_PkTSKs:
					{
						if((log&2)!=0)System.out.println("\t\tCMD_RUN_PkTSKs["+cmps.length+"] ");
						try
						{
							for (int i = 0; i < cmps.length; i++)
							{
								switch(cmps[i])
								{
									case "RTC":
									{
										tmpL=0;
										tmpL|=((pucBuffer1[mem  ]&0xFF)    );
										tmpL|=((pucBuffer1[mem+1]&0xFF)<< 8);
										tmpL|=((pucBuffer1[mem+2]&0xFF)<<16);
										tmpL|=((pucBuffer1[mem+3]&0xFF)<<24);
										mem+=4;
										tmpL*=1000;
										dt = new java.util.Date(tmpL);
										tmpT=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(dt);
										dt = null;
										InsSql = "INSERT INTO variables VALUES (\'/"+id+"/RTC\',\' \',LOCALTIMESTAMP)";
										UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'"+tmpT+"\') WHERE id=\'/"+id+"/RTC\' AND value<>\'"+tmpT+"\'";
										if((log&4)!=0)System.out.println("\tDate:"+tmpL+"("+tmpT+")");
										tmpT = null;
										dgvsqlTH(InsSql,UdtSql);
									}
									break;
									case "Voltage":
									{
										tmpL=0;
										tmpL|=((pucBuffer1[mem  ]&0xFF)    );
										tmpL|=((pucBuffer1[mem+1]&0xFF)<< 8);
										tmpL|=((pucBuffer1[mem+2]&0xFF)<<16);
										tmpL|=((pucBuffer1[mem+3]&0xFF)<<24);
										mem+=4;
										tmpF=tmpL/100;
										InsSql = "INSERT INTO variables VALUES (\'/"+id+"/Voltage\',\'"+tmpF+"\',LOCALTIMESTAMP)";
										UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'"+tmpF+"\') WHERE id=\'/"+id+"/Voltage\' AND value<>\'"+tmpF+"\'";
										if((log&4)!=0)System.out.println("\tVoltage:"+tmpF);
										dgvsqlTH(InsSql,UdtSql);
									}
									break;
									case "PlcMode":
									{
										for(tmpL=0;tmpL<cplc;tmpL++)
										{
											tmpI=0;
											tmpI|=((pucBuffer1[mem  ]&0xFF)    );
											tmpI|=((pucBuffer1[mem+1]&0xFF)<< 8);
											mem+=2;
											//ReIntento=(tmpI>>12)&0x07;
											//Estado=(tmpI>>16)&0x1F;
											tmpT="";
											if((tmpI&0x00000040)!=0)tmpT+=",LampOff";
											//if((tmpI&0x00000080)!=0)tmpT+=",Test";
											//if((tmpI&0x00200000)!=0)tmpT+=",EV";
											//if((tmpI&0x40000000)!=0)tmpT+=",Tmin";
											InsSql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+(tmpL+1)+"/Status\',LOCALTIMESTAMP,\'"+modo[(tmpI&0x0F)]+tmpT+"\');";
											UdtSql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+modo[(tmpI&0x0F)]+tmpT+"\') WHERE id = \'/"+id+"/PLC"+(tmpL+1)+"/Status\' AND value<>\'"+modo[(tmpI&0x0F)]+tmpT+"\'";
											if((log&4)!=0)System.out.println("\tMode:"+modo[(tmpI&0x0F)]+tmpT+"("+Integer.toHexString(tmpI)+")");
											dgvsqlTH(InsSql,UdtSql);
											InsSql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+(tmpL+1)+"/Nombre\',LOCALTIMESTAMP,\'Ctrl"+(tmpL+1)+"\');";
											dgvsqlTH(InsSql,"");
										}
									}
									break;
									case "Nplan":
									{
										for(tmpL=0;tmpL<cplc;tmpL++)
										{
											tmpI=0;
											tmpI|=((pucBuffer1[mem  ]&0xFF)    );
											mem+=1;
											InsSql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+(tmpL+1)+"/Nplan\',LOCALTIMESTAMP,\'"+tmpI+"\');";
											UdtSql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+tmpI+"\') WHERE id = \'/"+id+"/PLC"+(tmpL+1)+"/Nplan\' AND value<>\'"+tmpI+"\'";
											if((log&4)!=0)System.out.println("\tNplan:"+Integer.toHexString(tmpI));
											dgvsqlTH(InsSql,UdtSql);
										}
									}
									break;
									case "Cplc":
									{
										cplc=0;
										cplc|=((pucBuffer1[mem  ]&0xFF)    );
										mem+=1;
										InsSql = "INSERT INTO variables VALUES (\'/"+id+"/PLC_Count\',\'"+cplc+"\',LOCALTIMESTAMP)";
										UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'"+cplc+"\') WHERE id=\'/"+id+"/PLC_Count\' AND value<>\'"+cplc+"\'";
										if((log&4)!=0)System.out.println("\tcplc:"+cplc);
										dgvsqlTH(InsSql,UdtSql);
									}
									break;
									case "Cio":
									{
										cio=0;
										cio|=((pucBuffer1[mem  ]&0xFF)    );
										mem+=1;
										InsSql = "INSERT INTO variables VALUES (\'/"+id+"/IO_Count\',\'"+cio+"\',LOCALTIMESTAMP)";
										UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'"+cio+"\') WHERE id=\'/"+id+"/IO_Count\' AND value<>\'"+cio+"\'";
										if((log&4)!=0)System.out.println("\tCio:"+cio);
										dgvsqlTH(InsSql,UdtSql);
									}
									break;
									case "Cph":
									{
										cph=0;
										cph|=((pucBuffer1[mem  ]&0xFF)    );
										mem+=1;
										InsSql = "INSERT INTO variables VALUES (\'/"+id+"/PhasesCount\',\'"+cph+"\',LOCALTIMESTAMP)";
										UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'"+cph+"\') WHERE id=\'/"+id+"/PhasesCount\' AND value<>\'"+cph+"\'";
										if((log&4)!=0)System.out.println("\tCphase:"+cph);
										dgvsqlTH(InsSql,UdtSql);
									}
									break;
									case "PhColor":
									{
										try
										{
											for(tmpI=0;tmpI<cph;tmpI++)
											{
												tmpB=pucBuffer1[mem+tmpI];
												tmpB&=127;
												InsSql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/Phase"+(tmpI+1)+"/Color\',LOCALTIMESTAMP,\'"+tmpB+"\');";
												UdtSql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+tmpB+"\') WHERE id = \'/"+id+"/Phase"+(tmpI+1)+"/Color\' AND value<>\'"+tmpB+"\'";
												if((log&4)!=0)System.out.print("\t\tPh["+tmpI+"].Color:");
												if((log&4)!=0)System.out.printf("0x%02X \n",tmpB);
												dgvsqlTH(InsSql,UdtSql);
											}
										}
										catch ( Exception e )
										{
											System.err.println("\tErr[osi5.cmps.phcolor]:"+e.getClass().getName() + ":" + e.getMessage() );
										}
										mem+=cph;
									}
									break;
									case "PhRColor":
									{
										try
										{
											for(tmpI=0;tmpI<cph;tmpI++)
											{
												tmpB=pucBuffer1[mem+tmpI];
												tmpB&=127;
												InsSql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/Phase"+(tmpI+1)+"/Rcolor\',LOCALTIMESTAMP,\'"+tmpB+"\');";
												UdtSql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+tmpB+"\') WHERE id = \'/"+id+"/Phase"+(tmpI+1)+"/Rcolor\' AND value<>\'"+tmpB+"\'";
												if((log&4)!=0)System.out.print("\t\tPh["+tmpI+"].Rcolor:");
												if((log&4)!=0)System.out.printf("0x%02X \n",tmpB);
												dgvsqlTH(InsSql,UdtSql);
											}
										}
										catch ( Exception e )
										{
											System.err.println("\tErr[osi5.cmps.phRcolor]:"+e.getClass().getName() + ":" + e.getMessage() );
										}
										mem+=cph;
									}
									break;
									case "PhCurrent":
									{
										try
										{
											for(tmpI=0;tmpI<(cph*2);tmpI+=2)
											{
												tmpB=pucBuffer1[mem+tmpI+1];
												tmpB<<=8;
												tmpB+=pucBuffer1[mem+tmpI];
												InsSql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/Phase"+((tmpI/2)+1)+"/Current\',LOCALTIMESTAMP,\'"+tmpB+"\');";
												UdtSql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+tmpB+"\') WHERE id = \'/"+id+"/Phase"+((tmpI/2)+1)+"/Current\' AND value<>\'"+tmpB+"\'";
												if((log&4)!=0)System.out.print("\t\tPh["+(tmpI/2)+"].Curr:");
												if((log&4)!=0)System.out.printf("0x%04X \n",tmpB);
												dgvsqlTH(InsSql,UdtSql);
											}
										}
										catch ( Exception e )
										{
											System.err.println("\tErr[osi5.cmps.phcurrent]:"+e.getClass().getName() + ":" + e.getMessage() );
										}
										mem+=(cph*2);
									}
									break;
									case "PhError":
									{
										try
										{
											for(tmpI=0;tmpI<(cph*4);tmpI+=4)
											{
												tmpB =pucBuffer1[mem+tmpI+3];
												tmpB<<=24;
												tmpB+=pucBuffer1[mem+tmpI+2];
												tmpB<<=16;
												tmpB+=pucBuffer1[mem+tmpI+1];
												tmpB<<=8;
												tmpB+=pucBuffer1[ mem+tmpI ];
												tmpT="";
												//--------------------------------------------
												if(model.indexOf("M3")!=-1)
												{
													if((tmpB&0x00000001)!=0)tmpT+="Falta de Rojo,";
													if((tmpB&0x00000002)!=0)tmpT+="Falta de Amarillo,";
													if((tmpB&0x00000004)!=0)tmpT+="Falta de Verde,";
													if((tmpB&0x00000008)!=0)tmpT+="Tiempo minimo,";
													if((tmpB&0x00000010)!=0)tmpT+="Falta parcial de Rojo,";
													if((tmpB&0x00000020)!=0)tmpT+="Falta parcial de Amarillo,";
													if((tmpB&0x00000040)!=0)tmpT+="Falta parcial de Verde,";
													if((tmpB&0x00000080)!=0)tmpT+="Tiempo maximo,";
													if((tmpB&0x00000100)!=0)tmpT+="Err Electrico rojo,";
													if((tmpB&0x00000200)!=0)tmpT+="Err Electrico amarillo,";
													if((tmpB&0x00000400)!=0)tmpT+="Err Electrico verde,";
													if((tmpB&0x00000800)!=0)tmpT+="Err comunicacion,";
												}
												//--------------------------------------------
												if(model.indexOf("M4")!=-1)
												{
													if((tmpB&0x00000001)!=0)tmpT+="Er Electrico rojo,";
													if((tmpB&0x00000002)!=0)tmpT+="Er Electrico ROJO,";
													if((tmpB&0x00000004)!=0)tmpT+="Er Consumo rojo,";
													if((tmpB&0x00000008)!=0)tmpT+="Er Consumo ROJO,";
													if((tmpB&0x00000010)!=0)tmpT+="Er Electrico amarillo,";
													if((tmpB&0x00000020)!=0)tmpT+="Er Electrico AMARILLO,";
													if((tmpB&0x00000040)!=0)tmpT+="Er Consumo amarillo,";
													if((tmpB&0x00000080)!=0)tmpT+="Er Consumo AMARILLO,";
													if((tmpB&0x00000100)!=0)tmpT+="Er Electrico verde,";
													if((tmpB&0x00000200)!=0)tmpT+="Er Electrico VERDE,";
													if((tmpB&0x00000400)!=0)tmpT+="Er Consumo verde,";
													if((tmpB&0x00000800)!=0)tmpT+="Er Consumo VERDE,";
													if((tmpB&0x00001000)!=0)tmpT+="Er Min Tim R,";
													if((tmpB&0x00002000)!=0)tmpT+="Er Max Tim R,";
													if((tmpB&0x00004000)!=0)tmpT+="Er Min Tim Y,";
													if((tmpB&0x00008000)!=0)tmpT+="Er Max Tim Y,";
													if((tmpB&0x00010000)!=0)tmpT+="Er Min Tim G,";
													if((tmpB&0x00020000)!=0)tmpT+="Er Max Tim G,";
													//- - - - - - - - - - - - - - - - - - - - - -
													if((tmpB&0x01000000)!=0)tmpT+="Er Falta Total r,";
													if((tmpB&0x02000000)!=0)tmpT+="Er Falta Total y,";
													if((tmpB&0x04000000)!=0)tmpT+="Er Falta Total g,";
													if((tmpB&0x80000000)!=0)tmpT+="Er Link,";
												}
												//--------------------------------------------
												if((log&4)!=0)System.out.print("\t\tPh["+(tmpI/4)+"].Err=(");
												if((log&4)!=0)System.out.print(tmpT+")\n");
												if(tmpT!="")
												{
													InsSql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/Phase"+((tmpI/4)+1)+"/Errors\',LOCALTIMESTAMP,\'"+tmpT+"\');";
													UdtSql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+tmpT+"\') WHERE id = \'/"+id+"/Phase"+((tmpI/4)+1)+"/Errors\' AND value<>\'"+tmpT+"\'";
													dgvsqlTH(InsSql,UdtSql);
												}
											}
										}
										catch ( Exception e )
										{
											System.err.println("\tErr[osi5.cmps.phError]:"+e.getClass().getName() + ":" + e.getMessage() );
										}
										mem+=(cph*4);
									}
									break;
								}
								if((log&4)!=0)System.out.print("\n");
							}
						}
						catch ( Exception e )
						{
							System.err.println("\tErr[osi5.cmps.any]:"+e.getClass().getName() + ":" + e.getMessage() );
						}
						if((log&2)!=0)System.out.print("\n");
					}
					break;
					case CMD_RUN_RgTSK:
					{
						if((log&2)!=0)System.out.println("\t\tCMD_RUN_RgTSK");
					}
					break;
					case CMD_RUN_2TSK:
					{
						if((log&2)!=0)System.out.println("\t\tCMD_RUN_2TSK");
					}
					break;
				}
				//---------------------------------------------------------------------------------------------------
			}
			else
			{
				if((log&2)!=0)System.out.print("\t\tGetCmps:"+drv+" dgvp.id:"+((int)pucBuffer1[CmpIdS]&0xFF)+" no result\n");
			}
			try { if (rs != null) rs.close(); } catch (Exception e) {};
			//stmtD.close();
		}
		catch ( Exception e )
		{
			System.err.println("\tErr[o5.2]:"+e.getClass().getName() + ":" + e.getMessage() );
		}
		//-----------------------------------------------------
		return 1;
	}
	//----------------------------------------------------------------------
	public void run()
	{
		while(true)
		{
			try
			{
				dat=null;
				dat=queuePdgvRx.take();
				int rxret=0;
				rxret=Pdgv_Osi2(dat.RxData,dat.RxData.length,1,dat.IPAddress,dat.port);
				if(rxret!=0)
				{
					System.out.print(Thread.currentThread().getName());
					rxret=Pdgv_Osi3(dat.RxData,dat.RxData.length,(byte)rxret,dat.IPAddress,dat.port);
					if(rxret==0)
					{
						rxret=Pdgv_Osi4(dat.RxData,dat.RxData.length,SrvId,dat.IPAddress,dat.port);
						if(rxret!=0)
						{
							System.out.println("\tack->");
							serverSocket.send(sendPacket);
							sendPacket = null;
						}
						rxret=Pdgv_Osi5(dat.RxData,dat.RxData.length,SrvId,dat.IPAddress,dat.port);
					}
					else
					{
						if(rxret==2)	// TODO: hay que verificar si esto vamos a hacer asi...
						{
							try
							{
								queuePdgvTx.put(dat);
							}
							catch ( Exception e )
							{
								System.err.println("procDatSub["+e.getClass().getName()+":"+e.getMessage()+"]");
								System.exit(0);
							}
						}
					}
				}
				dat.RxData=null;
			}
			catch ( Exception e )
			{
				System.err.println("DAT["+e.getClass().getName()+":"+e.getMessage()+"]");//System.err.println(".");
				dat.RxData=null;
			}
		}
	}
}
