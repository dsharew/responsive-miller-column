# responsive-miller-column

Please look at the practical demo page here
[link](https://dsharew.github.io/responsive-miller-column/).

<h1>Responsive Miller columns </h1>

Responsive design for Miller Columns. 
Miller columns (also known as Cascading) are a browsing/visualization technique that can be applied to tree structures. The columns allow multiple levels of the hierarchy to be open at once, and provide a visual representation of the current location. It is closely related to techniques used earlier in the Smalltalk browser, but was independently invented by Mark S. Miller in 1980 at Yale University. The technique was then used at Project Xanadu, Datapoint, and NeXT. [More info](https://en.wikipedia.org/wiki/Miller_columns)

<h2>Dependency</h2>
_jQuery_


<h2> How to initialize? </h2>

```javascript

	var $millerCol = $("#miller_col");
	$millerCol.millerColumn({
	    initData: rootCategory
	});

```

<h2> Options </h2>
<h3> Read only </h3>

The miller column can be either readonly or editable; if it is editable you will action buttons for adding childrens, editing category item, deleting category item. 
When these action buttons are clicked they will emit the appropriate events. See events section for more info.
```javascript

	$millerCol.millerColumn({
	    isReadOnly: true,
	    initData: rootCategory
	});

```
