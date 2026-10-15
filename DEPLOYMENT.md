# Docker and public hostname

Current state: Book Finder is running at http://127.0.0.1:8088 using its own Compose project bookfinder-cv. Public hostname https://books.dokhacson.id.vn is configured on a separate tunnel. Verified public HTTPS HTML and both JS/CSS assets return 200 on 2026-10-15. Public DNS resolvers resolve correctly; the Windows default resolver initially had stale negative DNS cache. Baitaplon uses a local tunnel configuration under its own directory; it was only inspected, never modified. A separate Book Finder tunnel was approved.

## Run only Book Finder

From PowerShell:

```powershell
cd D:\Xampp1\htdocs\BookFinderCV
docker compose -p bookfinder-cv -f compose.yaml up -d
# Stop only Book Finder web:
docker compose -p bookfinder-cv -f compose.yaml stop web
# Rebuild after source changes:
docker compose -p bookfinder-cv -f compose.yaml up -d --build web
```

Docker Desktop must be running. Port 8088 is bound to Windows loopback only. There are no database containers or volumes. Production uses Nginx and a multi-stage Node build, not the Vite development server.

## Cloudflare setup reference (completed by user)

1. Sign into https://dash.cloudflare.com with your own account. Do not share passwords or tokens in chat.
2. Open Networking > Tunnels (or Zero Trust > Networks > Tunnels in the older navigation). Create a NEW cloudflared tunnel named bookfinder-cv. Do not migrate/edit/delete the Baitaplon tunnel.
3. Select Docker in connector setup. Copy only the token value shown after --token. Do not run the generic docker command: use this project's prepared Compose instead.
4. In a local PowerShell, run ./Set-TunnelToken.ps1. Paste only the Book Finder token into its hidden prompt. The script writes .secrets/tunnel-token, ignored by Git and Docker build context. This is a local plaintext secret needed by the connector; do not upload it or send it in chat.
5. Start the separate connector:

```powershell
docker compose -p bookfinder-cv -f compose.yaml -f compose.tunnel.yaml up -d tunnel
```

6. Wait until the NEW tunnel is Healthy. Add a Published application route on this tunnel:
   - Subdomain: books
   - Domain: dokhacson.id.vn
   - Path: blank
   - Service type: HTTP
   - Service URL: web:8080 (full URL http://web:8080)
   Docker resolves web on bookfinder-cv_default. Do not use localhost:8088 inside this tunnel container.
7. Cloudflare should create a proxied DNS record for books pointing to the NEW tunnel. If books already has a record, stop and inspect it before replacing anything. Do not change @, www, existing tunnel records or wildcard rules.
8. Open https://books.dokhacson.id.vn, search a book, open details and test favorites. Check https://dokhacson.id.vn/Baitaplon/ still responds.

Cloudflare steps: https://developers.cloudflare.com/tunnel/get-started/
Token-file support: https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/run-parameters/

## Once the connector is configured

Start both Book Finder services:

```powershell
docker compose -p bookfinder-cv -f compose.yaml -f compose.tunnel.yaml up -d
```

Stop both Book Finder services only:

```powershell
docker compose -p bookfinder-cv -f compose.yaml -f compose.tunnel.yaml stop
```

Inspect:

```powershell
docker compose -p bookfinder-cv -f compose.yaml -f compose.tunnel.yaml ps
docker compose -p bookfinder-cv -f compose.yaml -f compose.tunnel.yaml logs --tail 50 tunnel
```

Do not post unreviewed logs containing credentials. All commands use the explicit bookfinder-cv project and local Compose paths. No commands here target Baitaplon. Container restart policy is unless-stopped; Docker Desktop and Windows still have to run for public access.

