import java.sql.*;
import java.io.*;

public class RcvPhasesM4
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

	public RcvPhasesM4(String str,String address,String resource) throws Exception
	{
		Connection c = null;
    Statement stmt = null;
		java.util.Date dt = new java.util.Date();
		String sql;
		int tempV=0;
		String temp;
		//---------------------------------------
		int phaseR=0;
		int phase=0;
		int Plc=0;
		int color=0;
		String Flags="";
		String Error="";
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
				sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+tempV+"\') WHERE id = \'/"+address+"/RTC\'";
				try
				{
					stmt.executeUpdate(sql);
				}
				catch ( Exception e )
				{
					System.err.println("Err1:"+e.getClass().getName() + ": " + e.getMessage() );
				}
			}
			System.out.print("\n----------------------(60)ph4:"+str.length()+"-------------------------\n");
			//---------------------------------------------------
		}
		catch ( Exception e )
		{
			System.err.println("Err:"+e.getClass().getName() + ": " + e.getMessage() );
			System.exit(0);
		}
		//-----------------------------------------
		if((str.length()%60)!=0)
			System.out.println("Leng"+str.length()+"%60="+(str.length()%60));
		//else
		{
			while(str.length()>=60)
			{
				phaseR++;
				phase++;
				if(Plc!=(0x0F&str.charAt(3)))
					phase=1;
				Plc=0x0F&str.charAt(3);
				if(Plc>0 && Plc<5)
				{
					color=str.charAt(0)&127;
					if((color&0x07)==0x07)
						color=str.charAt(2)&127;
					sql = "";
					try
					{
						sql = "INSERT INTO variables (id,lstchg,value,typ) VALUES (\'/"+address+"/PLC"+Plc+"/Phase"+phase+"/Color\',LOCALTIMESTAMP,\'"+color+"\','IntR');"; 
						stmt.executeUpdate(sql);
					}
					catch ( Exception x )
					{
						try
						{
							sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+color+"\') WHERE id = \'/"+address+"/PLC"+Plc+"/Phase"+phase+"/Color\'";
							stmt.executeUpdate(sql);
						}
						catch ( Exception e )
						{
							System.err.println("\n\tErr2:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
						}
					}
					//----------------
					temp=str.substring(24,28);
					tempV=ByToInt(temp);
					Flags="";
					if((tempV&0x00000001)!=0)Flags+=",Lack_Red";
					if((tempV&0x00000002)!=0)Flags+=",Lack_Yellow";
					if((tempV&0x00000004)!=0)Flags+=",Lack_Green";
					if((tempV&0x00000008)!=0)Flags+=",Min_Green_Time";
					if((tempV&0x00000010)!=0)Flags+=",Partial_Lack_Red";
					if((tempV&0x00000020)!=0)Flags+=",Partial_Lack_Yellow";
					if((tempV&0x00000040)!=0)Flags+=",Partial_Lack_Green";
					if((tempV&0x00000080)!=0)Flags+=",Min_Red_Time";
					if((tempV&0x00000100)!=0)Flags+=",Err_Electric_Red";
					if((tempV&0x00000200)!=0)Flags+=",Err_Electric_Yellow";
					if((tempV&0x00000400)!=0)Flags+=",Err_Electric_Green";
					if((tempV&0x00000800)!=0)Flags+=",Err_Report";
					if((tempV&0x00001000)!=0)Flags+=",Err_Flag_Flashing";
					if((tempV&0x00002000)!=0)Flags+=",Err_Flag_Flank";
					if((tempV&0x00004000)!=0)Flags+=",Err_Flag_Service";
					if((tempV&0x00008000)!=0)Flags+=",Err_Signal_Sync";
					System.out.print("\tPhase["+phaseR+"].Plc["+Plc+"].Phase["+phase+"].Color["+color+"].Error["+Flags+"]\n");
					try
					{
						sql = "INSERT INTO variables (id,lstchg,value,typ) VALUES (\'/"+address+"/PLC"+Plc+"/Phase"+phase+"/Errors\',LOCALTIMESTAMP,\'"+Flags+"\','StrR');"; 
						stmt.executeUpdate(sql);
					}
					catch ( Exception x )
					{
						try
						{
							sql = "UPDATE variables SET (lstchg,value) = (LOCALTIMESTAMP,\'"+Flags+"\') WHERE id = \'/"+address+"/PLC"+Plc+"/Phase"+phase+"/Errors\'";
							stmt.executeUpdate(sql);
						}
						catch ( Exception e )
						{
							System.err.println("\tErr3:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
						}
					}
					//-----------------------------------------
				}
				else
				{
					System.out.print("\tPhase["+phaseR+"].Free\n");
				}
				if(str.length()>=60)
					str=str.substring(60);
				else
					str=str.substring(str.length());
			}
		}
		//c.commit();
		stmt.close();
		c.close();//*/
	}
}
