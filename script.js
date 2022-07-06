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
      ? this.products.reduce((prev, curr) => prev + curr.price * curr.count, 0)
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
const cartNode = document.querySelector('.cart')

// EVENT listeners for buttons
// -----------------------------------------------
document.addEventListener('DOMContentLoaded', init);

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

// const showCartBtn = document.querySelector('.show-btn');
// const closeCartBtn = document.querySelector('.cart__edit-button');
// const cartNode = document.querySelector('.cart')

// showCartBtn.addEventListener('click', (event) => {
//   showCart()
//   cartNode.classList.remove('hidden')
// })

// closeCartBtn.addEventListener('click', (event) => {
//   cartNode.classList.add('hidden')  
// })

// HANDLERS for buttons click
// -----------------------------------------------
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

// FUNCTIONS for inserting content into DOM
// -----------------------------------------------
function drawProductData() {
  const productsNodeContent = products.reduce((prev, curr) => prev + getProductHTMLElement(curr), '')

  document
    .querySelector('.products')
    .innerHTML = productsNodeContent
}

function drawProductCount(productNode) {
  const priceNode = productNode.querySelector('.products__item-activities-price')
  const productId = productNode.dataset.productid
  const count = cart.getProductCount(productId)

  priceNode.innerHTML = count
}

function drawCart() {
  const cartNode = document.querySelector('.cart__content')
  const contentProducts = cart.products.reduce((prev, curr) => prev + getCartItemHTMLElement(curr), '')
  const content = getCartContentHeadHTMLElement()
    + contentProducts
    + getCartTotalHTMLElement(cart.totalPrice)
  
  cartNode.innerHTML = content
}

// FUNCTIONS for creating HTML elements
// -----------------------------------------------
function getProductHTMLElement(product) {
  return `
    <div class="products__item" data-productId="${product.id}">
      <div class="products__item-img-wrapper">
        <img class="products__item-img" src="${product.imageUrl}" alt="food" />
      </div>
      <div class="products__item-info">
        <span class="products__item-name">${product.name}</span>
        <span class="products__item-description">${product.description}</span>
        <span class="products__item-price">${product.price} грн</span>
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

function getCartItemHTMLElement(product) {
  return `
    <div class="cart__content-row">
      <div class="cart__content-item-img-wrapper">
        <img class="cart__content-item-img" src="${product.imageUrl}" alt="cart food" />
      </div>
      <span class="cart__content-item-name">${product.name}</span>
      <span class="cart__content-item-count">${product.count}</span>
      <span class="cart__content-item-price">${product.price} грн</span>
    </div>
  `
}

function getCartContentHeadHTMLElement() {
  return `
    <div class="cart__content-head">
      <span class="cart__content-head-img"></span>
      <span class="cart__content-head-name">Назва</span>
      <span class="cart__content-head-count">К-сть</span>
      <span class="cart__content-head-price">Ціна</span>
    </div>
  `
}

function getCartTotalHTMLElement(total) {
  return `
    <div class="cart__total">
      <span class="cart__total-txt">Усього:</span>
      <span class="cart__total-price">${total} грн</span>
    </div>
  `
}

// INIT function
function init() {
  Telegram.WebApp.ready()
  Telegram.WebApp.expand()
  Telegram.WebApp.MainButton.text('Оформити замовлення')
  Telegram.WebApp.MainButton.color('#F05D23')
  Telegram.WebApp.MainButton.textColor('#FFEFE7')
  Telegram.WebApp.MainButton.show()

  showProductData()
  prepareProductItemAddBtns()
  prepareProductActivitiesBtns()
}
