// Load framework
loadJSON("package.json",function(package)
{
    loader(package.source,package.paths)
})