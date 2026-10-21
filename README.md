# Kudanil charter map (Webflow build)

Built files for the interactive schedule map on kudanil.com, served through jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Saudara-Agency/kudanil-charter-map@v1.0.3/charter-map.webflow.css">
<script src="https://cdn.jsdelivr.net/gh/Saudara-Agency/kudanil-charter-map@v1.0.3/charter-map.webflow.js" defer></script>
```

The script mounts on any element with `data-ke-map-root` and reads trips from a hidden Webflow Collection List (`[data-ke-trip]` items). Source lives in the agency workspace; do not edit these files by hand. Release a new tag for every change.

Fonts are not included: the page uses the Forma DJR fonts kudanil.com already loads.
