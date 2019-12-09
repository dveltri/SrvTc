import java.io.*;
public class lgc_flowpr implements FlowInterface,Runnable
{
	public String Name="flowpr";
	private int finish=0;
	private String[] tmpGetVar;
	private libsql var= new libsql();
	//----------------------------------------------------
	public lgc_flowpr()
	{
	}
	//----------------------------------------------------
	public void SetName(String name)
	{
		Name=name;
	}
	//----------------------------------------------------
	public String GetName()
	{
		return Name;
	}
	//----------------------------------------------------
	public int GetStatus()
	{
		return finish;
	}
	//----------------------------------------------------
	public void ShutDown()
	{
		//this.run=false;
		finish=-1;
	}
	//----------------------------------------------------
	public void run()
	{
		while(finish>=0)
		{
			Thread.currentThread().setName(Name);
			if(finish!=0)
			{
				System.out.println("Thread:"+Name);
				runlogic();
			}
			else
			{
				System.out.println(Name+":paused..");
			}
			try
			{
				if(finish>0)
					Thread.sleep(finish);
				else
					Thread.sleep(1000);
			}
			catch (InterruptedException ie) 
			{
			}
		}
	}
	//----------------------------------------------------
	public int Command(int cmd)
	{
		finish=cmd;
		return finish;
	}
	//----------------------------------------------------
	public void runlogic()
	{
		java.util.Date dt=new java.util.Date();
		int now=(int)(dt.getTime()/1000);
		try
		{
			System.out.print("	");
			var.AddSqlVar("/logic/flowpr/tciclo","120","IntR",",logic.flowpr",null);
			int tciclo=120;
			System.out.print("	");
			tmpGetVar=var.GetSqlVar("/ID2/IOs16/Ocup");
			int _ID2_IOs16_Ocup=Integer.parseInt("0"+tmpGetVar[1]);
			if(_ID2_IOs16_Ocup<10)
			{
				tciclo=60;
			}
			else
			{
				if(_ID2_IOs16_Ocup<30)
				{
					tciclo=80;
				}
				else
				{
					if(_ID2_IOs16_Ocup<60)
					{
						tciclo=100;
					}
					else
					{
						tciclo=100;
						if(_ID2_IOs16_Ocup!=10)
						{
							tciclo=50;
						}
						else
						{
							tciclo=12;
						}
					}
				}
			}
			tciclo+=_ID2_IOs16_Ocup;
			System.out.print("	");
			var.SetSqlVar("/logic/flowpr/tciclo",""+tciclo,"IntR","logic.flowpr",null);
		}
		catch ( Exception e )
		{
			System.err.println("	Errflowpr1:"+e.getClass().getName() + ":" + e.getMessage() );
		}
	}
}
