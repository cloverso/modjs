# modjs
JavaScript 简洁版模块加载器
<pre>
配置：
mod.config({
  baseUrl:'基础目录',                 // 设置文件根目录
  paths: {
    modName: 'mod path'               // 设置文件路径别名
  }
}).require(['a模块','b模块'],function(a,b){  // 可配置后直接调用
  console.log(a);
  console.log(b);
});


定义：
define(['rely mod'],function(relyName){  // 如果有依赖模块，则引入依赖模块，return值为当前模块的结果
  function currentMod(){};
  return currentMod;
});

调用：
require(['rely mod'],function(relyName){  // 调用方法同定义时相同，只是没有返回值
  console.log(relyName);
});
</pre>
