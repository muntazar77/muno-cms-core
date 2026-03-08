'use client'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type ShadcnExampleProps = {
  adminPath: string
  userEmail?: string
}

export function ShadcnExample({ adminPath, userEmail }: ShadcnExampleProps) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Card className="border-border/70 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <Badge variant="secondary">shadcn/ui</Badge>
            <Badge variant={userEmail ? 'default' : 'outline'}>
              {userEmail ? 'Authenticated' : 'Guest'}
            </Badge>
          </div>
          <CardTitle>Payload + Tailwind + shadcn is ready</CardTitle>
          <CardDescription>
            This is a live example component rendered from{' '}
            <code>src/components/shadcn-example.tsx</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Use this as a starting point for your frontend blocks and marketing pages.</p>
          {userEmail ? <p>Signed in as: {userEmail}</p> : <p>You are currently not signed in.</p>}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3">
          <Button render={<Link href={adminPath} />} variant="default">
            Open Payload Admin
          </Button>
          <Button
            render={<Link href="https://ui.shadcn.com/docs" target="_blank" />}
            variant="outline"
          >
            shadcn Docs
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
