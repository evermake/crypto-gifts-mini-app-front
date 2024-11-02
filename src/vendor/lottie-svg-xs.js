// src/utils/functionExtensions.js
function extendPrototype(sources, destination) {
  var i;
  var len = sources.length;
  var sourcePrototype;
  for (i = 0; i < len; i += 1) {
    sourcePrototype = sources[i].prototype;
    for (var attr in sourcePrototype) {
      if (Object.prototype.hasOwnProperty.call(sourcePrototype, attr)) destination.prototype[attr] = sourcePrototype[attr];
    }
  }
}
function createProxyFunction(prototype) {
  function ProxyFunction() {
  }
  ProxyFunction.prototype = prototype;
  return ProxyFunction;
}

// src/utils/helpers/arrays.js
var createTypedArray = function() {
  function createRegularArray(type, len) {
    var i = 0;
    var arr = [];
    var value;
    switch (type) {
      case "int16":
      case "uint8c":
        value = 1;
        break;
      default:
        value = 1.1;
        break;
    }
    for (i = 0; i < len; i += 1) {
      arr.push(value);
    }
    return arr;
  }
  function createTypedArrayFactory(type, len) {
    if (type === "float32") {
      return new Float32Array(len);
    }
    if (type === "int16") {
      return new Int16Array(len);
    }
    if (type === "uint8c") {
      return new Uint8ClampedArray(len);
    }
    return createRegularArray(type, len);
  }
  if (typeof Uint8ClampedArray === "function" && typeof Float32Array === "function") {
    return createTypedArrayFactory;
  }
  return createRegularArray;
}();
function createSizedArray(len) {
  return Array.apply(null, { length: len });
}

// src/utils/common.js
var subframeEnabled = true;
var expressionsPlugin = null;
var expressionsInterfaces = null;
var idPrefix = "";
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var _shouldRoundValues = false;
var bmPow = Math.pow;
var bmSqrt = Math.sqrt;
var bmFloor = Math.floor;
var bmMin = Math.min;
var BMMath = {};
(function() {
  var propertyNames = ["abs", "acos", "acosh", "asin", "asinh", "atan", "atanh", "atan2", "ceil", "cbrt", "expm1", "clz32", "cos", "cosh", "exp", "floor", "fround", "hypot", "imul", "log", "log1p", "log2", "log10", "max", "min", "pow", "random", "round", "sign", "sin", "sinh", "sqrt", "tan", "tanh", "trunc", "E", "LN10", "LN2", "LOG10E", "LOG2E", "PI", "SQRT1_2", "SQRT2"];
  var i;
  var len = propertyNames.length;
  for (i = 0; i < len; i += 1) {
    BMMath[propertyNames[i]] = Math[propertyNames[i]];
  }
})();
BMMath.random = Math.random;
BMMath.abs = function(val) {
  var tOfVal = typeof val;
  if (tOfVal === "object" && val.length) {
    var absArr = createSizedArray(val.length);
    var i;
    var len = val.length;
    for (i = 0; i < len; i += 1) {
      absArr[i] = Math.abs(val[i]);
    }
    return absArr;
  }
  return Math.abs(val);
};
var defaultCurveSegments = 150;
var degToRads = Math.PI / 180;
var roundCorner = 0.5519;
function roundValues(flag) {
  _shouldRoundValues = !!flag;
}
function BMEnterFrameEvent(type, currentTime, totalTime, frameMultiplier) {
  this.type = type;
  this.currentTime = currentTime;
  this.totalTime = totalTime;
  this.direction = frameMultiplier < 0 ? -1 : 1;
}
function BMCompleteEvent(type, frameMultiplier) {
  this.type = type;
  this.direction = frameMultiplier < 0 ? -1 : 1;
}
function BMCompleteLoopEvent(type, totalLoops, currentLoop, frameMultiplier) {
  this.type = type;
  this.currentLoop = currentLoop;
  this.totalLoops = totalLoops;
  this.direction = frameMultiplier < 0 ? -1 : 1;
}
function BMSegmentStartEvent(type, firstFrame, totalFrames) {
  this.type = type;
  this.firstFrame = firstFrame;
  this.totalFrames = totalFrames;
}
function BMDestroyEvent(type, target) {
  this.type = type;
  this.target = target;
}
function BMRenderFrameErrorEvent(nativeError, currentTime) {
  this.type = "renderFrameError";
  this.nativeError = nativeError;
  this.currentTime = currentTime;
}
function BMConfigErrorEvent(nativeError) {
  this.type = "configError";
  this.nativeError = nativeError;
}
var createElementID = /* @__PURE__ */ function() {
  var _count = 0;
  return function createID() {
    _count += 1;
    return idPrefix + "__lottie_element_" + _count;
  };
}();
var rgbToHex = function() {
  var colorMap = [];
  var i;
  var hex;
  for (i = 0; i < 256; i += 1) {
    hex = i.toString(16);
    colorMap[i] = hex.length === 1 ? "0" + hex : hex;
  }
  return function(r, g, b) {
    if (r < 0) {
      r = 0;
    }
    if (g < 0) {
      g = 0;
    }
    if (b < 0) {
      b = 0;
    }
    return "#" + colorMap[r] + colorMap[g] + colorMap[b];
  };
}();
var setSubframeEnabled = (flag) => {
  subframeEnabled = !!flag;
};
var getSubframeEnabled = () => subframeEnabled;
var setExpressionsPlugin = (value) => {
  expressionsPlugin = value;
};
var getExpressionsPlugin = () => expressionsPlugin;
var getExpressionInterfaces = () => expressionsInterfaces;
var setDefaultCurveSegments = (value) => {
  defaultCurveSegments = value;
};
var getDefaultCurveSegments = () => defaultCurveSegments;
var setIdPrefix = (value) => {
  idPrefix = value;
};

// src/utils/BaseEvent.js
function BaseEvent() {
}
BaseEvent.prototype = {
  triggerEvent: function(eventName, args) {
    if (this._cbs[eventName]) {
      var callbacks = this._cbs[eventName];
      for (var i = 0; i < callbacks.length; i += 1) {
        callbacks[i](args);
      }
    }
  },
  addEventListener: function(eventName, callback) {
    if (!this._cbs[eventName]) {
      this._cbs[eventName] = [];
    }
    this._cbs[eventName].push(callback);
    return function() {
      this.removeEventListener(eventName, callback);
    }.bind(this);
  },
  removeEventListener: function(eventName, callback) {
    if (!callback) {
      this._cbs[eventName] = null;
    } else if (this._cbs[eventName]) {
      var i = 0;
      var len = this._cbs[eventName].length;
      while (i < len) {
        if (this._cbs[eventName][i] === callback) {
          this._cbs[eventName].splice(i, 1);
          i -= 1;
          len -= 1;
        }
        i += 1;
      }
      if (!this._cbs[eventName].length) {
        this._cbs[eventName] = null;
      }
    }
  }
};
var BaseEvent_default = BaseEvent;

// src/utils/DataManager.js
var dataManager = /* @__PURE__ */ function() {
  var _counterId = 1;
  var processes = [];
  var workerFn;
  var workerInstance;
  var workerProxy = {
    onmessage: function() {
    },
    postMessage: function(path) {
      workerFn({
        data: path
      });
    }
  };
  var _workerSelf = {
    postMessage: function(data) {
      workerProxy.onmessage({
        data
      });
    }
  };
  function createWorker(fn) {
    workerFn = fn;
    return workerProxy;
  }
  function setupWorker() {
    if (!workerInstance) {
      workerInstance = createWorker(function workerStart(e) {
        function dataFunctionManager() {
          function completeLayers(layers, comps) {
            var layerData;
            var i;
            var len = layers.length;
            var j;
            var jLen;
            var k;
            var kLen;
            for (i = 0; i < len; i += 1) {
              layerData = layers[i];
              if ("ks" in layerData && !layerData.completed) {
                layerData.completed = true;
                if (layerData.hasMask) {
                  var maskProps = layerData.masksProperties;
                  jLen = maskProps.length;
                  for (j = 0; j < jLen; j += 1) {
                    if (maskProps[j].pt.k.i) {
                      convertPathsToAbsoluteValues(maskProps[j].pt.k);
                    } else {
                      kLen = maskProps[j].pt.k.length;
                      for (k = 0; k < kLen; k += 1) {
                        if (maskProps[j].pt.k[k].s) {
                          convertPathsToAbsoluteValues(maskProps[j].pt.k[k].s[0]);
                        }
                        if (maskProps[j].pt.k[k].e) {
                          convertPathsToAbsoluteValues(maskProps[j].pt.k[k].e[0]);
                        }
                      }
                    }
                  }
                }
                if (layerData.ty === 0) {
                  layerData.layers = findCompLayers(layerData.refId, comps);
                  completeLayers(layerData.layers, comps);
                } else if (layerData.ty === 4) {
                  completeShapes(layerData.shapes);
                } else if (layerData.ty === 5) {
                  completeText(layerData);
                }
              }
            }
          }
          function completeChars(chars, assets) {
            if (chars) {
              var i = 0;
              var len = chars.length;
              for (i = 0; i < len; i += 1) {
                if (chars[i].t === 1) {
                  chars[i].data.layers = findCompLayers(chars[i].data.refId, assets);
                  completeLayers(chars[i].data.layers, assets);
                }
              }
            }
          }
          function findComp(id, comps) {
            var i = 0;
            var len = comps.length;
            while (i < len) {
              if (comps[i].id === id) {
                return comps[i];
              }
              i += 1;
            }
            return null;
          }
          function findCompLayers(id, comps) {
            var comp = findComp(id, comps);
            if (comp) {
              if (!comp.layers.__used) {
                comp.layers.__used = true;
                return comp.layers;
              }
              return JSON.parse(JSON.stringify(comp.layers));
            }
            return null;
          }
          function completeShapes(arr) {
            var i;
            var len = arr.length;
            var j;
            var jLen;
            for (i = len - 1; i >= 0; i -= 1) {
              if (arr[i].ty === "sh") {
                if (arr[i].ks.k.i) {
                  convertPathsToAbsoluteValues(arr[i].ks.k);
                } else {
                  jLen = arr[i].ks.k.length;
                  for (j = 0; j < jLen; j += 1) {
                    if (arr[i].ks.k[j].s) {
                      convertPathsToAbsoluteValues(arr[i].ks.k[j].s[0]);
                    }
                    if (arr[i].ks.k[j].e) {
                      convertPathsToAbsoluteValues(arr[i].ks.k[j].e[0]);
                    }
                  }
                }
              } else if (arr[i].ty === "gr") {
                completeShapes(arr[i].it);
              }
            }
          }
          function convertPathsToAbsoluteValues(path) {
            var i;
            var len = path.i.length;
            for (i = 0; i < len; i += 1) {
              path.i[i][0] += path.v[i][0];
              path.i[i][1] += path.v[i][1];
              path.o[i][0] += path.v[i][0];
              path.o[i][1] += path.v[i][1];
            }
          }
          function checkVersion(minimum, animVersionString) {
            var animVersion = animVersionString ? animVersionString.split(".") : [100, 100, 100];
            if (minimum[0] > animVersion[0]) {
              return true;
            }
            if (animVersion[0] > minimum[0]) {
              return false;
            }
            if (minimum[1] > animVersion[1]) {
              return true;
            }
            if (animVersion[1] > minimum[1]) {
              return false;
            }
            if (minimum[2] > animVersion[2]) {
              return true;
            }
            if (animVersion[2] > minimum[2]) {
              return false;
            }
            return null;
          }
          var checkText = /* @__PURE__ */ function() {
            var minimumVersion = [4, 4, 14];
            function updateTextLayer(textLayer) {
              var documentData = textLayer.t.d;
              textLayer.t.d = {
                k: [
                  {
                    s: documentData,
                    t: 0
                  }
                ]
              };
            }
            function iterateLayers(layers) {
              var i;
              var len = layers.length;
              for (i = 0; i < len; i += 1) {
                if (layers[i].ty === 5) {
                  updateTextLayer(layers[i]);
                }
              }
            }
            return function(animationData) {
              if (checkVersion(minimumVersion, animationData.v)) {
                iterateLayers(animationData.layers);
                if (animationData.assets) {
                  var i;
                  var len = animationData.assets.length;
                  for (i = 0; i < len; i += 1) {
                    if (animationData.assets[i].layers) {
                      iterateLayers(animationData.assets[i].layers);
                    }
                  }
                }
              }
            };
          }();
          var checkChars = /* @__PURE__ */ function() {
            var minimumVersion = [4, 7, 99];
            return function(animationData) {
              if (animationData.chars && !checkVersion(minimumVersion, animationData.v)) {
                var i;
                var len = animationData.chars.length;
                for (i = 0; i < len; i += 1) {
                  var charData = animationData.chars[i];
                  if (charData.data && charData.data.shapes) {
                    completeShapes(charData.data.shapes);
                    charData.data.ip = 0;
                    charData.data.op = 99999;
                    charData.data.st = 0;
                    charData.data.sr = 1;
                    charData.data.ks = {
                      p: { k: [0, 0], a: 0 },
                      s: { k: [100, 100], a: 0 },
                      a: { k: [0, 0], a: 0 },
                      r: { k: 0, a: 0 },
                      o: { k: 100, a: 0 }
                    };
                    if (!animationData.chars[i].t) {
                      charData.data.shapes.push(
                        {
                          ty: "no"
                        }
                      );
                      charData.data.shapes[0].it.push(
                        {
                          p: { k: [0, 0], a: 0 },
                          s: { k: [100, 100], a: 0 },
                          a: { k: [0, 0], a: 0 },
                          r: { k: 0, a: 0 },
                          o: { k: 100, a: 0 },
                          sk: { k: 0, a: 0 },
                          sa: { k: 0, a: 0 },
                          ty: "tr"
                        }
                      );
                    }
                  }
                }
              }
            };
          }();
          var checkPathProperties = /* @__PURE__ */ function() {
            var minimumVersion = [5, 7, 15];
            function updateTextLayer(textLayer) {
              var pathData = textLayer.t.p;
              if (typeof pathData.a === "number") {
                pathData.a = {
                  a: 0,
                  k: pathData.a
                };
              }
              if (typeof pathData.p === "number") {
                pathData.p = {
                  a: 0,
                  k: pathData.p
                };
              }
              if (typeof pathData.r === "number") {
                pathData.r = {
                  a: 0,
                  k: pathData.r
                };
              }
            }
            function iterateLayers(layers) {
              var i;
              var len = layers.length;
              for (i = 0; i < len; i += 1) {
                if (layers[i].ty === 5) {
                  updateTextLayer(layers[i]);
                }
              }
            }
            return function(animationData) {
              if (checkVersion(minimumVersion, animationData.v)) {
                iterateLayers(animationData.layers);
                if (animationData.assets) {
                  var i;
                  var len = animationData.assets.length;
                  for (i = 0; i < len; i += 1) {
                    if (animationData.assets[i].layers) {
                      iterateLayers(animationData.assets[i].layers);
                    }
                  }
                }
              }
            };
          }();
          var checkColors = /* @__PURE__ */ function() {
            var minimumVersion = [4, 1, 9];
            function iterateShapes(shapes) {
              var i;
              var len = shapes.length;
              var j;
              var jLen;
              for (i = 0; i < len; i += 1) {
                if (shapes[i].ty === "gr") {
                  iterateShapes(shapes[i].it);
                } else if (shapes[i].ty === "fl" || shapes[i].ty === "st") {
                  if (shapes[i].c.k && shapes[i].c.k[0].i) {
                    jLen = shapes[i].c.k.length;
                    for (j = 0; j < jLen; j += 1) {
                      if (shapes[i].c.k[j].s) {
                        shapes[i].c.k[j].s[0] /= 255;
                        shapes[i].c.k[j].s[1] /= 255;
                        shapes[i].c.k[j].s[2] /= 255;
                        shapes[i].c.k[j].s[3] /= 255;
                      }
                      if (shapes[i].c.k[j].e) {
                        shapes[i].c.k[j].e[0] /= 255;
                        shapes[i].c.k[j].e[1] /= 255;
                        shapes[i].c.k[j].e[2] /= 255;
                        shapes[i].c.k[j].e[3] /= 255;
                      }
                    }
                  } else {
                    shapes[i].c.k[0] /= 255;
                    shapes[i].c.k[1] /= 255;
                    shapes[i].c.k[2] /= 255;
                    shapes[i].c.k[3] /= 255;
                  }
                }
              }
            }
            function iterateLayers(layers) {
              var i;
              var len = layers.length;
              for (i = 0; i < len; i += 1) {
                if (layers[i].ty === 4) {
                  iterateShapes(layers[i].shapes);
                }
              }
            }
            return function(animationData) {
              if (checkVersion(minimumVersion, animationData.v)) {
                iterateLayers(animationData.layers);
                if (animationData.assets) {
                  var i;
                  var len = animationData.assets.length;
                  for (i = 0; i < len; i += 1) {
                    if (animationData.assets[i].layers) {
                      iterateLayers(animationData.assets[i].layers);
                    }
                  }
                }
              }
            };
          }();
          var checkShapes = /* @__PURE__ */ function() {
            var minimumVersion = [4, 4, 18];
            function completeClosingShapes(arr) {
              var i;
              var len = arr.length;
              var j;
              var jLen;
              for (i = len - 1; i >= 0; i -= 1) {
                if (arr[i].ty === "sh") {
                  if (arr[i].ks.k.i) {
                    arr[i].ks.k.c = arr[i].closed;
                  } else {
                    jLen = arr[i].ks.k.length;
                    for (j = 0; j < jLen; j += 1) {
                      if (arr[i].ks.k[j].s) {
                        arr[i].ks.k[j].s[0].c = arr[i].closed;
                      }
                      if (arr[i].ks.k[j].e) {
                        arr[i].ks.k[j].e[0].c = arr[i].closed;
                      }
                    }
                  }
                } else if (arr[i].ty === "gr") {
                  completeClosingShapes(arr[i].it);
                }
              }
            }
            function iterateLayers(layers) {
              var layerData;
              var i;
              var len = layers.length;
              var j;
              var jLen;
              var k;
              var kLen;
              for (i = 0; i < len; i += 1) {
                layerData = layers[i];
                if (layerData.hasMask) {
                  var maskProps = layerData.masksProperties;
                  jLen = maskProps.length;
                  for (j = 0; j < jLen; j += 1) {
                    if (maskProps[j].pt.k.i) {
                      maskProps[j].pt.k.c = maskProps[j].cl;
                    } else {
                      kLen = maskProps[j].pt.k.length;
                      for (k = 0; k < kLen; k += 1) {
                        if (maskProps[j].pt.k[k].s) {
                          maskProps[j].pt.k[k].s[0].c = maskProps[j].cl;
                        }
                        if (maskProps[j].pt.k[k].e) {
                          maskProps[j].pt.k[k].e[0].c = maskProps[j].cl;
                        }
                      }
                    }
                  }
                }
                if (layerData.ty === 4) {
                  completeClosingShapes(layerData.shapes);
                }
              }
            }
            return function(animationData) {
              if (checkVersion(minimumVersion, animationData.v)) {
                iterateLayers(animationData.layers);
                if (animationData.assets) {
                  var i;
                  var len = animationData.assets.length;
                  for (i = 0; i < len; i += 1) {
                    if (animationData.assets[i].layers) {
                      iterateLayers(animationData.assets[i].layers);
                    }
                  }
                }
              }
            };
          }();
          function completeData(animationData) {
            if (animationData.__complete) {
              return;
            }
            checkColors(animationData);
            checkText(animationData);
            checkChars(animationData);
            checkPathProperties(animationData);
            checkShapes(animationData);
            completeLayers(animationData.layers, animationData.assets);
            completeChars(animationData.chars, animationData.assets);
            animationData.__complete = true;
          }
          function completeText(data) {
            if (data.t.a.length === 0 && !("m" in data.t.p)) {
            }
          }
          var moduleOb = {};
          moduleOb.completeData = completeData;
          moduleOb.checkColors = checkColors;
          moduleOb.checkChars = checkChars;
          moduleOb.checkPathProperties = checkPathProperties;
          moduleOb.checkShapes = checkShapes;
          moduleOb.completeLayers = completeLayers;
          return moduleOb;
        }
        if (!_workerSelf.dataManager) {
          _workerSelf.dataManager = dataFunctionManager();
        }
        if (!_workerSelf.assetLoader) {
          _workerSelf.assetLoader = /* @__PURE__ */ function() {
            function formatResponse(xhr) {
              var contentTypeHeader = xhr.getResponseHeader("content-type");
              if (contentTypeHeader && xhr.responseType === "json" && contentTypeHeader.indexOf("json") !== -1) {
                return xhr.response;
              }
              if (xhr.response && typeof xhr.response === "object") {
                return xhr.response;
              }
              if (xhr.response && typeof xhr.response === "string") {
                return JSON.parse(xhr.response);
              }
              if (xhr.responseText) {
                return JSON.parse(xhr.responseText);
              }
              return null;
            }
            function loadAsset(path, fullPath, callback, errorCallback) {
              var response;
              var xhr = new XMLHttpRequest();
              try {
                xhr.responseType = "json";
              } catch (err) {
              }
              xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                    response = formatResponse(xhr);
                    callback(response);
                  } else {
                    try {
                      response = formatResponse(xhr);
                      callback(response);
                    } catch (err) {
                      if (errorCallback) {
                        errorCallback(err);
                      }
                    }
                  }
                }
              };
              try {
                xhr.open(["G", "E", "T"].join(""), path, true);
              } catch (error) {
                xhr.open(["G", "E", "T"].join(""), fullPath + "/" + path, true);
              }
              xhr.send();
            }
            return {
              load: loadAsset
            };
          }();
        }
        if (e.data.type === "loadAnimation") {
          _workerSelf.assetLoader.load(
            e.data.path,
            e.data.fullPath,
            function(data) {
              _workerSelf.dataManager.completeData(data);
              _workerSelf.postMessage({
                id: e.data.id,
                payload: data,
                status: "success"
              });
            },
            function() {
              _workerSelf.postMessage({
                id: e.data.id,
                status: "error"
              });
            }
          );
        } else if (e.data.type === "complete") {
          var animation = e.data.animation;
          _workerSelf.dataManager.completeData(animation);
          _workerSelf.postMessage({
            id: e.data.id,
            payload: animation,
            status: "success"
          });
        } else if (e.data.type === "loadData") {
          _workerSelf.assetLoader.load(
            e.data.path,
            e.data.fullPath,
            function(data) {
              _workerSelf.postMessage({
                id: e.data.id,
                payload: data,
                status: "success"
              });
            },
            function() {
              _workerSelf.postMessage({
                id: e.data.id,
                status: "error"
              });
            }
          );
        }
      });
      workerInstance.onmessage = function(event) {
        var data = event.data;
        var id = data.id;
        var process = processes[id];
        processes[id] = null;
        if (data.status === "success") {
          process.onComplete(data.payload);
        } else if (process.onError) {
          process.onError();
        }
      };
    }
  }
  function createProcess(onComplete, onError) {
    _counterId += 1;
    var id = "processId_" + _counterId;
    processes[id] = {
      onComplete,
      onError
    };
    return id;
  }
  function loadAnimation2(path, onComplete, onError) {
    setupWorker();
    var processId = createProcess(onComplete, onError);
    workerInstance.postMessage({
      type: "loadAnimation",
      path,
      fullPath: window.location.origin + window.location.pathname,
      id: processId
    });
  }
  function loadData(path, onComplete, onError) {
    setupWorker();
    var processId = createProcess(onComplete, onError);
    workerInstance.postMessage({
      type: "loadData",
      path,
      fullPath: window.location.origin + window.location.pathname,
      id: processId
    });
  }
  function completeAnimation(anim, onComplete, onError) {
    setupWorker();
    var processId = createProcess(onComplete, onError);
    workerInstance.postMessage({
      type: "complete",
      animation: anim,
      id: processId
    });
  }
  return {
    loadAnimation: loadAnimation2,
    loadData,
    completeAnimation
  };
}();
var DataManager_default = dataManager;

// src/utils/markers/markerParser.js
var markerParser = /* @__PURE__ */ function() {
  function parsePayloadLines(payload) {
    var lines = payload.split("\r\n");
    var keys = {};
    var line;
    var keysCount = 0;
    for (var i = 0; i < lines.length; i += 1) {
      line = lines[i].split(":");
      if (line.length === 2) {
        keys[line[0]] = line[1].trim();
        keysCount += 1;
      }
    }
    if (keysCount === 0) {
      throw new Error();
    }
    return keys;
  }
  return function(_markers) {
    var markers = [];
    for (var i = 0; i < _markers.length; i += 1) {
      var _marker = _markers[i];
      var markerData = {
        time: _marker.tm,
        duration: _marker.dr
      };
      try {
        markerData.payload = JSON.parse(_markers[i].cm);
      } catch (_) {
        try {
          markerData.payload = parsePayloadLines(_markers[i].cm);
        } catch (__) {
          markerData.payload = {
            name: _markers[i].cm
          };
        }
      }
      markers.push(markerData);
    }
    return markers;
  };
}();
var markerParser_default = markerParser;

// src/utils/expressions/ProjectInterface.js
var ProjectInterface = /* @__PURE__ */ function() {
  function registerComposition(comp) {
    this.compositions.push(comp);
  }
  return function() {
    function _thisProjectFunction(name) {
      var i = 0;
      var len = this.compositions.length;
      while (i < len) {
        if (this.compositions[i].data && this.compositions[i].data.nm === name) {
          if (this.compositions[i].prepareFrame && this.compositions[i].data.xt) {
            this.compositions[i].prepareFrame(this.currentFrame);
          }
          return this.compositions[i].compInterface;
        }
        i += 1;
      }
      return null;
    }
    _thisProjectFunction.compositions = [];
    _thisProjectFunction.currentFrame = 0;
    _thisProjectFunction.registerComposition = registerComposition;
    return _thisProjectFunction;
  };
}();
var ProjectInterface_default = ProjectInterface;

// src/renderers/renderersManager.js
var renderers = {};
var registerRenderer = (key, value) => {
  renderers[key] = value;
};
function getRenderer(key) {
  return renderers[key];
}

