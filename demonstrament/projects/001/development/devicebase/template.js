const ApplicationTemplate = ($data = {}) => {
  const business = $data.business
  const interface = $data.interface
  const coutils = $data.coutils
  return ` <app id="app">
       <header class="header"></header>
       <main class="main"></main>
       <footer class="footer"></footer>
     </app> `
}
export default ApplicationTemplate