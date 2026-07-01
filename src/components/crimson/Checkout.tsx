import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCrimson, type Order, type PaymentMethod } from "@/lib/crimson-store";
import { PixelButton } from "./ui/PixelButton";
import { PixelCard } from "./ui/PixelCard";
import { PixelInput, PixelTextarea } from "./ui/PixelInput";
import { PixelRadio, type PixelRadioOption } from "./ui/PixelRadio";
import { SuccessDialog } from "./SuccessDialog";
import { launchPixelConfetti } from "./PixelConfetti";

const UNIT_PRICE = 9999;

// 8-bit adaptation of the bKash bird emblem — pure pixel rects, magenta/pink palette.
function BkashBird() {
  const M = "#e2136e"; // signature magenta
  const P = "#ff4d94"; // highlight pink
  const D = "#8a0a3f"; // shadow
  // 10x10 grid of 3px cells → 30x30 icon
  const map: (string | null)[][] = [
    [null, null, M, M, null, null, null, null, null, null],
    [null, M, P, M, M, null, null, null, null, null],
    [M, P, P, M, M, M, null, null, M, null],
    [M, P, P, P, M, M, M, M, M, null],
    [D, M, P, P, P, M, M, M, null, null],
    [null, D, M, P, P, M, M, null, null, null],
    [null, null, D, M, M, M, null, null, null, null],
    [null, null, D, M, M, null, null, null, null, null],
    [null, null, null, D, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ];
  return (
    <svg viewBox="0 0 30 30" width="30" height="30" shapeRendering="crispEdges" aria-hidden>
      {map.flatMap((row, y) =>
        row.map((c, x) =>
          c ? <rect key={`${x}-${y}`} x={x * 3} y={y * 3} width="3" height="3" fill={c} /> : null,
        ),
      )}
    </svg>
  );
}

const PAYMENTS: PixelRadioOption<PaymentMethod>[] = [
  {
    value: "bkash",
    label: "bKash",
    sublabel: "Mobile financial services · instant",
    accent: "#e2136e",
    icon: (
      <span className="inline-flex items-center justify-center bg-bone p-1 border-[3px] border-obsidian">
        <BkashBird />
      </span>
    ),
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    sublabel: "Pay when the block lands at your door",
    icon: (
      <span className="font-pixel text-[10px] text-obsidian bg-bone px-2 py-1 border-[3px] border-obsidian">
        COD
      </span>
    ),
  },
  {
    value: "card",
    label: "Credit / Debit Card",
    sublabel: "Visa · Mastercard · Amex",
    icon: (
      <span className="font-pixel text-[10px] text-bone bg-crimson px-2 py-1 border-[3px] border-obsidian">
        ◈
      </span>
    ),
  },
];

function randomId() {
  const alpha = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = () =>
    Array.from({ length: 4 }, () => alpha[Math.floor(Math.random() * alpha.length)]).join("");
  return `CB-${seg()}-${seg()}`;
}

export function Checkout() {
  const { discount, addOrder, clearDiscount } = useCrimson();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("bkash");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [trxId, setTrxId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<Order | null>(null);

  const totals = useMemo(() => {
    const discountAmt = discount ? Math.round((UNIT_PRICE * discount.percent) / 100) : 0;
    const grandTotal = UNIT_PRICE - discountAmt;
    return { discountAmt, grandTotal };
  }, [discount]);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Recipient name required.";
    else if (name.length > 80) e.name = "Name too long.";
    if (!address.trim()) e.address = "Delivery address required.";
    else if (address.length > 240) e.address = "Address too long.";
    if (!phone.trim()) e.phone = "Phone number required.";
    else if (!/^[0-9+\-\s()]{7,20}$/.test(phone.trim())) e.phone = "Enter a valid phone number.";
    if (method === "card") {
      if (!/^[0-9\s]{12,19}$/.test(cardNumber.trim())) e.cardNumber = "Card number invalid.";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.trim())) e.expiry = "Format MM/YY.";
      if (!/^\d{3,4}$/.test(cvc.trim())) e.cvc = "3–4 digits.";
    }
    if (method === "bkash") {
      if (!trxId.trim()) e.trxId = "bKash Transaction ID required.";
      else if (!/^[A-Za-z0-9]{6,20}$/.test(trxId.trim())) e.trxId = "6–20 letters/digits, no spaces.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please review the highlighted fields.");
      return;
    }
    const o: Order = {
      id: randomId(),
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
      method,
      code: discount?.code ?? null,
      percent: discount?.percent ?? 0,
      total: totals.grandTotal,
      trxId: method === "bkash" ? trxId.trim().toUpperCase() : null,
      ts: Date.now(),
    };
    addOrder(o);
    setOrder(o);
    launchPixelConfetti();
    toast.success(`Acquisition confirmed · ${o.id}`);
  }

  function placeAnother() {
    setOrder(null);
    setName("");
    setAddress("");
    setPhone("");
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setTrxId("");
    setMethod("bkash");
    clearDiscount();
    setErrors({});
    document.getElementById("acquire")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="acquire" className="relative bg-obsidian py-16 md:py-24 border-t-[3px] border-bone/20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="font-mono text-[11px] uppercase tracking-widest text-gold">
            § 04 — Acquire
          </div>
          <h2 className="font-pixel text-bone text-xl md:text-3xl mt-2">
            One Form. Zero Friction.
          </h2>
          <p className="font-mono text-bone/60 text-sm mt-3 max-w-lg mx-auto">
            No accounts. No newsletters. Just the block, on its way to you.
          </p>
        </div>

        <PixelCard tone="bone" className="p-6 md:p-10">
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-10">
            {/* Left column: details + payment */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="font-pixel text-[10px] text-gold uppercase tracking-widest mb-4">
                  ◆ Delivery Details
                </div>
                <div className="flex flex-col gap-5">
                  <PixelInput
                    label="Recipient Name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    maxLength={80}
                    autoComplete="name"
                  />
                  <PixelTextarea
                    label="Delivery Address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    error={errors.address}
                    maxLength={240}
                    placeholder="Building, street, city, postcode"
                  />
                  <PixelInput
                    label="Phone Number"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={errors.phone}
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={20}
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>

              <div>
                <div className="font-pixel text-[10px] text-gold uppercase tracking-widest mb-4">
                  ◆ Payment Method
                </div>
                <PixelRadio<PaymentMethod>
                  name="payment"
                  value={method}
                  onChange={setMethod}
                  options={PAYMENTS}
                />
                {method === "card" && (
                  <div className="mt-4 bg-obsidian border-[3px] border-bone/40 p-4 flex flex-col gap-4">
                    <PixelInput
                      label="Card Number"
                      name="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      error={errors.cardNumber}
                      inputMode="numeric"
                      maxLength={19}
                      placeholder="4242 4242 4242 4242"
                      autoComplete="cc-number"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <PixelInput
                        label="Expiry"
                        name="expiry"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        error={errors.expiry}
                        placeholder="MM/YY"
                        maxLength={5}
                        autoComplete="cc-exp"
                      />
                      <PixelInput
                        label="CVC"
                        name="cvc"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        error={errors.cvc}
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="123"
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column: summary */}
            <div className="flex flex-col gap-6">
              <div className="bg-obsidian border-[3px] border-gold p-5 md:p-6 flex flex-col gap-4">
                <div className="font-pixel text-[10px] text-gold uppercase tracking-widest">
                  ◆ Order Summary
                </div>
                <div className="flex items-center gap-4 border-b-[3px] border-bone/20 pb-4">
                  <div className="w-14 h-14 bg-crimson border-[3px] border-bone shrink-0 relative">
                    <div className="absolute inset-1 border border-crimson-glow" />
                  </div>
                  <div className="flex-1">
                    <div className="font-pixel text-[11px] text-bone">The Crimson Block</div>
                    <div className="font-mono text-[11px] text-bone/60 mt-1">
                      1 × Ultra-Exclusive Edition
                    </div>
                  </div>
                  <div className="font-pixel text-[12px] text-bone">৳{UNIT_PRICE.toLocaleString()}</div>
                </div>

                <div className="flex flex-col gap-2 font-mono text-[12px]">
                  <div className="flex justify-between text-bone/70">
                    <span>Subtotal</span>
                    <span>৳{UNIT_PRICE.toLocaleString()}</span>
                  </div>
                  {discount ? (
                    <div className="flex justify-between text-gold">
                      <span>{discount.code} · −{discount.percent}%</span>
                      <span>−৳{totals.discountAmt.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-bone/40">
                      <span>Discount</span>
                      <span>Play the arcade above</span>
                    </div>
                  )}
                  <div className="flex justify-between text-bone/70">
                    <span>Shipping</span>
                    <span>Free · hand-delivered</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline border-t-[3px] border-bone/20 pt-4">
                  <span className="font-pixel text-[11px] text-bone uppercase">Total</span>
                  <span className="font-pixel text-2xl text-crimson-glow text-glow-crimson">
                    ৳{totals.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <PixelButton type="submit" size="lg" className="w-full">
                ◆ Confirm Acquisition
              </PixelButton>

              <p className="font-mono text-[10px] text-bone/40 text-center leading-relaxed">
                By confirming, you acknowledge that a brick is being delivered.
                No refunds on foundations.
              </p>
            </div>
          </form>
        </PixelCard>
      </div>

      {order && (
        <SuccessDialog
          order={order}
          onClose={() => setOrder(null)}
          onPlaceAnother={placeAnother}
        />
      )}
    </section>
  );
}
