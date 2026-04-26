import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Package,
  Filter,
  Wrench,
  Building2,
  ArrowRight,
  ArrowLeft,
  Layers,
} from "lucide-react";

/* ─── API URLs ───────────────────────────────────────────────────── */
const getEquipmentUrl = (id) => `http://localhost:8081/api/equipment/${id}`;
const getEquipmentImagesUrl = (id) =>
  `http://localhost:8081/api/equipment/${id}/images`;

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

/* ─── Image Gallery ──────────────────────────────────────────────── */
function ImageGallery({ images, equipmentName }) {
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
      <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#000D1F] border border-white/8 group">
        <img
          key={index}
          src={currentSrc}
          alt={`${equipmentName} – ${index + 1}`}
          className="w-full h-full object-cover"
          style={{
            opacity: fading ? 0 : 1,
            transition: "opacity 0.16s ease",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#000919]/80 via-[#000919]/10 to-transparent pointer-events-none" />

        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs text-white/70 border border-white/10 tabular-nums">
              {index + 1} / {images.length}
            </span>
          </div>
        )}

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

      {images.length > 1 && (
        <div className="flex items-center gap-2">
          <div className="flex gap-2 flex-1 overflow-hidden">
            {images.slice(thumbStart, thumbStart + VISIBLE).map((img, i) => {
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
export default function EquipmentDetailsModal({
  isOpen,
  onClose,
  equipmentId,
}) {
  const overlayRef = useRef(null);

  const [equipment, setEquipment] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !equipmentId) return;

    const fetchAll = async () => {
      setLoading(true);
      setImagesLoading(true);
      setEquipment(null);
      setImages([]);

      const [eqRes, imagesRes] = await Promise.allSettled([
        axios.get(getEquipmentUrl(equipmentId)),
        axios.get(getEquipmentImagesUrl(equipmentId)),
      ]);

      if (eqRes.status === "fulfilled") setEquipment(eqRes.value.data);
      if (imagesRes.status === "fulfilled") {
        const imgs = imagesRes.value.data || [];
        setImages([...imgs].sort((a, b) => (a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1)));
      }

      setImagesLoading(false);
      setLoading(false);
    };

    fetchAll();
  }, [isOpen, equipmentId]);

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

  const safeEquipment = {
    name: equipment?.name || "Equipment",
    code: equipment?.code || "N/A",
    type: equipment?.equipmentType || "",
    quantity: equipment?.quantity ?? 0,
    location: equipment?.currentLocation || "N/A",
    status: equipment?.status || "ACTIVE",
    description: equipment?.description || "No description provided.",
    facilityNames: equipment?.facilityNames || [],
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border border-white/8 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{ background: "#000919" }}
      >
        <div
          className="flex items-center gap-3 px-5 py-3.5 flex-shrink-0 border-b border-white/6"
          style={{ background: "rgba(0,9,25,0.95)", backdropFilter: "blur(12px)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>

          <span className="text-white/15 text-sm">|</span>

          <div className="flex items-center gap-1.5 text-xs text-white/35 min-w-0">
            <Layers size={12} className="text-[#6CB6FF]/50 flex-shrink-0" />
            <span className="text-white/30">Equipment</span>
            <span className="text-white/15">/</span>
            <span className="text-white/70 truncate font-medium">
              {safeEquipment.name}
            </span>
          </div>

          <div className="flex-1" />

          <span
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium flex-shrink-0
              ${STATUS_LABEL[safeEquipment.status] ?? "bg-white/8 text-white/60 ring-1 ring-white/10"}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${STATUS_DOT[safeEquipment.status] ?? "bg-white/40"}`}
            />
            {formatEnum(safeEquipment.status)}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-white/8 flex items-center justify-center
              text-white/35 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="p-5 sm:p-6 space-y-6">
            {loading ? (
              <Skeleton />
            ) : (
              <>
                {imagesLoading ? (
                  <div className="h-72 sm:h-96 rounded-2xl bg-white/5 animate-pulse" />
                ) : (
                  <ImageGallery
                    images={images.length ? images : [{ imageUrl: fallbackImage }]}
                    equipmentName={safeEquipment.name}
                  />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                      {safeEquipment.name}
                    </h1>
                    {safeEquipment.code && (
                      <span className="text-xs text-white/30 font-mono mt-1 block">
                        {safeEquipment.code}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-white/45 leading-relaxed -mt-2">
                  {safeEquipment.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard
                    icon={Wrench}
                    label="Type"
                    value={formatEnum(safeEquipment.type)}
                    accent
                  />
                  <StatCard
                    icon={Package}
                    label="Code"
                    value={safeEquipment.code}
                  />
                  <StatCard
                    icon={Users}
                    label="Quantity"
                    value={safeEquipment.quantity}
                  />
                  <StatCard
                    icon={MapPin}
                    label="Location"
                    value={safeEquipment.location}
                  />
                </div>

                {safeEquipment.facilityNames.length > 0 && (
                  <>
                    <div className="border-t border-white/6" />
                    <div>
                      <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                        <Building2 size={16} className="text-[#6CB6FF]" />
                        Linked Facilities
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {safeEquipment.facilityNames.map((facilityName, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white/70"
                          >
                            {facilityName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="h-3" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
