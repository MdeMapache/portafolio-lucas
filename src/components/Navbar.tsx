export default function Navbar() {
  return (
    <nav className="relative z-10 flex items-center justify-between px-8 py-3.5 bg-black/40 border-b border-white/5 backdrop-blur-sm">
      <div className="flex items-center gap-9">
        <div className="flex items-center gap-2 font-display text-lg tracking-wider text-steam-bright">
          <span className="w-2.5 h-2.5 bg-steam-green rounded-sm shadow-[0_0_8px_#a4d007]" />
          MAPACHE.DEV
        </div>
        <div className="hidden md:flex gap-6 font-display text-[13px] tracking-wide">
          <a href="#" className="text-steam-bright">PERFIL</a>
          <a href="#proyectos" className="text-steam-dim hover:text-steam-bright">PROYECTOS</a>
          <a href="#skills" className="text-steam-dim hover:text-steam-bright">HABILIDADES</a>
          <a href="#contacto" className="text-steam-dim hover:text-steam-bright">CONTACTO</a>
        </div>
      </div>
      <div className="flex items-center gap-2.5 text-[13px]">
        <span className="hidden sm:inline text-steam-dim">Disponible para trabajar</span>
        <span className="w-2 h-2 rounded-full bg-steam-green shadow-[0_0_6px_#a4d007]" />
        <div className="w-[30px] h-[30px] border border-steam-line bg-gradient-to-br from-red-500 to-pink-500" />
      </div>
    </nav>
  );
}
