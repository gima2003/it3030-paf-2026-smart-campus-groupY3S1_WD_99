import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users,
  Building2,
  Package,
  Wrench,
  Filter,
  Ticket,
  CalendarDays,
  Clock,
  AlertCircle,
  ArrowRight,
  BookOpenCheck,
  ArrowLeft,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { getAllBookings } from "../services/bookingService";

/* ─── API URLs ───────────────────────────────────────────────────── */
const getFacilityUrl = (id) => `http://localhost:8081/api/facilities/${id}`;
const getFacilityImagesUrl = (id) =>
  `http://localhost:8081/api/facilities/${id}/images`;
const getFacilitySchedulesUrl = (id) =>
  `http://localhost:8081/api/facilities/${id}/schedules`;
const getFacilityBookingsUrl = (id) =>
  `http://localhost:8081/api/bookings/resource/${id}`;

/* ─── Constants ──────────────────────────────────────────────────── */
const STATUS_DOT = {
  ACTIVE: "bg-emerald-400",
  UNDER_MAINTENANCE: "bg-amber-400",
  OUT_OF_SERVICE: "bg-red-400",
  INACTIVE: "bg-slate-400",
  ARCHIVED: "bg-violet-400",
};
const STATUS_LABEL = {
  ACTIVE: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25",
  UNDER_MAINTENANCE: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25",
  OUT_OF_SERVICE: "bg-red-500/15 text-red-300 ring-1 ring-red-500/25",
  INACTIVE: "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/25",
  ARCHIVED: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25",
};
const fallbackImage =
  "https://placehold.co/1200x700/001233/FFFFFF?text=No+Image";

/* ─── Helpers ────────────────────────────────────────────────────── */
const formatEnum = (v) =>
  v
    ? v
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())
    : "N/A";

const formatTime = (v) => (v ? String(v).slice(0, 5) : "N/A");

const formatDate = (v) => {
  if (!v) return "N/A";
  try {
    return new Date(v).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return v;
  }
};

