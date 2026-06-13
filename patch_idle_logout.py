"""
patch_idle_logout.py
Inserts idle-logout CSS + IdleLogoutManager component + wires into App.
Run from: Traffix_Traffic_Controller folder
"""
fname = r'frontend/src/app/TnTrafficPortal.jsx'
with open(fname, 'r', encoding='utf-8') as f:
    text = f.read()

# ── 1. Fix missing closing backtick + add idle CSS ────────────────────
IDLE_CSS = r"""
@media(max-width:576px){
  .main-area{padding-bottom:calc(60px + env(safe-area-inset-bottom,0px));}
  .mob-nav-item{font-size:7px;}
  .mob-nav-ico{font-size:15px;}
}

/* ---- IDLE LOGOUT OVERLAY ---- */
.idle-overlay{
  position:fixed;inset:0;z-index:9999;
  background:rgba(6,10,16,0.82);
  backdrop-filter:blur(6px);
  display:flex;align-items:center;justify-content:center;
  animation:fadeInOverlay .25s ease;
}
@keyframes fadeInOverlay{from{opacity:0}to{opacity:1}}
.idle-modal{
  background:var(--bg1);
  border:1.5px solid rgba(176,48,48,0.7);
  border-radius:12px;
  padding:36px 32px 28px;
  max-width:380px;width:calc(100% - 32px);
  text-align:center;
  box-shadow:0 24px 64px rgba(176,48,48,0.30),0 0 0 1px rgba(176,48,48,0.12);
  animation:slideUpModal .28s cubic-bezier(.22,1,.36,1);
}
@keyframes slideUpModal{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
.idle-icon{
  width:60px;height:60px;border-radius:50%;
  background:rgba(176,48,48,0.10);
  border:2px solid rgba(176,48,48,0.30);
  display:flex;align-items:center;justify-content:center;
  font-size:28px;margin:0 auto 18px;
  animation:idlePulse 1.4s ease-in-out infinite;
}
@keyframes idlePulse{
  0%,100%{box-shadow:0 0 0 0 rgba(176,48,48,0.38);}
  50%{box-shadow:0 0 0 12px rgba(176,48,48,0);}
}
.idle-title{
  font-family:var(--mono);font-size:10px;font-weight:700;
  letter-spacing:.14em;text-transform:uppercase;
  color:var(--red);margin-bottom:10px;
}
.idle-msg{
  font-size:15px;font-weight:600;color:var(--text0);
  line-height:1.5;margin-bottom:4px;
}
.idle-sub{
  font-size:11px;color:var(--text3);margin-bottom:18px;
  font-family:var(--mono);letter-spacing:.04em;
}
.idle-countdown{
  font-family:var(--mono);font-size:52px;font-weight:800;
  color:var(--red);letter-spacing:.02em;
  margin-bottom:6px;line-height:1;
  transition:color .4s;
}
.idle-countdown.warn{color:var(--amber);}
.idle-bar-track{
  width:100%;height:7px;background:var(--bg3);
  border-radius:4px;overflow:hidden;margin-bottom:24px;
}
.idle-bar-fill{
  height:100%;border-radius:4px;
  background:linear-gradient(90deg,#B03030,#ff6060);
  transition:width 1s linear,background .6s;
}
.idle-bar-fill.warn{background:linear-gradient(90deg,var(--amber),#ffd166);}
.idle-actions{display:flex;gap:10px;justify-content:center;}
.idle-btn-stay{
  flex:1;padding:12px 16px;
  background:var(--primary);border:none;border-radius:7px;
  font-family:var(--mono);font-size:11px;font-weight:700;
  letter-spacing:.09em;text-transform:uppercase;
  color:#fff;cursor:pointer;
  transition:opacity .15s,transform .1s;
  box-shadow:0 4px 16px rgba(0,119,204,0.3);
}
.idle-btn-stay:hover{opacity:.88;transform:translateY(-1px);}
.idle-btn-stay:active{transform:translateY(0);}
.idle-btn-logout{
  flex:1;padding:12px 16px;
  background:transparent;
  border:1.5px solid rgba(176,48,48,0.4);
  border-radius:7px;
  font-family:var(--mono);font-size:11px;font-weight:700;
  letter-spacing:.09em;text-transform:uppercase;
  color:var(--red);cursor:pointer;
  transition:background .15s,transform .1s;
}
.idle-btn-logout:hover{background:rgba(176,48,48,0.08);transform:translateY(-1px);}
.idle-btn-logout:active{transform:translateY(0);}
`;
"""

STYLES_ANCHOR = '.mob-bottom-nav-inner{\n  display:flex;height:100%;align-items:stretch;\n}'