// src/animation/AnimationItem.js
var AnimationItem = function() {
  this._cbs = [];
  this.name = "";
  this.path = "";
  this.isLoaded = false;
  this.currentFrame = 0;
  this.currentRawFrame = 0;
  this.firstFrame = 0;
  this.totalFrames = 0;
  this.frameRate = 0;
  this.frameMult = 0;
  this.playSpeed = 1;
  this.playDirection = 1;
  this.playCount = 0;
  this.animationData = {};
  this.assets = [];
  this.isPaused = true;
  this.autoplay = false;
  this.loop = true;
  this.renderer = null;
  this.animationID = createElementID();
  this.assetsPath = "";
  this.timeCompleted = 0;
  this.segmentPos = 0;
  this.isSubframeEnabled = getSubframeEnabled();
  this.segments = [];
  this._idle = true;
  this._completedLoop = false;
  this.projectInterface = ProjectInterface_default();
  this.markers = [];
  this.configAnimation = this.configAnimation.bind(this);
  this.onSetupError = this.onSetupError.bind(this);
  this.onSegmentComplete = this.onSegmentComplete.bind(this);
  this.drawnFrameEvent = new BMEnterFrameEvent("drawnFrame", 0, 0, 0);
  this.expressionsPlugin = getExpressionsPlugin();
};
extendPrototype([BaseEvent_default], AnimationItem);
AnimationItem.prototype.setParams = function(params) {
  if (params.wrapper || params.container) {
    this.wrapper = params.wrapper || params.container;
  }
  var animType = "svg";
  if (params.animType) {
    animType = params.animType;
  } else if (params.renderer) {
    animType = params.renderer;
  }
  const RendererClass = getRenderer(animType);
  this.renderer = new RendererClass(this, params.rendererSettings);
  this.renderer.setProjectInterface(this.projectInterface);
  this.animType = animType;
  if (params.loop === "" || params.loop === null || params.loop === void 0 || params.loop === true) {
    this.loop = true;
  } else if (params.loop === false) {
    this.loop = false;
  } else {
    this.loop = parseInt(params.loop, 10);
  }
  this.autoplay = "autoplay" in params ? params.autoplay : true;
  this.name = params.name ? params.name : "";
  this.autoloadSegments = Object.prototype.hasOwnProperty.call(params, "autoloadSegments") ? params.autoloadSegments : true;
  this.assetsPath = params.assetsPath;
  this.initialSegment = params.initialSegment;
  if (params.animationData) {
    this.setupAnimation(params.animationData);
  } else if (params.path) {
    throw new Error("Cannot load animations using path parameter (PATCHED).");
  }
};
AnimationItem.prototype.onSetupError = function() {
  this.trigger("data_failed");
};
AnimationItem.prototype.setupAnimation = function(data) {
  DataManager_default.completeAnimation(data, this.configAnimation);
};
AnimationItem.prototype.includeLayers = function(data) {
  if (data.op > this.animationData.op) {
    this.animationData.op = data.op;
    this.totalFrames = Math.floor(data.op - this.animationData.ip);
  }
  var layers = this.animationData.layers;
  var i;
  var len = layers.length;
  var newLayers = data.layers;
  var j;
  var jLen = newLayers.length;
  for (j = 0; j < jLen; j += 1) {
    i = 0;
    while (i < len) {
      if (layers[i].id === newLayers[j].id) {
        layers[i] = newLayers[j];
        break;
      }
      i += 1;
    }
  }
  if (data.assets) {
    len = data.assets.length;
    for (i = 0; i < len; i += 1) {
      this.animationData.assets.push(data.assets[i]);
    }
  }
  this.animationData.__complete = false;
  DataManager_default.completeAnimation(
    this.animationData,
    this.onSegmentComplete
  );
};
AnimationItem.prototype.onSegmentComplete = function(data) {
  this.animationData = data;
  var expressionsPlugin2 = getExpressionsPlugin();
  if (expressionsPlugin2) {
    expressionsPlugin2.initExpressions(this);
  }
  this.loadNextSegment();
};
AnimationItem.prototype.loadNextSegment = function() {
  var segments = this.animationData.segments;
  if (!segments || segments.length === 0 || !this.autoloadSegments) {
    this.trigger("data_ready");
    this.timeCompleted = this.totalFrames;
    return;
  }
  var segment = segments.shift();
  this.timeCompleted = segment.time * this.frameRate;
  var segmentPath = this.path + this.fileName + "_" + this.segmentPos + ".json";
  this.segmentPos += 1;
  DataManager_default.loadData(segmentPath, this.includeLayers.bind(this), function() {
    this.trigger("data_failed");
  }.bind(this));
};
AnimationItem.prototype.loadSegments = function() {
  var segments = this.animationData.segments;
  if (!segments) {
    this.timeCompleted = this.totalFrames;
  }
  this.loadNextSegment();
};
AnimationItem.prototype.configAnimation = function(animData) {
  if (!this.renderer) {
    return;
  }
  try {
    this.animationData = animData;
    if (this.initialSegment) {
      this.totalFrames = Math.floor(this.initialSegment[1] - this.initialSegment[0]);
      this.firstFrame = Math.round(this.initialSegment[0]);
    } else {
      this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip);
      this.firstFrame = Math.round(this.animationData.ip);
    }
    this.renderer.configAnimation(animData);
    if (!animData.assets) {
      animData.assets = [];
    }
    this.assets = this.animationData.assets;
    this.frameRate = this.animationData.fr;
    this.frameMult = this.animationData.fr / 1e3;
    this.renderer.searchExtraCompositions(animData.assets);
    this.markers = markerParser_default(animData.markers || []);
    this.trigger("config_ready");
    this.loadSegments();
    this.updaFrameModifier();
    this.checkLoaded();
  } catch (error) {
    this.triggerConfigError(error);
  }
};
AnimationItem.prototype.checkLoaded = function() {
  if (!this.isLoaded) {
    this.isLoaded = true;
    var expressionsPlugin2 = getExpressionsPlugin();
    if (expressionsPlugin2) {
      expressionsPlugin2.initExpressions(this);
    }
    this.renderer.initItems();
    setTimeout(function() {
      this.trigger("DOMLoaded");
    }.bind(this), 0);
    this.gotoFrame();
    if (this.autoplay) {
      this.play();
    }
  }
};
AnimationItem.prototype.resize = function(width, height) {
  var _width = typeof width === "number" ? width : void 0;
  var _height = typeof height === "number" ? height : void 0;
  this.renderer.updateContainerSize(_width, _height);
};
AnimationItem.prototype.setSubframe = function(flag) {
  this.isSubframeEnabled = !!flag;
};
AnimationItem.prototype.gotoFrame = function() {
  this.currentFrame = this.isSubframeEnabled ? this.currentRawFrame : ~~this.currentRawFrame;
  if (this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted) {
    this.currentFrame = this.timeCompleted;
  }
  this.trigger("enterFrame");
  this.renderFrame();
  this.trigger("drawnFrame");
};
AnimationItem.prototype.renderFrame = function() {
  if (this.isLoaded === false || !this.renderer) {
    return;
  }
  try {
    if (this.expressionsPlugin) {
      this.expressionsPlugin.resetFrame();
    }
    this.renderer.renderFrame(this.currentFrame + this.firstFrame);
  } catch (error) {
    this.triggerRenderFrameError(error);
  }
};
AnimationItem.prototype.play = function(name) {
  if (name && this.name !== name) {
    return;
  }
  if (this.isPaused === true) {
    this.isPaused = false;
    this.trigger("_play");
    if (this._idle) {
      this._idle = false;
      this.trigger("_active");
    }
  }
};
AnimationItem.prototype.pause = function(name) {
  if (name && this.name !== name) {
    return;
  }
  if (this.isPaused === false) {
    this.isPaused = true;
    this.trigger("_pause");
    this._idle = true;
    this.trigger("_idle");
  }
};
AnimationItem.prototype.togglePause = function(name) {
  if (name && this.name !== name) {
    return;
  }
  if (this.isPaused === true) {
    this.play();
  } else {
    this.pause();
  }
};
AnimationItem.prototype.stop = function(name) {
  if (name && this.name !== name) {
    return;
  }
  this.pause();
  this.playCount = 0;
  this._completedLoop = false;
  this.setCurrentRawFrameValue(0);
};
AnimationItem.prototype.getMarkerData = function(markerName) {
  var marker;
  for (var i = 0; i < this.markers.length; i += 1) {
    marker = this.markers[i];
    if (marker.payload && marker.payload.name === markerName) {
      return marker;
    }
  }
  return null;
};
AnimationItem.prototype.goToAndStop = function(value, isFrame, name) {
  if (name && this.name !== name) {
    return;
  }
  var numValue = Number(value);
  if (isNaN(numValue)) {
    var marker = this.getMarkerData(value);
    if (marker) {
      this.goToAndStop(marker.time, true);
    }
  } else if (isFrame) {
    this.setCurrentRawFrameValue(value);
  } else {
    this.setCurrentRawFrameValue(value * this.frameModifier);
  }
  this.pause();
};
AnimationItem.prototype.goToAndPlay = function(value, isFrame, name) {
  if (name && this.name !== name) {
    return;
  }
  var numValue = Number(value);
  if (isNaN(numValue)) {
    var marker = this.getMarkerData(value);
    if (marker) {
      if (!marker.duration) {
        this.goToAndStop(marker.time, true);
      } else {
        this.playSegments([marker.time, marker.time + marker.duration], true);
      }
    }
  } else {
    this.goToAndStop(numValue, isFrame, name);
  }
  this.play();
};
AnimationItem.prototype.advanceTime = function(value) {
  if (this.isPaused === true || this.isLoaded === false) {
    return;
  }
  var nextValue = this.currentRawFrame + value * this.frameModifier;
  var _isComplete = false;
  if (nextValue >= this.totalFrames - 1 && this.frameModifier > 0) {
    if (!this.loop || this.playCount === this.loop) {
      if (!this.checkSegments(nextValue > this.totalFrames ? nextValue % this.totalFrames : 0)) {
        _isComplete = true;
        nextValue = this.totalFrames - 1;
      }
    } else if (nextValue >= this.totalFrames) {
      this.playCount += 1;
      if (!this.checkSegments(nextValue % this.totalFrames)) {
        this.setCurrentRawFrameValue(nextValue % this.totalFrames);
        this._completedLoop = true;
        this.trigger("loopComplete");
      }
    } else {
      this.setCurrentRawFrameValue(nextValue);
    }
  } else if (nextValue < 0) {
    if (!this.checkSegments(nextValue % this.totalFrames)) {
      if (this.loop && !(this.playCount-- <= 0 && this.loop !== true)) {
        this.setCurrentRawFrameValue(this.totalFrames + nextValue % this.totalFrames);
        if (!this._completedLoop) {
          this._completedLoop = true;
        } else {
          this.trigger("loopComplete");
        }
      } else {
        _isComplete = true;
        nextValue = 0;
      }
    }
  } else {
    this.setCurrentRawFrameValue(nextValue);
  }
  if (_isComplete) {
    this.setCurrentRawFrameValue(nextValue);
    this.pause();
    this.trigger("complete");
  }
};
AnimationItem.prototype.adjustSegment = function(arr, offset) {
  this.playCount = 0;
  if (arr[1] < arr[0]) {
    if (this.frameModifier > 0) {
      if (this.playSpeed < 0) {
        this.setSpeed(-this.playSpeed);
      } else {
        this.setDirection(-1);
      }
    }
    this.totalFrames = arr[0] - arr[1];
    this.timeCompleted = this.totalFrames;
    this.firstFrame = arr[1];
    this.setCurrentRawFrameValue(this.totalFrames - 1e-3 - offset);
  } else if (arr[1] > arr[0]) {
    if (this.frameModifier < 0) {
      if (this.playSpeed < 0) {
        this.setSpeed(-this.playSpeed);
      } else {
        this.setDirection(1);
      }
    }
    this.totalFrames = arr[1] - arr[0];
    this.timeCompleted = this.totalFrames;
    this.firstFrame = arr[0];
    this.setCurrentRawFrameValue(1e-3 + offset);
  }
  this.trigger("segmentStart");
};
AnimationItem.prototype.setSegment = function(init, end) {
  var pendingFrame = -1;
  if (this.isPaused) {
    if (this.currentRawFrame + this.firstFrame < init) {
      pendingFrame = init;
    } else if (this.currentRawFrame + this.firstFrame > end) {
      pendingFrame = end - init;
    }
  }
  this.firstFrame = init;
  this.totalFrames = end - init;
  this.timeCompleted = this.totalFrames;
  if (pendingFrame !== -1) {
    this.goToAndStop(pendingFrame, true);
  }
};
AnimationItem.prototype.playSegments = function(arr, forceFlag) {
  if (forceFlag) {
    this.segments.length = 0;
  }
  if (typeof arr[0] === "object") {
    var i;
    var len = arr.length;
    for (i = 0; i < len; i += 1) {
      this.segments.push(arr[i]);
    }
  } else {
    this.segments.push(arr);
  }
  if (this.segments.length && forceFlag) {
    this.adjustSegment(this.segments.shift(), 0);
  }
  if (this.isPaused) {
    this.play();
  }
};
AnimationItem.prototype.resetSegments = function(forceFlag) {
  this.segments.length = 0;
  this.segments.push([this.animationData.ip, this.animationData.op]);
  if (forceFlag) {
    this.checkSegments(0);
  }
};
AnimationItem.prototype.checkSegments = function(offset) {
  if (this.segments.length) {
    this.adjustSegment(this.segments.shift(), offset);
    return true;
  }
  return false;
};
AnimationItem.prototype.destroy = function(name) {
  if (name && this.name !== name || !this.renderer) {
    return;
  }
  this.renderer.destroy();
  this.trigger("destroy");
  this._cbs = null;
  this.onEnterFrame = null;
  this.onLoopComplete = null;
  this.onComplete = null;
  this.onSegmentStart = null;
  this.onDestroy = null;
  this.renderer = null;
  this.expressionsPlugin = null;
  this.projectInterface = null;
};
AnimationItem.prototype.setCurrentRawFrameValue = function(value) {
  this.currentRawFrame = value;
  this.gotoFrame();
};
AnimationItem.prototype.setSpeed = function(val) {
  this.playSpeed = val;
  this.updaFrameModifier();
};
AnimationItem.prototype.setDirection = function(val) {
  this.playDirection = val < 0 ? -1 : 1;
  this.updaFrameModifier();
};
AnimationItem.prototype.setLoop = function(isLooping) {
  this.loop = isLooping;
};
AnimationItem.prototype.updaFrameModifier = function() {
  this.frameModifier = this.frameMult * this.playSpeed * this.playDirection;
};
AnimationItem.prototype.getPath = function() {
  return this.path;
};
AnimationItem.prototype.getAssetsPath = function(assetData) {
  var path = "";
  if (assetData.e) {
    path = assetData.p;
  } else if (this.assetsPath) {
    var imagePath = assetData.p;
    if (imagePath.indexOf("images/") !== -1) {
      imagePath = imagePath.split("/")[1];
    }
    path = this.assetsPath + imagePath;
  } else {
    path = this.path;
    path += assetData.u ? assetData.u : "";
    path += assetData.p;
  }
  return path;
};
AnimationItem.prototype.getAssetData = function(id) {
  var i = 0;
  var len = this.assets.length;
  while (i < len) {
    if (id === this.assets[i].id) {
      return this.assets[i];
    }
    i += 1;
  }
  return null;
};
AnimationItem.prototype.hide = function() {
  this.renderer.hide();
};
AnimationItem.prototype.show = function() {
  this.renderer.show();
};
AnimationItem.prototype.getDuration = function(isFrame) {
  return isFrame ? this.totalFrames : this.totalFrames / this.frameRate;
};
AnimationItem.prototype.updateDocumentData = function(path, documentData, index) {
  try {
    var element = this.renderer.getElementByPath(path);
    element.updateDocumentData(documentData, index);
  } catch (error) {
    console.error("Failed to update document data", error);
  }
};
AnimationItem.prototype.trigger = function(name) {
  if (this._cbs && this._cbs[name]) {
    switch (name) {
      case "enterFrame":
        this.triggerEvent(name, new BMEnterFrameEvent(name, this.currentFrame, this.totalFrames, this.frameModifier));
        break;
      case "drawnFrame":
        this.drawnFrameEvent.currentTime = this.currentFrame;
        this.drawnFrameEvent.totalTime = this.totalFrames;
        this.drawnFrameEvent.direction = this.frameModifier;
        this.triggerEvent(name, this.drawnFrameEvent);
        break;
      case "loopComplete":
        this.triggerEvent(name, new BMCompleteLoopEvent(name, this.loop, this.playCount, this.frameMult));
        break;
      case "complete":
        this.triggerEvent(name, new BMCompleteEvent(name, this.frameMult));
        break;
      case "segmentStart":
        this.triggerEvent(name, new BMSegmentStartEvent(name, this.firstFrame, this.totalFrames));
        break;
      case "destroy":
        this.triggerEvent(name, new BMDestroyEvent(name, this));
        break;
      default:
        this.triggerEvent(name);
    }
  }
  if (name === "enterFrame" && this.onEnterFrame) {
    this.onEnterFrame.call(this, new BMEnterFrameEvent(name, this.currentFrame, this.totalFrames, this.frameMult));
  }
  if (name === "loopComplete" && this.onLoopComplete) {
    this.onLoopComplete.call(this, new BMCompleteLoopEvent(name, this.loop, this.playCount, this.frameMult));
  }
  if (name === "complete" && this.onComplete) {
    this.onComplete.call(this, new BMCompleteEvent(name, this.frameMult));
  }
  if (name === "segmentStart" && this.onSegmentStart) {
    this.onSegmentStart.call(this, new BMSegmentStartEvent(name, this.firstFrame, this.totalFrames));
  }
  if (name === "destroy" && this.onDestroy) {
    this.onDestroy.call(this, new BMDestroyEvent(name, this));
  }
};
AnimationItem.prototype.triggerRenderFrameError = function(nativeError) {
  var error = new BMRenderFrameErrorEvent(nativeError, this.currentFrame);
  this.triggerEvent("error", error);
  if (this.onError) {
    this.onError.call(this, error);
  }
};
AnimationItem.prototype.triggerConfigError = function(nativeError) {
  var error = new BMConfigErrorEvent(nativeError, this.currentFrame);
  this.triggerEvent("error", error);
  if (this.onError) {
    this.onError.call(this, error);
  }
};
var AnimationItem_default = AnimationItem;

// src/animation/AnimationManager.js
var animationManager = function() {
  var moduleOb = {};
  var registeredAnimations = [];
  var initTime = 0;
  var len = 0;
  var playingAnimationsNum = 0;
  var _stopped = true;
  var _isFrozen = false;
  function removeElement(ev) {
    var i = 0;
    var animItem = ev.target;
    while (i < len) {
      if (registeredAnimations[i].animation === animItem) {
        registeredAnimations.splice(i, 1);
        i -= 1;
        len -= 1;
        if (!animItem.isPaused) {
          subtractPlayingCount();
        }
      }
      i += 1;
    }
  }
  function getRegisteredAnimations() {
    var i;
    var lenAnims = registeredAnimations.length;
    var animations = [];
    for (i = 0; i < lenAnims; i += 1) {
      animations.push(registeredAnimations[i].animation);
    }
    return animations;
  }
  function addPlayingCount() {
    playingAnimationsNum += 1;
    activate();
  }
  function subtractPlayingCount() {
    playingAnimationsNum -= 1;
  }
  function setupAnimation(animItem, element) {
    animItem.addEventListener("destroy", removeElement);
    animItem.addEventListener("_active", addPlayingCount);
    animItem.addEventListener("_idle", subtractPlayingCount);
    registeredAnimations.push({ elem: element, animation: animItem });
    len += 1;
  }
  function loadAnimation2(params) {
    var animItem = new AnimationItem_default();
    setupAnimation(animItem, null);
    animItem.setParams(params);
    return animItem;
  }
  function setSpeed(val, animation) {
    var i;
    for (i = 0; i < len; i += 1) {
      registeredAnimations[i].animation.setSpeed(val, animation);
    }
  }
  function setDirection(val, animation) {
    var i;
    for (i = 0; i < len; i += 1) {
      registeredAnimations[i].animation.setDirection(val, animation);
    }
  }
  function play(animation) {
    var i;
    for (i = 0; i < len; i += 1) {
      registeredAnimations[i].animation.play(animation);
    }
  }
  function resume(nowTime) {
    var elapsedTime = nowTime - initTime;
    var i;
    for (i = 0; i < len; i += 1) {
      registeredAnimations[i].animation.advanceTime(elapsedTime);
    }
    initTime = nowTime;
    if (playingAnimationsNum && !_isFrozen) {
      window.requestAnimationFrame(resume);
    } else {
      _stopped = true;
    }
  }
  function first(nowTime) {
    initTime = nowTime;
    window.requestAnimationFrame(resume);
  }
  function pause(animation) {
    var i;
    for (i = 0; i < len; i += 1) {
      registeredAnimations[i].animation.pause(animation);
    }
  }
  function goToAndStop(value, isFrame, animation) {
    var i;
    for (i = 0; i < len; i += 1) {
      registeredAnimations[i].animation.goToAndStop(value, isFrame, animation);
    }
  }
  function stop(animation) {
    var i;
    for (i = 0; i < len; i += 1) {
      registeredAnimations[i].animation.stop(animation);
    }
  }
  function togglePause(animation) {
    var i;
    for (i = 0; i < len; i += 1) {
      registeredAnimations[i].animation.togglePause(animation);
    }
  }
  function destroy(animation) {
    var i;
    for (i = len - 1; i >= 0; i -= 1) {
      registeredAnimations[i].animation.destroy(animation);
    }
  }
  function resize() {
    var i;
    for (i = 0; i < len; i += 1) {
      registeredAnimations[i].animation.resize();
    }
  }
  function activate() {
    if (!_isFrozen && playingAnimationsNum) {
      if (_stopped) {
        window.requestAnimationFrame(first);
        _stopped = false;
      }
    }
  }
  function freeze() {
    _isFrozen = true;
  }
  function unfreeze() {
    _isFrozen = false;
    activate();
  }
  moduleOb.loadAnimation = loadAnimation2;
  moduleOb.setSpeed = setSpeed;
  moduleOb.setDirection = setDirection;
  moduleOb.play = play;
  moduleOb.pause = pause;
  moduleOb.stop = stop;
  moduleOb.togglePause = togglePause;
  moduleOb.resize = resize;
  moduleOb.goToAndStop = goToAndStop;
  moduleOb.destroy = destroy;
  moduleOb.freeze = freeze;
  moduleOb.unfreeze = unfreeze;
  moduleOb.getRegisteredAnimations = getRegisteredAnimations;
  return moduleOb;
}();
var AnimationManager_default = animationManager;

// src/3rd_party/BezierEaser.js
var BezierFactory = function() {
  var ob = {};
  ob.getBezierEasing = getBezierEasing;
  var beziers = {};
  function getBezierEasing(a, b, c, d, nm) {
    var str = nm || ("bez_" + a + "_" + b + "_" + c + "_" + d).replace(/\./g, "p");
    if (beziers[str]) {
      return beziers[str];
    }
    var bezEasing = new BezierEasing([a, b, c, d]);
    beziers[str] = bezEasing;
    return bezEasing;
  }
  var NEWTON_ITERATIONS = 4;
  var NEWTON_MIN_SLOPE = 1e-3;
  var SUBDIVISION_PRECISION = 1e-7;
  var SUBDIVISION_MAX_ITERATIONS = 10;
  var kSplineTableSize = 11;
  var kSampleStepSize = 1 / (kSplineTableSize - 1);
  var float32ArraySupported = typeof Float32Array === "function";
  function A(aA1, aA2) {
    return 1 - 3 * aA2 + 3 * aA1;
  }
  function B(aA1, aA2) {
    return 3 * aA2 - 6 * aA1;
  }
  function C(aA1) {
    return 3 * aA1;
  }
  function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
  }
  function getSlope(aT, aA1, aA2) {
    return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);
  }
  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }
  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0) return aGuessT;
      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }
  function BezierEasing(points) {
    this._p = points;
    this._mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    this._precomputed = false;
    this.get = this.get.bind(this);
  }
  BezierEasing.prototype = {
    get: function(x) {
      var mX1 = this._p[0], mY1 = this._p[1], mX2 = this._p[2], mY2 = this._p[3];
      if (!this._precomputed) this._precompute();
      if (mX1 === mY1 && mX2 === mY2) return x;
      if (x === 0) return 0;
      if (x === 1) return 1;
      return calcBezier(this._getTForX(x), mY1, mY2);
    },
    // Private part
    _precompute: function() {
      var mX1 = this._p[0], mY1 = this._p[1], mX2 = this._p[2], mY2 = this._p[3];
      this._precomputed = true;
      if (mX1 !== mY1 || mX2 !== mY2) {
        this._calcSampleValues();
      }
    },
    _calcSampleValues: function() {
      var mX1 = this._p[0], mX2 = this._p[2];
      for (var i = 0; i < kSplineTableSize; ++i) {
        this._mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    },
    /**
         * getTForX chose the fastest heuristic to determine the percentage value precisely from a given X projection.
         */
    _getTForX: function(aX) {
      var mX1 = this._p[0], mX2 = this._p[2], mSampleValues = this._mSampleValues;
      var intervalStart = 0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;
      for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;
      var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;
      var initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      }
      if (initialSlope === 0) {
        return guessForT;
      }
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  };
  return ob;
}();
var BezierEaser_default = BezierFactory;

// src/main.js
var svgNS = "http://www.w3.org/2000/svg";
var locationHref = "";
var initialDefaultFrame = -999999;
var getLocationHref = () => locationHref;

// src/utils/pooling/pooling.js
var pooling = /* @__PURE__ */ function() {
  function double(arr) {
    return arr.concat(createSizedArray(arr.length));
  }
  return {
    double
  };
}();
var pooling_default = pooling;

// src/utils/pooling/pool_factory.js
var poolFactory = /* @__PURE__ */ function() {
  return function(initialLength, _create, _release) {
    var _length = 0;
    var _maxLength = initialLength;
    var pool = createSizedArray(_maxLength);
    var ob = {
      newElement,
      release
    };
    function newElement() {
      var element;
      if (_length) {
        _length -= 1;
        element = pool[_length];
      } else {
        element = _create();
      }
      return element;
    }
    function release(element) {
      if (_length === _maxLength) {
        pool = pooling_default.double(pool);
        _maxLength *= 2;
      }
      if (_release) {
        _release(element);
      }
      pool[_length] = element;
      _length += 1;
    }
    return ob;
  };
}();
var pool_factory_default = poolFactory;

// src/utils/pooling/bezier_length_pool.js
var bezierLengthPool = function() {
  function create() {
    return {
      addedLength: 0,
      percents: createTypedArray("float32", getDefaultCurveSegments()),
      lengths: createTypedArray("float32", getDefaultCurveSegments())
    };
  }
  return pool_factory_default(8, create);
}();
var bezier_length_pool_default = bezierLengthPool;

// src/utils/pooling/segments_length_pool.js
var segmentsLengthPool = function() {
  function create() {
    return {
      lengths: [],
      totalLength: 0
    };
  }
  function release(element) {
    var i;
    var len = element.lengths.length;
    for (i = 0; i < len; i += 1) {
      bezier_length_pool_default.release(element.lengths[i]);
    }
    element.lengths.length = 0;
  }
  return pool_factory_default(8, create, release);
}();
var segments_length_pool_default = segmentsLengthPool;

