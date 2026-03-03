/**
 * Luo Protocol Handler
 * Manages luo:// protocol URL parsing and routing
 */

interface LuoURL {
  protocol: string;
  host: string;
  path: string;
  query: Record<string, string>;
  fragment: string;
}

class LuoProtocolHandler {
  /**
   * Parse a luo:// URL into components
   */
  static parseLuoURL(url: string): LuoURL {
    const luoRegex = /^luo:\/\/([^/?#]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/;
    const match = url.match(luoRegex);

    if (!match) {
      throw new Error(`Invalid luo:// URL: ${url}`);
    }

    const [, host, path = '/', queryString = '', fragment = ''] = match;
    const query = this.parseQueryString(queryString);

    return {
      protocol: 'luo',
      host,
      path,
      query,
      fragment
    };
  }

  /**
   * Parse query string into key-value pairs
   */
  private static parseQueryString(queryString: string): Record<string, string> {
    const query: Record<string, string> = {};
    if (!queryString) return query;

    const params = queryString.substring(1).split('&');
    params.forEach(param => {
      const [key, value] = param.split('=');
      query[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });

    return query;
  }

  /**
   * Validate if URL is a valid luo:// protocol URL
   */
  static isLuoURL(url: string): boolean {
    return /^luo:\/\//.test(url);
  }

  /**
   * Convert a luo:// URL to its HTTP equivalent for internal processing
   */
  static toHTTP(luoURL: string): string {
    const parsed = this.parseLuoURL(luoURL);
    const queryString = Object.entries(parsed.query)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    
    return `https://${parsed.host}${parsed.path}${queryString ? '?' + queryString : ''}${parsed.fragment}`;
  }
}

export { LuoProtocolHandler, LuoURL };