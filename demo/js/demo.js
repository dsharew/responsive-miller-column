var CONSTANT_MAX_NUMBER_CATEGORIES = 6;
var iconList = ["clear", "store", "call", "wifi", "portrait"];

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
        categoryItem.setItemIcon(iconList[parseInt(Math.random() * 6 - 1)]);
        categoryItem.setHasChildren(numChildren2 != 0);
        categoryItem.setNumChildren(numChildren2);
        categoryItem.setCategoryId(category.getCategoryId());

        var parentCategoryItemId = parentCategoryItem == null ? null : parentCategoryItem.getItemId();
        categoryItem.setParentId(parentCategoryItemId);

        categoryItemCollection.insert(categoryItem);

        var childCategory = findCategoryByParentId(categoriesCollection, category.getCategoryId());

        if (!category.getIsLowestLevel())
            createChildrenCategoryItems(categoryItemCollection, categoriesCollection, childCategory, categoryItem, numChildren2);

    }

}

function createDialog($dialogBodyContent, dialogTitle){

    //remove prev popup instances
    $("#popup").remove();

    var $dialog = $("<div/>").attr("id", "popup").addClass("popup-wrapper hide");
    var $dialogContent = $("<div/>").addClass("popup-content");
    var $dialogTitle = $("<div/>").addClass("popup-title");
    var $btnClose = $("<button/>").attr("type", "button").addClass("popup-close").text("X");
    var $h3 = $("<h3/>").text(dialogTitle);
    var $dialogBody = $("<div/>").addClass("popup-body").append($dialogBodyContent);

    $dialogTitle.append($btnClose).append($h3);

    $dialogContent.append($dialogTitle).append($dialogBody);

    return $dialog.append($dialogContent);
}

function showSpinner(){

    var spinner = $("<div/>").append($("<div/>").addClass("spinner"));

    spinner.addClass("spinner-wrapper");

    $("body").append(spinner);

}

function hideSpinner(){
    $(".spinner-wrapper").remove();
}

function reInitializeMillerCol($millerCol, isReadOnly, categories, itemCategories){

    $millerCol.empty();

    showSpinner();

    setTimeout(function () {

        hideSpinner();

        var rootCategory = findCategoryByParentId(categories, null);

        rootCategory.items = itemCategories.find({
            categoryId: rootCategory.getCategoryId()
        });

        $millerCol.millerColumn({
            isReadOnly: isReadOnly,
            initData: rootCategory
        });

    }, 100);

}