/* ─── Image Gallery ──────────────────────────────────────────────── */
function ImageGallery({ images, facilityName }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [images]);

  const go = useCallback(
    (dir) => {
      if (!images.length) return;
      setFading(true);
      setTimeout(() => {
        setIndex((i) =>
          dir === "next"
            ? (i + 1) % images.length
            : (i - 1 + images.length) % images.length
        );
        setFading(false);
      }, 160);
    },
    [images.length]
  );

  const currentSrc = images[index]?.imageUrl || images[index] || fallbackImage;
  const VISIBLE = 4;
  const thumbStart = Math.max(0, Math.min(index, images.length - VISIBLE));

  return (
    <div className="flex flex-col gap-3">
      {/* Main viewer */}
      <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#000D1F] border border-white/8 group">
        <img
          key={index}
          src={currentSrc}
          alt={`${facilityName} – ${index + 1}`}
          className="w-full h-full object-cover"
          style={{
            opacity: fading ? 0 : 1,
            transition: "opacity 0.16s ease",
          }}
        />

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000919]/80 via-[#000919]/10 to-transparent pointer-events-none" />

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs text-white/70 border border-white/10 tabular-nums">
              {index + 1} / {images.length}
            </span>
          </div>
        )}

        {/* Nav arrows */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={() => go("prev")}
              className="pointer-events-auto w-9 h-9 rounded-full bg-black/55 backdrop-blur-md
                border border-white/15 flex items-center justify-center text-white/70
                hover:bg-[#0A6ED3]/80 hover:text-white hover:border-[#0A6ED3]/60
                opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              type="button"
              onClick={() => go("next")}
              className="pointer-events-auto w-9 h-9 rounded-full bg-black/55 backdrop-blur-md
                border border-white/15 flex items-center justify-center text-white/70
                hover:bg-[#0A6ED3]/80 hover:text-white hover:border-[#0A6ED3]/60
                opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-2">
          <div className="flex gap-2 flex-1 overflow-hidden">
            {images
              .slice(thumbStart, thumbStart + VISIBLE)
              .map((img, i) => {
                const realIdx = thumbStart + i;
                return (
                  <button
                    key={realIdx}
                    type="button"
                    onClick={() => setIndex(realIdx)}
                    className={`relative flex-1 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200
                      ${
                        realIdx === index
                          ? "border-[#0A6ED3] shadow-[0_0_0_2px_rgba(10,110,211,0.2)]"
                          : "border-transparent opacity-50 hover:opacity-90 hover:border-white/20"
                      }`}
                  >
                    <img
                      src={img?.imageUrl || img}
                      alt={`thumb ${realIdx + 1}`}
                      className="w-full h-full object-cover bg-[#000D1F]"
                    />
                  </button>
                );
              })}
          </div>
          {images.length > VISIBLE && (
            <button
              type="button"
              onClick={() => go("next")}
              className="w-10 h-16 flex-shrink-0 rounded-xl bg-white/4 border border-white/8
                flex items-center justify-center text-white/35
                hover:bg-white/8 hover:text-[#6CB6FF] hover:border-[#0A6ED3]/30 transition-all"
            >
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div
      className={`flex flex-col gap-2 p-4 rounded-2xl border transition-colors
        ${
          accent
            ? "bg-[#0A6ED3]/8 border-[#0A6ED3]/20 hover:border-[#0A6ED3]/35"
            : "bg-white/3 border-white/6 hover:border-white/12"
        }`}
    >
      <div className="flex items-center gap-2">
        <Icon size={13} className="text-[#6CB6FF]/70 flex-shrink-0" />
        <span className="text-[11px] text-white/35 uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      <p className="text-sm font-semibold text-white/85 leading-snug">{value}</p>
    </div>
  );
}

/* ─── Section Header ─────────────────────────────────────────────── */
function SectionToggle({ icon: Icon, title, badge, open, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-3 py-4 text-left group"
    >
      <div className="h-px flex-none w-0" />
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(10,110,211,0.12)", border: "1px solid rgba(10,110,211,0.2)" }}
        >
          <Icon size={15} className="text-[#6CB6FF]" />
        </div>
        <span className="text-[15px] font-semibold text-white/80 group-hover:text-white transition-colors">
          {title}
        </span>
        {badge !== undefined && badge > 0 && (
          <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#0A6ED3]/15 text-[#6CB6FF]/80 border border-[#0A6ED3]/20">
            {badge}
          </span>
        )}
      </div>
      <div className="flex-shrink-0 text-white/30 group-hover:text-white/60 transition-colors">
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
    </button>
  );
}

/* ─── Equipment Section ──────────────────────────────────────────── */
function EquipmentSection({ equipment }) {
  const [open, setOpen] = useState(true);

  if (!equipment.length) {
    return (
      <div className="border-t border-white/6">
        <SectionToggle
          icon={Wrench}
          title="Equipment"
          badge={0}
          open={open}
          onToggle={() => setOpen((o) => !o)}
        />
        {open && (
          <div className="pb-5 text-sm text-white/30 text-center py-8">
            No equipment linked to this facility.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-t border-white/6">
      <SectionToggle
        icon={Wrench}
        title="Equipment"
        badge={equipment.length}
        open={open}
        onToggle={() => setOpen((o) => !o)}
      />
      {open && (
        <div className="pb-5 space-y-4">
          {/* Thumbnail strip */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {equipment.map((eq) => (
              <div key={eq.id || eq.name} className="flex-shrink-0 w-24 space-y-2">
                <div className="w-24 h-20 rounded-xl overflow-hidden bg-[#000D1F] border border-white/8 flex items-center justify-center">
                  {eq.imageUrl ? (
                    <img
                      src={eq.imageUrl}
                      alt={eq.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package size={18} className="text-white/15" />
                  )}
                </div>
                <p className="text-[11px] text-white/50 truncate text-center leading-tight">
                  {eq.name}
                </p>
              </div>
            ))}
          </div>

          {/* List */}
          <div className="space-y-1.5">
            {equipment.map((eq) => (
              <div
                key={`row-${eq.id || eq.name}`}
                className="flex items-center justify-between gap-3 px-4 py-3
                  rounded-xl bg-white/3 border border-white/6 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#0A6ED3]/10 border border-[#0A6ED3]/15 flex items-center justify-center flex-shrink-0">
                    <Wrench size={12} className="text-[#6CB6FF]/70" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white/80 truncate font-medium">
                      {eq.name}
                    </p>
                    {eq.type && (
                      <p className="text-xs text-white/35">{formatEnum(eq.type)}</p>
                    )}
                  </div>
                </div>
                {eq.status && (
                  <span
                    className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium
                      ${STATUS_LABEL[eq.status] ?? "bg-white/8 text-white/50 ring-1 ring-white/10"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[eq.status] ?? "bg-white/40"}`}
                    />
                    {formatEnum(eq.status)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Schedules Section ──────────────────────────────────────────── */
function SchedulesSection({ schedules }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-white/6">
      <SectionToggle
        icon={CalendarDays}
        title="Schedules"
        badge={schedules.length}
        open={open}
        onToggle={() => setOpen((o) => !o)}
      />
      {open && (
        <div className="pb-5">
          {!schedules.length ? (
            <p className="text-sm text-white/30 text-center py-6">
              No schedule records available.
            </p>
          ) : (
            <div className="space-y-2">
              {schedules.map((slot) => (
                <div
                  key={
                    slot.id ||
                    `${slot.slotDate}-${slot.startTime}-${slot.endTime}`
                  }
                  className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-white/3 border border-white/6"
                >
                  <CalendarDays
                    size={14}
                    className="text-[#6CB6FF]/60 mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/75 mb-2">
                      {formatDate(slot.slotDate)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] bg-[#0A6ED3]/10 text-[#6CB6FF]/80 border border-[#0A6ED3]/15">
                        <Clock size={11} />
                        {formatTime(slot.startTime)} –{" "}
                        {formatTime(slot.endTime)}
                      </span>
                      {slot.availabilityStatus && (
                        <span className="px-2.5 py-1 rounded-lg text-[12px] bg-white/6 text-white/50 border border-white/8">
                          {formatEnum(slot.availabilityStatus)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Bookings Section ───────────────────────────────────────────── */
function BookingsSection({ bookings, onAddBooking }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-t border-white/6">
      <SectionToggle
        icon={BookOpenCheck}
        title="Bookings"
        badge={bookings.length}
        open={open}
        onToggle={() => setOpen((o) => !o)}
      />
      {open && (
        <div className="pb-5 space-y-3">
          {/* Add booking CTA */}
          <button
            type="button"
            onClick={onAddBooking}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
              border border-dashed border-[#0A6ED3]/30 text-[#6CB6FF]/70
              hover:border-[#0A6ED3]/60 hover:text-[#6CB6FF] hover:bg-[#0A6ED3]/5
              transition-all"
          >
            <BookOpenCheck size={15} />
            Add New Booking
          </button>

          {!bookings.length ? (
            <p className="text-sm text-white/30 text-center py-4">
              No bookings found for this facility.
            </p>
          ) : (
            <div className="space-y-2">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="px-4 py-4 rounded-xl bg-white/3 border border-white/6
                    hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-semibold text-white/80">
                        {formatDate(booking.bookingDate || booking.date)}
                      </p>
                      <p className="text-xs text-white/45 flex items-center gap-1.5">
                        <Clock size={11} className="text-[#6CB6FF]/50" />
                        {formatTime(booking.startTime)} –{" "}
                        {formatTime(booking.endTime)}
                      </p>
                      {booking.purpose && (
                        <p className="text-xs text-white/35 mt-1.5 leading-relaxed">
                          {booking.purpose}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap flex-shrink-0">
                      {booking.status && (
                        <span
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium
                            ${STATUS_LABEL[booking.status] ?? "bg-white/8 text-white/50 ring-1 ring-white/10"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[booking.status] ?? "bg-white/40"}`}
                          />
                          {formatEnum(booking.status)}
                        </span>
                      )}
                      {booking.attendees != null && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] bg-[#0A6ED3]/10 text-[#6CB6FF]/80 border border-[#0A6ED3]/15">
                          {booking.attendees} attendees
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Raise Ticket Drawer ────────────────────────────────────────── */
function RaiseTicketDrawer({ facility, onClose, onRaiseTicket }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      if (onRaiseTicket) await onRaiseTicket({ facility, title, description: desc });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to raise ticket:", err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center px-6">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mb-4">
          <CheckCircle2 size={26} className="text-emerald-400" />
        </div>
        <p className="text-white font-semibold text-base">Ticket Raised!</p>
        <p className="text-sm text-white/40 mt-2 leading-relaxed max-w-xs">
          Your maintenance request has been submitted and will be reviewed shortly.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium
            bg-[#0A6ED3]/15 text-[#6CB6FF] border border-[#0A6ED3]/25
            hover:bg-[#0A6ED3]/25 transition-all"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-500/8 border border-amber-500/15 text-xs text-amber-300/70">
        <AlertCircle size={13} className="flex-shrink-0" />
        <span>
          Reporting an issue for{" "}
          <span className="font-semibold text-amber-300">{facility?.name}</span>
        </span>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-white/40">Issue Title *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Broken projector, AC not working…"
          className="w-full rounded-xl bg-[#000919] border border-white/8 px-4 py-3
            text-sm text-white placeholder:text-white/20
            outline-none focus:border-[#0A6ED3]/50 focus:ring-2 focus:ring-[#0A6ED3]/10 transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-white/40">Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Describe the issue in detail…"
          rows={3}
          className="w-full rounded-xl bg-[#000919] border border-white/8 px-4 py-3
            text-sm text-white placeholder:text-white/20 resize-none
            outline-none focus:border-[#0A6ED3]/50 focus:ring-2 focus:ring-[#0A6ED3]/10 transition-all"
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium
            bg-white/4 text-white/45 border border-white/8
            hover:bg-white/8 hover:text-white/70 transition-all"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!title.trim() || loading}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
            disabled:opacity-35 disabled:cursor-not-allowed
            bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98]"
        >
          {loading ? "Submitting…" : "Submit Ticket"}
        </button>
      </div>
    </div>
  );
}

/* ─── Skeleton Loader ────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-80 rounded-2xl bg-white/5" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-8 rounded-xl bg-white/5" />
        <div className="h-8 rounded-xl bg-white/5" />
      </div>
      <div className="space-y-2">
        <div className="h-3 rounded-lg bg-white/5 w-full" />
        <div className="h-3 rounded-lg bg-white/5 w-4/5" />
        <div className="h-3 rounded-lg bg-white/5 w-3/5" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Modal ─────────────────────────────────────────────────── */
export default function FacilityDetailsModal({
  isOpen,
  onClose,
  facilityId,
  onRaiseTicket,
  onAddBooking,
}) {
  const overlayRef = useRef(null);

  const [facility, setFacility] = useState(null);
  const [images, setImages] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [showTicket, setShowTicket] = useState(false);

  /* Fetch all data */
  useEffect(() => {
    if (!isOpen || !facilityId) return;

    const fetchAll = async () => {
      setLoading(true);
      setImagesLoading(true);
      setFacility(null);
      setImages([]);
      setSchedules([]);
      setBookings([]);
      setShowTicket(false);

      const [facilityRes, imagesRes, schedulesRes, bookingsRes] =
        await Promise.allSettled([
          axios.get(getFacilityUrl(facilityId)),
          axios.get(getFacilityImagesUrl(facilityId)),
          axios.get(getFacilitySchedulesUrl(facilityId)),
          getAllBookings(),
        ]);

      if (facilityRes.status === "fulfilled") setFacility(facilityRes.value.data);
      if (imagesRes.status === "fulfilled") {
        const imgs = imagesRes.value.data || [];
        setImages([...imgs].sort((a, b) => (a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1)));
      }
      if (schedulesRes.status === "fulfilled") setSchedules(schedulesRes.value.data || []);
      if (bookingsRes.status === "fulfilled") {
        const allBookings = bookingsRes.value || [];

        const facilityBookings = allBookings.filter((booking) => {
          const bookingFacilityId =
            booking.resourceId ||
            booking.facilityId ||
            booking.facility?.id ||
            booking.resource?.id;

          return Number(bookingFacilityId) === Number(facilityId);
        });

        setBookings(facilityBookings);
      }

      setImagesLoading(false);
      setLoading(false);
    };

    fetchAll();
  }, [isOpen, facilityId]);

  /* Keyboard + scroll lock */
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose?.();
    if (isOpen) {
      window.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const linkedEquipment = useMemo(() => {
    if (!facility?.equipmentNames?.length) return [];
    return facility.equipmentNames.map((name, i) => ({
      id: facility.equipmentIds?.[i] ?? `${name}-${i}`,
      name,
      type: "",
      status: "",
      imageUrl: "",
    }));
  }, [facility]);

  const safeFacility = useMemo(
    () => ({
      name: facility?.name || "Facility",
      code: facility?.code || "",
      location: facility?.building || "N/A",
      capacity: facility?.capacity ?? 0,
      type: facility?.facilityType || "",
      indoorOutdoor: facility?.indoorOutdoor || "",
      description:
        facility?.description || "No description provided for this facility.",
      status: facility?.status || "ACTIVE",
    }),
    [facility]
  );

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const handleAddBookingClick = () => {
    if (onAddBooking && facility) onAddBooking(facility);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      {/* ── Modal shell ── */}
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border border-white/8 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{ background: "#000919" }}
      >

        {/* ── Sticky Top Bar ── */}
        <div
          className="flex items-center gap-3 px-5 py-3.5 flex-shrink-0 border-b border-white/6"
          style={{ background: "rgba(0,9,25,0.95)", backdropFilter: "blur(12px)" }}
        >
          {/* Back / close */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70
              transition-colors group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span>Back</span>
          </button>

          <span className="text-white/15 text-sm">|</span>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-white/35 min-w-0">
            <Layers size={12} className="text-[#6CB6FF]/50 flex-shrink-0" />
            <span className="text-white/30">Facilities</span>
            <span className="text-white/15">/</span>
            <span className="text-white/70 truncate font-medium">
              {safeFacility.name}
            </span>
          </div>

          <div className="flex-1" />

          {/* Status */}
          <span
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium flex-shrink-0
              ${STATUS_LABEL[safeFacility.status] ?? "bg-white/8 text-white/60 ring-1 ring-white/10"}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${STATUS_DOT[safeFacility.status] ?? "bg-white/40"}`}
            />
            {formatEnum(safeFacility.status)}
          </span>

          {/* X */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-white/8 flex items-center justify-center
              text-white/35 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="p-5 sm:p-6 space-y-6">

            {loading ? (
              <Skeleton />
            ) : (
              <>
                {/* ── Image Gallery ── */}
                {imagesLoading ? (
                  <div className="h-72 sm:h-96 rounded-2xl bg-white/5 animate-pulse" />
                ) : (
                  <ImageGallery
                    images={images.length ? images : [{ imageUrl: fallbackImage }]}
                    facilityName={safeFacility.name}
                  />
                )}

                {/* ── Title row + Raise Ticket ── */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                      {safeFacility.name}
                    </h1>
                    {safeFacility.code && (
                      <span className="text-xs text-white/30 font-mono mt-1 block">
                        {safeFacility.code}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTicket(true)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                      bg-amber-500/12 text-amber-300 border border-amber-500/25
                      hover:bg-amber-500/22 hover:border-amber-500/45
                      active:scale-[0.97] transition-all"
                  >
                    <Ticket size={14} />
                    <span className="hidden sm:inline">Raise Ticket</span>
                    <span className="sm:hidden">Ticket</span>
                  </button>
                </div>

                {/* ── Description ── */}
                <p className="text-sm text-white/45 leading-relaxed -mt-2">
                  {safeFacility.description}
                </p>

                {/* ── Meta grid ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard
                    icon={Building2}
                    label="Type"
                    value={formatEnum(safeFacility.type)}
                    accent
                  />
                  <StatCard
                    icon={MapPin}
                    label="Location"
                    value={safeFacility.location}
                  />
                  <StatCard
                    icon={Users}
                    label="Capacity"
                    value={`${safeFacility.capacity} people`}
                  />
                  <StatCard
                    icon={Filter}
                    label="Setting"
                    value={formatEnum(safeFacility.indoorOutdoor) || "N/A"}
                  />
                </div>

                {/* ── Divider ── */}
                <div className="border-t border-white/6" />

                {/* ── Equipment ── */}
                <EquipmentSection equipment={linkedEquipment} />

                {/* ── Schedules ── */}
                <SchedulesSection schedules={schedules} />

                {/* ── Bookings ── */}
                <BookingsSection
                  bookings={bookings}
                  onAddBooking={handleAddBookingClick}
                />

                <div className="h-3" />
              </>
            )}
          </div>
        </div>

        {/* ── Raise Ticket slide-up drawer ── */}
        {showTicket && (
          <div
            className="absolute inset-0 z-20 flex flex-col justify-end"
            style={{
              background: "rgba(0,9,25,0.7)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              className="rounded-t-3xl border-t border-white/10 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.6)]"
              style={{ background: "#000919" }}
            >
              {/* Drawer handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/15" />
              </div>

              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/8">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                  <Ticket size={15} className="text-amber-400" />
                </div>
                <span className="text-sm font-semibold text-white flex-1">
                  Raise a Ticket
                </span>
                <button
                  type="button"
                  onClick={() => setShowTicket(false)}
                  className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center
                    text-white/40 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <RaiseTicketDrawer
                facility={safeFacility}
                onClose={() => setShowTicket(false)}
                onRaiseTicket={onRaiseTicket}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}