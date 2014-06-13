window.addEventListener('load', function() {
    var tech = new Techies();
    document.getElementById('testButton').addEventListener('click', function() { validateClick(tech); });
});

function test(settings)
{
    alert(JSON.stringify(settings['element']));
    return true;
}

function validateClick(tech)
{
    alert(tech.expressions[0].rule.evaluate());
}
