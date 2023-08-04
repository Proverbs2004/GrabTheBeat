package com.ygd.grab_the_beat.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
class WebOAuthSecurityConfigTest {

    @Autowired
    private WebOAuthSecurityConfig webOAuthSecurityConfig;

    @Test
    void isExistWebOAuthSecurityConfig() {
        // given

        // when

        // then
        System.out.println("webOAuthSecurityConfig = " + webOAuthSecurityConfig);
        assertThat(webOAuthSecurityConfig).isNotNull();
    }

}