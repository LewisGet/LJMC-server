var ItemType = Packages.net.canarymod.api.inventory.ItemType;
var Canary = Packages.net.canarymod.Canary;
var itemFactory = Canary.factory().itemFactory;

function items( material, amount ) {
  material = material.toUpperCase();
  var result = itemFactory["newItem(net.canarymod.api.inventory.ItemType)"](material);
  result.amount = amount;
  return result;
}
function getMaterialHandler( material ){
  return function(amount){
    if (typeof amount == 'undefined'){
      return material;
    }
    if (typeof amount == 'number'){
      var itemStack = itemFactory["newItem(net.canarymod.api.inventory.ItemType)"](material);
      itemStack.amount = amount;
      return itemStack;
    } else {
      var result = (amount == material);
      if (!result){
	if (amount.getId && amount.getData){
	  var m2 = ItemType.fromIdAndData(amount.id, amount.data);
	  result = (m2 == material);
	}
      }
      return result;
    }
  };
}
try {
  /*
   nashorn
   */
  var itemTypeClass = ItemType.class;
  var materials = itemTypeClass.getDeclaredFields();
  for (var i = 0;i < materials.length; i++ ){

    if (materials[i].type != itemTypeClass) {
      continue;
    }
    var materialField = materials[i];
    var name = (''+materialField.name);
    name = name.replace(/^(.)/,function(a){ 
      return a.toLowerCase(); 
    });
    
    items[name] = getMaterialHandler(materialField.get(ItemType));
  }
} catch ( e ){
  // non-nashorn
  for (var field in ItemType){
    if (ItemType[field] === undefined){
      continue;
    }
    if (ItemType[field].class != ItemType){
      continue;
    }
    var name = (''+field).replace(/^(.)/,function(a){
      return a.toLowerCase();
    });
    console.log(name);
    items[name] = getMaterialHandler(ItemType[field]);
  }
}


module.exports = items;
