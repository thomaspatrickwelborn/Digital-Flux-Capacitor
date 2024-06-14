const ApplicationTemplate = ($data = {}) => {
  const business = $data.business
  const interface = $data.interface
  const coutils = $data.coutils
  return `        
                  	<div id="app">
  <header class="header">
    <div class="header-logo">
      <img ${src}="${business.logo.img.src}" alt="business.logo.img.alt">
      </img>
    </div>
    <nav class="header-nav">
      <button>
      </button>
    </nav>
  </header>
  <main id="photos" class="main">
  </main>
</div>
                
        `
}
export default ApplicationTemplate