var url = "https://en.wikipedia.org/w/api.php?action=opensearch&datatype=json&limit=10&callback=?&search=";

$('document').ready(function() {
  
  $('#searchInput').on('focus', function(){
    $(':input').unbind('keydown');
    $(':input').on('keydown', function(e) {
    var searchValue = $(':input').val();
      if(e.which === 13) {
        e.preventDefault();
        e.stopPropagation();
        loading();
        search(searchValue);
        searchValue = '';
        $(':input').blur();
      }    
    });
    
  });

  $(':input').on('blur', function(){
    $(':input').val('');
  });
  
  $('#randomButton').on('click', function(e){
       e.preventDefault();
       loading();
       randomArticle();
  });
});

function search(searchValue) {
    var searchValue = searchValue;
    var query =  url + encodeURIComponent(searchValue);
    $.getJSON(query, function(response) {
        $('#main').empty();
        if(searchValue === "") {
          randomArticle();
        } else if (response[1].length === 0) {
          errorSearch(searchValue);
        } else {
          var data = response;
          for (var i = 0; i < data[1].length; i++) {
            addResultsToElement(data, i);
          }
        }
      $('#searchInput').fadeIn(400);
    });
};

function loading() {
  $('#main').empty();
  var loadingDiv = document.createElement('div');
  $(loadingDiv).addClass("loader");
  $('#main').append(loadingDiv);
};

function addResultsToElement(data, i) {
  var elementA = document.createElement('a');
  elementA.setAttribute('href', data[3][i]);
  var elementH4 = document.createElement('h4');
  $(elementH4).text(data[1][i]);
  var elementP = document.createElement('p');
  $(elementP).text(data[2][i]);
  var elementDiv = document.createElement('div');
  $(elementDiv).addClass("results text-center");
  $(elementDiv).append(elementH4).append(elementP);
  $(elementA).append(elementDiv);
  $('#main').append(elementA);
  $(".results").each(function(index){
    $(this).delay(300*index).fadeIn(100);
  });
}


function randomArticle() {
  var randomUrl = "https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exintro=&explaintext=&titles=&format=json&callback=?";
  var pageidAPI = "https://en.wikipedia.org/w/api.php?action=query&prop=info&inprop=url&format=json&pageids="
  $.getJSON(randomUrl, function(response){
    $('#main').empty();
    var key = Object.keys(response.query.pages);
    var pageID = response.query.pages[key].pageid;
    var query = pageidAPI + pageID + "&callback=?";
    var extract = response.query.pages[key].extract;
    var elementDiv = document.createElement('div');
    $.getJSON(query, function(response){
      var key = Object.keys(response.query.pages);
      var fullurl = response.query.pages[key].fullurl;
      var title = response.query.pages[key].title;
      var elementA = document.createElement('a');
      var elementH = document.createElement('h3');
      $(elementH).text(title);
      $(elementA).attr({
        "href": fullurl,
        "target": "_blank",
        "title": "click here for the full Wikipedia article"
       });
      $(elementDiv).addClass('results text-center');
      $(elementDiv).append(elementH);
      $(elementDiv).append(extract);
      $(elementA).append(elementDiv);
      $('#main').append(elementA);
      $(elementDiv).fadeIn(500);
    });  
  });
};

function errorSearch(searchValue){
  var elementDiv = document.createElement('div');
  $(elementDiv).addClass('error');
  var elementH = document.createElement('h4');
  $(elementH).text("Sorry, we couldn't find any " +  searchValue  + ' articles.');
  $(elementDiv).append(elementH);
  $('#main').append(elementDiv);
  $(elementDiv).fadeIn(400);
}