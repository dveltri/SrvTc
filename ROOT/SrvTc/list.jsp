<%@ page language="java" import="java.io.*,java.util.*, java.sql.*,java.sql.SQLException" %><%
//if(session.getAttribute("email")!=null || session.getAttribute("permisos")!=null) 
{
 try
 {
	response.setContentType("text/XML");
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
	//out.print(SQL);
	if(SQL==null) 
		SQL="SELECT * FROM variables order by id";
	ResultSet rs = stmt.executeQuery(SQL);
	ResultSetMetaData MD = rs.getMetaData();
	count = MD.getColumnCount();
	count2=0;
	//-----------------------------
	out.println("<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>");
	out.print("<variables>");
 	while(rs.next())
	{
		out.print("<fila"+count2+">");
		for (int i=1; i<=count; i++) 
		{
			out.print("<" + MD.getColumnName(i) + ">");
			if(rs.getString(i)!=null)
				out.print(rs.getString(i));
			else
				out.print("0");
			out.print("</"+ MD.getColumnName(i) + ">");
		}
		out.print("</fila"+count2+">");
		count2++;
	}
	out.print("</variables>");
	oConn.close();
 }
 catch(Exception e)
 {
   out.println("message exception:["+e.getClass().getName()+"]"+ e.getMessage());
 }
}%>