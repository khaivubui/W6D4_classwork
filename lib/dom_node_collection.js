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
