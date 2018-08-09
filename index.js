// Load framework
loadJSON("app/package.json",function(package)
{
    loader(package.source,package.paths)
})