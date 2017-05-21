
/**
 * Created by coffee on 20/04/2017.
 */

define(function (require, exports, module) {

    /**
     * Created by coffee on 2016/2/11.
     */
    var URLSearchParams = (function () {
        function URLSearchParams(queryString) {
            this.queryStirng = queryString;
            this.queryDict = {};
            /*this.queryDict = {
             a: [1,2],
             b: ["word"],
             c: ["str"],
             d: ["c1", "c2"]
             };*/
            if (this.queryStirng) {
                this.parse();
            }
        }
        URLSearchParams.prototype.append = function (key, value) {
            if (key !== undefined && value !== undefined) {
                this.queryDict[key].push(value);
            }
        };
        URLSearchParams.prototype.delete = function (key) {
            if (this.queryDict[key]) {
                delete this.queryDict[key];
            }
        };
        URLSearchParams.prototype.entries = function () {
        };
        URLSearchParams.prototype.get = function (key) {
            if (this.queryDict[key] && this.queryDict[key].length >= 1) {
                return this.queryDict[key][0];
            }
            else {
                return null;
            }
        };
        URLSearchParams.prototype.getAll = function (key) {
            if (this.queryDict[key] && this.queryDict[key].length >= 1) {
                return this.queryDict[key];
            }
            else {
                return null;
            }
        };
        URLSearchParams.prototype.set = function (key, value) {
            if (key !== undefined && value !== undefined) {
                this.queryDict[key] = [value];
            }
        };
        URLSearchParams.prototype.has = function (key) {
            return !!(this.queryDict[key] && this.queryDict[key].length >= 1);
        };
        URLSearchParams.prototype.values = function () {
        };
        URLSearchParams.prototype.toString = function () {
            var _this = this;
            var list = [], keys = [];
            keys = Object.keys(this.queryDict);
            keys.forEach(function (key) {
                _this.queryDict[key].forEach(function (value, i) {
                    list.push(key + "=" + value);
                });
            });
            return list.join("&");
        };
        URLSearchParams.prototype.parse = function () {
            var _this = this;
            this.queryDict = {};
            this.queryStirng.split("&").forEach(function (ele, i) {
                var tmpList = _this.split2(ele, "=", 1);
                if (tmpList.length === 2) {
                    if (!_this.queryDict[tmpList[0]]) {
                        _this.queryDict[tmpList[0]] = [];
                    }
                    _this.queryDict[tmpList[0]].push(tmpList[1]);
                }
            });
        };
        URLSearchParams.prototype.split2 = function (string, splitString, count) {
            if (string.indexOf(splitString) === -1) {
                return [string];
            }
            if (count === 0) {
                return [string];
            }
            if (count < 0 || count === undefined) {
                return string.split(splitString);
            }
            var list = [], pos = 0, _pos = 0;
            while (--count >= 0) {
                _pos = pos;
                pos = string.indexOf(splitString, pos);
                if (pos === -1) {
                    pos = _pos;
                    break;
                }
                list.push(string.substring(_pos, pos));
                pos += splitString.length;
            }
            list.push(string.substring(pos));
            return list;
        };
        return URLSearchParams;
    }());

    module.exports = URLSearchParams;

});