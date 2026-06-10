#!/usr/bin/env python3
"""Round 2 - fix remaining garbled ? symbols"""
fname = r'frontend/src/app/TnTrafficPortal.jsx'

with open(fname, 'r', encoding='utf-8') as f:
    text = f.read()

FIXES = [
    # Dashboard close button
    ('>? CLOSE</button>}',              '>\u2715 CLOSE</button>}'),
    # Dashboard search icon
    ('pointerEvents:"none"}}>?</span>\n                <input\n                  placeholder="Search by ID',
     'pointerEvents:"none"}}>\U0001f50d</span>\n                <input\n                  placeholder="Search by ID'),

    # Map page h1
    ('<h1>? Live City Map</h1>',         '<h1>\u25c8 Live City Map</h1>'),
    # Map reset view
    ('>? Reset View</button>',          '>\u21ba Reset View</button>'),
    # Map error overlay
    ('>? MAP SERVICE UNAVAILABLE',      '>\u26a0 MAP SERVICE UNAVAILABLE'),
    # Map close button in detail panel
    ('<button className="btn btn-ghost btn-sm" onClick={clearHighlight}>?</button>',
     '<button className="btn btn-ghost btn-sm" onClick={clearHighlight}>\u2715</button>'),

    # Junction search icon
    ('pointerEvents:"none"}}>?</span>\n                <input\n                  className',
     'pointerEvents:"none"}}>\U0001f50d</span>\n                <input\n                  className'),
    # Junction clear search
    ('>? CLEAR</button>}',              '>\u2715 CLEAR</button>}'),
    # Junction info alerts
    ('className="alert alert-i">? Signals run',
     'className="alert alert-i">\u2139\ufe0f Signals run'),
    ('className="alert alert-e">? EMERGENCY OVERRIDE',
     'className="alert alert-e">\u26a0 EMERGENCY OVERRIDE'),
    ('className="alert alert-e">? DISASTER:',
     'className="alert alert-e">\U0001f534 DISASTER:'),
    ('className="alert alert-w">? ARTERIAL FLUSH:',
     'className="alert alert-w">\U0001f7e1 ARTERIAL FLUSH:'),
    # Junction cycle button
    ('>? CYCLE</button>',               '>\u21bb CYCLE</button>'),

    # LSTM search icon
    ('pointerEvents:"none"}}>?</span>\n                <input\n                  id="lstm',
     'pointerEvents:"none"}}>\U0001f50d</span>\n                <input\n                  id="lstm'),

    # Weather green checkmark
    ('color:"var(--green)",fontFamily:"var(--mono)",fontSize:10}}>?</span>',
     'color:"var(--green)",fontFamily:"var(--mono)",fontSize:10}}>\u2713</span>'),
    # Weather no hazards
    ('className="alert alert-ok">? No active weather hazards',
     'className="alert alert-ok">\u2705 No active weather hazards'),

    # Emergency page h1
    ('<h1 style={{color:"var(--red)"}}>? Emergency Operations</h1>',
     '<h1 style={{color:"var(--red)"}}>\u26a0\ufe0f Emergency Operations</h1>'),
    # Emergency info
    ('className="alert alert-i">? Green corridors now run',
     'className="alert alert-i">\u2139\ufe0f Green corridors now run'),

    # Audit log search icons (3 variants)
    ('pointerEvents:"none"}}>?</span>\n                  <input\n                  value={search}',
     'pointerEvents:"none"}}>\U0001f50d</span>\n                  <input\n                  value={search}'),
    # User search icon variant
    ('pointerEvents:"none"}}>?</span>\n                  <input\n                  id="user',
     'pointerEvents:"none"}}>\U0001f50d</span>\n                  <input\n                  id="user'),
    
    # Remaining ? in Map unavailable fallback
    ('\u26a0 MAP SERVICE UNAVAILABLE \ufffd Using static schematic',
     '\u26a0 MAP SERVICE UNAVAILABLE \u2014 Using static schematic'),
]

total = 0
for find, replace in FIXES:
    if find in text:
        n = text.count(find)
        text = text.replace(find, replace)
        total += n
        print(f'Fixed x{n}: {repr(find[:60])}')
    
print(f'\nTotal round-2: {total} replacements')

with open(fname, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)
print('Saved.')
