package com.ali.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;

@Configuration
public class ProjectSecurityConfig extends WebSecurityConfigurerAdapter {

  /**
   * /myAccount - Secured /myBalance - Secured /myLoans - Secured /myCards - Secured /notices - Not
   * Secured /contact - Not Secured
   */
  @Override
  protected void configure(HttpSecurity http) throws Exception {

    //      http.authorizeRequests().anyRequest().permitAll().and().formLogin().and().httpBasic();

    JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());

    //! CORS configuration for UI application
    http.cors()
        .configurationSource(
            new CorsConfigurationSource() {
              @Override
              public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
                config.setAllowedMethods(Collections.singletonList("*"));
                config.setAllowCredentials(true);
                config.setAllowedHeaders(Collections.singletonList("*"));
                config.setMaxAge(3600L);
                return config;
              }
            })

        .and()
        .authorizeRequests()
        .antMatchers("/api/products").permitAll()
        .antMatchers("/api/**").authenticated()
//        .antMatchers("/api/product-category").permitAll()
//        .antMatchers("/api/*").permitAll()
//        .hasAnyRole("USER")
//        .antMatchers("/myBalance")
//        .hasAnyRole("ADMIN")
//        .antMatchers("/myLoans")
//        .authenticated()
//        .antMatchers("/myCards")
//        .hasAnyRole("USER", "ADMIN")
//        .antMatchers("/notices")
//        .permitAll()
//        .antMatchers("/contact")
//        .permitAll()
        // ! disable CSRF as we do not need extra layer of security as we are already following OAuth2 with OpenId connect standard
        .and().csrf().disable()
        // oauth2ResourceServer: tell the this server to act as a resource server
        // jwt: follow JSON web token standard
        .oauth2ResourceServer().jwt().jwtAuthenticationConverter(jwtAuthenticationConverter);

    http.headers().frameOptions().sameOrigin();
  }
}
