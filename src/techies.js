/*
 *  Techies
 *
 *  Validation library written in Javascript
 *
 *  Currently supported form elements:
 *      <input type="text">
 */

/*
 *  Techies object
 */

function Techies(settings)
{
    this.attributeName = 'tchs';
    this.expressions = []; // Array of TechiesExpression

    this.discover();
}

Techies.prototype.discover = function()
{
    // Grab all of the elements with the Techies validation attribute
    var elements = __tchs__objToArray(document.querySelectorAll('[' + this.attributeName + ']'));

    // Loop through the elements to filter out those with invalid validation attribute values
    for (var i = 0; i < elements.length; ++i)
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
            __tchs__log('Element with HTML \'' + elements[i].outerHTML + '\' was found to have an empty or invalid \'' + this.attributeName + '\' attribute and will be ignored for validation.', 'WARNING');
            elements.splice(i, 1);
            continue;
        }

        this.expressions.push(new TechiesExpression({'element': new TechiesElement({'formElement': elements[i]})}));
    }
};

/*
 *  TechiesExpression object
 */

function TechiesExpression(settings)
{
    this.element = settings['element']; // TechiesElement
    this.rule = __tchs__parseExpression(this.element.getExpressionValue(), this.element); // TechiesObject
}

/*
 *  TechiesElement object
 *
 *  Represents an HTML element.
 */

function TechiesElement(settings)
{
    if (!settings)
        return;

    this.formElement = settings['formElement']; // HTML Element

    if (this.formElement.tagName == 'INPUT')
    {
        if (this.formElement.getAttribute('type') == 'text')
        {
            var elem = new TechiesElementInputText();
            elem.formElement = this.formElement;
            return elem;
        }
    }
}

// Returns the element's value, which is to be validated
TechiesElement.prototype.getValue = function() // String
{
    // Default implementation returns null for debugging purposes
    return null;
};

// Returns the value of the 'tchs' attribute on this object's formElement
TechiesElement.prototype.getExpressionValue = function()
{
    return this.formElement.getAttribute('tchs');
}

/*
 *  TechiesElementInput object
 *
 *  Represents an HTML <input> element.
 */

var TechiesElementInput = __tchs__createChildObject(TechiesElement);

/*
 *  TechiesElementInputText object
 *
 *  Represents an HTML <input type="text"> element.
 */

var TechiesElementInputText = __tchs__createChildObject(TechiesElementInput);

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
    this.element = settings['element']; // TechiesElement
}

/*
 *  Method used for evaluation of the object.
 *  Returns 'true' on successful evaluation and 'false' on failed evaluation.
 *
 *  All children are required to inplement this method.
 */
TechiesObject.prototype.evaluate = function() // bool
{
    // Return null for debugging purposes
    return null;
};

/*
 *  TechiesRule object
 */

var TechiesRule = __tchs__createChildObject(TechiesObject, function(settings, self) {
    self.name = 'base_rule';
});

/*
 *  TechiesRuleNumeric object
 */

var TechiesRuleNumeric = __tchs__createChildObject(TechiesRule, function(settings, self) {
    self.name = 'rule_num';
});

TechiesRuleNumeric.prototype.evaluate = function()
{
    return __tchs__isNumeric(this.element.getValue());
}

/*
 *  TechiesRuleRange object
 */

var TechiesRuleRange = __tchs__createChildObject(TechiesRule, function(settings, self) {
    self.name = 'rule_range';
    self.param = settings['param'].replace('[', '').replace(']', '');
});

TechiesRuleRange.prototype.evaluate = function()
{
    if (this.param.length == 0)
        throw new TechiesErrorFatal('No expression found when attempting to parse rule \'rng\' in element \'' + this.element.formElement.outerHTML + '\'.');

    var commaSplit = this.param.split(',');
    if (commaSplit.length > 1)
    {
        for (var i = 0; i < commaSplit.length; ++i)
        {
            if (commaSplit[i].length == 0)
                continue;

            var rangeSplit = commaSplit[i].split('..');
            if (rangeSplit.length == 2 && rangeSplit[0].length != 0 && rangeSplit[1].length != 0)
            {
                if ((eval(rangeSplit[0]) < this.element.getValue()) && (this.element.getValue() < eval(rangeSplit[1]))
                        || eval(rangeSplit[0]) == this.element.getValue()
                        || eval(rangeSplit[1]) == this.element.getValue())
                    return true;
            } else if (eval(commaSplit[i]) == this.element.getValue())
                return true;
        }
        return false;
    }

    var rangeSplit = this.param.split('..');
    if (rangeSplit.length == 2 && rangeSplit[0].length != 0 && rangeSplit[1].length != 0)
    {
        if ((eval(rangeSplit[0]) < this.element.getValue()) && (this.element.getValue() < eval(rangeSplit[1]))
                || eval(rangeSplit[0]) == this.element.getValue()
                || eval(rangeSplit[1]) == this.element.getValue())
            return true;
    }

    if (eval(commaSplit[i]) == this.element.getValue())
        return true;

    return false;
}

