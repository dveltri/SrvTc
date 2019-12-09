import java.rmi.*;
import java.rmi.Remote;
import java.rmi.RemoteException;
public interface RMIInterface extends Remote {
		public String driver(String cmd) throws RemoteException;
		public String flow(String cmd) throws RemoteException;
    public String command(String cmd) throws RemoteException;
}
