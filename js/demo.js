var CONSTANT_MAX_NUMBER_CATEGORIES = 10

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


}

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

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function findCategoryByParentId(categoriesCollection, parentId) {

    var category = categoriesCollection.findOne({
        parentId: parentId
    });

    //delete inactive functions pulled from db
    for (k in category) {
        if (typeof category[k] == 'undefined') delete category[i];
    }

    //copy Category model functions to category (db object)
    category = $.extend(new Category(), category);

    return category;
}

function initDemoData(db, categoriesCollection, categoryItemCollection) {

    var categoryParentId = null;
    var categoryItemParentId = null;

    for (var i = 1; i <= CONSTANT_MAX_NUMBER_CATEGORIES; ++i) {

        var category = new Category();

        category.setCategoryName("Category " + i);
        category.setParentId(categoryParentId);
        category.setIsLowestLevel(false);

        if (CONSTANT_MAX_NUMBER_CATEGORIES == i) category.setIsLowestLevel(true);

        categoriesCollection.insert(category);

        categoryParentId = category.getCategoryId();
    }

    console.log(categoriesCollection.find());

    var rootCategory = findCategoryByParentId(categoriesCollection, null);

    createChildrenCategoryItems(categoryItemCollection, categoriesCollection, rootCategory, null, 20);

}

function createChildrenCategoryItems(categoryItemCollection, categoriesCollection, category, parentCategoryItem, numChildren) {

    if (category && 0 == numChildren) return;

    for (var i = 1; i <= numChildren; ++i) {

        var categoryItem = new CategoryItem();

        var numChildren2 = parseInt(Math.random() * 6);

	if (category.getIsLowestLevel()) numChildren2 = 0;

        categoryItem.setItemName(category.getCategoryName() + " item " + i);
        categoryItem.setHasChildren(numChildren2 != 0);
        categoryItem.setCategoryId(category.getCategoryId());

        var parentCategoryItemId = parentCategoryItem == null ? null : parentCategoryItem.getItemId();
        categoryItem.setParentId(parentCategoryItemId);

        categoryItemCollection.insert(categoryItem);

        var childCategory = findCategoryByParentId(categoriesCollection, category.getCategoryId());

	if (!category.getIsLowestLevel())
	        createChildrenCategoryItems(categoryItemCollection, categoriesCollection, childCategory, categoryItem, numChildren2);

    }

}

(function ($) {

    $(document).ready(function () {

        var db = new loki('demo.db');

        var categories = db.addCollection('categories');
        var itemCategories = db.addCollection('itemCategories');

        initDemoData(db, categories, itemCategories);

        console.log("demo db fully initialized.");

        var rootCategory = findCategoryByParentId(categories, null);
        var rootItemCategories = itemCategories.find({
            categoryId: rootCategory.getCategoryId()
        });

        rootCategory.items = rootItemCategories;

        var $millerCol = $("#category-miller-cols-container");

        $millerCol.millerColumn({
            isReadOnly: true,
            initData: rootCategory
        });

        $millerCol.on("item-selected", ".miller-col-list-item", function (event, data) {

            console.log("item selected.. data: " + data.itemId);

            var category = findCategoryByParentId(categories, data.categoryId);
            var itemCategories2 = itemCategories.find({
                $and: [
                    {
                        categoryId: category.getCategoryId()
                    },
                    {
                        parentId: data.itemId
                    }
               ]
            });

            category.items = itemCategories2;

            $millerCol.millerColumn("addCol", category);

        });

    })


})(jQuery);
