// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
  // App root element
  root: "#app",
  // App Name
  name: "My App",
  // App id
  id: "com.myapp.test",
  // Enable swipe panel
  panel: {
    swipe: "left",
  },
  toolbar: {
    hideOnPageScroll: true,
  },
  // Add default routes
  routes: [
    {
      path: "/index/",
      url: "index.html",
    },
    {
      path: "/login/",
      url: "login.html",
    },
    {
      path: "/register/",
      url: "register.html",
    },
    {
      path: "/user/",
      url: "user.html",
    },
    {
      path: "/random/",
      url: "random.html",
    },
    {
      path: "/search/",
      url: "search.html",
    },
  ],
  // ... other parameters
});

var mainView = app.views.create(".view-main");

var userName, name, email, photoUrl, uid, emailVerified;

// Handle Cordova Device Ready Event
$$(document).on("deviceready", function () {
  console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on("page:init", function (e) {
  // Do something here when page loaded and initialized
});

$$(document).on("page:init", '.page[data-name="index"]', function (e) {
  // Do something here when page with data-name="index" attribute loaded and initialized
  welcome();
  // create searchbar
var searchbar = app.searchbar.create({
  el: '.searchbar',
  searchContainer: '.list',
  searchIn: '.item-title',
  on: {
    search(sb, query, previousQuery) {
      console.log(query, previousQuery);
    }
  }
});

  $$("#btnRv").on("click", randomButtonV);
  $$(".open-preloader-indicator").on("click", loadM);
  $(document).ready(function () {
    $("#btnSmore, #spanBtn").click(function () {
      $("#sManga").toggleClass("sMangaMore");
      $("#spanBtn").text() === "Cerrar"
        ? $("#spanBtn").text("Leer más")
        : $("#spanBtn").text("Cerrar");
    });
  });
});

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on("page:init", '.page[data-name="login"]', function (e) {
  // Do something here when page with data-name="login" attribute loaded and initialized
  $$("#log").on("click", logIn);
  $$("#log").on("click", userIn);
});

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on("page:init", '.page[data-name="register"]', function (e) {
  // Do something here when page with data-name="register" attribute loaded and initialized
  $$("#reg").on("click", registerUser);
  $$("#reg").on("click", uName);
});

$$(document).on("page:init", '.page[data-name="user"]', function (e) {
  // Do something here when page with data-name="user" attribute loaded and initialized
  $$("#lgout").on("click", logOut);
});

$$(document).on("page:init", '.page[data-name="random"]', function (e) {
  // Do something here when page with data-name="random" attribute loaded and initialized
  $$('#loadMessage').html('<p style="position: absolute;top: 45%;left: 10%;inline-size: 300px;">Toque el botón de Random para obtener un título de Manga al Azar.</p>');
  $$("#pfilter").on("range:change", pFilterManga);
  $$("#yfilter").on("range:change", yFilterManga);
  $$("#btnRu").on("click", randomButtonU);
  $$(".open-preloader-indicator").on("click", loadM);
  $(document).ready(function () {
    $("#btnSmore, #spanBtn").click(function () {
      $("#sManga").toggleClass("sMangaMore");
      $("#spanBtn").text() === "Cerrar"
        ? $("#spanBtn").text("Leer más")
        : $("#spanBtn").text("Cerrar");
    });
  });
});

$$(document).on("page:init", '.page[data-name="search"]', function (e) {
  // Do something here when page with data-name="index" attribute loaded and initialized
  $$('#selectOrder').on('change', function () {
    $$('#containerSearch').html("");
    
    return searchMangaPages();
  });
  // create searchbar
  var searchbar = app.searchbar.create({
    el: ".searchbar",
    searchContainer: ".list",
    searchIn: ".item-title",
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      },
    },
  });
  return [loadImgManga(), searchMangaPages()];
});

