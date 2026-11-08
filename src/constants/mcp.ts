/**
 * Hosted docs MCP server (companion hosting issue #1535).
 *
 * `mcp/` is exposed over the MCP Streamable HTTP transport at this stable
 * production URL. Every one-click "Connect to …" action in the docs
 * page-actions menu points here — never at a local stdio server.
 */
import { SITE_URL } from "./site";

export const MCP_SERVER_NAME = "giganchor-docs";
export const MCP_SERVER_URL = `${SITE_URL}/api/mcp`;
