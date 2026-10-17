-- Optional storefront preview data. Run this once in Supabase SQL Editor.
-- These are fictional examples; remove them before launch if you do not want
-- sample content displayed as approved customer reviews.
insert into public.customer_reviews
  (customer_name, rating, review_text, status, moderated_at)
select sample.customer_name, sample.rating, sample.review_text, 'approved', now()
from (values
  ('Demo Customer · Aisha', 5, 'A beautiful, long-lasting fragrance. The scent feels elegant from the first spray and I have already received compliments.'),
  ('Demo Customer · Rohan', 5, 'The perfume arrived carefully packed and smells wonderful. I am very happy with the quality and would order again.'),
  ('Demo Customer · Sana', 4, 'A lovely fragrance for everyday wear. It feels refined without being overpowering, and the bottle is beautiful.'),
  ('Demo Customer · Imran', 5, 'Excellent service and a rich, memorable scent. The fragrance lasted throughout the evening.'),
  ('Demo Customer · Maya', 4, 'A great addition to my collection. The opening is fresh and it settles into a warm, soft scent.')
) as sample(customer_name, rating, review_text)
where not exists (
  select 1 from public.customer_reviews
  where customer_name = sample.customer_name
    and review_text = sample.review_text
);
