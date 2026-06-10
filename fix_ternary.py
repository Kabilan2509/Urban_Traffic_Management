fname = r'frontend/src/app/TnTrafficPortal.jsx'
with open(fname, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix broken ternary: ? operator was replaced with :
old1 = '{canEditTiming\n                  : `'
new1 = '{canEditTiming\n                  ? `'
c1 = text.count(old1)
text = text.replace(old1, new1)

# Fix false-branch icon (still garbled)
old2 = ': "? Adaptive cycle guardrails'
new2 = ': "\u2139\ufe0f Adaptive cycle guardrails'
c2 = text.count(old2)
text = text.replace(old2, new2)

print(f'Ternary fix: {c1}x | False-branch icon: {c2}x')

with open(fname, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)
print('Saved.')
