//package MailAlerts.com.tutorial;
import java.net.*;
import java.io.*;
import java.util.*;
import java.sql.*;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
 
 /**
 * @author Crunchify.com
 * 
 */
 
public class MailAlerts
{
 
	static Properties mailServerProperties;
	static Session getMailSession;
	static MimeMessage generateMailMessage;
	public MailAlerts()
	{
	}
	
	/*public static void main(String args[]) throws AddressException, MessagingException
	{
		generateAndSendEmail("dveltri@gmail.com","lalal","Mensaje de pruebas");
		System.out.println("\n\n ===> Your Java Program has just sent an Email successfully. Check your email..");
	}*/
 
	public void generateAndSendEmail(String email,String Subject,String text) throws AddressException, MessagingException
	{
 
		// Step1
		System.out.println("\n 1st ===> setup Mail Server Properties..");
		mailServerProperties = System.getProperties();
		mailServerProperties.put("mail.smtp.port", "587");
		mailServerProperties.put("mail.smtp.auth", "true");
		mailServerProperties.put("mail.smtp.starttls.enable", "true");
		System.out.println("Mail Server Properties have been setup successfully..");
 
		// Step2
		System.out.println("\n\n 2nd ===> get Mail Session..");
		getMailSession = Session.getDefaultInstance(mailServerProperties, null);
		generateMailMessage = new MimeMessage(getMailSession);
		generateMailMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
		//generateMailMessage.addRecipient(Message.RecipientType.CC, new InternetAddress("dveltri@gmail.com"));
		//generateMailMessage.addRecipient(Message.RecipientType.BCC, new InternetAddress("si.centraltransito@gmail.com"));
		generateMailMessage.setSubject("Reporte Automatico. "+Subject);
		text=text.replaceAll("\n","<br>");
		generateMailMessage.setContent(text, "text/html");
		System.out.println("Mail Session has been created successfully..");
 
		// Step3
		System.out.println("\n\n 3rd ===> Get Session and Send mail");
		Transport transport = getMailSession.getTransport("smtp");
 
		// Enter your correct gmail UserID and Password
		// if you have 2FA enabled then provide App Specific Password
		transport.connect("smtp.gmail.com", "si.centraltransito", "Xy3kQadv");
		transport.sendMessage(generateMailMessage, generateMailMessage.getAllRecipients());
		transport.close();
	}
}