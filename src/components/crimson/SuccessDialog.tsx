import type { Order } from "@/lib/crimson-store";
import { PixelButton } from "./ui/PixelButton";

interface Props {
  order: Order;
  onClose: () => void;
  onPlaceAnother: () => void;
}

export function SuccessDialog({ order, onClose, onPlaceAnother }: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="acq-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-obsidian/85"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-charcoal border-[3px] border-gold shadow-[8px_8px_0_0_var(--crimson)] p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center flex flex-col gap-4">
          <div className="font-pixel text-[10px] text-gold uppercase tracking-widest">
            ◆ Acquisition Confirmed ◆
          </div>
          <h3 id="acq-title" className="font-pixel text-xl md:text-2xl text-bone">
            The Block is <span className="text-crimson">Yours.</span>
          </h3>
          <div className="bg-obsidian border-[3px] border-bone p-4 my-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-bone/60">
              Order Identifier
            </div>
            <div className="font-pixel text-lg md:text-2xl text-gold mt-2 break-all">
              {order.id}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-left font-mono text-[11px]">
            <div>
              <div className="text-bone/50 uppercase text-[10px]">Recipient</div>
              <div className="text-bone">{order.name}</div>
            </div>
            <div>
              <div className="text-bone/50 uppercase text-[10px]">Method</div>
              <div className="text-bone uppercase">{order.method}</div>
            </div>
            <div className="col-span-2">
              <div className="text-bone/50 uppercase text-[10px]">Address</div>
              <div className="text-bone">{order.address}</div>
            </div>
            <div className="col-span-2 border-t-[3px] border-bone/20 pt-2 flex justify-between">
              <span className="text-bone/50 uppercase text-[10px]">Total Paid</span>
              <span className="font-pixel text-crimson-glow">৳{order.total.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            <PixelButton size="sm" onClick={() => window.print()}>
              ▮ Print Receipt
            </PixelButton>
            <PixelButton size="sm" variant="gold" onClick={onPlaceAnother}>
              ↻ Place Another
            </PixelButton>
            <PixelButton size="sm" variant="ghost" onClick={onClose}>
              Close
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
}
