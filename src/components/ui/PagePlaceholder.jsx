export function PagePlaceholder({ title, description }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-serif text-4xl font-semibold text-charcoal">{title}</h1>
      <p className="mt-4 text-base leading-relaxed text-charcoal/75">{description}</p>
    </section>
  )
}
