/* eslint-disable no-undef */
let drop_down = '';
for (i = 0; i < 120; i++) {
  drop_down += '<option value=' + (i + 8) + '>/' + (i + 8) + '</option>';
}
document.getElementById('slashes').innerHTML = drop_down;
function calculate() {
  let a = document.getElementById('ip').value;
  a = a.replace(/\s/g, '');
  let c = a.split('/');
  a = c[0];
  c = c[1];
  if (!checkipv6(a)) {
    document.getElementById('address').innerHTML =
      "<span style='background-color:yellow;'>This does not look like a valid IPv6 address</span>";
    document.getElementById('first').innerHTML = '';
    document.getElementById('last').innerHTML = '';
    document.getElementById('expanded').innerHTML = '';
    document.getElementById('64s').innerHTML = '';
    document.getElementById('prefix').innerHTML = '';
    return;
  }
  a = formatipv6preferred(a);
  document.getElementById('address').innerHTML = a + '/' + c;
  const b = expand(a);
  document.getElementById('expanded').innerHTML = b + '/' + c;
  document.getElementById('64s').innerHTML = Math.pow(2, 64 - c);
  let d = findprefix(c) + '::';
  d = expand(d);
  document.getElementById('prefix').innerHTML = d;
  const e = bitand(d, b);
  document.getElementById('first').innerHTML = e;
  document.getElementById('last').innerHTML = last(d, e);
}
function subnet_subnet() {
  const b = document.getElementById('subnets').value;
  let l = document.getElementById('ip').value;
  l = l.replace(/\s/g, '');
  let d = l.split('/');
  l = expand(d[0]);
  d = d[1];
  if (!checkipv6(l)) {
    document.getElementById('facts').innerHTML =
      "<span style='background-color:yellow;'>This looks like an invalid IPv6 address</span>";
    return;
  }
  if (splitnewslash(d, b) == false) {
    document.getElementById('facts').innerHTML =
      "<span style='background-color:yellow;'>Looks like the given IPv6 network cannot be split into this many new subnets</span>";
    return;
  }
  const m = splitnewslash(d, b);
  const k = Math.pow(2, m - d);
  let h = findprefix(d) + '::';
  h = expand(h);
  let g = bitand(h, l);
  g = expand(g);
  let c = g.replace(/:/g, '');
  c = new BigInteger(c, 16);
  const f = new BigInteger('2').pow(128 - m);
  const a = new Array();
  a[0] = c.toString(16);
  for (var e = 1; e < k; e++) {
    a[e] = c.add(f).toString(16);
    c = c.add(f);
    if (e > 999) {
      break;
    }
  }
  let n =
    '<b>To get at least ' +
    b +
    ' new subnets divide ' +
    formatipv6preferred(l) +
    '/' +
    d +
    ' into ' +
    k +
    ' new subnets. Each of these subnets is a /' +
    m +
    ' containing ' +
    Math.pow(2, 64 - m) +
    ' /64s. The new subnets are as follows:</b><p>';
  for (var e = 0; e < k; e++) {
    n += formatipv6preferred(biginttoipv6(a[e])) + '/' + m + '<br>';
    if (e > 999) {
      break;
    }
  }
  n += '</p>';
  document.getElementById('facts').innerHTML = '';
  document.getElementById('subnetted').innerHTML = n;
}
function subnet_slashes() {
  const selectedSlash = document.getElementById('slashes').value;
  let ip = document.getElementById('ip').value;
  ip = ip.replace(/\s/g, '');
  let ipSlash = ip.split('/');
  ip = expand(ipSlash[0]);
  ipSlash = parseInt(ipSlash[1]);

  if (!checkipv6(ip)) {
    document.getElementById('facts').innerHTML =
      "<span style='background-color:yellow;'>This looks like an invalid IPv6 address</span>";
    return;
  }
  const subnetSize = Math.pow(2, selectedSlash - ipSlash);
  if (selectedSlash < ipSlash) {
    document.getElementById('facts').innerHTML =
      "<span style='background-color:yellow;'>Make sure the selected slashes fit into the given network. The selected slash should have a larger numeric value than the original network's slash.</span>";
    return;
  }
  let bitmask = findprefix(ipSlash) + '::';
  bitmask = expand(bitmask);
  let startAddressString = bitand(bitmask, ip);
  startAddressString = expand(startAddressString);
  let startAddressParsed = startAddressString.replace(/:/g, '');
  startAddressParsed = new BigInteger(startAddressParsed, 16);

  const selectedSlashSize = new BigInteger('2').pow(128 - selectedSlash);

  const output = new Array();
  // Starting
  output[0] = startAddressParsed.toString(16);

  for (let i = 1; i < subnetSize; i++) {
    output[i] = startAddressParsed.add(selectedSlashSize).toString(16);
    startAddressParsed = startAddressParsed.add(selectedSlashSize);
    if (i > 999) {
      break;
    }
  }

  let m =
    '<b>Subnetting ' +
    formatipv6preferred(ip) +
    '/' +
    ipSlash +
    ' into /' +
    selectedSlash +
    's gives ' +
    subnetSize +
    ' subnets, all of which have ' +
    Math.pow(2, 64 - selectedSlash) +
    ' /64s.</b><p>';
  for (var e = 0; e < subnetSize; e++) {
    m += formatipv6preferred(biginttoipv6(output[e])) + '/' + selectedSlash + '<br>';
    if (e > 999) {
      break;
    }
  }
  m += '</p>';
  document.getElementById('subnetted').innerHTML = m;
  document.getElementById('facts').innerHTML = '';
}
function biginttoipv6(b) {
  const a = [];
  var c;
  for (var c = 0; c < 8; c++) {
    a.push(b.slice(c * 4, (c + 1) * 4));
  }
  return a.join(':');
}
function splitnewslash(c, d) {
  let a = 0;
  for (let b = 0; b < 128 - c; b++) {
    a = Math.pow(2, b);
    if (a >= d) {
      return parseInt(c) + b;
    }
  }
  return false;
}
function last(b, c) {
  c = c.split(':');
  b = b.split(':');
  anded = new Array();
  for (let a = 0; a < 8; a++) {
    c[a] = parseInt(c[a], 16);
    b[a] = parseInt(b[a], 16);
    b[a] = b[a] ^ 65535;
    anded[a] = b[a] ^ c[a];
    anded[a] = anded[a].toString(16);
  }
  return anded.join(':');
}
function bitand(c, a) {
  c = c.split(':');
  a = a.split(':');
  anded = new Array();
  for (let b = 0; b < 8; b++) {
    c[b] = parseInt(c[b], 16);
    a[b] = parseInt(a[b], 16);
    anded[b] = c[b] & a[b];
    anded[b] = anded[b].toString(16);
  }
  return anded.join(':');
}
function findprefix(b) {
  const c = b;
  let d = '';
  for (var a = 0; a < c; a++) {
    d += '1';
    if ((a + 1) % 16 == 0) {
      d += ':';
    }
  }
  d = d.split(':');
  while (d[d.length - 1].length < 16) {
    d[d.length - 1] += '0';
  }
  for (var a = 0; a < d.length; a++) {
    d[a] = parseInt(d[a], 2);
    d[a] = d[a].toString(16);
  }
  return d.join(':');
  console.log(d);
}
function checkipv6(a) {
  return /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))\s*$/.test(
    a
  );
}
function formatipv6preferred(e) {
  let d;
  let b = 'Not a valid IPv6 Address';
  let c;
  let a;
  if (checkipv6(e)) {
    d = e.toLowerCase();
    c = d.split(':');
    trimcolonsfromends(c);
    fillemptysegment(c);
    stripleadingzeroes(c);
    removeconsecutivezeroes(c);
    b = assemblebestrepresentation(c);
  }
  return b;
}
function trimcolonsfromends(a) {
  const b = a.length;
  if (a[0] == '' && a[1] == '' && a[2] == '') {
    a.shift();
    a.shift();
  } else {
    if (a[0] == '' && a[1] == '') {
      a.shift();
    } else {
      if (a[b - 1] == '' && a[b - 2] == '') {
        a.pop();
      }
    }
  }
}
function fillemptysegment(b) {
  let c;
  let a = 8;
  if (b[b.length - 1].indexOf('.') != -1) {
    a = 7;
  }
  for (c = 0; c < a; c++) {
    if (b[c] == '') {
      b[c] = '0';
      break;
    }
  }
  while (b.length < a) {
    b.splice(c, 0, '0');
  }
}
function stripleadingzeroes(a) {
  const b = a.length;
  let c;
  for (i = 0; i < b; i++) {
    segs = a[i].split('');
    for (j = 0; j < 3; j++) {
      if (segs[0] == '0' && segs.length > 1) {
        segs.splice(0, 1);
      } else {
        break;
      }
    }
    a[i] = segs.join('');
  }
}
function removeconsecutivezeroes(d) {
  let a = -1;
  let f = 0;
  let c = false;
  let b = 0;
  let g = -1;
  let e;
  for (e = 0; e < 8; e++) {
    if (c) {
      if (d[e] == '0') {
        b += 1;
      } else {
        c = false;
        if (b > f) {
          a = g;
          f = b;
        }
      }
    } else {
      if (d[e] == '0') {
        c = true;
        g = e;
        b = 1;
      }
    }
  }
  if (b > f) {
    a = g;
    f = b;
  }
  if (f > 1) {
    d.splice(a, f, '');
  }
}
function assemblebestrepresentation(c) {
  let a = '';
  const b = c.length;
  if (c[0] == '') {
    a = ':';
  }
  for (i = 0; i < b; i++) {
    a = a + c[i];
    if (i == b - 1) {
      break;
    }
    a = a + ':';
  }
  if (c[b - 1] == '') {
    a = a + ':';
  }
  return a;
}
function expand(k) {
  let a = '';
  let h = '';
  const e = 8;
  const b = 4;
  if (k.indexOf('::') == -1) {
    a = k;
  } else {
    const d = k.split('::');
    let g = 0;
    for (var f = 0; f < d.length; f++) {
      g += d[f].split(':').length;
    }
    a += d[0] + ':';
    for (var f = 0; f < e - g; f++) {
      a += '0000:';
    }
    a += d[1];
  }
  const c = a.split(':');
  for (var f = 0; f < e; f++) {
    while (c[f].length < b) {
      c[f] = '0' + c[f];
    }
    h += f != e - 1 ? c[f] + ':' : c[f];
  }
  return h;
}
