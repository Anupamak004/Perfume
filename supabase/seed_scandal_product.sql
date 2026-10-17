-- Add Jean Paul Gaultier Scandal Pour Homme Le Parfum decants to the live catalogue.
-- Run in Supabase Dashboard → SQL Editor after the product image is deployed at
-- /images/scandal-pour-homme-le-parfum.png on the storefront.

insert into public.products (
  id, name, category, gender, price, fragrance_type, description,
  image, images, notes, moods, occasion, style, sizes, featured, in_stock,
  rating, reviews
) values (
  'jean-paul-gaultier-scandal-pour-homme-le-parfum',
  'Jean Paul Gaultier Scandal Pour Homme Le Parfum',
  'men',
  'Men',
  650,
  'Woody Amber',
  'An intense woody amber fragrance with geranium, tonka bean, and sandalwood. Available as 8ml and 30ml decants.',
  '/images/scandal-pour-homme-le-parfum.png',
  array['/images/scandal-pour-homme-le-parfum.png'],
  '{"top": [], "heart": [], "base": []}'::jsonb,
  array['Woody', 'Oriental'],
  array['Date Night', 'Special Occasion'],
  array['Bold', 'Warm'],
  '[{"label":"8ml Decant","price":650,"in_stock":true},{"label":"30ml Decant","price":2500,"in_stock":true}]'::jsonb,
  false,
  true,
  0,
  0
)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  gender = excluded.gender,
  price = excluded.price,
  fragrance_type = excluded.fragrance_type,
  description = excluded.description,
  image = excluded.image,
  images = excluded.images,
  notes = excluded.notes,
  moods = excluded.moods,
  occasion = excluded.occasion,
  style = excluded.style,
  sizes = excluded.sizes,
  featured = excluded.featured,
  in_stock = excluded.in_stock,
  rating = excluded.rating,
  reviews = excluded.reviews;
