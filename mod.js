(function(){

	var moduleCache = {};	// 保存已经加载好的模块
	var data = {
		baseUrl: getBaseUrl(),
		paths: {}
	};

	function Module(){};	// 构造函数

	Module.config = function(configData) {	// 配置路径信息
		var key, curr, prev, k ;	
		for (key in configData) {
			curr = configData[key];
			prev = data[key];
			if (prev && {}.toString.call(prev) === "[object Object]") {
				for (k in curr) {
					prev[k] = curr[k];
				}
			} else {
				if (key === "baseUrl") {
					if (curr.slice(-1) !== "/") {
						curr += "/"
					}
					data[key] = curr;
				}
			}			
		}
		return Module;
	}

	Module.define = Module.require =  function(deps, factory) {	// 定义模块
		var argLen = arguments.length,
			params = [],
			depCount = 0,
			depLen = 0,
			modName = (document.currentScript && document.currentScript.id) || 'REQUIRE_MAIN';

		if (!argLen) return;
		if (argLen === 1) {
			factory = deps;
			deps = [];
		} 
		if (depLen = deps.length) {
			var oldParams = [], oldMod;
			deps.forEach(function(dep, i){
				depCount++;
				if ((oldMod = moduleCache[dep]) && oldMod.status === 'loaded') {
					oldParams.push(oldMod.exports);
					if (i === depLen-1) {
						saveMod(modName, oldParams, factory);
					}
				} else {
					loadMod(dep, function(param){
						params.push(param);
						if (!--depCount) {
							saveMod(modName, params, factory);
						}
					});
				}
			});
		} else {
			saveMod(modName, null, factory);
		};

	}

	function getBaseUrl() {	// 获取文件目录
		var src, index;
		if (document.currentScript) {
			src = document.currentScript.src.replace(/[\&\?]{1}[\w\W]+/g, '');
			index = src.lastIndexOf('/');
			return src.substring(0, index+1);
		}
	}

	function getPathUrl(modName) {	// 获取要加载模块文件的src地址
		var path;
		if (path = data.paths[modName]) {
			if (/^(http|https|file)/.test(path)) {
				return path;
			} else {
				return data.baseUrl + path;
			}			
		}		
		(modName.indexOf('.js') === -1) && (modName += '.js');
		return data.baseUrl + modName;
	}

	function loadMod(modName, callback) {	// 加载模块
		var src = getPathUrl(modName), mod, fs, _script;
		if (mod = moduleCache[modName]) {
			mod.onload.push(callback);
		} else {
			moduleCache[modName] = {
				modName: modName,
				status: 'loading',
				exports: null,
				onload: [callback]
			};
			_script = document.createElement('script');
			_script.id = modName;
			_script.async = true;
			_script.src = src;
			_script.onload = function(){this.parentNode.removeChild(this)};
			fs = document.getElementsByTagName('script')[0];
			fs.parentNode.insertBefore(_script, fs);
		}
	}

	function saveMod(modName, params, callback) {	//保存模块信息
		var mod, fn;
		if (moduleCache.hasOwnProperty(modName)) {
			mod = moduleCache[modName];
			mod.status = 'loaded';
			mod.exports = callback ? callback.apply(this, params) : null; 
			while (fn = mod.onload.shift()) {
				fn(mod.exports);
			}
		} else {
			callback && callback.apply(this, params);
		}
	}
	this.mod = Module;
	this.define = this.require = Module.define;	// 暴露接口，定义到全局

}).call(this);
