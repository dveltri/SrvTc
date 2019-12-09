import java.io.*;
public class lgc_setpln1 implements FlowInterface,Runnable
{
	public String Name="setpln1";
	private int finish=0;
	private String[] tmpGetVar;
	private libsql var= new libsql();
	//----------------------------------------------------
	public lgc_setpln1()
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
			tmpGetVar=var.GetSqlVar("/ID3/PLC[1].plan");
			int _ID3_PLCaCORCH1cCORCHPOINTplan=Integer.parseInt("0"+tmpGetVar[1]);
			if(_ID3_PLCaCORCH1cCORCHPOINTplan==99)
			{
				_ID3_PLCaCORCH1cCORCHPOINTplan=0;
			}
			else
			{
				_ID3_PLCaCORCH1cCORCHPOINTplan=99;
			}


			System.out.print("	");
			var.SetSqlVar("/ID3/PLC[1].plan",""+_ID3_PLCaCORCH1cCORCHPOINTplan,"SqlIntW","logic.setpln1",null);
		}
		catch ( Exception e )
		{
			System.err.println("	Errsetpln11:"+e.getClass().getName() + ":" + e.getMessage() );
		}
	}
}