// src/utils/bez.js
function bezFunction() {
  var math = Math;
  function pointOnLine2D(x1, y1, x2, y2, x3, y3) {
    var det1 = x1 * y2 + y1 * x3 + x2 * y3 - x3 * y2 - y3 * x1 - x2 * y1;
    return det1 > -1e-3 && det1 < 1e-3;
  }
  function pointOnLine3D(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    if (z1 === 0 && z2 === 0 && z3 === 0) {
      return pointOnLine2D(x1, y1, x2, y2, x3, y3);
    }
    var dist1 = math.sqrt(math.pow(x2 - x1, 2) + math.pow(y2 - y1, 2) + math.pow(z2 - z1, 2));
    var dist2 = math.sqrt(math.pow(x3 - x1, 2) + math.pow(y3 - y1, 2) + math.pow(z3 - z1, 2));
    var dist3 = math.sqrt(math.pow(x3 - x2, 2) + math.pow(y3 - y2, 2) + math.pow(z3 - z2, 2));
    var diffDist;
    if (dist1 > dist2) {
      if (dist1 > dist3) {
        diffDist = dist1 - dist2 - dist3;
      } else {
        diffDist = dist3 - dist2 - dist1;
      }
    } else if (dist3 > dist2) {
      diffDist = dist3 - dist2 - dist1;
    } else {
      diffDist = dist2 - dist1 - dist3;
    }
    return diffDist > -1e-4 && diffDist < 1e-4;
  }
  var getBezierLength = /* @__PURE__ */ function() {
    return function(pt1, pt2, pt3, pt4) {
      var curveSegments = getDefaultCurveSegments();
      var k;
      var i;
      var len;
      var ptCoord;
      var perc;
      var addedLength = 0;
      var ptDistance;
      var point = [];
      var lastPoint = [];
      var lengthData = bezier_length_pool_default.newElement();
      len = pt3.length;
      for (k = 0; k < curveSegments; k += 1) {
        perc = k / (curveSegments - 1);
        ptDistance = 0;
        for (i = 0; i < len; i += 1) {
          ptCoord = bmPow(1 - perc, 3) * pt1[i] + 3 * bmPow(1 - perc, 2) * perc * pt3[i] + 3 * (1 - perc) * bmPow(perc, 2) * pt4[i] + bmPow(perc, 3) * pt2[i];
          point[i] = ptCoord;
          if (lastPoint[i] !== null) {
            ptDistance += bmPow(point[i] - lastPoint[i], 2);
          }
          lastPoint[i] = point[i];
        }
        if (ptDistance) {
          ptDistance = bmSqrt(ptDistance);
          addedLength += ptDistance;
        }
        lengthData.percents[k] = perc;
        lengthData.lengths[k] = addedLength;
      }
      lengthData.addedLength = addedLength;
      return lengthData;
    };
  }();
  function getSegmentsLength(shapeData) {
    var segmentsLength = segments_length_pool_default.newElement();
    var closed = shapeData.c;
    var pathV = shapeData.v;
    var pathO = shapeData.o;
    var pathI = shapeData.i;
    var i;
    var len = shapeData._length;
    var lengths = segmentsLength.lengths;
    var totalLength = 0;
    for (i = 0; i < len - 1; i += 1) {
      lengths[i] = getBezierLength(pathV[i], pathV[i + 1], pathO[i], pathI[i + 1]);
      totalLength += lengths[i].addedLength;
    }
    if (closed && len) {
      lengths[i] = getBezierLength(pathV[i], pathV[0], pathO[i], pathI[0]);
      totalLength += lengths[i].addedLength;
    }
    segmentsLength.totalLength = totalLength;
    return segmentsLength;
  }
  function BezierData(length) {
    this.segmentLength = 0;
    this.points = new Array(length);
  }
  function PointData(partial, point) {
    this.partialLength = partial;
    this.point = point;
  }
  var buildBezierData = /* @__PURE__ */ function() {
    var storedData = {};
    return function(pt1, pt2, pt3, pt4) {
      var bezierName = (pt1[0] + "_" + pt1[1] + "_" + pt2[0] + "_" + pt2[1] + "_" + pt3[0] + "_" + pt3[1] + "_" + pt4[0] + "_" + pt4[1]).replace(/\./g, "p");
      if (!storedData[bezierName]) {
        var curveSegments = getDefaultCurveSegments();
        var k;
        var i;
        var len;
        var ptCoord;
        var perc;
        var addedLength = 0;
        var ptDistance;
        var point;
        var lastPoint = null;
        if (pt1.length === 2 && (pt1[0] !== pt2[0] || pt1[1] !== pt2[1]) && pointOnLine2D(pt1[0], pt1[1], pt2[0], pt2[1], pt1[0] + pt3[0], pt1[1] + pt3[1]) && pointOnLine2D(pt1[0], pt1[1], pt2[0], pt2[1], pt2[0] + pt4[0], pt2[1] + pt4[1])) {
          curveSegments = 2;
        }
        var bezierData = new BezierData(curveSegments);
        len = pt3.length;
        for (k = 0; k < curveSegments; k += 1) {
          point = createSizedArray(len);
          perc = k / (curveSegments - 1);
          ptDistance = 0;
          for (i = 0; i < len; i += 1) {
            ptCoord = bmPow(1 - perc, 3) * pt1[i] + 3 * bmPow(1 - perc, 2) * perc * (pt1[i] + pt3[i]) + 3 * (1 - perc) * bmPow(perc, 2) * (pt2[i] + pt4[i]) + bmPow(perc, 3) * pt2[i];
            point[i] = ptCoord;
            if (lastPoint !== null) {
              ptDistance += bmPow(point[i] - lastPoint[i], 2);
            }
          }
          ptDistance = bmSqrt(ptDistance);
          addedLength += ptDistance;
          bezierData.points[k] = new PointData(ptDistance, point);
          lastPoint = point;
        }
        bezierData.segmentLength = addedLength;
        storedData[bezierName] = bezierData;
      }
      return storedData[bezierName];
    };
  }();
  function getDistancePerc(perc, bezierData) {
    var percents = bezierData.percents;
    var lengths = bezierData.lengths;
    var len = percents.length;
    var initPos = bmFloor((len - 1) * perc);
    var lengthPos = perc * bezierData.addedLength;
    var lPerc = 0;
    if (initPos === len - 1 || initPos === 0 || lengthPos === lengths[initPos]) {
      return percents[initPos];
    }
    var dir = lengths[initPos] > lengthPos ? -1 : 1;
    var flag = true;
    while (flag) {
      if (lengths[initPos] <= lengthPos && lengths[initPos + 1] > lengthPos) {
        lPerc = (lengthPos - lengths[initPos]) / (lengths[initPos + 1] - lengths[initPos]);
        flag = false;
      } else {
        initPos += dir;
      }
      if (initPos < 0 || initPos >= len - 1) {
        if (initPos === len - 1) {
          return percents[initPos];
        }
        flag = false;
      }
    }
    return percents[initPos] + (percents[initPos + 1] - percents[initPos]) * lPerc;
  }
  function getPointInSegment(pt1, pt2, pt3, pt4, percent, bezierData) {
    var t1 = getDistancePerc(percent, bezierData);
    var u1 = 1 - t1;
    var ptX = math.round((u1 * u1 * u1 * pt1[0] + (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * pt3[0] + (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * pt4[0] + t1 * t1 * t1 * pt2[0]) * 1e3) / 1e3;
    var ptY = math.round((u1 * u1 * u1 * pt1[1] + (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * pt3[1] + (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * pt4[1] + t1 * t1 * t1 * pt2[1]) * 1e3) / 1e3;
    return [ptX, ptY];
  }
  var bezierSegmentPoints = createTypedArray("float32", 8);
  function getNewSegment(pt1, pt2, pt3, pt4, startPerc, endPerc, bezierData) {
    if (startPerc < 0) {
      startPerc = 0;
    } else if (startPerc > 1) {
      startPerc = 1;
    }
    var t0 = getDistancePerc(startPerc, bezierData);
    endPerc = endPerc > 1 ? 1 : endPerc;
    var t1 = getDistancePerc(endPerc, bezierData);
    var i;
    var len = pt1.length;
    var u0 = 1 - t0;
    var u1 = 1 - t1;
    var u0u0u0 = u0 * u0 * u0;
    var t0u0u0_3 = t0 * u0 * u0 * 3;
    var t0t0u0_3 = t0 * t0 * u0 * 3;
    var t0t0t0 = t0 * t0 * t0;
    var u0u0u1 = u0 * u0 * u1;
    var t0u0u1_3 = t0 * u0 * u1 + u0 * t0 * u1 + u0 * u0 * t1;
    var t0t0u1_3 = t0 * t0 * u1 + u0 * t0 * t1 + t0 * u0 * t1;
    var t0t0t1 = t0 * t0 * t1;
    var u0u1u1 = u0 * u1 * u1;
    var t0u1u1_3 = t0 * u1 * u1 + u0 * t1 * u1 + u0 * u1 * t1;
    var t0t1u1_3 = t0 * t1 * u1 + u0 * t1 * t1 + t0 * u1 * t1;
    var t0t1t1 = t0 * t1 * t1;
    var u1u1u1 = u1 * u1 * u1;
    var t1u1u1_3 = t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1;
    var t1t1u1_3 = t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1;
    var t1t1t1 = t1 * t1 * t1;
    for (i = 0; i < len; i += 1) {
      bezierSegmentPoints[i * 4] = math.round((u0u0u0 * pt1[i] + t0u0u0_3 * pt3[i] + t0t0u0_3 * pt4[i] + t0t0t0 * pt2[i]) * 1e3) / 1e3;
      bezierSegmentPoints[i * 4 + 1] = math.round((u0u0u1 * pt1[i] + t0u0u1_3 * pt3[i] + t0t0u1_3 * pt4[i] + t0t0t1 * pt2[i]) * 1e3) / 1e3;
      bezierSegmentPoints[i * 4 + 2] = math.round((u0u1u1 * pt1[i] + t0u1u1_3 * pt3[i] + t0t1u1_3 * pt4[i] + t0t1t1 * pt2[i]) * 1e3) / 1e3;
      bezierSegmentPoints[i * 4 + 3] = math.round((u1u1u1 * pt1[i] + t1u1u1_3 * pt3[i] + t1t1u1_3 * pt4[i] + t1t1t1 * pt2[i]) * 1e3) / 1e3;
    }
    return bezierSegmentPoints;
  }
  return {
    getSegmentsLength,
    getNewSegment,
    getPointInSegment,
    buildBezierData,
    pointOnLine2D,
    pointOnLine3D
  };
}
var bez = bezFunction();
var bez_default = bez;

// src/utils/PropertyFactory.js
var initFrame = initialDefaultFrame;
var mathAbs = Math.abs;
function interpolateValue(frameNum, caching) {
  var offsetTime = this.offsetTime;
  var newValue;
  if (this.propType === "multidimensional") {
    newValue = createTypedArray("float32", this.pv.length);
  }
  var iterationIndex = caching.lastIndex;
  var i = iterationIndex;
  var len = this.keyframes.length - 1;
  var flag = true;
  var keyData;
  var nextKeyData;
  var keyframeMetadata;
  while (flag) {
    keyData = this.keyframes[i];
    nextKeyData = this.keyframes[i + 1];
    if (i === len - 1 && frameNum >= nextKeyData.t - offsetTime) {
      if (keyData.h) {
        keyData = nextKeyData;
      }
      iterationIndex = 0;
      break;
    }
    if (nextKeyData.t - offsetTime > frameNum) {
      iterationIndex = i;
      break;
    }
    if (i < len - 1) {
      i += 1;
    } else {
      iterationIndex = 0;
      flag = false;
    }
  }
  keyframeMetadata = this.keyframesMetadata[i] || {};
  var k;
  var kLen;
  var perc;
  var jLen;
  var j;
  var fnc;
  var nextKeyTime = nextKeyData.t - offsetTime;
  var keyTime = keyData.t - offsetTime;
  var endValue;
  if (keyData.to) {
    if (!keyframeMetadata.bezierData) {
      keyframeMetadata.bezierData = bez_default.buildBezierData(keyData.s, nextKeyData.s || keyData.e, keyData.to, keyData.ti);
    }
    var bezierData = keyframeMetadata.bezierData;
    if (frameNum >= nextKeyTime || frameNum < keyTime) {
      var ind = frameNum >= nextKeyTime ? bezierData.points.length - 1 : 0;
      kLen = bezierData.points[ind].point.length;
      for (k = 0; k < kLen; k += 1) {
        newValue[k] = bezierData.points[ind].point[k];
      }
    } else {
      if (keyframeMetadata.__fnct) {
        fnc = keyframeMetadata.__fnct;
      } else {
        fnc = BezierEaser_default.getBezierEasing(keyData.o.x, keyData.o.y, keyData.i.x, keyData.i.y, keyData.n).get;
        keyframeMetadata.__fnct = fnc;
      }
      perc = fnc((frameNum - keyTime) / (nextKeyTime - keyTime));
      var distanceInLine = bezierData.segmentLength * perc;
      var segmentPerc;
      var addedLength = caching.lastFrame < frameNum && caching._lastKeyframeIndex === i ? caching._lastAddedLength : 0;
      j = caching.lastFrame < frameNum && caching._lastKeyframeIndex === i ? caching._lastPoint : 0;
      flag = true;
      jLen = bezierData.points.length;
      while (flag) {
        addedLength += bezierData.points[j].partialLength;
        if (distanceInLine === 0 || perc === 0 || j === bezierData.points.length - 1) {
          kLen = bezierData.points[j].point.length;
          for (k = 0; k < kLen; k += 1) {
            newValue[k] = bezierData.points[j].point[k];
          }
          break;
        } else if (distanceInLine >= addedLength && distanceInLine < addedLength + bezierData.points[j + 1].partialLength) {
          segmentPerc = (distanceInLine - addedLength) / bezierData.points[j + 1].partialLength;
          kLen = bezierData.points[j].point.length;
          for (k = 0; k < kLen; k += 1) {
            newValue[k] = bezierData.points[j].point[k] + (bezierData.points[j + 1].point[k] - bezierData.points[j].point[k]) * segmentPerc;
          }
          break;
        }
        if (j < jLen - 1) {
          j += 1;
        } else {
          flag = false;
        }
      }
      caching._lastPoint = j;
      caching._lastAddedLength = addedLength - bezierData.points[j].partialLength;
      caching._lastKeyframeIndex = i;
    }
  } else {
    var outX;
    var outY;
    var inX;
    var inY;
    var keyValue;
    len = keyData.s.length;
    endValue = nextKeyData.s || keyData.e;
    if (this.sh && keyData.h !== 1) {
      if (frameNum >= nextKeyTime) {
        newValue[0] = endValue[0];
        newValue[1] = endValue[1];
        newValue[2] = endValue[2];
      } else if (frameNum <= keyTime) {
        newValue[0] = keyData.s[0];
        newValue[1] = keyData.s[1];
        newValue[2] = keyData.s[2];
      } else {
        var quatStart = createQuaternion(keyData.s);
        var quatEnd = createQuaternion(endValue);
        var time = (frameNum - keyTime) / (nextKeyTime - keyTime);
        quaternionToEuler(newValue, slerp(quatStart, quatEnd, time));
      }
    } else {
      for (i = 0; i < len; i += 1) {
        if (keyData.h !== 1) {
          if (frameNum >= nextKeyTime) {
            perc = 1;
          } else if (frameNum < keyTime) {
            perc = 0;
          } else {
            if (keyData.o.x.constructor === Array) {
              if (!keyframeMetadata.__fnct) {
                keyframeMetadata.__fnct = [];
              }
              if (!keyframeMetadata.__fnct[i]) {
                outX = keyData.o.x[i] === void 0 ? keyData.o.x[0] : keyData.o.x[i];
                outY = keyData.o.y[i] === void 0 ? keyData.o.y[0] : keyData.o.y[i];
                inX = keyData.i.x[i] === void 0 ? keyData.i.x[0] : keyData.i.x[i];
                inY = keyData.i.y[i] === void 0 ? keyData.i.y[0] : keyData.i.y[i];
                fnc = BezierEaser_default.getBezierEasing(outX, outY, inX, inY).get;
                keyframeMetadata.__fnct[i] = fnc;
              } else {
                fnc = keyframeMetadata.__fnct[i];
              }
            } else if (!keyframeMetadata.__fnct) {
              outX = keyData.o.x;
              outY = keyData.o.y;
              inX = keyData.i.x;
              inY = keyData.i.y;
              fnc = BezierEaser_default.getBezierEasing(outX, outY, inX, inY).get;
              keyData.keyframeMetadata = fnc;
            } else {
              fnc = keyframeMetadata.__fnct;
            }
            perc = fnc((frameNum - keyTime) / (nextKeyTime - keyTime));
          }
        }
        endValue = nextKeyData.s || keyData.e;
        keyValue = keyData.h === 1 ? keyData.s[i] : keyData.s[i] + (endValue[i] - keyData.s[i]) * perc;
        if (this.propType === "multidimensional") {
          newValue[i] = keyValue;
        } else {
          newValue = keyValue;
        }
      }
    }
  }
  caching.lastIndex = iterationIndex;
  return newValue;
}
function slerp(a, b, t) {
  var out = [];
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  var bx = b[0];
  var by = b[1];
  var bz = b[2];
  var bw = b[3];
  var omega;
  var cosom;
  var sinom;
  var scale0;
  var scale1;
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1 - cosom > 1e-6) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1 - t;
    scale1 = t;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
function quaternionToEuler(out, quat) {
  var qx = quat[0];
  var qy = quat[1];
  var qz = quat[2];
  var qw = quat[3];
  var heading = Math.atan2(2 * qy * qw - 2 * qx * qz, 1 - 2 * qy * qy - 2 * qz * qz);
  var attitude = Math.asin(2 * qx * qy + 2 * qz * qw);
  var bank = Math.atan2(2 * qx * qw - 2 * qy * qz, 1 - 2 * qx * qx - 2 * qz * qz);
  out[0] = heading / degToRads;
  out[1] = attitude / degToRads;
  out[2] = bank / degToRads;
}
function createQuaternion(values) {
  var heading = values[0] * degToRads;
  var attitude = values[1] * degToRads;
  var bank = values[2] * degToRads;
  var c1 = Math.cos(heading / 2);
  var c2 = Math.cos(attitude / 2);
  var c3 = Math.cos(bank / 2);
  var s1 = Math.sin(heading / 2);
  var s2 = Math.sin(attitude / 2);
  var s3 = Math.sin(bank / 2);
  var w = c1 * c2 * c3 - s1 * s2 * s3;
  var x = s1 * s2 * c3 + c1 * c2 * s3;
  var y = s1 * c2 * c3 + c1 * s2 * s3;
  var z = c1 * s2 * c3 - s1 * c2 * s3;
  return [x, y, z, w];
}
function getValueAtCurrentTime() {
  var frameNum = this.comp.renderedFrame - this.offsetTime;
  var initTime = this.keyframes[0].t - this.offsetTime;
  var endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
  if (!(frameNum === this._caching.lastFrame || this._caching.lastFrame !== initFrame && (this._caching.lastFrame >= endTime && frameNum >= endTime || this._caching.lastFrame < initTime && frameNum < initTime))) {
    if (this._caching.lastFrame >= frameNum) {
      this._caching._lastKeyframeIndex = -1;
      this._caching.lastIndex = 0;
    }
    var renderResult = this.interpolateValue(frameNum, this._caching);
    this.pv = renderResult;
  }
  this._caching.lastFrame = frameNum;
  return this.pv;
}
function setVValue(val) {
  var multipliedValue;
  if (this.propType === "unidimensional") {
    multipliedValue = val * this.mult;
    if (mathAbs(this.v - multipliedValue) > 1e-5) {
      this.v = multipliedValue;
      this._mdf = true;
    }
  } else {
    var i = 0;
    var len = this.v.length;
    while (i < len) {
      multipliedValue = val[i] * this.mult;
      if (mathAbs(this.v[i] - multipliedValue) > 1e-5) {
        this.v[i] = multipliedValue;
        this._mdf = true;
      }
      i += 1;
    }
  }
}
function processEffectsSequence() {
  if (this.elem.globalData.frameId === this.frameId || !this.effectsSequence.length) {
    return;
  }
  if (this.lock) {
    this.setVValue(this.pv);
    return;
  }
  this.lock = true;
  this._mdf = this._isFirstFrame;
  var i;
  var len = this.effectsSequence.length;
  var finalValue = this.kf ? this.pv : this.data.k;
  for (i = 0; i < len; i += 1) {
    finalValue = this.effectsSequence[i](finalValue);
  }
  this.setVValue(finalValue);
  this._isFirstFrame = false;
  this.lock = false;
  this.frameId = this.elem.globalData.frameId;
}
function addEffect(effectFunction) {
  this.effectsSequence.push(effectFunction);
  this.container.addDynamicProperty(this);
}
function ValueProperty(elem, data, mult, container) {
  this.propType = "unidimensional";
  this.mult = mult || 1;
  this.data = data;
  this.v = mult ? data.k * mult : data.k;
  this.pv = data.k;
  this._mdf = false;
  this.elem = elem;
  this.container = container;
  this.comp = elem.comp;
  this.k = false;
  this.kf = false;
  this.vel = 0;
  this.effectsSequence = [];
  this._isFirstFrame = true;
  this.getValue = processEffectsSequence;
  this.setVValue = setVValue;
  this.addEffect = addEffect;
}
function MultiDimensionalProperty(elem, data, mult, container) {
  this.propType = "multidimensional";
  this.mult = mult || 1;
  this.data = data;
  this._mdf = false;
  this.elem = elem;
  this.container = container;
  this.comp = elem.comp;
  this.k = false;
  this.kf = false;
  this.frameId = -1;
  var i;
  var len = data.k.length;
  this.v = createTypedArray("float32", len);
  this.pv = createTypedArray("float32", len);
  this.vel = createTypedArray("float32", len);
  for (i = 0; i < len; i += 1) {
    this.v[i] = data.k[i] * this.mult;
    this.pv[i] = data.k[i];
  }
  this._isFirstFrame = true;
  this.effectsSequence = [];
  this.getValue = processEffectsSequence;
  this.setVValue = setVValue;
  this.addEffect = addEffect;
}
function KeyframedValueProperty(elem, data, mult, container) {
  this.propType = "unidimensional";
  this.keyframes = data.k;
  this.keyframesMetadata = [];
  this.offsetTime = elem.data.st;
  this.frameId = -1;
  this._caching = {
    lastFrame: initFrame,
    lastIndex: 0,
    value: 0,
    _lastKeyframeIndex: -1
  };
  this.k = true;
  this.kf = true;
  this.data = data;
  this.mult = mult || 1;
  this.elem = elem;
  this.container = container;
  this.comp = elem.comp;
  this.v = initFrame;
  this.pv = initFrame;
  this._isFirstFrame = true;
  this.getValue = processEffectsSequence;
  this.setVValue = setVValue;
  this.interpolateValue = interpolateValue;
  this.effectsSequence = [getValueAtCurrentTime.bind(this)];
  this.addEffect = addEffect;
}
function KeyframedMultidimensionalProperty(elem, data, mult, container) {
  this.propType = "multidimensional";
  var i;
  var len = data.k.length;
  var s;
  var e;
  var to;
  var ti;
  for (i = 0; i < len - 1; i += 1) {
    if (data.k[i].to && data.k[i].s && data.k[i + 1] && data.k[i + 1].s) {
      s = data.k[i].s;
      e = data.k[i + 1].s;
      to = data.k[i].to;
      ti = data.k[i].ti;
      if (s.length === 2 && !(s[0] === e[0] && s[1] === e[1]) && bez_default.pointOnLine2D(s[0], s[1], e[0], e[1], s[0] + to[0], s[1] + to[1]) && bez_default.pointOnLine2D(s[0], s[1], e[0], e[1], e[0] + ti[0], e[1] + ti[1]) || s.length === 3 && !(s[0] === e[0] && s[1] === e[1] && s[2] === e[2]) && bez_default.pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], s[0] + to[0], s[1] + to[1], s[2] + to[2]) && bez_default.pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], e[0] + ti[0], e[1] + ti[1], e[2] + ti[2])) {
        data.k[i].to = null;
        data.k[i].ti = null;
      }
      if (s[0] === e[0] && s[1] === e[1] && to[0] === 0 && to[1] === 0 && ti[0] === 0 && ti[1] === 0) {
        if (s.length === 2 || s[2] === e[2] && to[2] === 0 && ti[2] === 0) {
          data.k[i].to = null;
          data.k[i].ti = null;
        }
      }
    }
  }
  this.effectsSequence = [getValueAtCurrentTime.bind(this)];
  this.data = data;
  this.keyframes = data.k;
  this.keyframesMetadata = [];
  this.offsetTime = elem.data.st;
  this.k = true;
  this.kf = true;
  this._isFirstFrame = true;
  this.mult = mult || 1;
  this.elem = elem;
  this.container = container;
  this.comp = elem.comp;
  this.getValue = processEffectsSequence;
  this.setVValue = setVValue;
  this.interpolateValue = interpolateValue;
  this.frameId = -1;
  var arrLen = data.k[0].s.length;
  this.v = createTypedArray("float32", arrLen);
  this.pv = createTypedArray("float32", arrLen);
  for (i = 0; i < arrLen; i += 1) {
    this.v[i] = initFrame;
    this.pv[i] = initFrame;
  }
  this._caching = { lastFrame: initFrame, lastIndex: 0, value: createTypedArray("float32", arrLen) };
  this.addEffect = addEffect;
}
var PropertyFactory = /* @__PURE__ */ function() {
  function getProp(elem, data, type, mult, container) {
    if (data.sid) {
      data = elem.globalData.slotManager.getProp(data);
    }
    var p;
    if (!data.k.length) {
      p = new ValueProperty(elem, data, mult, container);
    } else if (typeof data.k[0] === "number") {
      p = new MultiDimensionalProperty(elem, data, mult, container);
    } else {
      switch (type) {
        case 0:
          p = new KeyframedValueProperty(elem, data, mult, container);
          break;
        case 1:
          p = new KeyframedMultidimensionalProperty(elem, data, mult, container);
          break;
        default:
          break;
      }
    }
    if (p.effectsSequence.length) {
      container.addDynamicProperty(p);
    }
    return p;
  }
  var ob = {
    getProp
  };
  return ob;
}();
var PropertyFactory_default = PropertyFactory;

// src/utils/helpers/dynamicProperties.js
function DynamicPropertyContainer() {
}
DynamicPropertyContainer.prototype = {
  addDynamicProperty: function(prop) {
    if (this.dynamicProperties.indexOf(prop) === -1) {
      this.dynamicProperties.push(prop);
      this.container.addDynamicProperty(this);
      this._isAnimated = true;
    }
  },
  iterateDynamicProperties: function() {
    this._mdf = false;
    var i;
    var len = this.dynamicProperties.length;
    for (i = 0; i < len; i += 1) {
      this.dynamicProperties[i].getValue();
      if (this.dynamicProperties[i]._mdf) {
        this._mdf = true;
      }
    }
  },
  initDynamicPropertyContainer: function(container) {
    this.container = container;
    this.dynamicProperties = [];
    this._mdf = false;
    this._isAnimated = false;
  }
};
var dynamicProperties_default = DynamicPropertyContainer;

// src/utils/pooling/point_pool.js
var pointPool = function() {
  function create() {
    return createTypedArray("float32", 2);
  }
  return pool_factory_default(8, create);
}();
var point_pool_default = pointPool;

// src/utils/shapes/ShapePath.js
function ShapePath() {
  this.c = false;
  this._length = 0;
  this._maxLength = 8;
  this.v = createSizedArray(this._maxLength);
  this.o = createSizedArray(this._maxLength);
  this.i = createSizedArray(this._maxLength);
}
ShapePath.prototype.setPathData = function(closed, len) {
  this.c = closed;
  this.setLength(len);
  var i = 0;
  while (i < len) {
    this.v[i] = point_pool_default.newElement();
    this.o[i] = point_pool_default.newElement();
    this.i[i] = point_pool_default.newElement();
    i += 1;
  }
};
ShapePath.prototype.setLength = function(len) {
  while (this._maxLength < len) {
    this.doubleArrayLength();
  }
  this._length = len;
};
ShapePath.prototype.doubleArrayLength = function() {
  this.v = this.v.concat(createSizedArray(this._maxLength));
  this.i = this.i.concat(createSizedArray(this._maxLength));
  this.o = this.o.concat(createSizedArray(this._maxLength));
  this._maxLength *= 2;
};
ShapePath.prototype.setXYAt = function(x, y, type, pos, replace) {
  var arr;
  this._length = Math.max(this._length, pos + 1);
  if (this._length >= this._maxLength) {
    this.doubleArrayLength();
  }
  switch (type) {
    case "v":
      arr = this.v;
      break;
    case "i":
      arr = this.i;
      break;
    case "o":
      arr = this.o;
      break;
    default:
      arr = [];
      break;
  }
  if (!arr[pos] || arr[pos] && !replace) {
    arr[pos] = point_pool_default.newElement();
  }
  arr[pos][0] = x;
  arr[pos][1] = y;
};
ShapePath.prototype.setTripleAt = function(vX, vY, oX, oY, iX, iY, pos, replace) {
  this.setXYAt(vX, vY, "v", pos, replace);
  this.setXYAt(oX, oY, "o", pos, replace);
  this.setXYAt(iX, iY, "i", pos, replace);
};
ShapePath.prototype.reverse = function() {
  var newPath = new ShapePath();
  newPath.setPathData(this.c, this._length);
  var vertices = this.v;
  var outPoints = this.o;
  var inPoints = this.i;
  var init = 0;
  if (this.c) {
    newPath.setTripleAt(vertices[0][0], vertices[0][1], inPoints[0][0], inPoints[0][1], outPoints[0][0], outPoints[0][1], 0, false);
    init = 1;
  }
  var cnt = this._length - 1;
  var len = this._length;
  var i;
  for (i = init; i < len; i += 1) {
    newPath.setTripleAt(vertices[cnt][0], vertices[cnt][1], inPoints[cnt][0], inPoints[cnt][1], outPoints[cnt][0], outPoints[cnt][1], i, false);
    cnt -= 1;
  }
  return newPath;
};
ShapePath.prototype.length = function() {
  return this._length;
};
var ShapePath_default = ShapePath;

// src/utils/pooling/shape_pool.js
var shapePool = function() {
  function create() {
    return new ShapePath_default();
  }
  function release(shapePath) {
    var len = shapePath._length;
    var i;
    for (i = 0; i < len; i += 1) {
      point_pool_default.release(shapePath.v[i]);
      point_pool_default.release(shapePath.i[i]);
      point_pool_default.release(shapePath.o[i]);
      shapePath.v[i] = null;
      shapePath.i[i] = null;
      shapePath.o[i] = null;
    }
    shapePath._length = 0;
    shapePath.c = false;
  }
  function clone(shape) {
    var cloned = factory.newElement();
    var i;
    var len = shape._length === void 0 ? shape.v.length : shape._length;
    cloned.setLength(len);
    cloned.c = shape.c;
    for (i = 0; i < len; i += 1) {
      cloned.setTripleAt(shape.v[i][0], shape.v[i][1], shape.o[i][0], shape.o[i][1], shape.i[i][0], shape.i[i][1], i);
    }
    return cloned;
  }
  var factory = pool_factory_default(4, create, release);
  factory.clone = clone;
  return factory;
}();
var shape_pool_default = shapePool;

// src/utils/shapes/ShapeCollection.js
function ShapeCollection() {
  this._length = 0;
  this._maxLength = 4;
  this.shapes = createSizedArray(this._maxLength);
}
ShapeCollection.prototype.addShape = function(shapeData) {
  if (this._length === this._maxLength) {
    this.shapes = this.shapes.concat(createSizedArray(this._maxLength));
    this._maxLength *= 2;
  }
  this.shapes[this._length] = shapeData;
  this._length += 1;
};
ShapeCollection.prototype.releaseShapes = function() {
  var i;
  for (i = 0; i < this._length; i += 1) {
    shape_pool_default.release(this.shapes[i]);
  }
  this._length = 0;
};
var ShapeCollection_default = ShapeCollection;

// src/utils/pooling/shapeCollection_pool.js
var shapeCollectionPool = function() {
  var ob = {
    newShapeCollection,
    release
  };
  var _length = 0;
  var _maxLength = 4;
  var pool = createSizedArray(_maxLength);
  function newShapeCollection() {
    var shapeCollection;
    if (_length) {
      _length -= 1;
      shapeCollection = pool[_length];
    } else {
      shapeCollection = new ShapeCollection_default();
    }
    return shapeCollection;
  }
  function release(shapeCollection) {
    var i;
    var len = shapeCollection._length;
    for (i = 0; i < len; i += 1) {
      shape_pool_default.release(shapeCollection.shapes[i]);
    }
    shapeCollection._length = 0;
    if (_length === _maxLength) {
      pool = pooling_default.double(pool);
      _maxLength *= 2;
    }
    pool[_length] = shapeCollection;
    _length += 1;
  }
  return ob;
}();
var shapeCollection_pool_default = shapeCollectionPool;

