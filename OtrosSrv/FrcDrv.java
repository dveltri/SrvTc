import java.net.*;
import java.io.*;
import java.util.*;
import java.sql.*;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

public class FrcDrv 
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
		String sql;
		SimpleDateFormat mdyFormat;
		stmt = c.createStatement();
		stmt2 = c.createStatement();
		while(true)
		{
			//-----------------------------------------------------
			sql = "UPDATE variables V SET value = \'0\' FROM schedulerfnc S WHERE S.setvar = V.id AND S.id LIKE \'Frc.%\' AND S.lts < now();";
			stmt2.executeUpdate(sql);
			System.out.println(sql);
			//-----------------------------------------------------
			sql = "UPDATE schedulerfnc SET id = replace(id,\'Frc.\',\'\') WHERE id LIKE \'Frc.%\' AND lts < now();";
			stmt2.executeUpdate(sql);
			//-----------------------------------------------------
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
		//stmt.close();
	}
}