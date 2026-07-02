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

            helper.setTo(destinatario);
            helper.setSubject("Federados - Código de recuperação de senha");
            helper.setText(montarHtml(codigo), true); // true = conteúdo é HTML

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            // Se o envio falhar, isso vira uma exceção não checada,
            // que o Spring transforma automaticamente em erro 500 pro front-end.
            throw new RuntimeException("Erro ao enviar email de recuperação", e);
        }
    }

    private String montarHtml(String codigo) {
        return """
                <!DOCTYPE html>
                <html lang="pt-br">
                <body style="margin:0; padding:0; background-color:#3f5f9c; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
                        <tr>
                            <td align="center">
                                <table width="400" cellpadding="0" cellspacing="0"
                                       style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
                                    <tr>
                                        <td style="background-color:#3f5f9c; padding:20px; text-align:right;">
                                            <span style="color:#ffffff; font-size:24px; font-weight:bold;">Federados</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:30px;">
                                            <h2 style="color:#333333; margin-top:0;">Recuperação de senha</h2>
                                            <p style="color:#555555; font-size:15px; line-height:1.5;">
                                                Use o código abaixo para continuar a recuperação da sua senha.
                                                Ele é válido por <strong>5 minutos</strong>.
                                            </p>
                                            <div style="text-align:center; margin:30px 0;">
                                                <span style="display:inline-block; font-size:32px; letter-spacing:8px;
                                                             font-weight:bold; color:#3f5f9c; background-color:#f0f3fa;
                                                             padding:15px 25px; border-radius:6px;">
                                                    %s
                                                </span>
                                            </div>
                                            <p style="color:#999999; font-size:12px; line-height:1.5;">
                                                Se você não pediu essa recuperação, pode ignorar este email com segurança.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(codigo);
    }
}
