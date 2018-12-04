(() => {

  //As seen on stackoverflow source code (https://cdn.sstatic.net/Js/stub.en.js)
  String.prototype.formatUnicorn = String.prototype.formatUnicorn || function() {
    var e = this.toString();

    if (!arguments.length) { return e; }

    var t = typeof arguments[0];
    var n = 'string' == t || 'number' == t ? Array.prototype.slice.call(arguments) : arguments[0];

    for (var i in n) {
      e = e.replace(new RegExp('\\{' + i + '\\}', 'gi'), n[i]);
    }
    return e;
  };

})();

