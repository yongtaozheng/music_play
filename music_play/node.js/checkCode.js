function GetRandomNum(Min,Max)
{   
var Range = Max - Min;   
var Rand = Math.random();   
return(Min + Math.round(Rand * Range));   
}   
var num1 = GetRandomNum(6,8);     

var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

// function generateMixed(n) {
//      var res = "";
//      for(var i = 0; i < n ; i ++) {
//          var id = Math.ceil(Math.random()*35);
//          res += chars[id];
//      }
//      return res;
// }
// exports.world = function() {
//   console.log('大家好！我是山水子农，我正在学习Node.js 模块系统！');
// }
exports.num = function(n) {
     var res = "";
     for(var i = 0; i < n ; i ++) {
         var id = Math.ceil(Math.random()*35);
         res += chars[id];
     }
     return res;
}