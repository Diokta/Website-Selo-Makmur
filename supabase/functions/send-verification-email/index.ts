import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, name, token, verificationUrl, type = "verify" } = await req.json();

    if (!email || !token || !verificationUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const smtpHost     = Deno.env.get("SMTP_HOST")      ?? "smtp.hostinger.com";
    const smtpPort     = parseInt(Deno.env.get("SMTP_PORT") ?? "465");
    const smtpUser     = Deno.env.get("SMTP_USER")      ?? "";
    const smtpPass     = Deno.env.get("SMTP_PASS")      ?? "";
    const smtpFrom     = Deno.env.get("SMTP_FROM")      ?? smtpUser;
    const smtpFromName = Deno.env.get("SMTP_FROM_NAME") ?? "Gapoktan Selo Makmur";

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: true,
        auth: { username: smtpUser, password: smtpPass },
      },
    });

    const isReset = type === "reset";
    const emailSubject = isReset
      ? "🔑 Reset Password Anda — Gapoktan Selo Makmur"
      : "✅ Verifikasi Email Anda — Gapoktan Selo Makmur";

    const titleText = isReset
      ? "Reset Password"
      : "Verifikasi Email";

    const bodyParagraph = isReset
      ? "Kami menerima permintaan untuk menyetel ulang password akun Anda di platform digital Gapoktan Selo Makmur.<br>Klik tombol di bawah untuk menyetel ulang password Anda."
      : "Terima kasih telah mendaftar di platform digital Gapoktan Selo Makmur.<br>Klik tombol di bawah untuk mengaktifkan akun Anda.";

    const buttonText = isReset
      ? "🔑 Reset Password Saya"
      : "✅ Verifikasi Email Saya";

    const ignoreText = isReset
      ? "Jika Anda tidak meminta penyetelan ulang password, abaikan email ini."
      : "Jika Anda tidak merasa mendaftar, abaikan email ini.";

    const displayName = name || "Pengguna";
    const htmlBody = `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><title>${titleText} - Gapoktan Selo Makmur</title></head>
<body style="margin:0;padding:0;background:#f4f7f0;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#2d5016,#4a7c2a);padding:40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🌱</div>
      <h1 style="color:#fff;margin:0;font-size:24px;">Gapoktan Selo Makmur</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Selomartani, Kalasan, Sleman, DIY</p>
    </div>
    <div style="padding:40px 32px;">
      <h2 style="color:#2d5016;font-size:22px;margin:0 0 12px;">Halo, ${displayName}! 👋</h2>
      <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">
        ${bodyParagraph}
      </p>
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${verificationUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#2d5016,#7ca64c);color:#fff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:16px;font-weight:700;">
          ${buttonText}
        </a>
      </div>
      <div style="background:#fff8e7;border:1px solid #f0d080;border-radius:10px;padding:16px;margin-bottom:24px;">
        <p style="color:#8a6400;font-size:13px;margin:0;">
          ⏰ <strong>Link berlaku selama 24 jam.</strong><br>
          Jika tombol tidak bisa diklik, salin URL ini:<br>
          <span style="word-break:break-all;color:#2d5016;font-size:12px;">${verificationUrl}</span>
        </p>
      </div>
      <p style="color:#aaa;font-size:13px;">${ignoreText}</p>
    </div>
    <div style="background:#f9fafb;border-top:1px solid #e8f0dc;padding:20px 32px;text-align:center;">
      <p style="color:#bbb;font-size:12px;margin:0;">© 2026 Gapoktan Selo Makmur · Email otomatis, jangan dibalas.</p>
    </div>
  </div>
</body>
</html>`;

    await client.send({
      from: `${smtpFromName} <${smtpFrom}>`,
      to: email,
      subject: emailSubject,
      html: htmlBody,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("SMTP Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Gagal mengirim email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
