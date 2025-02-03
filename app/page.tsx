"use client";

import MailingForm from './components/MailingForm';
import MailingsList from './components/MailingsList';
import { Providers } from './providers';

export default function Page() {
  return (
    <Providers>
      <main className="container mx-auto p-4 max-w-xl">
  
        <div className="space-y-8">
          <MailingForm />
          <MailingsList />
        </div>
      </main>
    </Providers>
  );
}
