import java.net.*;
import java.io.*;
import java.util.*;
import java.sql.*;
import java.lang.*;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Scanner;
import java.text.SimpleDateFormat;
//import static org.joou.Unsigned.*;
//package com.mkyong;
 
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
//import org.apache.commons.codec.*;
 
public class SrvPdgv
{
    //---------------------------------------
    private static final int Osi2           =0;
    private static final int Osi2_Start     =1;
    private static final int Osi2_Ctrl      =2;
    private static final int Osi2_IdS       =3;
    private static final int Osi2_IdT       =4;
    private static final int Osi2_SockS     =5;
    private static final int Osi2_SockT     =6;
    private static final int Osi2_Len       =7;
    private static final int Osi2_Datos     =8;
    private static final int Osi3           =10;
    private static final int Osi3_Chk_Crc   =11;
    private static final int Osi3_Chk_ID    =12;
    private static final int Osi2_Len2      =13;
    //---------------------------------------
    private static final int Procces        =20;
    private static final int pdgv_Preambulo =126;
    private static final int LedRx          =1;
    private static final int LedPs          =2;
    private static final int LedTx          =3;
    private static final int MaxLen         =6144;
    //---------------------------------------
    private static final int pdgv_Ver       =0x01;
    private static final int pdgv_TCP       =0x00;
    private static final int pdgv_UDP       =0x10;
    private static final int pdgv_None      =0x00;
    private static final int pdgv_Chs       =0x04;
    private static final int pdgv_Sum       =0x08;
    private static final int pdgv_Crc       =0x0C;
    //---------------------------------------
    private static final int CMD_RESET          =0;
    private static final int CMD_CHG_ID         =1;
    private static final int CMD_PING           =2;
    private static final int CMD_WEE            =3;
    private static final int CMD_REE            =4;
    private static final int CMD_WRAM           =5;
    private static final int CMD_RRAM           =6;
    private static final int CMD_SBIT_RAM       =7;
    private static final int CMD_CBIT_RAM       =8;
    private static final int CMD_XBIT_RAM       =9;
    private static final int CMD_INC_RAM        =10;
    private static final int CMD_DEC_RAM        =11;
    private static final int CMD_RSRAM          =12;
    private static final int CMD_CBIT_EE        =13;
    private static final int CMD_XBIT_EE        =14;
    private static final int CMD_INC_EE         =15;
    private static final int CMD_DEC_EE         =16;
    private static final int CMD_RTC            =17;
    private static final int CMD_Msg            =18;
    private static final int CMD_EIL            =19;
    private static final int CMD_DgvFs          =20;
    private static final int CMD_PHASE          =21;
    private static final int CMD_LOOP           =22;
    private static final int CMD_MIO12          =23;
    private static final int CMD_UpdIO          =24;
    private static final int CMD_Scoot          =27;
    private static final int CMD_GVars          =28;
    private static final int CMD_RcvFIT         =30;
    private static final int CMD_RcvRtr         =31;
    //private static final int CMD_DPK_TCP      =12;
    private static final int CMD_CONFIRM_TCP    =82;
    private static final int CMD_Err_Trg_Fnc    =83;        //El Target no tiene el comando/funcion implementado
    private static final int CMD_RUN_PkTSKs     =-4;
    private static final int CMD_RUN_RgTSK      =-3;
    private static final int CMD_RUN_2TSK       =-2;
    //---------------------------------------
    private static final int CmpCtr     =1;
    private static final int CmpIdS     =2;
    private static final int CmpIdT     =3;
    private static final int CmpSkS     =4;
    private static final int CmpSkT     =5;
    private static final int CmpLen     =6;
    private static final int CmpDat     =7;
    //---------------------------------------
    private static final String modo[]={"Error","Flashing","Off","Normal","Normal lock","Remote","Manual","StpByStp","8","9","10","11","12","13","14","15"};
    //---------------------------------------
    public static DatagramSocket serverSocket;
    public static int RxSts=Osi2;
    public static byte[] sendData = new byte[1024];
    public static byte[] receiveData = new byte[1024];
    public static int SrvId=0;
    public static String drv="";
    //---------------------------------------
    public static String conection="jdbc:postgresql://localhost:5432/SrvDb";
  //public static String conection="jdbc:postgresql://10.0.0.109:5432/SrvDb";
    private static Connection c = null;
    private static Statement stmtRx =null;
    private static InetAddress IPAddress;
    private static DatagramPacket sendPacket;
    private static int log=1;
    //----------------------------------------------------------------------
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
    public int ByToInt(String Datos)
    {
        int temp=0;
        int temp2=0;
        temp2=((int)Datos.charAt(3))&255;
        //if((db&1)!=0)System.out.print("\t["+Integer.toHexString(temp2)+":");
        temp+=temp2<<24;
        //if((db&1)!=0)System.out.print(temp+"]\n");
        temp2=((int)Datos.charAt(2))&255;
        //if((db&1)!=0)System.out.print("\t["+Integer.toHexString(temp2)+":");
        temp+=temp2<<16;
        //if((db&1)!=0)System.out.print(temp+"]\n");
        temp2=((int)Datos.charAt(1))&255;
        //if((db&1)!=0)System.out.print("\t["+Integer.toHexString(temp2)+":");
        temp+=temp2<<8;
        //if((db&1)!=0)System.out.print(temp+"]\n");
        temp2=((int)Datos.charAt(0))&255;
        //if((db&1)!=0)System.out.print("\t["+Integer.toHexString(temp2)+":");
        temp+=temp2;
        //if((db&1)!=0)System.out.println(temp+"]");
        return temp;
    }
 
