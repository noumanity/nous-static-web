let data, template, html;
        data = {
            about : "Acerca",
            specialty : "Especialidad",
            blog : "Blog",
            lenguage_es : "ES",
            lenguage_fr : "FR",
            banner_message : "Sé parte<br> \
                              del futuro <br> \
                              de tu industria <br> \
                              rodéandote de<br>\
                              lo mejor en <br> \
                              transformación <br> \
                              digital.</p>",
            second_section_left_message: "Rodéate de aquellos que necesitas <br> \
                                      para asegurar tu éxito.<br>",
            second_section_right_message: "<li>Consultoría digital.</li>\
                                        <li>Investigación y práctica de la innovación.</li>\
                                        <li>Transformación digital.</li>",
            third_section_tittle: "ACERCA DE",  
            third_section_subtittle: "Estámos ayudando a las<br> \
                                      empresas a evolucionar<br> \
                                      gracias a las nuevas<br> \
                                      tecnologías.",
            text_above_image: "Numanity es una empresa de innovación<br> \
                              tecnológica que lleva a las empresas hacia la<br> \
                              transformación digital. Lorem ipsum dolor sit amet,<br> \
                              nibh euismod tincidunt ut laoreet dolore magna erad<br> \
                              voluptat.",
            text_below_image: "Aquí va una imagen de trabajo y una breve<br> \
                              descripción sobre el proceso que se lleva a cabo<br> \
                              para cada proyecto. Lorem ipsum dolor sit amet,<br> \
                              consectetuer adipiscing elit, sed diam<br> \
                              nonummy nibh euismod tincidunt ut<br> \
                              laoreet dolore magna erat<br> \
                              volutpat. Lorem ipsum dolor sit amet,<br> \
                              consectetuer adipiscing elit.",
            fourth_section_title: "Enfoque multidisciplinar,<br> \
                              pero siempre bajo la lupa <br> \
                              digital.<br>",  
            fourth_section_subtitle: "Trabajar con Noumanity es avanzar<br> \
                                      con confianza y seguridad.<br>",  
            security: "Seguridad",
            quality: "Calidad",
            confidence : "Confianza",
            experience : "Experiencia",
            fourth_section_right_message: "Breve descripción de cada cualidad,<br> \
                                            principio o valor que tiene Noumanity como<br> \
                                            proveedor de servicio.Lorem ipsum dolor<br> \
                                            sit amet, consectetuer.<br>",    
            fifth_section_title : "ESPECIALIDAD",
            fifth_section_subtitle : "Te ayudamos a <br> \
                                      poner el uso de la <br> \
                                      tecnología en el<br> \
                                      centro de tus<br> \
                                      decisiones<br> \
                                      empresariales<br> \
                                      para lograr tus <br> \
                                      objetivos<br> \
                                      comerciales.",
            sevent_section_title : "Innovación tecnológica que abre<br> \
                                  nuevas posibilidades",
            seventh_section_left_title : "Análisis estratégico",                                                                                        
            seventh_section_left_text : "Identifica las fortalezas y debilidades de<br> \
                                        tu empresa en el uso de la tecnología y<br> \
                                        lo digital.<br> \
                                        Explica las principales tendencias en su<br> \
                                        industria.<br> \
                                        Determina las posibilidades de<br> \
                                        intervención.",
            email : "hola@noumanity.com",
            cellphone : "+55 999 123 4567",
            copyright : "Noumanity 2022.Todos los derechos reservados",
            light_mode_color : "orange",         
            dark_mode_color : "stone",
        };
         
    $.get("assets/templates/noumanity.html")
        .done((template) => {
            html = Mustache.render(template, data);
            document.body.innerHTML = html; // output the content of the html file
        });    
          
    
        