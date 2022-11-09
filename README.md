# Objemoji
在obsidian中自动提示emoji  
在原分支基础上替换了emoji列表，采用[jemoji](https://rubygems.org/gems/jemoji/versions/0.5.1?locale=zh-CN)兼容的表情  
使用shortcode形式时，可结合jekyll使用。  
在jekyll中使用jemoji插件可在静态文件生成时将shortcode转为img标签，静态资源来自Github CDN。  
上述方式不会在静态文件中直接使用unicode emoji，避免了直接使用emoji码点可能带来的兼容性问题。