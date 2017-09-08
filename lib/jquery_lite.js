/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

window.$l = function (input) {
    if (typeof input === 'string') {
      return new DOMNodeCollection(
        Array.from(document.querySelectorAll(input))
      );
    } else if (input instanceof HTMLElement) {
      return new DOMNodeCollection(
        [input]
      );
    } else if (input instanceof Function) {
      document.addEventListener('DOMContentLoaded', input);
    }

};

window.$l.extend = function (obj1, ...otherObjs) {
  otherObjs.forEach((otherObj) => {
    Object.keys(otherObj).forEach((key) => {
      obj1[key] = otherObj[key];
    });
  });
  return obj1;
};



window.$l.ajax = function (options) {
  const defaultObjects = {
    method: 'GET',
    success: () => {},
    data: {}
  };
  window.$l.extend(defaultObjects, options);

  const xhr = new XMLHttpRequest();
  xhr.open(options.method, options.url);
  xhr.onload = options.success;
  xhr.send(options.data);
};

window.$l(() => {
  window.$l.ajax({
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    method: 'GET',
    success: function (res) {
      alert('wjatever i want');
    }
  });


});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(htmlElArr) {
    this.htmlElArr = htmlElArr; // an array of regular HTMLNode
  }

  html (value) {
    if (value) {
      return this.htmlElArr.forEach((el) => {
        el.innerHTML = value;
      });
    } else {
      return this.htmlElArr[0].innerHTML;
    }
  }

  empty () {
    this.htmlElArr.forEach((el) => {
      el.innerHTML = '';
    });
  }

  append (arg) {
    if (arg instanceof DOMNodeCollection) {
      this.htmlElArr.forEach((el) => {
        arg.htmlElArr.forEach((childEl) => {
          el.appendChild(childEl);
        });
      });
    } else if (typeof arg === 'string') {
      this.htmlElArr.forEach((el) => {
        el.innerHTML = arg;
      });
    } else { // html element
      this.htmlElArr.forEach((el) => {
        el.appendChild(arg);
      });
    }
  }

  attr(attrName, value) {
    if (value) {
      // setter
      this.htmlElArr.forEach((el) => {
        el.setAttribute(attrName, value);
      });
      // this.htmlElArr[0].setAttribute(attrName, value);
    } else {
      // getter
      return this.htmlElArr[0].getAttribute(attrName);
    }
  }

  addClass (className) {
    this.htmlElArr.forEach((el) => {
      const currentClass = el.className; // '1'
      if (!currentClass.includes(` ${className} `)) {
        el.className = currentClass + ` ${className}`;
      }
    });
  }

  removeClass (className) {
    this.htmlElArr.forEach((el) => {
      const currentClass = el.className;
      const classArr = currentClass.split(' ');
      classArr.forEach((el2, index) => {
        if (el2 === className) {
          classArr.splice(index, 1);
        }
      });
    });
  }

  children(){
    let results = [];
    let children = Array.from(this.htmlElArr[0].children);
    children.forEach((el) => {
      results.push(new DOMNodeCollection(el));
    });
    return results;
  }

  parent() {
    const parentNode = this.htmlElArr[0].parentNode;
    return new DOMNodeCollection(parentNode);
  }

  find (selector) {
    const nodes = this.htmlElArr[0].querySelectorAll(selector);
    return new DOMNodeCollection(nodes);
  }

  remove () {
    this.htmlElArr.forEach( el => el.remove());
    this.htmlElArr = [];
  }

  on (event, handleEventCallback) {
    this.htmlElArr.forEach( (el) => {
      el.callbacks = el.callbacks || {};
      el.callbacks[event] = handleEventCallback;
      el.addEventListener(event,el.callbacks[event]);
    });
  }

  off (event) {
    this.htmlElArr.forEach( (el) => {
      el.removeEventListener(event, el.callbacks[event]);
    });
  }
}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);