    //----------------------------------------------------------------------
    public static int output_low(int led)
    {
        //System.out.println("output_low:"+led);
        return 0;
    }
    public static int output_hi(int led)
    {
        //System.out.println("output_hi "+led);
        return 0;
    }
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
    public static int dgvsql(String InsSql,String UdtSql)
    {
        if(InsSql!="")
        {
            try
            {
                    stmtRx.executeUpdate(InsSql);
            }
            catch ( Exception x )
            {
                try
                {
                    if(UdtSql!="")
                    {
                        stmtRx.executeUpdate(UdtSql);
                    }
                }
                catch ( Exception e )
                {
                    System.err.println("\n\tErrUdt:"+e.getClass().getName() + ":" + e.getMessage());
                    return 2;
                }
            }
        }
        else
        {
            try
            {
                if(UdtSql!="")
                {
                    stmtRx.executeUpdate(UdtSql);
                }
            }
            catch ( Exception e )
            {
                System.err.println("\n\tErrUdt:"+e.getClass().getName() + ":" + e.getMessage());
                return 2;
            }
        }
        return 0;
    }
 
    //----------------------------------------------------------------------
    public static int Pdgv_Osi2(byte[] pucBuffer1,int ulLen,long ori,InetAddress ip, int port)
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
        byte[] pucBuffer=Arrays.copyOf(pucBuffer1,ulLen);
        //if((log&4)!=0)
            System.out.printf("RxDat["/*+Arrays.toString(pucBuffer)*/+"] Size:"+ulLen+" IP:"+ip.toString()+":"+port+"\n");
        byte[] TmpBf;
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
                    //System.out.println(".Ctrl");
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
                        //System.out.println(".MAX");
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
        //System.out.println(".out");
        return 0;
    }
    public static int Pdgv_Osi3(byte[] pucBuffer1,int ulLen,byte crc1,InetAddress ip, int port)
    {
        byte crc2=0;
        //-----------------------------------------------------
        crc2=CalChs(pucBuffer1);
        if(crc1==crc2)
        {
            pucBuffer1[CmpLen]-=1;
            if((log&1)!=0)System.out.print("ok\n");
        }
        else
        {
            System.out.print("Err Pk.CRC:"+ Long.toHexString(crc1)+ " Cal.CRC:"+Long.toHexString(crc2)+"\n");
            return 0;
        }
        if(pucBuffer1[CmpIdT]==(byte)SrvId)
        {
            return 1;
        }
        else
        {
            System.out.print("Err ID:"+pucBuffer1[CmpIdT]+"!="+SrvId+"\n");
            return 0;
        }
    }
    public static int Pdgv_Osi4(byte[] pucBuffer1,int ulLen,long ori,InetAddress ip, int port)
    {
        if((pucBuffer1[CmpCtr]&pdgv_UDP)==0)
        {
            sendData[0]=pdgv_Preambulo;
            sendData[CmpCtr]=(pdgv_UDP);
            sendData[CmpIdS]=(byte)ori;
            sendData[CmpIdT]=receiveData[CmpIdS];
            sendData[CmpSkS]=receiveData[CmpSkT];
            sendData[CmpSkT]=CMD_CONFIRM_TCP;
            sendData[CmpLen]=1;
            sendData[CmpDat]=CalChs(sendData);
            System.out.print("Tx ACK:"+Arrays.toString(Arrays.copyOf(sendData,8))+" From ip:"+"InetAddress.getLocalHost()"+"->"+ip+":"+port+"\n");
            sendPacket = new DatagramPacket(sendData,8, ip, port);
            return 1;
        }
        return 0;
    }
    public static int Pdgv_Osi5(byte[] pucBuffer1,int ulLen,long ori,InetAddress ip, int port)
    {
        String id="";
        String cmp="";
        String model="";
        String[] cmps;
        String tmpT="";
        String InsSql="";
        String UdtSql="";
        java.util.Date dt = new java.util.Date();
        float tmpF=0;
        long tmpL=0;
        int tmpI=0;
        byte tmpB=0;
        int mem=CmpDat;
        int cph=1;
        int cio=1;
        int cplc=1;
        //----------------------------------------------
        Statement stmt = null;
        ResultSet rs;
        if((log&1)!=0)System.out.print("Osi5:");
        try
        {
            stmt = c.createStatement();
        }
        catch ( Exception e )
        {
            System.err.println("\tErr[o5.1]:"+e.getClass().getName() + ":" + e.getMessage() );
            return 1;
        }
        //-----------------------------------------------------
        //UdtSql="SELECT * FROM pdgv where drv LIKE '"+drv+"%' AND action NOT LIKE '%Sended%' AND lstchg < to_timestamp("+(dt.getTime()/1000)+")" ;
        UdtSql="SELECT * FROM pdgv where drv LIKE '"+drv+"' AND pdgvid="+((int)pucBuffer1[CmpIdS]&0xFF);
        try
        {
            if((log&1)!=0)System.out.print("GetCmps:"+drv+" dgvp.id:"+((int)pucBuffer1[CmpIdS]&0xFF)+" ");
            rs = stmt.executeQuery(UdtSql);
            if(rs.next())
            {
                id = rs.getString("id");
                cmp = rs.getString("cmps");
                model = rs.getString("model");
                if((log&1)!=0)System.out.println("Found!");
                if((log&1)!=0)System.out.println("\tID:"+id);
                if((log&1)!=0)System.out.println("\tCmps:"+cmp);
                if((log&1)!=0)System.out.println("\tModel:"+model);
                if((log&1)!=0)System.out.print("\tFlg:"+((int)pucBuffer1[CmpCtr]&0xFF)+" IDS:"+((int)pucBuffer1[CmpIdS]&0xFF)+" IDT:"+((int)pucBuffer1[CmpIdT]&0xFF)+" SckS:"+((int)pucBuffer1[CmpSkS]&0xFF)+" SckT:"+((int)pucBuffer1[CmpSkT]&0xFF)+" Len:"+((int)pucBuffer1[CmpLen]&0xFF));
                if((log&1)!=0)System.out.println("Dat:"/*+javax.xml.bind.DatatypeConverter.printHexBinary(Arrays.copyOfRange(pucBuffer1, CmpDat,pucBuffer1[CmpLen]))*/);
                cmps=cmp.split(",");
                InsSql = "INSERT INTO variables VALUES (\'/"+id+"/Drv_Status\',\'pool\',LOCALTIMESTAMP)";
                UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'pool\') WHERE id=\'/"+id+"/Drv_Status\'";
                dgvsql(InsSql,UdtSql);
                InsSql = "INSERT INTO variables VALUES (\'/"+id+"/Lnk_Status\',\'ok\',LOCALTIMESTAMP)";
                UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'ok\') WHERE id=\'/"+id+"/Lnk_Status\'";
                dgvsql(InsSql,UdtSql);
                InsSql = "INSERT INTO variables VALUES (\'/"+id+"/address\',\'"+ip+"\',LOCALTIMESTAMP)";
                UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'"+ip+"\') WHERE id=\'/"+id+"/address\'";
                dgvsql(InsSql,UdtSql);
                UdtSql = "UPDATE pdgv SET (ip,status,lstupd)=(\'"+ip+"\',\'ok\',LOCALTIMESTAMP) WHERE id=\'"+id+"\'";
                dgvsql("",UdtSql);
                //------------------------------------------------------------------------------------------
                switch((int)pucBuffer1[CmpSkT])
                {
                    case CMD_PING:
                    {
                        if((log&1)!=0)System.out.println("CMD_PING:"+new String(Arrays.copyOfRange(pucBuffer1, CmpDat,pucBuffer1[CmpLen])));
                    }
                    break;
                    case CMD_Msg:
                    {
                        //if((log&1)!=0)
                            System.out.println("CMD_Msg:"+new String(Arrays.copyOfRange(pucBuffer1, CmpDat,pucBuffer1[CmpLen])));
                        InsSql = "INSERT INTO alerts VALUES (LOCALTIMESTAMP,\'Viewed\',\'["+id+"] "+new String(Arrays.copyOfRange(pucBuffer1, CmpDat,pucBuffer1[CmpLen]))+"\',\'"+id+"\',\'Link\')";
                        dgvsql(InsSql,"");
                        InsSql = "";
                    }
                    break;
                    case CMD_CONFIRM_TCP:
                    {
                        if((log&1)!=0)System.out.println("CMD_CONFIRM_TCP");
                    }
                    break;
                    case CMD_Err_Trg_Fnc:
                    {
                        if((log&1)!=0)System.out.println("CMD_Err_Trg_Fnc");
                    }
                    break;
                    case CMD_RUN_PkTSKs:
                    {
                        if((log&1)!=0)System.out.println("CMD_RUN_PkTSKs["+cmps.length+"] ");
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
                                    InsSql = "INSERT INTO variables VALUES (\'/"+id+"/RTC\',\' \',LOCALTIMESTAMP)";
                                    UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'"+tmpT+"\') WHERE id=\'/"+id+"/RTC\'";
                                    if((log&2)!=0)System.out.println("\tDate:"+tmpL+"("+tmpT+")");
                                    dgvsql(InsSql,UdtSql);
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
                                    UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'"+tmpF+"\') WHERE id=\'/"+id+"/Voltage\'";
                                    if((log&2)!=0)System.out.println("\tVoltage:"+tmpF);
                                    dgvsql(InsSql,UdtSql);
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
                                        UdtSql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+modo[(tmpI&0x0F)]+tmpT+"\') WHERE id = \'/"+id+"/PLC"+(tmpL+1)+"/Status\' ";
                                        if((log&2)!=0)System.out.println("\tMode:"+modo[(tmpI&0x0F)]+tmpT+"("+Integer.toHexString(tmpI)+")");
                                        dgvsql(InsSql,UdtSql);
                                        InsSql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/PLC"+(tmpL+1)+"/Nombre\',LOCALTIMESTAMP,\'Ctrl"+(tmpL+1)+"\');";
                                        dgvsql(InsSql,"");
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
                                        UdtSql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+tmpI+"\') WHERE id = \'/"+id+"/PLC"+(tmpL+1)+"/Nplan\'";
                                        if((log&2)!=0)System.out.println("\tNplan:"+Integer.toHexString(tmpI));
                                        dgvsql(InsSql,UdtSql);
                                    }
                                }
                                break;
                                case "Cplc":
                                {
                                    cplc=0;
                                    cplc|=((pucBuffer1[mem  ]&0xFF)    );
                                    mem+=1;
                                    InsSql = "INSERT INTO variables VALUES (\'/"+id+"/PLC_Count\',\'"+cplc+"\',LOCALTIMESTAMP)";
                                    UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'"+cplc+"\') WHERE id=\'/"+id+"/PLC_Count\'";
                                    if((log&2)!=0)System.out.println("\tcplc:"+cplc);
                                    dgvsql(InsSql,UdtSql);
                                }
                                break;
                                case "Cio":
                                {
                                    cio=0;
                                    cio|=((pucBuffer1[mem  ]&0xFF)    );
                                    mem+=1;
                                    InsSql = "INSERT INTO variables VALUES (\'/"+id+"/IO_Count\',\'"+cio+"\',LOCALTIMESTAMP)";
                                    UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'"+cio+"\') WHERE id=\'/"+id+"/IO_Count\'";
                                    if((log&2)!=0)System.out.println("\tCio:"+cio);
                                    dgvsql(InsSql,UdtSql);
                                }
                                break;
                                case "Cph":
                                {
                                    cph=0;
                                    cph|=((pucBuffer1[mem  ]&0xFF)    );
                                    mem+=1;
                                    InsSql = "INSERT INTO variables VALUES (\'/"+id+"/PhasesCount\',\'"+cph+"\',LOCALTIMESTAMP)";
                                    UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'"+cph+"\') WHERE id=\'/"+id+"/PhasesCount\'";
                                    if((log&2)!=0)System.out.println("\tCphase:"+cph);
                                    dgvsql(InsSql,UdtSql);
                                }
                                break;
                                case "PhColor":
                                {
                                    for(tmpI=0;tmpI<cph;tmpI++)
                                    {
                                        tmpB=pucBuffer1[mem+tmpI];
                                        tmpB&=127;
                                        InsSql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/Phase"+(tmpI+1)+"/Color\',LOCALTIMESTAMP,\'"+tmpB+"\');"; 
                                        UdtSql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+tmpB+"\') WHERE id = \'/"+id+"/Phase"+(tmpI+1)+"/Color\'";
                                        if((log&2)!=0)System.out.print("\t\tPh["+tmpI+"].Color:");
                                        if((log&2)!=0)System.out.printf("0x%02X \n",tmpB);
                                        dgvsql(InsSql,UdtSql);
                                    }
                                    mem+=cph;
                                }
                                break;
                                case "PhRColor":
                                {
                                    for(tmpI=0;tmpI<cph;tmpI++)
                                    {
                                        tmpB=pucBuffer1[mem+tmpI];
                                        tmpB&=127;
                                        InsSql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/Phase"+(tmpI+1)+"/Rcolor\',LOCALTIMESTAMP,\'"+tmpB+"\');"; 
                                        UdtSql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+tmpB+"\') WHERE id = \'/"+id+"/Phase"+(tmpI+1)+"/Rcolor\'";
                                        if((log&2)!=0)System.out.print("\t\tPh["+tmpI+"].Rcolor:");
                                        if((log&2)!=0)System.out.printf("0x%02X \n",tmpB);
                                        dgvsql(InsSql,UdtSql);
                                    }
                                    mem+=cph;
                                }
                                break;
                                case "PhCurrent":
                                {
                                    for(tmpI=0;tmpI<(cph*2);tmpI+=2)
                                    {
                                        tmpB=pucBuffer1[mem+tmpI+1];
                                        tmpB<<=8;
                                        tmpB+=pucBuffer1[mem+tmpI];
                                        InsSql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/Phase"+((tmpI/2)+1)+"/Current\',LOCALTIMESTAMP,\'"+tmpB+"\');"; 
                                        UdtSql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+tmpB+"\') WHERE id = \'/"+id+"/Phase"+((tmpI/2)+1)+"/Current\'";
                                        if((log&2)!=0)System.out.print("\t\tPh["+(tmpI/2)+"].Curr:");
                                        if((log&2)!=0)System.out.printf("0x%04X \n",tmpB);
                                        dgvsql(InsSql,UdtSql);
                                    }
                                    mem+=(cph*2);
                                }
                                break;
                                case "PhError":
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
                                        if((log&2)!=0)System.out.print("\t\tPh["+(tmpI/4)+"].Err=(");
                                        if((log&2)!=0)System.out.print(tmpT+")\n");
                                        if(tmpT!="")
                                        {
                                            InsSql = "INSERT INTO variables (id,lstchg,value) VALUES (\'/"+id+"/Phase"+((tmpI/4)+1)+"/Errors\',LOCALTIMESTAMP,\'"+tmpT+"\');"; 
                                            UdtSql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+tmpT+"\') WHERE id = \'/"+id+"/Phase"+((tmpI/4)+1)+"/Errors\'";
                                            dgvsql(InsSql,UdtSql);
                                        }
                                    }
                                    mem+=(cph*4);
                                }
                                break;
                            }
                            if((log&2)!=0)System.out.print(" ");
                        }
                        if((log&1)!=0)System.out.println("");
                    }
                    break;
                    case CMD_RUN_RgTSK:
                    {
                        if((log&1)!=0)System.out.println("CMD_RUN_RgTSK");
                    }
                    break;
                    case CMD_RUN_2TSK:
                    {
                        if((log&1)!=0)System.out.println("CMD_RUN_2TSK");
                    }
                    break;
                }
                //---------------------------------------------------------------------------------------------------
            }
            else
            {
                System.out.println("no result");
            }
            rs.close();
            stmt.close();
        }
        catch ( Exception e )
        {
            System.err.println("\tErr[o5.2]:"+e.getClass().getName() + ":" + e.getMessage() );
        }
        //-----------------------------------------------------
        return 1;
    }
     
    //----------------------------------------------------------------------
    public static void main(String[] args) throws Exception
    {
        //---------------------------
        try
        {
            Class.forName("org.postgresql.Driver");
            c = DriverManager.getConnection(conection,"postgres","admin");
            c.setAutoCommit(true);
            stmtRx = c.createStatement();
        }
        catch ( Exception e )
        {
            System.err.println("\tErr[1]:"+e.getClass().getName() + ":" + e.getMessage() );
        }
        //---------------------------
        String InsSql="";
        String UdtSql="";
        String sql;
        String str;
        String id;
        String typ;
        String Sval;
        String sts;
        String model="";
        int Ival=0;
        int rxret=0;
        int countloop=0;
        int idt=0;
        int timeout=0;
        int port=0;
        String ip="";
        DatagramPacket receivePacket;
        //-----------------------------------------------------
        drv=args[0];
        SrvId=Integer.parseInt(args[1]);
        port=Integer.parseInt(args[2]);
        if(args.length>3)log=Integer.parseInt(args[3]);
        System.out.println("Drv Name:"+drv);
        System.out.println("Pdgv ID:"+SrvId);
        System.out.println("UDP port:"+port);
        DatagramSocket serverSocket = new DatagramSocket(port);
        Connection c = null;
        Statement stmt = null;
        Statement stmt2 = null;
        ResultSet rs;
        ResultSet rs2;
        InputStream Datos;
        java.util.Date dt0 = new java.util.Date();
        java.util.Date dt1 = new java.util.Date();
        java.util.Date dt2;
        java.util.Date dt3;
        //-----------------------------------------------------
        try
        {
            Class.forName("org.postgresql.Driver");
            c = DriverManager.getConnection(conection,"postgres","admin");
            c.setAutoCommit(true);
            stmt = c.createStatement();
            stmt2 = c.createStatement();
            //-----------------------------------------------------
            getmac();
        }
        catch ( Exception e )
        {
            System.err.println("\tErr[2]:"+e.getClass().getName() + ":" + e.getMessage() );
        }
        //---------------------------------------------------
        receivePacket = new DatagramPacket(receiveData, receiveData.length);
        serverSocket.setSoTimeout(1000);
        while(true)
        {
            countloop++;
            //-----------------------------------------------------------------------------
            try
            {
                serverSocket.receive(receivePacket);
                IPAddress = receivePacket.getAddress();
                port = receivePacket.getPort();
                rxret=Pdgv_Osi2(receivePacket.getData(),receivePacket.getLength(),1,IPAddress,port);
                if((log&1)!=0)System.out.println("\nPdgv_Osi2.ByteReceived:"+receivePacket.getLength()+" From ip:"+IPAddress+":"+port+" "+new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date()));
                if(rxret!=0)
                {
                    //System.out.print("Pdgv_Osi3 ");
                    rxret=Pdgv_Osi3(receivePacket.getData(),receivePacket.getLength(),(byte)rxret,IPAddress,port);
                }
                if(rxret!=0)
                {
                    //System.out.print("Pdgv_Osi4 ");
                    rxret=Pdgv_Osi4(receivePacket.getData(),receivePacket.getLength(),SrvId,IPAddress,port);
                    if(rxret!=0)
                    {
                        System.out.println("ack->");
                        serverSocket.send(sendPacket);
                    }
                    //-----------------------------------------------------------------------------
                    rxret=Pdgv_Osi5(receivePacket.getData(),receivePacket.getLength(),SrvId,IPAddress,port);
                }
            }
            catch ( Exception e )
            {
                if((countloop^40)==0)
                    System.err.println("["+e.getClass().getName()+":"+e.getMessage()+"]");//System.err.println(".");
                else
                    System.err.print(".");
            }
            //-----------------------------------------------------------------------------
            if((log&1)!=0)System.out.println("---------------------------------------------------------------------------");
            if((dt0.getTime()+1000)<(new java.util.Date().getTime()))
            {
                try
                {
                    sql="SELECT * FROM pdgv where drv LIKE '"+drv+"'";
                    rs = stmt.executeQuery(sql);
                    while(rs.next())
                    {
                        port        = rs.getInt("ipport");
                        idt         = rs.getInt("pdgvid");
                        id          = rs.getString("id");
                        str         = rs.getString("ip");
                        str         = str.replace("/","");
                        IPAddress   = InetAddress.getByName(str);
                        timeout     = rs.getInt("timeout");
                        dt2         = rs.getTimestamp("lstupd");
                        sts         = ""+rs.getString("status");
                        model       = rs.getString("model");
                        //-------------------------------------
                        if( drv.indexOf("Rtc")!=-1 && ((dt1.getTime()/1000)+timeout)<=(dt0.getTime()/1000) )
                        {
                            sendData[0]=0x7E;
                            sendData[CmpCtr]=(pdgv_UDP|pdgv_Chs);
                            sendData[CmpIdS]=(byte)(SrvId&255);
                            sendData[CmpIdT]=(byte)(idt&255);
                            sendData[CmpSkS]=CMD_Msg;
                            sendData[CmpSkT]=CMD_RTC;
                            sendData[CmpLen]=5;
                            dt3 = null;
                            dt3 = new java.util.Date();
                            Ival=(int)(dt3.getTime()/1000);
                            sendData[CmpDat+0]=(byte)((Ival>> 0)&255);
                            sendData[CmpDat+1]=(byte)((Ival>> 8)&255);
                            sendData[CmpDat+2]=(byte)((Ival>>16)&255);
                            sendData[CmpDat+3]=(byte)((Ival>>24)&255);
                            sendData[CmpDat+4]=CalChs(sendData);
                            System.out.println("===========================================================================");
                            System.out.print("TxPk-RTC:"/*+(javax.xml.bind.DatatypeConverter.printHexBinary(Arrays.copyOf(sendData,7+sendData[CmpLen])))*/+"->"+IPAddress+":"+port+"\n");
                            sendPacket = new DatagramPacket(sendData,7+sendData[CmpLen], IPAddress, port);
                            serverSocket.send(sendPacket);
                            System.out.println("===========================================================================");
                        }
                        //-------------------------------------
                        if(sts!=null && sts.indexOf("ok")!=-1)
                        {
                            if((log&1)!=0)System.out.println("/"+id+".TimeOut->"+(((dt2.getTime()/1000)+timeout)-(dt0.getTime()/1000))); 
                            if( ((dt2.getTime()/1000)+timeout)<=(dt0.getTime()/1000) )
                            {
                                System.out.println("set sql");
                                InsSql = "INSERT INTO alerts VALUES (LOCALTIMESTAMP,\'Viewed\',\'["+id+"] Lost Connection\',\'"+id+"\',\'Link\')";
                                dgvsql(InsSql,"");
                                UdtSql = "UPDATE pdgv SET (status,lstupd)=(\'Lost Connection\',LOCALTIMESTAMP) WHERE id=\'"+id+"\'";
                                dgvsql("",UdtSql);
                                UdtSql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'\') WHERE id LIKE \'/"+id+"/Phase%/Color\'";
                                dgvsql("",UdtSql);
                                UdtSql = "UPDATE variables SET (lstchg,value)=(LOCALTIMESTAMP,\'Lost Connection\') WHERE id LIKE \'/"+id+"/Lnk_Status\'";
                                dgvsql("",UdtSql);
                            }
                        }
                        //-------------------------------------
                        sql = "SELECT * FROM variables WHERE id LIKE \'/"+id+"/%\' AND typ LIKE \'%W%\'";
                        sql+= " AND lstchg > to_timestamp("+((dt0.getTime()/1000))+")";
                        /*System.out.println(""+sql); //{"+new java.util.Date().getTime()/1000+"} // */
                        rs2     = stmt2.executeQuery(sql);
                        while(rs2.next())
                        {
                            str =rs2.getString("id");
                            Sval =rs2.getString("value");
                            typ =rs2.getString("typ");
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
                            sendPacket = new DatagramPacket(sendData,7+sendData[CmpLen], IPAddress, port);
                            serverSocket.send(sendPacket);
                        }
                        rs2.close();
                        //stmt2.close();
                    }
                    if( drv.indexOf("Rtc")!=-1 && ((dt1.getTime()/1000)+timeout)<=(dt0.getTime()/1000) )
                    {
                        dt1 = null;
                        dt1 = new java.util.Date();
                    }
                    rs.close();
                    //stmt.close();
                }
                catch ( Exception e )
                {
                    System.err.println("\tErr[mn.4]:"+e.getClass().getName() + ":" + e.getMessage() );
                }
                //-----------------------------------------------------------------------------
                if((log&1)!=0)System.out.print("--------------- Update LsTx:"+dt0.getTime()+" "+(new java.util.Date().getTime())+"="+((dt0.getTime()+1000)-(new java.util.Date().getTime()))+" ---------------\n\n\n");
                dt0 = null;
                dt0 = new java.util.Date();
            }
            else
            {
                if((log&1)!=0)System.out.print("lstTx:"+(dt0.getTime()+1000)+" < now:"+(new java.util.Date().getTime())+"="+((dt0.getTime()+1000)-(new java.util.Date().getTime()))+"\n");
                if(((dt0.getTime()+1000)-(new java.util.Date().getTime()))>1010)
                {
                    dt0 = null;
                    dt0 = new java.util.Date();
                }
            }
            /*try
            {
                Thread.sleep(10);
            }
            catch (InterruptedException ie) 
            {
                System.err.println("\tErr[mn.5]:"+ie.getClass().getName() + ":" + ie.getMessage() );
                System.exit(0);
            }// */
        }
    }
}