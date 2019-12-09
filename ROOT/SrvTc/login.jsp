<%@ page language="java" import="java.io.*,java.util.*, java.sql.*,java.sql.SQLException" %><%
//if(session.getAttribute("UserName")!=null || session.getAttribute("Permission")!=null)
{
 String redirectURL="./index.htm";
 try
 {
	int count,count2;
	//response.setContentType("text/XML");
	response.setContentType("text/plain");
	//response.setContentType("application/octet-stream");
	//-----------------------------
	String usr= request.getParameter("user");
	String pass= request.getParameter("pass");
	String conection="jdbc:postgresql://localhost:5432/SrvDb";
	//-----------------------------
	Class.forName("org.postgresql.Driver");
	Connection oConn = DriverManager.getConnection(conection,"postgres","admin");
	oConn.setAutoCommit(false);
	Statement stmt = oConn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_UPDATABLE);
	//-----------------------------
	String SQL="SELECT * FROM users WHERE usr='"+usr+"' AND pass='"+pass+"' ORDER BY key";
	//out.print(SQL);
	ResultSet rs = stmt.executeQuery(SQL);
	ResultSetMetaData MD = rs.getMetaData();
	count = MD.getColumnCount();
	count2=0;
	//-----------------------------
 	while(rs.next())
	{
		session.setAttribute( "UserName", usr );
		session.setAttribute( "Permission",rs.getString("permission"));
		redirectURL="./main.html";
	}
	oConn.close();
 }
 catch(Exception e)
 {
   out.println("message exception:["+e.getClass().getName()+"]"+ e.getMessage());
 }
 //out.print(redirectURL);
 response.sendRedirect(redirectURL);
}%>
