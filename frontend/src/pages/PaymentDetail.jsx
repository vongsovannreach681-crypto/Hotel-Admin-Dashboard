import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import logo from "../assets/Romdullogo.png";
import api from "../api/api.js";

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const statusStyles = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-slate-100 text-slate-700",
};

const getStatusColor = (status) => {
  switch (status) {
    case "paid":
      return [22, 163, 74];
    case "pending":
      return [217, 119, 6];
    case "failed":
      return [220, 38, 38];
    case "refunded":
      return [71, 85, 105];
    default:
      return [140, 198, 63];
  }
};

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayment = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/payment/${id}`);
        setPayment(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.message || err.message || "Failed to load payment",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  const handleEdit = () => {
    navigate("/payments/add", { state: { payment } });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete payment "${payment?.payment_id ?? id}"?`,
    );
    if (!confirmed) return;

    try {
      await api.delete(`/payment/${id}`);
      navigate("/payments");
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to delete payment",
      );
    }
  };

  const booking = payment?.booking ?? {};
  const paymentFields = [
    ["Payment Method", payment?.payment_method?.replace(/_/g, " ") ?? "-"],
    ["Transaction Reference", payment?.transaction ?? "-"],
    [
      "Total Price",
      booking?.total_price != null
        ? `$${booking.total_price}`
        : payment?.total_price != null
          ? `$${payment.total_price}`
          : "-",
    ],
    ["Check-in", formatDate(booking?.check_in ?? payment?.check_in)],
    ["Check-out", formatDate(booking?.check_out ?? payment?.check_out)],
    ["Paid At", formatDate(payment?.paid_at)],
  ];

  const bookingFields = [
    ["Booking ID", booking?.booking_id ?? payment?.booking_id ?? "-"],
    ["User", booking?.user_name ?? booking?.user_id ?? "-"],
    ["Hotel", booking?.hotel_name ?? booking?.hotel_id ?? "-"],
    [
      "Room",
      booking?.room_number
        ? `${booking.room_number} (${booking.room_type ?? "-"})`
        : booking?.room_id ?? "-",
    ],
    ["Check-in", formatDate(booking?.check_in ?? payment?.check_in)],
    ["Check-out", formatDate(booking?.check_out ?? payment?.check_out)],
  ];

