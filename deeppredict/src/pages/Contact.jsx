import React from "react";

export default function Contact() {
  return (
    <section className="contact-section">
      <h2 className="contact-title">Contact Us</h2>
      <p className="contact-sub">
        Have questions about DeepPredict, research, models or collaborations?
        Reach out anytime.
      </p>

      <div className="contact-container">
        
        {/* LEFT CARD: Contact Info */}
        <div className="contact-card">
          <h3>📬 Contact Information</h3>

          <div className="contact-item">
            <strong>Email:</strong>
            <a href="mailto:1rn22cs136.sachins@gmail.com">
              1rn22cs136.sachins@gmail.com
            </a>
            <a href="mailto:1rn22cs171.umeshhs@gmail.com">
              1rn22cs171.umeshhs@gmail.com,
            </a>
            <a href="mailto:1rn22cs133.rohithc@gmail.com">
              1rn22cs133.rohithc@gmail.com,
            </a>
            <a href="mailto:1rn22cs140.samarthmastip@gmail.com">
              1rn22cs140.samarthmastip@gmail.com
            </a>
          </div>

          <div className="contact-item">
            <strong>Phone:</strong>
            <a href="tel:+918123714249">+91 81237 14249</a>
          </div>

          <div className="contact-item">
            <strong>Location:</strong>  
            RNS Institute of Technology, Bengaluru, India
          </div>
        </div>

        {/* RIGHT CARD: Google Map Embed */}
        <div className="map-card">
          <iframe
            title="RNSIT Bengaluru"
            className="map-frame"
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.3653936981957!2d77.49870107454607!3d12.94800368736014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3bb22b07e4a3%3A0xd55dd39cb34a826!2sRNS%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
