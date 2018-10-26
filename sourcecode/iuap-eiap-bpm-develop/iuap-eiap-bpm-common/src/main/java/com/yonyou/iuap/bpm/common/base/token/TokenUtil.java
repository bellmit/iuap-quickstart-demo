package com.yonyou.iuap.bpm.common.base.token;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;

import com.yonyou.iuap.cache.CacheManager;
import com.yonyou.iuap.utils.Base64Util;

public class TokenUtil {
	 //用于外部调用生成Token字符串的静态方法  
    public static String getToken(){
        UUID uuid = UUID.randomUUID();  
        String token = compressedUUID(uuid);  
        //验证是否有相同的Token,为true重新生成  
//        if(TokenManager.DATA_MAP.containsKey(token)){  
//            uuid = UUID.randomUUID();  
//            token = compressedUUID(uuid);  
//        }  
        return token;  
    }  
  
    //对UUID进行处理，形成想要的Token长度  
    private static String compressedUUID(UUID uuid) {  
        byte[] byUuid = new byte[TokenConfig.TOKEN_BYTE_LEN];  
        long least = uuid.getLeastSignificantBits();  
        long most = uuid.getMostSignificantBits();  
        long2bytes(most, byUuid, 0);  
        long2bytes(least, byUuid, TokenConfig.TOKEN_BYTE_LEN/2);  
        String compressUUID = Base64Util.encode(byUuid);  
        return compressUUID; 
    }  
  
    //长度处理  
    private static void long2bytes(long value, byte[] bytes, int offset) {  
        for (int i = TokenConfig.TOKEN_BYTE_LEN/2-1; i > -1; i--) {  
            bytes[offset++] = (byte) ((value >> 8 * i) & 0xFF);  
        }  
    }  
    
    public static void main(String[] args){
    	String token = getToken();
//    	System.out.println(token);   //sonar检查不过，请测试的时候自行放开注释
    }
}
