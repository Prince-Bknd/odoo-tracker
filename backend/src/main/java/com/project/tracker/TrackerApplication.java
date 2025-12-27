package com.project.tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class TrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrackerApplication.class, args);
	}

	@Bean
	@Profile("dev")
	public String devProfileInfo(Environment env) {
		System.out.println("\n");
		System.out.println("🚀 ================================================");
		System.out.println("🚀 ================================================");
		System.out.println("🚀 === RUNNING IN DEVELOPMENT MODE ===");
		System.out.println("🚀 ================================================");
		System.out.println("🚀 ================================================");
		System.out.println("🚀 Active Profile: " + env.getActiveProfiles()[0]);
		System.out.println("🚀 Database: MySQL (Development)");
		System.out.println("🚀 Port: " + env.getProperty("server.port", "8000"));
		System.out.println("🚀 ================================================");
		System.out.println("\n");
		return "dev";
	}

	@Bean
	@Profile("prod")
	public String prodProfileInfo(Environment env) {
		System.out.println("\n");
		System.out.println("🔥 ================================================");
		System.out.println("🔥 ================================================");
		System.out.println("🔥 === RUNNING IN PRODUCTION MODE ===");
		System.out.println("🔥 ================================================");
		System.out.println("🔥 ================================================");
		System.out.println("🔥 Active Profile: " + env.getActiveProfiles()[0]);
		System.out.println("🔥 Database: PostgreSQL (Production)");
		System.out.println("🔥 Port: " + env.getProperty("server.port", "8080"));
		System.out.println("🔥 ================================================");
		System.out.println("\n");
		return "prod";
	}

	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady(ApplicationReadyEvent event) {
		Environment env = event.getApplicationContext().getEnvironment();
		String[] activeProfiles = env.getActiveProfiles();
		
		if (activeProfiles.length > 0) {
			String profile = activeProfiles[0];
			System.out.println("\n");
			System.out.println("🎯 ================================================");
			System.out.println("🎯 === APPLICATION STARTUP COMPLETED ===");
			System.out.println("🎯 ================================================");
			System.out.println("🎯 Profile: " + profile);
			System.out.println("🎯 Status: READY");
			System.out.println("🎯 ================================================");
			System.out.println("\n");
		}
	}
}
