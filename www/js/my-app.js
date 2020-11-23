  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/index/',
        url: 'index.html',
      },
      {
        path: '/register/',
        url: 'register.html',
      },
      {
        path: '/user/',
        url: 'user.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

var userName, name, email, photoUrl, uid, emailVerified;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");

    $$('#btnR').on('click', randomButton);




    firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                // User is signed in.
                var db = firebase.firestore();
                var email = $$('#logEmail').val();
                claveDeColeccion = email;
                var docRef = db.collection("Usuarios").doc(claveDeColeccion);

                docRef.get().then(function(doc) {
                    if (doc.exists) {
                        console.log("Document data:", doc.data().nombre);
                        var n = doc.data().nombre;
                        $$('#userInfo').append("<h1>Bienvenid@ " + "<b>" + n + "</b>" + "</h1>");
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
                  
                  /*var db = firebase.firestore();
                  var colUsuarios = db.collection("Usuarios");

                      colUsuarios.get()
                          .then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                              n = doc.data().nombre;
                              $$('#userInfo').append("<p>Bienvenid@ " + "<b>" + n + "</b>" + "</p>");

                            });

                          })
                          .catch(function(error) {
                              console.log("Error: ", error);
                          } );*/

              } else {
                // No user is signed in.
              }
            });

});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="register"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    $$('#reg').on('click', registerUser);
    $$('#reg').on('click', uName);

});

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    $$('#log').on('click', logIn);
});

$$(document).on('page:init', '.page[data-name="user"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    $$('#lgout').on('click', logOut);

});

function registerUser() {

        var email = $$('#regEmail').val();
        var password = $$('#regPass').val();

        if (userName == "" || email == "" || password == "") {
                alert("Error, complete todos los campos!");
            } else {

                firebase.auth().createUserWithEmailAndPassword(email, password)

                    .then(function(){
                        alert("Registro completado!");
                        app.views.main.router.navigate('/index/');
                    })


                    .catch(function(error) {
                          // Handle Errors here.
                          var errorCode = error.code;
                          var errorMessage = error.message;
                          // ...
                });
                
                
        }

    }

function uName() {

    var db = firebase.firestore();
    var colUsuarios = db.collection('Usuarios');
    var email = $$('#regEmail').val();

        claveDeColeccion = email;
        userName = $$('#regUser').val();

        datos = {
            nombre: userName
        }

        colUsuarios.doc(claveDeColeccion).set(datos)

}

function logIn() {

        var email = $$('#logEmail').val();
        var password = $$('#logPass').val();

            firebase.auth().signInWithEmailAndPassword(email, password)

            .then(function(){
                console.log('Ingreso correcto!');
                app.views.main.router.navigate('/user/');
            })


            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              if (email == "" || password == "") {
                console.log("Datos incompletos!");
              } else {
                console.log("Email y/o contraseña incorrectos");
              }   
              console.log(error);
        });
    }

function logOut() {

        firebase.auth().signOut()

            .then(function(){
                console.log("Se ha cerrado sesión!");
                app.views.main.router.navigate('/index/');
            })


            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
    }

function randomButton() {

  var numero = Math.floor(Math.random() * 88531) + 1;

  var url = 'https://api.jikan.moe/v3/manga/' + numero;

  app.request.json(url, function (datosRecibidos) {

      imgManga = datosRecibidos.image_url;

      var arrAuthors = datosRecibidos.authors.length;
      var aManga = "";
      for(var i = 0; i < arrAuthors; i++) {
        aManga += datosRecibidos.authors[i].name + " ";
        $$('#aManga').html(aManga);
      }

      tManga = datosRecibidos.title;

      var arrGenres = datosRecibidos.genres.length;
      var gManga = "";
      for(var i = 0; i < arrGenres; i++) {
        gManga += datosRecibidos.genres[i].name + " ";
        $$('#gManga').html('<div class="col button button-fill button-round">' + gManga + '</div>');

        var genreEx = datosRecibidos.genres[i].mal_id;
        console.log(genreEx);

        if (genreEx == 12 || genreEx == 33) {
          console.log("Genero excluido");
          gManga = "";
          $$('#gManga').html(gManga)
          return randomButton();
        }
      }

      pManga = datosRecibidos.score;
      sManga = datosRecibidos.synopsis;
      lManga = datosRecibidos.url;

      $$('#imgManga').attr('src',imgManga);
      $$('#tManga').html(tManga);
      $$('#pManga').html(pManga);
      $$('#sManga').html(sManga);
      $$('#lManga').html(lManga);
    }, fnError);
}

function fnError() {
  console.log("Solo entra acá si no funciona");
  return randomButton();
}