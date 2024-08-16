export const metadata = {
  title: 'AnnoFeed',
  description: 'Get your true feedback from annonymous people',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