// src/utils/shapes/ShapeProperty.js
var ShapePropertyFactory = function() {
  var initFrame2 = -999999;
  function interpolateShape(frameNum, previousValue, caching) {
    var iterationIndex = caching.lastIndex;
    var keyPropS;
    var keyPropE;
    var isHold;
    var j;
    var k;
    var jLen;
    var kLen;
    var perc;
    var vertexValue;
    var kf = this.keyframes;
    if (frameNum < kf[0].t - this.offsetTime) {
      keyPropS = kf[0].s[0];
      isHold = true;
      iterationIndex = 0;
    } else if (frameNum >= kf[kf.length - 1].t - this.offsetTime) {
      keyPropS = kf[kf.length - 1].s ? kf[kf.length - 1].s[0] : kf[kf.length - 2].e[0];
      isHold = true;
    } else {
      var i = iterationIndex;
      var len = kf.length - 1;
      var flag = true;
      var keyData;
      var nextKeyData;
      var keyframeMetadata;
      while (flag) {
        keyData = kf[i];
        nextKeyData = kf[i + 1];
        if (nextKeyData.t - this.offsetTime > frameNum) {
          break;
        }
        if (i < len - 1) {
          i += 1;
        } else {
          flag = false;
        }
      }
      keyframeMetadata = this.keyframesMetadata[i] || {};
      isHold = keyData.h === 1;
      iterationIndex = i;
      if (!isHold) {
        if (frameNum >= nextKeyData.t - this.offsetTime) {
          perc = 1;
        } else if (frameNum < keyData.t - this.offsetTime) {
          perc = 0;
        } else {
          var fnc;
          if (keyframeMetadata.__fnct) {
            fnc = keyframeMetadata.__fnct;
          } else {
            fnc = BezierEaser_default.getBezierEasing(keyData.o.x, keyData.o.y, keyData.i.x, keyData.i.y).get;
            keyframeMetadata.__fnct = fnc;
          }
          perc = fnc((frameNum - (keyData.t - this.offsetTime)) / (nextKeyData.t - this.offsetTime - (keyData.t - this.offsetTime)));
        }
        keyPropE = nextKeyData.s ? nextKeyData.s[0] : keyData.e[0];
      }
      keyPropS = keyData.s[0];
    }
    jLen = previousValue._length;
    kLen = keyPropS.i[0].length;
    caching.lastIndex = iterationIndex;
    for (j = 0; j < jLen; j += 1) {
      for (k = 0; k < kLen; k += 1) {
        vertexValue = isHold ? keyPropS.i[j][k] : keyPropS.i[j][k] + (keyPropE.i[j][k] - keyPropS.i[j][k]) * perc;
        previousValue.i[j][k] = vertexValue;
        vertexValue = isHold ? keyPropS.o[j][k] : keyPropS.o[j][k] + (keyPropE.o[j][k] - keyPropS.o[j][k]) * perc;
        previousValue.o[j][k] = vertexValue;
        vertexValue = isHold ? keyPropS.v[j][k] : keyPropS.v[j][k] + (keyPropE.v[j][k] - keyPropS.v[j][k]) * perc;
        previousValue.v[j][k] = vertexValue;
      }
    }
  }
  function interpolateShapeCurrentTime() {
    var frameNum = this.comp.renderedFrame - this.offsetTime;
    var initTime = this.keyframes[0].t - this.offsetTime;
    var endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
    var lastFrame = this._caching.lastFrame;
    if (!(lastFrame !== initFrame2 && (lastFrame < initTime && frameNum < initTime || lastFrame > endTime && frameNum > endTime))) {
      this._caching.lastIndex = lastFrame < frameNum ? this._caching.lastIndex : 0;
      this.interpolateShape(frameNum, this.pv, this._caching);
    }
    this._caching.lastFrame = frameNum;
    return this.pv;
  }
  function resetShape() {
    this.paths = this.localShapeCollection;
  }
  function shapesEqual(shape1, shape2) {
    if (shape1._length !== shape2._length || shape1.c !== shape2.c) {
      return false;
    }
    var i;
    var len = shape1._length;
    for (i = 0; i < len; i += 1) {
      if (shape1.v[i][0] !== shape2.v[i][0] || shape1.v[i][1] !== shape2.v[i][1] || shape1.o[i][0] !== shape2.o[i][0] || shape1.o[i][1] !== shape2.o[i][1] || shape1.i[i][0] !== shape2.i[i][0] || shape1.i[i][1] !== shape2.i[i][1]) {
        return false;
      }
    }
    return true;
  }
  function setVValue2(newPath) {
    if (!shapesEqual(this.v, newPath)) {
      this.v = shape_pool_default.clone(newPath);
      this.localShapeCollection.releaseShapes();
      this.localShapeCollection.addShape(this.v);
      this._mdf = true;
      this.paths = this.localShapeCollection;
    }
  }
  function processEffectsSequence2() {
    if (this.elem.globalData.frameId === this.frameId) {
      return;
    }
    if (!this.effectsSequence.length) {
      this._mdf = false;
      return;
    }
    if (this.lock) {
      this.setVValue(this.pv);
      return;
    }
    this.lock = true;
    this._mdf = false;
    var finalValue;
    if (this.kf) {
      finalValue = this.pv;
    } else if (this.data.ks) {
      finalValue = this.data.ks.k;
    } else {
      finalValue = this.data.pt.k;
    }
    var i;
    var len = this.effectsSequence.length;
    for (i = 0; i < len; i += 1) {
      finalValue = this.effectsSequence[i](finalValue);
    }
    this.setVValue(finalValue);
    this.lock = false;
    this.frameId = this.elem.globalData.frameId;
  }
  function ShapeProperty(elem, data, type) {
    this.propType = "shape";
    this.comp = elem.comp;
    this.container = elem;
    this.elem = elem;
    this.data = data;
    this.k = false;
    this.kf = false;
    this._mdf = false;
    var pathData = type === 3 ? data.pt.k : data.ks.k;
    this.v = shape_pool_default.clone(pathData);
    this.pv = shape_pool_default.clone(this.v);
    this.localShapeCollection = shapeCollection_pool_default.newShapeCollection();
    this.paths = this.localShapeCollection;
    this.paths.addShape(this.v);
    this.reset = resetShape;
    this.effectsSequence = [];
  }
  function addEffect2(effectFunction) {
    this.effectsSequence.push(effectFunction);
    this.container.addDynamicProperty(this);
  }
  ShapeProperty.prototype.interpolateShape = interpolateShape;
  ShapeProperty.prototype.getValue = processEffectsSequence2;
  ShapeProperty.prototype.setVValue = setVValue2;
  ShapeProperty.prototype.addEffect = addEffect2;
  function KeyframedShapeProperty(elem, data, type) {
    this.propType = "shape";
    this.comp = elem.comp;
    this.elem = elem;
    this.container = elem;
    this.offsetTime = elem.data.st;
    this.keyframes = type === 3 ? data.pt.k : data.ks.k;
    this.keyframesMetadata = [];
    this.k = true;
    this.kf = true;
    var len = this.keyframes[0].s[0].i.length;
    this.v = shape_pool_default.newElement();
    this.v.setPathData(this.keyframes[0].s[0].c, len);
    this.pv = shape_pool_default.clone(this.v);
    this.localShapeCollection = shapeCollection_pool_default.newShapeCollection();
    this.paths = this.localShapeCollection;
    this.paths.addShape(this.v);
    this.lastFrame = initFrame2;
    this.reset = resetShape;
    this._caching = { lastFrame: initFrame2, lastIndex: 0 };
    this.effectsSequence = [interpolateShapeCurrentTime.bind(this)];
  }
  KeyframedShapeProperty.prototype.getValue = processEffectsSequence2;
  KeyframedShapeProperty.prototype.interpolateShape = interpolateShape;
  KeyframedShapeProperty.prototype.setVValue = setVValue2;
  KeyframedShapeProperty.prototype.addEffect = addEffect2;
  var EllShapeProperty = function() {
    var cPoint = roundCorner;
    function EllShapePropertyFactory(elem, data) {
      this.v = shape_pool_default.newElement();
      this.v.setPathData(true, 4);
      this.localShapeCollection = shapeCollection_pool_default.newShapeCollection();
      this.paths = this.localShapeCollection;
      this.localShapeCollection.addShape(this.v);
      this.d = data.d;
      this.elem = elem;
      this.comp = elem.comp;
      this.frameId = -1;
      this.initDynamicPropertyContainer(elem);
      this.p = PropertyFactory_default.getProp(elem, data.p, 1, 0, this);
      this.s = PropertyFactory_default.getProp(elem, data.s, 1, 0, this);
      if (this.dynamicProperties.length) {
        this.k = true;
      } else {
        this.k = false;
        this.convertEllToPath();
      }
    }
    EllShapePropertyFactory.prototype = {
      reset: resetShape,
      getValue: function() {
        if (this.elem.globalData.frameId === this.frameId) {
          return;
        }
        this.frameId = this.elem.globalData.frameId;
        this.iterateDynamicProperties();
        if (this._mdf) {
          this.convertEllToPath();
        }
      },
      convertEllToPath: function() {
        var p0 = this.p.v[0];
        var p1 = this.p.v[1];
        var s0 = this.s.v[0] / 2;
        var s1 = this.s.v[1] / 2;
        var _cw = this.d !== 3;
        var _v = this.v;
        _v.v[0][0] = p0;
        _v.v[0][1] = p1 - s1;
        _v.v[1][0] = _cw ? p0 + s0 : p0 - s0;
        _v.v[1][1] = p1;
        _v.v[2][0] = p0;
        _v.v[2][1] = p1 + s1;
        _v.v[3][0] = _cw ? p0 - s0 : p0 + s0;
        _v.v[3][1] = p1;
        _v.i[0][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
        _v.i[0][1] = p1 - s1;
        _v.i[1][0] = _cw ? p0 + s0 : p0 - s0;
        _v.i[1][1] = p1 - s1 * cPoint;
        _v.i[2][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
        _v.i[2][1] = p1 + s1;
        _v.i[3][0] = _cw ? p0 - s0 : p0 + s0;
        _v.i[3][1] = p1 + s1 * cPoint;
        _v.o[0][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
        _v.o[0][1] = p1 - s1;
        _v.o[1][0] = _cw ? p0 + s0 : p0 - s0;
        _v.o[1][1] = p1 + s1 * cPoint;
        _v.o[2][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
        _v.o[2][1] = p1 + s1;
        _v.o[3][0] = _cw ? p0 - s0 : p0 + s0;
        _v.o[3][1] = p1 - s1 * cPoint;
      }
    };
    extendPrototype([dynamicProperties_default], EllShapePropertyFactory);
    return EllShapePropertyFactory;
  }();
  var StarShapeProperty = function() {
    function StarShapePropertyFactory(elem, data) {
      this.v = shape_pool_default.newElement();
      this.v.setPathData(true, 0);
      this.elem = elem;
      this.comp = elem.comp;
      this.data = data;
      this.frameId = -1;
      this.d = data.d;
      this.initDynamicPropertyContainer(elem);
      if (data.sy === 1) {
        this.ir = PropertyFactory_default.getProp(elem, data.ir, 0, 0, this);
        this.is = PropertyFactory_default.getProp(elem, data.is, 0, 0.01, this);
        this.convertToPath = this.convertStarToPath;
      } else {
        this.convertToPath = this.convertPolygonToPath;
      }
      this.pt = PropertyFactory_default.getProp(elem, data.pt, 0, 0, this);
      this.p = PropertyFactory_default.getProp(elem, data.p, 1, 0, this);
      this.r = PropertyFactory_default.getProp(elem, data.r, 0, degToRads, this);
      this.or = PropertyFactory_default.getProp(elem, data.or, 0, 0, this);
      this.os = PropertyFactory_default.getProp(elem, data.os, 0, 0.01, this);
      this.localShapeCollection = shapeCollection_pool_default.newShapeCollection();
      this.localShapeCollection.addShape(this.v);
      this.paths = this.localShapeCollection;
      if (this.dynamicProperties.length) {
        this.k = true;
      } else {
        this.k = false;
        this.convertToPath();
      }
    }
    StarShapePropertyFactory.prototype = {
      reset: resetShape,
      getValue: function() {
        if (this.elem.globalData.frameId === this.frameId) {
          return;
        }
        this.frameId = this.elem.globalData.frameId;
        this.iterateDynamicProperties();
        if (this._mdf) {
          this.convertToPath();
        }
      },
      convertStarToPath: function() {
        var numPts = Math.floor(this.pt.v) * 2;
        var angle = Math.PI * 2 / numPts;
        var longFlag = true;
        var longRad = this.or.v;
        var shortRad = this.ir.v;
        var longRound = this.os.v;
        var shortRound = this.is.v;
        var longPerimSegment = 2 * Math.PI * longRad / (numPts * 2);
        var shortPerimSegment = 2 * Math.PI * shortRad / (numPts * 2);
        var i;
        var rad;
        var roundness;
        var perimSegment;
        var currentAng = -Math.PI / 2;
        currentAng += this.r.v;
        var dir = this.data.d === 3 ? -1 : 1;
        this.v._length = 0;
        for (i = 0; i < numPts; i += 1) {
          rad = longFlag ? longRad : shortRad;
          roundness = longFlag ? longRound : shortRound;
          perimSegment = longFlag ? longPerimSegment : shortPerimSegment;
          var x = rad * Math.cos(currentAng);
          var y = rad * Math.sin(currentAng);
          var ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y);
          var oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y);
          x += +this.p.v[0];
          y += +this.p.v[1];
          this.v.setTripleAt(x, y, x - ox * perimSegment * roundness * dir, y - oy * perimSegment * roundness * dir, x + ox * perimSegment * roundness * dir, y + oy * perimSegment * roundness * dir, i, true);
          longFlag = !longFlag;
          currentAng += angle * dir;
        }
      },
      convertPolygonToPath: function() {
        var numPts = Math.floor(this.pt.v);
        var angle = Math.PI * 2 / numPts;
        var rad = this.or.v;
        var roundness = this.os.v;
        var perimSegment = 2 * Math.PI * rad / (numPts * 4);
        var i;
        var currentAng = -Math.PI * 0.5;
        var dir = this.data.d === 3 ? -1 : 1;
        currentAng += this.r.v;
        this.v._length = 0;
        for (i = 0; i < numPts; i += 1) {
          var x = rad * Math.cos(currentAng);
          var y = rad * Math.sin(currentAng);
          var ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y);
          var oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y);
          x += +this.p.v[0];
          y += +this.p.v[1];
          this.v.setTripleAt(x, y, x - ox * perimSegment * roundness * dir, y - oy * perimSegment * roundness * dir, x + ox * perimSegment * roundness * dir, y + oy * perimSegment * roundness * dir, i, true);
          currentAng += angle * dir;
        }
        this.paths.length = 0;
        this.paths[0] = this.v;
      }
    };
    extendPrototype([dynamicProperties_default], StarShapePropertyFactory);
    return StarShapePropertyFactory;
  }();
  var RectShapeProperty = function() {
    function RectShapePropertyFactory(elem, data) {
      this.v = shape_pool_default.newElement();
      this.v.c = true;
      this.localShapeCollection = shapeCollection_pool_default.newShapeCollection();
      this.localShapeCollection.addShape(this.v);
      this.paths = this.localShapeCollection;
      this.elem = elem;
      this.comp = elem.comp;
      this.frameId = -1;
      this.d = data.d;
      this.initDynamicPropertyContainer(elem);
      this.p = PropertyFactory_default.getProp(elem, data.p, 1, 0, this);
      this.s = PropertyFactory_default.getProp(elem, data.s, 1, 0, this);
      this.r = PropertyFactory_default.getProp(elem, data.r, 0, 0, this);
      if (this.dynamicProperties.length) {
        this.k = true;
      } else {
        this.k = false;
        this.convertRectToPath();
      }
    }
    RectShapePropertyFactory.prototype = {
      convertRectToPath: function() {
        var p0 = this.p.v[0];
        var p1 = this.p.v[1];
        var v0 = this.s.v[0] / 2;
        var v1 = this.s.v[1] / 2;
        var round = bmMin(v0, v1, this.r.v);
        var cPoint = round * (1 - roundCorner);
        this.v._length = 0;
        if (this.d === 2 || this.d === 1) {
          this.v.setTripleAt(p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + cPoint, 0, true);
          this.v.setTripleAt(p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - cPoint, p0 + v0, p1 + v1 - round, 1, true);
          if (round !== 0) {
            this.v.setTripleAt(p0 + v0 - round, p1 + v1, p0 + v0 - round, p1 + v1, p0 + v0 - cPoint, p1 + v1, 2, true);
            this.v.setTripleAt(p0 - v0 + round, p1 + v1, p0 - v0 + cPoint, p1 + v1, p0 - v0 + round, p1 + v1, 3, true);
            this.v.setTripleAt(p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - cPoint, 4, true);
            this.v.setTripleAt(p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + cPoint, p0 - v0, p1 - v1 + round, 5, true);
            this.v.setTripleAt(p0 - v0 + round, p1 - v1, p0 - v0 + round, p1 - v1, p0 - v0 + cPoint, p1 - v1, 6, true);
            this.v.setTripleAt(p0 + v0 - round, p1 - v1, p0 + v0 - cPoint, p1 - v1, p0 + v0 - round, p1 - v1, 7, true);
          } else {
            this.v.setTripleAt(p0 - v0, p1 + v1, p0 - v0 + cPoint, p1 + v1, p0 - v0, p1 + v1, 2);
            this.v.setTripleAt(p0 - v0, p1 - v1, p0 - v0, p1 - v1 + cPoint, p0 - v0, p1 - v1, 3);
          }
        } else {
          this.v.setTripleAt(p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + cPoint, p0 + v0, p1 - v1 + round, 0, true);
          if (round !== 0) {
            this.v.setTripleAt(p0 + v0 - round, p1 - v1, p0 + v0 - round, p1 - v1, p0 + v0 - cPoint, p1 - v1, 1, true);
            this.v.setTripleAt(p0 - v0 + round, p1 - v1, p0 - v0 + cPoint, p1 - v1, p0 - v0 + round, p1 - v1, 2, true);
            this.v.setTripleAt(p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + cPoint, 3, true);
            this.v.setTripleAt(p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - cPoint, p0 - v0, p1 + v1 - round, 4, true);
            this.v.setTripleAt(p0 - v0 + round, p1 + v1, p0 - v0 + round, p1 + v1, p0 - v0 + cPoint, p1 + v1, 5, true);
            this.v.setTripleAt(p0 + v0 - round, p1 + v1, p0 + v0 - cPoint, p1 + v1, p0 + v0 - round, p1 + v1, 6, true);
            this.v.setTripleAt(p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - cPoint, 7, true);
          } else {
            this.v.setTripleAt(p0 - v0, p1 - v1, p0 - v0 + cPoint, p1 - v1, p0 - v0, p1 - v1, 1, true);
            this.v.setTripleAt(p0 - v0, p1 + v1, p0 - v0, p1 + v1 - cPoint, p0 - v0, p1 + v1, 2, true);
            this.v.setTripleAt(p0 + v0, p1 + v1, p0 + v0 - cPoint, p1 + v1, p0 + v0, p1 + v1, 3, true);
          }
        }
      },
      getValue: function() {
        if (this.elem.globalData.frameId === this.frameId) {
          return;
        }
        this.frameId = this.elem.globalData.frameId;
        this.iterateDynamicProperties();
        if (this._mdf) {
          this.convertRectToPath();
        }
      },
      reset: resetShape
    };
    extendPrototype([dynamicProperties_default], RectShapePropertyFactory);
    return RectShapePropertyFactory;
  }();
  function getShapeProp(elem, data, type) {
    var prop;
    if (type === 3 || type === 4) {
      var dataProp = type === 3 ? data.pt : data.ks;
      var keys = dataProp.k;
      if (keys.length) {
        prop = new KeyframedShapeProperty(elem, data, type);
      } else {
        prop = new ShapeProperty(elem, data, type);
      }
    } else if (type === 5) {
      prop = new RectShapeProperty(elem, data);
    } else if (type === 6) {
      prop = new EllShapeProperty(elem, data);
    } else if (type === 7) {
      prop = new StarShapeProperty(elem, data);
    }
    if (prop.k) {
      elem.addDynamicProperty(prop);
    }
    return prop;
  }
  function getConstructorFunction() {
    return ShapeProperty;
  }
  function getKeyframedConstructorFunction() {
    return KeyframedShapeProperty;
  }
  var ob = {};
  ob.getShapeProp = getShapeProp;
  ob.getConstructorFunction = getConstructorFunction;
  ob.getKeyframedConstructorFunction = getKeyframedConstructorFunction;
  return ob;
}();
var ShapeProperty_default = ShapePropertyFactory;

// src/3rd_party/transformation-matrix.js
var Matrix = /* @__PURE__ */ function() {
  var _cos = Math.cos;
  var _sin = Math.sin;
  var _tan = Math.tan;
  var _rnd = Math.round;
  function reset() {
    this.props[0] = 1;
    this.props[1] = 0;
    this.props[2] = 0;
    this.props[3] = 0;
    this.props[4] = 0;
    this.props[5] = 1;
    this.props[6] = 0;
    this.props[7] = 0;
    this.props[8] = 0;
    this.props[9] = 0;
    this.props[10] = 1;
    this.props[11] = 0;
    this.props[12] = 0;
    this.props[13] = 0;
    this.props[14] = 0;
    this.props[15] = 1;
    return this;
  }
  function rotate(angle) {
    if (angle === 0) {
      return this;
    }
    var mCos = _cos(angle);
    var mSin = _sin(angle);
    return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  function rotateX(angle) {
    if (angle === 0) {
      return this;
    }
    var mCos = _cos(angle);
    var mSin = _sin(angle);
    return this._t(1, 0, 0, 0, 0, mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1);
  }
  function rotateY(angle) {
    if (angle === 0) {
      return this;
    }
    var mCos = _cos(angle);
    var mSin = _sin(angle);
    return this._t(mCos, 0, mSin, 0, 0, 1, 0, 0, -mSin, 0, mCos, 0, 0, 0, 0, 1);
  }
  function rotateZ(angle) {
    if (angle === 0) {
      return this;
    }
    var mCos = _cos(angle);
    var mSin = _sin(angle);
    return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  function shear(sx, sy) {
    return this._t(1, sy, sx, 1, 0, 0);
  }
  function skew(ax, ay) {
    return this.shear(_tan(ax), _tan(ay));
  }
  function skewFromAxis(ax, angle) {
    var mCos = _cos(angle);
    var mSin = _sin(angle);
    return this._t(mCos, mSin, 0, 0, -mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, _tan(ax), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  function scale(sx, sy, sz) {
    if (!sz && sz !== 0) {
      sz = 1;
    }
    if (sx === 1 && sy === 1 && sz === 1) {
      return this;
    }
    return this._t(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1);
  }
  function setTransform(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    this.props[0] = a;
    this.props[1] = b;
    this.props[2] = c;
    this.props[3] = d;
    this.props[4] = e;
    this.props[5] = f;
    this.props[6] = g;
    this.props[7] = h;
    this.props[8] = i;
    this.props[9] = j;
    this.props[10] = k;
    this.props[11] = l;
    this.props[12] = m;
    this.props[13] = n;
    this.props[14] = o;
    this.props[15] = p;
    return this;
  }
  function translate(tx, ty, tz) {
    tz = tz || 0;
    if (tx !== 0 || ty !== 0 || tz !== 0) {
      return this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1);
    }
    return this;
  }
  function transform(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, m2, n2, o2, p2) {
    var _p = this.props;
    if (a2 === 1 && b2 === 0 && c2 === 0 && d2 === 0 && e2 === 0 && f2 === 1 && g2 === 0 && h2 === 0 && i2 === 0 && j2 === 0 && k2 === 1 && l2 === 0) {
      _p[12] = _p[12] * a2 + _p[15] * m2;
      _p[13] = _p[13] * f2 + _p[15] * n2;
      _p[14] = _p[14] * k2 + _p[15] * o2;
      _p[15] *= p2;
      this._identityCalculated = false;
      return this;
    }
    var a1 = _p[0];
    var b1 = _p[1];
    var c1 = _p[2];
    var d1 = _p[3];
    var e1 = _p[4];
    var f1 = _p[5];
    var g1 = _p[6];
    var h1 = _p[7];
    var i1 = _p[8];
    var j1 = _p[9];
    var k1 = _p[10];
    var l1 = _p[11];
    var m1 = _p[12];
    var n1 = _p[13];
    var o1 = _p[14];
    var p1 = _p[15];
    _p[0] = a1 * a2 + b1 * e2 + c1 * i2 + d1 * m2;
    _p[1] = a1 * b2 + b1 * f2 + c1 * j2 + d1 * n2;
    _p[2] = a1 * c2 + b1 * g2 + c1 * k2 + d1 * o2;
    _p[3] = a1 * d2 + b1 * h2 + c1 * l2 + d1 * p2;
    _p[4] = e1 * a2 + f1 * e2 + g1 * i2 + h1 * m2;
    _p[5] = e1 * b2 + f1 * f2 + g1 * j2 + h1 * n2;
    _p[6] = e1 * c2 + f1 * g2 + g1 * k2 + h1 * o2;
    _p[7] = e1 * d2 + f1 * h2 + g1 * l2 + h1 * p2;
    _p[8] = i1 * a2 + j1 * e2 + k1 * i2 + l1 * m2;
    _p[9] = i1 * b2 + j1 * f2 + k1 * j2 + l1 * n2;
    _p[10] = i1 * c2 + j1 * g2 + k1 * k2 + l1 * o2;
    _p[11] = i1 * d2 + j1 * h2 + k1 * l2 + l1 * p2;
    _p[12] = m1 * a2 + n1 * e2 + o1 * i2 + p1 * m2;
    _p[13] = m1 * b2 + n1 * f2 + o1 * j2 + p1 * n2;
    _p[14] = m1 * c2 + n1 * g2 + o1 * k2 + p1 * o2;
    _p[15] = m1 * d2 + n1 * h2 + o1 * l2 + p1 * p2;
    this._identityCalculated = false;
    return this;
  }
  function multiply(matrix) {
    var matrixProps = matrix.props;
    return this.transform(
      matrixProps[0],
      matrixProps[1],
      matrixProps[2],
      matrixProps[3],
      matrixProps[4],
      matrixProps[5],
      matrixProps[6],
      matrixProps[7],
      matrixProps[8],
      matrixProps[9],
      matrixProps[10],
      matrixProps[11],
      matrixProps[12],
      matrixProps[13],
      matrixProps[14],
      matrixProps[15]
    );
  }
  function isIdentity() {
    if (!this._identityCalculated) {
      this._identity = !(this.props[0] !== 1 || this.props[1] !== 0 || this.props[2] !== 0 || this.props[3] !== 0 || this.props[4] !== 0 || this.props[5] !== 1 || this.props[6] !== 0 || this.props[7] !== 0 || this.props[8] !== 0 || this.props[9] !== 0 || this.props[10] !== 1 || this.props[11] !== 0 || this.props[12] !== 0 || this.props[13] !== 0 || this.props[14] !== 0 || this.props[15] !== 1);
      this._identityCalculated = true;
    }
    return this._identity;
  }
  function equals(matr) {
    var i = 0;
    while (i < 16) {
      if (matr.props[i] !== this.props[i]) {
        return false;
      }
      i += 1;
    }
    return true;
  }
  function clone(matr) {
    var i;
    for (i = 0; i < 16; i += 1) {
      matr.props[i] = this.props[i];
    }
    return matr;
  }
  function cloneFromProps(props) {
    var i;
    for (i = 0; i < 16; i += 1) {
      this.props[i] = props[i];
    }
  }
  function applyToPoint(x, y, z) {
    return {
      x: x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12],
      y: x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13],
      z: x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14]
    };
  }
  function applyToX(x, y, z) {
    return x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12];
  }
  function applyToY(x, y, z) {
    return x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13];
  }
  function applyToZ(x, y, z) {
    return x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14];
  }
  function getInverseMatrix() {
    var determinant = this.props[0] * this.props[5] - this.props[1] * this.props[4];
    var a = this.props[5] / determinant;
    var b = -this.props[1] / determinant;
    var c = -this.props[4] / determinant;
    var d = this.props[0] / determinant;
    var e = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / determinant;
    var f = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / determinant;
    var inverseMatrix = new Matrix();
    inverseMatrix.props[0] = a;
    inverseMatrix.props[1] = b;
    inverseMatrix.props[4] = c;
    inverseMatrix.props[5] = d;
    inverseMatrix.props[12] = e;
    inverseMatrix.props[13] = f;
    return inverseMatrix;
  }
  function inversePoint(pt) {
    var inverseMatrix = this.getInverseMatrix();
    return inverseMatrix.applyToPointArray(pt[0], pt[1], pt[2] || 0);
  }
  function inversePoints(pts) {
    var i;
    var len = pts.length;
    var retPts = [];
    for (i = 0; i < len; i += 1) {
      retPts[i] = inversePoint(pts[i]);
    }
    return retPts;
  }
  function applyToTriplePoints(pt1, pt2, pt3) {
    var arr = createTypedArray("float32", 6);
    if (this.isIdentity()) {
      arr[0] = pt1[0];
      arr[1] = pt1[1];
      arr[2] = pt2[0];
      arr[3] = pt2[1];
      arr[4] = pt3[0];
      arr[5] = pt3[1];
    } else {
      var p0 = this.props[0];
      var p1 = this.props[1];
      var p4 = this.props[4];
      var p5 = this.props[5];
      var p12 = this.props[12];
      var p13 = this.props[13];
      arr[0] = pt1[0] * p0 + pt1[1] * p4 + p12;
      arr[1] = pt1[0] * p1 + pt1[1] * p5 + p13;
      arr[2] = pt2[0] * p0 + pt2[1] * p4 + p12;
      arr[3] = pt2[0] * p1 + pt2[1] * p5 + p13;
      arr[4] = pt3[0] * p0 + pt3[1] * p4 + p12;
      arr[5] = pt3[0] * p1 + pt3[1] * p5 + p13;
    }
    return arr;
  }
  function applyToPointArray(x, y, z) {
    var arr;
    if (this.isIdentity()) {
      arr = [x, y, z];
    } else {
      arr = [
        x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12],
        x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13],
        x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14]
      ];
    }
    return arr;
  }
  function applyToPointStringified(x, y) {
    if (this.isIdentity()) {
      return x + "," + y;
    }
    var _p = this.props;
    return Math.round((x * _p[0] + y * _p[4] + _p[12]) * 100) / 100 + "," + Math.round((x * _p[1] + y * _p[5] + _p[13]) * 100) / 100;
  }
  function toCSS() {
    var i = 0;
    var props = this.props;
    var cssValue = "matrix3d(";
    var v = 1e4;
    while (i < 16) {
      cssValue += _rnd(props[i] * v) / v;
      cssValue += i === 15 ? ")" : ",";
      i += 1;
    }
    return cssValue;
  }
  function roundMatrixProperty(val) {
    var v = 1e4;
    if (val < 1e-6 && val > 0 || val > -1e-6 && val < 0) {
      return _rnd(val * v) / v;
    }
    return val;
  }
  function to2dCSS() {
    var props = this.props;
    var _a = roundMatrixProperty(props[0]);
    var _b = roundMatrixProperty(props[1]);
    var _c = roundMatrixProperty(props[4]);
    var _d = roundMatrixProperty(props[5]);
    var _e = roundMatrixProperty(props[12]);
    var _f = roundMatrixProperty(props[13]);
    return "matrix(" + _a + "," + _b + "," + _c + "," + _d + "," + _e + "," + _f + ")";
  }
  return function() {
    this.reset = reset;
    this.rotate = rotate;
    this.rotateX = rotateX;
    this.rotateY = rotateY;
    this.rotateZ = rotateZ;
    this.skew = skew;
    this.skewFromAxis = skewFromAxis;
    this.shear = shear;
    this.scale = scale;
    this.setTransform = setTransform;
    this.translate = translate;
    this.transform = transform;
    this.multiply = multiply;
    this.applyToPoint = applyToPoint;
    this.applyToX = applyToX;
    this.applyToY = applyToY;
    this.applyToZ = applyToZ;
    this.applyToPointArray = applyToPointArray;
    this.applyToTriplePoints = applyToTriplePoints;
    this.applyToPointStringified = applyToPointStringified;
    this.toCSS = toCSS;
    this.to2dCSS = to2dCSS;
    this.clone = clone;
    this.cloneFromProps = cloneFromProps;
    this.equals = equals;
    this.inversePoints = inversePoints;
    this.inversePoint = inversePoint;
    this.getInverseMatrix = getInverseMatrix;
    this._t = this.transform;
    this.isIdentity = isIdentity;
    this._identity = true;
    this._identityCalculated = false;
    this.props = createTypedArray("float32", 16);
    this.reset();
  };
}();
var transformation_matrix_default = Matrix;

