//import java.util.*;
import java.sql.*;
//import java.lang.*;
import java.sql.SQLException;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class procSql implements Runnable
{
	private static String conection="jdbc:postgresql://localhost:5432/SrvDb";
	private final BlockingQueue<String[]> queueSQ;
	//-------------------------------------------------------
	public procSql(BlockingQueue<String[]> queue)
	{
		queueSQ=queue;
	}
	//-------------------------------------------------------
	public void run()
	{
		Connection c = null;
		Statement stmtRx = null;
		String[] take=null;
		//-----------------------------------------------------------------------------
		try
		{
			Class.forName("org.postgresql.Driver");
			c = DriverManager.getConnection(conection,"postgres","admin");
			c.setAutoCommit(true);
			//c.setAutoCommit(false);
			stmtRx = c.createStatement();
		}
		catch ( Exception e )
		{
			System.err.println("\tErr[1]:"+e.getClass().getName() + ":" + e.getMessage() );
		}
		//-----------------------------------------------------------------------------
		while(true)
		{
			try
			{
				take=null;
				take = queueSQ.take();
				System.out.print("s"+Thread.currentThread().getId());
				//System.out.print(".");
				//if(queueSQ.remainingCapacity()==(quezise*10))System.out.print("\n");
					//System.out.println("SQL("+Thread.currentThread().getId()+")Send Sql");
				//------------------------------
				if(take[0]!="")
				{
					try
					{
						stmtRx.executeUpdate(take[0]);
						//c.commit();
					}
					catch ( Exception x )
					{
						try
						{
							if(take[1]!="")
							{
								stmtRx.executeUpdate(take[1]);
								//c.commit();
							}
						}
						catch ( Exception e )
						{
							System.err.println("\n\tErrUdt1:"+e.getClass().getName() + ":" + e.getMessage());
							System.exit(0);
						}
					}
				}
				else
				{
					try
					{
						if(take[1]!="")
						{
							stmtRx.executeUpdate(take[1]);
							//c.commit();
						}
					}
					catch ( Exception e )
					{
						System.err.println("\n\tErrUdt2:"+e.getClass().getName() + ":" + e.getMessage());
						System.exit(0);
					}
				}
				//------------------------------
			}
			catch ( Exception e )
			{
				System.err.println("SQL["+e.getClass().getName()+":"+e.getMessage()+"]");//System.err.println(".");
			}
		}
		//-----------------------------------------------------------------------------
	}

}