import { Clock } from "lucide-react";
import { SALON_SERVICES, type SalonService } from "@/config/chat";

interface ServiceCardsProps {
  onSelect: (service: SalonService) => void;
  disabled?: boolean;
}

export function ServiceCards({ onSelect, disabled }: ServiceCardsProps) {
  return (
    <section aria-label="Salon services and prices" className="mb-3">
      <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1.5 sm:grid sm:grid-cols-3 sm:overflow-visible">
        {SALON_SERVICES.map((service) => (
          <button
            key={service.id}
            type="button"
            disabled={disabled ?? false}
            onClick={() => onSelect(service)}
            aria-label={`Book ${service.name}, ${service.price}, ${service.duration}`}
            className="glass-panel group min-w-[11rem] flex-1 rounded-2xl p-3 text-left transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 sm:min-w-0"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate font-display text-sm font-semibold tracking-tight">
                {service.name}
              </span>
              <span className="text-gradient-brand shrink-0 text-sm font-semibold">
                {service.price}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {service.description}
            </p>
            <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="size-3" aria-hidden="true" />
              {service.duration}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
