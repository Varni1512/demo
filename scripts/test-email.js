import nodemailer from "nodemailer";

const ADMIN_EMAIL = "swadeshvaaniofficial@gmail.com";
const ADMIN_PASS = "uvarxuzqysenzqif"; // trimmed app password

const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: { user: ADMIN_EMAIL, pass: ADMIN_PASS },
});

async function test() {
  try {
    console.log("Attempting to send test email to swadeshvaaniofficial@gmail.com...");
    const info = await mailer.sendMail({
      from: `"स्वदेश वाणी विज्ञापन" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: "📢 [टेस्ट विज्ञापन अनुरोध] स्वदेश वाणी विज्ञापन प्रणाली परीक्षण",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ea580c; border-radius: 8px;">
          <h2 style="color: #ea580c;">स्वदेश वाणी - ईमेल परीक्षण सफल!</h2>
          <p>यह एक परीक्षण ईमेल है। विज्ञापन अनुरोध प्रणाली सक्रिय है।</p>
          <p><strong>दिनांक:</strong> ${new Date().toLocaleString("en-IN")}</p>
        </div>
      `,
    });
    console.log("✅ Email sent successfully! Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
}

test();
