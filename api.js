
const db = require('./db')
const categories = require('./categories')(db)
const products = require('./products')(db)

const test = async () => {
  /*
  
  await categories.remove(4)
  await categories.update(3, ['Update2 Cat Api'])
  const catgs = await categories.findAll()
  console.log(catgs)
  
  const prods = await products.findAllPaginated()
  console.log(prods)
  await products.addImage(3, ['image test', 'url'])
  for (let i = 0; i < 100; i++) {
      products.findAllPaginated().then(prods => console.log(prods))
    }
  */
  await products.updateCategories(3, [6])
  //await categories.create(['New Cat Api'])


}

test()