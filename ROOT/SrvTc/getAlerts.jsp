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
	oConn.setAutoCommit(false);
	Statement stmt = oConn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_UPDATABLE);
	//-----------------------------
	if(SQL==null) 
		SQL="SELECT * FROM alerts order by time DESC";
	ResultSet rs = stmt.executeQuery(SQL);
	ResultSetMetaData MD = rs.getMetaData();
	count = MD.getColumnCount();
	count2=0;
	//-----------------------------
 	while(rs.next())
	{
		//out.print(count2);
		for (int i=1; i<=count; i++) 
		{
			out.print("\t");
			if(rs.getString(i)!=null)
				out.print(rs.getString(i));
			else
				out.print("");
		}
		out.print("\n");
		count2++;
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