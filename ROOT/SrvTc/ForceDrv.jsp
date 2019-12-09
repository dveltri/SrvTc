<%@ page language="java" import="java.io.*,java.util.*, java.sql.*,java.sql.SQLException" %><%
String Usr=(String)session.getAttribute("UserName");
if(Usr!=null || session.getAttribute("Permission")!=null)
{
 try
 {
	//response.setContentType("text/XML");
	response.setContentType("text/plain");
	//response.setContentType("application/octet-stream");
	int count,count2;
	//-----------------------------
	String SQL;
	String uSQL;
	String Variable= request.getParameter("var");
	Variable=Variable.trim();
	String Valor= request.getParameter("val");
	Valor=Valor.trim();
	String timeto= request.getParameter("time");
	timeto=timeto.trim();
	String conection="jdbc:postgresql://localhost:5432/SrvDb";
	String dato;
	String id;
	
	int key;
	//-----------------------------
	Class.forName("org.postgresql.Driver");
	Connection oConn = DriverManager.getConnection(conection,"postgres","admin");
	Connection oConn2 = DriverManager.getConnection(conection,"postgres","admin");
	oConn2.setAutoCommit(true);
	Statement stmt = oConn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_UPDATABLE);
	Statement stmt2 = oConn2.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_UPDATABLE);
	//-----------------------------
	SQL="SELECT * FROM schedulerfnc WHERE id LIKE 'Frc.%'";
	//out.print("//1"+SQL+"\n");
	ResultSet rs = stmt.executeQuery(SQL);
 	while(rs.next())
	{
		id=rs.getString("id");
		out.print("//Enable Group("+id+")\n");
		id=id.replaceAll("Frc.","");
		key=rs.getInt("key");
		uSQL = "UPDATE schedulerfnc SET id='"+id+"' WHERE key="+key;
		//out.print("//2 "+uSQL+"\n");
		try
		{
			stmt2.executeUpdate(uSQL);
			oConn2.commit();
		}
		catch(Exception e)
		{
		 out.println("1 message exception:["+e.getClass().getName()+"]"+ e.getMessage());
		}
	}
	//-----------------------------
	if(Valor.equals("0")==false)
	{
		SQL="SELECT * FROM schedulerfnc WHERE id LIKE '"+Variable+"'";
		out.print("//3"+SQL+"\n");
		rs = stmt.executeQuery(SQL);
		while(rs.next())
		{
			id=rs.getString("id");
			key=rs.getInt("key");
			out.print("//Disable Group("+id+")\n");
			uSQL = "UPDATE schedulerfnc SET id='Frc."+id+"',lts='"+timeto+"' WHERE key="+key;
			out.print("//4"+uSQL+"\n");
			try
			{
				stmt2.executeUpdate(uSQL);
				oConn2.commit();
			}
			catch(Exception e)
			{
			 out.println("2 message exception:["+e.getClass().getName()+"]"+ e.getMessage());
			}
		}
	}
	//-----------------------------
	if(Valor.equals("0")==false)
		uSQL = "UPDATE variables V SET value='"+Valor+"' FROM schedulerfnc S WHERE S.setvar = V.id AND S.id LIKE 'Frc.%' AND S.lts > now();";
	else
		uSQL = "UPDATE variables V SET value='"+Valor+"' FROM schedulerfnc S WHERE S.setvar = V.id"; // AND S.id LIKE 'Frc.%' AND S.lts > now();
//		uSQL = "UPDATE variables SET value='"+Valor+"' WHERE id='"+Variable+"'";
	out.print("//5"+uSQL+"\n");
	try
	{
		stmt2.executeUpdate(uSQL);
		oConn2.commit();
	}
	catch(Exception e)
	{
		out.println("3 message exception:["+e.getClass().getName()+"]"+ e.getMessage());
	}
	//-----------------------------
	{
		try
		{
			if(Valor.equals("0")==false)
				SQL = "INSERT INTO alerts VALUES (LOCALTIMESTAMP,\'Viewed\',\'Command Force ["+Variable+"] by "+Usr+"\',\'"+Usr+"\',\'Command\')";
			else
				SQL = "INSERT INTO alerts VALUES (LOCALTIMESTAMP,\'Viewed\',\'Command Insolado ["+Variable+"] by "+Usr+"\',\'"+Usr+"\',\'Command\')";
			out.println("UpdAlrt ");
			stmt2.executeUpdate(SQL);
			oConn2.commit();
		}
		catch (Exception e) 
		{
			out.println("AddAlrt message exception:["+e.getClass().getName()+"]"+ e.getMessage());
		}
	}
	//-----------------------------
	oConn.close();
 }
 catch(Exception e)
 {
   out.print("4 message exception:["+e.getClass().getName()+"]"+ e.getMessage()+"\n");
 }
}
else
{
	out.print("[*]\n");
}
%>
