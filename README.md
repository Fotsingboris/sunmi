# Sophopsy POS — Sunmi print shell

A minimal native Android app whose only job is to load your live site
(`https://sophopsy.leinad.ci`) inside a WebView that has the Sunmi
printer plugin registered — so `window.Capacitor.Plugins.SunmiPrinter`
exists on the page, which it never will in a plain Chrome tab.

It does **not** bundle a copy of your site. `capacitor.config.ts` points
`server.url` straight at the live URL, so this app always shows whatever
is currently deployed — you never rebuild it when the Django site
changes, only if you need to change *native* things (add another plugin,
change app icon/name, etc).

## What's already done

- `@kduma-autoid/capacitor-sunmi-printer` is installed and wired into
  the `android/` project (`npx cap sync` auto-registered it — confirmed
  by `android/app/src/main/java/.../MainActivity.java` being a plain,
  untouched `BridgeActivity` with no manual plugin-registration code).
- `capacitor.config.ts` is already set to load `https://sophopsy.leinad.ci`.
- The plugin's exposed methods were checked directly against its
  TypeScript definitions — `sendRAWBase64Data({ data: <base64> })` and
  `bindService()` (both already called from `sale_create.html`'s
  `printOnSunmiDevice()`) are exactly right; nothing to change there.

## Build it — no Android Studio needed (GitHub Actions)

This project includes `.github/workflows/build-apk.yml`, which builds the
APK on GitHub's own servers every time you push. All you need locally is
`git` — no Android SDK, no Android Studio, no Java install.

1. Create a new repository on GitHub (github.com/new) — public or
   private, doesn't matter. Don't add a README/`.gitignore` when
   creating it (this project already has its own).
2. Unzip this project folder somewhere on your machine, open a terminal
   in it, and run:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. The push triggers the build automatically. On GitHub, open your
   repo → **Actions** tab → the "Build APK" run should be in progress
   (takes ~3-5 minutes the first time).
4. When it finishes with a green check, click into that run, scroll
   down to **Artifacts**, and download `sunmi-print-shell-debug-apk`
   (a `.zip` containing `app-debug.apk` — unzip it to get the APK).

This builds a **debug** APK, signed automatically with a throwaway debug
key Gradle generates on the fly — no signing key to create yourself.
That's fine for an internal tool like this; it installs the same way as
any APK as long as "Install unknown apps" stays allowed for whatever app
you use to open it (already confirmed allowed on your P3).

To rebuild after a change (e.g. adding another plugin later), just
commit and `git push` again — same workflow runs automatically.

## Getting the APK onto the Sunmi P3

Since Developer Options wouldn't enable on that device (common on
Sunmi's business/POS units — often locked down by their own device
management, separate from ordinary Android restrictions), USB
install/`adb install` likely isn't available either. Try, in order:

1. **Direct sideload.** Get the `.apk` onto the device any way that
   doesn't need a cable — email it to yourself and open the attachment
   on the phone, upload it to Google Drive/a cloud link and download it
   in Chrome, or AirDrop-equivalent/Bluetooth transfer. Tap the
   downloaded file. Android will either install it directly or prompt
   "Install unknown apps" — if prompted, allow it *for that one app*
   (e.g. Chrome or Files) and retry. This is a different setting from
   Developer Options/USB debugging, so it's worth trying even though
   the other one was blocked.
2. **If that's also blocked** (fully locked down by Sunmi's enterprise
   management), the remaining path is Sunmi's own app distribution —
   publishing through Sunmi's developer portal so it installs via the
   device's built-in Sunmi App Store instead of a sideloaded APK. That
   requires a Sunmi developer account; happy to help with that step if
   sideloading turns out to be blocked too.

## After it's installed

Open the app (not Chrome) on the P3, navigate to the sale-creation
page as you normally would, and re-run the diagnostic:

    https://sophopsy.leinad.ci/fr/sales/create/?sunmi_debug=1

This time the alert should read `Capacitor présent : true` and list
`SunmiPrinter` under registered plugins. If so, a normal sale + print
should now go straight to the printer instead of falling back to the
browser print dialog.
