export function Disclaimer() {
  return (
    <footer className="px-1 py-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px flex-1 amber-rule" />
        <span className="font-nums text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
          Disclaimer
        </span>
        <div className="h-px flex-1 amber-rule" />
      </div>
      <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-sm mx-auto">
        This app does not calculate BAC with accuracy and must not be relied upon for any purpose. If
        you have concerns about your drinking, seek professional help.
      </p>
    </footer>
  );
}
