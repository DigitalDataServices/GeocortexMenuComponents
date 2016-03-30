# Geocortex Menu Components

JavaScript library for the Geocortex Viewer for HTML5 to hide or show menu items and/or toolbar components. This library requires that the components being removed to exist within the Geocortex Viewer for HTML5. Components are not dynamically added, only temporarily hidden.

Hide and Show the following items in Geocortex Viewer for HTML5:

* I Want To... Menu items
* Results Menu items
* Compact Toolbar tool items
* Full Toolbar tabs, groups, and tool items

**Requirements**

Geocortex Essentials 4.4.3 and Geocortex Viewer for HTML5 2.5.2 and tested on beta versions of Geocortex Essentials 4.5 and Geocortex Viewer for HTML5 2.6. It may run on earlier versions of Geocortex Essentials and Geocortex Viewer for HTML5 but has not been tested.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
	* [I Want To... Menu](#i-want-to-menu)
	* [Results Menu](#results-menu)
	* [Compact Toolbar](#compact-toolbar)
	* [Full Toolbar](#full-toolbar)
* [History](#history)
* [Credits](#credits)
* [License](#license)

## Installation

This JavaScript module can be installed in either a Geocortex HTML5 Viewer or within a specific site's viewer.

**Geocortex HTML5 Viewer Installation** - Available to all Geocortex HTML5 Viewers.

1. Locate your Geocortex HTML5 directory, typically found at 
`C:\inetpub\wwwroot\Html5Viewer\`
2. Navigate to the `...\Resources\Scripts\` folder and create a new directory called `CustomScripts`


**Site Specific Installation** - For only a specific Geocortex HTML5 Viewer.

1. Locate your Geocortex HTML5 Site directory, typically found at 
`C:\Program Files (x86)\Latitude Geographics\Geocortex Essentials\Default\REST Elements\Sites\`
2. Navigate to the Site HTML5 Virtual Directory, typically found at 
`...\YourSiteName\Viewers\YourHTML5ViewerName\VirtualDirectory\`
3. In the `Resources` directory create a new directory called `CustomScripts`


**Configure Viewers for both Viewer and Site Specific Installations**

1. Copy the [`MenuComponents.js`](https://raw.githubusercontent.com/DigitalDataServices/GeocortexMenuComponents/master/MenuComponents.js) file into the `CustomScripts` directory.
2. Next locate the `Desktop`, `Tablet`, and `Handheld` configuration files, typically located at 
`...\Resources\Config\Default\` directory.
3. Repeat the following steps for all three configuration files (`Desktop`, `Tablet`, and `Handheld`):
	1. Make a backup of the configuration file!
	2. Open the configuration file in a file editor of your choice, such as [Notepad++](https://notepad-plus-plus.org/).
	3. Within the `libraries` section add the following code where the `uri` is the relative path to the `MenuComponents.js` file using the appropriate code for your installation:

        ```
		//Path if using a Geocortex HTML5 Viewer Installation
		{
		  "id": "MenuComponents",
		    "uri": "Resources/Scripts/Custom Scripts/MenuComponents.js",
		    "locales":[
		    ]
		}
        ```

        ```
		//Path if using a Site Specific Installation
        {
          "id": "MenuComponents",
            "uri": "{ViewerConfigUri}../../Custom Scripts/MenuComponents.js",
            "locales":[
            ]
        }
        ```

    4. Within the `modules` section add the following code:
    
        ```
        {
          "moduleName": "MenuComponents",
          "moduleType": "dds.menuComponents.MenuComponentsModule",
          "libraryId": "MenuComponents",
          "configuration": {
          },
          "views": [
            {
              "id": "MenuComponentsModuleView",
              "viewModelId": "MenuComponentsModuleViewModel",
              "visible": false,
              "markup": "Modules/View/MenuComponentsModuleView.html",
              "type": "dds.menuComponents.MenuComponentsModuleView",
              "region": "TopRightMapRegion",
              "configuration": {
              }
            }
          ],
          "viewModels": [
            {
              "id": "MenuComponentsModuleViewModel",
              "type": "dds.menuComponents.MenuComponentsModuleViewModel",
              "configuration": {}
              }
          ]
        },
        ```
    4. Save the configuration file. *These modifications should be made to all relevant configuration files.*

## Usage

A Geocortex Workflow ([TestMenuWorkflow.xaml](https://raw.githubusercontent.com/DigitalDataServices/GeocortexMenuComponents/master/TestMenuWorkflow.xaml)) has been provided to illustrate all of the examples below.

####I Want to... Menu####

**Commands**

| Command | Parameter | Parameter Example | Description |
| --- | --- | --- | --- |
| `HideIWantToMenuItems` | `String[]` | `New String(){ "@language-menu-home-panel", "@language-menu-zoom-initial-extent" }` | Hides I Want To... menu items |
| `ShowIWantToMenuItems` | `String[]` | `New String(){ "@language-menu-home-panel", "@language-menu-zoom-initial-extent" }` | Shows I Want To... menu items |

**Example**

1. In the Workflow Designer, create a new string array variable (e.g. `strMenuItemArray = String[]`)
2. Assign the `String[]` with a comma-separated list of the menu item names that you want to either hide or show. *The menu item names can be found by locating the Text field that corresponds to the "I Want To..." menu item while editing that item in the Geocortex Essentials Manager.*

    ```
    //This will hide or show the "View the Home Panel" and "Return to Initial Map Extent" menu items
    strMenuItemArray = New String(){ "@language-menu-home-panel", "@language-menu-zoom-initial-extent" }
    ```

4. Next call a `RunExternalCommand` using either the `HideIWantToMenuItems` or `ShowIWantToMenuItems` as the "Command Name" with `strMenuItemArray` as the "Command Parameter".
5. The "I Want To..." menu items can be shown or hidden as needed during a Viewer session, such as based on whether a user is a Guest or in a specific Role.

####Results Menu####

This command hides or shows Results List Actions from both the List View and the Table View.

**Commands**

| Command | Parameter | Parameter Example | Description |
| --- | --- | --- | --- |
| `HideResultMenuItems` | `String[]` | `New String(){ "@language-menu-export-results-to-shp" }` | Hides Results menu items |
| `ShowResultMenuItems` | `String[]` | `New String(){ "@language-menu-export-results-to-shp" }` | Shows Results menu items |

**Example**

Follow the same steps as for hiding or showing an item from the ["I Want To..." Menu](#i-want-to-menu) (listed above) but change the Command Name and Parameters accordingly.

To find the names of the Results menu items, you will need to open one of the `Desktop`, `Tablet`, and `Handheld` configuration files, typically located in `...\Resources\Config\Default\` directory. Search for the `ResultsListActions` and use the `"text"` property within the `"items"` array. The default Geocortex Results List Actions are:

| Default Results List Action | Description |
| --- | --- |
| `@language-results-toggle-table-view` | Switch to Results List to Results Table |
| `@language-menu-identify-buffered-feature-set-collection` | Shows the Buffer Options |
| `@language-menu-show-charting-view` | Shows the Charting View |
| `@language-menu-export-results-to-csv` | Exports Results List to CSV file |
| `@language-menu-export-results-to-xlsx` | Exports Results List to Microsoft Excel (xlsx) file |
| `@language-menu-export-results-to-shp` | Exports Results List to Esri Shapefile (shp) |
| `@language-menu-run-report` | Runs Report on Results List, if reports are configured |

####Compact Toolbar####

The Compact Toolbar only contains individual items. It does not use Tabs or Groups like the [Full Toolbar](#full-toolbar) below.

**Commands**

| Command | Parameter | Parameter Example | Description |
| --- | --- | --- | --- |
| `HideToolbarItems` | `String[]` | `New String(){ "@language-toolbar-home-sub", "@language-toolbar-navigation-initial-extent"  }` | Hides Toolbar items |
| `ShowToolbarItems` | `String[]` | `New String(){ "@language-toolbar-home-sub", "@language-toolbar-navigation-initial-extent"  }` | Shows Toolbar items |

**Example**

1. In the Workflow Designer, create a new string array variable (e.g. `strToolItemArray = String[]`)
2. Assign the `String[]` with a comma-separated list of the toolbar item names that you want to either hide or show. *The compact toolbar item names can be found by locating the `Name` field while editing that item in the Geocortex Essentials Manager.*

    ```
    //This will hide or show the "Home" and "Initial View" toolbar items
    strToolItemArray = New String(){ "@language-toolbar-home-sub", "@language-toolbar-navigation-initial-extent"  }
    ```

4. Next call a `RunExternalCommand` using either the `HideToolbarItems` or `ShowToolbarItems` as the "Command Name" with `strToolItemArray` as the "Command Parameter".


####Full Toolbar####

In a full toolbar, you can hide or show tabs, groups, or individual items.

**Commands**

| Command | Parameter | Parameter Example | Description |
| --- | --- | --- | --- |
| `HideToolbarGroups` | `String[]` | `New String(){ "@language-toolbar-group-tools:@language-toolbar-group-navigation"   }` | Hides Toolbar groups |
| `HideToolbarItems` | `String[]` | `New String(){ "@language-toolbar-group-tools:@language-toolbar-group-navigation:@language-toolbar-bookmark"  }` | Hides Toolbar items |
| `HideToolbarTabs` | `String[]` | `New String(){ "@language-toolbar-group-tools"  }` | Hides Toolbar tabs |
| `ShowToolbarGroups` | `String[]` | `New String(){ "@language-toolbar-group-tools:@language-toolbar-group-navigation"  }` | Shows Toolbar groups |
| `ShowToolbarItems` | `String[]` | `New String(){ "@language-toolbar-group-tools:@language-toolbar-group-navigation:@language-toolbar-bookmark"  }` | Shows Toolbar items |
| `ShowToolbarTabs` | `String[]` | `New String(){ "@language-toolbar-group-tools"  }` | Shows Toolbar tabs |

**Tab Example**

1. In the Workflow Designer, create a new string array variable (e.g. `strToolbarTabArray = String[]`)
2. Assign the `String[]` with a comma-separated list of the toolbar tab names that you want to either hide or show. *The full toolbar tab name can be found by locating the `Display Name` field while editing the toolbar in the Geocortex Essentials Manager. For example, the Home tab's display name is `@language-toolbar-tab-home`. You can also use `Home` (the translated string name), but it is not recommended if you are using localization.*

    ```
    //This will hide or show the "Home" tab
    strToolbarTabArray = New String(){ "@language-toolbar-tab-home" }
    ```

4. Next call a `RunExternalCommand` using either the `HideToolbarTabs` or `ShowToolbarTabs` as the "Command Name" with `strToolbarTabArray` as the "Command Parameter".
5. Please note that if all the Toolbar tabs are removed, the Toolbar button will not be displayed.

**Group Example**

1. In the Workflow Designer, create a new string array variable (e.g. `strToolbarGroupArray = String[]`)
2. Assign the `String[]` with a comma-separated list of the toolbar group names that you want to either hide or show.
3. The formatting for the tab:group string pairing is as follows: `Tab(name):Group(name)`. So, for example, to hide or show the Navigation group from the Home tab, the input string would look like this:

    ```
    //This will hide or show the "Navigation" group in the "Home" tab
    strToolbarTabArray’ = New String(){ "@language-toolbar-tab-home:@language-toolbar-group-navigation" }
    ```

4. Next call a `RunExternalCommand` using either the `HideToolbarGroups` or `ShowToolbarGroups` as the "Command Name" with `strToolbarTabArray’` as the "Command Parameter".

**Item Example**

1. In the Workflow Designer, create a new string array variable (e.g. `strToolbarItemArray = String[]`)
2. Assign the `String[]` with a comma-separated list of the toolbar item names that you want to either hide or show.
3. The formatting for the tab:group:item string pairing is as follows: `Tab(name):Group(name):Item(name)` or `Tab(name):NONE:Item(name)` (if the item is not a member of a group). So, for example, to hide or show the Bookmarks item from the Navigation group in the Home tab, the input string would look like this:

    ```
    //This will hide or show the "Bookmarks" item from the "Navigation" group in the "Home" tab
    strToolbarItemArray = New String(){ "@language-toolbar-tab-home:@language-toolbar-group-navigation:@language-toolbar-bookmark" }
    ```

4. Next call a `RunExternalCommand` using either the `HideToolbarItems` or `ShowToolbarItems` as the "Command Name" with `strToolbarItemArray’` as the "Command Parameter".

## History

2016-03-30 - Initial upload.


## Credits

Copyright &copy; 2016 [Digital Data Services, Inc.](http://www.digitaldataservices.com/geocortex) All Rights Reserved.

Geocortex and Latitude Geographics are registered trademarks of Latitude Geographics Group Ltd. in the United States and Canada, and are trademarks in other jurisdictions around the world.

## License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

