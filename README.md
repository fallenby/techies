techies
=======

Javascript validation library.

Why? Because I wrote some pretty shitty validation code and would like to make something more robust while learning about it at the same time.

===

Techies initializes itself on page load and looks for elements it needs to validate.

To tell Techies to validate an element, add the "tchs" property to the element.

    e.g. <input type="text" tchs=""></input>


Techies makes use of rules to validate elements. Validation is done on a per-element basis, and works differently depending on the element used.

Rules
-----
