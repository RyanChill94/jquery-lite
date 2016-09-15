/**
 * Created by Ryanchill on 2016/8/25.
 */
(function (widow, document) {
    var w = window;
    var doc = document;
    //通过selector生成对象
    var Chill = function (selector) {
        // return doc.querySelector(selector);
        //每次用Chill调用的时候返回一个实例，实现无new调用
        return new Chill.prototype.init(selector);
    };

    Chill.prototype = {
        construct: Chill,
        length: 0,
        splice: [].splice, //Array实例的splice方法
        selector: '',
        init: function (selector) {

            if (!selector) {
                return this;
            }

            if (typeof selector == 'object') {
                var selector = [selector];
                for (var i = 0; i < selector.length; i++) {
                    this[i] = selector[i];
                }

                this.length = selector.length;
                return this;
            } else if (typeof selector == 'function') {
                Chill.ready(selector);
                return;
            }

            var nSelector = selector.trim();
            var elem;

            //id
            if (nSelector.charAt(0) == '#' && !selector.match('\\s')) {
                nSelector = nSelector.substring(1);
                this.selector = selector;
                elem = doc.getElementById('selector');

                //保存到对象上
                this.selector = nSelector;
                this[0] = elem;
                this.length = 1;
                return this;
            } else {

                elem = doc.querySelectorAll(selector);
                for (var i = 0; i < elem.length; i++) {
                    this[i] = elem[i];
                }
                this.length = elem.length;
                return this;
            }
        },

        css: function (attr, val) {
            console.log(this.length);
            for (var i = 0; i < this.length; i++) {
                //一个参数的时候返回值
                if (arguments.length === 1) {
                    return getComputedStyle(this[i], null)[attr]
                }

            }

        },
        hasClass: function (cls) {
            //如有是一个元素判断有没有这个类名 否则遍历所有元素
            if (this[0].classList) {
                for (var i = this.length - 1; i >= 0; i--) {
                    if (this[i].classList.contains(cls)) {
                        return true;
                    }
                }
                return false;
            } else {

                var reg = new RegExp('(\s|^)' + cls + '(\s|$)');
                for (var i = this.length - 1; i >= 0; i--) {
                    //!!快速转成boolean
                    return !!this[i].className.match(reg);

                }
            }
            return this;
        },

        addClass: function (cls) {
            if (this[0].classList) {
                for (var i = this.length - 1; i >= 0; i--) {
                    if (this[i].classList.contains(cls)) {
                        continue;
                    }
                    this[i].classList.add(cls);
                }
            } else {
                var reg = new RegExp('(\s|^)' + cls + '(\s|$)');
                for (var i = this.length - 1; i >= 0; i--) {
                    if (!this[i].className.match(reg)) {
                        this[i].className += ' ' + cls;
                    }
                }

            }

            return this;

        },

        removeClass: function (cls) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            for (var i = 0; i < this.length; i++) {
                if (this[i].className.match(reg)) {
                    this[i].className = this[i].className.replace(cls, '');
                }
            }
            return this;
        },

        find:function(){

        },
        first:function(){

        },
        last:function(){

        },
        eq:function(){

        },
        next: function () {
            return sibling(this[0], 'nextSibling');
        },
        prev: function () {
            return sibling(this[0], 'previousSibling')
        },
        parent: function () {
            var parent = this[0].parentNode;
            //nodeType = 11 -->DocumentFragment
            parent && parent.nodeType !== 11 ? parent : null;

            //构造一个父级对象
            var a = Chill();
            a[0] = parent;
            a.selector = parent.tagName.toLocaleLowerCase();
            a.length = 1;

            return a;
        },
        parents: function () {
            var a = Chill();
            var i = 0;
            // nodeType == 9 ---> document  1-->elem
            while ((this[0] = (this[0]['parentNode'])) && this[0].nodeType !== 9) {
                if (this[0].nodeType === 1) {
                    a[i] = this[0];
                    i++;
                }
            }
            a.length = i;
            return a;
        }


    };

    // 可以先把init保存起来
    //init的引入是拓展 $.extend 和 $.fn.extend 方法是为了统一接口 但是不引入无关的factory方法
    //为了可以调用静态方法
    Chill.prototype.init.prototype = Chill.prototype;

    //静态方法
    Chill.ajax = function () {
        //挂载ajax方法

        console.log(this);
    };
    Chill.ready = function (fn) {
        doc.addEventListener('DOMContentLoaded', function () {
            fn && fn();
        }, false);

        //简单处理
        doc.removeEventListener('DOMContentLoaded', fn, true);
    };

    //jquery中 each 可以遍历的类型 1.数组 2.对象数组
    Chill.each = function (obj, cb) {
        var len = obj.length,
            construct = obj.constructor,
            i = 0;

        //判断是否是rc数组对象
        if (construct === w.rc) {
            for (; i < len; i++) {
                //this指向 index elem
                var val = cb.call(obj[i], i, obj[i]);
                //函数的返回值为false
                if (val === false) {
                    break;
                }
            }
        } else if (isArray(obj)) {
            for (; i < len; i++) {
                var val = cb.call(obj[i], i, obj[i]);
                if (val === false) break;
            }
        } else {
            for (var i in obj) {
                var val = cb(obj[i], i, obj[i]);
                if (val === false) break;
            }
        }
    };

    function sibling(currentNode, find) {
        //直到遇到第一个elem的对象或者没找到 返回这个对象
        while ((currentNode = currentNode[find]) && currentNode.nodeType !== 1) {
            return currentNode;
        }
    }

    function isArray(obj) {
        return Array.isArray(obj) || Object.prototype.toString.call(obj) === '[object Array]';
    }

    //未处理冲突 暴露接口给外部使用
    w.rc = Chill;

})(window, document);
