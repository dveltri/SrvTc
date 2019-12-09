// comman line rmi
import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.Registry;
import java.rmi.registry.LocateRegistry;
//import java.rmi.RMISecurityManager; 
import javax.swing.JOptionPane;
//import com.mkyong.rmiinterface.RMIInterface;

public class ClientOperation
{
	public static void main(String[] args) throws MalformedURLException, RemoteException, NotBoundException
	{
		try
		{
			Registry registry = LocateRegistry.getRegistry(2000);
			RMIInterface cltcmd =(RMIInterface)registry.lookup(args[0]);
			//RMIInterface cltcmd =(RMIInterface)Naming.lookup ("//localhost/SrvFlow");
			System.out.println (cltcmd.driver(args[0]));
			System.out.println (cltcmd.flow(args[1]));
			System.out.println (cltcmd.command(args[2]));
		} 
		catch (Exception e)
		{
			System.out.println ("HelloClient exception: " + e);
		}
	}
}
