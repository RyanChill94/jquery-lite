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
                selector = [selector];
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

        //传入的如果是一个对象
        css: function (attr, val) {
            //console.log(this.length);
            for (var i = 0; i < this.length; i++) {

                if (typeof attr === 'string') {
                    //read
                    if (arguments.length === 1) {
                        return getComputedStyle(this[i], null)[attr]
                    }
                    //write
                    this[i].style[attr] = val;
                } else {
                    var _this = this[i];
                    w.rc.each(function (attr, val) {
                        _this.style.cssText += '' + attr + ":" + val + ';';
                    })
                }
            }

            return this;

        },

        html: function (value) {
            if (!value && this[0].nodeType === 1) {
                return this[0].innerHTML;
            } else {
                for (var i = 0; i < this.length; i++) {
                    this[i].innerHTML = value;
                }
            }
        },

        text: function (value) {
            if (!value && this[0].nodeType === 1) {
                return this[0].innerText;
            } else {
                for (var i = 0; i < this.length; i++) {
                    this[i].innerText = value;
                }
            }
        },

        /**
         * dom 操作方法
         *
         * */
        append: function (str) {
            for (var i = 0; i < this.length; i++) {
                domAppend(this[i], 'beforeEnd', str);
            }
            return this;
        },
        before: function (str) {
            for (var i = 0; i < this.length; i++) {
                domAppend(this[i], 'beforeBegin', str);
            }

            return this;
        },
        after: function (str) {
            for (var i = 0; i < this.length; i++) {
                domAppend(this[i], 'afterEnd', str);
            }
            return this;
        },
        insert: function (str) {
            for (var i = 0; i < this.length; i++) {
                domAppend(this[i], 'afterBegin', str);
            }
            return this;
        },
        remove: function () {
            for (var i = 0; i < this.length; i++) {
                this[i].parentNode.removeChild(this[i]);
            }
            return this;
        },
        attr: function (attr, val) {
            for (var i = 0; i < this.length; i++) {
                //上下文是一个对象的时候会只会返回第一个的属性
                if (typeof attr === 'string') {
                    if (arguments.length == 1) {
                        return this[0].getAttribute(attr);
                    }
                    this[i].setAttribute(attr, val);
                } else {
                    //只传入一个对象
                    var _this = this[i];
                    w.rc.each(attr, function (attr, val) {
                        _this.setAttribute(attr, val);
                    })

                }
            }
            return this;
        }
        ,
        data: function (attr, val) {
            for (var i = 0; i < this.length; i++) {
                //上下文是一个对象的时候会只会返回第一个的属性
                if (typeof attr === 'string') {
                    if (arguments.length == 1) {
                        return this[0].getAttribute('data-' + attr);
                    }
                    this[i].setAttribute('data-' + attr, val);
                } else {
                    //只传入一个对象
                    var _this = this[i];
                    w.rc.each(attr, function (attr, val) {
                        _this.setAttribute('data-' + attr, val);
                    })

                }
            }
            return this;
        }
        ,
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

                    if (this[i].className.match(reg)) {
                        return true;
                    }
                }
                return false;
            }
        }
        ,
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

        }
        ,
        removeClass: function (cls) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            for (var i = 0; i < this.length; i++) {
                if (this[i].className.match(reg)) {
                    this[i].className = this[i].className.replace(cls, '');
                }
            }
            return this;
        }
        ,
        find: function (selector) {
            if (!selector) {
                return;
            }
            var context = this.selector;
            return new Chill(context + ' ' + selector);
        }
        ,
        first: function () {
            return new Chill(this[0]);
        }
        ,
        last: function () {
            var num = this.length - 1;
            return new Chill(this[num]);
        }
        ,
        eq: function (num) {
            // -1 倒数第一个 -2 倒数第二个
            var num = (num < 0 ? this.length - num : num);
            if (num < this.length - 1 && num >= 0) {
                return new Chill(this[num]);
            } else {
                return new Chill(this[0]);
            }
        }
        ,
        get: function () {
            var num = (num < 0 ? this.length - num : num);
            if (num < this.length - 1 && num >= 0) {
                return new this[num];
            } else {
                return new this[0];
            }
        }
        ,
        next: function () {
            return sibling(this[0], 'nextSibling');
        }
        ,
        prev: function () {
            return sibling(this[0], 'previousSibling')
        }
        ,
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
        }
        ,
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
        },

        on: function (type, selector, fn) {
            if (typeof selector == 'function') {
                //只传入两个参数
                fn = selector;
                for (var i = 0; i < this.length; i++) {
                    if (!this[i].guid) {
                        this[i].guid = ++Chill.guid;
                        //如果当前的dom节点不存在标识符，则分配

                        //开辟一个新对象存储 当前dom节点的所有事件
                        Chill.Events[Chill.guid] = {};

                        //同类型事件开辟一个队列
                        Chill.Events[chill.guid][type] = [fn];

                        //绑定事件
                        bind(this[i], type, this[i].guid);

                    } else {
                        //当前标识已经存在，追加事件
                        var id = this[i].guid;
                        if (Chill.Events[id][type]) {
                            Chill.Events[id][type].push(fn);
                        } else {
                            //新事件
                            Chill.Events[id][type] = [fn];
                            bind(this[i], type, this[i].guid);
                        }
                    }
                }
            }
        },

        off: function (type, selector) {
            //没有传参 取消所有事件绑定
            if (arguments.length === 0) {
                for (var i = 0; i < this.length; i++) {
                    var id = this[i].guid;
                    if (id) {
                        for (var ev in Chill.Events[id]) {
                            delete Chill.Events[id][ev];
                        }
                    }
                }
            } else if (arguments.length == 1) {
                //传递一个参数取消绑定指定类型的事件
                for (var i = 0; i < this.length; i++) {
                    var id = this[i].guid;
                    if (id) {
                        delete Chill.Events[guid][type];
                    }
                }
            } else {
                //解除为委托
            }
        }


    };

    // 可以先把init保存起来
    //init的引入是拓展 $.extend 和 $.fn.extend 方法是为了统一接口 但是不引入无关的factory方法
    //为了可以调用静态方法
    Chill.prototype.init.prototype = Chill.prototype;
    Chill.Events = [];
    Chill.guid = 0;

    //静态方法
    Chill.ajax = function (options) {
        //挂载ajax方法
        var defaultOptions = {
            url: "",
            method: "GET",
            date: {},
            async: true,
            success: false,
            error: false
        };

        //覆盖默认参数
        for (var item in defaultOptions) {
            if (options[item] === undefined) {
                options[item] = defaultOptions[item];
            }
        }

        var xhr = new XMLHttpRequest();
        var url = options.url;
        var param = [];

        for (var key in options.data) {
            param.push(key + '=' + options.data[key]);
        }

        var postData = param.join("&");


        if (options.type.toUpperCase() === "POST") {
            xhr.open(options.type, url, options.async);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(options.data);
        } else if (options.type.toUpperCase() === "GET") {
            xhr.open(options.type, url + '?' + postData, options.async);
            xhr.send(null)
        }

        xhr.onreadystatechange = onStateChange;

        function onStateChange() {
            if (xhr.readyState == 4) {
                var result,
                    status = xhr.status;

                if (status >= 200 && status < 300 || status == 304) {
                    result = xhr.responseText;

                    if (window.JSON) {
                        result = JSON.parse(result);
                    } else {
                        result = eval('(' + result + ')');
                    }

                    ajaxSuccess(result, xhr);
                } else {
                    console.log('Error' + status);
                }
            }
        }


        function ajaxSuccess(data, xhr) {
            var status = 'success';
            //成功回调函数
            options.success && options.success(data, options, status, xhr);
            ajaxComplete(status);
        }

        function ajaxComplete(status) {
            options.complete && options.complete(status);
        }


    };

    Chill.get = function (url, successCb, completeCb) {
        var option = {
            url: url,
            success: successCb,
            complete: completeCb
        };

        ajax(option);
    };

    Chill.post = function (url, data, successCb, completeCb) {
        var option = {
            url: url,
            type: 'POST',
            data: data,
            success: successCb,
            complete: completeCb
        };

        ajax(option);
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
        }
        return currentNode;
    }

    function isArray(obj) {
        return Array.isArray(obj) || Object.prototype.toString.call(obj) === '[object Array]';
    }

    //将str解析成html或者XML type： beforebegin-元素前面 afterbegin-元素的第一个子节点前面 beforeend-元素最后一个子节点前面 afterend-元素的后面
    function domAppend(elem, type, str) {
        elem.insertAdjacentHTML(type, str);
    }

    //事件委托
    function delegate(agent, type, selector, fn) {
        agent.addEventListener(type, function (e) {
            var target = e.target;
            var curTarget = e.currentTarget;
            var bubble = true; //是否停止冒泡

            while (bubble && target != curTarget) {
                //判断当前节点时候触发事件
                if (filter(agent, selector, target)) {
                    bubble = fn.call(target, e);
                    return bubble;
                }
                target = target.parentNode;
            }

        }, false);

        //过滤非事件触发点
        function filter(agent, selector, target) {
            var nodes = agent.querySelectorAll(selector);
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i] == target) {
                    return true;
                }
            }
            return false;
        }

        /*
         * 1.有一个储存全局 events 的数组 存放每个 dom 上面的事件
         * 2.每个 dom 上有唯一的标识符，通过这个标识符 guid 来找到Event数组里的事件
         * */

    }

    function bind(dom, type, guid) {
        dom.addEventListener(type, function (e) {
            for (var i = 0; i < Chill.Events[guid][type].length; i++) {
                //一次执行时间队列里面的所有函数
                Chill.Events[guid][type][i].call(dom, e);
            }
        })
    }

    //未处理冲突 暴露接口给外部使用
    w.rc = Chill;

})(window, document);
