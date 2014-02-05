# imgBBQ 
### (Images Beyond Basic Queries)

imgBBQ is a jQuery plug-in that makes your web page aware of the type of device it's being viewed on, the pixel density of that device, the connection speed of that device and loads the images that make the most sense for that environment.

### How To Use

##### Requirements
```html
<script src="jquery-1.10.1.min.js"></script>
<script src="query.img-bbq.min.js"></script>
```

##### Construct your image(s) as you normally would
```html
<img class="yourclass" src="img/your-image.jpg">
```

##### Call imgBBQ once the DOM is ready or after a dynamic image (or set of images) gets loaded
```js
$(".yourclass").imgBBQ();
```
In this example, with defalut settings, your Retina image would be here 'img/@2x/your-image.jpg' and your Mobile image would be here 'img/@Mobile/your-image.jpg'.

View: [Plug-In page with demos](http://inspiredroots.com/__devlab/2014/imgbbq/)

### Optional settings

```js
$(".yourclass").imgBBQ({

	pathToRetina	: 'path/to/your/hi-res/images', 	// default '@2x'
	pathToMobile	: 'path/to/your/mobile/images', 	// default '@Mobile'
	minimumKbps	: 400, 					// default 200
	testImgURI	: 'absolute/path/to/your/10Kb/image.jpg', 
	debuggingOn	: true					// default false
	
});
```

### Under The Hood
- jQuery dependent
- 3 Kb
- Detects connection speed
- Detects display ratio / pixel density
- Detects mobile devices
- Only loads alternate images if they actually exist
- Fails gracefully
- No image filename suffixes required
- Customizable minimum Kbps setting
- Customizable @2x and @Mobile directory paths
- Won't load same image twice
- imgBBQ isn't worried about screen width or height; doesn't do media queries

### Visuals That Might Help
View: [The Math, Visualized](https://github.com/glambertson/imgbbq/wiki/imgBBQ---The-Math)

View: [File Structure Example](https://github.com/glambertson/imgbbq/wiki/imgBBQ-File-Structure-Example)
