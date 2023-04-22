# Introduction!

This simple npm library allows you to create your component along with test and documentation file from a simple command within your favorite framework. 
*Note: Currently I have just add support for typescript/react and javascript/react. very soon It will be available for frameworks vue.js, svlte solid.js and many more.. * 


# Getting Started
## Installation 

 1. Install Package 
 ```js
 npm i @subashrijal5/component-generator
 ```
 
 2. Initialize and setup your requirements, You will be asked few questions, please choose as per your requirement.  
 ```js
 npm run make:init
 ```
 
 3. On completion of above command **.env** file will be generated on the root directory with the answer you have provided. if you wish to modify the variables you can modify from there. 
 4. Let's generate our first component
 ```js 
 npm run make:component YourComponentName
 ``` 
 OR
  ```jsx 
  npm run make:component --component=YourComponentName
  ```
 5. Above command will generate a folder containing component, test and documentation file.  
*Documentation is under development right now will be live in few days. *

Made with :heart: by [@subashrijal5](https://subashrijal5.github.io)
## Contributors


<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
