<%@ page language="java" import="java.io.*,java.util.*, java.sql.*,java.rmi.*,java.net.MalformedURLException,java.rmi.Naming,java.rmi.NotBoundException,java.rmi.Remote,java.rmi.RemoteException,java.sql.SQLException" %>
<%@ page import="java.rmi.registry.Registry"%>
<%@ page import="java.rmi.RMISecurityManager,java.rmi.registry.LocateRegistry"%>
<%
//if(session.getAttribute("UserName")!=null || session.getAttribute("Permission")!=null)
{
 try
 {
	response.setContentType("text/plain");
	int count,count2;
	//-----------------------------
	String SQL= request.getParameter("sql");
	//String conection="jdbc:postgresql://localhost:5432/SrvDb";
	//-----------------------------
	//Class.forName("org.postgresql.Driver");
	//Connection oConn = DriverManager.getConnection(conection,"postgres","admin");
	//oConn.setAutoCommit(true);
	//Statement stmt = oConn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_UPDATABLE);
	//-----------------------------
	String drv= request.getParameter("drv");
	String flw= request.getParameter("flw");
	String cmd= request.getParameter("cmd");
	out.println(drv);
	out.println(flw);
	out.println(cmd);
	//-----------------------------
	try
	{
		Registry registry = LocateRegistry.getRegistry(2000);
		RMIInterface cltcmd =(RMIInterface)registry.lookup ("SrvFlow");
		//RMIInterface cltcmd =(RMIInterface)Naming.lookup ("//localhost/SrvFlow");
		drv=cltcmd.driver(drv);
		flw=cltcmd.flow(flw);
		cmd=cltcmd.command(cmd);
	} 
	catch (Exception e)
	{
		e.printStackTrace();
		out.println ("HelloClient exception: " + e);
	}
	//-----------------------------
	//stmt.executeUpdate(SQL);
	//out.print("["+SQL+"]\n");
	//oConn.commit();
	//oConn.close();
 }
 catch(Exception e)
 {
   out.println("message exception:["+e.getClass().getName()+"]"+ e.getMessage());
 }
}
/*else
{
	out.print("[*]\n");
}*/
%>