// src/modules/main.js
var lottie = {};
function setSubframeRendering(flag) {
  setSubframeEnabled(flag);
}
function setPrefix(prefix) {
  setIdPrefix(prefix);
}
function loadAnimation(params) {
  return AnimationManager_default.loadAnimation(params);
}
function setQuality(value) {
  if (typeof value === "string") {
    switch (value) {
      case "high":
        setDefaultCurveSegments(200);
        break;
      default:
      case "medium":
        setDefaultCurveSegments(50);
        break;
      case "low":
        setDefaultCurveSegments(10);
        break;
    }
  } else if (!isNaN(value) && value > 1) {
    setDefaultCurveSegments(value);
  }
  if (getDefaultCurveSegments() >= 50) {
    roundValues(false);
  } else {
    roundValues(true);
  }
}
function installPlugin(type, plugin) {
  if (type === "expressions") {
    setExpressionsPlugin(plugin);
  }
}
function getFactory(name) {
  switch (name) {
    case "propertyFactory":
      return PropertyFactory_default;
    case "shapePropertyFactory":
      return ShapeProperty_default;
    case "matrix":
      return transformation_matrix_default;
    default:
      return null;
  }
}
lottie.play = AnimationManager_default.play;
lottie.pause = AnimationManager_default.pause;
lottie.togglePause = AnimationManager_default.togglePause;
lottie.setSpeed = AnimationManager_default.setSpeed;
lottie.setDirection = AnimationManager_default.setDirection;
lottie.stop = AnimationManager_default.stop;
lottie.loadAnimation = loadAnimation;
lottie.setSubframeRendering = setSubframeRendering;
lottie.resize = AnimationManager_default.resize;
lottie.goToAndStop = AnimationManager_default.goToAndStop;
lottie.destroy = AnimationManager_default.destroy;
lottie.setQuality = setQuality;
lottie.installPlugin = installPlugin;
lottie.freeze = AnimationManager_default.freeze;
lottie.unfreeze = AnimationManager_default.unfreeze;
lottie.getRegisteredAnimations = AnimationManager_default.getRegisteredAnimations;
lottie.setIDPrefix = setPrefix;
lottie.__getFactory = getFactory;
var main_default = lottie;

// src/utils/shapes/ShapeModifiers.js
var ShapeModifiers = function() {
  var ob = {};
  var modifiers = {};
  ob.registerModifier = registerModifier;
  ob.getModifier = getModifier;
  function registerModifier(nm, factory) {
    if (!modifiers[nm]) {
      modifiers[nm] = factory;
    }
  }
  function getModifier(nm, elem, data) {
    return new modifiers[nm](elem, data);
  }
  return ob;
}();
function ShapeModifier() {
}
ShapeModifier.prototype.initModifierProperties = function() {
};
ShapeModifier.prototype.addShapeToModifier = function() {
};
ShapeModifier.prototype.addShape = function(data) {
  if (!this.closed) {
    data.sh.container.addDynamicProperty(data.sh);
    var shapeData = { shape: data.sh, data, localShapeCollection: shapeCollection_pool_default.newShapeCollection() };
    this.shapes.push(shapeData);
    this.addShapeToModifier(shapeData);
    if (this._isAnimated) {
      data.setAsAnimated();
    }
  }
};
ShapeModifier.prototype.init = function(elem, data) {
  this.shapes = [];
  this.elem = elem;
  this.initDynamicPropertyContainer(elem);
  this.initModifierProperties(elem, data);
  this.frameId = initialDefaultFrame;
  this.closed = false;
  this.k = false;
  if (this.dynamicProperties.length) {
    this.k = true;
  } else {
    this.getValue(true);
  }
};
ShapeModifier.prototype.processKeys = function() {
  if (this.elem.globalData.frameId === this.frameId) {
    return;
  }
  this.frameId = this.elem.globalData.frameId;
  this.iterateDynamicProperties();
};
extendPrototype([dynamicProperties_default], ShapeModifier);

// src/utils/shapes/TrimModifier.js
function TrimModifier() {
}
extendPrototype([ShapeModifier], TrimModifier);
TrimModifier.prototype.initModifierProperties = function(elem, data) {
  this.s = PropertyFactory_default.getProp(elem, data.s, 0, 0.01, this);
  this.e = PropertyFactory_default.getProp(elem, data.e, 0, 0.01, this);
  this.o = PropertyFactory_default.getProp(elem, data.o, 0, 0, this);
  this.sValue = 0;
  this.eValue = 0;
  this.getValue = this.processKeys;
  this.m = data.m;
  this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length;
};
TrimModifier.prototype.addShapeToModifier = function(shapeData) {
  shapeData.pathsData = [];
};
TrimModifier.prototype.calculateShapeEdges = function(s, e, shapeLength, addedLength, totalModifierLength) {
  var segments = [];
  if (e <= 1) {
    segments.push({
      s,
      e
    });
  } else if (s >= 1) {
    segments.push({
      s: s - 1,
      e: e - 1
    });
  } else {
    segments.push({
      s,
      e: 1
    });
    segments.push({
      s: 0,
      e: e - 1
    });
  }
  var shapeSegments = [];
  var i;
  var len = segments.length;
  var segmentOb;
  for (i = 0; i < len; i += 1) {
    segmentOb = segments[i];
    if (!(segmentOb.e * totalModifierLength < addedLength || segmentOb.s * totalModifierLength > addedLength + shapeLength)) {
      var shapeS;
      var shapeE;
      if (segmentOb.s * totalModifierLength <= addedLength) {
        shapeS = 0;
      } else {
        shapeS = (segmentOb.s * totalModifierLength - addedLength) / shapeLength;
      }
      if (segmentOb.e * totalModifierLength >= addedLength + shapeLength) {
        shapeE = 1;
      } else {
        shapeE = (segmentOb.e * totalModifierLength - addedLength) / shapeLength;
      }
      shapeSegments.push([shapeS, shapeE]);
    }
  }
  if (!shapeSegments.length) {
    shapeSegments.push([0, 0]);
  }
  return shapeSegments;
};
TrimModifier.prototype.releasePathsData = function(pathsData) {
  var i;
  var len = pathsData.length;
  for (i = 0; i < len; i += 1) {
    segments_length_pool_default.release(pathsData[i]);
  }
  pathsData.length = 0;
  return pathsData;
};
TrimModifier.prototype.processShapes = function(_isFirstFrame) {
  var s;
  var e;
  if (this._mdf || _isFirstFrame) {
    var o = this.o.v % 360 / 360;
    if (o < 0) {
      o += 1;
    }
    if (this.s.v > 1) {
      s = 1 + o;
    } else if (this.s.v < 0) {
      s = 0 + o;
    } else {
      s = this.s.v + o;
    }
    if (this.e.v > 1) {
      e = 1 + o;
    } else if (this.e.v < 0) {
      e = 0 + o;
    } else {
      e = this.e.v + o;
    }
    if (s > e) {
      var _s = s;
      s = e;
      e = _s;
    }
    s = Math.round(s * 1e4) * 1e-4;
    e = Math.round(e * 1e4) * 1e-4;
    this.sValue = s;
    this.eValue = e;
  } else {
    s = this.sValue;
    e = this.eValue;
  }
  var shapePaths;
  var i;
  var len = this.shapes.length;
  var j;
  var jLen;
  var pathsData;
  var pathData;
  var totalShapeLength;
  var totalModifierLength = 0;
  if (e === s) {
    for (i = 0; i < len; i += 1) {
      this.shapes[i].localShapeCollection.releaseShapes();
      this.shapes[i].shape._mdf = true;
      this.shapes[i].shape.paths = this.shapes[i].localShapeCollection;
      if (this._mdf) {
        this.shapes[i].pathsData.length = 0;
      }
    }
  } else if (!(e === 1 && s === 0 || e === 0 && s === 1)) {
    var segments = [];
    var shapeData;
    var localShapeCollection;
    for (i = 0; i < len; i += 1) {
      shapeData = this.shapes[i];
      if (!shapeData.shape._mdf && !this._mdf && !_isFirstFrame && this.m !== 2) {
        shapeData.shape.paths = shapeData.localShapeCollection;
      } else {
        shapePaths = shapeData.shape.paths;
        jLen = shapePaths._length;
        totalShapeLength = 0;
        if (!shapeData.shape._mdf && shapeData.pathsData.length) {
          totalShapeLength = shapeData.totalShapeLength;
        } else {
          pathsData = this.releasePathsData(shapeData.pathsData);
          for (j = 0; j < jLen; j += 1) {
            pathData = bez_default.getSegmentsLength(shapePaths.shapes[j]);
            pathsData.push(pathData);
            totalShapeLength += pathData.totalLength;
          }
          shapeData.totalShapeLength = totalShapeLength;
          shapeData.pathsData = pathsData;
        }
        totalModifierLength += totalShapeLength;
        shapeData.shape._mdf = true;
      }
    }
    var shapeS = s;
    var shapeE = e;
    var addedLength = 0;
    var edges;
    for (i = len - 1; i >= 0; i -= 1) {
      shapeData = this.shapes[i];
      if (shapeData.shape._mdf) {
        localShapeCollection = shapeData.localShapeCollection;
        localShapeCollection.releaseShapes();
        if (this.m === 2 && len > 1) {
          edges = this.calculateShapeEdges(s, e, shapeData.totalShapeLength, addedLength, totalModifierLength);
          addedLength += shapeData.totalShapeLength;
        } else {
          edges = [[shapeS, shapeE]];
        }
        jLen = edges.length;
        for (j = 0; j < jLen; j += 1) {
          shapeS = edges[j][0];
          shapeE = edges[j][1];
          segments.length = 0;
          if (shapeE <= 1) {
            segments.push({
              s: shapeData.totalShapeLength * shapeS,
              e: shapeData.totalShapeLength * shapeE
            });
          } else if (shapeS >= 1) {
            segments.push({
              s: shapeData.totalShapeLength * (shapeS - 1),
              e: shapeData.totalShapeLength * (shapeE - 1)
            });
          } else {
            segments.push({
              s: shapeData.totalShapeLength * shapeS,
              e: shapeData.totalShapeLength
            });
            segments.push({
              s: 0,
              e: shapeData.totalShapeLength * (shapeE - 1)
            });
          }
          var newShapesData = this.addShapes(shapeData, segments[0]);
          if (segments[0].s !== segments[0].e) {
            if (segments.length > 1) {
              var lastShapeInCollection = shapeData.shape.paths.shapes[shapeData.shape.paths._length - 1];
              if (lastShapeInCollection.c) {
                var lastShape = newShapesData.pop();
                this.addPaths(newShapesData, localShapeCollection);
                newShapesData = this.addShapes(shapeData, segments[1], lastShape);
              } else {
                this.addPaths(newShapesData, localShapeCollection);
                newShapesData = this.addShapes(shapeData, segments[1]);
              }
            }
            this.addPaths(newShapesData, localShapeCollection);
          }
        }
        shapeData.shape.paths = localShapeCollection;
      }
    }
  } else if (this._mdf) {
    for (i = 0; i < len; i += 1) {
      this.shapes[i].pathsData.length = 0;
      this.shapes[i].shape._mdf = true;
    }
  }
};
TrimModifier.prototype.addPaths = function(newPaths, localShapeCollection) {
  var i;
  var len = newPaths.length;
  for (i = 0; i < len; i += 1) {
    localShapeCollection.addShape(newPaths[i]);
  }
};
TrimModifier.prototype.addSegment = function(pt1, pt2, pt3, pt4, shapePath, pos, newShape) {
  shapePath.setXYAt(pt2[0], pt2[1], "o", pos);
  shapePath.setXYAt(pt3[0], pt3[1], "i", pos + 1);
  if (newShape) {
    shapePath.setXYAt(pt1[0], pt1[1], "v", pos);
  }
  shapePath.setXYAt(pt4[0], pt4[1], "v", pos + 1);
};
TrimModifier.prototype.addSegmentFromArray = function(points, shapePath, pos, newShape) {
  shapePath.setXYAt(points[1], points[5], "o", pos);
  shapePath.setXYAt(points[2], points[6], "i", pos + 1);
  if (newShape) {
    shapePath.setXYAt(points[0], points[4], "v", pos);
  }
  shapePath.setXYAt(points[3], points[7], "v", pos + 1);
};
TrimModifier.prototype.addShapes = function(shapeData, shapeSegment, shapePath) {
  var pathsData = shapeData.pathsData;
  var shapePaths = shapeData.shape.paths.shapes;
  var i;
  var len = shapeData.shape.paths._length;
  var j;
  var jLen;
  var addedLength = 0;
  var currentLengthData;
  var segmentCount;
  var lengths;
  var segment;
  var shapes = [];
  var initPos;
  var newShape = true;
  if (!shapePath) {
    shapePath = shape_pool_default.newElement();
    segmentCount = 0;
    initPos = 0;
  } else {
    segmentCount = shapePath._length;
    initPos = shapePath._length;
  }
  shapes.push(shapePath);
  for (i = 0; i < len; i += 1) {
    lengths = pathsData[i].lengths;
    shapePath.c = shapePaths[i].c;
    jLen = shapePaths[i].c ? lengths.length : lengths.length + 1;
    for (j = 1; j < jLen; j += 1) {
      currentLengthData = lengths[j - 1];
      if (addedLength + currentLengthData.addedLength < shapeSegment.s) {
        addedLength += currentLengthData.addedLength;
        shapePath.c = false;
      } else if (addedLength > shapeSegment.e) {
        shapePath.c = false;
        break;
      } else {
        if (shapeSegment.s <= addedLength && shapeSegment.e >= addedLength + currentLengthData.addedLength) {
          this.addSegment(shapePaths[i].v[j - 1], shapePaths[i].o[j - 1], shapePaths[i].i[j], shapePaths[i].v[j], shapePath, segmentCount, newShape);
          newShape = false;
        } else {
          segment = bez_default.getNewSegment(shapePaths[i].v[j - 1], shapePaths[i].v[j], shapePaths[i].o[j - 1], shapePaths[i].i[j], (shapeSegment.s - addedLength) / currentLengthData.addedLength, (shapeSegment.e - addedLength) / currentLengthData.addedLength, lengths[j - 1]);
          this.addSegmentFromArray(segment, shapePath, segmentCount, newShape);
          newShape = false;
          shapePath.c = false;
        }
        addedLength += currentLengthData.addedLength;
        segmentCount += 1;
      }
    }
    if (shapePaths[i].c && lengths.length) {
      currentLengthData = lengths[j - 1];
      if (addedLength <= shapeSegment.e) {
        var segmentLength = lengths[j - 1].addedLength;
        if (shapeSegment.s <= addedLength && shapeSegment.e >= addedLength + segmentLength) {
          this.addSegment(shapePaths[i].v[j - 1], shapePaths[i].o[j - 1], shapePaths[i].i[0], shapePaths[i].v[0], shapePath, segmentCount, newShape);
          newShape = false;
        } else {
          segment = bez_default.getNewSegment(shapePaths[i].v[j - 1], shapePaths[i].v[0], shapePaths[i].o[j - 1], shapePaths[i].i[0], (shapeSegment.s - addedLength) / segmentLength, (shapeSegment.e - addedLength) / segmentLength, lengths[j - 1]);
          this.addSegmentFromArray(segment, shapePath, segmentCount, newShape);
          newShape = false;
          shapePath.c = false;
        }
      } else {
        shapePath.c = false;
      }
      addedLength += currentLengthData.addedLength;
      segmentCount += 1;
    }
    if (shapePath._length) {
      shapePath.setXYAt(shapePath.v[initPos][0], shapePath.v[initPos][1], "i", initPos);
      shapePath.setXYAt(shapePath.v[shapePath._length - 1][0], shapePath.v[shapePath._length - 1][1], "o", shapePath._length - 1);
    }
    if (addedLength > shapeSegment.e) {
      break;
    }
    if (i < len - 1) {
      shapePath = shape_pool_default.newElement();
      newShape = true;
      shapes.push(shapePath);
      segmentCount = 0;
    }
  }
  return shapes;
};
var TrimModifier_default = TrimModifier;

// src/utils/helpers/svg_elements.js
function createNS(type) {
  return document.createElementNS(svgNS, type);
}
var svg_elements_default = createNS;

// src/utils/SlotManager.js
function SlotManager(animationData) {
  this.animationData = animationData;
}
SlotManager.prototype.getProp = function(data) {
  if (this.animationData.slots && this.animationData.slots[data.sid]) {
    return Object.assign(data, this.animationData.slots[data.sid].p);
  }
  return data;
};
function slotFactory(animationData) {
  return new SlotManager(animationData);
}
var SlotManager_default = slotFactory;

// src/renderers/BaseRenderer.js
function BaseRenderer() {
}
BaseRenderer.prototype.checkLayers = function(num) {
  var i;
  var len = this.layers.length;
  var data;
  this.completeLayers = true;
  for (i = len - 1; i >= 0; i -= 1) {
    if (!this.elements[i]) {
      data = this.layers[i];
      if (data.ip - data.st <= num - this.layers[i].st && data.op - data.st > num - this.layers[i].st) {
        this.buildItem(i);
      }
    }
    this.completeLayers = this.elements[i] ? this.completeLayers : false;
  }
  this.checkPendingElements();
};
BaseRenderer.prototype.createItem = function(layer) {
  switch (layer.ty) {
    case 2:
      return this.createImage(layer);
    case 0:
      return this.createComp(layer);
    case 1:
      return this.createSolid(layer);
    case 3:
      return this.createNull(layer);
    case 4:
      return this.createShape(layer);
    default:
      return this.createNull(layer);
  }
};
BaseRenderer.prototype.buildAllItems = function() {
  var i;
  var len = this.layers.length;
  for (i = 0; i < len; i += 1) {
    this.buildItem(i);
  }
  this.checkPendingElements();
};
BaseRenderer.prototype.includeLayers = function(newLayers) {
  this.completeLayers = false;
  var i;
  var len = newLayers.length;
  var j;
  var jLen = this.layers.length;
  for (i = 0; i < len; i += 1) {
    j = 0;
    while (j < jLen) {
      if (this.layers[j].id === newLayers[i].id) {
        this.layers[j] = newLayers[i];
        break;
      }
      j += 1;
    }
  }
};
BaseRenderer.prototype.setProjectInterface = function(pInterface) {
  this.globalData.projectInterface = pInterface;
};
BaseRenderer.prototype.initItems = function() {
  if (!this.globalData.progressiveLoad) {
    this.buildAllItems();
  }
};
BaseRenderer.prototype.buildElementParenting = function(element, parentName, hierarchy) {
  var elements = this.elements;
  var layers = this.layers;
  var i = 0;
  var len = layers.length;
  while (i < len) {
    if (layers[i].ind == parentName) {
      if (!elements[i] || elements[i] === true) {
        this.buildItem(i);
        this.addPendingElement(element);
      } else {
        hierarchy.push(elements[i]);
        elements[i].setAsParent();
        if (layers[i].parent !== void 0) {
          this.buildElementParenting(element, layers[i].parent, hierarchy);
        } else {
          element.setHierarchy(hierarchy);
        }
      }
    }
    i += 1;
  }
};
BaseRenderer.prototype.addPendingElement = function(element) {
  this.pendingElements.push(element);
};
BaseRenderer.prototype.searchExtraCompositions = function(assets) {
  var i;
  var len = assets.length;
  for (i = 0; i < len; i += 1) {
    if (assets[i].xt) {
      var comp = this.createComp(assets[i]);
      comp.initExpressions();
      this.globalData.projectInterface.registerComposition(comp);
    }
  }
};
BaseRenderer.prototype.getElementById = function(ind) {
  var i;
  var len = this.elements.length;
  for (i = 0; i < len; i += 1) {
    if (this.elements[i].data.ind === ind) {
      return this.elements[i];
    }
  }
  return null;
};
BaseRenderer.prototype.getElementByPath = function(path) {
  var pathValue = path.shift();
  var element;
  if (typeof pathValue === "number") {
    element = this.elements[pathValue];
  } else {
    var i;
    var len = this.elements.length;
    for (i = 0; i < len; i += 1) {
      if (this.elements[i].data.nm === pathValue) {
        element = this.elements[i];
        break;
      }
    }
  }
  if (path.length === 0) {
    return element;
  }
  return element.getElementByPath(path);
};
BaseRenderer.prototype.setupGlobalData = function(animData, fontsContainer) {
  this.globalData.slotManager = SlotManager_default(animData);
  this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem);
  this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem);
  this.globalData.imageLoader = this.animationItem.imagePreloader;
  this.globalData.frameId = 0;
  this.globalData.frameRate = animData.fr;
  this.globalData.nm = animData.nm;
  this.globalData.compSize = {
    w: animData.w,
    h: animData.h
  };
};
var BaseRenderer_default = BaseRenderer;

// src/utils/helpers/blendModes.js
var getBlendMode = /* @__PURE__ */ function() {
  var blendModeEnums = {
    0: "source-over",
    1: "multiply",
    2: "screen",
    3: "overlay",
    4: "darken",
    5: "lighten",
    6: "color-dodge",
    7: "color-burn",
    8: "hard-light",
    9: "soft-light",
    10: "difference",
    11: "exclusion",
    12: "hue",
    13: "saturation",
    14: "color",
    15: "luminosity"
  };
  return function(mode) {
    return blendModeEnums[mode] || "";
  };
}();
var blendModes_default = getBlendMode;

// src/effects/SliderEffect.js
function SliderEffect(data, elem, container) {
  this.p = PropertyFactory_default.getProp(elem, data.v, 0, 0, container);
}
function AngleEffect(data, elem, container) {
  this.p = PropertyFactory_default.getProp(elem, data.v, 0, 0, container);
}
function ColorEffect(data, elem, container) {
  this.p = PropertyFactory_default.getProp(elem, data.v, 1, 0, container);
}
function PointEffect(data, elem, container) {
  this.p = PropertyFactory_default.getProp(elem, data.v, 1, 0, container);
}
function LayerIndexEffect(data, elem, container) {
  this.p = PropertyFactory_default.getProp(elem, data.v, 0, 0, container);
}
function MaskIndexEffect(data, elem, container) {
  this.p = PropertyFactory_default.getProp(elem, data.v, 0, 0, container);
}
function CheckboxEffect(data, elem, container) {
  this.p = PropertyFactory_default.getProp(elem, data.v, 0, 0, container);
}
function NoValueEffect() {
  this.p = {};
}

// src/EffectsManager.js
function EffectsManager(data, element) {
  var effects = data.ef || [];
  this.effectElements = [];
  var i;
  var len = effects.length;
  var effectItem;
  for (i = 0; i < len; i += 1) {
    effectItem = new GroupEffect(effects[i], element);
    this.effectElements.push(effectItem);
  }
}
function GroupEffect(data, element) {
  this.init(data, element);
}
extendPrototype([dynamicProperties_default], GroupEffect);
GroupEffect.prototype.getValue = GroupEffect.prototype.iterateDynamicProperties;
GroupEffect.prototype.init = function(data, element) {
  this.data = data;
  this.effectElements = [];
  this.initDynamicPropertyContainer(element);
  var i;
  var len = this.data.ef.length;
  var eff;
  var effects = this.data.ef;
  for (i = 0; i < len; i += 1) {
    eff = null;
    switch (effects[i].ty) {
      case 0:
        eff = new SliderEffect(effects[i], element, this);
        break;
      case 1:
        eff = new AngleEffect(effects[i], element, this);
        break;
      case 2:
        eff = new ColorEffect(effects[i], element, this);
        break;
      case 3:
        eff = new PointEffect(effects[i], element, this);
        break;
      case 4:
      case 7:
        eff = new CheckboxEffect(effects[i], element, this);
        break;
      case 10:
        eff = new LayerIndexEffect(effects[i], element, this);
        break;
      case 11:
        eff = new MaskIndexEffect(effects[i], element, this);
        break;
      case 5:
        eff = new EffectsManager(effects[i], element, this);
        break;
      // case 6:
      default:
        eff = new NoValueEffect(effects[i], element, this);
        break;
    }
    if (eff) {
      this.effectElements.push(eff);
    }
  }
};
var EffectsManager_default = EffectsManager;

// src/elements/BaseElement.js
function BaseElement() {
}
BaseElement.prototype = {
  checkMasks: function() {
    if (!this.data.hasMask) {
      return false;
    }
    var i = 0;
    var len = this.data.masksProperties.length;
    while (i < len) {
      if (this.data.masksProperties[i].mode !== "n" && this.data.masksProperties[i].cl !== false) {
        return true;
      }
      i += 1;
    }
    return false;
  },
  initExpressions: function() {
    const expressionsInterfaces2 = getExpressionInterfaces();
    if (!expressionsInterfaces2) {
      return;
    }
    const LayerExpressionInterface = expressionsInterfaces2("layer");
    const EffectsExpressionInterface = expressionsInterfaces2("effects");
    const ShapeExpressionInterface = expressionsInterfaces2("shape");
    const TextExpressionInterface = expressionsInterfaces2("text");
    const CompExpressionInterface = expressionsInterfaces2("comp");
    this.layerInterface = LayerExpressionInterface(this);
    if (this.data.hasMask && this.maskManager) {
      this.layerInterface.registerMaskInterface(this.maskManager);
    }
    var effectsInterface = EffectsExpressionInterface.createEffectsInterface(this, this.layerInterface);
    this.layerInterface.registerEffectsInterface(effectsInterface);
    if (this.data.ty === 0 || this.data.xt) {
      this.compInterface = CompExpressionInterface(this);
    } else if (this.data.ty === 4) {
      this.layerInterface.shapeInterface = ShapeExpressionInterface(this.shapesData, this.itemsData, this.layerInterface);
      this.layerInterface.content = this.layerInterface.shapeInterface;
    } else if (this.data.ty === 5) {
      this.layerInterface.textInterface = TextExpressionInterface(this);
      this.layerInterface.text = this.layerInterface.textInterface;
    }
  },
  setBlendMode: function() {
    var blendModeValue = blendModes_default(this.data.bm);
    var elem = this.baseElement || this.layerElement;
    elem.style["mix-blend-mode"] = blendModeValue;
  },
  initBaseData: function(data, globalData, comp) {
    this.globalData = globalData;
    this.comp = comp;
    this.data = data;
    this.layerId = createElementID();
    if (!this.data.sr) {
      this.data.sr = 1;
    }
    this.effectsManager = new EffectsManager_default(this.data, this, this.dynamicProperties);
  },
  getType: function() {
    return this.type;
  },
  sourceRectAtTime: function() {
  }
};
var BaseElement_default = BaseElement;

