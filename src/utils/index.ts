export function GetParam(name: string, search?: string) {
  const reg = new RegExp(`(^|&|\\?)${name}=([^&]+)(&|$)`);
  const r = decodeURIComponent(search || window.location.search).match(reg);
  if (r !== null) return r[2];
}
