# Security Policy

## Supported Versions

Security fixes are applied to the most recent minor release line on `master`.
Older majors are best-effort only; please upgrade to receive patches.

| Version | Supported |
| ------- | --------- |
| 2.x     | ✅        |
| < 2.0   | ❌        |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security reports.** They are
indexed by search engines as soon as they appear, which often defeats the
point of responsible disclosure.

Instead, use one of the following private channels:

- GitHub's [Private Vulnerability Reporting](https://github.com/santoshshinde2012/node-boilerplate/security/advisories/new) (preferred).
- Email the maintainer at the address listed on the
  [GitHub profile](https://github.com/santoshshinde2012).

When you report, please include:

1. A description of the vulnerability and its impact.
2. Steps to reproduce, ideally a minimal proof of concept.
3. The affected version, environment and config.
4. Whether you have a suggested fix.

### What to expect

| Stage              | Target SLA                                    |
| ------------------ | --------------------------------------------- |
| Acknowledgement    | within 48 hours of receipt                    |
| Initial assessment | within 5 working days                         |
| Fix or mitigation  | proportional to severity (CVSS-driven)        |
| Public disclosure  | coordinated with the reporter; default 90 days |

We will credit reporters in the release notes unless you ask to remain
anonymous.

## Hardening reference

This boilerplate ships with the controls listed in
[`wiki/instructions.md`](wiki/instructions.md#2-production-security-checklist).
If you find one of those controls is not actually enforced in code, that is a
security bug — please report it via the channels above.
