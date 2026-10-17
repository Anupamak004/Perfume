# Product admin setup

The product dashboard is a separate app entry at `/admin.html`. The existing storefront route and UI remain separate. Product changes save to Supabase; they do not change the storefront's hard-coded catalogue until the storefront is connected to Supabase in a follow-up change.

## 1. Create the Supabase project

Create a project at [supabase.com](https://supabase.com), then open **Project Settings → API** and copy the project URL and public anon/publishable key. The browser admin uses only this public key; never put a `service_role` key in a Vite environment variable.

## 2. Create the database tables

Open **SQL Editor** in the Supabase dashboard and run [`supabase/schema.sql`](supabase/schema.sql). The schema creates the product catalogue, customer review queue, administrator allow-list, timestamps, and row-level security policies. Anonymous visitors can read products and approved reviews and submit pending reviews; only allow-listed authenticated admins can manage products and moderate reviews.

If you already ran the schema before adding image upload, run the updated SQL file again. It also creates the public `product-images` Storage bucket and restricts uploads and deletes to allow-listed admins.

The latest schema also creates the public `review-images` bucket. Customers can upload up to three JPG, PNG, WebP, or GIF photos (5 MB each) with a review. New reviews are held as pending and are not shown on the storefront until an administrator approves them.

Run the latest schema again after connecting the storefront as well. It changes the public read policy so the store can display out-of-stock items as unavailable, and enables product change events for open storefront tabs.

## 3. Create an administrator

In **Authentication → Users**, create/invite the client's account and set its password. Copy the user's UUID, replace the example UUID at the end of `supabase/schema.sql`, and run that insert in the SQL editor (or run the insert separately). Turn off public sign-ups under **Authentication → Providers → Email** so only accounts you create can log in.

## 4. Configure and run

Copy `.env.example` to `.env.local`, fill in the Supabase URL and public key, then run:

```sh
npm run dev
```

Open the Vite URL followed by `/admin.html`. Sign in with the administrator account. Use **Import current catalogue** to copy the existing storefront products into Supabase; repeat imports update matching product IDs.

For deployment, add those same two public environment variables to the hosting provider and deploy the built Vite app. The hosting provider must serve `admin.html` alongside `index.html`.

## Customer review moderation

Customers can submit a name, 1–5 star rating, written review, and optional photos from the storefront review section. Open **Reviews** in `/admin.html` to approve and publish, reject, or permanently delete each submission. Only approved reviews appear publicly. If the database or Storage setup predates review support, rerun the updated `supabase/schema.sql` in the Supabase SQL Editor.

For a storefront preview, optionally run [`supabase/demo_reviews.sql`](supabase/demo_reviews.sql) once in the SQL Editor. The fictional entries are labeled “Demo Customer”; delete them from **Reviews** before launch if you do not want sample content shown publicly.

## Product fields

The editor manages product name and ID, category, gender, fragrance family, description, image gallery, scent notes, moods, occasions, style, featured placement, and bottle-size variants. Each variant has its own price and stock state, with bulk controls to mark every size in or out of stock. The storefront lists available sizes and disables unavailable variants. Upload JPG, PNG, WebP, GIF, or AVIF product images up to 8 MB from the editor; files are stored in Supabase Storage and the public image URLs are saved on the product. Products save to Supabase immediately when created or edited. Deletion asks for confirmation.

## Storefront connection

The public storefront reads the same Supabase catalogue. It displays out-of-stock products as unavailable, blocks adding them to the cart, and prevents WhatsApp checkout while the bag contains unavailable products. Open storefront tabs update when product changes arrive. If Supabase cannot confirm stock, ordering is blocked; product imagery and pages fall back to the bundled catalogue so the shopping pages remain available.
