import java.net.*;
import java.io.*;
import java.util.*;
import java.sql.*;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

public class SchedulerDrv 
{
	public static void main(String[] args) throws Exception 
	{
		Class.forName("org.postgresql.Driver");
		//-----------------------------------------------------
		Connection c = null;
		Statement stmt = null;
		Statement stmt2 = null;
		String conection="";
		conection="jdbc:postgresql://localhost:5432/SrvDb";
		c = DriverManager.getConnection(conection,"postgres","admin");
		c.setAutoCommit(true);
		java.util.Date dt = new java.util.Date();
		ResultSet SchLs;
		ResultSet rsSch;
		String sql;
		String id;
		String ida[];
		String timesch;
		String variable;
		String valor;
		String mdy;
		SimpleDateFormat mdyFormat;
		int WeekDay;
		stmt = c.createStatement();
		stmt2 = c.createStatement();
		//-----------------------------------------------------
		Calendar calendar = Calendar.getInstance();
		//-----------------------------------------------------
		while(true)
		{
			try
			{
				dt = new java.util.Date();
				calendar.setTime(dt);
				WeekDay=calendar.get(Calendar.DAY_OF_WEEK);
				mdyFormat = new SimpleDateFormat("dd/MM/????");
				mdy=mdyFormat.format(dt);
				sql = "SELECT id FROM schedulerweek GROUP BY id";
				//System.out.println(sql);
				SchLs = stmt.executeQuery(sql);
				while(SchLs.next())
				{
					System.out.print("\n-------------------------\n");
					timesch="";
					id=SchLs.getString("id");
					//id=ida[0];
					System.out.print("\t"+id+"\n");
					//--------------------------------------------
					sql="SELECT * FROM schedulerdate WHERE id LIKE '"+id+"' AND date < '"+mdy+"' ORDER BY date DESC"; //to_timestamp("+(dt.getTime()/1000)+")
					//System.out.println(sql);
					rsSch = stmt2.executeQuery(sql);
					if(rsSch.next())
					{
						timesch = rsSch.getString("Timescheduler");
						System.out.print("\tSchDay:"+id+"/"+timesch+": <"+(dt.getTime()/1000)+"\n");
					}
					else
					{
						System.out.print("\tNo Holidays\n");
					}
					//--------------------------------------------
					if(timesch=="")
					{
						sql="SELECT * FROM schedulerweek WHERE id LIKE '"+id+"' AND date < '"+mdy+"' ORDER BY date DESC";	//to_timestamp("+(dt.getTime()/1000)+")
						//System.out.println(sql);
						rsSch = stmt2.executeQuery(sql);
						if(rsSch.next())
						{
							timesch = rsSch.getString("D"+WeekDay);
							System.out.print("\tSchWeek:"+id+" W:"+WeekDay+" Now:"+(dt.getTime()/1000)+" ("+timesch+")\n");
						}
					}
					else
					{
						System.out.print("\tNo Week days "+WeekDay+"\n");
					}
					//--------------------------------------------
					if(timesch!="")
					{
						sql="SELECT * FROM schedulertime WHERE id LIKE '"+id+"/"+timesch+"' AND time < LOCALTIME ORDER BY time DESC" ;
						//System.out.println(sql);
						rsSch = stmt2.executeQuery(sql);
						if(rsSch.next())
						{
							//variable = rsSch.getString("variable");
							valor = rsSch.getString("value");
							try
							{
								System.out.print("\t[Set "+valor+"]\n");
								sql = "UPDATE variables V SET (value,lstchg) = (\'"+valor+"\',LOCALTIMESTAMP) FROM schedulerfnc S WHERE S.setvar = V.id AND S.id = \'"+id+"\'";
								//System.out.println(sql);
								stmt2.executeUpdate(sql);
							}
							catch ( Exception e )
							{
								System.err.println("\tErr[2]:"+e.getClass().getName() + ": " + e.getMessage() );
							}
							/*/------------------------------------------
							try
							{
								sql = "INSERT INTO alerts VALUES (LOCALTIMESTAMP,\'Viewed\',\'Scheduler Ctrl ["+id+"]\',\'"+id+"\',\'Command\')";
								System.out.print("UpdAlrt ");
								stmt2.executeUpdate(sql);
								oConn2.commit();
							}
							catch (Exception e) 
							{
							}
							//------------------------------------------*/
						}
					}
					else
					{
						System.out.print("\tNo time table "+timesch+"\n");
					}
					rsSch.close();
				}
				//rsHttp.close();
			}
			catch ( Exception e )
			{
				System.err.println("\nErr[3]:"+e.getClass().getName() + ": " + e.getMessage() );
				System.exit(0);
			}
			try
			{
				Thread.sleep(5000);
			}
			catch (InterruptedException ie) 
			{
				System.err.println("\nErr[4]:"+ie.getClass().getName() + ": " + ie.getMessage() );
				System.exit(0);
			}
		}
		//stmt.close();
	}
}