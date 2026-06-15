# Personal Digital Space

A minimal personal digital space built with Astro.

## Development

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build

```bash
npm run build      # Output to dist/
npm run preview    # Preview built site
```

## Deploy

Upload `dist/` directory to any static file server:

```bash
# Example: rsync to own server
rsync -avz dist/ user@your-server:/var/www/personal-site/
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/personal-site;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # 404 page
    error_page 404 /404.html;
}
```

## Content Updates

1. Write Markdown files in `src/content/work/` or `src/content/life/`
2. Run `npm run build`
3. Upload new `dist/`
