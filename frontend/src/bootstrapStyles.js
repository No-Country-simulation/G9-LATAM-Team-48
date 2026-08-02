import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css?url'

const existing = document.querySelector('link[data-bootstrap-styles]')
if (!existing) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = bootstrapCss
  link.setAttribute('data-bootstrap-styles', 'true')
  document.head.appendChild(link)
}