# The STYLES template literal lost its closing backtick + semicolon.
# We find the broken end and fix it.
old_broken = '@media(max-width:900px){\n  .mob-bottom-nav{display:flex;flex-direction:column;justify-content:flex-end;}\n  .main-area{padding-bottom:60px;}\n}\n\n\n/* --------------------------------------------------------------\n   STATIC DATA\n'
new_fixed  = (
    '@media(max-width:900px){\n'
    '  .mob-bottom-nav{display:flex;flex-direction:column;justify-content:flex-end;}\n'
    '  .main-area{padding-bottom:60px;}\n'
    '}\n'
    '@media(max-width:576px){\n'
    '  .main-area{padding-bottom:calc(60px + env(safe-area-inset-bottom,0px));}\n'
    '  .mob-nav-item{font-size:7px;}\n'
    '  .mob-nav-ico{font-size:15px;}\n'
    '}\n'
    '\n'
    '/* ---- IDLE LOGOUT OVERLAY ---- */\n'
    '.idle-overlay{\n'
    '  position:fixed;inset:0;z-index:9999;\n'
    '  background:rgba(6,10,16,0.82);\n'
    '  backdrop-filter:blur(6px);\n'
    '  display:flex;align-items:center;justify-content:center;\n'
    '  animation:fadeInOverlay .25s ease;\n'
    '}\n'
    '@keyframes fadeInOverlay{from{opacity:0}to{opacity:1}}\n'
    '.idle-modal{\n'
    '  background:var(--bg1);\n'
    '  border:1.5px solid rgba(176,48,48,0.7);\n'
    '  border-radius:12px;\n'
    '  padding:36px 32px 28px;\n'
    '  max-width:380px;width:calc(100% - 32px);\n'
    '  text-align:center;\n'
    '  box-shadow:0 24px 64px rgba(176,48,48,0.30),0 0 0 1px rgba(176,48,48,0.12);\n'
    '  animation:slideUpModal .28s cubic-bezier(.22,1,.36,1);\n'
    '}\n'
    '@keyframes slideUpModal{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}\n'
    '.idle-icon{\n'
    '  width:60px;height:60px;border-radius:50%;\n'
    '  background:rgba(176,48,48,0.10);\n'
    '  border:2px solid rgba(176,48,48,0.30);\n'
    '  display:flex;align-items:center;justify-content:center;\n'
    '  font-size:28px;margin:0 auto 18px;\n'
    '  animation:idlePulse 1.4s ease-in-out infinite;\n'
    '}\n'
    '@keyframes idlePulse{\n'
    '  0%,100%{box-shadow:0 0 0 0 rgba(176,48,48,0.38);}\n'
    '  50%{box-shadow:0 0 0 12px rgba(176,48,48,0);}\n'
    '}\n'
    '.idle-title{\n'
    '  font-family:var(--mono);font-size:10px;font-weight:700;\n'
    '  letter-spacing:.14em;text-transform:uppercase;\n'
    '  color:var(--red);margin-bottom:10px;\n'
    '}\n'
    '.idle-msg{\n'
    '  font-size:15px;font-weight:600;color:var(--text0);\n'
    '  line-height:1.5;margin-bottom:4px;\n'
    '}\n'
    '.idle-sub{\n'
    '  font-size:11px;color:var(--text3);margin-bottom:18px;\n'
    '  font-family:var(--mono);letter-spacing:.04em;\n'
    '}\n'
    '.idle-countdown{\n'
    '  font-family:var(--mono);font-size:52px;font-weight:800;\n'
    '  color:var(--red);letter-spacing:.02em;\n'
    '  margin-bottom:6px;line-height:1;\n'
    '  transition:color .4s;\n'
    '}\n'
    '.idle-countdown.warn{color:var(--amber);}\n'
    '.idle-bar-track{\n'
    '  width:100%;height:7px;background:var(--bg3);\n'
    '  border-radius:4px;overflow:hidden;margin-bottom:24px;\n'
    '}\n'
    '.idle-bar-fill{\n'
    '  height:100%;border-radius:4px;\n'
    '  background:linear-gradient(90deg,#B03030,#ff6060);\n'
    '  transition:width 1s linear,background .6s;\n'
    '}\n'
    '.idle-bar-fill.warn{background:linear-gradient(90deg,var(--amber),#ffd166);}\n'
    '.idle-actions{display:flex;gap:10px;justify-content:center;}\n'
    '.idle-btn-stay{\n'
    '  flex:1;padding:12px 16px;\n'
    '  background:var(--primary);border:none;border-radius:7px;\n'
    '  font-family:var(--mono);font-size:11px;font-weight:700;\n'
    '  letter-spacing:.09em;text-transform:uppercase;\n'
    '  color:#fff;cursor:pointer;\n'
    '  transition:opacity .15s,transform .1s;\n'
    '  box-shadow:0 4px 16px rgba(0,119,204,0.3);\n'
    '}\n'
    '.idle-btn-stay:hover{opacity:.88;transform:translateY(-1px);}\n'
    '.idle-btn-stay:active{transform:translateY(0);}\n'
    '.idle-btn-logout{\n'
    '  flex:1;padding:12px 16px;\n'
    '  background:transparent;\n'
    '  border:1.5px solid rgba(176,48,48,0.4);\n'
    '  border-radius:7px;\n'
    '  font-family:var(--mono);font-size:11px;font-weight:700;\n'
    '  letter-spacing:.09em;text-transform:uppercase;\n'
    '  color:var(--red);cursor:pointer;\n'
    '  transition:background .15s,transform .1s;\n'
    '}\n'
    '.idle-btn-logout:hover{background:rgba(176,48,48,0.08);transform:translateY(-1px);}\n'
    '.idle-btn-logout:active{transform:translateY(0);}\n'
    '`;\n'
    '\n'
    '/* --------------------------------------------------------------\n'
    '   STATIC DATA\n'
)

