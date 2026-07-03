const INSTITUTE_NAME = 'Instituto Tecnológico Universitario Rumiñahui'
const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-auto border-t border-charcoal/8 bg-charcoal text-cream">
      <div className="mx-auto max-w-5xl px-5 py-8 text-center sm:px-8">
        <p className="text-sm leading-relaxed text-cream/90 sm:text-base">
          Proyecto vinculación con la comunidad — {INSTITUTE_NAME}
        </p>
        <p className="mt-2 text-xs text-cream/65 sm:text-sm">
          © {CURRENT_YEAR} {INSTITUTE_NAME}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
