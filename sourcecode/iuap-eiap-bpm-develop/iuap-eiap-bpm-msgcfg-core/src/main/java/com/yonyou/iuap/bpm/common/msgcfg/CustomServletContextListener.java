package com.yonyou.iuap.bpm.common.msgcfg;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class CustomServletContextListener implements ServletContextListener {
//	private final Logger logger = LoggerFactory.getLogger(getClass());

	public void contextDestroyed(ServletContextEvent arg0) {
	}

	public void contextInitialized(ServletContextEvent event) {
		WebApplicationContext wac = WebApplicationContextUtils.getWebApplicationContext(event.getServletContext());
		SpringContextUtil.setContext(wac);
	}
}
