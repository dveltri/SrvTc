// classe receptora de comandos por RMI
import java.rmi.*;
import java.rmi.server.*;

public class libcmd extends UnicastRemoteObject implements RMIInterface
{
  public String driver=null;
	public String flow=null;
	public String command=null;
  public libcmd (String msg) throws RemoteException
	{
  }
	public String driver(String msg) throws RemoteException
	{
		System.out.println("driver");
		driver=msg;
		return msg;
	}
	public String flow(String msg) throws RemoteException
	{
		System.out.println("flow");
		flow=msg;
		return msg;
	}
	public String command(String msg) throws RemoteException
	{
		System.out.println("command");
		command=msg;
		return msg;
	}
}