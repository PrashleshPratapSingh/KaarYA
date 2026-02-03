# Fix npm Peer Dependency Errors (OPTIONAL)

## You DON'T need to do this for the messaging interface!
## Only do this if you want to install OTHER packages later.

## Option 1: Update @types/react (Recommended)
Open package.json and change:
```json
"@types/react": "~18.2.14"
```
To:
```json
"@types/react": "~19.1.0"
```

Then run:
```bash
npm install
```

## Option 2: Use --legacy-peer-deps flag
When installing NEW packages:
```bash
npm install <package-name> --legacy-peer-deps
```

## Option 3: Use --force flag (not recommended)
```bash
npm install --force
```

## BUT REMEMBER:
Your messaging interface works WITHOUT any of these fixes!
The npm errors don't affect your current app functionality.
