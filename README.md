# responsive-miller-column

Please look at the practical demo page here
[link](https://dsharew.github.io/responsive-miller-column/).

<h1>Miller columns </h1>

Miller columns (also known as Cascading) are a browsing/visualization technique that can be applied to tree structures. The columns allow multiple levels of the hierarchy to be open at once, and provide a visual representation of the current location. It is closely related to techniques used earlier in the Smalltalk browser, but was independently invented by Mark S. Miller in 1980 at Yale University. The technique was then used at Project Xanadu, Datapoint, and NeXT. [More info](https://en.wikipedia.org/wiki/Miller_columns)

<h2> How to initialize? </h2>

```javascript

	var $millerCol = $("#category-miller-cols-container");
	$millerCol.millerColumn({
	    initData: rootCategory
	});

```
