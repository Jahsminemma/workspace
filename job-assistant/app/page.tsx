import { Card, CardText, CardTitle } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <SectionHeader title="Job Assistant" subtitle="Personal low-cost assistant for job discovery, resume tailoring, and guided applications." />
      <Card>
        <CardTitle>What this MVP does</CardTitle>
        <ul className="mt-4 grid gap-2 text-sm text-slate-700">
          <li>• Candidate profile and asset bank</li>
          <li>• Jobs queue and tailored draft generation</li>
          <li>• Local worker trigger for autofill</li>
          <li>• Human-in-the-loop review before applying</li>
        </ul>
        <CardText>
          Keep iterating on profile assets and review drafts before triggering the worker.
        </CardText>
      </Card>
    </main>
  );
}
