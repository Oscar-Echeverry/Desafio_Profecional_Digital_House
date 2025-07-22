package com.Oscar.Proyecto_Final.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.time.LocalDate;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void enviarCorreoConfirmacion(String destino, String nombre, String token) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            String link = "https://unrivaled-pegasus-e3b9bf.netlify.app/confirmar?token=" + token;

            String contenido = """
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Confirmación de Registro - TripNest</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); padding: 40px;">
            <tr>
              <td align="center" style="padding-bottom: 30px;">
                <h1 style="color: #2c3e50; font-size: 26px; margin: 0;">¡Bienvenido a TripNest, %s!</h1>
              </td>
            </tr>
            <tr>
              <td style="color: #555555; font-size: 16px; line-height: 1.6;">
                <p>Gracias por registrarte en <strong>TripNest</strong>. Para comenzar a explorar y planificar tus aventuras, por favor confirma tu cuenta haciendo clic en el botón de abajo:</p>
                <p style="text-align: center; margin: 40px 0;">
                  <a href="%s"
                     style="background-color: #1abc9c; color: #ffffff; padding: 14px 30px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
                    Confirmar cuenta
                  </a>
                </p>
                <p>Si tú no realizaste este registro, puedes ignorar este mensaje de forma segura.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top: 40px; color: #999999; font-size: 12px;">
                © 2025 TripNest. Todos los derechos reservados.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
""".formatted(nombre, link);

            helper.setTo(destino);
            helper.setSubject("Confirma tu registro");
            helper.setText(contenido, true);
            mailSender.send(mensaje);

        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo", e);
        }
    }

    public void enviarResetPassword(String destino, String token) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            String link = "https://unrivaled-pegasus-e3b9bf.netlify.app/api/auth/resetear?token=" + token;

            String contenido = """
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Recuperación de Contraseña - TripNest</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); padding: 40px;">
            <tr>
              <td align="center" style="padding-bottom: 30px;">
                <h2 style="color: #2c3e50; font-size: 24px; margin: 0;">Solicitud de recuperación de contraseña</h2>
              </td>
            </tr>
            <tr>
              <td style="color: #555555; font-size: 16px; line-height: 1.6;">
                <p>Hemos recibido una solicitud para restablecer la contraseña asociada a tu cuenta de <strong>TripNest</strong>.</p>
                <p style="text-align: center; margin: 40px 0;">
                  <a href="%s"
                     style="background-color: #2196F3; color: #ffffff; padding: 14px 30px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
                    Restablecer contraseña
                  </a>
                </p>
                <p>Este enlace expirará en <strong>15 minutos</strong> por motivos de seguridad.</p>
                <p>Si no realizaste esta solicitud, puedes ignorar este mensaje sin problemas.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top: 40px; color: #999999; font-size: 12px;">
                © 2025 TripNest. Todos los derechos reservados.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
""".formatted(link);

            helper.setTo(destino);
            helper.setSubject("Restablecer contraseña");
            helper.setText(contenido, true);
            mailSender.send(mensaje);

        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo de recuperación", e);
        }
    }

    // Ejemplo método para bloqueo/desbloqueo
    public void enviarNotificacionBloqueo(String destino, boolean activo) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            String asunto = activo ? "Cuenta desbloqueada - TripNest" : "Cuenta bloqueada - TripNest";
            String estado = activo ? "desbloqueada" : "bloqueada";
            String color = activo ? "#28a745" : "#dc3545";

            String contenido = """
<!DOCTYPE html>
<html lang="es">
  <head><meta charset="UTF-8" /><title>%s</title></head>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.05);padding:40px;">
          <tr><td align="center" style="padding-bottom:30px;">
            <h1 style="color:%s;font-size:26px;margin:0;">Tu cuenta ha sido %s</h1>
          </td></tr>
          <tr><td style="color:#555;font-size:16px;line-height:1.6;">
            <p>Hola,</p>
            <p>Queremos informarte que tu cuenta en <strong>TripNest</strong> ha sido <strong>%s</strong>. %s</p>
            <p>Si tienes alguna duda, no dudes en contactarnos.</p>
          </td></tr>
          <tr><td align="center" style="padding-top:40px;color:#999;font-size:12px;">
            © 2025 TripNest. Todos los derechos reservados.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>
""".formatted(asunto, color, estado, estado,
                    activo ? "Ya puedes iniciar sesión normalmente." : "Por favor contacta con soporte si crees que es un error.");

            helper.setTo(destino);
            helper.setSubject(asunto);
            helper.setText(contenido, true);
            mailSender.send(mensaje);

        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo de notificación de bloqueo", e);
        }
    }

    // Ejemplo método para cambio de rol
    public void enviarNotificacionCambioRol(String destino, boolean esAdmin) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            String asunto = esAdmin ? "Felicidades, eres ADMIN - TripNest" : "Cambio de rol - TripNest";
            String mensajePrincipal = esAdmin
                    ? "Has sido promovido a <strong>ADMIN</strong> en TripNest."
                    : "Tu rol ha sido cambiado a <strong>USUARIO</strong>.";

            String color = esAdmin ? "#1abc9c" : "#007bff";

            String contenido = """
<!DOCTYPE html>
<html lang="es">
  <head><meta charset="UTF-8" /><title>%s</title></head>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.05);padding:40px;">
          <tr><td align="center" style="padding-bottom:30px;">
            <h1 style="color:%s;font-size:26px;margin:0;">Cambio de rol en TripNest</h1>
          </td></tr>
          <tr><td style="color:#555;font-size:16px;line-height:1.6;">
            <p>Hola,</p>
            <p>%s</p>
            <p>Accede a la plataforma para aprovechar tus nuevos permisos.</p>
          </td></tr>
          <tr><td align="center" style="padding-top:40px;color:#999;font-size:12px;">
            © 2025 TripNest. Todos los derechos reservados.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>
""".formatted(asunto, color, mensajePrincipal);

            helper.setTo(destino);
            helper.setSubject(asunto);
            helper.setText(contenido, true);
            mailSender.send(mensaje);

        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo de notificación de cambio de rol", e);
        }
    }

    // Ejemplo método para eliminación de cuenta
    public void enviarNotificacionEliminacion(String destino) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            String asunto = "Cuenta eliminada - TripNest";

            String contenido = """
<!DOCTYPE html>
<html lang="es">
  <head><meta charset="UTF-8" /><title>Cuenta eliminada</title></head>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.05);padding:40px;">
          <tr><td align="center" style="padding-bottom:30px;">
            <h1 style="color:#dc3545;font-size:26px;margin:0;">Cuenta eliminada</h1>
          </td></tr>
          <tr><td style="color:#555;font-size:16px;line-height:1.6;">
            <p>Hola,</p>
            <p>Tu cuenta ha sido eliminada de TripNest. Si crees que esto fue un error, por favor contacta con soporte.</p>
          </td></tr>
          <tr><td align="center" style="padding-top:40px;color:#999;font-size:12px;">
            © 2025 TripNest. Todos los derechos reservados.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>
""";

            helper.setTo(destino);
            helper.setSubject(asunto);
            helper.setText(contenido, true);
            mailSender.send(mensaje);

        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo de notificación de eliminación", e);
        }
    }
    public void enviarConfirmacionReserva(String destino, String nombreUsuario, String nombreProducto,
                                          LocalDate fechaInicio, LocalDate fechaFin) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            String contenido = """
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Confirmación de Reserva - TripNest</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.05);padding:40px;">
          <tr><td align="center" style="padding-bottom:30px;">
            <h1 style="color:#2c3e50;font-size:24px;margin:0;">Reserva confirmada</h1>
          </td></tr>
          <tr><td style="color:#555555;font-size:16px;line-height:1.6;">
            <p>Hola %s,</p>
            <p>¡Tu reserva en <strong>%s</strong> ha sido confirmada exitosamente!</p>
            <p><strong>Fecha de inicio:</strong> %s<br/>
               <strong>Fecha de fin:</strong> %s</p>
            <p>Gracias por confiar en TripNest. ¡Esperamos que disfrutes tu experiencia!</p>
          </td></tr>
          <tr><td align="center" style="padding-top:40px;color:#999999;font-size:12px;">
            © 2025 TripNest. Todos los derechos reservados.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>
""".formatted(nombreUsuario, nombreProducto, fechaInicio.toString(), fechaFin.toString());

            helper.setTo(destino);
            helper.setSubject("Confirmación de tu reserva - TripNest");
            helper.setText(contenido, true);
            mailSender.send(mensaje);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo de confirmación de reserva", e);
        }
    }
    public void enviarCancelacionReserva(String destino, String nombreUsuario, String nombreProducto,
                                         LocalDate fechaInicio, LocalDate fechaFin) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            String contenido = """
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Cancelación de Reserva - TripNest</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.05);padding:40px;">
          <tr><td align="center" style="padding-bottom:30px;">
            <h1 style="color:#dc3545;font-size:24px;margin:0;">Reserva cancelada</h1>
          </td></tr>
          <tr><td style="color:#555555;font-size:16px;line-height:1.6;">
            <p>Hola %s,</p>
            <p>Queremos confirmarte que tu reserva en <strong>%s</strong> ha sido cancelada.</p>
            <p><strong>Fecha de inicio:</strong> %s<br/>
               <strong>Fecha de fin:</strong> %s</p>
            <p>Si no realizaste esta cancelación o tienes dudas, contáctanos cuanto antes.</p>
          </td></tr>
          <tr><td align="center" style="padding-top:40px;color:#999999;font-size:12px;">
            © 2025 TripNest. Todos los derechos reservados.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>
""".formatted(nombreUsuario, nombreProducto, fechaInicio.toString(), fechaFin.toString());

            helper.setTo(destino);
            helper.setSubject("Tu reserva ha sido cancelada - TripNest");
            helper.setText(contenido, true);
            mailSender.send(mensaje);

        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo de cancelación de reserva", e);
        }
    }

}
