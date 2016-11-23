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

<h2> Interfaces </h2>
The lib defines two data classes so far. 
<h5> Category </h5>
Data class that defines the columns.

```javascript
	function Category() {

	    var _this = this;

	    _this.categoryId = guid();

	    _this.setCategoryId = function (categoryId) {

		_this.categoryId = categoryId;

	    }

	    _this.getCategoryId = function () {
		return _this.categoryId;
	    }


	    _this.setCategoryName = function (categoryName) {

		_this.categoryName = categoryName;

	    }
	    _this.getCategoryName = function () {
		return _this.categoryName;
	    }


	    _this.setParentId = function (parentId) {

		_this.parentId = parentId;

	    }
	    _this.getParentId = function () {
		return _this.parentId;
	    }


	    _this.setIsLowestLevel = function (isLowestLevel) {
		_this.isLowestLevel = isLowestLevel;
	    }
	    _this.getIsLowestLevel = function () {
		return _this.isLowestLevel
	    }

	  _this.setItems = function (categoryItems) {
		_this.items = categoryItems;
	    }
	    _this.getItems = function () {
		return _this.items
	    }


	}
```

<h5> CategoryItem </h5>
Data class that defines each item that are contained with in columns.

```javascript

function CategoryItem() {

    var _this = this;

    _this.itemId = guid();

    _this.setItemId = function (itemId) {

        _this.itemId = itemId;

    }

    _this.getItemId = function () {
        return _this.itemId;
    }


    _this.setItemName = function (itemName) {

        _this.itemName = itemName;

    }
    _this.getItemName = function () {
        return _this.itemName;
    }


    _this.setParentId = function (parentId) {

        _this.parentId = parentId;

    }
    _this.getParentId = function () {
        return _this.parentId;
    }


    _this.setCategoryId = function (categoryId) {

        _this.categoryId = categoryId;

    }
    _this.getCategoryId = function () {
        return _this.categoryId;
    }


    _this.setHasChildren = function (hasChildren) {
        _this.hasChildren = hasChildren;
    }
    _this.getHasChildren = function () {
        return _this.hasChildren
    }


    _this.isDeleteable = true;
    _this.setIsDeletable = function (isDeleteable) {
        _this.isDeleteable = isDeleteable;
    }
    _this.getIsDeleteable = function () {
        return _this.isDeleteable
    }


}


```

``` isDeleteable ``` property is used if the miller column is editable. If this prop is true a __Delete__ icon will appear infront of the item.

Category contains zero or more CategoryItem.

<h5> JSON support </h5>

The plugin also accepts any js object as far as it contains the required props. 
Here is a valid json object as example. 
Note: the lib does not accepts JSON string, if you have a json string you have to call ```JSON.parse(jsonString)``` to convert your json string into object.

```javascript
	{
	   "categoryId":"63ef58e5-fc92-9934-9b4c-ca5f457a425b",
	   "categoryName":"Category 2",
	   "parentId":"53732c02-f3d3-10de-1710-c74a8e3df260",
	   "isLowestLevel":false,
	   "items":[
	      {
		 "itemId":"50b73f3a-a302-14dc-e61c-3da72876e712",
		 "isDeleteable":true,
		 "itemName":"Category 2 item 1",
		 "hasChildren":false,
		 "categoryId":"63ef58e5-fc92-9934-9b4c-ca5f457a425b",
		 "parentId":"d39e098e-5ecb-3ba5-8fd8-fa20c7685e8c"
	      },
	      {
		 "itemId":"d98c4bfc-cae5-3355-08b8-84d0bc4edd59",
		 "isDeleteable":true,
		 "itemName":"Category 2 item 2",
		 "hasChildren":true,
		 "categoryId":"63ef58e5-fc92-9934-9b4c-ca5f457a425b",
		 "parentId":"d39e098e-5ecb-3ba5-8fd8-fa20c7685e8c"
	      },
	      {
		 "itemId":"50603731-b62e-d0d2-dda8-493e9882651f",
		 "isDeleteable":true,
		 "itemName":"Category 2 item 3",
		 "hasChildren":true,
		 "categoryId":"63ef58e5-fc92-9934-9b4c-ca5f457a425b",
		 "parentId":"d39e098e-5ecb-3ba5-8fd8-fa20c7685e8c"
	      },
	      {
		 "itemId":"72942b44-d011-1530-26b0-aa7f3351209e",
		 "isDeleteable":true,
		 "itemName":"Category 2 item 4",
		 "hasChildren":true,
		 "categoryId":"63ef58e5-fc92-9934-9b4c-ca5f457a425b",
		 "parentId":"d39e098e-5ecb-3ba5-8fd8-fa20c7685e8c"
	      },
	      {
		 "itemId":"34644c0c-56f2-dc59-a649-2ea8d7195e97",
		 "isDeleteable":true,
		 "itemName":"Category 2 item 5",
		 "hasChildren":false,
		 "categoryId":"63ef58e5-fc92-9934-9b4c-ca5f457a425b",
		 "parentId":"d39e098e-5ecb-3ba5-8fd8-fa20c7685e8c"
	      }
	   ]
	}
```

<h5> 