(function ($) {

    $(document).ready(function () {

        var db = new loki('demo.db');

        var categories = db.addCollection('categories');
        var itemCategories = db.addCollection('itemCategories');
        var $millerCol = $("#category-miller-cols-container");

        

        showSpinner();

        setTimeout(function () {

            initDemoData(db, categories, itemCategories);

            hideSpinner();

            console.log("demo db fully initialized.");

            var rootCategory = findCategoryByParentId(categories, null);
            var rootItemCategories = itemCategories.find({
                categoryId: rootCategory.getCategoryId()
            }).sort( function(obj1, obj2) {
                if (obj1.itemName == obj2.itemName) return 0;
                if (obj1.itemName > obj2.itemName) return 1;
                if (obj1.itemName < obj2.itemName) return -1;
            });

            rootCategory.items = rootItemCategories;

            $millerCol.millerColumn({
                isReadOnly: true,
                initData: rootCategory
            });

        }, 100);

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

        $millerCol.on("add-item", ".miller-col-container", function (event, data) {

            var $dialogFullbody = $("<div/>");
            var $dialogBody  = $("<div/>").addClass("middle-body");

            $dialogBody.append($("<i/>").attr("id","element-icon").attr("name", "iconName").addClass("material-icons").addClass("dropbtn").text("clear").attr("onclick", "toggleDropdown()"));

            var $dialogDropdown = $("<div/>").attr("id","myDropdown").addClass("dropdown-content");

            for(var k=0; k<iconList.length; k++){
                 $dialogDropdown.append($("<div/>").addClass("dropdown-element").append($("<i/>").addClass("material-icons").text(iconList[k])));
            }

            $dialogBody.append($dialogDropdown);

            $dialogBody.append($("<input/>").attr("name", "itemName"));
            $dialogBody.append($("<div/>").addClass("clearfix"));

            var $dialogFooter = $("<div/>").addClass("footer");
            var $buttonCreate = $("<button/>").attr("type", "button").addClass("button create").append($("<i/>").addClass("material-icons").addClass("add").text("add"));

            $dialogFooter.append($buttonCreate).append($("<div/>").addClass("clearfix"));

            $dialogFullbody.append($dialogBody);
            $dialogFullbody.append($dialogFooter);

            var dialog = createDialog($dialogFullbody, "Create child for: " + data.categoryName);

            $(dialog).on("click touch", ".popup-close", function(){

                $("#popup").remove();

            });

            $(dialog).find(".button.create").on("click touch", function(event){

                var itemName = $(this).closest("#popup").find("input[name='itemName']").val();
                var iconName = $(this).closest("#popup").find("i[name='iconName']").html();
                if (iconName=="clear") iconName = "";

                var categoryItem = new CategoryItem();

                categoryItem.setItemName(itemName);
                categoryItem.setCategoryId(data.categoryId);
                categoryItem.setParentId(data.parentId);
                categoryItem.setItemIcon(iconName);
                categoryItem.setHasChildren(false);
                categoryItem.setIsDeletable(false);

                itemCategories.insert(categoryItem);

                $millerCol.millerColumn("addItem", categoryItem);

                $("#popup").remove();

            });

            $("body").append(dialog);

            dialog= dialog.popup({
                width: 400,
                height: "auto",
                top: 100
            });

            dialog.open();

        });

        $millerCol.on("delete-item", ".miller-col-list-item", function (event, data) {

            var $dialogBody = $("<div/>");

            $dialogBody.append("Are you sure you want to delete this item?");

            var $dialogFooter = $("<div/>").addClass("footer");
            var $buttonCreate = $("<button/>").attr("type", "button").addClass("delete button").append($("<i/>").addClass("material-icons").addClass("delete").text("delete"));

            $dialogFooter.append($buttonCreate).append($("<div/>").addClass("clearfix"));

            $dialogBody.append($dialogFooter);

            var dialog = createDialog($dialogBody, "Delete Item " + data.itemName);

            $(dialog).on("click touch", ".popup-close", function(){

                $("#popup").remove();

            });

            $(dialog).find(".button.delete").on("click touch", function(){

                var categoryItem = itemCategories.findOne({
                    itemId: data.itemId
                });
                var categoryItemIds = [];

                categoryItemIds.push(categoryItem.itemId);

                var children = itemCategories.find({
                    parentId: data.itemId
                });

                //remove root item
                itemCategories.remove(categoryItem);

                while(children.length != 0){

                    var child = children.pop();

                    categoryItemIds.push(child.itemId);

                    children = children.concat(itemCategories.find({
                        parentId: child.itemId
                    }));

                    itemCategories.remove(child);

                }

                $millerCol.millerColumn("deleteItem", categoryItem);

                $("#popup").remove();

            });

            $("body").append(dialog);

            dialog= dialog.popup({
                width: 400,
                height: "auto",
                top: 100
            });

            dialog.open();

        });


        $millerCol.on("edit-item", ".miller-col-list-item", function (event, data) {

            var $dialogFullbody = $("<div/>");
            var $dialogBody  = $("<div/>").addClass("middle-body");

            $dialogBody.append($("<i/>").attr("id","element-icon").attr("name", "iconName").addClass("material-icons").addClass("dropbtn").text(typeof data.itemIcon == 'undefined' || data.itemIcon == "" ? "clear" : data.itemIcon).attr("onclick", "toggleDropdown()"));

            var $dialogDropdown = $("<div/>").attr("id","myDropdown").addClass("dropdown-content");

            for(var k=0; k<iconList.length; k++){
                $dialogDropdown.append($("<div/>").addClass("dropdown-element").append($("<i/>").addClass("material-icons").text(iconList[k])));
            }

            $dialogBody.append($dialogDropdown);

            $dialogBody.append($("<input/>").attr("name", "itemName").attr("value", data.itemName));
            $dialogBody.append($("<div/>").addClass("clearfix"));

            var $dialogFooter = $("<div/>").addClass("footer");
            var $buttonCreate = $("<button/>").attr("type", "button").addClass("positive button").append($("<i/>").addClass("material-icons").addClass("edit").text("save"));

            $dialogFooter.append($buttonCreate).append($("<div/>").addClass("clearfix"));

            $dialogFullbody.append($dialogBody);
            $dialogFullbody.append($dialogFooter);

            var dialog = createDialog($dialogFullbody, "Edit Item");

            $(dialog).on("click touch", ".popup-close", function(){

                $("#popup").remove();

            });

            $(dialog).find(".button.positive").on("click touch", function(){

                var itemName = $(this).closest("#popup").find("input[name='itemName']").val();
                var iconName = $(this).closest("#popup").find("i[name='iconName']").html();
                if (iconName=="clear") iconName = "";

                var categoryItem = itemCategories.findOne({
                    itemId: data.itemId
                });

                categoryItem.itemName = itemName;
                categoryItem.setItemIcon(iconName);

                itemCategories.update(categoryItem);

                $millerCol.millerColumn("updateItem", categoryItem);

                $("#popup").remove();

            });

            $("body").append(dialog);

            dialog= dialog.popup({
                width: 400,
                height: "auto",
                top: 100
            });

            dialog.open();

        });

        $("#read_only_input").on("click touch", function(){

            $(this).val() == "off" ?  $(this).val("on") : $(this).val("off");

            reInitializeMillerCol($millerCol, $(this).val() == "off", categories, itemCategories);

        });

    });

})(jQuery);
