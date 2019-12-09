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
	String SQL= request.getParameter("sql");
	String conection="jdbc:postgresql://localhost:5432/SrvDb";
	//-----------------------------
	Class.forName("org.postgresql.Driver");
	Connection oConn = DriverManager.getConnection(conection,"postgres","admin");
	oConn.setAutoCommit(true);
	Statement stmt = oConn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_UPDATABLE);
	//-----------------------------
	if(SQL==null) 
	{
		out.print("Err no Sql\n");
	}
	else
	{
		if(SQL.indexOf("DELETE")!=-1)
		{
			System.out.println("["+SQL+"]\n");
			//FileWriter archivo = new FileWriter(rootDir+"\\delsql.txt",true);
			//archivo.write("["+SQL+"]\n");
			//archivo.close();
		}
		stmt.executeUpdate(SQL);
		out.print("["+SQL+"]\n");
		oConn.commit();
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