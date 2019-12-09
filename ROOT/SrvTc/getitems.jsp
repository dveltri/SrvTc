<%@ page language="java" import="java.io.*,java.util.*, java.sql.*,java.sql.SQLException" %><%
if(session.getAttribute("UserName")!=null || session.getAttribute("Permission")!=null)
{
 try
 {
	//select CONCAT(var1.id,'/',var2.id),var2.value from variables AS var1 JOIN variables AS var2 ON var2.id LIKE CONCAT(var1.value,'%') WHERE var1.id LIKE 'Osasco' AND var2.id LIKE '%Status%'
	//select CONCAT(var1.value,'/',var3.id),var2.value from variables AS var1 JOIN variables AS var2 ON var2.id = var1.value JOIN variables AS var3 ON var3.id LIKE CONCAT(var2.value,'%') WHERE var1.id LIKE 'Group' AND var3.id LIKE '%Status%'

	//response.setContentType("text/XML");
	response.setContentType("text/plain");
	//response.setContentType("application/octet-stream");
	int count,count2;
	//-----------------------------
	String vSQL= request.getParameter("sql");
	String conection="jdbc:postgresql://localhost:5432/SrvDb";
	String dato="";
	//-----------------------------
	Class.forName("org.postgresql.Driver");
	Connection oConn = DriverManager.getConnection(conection,"postgres","admin");
	oConn.setAutoCommit(true);
	Statement stmt = oConn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_UPDATABLE);
	//-----------------------------
	if(vSQL==null)
	{
		vSQL="SELECT * FROM variables order by id";
	}
	else
	{
		out.print("//");
		out.println(vSQL);
	}
	ResultSet rs = stmt.executeQuery(vSQL);
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
			dato=rs.getString(i);
			if((dato==null) || (dato=="") || (dato==" ") || (dato=="\t"))
			{
				out.print("0");
			}
			else
			{
				out.print(dato);
			}
		}
		out.print("\n");
		count2++;
	}
	oConn.close();
 }
 catch(Exception e)
 {
   out.print("message exception:["+e.getClass().getName()+"]"+ e.getMessage()+"\n");
 }
}
else
{
	out.print("[*]\n");
}
%>