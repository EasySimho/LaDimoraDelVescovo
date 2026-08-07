import { Mail, MessageCircle, Phone } from "lucide-react";

import { getDict, type Lang } from "@/lib/i18n";

export function ContactList({
  lang,
  phone,
  whatsapp,
  email,
}: {
  lang: Lang;
  phone?: string;
  whatsapp?: string;
  email?: string;
}) {
  const dict = getDict(lang);

  const rows = [
    phone && { icon: Phone, label: dict.contatti.phone, value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    whatsapp && {
      icon: MessageCircle,
      label: dict.contatti.whatsapp,
      value: whatsapp,
      // wa.me vuole il numero senza + né spazi.
      href: `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`,
    },
    email && { icon: Mail, label: dict.contatti.email, value: email, href: `mailto:${email}` },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href: string }[];

  if (rows.length === 0) {
    return <p className="card p-4 text-sm text-fumo">{dict.common.empty}</p>;
  }

  return (
    <div className="space-y-4">
      <ul className="card divide-y divide-bordo">
        {rows.map(({ icon: Icon, label, value, href }) => (
          <li key={label}>
            <a
              href={href}
              className="flex items-center gap-3.5 p-4 transition-colors active:bg-panna-3"
              {...(href.startsWith("https") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rosso-tenue text-rosso">
                <Icon size={17} strokeWidth={1.75} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.72rem] font-medium uppercase tracking-wider text-fumo">
                  {label}
                </span>
                <span className="block truncate text-[0.98rem] font-medium">{value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="px-1 text-[0.85rem] text-fumo">{dict.contatti.hint}</p>
    </div>
  );
}
