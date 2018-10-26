import java.util.Date;
import java.util.TimeZone;

public class Test {
	
	public static void main(String[] args) {
		Date date = new Date((long)TimeZone.getDefault().getRawOffset() + 3153600000000L);
		 System.out.println(date);
	}

}
