# Geocortex Menu Components

JavaScript library to hide or show menu items and/or toolbar components within the Geocortex Viewer for HTML5. This library requires that the components being removed exist within the site. Components are not dynamically added only temporarily hidden.

Hide and Show the following items in Geocortex Sites:

* I Want To... Menu items
* Results Menu items
* Compact Toolbar tool items
* Full Toolbar tabs, groups, and tool items

**Requirements**

Geocortex Essentials 4.4.3 and Geocortex Viewer for HTML5 2.5.2 and tested on beta versions of Geocortex Essentials 4.5 and Geocortex Viewer for HTML5 2.6. It may run on earlier versions of Geocortex Essentials and Geocortex Viewer for HTML5 but has not been tested.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
	* [I Want To... Menu](#i-want-to...-menu)
	* [Results Menu](#results-menu)
	* [Compact Toolbar](#compact-toolbar)
	* [Full Toolbar](#full-toolbar)
* [History](#history)
* [Credits](#credits)
* [License](#license)

## Installation

This JavaScript module can be installed in either the Geocortex HTML5 Viewer or within a specific site's viewer.

**Geocortex HTML5 Viewer Installation** - Available to all Geocortex sites.

1. Locate your Geocortex HTML5 directory, typically found at 
`C:\inetpub\wwwroot\Html5Viewer\`
2. Navigate to the `...\Resources\Scripts\` folder and create a new directory called `CustomScripts`


**Site Specific Installation** - For only a specific Geocortex site.

1. Locate your Geocortex HTML5 Site directory, typically found at 
`C:\Program Files (x86)\Latitude Geographics\Geocortex Essentials\Default\REST Elements\Sites\`
2. Navigate to the Site HTML5 Virtual Directory, typically found at 
`...\YourSiteName\Viewers\YourHTML5ViewerName\VirtualDirectory\`
3. In the `Resources` directory create a new directory called `CustomScripts`


**Configure Viewers for both Viewer and Site Specific Installations**

4. Copy the [`MenuComponents.js`](https://raw.githubusercontent.com/DigitalDataServices/GeocortexMenuComponents/master/MenuComponents.js) file into the `CustomScripts` directory
5. Next locate the `Desktop`, `Tablet`, and `Handheld` configuration files, typically located at 
`...\Resources\Config\Default\` directory.
6. Repeat the following steps for all three configuration files (`Desktop`, `Tablet`, and `Handheld`):
	1. Make a backup of the configuration file!
	2. Open the configuration file in a file editor of your choice, such as Notepad++
	3. Within the `libraries` section add the following code where the `uri` is the relative path to the `MenuComponents.js` file.

        ```
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

Follow the same steps as for hiding or showing an item from the ["I Want To..." Menu](#i-want-to...-menu) (listed above) but change the Command Name and Parameters accordingly.

To find the names of the Results menu items, you will need to open on of the `Desktop`, `Tablet`, and `Handheld` configuration files, typically located in `...\Resources\Config\Default\` directory. Search for the `ResultsListActions` and use the `"text"` property within the `"items"` array. The default Results List Actions are:

| Default Action | Description |
| --- | --- |
| `@language-results-toggle-table-view` | Switch to Results List to Results Table |
| `@language-menu-identify-buffered-feature-set-collection` | Shows the Buffer Options |
| `@language-menu-show-charting-view` | Shows the Charting View |
| `@language-menu-export-results-to-csv` | Exports Results List to CSV file |
| `@language-menu-export-results-to-xlsx` | Exports Results List to Microsoft Excel (xlsx) file |
| `@language-menu-export-results-to-shp` | Exports Results List to Esri Shapefile (shp) |
| `@language-menu-run-report` | Runs Report on Results List, if reports are configured |

####Compact Toolbar####

The Compact Toolbar only contains individual items. It does not use Tabs or Groups like the Full Toolbar.

**Commands**

| Command | Parameter | Parameter Example | Description |
| --- | --- | --- | --- |
| `HideResultMenuItems` | `String[]` | `New String(){ "@language-menu-export-results-to-shp" }` | Hides Results menu items |
| `ShowResultMenuItems` | `String[]` | `New String(){ "@language-menu-export-results-to-shp" }` | Shows Results menu items |

**Example**

####Full Toolbar####

## History

2016-04-01 - Initial upload.

## Credits

Copyright &copy; 2016 [Digital Data Services, Inc.](http://www.digitaldataservices.com/geocortex). All Rights Reserved.

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

