const products = [
  {
    id: 1,
    name: 'Beef burger',
    description: 'Beef patty, Onion...',
    price: 10,
    imageUrl: 'imgs/beef-burger.png',
  },
  {
    id: 2,
    name: 'Hawaiian burger',
    description: 'Beef patty, Grilled Pineapple...',
    price: 12.5,
    imageUrl: 'imgs/hawaiian-burger.png',
  },
  {
    id: 3,
    name: 'Spicy buffalo',
    description: 'Crispy Chicken, Mozza Cheese...',
    price: 11,
    imageUrl: 'imgs/spicy-buffalo.png',
  },
  {
    id: 4,
    name: 'Margherita',
    description: 'Tomato sauce, Mozzarella...',
    price: 15,
    imageUrl: 'imgs/margherita.png',
  },
  {
    id: 5,
    name: 'Four cheese',
    description: 'Cheese, Mozza Cheese...',
    price: 16,
    imageUrl: 'imgs/four-cheese.png',
  },
  {
    id: 6,
    name: 'Cola',
    description: 'Cola, Ice...',
    price: 3,
    imageUrl: 'imgs/cola.png',
  },
]

class Cart {
  constructor() {
    this.products = [];
  }

  get totalPrice() {
    return this.products.length
      ? this.products.reduce((prev, curr) => prev + curr, 0)
      : 0
  }

  getProductCount(productId) {
    const product = this.products.find(item => item.id == productId)

    return product ? product.count : 0;
  }

  clearCart() {
    this.products = []
  }

  addProduct(product) {
    const cartProduct = this.products.find(item => item.id === product.id)
    cartProduct ? cartProduct.count += 1 : this.products.push({...product, count: 1})
  }

  removeProduct(product) {
    const cartProduct = this.products.find(item => item.id === product.id)
    if (!cartProduct) return

    if (cartProduct.count === 1) {
      this.products = this.products.filter(item => item.id !== product.id)
    } else {
      cartProduct.count -= 1
    }
  }
}

const cart = new Cart()
document.addEventListener('DOMContentLoaded', init);

function init() {
  Telegram.WebApp.ready()
  Telegram.WebApp.expand()
  showProductData()
  prepareProductItemAddBtns()
  prepareProductActivitiesBtns()
}

function showProductData() {
  const productsNodeContent = products.reduce((prev, curr) => prev + getProductHTMLElement(curr), '')

  document
    .querySelector('.products')
    .innerHTML = productsNodeContent
}

function prepareProductItemAddBtns() {
  document
    .querySelectorAll('.products__item-btn')
    .forEach((item) => item.addEventListener('click', addBtnHandler))
}

function prepareProductActivitiesBtns() {
  document
    .querySelectorAll('.products__item-activities-btn')
    .forEach(item => {
      item.addEventListener('click', activitiesBtnHandler)
    })
}

function getProductHTMLElement(product) {
  return `
    <div class="products__item" data-productId="${product.id}">
      <div class="products__item-img-wrapper">
        <img class="products__item-img" src="${product.imageUrl}" alt="food" />
      </div>
      <div class="products__item-info">
        <span class="products__item-name">${product.name}</span>
        <span class="products__item-description">${product.description}</span>
        <span class="products__item-price">${product.price}$</span>
      </div>
      <div class="products__item-activities hidden">
        <button class="products__item-activities-btn products__item-activities-btn_add">+</button>
        <span class="products__item-activities-price">0</span>
        <button class="products__item-activities-btn products__item-activities-btn_subtract">-</button>
      </div>
      <button class="products__item-btn">+</button>
    </div>
  `
}

function addBtnHandler(event) {
  const el = event.target
  const elParent = el.parentElement
  const activitiesBlock = elParent.querySelector('.products__item-activities')
  const productId = elParent.dataset.productid;
  const product = products.find(item => item.id == productId)
  
  el.classList.add('hidden');
  activitiesBlock.classList.remove('hidden');
  cart.addProduct(product)
  drawProductCount(elParent)
}

function activitiesBtnHandler(event) {
  const el = event.target
  const activitiesEl = el.parentElement
  const productAddBtn = activitiesEl.parentElement.querySelector('.products__item-btn')
  const productId = activitiesEl.parentElement.dataset.productid
  const product = products.find(item => item.id == productId)


  if (el.classList.contains('products__item-activities-btn_add')) {
    cart.addProduct(product)
    drawProductCount(activitiesEl.parentElement)
  } else {
    if (cart.getProductCount(productId) == 1) {
      activitiesEl.classList.add('hidden');
      productAddBtn.classList.remove('hidden');
    }
    cart.removeProduct(product)
    drawProductCount(activitiesEl.parentElement)
  }
  el.blur()
}

function drawProductCount(productNode) {
  const priceNode = productNode.querySelector('.products__item-activities-price')
  const productId = productNode.dataset.productid
  const count = cart.getProductCount(productId)

  priceNode.innerHTML = count
}
