# Tesseract WASM React

## How to run

`npm install`

then run build android

`ionic capacitor build android`

## After edited the code

update the code to the Android native platform.

`npx cap sync`

then run build android

`ionic capacitor build android`

## Permissions

Make sure you have these line in your `AndroidManifest.xml`

```xml
<!-- Video Camera -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
```

## Note
I was developing using node v16.16.0.

Cannot use `ngx-camera`, using `react-camera` instead