// src/utils/TransformProperty.js
var TransformPropertyFactory = function() {
  var defaultVector = [0, 0];
  function applyToMatrix(mat) {
    var _mdf = this._mdf;
    this.iterateDynamicProperties();
    this._mdf = this._mdf || _mdf;
    if (this.a) {
      mat.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
    }
    if (this.s) {
      mat.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
    }
    if (this.sk) {
      mat.skewFromAxis(-this.sk.v, this.sa.v);
    }
    if (this.r) {
      mat.rotate(-this.r.v);
    } else {
      mat.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
    }
    if (this.data.p.s) {
      if (this.data.p.z) {
        mat.translate(this.px.v, this.py.v, -this.pz.v);
      } else {
        mat.translate(this.px.v, this.py.v, 0);
      }
    } else {
      mat.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
    }
  }
  function processKeys(forceRender) {
    if (this.elem.globalData.frameId === this.frameId) {
      return;
    }
    if (this._isDirty) {
      this.precalculateMatrix();
      this._isDirty = false;
    }
    this.iterateDynamicProperties();
    if (this._mdf || forceRender) {
      var frameRate;
      this.v.cloneFromProps(this.pre.props);
      if (this.appliedTransformations < 1) {
        this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
      }
      if (this.appliedTransformations < 2) {
        this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
      }
      if (this.sk && this.appliedTransformations < 3) {
        this.v.skewFromAxis(-this.sk.v, this.sa.v);
      }
      if (this.r && this.appliedTransformations < 4) {
        this.v.rotate(-this.r.v);
      } else if (!this.r && this.appliedTransformations < 4) {
        this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
      }
      if (this.autoOriented) {
        var v1;
        var v2;
        frameRate = this.elem.globalData.frameRate;
        if (this.p && this.p.keyframes && this.p.getValueAtTime) {
          if (this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t) {
            v1 = this.p.getValueAtTime((this.p.keyframes[0].t + 0.01) / frameRate, 0);
            v2 = this.p.getValueAtTime(this.p.keyframes[0].t / frameRate, 0);
          } else if (this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t) {
            v1 = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / frameRate, 0);
            v2 = this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - 0.05) / frameRate, 0);
          } else {
            v1 = this.p.pv;
            v2 = this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - 0.01) / frameRate, this.p.offsetTime);
          }
        } else if (this.px && this.px.keyframes && this.py.keyframes && this.px.getValueAtTime && this.py.getValueAtTime) {
          v1 = [];
          v2 = [];
          var px = this.px;
          var py = this.py;
          if (px._caching.lastFrame + px.offsetTime <= px.keyframes[0].t) {
            v1[0] = px.getValueAtTime((px.keyframes[0].t + 0.01) / frameRate, 0);
            v1[1] = py.getValueAtTime((py.keyframes[0].t + 0.01) / frameRate, 0);
            v2[0] = px.getValueAtTime(px.keyframes[0].t / frameRate, 0);
            v2[1] = py.getValueAtTime(py.keyframes[0].t / frameRate, 0);
          } else if (px._caching.lastFrame + px.offsetTime >= px.keyframes[px.keyframes.length - 1].t) {
            v1[0] = px.getValueAtTime(px.keyframes[px.keyframes.length - 1].t / frameRate, 0);
            v1[1] = py.getValueAtTime(py.keyframes[py.keyframes.length - 1].t / frameRate, 0);
            v2[0] = px.getValueAtTime((px.keyframes[px.keyframes.length - 1].t - 0.01) / frameRate, 0);
            v2[1] = py.getValueAtTime((py.keyframes[py.keyframes.length - 1].t - 0.01) / frameRate, 0);
          } else {
            v1 = [px.pv, py.pv];
            v2[0] = px.getValueAtTime((px._caching.lastFrame + px.offsetTime - 0.01) / frameRate, px.offsetTime);
            v2[1] = py.getValueAtTime((py._caching.lastFrame + py.offsetTime - 0.01) / frameRate, py.offsetTime);
          }
        } else {
          v2 = defaultVector;
          v1 = v2;
        }
        this.v.rotate(-Math.atan2(v1[1] - v2[1], v1[0] - v2[0]));
      }
      if (this.data.p && this.data.p.s) {
        if (this.data.p.z) {
          this.v.translate(this.px.v, this.py.v, -this.pz.v);
        } else {
          this.v.translate(this.px.v, this.py.v, 0);
        }
      } else {
        this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
      }
    }
    this.frameId = this.elem.globalData.frameId;
  }
  function precalculateMatrix() {
    this.appliedTransformations = 0;
    this.pre.reset();
    if (!this.a.effectsSequence.length) {
      this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
      this.appliedTransformations = 1;
    } else {
      return;
    }
    if (!this.s.effectsSequence.length) {
      this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
      this.appliedTransformations = 2;
    } else {
      return;
    }
    if (this.sk) {
      if (!this.sk.effectsSequence.length && !this.sa.effectsSequence.length) {
        this.pre.skewFromAxis(-this.sk.v, this.sa.v);
        this.appliedTransformations = 3;
      } else {
        return;
      }
    }
    if (this.r) {
      if (!this.r.effectsSequence.length) {
        this.pre.rotate(-this.r.v);
        this.appliedTransformations = 4;
      }
    } else if (!this.rz.effectsSequence.length && !this.ry.effectsSequence.length && !this.rx.effectsSequence.length && !this.or.effectsSequence.length) {
      this.pre.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
      this.appliedTransformations = 4;
    }
  }
  function autoOrient() {
  }
  function addDynamicProperty(prop) {
    this._addDynamicProperty(prop);
    this.elem.addDynamicProperty(prop);
    this._isDirty = true;
  }
  function TransformProperty(elem, data, container) {
    this.elem = elem;
    this.frameId = -1;
    this.propType = "transform";
    this.data = data;
    this.v = new transformation_matrix_default();
    this.pre = new transformation_matrix_default();
    this.appliedTransformations = 0;
    this.initDynamicPropertyContainer(container || elem);
    if (data.p && data.p.s) {
      this.px = PropertyFactory_default.getProp(elem, data.p.x, 0, 0, this);
      this.py = PropertyFactory_default.getProp(elem, data.p.y, 0, 0, this);
      if (data.p.z) {
        this.pz = PropertyFactory_default.getProp(elem, data.p.z, 0, 0, this);
      }
    } else {
      this.p = PropertyFactory_default.getProp(elem, data.p || { k: [0, 0, 0] }, 1, 0, this);
    }
    if (data.rx) {
      this.rx = PropertyFactory_default.getProp(elem, data.rx, 0, degToRads, this);
      this.ry = PropertyFactory_default.getProp(elem, data.ry, 0, degToRads, this);
      this.rz = PropertyFactory_default.getProp(elem, data.rz, 0, degToRads, this);
      if (data.or.k[0].ti) {
        var i;
        var len = data.or.k.length;
        for (i = 0; i < len; i += 1) {
          data.or.k[i].to = null;
          data.or.k[i].ti = null;
        }
      }
      this.or = PropertyFactory_default.getProp(elem, data.or, 1, degToRads, this);
      this.or.sh = true;
    } else {
      this.r = PropertyFactory_default.getProp(elem, data.r || { k: 0 }, 0, degToRads, this);
    }
    if (data.sk) {
      this.sk = PropertyFactory_default.getProp(elem, data.sk, 0, degToRads, this);
      this.sa = PropertyFactory_default.getProp(elem, data.sa, 0, degToRads, this);
    }
    this.a = PropertyFactory_default.getProp(elem, data.a || { k: [0, 0, 0] }, 1, 0, this);
    this.s = PropertyFactory_default.getProp(elem, data.s || { k: [100, 100, 100] }, 1, 0.01, this);
    if (data.o) {
      this.o = PropertyFactory_default.getProp(elem, data.o, 0, 0.01, elem);
    } else {
      this.o = { _mdf: false, v: 1 };
    }
    this._isDirty = true;
    if (!this.dynamicProperties.length) {
      this.getValue(true);
    }
  }
  TransformProperty.prototype = {
    applyToMatrix,
    getValue: processKeys,
    precalculateMatrix,
    autoOrient
  };
  extendPrototype([dynamicProperties_default], TransformProperty);
  TransformProperty.prototype.addDynamicProperty = addDynamicProperty;
  TransformProperty.prototype._addDynamicProperty = dynamicProperties_default.prototype.addDynamicProperty;
  function getTransformProperty(elem, data, container) {
    return new TransformProperty(elem, data, container);
  }
  return {
    getTransformProperty
  };
}();
var TransformProperty_default = TransformPropertyFactory;

// src/utils/helpers/effectTypes.js
var effectTypes_default = {
  TRANSFORM_EFFECT: "transformEFfect"
};

// src/elements/helpers/TransformElement.js
function TransformElement() {
}
TransformElement.prototype = {
  initTransform: function() {
    var mat = new transformation_matrix_default();
    this.finalTransform = {
      mProp: this.data.ks ? TransformProperty_default.getTransformProperty(this, this.data.ks, this) : { o: 0 },
      _matMdf: false,
      _localMatMdf: false,
      _opMdf: false,
      mat,
      localMat: mat,
      localOpacity: 1
    };
    if (this.data.ao) {
      this.finalTransform.mProp.autoOriented = true;
    }
    if (this.data.ty !== 11) {
    }
  },
  renderTransform: function() {
    this.finalTransform._opMdf = this.finalTransform.mProp.o._mdf || this._isFirstFrame;
    this.finalTransform._matMdf = this.finalTransform.mProp._mdf || this._isFirstFrame;
    if (this.hierarchy) {
      var mat;
      var finalMat = this.finalTransform.mat;
      var i = 0;
      var len = this.hierarchy.length;
      if (!this.finalTransform._matMdf) {
        while (i < len) {
          if (this.hierarchy[i].finalTransform.mProp._mdf) {
            this.finalTransform._matMdf = true;
            break;
          }
          i += 1;
        }
      }
      if (this.finalTransform._matMdf) {
        mat = this.finalTransform.mProp.v.props;
        finalMat.cloneFromProps(mat);
        for (i = 0; i < len; i += 1) {
          finalMat.multiply(this.hierarchy[i].finalTransform.mProp.v);
        }
      }
    }
    if (!this.localTransforms || this.finalTransform._matMdf) {
      this.finalTransform._localMatMdf = this.finalTransform._matMdf;
    }
    if (this.finalTransform._opMdf) {
      this.finalTransform.localOpacity = this.finalTransform.mProp.o.v;
    }
  },
  renderLocalTransform: function() {
    if (this.localTransforms) {
      var i = 0;
      var len = this.localTransforms.length;
      this.finalTransform._localMatMdf = this.finalTransform._matMdf;
      if (!this.finalTransform._localMatMdf || !this.finalTransform._opMdf) {
        while (i < len) {
          if (this.localTransforms[i]._mdf) {
            this.finalTransform._localMatMdf = true;
          }
          if (this.localTransforms[i]._opMdf && !this.finalTransform._opMdf) {
            this.finalTransform.localOpacity = this.finalTransform.mProp.o.v;
            this.finalTransform._opMdf = true;
          }
          i += 1;
        }
      }
      if (this.finalTransform._localMatMdf) {
        var localMat = this.finalTransform.localMat;
        this.localTransforms[0].matrix.clone(localMat);
        for (i = 1; i < len; i += 1) {
          var lmat = this.localTransforms[i].matrix;
          localMat.multiply(lmat);
        }
        localMat.multiply(this.finalTransform.mat);
      }
      if (this.finalTransform._opMdf) {
        var localOp = this.finalTransform.localOpacity;
        for (i = 0; i < len; i += 1) {
          localOp *= this.localTransforms[i].opacity * 0.01;
        }
        this.finalTransform.localOpacity = localOp;
      }
    }
  },
  searchEffectTransforms: function() {
    if (this.renderableEffectsManager) {
      var transformEffects = this.renderableEffectsManager.getEffects(effectTypes_default.TRANSFORM_EFFECT);
      if (transformEffects.length) {
        this.localTransforms = [];
        this.finalTransform.localMat = new transformation_matrix_default();
        var i = 0;
        var len = transformEffects.length;
        for (i = 0; i < len; i += 1) {
          this.localTransforms.push(transformEffects[i]);
        }
      }
    }
  },
  globalToLocal: function(pt) {
    var transforms = [];
    transforms.push(this.finalTransform);
    var flag = true;
    var comp = this.comp;
    while (flag) {
      if (comp.finalTransform) {
        if (comp.data.hasMask) {
          transforms.splice(0, 0, comp.finalTransform);
        }
        comp = comp.comp;
      } else {
        flag = false;
      }
    }
    var i;
    var len = transforms.length;
    var ptNew;
    for (i = 0; i < len; i += 1) {
      ptNew = transforms[i].mat.applyToPointArray(0, 0, 0);
      pt = [pt[0] - ptNew[0], pt[1] - ptNew[1], 0];
    }
    return pt;
  },
  mHelper: new transformation_matrix_default()
};
var TransformElement_default = TransformElement;

// src/mask.js
function MaskElement(data, element, globalData) {
  this.data = data;
  this.element = element;
  this.globalData = globalData;
  this.storedData = [];
  this.masksProperties = this.data.masksProperties || [];
  this.maskElement = null;
  var defs = this.globalData.defs;
  var i;
  var len = this.masksProperties ? this.masksProperties.length : 0;
  this.viewData = createSizedArray(len);
  this.solidPath = "";
  var path;
  var properties = this.masksProperties;
  var count = 0;
  var currentMasks = [];
  var j;
  var jLen;
  var layerId = createElementID();
  var rect;
  var expansor;
  var feMorph;
  var x;
  var maskType = "clipPath";
  var maskRef = "clip-path";
  for (i = 0; i < len; i += 1) {
    if (properties[i].mode !== "a" && properties[i].mode !== "n" || properties[i].inv || properties[i].o.k !== 100 || properties[i].o.x) {
      maskType = "mask";
      maskRef = "mask";
    }
    if ((properties[i].mode === "s" || properties[i].mode === "i") && count === 0) {
      rect = svg_elements_default("rect");
      rect.setAttribute("fill", "#ffffff");
      rect.setAttribute("width", this.element.comp.data.w || 0);
      rect.setAttribute("height", this.element.comp.data.h || 0);
      currentMasks.push(rect);
    } else {
      rect = null;
    }
    path = svg_elements_default("path");
    if (properties[i].mode === "n") {
      this.viewData[i] = {
        op: PropertyFactory_default.getProp(this.element, properties[i].o, 0, 0.01, this.element),
        prop: ShapeProperty_default.getShapeProp(this.element, properties[i], 3),
        elem: path,
        lastPath: ""
      };
      defs.appendChild(path);
    } else {
      count += 1;
      path.setAttribute("fill", properties[i].mode === "s" ? "#000000" : "#ffffff");
      path.setAttribute("clip-rule", "nonzero");
      var filterID;
      if (properties[i].x.k !== 0) {
        maskType = "mask";
        maskRef = "mask";
        x = PropertyFactory_default.getProp(this.element, properties[i].x, 0, null, this.element);
        filterID = createElementID();
        expansor = svg_elements_default("filter");
        expansor.setAttribute("id", filterID);
        feMorph = svg_elements_default("feMorphology");
        feMorph.setAttribute("operator", "erode");
        feMorph.setAttribute("in", "SourceGraphic");
        feMorph.setAttribute("radius", "0");
        expansor.appendChild(feMorph);
        defs.appendChild(expansor);
        path.setAttribute("stroke", properties[i].mode === "s" ? "#000000" : "#ffffff");
      } else {
        feMorph = null;
        x = null;
      }
      this.storedData[i] = {
        elem: path,
        x,
        expan: feMorph,
        lastPath: "",
        lastOperator: "",
        filterId: filterID,
        lastRadius: 0
      };
      if (properties[i].mode === "i") {
        jLen = currentMasks.length;
        var g = svg_elements_default("g");
        for (j = 0; j < jLen; j += 1) {
          g.appendChild(currentMasks[j]);
        }
        var mask = svg_elements_default("mask");
        mask.setAttribute("mask-type", "alpha");
        mask.setAttribute("id", layerId + "_" + count);
        mask.appendChild(path);
        defs.appendChild(mask);
        g.setAttribute("mask", "url(" + getLocationHref() + "#" + layerId + "_" + count + ")");
        currentMasks.length = 0;
        currentMasks.push(g);
      } else {
        currentMasks.push(path);
      }
      if (properties[i].inv && !this.solidPath) {
        this.solidPath = this.createLayerSolidPath();
      }
      this.viewData[i] = {
        elem: path,
        lastPath: "",
        op: PropertyFactory_default.getProp(this.element, properties[i].o, 0, 0.01, this.element),
        prop: ShapeProperty_default.getShapeProp(this.element, properties[i], 3),
        invRect: rect
      };
      if (!this.viewData[i].prop.k) {
        this.drawPath(properties[i], this.viewData[i].prop.v, this.viewData[i]);
      }
    }
  }
  this.maskElement = svg_elements_default(maskType);
  len = currentMasks.length;
  for (i = 0; i < len; i += 1) {
    this.maskElement.appendChild(currentMasks[i]);
  }
  if (count > 0) {
    this.maskElement.setAttribute("id", layerId);
    this.element.maskedElement.setAttribute(maskRef, "url(" + getLocationHref() + "#" + layerId + ")");
    defs.appendChild(this.maskElement);
  }
  if (this.viewData.length) {
    this.element.addRenderableComponent(this);
  }
}
MaskElement.prototype.getMaskProperty = function(pos) {
  return this.viewData[pos].prop;
};
MaskElement.prototype.renderFrame = function(isFirstFrame) {
  var finalMat = this.element.finalTransform.mat;
  var i;
  var len = this.masksProperties.length;
  for (i = 0; i < len; i += 1) {
    if (this.viewData[i].prop._mdf || isFirstFrame) {
      this.drawPath(this.masksProperties[i], this.viewData[i].prop.v, this.viewData[i]);
    }
    if (this.viewData[i].op._mdf || isFirstFrame) {
      this.viewData[i].elem.setAttribute("fill-opacity", this.viewData[i].op.v);
    }
    if (this.masksProperties[i].mode !== "n") {
      if (this.viewData[i].invRect && (this.element.finalTransform.mProp._mdf || isFirstFrame)) {
        this.viewData[i].invRect.setAttribute("transform", finalMat.getInverseMatrix().to2dCSS());
      }
      if (this.storedData[i].x && (this.storedData[i].x._mdf || isFirstFrame)) {
        var feMorph = this.storedData[i].expan;
        if (this.storedData[i].x.v < 0) {
          if (this.storedData[i].lastOperator !== "erode") {
            this.storedData[i].lastOperator = "erode";
            this.storedData[i].elem.setAttribute("filter", "url(" + getLocationHref() + "#" + this.storedData[i].filterId + ")");
          }
          feMorph.setAttribute("radius", -this.storedData[i].x.v);
        } else {
          if (this.storedData[i].lastOperator !== "dilate") {
            this.storedData[i].lastOperator = "dilate";
            this.storedData[i].elem.setAttribute("filter", null);
          }
          this.storedData[i].elem.setAttribute("stroke-width", this.storedData[i].x.v * 2);
        }
      }
    }
  }
};
MaskElement.prototype.getMaskelement = function() {
  return this.maskElement;
};
MaskElement.prototype.createLayerSolidPath = function() {
  var path = "M0,0 ";
  path += " h" + this.globalData.compSize.w;
  path += " v" + this.globalData.compSize.h;
  path += " h-" + this.globalData.compSize.w;
  path += " v-" + this.globalData.compSize.h + " ";
  return path;
};
MaskElement.prototype.drawPath = function(pathData, pathNodes, viewData) {
  var pathString = " M" + pathNodes.v[0][0] + "," + pathNodes.v[0][1];
  var i;
  var len;
  len = pathNodes._length;
  for (i = 1; i < len; i += 1) {
    pathString += " C" + pathNodes.o[i - 1][0] + "," + pathNodes.o[i - 1][1] + " " + pathNodes.i[i][0] + "," + pathNodes.i[i][1] + " " + pathNodes.v[i][0] + "," + pathNodes.v[i][1];
  }
  if (pathNodes.c && len > 1) {
    pathString += " C" + pathNodes.o[i - 1][0] + "," + pathNodes.o[i - 1][1] + " " + pathNodes.i[0][0] + "," + pathNodes.i[0][1] + " " + pathNodes.v[0][0] + "," + pathNodes.v[0][1];
  }
  if (viewData.lastPath !== pathString) {
    var pathShapeValue = "";
    if (viewData.elem) {
      if (pathNodes.c) {
        pathShapeValue = pathData.inv ? this.solidPath + pathString : pathString;
      }
      viewData.elem.setAttribute("d", pathShapeValue);
    }
    viewData.lastPath = pathString;
  }
};
MaskElement.prototype.destroy = function() {
  this.element = null;
  this.globalData = null;
  this.maskElement = null;
  this.data = null;
  this.masksProperties = null;
};
var mask_default = MaskElement;

// src/utils/filters.js
var filtersFactory = function() {
  var ob = {};
  ob.createFilter = createFilter;
  ob.createAlphaToLuminanceFilter = createAlphaToLuminanceFilter;
  function createFilter(filId, skipCoordinates) {
    var fil = svg_elements_default("filter");
    fil.setAttribute("id", filId);
    if (skipCoordinates !== true) {
      fil.setAttribute("filterUnits", "objectBoundingBox");
      fil.setAttribute("x", "0%");
      fil.setAttribute("y", "0%");
      fil.setAttribute("width", "100%");
      fil.setAttribute("height", "100%");
    }
    return fil;
  }
  function createAlphaToLuminanceFilter() {
    var feColorMatrix = svg_elements_default("feColorMatrix");
    feColorMatrix.setAttribute("type", "matrix");
    feColorMatrix.setAttribute("color-interpolation-filters", "sRGB");
    feColorMatrix.setAttribute("values", "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1");
    return feColorMatrix;
  }
  return ob;
}();
var filters_default = filtersFactory;

// src/utils/featureSupport.js
var featureSupport = function() {
  var ob = {
    maskType: true,
    svgLumaHidden: true,
    offscreenCanvas: typeof OffscreenCanvas !== "undefined"
  };
  if (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) {
    ob.maskType = false;
  }
  if (/firefox/i.test(navigator.userAgent)) {
    ob.svgLumaHidden = false;
  }
  return ob;
}();
var featureSupport_default = featureSupport;

// src/elements/svgElements/SVGEffects.js
var registeredEffects = {};
var idPrefix2 = "filter_result_";
function SVGEffects(elem) {
  var i;
  var source = "SourceGraphic";
  var len = elem.data.ef ? elem.data.ef.length : 0;
  var filId = createElementID();
  var fil = filters_default.createFilter(filId, true);
  var count = 0;
  this.filters = [];
  var filterManager;
  for (i = 0; i < len; i += 1) {
    filterManager = null;
    var type = elem.data.ef[i].ty;
    if (registeredEffects[type]) {
      var Effect = registeredEffects[type].effect;
      filterManager = new Effect(fil, elem.effectsManager.effectElements[i], elem, idPrefix2 + count, source);
      source = idPrefix2 + count;
      if (registeredEffects[type].countsAsEffect) {
        count += 1;
      }
    }
    if (filterManager) {
      this.filters.push(filterManager);
    }
  }
  if (count) {
    elem.globalData.defs.appendChild(fil);
    elem.layerElement.setAttribute("filter", "url(" + getLocationHref() + "#" + filId + ")");
  }
  if (this.filters.length) {
    elem.addRenderableComponent(this);
  }
}
SVGEffects.prototype.renderFrame = function(_isFirstFrame) {
  var i;
  var len = this.filters.length;
  for (i = 0; i < len; i += 1) {
    this.filters[i].renderFrame(_isFirstFrame);
  }
};
SVGEffects.prototype.getEffects = function(type) {
  var i;
  var len = this.filters.length;
  var effects = [];
  for (i = 0; i < len; i += 1) {
    if (this.filters[i].type === type) {
      effects.push(this.filters[i]);
    }
  }
  return effects;
};
var SVGEffects_default = SVGEffects;

// src/elements/svgElements/SVGBaseElement.js
function SVGBaseElement() {
}
SVGBaseElement.prototype = {
  initRendererElement: function() {
    this.layerElement = svg_elements_default("g");
  },
  createContainerElements: function() {
    this.matteElement = svg_elements_default("g");
    this.transformedElement = this.layerElement;
    this.maskedElement = this.layerElement;
    this._sizeChanged = false;
    var layerElementParent = null;
    if (this.data.td) {
      this.matteMasks = {};
      var gg = svg_elements_default("g");
      gg.setAttribute("id", this.layerId);
      gg.appendChild(this.layerElement);
      layerElementParent = gg;
      this.globalData.defs.appendChild(gg);
    } else if (this.data.tt) {
      this.matteElement.appendChild(this.layerElement);
      layerElementParent = this.matteElement;
      this.baseElement = this.matteElement;
    } else {
      this.baseElement = this.layerElement;
    }
    if (this.data.ln) {
      this.layerElement.setAttribute("id", this.data.ln);
    }
    if (this.data.cl) {
      this.layerElement.setAttribute("class", this.data.cl);
    }
    if (this.data.ty === 0 && !this.data.hd) {
      var cp = svg_elements_default("clipPath");
      var pt = svg_elements_default("path");
      pt.setAttribute("d", "M0,0 L" + this.data.w + ",0 L" + this.data.w + "," + this.data.h + " L0," + this.data.h + "z");
      var clipId = createElementID();
      cp.setAttribute("id", clipId);
      cp.appendChild(pt);
      this.globalData.defs.appendChild(cp);
      if (this.checkMasks()) {
        var cpGroup = svg_elements_default("g");
        cpGroup.setAttribute("clip-path", "url(" + getLocationHref() + "#" + clipId + ")");
        cpGroup.appendChild(this.layerElement);
        this.transformedElement = cpGroup;
        if (layerElementParent) {
          layerElementParent.appendChild(this.transformedElement);
        } else {
          this.baseElement = this.transformedElement;
        }
      } else {
        this.layerElement.setAttribute("clip-path", "url(" + getLocationHref() + "#" + clipId + ")");
      }
    }
    if (this.data.bm !== 0) {
      this.setBlendMode();
    }
  },
  renderElement: function() {
    if (this.finalTransform._localMatMdf) {
      this.transformedElement.setAttribute("transform", this.finalTransform.localMat.to2dCSS());
    }
    if (this.finalTransform._opMdf) {
      this.transformedElement.setAttribute("opacity", this.finalTransform.localOpacity);
    }
  },
  destroyBaseElement: function() {
    this.layerElement = null;
    this.matteElement = null;
    this.maskManager.destroy();
  },
  getBaseElement: function() {
    if (this.data.hd) {
      return null;
    }
    return this.baseElement;
  },
  createRenderableComponents: function() {
    this.maskManager = new mask_default(this.data, this, this.globalData);
    this.renderableEffectsManager = new SVGEffects_default(this);
    this.searchEffectTransforms();
  },
  getMatte: function(matteType) {
    if (!this.matteMasks) {
      this.matteMasks = {};
    }
    if (!this.matteMasks[matteType]) {
      var id = this.layerId + "_" + matteType;
      var filId;
      var fil;
      var useElement;
      var gg;
      if (matteType === 1 || matteType === 3) {
        var masker = svg_elements_default("mask");
        masker.setAttribute("id", id);
        masker.setAttribute("mask-type", matteType === 3 ? "luminance" : "alpha");
        useElement = svg_elements_default("use");
        useElement.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + this.layerId);
        masker.appendChild(useElement);
        this.globalData.defs.appendChild(masker);
        if (!featureSupport_default.maskType && matteType === 1) {
          masker.setAttribute("mask-type", "luminance");
          filId = createElementID();
          fil = filters_default.createFilter(filId);
          this.globalData.defs.appendChild(fil);
          fil.appendChild(filters_default.createAlphaToLuminanceFilter());
          gg = svg_elements_default("g");
          gg.appendChild(useElement);
          masker.appendChild(gg);
          gg.setAttribute("filter", "url(" + getLocationHref() + "#" + filId + ")");
        }
      } else if (matteType === 2) {
        var maskGroup = svg_elements_default("mask");
        maskGroup.setAttribute("id", id);
        maskGroup.setAttribute("mask-type", "alpha");
        var maskGrouper = svg_elements_default("g");
        maskGroup.appendChild(maskGrouper);
        filId = createElementID();
        fil = filters_default.createFilter(filId);
        var feCTr = svg_elements_default("feComponentTransfer");
        feCTr.setAttribute("in", "SourceGraphic");
        fil.appendChild(feCTr);
        var feFunc = svg_elements_default("feFuncA");
        feFunc.setAttribute("type", "table");
        feFunc.setAttribute("tableValues", "1.0 0.0");
        feCTr.appendChild(feFunc);
        this.globalData.defs.appendChild(fil);
        var alphaRect = svg_elements_default("rect");
        alphaRect.setAttribute("width", this.comp.data.w);
        alphaRect.setAttribute("height", this.comp.data.h);
        alphaRect.setAttribute("x", "0");
        alphaRect.setAttribute("y", "0");
        alphaRect.setAttribute("fill", "#ffffff");
        alphaRect.setAttribute("opacity", "0");
        maskGrouper.setAttribute("filter", "url(" + getLocationHref() + "#" + filId + ")");
        maskGrouper.appendChild(alphaRect);
        useElement = svg_elements_default("use");
        useElement.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + this.layerId);
        maskGrouper.appendChild(useElement);
        if (!featureSupport_default.maskType) {
          maskGroup.setAttribute("mask-type", "luminance");
          fil.appendChild(filters_default.createAlphaToLuminanceFilter());
          gg = svg_elements_default("g");
          maskGrouper.appendChild(alphaRect);
          gg.appendChild(this.layerElement);
          maskGrouper.appendChild(gg);
        }
        this.globalData.defs.appendChild(maskGroup);
      }
      this.matteMasks[matteType] = id;
    }
    return this.matteMasks[matteType];
  },
  setMatte: function(id) {
    if (!this.matteElement) {
      return;
    }
    this.matteElement.setAttribute("mask", "url(" + getLocationHref() + "#" + id + ")");
  }
};
var SVGBaseElement_default = SVGBaseElement;