found = text.count(old_broken)
print(f'Broken STYLES end found: {found}x')
text = text.replace(old_broken, new_fixed, 1)

# ── 2. Add IdleLogoutManager component just before "export default function App" ─
IDLE_COMPONENT = '''
/* ---------------------------------------------------------------
   IDLE AUTO-LOGOUT  (2 min 30 s idle = 150 s, 30 s warning)
--------------------------------------------------------------- */
const IDLE_TIMEOUT   = 150; // seconds before auto-logout
const WARN_THRESHOLD = 30;  // seconds before logout to show warning

function IdleLogoutManager({ onLogout }) {
  const [countdown, setCountdown] = useState(IDLE_TIMEOUT);
  const [showWarn,  setShowWarn]  = useState(false);
  const idleRef   = useRef(null);
  const warnRef   = useRef(null);
  const countRef  = useRef(null);

  const clearAllTimers = useCallback(() => {
    clearTimeout(idleRef.current);
    clearTimeout(warnRef.current);
    clearInterval(countRef.current);
  }, []);

  const startCountdown = useCallback(() => {
    setCountdown(WARN_THRESHOLD);
    countRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const resetTimer = useCallback(() => {
    clearAllTimers();
    setShowWarn(false);
    setCountdown(IDLE_TIMEOUT);
    // Schedule warning
    warnRef.current = setTimeout(() => {
      setShowWarn(true);
      startCountdown();
    }, (IDLE_TIMEOUT - WARN_THRESHOLD) * 1000);
    // Schedule auto-logout
    idleRef.current = setTimeout(() => {
      onLogout();
    }, IDLE_TIMEOUT * 1000);
  }, [clearAllTimers, startCountdown, onLogout]);

  // Start on mount, restart on user activity
  useEffect(() => {
    resetTimer();
    const EVENTS = ['mousemove','mousedown','keydown','scroll','touchstart','touchmove','click','wheel'];
    const handle = () => resetTimer();
    EVENTS.forEach(e => window.addEventListener(e, handle, { passive: true }));
    return () => {
      clearAllTimers();
      EVENTS.forEach(e => window.removeEventListener(e, handle));
    };
  }, [resetTimer, clearAllTimers]);

  // Auto-logout when countdown hits 0
  useEffect(() => {
    if (countdown === 0 && showWarn) onLogout();
  }, [countdown, showWarn, onLogout]);

  if (!showWarn) return null;

  const pct = Math.round((countdown / WARN_THRESHOLD) * 100);
  const isWarn = countdown > 10;
  const mm = String(Math.floor(countdown / 60)).padStart(2, '0');
  const ss = String(countdown % 60).padStart(2, '0');

  return (
    <div className="idle-overlay" role="alertdialog" aria-modal="true" aria-labelledby="idle-title">
      <div className="idle-modal">
        <div className="idle-icon">\u23F0</div>
        <div className="idle-title" id="idle-title">Session Timeout Warning</div>
        <div className="idle-msg">Your session is about to expire</div>
        <div className="idle-sub">No activity detected &mdash; auto logout in</div>
        <div className={`idle-countdown${isWarn ? ' warn' : ''}`}>
          {mm}:{ss}
        </div>
        <div className="idle-bar-track">
          <div
            className={`idle-bar-fill${isWarn ? ' warn' : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="idle-actions">
          <button
            className="idle-btn-stay"
            onClick={resetTimer}
            autoFocus
          >
            \u2713 Stay Logged In
          </button>
          <button
            className="idle-btn-logout"
            onClick={onLogout}
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
}

'''

BEFORE_APP = 'export default function App(){'
found2 = text.count(BEFORE_APP)
print(f'"export default function App" found: {found2}x')
text = text.replace(BEFORE_APP, IDLE_COMPONENT + BEFORE_APP, 1)

# ── 3. Wire IdleLogoutManager into App return JSX ────────────────────
# Add <IdleLogoutManager onLogout={logout}/> just before </> closing
OLD_SHELL = '''  return(
    <>
      <style dangerouslySetInnerHTML={{__html:STYLES}}/>
      <ToastStack toasts={toasts} onDismiss={dismissToast}/>
      {!user?(
        <Login onLogin={login}/>
      ):('''

NEW_SHELL = '''  return(
    <>
      <style dangerouslySetInnerHTML={{__html:STYLES}}/>
      <ToastStack toasts={toasts} onDismiss={dismissToast}/>
      {user&&<IdleLogoutManager onLogout={logout}/>}
      {!user?(
        <Login onLogin={login}/>
      ):('''

found3 = text.count(OLD_SHELL)
print(f'App return shell found: {found3}x')
text = text.replace(OLD_SHELL, NEW_SHELL, 1)

with open(fname, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print('All patches applied. File saved.')