function userIn() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var db = firebase.firestore();
      var email = $$("#logEmail").val();
      claveDeColeccion = email;
      var docRef = db.collection("Usuarios").doc(claveDeColeccion);

      docRef
        .get()
        .then(function (doc) {
          $$("#userInfo").html("");
          if (doc.exists) {
            console.log("Document data:", doc.data().nombre);
            var n = doc.data().nombre;
            $$("#userInfo").append(
              "<h1>Bienvenid@ " + "<b>" + n + "</b>" + "</h1>"
            );
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function (error) {
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
}

function registerUser() {
  var email = $$("#regEmail").val();
  var password = $$("#regPass").val();

  if (userName == "" || email == "" || password == "") {
    alert("Error, complete todos los campos!");
  } else {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)

      .then(function () {
        alert("Registro completado!");
        app.views.main.router.navigate("/login/");
      })

      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  }
}

function uName() {
  var db = firebase.firestore();
  var colUsuarios = db.collection("Usuarios");
  var email = $$("#regEmail").val();

  claveDeColeccion = email;
  userName = $$("#regUser").val();

  datos = {
    nombre: userName,
  };

  colUsuarios.doc(claveDeColeccion).set(datos);
}

function logIn() {
  var email = $$("#logEmail").val();
  var password = $$("#logPass").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)

    .then(function () {
      console.log("Ingreso correcto!");
      app.views.main.router.navigate("/user/");
    })

    .catch(function (error) {
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
  firebase
    .auth()
    .signOut()

    .then(function () {
      console.log("Se ha cerrado sesión!");
      app.views.main.router.navigate("/index/");
    })

    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
}

function randomButtonV() {
  //Se esta llamando al TOP MANGA de la API, y se esta tomando el valor del ID.

  loadM();

  num = Math.floor(Math.random() * 1047) + 1;

  url = "https://api.jikan.moe/v3/top/manga/" + num;

  app.request.json(url, function (dR) {
    topLength = dR.top.length;

    rN = Math.floor(Math.random() * topLength);

    m = dR.top[rN].mal_id;
    //console.log(m);

    //Aca se usa el ID ya generado para usar sus datos.

    var url = "https://api.jikan.moe/v3/manga/" + m;
    //console.log(url);

    app.request.json(
      url,
      function (datosRecibidos) {
        //Imagen del Manga.
        imgManga = datosRecibidos.image_url;

        //Titulo del Manga.
        tManga = datosRecibidos.title;

        //Tipo de Manga.
        tyManga = datosRecibidos.type;

        //Puntuación del Manga.
        pManga = datosRecibidos.score;

        //Sinopsis del Manga.
        sManga = datosRecibidos.synopsis;

        if (sManga == null) {
          console.log("Este Manga no tiene sinopsis");
          $$("#sManga").html(
            "<p>Looking for information on the " +
              tyManga +
              " " +
              tManga +
              "? Find out more with MyAnimeList, the world" +
              "'" +
              "s most active online anime and manga community and database.</p>"
          );
        } else {
          $$("#sManga").html(sManga);
        }

        //Año del Manga.
        yManga = datosRecibidos.published.prop.from.year;

        //Url del Manga.
        lManga = datosRecibidos.url;

        //Autor/es del Manga.
        var arrAuthors = datosRecibidos.authors.length;
        var aManga = "";
        for (var i = 0; i < arrAuthors; i++) {
          aManga = datosRecibidos.authors[i].name + " ";
          $$("#aManga").html(aManga);
        }

        //Genero/s del Manga.
        var arrGenres = datosRecibidos.genres.length;
        var gManga = "";
        $$("#gManga").html("");

        for (var i = 0; i < arrGenres; i++) {
          gManga = datosRecibidos.genres[i].name + " ";
          malId = datosRecibidos.genres[i].mal_id;
          //console.log(malId);

          $$("#gManga").append(
            '<div class="button button-outline button-round button-raised color-red text-color-white swiper-slide" id="idManga' +
              malId +
              '">' +
              gManga +
              "</div>"
          );

          //Para excluir algunos generos.
          /*if (malId == 12 || malId == 33 || malId == "" || malId == 0) {
            console.log("Genero excluido");

            /*tManga = "";
            gManga = "";
            /*aManga = "";
            pManga = "";
            sManga = "";
            imgManga = "";

            $$("#sManga").html(sManga);
            $$("#tManga").html(tManga);
            $$("#gManga").html(gManga);
            /*$$("#aManga").html(aManga);
            $$("#pManga").html(pManga);
            $$("#imgManga").attr("src", imgManga);
            return [loadM(), randomButtonV()];
          }*/
        }

        $$('#welcome').html("");
        $$("#pManga").html(pManga);
        $$("#imgManga").attr("src", imgManga);
        $$("#tManga").html(tManga);
        $$("#tyManga").html(tyManga + "<hr>");
        $$("#spanBtn").html(
          '<span style="color: #de690c" id="btnSmore">Leer más</span>'
        );
        $$("#lManga").html(lManga);
        $$("#yManga").html(yManga);
        $$("#bImg").html(
          '<div class="bimgM" style="background-image: url(' +
            imgManga +
            ')"></div>');
      }, fnErrorV);
  });
}

function fnErrorV() {
  console.log("Solo entra acá si no funciona");
  return randomButtonV();
}

function randomButtonU() {
  //Se esta llamando al TOP MANGA de la API, y se esta tomando el valor del ID.

  loadM();

  num = Math.floor(Math.random() * 270) + 1;

  url = "https://api.jikan.moe/v3/top/manga/" + num;

  app.request.json(url, function (dR) {
    topLength = dR.top.length;

    rN = Math.floor(Math.random() * topLength);

    m = dR.top[rN].mal_id;
    console.log(m);

    //Aca se usa el ID ya generado para usar sus datos.

    var url = "https://api.jikan.moe/v3/manga/" + m;
    console.log(url);

    app.request.json(
      url,
      function (datosRecibidos) {
        //Imagen del Manga.
        imgManga = datosRecibidos.image_url;

        //Titulo del Manga.
        tManga = datosRecibidos.title;

        //Titulo en ingles del Manga.
        tEManga = datosRecibidos.title_english;

        if (tEManga == null) {
          $$("#tEManga").html("");
        } else {
          $$("#tEManga").html("(" + tEManga + ")");
        }

        //Tipo de Manga.
        tyManga = datosRecibidos.type;

        //Estado del Manga.
        eManga = datosRecibidos.status;

        //Puntuación del Manga.
        var pManga = datosRecibidos.score;

        var v0 = $$(".p0").text();
        var v1 = $$(".p1").text();

        if (pManga < v0 || pManga >= v1) {
          console.log("No es el puntaje solicitado");
          pManga = "";
          $$("#pManga").html(pManga);
          return randomButtonU();
        }

        $$("#pManga").html(pManga);

        //Sinopsis del Manga.
        if (sManga == null) {
          console.log("Este Manga no tiene sinopsis");
          $$("#sManga").html(
            "<p>Looking for information on the " +
              tyManga +
              " " +
              tManga +
              "? Find out more with MyAnimeList, the world" +
              "'" +
              "s most active online anime and manga community and database.</p>"
          );
        } else {
          $$("#sManga").html(sManga);
        }

        //Año del Manga.
        var yManga = datosRecibidos.published.prop.from.year;

        var y1 = $$(".y1").text();
        var y2 = $$(".y2").text();

        if (yManga < y1 || yManga > y2) {
          console.log("No es el año solicitado");
          pManga = "";
          $$("#pManga").html(pManga);
          return randomButtonU();
        }

        if (yManga == null) {
          $$("#pManga").html("");
        } else {
          $$("#yManga").html(yManga + "<hr>");
        }

        //Url del Manga.
        lManga = datosRecibidos.url;

        //Autor/es del Manga.
        var arrAuthors = datosRecibidos.authors.length;
        var aManga = "";
        for (var i = 0; i < arrAuthors; i++) {
          aManga = datosRecibidos.authors[i].name + " ";
          $$("#aManga").html(aManga);
        }

        //Genero/s del Manga.
        var arrGenres = datosRecibidos.genres.length;
        var gManga = "";
        $$("#gManga").html("");

        for (var i = 0; i < arrGenres; i++) {
          gManga = datosRecibidos.genres[i].name + " ";
          malId = datosRecibidos.genres[i].mal_id;
          //console.log(malId);

          $$("#gManga").append(
            '<div class="button button-outline button-round button-raised color-red text-color-white swiper-slide" id="idManga' +
              malId +
              '">' +
              gManga +
              "</div>"
          );

          /*if (malId == chk) {
            $$('#gManga').append('<div class="col-40 button button-outline button-round button-raised color-red text-color-white idManga" id="idManga' + malId + '">' + gManga + '</div>');    
          }

          //Para excluir algunos generos.
          if (malId == 12 || malId == 33 || malId == "" || malId == 0) {
            //console.log("Genero excluido");

            tManga = "";
            gManga = "";
            aManga = "";
            pManga = "";
            sManga = "";
            imgManga = "";

            $$('#sManga').html(sManga);
            $$('#tManga').html(tManga);
            $$('#gManga').html(gManga);
            $$('#aManga').html(aManga);
            $$('#pManga').html(pManga);
            $$('#imgManga').attr('src',imgManga);
            return randomButton();
          }

          if (malId != chk) {
            //console.log("Genero excluido");

            tManga = "";
            gManga = "";
            aManga = "";
            pManga = "";
            sManga = "";
            imgManga = "";

            $$('#sManga').html(sManga);
            $$('#tManga').html(tManga);
            $$('#gManga').html(gManga);
            $$('#aManga').html(aManga);
            $$('#pManga').html(pManga);
            $$('#imgManga').attr('src',imgManga);
            return randomButton();
          }*/
        }

        $$('#loadMessage').html("");
        $$("#imgManga").attr("src", imgManga);
        $$("#tManga").html(tManga);
        $$("#tyManga").html(tyManga + "<hr>");
        $$("#pManga").html(pManga + "<hr>");
        $$("#spanBtn").html(
          '<span style="color: #de690c" id="btnSmore">Leer más</span>'
        );
        $$("#eManga").html(eManga + "<hr>");
        $$("#sManga").html(sManga);
        $$("#lManga").html(lManga);
        $$(".itmO").html("Synopsis");
        $$("#bImg").html(
          '<div class="bimgM" style="background-image: url(' +
            imgManga +
            ')"></div>'
        );
      },
      fnErrorU
    );
  });
}

function fnErrorU() {
  console.log("Solo entra acá si no funciona");
  return randomButtonU();
}

function pFilterManga(e) {
  var range = app.range.get(e.target);
  $$(".p0").text(range.value[0]);
  $$(".p1").text(range.value[1]);
}

function yFilterManga(e) {
  var range = app.range.get(e.target);
  $$(".y1").text(range.value[0]);
  $$(".y2").text(range.value[1]);
}

function loadImgManga() {
  // Loading flag
  var allowInfinite = true;

  // Last loaded index
  var lastItemIndex = $$("#containerSearch img").length;
  console.log(lastItemIndex);
  // Max items to load
  var maxItems = 5000;

  // Append items per load
  var itemsPerLoad = 50;

  // Attach 'infinite' event handler
  $$(".infinite-scroll-content").on("infinite", function () {
    // Exit, if loading in progress
    console.log("entró!");
    if (!allowInfinite) return;

    // Set loading flag
    allowInfinite = false;

    // Emulate 1s loading
    setTimeout(function () {
      // Reset loading flag
      allowInfinite = true;

      if (lastItemIndex >= maxItems) {
        // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
        app.infiniteScroll.destroy(".infinite-scroll-content");
        // Remove preloader
        $$(".infinite-scroll-preloader").remove();
        return;
      }

      // Update last loaded index
      lastItemIndex = $$("#containerSearch img").length;
      console.log(lastItemIndex);

      // Generate new items HTML
      searchMangaPages();
    }, 1000);
  });
}

function searchMangaPages(lastItemIndex) {

  var lastItemIndex = $$("#containerSearch img").length;

  var x = lastItemIndex / 50;
  const array = [1 + x];
  array.forEach(function (index) {
    //console.log(index);
    loadSearchManga(index);
    console.log(x);
  });
}

function loadSearchManga(index) {  
  
  if ($$('#selectOrder').val() == "1") {
    var url = "https://api.jikan.moe/v3/search/manga?q=&order_by=score&sort=desc&page=" + index;
  } else if ($$('#selectOrder').val() == "2") {
    var url = "https://api.jikan.moe/v3/search/manga?q=&page=" + index + "&letter="
  }

    app.request.json(url, function (searchDataLetter) {
      var r = searchDataLetter.results.length;
      
      //console.log("largo de " + index + " es " + r);
      for (var i = 0; i < r; i++) {
        searchTitle = searchDataLetter.results[i].title;
        searchImg = searchDataLetter.results[i].image_url;
        //--> NO USAR //  $$("#searchImg" + i).attr('src', searchImg);
        //$$("#containerSearch").append('<li class="item-title"><img src="' + searchImg + '" id="searchImg_' + index + "_" + i + '" class="searchImg" /><p id="searchTitle_' + index + "_" + i + '" class="searchTitle">' + searchTitle + "</p></li>");
        $$("#containerSearch").append('<li><img src="' + searchImg + '" id="searchImg_' + index + "_" + i + '" class="searchImg" /><p id="searchTitle_' + index + "_" + i + '" class="searchTitle item-title">' + searchTitle + '</p></li>');
      }
  });
}

/*function gCBManga(e) {

        var totalChecked = $$('[name="demo-checkbox-movie"]:checked').length;
        if (totalChecked === 0) {
          $$('[name="demo-checkbox-movies"]').prop('checked', false);
        } else if (totalChecked === 2) {
          $$('[name="demo-checkbox-movies"]').prop('checked', true);
        }
        if (totalChecked === 1 || totalChecked === 2 || totalChecked === 3) {
          $$('[name="demo-checkbox-movies"]').prop('indeterminate', true);
        } else {
          $$('[name="demo-checkbox-movies"]').prop('indeterminate', false);
        }

      // Parent checkbox change
      $$('[name="demo-checkbox-movies"]').on('change', function (e) {
        if (e.target.checked) {
          $$('[name="demo-checkbox-movie"]').prop('checked', true);
        } else {
          $$('[name="demo-checkbox-movie"]').prop('checked', false);
        }
      });
}*/

function loadM() {
  app.preloader.show();
  setTimeout(function () {
    app.preloader.hide();
  }, 3000);
}

function welcome() {
  $$('#welcome').html('<div style="display: flex;flex-flow: column;justify-content: center;align-items: center;"><h1>Bienvend@ a </h1><h2 style="font-size:20px">"Random Manga Generator"</h2><p style="inline-size:230px;margin-bottom: 50px">Toque el botón para obtener título de Manga al azar.</p></div>')
}