// src/elements/helpers/HierarchyElement.js
function HierarchyElement() {
}
HierarchyElement.prototype = {
  /**
     * @function
     * Initializes hierarchy properties
     *
     */
  initHierarchy: function() {
    this.hierarchy = [];
    this._isParent = false;
    this.checkParenting();
  },
  /**
     * @function
     * Sets layer's hierarchy.
     * @param {array} hierarch
     * layer's parent list
     *
     */
  setHierarchy: function(hierarchy) {
    this.hierarchy = hierarchy;
  },
  /**
     * @function
     * Sets layer as parent.
     *
     */
  setAsParent: function() {
    this._isParent = true;
  },
  /**
     * @function
     * Searches layer's parenting chain
     *
     */
  checkParenting: function() {
    if (this.data.parent !== void 0) {
      this.comp.buildElementParenting(this, this.data.parent, []);
    }
  }
};
var HierarchyElement_default = HierarchyElement;

// src/elements/helpers/FrameElement.js
function FrameElement() {
}
FrameElement.prototype = {
  /**
     * @function
     * Initializes frame related properties.
     *
     */
  initFrame: function() {
    this._isFirstFrame = false;
    this.dynamicProperties = [];
    this._mdf = false;
  },
  /**
     * @function
     * Calculates all dynamic values
     *
     * @param {number} num
     * current frame number in Layer's time
     * @param {boolean} isVisible
     * if layers is currently in range
     *
     */
  prepareProperties: function(num, isVisible) {
    var i;
    var len = this.dynamicProperties.length;
    for (i = 0; i < len; i += 1) {
      if (isVisible || this._isParent && this.dynamicProperties[i].propType === "transform") {
        this.dynamicProperties[i].getValue();
        if (this.dynamicProperties[i]._mdf) {
          this.globalData._mdf = true;
          this._mdf = true;
        }
      }
    }
  },
  addDynamicProperty: function(prop) {
    if (this.dynamicProperties.indexOf(prop) === -1) {
      this.dynamicProperties.push(prop);
    }
  }
};
var FrameElement_default = FrameElement;

// src/elements/helpers/RenderableElement.js
function RenderableElement() {
}
RenderableElement.prototype = {
  initRenderable: function() {
    this.isInRange = false;
    this.hidden = false;
    this.isTransparent = false;
    this.renderableComponents = [];
  },
  addRenderableComponent: function(component) {
    if (this.renderableComponents.indexOf(component) === -1) {
      this.renderableComponents.push(component);
    }
  },
  removeRenderableComponent: function(component) {
    if (this.renderableComponents.indexOf(component) !== -1) {
      this.renderableComponents.splice(this.renderableComponents.indexOf(component), 1);
    }
  },
  prepareRenderableFrame: function(num) {
    this.checkLayerLimits(num);
  },
  checkTransparency: function() {
    if (this.finalTransform.mProp.o.v <= 0) {
      if (!this.isTransparent && this.globalData.renderConfig.hideOnTransparent) {
        this.isTransparent = true;
        this.hide();
      }
    } else if (this.isTransparent) {
      this.isTransparent = false;
      this.show();
    }
  },
  /**
     * @function
     * Initializes frame related properties.
     *
     * @param {number} num
     * current frame number in Layer's time
     *
     */
  checkLayerLimits: function(num) {
    if (this.data.ip - this.data.st <= num && this.data.op - this.data.st > num) {
      if (this.isInRange !== true) {
        this.globalData._mdf = true;
        this._mdf = true;
        this.isInRange = true;
        this.show();
      }
    } else if (this.isInRange !== false) {
      this.globalData._mdf = true;
      this.isInRange = false;
      this.hide();
    }
  },
  renderRenderable: function() {
    var i;
    var len = this.renderableComponents.length;
    for (i = 0; i < len; i += 1) {
      this.renderableComponents[i].renderFrame(this._isFirstFrame);
    }
  },
  sourceRectAtTime: function() {
    return {
      top: 0,
      left: 0,
      width: 100,
      height: 100
    };
  },
  getLayerSize: function() {
    if (this.data.ty === 5) {
      return { w: this.data.textData.width, h: this.data.textData.height };
    }
    return { w: this.data.width, h: this.data.height };
  }
};
var RenderableElement_default = RenderableElement;

// src/elements/helpers/RenderableDOMElement.js
function RenderableDOMElement() {
}
(function() {
  var _prototype = {
    initElement: function(data, globalData, comp) {
      this.initFrame();
      this.initBaseData(data, globalData, comp);
      this.initTransform(data, globalData, comp);
      this.initHierarchy();
      this.initRenderable();
      this.initRendererElement();
      this.createContainerElements();
      this.createRenderableComponents();
      this.createContent();
      this.hide();
    },
    hide: function() {
      if (!this.hidden && (!this.isInRange || this.isTransparent)) {
        var elem = this.baseElement || this.layerElement;
        elem.style.display = "none";
        this.hidden = true;
      }
    },
    show: function() {
      if (this.isInRange && !this.isTransparent) {
        if (!this.data.hd) {
          var elem = this.baseElement || this.layerElement;
          elem.style.display = "block";
        }
        this.hidden = false;
        this._isFirstFrame = true;
      }
    },
    renderFrame: function() {
      if (this.data.hd || this.hidden) {
        return;
      }
      this.renderTransform();
      this.renderRenderable();
      this.renderLocalTransform();
      this.renderElement();
      this.renderInnerContent();
      if (this._isFirstFrame) {
        this._isFirstFrame = false;
      }
    },
    renderInnerContent: function() {
    },
    prepareFrame: function(num) {
      this._mdf = false;
      this.prepareRenderableFrame(num);
      this.prepareProperties(num, this.isInRange);
      this.checkTransparency();
    },
    destroy: function() {
      this.innerElem = null;
      this.destroyBaseElement();
    }
  };
  extendPrototype([RenderableElement_default, createProxyFunction(_prototype)], RenderableDOMElement);
})();
var RenderableDOMElement_default = RenderableDOMElement;

// src/elements/ImageElement.js
function IImageElement(data, globalData, comp) {
  this.assetData = globalData.getAssetData(data.refId);
  if (this.assetData && this.assetData.sid) {
    this.assetData = globalData.slotManager.getProp(this.assetData);
  }
  this.initElement(data, globalData, comp);
  this.sourceRect = {
    top: 0,
    left: 0,
    width: this.assetData.w,
    height: this.assetData.h
  };
}
extendPrototype([BaseElement_default, TransformElement_default, SVGBaseElement_default, HierarchyElement_default, FrameElement_default, RenderableDOMElement_default], IImageElement);
IImageElement.prototype.createContent = function() {
  var assetPath = this.globalData.getAssetsPath(this.assetData);
  this.innerElem = svg_elements_default("image");
  this.innerElem.setAttribute("width", this.assetData.w + "px");
  this.innerElem.setAttribute("height", this.assetData.h + "px");
  this.innerElem.setAttribute("preserveAspectRatio", this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio);
  this.innerElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", assetPath);
  this.layerElement.appendChild(this.innerElem);
};
IImageElement.prototype.sourceRectAtTime = function() {
  return this.sourceRect;
};
var ImageElement_default = IImageElement;

// src/elements/helpers/shapes/ProcessedElement.js
function ProcessedElement(element, position) {
  this.elem = element;
  this.pos = position;
}
var ProcessedElement_default = ProcessedElement;

// src/elements/ShapeElement.js
function IShapeElement() {
}
IShapeElement.prototype = {
  addShapeToModifiers: function(data) {
    var i;
    var len = this.shapeModifiers.length;
    for (i = 0; i < len; i += 1) {
      this.shapeModifiers[i].addShape(data);
    }
  },
  isShapeInAnimatedModifiers: function(data) {
    var i = 0;
    var len = this.shapeModifiers.length;
    while (i < len) {
      if (this.shapeModifiers[i].isAnimatedWithShape(data)) {
        return true;
      }
    }
    return false;
  },
  renderModifiers: function() {
    if (!this.shapeModifiers.length) {
      return;
    }
    var i;
    var len = this.shapes.length;
    for (i = 0; i < len; i += 1) {
      this.shapes[i].sh.reset();
    }
    len = this.shapeModifiers.length;
    var shouldBreakProcess;
    for (i = len - 1; i >= 0; i -= 1) {
      shouldBreakProcess = this.shapeModifiers[i].processShapes(this._isFirstFrame);
      if (shouldBreakProcess) {
        break;
      }
    }
  },
  searchProcessedElement: function(elem) {
    var elements = this.processedElements;
    var i = 0;
    var len = elements.length;
    while (i < len) {
      if (elements[i].elem === elem) {
        return elements[i].pos;
      }
      i += 1;
    }
    return 0;
  },
  addProcessedElement: function(elem, pos) {
    var elements = this.processedElements;
    var i = elements.length;
    while (i) {
      i -= 1;
      if (elements[i].elem === elem) {
        elements[i].pos = pos;
        return;
      }
    }
    elements.push(new ProcessedElement_default(elem, pos));
  },
  prepareFrame: function(num) {
    this.prepareRenderableFrame(num);
    this.prepareProperties(num, this.isInRange);
  }
};
var ShapeElement_default = IShapeElement;

// src/utils/helpers/shapeEnums.js
var lineCapEnum = {
  1: "butt",
  2: "round",
  3: "square"
};
var lineJoinEnum = {
  1: "miter",
  2: "round",
  3: "bevel"
};

// src/elements/helpers/shapes/SVGShapeData.js
function SVGShapeData(transformers, level, shape) {
  this.caches = [];
  this.styles = [];
  this.transformers = transformers;
  this.lStr = "";
  this.sh = shape;
  this.lvl = level;
  this._isAnimated = !!shape.k;
  var i = 0;
  var len = transformers.length;
  while (i < len) {
    if (transformers[i].mProps.dynamicProperties.length) {
      this._isAnimated = true;
      break;
    }
    i += 1;
  }
}
SVGShapeData.prototype.setAsAnimated = function() {
  this._isAnimated = true;
};
var SVGShapeData_default = SVGShapeData;

// src/elements/helpers/shapes/SVGStyleData.js
function SVGStyleData(data, level) {
  this.data = data;
  this.type = data.ty;
  this.d = "";
  this.lvl = level;
  this._mdf = false;
  this.closed = data.hd === true;
  this.pElem = svg_elements_default("path");
  this.msElem = null;
}
SVGStyleData.prototype.reset = function() {
  this.d = "";
  this._mdf = false;
};
var SVGStyleData_default = SVGStyleData;

// src/utils/shapes/DashProperty.js
function DashProperty(elem, data, renderer, container) {
  this.elem = elem;
  this.frameId = -1;
  this.dataProps = createSizedArray(data.length);
  this.renderer = renderer;
  this.k = false;
  this.dashStr = "";
  this.dashArray = createTypedArray("float32", data.length ? data.length - 1 : 0);
  this.dashoffset = createTypedArray("float32", 1);
  this.initDynamicPropertyContainer(container);
  var i;
  var len = data.length || 0;
  var prop;
  for (i = 0; i < len; i += 1) {
    prop = PropertyFactory_default.getProp(elem, data[i].v, 0, 0, this);
    this.k = prop.k || this.k;
    this.dataProps[i] = { n: data[i].n, p: prop };
  }
  if (!this.k) {
    this.getValue(true);
  }
  this._isAnimated = this.k;
}
DashProperty.prototype.getValue = function(forceRender) {
  if (this.elem.globalData.frameId === this.frameId && !forceRender) {
    return;
  }
  this.frameId = this.elem.globalData.frameId;
  this.iterateDynamicProperties();
  this._mdf = this._mdf || forceRender;
  if (this._mdf) {
    var i = 0;
    var len = this.dataProps.length;
    if (this.renderer === "svg") {
      this.dashStr = "";
    }
    for (i = 0; i < len; i += 1) {
      if (this.dataProps[i].n !== "o") {
        if (this.renderer === "svg") {
          this.dashStr += " " + this.dataProps[i].p.v;
        } else {
          this.dashArray[i] = this.dataProps[i].p.v;
        }
      } else {
        this.dashoffset[0] = this.dataProps[i].p.v;
      }
    }
  }
};
extendPrototype([dynamicProperties_default], DashProperty);
var DashProperty_default = DashProperty;

// src/elements/helpers/shapes/SVGStrokeStyleData.js
function SVGStrokeStyleData(elem, data, styleOb) {
  this.initDynamicPropertyContainer(elem);
  this.getValue = this.iterateDynamicProperties;
  this.o = PropertyFactory_default.getProp(elem, data.o, 0, 0.01, this);
  this.w = PropertyFactory_default.getProp(elem, data.w, 0, null, this);
  this.d = new DashProperty_default(elem, data.d || {}, "svg", this);
  this.c = PropertyFactory_default.getProp(elem, data.c, 1, 255, this);
  this.style = styleOb;
  this._isAnimated = !!this._isAnimated;
}
extendPrototype([dynamicProperties_default], SVGStrokeStyleData);
var SVGStrokeStyleData_default = SVGStrokeStyleData;

// src/elements/helpers/shapes/SVGFillStyleData.js
function SVGFillStyleData(elem, data, styleOb) {
  this.initDynamicPropertyContainer(elem);
  this.getValue = this.iterateDynamicProperties;
  this.o = PropertyFactory_default.getProp(elem, data.o, 0, 0.01, this);
  this.c = PropertyFactory_default.getProp(elem, data.c, 1, 255, this);
  this.style = styleOb;
}
extendPrototype([dynamicProperties_default], SVGFillStyleData);
var SVGFillStyleData_default = SVGFillStyleData;

// src/elements/helpers/shapes/SVGNoStyleData.js
function SVGNoStyleData(elem, data, styleOb) {
  this.initDynamicPropertyContainer(elem);
  this.getValue = this.iterateDynamicProperties;
  this.style = styleOb;
}
extendPrototype([dynamicProperties_default], SVGNoStyleData);
var SVGNoStyleData_default = SVGNoStyleData;

// src/utils/shapes/GradientProperty.js
function GradientProperty(elem, data, container) {
  this.data = data;
  this.c = createTypedArray("uint8c", data.p * 4);
  var cLength = data.k.k[0].s ? data.k.k[0].s.length - data.p * 4 : data.k.k.length - data.p * 4;
  this.o = createTypedArray("float32", cLength);
  this._cmdf = false;
  this._omdf = false;
  this._collapsable = this.checkCollapsable();
  this._hasOpacity = cLength;
  this.initDynamicPropertyContainer(container);
  this.prop = PropertyFactory_default.getProp(elem, data.k, 1, null, this);
  this.k = this.prop.k;
  this.getValue(true);
}
GradientProperty.prototype.comparePoints = function(values, points) {
  var i = 0;
  var len = this.o.length / 2;
  var diff;
  while (i < len) {
    diff = Math.abs(values[i * 4] - values[points * 4 + i * 2]);
    if (diff > 0.01) {
      return false;
    }
    i += 1;
  }
  return true;
};
GradientProperty.prototype.checkCollapsable = function() {
  if (this.o.length / 2 !== this.c.length / 4) {
    return false;
  }
  if (this.data.k.k[0].s) {
    var i = 0;
    var len = this.data.k.k.length;
    while (i < len) {
      if (!this.comparePoints(this.data.k.k[i].s, this.data.p)) {
        return false;
      }
      i += 1;
    }
  } else if (!this.comparePoints(this.data.k.k, this.data.p)) {
    return false;
  }
  return true;
};
GradientProperty.prototype.getValue = function(forceRender) {
  this.prop.getValue();
  this._mdf = false;
  this._cmdf = false;
  this._omdf = false;
  if (this.prop._mdf || forceRender) {
    var i;
    var len = this.data.p * 4;
    var mult;
    var val;
    for (i = 0; i < len; i += 1) {
      mult = i % 4 === 0 ? 100 : 255;
      val = Math.round(this.prop.v[i] * mult);
      if (this.c[i] !== val) {
        this.c[i] = val;
        this._cmdf = !forceRender;
      }
    }
    if (this.o.length) {
      len = this.prop.v.length;
      for (i = this.data.p * 4; i < len; i += 1) {
        mult = i % 2 === 0 ? 100 : 1;
        val = i % 2 === 0 ? Math.round(this.prop.v[i] * 100) : this.prop.v[i];
        if (this.o[i - this.data.p * 4] !== val) {
          this.o[i - this.data.p * 4] = val;
          this._omdf = !forceRender;
        }
      }
    }
    this._mdf = !forceRender;
  }
};
extendPrototype([dynamicProperties_default], GradientProperty);
var GradientProperty_default = GradientProperty;

// src/elements/helpers/shapes/SVGGradientFillStyleData.js
function SVGGradientFillStyleData(elem, data, styleOb) {
  this.initDynamicPropertyContainer(elem);
  this.getValue = this.iterateDynamicProperties;
  this.initGradientData(elem, data, styleOb);
}
SVGGradientFillStyleData.prototype.initGradientData = function(elem, data, styleOb) {
  this.o = PropertyFactory_default.getProp(elem, data.o, 0, 0.01, this);
  this.s = PropertyFactory_default.getProp(elem, data.s, 1, null, this);
  this.e = PropertyFactory_default.getProp(elem, data.e, 1, null, this);
  this.h = PropertyFactory_default.getProp(elem, data.h || { k: 0 }, 0, 0.01, this);
  this.a = PropertyFactory_default.getProp(elem, data.a || { k: 0 }, 0, degToRads, this);
  this.g = new GradientProperty_default(elem, data.g, this);
  this.style = styleOb;
  this.stops = [];
  this.setGradientData(styleOb.pElem, data);
  this.setGradientOpacity(data, styleOb);
  this._isAnimated = !!this._isAnimated;
};
SVGGradientFillStyleData.prototype.setGradientData = function(pathElement, data) {
  var gradientId = createElementID();
  var gfill = svg_elements_default(data.t === 1 ? "linearGradient" : "radialGradient");
  gfill.setAttribute("id", gradientId);
  gfill.setAttribute("spreadMethod", "pad");
  gfill.setAttribute("gradientUnits", "userSpaceOnUse");
  var stops = [];
  var stop;
  var j;
  var jLen;
  jLen = data.g.p * 4;
  for (j = 0; j < jLen; j += 4) {
    stop = svg_elements_default("stop");
    gfill.appendChild(stop);
    stops.push(stop);
  }
  pathElement.setAttribute(data.ty === "gf" ? "fill" : "stroke", "url(" + getLocationHref() + "#" + gradientId + ")");
  this.gf = gfill;
  this.cst = stops;
};
SVGGradientFillStyleData.prototype.setGradientOpacity = function(data, styleOb) {
  if (this.g._hasOpacity && !this.g._collapsable) {
    var stop;
    var j;
    var jLen;
    var mask = svg_elements_default("mask");
    var maskElement = svg_elements_default("path");
    mask.appendChild(maskElement);
    var opacityId = createElementID();
    var maskId = createElementID();
    mask.setAttribute("id", maskId);
    var opFill = svg_elements_default(data.t === 1 ? "linearGradient" : "radialGradient");
    opFill.setAttribute("id", opacityId);
    opFill.setAttribute("spreadMethod", "pad");
    opFill.setAttribute("gradientUnits", "userSpaceOnUse");
    jLen = data.g.k.k[0].s ? data.g.k.k[0].s.length : data.g.k.k.length;
    var stops = this.stops;
    for (j = data.g.p * 4; j < jLen; j += 2) {
      stop = svg_elements_default("stop");
      stop.setAttribute("stop-color", "rgb(255,255,255)");
      opFill.appendChild(stop);
      stops.push(stop);
    }
    maskElement.setAttribute(data.ty === "gf" ? "fill" : "stroke", "url(" + getLocationHref() + "#" + opacityId + ")");
    if (data.ty === "gs") {
      maskElement.setAttribute("stroke-linecap", lineCapEnum[data.lc || 2]);
      maskElement.setAttribute("stroke-linejoin", lineJoinEnum[data.lj || 2]);
      if (data.lj === 1) {
        maskElement.setAttribute("stroke-miterlimit", data.ml);
      }
    }
    this.of = opFill;
    this.ms = mask;
    this.ost = stops;
    this.maskId = maskId;
    styleOb.msElem = maskElement;
  }
};
extendPrototype([dynamicProperties_default], SVGGradientFillStyleData);
var SVGGradientFillStyleData_default = SVGGradientFillStyleData;

// src/elements/helpers/shapes/SVGGradientStrokeStyleData.js
function SVGGradientStrokeStyleData(elem, data, styleOb) {
  this.initDynamicPropertyContainer(elem);
  this.getValue = this.iterateDynamicProperties;
  this.w = PropertyFactory_default.getProp(elem, data.w, 0, null, this);
  this.d = new DashProperty_default(elem, data.d || {}, "svg", this);
  this.initGradientData(elem, data, styleOb);
  this._isAnimated = !!this._isAnimated;
}
extendPrototype([SVGGradientFillStyleData_default, dynamicProperties_default], SVGGradientStrokeStyleData);
var SVGGradientStrokeStyleData_default = SVGGradientStrokeStyleData;

// src/elements/helpers/shapes/ShapeGroupData.js
function ShapeGroupData() {
  this.it = [];
  this.prevViewData = [];
  this.gr = svg_elements_default("g");
}
var ShapeGroupData_default = ShapeGroupData;

// src/elements/helpers/shapes/SVGTransformData.js
function SVGTransformData(mProps, op, container) {
  this.transform = {
    mProps,
    op,
    container
  };
  this.elements = [];
  this._isAnimated = this.transform.mProps.dynamicProperties.length || this.transform.op.effectsSequence.length;
}
var SVGTransformData_default = SVGTransformData;

// src/utils/shapes/shapePathBuilder.js
var buildShapeString = function(pathNodes, length, closed, mat) {
  if (length === 0) {
    return "";
  }
  var _o = pathNodes.o;
  var _i = pathNodes.i;
  var _v = pathNodes.v;
  var i;
  var shapeString = " M" + mat.applyToPointStringified(_v[0][0], _v[0][1]);
  for (i = 1; i < length; i += 1) {
    shapeString += " C" + mat.applyToPointStringified(_o[i - 1][0], _o[i - 1][1]) + " " + mat.applyToPointStringified(_i[i][0], _i[i][1]) + " " + mat.applyToPointStringified(_v[i][0], _v[i][1]);
  }
  if (closed && length) {
    shapeString += " C" + mat.applyToPointStringified(_o[i - 1][0], _o[i - 1][1]) + " " + mat.applyToPointStringified(_i[0][0], _i[0][1]) + " " + mat.applyToPointStringified(_v[0][0], _v[0][1]);
    shapeString += "z";
  }
  return shapeString;
};
var shapePathBuilder_default = buildShapeString;

// src/elements/helpers/shapes/SVGElementsRenderer.js
var SVGElementsRenderer = function() {
  var _identityMatrix = new transformation_matrix_default();
  var _matrixHelper = new transformation_matrix_default();
  var ob = {
    createRenderFunction
  };
  function createRenderFunction(data) {
    switch (data.ty) {
      case "fl":
        return renderFill;
      case "gf":
        return renderGradient;
      case "gs":
        return renderGradientStroke;
      case "st":
        return renderStroke;
      case "sh":
      case "el":
      case "rc":
      case "sr":
        return renderPath;
      case "tr":
        return renderContentTransform;
      case "no":
        return renderNoop;
      default:
        return null;
    }
  }
  function renderContentTransform(styleData, itemData, isFirstFrame) {
    if (isFirstFrame || itemData.transform.op._mdf) {
      itemData.transform.container.setAttribute("opacity", itemData.transform.op.v);
    }
    if (isFirstFrame || itemData.transform.mProps._mdf) {
      itemData.transform.container.setAttribute("transform", itemData.transform.mProps.v.to2dCSS());
    }
  }
  function renderNoop() {
  }
  function renderPath(styleData, itemData, isFirstFrame) {
    var j;
    var jLen;
    var pathStringTransformed;
    var redraw;
    var pathNodes;
    var l;
    var lLen = itemData.styles.length;
    var lvl = itemData.lvl;
    var paths;
    var mat;
    var iterations;
    var k;
    for (l = 0; l < lLen; l += 1) {
      redraw = itemData.sh._mdf || isFirstFrame;
      if (itemData.styles[l].lvl < lvl) {
        mat = _matrixHelper.reset();
        iterations = lvl - itemData.styles[l].lvl;
        k = itemData.transformers.length - 1;
        while (!redraw && iterations > 0) {
          redraw = itemData.transformers[k].mProps._mdf || redraw;
          iterations -= 1;
          k -= 1;
        }
        if (redraw) {
          iterations = lvl - itemData.styles[l].lvl;
          k = itemData.transformers.length - 1;
          while (iterations > 0) {
            mat.multiply(itemData.transformers[k].mProps.v);
            iterations -= 1;
            k -= 1;
          }
        }
      } else {
        mat = _identityMatrix;
      }
      paths = itemData.sh.paths;
      jLen = paths._length;
      if (redraw) {
        pathStringTransformed = "";
        for (j = 0; j < jLen; j += 1) {
          pathNodes = paths.shapes[j];
          if (pathNodes && pathNodes._length) {
            pathStringTransformed += shapePathBuilder_default(pathNodes, pathNodes._length, pathNodes.c, mat);
          }
        }
        itemData.caches[l] = pathStringTransformed;
      } else {
        pathStringTransformed = itemData.caches[l];
      }
      itemData.styles[l].d += styleData.hd === true ? "" : pathStringTransformed;
      itemData.styles[l]._mdf = redraw || itemData.styles[l]._mdf;
    }
  }
  function renderFill(styleData, itemData, isFirstFrame) {
    var styleElem = itemData.style;
    if (itemData.c._mdf || isFirstFrame) {
      styleElem.pElem.setAttribute("fill", "rgb(" + bmFloor(itemData.c.v[0]) + "," + bmFloor(itemData.c.v[1]) + "," + bmFloor(itemData.c.v[2]) + ")");
    }
    if (itemData.o._mdf || isFirstFrame) {
      styleElem.pElem.setAttribute("fill-opacity", itemData.o.v);
    }
  }
  function renderGradientStroke(styleData, itemData, isFirstFrame) {
    renderGradient(styleData, itemData, isFirstFrame);
    renderStroke(styleData, itemData, isFirstFrame);
  }
  function renderGradient(styleData, itemData, isFirstFrame) {
    var gfill = itemData.gf;
    var hasOpacity = itemData.g._hasOpacity;
    var pt1 = itemData.s.v;
    var pt2 = itemData.e.v;
    if (itemData.o._mdf || isFirstFrame) {
      var attr = styleData.ty === "gf" ? "fill-opacity" : "stroke-opacity";
      itemData.style.pElem.setAttribute(attr, itemData.o.v);
    }
    if (itemData.s._mdf || isFirstFrame) {
      var attr1 = styleData.t === 1 ? "x1" : "cx";
      var attr2 = attr1 === "x1" ? "y1" : "cy";
      gfill.setAttribute(attr1, pt1[0]);
      gfill.setAttribute(attr2, pt1[1]);
      if (hasOpacity && !itemData.g._collapsable) {
        itemData.of.setAttribute(attr1, pt1[0]);
        itemData.of.setAttribute(attr2, pt1[1]);
      }
    }
    var stops;
    var i;
    var len;
    var stop;
    if (itemData.g._cmdf || isFirstFrame) {
      stops = itemData.cst;
      var cValues = itemData.g.c;
      len = stops.length;
      for (i = 0; i < len; i += 1) {
        stop = stops[i];
        stop.setAttribute("offset", cValues[i * 4] + "%");
        stop.setAttribute("stop-color", "rgb(" + cValues[i * 4 + 1] + "," + cValues[i * 4 + 2] + "," + cValues[i * 4 + 3] + ")");
      }
    }
    if (hasOpacity && (itemData.g._omdf || isFirstFrame)) {
      var oValues = itemData.g.o;
      if (itemData.g._collapsable) {
        stops = itemData.cst;
      } else {
        stops = itemData.ost;
      }
      len = stops.length;
      for (i = 0; i < len; i += 1) {
        stop = stops[i];
        if (!itemData.g._collapsable) {
          stop.setAttribute("offset", oValues[i * 2] + "%");
        }
        stop.setAttribute("stop-opacity", oValues[i * 2 + 1]);
      }
    }
    if (styleData.t === 1) {
      if (itemData.e._mdf || isFirstFrame) {
        gfill.setAttribute("x2", pt2[0]);
        gfill.setAttribute("y2", pt2[1]);
        if (hasOpacity && !itemData.g._collapsable) {
          itemData.of.setAttribute("x2", pt2[0]);
          itemData.of.setAttribute("y2", pt2[1]);
        }
      }
    } else {
      var rad;
      if (itemData.s._mdf || itemData.e._mdf || isFirstFrame) {
        rad = Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2));
        gfill.setAttribute("r", rad);
        if (hasOpacity && !itemData.g._collapsable) {
          itemData.of.setAttribute("r", rad);
        }
      }
      if (itemData.s._mdf || itemData.e._mdf || itemData.h._mdf || itemData.a._mdf || isFirstFrame) {
        if (!rad) {
          rad = Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2));
        }
        var ang = Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0]);
        var percent = itemData.h.v;
        if (percent >= 1) {
          percent = 0.99;
        } else if (percent <= -1) {
          percent = -0.99;
        }
        var dist = rad * percent;
        var x = Math.cos(ang + itemData.a.v) * dist + pt1[0];
        var y = Math.sin(ang + itemData.a.v) * dist + pt1[1];
        gfill.setAttribute("fx", x);
        gfill.setAttribute("fy", y);
        if (hasOpacity && !itemData.g._collapsable) {
          itemData.of.setAttribute("fx", x);
          itemData.of.setAttribute("fy", y);
        }
      }
    }
  }
  function renderStroke(styleData, itemData, isFirstFrame) {
    var styleElem = itemData.style;
    var d = itemData.d;
    if (d && (d._mdf || isFirstFrame) && d.dashStr) {
      styleElem.pElem.setAttribute("stroke-dasharray", d.dashStr);
      styleElem.pElem.setAttribute("stroke-dashoffset", d.dashoffset[0]);
    }
    if (itemData.c && (itemData.c._mdf || isFirstFrame)) {
      styleElem.pElem.setAttribute("stroke", "rgb(" + bmFloor(itemData.c.v[0]) + "," + bmFloor(itemData.c.v[1]) + "," + bmFloor(itemData.c.v[2]) + ")");
    }
    if (itemData.o._mdf || isFirstFrame) {
      styleElem.pElem.setAttribute("stroke-opacity", itemData.o.v);
    }
    if (itemData.w._mdf || isFirstFrame) {
      styleElem.pElem.setAttribute("stroke-width", itemData.w.v);
      if (styleElem.msElem) {
        styleElem.msElem.setAttribute("stroke-width", itemData.w.v);
      }
    }
  }
  return ob;
}();
var SVGElementsRenderer_default = SVGElementsRenderer;

