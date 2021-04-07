# vpn-token
Node.js TOTP generator

This program generates a 6-digit TOTP token based on some secret, with a 30-second time window. The value is copied to your clipboard, using the `clipboardy` package.

## First time setup:

Run `npm install` in this directory to initialize dependencies.

Provide your "secret" value in a file titled `secret.raw` (as raw data), `secret.base64` (as base-64 encoded text), `secret.base32` (as base-32 encoded text), or `secret.hex` (as base-16 encoded text). Let me know if you need help locating this secret value. Don't worry, this value is not transmitted in any way, and these files are all gitignore'd.

## Running

Run `npm start` to copy the token to your clipboard. I have also provided a Windows shortcut that (might) run this for you, which is what I have pinned to my taskbar. It runs `"C:\Program Files\nodejs\node.exe" .`, which is most likely where Node is installed, but may need to be modified.
