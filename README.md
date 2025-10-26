# ISHTRIKSHA (RAKSHA) - Women’s Safety Web App

This is a fully working front-end prototype with:
- Splash screen
- Dashboard with SOS
- Emergency banner and simulated session flow
- Emergency contacts (add/edit/delete, localStorage)
- History view
- Police station lookup (by PIN code)
- Settings (SOS timeout, recording toggle, location sharing, data retention)

## Run locally
1. Open `index.html` in your browser.
2. Interact with the app:
   - Tap SOS (countdown configurable in Settings).
   - Add emergency contacts.
   - Share current location (uses browser geolocation).
   - Lookup police stations by PIN (uses sample data).

## Package into a ZIP
Create a zip named `ISHTRIKSHA.zip` that contains the entire `ISHTRIKSHA` folder:

- Windows (Explorer):
  - Right-click the `ISHTRIKSHA` folder → Send to → Compressed (zipped) folder → name it `ISHTRIKSHA.zip`.

- macOS (Finder):
  - Right-click the `ISHTRIKSHA` folder → Compress "ISHTRIKSHA" → rename to `ISHTRIKSHA.zip`.

- Linux/macOS (Terminal):
  ```bash
  zip -r ISHTRIKSHA.zip ISHTRIKSHA
  ```

## Notes
- Data persists in the browser’s localStorage (`rakshaData` key).
- No backend is connected—SOS flow and notifications are simulated.
- Font loads from a CDN; internet is required for that asset.

## Next steps (optional)
- Make it a PWA (installable).
- Add a real backend (Node/Express, Django, etc.) to send SMS/calls and store sessions.
- Convert to React/Next.js for scalability.