/*
 *  TechiesRuleLength object
 */

var TechiesRuleLength = __tchs__createChildObject(TechiesRule, function(settings, self) {
    self.name = 'rule_length';
    self.param = settings['param'].replace('[', '').replace(']', '');
});

TechiesRuleLength.prototype.evaluate = function()
{
    if (this.param[0] == '>')
    {
        var value = this.param.replace('>', '');
        if (!__tchs__isNumeric(value))
            throw new TechiesErrorFatal('Value of \'len\' rule invalid for \'>\' when attempting to parse element \'' + this.element.formElement.outerHTML + '\'.');

        return this.element.getValue().length > parseInt(value);
    }

    if (this.param[0] == '<')
    {
        var value = this.param.replace('<', '');
        if (!__tchs__isNumeric(value))
            throw new TechiesErrorFatal('Value of \'len\' rule invalid for \'<\' when attempting to parse element \'' + this.element.formElement.outerHTML + '\'.');

        return this.element.getValue().length < parseInt(value);
    }

    if (this.param[0] == '=')
    {
        var value = this.param.replace('=', '');
        if (!__tchs__isNumeric(value))
            throw new TechiesErrorFatal('Value of \'len\' rule invalid for \'=\' when attempting to parse element \'' + this.element.formElement.outerHTML + '\'.');

        return this.element.getValue().length == parseInt(value);
    }

    throw new TechiesErrorFatal('No specifier found when attempting to parse rule \'len\' in element \'' + this.element.formElement.outerHTML + '\'.');
}

/*
 *  TechiesRuleCustom object
 */

var TechiesRuleCustom = __tchs__createChildObject(TechiesRule, function(settings, self) {
    self.name = 'rule_custom';
    self.param = settings['param'].replace('[', '').replace('[', '');
});

TechiesRuleCustom.prototype.evaluate = function()
{
    if (this.param.length == 0)
        throw new TechiesErrorFatal('Rule value empty for rule \'cst\' on element \'' + this.element.formElement.outerHTML + '\'.');

    var func = window[this.param];
    if (!typeof func == 'function')
        throw new TechiesErrorFatal('Rule value is not an existing function for rule \'cst\' on element \'' + this.element.formElement.outerHTML + '\'.');

    return func({'element': this.element});
}

/*
 *  TechiesOperator object
 */

var TechiesOperator = __tchs__createChildObject(TechiesObject, function(settings, self) {
    self.name = 'base_operator';
    self.symbol = null;
});

/*
 *  TechiesOperatorUnary object
 */

var TechiesOperatorUnary = __tchs__createChildObject(TechiesOperator, function(settings, self) {
    if (settings['operand'])
{
    self.setOperand(settings['operand']);
}

self.name = 'base_operator_unary';
});

TechiesOperatorUnary.prototype.setOperand = function(operand /* String */)
{
    this.operand = __tchs__parseExpression(operand, this.element);
}

/*
 *  TechiesOperatorNegate object
 */

var TechiesOperatorNegate = __tchs__createChildObject(TechiesOperatorUnary, function(settings, self) {
    self.name = 'operator_unary_negate';
    self.symbol = '!';
});

TechiesOperatorNegate.prototype.evaluate = function()
{
    return !(this.operand.evaluate());
};

/*
 *  TechiesOperatorBinary object
 */

var TechiesOperatorBinary = __tchs__createChildObject(TechiesOperator, function(settings, self) {
    if (settings['operandLeft'] && settings['operandRight'])
{
    self.setOperandLeft(settings['operandLeft']);
    self.setOperandRight(settings['operandRight']);
}

self.name = 'base_operator_binary';
});

TechiesOperatorBinary.prototype.setOperandLeft = function(operand /* String */)
{
    this.operandLeft = __tchs__parseExpression(operand, this.element);
};

TechiesOperatorBinary.prototype.setOperandRight = function(operand /* String */)
{
    this.operandRight = __tchs__parseExpression(operand, this.element);
};

/*
 *  TechiesOperatorAnd object
 */

var TechiesOperatorAnd = __tchs__createChildObject(TechiesOperatorBinary, function(settings, self) {
    this.name = 'operator_binary_and';
    this.symbol = ';';
});

TechiesOperatorAnd.prototype.evaluate = function()
{
    return (this.operandLeft.evaluate() && this.operandRight.evaluate());
};

