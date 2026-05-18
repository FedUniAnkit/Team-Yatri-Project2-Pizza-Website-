# Sprint 5 Training Guide – Komorebi Pizza Platform

This document helps administrators and staff learn the new Sprint 5 features. Replace the screenshot placeholders with real captures before sharing.

---

## 1. Admin Sales & Product Analytics Dashboard

1. Sign in as an **admin** and navigate to **Admin › Analytics** (`/admin/analytics`).
2. Use the **Sales Period** dropdown to toggle between **Weekly**, **Monthly**, and **Yearly** trends.
3. Use the new **Product Range** dropdown to view the top-selling pizzas for the last 7 days, this month, or this year.
4. Review the charts and KPI cards below for total revenue, order count, and other stats.

> Screenshot placeholder: `![Analytics dashboard filters](docs/screenshots/sprint5-analytics.png)`

---

## 2. Admin Promo Banner Studio

1. Go to **Admin › Promo Banners**.
2. Click **Create New Banner** to open the editor.
3. Enter the title/message, optional promo code, and choose a style.
4. Upload a hero image (recommended 1600×400px, under 2MB). Remove/replace as needed.
5. (Optional) Enter a custom CTA label and link. External URLs open in a new tab.
6. Set the active dates and toggle **Active** to publish.
7. Save the banner. The list now shows the hero image thumbnail and CTA summary.

> Screenshot placeholders:
> - `![Banner form with image upload](docs/screenshots/sprint5-banner-form.png)`
> - `![Banner list panel](docs/screenshots/sprint5-banner-list.png)`

---

## 3. Staff Order PDF Export

1. Staff can open any order via **Staff › Orders › View Details**.
2. Click **📄 Export PDF** in the top-right corner of the order header.
3. A detailed PDF (items, customer info, payment status, notes) will download automatically for offline records.

> Screenshot placeholder: `![Staff order export button](docs/screenshots/sprint5-staff-export.png)`

---

## 4. Customer Invoice Downloads

1. Customers can visit **My Orders › View Order**.
2. Use the **📄 Download Invoice** button to get a branded PDF receipt with discount and GST breakdown.

> Screenshot placeholder: `![Customer invoice button](docs/screenshots/sprint5-customer-invoice.png)`

---

## 5. Newsletter Subscription Flow

1. Customers subscribe from the footer form.
2. They see a thank-you popup and receive a welcome email that includes a working unsubscribe link.
3. Unsubscribing redirects back to the homepage with a confirmation toast.

> Screenshot placeholder: `![Newsletter popup](docs/screenshots/sprint5-newsletter-popup.png)`

---

## 6. Admin User Management Filters (Recap)

Administrators can filter, search, and sort users from **Admin › Users**:
- Search by name/email, filter by role or status, and sort by any column using the header chevrons.

> Screenshot placeholder: `![User filters and sorting](docs/screenshots/sprint5-user-filters.png)`

---

### Tips for Trainers
- Capture real screenshots after deploying to the staging server.
- Pair this guide with a short live demo so staff can follow along.
- Encourage staff to export one order PDF and upload one promo banner during training to build confidence.
