package com.tspmquestionmaster.controller;


import com.tspmquestionmaster.dto.response.TemplateResponse;
import com.tspmquestionmaster.service.TemplateService;


import org.junit.jupiter.api.Test;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;


import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;


import java.util.List;


import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



@WebMvcTest(TemplateController.class)
@AutoConfigureMockMvc(addFilters = false)
class TemplateControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
    private TemplateService templateService;




    @Test
    void getAllTemplates_success() throws Exception {


        when(templateService.getAllTemplates())
                .thenReturn(
                        List.of(
                                new TemplateResponse()
                        )
                );


        mockMvc.perform(
                        get("/api/templates")
                )
                .andExpect(status().isOk());

    }





    @Test
    void getTemplateById_success() throws Exception {


        when(templateService.getTemplateById(1L))
                .thenReturn(
                        new TemplateResponse()
                );


        mockMvc.perform(
                        get("/api/templates/1")
                )
                .andExpect(status().isOk());

    }





    @Test
    void deleteTemplate_success() throws Exception {


        doNothing()
                .when(templateService)
                .deleteTemplate(1L);



        mockMvc.perform(
                        delete("/api/templates/1")
                )
                .andExpect(status().isNoContent());

    }

}