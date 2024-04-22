import { isProduction } from "./isProduction"

/**
 * This helper function returns the current domain of the API.
 * If the environment is production, the production App Engine URL will be returned.
 * Otherwise, the link localhost:8080 will be returned (Spring server default port).
 * @returns {string}
 */
export const getDomain = () => {
  const prodUrl = "https://sopra-fs24-group-33-server.oa.r.appspot.com/"
  const devUrl = "http://localhost:8080"

  return isProduction() ? prodUrl : devUrl
}

export const getWSPreFix = () => {
  const prodUrl = "https://sopra-fs24-group-33-server.oa.r.appspot.com";
  const devUrl = "http://localhost:8080";
  const isProd = isProduction();

  const url = isProd ? prodUrl : devUrl;
  const parsedUrl = new URL(url);

  // Use wss:// if the original URL is https, otherwise use ws://
  const protocol = parsedUrl.protocol === 'https:' ? 'wss://' : 'ws://';
  return `${protocol}${parsedUrl.hostname}${parsedUrl.port ? ':' + parsedUrl.port : ''}/ws`;
};

