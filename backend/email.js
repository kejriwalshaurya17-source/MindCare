const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOTP(email, otp) {
  console.log("Attempting to send OTP email to:", email);

  try {
    const { data, error } = await resend.emails.send({
      from: "MindCare AI <onboarding@resend.dev>",
      to: [email],
      subject: "MindCare AI - Email Verification OTP",
      text: `Your MindCare AI verification OTP is ${otp}. This OTP is valid for 10 minutes.`,
      html: `<p>Your MindCare AI verification OTP is <strong>${otp}</strong>.</p><p>This OTP is valid for 10 minutes.</p>`,
    });

    if (error) {
      console.error("OTP EMAIL ERROR:", error);
      throw new Error(error.message || "Failed to send OTP email.");
    }

    console.log("OTP email sent successfully:", data?.id);
    return data;
  } catch (error) {
    console.error("OTP EMAIL ERROR:", error);
    throw error;
  }
}

module.exports = sendOTP;
