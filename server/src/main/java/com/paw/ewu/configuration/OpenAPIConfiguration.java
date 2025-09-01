package com.paw.ewu.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfiguration {

    @Bean
    public OpenAPI defineOpenApi() {
        Server server = new Server()
                .url("http://localhost:8080");

        Info info = new Info()
                .title("Employee leave requests management API")
                .version("1.0")
                .description("This API exposes endpoints to employee leave requests management.");
;
        return new OpenAPI().info(info).servers(List.of(server));
    }
}