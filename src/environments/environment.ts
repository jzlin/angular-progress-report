// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAkEi5x-_ykyPURxv1nn9R4Vn6i_STG5Ow",
    authDomain: "angular-progress-report.firebaseapp.com",
    databaseURL: "https://angular-progress-report.firebaseio.com",
    projectId: "angular-progress-report",
    storageBucket: "angular-progress-report.appspot.com",
    messagingSenderId: "848107263715"
  }
};
