import { isDirectVideoFile } from '../../utils/video'

function EmptyState({ label }) {
  return (
    <p className="rounded-2xl border border-dashed border-charcoal/15 bg-white/70 px-4 py-8 text-center text-sm text-charcoal/55">
      Aún no hay {label.toLowerCase()} publicados en este submódulo.
    </p>
  )
}

function PdfItem({ item }) {
  return (
    <a
      href={item.file_url ?? '#'}
      target="_blank"
      rel="noreferrer"
      className="flex items-start gap-3 rounded-2xl border border-charcoal/10 bg-white p-4 transition-shadow hover:shadow-sm"
    >
      <span className="rounded-xl bg-terracotta/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-terracotta-dark">
        PDF
      </span>
      <div>
        <p className="font-medium text-charcoal">{item.title}</p>
        {item.body && <p className="mt-1 text-sm text-charcoal/65">{item.body}</p>}
      </div>
    </a>
  )
}

function VideoItem({ item }) {
  const directVideo = isDirectVideoFile(item.file_url)

  return (
    <article className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
      {item.file_url ? (
        <div className="aspect-video bg-charcoal/5">
          {directVideo ? (
            <video
              src={item.file_url}
              controls
              className="h-full w-full"
              title={item.title}
            />
          ) : (
            <iframe
              src={item.file_url}
              title={item.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-charcoal/5 text-sm text-charcoal/50">
          Video próximamente
        </div>
      )}
      <div className="p-4">
        <p className="font-medium text-charcoal">{item.title}</p>
        {item.body && <p className="mt-1 text-sm text-charcoal/65">{item.body}</p>}
      </div>
    </article>
  )
}

function ContentBlock({ title, items, emptyLabel, renderItem }) {
  return (
    <section>
      <h3 className="mb-4 font-serif text-2xl font-semibold text-charcoal">{title}</h3>
      {items.length === 0 ? (
        <EmptyState label={emptyLabel} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">{items.map(renderItem)}</div>
      )}
    </section>
  )
}

export function SubmoduleContentPanel({ contents }) {
  const pdfs = contents.filter((item) => item.type === 'pdf')
  const videos = contents.filter((item) => item.type === 'video')

  return (
    <div className="space-y-10 rounded-b-3xl rounded-tr-3xl border border-charcoal/10 bg-white/80 p-5 sm:p-8">
      <ContentBlock
        title="PDF"
        items={pdfs}
        emptyLabel="PDFs"
        renderItem={(item) => <PdfItem key={item.id} item={item} />}
      />
      <ContentBlock
        title="VIDEOS"
        items={videos}
        emptyLabel="videos"
        renderItem={(item) => <VideoItem key={item.id} item={item} />}
      />
    </div>
  )
}
