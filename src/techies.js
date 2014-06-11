/*
 *  Techies
 *
 *  Validation library written in Javascript
 *
 *  Currently supported form elements:
 *      <input type="text">
 *
 *  TODO: Complete Techies.discover()
 *  TODO: Everything
 */

/*
 *  Techies object
 */

function Techies(settings)
{
   this.attributeName = 'tchs'; 

   this.discover();
}

Techies.prototype.discover = function()
{
    // Grab all of the elements with the Techies validation attribute
    var elements = document.querySelectorAll('[' + this.attributeName + ']');

    // Loop through the elements to filter out those with invalid validation attribute values
    for (int i = 0; i < elements.length; ++i)
    {
        // Grab the value of the Techies validation attribute on the current element
        var value = elements[i].getAttribute(this.attributeName);
        
        if (value == null || value === '')
        {
            /*
             * Remove current element from the array
             * and skip to the next loop iteration if
             * the element's value does not exist.
             */
            elements.splice(i, 1);
            __tchs__log('Element with tag name \'' + element.tagName  + '\' and id \'' + elements[i].id '\' was found to have an empty or invalid \'tchs\' attribute and will be ignored for validation.', 'ERROR');
            continue;
        }

        // TODO: All the things


    }
};

/*
 *  TechiesElement object
 *
 *  Represents an HTML element.
 */

function TechiesElement(settings)
{
    this.formElement = null; // HTML Element 
}

TechiesElement.prototype.getValue = function() // String
{
};

/*
 *  TechiesElementInput object
 *
 *  Represents an HTML <input> element.
 */

function TechiesElementInput(settings)
{
    TechiesElement.call(this);
}

TechiesElementInput.prototype = Object.create(TechiesElement.prototype);
TechiesElementInput.prototype.constructor = TechiesElementInput;

/*
 *  TechiesElementInputText object
 *
 *  Represents an HTML <input type="text"> element.
 */

function TechiesElementInputText(settings)
{
    TechiesElementInput.call(this);
}

TechiesElementInputText.prototype = Object.create(TechiesElementInput.prototype);
TechiesElementInputText.prototype.constructor = TechiesElementInputText;

TechiesElementInput.prototype.getValue = function()
{
    return this.formElement.value;
};

/*
 *  TechiesObject object
 *
 *  Generic object for Techies objects to extend from.
 *
 *  Provides a high-level interface for evaluation for use in operations further down the class hierarchy.
 */

function TechiesObject(settings)
{
    this.name = 'base_object';
}

/*
 *  Method used for evaluation of the object.
 *  Returns 'true' on successful evaluation and 'false' on failed evaluation.
 *
 *  All children are required to inplement this method.
 */
TechiesObject.prototype.evaluate = function() // bool
{
    
};

/*
 *  TechiesRule object
 */

function TechiesRule(settings)
{
    this.name = 'base_rule';

    this.element = null; // TechiesElement
    this.children = null; // Array of TechiesObject
}

TechiesRule.prototype = Object.create(TechiesObject.prototype);
TechiesRule.prototype.constructor = TechiesRule;

/*
 *  TechiesRuleNumeric object
 */

function TechiesRuleNumeric(settings)
{
    TechiesRule.call(this);

    this.name = 'num';
}

TechiesRuleNumeric.prototype = Object.create(TechiesRule.prototype);
TechiesRuleNumeric.prototype.constructor = TechiesRuleNumeric;

/*
 *  TechiesOperator object
 */

function TechiesOperator(settings)
{
    TechiesObject.call(this);

    this.name = 'base_operator';
    this.symbol = '';
}

TechiesOperator.prototype = Object.create(TechiesObject.prototype);
TechiesOperator.prototype.constructor = TechiesOperator;

/*
 *  TechiesOperatorUnary object
 */

function TechiesOperatorUnary(settings)
{
    TechiesOperator.call(this);

    this.name = 'base_operator_unary';

    this.operand = null; // TechiesObject
}

TechiesOperatorUnary.prototype = Object.create(TechiesOperator.prototype);
TechiesOperatorUnary.prototype.constructor = TechiesOperatorUnary;

/*
 *  TechiesOperatorNegate object
 */

function TechiesOperatorNegate(settings)
{
    TechiesOperatorUnary.call(this);

    this.name = 'operator_unary_negate';
    this.symbol = '!';
}

TechiesOperatorNegate.prototype = Object.create(TechiesOperatorUnary.prototype);
TechiesOperatorNegate.prototype.constructor = TechiesOperatorNegate;

TechiesOperatorNegate.prototype.evaluate = function()
{
    return !(this.operand.evaluate());
};

/*
 *  TechiesOperatorBinary object
 */

function TechiesOperatorBinary(settings)
{
    TechiesOperator.call(this);

    this.name = 'base_operator_binary';
    
    this.operandLeft = null; // TechiesObject
    this.operandRight = null; // TechiesObject
}

TechiesOperatorBinary.prototype = Object.create(TechiesOperator.prototype);
TechiesOperatorBinary.prototype.constructor = TechiesOperatorBinary;

TechiesOperatorBinary.prototype.setOperandLeft = function(operand /* TechiesObject */)
{
    this.operandLeft = operand;
};

TechiesOperatorBinary.prototype.setOperandRight = function(operand /* TechiesObject */)
{
    this.operandRight = operand;
};

/*
 *  TechiesOperatorAnd object
 */

function TechiesOperatorAnd(settings)
{
    TechiesOperatorBinary.call(this);

    this.name = 'operator_binary_and';
    this.symbol = ';';
}

TechiesOperatorAnd.prototype = Object.create(TechiesOperatorBinary.prototype);
TechiesOperatorAnd.prototype.constructor = TechiesOperatorAnd;

TechiesOperatorAnd.prototype.evaluate = function()
{
    return (this.operandLeft.evaluate() && this.operandRight.evaluate());
};

/*
 *  TechiesOperatorOr object
 */

function TechiesOperatorOr(settings)
{
    TechiesOperatorBinary.call(this);

    this.name = 'operator_binary_or';
    this.symbol = ':';
}

TechiesOperatorOr.prototype = Object.create(TechiesOperatorBinary.prototype);
TechiesOperatorOr.prototype.constructor = TechiesOperatorOr;

TechiesOperatorOr.prototype.evaluate = function()
{
    return (this.operandLeft.evaluate() || this.operandRight.evaluate());
};

/*
 * Techies misc helper functions
 */

// Log a message to the browser console if supported
function __tchs__log(message, type)
{
    if (window.console && window.console.log)
    {
        console.log('::TECHIES:: ' + type + ': ' + message);
    }
}
