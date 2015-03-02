/**
 * Creates an overlay over the original Walkontable instance. The overlay renders the clone of the original Walkontable
 * and (optionally) implements behavior needed for native horizontal and vertical scrolling
 */
function WalkontableOverlay() {}

/*
 Possible optimizations:
 [x] don't rerender if scroll delta is smaller than the fragment outside of the viewport
 [ ] move .style.top change before .draw()
 [ ] put .draw() in requestAnimationFrame
 [ ] don't rerender rows that remain visible after the scroll
 */

WalkontableOverlay.prototype.init = function () {
  this.TABLE = this.instance.wtTable.TABLE;
  this.hider = this.instance.wtTable.hider;
  this.spreader = this.instance.wtTable.spreader;
  this.holder = this.instance.wtTable.holder;
  this.wtRootElement = this.instance.wtTable.wtRootElement;
  this.trimmingContainer = this.getTrimmingContainer(this.hider.parentNode.parentNode);
  this.mainTableScrollableElement = Handsontable.Dom.getScrollableElement(this.instance.wtTable.TABLE);
};

WalkontableOverlay.prototype.makeClone = function (direction) {
  var clone = document.createElement('DIV');
  clone.className = 'ht_clone_' + direction + ' handsontable';
  clone.style.position = 'absolute';
  clone.style.top = 0;
  clone.style.left = 0;
  clone.style.overflow = 'hidden';

  var clonedTable = document.createElement('TABLE');
  clonedTable.className = this.instance.wtTable.TABLE.className;
  clone.appendChild(clonedTable);

  this.instance.wtTable.wtRootElement.parentNode.appendChild(clone);

  return new Walkontable({
    cloneSource: this.instance,
    cloneOverlay: this,
    table: clonedTable
  });
};

WalkontableOverlay.prototype.getTrimmingContainer = function (base) {
  var el = base.parentNode;
  while (el && el.style && document.body !== el) {
    if (el.style.overflow !== 'visible' && el.style.overflow !== '') {
      return el;
    } else if(window.getComputedStyle) {
      var computedStyle = window.getComputedStyle(el);
      if(computedStyle.getPropertyValue('overflow') !== 'visible' && computedStyle.getPropertyValue('overflow') !== '') {
        return el;
      }
    }

    if (this instanceof WalkontableTopOverlay && el.style.overflowX !== 'visible' && el.style.overflowX !== '') {
      return el;
    }
    el = el.parentNode;
  }
  return window;
};

//WalkontableOverlay.prototype.getTrimmingContainer = function (masterTable) {
//  var el = masterTable;
//  while (el && el.style && document.body !== el) {
//    if (el.style.overflow !== 'visible' && el.style.overflow !== '') {
//      return el;
//    } else if(window.getComputedStyle) {
//      var computedStyle = window.getComputedStyle(el);
//      if(computedStyle.getPropertyValue('overflow') !== 'visible' && computedStyle.getPropertyValue('overflow') !== '') {
//        return el;
//      }
//    }
//
//    if (this instanceof WalkontableVerticalOverlay && el.style.overflowX !== 'visible' && el.style.overflowX !== '') {
//      return el;
//    }
//    el = el.parentNode;
//  }
//  return window;
//};

WalkontableOverlay.prototype.refresh = function (fastDraw) {
  if (this.clone) {
    this.clone.draw(fastDraw);
  }
};

WalkontableOverlay.prototype.destroy = function () {
  var eventManager = Handsontable.eventManager(this.clone);

  eventManager.clear();
};
