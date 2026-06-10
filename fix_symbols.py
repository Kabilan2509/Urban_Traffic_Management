#!/usr/bin/env python3
# fix_symbols.py — fixes all garbled double-encoded UTF-8 chars in TnTrafficPortal.jsx

import sys

fname = r'frontend/src/app/TnTrafficPortal.jsx'

# Read the raw bytes
with open(fname, 'rb') as f:
    raw = f.read()

# Strip BOM if present
if raw[:3] == b'\xef\xbb\xbf':
    raw = raw[3:]

# Normalize line endings to LF
raw = raw.replace(b'\r\n', b'\n').replace(b'\r', b'\n')

# Decode as latin-1 so every byte becomes a code point
# (this is how double-encoded UTF-8 appears — each byte is a separate char)
text_latin1 = raw.decode('latin-1')

# Now fix every double-encoded sequence:
# The garbled chars are UTF-8 byte sequences stored as latin-1 codepoints.
# We replace them with the correct unicode characters.

def u(codepoint):
    return chr(codepoint)

# Map: (latin-1 encoded garbled string) -> correct unicode string
# Garbled sequences are the UTF-8 bytes read as latin-1 chars
FIXES = [
    # em-dash  (E2 80 94)
    ('\xe2\x80\x94', u(0x2014)),
    # right single quote (E2 80 99)
    ('\xe2\x80\x99', u(0x2019)),
    # left single quote (E2 80 98)
    ('\xe2\x80\x98', u(0x2018)),
    # left double quote (E2 80 9C)
    ('\xe2\x80\x9c', u(0x201c)),
    # right double quote (E2 80 9D)
    ('\xe2\x80\x9d', u(0x201d)),
    # ⬡ U+2B21 (E2 AC A1)
    ('\xe2\xac\xa1', u(0x2b21)),
    # ◈ U+25C8 (E2 97 88)
    ('\xe2\x97\x88', u(0x25c8)),
    # ◉ U+25C9 (E2 97 89)
    ('\xe2\x97\x89', u(0x25c9)),
    # ⬠ U+2B20 (E2 AC A0)
    ('\xe2\xac\xa0', u(0x2b20)),
    # ☁ U+2601 (E2 98 81)
    ('\xe2\x98\x81', u(0x2601)),
    # ⚠ U+26A0 (E2 9A A0)
    ('\xe2\x9a\xa0', u(0x26a0)),
    # ▦ U+25A6 (E2 96 A6)
    ('\xe2\x96\xa6', u(0x25a6)),
    # ♡ U+2661 (E2 99 A1)
    ('\xe2\x99\xa1', u(0x2661)),
    # ◎ U+25CE (E2 97 8E)
    ('\xe2\x97\x8e', u(0x25ce)),
    # ◌ U+25CC (E2 97 8C)
    ('\xe2\x97\x8c', u(0x25cc)),
    # ≡ U+2261 (E2 89 A1)
    ('\xe2\x89\xa1', u(0x2261)),
    # ● U+25CF (E2 97 8F)
    ('\xe2\x97\x8f', u(0x25cf)),
    # → U+2192 (E2 86 92)
    ('\xe2\x86\x92', u(0x2192)),
    # ← U+2190 (E2 86 90)
    ('\xe2\x86\x90', u(0x2190)),
    # · U+00B7 (C2 B7)
    ('\xc2\xb7', u(0x00b7)),
    # ° U+00B0 (C2 B0)
    ('\xc2\xb0', u(0x00b0)),
    # © U+00A9 (C2 A9)
    ('\xc2\xa9', u(0x00a9)),
    # ⏱ U+23F1 (E2 8F B1)
    ('\xe2\x8f\xb1', u(0x23f1)),
    # ⚙ U+2699 (E2 9A 99)
    ('\xe2\x9a\x99', u(0x2699)),
    # ≥ U+2265 (E2 89 A5)
    ('\xe2\x89\xa5', u(0x2265)),
    # ≤ U+2264 (E2 89 A4)
    ('\xe2\x89\xa4', u(0x2264)),
    # • bullet U+2022 (E2 80 A2)
    ('\xe2\x80\xa2', u(0x2022)),
    # … ellipsis U+2026 (E2 80 A6)
    ('\xe2\x80\xa6', u(0x2026)),
    # ½ U+00BD (C2 BD)
    ('\xc2\xbd', u(0x00bd)),
    # ¼ U+00BC (C2 BC)
    ('\xc2\xbc', u(0x00bc)),
    # ¾ U+00BE (C2 BE)
    ('\xc2\xbe', u(0x00be)),
    # non-breaking space U+00A0 (C2 A0) - keep as regular space
    ('\xc2\xa0', ' '),
    # 🔴 U+1F534 (F0 9F 94 B4)
    ('\xf0\x9f\x94\xb4', '\U0001f534'),
    # 🧠 U+1F9E0 (F0 9F A7 A0)
    ('\xf0\x9f\xa7\xa0', '\U0001f9e0'),
    # 🟦 U+1F7E6 (F0 9F 9F A6)
    ('\xf0\x9f\x9f\xa6', '\U0001f7e6'),
    # 🗺 U+1F5FA (F0 9F 97 BA)
    ('\xf0\x9f\x97\xba', '\U0001f5fa'),
    # 🔔 U+1F514 (F0 9F 94 94)
    ('\xf0\x9f\x94\x94', '\U0001f514'),
    # 🛡 U+1F6E1 (F0 9F 9B A1)
    ('\xf0\x9f\x9b\xa1', '\U0001f6e1'),
    # 🔴 variant already done
    # variation selector U+FE0F (EF B8 8F)
    ('\xef\xb8\x8f', u(0xfe0f)),
    # zero-width joiner U+200D (E2 80 8D)
    ('\xe2\x80\x8d', u(0x200d)),
    # ™ U+2122 (E2 84 A2)
    ('\xe2\x84\xa2', u(0x2122)),
    # ← U+2190 already done
    # ↑ U+2191 (E2 86 91)
    ('\xe2\x86\x91', u(0x2191)),
    # ↓ U+2193 (E2 86 93)
    ('\xe2\x86\x93', u(0x2193)),
    # ✓ U+2713 (E2 9C 93)
    ('\xe2\x9c\x93', u(0x2713)),
    # ✕ U+2715 (E2 9C 95)
    ('\xe2\x9c\x95', u(0x2715)),
    # ★ U+2605 (E2 98 85)
    ('\xe2\x98\x85', u(0x2605)),
    # ☆ U+2606 (E2 98 86)
    ('\xe2\x98\x86', u(0x2606)),
    # 🚨 U+1F6A8 (F0 9F 9A A8)
    ('\xf0\x9f\x9a\xa8', '\U0001f6a8'),
    # 🛡️ already done
]

text = text_latin1
total = 0
for garbled, correct in FIXES:
    count = text.count(garbled)
    if count > 0:
        text = text.replace(garbled, correct)
        print(f'Fixed {count}x U+{ord(correct[0]):04X} ({correct[0]})')
        total += count

print(f'\nTotal replacements: {total}')
print(f'Length before: {len(text_latin1)}, after: {len(text)}')

# Write back as UTF-8 without BOM, LF line endings
with open(fname, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print('File saved successfully.')
