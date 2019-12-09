import java.io.*;
import java.io.File;
import java.nio.file.Files;
import java.lang.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
//----------------------------------------------------------------------------------------------------------------------
public class dgvclssldr extends ClassLoader
{
	@Override
  public Class<?> loadClass(String s)
	{
		return findClass(s);
  }
	public Class<?> findClass(String name)
	{
		System.out.println(name+":Dgv.Class.Loader");
		if(name.indexOf("lgc_")==-1)
		{
			try
			{
					System.out.println(name+":<<1findSystemClass>>");
					return super.loadClass(name);
			}
			catch(ClassNotFoundException ignore)
			{
				ignore.printStackTrace(System.out);
			}
			return null;
		}
		else
		{
			try
			{
				byte[] b = loadClassData(name);
				Class <?>c=defineClass(name, b, 0, b.length);
				resolveClass(c);
				System.out.println(name+":<<findDgvClass>>");
				if(c==null)
					System.out.println("Error:"+name);
				return c;
			}
			catch (IOException ioe)
			{
				try
				{
						System.out.println(name+":<<2findSystemClass>>");
						return super.loadClass(name);
				}
				catch(ClassNotFoundException ignore)
				{
				}
				ioe.printStackTrace(System.out);
				return null;
			}
		}
	}
	private byte[] loadClassData(String filename) throws IOException 
	{
		// Create a file object relative to directory provided
		filename = filename.replace('.', File.separatorChar) + ".class";
		File f = new File(filename);
		InputStream is = getClass().getClassLoader().getResourceAsStream(filename);
		// Get size of class file
		int size = (int) f.length();
		// Reserve space to read
		byte buff[] = new byte[size];
		// Get stream to read from
		FileInputStream fis = new FileInputStream(f);
		DataInputStream dis = new DataInputStream(fis);
		// Read in data
		dis.readFully(buff);
		// close stream
		dis.close();
		// return data
		return buff;
	}
}
//----------------------------------------------------------------------------------------------------------------------*/
