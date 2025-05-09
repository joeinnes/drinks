export function Header() {
  return (
    <main className="flex items-center justify-center pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header>
          <div className="flex items-center justify-center gap-2">
            <img src="/beer_logo.svg" alt="Drinks" className="size-16" />
            <h1 className="text-6xl font-bold">Drinks</h1>
          </div>
        </header>
      </div>
    </main>
  );
}
