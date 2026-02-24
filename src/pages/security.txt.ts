import type { APIRoute } from "astro";

const getSecurityTxt = () => `Contact: mailto:contact@satnaing.dev
Expires: 2025-12-31T23:59:59.000Z
Encryption: https://keys.openpgp.org/vks/v1/by-fingerprint/ABC123DEF456
Preferred-Languages: en
Policy: https://github.com/satnaing/astro-paper/security
Canonical: https://astro-paper.pages.dev/.well-known/security.txt
`;

export const GET: APIRoute = () => {
  return new Response(getSecurityTxt(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
