// import something here
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'

import pdfMake from 'pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs

import wings from 'wings4'

// "async" is optional
export default async ({ app, router, Vue }) => {
  // something to do
  Vue.use(Chartkick.use(Chart))
  Vue.prototype.$pdfMake = pdfMake

  Vue.prototype.$dbCon = wings('http://localhost:3030')
}
