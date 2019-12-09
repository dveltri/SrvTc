import java.net.*;
import java.io.*;
import java.util.*;
import java.sql.*;
import java.sql.SQLException;
import java.text.SimpleDateFormat;


public class ReportAlert 
{
	private static MailAlerts mail= new MailAlerts();
	
	public static void main(String[] args) throws Exception 
	{
		Connection c = null;
		Statement stmt1 = null;
		Statement stmt2 = null;
		ResultSet rs1;
		String sql;
		String conection="";
		//---------------------------------------
		String email="";
		String flt="";
		String text="";
		String keys="";
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
		//---------------------------------------
		while(true)
		{
			System.out.println("\n---------------------------------------------------------------------");
			//sql=	"select rep.destino AS email,string_agg(alt.key::text,',') AS keys,string_agg(CONCAT(alt.time,',',alt.description),E'\n') AS text from alerts AS alt INNER JOIN reports AS rep ON alt.description LIKE CONCAT('%',rep.contiene,'%') WHERE alt.status LIKE 'Viewed' GROUP BY rep.destino ORDER BY rep.destino DESC";
			sql=	"select rep.destino AS email,string_agg(alt.key::text,',') AS keys ,string_agg(CONCAT(var.value,',',alt.description,',',alt.time),E'\n') AS text from alerts AS alt LEFT JOIN variables AS var ON var.id LIKE CONCAT('/',alt.ref,'/Nombre') INNER JOIN reports AS rep ON alt.description LIKE CONCAT('%',rep.contiene,'%') WHERE alt.status LIKE 'Viewed' GROUP BY rep.destino ORDER BY rep.destino DESC";
			//System.out.println(sql);
			try
			{
				rs1 = stmt1.executeQuery(sql);
				while(rs1.next())
				{
					email=rs1.getString("email");
					keys=rs1.getString("keys");
					text=rs1.getString("text");
					System.out.println(email+"\t["+keys+"]\n"+text);
					try
					{
						mail.generateAndSendEmail(email,"",text);
						sql = "UPDATE alerts set status = 'Reported' where key IN ("+keys+");";
						//System.out.println(sql);
						try
						{
							stmt2.executeUpdate(sql);
						}
						catch ( Exception e )
						{
							System.err.println("\tErr3:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
						}
					}
					catch ( Exception e )
					{
						System.err.println("\tErr1:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
					}
					System.out.print("\n");
				}
			}
			catch ( Exception e )
			{
				System.err.println("\tErr2:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+sql);
			}
			try
			{
				Thread.sleep(600000);
			}
			catch (InterruptedException ie) 
			{
				System.err.println("\tErr0:"+ie.getClass().getName() + ":" + ie.getMessage() );
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
