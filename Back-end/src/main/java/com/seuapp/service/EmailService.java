package com.seuapp.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCodigoRecuperacao(String destinatario, String codigo) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            // ✅ OBRIGATÓRIO no SendGrid
            helper.setFrom("federadosapp@gmail.com"); // <- TEM QUE SER VERIFICADO NO SENDGRID
            helper.setTo(destinatario);
            helper.setSubject("Federados - Código de recuperação de senha");

            helper.setText(montarHtml(codigo), true);

            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            throw new RuntimeException("Erro ao enviar email de recuperação", e);
        }
    }

    private String montarHtml(String codigo) {
        return """
                <!DOCTYPE html>
                <html lang="pt-br">
                <body style="font-family: Arial;">
                    <h2>Recuperação de senha</h2>
                    <p>Seu código é:</p>

                    <h1 style="color:#3f5f9c">%s</h1>

                    <p>Se não foi você, ignore este email.</p>
                </body>
                </html>
                """.formatted(codigo);
    }
}