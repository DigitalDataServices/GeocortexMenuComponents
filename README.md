# Geocortex Menu Components

Javascript library to manipulate the addition and remove of menu items within the Geocortex Viewer for HTML5

## Installation

This JavaScript module can be installed either within the default HTML5 viewer or within a specific site.

**Viewer Installation and Configuration:**

**Site Installation and Configuration:**

1. Locate your Geocortex HTML5 Site directory, typically found at `C:\Program Files (x86)\Latitude Geographics\Geocortex Essentials\Default\REST Elements\Sites\`
2. Navigate to the Site HTML5 Virtual Directory, typically found at `...\YourSiteName\Viewers\YourHTML5ViewerName\VirtualDirectory\`
3. In the Resources directory create a new directory called CustomScripts
4. Copy the MenuComponents.js file into the CustomScripts directory
5. Next locate the Desktop, Tablet, and Handheld configuration files, typically located at \Resources\Config\Default\ directory.
6. Repeat the following steps for all three configuration files:
	1. Make a backup of the configuration file!
	2. Within the libraries section add the following code:

        {
          "id": "MenuComponents",
            "uri": "{ViewerConfigUri}../../Custom Scripts/MenuComponents.js",
            "locales":[
            ]
        }

    3. Within the libraries section add the following code:

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


## Usage

TODO: Write usage instructions

## History

2016-03-04 - Initial upload.

## Credits

Copyright &copy; 2016 [Digital Data Services, Inc.](http://www.digitaldataservices.com/geocortex). All Rights Reserved.

Geocortex and Latitude Geographics are registered trademarks of Latitude Geographics Group Ltd. in the United States and Canada, and are trademarks in other jurisdictions around the world.

## License

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

