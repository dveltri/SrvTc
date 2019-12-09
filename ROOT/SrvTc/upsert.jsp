<%@ page language="java" import="java.io.*,java.util.*, java.sql.*,java.sql.SQLException" %><%
if(session.getAttribute("UserName")!=null || session.getAttribute("Permission")!=null)
{
 try
 {
	//response.setContentType("text/XML");
	response.setContentType("text/plain");
	//response.setContentType("application/octet-stream");
	int count,count2;
	//-----------------------------
	String cmps= request.getParameter("cmps");
	String valores= request.getParameter("vls");
	String tbl= request.getParameter("tbl");
	String filtros=request.getParameter("flt");
	String group=request.getParameter("grp");
	String orden= request.getParameter("ord");
	//-----------------------------
	String SQL= request.getParameter("sql");
	String conection="jdbc:postgresql://localhost:5432/SrvDb";
	//-----------------------------
	Class.forName("org.postgresql.Driver");
	Connection oConn = DriverManager.getConnection(conection,"postgres","admin");
	oConn.setAutoCommit(true);
	Statement stmt = oConn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_UPDATABLE);
	//-----------------------------
	{
		try
		{
			SQL = "INSERT INTO "+tbl+" ("+cmps+") VALUES ("+valores+");"; 
			stmt.executeUpdate(SQL);
		}
		catch ( Exception x )
		{
			try
			{
				SQL = "UPDATE "+tbl+" SET ("+cmps+") =	("+valores+") WHERE "+filtros;
				stmt.executeUpdate(SQL);
			}
			catch ( Exception e )
			{
				System.err.println("\n\tErr5:"+e.getClass().getName() + ":" + e.getMessage()+"\n\t"+SQL);
			}
		}
		out.print("["+SQL+"]\n");
	}
	oConn.close();
 }
 catch(Exception e)
 {
   out.println("message exception:["+e.getClass().getName()+"]"+ e.getMessage());
 }
}
else
{
	out.print("[*]\n");
}
%>