"use client";

import { useEffect, useState } from "react";
import styles from "./EventDate.module.css";
import CalendarIcon from "@/components/common/icons/CalendarIcon";

export default function EventDate({ date, isHover }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    try {
      if (!date) {
        setFormatted("");
        return;
      }

      const normalizedDate = String(date).replace(" ", "T");
      const d = new Date(normalizedDate);

      if (Number.isNaN(d.getTime())) {
        setFormatted("");
        return;
      }

      const f = new Intl.DateTimeFormat("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d);
      setFormatted(f);
    } catch (err) {
      setFormatted("");
    }
  }, [date]);

  return (
    <div className={styles.infoRow}>
      <CalendarIcon isHover={isHover} />
      <span
        suppressHydrationWarning
        className={isHover ? styles.whiteText : styles.gradientText}
      >
        {formatted}
      </span>
    </div>
  );
}