/*
 *  TechiesOperatorOr object
 */

var TechiesOperatorOr = __tchs__createChildObject(TechiesOperatorBinary, function(settings, self) {
    this.name = 'operator_binary_or';
    this.symbol = ':';
});

TechiesOperatorOr.prototype.evaluate = function()
{
    return (this.operandLeft.evaluate() || this.operandRight.evaluate());
};

/*
 *  TechiesOperatorXor object
 */

var TechiesOperatorXor = __tchs__createChildObject(TechiesOperatorOr, function(settings, self) {
    this.name = 'operator_binary_xor';
    this.symbol = '^';
});

TechiesOperatorXor.prototype.evaluate = function()
{
    return (this.operandLeft.evaluate() != this.operandRight.evaluate());
}

/*
 *  TechiesError object
 */

function TechiesError(message)
{
    __tchs__log(message, this.type);
    this.type = 'ERROR'; 
}

/*
 *  TechiesErrorFatal object
 */

var TechiesErrorFatal = __tchs__createChildObject(TechiesError, null, function(message, self) {
    self.type = 'FATAL';
});

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

// Convert an object into an Array object
function __tchs__objToArray(obj)
{
    return [].map.call(obj, function(element) {
        return element;
    })
}

// Parse given expression and return one or more TechiesObject objects to handle the expression
function __tchs__parseExpression(expression /* String */, element /* TechiesElement */) // Array of TechiesObject
{
    var andSplit = __tchs__splitFirst(expression, '&');
    if (andSplit.length == 2)
    {
        if (andSplit[0] === "" || andSplit[1] === "")
            throw new TechiesErrorFatal("AND Operator parse attempt failed due to an operator being blank.");

        return new TechiesOperatorAnd({'operandLeft': andSplit[0], 'operandRight': andSplit[1], 'element': element});
    }

    var orSplit = __tchs__splitFirst(expression, '||');
    if (orSplit.length == 2)
    {
        if (orSplit[0] === "" || orSplit[1] === "")
            throw new TechiesErrorFatal("OR Operator parse attempt failed due to an operator being blank.");

        return new TechiesOperatorOr({'operandLeft': orSplit[0], 'operandRight': orSplit[1], 'element': element});
    }

    var xorSplit = __tchs__splitFirst(expression, '^');
    if (xorSplit.length == 2)
    {
        if (xorSplit[0] === "" || xorSplit[1] === "")
            throw new TechiesErrorFatal("XOR Operator parse attempt failed due to an operator being blank.");

        return new TechiesOperatorXor({'operandLeft': xorSplit[0], 'operandRight': xorSplit[1], 'element': element});
    }

    var negateSplit = __tchs__splitFirst(expression, '!');
    if (negateSplit.length == 2)
    {
        if (negateSplit[1] === "")
            throw new TechiesErrorFatal("NEGATE Operator parse attempt failed due to an operator being blank.");

        return new TechiesOperatorNegate({'operand': negateSplit[1], 'element': element});
    }

    if (expression == "num")
        return new TechiesRuleNumeric({'element': element});

    if (expression.substr(0, 3) == 'len')
        return new TechiesRuleLength({'element': element, 'param': expression.substr(expression.indexOf('[')+1, expression.indexOf(']') - expression.indexOf('[') - 1)});

    if (expression.substr(0, 3) == 'cst')
        return new TechiesRuleCustom({'element': element, 'param': expression.substr(expression.indexOf('[')+1, expression.indexOf(']') - expression.indexOf('[') - 1)});

    if (expression.substr(0, 3) == 'rng')
        return new TechiesRuleRange({'element': element, 'param': expression.substr(expression.indexOf('[')+1, expression.indexOf(']') - expression.indexOf('[') - 1)});

    throw new TechiesErrorFatal("No matching Techies expression found for supplied string '" + expression + "'.");
}

// Split a string only on the first instance of a matched delimeter
function __tchs__splitFirst(value /* String */, delimeter /* char */) // Array of String
{
    var firstSplit = value.split(delimeter);

    if (firstSplit.length == 1)
        return [];

    return [firstSplit[0], firstSplit.slice(1).join(delimeter)];
}

// Return true if 'value' is entirely numeric
function __tchs__isNumeric(value)
{
    for (var i = 0; i < value.length; ++i)
    {
        if (isNaN(parseInt(value.charAt(i))))
            return false;
    }
    return true;
}

// Creates a child object from a parent object
function __tchs__createChildObject(parent, postInitFunction, preInitFunction)
{
    var child = function(settings)
    {
        if (preInitFunction) preInitFunction(settings, this);

        parent.call(this, settings);

        if (postInitFunction) postInitFunction(settings, this);
    };

    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;

    return child;
}
