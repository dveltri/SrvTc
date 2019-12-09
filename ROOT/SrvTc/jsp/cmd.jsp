<%@ page language="java" import="java.io.*, java.sql.*" %>
<!DOCTYPE html>
<%
 //---------------------------------------------------------------
 String Nombre = request.getParameter("Nombre");
 String msj= request.getParameter("msj");
 String MNUpermisos =(String)session.getAttribute("permisos");
 String URL="getGitems.jsp?sql=SELECT * FROM Spcom&Nombre="+Nombre+"&MNUpermisos="+MNUpermisos;
 //---------------------------------------------------------------
 if(MNUpermisos!=null)
 {
   
	Class.forName("sun.jdbc.odbc.JdbcOdbcDriver");
	String database ="jdbc:odbc:Spcom";
	Connection oConn = DriverManager.getConnection( database ,"","");
	Statement stmt = oConn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_UPDATABLE);
	String sql = "update Spcom set Valor='rgb(128,0,128)' where nombre = '" + Nombre +"'";
	stmt.executeUpdate(sql);
	stmt.executeQuery("select * from Spcom");
	//----------------------------------------------------------------
 }
 response.sendRedirect(URL);
%>