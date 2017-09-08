const DOMNodeCollection = require('./dom_node_collection.js');

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
