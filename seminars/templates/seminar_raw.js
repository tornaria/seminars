function embed_schedule(){
function load_data() {
  console.log("load_data");
  $.each($('.embeddable_schedule'), function(i, div) {
    var shortname = div.getAttribute('shortname');
    var daterange = div.getAttribute('daterange');
    var url = "{{ url_for('show_seminar_json', shortname='_SHORTNAME_', _external=True, _scheme=scheme) }}".replace('_SHORTNAME_', shortname) ;
    var display_knowl = div.getAttribute('noabstract') === null;
    console.log(display_knowl);
    var display_header = div.getAttribute('noheader') === null;
    if (div.getAttribute('format')) {
      var format = div.getAttribute('format');
    } else {
      var format = 'MMMM D, hh:mm';
    }
    console.log(url);
    console.log(daterange);
    $.ajax({
      type: "GET",
      url: url,
      data: {'daterange' : daterange},
      async: false,
      dataType: 'jsonp',
      crossDomain: true}).done(
        //success:
        function( data ) {
          console.log("calling call");
          // build header
          table = document.createElement('table');
          if( display_header ) {
            thead = document.createElement('thead')
            row = document.createElement('tr');
            col = document.createElement('th');
            col.textContent = "Time";
            row.appendChild(col);
            col = document.createElement('th');
            col.textContent = "Speaker";
            row.appendChild(col);
            col = document.createElement('th')
            col.textContent = "Title";
            row.appendChild(col);
            thead.appendChild(row);
            table.appendChild(thead);
          }
          // build the rest of the table
          tbody = document.createElement('tbody');
          $.each( data, function( i, item ) {
            row = document.createElement('tr');
            col = document.createElement('td');
            col.textContent = moment(item.start_time).format(format);
            row.appendChild(col);
            col = document.createElement('td');
            if( item.speaker_homepage ) {
              a = document.createElement('a')
              a.href = item.speaker_homepage;
              a.textContent = item.speaker;
              col.appendChild(a);
            } else {
              span = document.createElement('span');
              span.textContent = item.speaker;
              col.appendChild(span);
            }
            if( item.speaker_affiliation ) {
              span = document.createElement('span');
              span.textContent = ' (' + item.speaker_affiliation + ')';
              col.appendChild(span);
            }
            row.appendChild(col);
            col = document.createElement('td');
            if( display_knowl &&  item.abstract) {
              a = document.createElement('a');
              a.title = item.title;
              a.textContent = item.title;
              a.setAttribute('knowl', 'dynamic_show');
              a.href = '#';
              var kwargs = "<div>";
              item.abstract.split('\n\n').forEach(
                paragraph => kwargs += "<p>" + paragraph + "</p>"
              );
              kwargs += "</div>";
              a.setAttribute("kwargs", kwargs);
              col.appendChild(a);
            } else {
              col.textContent = item.title;
            }
            row.appendChild(col);
            tbody.appendChild(row);
          }
          )
          table.appendChild(tbody);
          div.appendChild(table);
        });
  });
}


katexOpts = {
  delimiters: [
    {left: "$$", right: "$$", display: true},
    {left: "\\[", right: "\\]", display: true},
    {left: "$", right: "$", display: false},
    {left: "\\(", right: "\\)", display: false}
  ],
  macros: {
"\\C": '{\\mathbb{C}}',
"\\R": '{\\mathbb{R}}',
"\\Q": '{\\mathbb{Q}}',
"\\Z": '{\\mathbb{Z}}',
"\\F": '{\\mathbb{F}}',
"\\H": '{\\mathbb{H}}',
"\\HH": '{\\mathcal{H}}',
"\\integers": '{\\mathcal{O}}',
"\\SL": '{\\textrm{SL}}',
"\\GL": '{\\textrm{GL}}',
"\\PSL": '{\\textrm{PSL}}',
"\\PGL": '{\\textrm{PGL}}',
"\\Sp": '{\\textrm{Sp}}',
"\\GSp": '{\\textrm{GSp}}',
"\\PSp": '{\\textrm{PSp}}',
"\\PSU": '{\\textrm{PSU}}',
"\\Gal": '{\\mathop{\\rm Gal}}',
"\\Aut": '{\\mathop{\\rm Aut}}',
"\\Sym": '{\\mathop{\\rm Sym}}',
"\\End": '{\\mathop{\\rm End}}',
"\\Reg": '{\\mathop{\\rm Reg}}',
"\\Ord": '{\\mathop{\\rm Ord}}',
"\\sgn": '{\\mathop{\\rm sgn}}',
"\\trace": '{\\mathop{\\rm trace}}',
"\\Res": '{\\mathop{\\rm Res}}',
"\\mathstrut": '\\vphantom(',
"\\ideal": '{\\mathfrak{ #1 }}',
"\\classgroup": '{Cl(#1)}',
"\\modstar": '{\\left( #1/#2 \\right)^\\times}',
  },
};



var headTag = document.getElementsByTagName("head")[0];
var jqTag = document.createElement('script');
jqTag.type = 'text/javascript';
jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js';
headTag.appendChild(jqTag);


var katexcssTag = document.createElement('link');
katexcssTag.rel = "stylesheet";
katexcssTag.href = "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.css";
headTag.appendChild(katexcssTag);

var katexTag = document.createElement('script');
katexTag.type = 'text/javascript';
katexTag.src = 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.js';
katexTag.defer = '';
headTag.appendChild(katexTag);

var mTag = document.createElement('script');
mTag.type = 'text/javascript';
mTag.src = "{{ url_for('static', filename='daterangepicker/moment.min.js', _external=True, _scheme=scheme) }}";
headTag.appendChild(mTag);




function defer(method) {
  if (window.jQuery && window.katex) {
    method();
  } else {
    console.log('waiting');
    setTimeout(function() { defer(method) }, 10);
  }
}


defer(function() {
  var katex2Tag = document.createElement('script');
  katex2Tag.type = 'text/javascript';
  katex2Tag.src = 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.js';
  katex2Tag.defer = '';
  headTag.appendChild(katex2Tag);
});
defer(function() {document.addEventListener("DOMContentLoaded", function() { renderMathInElement(document.body, katexOpts); });});
defer(function() {
var lmfdbTag = document.createElement('script');
lmfdbTag.type = 'text/javascript';
lmfdbTag.src = "{{ url_for('static', filename='lmfdb.js', _external=True, _scheme=scheme) }}";
headTag.appendChild(lmfdbTag);
});
defer(load_data);
};
