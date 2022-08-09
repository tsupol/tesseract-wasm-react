# Tesseract WASM React

## How to run

`npm install`

then run build android/ios Native Platforms

`ionic capacitor build android`
`ionic capacitor build ios`

then configure the project

`npm run configure`

now you can proceed to use AndroidStudio/XCode

## After edited the code

update the code to the Native Platforms.

`npx cap sync`

now the code is updated. You now proceed in AndroidStudio/XCode

## Permissions

Make sure you have these line in your `AndroidManifest.xml`

Note: you should already have this from using `npm run configure` earlier.

```xml
<!-- Video Camera -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
```

## Note
I was developing using node v16.16.0.

Cannot use `ngx-camera`, using `react-camera` instead


