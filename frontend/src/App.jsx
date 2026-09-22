import { useEffect, useState } from 'react';

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

function productImagePath(image) {
  return image.startsWith('http') ? image : `/${image.replace(/^assets\//, '')}`;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentState, setPaymentState] = useState('idle');
  const [status, setStatus] = useState('Loading the collection...');

  useEffect(() => {
    fetch('/api/products/')
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load products');
        return response.json();
      })
      .then((data) => {
        setProducts(data.products);
        setStatus('');
      })
      .catch(() => setStatus('Start Django on port 8000 to load products.'));
  }, []);

  const departments = ['iphone', 'mac', 'watch'];
  const productsForDepartment = (department) => products
    .filter((product) => product.category === department)
    .sort((first, second) => second.id - first.id)
    .slice(0, 3);
  const visibleProducts = category === 'all'
    ? departments.flatMap(productsForDepartment)
    : productsForDepartment(category);

  function addToCart(product) {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function updateQuantity(productId, change) {
    setCart((currentCart) => currentCart
      .map((item) => item.id === productId ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0));
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  function openPayment() {
    setCartOpen(false);
    setPaymentState('idle');
    setPaymentOpen(true);
  }

  function submitPayment(event) {
    event.preventDefault();
    setPaymentState('processing');
    fetch('/api/orders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Nexus customer',
        paymentMethod,
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity }))
      })
    })
      .then((response) => {
        if (!response.ok) throw new Error('Order could not be created');
        return response.json();
      })
      .then(() => {
        setPaymentState('success');
        setCart([]);
      })
      .catch(() => setPaymentState('error'));
  }

  return (
    <main className="react-store">
      <nav className="react-nav">
        <a className="wordmark" href="#top">Nexus<span>.</span></a>
        <div className="nav-links">
          <button className={category === 'all' ? 'nav-link active' : 'nav-link'} onClick={() => { setCategory('all'); document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' }); }}>Store</button>
          <button className={category === 'iphone' ? 'nav-link active' : 'nav-link'} onClick={() => { setCategory('iphone'); document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' }); }}>Phones</button>
          <button className={category === 'mac' ? 'nav-link active' : 'nav-link'} onClick={() => { setCategory('mac'); document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' }); }}>Computers</button>
          <button className={category === 'watch' ? 'nav-link active' : 'nav-link'} onClick={() => { setCategory('watch'); document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' }); }}>Wearables</button>
        </div>
        <button className="bag-button" onClick={() => setCartOpen(true)} aria-label="Open shopping bag">
          Bag <span>{cartCount}</span>
        </button>
      </nav>

      <section className="react-hero" id="top">
        <div className="hero-copy-block">
          <p className="eyebrow">New · iPhone 18 Pro Max</p>
          <h1>Phone 18 Pro Max<br /><em>Burgundy.</em></h1>
          <p className="hero-copy">A deep new finish for the ultimate Pro experience. A20 Pro power, a next-generation camera system, and all-day battery life.</p>
          <div className="hero-meta"><strong>From {money.format(159900)}</strong><a className="hero-action" href="#catalog">Shop iPhone <span>→</span></a></div>
        </div>
        <div className="launch-poster" aria-label="iPhone 18 Pro Max Burgundy launch">
          <div className="poster-grid" />
          <span className="poster-kicker">PRO / 18</span>
          <strong className="poster-number">18</strong>
          <div className="poster-caption"><span className="burgundy-swatch" />Burgundy · Pro camera system</div>
        </div>
        <div className="hero-specs" aria-label="iPhone 18 Pro Max highlights"><span><strong>A20 Pro</strong> chip</span><span><strong>48MP</strong> Fusion camera</span><span><strong>120Hz</strong> ProMotion</span></div>
      </section>

      <section className="catalog" id="catalog" aria-label="Product catalog">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">Shop the collection</p>
            <h2>Choose your next essential.</h2>
          </div>
          <div className="filters" role="group" aria-label="Filter products">
            {['all', 'iphone', 'mac', 'watch'].map((filter) => (
              <button className={category === filter ? 'filter active' : 'filter'} onClick={() => setCategory(filter)} key={filter}>
                {filter === 'all' ? 'All' : filter === 'iphone' ? 'Phones' : filter === 'mac' ? 'Computers' : 'Wearables'}
              </button>
            ))}
          </div>
        </div>

        {status && <p className="status">{status}</p>}
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image"><img src={productImagePath(product.image)} alt={product.name} /></div>
              <p className="product-brand">{product.brand}</p>
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-buy-row">
                <strong>{money.format(product.price)}</strong>
                <button className="buy-button" onClick={() => addToCart(product)}>Buy now</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {cartOpen && <div className="cart-backdrop" onClick={() => setCartOpen(false)} />}
      <aside className={cartOpen ? 'cart-panel open' : 'cart-panel'} aria-label="Shopping bag">
        <div className="cart-panel-header">
          <h2>Your bag</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close shopping bag">Close</button>
        </div>
        {cart.length === 0 ? <p className="empty-cart">Your bag is waiting.</p> : (
          <>
            <div className="cart-lines">
              {cart.map((item) => <div className="cart-line" key={item.id}>
                <img src={productImagePath(item.image)} alt="" />
                <div><strong>{item.name}</strong><small>{money.format(item.price)}</small></div>
                <div className="quantity"><button onClick={() => updateQuantity(item.id, -1)}>-</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)}>+</button></div>
              </div>)}
            </div>
            <div className="cart-total"><span>Total</span><strong>{money.format(cartTotal)}</strong></div>
            <button className="checkout-button" onClick={openPayment}>Continue to payment</button>
          </>
        )}
      </aside>

      {paymentOpen && <div className="payment-backdrop">
        <section className="payment-modal" aria-label="Payment">
          {paymentState === 'success' ? (
            <div className="payment-success">
              <span className="success-mark">✓</span>
              <h2>Order received</h2>
              <p>Your Nexus order is saved. Payment is pending gateway setup.</p>
              <button className="checkout-button" onClick={() => setPaymentOpen(false)}>Continue shopping</button>
            </div>
          ) : (
            <form onSubmit={submitPayment}>
              <div className="payment-header"><div><p className="eyebrow">Secure checkout</p><h2>Complete your order</h2></div><button type="button" onClick={() => setPaymentOpen(false)} aria-label="Close payment">Close</button></div>
              <div className="payment-methods">
                <button type="button" className={paymentMethod === 'card' ? 'method active' : 'method'} onClick={() => setPaymentMethod('card')}>Card</button>
                <button type="button" className={paymentMethod === 'upi' ? 'method active' : 'method'} onClick={() => setPaymentMethod('upi')}>UPI</button>
              </div>
              {paymentMethod === 'card' ? <>
                <input required placeholder="Card number" inputMode="numeric" pattern="[0-9 ]{12,19}" />
                <div className="payment-row"><input required placeholder="MM / YY" /><input required placeholder="CVV" inputMode="numeric" pattern="[0-9]{3,4}" /></div>
              </> : <input required placeholder="UPI ID" type="text" />}
              <input required placeholder="Name on payment method" />
              {paymentState === 'error' && <p className="payment-error">We could not create your order. Please try again.</p>}
              <button className="checkout-button" disabled={paymentState === 'processing'}>{paymentState === 'processing' ? 'Processing...' : `Pay ${money.format(cartTotal)}`}</button>
              <p className="payment-note">Demo checkout. No real money is charged.</p>
            </form>
          )}
        </section>
      </div>}
    </main>
  );
}
