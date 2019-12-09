<%@ page language="java" import="java.io.*, java.sql.*,org.apache.commons.io.FileUtils.*" %>
<%
	String COMMAND = request.getParameter("cmd");
	String title = request.getParameter("title");
	String code = request.getParameter("code");
	String codeJ = request.getParameter("codej");
	String [] DataPlan;
	String [][] Variables;
	String [] linea;
	String swtch;
	//-----------------------------------------------------------------------------
	String Os=System.getProperty("os.name");
	ServletContext context = session.getServletContext();
	String rootDir = context.getRealPath(request.getContextPath()); 
	//-----------------------------------------------------------------------------
	int i=0;
	//rootDir+="\\SrvTc";
	rootDir=rootDir.replaceAll("ROOT","");
	rootDir+="\\FlowSrv";
	String cmd="";
	String Storage="\\logics";
	String path=rootDir;
	String outD="";
	path+=Storage;
	if (Os.indexOf("Win")!=-1)
	{
		path=path.replace('\\','/');
		path=path.replaceAll("//","/");
	}
	//-----------------------------------------------------------------------------
	outD+="import java.io.*;\n";
	outD+="public class lgc_"+title+" implements FlowInterface,Runnable\n";
	outD+="{\n";
	outD+="\tpublic String Name=\""+title+"\";\n";
	outD+="\tprivate int finish=0;\n";
	outD+="\tprivate String[] tmpGetVar;\n";
	outD+="\tprivate libsql var= new libsql();\n";
	outD+="\t//----------------------------------------------------\n";
	outD+="\tpublic lgc_"+title+"()\n\t{\n\t}\n";
	outD+="\t//----------------------------------------------------\n";
	outD+="\tpublic void SetName(String name)\n";
	outD+="\t{\n";
	outD+="\t\tName=name;\n";
	outD+="\t}\n";
	outD+="\t//----------------------------------------------------\n";
	outD+="\tpublic String GetName()\n";
	outD+="\t{\n";
	outD+="\t\treturn Name;\n";
	outD+="\t}\n";
	outD+="\t//----------------------------------------------------\n";
	outD+="\tpublic int GetStatus()\n";
	outD+="\t{\n";
	outD+="\t\treturn finish;\n";
	outD+="\t}\n";
	outD+="\t//----------------------------------------------------\n";
	outD+="\tpublic void ShutDown()\n";
	outD+="\t{\n";
	outD+="\t\t//this.run=false;\n";
	outD+="\t\tfinish=-1;\n";
	outD+="\t}\n";
	outD+="\t//----------------------------------------------------\n";
	outD+="\tpublic void run()\n";
	outD+="\t{\n";
	//outD+="\t\tfinish=300;\n";
	outD+="\t\twhile(finish>=0)\n";
	outD+="\t\t{\n";
	outD+="\t\t\tThread.currentThread().setName(Name);\n";
	outD+="\t\t\tif(finish!=0)\n";
	outD+="\t\t\t{\n";
	outD+="\t\t\t\tSystem.out.println(\"Thread:\"+Name);\n";
	outD+="\t\t\t\trunlogic();\n";
	outD+="\t\t\t}\n";
	outD+="\t\t\telse\n";
	outD+="\t\t\t{\n";
	outD+="\t\t\t\tSystem.out.println(Name+\":paused..\");\n";
	outD+="\t\t\t}\n";
	outD+="\t\t\ttry\n";
	outD+="\t\t\t{\n";
	outD+="\t\t\t\tif(finish>0)\n";
	outD+="\t\t\t\t\tThread.sleep(finish);\n";
	outD+="\t\t\t\telse\n";
	outD+="\t\t\t\t\tThread.sleep(1000);\n";
	outD+="\t\t\t}\n";
	outD+="\t\t\tcatch (InterruptedException ie) \n";
	outD+="\t\t\t{\n";
	outD+="\t\t\t}\n";
	outD+="\t\t}\n";
	outD+="\t}\n";
	outD+="\t//----------------------------------------------------\n";
	outD+="\tpublic int Command(int cmd)\n";
	outD+="\t{\n";
	outD+="\t\tfinish=cmd;\n";
	outD+="\t\treturn finish;\n";
	outD+="\t}\n";
	outD+="\t//----------------------------------------------------\n";
	outD+="\tpublic void runlogic()\n";	// throws Exception
	outD+="\t{\n";
	outD+="\t\tjava.util.Date dt=new java.util.Date();\n";
	outD+="\t\tint now=(int)(dt.getTime()/1000);\n";
	//outD+="\t\tnow/=1000;\n";
	outD+="\t\ttry\n";
	outD+="\t\t{\n";
	//-----------------------------------------------------------------------------
	if(codeJ!=null && title!=null)
	{
		outD+=codeJ;
	}
	//-----------------------------------------------------------------------------
	outD+="\t\t}\n";
	outD+="\t\tcatch ( Exception e )\n";
	outD+="\t\t{\n";
	outD+="\t\t\tSystem.err.println(\"\tErr"+title+"1:\"+e.getClass().getName() + \":\" + e.getMessage() );\n";
	outD+="\t\t}\n";
	outD+="\t}\n";
	outD+="}\n";
	//-----------------------------------------------------------------------------
	if(codeJ!=null && title!=null)
	{
		try
		{
			out.println(outD.replaceAll("\n","<br/>"));
			FileWriter archivo = new FileWriter(rootDir+"\\lgc_"+title+".java");
			archivo.write(outD);
			archivo.close();
			//------------------------------------
   		File file = new File(rootDir+"\\lgc_"+title+".class");
   		if(file.delete())
			{
				System.out.println(file.getName() + " is deleted!");
    	}
			else
			{
				System.out.println("Delete "+file.getName()+" operation is failed.");
    	}
			//------------------------------------*/
		}
		catch (IOException E0)
		{
			System.out.println("ERROR: Could not create Progs List");
			System.out.println("message exception" + E0.getMessage());
		}
	}
	else
		out.println(code.replaceAll(";",";<br/>"));
	//-----------------------------------------------------------------------------
	if(COMMAND!=null && title!=null)
	{
		{
			/*Runtime runtime = Runtime.getRuntime();
			cmd=rootDir+"\\rnm.bat "+rootDir+""+Storage+"\\lgc_"+title+".dgv "+COMMAND;
			out.println("//"+cmd);
			Process exec = runtime.exec(cmd);
			Thread.sleep(500);*/
		}
	}
	//-----------------------------------------------------------------------------
%>
