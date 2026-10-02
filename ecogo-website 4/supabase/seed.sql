-- Starter content for the Ecogo website.
-- Run AFTER 0001_initial_schema.sql. Safe to re-run: rows are matched on slug.
--
-- Wording is deliberately general. Review every product and edit it in the
-- Supabase Table Editor (or here) so it matches what Ecogo actually stocks,
-- then keep is_published = true only for rows you are happy to show publicly.

insert into public.products
  (slug, name, category, summary, features, use_case, status, visual_key, cta_label, sort_order, is_published)
values
  ('solar-lighting', 'Solar lighting', 'Solar and energy',
   'Lighting that charges from the sun, for homes, shops and outdoor spaces.',
   array['Charges from sunlight', 'No electricity bill for lighting', 'Portable and easy to install'],
   'Homes, shops and market stalls that need reliable light when the grid is unavailable.',
   'available', 'solar-lamp', 'Ask about solar lighting', 10, true),

  ('security-cameras', 'Security cameras', 'Security and monitoring',
   'Cameras for keeping an eye on a shop, home or yard.',
   array['Indoor and outdoor options', 'Check footage from your phone', 'Suitable for small businesses'],
   'Shops, stores and homes that want to see what is happening while they are away.',
   'available', 'camera', 'Ask about cameras', 20, true),

  ('memory-and-accessories', 'Memory cards and accessories', 'Consumer electronics',
   'Everyday electronics accessories, from storage to cables and chargers.',
   array['Storage for phones, cameras and devices', 'Charging and connection accessories', 'Sold in Kenya shillings'],
   'Anyone who needs to store more, charge faster or connect their devices.',
   'available', 'memory-card', 'Ask about accessories', 30, true),

  ('shared-power-banks', 'Shared power banks', 'Portable power',
   'Borrow a power bank at one station and return it at another. Currently in development.',
   array['Pick up and return at compatible stations', 'Designed for short, everyday top-ups', 'Payment by mobile money is planned'],
   'Anyone out and about whose phone is running low.',
   'in_development', 'power-bank', 'See the project', 40, true)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, summary = excluded.summary,
  features = excluded.features, use_case = excluded.use_case, status = excluded.status,
  visual_key = excluded.visual_key, cta_label = excluded.cta_label,
  sort_order = excluded.sort_order, is_published = excluded.is_published;

insert into public.projects (slug, name, summary, status, launch_note, sort_order, is_published)
values
  ('shared-power-banks', 'Shared power bank network',
   'A network of stations where people borrow a power bank when they need it and return it at any compatible station.',
   'pilot_preparation', null, 10, true)
on conflict (slug) do update set
  name = excluded.name, summary = excluded.summary, status = excluded.status,
  launch_note = excluded.launch_note, sort_order = excluded.sort_order, is_published = excluded.is_published;
