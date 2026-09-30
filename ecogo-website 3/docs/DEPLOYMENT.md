# Deploying the Ecogo website

This guide takes the project from your computer to a live website on Ecogo's own domain, in this order: **GitHub, then Netlify, then Supabase**, then a final step that links the two. Nothing here requires buying anything except a domain, if Ecogo does not already own one (Part 5).

The site is built to work in stages. After Part 2 it is already live on a temporary Netlify address, showing its built-in content, with the contact form politely saying it is not switched on yet. Parts 3 and 4 then connect the database and turn the forms on.

Screen labels in GitHub, Netlify and Supabase change now and then, so button names below may differ slightly. The ideas stay the same.

**What you need**

- A GitHub account (free)
- Ecogo's Netlify account
- A Supabase account (the free plan is enough to start)
- Access to wherever the Ecogo domain is registered, to edit its DNS settings
- [Git](https://git-scm.com/downloads) installed on your computer (Node.js is only needed if you also want to run the site locally, see the optional section near the end)

---

## Part 1. Put the code on GitHub

1. On github.com choose **New repository**. Name it `ecogo-website`. Choose **Private**. Leave "Add a README" and the other options **unticked**, because the project already has these files. Choose **Create repository**.
2. In a terminal, inside the project folder, run these commands one at a time. Replace `YOUR-ACCOUNT` with the GitHub username or organisation that owns the repository:

```bash
git init
git add .
git status
```

Look at the list `git status` prints. It must **not** include `.env` or `node_modules`. If either appears, stop and check that `.gitignore` is present. Then:

```bash
git commit -m "Initial Ecogo website"
git branch -M main
git remote add origin https://github.com/YOUR-ACCOUNT/ecogo-website.git
git push -u origin main
```

3. GitHub will ask you to sign in. It no longer accepts your account password in the terminal. The simplest routes are to sign in through the browser window Git opens, to install [GitHub Desktop](https://desktop.github.com) and add the folder there, or to create a Personal Access Token when asked for a password.
4. Refresh the repository page. Your files should be listed, and `.env` should not be.

Later changes follow the same three commands: `git add .`, `git commit -m "What changed"`, `git push`. Netlify will redeploy on every push to `main`.

## Part 2. Deploy on Netlify (first version)

1. Sign in to Ecogo's Netlify account and choose **Add new project**, then **Import an existing project**.
2. Choose **GitHub**. The first time, Netlify asks permission to see your repositories. Allow it, and pick the `ecogo-website` repository.
3. Netlify reads `netlify.toml` and fills in the build settings. Check they say:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Choose **Deploy**. You do not need any environment variables yet. The first build takes a minute or two. When it finishes, Netlify shows an address like `something.netlify.app`. Open it and click through the site.
5. Expect the contact and newsletter forms to say that sending is not switched on. That is correct for now, and Parts 3 and 4 fix it.

From now on, every `git push` to the `main` branch makes Netlify rebuild and publish automatically.

## Part 3. Set up Supabase (the database)

1. Sign in at supabase.com and choose **New project**. Name it `ecogo-website`, set a strong database password and save it in a password manager (the website never needs it). For the region, pick the one closest to Nairobi that is offered; Cape Town is ideal if it is listed, otherwise Europe.
2. When the project is ready, open **SQL Editor** and choose **New query**.
3. Open `supabase/migrations/0001_initial_schema.sql` from this project, copy everything into the editor and press **Run**. You should see "Success".
4. Create another new query, paste in `supabase/seed.sql` and run it. This adds the starter products and the power bank project.
5. Open **Table Editor**. You should see `products`, `projects`, `contact_submissions` and `newsletter_subscribers`, each marked as having Row Level Security enabled. The products table should have four rows.
6. Open **Project Settings, API**. Copy two values somewhere handy:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - **anon key**, which newer projects call the **publishable key**

**Important:** the same page also shows a `service_role` (secret) key. Do not copy it anywhere for this project. This website never needs it, and anyone who has it can read and change all of your data.

## Part 4. Link Supabase to the live site

Environment variables are settings Netlify hands to the build. This site reads two of them to find your database.

1. In Netlify, open the site, then **Project configuration, Environment variables, Add a variable**. Add these two:

   | Key | Value |
   | --- | --- |
   | `VITE_SUPABASE_URL` | the Project URL from Part 3 |
   | `VITE_SUPABASE_ANON_KEY` | the anon / publishable key from Part 3 |

2. Rebuild the site so it picks them up: **Deploys, Trigger deploy, Clear cache and deploy site**. Variables starting with `VITE_` are baked into the site at build time, so any time you add or change one you must trigger a new deploy.
3. Open the live site and send a test message from the Contact page. Then check **Table Editor, contact_submissions** in Supabase. The message should be there, and you can delete it afterwards.

## Part 5. Connect the Ecogo domain

If Ecogo does not own a domain yet, buying one is a decision and a cost for you to make with a registrar. For a Kenyan `.ke` domain, use a KENIC-accredited registrar. Come back here once it is bought.

1. In Netlify, open the site, then **Domain management**, then **Add a domain**. Enter the domain (for example `ecogo.co.ke`) and confirm.
2. Netlify offers two ways to connect it. Pick one:
   - **Netlify DNS (simplest for many people):** Netlify shows nameserver addresses. At your registrar, replace the domain's nameservers with those. Netlify then manages all DNS records.
   - **Keep DNS at your registrar:** at the registrar's DNS settings, add the records Netlify shows on the domain page. Typically that is an `A` record for the bare domain (`@`) pointing at the address Netlify displays, and a `CNAME` record for `www` pointing to your `something.netlify.app` address. Use the exact values Netlify shows you, not values from memory or from other guides.
3. DNS changes can take from a few minutes to a day to spread. Netlify shows when the domain is verified.
4. Under **Domain management, HTTPS**, choose **Verify DNS configuration** and then **Provision certificate** (if it has not happened automatically). Netlify issues a free HTTPS certificate.
5. Under **Domains**, set your preferred address (`www` or the bare domain) as the **primary domain**. The other will redirect to it.
6. Add one more environment variable, then redeploy as described in Part 4:

   | Key | Value |
   | --- | --- |
   | `VITE_SITE_URL` | `https://` plus your primary domain, no trailing slash, for example `https://www.ecogo.co.ke` |

   This makes the social sharing image, sitemap and robots.txt use the real address.

## Part 6. Fill in the real details

1. Open `src/content/site.ts` and replace the `[Ecogo ...]` placeholders with the real phone, email, address and hours. Set `whatsapp` and the social links if you use them.
2. Review every product in Supabase **Table Editor, products** against what Ecogo actually stocks, and edit or unpublish anything that is not right.
3. Commit and push. Netlify redeploys by itself.

## Part 7. Production test checklist

Work through this on the live address, on a phone as well as a computer.

**Pages and navigation**
- [ ] Home, Solutions, Power bank project, About and Contact all open from the menu
- [ ] Refreshing the browser on `/solutions` and `/power-bank` still shows the page (not an error)
- [ ] A made-up address such as `/nothing-here` shows the friendly "page is not here" screen
- [ ] The menu works on a phone, and the logo returns to the home page
- [ ] Both `http://` and the non-preferred `www` or bare address redirect to the primary `https://` address

**Content**
- [ ] No yellow `[Ecogo ...]` placeholders remain anywhere
- [ ] Products show the right names, descriptions and status
- [ ] The power bank page clearly says the service is not operating yet, and shows the right project stage

**Forms and Supabase**
- [ ] Contact form: submit an empty form, and errors appear next to the fields
- [ ] Contact form: send a real test message, and the success message appears
- [ ] The test message appears in Supabase, **Table Editor, contact_submissions**, with the right reason and page
- [ ] Newsletter form in the footer: subscribe a test email, and it appears in `newsletter_subscribers`
- [ ] Open the browser's developer tools, Network tab, and confirm no request used a `service_role` key (there should be none)

**Search and sharing**
- [ ] `https://your-domain/robots.txt` and `https://your-domain/sitemap.xml` load and use your real domain
- [ ] Paste the home page link into WhatsApp or another chat app and check the preview title and image
- [ ] The browser tab shows the Ecogo icon, and each page has its own title

**Quality**
- [ ] Run Lighthouse (Chrome developer tools, Lighthouse tab) on the home page for mobile, and check Performance, Accessibility, Best Practices and SEO
- [ ] Tab through the home page with the keyboard only: the first Tab stop is "Skip to content" and the focus outline is always visible
- [ ] Add the site to Google Search Console and submit the sitemap

## If you upload the site by hand instead of using GitHub

Netlify also lets you drag a folder onto its **Deploys** page. That works, but Netlify does not build anything in that case, so:

1. You must upload the **built** site, the `dist` folder, not the source code. Build it on your computer with `npm install` then `npm run build`.
2. The Supabase settings are baked in when you build, so put your Project URL and anon key in a `.env` file **before** running `npm run build`. Adding them in Netlify's Environment variables screen has no effect on a manual upload.
3. Every change (contact details, products in code, wording) means editing, running `npm run build` again, and uploading the new `dist` folder. Products you edit in Supabase's Table Editor update by themselves without a new upload.
4. The `_redirects` file inside `public` is what makes page refreshes and direct links work for manual uploads. Do not delete it.

If you later want automatic deploys, create a new Netlify site from the GitHub repository. A site that was created by drag and drop cannot be switched over to Git.

---

## Optional: run the site on your computer

Useful once you want to change the design or wording and see it before publishing. Install [Node.js](https://nodejs.org) (version 22 recommended), then:

```bash
cd ecogo-website
npm install
cp .env.example .env
```

Open `.env` in a text editor and paste in the Project URL and anon key from Part 3. Then run `npm run dev` and open http://localhost:5173. The `.env` file stays on your computer: `.gitignore` keeps it out of GitHub.

---

## Troubleshooting

**The page loads but shows "Sending is not switched on" on the forms.** The Supabase environment variables are missing or wrong in Netlify. Check both names exactly, then redeploy.

**Forms say "Something went wrong".** Check that you ran `0001_initial_schema.sql` completely. In Supabase, **Logs, API** shows the failing request. Make sure the URL and key belong to the same project.

**Products on the live site do not match the database.** Products come from Supabase only when at least one row has `is_published = true`. Otherwise the site shows its built-in fallback list.

**A build fails on Netlify.** Open the deploy log. Most often a variable is missing or the Node version is too old; `netlify.toml` already asks for Node 22.

**Refreshing a page gives "Page not found" from Netlify.** The redirect in `netlify.toml` is missing or the file was not committed. It must contain the `/* to /index.html 200` rule.
