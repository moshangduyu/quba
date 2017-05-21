/**
 * Created by coffee on 11/05/2017.
 */

define(function (require, exports, module){

    /**
     * 将普通数组转换成科学计数法
     * @param value {number}
     * @return {String|number}
     */
    module.exports = function (value) {
        if(!value){
            return value;
        }

        if(value > 0){
            var s = value.toString().split("");

            if(s.length > 1){
                s = s.map(function(e, i){
                    return s[s.length - i - 1]
                });
            }


            var l = [];

            s.forEach(function(e, i){

                if(i%3 === 2){
                    l.push("," + e);
                }else{
                    l.push(e);
                }
            });

            if(l.length > 1){
                l = l.map(function(e, i){
                    return l[l.length - i - 1]
                });
            }

            return l.join("");

        }
    }

});