// src/elements/svgElements/SVGShapeElement.js
function SVGShapeElement(data, globalData, comp) {
  this.shapes = [];
  this.shapesData = data.shapes;
  this.stylesList = [];
  this.shapeModifiers = [];
  this.itemsData = [];
  this.processedElements = [];
  this.animatedContents = [];
  this.initElement(data, globalData, comp);
  this.prevViewData = [];
}
extendPrototype([BaseElement_default, TransformElement_default, SVGBaseElement_default, ShapeElement_default, HierarchyElement_default, FrameElement_default, RenderableDOMElement_default], SVGShapeElement);
SVGShapeElement.prototype.initSecondaryElement = function() {
};
SVGShapeElement.prototype.identityMatrix = new transformation_matrix_default();
SVGShapeElement.prototype.buildExpressionInterface = function() {
};
SVGShapeElement.prototype.createContent = function() {
  this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], true);
  this.filterUniqueShapes();
};
SVGShapeElement.prototype.filterUniqueShapes = function() {
  var i;
  var len = this.shapes.length;
  var shape;
  var j;
  var jLen = this.stylesList.length;
  var style;
  var tempShapes = [];
  var areAnimated = false;
  for (j = 0; j < jLen; j += 1) {
    style = this.stylesList[j];
    areAnimated = false;
    tempShapes.length = 0;
    for (i = 0; i < len; i += 1) {
      shape = this.shapes[i];
      if (shape.styles.indexOf(style) !== -1) {
        tempShapes.push(shape);
        areAnimated = shape._isAnimated || areAnimated;
      }
    }
    if (tempShapes.length > 1 && areAnimated) {
      this.setShapesAsAnimated(tempShapes);
    }
  }
};
SVGShapeElement.prototype.setShapesAsAnimated = function(shapes) {
  var i;
  var len = shapes.length;
  for (i = 0; i < len; i += 1) {
    shapes[i].setAsAnimated();
  }
};
SVGShapeElement.prototype.createStyleElement = function(data, level) {
  var elementData;
  var styleOb = new SVGStyleData_default(data, level);
  var pathElement = styleOb.pElem;
  if (data.ty === "st") {
    elementData = new SVGStrokeStyleData_default(this, data, styleOb);
  } else if (data.ty === "fl") {
    elementData = new SVGFillStyleData_default(this, data, styleOb);
  } else if (data.ty === "gf" || data.ty === "gs") {
    var GradientConstructor = data.ty === "gf" ? SVGGradientFillStyleData_default : SVGGradientStrokeStyleData_default;
    elementData = new GradientConstructor(this, data, styleOb);
    this.globalData.defs.appendChild(elementData.gf);
    if (elementData.maskId) {
      this.globalData.defs.appendChild(elementData.ms);
      this.globalData.defs.appendChild(elementData.of);
      pathElement.setAttribute("mask", "url(" + getLocationHref() + "#" + elementData.maskId + ")");
    }
  } else if (data.ty === "no") {
    elementData = new SVGNoStyleData_default(this, data, styleOb);
  }
  if (data.ty === "st" || data.ty === "gs") {
    pathElement.setAttribute("stroke-linecap", lineCapEnum[data.lc || 2]);
    pathElement.setAttribute("stroke-linejoin", lineJoinEnum[data.lj || 2]);
    pathElement.setAttribute("fill-opacity", "0");
    if (data.lj === 1) {
      pathElement.setAttribute("stroke-miterlimit", data.ml);
    }
  }
  if (data.r === 2) {
    pathElement.setAttribute("fill-rule", "evenodd");
  }
  if (data.ln) {
    pathElement.setAttribute("id", data.ln);
  }
  if (data.cl) {
    pathElement.setAttribute("class", data.cl);
  }
  if (data.bm) {
    pathElement.style["mix-blend-mode"] = blendModes_default(data.bm);
  }
  this.stylesList.push(styleOb);
  this.addToAnimatedContents(data, elementData);
  return elementData;
};
SVGShapeElement.prototype.createGroupElement = function(data) {
  var elementData = new ShapeGroupData_default();
  if (data.ln) {
    elementData.gr.setAttribute("id", data.ln);
  }
  if (data.cl) {
    elementData.gr.setAttribute("class", data.cl);
  }
  if (data.bm) {
    elementData.gr.style["mix-blend-mode"] = blendModes_default(data.bm);
  }
  return elementData;
};
SVGShapeElement.prototype.createTransformElement = function(data, container) {
  var transformProperty = TransformProperty_default.getTransformProperty(this, data, this);
  var elementData = new SVGTransformData_default(transformProperty, transformProperty.o, container);
  this.addToAnimatedContents(data, elementData);
  return elementData;
};
SVGShapeElement.prototype.createShapeElement = function(data, ownTransformers, level) {
  var ty = 4;
  if (data.ty === "rc") {
    ty = 5;
  } else if (data.ty === "el") {
    ty = 6;
  } else if (data.ty === "sr") {
    ty = 7;
  }
  var shapeProperty = ShapeProperty_default.getShapeProp(this, data, ty, this);
  var elementData = new SVGShapeData_default(ownTransformers, level, shapeProperty);
  this.shapes.push(elementData);
  this.addShapeToModifiers(elementData);
  this.addToAnimatedContents(data, elementData);
  return elementData;
};
SVGShapeElement.prototype.addToAnimatedContents = function(data, element) {
  var i = 0;
  var len = this.animatedContents.length;
  while (i < len) {
    if (this.animatedContents[i].element === element) {
      return;
    }
    i += 1;
  }
  this.animatedContents.push({
    fn: SVGElementsRenderer_default.createRenderFunction(data),
    element,
    data
  });
};
SVGShapeElement.prototype.setElementStyles = function(elementData) {
  var arr = elementData.styles;
  var j;
  var jLen = this.stylesList.length;
  for (j = 0; j < jLen; j += 1) {
    if (arr.indexOf(this.stylesList[j]) === -1 && !this.stylesList[j].closed) {
      arr.push(this.stylesList[j]);
    }
  }
};
SVGShapeElement.prototype.reloadShapes = function() {
  this._isFirstFrame = true;
  var i;
  var len = this.itemsData.length;
  for (i = 0; i < len; i += 1) {
    this.prevViewData[i] = this.itemsData[i];
  }
  this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], true);
  this.filterUniqueShapes();
  len = this.dynamicProperties.length;
  for (i = 0; i < len; i += 1) {
    this.dynamicProperties[i].getValue();
  }
  this.renderModifiers();
};
SVGShapeElement.prototype.searchShapes = function(arr, itemsData, prevViewData, container, level, transformers, render) {
  var ownTransformers = [].concat(transformers);
  var i;
  var len = arr.length - 1;
  var j;
  var jLen;
  var ownStyles = [];
  var ownModifiers = [];
  var currentTransform;
  var modifier;
  var processedPos;
  for (i = len; i >= 0; i -= 1) {
    processedPos = this.searchProcessedElement(arr[i]);
    if (!processedPos) {
      arr[i]._render = render;
    } else {
      itemsData[i] = prevViewData[processedPos - 1];
    }
    if (arr[i].ty === "fl" || arr[i].ty === "st" || arr[i].ty === "gf" || arr[i].ty === "gs" || arr[i].ty === "no") {
      if (!processedPos) {
        itemsData[i] = this.createStyleElement(arr[i], level);
      } else {
        itemsData[i].style.closed = arr[i].hd;
      }
      if (arr[i]._render) {
        if (itemsData[i].style.pElem.parentNode !== container) {
          container.appendChild(itemsData[i].style.pElem);
        }
      }
      ownStyles.push(itemsData[i].style);
    } else if (arr[i].ty === "gr") {
      if (!processedPos) {
        itemsData[i] = this.createGroupElement(arr[i]);
      } else {
        jLen = itemsData[i].it.length;
        for (j = 0; j < jLen; j += 1) {
          itemsData[i].prevViewData[j] = itemsData[i].it[j];
        }
      }
      this.searchShapes(arr[i].it, itemsData[i].it, itemsData[i].prevViewData, itemsData[i].gr, level + 1, ownTransformers, render);
      if (arr[i]._render) {
        if (itemsData[i].gr.parentNode !== container) {
          container.appendChild(itemsData[i].gr);
        }
      }
    } else if (arr[i].ty === "tr") {
      if (!processedPos) {
        itemsData[i] = this.createTransformElement(arr[i], container);
      }
      currentTransform = itemsData[i].transform;
      ownTransformers.push(currentTransform);
    } else if (arr[i].ty === "sh" || arr[i].ty === "rc" || arr[i].ty === "el" || arr[i].ty === "sr") {
      if (!processedPos) {
        itemsData[i] = this.createShapeElement(arr[i], ownTransformers, level);
      }
      this.setElementStyles(itemsData[i]);
    } else if (arr[i].ty === "tm" || arr[i].ty === "rd" || arr[i].ty === "ms" || arr[i].ty === "pb" || arr[i].ty === "zz" || arr[i].ty === "op") {
      if (!processedPos) {
        modifier = ShapeModifiers.getModifier(arr[i].ty);
        modifier.init(this, arr[i]);
        itemsData[i] = modifier;
        this.shapeModifiers.push(modifier);
      } else {
        modifier = itemsData[i];
        modifier.closed = false;
      }
      ownModifiers.push(modifier);
    } else if (arr[i].ty === "rp") {
      if (!processedPos) {
        modifier = ShapeModifiers.getModifier(arr[i].ty);
        itemsData[i] = modifier;
        modifier.init(this, arr, i, itemsData);
        this.shapeModifiers.push(modifier);
        render = false;
      } else {
        modifier = itemsData[i];
        modifier.closed = true;
      }
      ownModifiers.push(modifier);
    }
    this.addProcessedElement(arr[i], i + 1);
  }
  len = ownStyles.length;
  for (i = 0; i < len; i += 1) {
    ownStyles[i].closed = true;
  }
  len = ownModifiers.length;
  for (i = 0; i < len; i += 1) {
    ownModifiers[i].closed = true;
  }
};
SVGShapeElement.prototype.renderInnerContent = function() {
  this.renderModifiers();
  var i;
  var len = this.stylesList.length;
  for (i = 0; i < len; i += 1) {
    this.stylesList[i].reset();
  }
  this.renderShape();
  for (i = 0; i < len; i += 1) {
    if (this.stylesList[i]._mdf || this._isFirstFrame) {
      if (this.stylesList[i].msElem) {
        this.stylesList[i].msElem.setAttribute("d", this.stylesList[i].d);
        this.stylesList[i].d = "M0 0" + this.stylesList[i].d;
      }
      this.stylesList[i].pElem.setAttribute("d", this.stylesList[i].d || "M0 0");
    }
  }
};
SVGShapeElement.prototype.renderShape = function() {
  var i;
  var len = this.animatedContents.length;
  var animatedContent;
  for (i = 0; i < len; i += 1) {
    animatedContent = this.animatedContents[i];
    if ((this._isFirstFrame || animatedContent.element._isAnimated) && animatedContent.data !== true) {
      animatedContent.fn(animatedContent.data, animatedContent.element, this._isFirstFrame);
    }
  }
};
SVGShapeElement.prototype.destroy = function() {
  this.destroyBaseElement();
  this.shapesData = null;
  this.itemsData = null;
};
var SVGShapeElement_default = SVGShapeElement;

// src/elements/SolidElement.js
function ISolidElement(data, globalData, comp) {
  this.initElement(data, globalData, comp);
}
extendPrototype([ImageElement_default], ISolidElement);
ISolidElement.prototype.createContent = function() {
  var rect = svg_elements_default("rect");
  rect.setAttribute("width", this.data.sw);
  rect.setAttribute("height", this.data.sh);
  rect.setAttribute("fill", this.data.sc);
  this.layerElement.appendChild(rect);
};
var SolidElement_default = ISolidElement;

// src/elements/NullElement.js
function NullElement(data, globalData, comp) {
  this.initFrame();
  this.initBaseData(data, globalData, comp);
  this.initFrame();
  this.initTransform(data, globalData, comp);
  this.initHierarchy();
}
NullElement.prototype.prepareFrame = function(num) {
  this.prepareProperties(num, true);
};
NullElement.prototype.renderFrame = function() {
};
NullElement.prototype.getBaseElement = function() {
  return null;
};
NullElement.prototype.destroy = function() {
};
NullElement.prototype.sourceRectAtTime = function() {
};
NullElement.prototype.hide = function() {
};
extendPrototype([BaseElement_default, TransformElement_default, HierarchyElement_default, FrameElement_default], NullElement);
var NullElement_default = NullElement;

// src/renderers/SVGRendererBase.js
function SVGRendererBase() {
}
extendPrototype([BaseRenderer_default], SVGRendererBase);
SVGRendererBase.prototype.createNull = function(data) {
  return new NullElement_default(data, this.globalData, this);
};
SVGRendererBase.prototype.createShape = function(data) {
  return new SVGShapeElement_default(data, this.globalData, this);
};
SVGRendererBase.prototype.createImage = function(data) {
  return new ImageElement_default(data, this.globalData, this);
};
SVGRendererBase.prototype.createSolid = function(data) {
  return new SolidElement_default(data, this.globalData, this);
};
SVGRendererBase.prototype.configAnimation = function(animData) {
  this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  this.svgElement.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  if (this.renderConfig.viewBoxSize) {
    this.svgElement.setAttribute("viewBox", this.renderConfig.viewBoxSize);
  } else {
    this.svgElement.setAttribute("viewBox", "0 0 " + animData.w + " " + animData.h);
  }
  if (!this.renderConfig.viewBoxOnly) {
    this.svgElement.setAttribute("width", animData.w);
    this.svgElement.setAttribute("height", animData.h);
    this.svgElement.style.width = "100%";
    this.svgElement.style.height = "100%";
    this.svgElement.style.transform = "translate3d(0,0,0)";
    this.svgElement.style.contentVisibility = this.renderConfig.contentVisibility;
  }
  if (this.renderConfig.width) {
    this.svgElement.setAttribute("width", this.renderConfig.width);
  }
  if (this.renderConfig.height) {
    this.svgElement.setAttribute("height", this.renderConfig.height);
  }
  if (this.renderConfig.className) {
    this.svgElement.setAttribute("class", this.renderConfig.className);
  }
  if (this.renderConfig.id) {
    this.svgElement.setAttribute("id", this.renderConfig.id);
  }
  if (this.renderConfig.focusable !== void 0) {
    this.svgElement.setAttribute("focusable", this.renderConfig.focusable);
  }
  this.svgElement.setAttribute("preserveAspectRatio", this.renderConfig.preserveAspectRatio);
  this.animationItem.wrapper.appendChild(this.svgElement);
  var defs = this.globalData.defs;
  this.setupGlobalData(animData, defs);
  this.globalData.progressiveLoad = this.renderConfig.progressiveLoad;
  this.data = animData;
  var maskElement = svg_elements_default("clipPath");
  var rect = svg_elements_default("rect");
  rect.setAttribute("width", animData.w);
  rect.setAttribute("height", animData.h);
  rect.setAttribute("x", 0);
  rect.setAttribute("y", 0);
  var maskId = createElementID();
  maskElement.setAttribute("id", maskId);
  maskElement.appendChild(rect);
  this.layerElement.setAttribute("clip-path", "url(" + getLocationHref() + "#" + maskId + ")");
  defs.appendChild(maskElement);
  this.layers = animData.layers;
  this.elements = createSizedArray(animData.layers.length);
};
SVGRendererBase.prototype.destroy = function() {
  if (this.animationItem.wrapper) {
    this.animationItem.wrapper.innerText = "";
  }
  this.layerElement = null;
  this.globalData.defs = null;
  var i;
  var len = this.layers ? this.layers.length : 0;
  for (i = 0; i < len; i += 1) {
    if (this.elements[i] && this.elements[i].destroy) {
      this.elements[i].destroy();
    }
  }
  this.elements.length = 0;
  this.destroyed = true;
  this.animationItem = null;
};
SVGRendererBase.prototype.updateContainerSize = function() {
};
SVGRendererBase.prototype.findIndexByInd = function(ind) {
  var i = 0;
  var len = this.layers.length;
  for (i = 0; i < len; i += 1) {
    if (this.layers[i].ind === ind) {
      return i;
    }
  }
  return -1;
};
SVGRendererBase.prototype.buildItem = function(pos) {
  var elements = this.elements;
  if (elements[pos] || this.layers[pos].ty === 99) {
    return;
  }
  elements[pos] = true;
  var element = this.createItem(this.layers[pos]);
  elements[pos] = element;
  if (getExpressionsPlugin()) {
    if (this.layers[pos].ty === 0) {
      this.globalData.projectInterface.registerComposition(element);
    }
    element.initExpressions();
  }
  this.appendElementInPos(element, pos);
  if (this.layers[pos].tt) {
    var elementIndex = "tp" in this.layers[pos] ? this.findIndexByInd(this.layers[pos].tp) : pos - 1;
    if (elementIndex === -1) {
      return;
    }
    if (!this.elements[elementIndex] || this.elements[elementIndex] === true) {
      this.buildItem(elementIndex);
      this.addPendingElement(element);
    } else {
      var matteElement = elements[elementIndex];
      var matteMask = matteElement.getMatte(this.layers[pos].tt);
      element.setMatte(matteMask);
    }
  }
};
SVGRendererBase.prototype.checkPendingElements = function() {
  while (this.pendingElements.length) {
    var element = this.pendingElements.pop();
    element.checkParenting();
    if (element.data.tt) {
      var i = 0;
      var len = this.elements.length;
      while (i < len) {
        if (this.elements[i] === element) {
          var elementIndex = "tp" in element.data ? this.findIndexByInd(element.data.tp) : i - 1;
          var matteElement = this.elements[elementIndex];
          var matteMask = matteElement.getMatte(this.layers[i].tt);
          element.setMatte(matteMask);
          break;
        }
        i += 1;
      }
    }
  }
};
SVGRendererBase.prototype.renderFrame = function(num) {
  if (this.renderedFrame === num || this.destroyed) {
    return;
  }
  if (num === null) {
    num = this.renderedFrame;
  } else {
    this.renderedFrame = num;
  }
  this.globalData.frameNum = num;
  this.globalData.frameId += 1;
  this.globalData.projectInterface.currentFrame = num;
  this.globalData._mdf = false;
  var i;
  var len = this.layers.length;
  if (!this.completeLayers) {
    this.checkLayers(num);
  }
  for (i = len - 1; i >= 0; i -= 1) {
    if (this.completeLayers || this.elements[i]) {
      this.elements[i].prepareFrame(num - this.layers[i].st);
    }
  }
  if (this.globalData._mdf) {
    for (i = 0; i < len; i += 1) {
      if (this.completeLayers || this.elements[i]) {
        this.elements[i].renderFrame();
      }
    }
  }
};
SVGRendererBase.prototype.appendElementInPos = function(element, pos) {
  var newElement = element.getBaseElement();
  if (!newElement) {
    return;
  }
  var i = 0;
  var nextElement;
  while (i < pos) {
    if (this.elements[i] && this.elements[i] !== true && this.elements[i].getBaseElement()) {
      nextElement = this.elements[i].getBaseElement();
    }
    i += 1;
  }
  if (nextElement) {
    this.layerElement.insertBefore(newElement, nextElement);
  } else {
    this.layerElement.appendChild(newElement);
  }
};
SVGRendererBase.prototype.hide = function() {
  this.layerElement.style.display = "none";
};
SVGRendererBase.prototype.show = function() {
  this.layerElement.style.display = "block";
};
var SVGRendererBase_default = SVGRendererBase;

// src/elements/CompElement.js
function ICompElement() {
}
extendPrototype([BaseElement_default, TransformElement_default, HierarchyElement_default, FrameElement_default, RenderableDOMElement_default], ICompElement);
ICompElement.prototype.initElement = function(data, globalData, comp) {
  this.initFrame();
  this.initBaseData(data, globalData, comp);
  this.initTransform(data, globalData, comp);
  this.initRenderable();
  this.initHierarchy();
  this.initRendererElement();
  this.createContainerElements();
  this.createRenderableComponents();
  if (this.data.xt || !globalData.progressiveLoad) {
    this.buildAllItems();
  }
  this.hide();
};
ICompElement.prototype.prepareFrame = function(num) {
  this._mdf = false;
  this.prepareRenderableFrame(num);
  this.prepareProperties(num, this.isInRange);
  if (!this.isInRange && !this.data.xt) {
    return;
  }
  if (!this.tm._placeholder) {
    var timeRemapped = this.tm.v;
    if (timeRemapped === this.data.op) {
      timeRemapped = this.data.op - 1;
    }
    this.renderedFrame = timeRemapped;
  } else {
    this.renderedFrame = num / this.data.sr;
  }
  var i;
  var len = this.elements.length;
  if (!this.completeLayers) {
    this.checkLayers(this.renderedFrame);
  }
  for (i = len - 1; i >= 0; i -= 1) {
    if (this.completeLayers || this.elements[i]) {
      this.elements[i].prepareFrame(this.renderedFrame - this.layers[i].st);
      if (this.elements[i]._mdf) {
        this._mdf = true;
      }
    }
  }
};
ICompElement.prototype.renderInnerContent = function() {
  var i;
  var len = this.layers.length;
  for (i = 0; i < len; i += 1) {
    if (this.completeLayers || this.elements[i]) {
      this.elements[i].renderFrame();
    }
  }
};
ICompElement.prototype.setElements = function(elems) {
  this.elements = elems;
};
ICompElement.prototype.getElements = function() {
  return this.elements;
};
ICompElement.prototype.destroyElements = function() {
  var i;
  var len = this.layers.length;
  for (i = 0; i < len; i += 1) {
    if (this.elements[i]) {
      this.elements[i].destroy();
    }
  }
};
ICompElement.prototype.destroy = function() {
  this.destroyElements();
  this.destroyBaseElement();
};
var CompElement_default = ICompElement;

// src/elements/svgElements/SVGCompElement.js
function SVGCompElement(data, globalData, comp) {
  this.layers = data.layers;
  this.supports3d = true;
  this.completeLayers = false;
  this.pendingElements = [];
  this.elements = this.layers ? createSizedArray(this.layers.length) : [];
  this.initElement(data, globalData, comp);
  this.tm = data.tm ? PropertyFactory_default.getProp(this, data.tm, 0, globalData.frameRate, this) : { _placeholder: true };
}
extendPrototype([SVGRendererBase_default, CompElement_default, SVGBaseElement_default], SVGCompElement);
SVGCompElement.prototype.createComp = function(data) {
  return new SVGCompElement(data, this.globalData, this);
};
var SVGCompElement_default = SVGCompElement;

// src/renderers/SVGRenderer.js
function SVGRenderer(animationItem, config) {
  this.animationItem = animationItem;
  this.layers = null;
  this.renderedFrame = -1;
  this.svgElement = svg_elements_default("svg");
  var ariaLabel = "";
  if (config && config.title) {
    var titleElement = svg_elements_default("title");
    var titleId = createElementID();
    titleElement.setAttribute("id", titleId);
    titleElement.textContent = config.title;
    this.svgElement.appendChild(titleElement);
    ariaLabel += titleId;
  }
  if (config && config.description) {
    var descElement = svg_elements_default("desc");
    var descId = createElementID();
    descElement.setAttribute("id", descId);
    descElement.textContent = config.description;
    this.svgElement.appendChild(descElement);
    ariaLabel += " " + descId;
  }
  if (ariaLabel) {
    this.svgElement.setAttribute("aria-labelledby", ariaLabel);
  }
  var defs = svg_elements_default("defs");
  this.svgElement.appendChild(defs);
  var maskElement = svg_elements_default("g");
  this.svgElement.appendChild(maskElement);
  this.layerElement = maskElement;
  this.renderConfig = {
    preserveAspectRatio: config && config.preserveAspectRatio || "xMidYMid meet",
    imagePreserveAspectRatio: config && config.imagePreserveAspectRatio || "xMidYMid slice",
    contentVisibility: config && config.contentVisibility || "visible",
    progressiveLoad: config && config.progressiveLoad || false,
    hideOnTransparent: !(config && config.hideOnTransparent === false),
    viewBoxOnly: config && config.viewBoxOnly || false,
    viewBoxSize: config && config.viewBoxSize || false,
    className: config && config.className || "",
    id: config && config.id || "",
    focusable: config && config.focusable,
    filterSize: {
      width: config && config.filterSize && config.filterSize.width || "100%",
      height: config && config.filterSize && config.filterSize.height || "100%",
      x: config && config.filterSize && config.filterSize.x || "0%",
      y: config && config.filterSize && config.filterSize.y || "0%"
    },
    width: config && config.width,
    height: config && config.height,
    runExpressions: !config || config.runExpressions === void 0 || config.runExpressions
  };
  this.globalData = {
    _mdf: false,
    frameNum: -1,
    defs,
    renderConfig: this.renderConfig
  };
  this.elements = [];
  this.pendingElements = [];
  this.destroyed = false;
  this.rendererType = "svg";
}
extendPrototype([SVGRendererBase_default], SVGRenderer);
SVGRenderer.prototype.createComp = function(data) {
  return new SVGCompElement_default(data, this.globalData, this);
};
var SVGRenderer_default = SVGRenderer;

// src/modules/svg_xs.js
registerRenderer("svg", SVGRenderer_default);
ShapeModifiers.registerModifier("tm", TrimModifier_default);
var svg_xs_default = main_default;
export {
  svg_xs_default as default
};
/*!
 Transformation Matrix v2.0
 (c) Epistemex 2014-2015
 www.epistemex.com
 By Ken Fyrstenberg
 Contributions by leeoniya.
 License: MIT, header required.
 */
