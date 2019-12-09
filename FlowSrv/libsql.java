import java.sql.*;
import java.io.*;

public class libsql
{
	private int db=0;
	public libsql()
	{
	}

	public String[] GetSqlVar(String id) throws Exception
	{
		Connection c = null;
		Statement stmt = null;
		String sql;
		String str[]=new String[3];
		//-----------------------------------------
		String conection="jdbc:postgresql://localhost:5432/SrvDb";
		Class.forName("org.postgresql.Driver");
		c = DriverManager.getConnection(conection,"postgres","admin");
		c.setAutoCommit(true);
		//-----------------------------------------
		stmt = c.createStatement();
		ResultSet rs;
		//-----------------------------------------
		try
		{
			str[0]="";
			str[1]="";
			str[2]="";
			sql = "SELECT * FROM variables WHERE id LIKE '"+id+"'";
			rs = stmt.executeQuery(sql);
			if(rs.next())
			{
				str[0] =id;
				str[1] = rs.getString("value");
				str[2] = rs.getString("typ");
				System.out.print("Get:"+str[0]+"="+str[1]+"("+str[2]+")\n");
			}
			else
			{
				System.out.print("Err.LibSql.Get:"+id+"\n");
			}
		}
		catch ( Exception e )
		{
			System.err.println("ErrLibSql0:"+e.getClass().getName() + ":" + e.getMessage()+"\n");
		}
		//-----------------------------------------
		return str;
	}
	
	public int AddSqlVar(String id,String valor,String typ,String UsrW,String UsrR) throws Exception
	{
		java.util.Date dt = new java.util.Date();
		Connection c = null;
		Statement stmt = null;
		String sql="";
		//-----------------------------------------
		String conection="jdbc:postgresql://localhost:5432/SrvDb";
		Class.forName("org.postgresql.Driver");
		c = DriverManager.getConnection(conection,"postgres","admin");
		c.setAutoCommit(true);
		//-----------------------------------------
		stmt = c.createStatement();
		ResultSet rs;
		typ=typ.replaceAll("nSql","");
		typ=typ.replaceAll("Sql","");
		//---------------------------------------
		System.out.print("AddVar:"+typ+" "+id+"="+valor+" {UsrW:"+UsrW+",UsrR:"+UsrR+"}\n");
		try
		{
			sql = "INSERT INTO variables (id,value,lstchg,typ,UsrWrite,UsrRead) VALUES (\'"+id+"\',\'"+valor+"\',LOCALTIMESTAMP,\'"+typ+"\'";
			if(UsrW!=null)
				sql+= ",\'"+UsrW+"\'";
			else
				sql+= ",\'\'";
			if(UsrR!=null)
				sql+= ",\'"+UsrR+"\'";
			else
				sql+= ",\'\'";
			sql+= ");"; 
			stmt.executeUpdate(sql);
		}
		catch ( Exception e )
		{
			//System.err.println("ErrLibSql1:"+e.getClass().getName() + ":" + e.getMessage()+"\n");
			//c.commit();
			stmt.close();
			c.close();
			return 1;
		}
		//c.commit();
		stmt.close();
		c.close();
		//-----------------------------------------
		return 0;
	}
	
	public int SetSqlVar(String id,String valor,String typ,String UsrW,String UsrR) throws Exception
	{
		java.util.Date dt = new java.util.Date();
		Connection c = null;
		Statement stmt = null;
		String sql="";
		//-----------------------------------------
		String conection="jdbc:postgresql://localhost:5432/SrvDb";
		Class.forName("org.postgresql.Driver");
		c = DriverManager.getConnection(conection,"postgres","admin");
		c.setAutoCommit(true);
		//-----------------------------------------
		stmt = c.createStatement();
		ResultSet rs;
		typ=typ.replaceAll("nSql","");
		typ=typ.replaceAll("Sql","");
		//---------------------------------------
		System.out.print("Set:"+id+"="+valor+"\n");
		try
		{
			sql = "INSERT INTO variables (id,value,lstchg";
			if(typ!=null)
				sql+=",typ";
			if(UsrW!=null)
				sql+=",UsrWrite";
			if(UsrR!=null)
				sql+=",UsrRead";
			sql+=") VALUES (\'"+id+"\',\'"+valor+"\',LOCALTIMESTAMP";
			if(typ!=null)
				sql+=",\'"+typ+"\'";
			if(UsrW!=null)
				sql+=",\'"+UsrW+"\'";
			if(UsrR!=null)
				sql+=",\'"+UsrR+"\'";
			sql+= ");"; 
			//sql = "UPDATE variables SET (lstchg,value) =	(LOCALTIMESTAMP,\'"+valor+"\') WHERE id = \'"+id+"\' ";
			stmt.executeUpdate(sql);
		}
		catch ( Exception e )
		{
			try
			{
				sql = "UPDATE variables SET (id,value,lstchg";
				if(typ!=null)
					sql+= ",typ";
				if(UsrW!=null)
					sql+= ",UsrWrite";
				if(UsrR!=null)
					sql+= ",UsrRead";
				sql+= ") = (\'"+id+"\',\'"+valor+"\',LOCALTIMESTAMP";
				if(typ!=null)
					sql+= ",\'"+typ+"\'";
				if(UsrW!=null)
					sql+= ",\'"+UsrW+"\'";
				if(UsrR!=null)
					sql+= ",\'"+UsrR+"\'";
				sql+= ") WHERE id = \'"+id+"\'";
				sql+=" AND value <> \'"+valor+"\'";
				//System.out.print("["+sql+"]\n");
				stmt.executeUpdate(sql);
			}
			catch ( Exception x )
			{
				System.err.println(sql+"\nErrLibSql2:"+x.getClass().getName() + ":" + x.getMessage()+"\n");
			}
		}
		//c.commit();
		stmt.close();
		c.close();
		//-----------------------------------------
		return 0;
	}

	public static int dgvsql(String InsSql,String UdtSql)
	{
		Connection c = null;
		Statement stmt = null;
		//-----------------------------------------
		String conection="jdbc:postgresql://localhost:5432/SrvDb";
		try
		{
			Class.forName("org.postgresql.Driver");
			c = DriverManager.getConnection(conection,"postgres","admin");
			c.setAutoCommit(true);
			stmt = c.createStatement();
		}
		catch ( Exception e )
		{
			System.err.println("\tdgvsql.Err0:"+e.getClass().getName() + ":" + e.getMessage() );
		}
		//-----------------------------------------
		if(InsSql!="")
		{
			try
			{
					stmt.executeUpdate(InsSql);
			}
			catch ( Exception x )
			{
				try
				{
					if(UdtSql!="")
					{
						stmt.executeUpdate(UdtSql);
					}
				}
				catch ( Exception e )
				{
					System.err.println("\tdgvsql.ErrUdt1:"+e.getClass().getName() + ":" + e.getMessage());
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
					stmt.executeUpdate(UdtSql);
				}
			}
			catch ( Exception e )
			{
				System.err.println("\tdgvsql.ErrUdt2:"+e.getClass().getName() + ":" + e.getMessage());
				return 2;
			}
		}
		return 0;
	}	
}
