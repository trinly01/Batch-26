function run() {
  var x = 'xxx'
  let y = 'yyy'
  const asd = {}
  asd.zxc = 'hello'
  asd = {}
  console.log(asd)

  console.log(x, y)

  {
    let z = 'zzz'
    console.log(z)
  }

  console.log(z)
}

run()