const handleExportPDF = async () => {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const dark = [15, 23, 42];
  const muted = [100, 116, 139];
  const headerBg = [176, 190, 197]; // slate-blue-grey table header, like the reference
  const line = [203, 213, 225];
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  const paymentId = payment?.payment_id ?? "-";
  const status = (payment?.status ?? "-").replace(/_/g, " ");
  const paymentMethod = payment?.payment_method?.replace(/_/g, " ") ?? "-";
  const transaction = payment?.transaction ?? "-";
  const booking = payment?.booking ?? {};
  const bookingUser = booking?.user_name ?? booking?.user_id ?? "-";
  const totalPrice =
    booking?.total_price != null
      ? Number(booking.total_price)
      : payment?.total_price != null
        ? Number(payment.total_price)
        : 0;
  const paidAt = formatDate(payment?.paid_at);
  const checkIn = formatDate(booking?.check_in ?? payment?.check_in);
  const checkOut = formatDate(booking?.check_out ?? payment?.check_out);

  // --- Logo ---
  let logoData = null;
  let logoAspect = 1;
  try {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = logo;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(image, 0, 0);
      logoData = canvas.toDataURL("image/png");
      logoAspect = image.naturalWidth / image.naturalHeight;
    }
  } catch {
    logoData = null;
  }

  // ===== HEADER: logo left, title right =====
  const logoHeight = 20;
  const logoWidth = logoHeight * logoAspect;

  if (logoData) {
    doc.addImage(logoData, "PNG", margin, 20, logoWidth, logoHeight);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(26);
  doc.setTextColor(...dark);
  doc.text("RECEIPT", pageWidth - margin, 32, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...dark);
  doc.text("RomduL Hotel", pageWidth - margin, 42, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text("Phnom Penh, Cambodia", pageWidth - margin, 47, { align: "right" });
  doc.text("info@romdul.com", pageWidth - margin, 52, { align: "right" });

  // ===== INFO ROW: booking (left) / receipt meta (right) =====
  const infoTop = 68;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...dark);
  doc.text("Booking Reference", margin, infoTop);
  doc.setTextColor(...muted);
  doc.text(`#${booking?.booking_id ?? payment?.booking_id ?? "-"}`, margin, infoTop + 6);
  doc.text(`User: ${bookingUser}`, margin, infoTop + 12);
  doc.text(booking?.hotel_name ?? booking?.hotel_id ?? "-", margin, infoTop + 18);
  doc.text(
    booking?.room_number
      ? `Room ${booking.room_number} (${booking.room_type ?? "-"})`
      : booking?.room_id ?? "-",
    margin,
    infoTop + 24,
  );

  const metaLabelX = pageWidth - margin - 55;
  const metaValueX = pageWidth - margin;
  const drawMeta = (label, value, y) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...muted);
    doc.text(label, metaLabelX, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text(String(value), metaValueX, y, { align: "right" });
  };

  drawMeta("Receipt No.:", String(paymentId).padStart(6, "0"), infoTop);
  drawMeta("Status:", status.toUpperCase(), infoTop + 6);
  drawMeta("Paid date:", paidAt, infoTop + 12);
  drawMeta("Transaction:", transaction, infoTop + 18);

  // ===== TABLE =====
  const tableTop = infoTop + 34;
  const col = {
    desc: margin,
    method: margin + contentWidth * 0.42,
    stay: margin + contentWidth * 0.64,
    amount: pageWidth - margin,
  };

  doc.setFillColor(...headerBg);
  doc.rect(margin, tableTop, contentWidth, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...dark);
  doc.text("DESCRIPTION", col.desc + 3, tableTop + 6);
  doc.text("METHOD", col.method, tableTop + 6);
  doc.text("STAY", col.stay, tableTop + 6);
  doc.text("AMOUNT (USD)", col.amount - 3, tableTop + 6, { align: "right" });

  // row 1
  let rowY = tableTop + 9 + 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...dark);
  doc.text(`Room booking payment #${paymentId}`, col.desc + 3, rowY);
  doc.text(paymentMethod, col.method, rowY, { maxWidth: contentWidth * 0.2 });
  doc.text(`${checkIn} - ${checkOut}`, col.stay, rowY, { maxWidth: contentWidth * 0.32 });
  doc.text(totalPrice ? totalPrice.toFixed(2) : "-", col.amount - 3, rowY, { align: "right" });

  const rowDividerY = rowY + 6;
  doc.setDrawColor(...line);
  doc.setLineWidth(0.3);
  doc.line(margin, rowDividerY, pageWidth - margin, rowDividerY);

  // ===== TOTALS (right-aligned, no box) =====
  let totalsY = rowDividerY + 12;
  const totalsLabelX = pageWidth - margin - 55;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...dark);
  doc.text("TOTAL (USD):", totalsLabelX, totalsY);
  doc.text(`$${totalPrice.toFixed(2)}`, pageWidth - margin, totalsY, { align: "right" });

  doc.setDrawColor(...dark);
  doc.setLineWidth(0.4);
  doc.line(totalsLabelX, totalsY + 3, pageWidth - margin, totalsY + 3);

  totalsY += 12;
  doc.setFontSize(15);
  doc.text("TOTAL PAID", totalsLabelX, totalsY);
  doc.text(`$${totalPrice.toFixed(2)}`, pageWidth - margin, totalsY, { align: "right" });

  // ===== FOOTER =====
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text("Thank you for staying with RomduL.", margin, pageHeight - 20);

  doc.save(`payment-${paymentId}.pdf`);
};

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Payment Detail</h1>
        <p className="mt-4 text-slate-600">Loading payment data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Payment Detail</h1>
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-8 shadow">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/payments")}
          className="rounded-md poppins border border-slate-200 bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white transition"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Payments
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center poppins gap-1.5 bg-slate-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all duration-150 active:scale-95"
          >
            <i className="fa-solid fa-file-pdf text-xs"></i> Export PDF
          </button>
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center gap-1.5 poppins bg-[var(--bg-primary)] text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all duration-150 active:scale-95"
          >
            <i className="fa-solid fa-pen text-xs"></i> Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 poppins bg-[var(--bg-primary)] text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all duration-150 active:scale-95"
          >
            <i className="fa-solid fa-trash text-xs"></i> Delete
          </button>
        </div>
      </div>

    
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold text-slate-900 poppins">
          Payment #{payment?.payment_id ?? "-"}
        </h1>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 p-6 poppins sm:grid-cols-2 xl:grid-cols-3">
        {paymentFields.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 p-6 poppins sm:grid-cols-2 xl:grid-cols-3">
        {bookingFields.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-slate-800">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PaymentDetail;
