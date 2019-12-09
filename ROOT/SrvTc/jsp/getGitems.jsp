<%@ page language="java" import="java.io.*, java.sql.*" %><%
//if(session.getAttribute("email")!=null || session.getAttribute("permisos")!=null) 
{
 try
 {
	response.setContentType("text/XML");
	String DSN;
	String SQL;
	ResultSetMetaData MD;
	int count,count2;
	//-----------------------------
	DSN = request.getParameter("DSN");
	SQL= request.getParameter("sql");
	//-----------------------------
	Class.forName("sun.jdbc.odbc.JdbcOdbcDriver");
	if(DSN==null)
		DSN="Spcom";
	Connection oConn = DriverManager.getConnection("jdbc:odbc:"+DSN ,"","");
	Statement stmt = oConn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_UPDATABLE);
	//-----------------------------
	if(SQL==null) 
		SQL="SELECT * FROM Analogicas order by Nombre";
	//out.print(SQL);
	ResultSet rs = stmt.executeQuery(SQL);
	MD = rs.getMetaData();
	count = MD.getColumnCount();
	count2=0;
	//-----------------------------
	out.println("<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>");
	out.print("<"+DSN+">");
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
	out.print("</"+DSN+">");
 }
 catch(Exception e)
 {
   out.println("message exception" + e.getMessage());
 }
}%>