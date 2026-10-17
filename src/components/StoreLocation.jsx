import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import { STORE_INFO } from "../data/store";
import Button from "./Button";

export default function StoreLocation({ showImage = true, image, compact = false }) {
  if (compact) {
    return (
      <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:gap-12">
        <div>
          <h3 className="font-display text-2xl text-cream sm:text-3xl">Visit {STORE_INFO.name}</h3>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/80">
            {STORE_INFO.addressLine1}
            <br />
            {STORE_INFO.addressLine2}
            <br />
            {STORE_INFO.addressLine3}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={STORE_INFO.mapsHref} target="_blank" variant="primary" icon={MapPin} iconPosition="left">
              Get Directions
            </Button>
            <Button href={STORE_INFO.whatsappHref} target="_blank" variant="outline" icon={MessageCircle} iconPosition="left">
              WhatsApp Us
            </Button>
            <Button href={STORE_INFO.phoneHref} variant="dark" icon={Phone} iconPosition="left">
              Call Us
            </Button>
          </div>
        </div>

        <div className={`grid gap-3 ${image ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
          {image && (
            <div className="aspect-[4/3] overflow-hidden border border-cream/10">
              <img src={image} alt={`${STORE_INFO.name} boutique`} loading="lazy" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="aspect-[4/3] overflow-hidden border border-cream/10">
            <iframe
              title={`${STORE_INFO.name} location map`}
              src={STORE_INFO.mapsEmbedSrc}
              className="h-full w-full grayscale-[40%] contrast-125"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-6">
        {showImage && image && (
          <div className="aspect-[4/3] overflow-hidden">
            <img src={image} alt={`${STORE_INFO.name} boutique`} loading="lazy" className="h-full w-full object-cover" />
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex gap-3">
            <MapPin className="mt-1 shrink-0 text-gold" size={20} />
            <div>
              <h3 className="text-xs uppercase tracking-wide2 text-gold">Our Location</h3>
              <p className="mt-1 text-sm text-cream/80">
                {STORE_INFO.addressLine1}
                <br />
                {STORE_INFO.addressLine2}
                <br />
                {STORE_INFO.addressLine3}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="mt-1 shrink-0 text-gold" size={20} />
            <div>
              <h3 className="text-xs uppercase tracking-wide2 text-gold">Opening Hours</h3>
              <ul className="mt-1 space-y-0.5 text-sm text-cream/80">
                {STORE_INFO.hours.map((h) => (
                  <li key={h.day}>
                    {h.day}: {h.time}
                  </li>
                ))}
              </ul>
              <p className="mt-1 text-[11px] italic text-cream/40">{STORE_INFO.hoursNote}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button href={STORE_INFO.mapsHref} target="_blank" variant="primary" icon={MapPin} iconPosition="left">
            Get Directions
          </Button>
          <Button href={STORE_INFO.whatsappHref} target="_blank" variant="outline" icon={MessageCircle} iconPosition="left">
            WhatsApp Us
          </Button>
          <Button href={STORE_INFO.phoneHref} variant="dark" icon={Phone} iconPosition="left">
            Call Us
          </Button>
        </div>
      </div>

      <div className="min-h-[320px] overflow-hidden border border-cream/10 lg:min-h-full">
        <iframe
          title={`${STORE_INFO.name} location map`}
          src={STORE_INFO.mapsEmbedSrc}
          className="h-full min-h-[320px] w-full grayscale-[40%] contrast-125 lg:min-h-full"
          style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
