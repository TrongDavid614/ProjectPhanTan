import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

const Footer = () => {
  const members = [
    { name: "Nguyễn Văn Trọng", id: "23728381" },
    { name: "Nguyễn Văn Quốc", id: "23645971" },
    { name: "Trần Đức Nam", id: "23724561" },
    { name: "Phan Hoàng Nhật Huy", id: "23681041" },
  ];

  const sources = [
    {
      label: "Github Frontend",
      href: "https://github.com/TrongDavid614/ProjectPhanTan",
    },
    {
      label: "Github Backend",
      href: "https://github.com/TrongDavid614/ProjectPhanTan_BE",
    },
  ];

  const socials = [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Zalo", href: "#" },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.topSection}>
        {/* 1 */}
        <div>
          <h3 className={styles.title}>Thành viên</h3>
          <ul className={styles.list}>
            {members.map((member, index) => (
              <li key={index}>
                {member.name} – {member.id}
              </li>
            ))}
          </ul>
        </div>

        {/* 2 */}
        <div className={styles.centerColumn}>
          <h3 className={styles.title}>Source</h3>
          <ul className={styles.list}>
            {sources.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3 */}
        <div className={styles.rightColumn}>
          <h3 className={styles.title}>Follow Us</h3>
          <ul className={styles.list}>
            {socials.map((social, index) => (
              <li key={index}>
                <Link href={social.href} className={styles.link}>
                  {social.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.logoWrapper}>
          <Image
            src="/assets/images/logo.png"
            alt="8Threads Logo"
            width={450}
            height={250}
            className={styles.logo}
            sizes="450px"
            style={{ width: "auto", height: "250px" }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
