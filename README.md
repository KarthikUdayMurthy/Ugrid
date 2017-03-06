# Ugrid

Javascript prototype file &amp; CSS file to create a customized table in HTML with options like sort, filter etc.,


CLASS Ugrid created by KARTHIK UDAY MURTHY


Purpose: Dynamic Grid creation with additional options

Steps to use:

1. link the files in your code:

    1. Ugrid.css
    
    2. Ugrid.js
    
    3. Create a folder "Upics" in the same path where the above files are placed and place all the images inside it.
    
2. Use the below syntax to create an instance of the Ugrid object:

```javascript

var obj1 = new Ugrid(two dimensional array,container element ID[,number of rows,array of actions,array of classes]);

```
    
3. Call the createTable() method:

       obj1.createTable();
