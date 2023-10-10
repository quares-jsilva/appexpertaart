# Experta ART

App Mobile Experta ART.

## Requerimientos

- [React Native environment](https://reactnative.dev/docs/environment-setup)
- Environment files (incluidos en el repositorio)
- Node version: 16.13.0
- Android 33, build tools 33.0.0
- Ruby >= 2.6.10
- Cocoapods >= 1.12
- Xcode

## Instalación

Para instalar todos los paquetes y módulos de Node del proyecto, debemos ejecutar desde la raiz del proyecto el siguiente comando.

```bash
npm install
```

## Levantar el proyecto de forma local (Android)

Para poder levantar el proyecto de forma local, para desarrollar y poder debuggear, tenemos que ejecutar alguno de los siguientes comandos.

```js
// Ambiente testing o development.
npm run android:development

// Ambiente productivo
npm run android:production
```

De esa manera levantaremos el proyecto de forma local, pero tomando los archivos .env según corresponda el ambiente.

## Levantar el proyecto de forma local (iOS)

Para levantar el proyecto de forma local en iOS necesitaremos una Mac con Xcode instalado.

Lo primero que deberíamos hacer es realizar la instalación de los Pods. Para eso ejecutaremos el siguiente comando en la carpeta ios del proyecto:

```bash
pod install
```

Luego de eso podremos levantar el proyecto de forma local con el siguiente comando:

```bash
npm run ios
```

En iOS para levantar los diferentes ambientes productivos lo que tendríamos que hacer es pisar los archivos `.env`. Por defecto se toma el .env por lo que si queremos levantar el ambiente productivo, no deberíamos hacer mas nada. En cambio, si quisiéramos levantar el ambiente de testing, deberíamos pisar el archivo `.env` con las variables definidas en el archivo `.env.development`.

Otra manera de levantar el proyecto de forma local es dirigirnos a Xcode y presionar en el botón de Run. Eso nos compilara el proyecto y lo levantara localmente para desarrollo.

## Generación de APK

Para generar el apk tenemos que ejecutar el siguiente comando:

```js
// Productivo
npm run android:build:production:apk

// Testing
npm run android:build:development:apk
```

Esto nos generara un compilado (productivo o de testing, según corresponda) dentro de la carpeta `android/app/build/outputs/apk/release/`.

## Generación del AAB

Para generar el AAB, tendremos que ejecutar el siguiente comando desde la carpeta root del proyecto.:

```bash
// Productivo
npm run android:build:production:aab

// Testing
npm run android:build:development:aab
```

Esto nos generara un compilado que nos servirá para subir en el Play Store dentro de la carpeta `android/app/build/outputs/bundle/release/`.

## Generación del IPA

Para la generación del IPA tenemos que tener en cuenta varias cuestiones. Por un lado lo primero que tenemos que realizar cuando queramos generar un compilado es pisar el archivo `.env` con el archivo `.env.development` ó `.env.production` según corresponda al ambiente que queramos generar.

Luego de eso debemos generar de nuevo el archivo `main.jsbundle`, para generar de nuevo dicho archivo debemos ejecutar el siguiente comando desde la carpeta root del proyecto.

```bash
npx react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios
```

Luego de eso tendremos que seguir los siguientes pasos:

- Abrir nuestro proyecto en XCode
- Seleccionar como objetivo de nuestro proyecto la opción Any iOS Device (arm64) o Generic iOS Device.
- Seleccionamos `Product` y luego la opción `Clean Build Folder`.
- Luego de nuevo en el menú Product seleccionamos la opción `Archive`. - Una vez que finalice el proceso de Archive veremos nuestra aplicación en un listado debajo de Archives.
- Seleccionamos nuestra app y apretamos en la opción `Distribute App`.
- Debemos seleccionar un método para exportar, ahí tenemos tres opciones válidas: `Ad Hoc`, `Enterprise`, ó `Development`.
- Setear las opciones de Distribución:
  - App Thinning: All compatible device variants.
  - Dejar marcado la opción Rebuild from Bitcode
  - Dejar desmarcada la opción include manifest for over-the-air installation.
- Seleccionar el certificado de distribución y el Perfil correspondiente generados previamente. Esto nos generará un archivo cuya extensión es .ipa
- Una vez finalizada la generación, el proceso estará completo, quedará solo hacer click en `Export` y elegir donde queremos que se nos guarde el IPA.
