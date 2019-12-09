<%@ page language="java" import="java.io.*,java.util.*, java.sql.*,java.sql.SQLException" %><%
if(session.getAttribute("UserName")!=null || session.getAttribute("Permission")!=null)
{
	try
	{
		response.setContentType("text/plain");
		int count,count2;
		String dato="";
		//-----------------------------
		String cmps= request.getParameter("cmps");
		String tbl= request.getParameter("tbl");
		String filtros=request.getParameter("flt");
		String group=request.getParameter("grp");
		String orden= request.getParameter("ord");
		//-----------------------------
		String vSQL= request.getParameter("sql");
		String conection="jdbc:postgresql://localhost:5432/SrvDb";
		//-----------------------------
		Class.forName("org.postgresql.Driver");
		Connection oConn = DriverManager.getConnection(conection,"postgres","admin");
		oConn.setAutoCommit(true);
	}
	catch(Exception e)
	{
		out.print("message exception:["+e.getClass().getName()+"]"+ e.getMessage()+"\n");
	}
	try
	{
		DatabaseMetaData metadata = Connection.getMetaData();
		String[] types = {"TABLE"};
		String tableName;
		String tableCatalog;
		String tableSchema;
		ResultSet rs = metadata.getTables(null, null, "%", types);
		while (rs.next())
		{
			tableName = rs.getString(3);
			tableCatalog = rs.getString(1);
			tableSchema = rs.getString(2);
			System.out.println("Table : " + tableName + "nCatalog : " + tableCatalog + "nSchema : " + tableSchema);
		}
	}
	catch(SQLException e)
	{
		System.out.println("Could not get database metadata " + e.getMessage());
	}
}
else
{
	out.print("[*]\n");
}
%>