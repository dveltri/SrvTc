import java.net.*;
import java.io.*;
import java.util.*;
import java.sql.*;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

public class CaptHist
{
	public static void main(String[] args) throws Exception 
	{
		Connection c = null;
    Statement stmt1 = null;
    Statement stmt2 = null;
    Statement stmt3 = null;
		ResultSet rs1;
		ResultSet rs2;
		ResultSet rs3;
		String sql;
		String conection="";
		//---------------------------------------
		String id;
		String Error="";
		int periodo=0;
		java.util.Date timeDb;
		java.util.Date dt;
		//-----------------------------------------
		conection="jdbc:postgresql://localhost:5432/SrvDb";		//conection="jdbc:sqlite:ServerDb.sqlite";
		Class.forName("org.postgresql.Driver");								//Class.forName("org.sqlite.JDBC");
		c = DriverManager.getConnection(conection,"postgres","admin");
		c.setAutoCommit(true);
		//---------------------------------------
		stmt1 = c.createStatement();
		stmt2 = c.createStatement();
		stmt3 = c.createStatement();
		//---------------------------------------
		while(true)
		{
			System.out.println("---------------------------------------------------------------------");
			sql="SELECT * FROM hisvars WHERE id LIKE \'%/CapTime\' ORDER BY date DESC" ;
			//System.out.println(sql);
			rs1 = stmt1.executeQuery(sql);
			while(rs1.next())
			{
				id=rs1.getString("id");
				System.out.print("\t"+id);
				id=id.replace("/CapTime","");
				periodo=Integer.parseInt(rs1.getString("value"));
				System.out.println(" "+periodo);
				sql="SELECT * FROM hisvars WHERE id LIKE \'"+id+"%\' ORDER BY date DESC";
				rs2 = stmt2.executeQuery(sql);
				if(rs2.next())
				{
					dt = new java.util.Date();
					timeDb = rs2.getTimestamp("date");
					System.out.println("\t\t"+rs2.getTimestamp("date")+"["+(timeDb.getTime()/1000)+"]");
					sql="INSERT INTO hisvars (id,value,date)";
					sql+="SELECT id,value,lstchg FROM variables  WHERE id LIKE '"+id+"' AND lstchg>to_timestamp("+((timeDb.getTime()/1000)+periodo)+") ORDER BY lstchg DESC";
					//System.out.println(sql);
					/*rs3 = stmt3.executeQuery(sql);
					System.out.print("\t\t\t");
					if(rs3.next())
					{
						System.out.println(rs3.getString("id"));
					}
					else
					{
						System.out.println("X");
					}// */
					
					try
					{
						stmt3.executeUpdate(sql);
					}
					catch ( Exception e )
					{
						System.err.println("\tErr7:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}// */
				}
			}
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
		//-----------------------------------------
		//c.commit();
		//stmt1.close();
		//stmt2.close();
		//stmt3.close();
		//c.close();
	}
}
