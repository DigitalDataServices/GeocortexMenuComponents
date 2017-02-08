
/* Begin Script: D:/Geocortex - Components/MenuComponents/custom_ts_out.js ------------------------- */ 
var dds;
(function (dds) {
    var menuComponents;
    (function (menuComponents) {
        /**
        * @remarks:	an attempt was made to use the "I want to..." menu "Text" field as the unique identifier - but it was not successful since the menu
        *			item text may contain text references (e.g. "@language-menu-home-panel") that were not easily translatable from within the application;
        *			the "Command" field is used instead
        */
        var MenuItems = (function () {
            //
            function MenuItems() {
                this._registerCommands();
                this._iWantToItemRemovalMap = [];
                this._resultItemRemovalMap = [];
            }
            //
            //
            MenuItems.prototype._registerCommands = function () {
                var _this = this;
                //	['I Want To' menu]
                menuComponents.Utilities.app.command(MenuItems._showIWantToMenuItemsCommand).register(this, function (parameters) {
                    _this._updateIWantToMenuItems(parameters, VisibilityCommand.Show);
                });
                menuComponents.Utilities.app.command(MenuItems._hideIWantToMenuItemsCommand).register(this, function (parameters) {
                    _this._updateIWantToMenuItems(parameters, VisibilityCommand.Hide);
                });
                //	[Results Menu]
                menuComponents.Utilities.app.command(MenuItems._showResultMenuItemsCommand).register(this, function (parameters) {
                    _this._updateResultMenuItems(parameters, VisibilityCommand.Show);
                });
                menuComponents.Utilities.app.command(MenuItems._hideResultMenuItemsCommand).register(this, function (parameters) {
                    _this._updateResultMenuItems(parameters, VisibilityCommand.Hide);
                });
            };
            //
            //	['I want to' menu]
            //
            MenuItems.prototype._updateIWantToMenuItems = function (itemTextArray, visibility) {
                var _this = this;
                if (!itemTextArray ||
                    !itemTextArray.length) {
                    return;
                }
                //	locate the 'I want to' menu view within the Geocortex view collection
                var menuViewModel = this._getIWantToMenuViewModel();
                if (menuViewModel) {
                    //	convert any text references to standard text
                    itemTextArray = this._translateReferencedText(itemTextArray, menuViewModel.libraryId);
                    dojo.forEach(itemTextArray, function (itemText) {
                        if (visibility === VisibilityCommand.Show) {
                            _this._addIWantToMenuItem(menuViewModel, itemText);
                        }
                        else {
                            _this._removeIWantToMenuItem(menuViewModel, itemText);
                        }
                    });
                }
            };
            //
            //
            MenuItems.prototype._getIWantToMenuViewModel = function () {
                var views = menuComponents.Utilities.app.viewManager.getViews();
                for (var index = 0; index < views.length; index++) {
                    if (views[index].id === MenuItems._iWantToMenuMenuView) {
                        return views[index].viewModel;
                    }
                }
                return null;
            };
            //
            //
            MenuItems.prototype._addIWantToMenuItem = function (menuViewModel, itemText) {
                //	check if the menu item is already within the visible menu item list
                if (this._getVisibleMenuItemIndex(menuViewModel, itemText) !== -1) {
                    return;
                }
                //	check if the item is within the generic 'MenuViewModel:menuItems' list
                var menuItems = menuViewModel.menuItems.getItems();
                for (var index = 0; index < menuItems.length; index++) {
                    //	add the menu item to the 'visible' menu item list
                    if (itemText === menuItems[index].text.get()) {
                        var menuItem = menuItems[index];
                        //	attempt to maintain the original item ordering 
                        if (this._iWantToItemRemovalMap.length) {
                            //	locate the item within the stored removal data
                            for (var mapIndex = 0; mapIndex < this._iWantToItemRemovalMap.length; mapIndex++) {
                                if (this._iWantToItemRemovalMap[mapIndex][MenuItems._textProperty] === itemText) {
                                    menuViewModel.visibleMenuItems.insertItem(this._iWantToItemRemovalMap[mapIndex][MenuItems._indexProperty], menuItem);
                                    //	delete the item from the Map
                                    this._iWantToItemRemovalMap.splice(mapIndex, 1);
                                    menuItem = null;
                                    break;
                                }
                            }
                        }
                        //	else just append the menu item to the end of the menu
                        if (menuItem) {
                            menuViewModel.visibleMenuItems.addItem(menuItem);
                        }
                        break;
                    }
                }
            };
            //
            //
            MenuItems.prototype._removeIWantToMenuItem = function (menuViewModel, itemText) {
                //	check if the menu item is within the visible menu item list (which are bound to the view's HTML list)
                var itemIndex = this._getVisibleMenuItemIndex(menuViewModel, itemText);
                if (itemIndex !== -1) {
                    //	store the item removal data for future re-addition to the view model
                    var itemData = {};
                    itemData[MenuItems._indexProperty] = itemIndex;
                    itemData[MenuItems._textProperty] = itemText;
                    this._iWantToItemRemovalMap.push(itemData);
                    //	remove the item from the 'visible' list (note that the items are also in the 'MenuViewModel:menuItems' list)
                    menuViewModel.visibleMenuItems.removeAt(itemIndex);
                }
            };
            //
            //
            MenuItems.prototype._getVisibleMenuItemIndex = function (menuViewModel, itemText) {
                var menuItems = menuViewModel.visibleMenuItems.getItems();
                for (var index = 0; index < menuItems.length; index++) {
                    if (itemText === menuItems[index].text.get()) {
                        return index;
                    }
                }
                return -1;
            };
            //
            //	[Results menu]
            /**
            * @remarks:	'Results' can be displayed in either List or Table format
            */
            //
            MenuItems.prototype._updateResultMenuItems = function (itemTextArray, action) {
                var _this = this;
                if (!itemTextArray ||
                    !itemTextArray.length) {
                    return;
                }
                //	locate the 'Result' menus within the Geocortex menu collection
                var menus = this._getResultMenus();
                if (menus) {
                    //	convert any text references to standard text
                    itemTextArray = this._translateReferencedText(itemTextArray, this._getResultMenuLibraryId());
                    dojo.forEach(itemTextArray, function (itemText) {
                        if (action === VisibilityCommand.Show) {
                            _this._addResultMenuItem(menus, itemText);
                        }
                        else {
                            _this._removeResultMenuItem(menus, itemText);
                        }
                    });
                }
            };
            //
            //
            MenuItems.prototype._getResultMenus = function () {
                var resultMenus = [];
                var menus = menuComponents.Utilities.app.menuRegistry.menuList;
                for (var index = 0; index < menus.length; index++) {
                    //	there is both a List/Table view Menu - so store both menus
                    if ((menus[index].id === MenuItems._resultsListMenuIdentifier) ||
                        (menus[index].id === MenuItems._resultsTableMenuIdentifier)) {
                        resultMenus.push(menus[index]);
                    }
                }
                return resultMenus;
            };
            //
            //
            MenuItems.prototype._addResultMenuItem = function (resultMenus, itemText) {
                var _this = this;
                dojo.forEach(resultMenus, function (menu) {
                    //	ensure that the menu item is not already within the menu list
                    var itemIndex = _this._getResultMenuItemIndex(menu, itemText);
                    if (itemIndex === -1) {
                        //	attempt to maintain the original item ordering 
                        if (_this._resultItemRemovalMap.length) {
                            //	locate the item within the stored removal data
                            for (var index = 0; index < _this._resultItemRemovalMap.length; index++) {
                                if ((_this._resultItemRemovalMap[index][MenuItems._menuIdentifierProperty] === menu.id) &&
                                    (_this._resultItemRemovalMap[index][MenuItems._menuItemModelProperty].text === itemText)) {
                                    menu.items.splice(_this._resultItemRemovalMap[index][MenuItems._indexProperty], 0, _this._resultItemRemovalMap[index][MenuItems._menuItemModelProperty]);
                                    //	delete the item from the Map
                                    _this._resultItemRemovalMap.splice(index, 1);
                                    break;
                                }
                            }
                        }
                    }
                });
            };
            //
            //
            MenuItems.prototype._removeResultMenuItem = function (resultMenus, itemText) {
                var _this = this;
                dojo.forEach(resultMenus, function (menu) {
                    var itemIndex = _this._getResultMenuItemIndex(menu, itemText);
                    if (itemIndex !== -1) {
                        var itemData = {};
                        //	store the menu identifier since there is both a 'Result' List and Table
                        itemData[MenuItems._menuIdentifierProperty] = menu.id;
                        itemData[MenuItems._indexProperty] = itemIndex;
                        itemData[MenuItems._menuItemModelProperty] = menu.items[itemIndex];
                        _this._resultItemRemovalMap.push(itemData);
                        //	remove the menu item
                        menu.items.splice(itemIndex, 1);
                    }
                });
            };
            //
            //
            MenuItems.prototype._getResultMenuItemIndex = function (menu, itemText) {
                for (var index = 0; index < menu.items.length; index++) {
                    if (menu.items[index].text === itemText) {
                        return index;
                    }
                }
                return -1;
            };
            //
            //
            MenuItems.prototype._getResultMenuLibraryId = function () {
                var views = menuComponents.Utilities.app.viewManager.getViews();
                for (var index = 0; index < views.length; index++) {
                    if (views[index].id === MenuItems._resultsListView) {
                        return views[index].libraryId;
                    }
                }
                return null;
            };
            //
            //
            MenuItems.prototype._translateReferencedText = function (textArray, libraryId) {
                for (var index = 0; index < textArray.length; index++) {
                    //	check if the text needs to be translated
                    if (textArray[index].indexOf("@") === 0) {
                        //	ignore the leading '@' when translating 
                        textArray[index] = menuComponents.Utilities.app.getResource(libraryId, textArray[index].substr(1));
                    }
                }
                return textArray;
            };
            MenuItems._showIWantToMenuItemsCommand = "ShowIWantToMenuItems";
            MenuItems._hideIWantToMenuItemsCommand = "HideIWantToMenuItems";
            MenuItems._showResultMenuItemsCommand = "ShowResultMenuItems";
            MenuItems._hideResultMenuItemsCommand = "HideResultMenuItems";
            //
            MenuItems._iWantToMenuMenuView = "IWantToMenuView";
            MenuItems._resultsListView = "ResultsListView";
            MenuItems._resultsListMenuIdentifier = "ResultsListActions";
            MenuItems._resultsTableMenuIdentifier = "ResultsTableActions";
            //
            MenuItems._textProperty = "text";
            MenuItems._indexProperty = "index";
            MenuItems._menuIdentifierProperty = "menuIdentifier";
            MenuItems._menuItemModelProperty = "menuItemModel";
            return MenuItems;
        })();
        menuComponents.MenuItems = MenuItems;
    })(menuComponents = dds.menuComponents || (dds.menuComponents = {}));
})(dds || (dds = {}));
var dds;
(function (dds) {
    var menuComponents;
    (function (menuComponents) {
        //
        var CompactToolbarItemData = (function () {
            function CompactToolbarItemData() {
            }
            return CompactToolbarItemData;
        })();
        //
        var CompactToolbar = (function () {
            //
            function CompactToolbar(toolbarViewModel) {
                this._toolbarViewModel = toolbarViewModel;
                //	get a snapshot of the initial/unmodified Toolbar item data
                this._getInitialToolbarData();
            }
            //
            /**
            * @return:	if there is a failure to add at least one item - the return value is 'false'
            */
            //
            CompactToolbar.prototype.addToolbarItems = function (toolNames) {
                var _this = this;
                if (!toolNames ||
                    !toolNames.length) {
                    return false;
                }
                var result = true;
                dojo.forEach(toolNames, function (toolName) {
                    result = result && _this._addToolbarItem(toolName);
                });
                //	check if the current 'ToolbarGroupBase' item count is equal to the initial item count;
                //	if it is - verify that the initial ordering is intact
                if (this._toolbarViewModel[CompactToolbar._toolbarGroupProperty].get().items.length() ===
                    this._itemDataArray.length) {
                }
                return result;
            };
            //
            //
            CompactToolbar.prototype.removeToolbarItems = function (toolNames) {
                var _this = this;
                if (!toolNames ||
                    !toolNames.length) {
                    return false;
                }
                var result = true;
                dojo.forEach(toolNames, function (toolName) {
                    result = result && _this._removeToolbarItem(toolName);
                });
                return result;
            };
            //
            //
            CompactToolbar.prototype._getInitialToolbarData = function () {
                this._itemDataArray = [];
                if (CompactToolbar._toolbarGroupProperty in this._toolbarViewModel) {
                    var toolbarGroup = this._toolbarViewModel[CompactToolbar._toolbarGroupProperty].get();
                    for (var index = 0; index < toolbarGroup.items.length(); index++) {
                        var itemData = new CompactToolbarItemData();
                        itemData.name = toolbarGroup.items.getAt(index).name.get();
                        itemData.initialIndex = index;
                        itemData.isHidden = false;
                        this._itemDataArray.push(itemData);
                    }
                }
            };
            //
            //
            CompactToolbar.prototype._addToolbarItem = function (toolName) {
                if (toolName &&
                    (CompactToolbar._toolbarGroupProperty in this._toolbarViewModel)) {
                    //	check if the tool is currently hidden
                    for (var index = 0; index < this._itemDataArray.length; index++) {
                        if ((this._itemDataArray[index].name === toolName) &&
                            (this._itemDataArray[index].isHidden)) {
                            //	re-add the tool
                            var insertionIndex = ((this._itemDataArray[index].initialIndex <
                                this._toolbarViewModel[CompactToolbar._toolbarGroupProperty].get().items.length()) ?
                                this._itemDataArray[index].initialIndex :
                                this._toolbarViewModel[CompactToolbar._toolbarGroupProperty].get().items.length());
                            this._toolbarViewModel[CompactToolbar._toolbarGroupProperty].get().items.insertItem(insertionIndex, this._itemDataArray[index].groupItemBase);
                            //	update the internal array
                            this._itemDataArray[index].groupItemBase = null;
                            this._itemDataArray[index].isHidden = false;
                            //	if the tool was not inserted at its original location - store the current index for later re-ordering
                            if (insertionIndex !== this._itemDataArray[index].initialIndex) {
                                this._itemDataArray[index].currentIndex = insertionIndex;
                            }
                            return true;
                        }
                    }
                }
                return false;
            };
            //
            //
            CompactToolbar.prototype._removeToolbarItem = function (toolName) {
                if (toolName &&
                    (CompactToolbar._toolbarGroupProperty in this._toolbarViewModel)) {
                    var toolbarGroup = this._toolbarViewModel[CompactToolbar._toolbarGroupProperty].get();
                    //	attempt to locate the tool (name) within the item collection
                    for (var index = 0; index < toolbarGroup.items.length(); index++) {
                        if (toolbarGroup.items.getAt(index).name.get() === toolName) {
                            //	store the tool data before removal
                            var itemIndex = this._getToolbarItemDataIndex(toolName);
                            if (itemIndex !== -1) {
                                this._itemDataArray[itemIndex].groupItemBase = toolbarGroup.items.getAt(index);
                                this._itemDataArray[itemIndex].isHidden = true;
                            }
                            //	remove the item
                            toolbarGroup.items.removeAt(index);
                            return true;
                        }
                    }
                }
                return false;
            };
            //
            //
            CompactToolbar.prototype._getToolbarItemDataIndex = function (toolName) {
                for (var index = 0; index < this._itemDataArray.length; index++) {
                    if (this._itemDataArray[index].name === toolName) {
                        return index;
                    }
                }
                return -1;
            };
            CompactToolbar._toolbarGroupProperty = "toolbarGroup";
            return CompactToolbar;
        })();
        menuComponents.CompactToolbar = CompactToolbar;
    })(menuComponents = dds.menuComponents || (dds.menuComponents = {}));
})(dds || (dds = {}));
var dds;
(function (dds) {
    var menuComponents;
    (function (menuComponents) {
        //
        var ToolbarType;
        (function (ToolbarType) {
            ToolbarType[ToolbarType["Compact"] = 0] = "Compact";
            ToolbarType[ToolbarType["Tabbed"] = 1] = "Tabbed"; //	(Full)
        })(ToolbarType || (ToolbarType = {}));
        ;
        //
        /**
        * @format:	[Tabbed]
        *			Tab:	input string =	"TAB(name)"								- string[]
        *			Group:	input string =	"TAB(name):GROUP:(name)"				- string[]
        *			Items:	input string =	"TAB(name):GROUP:(name):ITEM(name)"		or
        *									"TAB(name):NONE:ITEM(name)"				- string[]
        */
        //
        var ToolbarCommands = (function () {
            //
            function ToolbarCommands() {
                this._getActiveToolbarInfo();
                this._initializeSupportObjects();
                this._registerCommands();
            }
            //
            /**
            * @remarks:	in testing, the were two separate 'CompactToolbarView's listed in the Geocortex view collection; in coding, the
            *			first instance found is used since there were no apparent differences between the two named views
            */
            //
            ToolbarCommands.prototype._getActiveToolbarInfo = function () {
                var views = menuComponents.Utilities.app.viewManager.getViews();
                //	the Geocortex view enumeration is stopped once the active Toolbar view is identified
                for (var index = 0; index < views.length; index++) {
                    if ((views[index].id === ToolbarCommands._compactToolbarView) ||
                        (views[index].id === ToolbarCommands._tabbedToolbarView)) {
                        //	there is no Geocortex-typed ViewModel for either the compact or tabbed Toolbar
                        var viewModel = views[index].viewModel;
                        //	compact
                        if (views[index].id === ToolbarCommands._compactToolbarView) {
                            //	only the compact toolbar ViewModel contains the 'isEnabled' property
                            if (ToolbarCommands._isEnabledProperty in viewModel) {
                                var isEnabled = viewModel.isEnabled.get();
                                if (isEnabled) {
                                    this._toolbarViewModel = viewModel;
                                    this._toolbarType = ToolbarType.Compact;
                                    this._libraryId = viewModel[ToolbarCommands._libraryIdProperty];
                                    break;
                                }
                            }
                            else {
                                menuComponents.Utilities.app.trace.error("compact View 'isEnabled' property not found");
                            }
                        }
                        else {
                            this._toolbarViewModel = viewModel;
                            this._toolbarType = ToolbarType.Tabbed;
                            this._libraryId = viewModel[ToolbarCommands._libraryIdProperty];
                        }
                    }
                }
            };
            //
            //
            ToolbarCommands.prototype._initializeSupportObjects = function () {
                //	compact
                if (this._toolbarType === ToolbarType.Compact) {
                    this._compactToolbar = new menuComponents.CompactToolbar(this._toolbarViewModel);
                }
                else {
                    menuComponents.ToolbarTabs.initialize(this._toolbarViewModel);
                    menuComponents.ToolbarGroups.initialize(this._toolbarViewModel);
                    menuComponents.ToolbarItems.initialize(this._toolbarViewModel);
                }
            };
            //
            //
            ToolbarCommands.prototype._registerCommands = function () {
                var _this = this;
                menuComponents.Utilities.app.command(ToolbarCommands._showToolbarTabCommand).register(this, function (parameters) {
                    _this._updateToolbarTabs(parameters, VisibilityCommand.Show);
                });
                menuComponents.Utilities.app.command(ToolbarCommands._hideToolbarTabCommand).register(this, function (parameters) {
                    _this._updateToolbarTabs(parameters, VisibilityCommand.Hide);
                });
                menuComponents.Utilities.app.command(ToolbarCommands._showToolbarGroupCommand).register(this, function (parameters) {
                    _this._updateToolbarGroups(parameters, VisibilityCommand.Show);
                });
                menuComponents.Utilities.app.command(ToolbarCommands._hideToolbarGroupCommand).register(this, function (parameters) {
                    _this._updateToolbarGroups(parameters, VisibilityCommand.Hide);
                });
                menuComponents.Utilities.app.command(ToolbarCommands._showToolbarItemsCommand).register(this, function (parameters) {
                    _this._updateToolbarItems(parameters, VisibilityCommand.Show);
                });
                menuComponents.Utilities.app.command(ToolbarCommands._hideToolbarItemsCommand).register(this, function (parameters) {
                    _this._updateToolbarItems(parameters, VisibilityCommand.Hide);
                });
            };
            //
            //
            ToolbarCommands.prototype._updateToolbarTabs = function (parameters, command) {
                if (this._toolbarType === ToolbarType.Tabbed) {
                    this._closeToolbar();
                    var itemDescriptors = this._convertCommandParameters(parameters);
                    if (command === VisibilityCommand.Show) {
                        menuComponents.ToolbarTabs.addTabs(itemDescriptors);
                    }
                    else {
                        menuComponents.ToolbarTabs.removeTabs(itemDescriptors);
                    }
                }
            };
            //
            //
            ToolbarCommands.prototype._updateToolbarGroups = function (parameters, command) {
                if (this._toolbarType === ToolbarType.Tabbed) {
                    this._closeToolbar();
                    var itemDescriptors = this._convertCommandParameters(parameters);
                    if (command === VisibilityCommand.Show) {
                        menuComponents.ToolbarGroups.addGroups(itemDescriptors);
                    }
                    else {
                        menuComponents.ToolbarGroups.removeGroups(itemDescriptors);
                    }
                }
            };
            //
            //
            ToolbarCommands.prototype._updateToolbarItems = function (parameters, command) {
                this._closeToolbar();
                //	compact
                if (this._toolbarType === ToolbarType.Compact) {
                    //	convert any referenced text
                    for (var index = 0; index < parameters.length; index++) {
                        parameters[index] = this._convertTextReference(parameters[index]);
                    }
                    if (command === VisibilityCommand.Show) {
                        this._compactToolbar.addToolbarItems(parameters);
                    }
                    else {
                        this._compactToolbar.removeToolbarItems(parameters);
                    }
                }
                else {
                    //	convert the delimited parameter array into objects
                    var itemDescriptors = this._convertCommandParameters(parameters);
                    if (command === VisibilityCommand.Show) {
                        menuComponents.ToolbarItems.addItems(itemDescriptors);
                    }
                    else {
                        menuComponents.ToolbarItems.removeItems(itemDescriptors);
                    }
                }
            };
            //
            //
            ToolbarCommands.prototype._convertCommandParameters = function (parameters) {
                var itemDescriptors = [];
                if (parameters &&
                    parameters.length) {
                    for (var index = 0; index < parameters.length; index++) {
                        var tokens = parameters[index].split(ToolbarCommands._itemDelimiter);
                        if (tokens) {
                            var itemDescriptor = new menuComponents.ToolbarItemDescriptor();
                            for (var tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
                                var text = this._convertTextReference(tokens[tokenIndex]);
                                switch (tokenIndex) {
                                    case 0:
                                        {
                                            itemDescriptor.tabName = text;
                                        }
                                        break;
                                    case 1:
                                        {
                                            itemDescriptor.groupName = text;
                                        }
                                        break;
                                    case 2:
                                        {
                                            itemDescriptor.itemName = text;
                                        }
                                        break;
                                }
                            }
                            itemDescriptors.push(itemDescriptor);
                        }
                    }
                }
                return itemDescriptors;
            };
            //
            //
            ToolbarCommands.prototype._convertTextReference = function (text) {
                if (this._libraryId &&
                    (text.length > 1)) {
                    //	check if the text needs to be translated
                    if (text.indexOf("@") === 0) {
                        //	ignore the leading '@' when translating 
                        text = menuComponents.Utilities.app.getResource(this._libraryId, text.substr(1));
                    }
                }
                return text;
            };
            //
            //
            ToolbarCommands.prototype._closeToolbar = function () {
                menuComponents.Utilities.runCommand("CloseToolbar");
            };
            ToolbarCommands._showToolbarTabCommand = "ShowToolbarTabs";
            ToolbarCommands._hideToolbarTabCommand = "HideToolbarTabs";
            ToolbarCommands._showToolbarGroupCommand = "ShowToolbarGroups";
            ToolbarCommands._hideToolbarGroupCommand = "HideToolbarGroups";
            ToolbarCommands._showToolbarItemsCommand = "ShowToolbarItems";
            ToolbarCommands._hideToolbarItemsCommand = "HideToolbarItems";
            //
            ToolbarCommands._compactToolbarView = "CompactToolbarView";
            ToolbarCommands._tabbedToolbarView = "TabbedToolbarView";
            //
            ToolbarCommands._isEnabledProperty = "isEnabled";
            ToolbarCommands._libraryIdProperty = "libraryId";
            ToolbarCommands._itemDelimiter = ":";
            return ToolbarCommands;
        })();
        menuComponents.ToolbarCommands = ToolbarCommands;
    })(menuComponents = dds.menuComponents || (dds.menuComponents = {}));
})(dds || (dds = {}));
var dds;
(function (dds) {
    var menuComponents;
    (function (menuComponents) {
        //
        var ToolbarGroupData = (function () {
            function ToolbarGroupData() {
            }
            return ToolbarGroupData;
        })();
        //
        //
        var IndexedGroupData = (function () {
            function IndexedGroupData() {
            }
            return IndexedGroupData;
        })();
        //
        var ToolbarGroups = (function () {
            function ToolbarGroups() {
            }
            //
            ToolbarGroups.initialize = function (toolbarViewModel) {
                this._toolbarViewModel = toolbarViewModel;
                this._groupDataArray = [];
            };
            //
            //
            ToolbarGroups.addGroups = function (itemDescriptors) {
                var _this = this;
                if (!itemDescriptors ||
                    !itemDescriptors.length) {
                    return false;
                }
                var result = true;
                dojo.forEach(itemDescriptors, function (itemDescriptor) {
                    result = _this._addGroup(itemDescriptor) && result;
                });
                return result;
            };
            //
            //
            ToolbarGroups.removeGroups = function (itemDescriptors) {
                var _this = this;
                if (!itemDescriptors ||
                    !itemDescriptors.length) {
                    return false;
                }
                var result = true;
                dojo.forEach(itemDescriptors, function (itemDescriptor) {
                    result = _this._removeGroup(itemDescriptor) && result;
                });
                return result;
            };
            //
            //
            ToolbarGroups.findGroupWithName = function (name, tabGroup) {
                if (name &&
                    tabGroup) {
                    var items = tabGroup.items.getItems();
                    for (var index = 0; index < items.length; index++) {
                        //	the items within the tab group are either be from the 'ToolbarGroupBase' (group) or the 'ToolbarGroupItemBase' (item) Geocortex Class;
                        //	both Classes have the 'name' property but only the 'ToolbarGroupBase' (group) has the 'items' property; only the groups are processed
                        if ((items[index].name.get() === name) &&
                            (ToolbarGroups._itemsProperty in items[index])) {
                            var groupData = new IndexedGroupData();
                            groupData.data = items[index];
                            groupData.index = index;
                            return groupData;
                        }
                    }
                }
                return null;
            };
            //
            //
            ToolbarGroups._addGroup = function (itemDescriptor) {
                //	locate the group within the internal array
                var groupData = this._getStoredGroupData(itemDescriptor.tabName, itemDescriptor.groupName);
                if (groupData) {
                    //	if the parent tab was previously empty and removed - re-add it
                    if (groupData.tabRemoved) {
                        menuComponents.ToolbarTabs.addTabs([itemDescriptor]);
                    }
                    //	re-add the tab group
                    this._addGroupToTab(itemDescriptor, groupData);
                    //	remove the entry from the internal storage array
                    this._deleteStoredGroupData(groupData);
                }
                return false;
            };
            //
            //
            ToolbarGroups._addGroupToTab = function (itemDescriptor, groupData) {
                //	locate the top-level tab
                var tab = menuComponents.ToolbarTabs.findTabWithName(itemDescriptor.tabName, this._toolbarViewModel);
                if (tab) {
                    //	calculate the insertion index
                    var index;
                    if (groupData.initialIndex <= tab.data.items.length()) {
                        index = groupData.initialIndex;
                    }
                    else {
                        index = tab.data.items.length();
                    }
                    tab.data.items.insertItem(index, groupData.groupObject);
                }
            };
            //
            //
            ToolbarGroups._removeGroup = function (itemDescriptor) {
                //	locate the top-level tab
                var tab = menuComponents.ToolbarTabs.findTabWithName(itemDescriptor.tabName, this._toolbarViewModel);
                if (tab) {
                    //	locate the group within the tab
                    var group = ToolbarGroups.findGroupWithName(itemDescriptor.groupName, tab.data);
                    if (group) {
                        //	store the group data so that it can be added back to the Toolbar
                        this._storeGroupData(itemDescriptor.tabName, group);
                        //	remove the group from the tab
                        this._removeGroupAtIndex(tab, group);
                        return true;
                    }
                }
                return false;
            };
            //
            //
            ToolbarGroups._removeGroupAtIndex = function (tab, group) {
                tab.data.items.removeAt(group.index);
                //	if there are no groups/items within the tab - remove the tab
                if (!tab.data.items.length()) {
                    var itemDescriptor = new menuComponents.ToolbarItemDescriptor();
                    itemDescriptor.tabName = tab.data.name.get();
                    if (menuComponents.ToolbarTabs.removeTabs([itemDescriptor])) {
                        var groupData = this._getStoredGroupData(tab.data.name.get(), group.data.name.get());
                        groupData.tabRemoved = true;
                    }
                }
            };
            //
            //
            ToolbarGroups._storeGroupData = function (tabName, group) {
                var groupData = new ToolbarGroupData();
                groupData.groupObject = group.data;
                groupData.tabName = tabName;
                groupData.groupName = group.data.name.get();
                groupData.initialIndex = group.index;
                this._groupDataArray.push(groupData);
            };
            //
            //
            ToolbarGroups._getStoredGroupData = function (tabName, groupName) {
                for (var index = 0; index < this._groupDataArray.length; index++) {
                    if ((this._groupDataArray[index].tabName === tabName) &&
                        (this._groupDataArray[index].groupName === groupName)) {
                        return this._groupDataArray[index];
                    }
                }
                return null;
            };
            //
            //
            ToolbarGroups._deleteStoredGroupData = function (groupData) {
                for (var index = 0; index < this._groupDataArray.length; index++) {
                    if ((this._groupDataArray[index].tabName === groupData.tabName) &&
                        (this._groupDataArray[index].groupName === groupData.groupName)) {
                        this._groupDataArray.splice(index, 1);
                        return true;
                    }
                }
                return false;
            };
            ToolbarGroups._toolbarGroupsProperty = "toolbarGroups";
            ToolbarGroups._itemsProperty = "items";
            return ToolbarGroups;
        })();
        menuComponents.ToolbarGroups = ToolbarGroups;
    })(menuComponents = dds.menuComponents || (dds.menuComponents = {}));
})(dds || (dds = {}));
var dds;
(function (dds) {
    var menuComponents;
    (function (menuComponents) {
        var ToolbarItemDescriptor = (function () {
            function ToolbarItemDescriptor() {
            }
            return ToolbarItemDescriptor;
        })();
        menuComponents.ToolbarItemDescriptor = ToolbarItemDescriptor;
    })(menuComponents = dds.menuComponents || (dds.menuComponents = {}));
})(dds || (dds = {}));
var dds;
(function (dds) {
    var menuComponents;
    (function (menuComponents) {
        //
        var ToolbarItemData = (function () {
            function ToolbarItemData() {
            }
            return ToolbarItemData;
        })();
        //
        //
        var IndexedItemData = (function () {
            function IndexedItemData() {
            }
            return IndexedItemData;
        })();
        //
        //
        var ItemParentType;
        (function (ItemParentType) {
            ItemParentType[ItemParentType["Tab"] = 0] = "Tab";
            ItemParentType[ItemParentType["Group"] = 1] = "Group";
        })(ItemParentType || (ItemParentType = {}));
        ;
        //
        var ToolbarItems = (function () {
            function ToolbarItems() {
            }
            //
            ToolbarItems.initialize = function (toolbarViewModel) {
                this._toolbarViewModel = toolbarViewModel;
                this._itemDataArray = [];
            };
            //
            //
            ToolbarItems.addItems = function (itemDescriptors) {
                var _this = this;
                if (!itemDescriptors ||
                    !itemDescriptors.length) {
                    return false;
                }
                var result = true;
                dojo.forEach(itemDescriptors, function (itemDescriptor) {
                    result = _this._addItem(itemDescriptor) && result;
                });
                return result;
            };
            //
            //
            ToolbarItems.removeItems = function (itemDescriptors) {
                var _this = this;
                if (!itemDescriptors ||
                    !itemDescriptors.length) {
                    return false;
                }
                var result = true;
                dojo.forEach(itemDescriptors, function (itemDescriptor) {
                    result = _this._removeItem(itemDescriptor) && result;
                });
                return result;
            };
            //
            //
            ToolbarItems._addItem = function (itemDescriptor) {
                //	locate the item within the internal array
                var itemData = this._getStoredItemData(itemDescriptor);
                if (itemData) {
                    //	if the parent tab/group was previously empty and removed - re-add it
                    if (itemData.groupRemoved) {
                        if (itemData.parentType === ItemParentType.Tab) {
                            menuComponents.ToolbarTabs.addTabs([itemDescriptor]);
                        }
                        else {
                            menuComponents.ToolbarGroups.addGroups([itemDescriptor]);
                        }
                    }
                    //	re-add the item to the group
                    this._addItemToGroup(itemDescriptor, itemData);
                    //	remove the entry from the internal storage array
                    this._deleteStoredItemData(itemData);
                }
                return false;
            };
            //
            //
            ToolbarItems._addItemToGroup = function (itemDescriptor, itemData) {
                var group;
                if (itemData.parentType === ItemParentType.Tab) {
                    var tab = menuComponents.ToolbarTabs.findTabWithName(itemDescriptor.tabName, this._toolbarViewModel);
                    group = tab.data;
                }
                else {
                    group = itemData.parent;
                }
                if (group) {
                    //	calculate the insertion index
                    var index;
                    if (itemData.initialIndex <= group.items.length()) {
                        index = itemData.initialIndex;
                    }
                    else {
                        index = group.items.length();
                    }
                    group.items.insertItem(index, itemData.itemObject);
                }
            };
            //
            //
            ToolbarItems._removeItem = function (itemDescriptor) {
                //	locate the top-level tab
                var tab = menuComponents.ToolbarTabs.findTabWithName(itemDescriptor.tabName, this._toolbarViewModel);
                if (tab) {
                    var item = this._getItemFromGroup(itemDescriptor, tab);
                    if (item) {
                        //	store the item data so that it can be added back to the Group/Toolbar
                        this._storeItemData(itemDescriptor, item);
                        //	remove the item
                        this._removeItemAtIndex(item.parent, item, itemDescriptor);
                        return true;
                    }
                }
                return false;
            };
            //
            //
            ToolbarItems._removeItemAtIndex = function (group, item, itemDescriptor) {
                group.items.removeAt(item.index);
                //	if there are no items left within the group/tab - remove the parent
                if (!group.items.length()) {
                    var result;
                    if (item.parentType === ItemParentType.Tab) {
                        result = menuComponents.ToolbarTabs.removeTabs([itemDescriptor]);
                    }
                    else {
                        result = menuComponents.ToolbarGroups.removeGroups([itemDescriptor]);
                    }
                    if (result) {
                        var itemData = this._getStoredItemData(itemDescriptor);
                        itemData.parentType = item.parentType;
                        itemData.groupRemoved = true;
                    }
                }
            };
            //
            //
            ToolbarItems._getItemFromGroup = function (itemDescriptor, tab) {
                var item;
                //	check if the item is a descendent of the tab or a group
                if (itemDescriptor.groupName &&
                    (itemDescriptor.groupName !== ToolbarItems._noneKeyword)) {
                    //	locate the group within the tab
                    var group = menuComponents.ToolbarGroups.findGroupWithName(itemDescriptor.groupName, tab.data);
                    if (group) {
                        //	locate the item within the group
                        return this._findItemWithName(itemDescriptor.itemName, group.data, ItemParentType.Group);
                    }
                }
                else {
                    //	locate the item within the tab
                    return this._findItemWithName(itemDescriptor.itemName, tab.data, ItemParentType.Tab);
                }
            };
            //
            //
            ToolbarItems._findItemWithName = function (name, group, parentType) {
                if (name &&
                    group) {
                    var items = group.items.getItems();
                    for (var index = 0; index < items.length; index++) {
                        //	the items can either be from the 'ToolbarGroupBase' (group) or the 'ToolbarGroupItemBase' (item) Geocortex Class;
                        //	both Classes have the 'name' property but only the 'ToolbarGroupBase' (group) has the 'items' property
                        if ((items[index].name.get() === name) &&
                            !(ToolbarItems._itemsProperty in items[index])) {
                            var itemData = new IndexedItemData();
                            itemData.parent = group;
                            itemData.itemData = items[index];
                            itemData.index = index;
                            itemData.parentType = parentType;
                            return itemData;
                        }
                    }
                }
                return null;
            };
            //
            //
            ToolbarItems._storeItemData = function (itemDescriptor, item) {
                var itemData = new ToolbarItemData();
                itemData.parent = item.parent;
                itemData.itemObject = item.itemData;
                itemData.tabName = itemDescriptor.tabName;
                itemData.groupName = itemDescriptor.groupName;
                itemData.itemName = itemDescriptor.itemName;
                itemData.initialIndex = item.index;
                itemData.parentType = item.parentType;
                itemData.groupRemoved = false;
                this._itemDataArray.push(itemData);
            };
            //
            //
            ToolbarItems._getStoredItemData = function (itemDescriptor) {
                for (var index = 0; index < this._itemDataArray.length; index++) {
                    if ((this._itemDataArray[index].tabName === itemDescriptor.tabName) &&
                        (this._itemDataArray[index].groupName === itemDescriptor.groupName) &&
                        (this._itemDataArray[index].itemName === itemDescriptor.itemName)) {
                        return this._itemDataArray[index];
                    }
                }
                return null;
            };
            //
            //
            ToolbarItems._deleteStoredItemData = function (itemData) {
                for (var index = 0; index < this._itemDataArray.length; index++) {
                    if (this._itemDataArray[index] === itemData) {
                        this._itemDataArray.splice(index, 1);
                        return true;
                    }
                }
                return false;
            };
            ToolbarItems._itemsProperty = "items";
            ToolbarItems._noneKeyword = "NONE";
            return ToolbarItems;
        })();
        menuComponents.ToolbarItems = ToolbarItems;
    })(menuComponents = dds.menuComponents || (dds.menuComponents = {}));
})(dds || (dds = {}));
var dds;
(function (dds) {
    var menuComponents;
    (function (menuComponents) {
        /**
        * @remarks:	there is no documented Geocortex definition for the 'Tab' Class
        */
        //
        var ToolbarTabData = (function () {
            function ToolbarTabData() {
            }
            return ToolbarTabData;
        })();
        //
        //
        var IndexedTabData = (function () {
            function IndexedTabData() {
            }
            return IndexedTabData;
        })();
        //
        var ToolbarTabs = (function () {
            function ToolbarTabs() {
            }
            //
            ToolbarTabs.initialize = function (toolbarViewModel) {
                if (!this._initialized) {
                    this._toolbarViewModel = toolbarViewModel;
                    this._tabDataArray = [];
                    //	get snapshots of the initial/unmodified Toolbar tab data
                    this._getInitialTabData();
                }
            };
            //
            //
            ToolbarTabs.addTabs = function (itemDescriptors) {
                var _this = this;
                if (!itemDescriptors ||
                    !itemDescriptors.length) {
                    return false;
                }
                var result = true;
                var count = 0;
                dojo.forEach(itemDescriptors, function (itemDescriptor) {
                    result = _this._addTab(itemDescriptor.tabName) && result;
                });
                return result;
            };
            //
            /**
            * @remarks:	if all the Toolbar Tabs are removed - Geocortex will also remove the Toolbar button
            */
            //
            ToolbarTabs.removeTabs = function (itemDescriptors) {
                var _this = this;
                if (!itemDescriptors ||
                    !itemDescriptors.length) {
                    return false;
                }
                var result = true;
                dojo.forEach(itemDescriptors, function (itemDescriptor) {
                    result = _this._removeTab(itemDescriptor.tabName) && result;
                });
                return result;
            };
            //
            //
            ToolbarTabs.findTabWithName = function (name, toolbarViewModel) {
                if (name &&
                    (ToolbarTabs._toolbarGroupsProperty in toolbarViewModel)) {
                    var toolbarGroups = toolbarViewModel[ToolbarTabs._toolbarGroupsProperty].get();
                    for (var index = 0; index < toolbarGroups.length; index++) {
                        if (toolbarGroups[index].name.get() === name) {
                            var tabData = new IndexedTabData();
                            tabData.data = toolbarGroups[index];
                            tabData.index = index;
                            return tabData;
                        }
                    }
                }
                return null;
            };
            //
            //
            ToolbarTabs._addTab = function (tabName) {
                //	locate the tab within the internal array
                for (var index = 0; index < this._tabDataArray.length; index++) {
                    if ((this._tabDataArray[index].tabName === tabName) &&
                        this._tabDataArray[index]) {
                        //	add the tab back to the main toolbar group
                        this._addTabGroup(index);
                        //	add the tab button
                        this._addTabButton(index);
                        //	if there were no Tabs within the Toolbar - set the newly added Tab as the active tool group
                        if (this._toolbarViewModel[ToolbarTabs._toolbarTabsProperty].length() === 1) {
                            this._updateCurrentToolbarGroup(tabName);
                        }
                        return true;
                    }
                }
                return false;
            };
            //
            //
            ToolbarTabs._addTabGroup = function (internalIndex) {
                var index;
                if (this._tabDataArray[internalIndex].initialIndex <= this._toolbarViewModel[ToolbarTabs._toolbarGroupsProperty].length()) {
                    index = this._tabDataArray[internalIndex].initialIndex;
                }
                else {
                    index = this._toolbarViewModel[ToolbarTabs._toolbarGroupsProperty].length();
                    this._tabDataArray[internalIndex].currentIndex = index;
                }
                this._toolbarViewModel[ToolbarTabs._toolbarGroupsProperty].insertItem(index, this._tabDataArray[index].groupObject);
                //	null the internal group field
                this._tabDataArray[internalIndex].groupObject = null;
            };
            //
            //
            ToolbarTabs._addTabButton = function (internalIndex) {
                var index = ((this._tabDataArray[internalIndex].initialIndex <= this._toolbarViewModel[ToolbarTabs._toolbarTabsProperty].length()) ?
                    this._tabDataArray[internalIndex].initialIndex :
                    this._toolbarViewModel[ToolbarTabs._toolbarTabsProperty].length());
                /*
                //	conditionally reactivate the tab
                if (this._toolbarViewModel[ToolbarTabs._toolbarTabsProperty].length() === 0) {
                    this._tabDataArray[internalIndex].tabObject[ToolbarTabs._isActiveProperty].set(true);
                }
                */
                //	set the newly added Tab as the active one
                dojo.forEach(this._toolbarViewModel[ToolbarTabs._toolbarTabsProperty].getItems(), function (tab) {
                    if (tab[ToolbarTabs._isActiveProperty].get() === true) {
                        tab[ToolbarTabs._isActiveProperty].set(false);
                    }
                });
                this._tabDataArray[internalIndex].tabObject[ToolbarTabs._isActiveProperty].set(true);
                //	re-add the tab
                this._toolbarViewModel[ToolbarTabs._toolbarTabsProperty].insertItem(index, this._tabDataArray[index].tabObject);
                //	null the internal tab field
                this._tabDataArray[internalIndex].tabObject = null;
            };
            //
            //
            ToolbarTabs._removeTab = function (tabName) {
                var tab = ToolbarTabs.findTabWithName(tabName, this._toolbarViewModel);
                if (tab) {
                    //	store the tab data
                    this._tabDataArray[this._getInternalTabIndex(tabName)].groupObject = tab.data;
                    //	remove the tab from the main toolbar group
                    this._toolbarViewModel[ToolbarTabs._toolbarGroupsProperty].removeAt(tab.index);
                    //	remove the Tab button from the Toolbar
                    var tabName = this._removeTabButton(tabName);
                    if (tabName) {
                        //	update the active tool group
                        this._updateCurrentToolbarGroup(tabName);
                    }
                    return true;
                }
                return false;
            };
            //
            //
            ToolbarTabs._removeTabButton = function (tabName) {
                if (ToolbarTabs._toolbarTabsProperty in this._toolbarViewModel) {
                    //	locate the tab index in the internal array
                    var internalIndex = this._getInternalTabIndex(tabName);
                    //	remove the tab
                    var tabs = this._toolbarViewModel[ToolbarTabs._toolbarTabsProperty].getItems();
                    for (var index = 0; index < tabs.length; index++) {
                        if (tabs[index][ToolbarTabs._titleProperty].get() === tabName) {
                            //	store the tab object (mark as 'inactive' while in storage)
                            this._tabDataArray[internalIndex].tabObject = this._toolbarViewModel[ToolbarTabs._toolbarTabsProperty].getAt(index);
                            this._tabDataArray[internalIndex].tabObject[ToolbarTabs._isActiveProperty].set(false);
                            //	remove the tab
                            this._toolbarViewModel[ToolbarTabs._toolbarTabsProperty].removeAt(index);
                            //	if the removed tab was marked as active - activate the first tab button; otherwise - nothing further is done
                            return this._updateActiveTab(internalIndex);
                        }
                    }
                }
                return "";
            };
            //
            //
            ToolbarTabs._updateActiveTab = function (removalIndex) {
                //	if the removed tab was marked as active - activate the first tab button
                if (this._tabDataArray[removalIndex].isActive) {
                    this._tabDataArray[removalIndex].isActive = false;
                    var tabs = this._toolbarViewModel[ToolbarTabs._toolbarTabsProperty].getItems();
                    if (tabs.length) {
                        tabs[0][ToolbarTabs._isActiveProperty].set(true);
                        //	update the active tab in the internal array
                        var activeName = tabs[0][ToolbarTabs._titleProperty].get();
                        var internalIndex = this._getInternalTabIndex(activeName);
                        this._tabDataArray[internalIndex].isActive = true;
                        //	return the name of the newly activated tab
                        return activeName;
                    }
                }
                return "";
            };
            //
            //
            ToolbarTabs._updateCurrentToolbarGroup = function (tabName) {
                var currentGroup = this._toolbarViewModel[ToolbarTabs._currentToolbarGroupProperty].get();
                if (currentGroup) {
                    //	determine if the input tab name corresponds to the active toolbar group
                    if (currentGroup.name.get() !== tabName) {
                        var toolbarGroups = this._toolbarViewModel[ToolbarTabs._toolbarGroupsProperty].get();
                        for (var index = 0; index < toolbarGroups.length; index++) {
                            if (toolbarGroups[index].name.get() === tabName) {
                                this._toolbarViewModel[ToolbarTabs._currentToolbarGroupProperty].set(toolbarGroups[index]);
                                //	change both the Tab/Group status to 'active'
                                if (ToolbarTabs._isActiveProperty in this._toolbarViewModel[ToolbarTabs._currentToolbarGroupProperty].get()) {
                                    this._toolbarViewModel[ToolbarTabs._currentToolbarGroupProperty].get().isActive.set(true);
                                }
                                break;
                            }
                        }
                    }
                }
            };
            //
            //
            ToolbarTabs._getInitialTabData = function () {
                if (ToolbarTabs._toolbarTabsProperty in this._toolbarViewModel) {
                    var tabs = this._toolbarViewModel[ToolbarTabs._toolbarTabsProperty].getItems();
                    for (var index = 0; index < tabs.length; index++) {
                        if ((ToolbarTabs._titleProperty in tabs[index]) &&
                            (ToolbarTabs._isActiveProperty in tabs[index])) {
                            var tabData = new ToolbarTabData();
                            tabData.tabName = tabs[index][ToolbarTabs._titleProperty].get();
                            tabData.initialIndex = index;
                            tabData.isActive = tabs[index][ToolbarTabs._isActiveProperty].get();
                            this._tabDataArray.push(tabData);
                        }
                    }
                }
            };
            //
            //
            ToolbarTabs._getInternalTabIndex = function (tabName) {
                for (var index = 0; index < this._tabDataArray.length; index++) {
                    if (this._tabDataArray[index].tabName === tabName) {
                        return index;
                    }
                }
                return -1;
            };
            ToolbarTabs._toolbarTabsProperty = "toolbarTabs";
            ToolbarTabs._toolbarGroupsProperty = "toolbarGroups";
            ToolbarTabs._currentToolbarGroupProperty = "currToolbarGrp";
            ToolbarTabs._isActiveProperty = "isActive";
            ToolbarTabs._titleProperty = "title";
            ToolbarTabs._initialized = false;
            return ToolbarTabs;
        })();
        menuComponents.ToolbarTabs = ToolbarTabs;
    })(menuComponents = dds.menuComponents || (dds.menuComponents = {}));
})(dds || (dds = {}));
/// <reference path="../../../Libs/Framework.d.ts" />
/// <reference path="../../../Libs/Mapping.Infrastructure.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dds;
(function (dds) {
    var menuComponents;
    (function (menuComponents) {
        var MenuComponentsModule = (function (_super) {
            __extends(MenuComponentsModule, _super);
            //
            function MenuComponentsModule(app, library) {
                _super.call(this, app, library);
                this._siteInitialized = false;
                //	store the global app object
                menuComponents.Utilities.app = app;
                menuComponents.Utilities.libraryId = this.libraryId;
            }
            //
            //
            MenuComponentsModule.prototype.initialize = function (config) {
                var _this = this;
                var site = this.app.site;
                if (site && site.isInitialized) {
                    this._onSiteInitialized(site);
                }
                else {
                    this.app.eventRegistry.event("SiteInitializedEvent").subscribe(this, function (args) {
                        _this._onSiteInitialized(args);
                    });
                }
                //	Map initialization
                this.app.eventRegistry.event("SiteServiceLayersLoadedEvent").subscribe(this, function (site) {
                    menuComponents.Utilities.map = site.getMap();
                });
            };
            //
            //
            MenuComponentsModule.prototype._onSiteInitialized = function (site) {
                this._siteInitialized = true;
                menuComponents.Utilities.site = site;
                //	initialize the individual components
                this._initializeComponents();
            };
            //
            //
            MenuComponentsModule.prototype._initializeComponents = function () {
                this._toolbarCommands = new menuComponents.ToolbarCommands();
                this._menuItems = new menuComponents.MenuItems();
            };
            return MenuComponentsModule;
        })(geocortex.framework.application.ModuleBase);
        menuComponents.MenuComponentsModule = MenuComponentsModule;
    })(menuComponents = dds.menuComponents || (dds.menuComponents = {}));
})(dds || (dds = {}));
var dds;
(function (dds) {
    var menuComponents;
    (function (menuComponents) {
        var MenuComponentsModuleView = (function (_super) {
            __extends(MenuComponentsModuleView, _super);
            //
            function MenuComponentsModuleView(app, library) {
                _super.call(this, app, library);
            }
            return MenuComponentsModuleView;
        })(geocortex.framework.ui.ViewBase);
        menuComponents.MenuComponentsModuleView = MenuComponentsModuleView;
    })(menuComponents = dds.menuComponents || (dds.menuComponents = {}));
})(dds || (dds = {}));
var dds;
(function (dds) {
    var menuComponents;
    (function (menuComponents) {
        var MenuComponentsModuleViewModel = (function (_super) {
            __extends(MenuComponentsModuleViewModel, _super);
            //
            function MenuComponentsModuleViewModel(app, library) {
                _super.call(this, app, library);
            }
            //
            //
            MenuComponentsModuleViewModel.prototype.initialize = function (config) {
            };
            return MenuComponentsModuleViewModel;
        })(geocortex.framework.ui.ViewModelBase);
        menuComponents.MenuComponentsModuleViewModel = MenuComponentsModuleViewModel;
    })(menuComponents = dds.menuComponents || (dds.menuComponents = {}));
})(dds || (dds = {}));
var gcInfrastructure = geocortex.essentialsHtmlViewer.mapping.infrastructure;
var gcMenus = geocortex.essentialsHtmlViewer.mapping.infrastructure.menus;
var gcUi = geocortex.framework.ui;
var gcToolbar = geocortex.essentialsHtmlViewer.mapping.infrastructure.toolbarGroup;
//
//
var VisibilityCommand;
(function (VisibilityCommand) {
    VisibilityCommand[VisibilityCommand["Hide"] = 0] = "Hide";
    VisibilityCommand[VisibilityCommand["Show"] = 1] = "Show";
})(VisibilityCommand || (VisibilityCommand = {}));
;
//
var dds;
(function (dds) {
    var menuComponents;
    (function (menuComponents) {
        /**
        * @summary: This Class 'injects' an 'Export to Kml' menu item in the results list manually; this can also be done by adding two entries to the
        *			'Default.json.js' file (the '"id": "ResultsListActions"' section and the '"id": "ResultsTableActions"' sections)
        */
        var Utilities = (function () {
            function Utilities() {
            }
            Object.defineProperty(Utilities, "app", {
                //
                get: function () {
                    return Utilities._app;
                },
                set: function (value) {
                    Utilities._app = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Utilities, "site", {
                get: function () {
                    return Utilities._site;
                },
                set: function (value) {
                    Utilities._site = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Utilities, "map", {
                get: function () {
                    return Utilities._map;
                },
                set: function (value) {
                    Utilities._map = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Utilities, "libraryId", {
                get: function () {
                    return Utilities._libraryId;
                },
                set: function (value) {
                    Utilities._libraryId = value;
                },
                enumerable: true,
                configurable: true
            });
            //
            //
            Utilities.validateNonNull = function () {
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i - 0] = arguments[_i];
                }
                dojo.forEach(parameters, function (parameter) {
                    if (!parameter) {
                        throw TypeError("Invalid argument");
                    }
                });
            };
            //
            //
            Utilities.runCommand = function (name) {
                var parameters = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    parameters[_i - 1] = arguments[_i];
                }
                Utilities.validateNonNull(name);
                //	check if the Command exists within the command registry
                var commands = Utilities.app.commandRegistry.commands;
                var command = commands[name];
                if (!command) {
                    throw Error("The Command was not found");
                }
                /*
                command.preExecute.subscribe(this, () => {
                        alert("pre-command");
                });
                command.postExecute.subscribe(this, () => {
                        alert("post-command");
                });
                */
                //	the input parameter list cannot be passed-in directly to the 'Command.execute()' function -
                //	so convert the parameter list into a usable one
                //	NOTE:	trying to separate this into a different method caused issues
                var params = null;
                if (parameters &&
                    (parameters.length > 0)) {
                    params = [];
                    dojo.forEach(parameters, function (parameter) {
                        dojo.forEach(parameter, function (param) {
                            params.push(param);
                        });
                    });
                }
                //	run the command
                command.execute.apply(command, params);
            };
            //
            //
            Utilities.displayStatus = function (statusText, busyAnimation, timeout) {
                Utilities.validateNonNull(statusText);
                var parameters = [];
                if (busyAnimation ||
                    timeout) {
                    parameters.push({
                        text: statusText,
                        showBusyIcon: (busyAnimation ? busyAnimation : false),
                        timeoutMS: (timeout ? timeout : 0)
                    });
                }
                else {
                    parameters.push(statusText);
                }
                Utilities.runCommand("AddStatus", parameters);
            };
            //
            //
            Utilities.removeStatus = function () {
                Utilities.runCommand("RemoveStatus", []);
            };
            //
            //	commented-out since it is not working
            /*
            public static displayModalAlert(	messageText:		string,
                                                titleText?:			string,
                                                dismissCallback?:	() => void): void {
    
                Utilities.validateNonNull(messageText);
                var parameters: any[] = [];
                parameters.push(messageText);
                parameters.push(titleText ? titleText : "");
                if (dismissCallback) {
                    parameters.push(dismissCallback);
                }
                Utilities.runCommand(	"Alert",
                                        parameters);
            }
            */
            //
            //
            Utilities.generateRandomText = function (length) {
                var characterBase = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var text = "";
                //	the index end can be adjusted for a longer/shorter text string
                for (var i = 0; i < length; i++) {
                    text += characterBase.charAt(Math.floor(Math.random() * characterBase.length));
                }
                return text;
            };
            //
            //
            Utilities.isIE9 = function () {
                if (window.File &&
                    window.FileReader &&
                    window.FileList &&
                    window.Blob) {
                    return false;
                }
                else {
                    return true;
                }
            };
            return Utilities;
        })();
        menuComponents.Utilities = Utilities;
    })(menuComponents = dds.menuComponents || (dds.menuComponents = {}));
})(dds || (dds = {}));
//# sourceMappingURL=custom_ts_out.js.map

/* End Script: D:/Geocortex - Components/MenuComponents/custom_ts_out.js ------------------------- */ 

geocortex.resourceManager.register("MenuComponents","inv","Modules/View/MenuComponentsModuleView.html","html","");
geocortex.resourceManager.register("MenuComponents","inv","Modules/View/MenuComponentsModule.css","css","DQoNCiNjdXN0b20tY29udGFpbmVyIHsNCgkvKiBwcmV2ZW50IHRleHQgaGlnaGxpZ2h0aW5nICovDQoJLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lOw0KCS13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7DQoJLW1vei11c2VyLXNlbGVjdDogbm9uZTsNCgktbXMtdXNlci1zZWxlY3Q6IG5vbmU7DQoJdXNlci1zZWxlY3Q6IG5vbmU7DQp9DQoNCg==");
geocortex.resourceManager.register("MenuComponents","inv","Invariant","json","eyJzYW1wbGUtdGV4dCI6IiJ9");

geocortex.framework.notifyLibraryDownload("MenuComponents");
