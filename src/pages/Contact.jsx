import { useState } from "react";
import { MapPin, Phone, MessageCircle, Clock, CheckCircle2 } from "lucide-react";
import HeroSection from "../components/HeroSection";
import Breadcrumbs from "../components/Breadcrumbs";
import Button from "../components/Button";
import { STORE_INFO } from "../data/store";
import { SITE_CONFIG } from "../data/siteConfig";

const initialForm = { name: "", contact: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    const contactVal = form.contact.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactVal);
    const isPhone = /^[0-9+\-\s]{7,15}$/.test(contactVal);
    if (!isEmail && !isPhone) next.contact = "Enter a valid phone number or email address.";
    if (form.message.trim().length < 10) next.message = "Message should be at least 10 characters.";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      setSubmitted(true);
      setForm(initialForm);
    }
  };

  return (
    <>
      <title>{`Contact Us | ${SITE_CONFIG.brandName}`}</title>
      <meta
        name="description"
        content={`Get in touch with ${SITE_CONFIG.brandName} in Chhatrapati Sambhajinagar, Maharashtra. Visit our store, call, WhatsApp, or send us a message.`}
      />

      <HeroSection
        image="/images/contact.webp"
        title="CONTACT US"
        subtitle="We'd love to hear from you."
        compactTitle
        largeSubtitle
        bottomLeftShade
        breadcrumb={<Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "Contact" }]} />}
      />

      <section className="py-16 sm:py-24">
        <div className="container-px mx-auto grid max-w-content gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-display text-4xl text-cream sm:text-5xl">Get in Touch</h2>
            <div className="mt-8 space-y-7">
              <div className="flex gap-4">
                <MapPin className="mt-1 shrink-0 text-gold" size={20} />
                <div>
                  <h3 className="text-sm uppercase tracking-wide2 text-gold">Visit Us</h3>
                  <p className="mt-1 text-base text-cream/80 sm:text-lg">
                    {STORE_INFO.addressLine1}
                    <br />
                    {STORE_INFO.addressLine2}
                    <br />
                    {STORE_INFO.addressLine3}
                  </p>
                  <Button href={STORE_INFO.mapsHref} target="_blank" variant="primary" size="sm" icon={MapPin} iconPosition="left" className="mt-3">
                    Get Directions
                  </Button>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="mt-1 shrink-0 text-gold" size={20} />
                <div>
                  <h3 className="text-sm uppercase tracking-wide2 text-gold">Call Us</h3>
                  <p className="mt-1 text-base text-cream/80 sm:text-lg">{STORE_INFO.phone}</p>
                  <Button href={STORE_INFO.phoneHref} variant="dark" size="sm" icon={Phone} iconPosition="left" className="mt-3">
                    Call Us
                  </Button>
                </div>
              </div>
              <div className="flex gap-4">
                <MessageCircle className="mt-1 shrink-0 text-gold" size={20} />
                <div>
                  <h3 className="text-sm uppercase tracking-wide2 text-gold">WhatsApp Us</h3>
                  <p className="mt-1 text-base text-cream/80 sm:text-lg">{STORE_INFO.whatsapp}</p>
                  <Button href={STORE_INFO.whatsappHref} target="_blank" variant="outline" size="sm" icon={MessageCircle} iconPosition="left" className="mt-3">
                    WhatsApp Us
                  </Button>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="mt-1 shrink-0 text-gold" size={20} />
                <div>
                  <h3 className="text-sm uppercase tracking-wide2 text-gold">Opening Hours</h3>
                  {STORE_INFO.hours.map((h) => (
                    <p key={h.day} className="mt-1 text-base text-cream/80 sm:text-lg">
                      {h.day}: {h.time}
                    </p>
                  ))}
                  <p className="mt-2 text-xs text-cream/50">{STORE_INFO.hoursNote}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cream p-5 sm:p-8 lg:p-12">
            <h2 className="mb-8 font-display text-4xl text-ink sm:text-5xl">Send a Message</h2>
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center border border-gold/30 bg-white px-8 py-16 text-center">
                <CheckCircle2 className="text-gold" size={40} />
                <h3 className="mt-4 font-display text-2xl text-ink">Message Sent</h3>
                <p className="mt-2 max-w-xs text-base text-ink/65">
                  Thank you for reaching out. Our team will get back to you shortly.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-8">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm uppercase tracking-wide2 text-ink/70">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className="mt-2 w-full border-b border-ink/25 bg-transparent pb-3 text-lg text-ink focus:border-gold focus:outline-none"
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact" className="block text-sm uppercase tracking-wide2 text-ink/70">
                    Phone / Email
                  </label>
                  <input
                    id="contact"
                    type="text"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    aria-invalid={!!errors.contact}
                    aria-describedby={errors.contact ? "contact-error" : undefined}
                    className="mt-2 w-full border-b border-ink/25 bg-transparent pb-3 text-lg text-ink focus:border-gold focus:outline-none"
                  />
                  {errors.contact && (
                    <p id="contact-error" className="mt-1.5 text-xs text-red-600">
                      {errors.contact}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm uppercase tracking-wide2 text-ink/70">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className="mt-2 w-full resize-none border-b border-ink/25 bg-transparent pb-3 text-lg text-ink focus:border-gold focus:outline-none"
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-xs text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* MAP EMBED */}
        <div className="container-px mx-auto mt-16 max-w-content">
          <div className="overflow-hidden border border-cream/10 bg-espresso">
            <iframe
              title={`${SITE_CONFIG.brandName} location map`}
              src={STORE_INFO.mapsEmbedSrc}
              className="h-64 w-full grayscale-[30%] contrast-125 sm:h-80 md:h-96"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
