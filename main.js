(function() {
  var W, addclickhandler, every, handle, main, redrawimages;

  W = window;

  W.img = new Image;

  main = function() {
    var context;
    context = canvas.getContext('2d');
    context.path([[0, 0], [0, canvas.height], [canvas.width, canvas.height], [canvas.width, 0]]);
    context.stroke();
    context.font = "20px sans-serif";
    context.fillText("Drag and drop the JSON (from TexturePacker) and the tilesheet to here!", 50, 50);
    canvas.addEventListener("dragenter", function(evt) {
      evt.stopPropagation();
      return evt.preventDefault();
    });
    canvas.addEventListener("dragexit", function(evt) {
      evt.stopPropagation();
      return evt.preventDefault();
    });
    canvas.addEventListener("dragover", function(evt) {
      evt.stopPropagation();
      return evt.preventDefault();
    });
    return canvas.addEventListener("drop", function(evt) {
      var file, files, reader, _i, _len, _results;
      evt.stopPropagation();
      evt.preventDefault();
      files = evt.dataTransfer.files;
      if (files.length > 0) {
        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          reader = new FileReader;
          if (file.type.startsWith("image")) {
            reader.onload = function(evt) {
              W.img.src = evt.target.result;
              canvas.width = W.img.width;
              return canvas.height = W.img.height;
            };
            _results.push(reader.readAsDataURL(file));
          } else if (file.type.endsWith("json")) {
            reader.onload = function(evt) {
              var data;
              data = JSON.parse(evt.target.result);
              return handle(data);
            };
            _results.push(reader.readAsText(file));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    });
  };

  redrawimages = function() {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    if (W.img.src) {
      return canvas.getContext('2d').drawImage(W.img, 0, 0, canvas.width, canvas.height);
    }
  };

  handle = function(data) {
    var frame, imgs, name, _ref;
    imgs = [];
    _ref = data.frames;
    for (name in _ref) {
      frame = _ref[name];
      name = name.match(/[^\/]*$/)[0].match(/^[^\.]*/)[0] + ".json";
      imgs.push([frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h, name]);
    }
    return addclickhandler(imgs);
  };

  addclickhandler = function(imgs) {
    return canvas.addEventListener('mousemove', function(evt) {
      var context, rect, _i, _len;
      redrawimages();
      for (_i = 0, _len = imgs.length; _i < _len; _i++) {
        rect = imgs[_i];
        if (evt.inside(rect)) {
          context = canvas.getContext('2d');
          context.lineWidth = 2;
          context.font = "20px sans-serif";
          context.path([[rect[0] + 5, rect[1] + 5], [rect[0] - 5 + rect[2], rect[1] + 5], [rect[0] - 5 + rect[2], rect[1] + rect[3] - 5], [rect[0] + 5, rect[1] + rect[3] - 5]]);
          context.stroke();
          context.fillText(rect[4], rect[0] + 10, rect[1] + rect[3] - 10);
          return;
        }
      }
    });
  };

  MouseEvent.prototype.inside = function(rect) {
    return this.offsetX > rect[0] && this.offsetY > rect[1] && this.offsetX < rect[0] + rect[2] && this.offsetY < rect[1] + rect[3];
  };

  CanvasRenderingContext2D.prototype.path = function(arr) {
    var i, pt, _len;
    this.beginPath();
    for (i = 0, _len = arr.length; i < _len; i++) {
      pt = arr[i];
      if (i === (typeof 0 === "function" ? 0(this.moveTo(pt[0], pt[1])) : void 0)) {} else {
        this.lineTo(pt[0], pt[1]);
      }
    }
    return this.closePath();
  };

  String.prototype.startsWith = function(s) {
    return this.slice(0, s.length) === s;
  };

  String.prototype.endsWith = function(s) {
    return this.slice(this.length - s.length) === s;
  };

  every = function(ms, fn) {
    return setInterval(fn, ms);
  };

  document.addEventListener('DOMContentLoaded', main);

}).call(this);
