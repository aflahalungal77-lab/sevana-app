
"use client";

import { useState } from "react";
import {
  UserRound,
  Phone,
  Droplet,

  Hospital,
  HeartPulse,
  MessageCircle,

  ShieldCheck,
} from "lucide-react";

import { supabase, supabaseConfigured } from "@/lib/supabase/client";

const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const urgencyOptions = [
  { label: "Normal", value: "Normal" },
  { label: "Urgent", value: "Urgent" },
  { label: "Very Urgent", value: "Very Urgent" },
];

export function BloodRequestForm() {
  const [form, setForm] = useState({
    patient_name: "",
    blood_group: "O+",
    units: "1",
    hospital: "",
    area: "",
    contact_phone: "",
    needed_by: "",
    notes: "",
  });

  const [urgency, setUrgency] = useState("Urgent");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  function buildMessage() {
    return [
      "🩸 SEVANA — BLOOD REQUEST",
      "",
      `Patient: ${form.patient_name}`,
      `Contact: ${form.contact_phone}`,
      `Blood group: ${form.blood_group}`,
      `Units needed: ${form.units}`,
      `Hospital: ${form.hospital}`,
      `Area: ${form.area}`,
      `Urgency: ${urgency}`,
      `Needed by: ${form.needed_by || "As soon as possible"}`,
      form.notes ? `Notes: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function openWhatsApp() {
    const message = buildMessage();
    const groupUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL;

    const url =
      groupUrl && !groupUrl.includes("YOUR_GROUP_INVITE")
        ? `${groupUrl}${groupUrl.includes("?") ? "&" : "?"}text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("");

    try {
      if (!supabaseConfigured || !supabase) {
        setStatus(
          "The request service is not configured yet. Please contact the administrator."
        );
        return;
      }

      const { error } = await supabase.from("blood_requests").insert({
        patient_name: form.patient_name.trim(),
        blood_group: form.blood_group,
        units: Number(form.units),
        hospital: form.hospital.trim(),
        area: form.area.trim(),
        contact_phone: form.contact_phone.trim(),
        needed_by: form.needed_by || null,
        notes: form.notes.trim(),
        status: "new",
      });

      if (error) {
        setStatus(
          "Could not save your request. Please check your connection and try again."
        );
        return;
      }

      openWhatsApp();

      setStatus(
        "Request saved successfully. Please send the prepared WhatsApp message to notify the admin."
      );
    } catch {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const charityPhone = process.env.NEXT_PUBLIC_CHARITY_PHONE?.replace(
    /[^\d+]/g,
    ""
  );

  return (
    <form className="form-card blood-form-premium" onSubmit={submit}>
      <div className="blood-form-heading">
        <div className="blood-form-title-icon">
          <HeartPulse size={23} />
        </div>

        <div>
          <h2>Need Blood?</h2>
          <p>Please fill in the details and send.</p>
        </div>
      </div>

      <div className="blood-form-fields">
        <div className="field full blood-field">
          <label className="field-label" htmlFor="patient">
            Patient name
          </label>

          <div className="blood-input-wrap">
            <UserRound size={17} />
            <input
              id="patient"
              className="field-control"
              required
              maxLength={100}
              value={form.patient_name}
              onChange={(e) => update("patient_name", e.target.value)}
              placeholder="Enter patient name"
              autoComplete="name"
            />
          </div>
        </div>

        <div className="field full blood-field">
          <label className="field-label" htmlFor="phone">
            Contact number
          </label>

          <div className="blood-input-wrap">
            <Phone size={17} />
            <input
              id="phone"
              className="field-control"
              type="tel"
              required
              maxLength={20}
              value={form.contact_phone}
              onChange={(e) => update("contact_phone", e.target.value)}
              placeholder="Enter contact number"
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="blood-form-row">
          <div className="field blood-field">
            <label className="field-label" htmlFor="group">
              Blood group
            </label>

            <div className="blood-input-wrap">
              <Droplet size={17} />

              <select
                id="group"
                className="field-control"
                value={form.blood_group}
                onChange={(e) => update("blood_group", e.target.value)}
              >
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field blood-field">
            <label className="field-label" htmlFor="units">
              Units needed
            </label>

            <div className="blood-input-wrap">
              <HeartPulse size={17} />

              <select
                id="units"
                className="field-control"
                value={form.units}
                onChange={(e) => update("units", e.target.value)}
              >
                {Array.from({ length: 20 }, (_, index) => index + 1).map(
                  (unit) => (
                    <option key={unit} value={unit}>
                      {unit} {unit === 1 ? "Unit" : "Units"}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="field full blood-field">
          <label className="field-label" htmlFor="hospital">
            Place / Hospital
          </label>

          <div className="blood-input-wrap">
            <Hospital size={17} />
            <input
              id="hospital"
              className="field-control"
              required
              maxLength={150}
              value={form.hospital}
              onChange={(e) => update("hospital", e.target.value)}
              placeholder="Hospital or clinic name"
            />
          </div>
        </div>



        

        <div className="field full blood-field">
          <label className="field-label">Urgency</label>

          <div className="blood-urgency-options">
            {urgencyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`blood-urgency-option ${
                  urgency === option.value ? "is-selected" : ""
                } ${option.value === "Very Urgent" ? "is-very-urgent" : ""}`}
                aria-pressed={urgency === option.value}
                onClick={() => setUrgency(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field full blood-field">
          <label className="field-label" htmlFor="notes">
            Additional notes (optional)
          </label>

          <textarea
            id="notes"
            className="field-control blood-notes"
            rows={2}
            maxLength={500}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Any useful information"
          />
        </div>
      </div>

      <p className="blood-privacy-note">
        <ShieldCheck size={15} />
        <span>
          Submit genuine requests only. Contact details are shared for donation
          coordination.
        </span>
      </p>



      <div className="blood-contact-actions">
                <button
          className="blood-whatsapp-button"
          type="button"
          onClick={openWhatsApp}
        >
          <MessageCircle size={18} />
          Via WhatsApp
        </button>
        


      </div>

      {status && (
        <p className="status-message blood-form-status" role="status">
          {status}
        </p>
      )}
    </form>
  );
}
