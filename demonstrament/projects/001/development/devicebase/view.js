import ApplicationTemplate from 'template.js'
const ApplicationView = {
  type: 'static',
  parent: document.querySelector('#body'),
  selectors: {
    app: '#app'
    header: '#app > header'
    main: '#app > main'
    footer: '#app > footer'
  },
  eventCallbacks: {},
}
export default ApplicationView