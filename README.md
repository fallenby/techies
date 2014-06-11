=======
techies
=======

Javascript validation library.

Why? Because I wrote some pretty shitty validation code and would like to make something more robust while learning about it at the same time.

Usage
=====

Techies initializes itself on page load and looks for elements it needs to validate.

To tell Techies to validate an element, add the "tchs" property to the element.

    <input type="text" tchs=""></input>

Techies makes use of rules to validate elements. Validation is done on a per-element basis, and works differently depending on the element used.

Rules
=====

Rules are used by Techies to determine how to validate an element. Rules can be either built-in rules or custom rules, with custom rules being self-written functions.

####num
Numeric validation. This Rule allows only numeric key inputs.

####chr

Character validation. This Rule allows only character key inputs.

####spc

Special validation. This Rule allows only special character key inputs('$', '#', etc.).

####rng
Range validation. This Rule allows only inputs within the specified range.

    <input type="text" tchs="num,rng[1..3]"></input>

Allows only numeric inputs in the range of 1 to 3.

####exc
Exclusion validation. This Rule allows all inputs other than those specified.

    <input type="text" tchs="exc[rng['a'..'e',1..5]]"></input>

Allows all inputs other than anything in the character range 'a' to 'e', or the numeric range 1 to 5.

####len
Length validation. This Rule allows input validation according to the length of the element's contained input.

len allows both "greater than" and "less than" validation using the '>' and '<' characters respectively.

    <input type="text" tchs="len[>10]"></input>

Validates an element's content, requiring it to be longer than 10 inputs long.

    <input type="text" tchs="len[<10]"></input>

Validates an element's content, requiring it to be less than 10 inputs long.

####cst

Custom validation. This Rule allows input validation with a custom user-supplied function.

    <input type="text" tchs="cst[domainExists]"></input>

Forwards all inputs to the 'domainExists' function.

User-supplied functions should return only the boolean values 'true' for successful validation, or 'false' for a failed validation.

Techies supplies some in-built custom validators, which are denoted by the "__tchs__" prefix.

The following in-built custom validators exist:

#####__tchs__email

Provides basic e-mail address validation.

#####__tchs__dns

Provides validation of a domain name against a dns server.

#####__tchs__email__dns

Provides validation of an e-mail address as well as that address' domain name against a dns server.

Operators
=========

Operators are used with rules to specify how validation is to take place.

Unary operators
-------------------

A single operand to the right of the operator

####!   -   NEGATION

Negates its operand

    true    ->  false
    false   ->  true

Binary operators
--------------------

Two operands to the right and left of the operator

####,   -   AND

Both operands must validate successfully

####.   -   OR

Only one operand must validate successfully

####^   -   XOR

Only one or neither operand must validate successfully, but not both
