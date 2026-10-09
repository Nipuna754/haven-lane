"""WCAG 2.x contrast checker for the Haven Lane palette.

Usage: python3 -I scripts/contrast.py   (Windows: py -I scripts\\contrast.py)
Prints each text/background pair with its ratio and PASS/FAIL against its target
(4.5 for normal text, 3.0 for large text and UI boundaries).
"""

PALETTE = {
    "navy": "#17365F",
    "navy-hover": "#10284A",
    "sky": "#F3F7FB",
    "sky-deep": "#DCEBFA",
    "white": "#FFFFFF",
    "ink": "#142034",
    "muted": "#536075",
    "rule": "#D3DEEA",
    "coral": "#D9643C",
    "coral-dark": "#B0452A",
    "coral-dark-hover": "#923820",
    "ice": "#E4EEF8",
    "peach": "#FCEAE3",
    "on-navy": "#C9D7EA",
    "on-navy-soft": "#B3C5DD",
    "input-border": "#7F8EA3",
    "error": "#A3352B",
    "error-bg": "#FBEFED",
}

PAIRS = [
    ("ink", "sky", 4.5, "body text on page"),
    ("ink", "white", 4.5, "body text on cards"),
    ("ink", "sky-deep", 4.5, "hero headline on light blue"),
    ("muted", "sky", 4.5, "secondary text on page"),
    ("muted", "white", 4.5, "secondary text on cards"),
    ("muted", "sky-deep", 4.5, "hero text on light blue"),
    ("navy", "white", 4.5, "badge, secondary button, links"),
    ("navy", "ice", 4.5, "badge on ice, selected chips"),
    ("white", "navy", 4.5, "primary button text"),
    ("white", "navy-hover", 4.5, "primary button hover"),
    ("white", "coral-dark", 4.5, "accent button text"),
    ("white", "coral-dark-hover", 4.5, "accent button hover"),
    ("coral-dark", "white", 4.5, "small accent text on cards"),
    ("coral-dark", "sky", 4.5, "small accent text on page"),
    ("coral-dark", "sky-deep", 4.5, "small accent text on light blue"),
    ("coral-dark", "peach", 3.0, "check icon on peach circle"),
    ("coral", "white", 3.0, "coral icons and underline (graphics only)"),
    ("on-navy", "navy", 4.5, "footer text"),
    ("on-navy-soft", "navy", 4.5, "footer small print"),
    ("sky", "navy", 4.5, "footer headings"),
    ("navy", "sky", 3.0, "focus ring against page"),
    ("navy", "sky-deep", 3.0, "focus ring against light blue"),
    ("input-border", "white", 3.0, "form field edges"),
    ("error", "white", 4.5, "field error messages"),
    ("error", "error-bg", 4.5, "error summary"),
]


def luminance(hex_code: str) -> float:
    h = hex_code.lstrip("#")
    channels = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def ratio(a: str, b: str) -> float:
    la, lb = luminance(a), luminance(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


if __name__ == "__main__":
    failures = 0
    for fg, bg, target, what in PAIRS:
        r = ratio(PALETTE[fg], PALETTE[bg])
        ok = r >= target
        failures += not ok
        print(f"{'PASS' if ok else 'FAIL'}  {r:5.2f}:1  (needs {target})  {fg} on {bg}: {what}")
    print(f"\n{len(PAIRS) - failures}/{len(PAIRS)} pairs pass")
