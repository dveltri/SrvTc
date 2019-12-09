public interface FlowInterface extends Runnable {
	public void 		SetName(String name);
	public String 	GetName();
	public int 			GetStatus();
	public void 		ShutDown();
	public int 			Command(int cmd);
	public void runlogic();
}